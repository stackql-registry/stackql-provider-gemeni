#!/usr/bin/env node
// Local patch for @stackql/provider-utils' docgen (run before docgen; wired
// as npm postinstall so a fresh install is always patched).
//
// Upstream bug: docgen builds "Required Params" from `parameters` plus
// requestBody.required — but ONLY for insert/update/replace/exec access
// types (src/docgen/resource/methods.js getRequiredBodyParams). SELECT-routed
// body-bearing methods (inference ops: messages.create, token_counts,
// completions) therefore show EMPTY Required Params even though runtime
// routing (and SHOW EXTENDED METHODS) requires the body fields.
//
// Two edits, both minimal and idempotent:
//   1. methods.js — include 'select' in getRequiredBodyParams' access-type
//      allowlist and in the data__-prefix branch (naive translate strips
//      the prefix, matching runtime).
//   2. examples/select-example.js — append the same body-required fields to
//      the SELECT example's WHERE clause so samples are actually routable.
//
// The equivalent upstream diff is kept at
// factory/upstream/provider-utils-select-required-params.patch — submit it
// to stackql-registry/stackql-provider-utils and delete this file once a
// release contains it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = path.join(path.dirname(here), 'node_modules', '@stackql', 'provider-utils', 'src', 'docgen');

// ---- 1. methods.js -----------------------------------------------------------
const methodsPath = path.join(base, 'resource', 'methods.js');
let methods = fs.readFileSync(methodsPath, 'utf8');
const guardBefore = "if (!['insert', 'update', 'replace', 'exec'].includes(accessType)) {";
const guardAfter = "if (!['insert', 'update', 'replace', 'exec', 'select'].includes(accessType)) {";
const prefixBefore = "if (['insert', 'update', 'replace'].includes(accessType) && !hasNaiveTranslate) {";
const prefixAfter = "if (['insert', 'update', 'replace', 'select'].includes(accessType) && !hasNaiveTranslate) {";
let patched = 0;
if (methods.includes(guardBefore)) { methods = methods.replace(guardBefore, guardAfter); patched++; }
if (methods.includes(prefixBefore)) { methods = methods.replace(prefixBefore, prefixAfter); patched++; }
if (patched) fs.writeFileSync(methodsPath, methods);
console.log(`methods.js: ${patched ? `patched (${patched} edits)` : (methods.includes(guardAfter) ? 'already patched' : 'PATTERN NOT FOUND — provider-utils changed, re-verify')}`);

// ---- 2. select-example.js -----------------------------------------------------
const selPath = path.join(base, 'resource', 'examples', 'select-example.js');
let sel = fs.readFileSync(selPath, 'utf8');
const anchorBefore = `        // Add WHERE clause with parameters
        const requiredParams = Object.keys(methodDetails.requiredParams || {});`;
const anchorAfter = `        // Add WHERE clause with parameters
        // (patched: body-required fields participate in routing for
        // SELECT-mapped body-bearing methods — naive translate exposes them
        // under their native names)
        const bodyRequired = (methodDetails.requestBody && methodDetails.requestBody.required) || [];
        const requiredParams = [...new Set([...Object.keys(methodDetails.requiredParams || {}), ...bodyRequired])];`;
if (sel.includes(anchorBefore)) {
  sel = sel.replace(anchorBefore, anchorAfter);
  fs.writeFileSync(selPath, sel);
  console.log('select-example.js: patched');
} else {
  console.log(sel.includes('bodyRequired') ? 'select-example.js: already patched' : 'select-example.js: PATTERN NOT FOUND — provider-utils changed, re-verify');
}
