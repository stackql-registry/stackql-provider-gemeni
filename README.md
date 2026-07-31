# stackql-provider-gemeni

StackQL provider for the Google Gemini API (`generativelanguage.googleapis.com`, `v1beta`), mastered from one factory pipeline. One provider, `gemini`, covers inference (generateContent, embeddings, token counting, batches) and the API's own management surface (models, tuned models and permissions, files, cached contents, corpora, file search stores, long-running operations) - everything reachable with a `GEMINI_API_KEY`.

GCP control-plane surfaces (billing, quota, API key management, IAM) authenticate with OAuth/ADC on different hosts and belong to the `google` provider; the docs carry worked cross-provider join examples.

## Build and test

Run under WSL/Linux (the pinned `./stackql` binary is a Linux ELF; node >= 18).

```bash
npm install        # once; also applies the local provider-utils docgen patch
make all           # drift check + full build + guards + tests + docs
```

Individual steps: `make locate | build | test-meta-routes | smoke | smoke-live | docgen | check-doc-examples | website`.

`make smoke-live` needs `GEMINI_API_KEY` exported (or in a git-ignored `.env` at the repo root: `export GEMINI_API_KEY=...`). Live tests are read-only plus free `countTokens` calls - no paid `generateContent`.

Bumping the upstream spec is a conscious act: `make pin` (repins the discovery `revision` and re-vendors the doc), then `make all`; new operations land in `provider-dev/config/all_services.csv` unmapped and must be reviewed by hand.

## Inspect

```bash
PROVIDER_REGISTRY_ROOT_DIR="$(pwd)/provider-dev/openapi"
REG_STR='{"url": "file://'${PROVIDER_REGISTRY_ROOT_DIR}'", "localDocRoot": "'${PROVIDER_REGISTRY_ROOT_DIR}'", "verifyConfig": {"nopVerify": true}}'
./stackql shell --registry="${REG_STR}"
```

## Publishing

Manual gate. The generated provider tree under `provider-dev/openapi/src/gemini/` is PR'd to the StackQL provider registry. The website deploys to GitHub Pages (`gemini-provider.stackql.io`) via `.github/workflows/prod-web-deploy.yml` on push to `main` touching `website/**`; PRs get a test build via `test-web-deploy.yml`. Nothing runs until you push.

See `CLAUDE.md` for the binding engineering rules and empirical findings.
