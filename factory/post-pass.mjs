#!/usr/bin/env node
// Post-pass enrichment, run on the GENERATED provider tree
// (provider-dev/openapi/src/gemini/v00.00.00000).
//
//   node factory/post-pass.mjs --provider-root DIR
//
// Steps:
//   1. every body-bearing method gets `config.requestBodyTranslate:
//      {algorithm: naive}` AND `request.mediaType: <the op's body content
//      key>` (generate only stamps the former, and only on post/put/patch -
//      the loader binds the body schema by exact content-key match, so a
//      missing request.mediaType silently unbinds required body fields).
//   2. `objectKey` on list envelopes: discovery lists wrap the rows in a
//      named array property (`$.models`, `$.tunedModels`, ...). Detected
//      structurally per response schema - a GET whose 200 envelope carries
//      `nextPageToken` plus EXACTLY ONE array-typed property (ignoring the
//      google.longrunning `unreachable` list) gets
//      `response.objectKey: $.<thatProperty>`. No hand list.
//   3. pagination on pageToken lists: every GET with a `pageToken` query
//      param and `nextPageToken` in the 200 envelope gets
//      `config.pagination: {requestToken: {key: pageToken, location: query},
//      responseToken: {key: $.nextPageToken, location: body}}`.
//      `nextPageToken` is absent/empty on the final page - the safe cursor
//      shape (wire-verified via the smoke mock's 2-page walk).
//   4. LIMIT pushdown: every method with a `pageSize` query param gets
//      `config.queryParamPushdown: {top: {paramName: pageSize[, maxValue]}}`
//      (maxValue only when the param schema declares a maximum - discovery
//      does not, so normally omitted). SQL LIMIT stays authoritative
//      client-side; this is a fetch optimisation.
//   5. EXEC-panic workaround (wire-verified against stackql v0.10.542,
//      still required at v0.10.559): EXEC prepare panics when the method's
//      resolved response schema has NO array-typed property, and fails
//      dispatch on bare-scalar responses. Stamp `response.schema_override`
//      -> a synthetic StackqlExecResult envelope on every exec-only method
//      matching either shape. Mechanical, no hand list.
//   6. re-dump every YAML with YAML 1.1 keyword quoting (stackql's Go YAML
//      parser is YAML 1.1: bare `y`/`yes`/`no`/`on`/`off` strings would
//      silently become booleans).

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}
const providerRoot = argOf('--provider-root');
if (!providerRoot) {
  console.error('usage: post-pass.mjs --provider-root <.../src/gemini/v00.00.00000>');
  process.exit(1);
}
const servicesDir = path.join(providerRoot, 'services');

function resolveOp(spec, opRef) {
  const parts = opRef.replace(/^#\/paths\//, '').split('/');
  const httpVerb = parts.pop();
  const pathKey = parts.join('/').replace(/~1/g, '/').replace(/~0/g, '~');
  return { op: ((spec.paths || {})[pathKey] || {})[httpVerb], httpVerb, pathKey };
}

function schemaOf(spec, maybeRef) {
  if (!maybeRef) return null;
  if (maybeRef.$ref) {
    const name = maybeRef.$ref.split('/').pop();
    return (spec.components?.schemas || {})[name] || null;
  }
  return maybeRef;
}

function dump(obj) {
  return YAML.stringify(obj, { lineWidth: 0, aliasDuplicateObjects: false, version: '1.1' });
}

const EXEC_ENVELOPE_NAME = 'StackqlExecResult';
const EXEC_ENVELOPE = {
  type: 'object',
  description: 'Synthetic dispatch-result envelope for EXEC-only methods (see post-pass step 5).',
  properties: {
    result: { type: 'string', description: 'Raw response payload.' },
    items: { type: 'array', items: { type: 'string' } },
  },
};

let bodyStamped = 0, objectKeys = 0, paginationStamped = 0, execOverrides = 0, pushdownStamped = 0;
for (const f of fs.readdirSync(servicesDir).filter((x) => /\.ya?ml$/.test(x))) {
  const p = path.join(servicesDir, f);
  const spec = YAML.parse(fs.readFileSync(p, 'utf8'));
  const resources = spec.components?.['x-stackQL-resources'] || {};

  for (const resource of Object.values(resources)) {
    const sqlVerbMethods = new Set(
      Object.values(resource.sqlVerbs || {}).flat().map((x) => x.$ref.split('/').pop())
    );
    for (const [mName, method] of Object.entries(resource.methods || {})) {
      if (!sqlVerbMethods.has(mName)) {
        // exec-only method - apply the panic workaround where needed
        const { op: execOp } = resolveOp(spec, method.operation.$ref);
        const content = execOp?.responses?.[method.response?.openAPIDocKey || '200']?.content || {};
        const ct = method.response?.mediaType && content[method.response.mediaType]
          ? method.response.mediaType : Object.keys(content)[0];
        const schema = schemaOf(spec, content[ct]?.schema);
        const hasArrayProp = !!schema && Object.values(schema.properties || {}).some(
          (prop) => prop && (prop.type === 'array' || (prop.$ref && schemaOf(spec, prop)?.type === 'array'))
        );
        const isBareScalar = !!schema && schema.type !== 'object' && !schema.properties;
        const noSchemaAtAll = !schema; // 204 No Content ops dispatch fine
        if (!noSchemaAtAll && !hasArrayProp) {
          spec.components.schemas = spec.components.schemas || {};
          spec.components.schemas[EXEC_ENVELOPE_NAME] = EXEC_ENVELOPE;
          method.response = method.response || {};
          method.response.schema_override = { $ref: `#/components/schemas/${EXEC_ENVELOPE_NAME}` };
          execOverrides++;
        }
        void isBareScalar;
      }
      const { op, httpVerb } = resolveOp(spec, method.operation.$ref);
      if (!op) throw new Error(`${f}: dangling operation ref for method ${mName}`);

      // 1. body binding
      const content = op.requestBody?.content;
      if (content) {
        const contentKey = Object.keys(content)[0];
        method.config = method.config || {};
        method.config.requestBodyTranslate = { algorithm: 'naive' };
        method.request = { ...(method.request || {}), mediaType: contentKey };
        bodyStamped++;
      }

      if (httpVerb === 'get') {
        const respSchema = schemaOf(spec, op.responses?.['200']?.content?.['application/json']?.schema);
        const props = respSchema?.properties || {};
        const hasNextPageToken = 'nextPageToken' in props;

        // 2. objectKey on list envelopes (structural)
        if (hasNextPageToken && !method.response?.objectKey) {
          const arrayProps = Object.entries(props).filter(([name, prop]) => {
            if (name === 'unreachable') return false;
            const resolved = prop?.$ref ? schemaOf(spec, prop) : prop;
            return resolved?.type === 'array';
          });
          if (arrayProps.length === 1) {
            method.response = method.response || {};
            method.response.objectKey = `$.${arrayProps[0][0]}`;
            objectKeys++;
          }
        }

        // 3. pageToken pagination
        const hasPageToken = (op.parameters || []).some((x) => x.in === 'query' && x.name === 'pageToken');
        if (hasPageToken && hasNextPageToken) {
          method.config = method.config || {};
          method.config.pagination = {
            requestToken: { key: 'pageToken', location: 'query' },
            responseToken: { key: '$.nextPageToken', location: 'body' },
          };
          paginationStamped++;
        }
      }

      // 4. LIMIT pushdown on pageSize-bearing methods
      const sizeParam = (op.parameters || []).find((x) => x.in === 'query' && x.name === 'pageSize');
      if (sizeParam) {
        const maximum = schemaOf(spec, sizeParam.schema)?.maximum;
        method.config = method.config || {};
        method.config.queryParamPushdown = {
          top: { paramName: 'pageSize', ...(Number.isFinite(maximum) ? { maxValue: maximum } : {}) },
        };
        pushdownStamped++;
      }
    }
  }
  fs.writeFileSync(p, dump(spec));
}

// 6. provider.yaml re-dump for consistent YAML 1.1 output
const providerYamlPath = path.join(providerRoot, 'provider.yaml');
fs.writeFileSync(providerYamlPath, dump(YAML.parse(fs.readFileSync(providerYamlPath, 'utf8'))));

console.log(`post-pass: ${bodyStamped} body-bearing methods bound, ${objectKeys} list objectKeys stamped, ${paginationStamped} pageToken lists paginated, ${execOverrides} exec response overrides, ${pushdownStamped} LIMIT pushdowns`);
