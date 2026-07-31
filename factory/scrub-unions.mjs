#!/usr/bin/env node
// Post-normalize scrub, run on the split+normalized per-service specs.
//
//   node factory/scrub-unions.mjs --api-dir DIR
//
// provider-utils `normalize` is shallow by design: it rewrites unions at
// the column surface (top-level schemas, their direct properties, request/
// response bodies) but leaves NESTED anyOf/oneOf/allOf intact. Those nested
// sites sit deeper than the SQL column surface — they live inside what the
// engine projects as JSON-blob columns — so collapsing them to opaque
// schemas is behaviour-preserving for SQL, and the no-polymorphism guard
// (guard 4: zero anyOf/oneOf/allOf/additionalProperties in generated
// services) requires it.
//
// Rules:
//   - `additionalProperties` — deleted everywhere (never projected).
//   - residual anyOf/oneOf/allOf — replaced by an opaque schema that keeps
//     the description; scalar-homogeneous unions keep the scalar type,
//     anything else becomes `type: string` (JSON-blob column convention).

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}
const apiDir = argOf('--api-dir');
if (!apiDir) {
  console.error('usage: scrub-unions.mjs --api-dir DIR');
  process.exit(1);
}

const SCALARS = new Set(['string', 'integer', 'number', 'boolean']);

function opaqueReplacement(members, node) {
  const types = new Set(members.map((m) => (m && m.type) || 'string'));
  const type = types.size === 1 && SCALARS.has([...types][0]) ? [...types][0] : 'string';
  const out = { type };
  if (node.description) out.description = node.description;
  else {
    const desc = members.find((m) => m && m.description);
    if (desc) out.description = desc.description;
  }
  if (node.nullable) out.nullable = true;
  if (node.default !== undefined) out.default = node.default;
  return out;
}

function scrub(node, stats) {
  if (Array.isArray(node)) {
    node.forEach((v) => scrub(v, stats));
    return;
  }
  if (node === null || typeof node !== 'object') return;

  if ('additionalProperties' in node) {
    delete node.additionalProperties;
    stats.additionalProps++;
  }
  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    if (Array.isArray(node[key])) {
      const members = node[key];
      const repl = opaqueReplacement(members, node);
      for (const k of Object.keys(node)) delete node[k];
      Object.assign(node, repl);
      stats.unions++;
      return; // node replaced wholesale; nothing left to walk
    }
  }
  for (const v of Object.values(node)) scrub(v, stats);
}

const files = fs.readdirSync(apiDir).filter((f) => /\.ya?ml$/.test(f));
for (const f of files) {
  const p = path.join(apiDir, f);
  const spec = yaml.load(fs.readFileSync(p, 'utf8'));
  const stats = { unions: 0, additionalProps: 0 };
  scrub(spec, stats);
  fs.writeFileSync(p, yaml.dump(spec, { noRefs: true, lineWidth: -1 }));
  console.log(`${f}: collapsed ${stats.unions} residual unions, removed ${stats.additionalProps} additionalProperties`);
}
