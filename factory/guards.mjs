#!/usr/bin/env node
// Build guards (CI hard-fails). Runs against the generated provider tree.
//
//   node factory/guards.mjs --provider gemini \
//     --provider-root provider-dev/openapi/src/gemini/v00.00.00000 \
//     --spec provider-dev/source/gemini-converted.yaml \
//     --exclusions factory/exclusions.yaml
//
// Guards (numbering matches CLAUDE.md):
//   1. spec-coverage diff - converted discovery ops minus provider ops ==
//      EXACTLY the documented exclusion list
//   2. select-shape consistency - within a resource all SELECT methods
//      project the same column set
//   3. signature uniqueness - within (resource, sqlVerb != exec) no two
//      methods share a required-params signature
//   4. no-polymorphism scan - zero anyOf/oneOf/allOf/additionalProperties
//   6. zero-column selects - every SELECT-routed method projects >= 1 column
//
// Guard 5 (discovery revision drift) is `node factory/locate.mjs` (no
// --pin), wired separately in CI because it needs the network.

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}
const providerName = argOf('--provider');
const providerRoot = argOf('--provider-root');
const specPath = argOf('--spec');
const exclusionsPath = argOf('--exclusions');
if (!providerName || !providerRoot) {
  console.error('usage: guards.mjs --provider NAME --provider-root DIR [--spec FILE --exclusions FILE]');
  process.exit(1);
}

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete']);
const failures = [];
const fail = (guard, msg) => failures.push(`[guard ${guard}] ${msg}`);

const servicesDir = path.join(providerRoot, 'services');
const services = {};
for (const f of fs.readdirSync(servicesDir).filter((x) => /\.ya?ml$/.test(x))) {
  services[f] = YAML.parse(fs.readFileSync(path.join(servicesDir, f), 'utf8'));
}

function resolveOp(spec, opRef) {
  const parts = opRef.replace(/^#\/paths\//, '').split('/');
  const httpVerb = parts.pop();
  const pathKey = parts.join('/').replace(/~1/g, '/').replace(/~0/g, '~');
  return { op: ((spec.paths || {})[pathKey] || {})[httpVerb], httpVerb, pathKey };
}

function deref(spec, s) {
  let depth = 0;
  while (s && s.$ref && depth++ < 10) s = (spec.components?.schemas || {})[s.$ref.split('/').pop()];
  return s;
}

// Columns a method projects: response schema properties, descending
// objectKey ($.foo) into the carrier array's item schema.
function methodColumns(spec, method) {
  const { op } = resolveOp(spec, method.operation.$ref);
  if (!op) return null;
  const codes = Object.keys(op.responses || {}).filter((c) => /^2\d\d$/.test(c)).sort();
  if (!codes.length) return null;
  const content = op.responses[codes[0]]?.content || {};
  const ct = Object.keys(content)[0];
  let schema = deref(spec, content[ct]?.schema);
  if (!schema) return null;
  const objectKey = method.response?.objectKey;
  if (objectKey && objectKey.startsWith('$.')) {
    const carrier = deref(spec, (schema.properties || {})[objectKey.slice(2)]);
    const item = carrier?.items ? deref(spec, carrier.items) : null;
    if (item) schema = item;
  } else if (schema.items) {
    schema = deref(spec, schema.items) || schema;
  }
  return Object.keys(schema.properties || {}).sort();
}

// Required-params signature: required path/query/header params + required
// body properties (naive translate surfaces them under native names).
// Discovery-derived body schemas carry no `required` arrays, so signatures
// are dominated by path/query params.
function requiredSignature(spec, method) {
  const { op } = resolveOp(spec, method.operation.$ref);
  const names = new Set();
  for (const p of op.parameters || []) if (p.required) names.add(p.name);
  const mediaType = method.request?.mediaType;
  const content = op.requestBody?.content;
  if (content) {
    const key = mediaType && content[mediaType] ? mediaType : 'application/json';
    const schema = deref(spec, content[key]?.schema);
    if (Array.isArray(schema?.required)) for (const r of schema.required) names.add(r);
  }
  return [...names].sort().join(',');
}

// ---- guards 2, 3, 6 ---------------------------------------------------------
let resourceCount = 0, methodCount = 0, selectMethods = 0;
for (const [fname, spec] of Object.entries(services)) {
  const resources = spec.components?.['x-stackQL-resources'] || {};
  for (const [rName, r] of Object.entries(resources)) {
    if (r.id && String(r.id).startsWith(`${providerName}.`) && r.config?.views) continue; // hand-authored views
    resourceCount++;
    methodCount += Object.keys(r.methods || {}).length;

    const selRefs = (r.sqlVerbs?.select || []).map((x) => x.$ref.split('/').pop());
    let shape = null;
    for (const mName of selRefs) {
      selectMethods++;
      const cols = methodColumns(spec, r.methods[mName]);
      if (!cols || cols.length === 0) {
        fail(6, `${fname} ${rName}.${mName}: SELECT method projects zero columns`);
        continue;
      }
      if (shape === null) shape = { mName, cols: cols.join(',') };
      else if (shape.cols !== cols.join(',')) {
        fail(2, `${fname} ${rName}: select shape diverges between ${shape.mName} and ${mName}`);
      }
    }

    for (const [verb, refs] of Object.entries(r.sqlVerbs || {})) {
      const seen = new Map();
      for (const ref of refs || []) {
        const mName = ref.$ref.split('/').pop();
        const sig = requiredSignature(spec, r.methods[mName]);
        if (seen.has(sig)) {
          fail(3, `${fname} ${rName}.${verb}: methods ${seen.get(sig)} and ${mName} share required-params signature [${sig || '(none)'}]`);
        }
        seen.set(sig, mName);
      }
    }
  }
}

// ---- guard 4 ----------------------------------------------------------------
// Structural scan, not a text scan: the Gemini `Schema` type carries
// PROPERTIES literally named anyOf/allOf/additionalProperties (it embeds
// JSON Schema as data). Keys sitting directly under a `properties` map are
// property names, not schema combinators, and are exempt.
function polyScan(node, fname, isPropertiesMap) {
  if (Array.isArray(node)) { node.forEach((v) => polyScan(v, fname, false)); return; }
  if (node === null || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if (!isPropertiesMap) {
      if (['anyOf', 'oneOf', 'allOf'].includes(k) && Array.isArray(v)) {
        fail(4, `${fname}: schema combinator ${k}`);
      }
      if (k === 'additionalProperties') {
        fail(4, `${fname}: additionalProperties`);
      }
    }
    polyScan(v, fname, !isPropertiesMap && k === 'properties');
  }
}
for (const [fname, spec] of Object.entries(services)) {
  polyScan(spec, fname, false);
}

// ---- guard 1 ----------------------------------------------------------------
if (specPath && exclusionsPath) {
  const rawSpec = /\.json$/.test(specPath)
    ? JSON.parse(fs.readFileSync(specPath, 'utf8'))
    : YAML.parse(fs.readFileSync(specPath, 'utf8'));
  const specOps = new Set();
  for (const [p, item] of Object.entries(rawSpec.paths || {})) {
    for (const m of Object.keys(item)) {
      if (HTTP_METHODS.has(m)) specOps.add(`${m.toUpperCase()} ${p}`);
    }
  }
  const providerOps = new Set();
  for (const spec of Object.values(services)) {
    for (const [p, item] of Object.entries(spec.paths || {})) {
      for (const m of Object.keys(item)) {
        if (HTTP_METHODS.has(m)) providerOps.add(`${m.toUpperCase()} ${p}`);
      }
    }
  }
  const exclusions = new Set(
    Object.values(YAML.parse(fs.readFileSync(exclusionsPath, 'utf8')))
      .flatMap((group) => group.map((e) => e.op))
  );
  for (const op of specOps) {
    if (!providerOps.has(op) && !exclusions.has(op)) {
      fail(1, `spec op missing from provider and not in exclusion list: ${op}`);
    }
    if (providerOps.has(op) && exclusions.has(op)) {
      fail(1, `excluded op is present in provider: ${op}`);
    }
  }
  for (const op of providerOps) {
    if (!specOps.has(op)) fail(1, `provider op not in official spec: ${op}`);
  }
  for (const op of exclusions) {
    if (!specOps.has(op)) fail(1, `exclusion list entry not in official spec (stale): ${op}`);
  }
  console.log(`guard 1: spec ops ${specOps.size} - provider ops ${providerOps.size} == exclusions ${exclusions.size}`);
} else {
  console.log('guard 1: skipped (no --spec/--exclusions)');
}

console.log(`surface: ${Object.keys(services).length} services, ${resourceCount} resources, ${methodCount} methods (${selectMethods} select-routed)`);

if (failures.length) {
  console.error(`\nGUARDS FAILED (${failures.length}):`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log('all guards green');
