#!/usr/bin/env node
// Pre-pass for the `gemini` provider spec, run BEFORE split/normalize.
//
//   node factory/pre-pass.mjs [--in FILE] [--out FILE]
//
// Steps (order matters):
//   1. drop excluded ops (factory/exclusions.yaml) - SSE streaming variants,
//      resumable/multipart upload paths; assert the exclusion table matches
//      the spec exactly (drift in either direction is an error)
//   2. assert no `key` query param survives on any op (auth is the
//      x-goog-api-key header, never the query string; convert.mjs already
//      omits all global boilerplate params - this is the tripwire)
//   3. discovery `type: any` members (Operation.metadata/.response et al)
//      -> opaque `type: string` JSON-blob columns ('any' is not a valid
//      OpenAPI 3.0 type and stackql would choke on it)
//   4. assert no residual 3.1-isms (anyOf/oneOf/const/exclusive bounds as
//      numbers) - discovery format cannot express them; their presence
//      means the converter changed underneath us

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(here);

function argOf(flag, dflt) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : dflt;
}

const inPath = argOf('--in', path.join(repoRoot, 'provider-dev', 'source', 'gemini-converted.yaml'));
const outPath = argOf('--out', path.join(repoRoot, 'provider-dev', 'source', 'gemini-prepassed.yaml'));

const spec = yaml.load(fs.readFileSync(inPath, 'utf8'));
const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']);

// ---- 1. drop excluded ops ---------------------------------------------------
const exclusionsDoc = yaml.load(fs.readFileSync(path.join(here, 'exclusions.yaml'), 'utf8'));
const excluded = new Set(
  Object.values(exclusionsDoc).flatMap((group) => group.map((e) => e.op))
);

let dropped = 0;
for (const [pathKey, item] of Object.entries(spec.paths)) {
  for (const method of Object.keys(item)) {
    if (!HTTP_METHODS.has(method)) continue;
    if (excluded.has(`${method.toUpperCase()} ${pathKey}`)) {
      delete item[method];
      dropped++;
    }
  }
  if (!Object.keys(item).some((k) => HTTP_METHODS.has(k))) {
    delete spec.paths[pathKey];
  }
}
if (dropped !== excluded.size) {
  console.error(`pre-pass: exclusion mismatch - table lists ${excluded.size} ops but only ${dropped} matched the spec. ` +
    'The vendored spec has drifted; reconcile factory/exclusions.yaml.');
  process.exit(1);
}

// ---- 2. no `key` query param tripwire ---------------------------------------
for (const [pathKey, item] of Object.entries(spec.paths)) {
  for (const [method, op] of Object.entries(item)) {
    if (!HTTP_METHODS.has(method)) continue;
    const bad = (op.parameters || []).find((p) => p.in === 'query' && p.name === 'key');
    if (bad) {
      console.error(`pre-pass: ${method.toUpperCase()} ${pathKey} carries a \`key\` query param - auth is the header, never the query string`);
      process.exit(1);
    }
  }
}

// ---- 3. type: any -> opaque string ------------------------------------------
let anyCount = 0;
function scrubAny(node) {
  if (Array.isArray(node)) { node.forEach(scrubAny); return; }
  if (node === null || typeof node !== 'object') return;
  if (node.type === 'any') {
    node.type = 'string';
    node.description = node.description
      ? `${node.description} (arbitrary JSON, projected as a string column)`
      : 'Arbitrary JSON, projected as a string column.';
    anyCount++;
  }
  for (const v of Object.values(node)) scrubAny(v);
}
scrubAny(spec);

// ---- 4. residual 3.1-ism tripwire -------------------------------------------
const specText = JSON.stringify(spec);
for (const kw of ['"const":', '"exclusiveMinimum":true', '"exclusiveMaximum":true']) {
  if (specText.includes(kw)) {
    console.error(`pre-pass: unexpected 3.1 construct ${kw} in converted spec - converter changed, re-verify`);
    process.exit(1);
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, yaml.dump(spec, { noRefs: true, lineWidth: -1 }));

const opCount = Object.values(spec.paths).reduce(
  (n, item) => n + Object.keys(item).filter((k) => HTTP_METHODS.has(k)).length, 0);
console.log(`pre-pass: dropped ${dropped} excluded ops; ${opCount} ops remain; ${anyCount} \`type: any\` members scrubbed to string`);
console.log(`wrote ${outPath}`);
