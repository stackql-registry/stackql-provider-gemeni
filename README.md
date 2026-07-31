# stackql-provider-gemeni

StackQL provider for the Google Gemini API (`generativelanguage.googleapis.com`, `v1beta`), mastered from one factory pipeline. One provider, `gemini`, covers inference (generateContent, embeddings, token counting, batches) and the API's own management surface (models, tuned models and permissions, files, cached contents, corpora, file search stores, long-running operations) - everything reachable with a `GEMINI_API_KEY`.

GCP control-plane surfaces (billing, quota, API key management, IAM) authenticate with OAuth/ADC on different hosts and belong to the `google` provider; the docs carry worked cross-provider join examples.

## Layout

```
factory/                 pipeline scripts (locate, download, convert, pre-pass,
                         service-map, scrub-unions, post-pass, guards,
                         exclusions.yaml, docgen enrich/scrub, doc-example guard)
provider-dev/
  downloaded/            vendored discovery doc (committed, revision-pinned)
  source/                converted spec (split/prepassed artifacts are derived)
  config/                all_services.csv (REVIEWED, committed, append-only)
  openapi/src/gemini/    generated provider (v00.00.00000)
  views/                 hand-authored views (vw_model_capabilities)
  docgen/provider-data/  docs index page content
bin/                     test-meta-routes.cjs (pgwire harness)
tests/                   smoke.cjs + manifest.yaml + queries/ + mock/
website/                 docusaurus microsite (gemini-provider.stackql.io)
```

## Build and test

Run under WSL/Linux (the pinned `./stackql` binary is a Linux ELF; node >= 18).

```bash
npm install        # once; also applies the local provider-utils docgen patch
make all           # drift check + full build + guards + tests + docs
```

Individual steps: `make locate | build | test-meta-routes | smoke | smoke-live | docgen | check-doc-examples | website`.

`make smoke-live` needs `GEMINI_API_KEY` exported (or in a git-ignored `.env` at the repo root: `export GEMINI_API_KEY=...`). Live tests are read-only plus free `countTokens` calls - no paid `generateContent`.

Bumping the upstream spec is a conscious act: `make pin` (repins the discovery `revision` and re-vendors the doc), then `make all`; new operations land in `provider-dev/config/all_services.csv` unmapped and must be reviewed by hand.

## Publishing

Manual gate. The generated provider tree under `provider-dev/openapi/src/gemini/` is PR'd to the StackQL provider registry; the website deploys via Netlify from `website/`. Nothing in this repo pushes anywhere.

See `CLAUDE.md` for the binding engineering rules and empirical findings.
