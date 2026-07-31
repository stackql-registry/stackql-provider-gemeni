#!/usr/bin/env node
// Drift detection (guard 5) for the `gemini` provider.
//
//   node factory/locate.mjs          # compare upstream revision to vendored snapshot
//   node factory/locate.mjs --pin    # accept the current upstream revision (then run `npm run download`)
//
// The canonical spec is the Google discovery document at DISCOVERY_URL. It is
// NOT listed in the discovery.googleapis.com directory index - the URL is
// seeded directly, never resolved from the directory. The vendored snapshot in
// provider-dev/downloaded/ carries `revision`; regen hard-fails when upstream
// differs (conscious bump required: locate --pin, then download, then build).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DISCOVERY_URL =
  'https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(here);
const vendoredPath = path.join(repoRoot, 'provider-dev', 'downloaded', 'gemini-discovery.json');
const snapshotPath = path.join(here, 'spec-snapshot.json');

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const pin = process.argv.includes('--pin');

  const resp = await fetch(DISCOVERY_URL);
  if (!resp.ok) {
    console.error(`locate: upstream fetch failed: ${resp.status} ${resp.statusText}`);
    process.exit(1);
  }
  const upstream = await resp.json();
  console.log(`locate: upstream discovery revision ${upstream.revision} (id ${upstream.id})`);

  const pinned = fs.existsSync(snapshotPath)
    ? JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
    : null;

  if (pin) {
    fs.writeFileSync(snapshotPath, JSON.stringify({
      url: DISCOVERY_URL,
      revision: upstream.revision,
      pinnedAt: new Date().toISOString().slice(0, 10),
    }, null, 2) + '\n');
    console.log(`locate: pinned revision ${upstream.revision} -> ${path.relative(repoRoot, snapshotPath)}`);
    console.log('locate: now run `npm run download` to vendor the document');
    process.exit(0);
  }

  if (!pinned) {
    console.error('locate: no spec-snapshot.json - run `node factory/locate.mjs --pin` to pin the first revision');
    process.exit(1);
  }
  if (pinned.revision !== upstream.revision) {
    console.error(`locate: DRIFT - pinned revision ${pinned.revision} != upstream ${upstream.revision}.`);
    console.error('locate: review upstream changes, then `node factory/locate.mjs --pin && npm run download && npm run build`');
    process.exit(1);
  }
  if (fs.existsSync(vendoredPath)) {
    const vendored = JSON.parse(fs.readFileSync(vendoredPath, 'utf8'));
    if (vendored.revision !== pinned.revision) {
      console.error(`locate: vendored doc revision ${vendored.revision} != pinned ${pinned.revision} - run \`npm run download\``);
      process.exit(1);
    }
  } else {
    console.error('locate: no vendored discovery doc - run `npm run download`');
    process.exit(1);
  }
  console.log('locate: no drift - pinned == vendored == upstream');
}
