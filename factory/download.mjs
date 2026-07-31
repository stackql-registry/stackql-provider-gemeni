#!/usr/bin/env node
// Vendor the canonical discovery document (committed).
//
//   node factory/download.mjs
//
// Fetches DISCOVERY_URL (seeded directly - the doc is not in the
// discovery.googleapis.com directory index) and writes it pretty-printed to
// provider-dev/downloaded/gemini-discovery.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DISCOVERY_URL } from './locate.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(here);
const outPath = path.join(repoRoot, 'provider-dev', 'downloaded', 'gemini-discovery.json');

const resp = await fetch(DISCOVERY_URL);
if (!resp.ok) {
  console.error(`download: fetch failed: ${resp.status} ${resp.statusText}`);
  process.exit(1);
}
const doc = await resp.json();
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(doc, null, 2) + '\n');
console.log(`download: vendored revision ${doc.revision} -> ${path.relative(repoRoot, outPath)}`);
