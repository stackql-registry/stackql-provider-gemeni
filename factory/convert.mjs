#!/usr/bin/env node
// Discovery format -> OpenAPI 3.0.3.
//
//   node factory/convert.mjs
//
// Conversion semantics are those of stackql/google-discovery-to-openapi
// (the tool that masters the `google` provider), vendored/adapted at commit
// 809d826218afa81f6890f2538767487c5fb7af5e because that tool's CLI is
// hardwired to its four Google provider configs (googleapis.com, firebase,
// googleworkspace, googleadmin) and refuses a seeded document. Deviations
// from the tool, all deliberate:
//   - operationId keeps the discovery method id minus the API-name prefix
//     (`generativelanguage.models.generateContent` -> `models.generateContent`)
//   - global (boilerplate) request params - key, alt, fields, prettyPrint,
//     quotaUser, oauth_token, access_token, callback, upload_protocol,
//     uploadType, $.xgafv - are NOT emitted; auth is the x-goog-api-key
//     header (never the `key` query param), the rest are wire noise.
//     pre-pass asserts none survive.
//   - no OAuth securitySchemes are emitted; provider auth comes from
//     --provider-config at generate time.
//   - param schemas keep enum/default/description (the tool drops enums).
//
// Reads  provider-dev/downloaded/gemini-discovery.json (vendored)
// Writes provider-dev/source/gemini-converted.yaml

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(here);
const inPath = path.join(repoRoot, 'provider-dev', 'downloaded', 'gemini-discovery.json');
const outPath = path.join(repoRoot, 'provider-dev', 'source', 'gemini-converted.yaml');

const doc = JSON.parse(fs.readFileSync(inPath, 'utf8'));

// ---- schemas: discovery $ref names -> #/components/schemas/ refs ------------
function replaceSchemaRefs(node) {
  if (Array.isArray(node)) { node.forEach(replaceSchemaRefs); return node; }
  if (node && typeof node === 'object') {
    if (typeof node.$ref === 'string' && !node.$ref.startsWith('#/')) {
      node.$ref = `#/components/schemas/${node.$ref}`;
    }
    for (const v of Object.values(node)) replaceSchemaRefs(v);
  }
  return node;
}

// ---- params -----------------------------------------------------------------
function paramSchema(p) {
  const schema = { type: p.type || 'string' };
  if (p.format) schema.format = p.format;
  if (Array.isArray(p.enum)) schema.enum = p.enum;
  if (p.default !== undefined) schema.default = p.default;
  return schema;
}

function opParams(method, pathKey) {
  const out = [];
  for (const token of pathKey.split('/')) {
    if (token.startsWith('{')) {
      out.push({
        in: 'path',
        name: token.replace('{', '').replace('}', '').split(':')[0],
        required: true,
        schema: { type: 'string' },
      });
    }
  }
  const inParams = method.parameters || {};
  const order = method.parameterOrder || [];
  const names = [...order.filter((n) => n in inParams), ...Object.keys(inParams).filter((n) => !order.includes(n))];
  for (const name of names) {
    const p = inParams[name];
    if (p.location === 'path') continue; // path params come from the flatPath tokens
    const param = { in: p.location, name, schema: paramSchema(p) };
    if (p.description) param.description = p.description;
    if (p.required) param.required = true;
    out.push(param);
  }
  return out;
}

// ---- paths ------------------------------------------------------------------
const paths = {};
let opCount = 0;

function processMethods(methodsObj) {
  for (const method of Object.values(methodsObj)) {
    const rawPath = method.flatPath || method.path;
    if (!rawPath) throw new Error(`method ${method.id} has no path`);
    const pathKey = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    const verb = method.httpMethod.toLowerCase();
    const op = {
      operationId: method.id.replace(/^generativelanguage\./, ''),
      description: method.description || '',
    };
    if (method.request?.$ref) {
      op.requestBody = {
        content: { 'application/json': { schema: { $ref: `#/components/schemas/${method.request.$ref}` } } },
      };
    }
    op.responses = method.response?.$ref
      ? { 200: { description: 'Successful response', content: { 'application/json': { schema: { $ref: `#/components/schemas/${method.response.$ref}` } } } } }
      : { 204: { description: 'No Content' } };
    const params = opParams(method, pathKey);
    if (params.length) op.parameters = params;
    paths[pathKey] = paths[pathKey] || {};
    if (paths[pathKey][verb]) throw new Error(`path collision: ${verb.toUpperCase()} ${pathKey} (${method.id})`);
    paths[pathKey][verb] = op;
    opCount++;
  }
}

function walkResources(node) {
  if (node.methods) processMethods(node.methods);
  for (const child of Object.values(node.resources || {})) walkResources(child);
}
walkResources({ methods: doc.methods, resources: doc.resources });

// ---- assemble ---------------------------------------------------------------
let serverUrl = `${doc.rootUrl || 'https://generativelanguage.googleapis.com/'}${doc.servicePath || ''}`;
if (serverUrl.endsWith('/')) serverUrl = serverUrl.slice(0, -1);

const openApiDoc = {
  openapi: '3.0.3',
  info: {
    title: doc.title,
    description: doc.description,
    version: doc.version,
    'x-discovery-doc-revision': doc.revision,
    contact: { name: 'StackQL Studios', url: 'https://github.com/stackql-registry/stackql-provider-gemeni', email: 'info@stackql.io' },
  },
  externalDocs: { url: doc.documentationLink },
  servers: [{ url: serverUrl }],
  components: { schemas: replaceSchemaRefs(structuredClone(doc.schemas || {})) },
  paths,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, yaml.dump(openApiDoc, { noRefs: true, lineWidth: -1 }));
console.log(`convert: ${opCount} ops, ${Object.keys(openApiDoc.components.schemas).length} schemas (discovery revision ${doc.revision}) -> ${path.relative(repoRoot, outPath)}`);
