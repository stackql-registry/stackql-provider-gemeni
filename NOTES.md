# Build notes - stackql-provider-gemeni

Working notes from the initial factory build (2026-07-31). The binding rules
and pinned findings live in CLAUDE.md; this file records context that does
not belong there.

## What was built

- Full factory pipeline (`make all`): locate -> convert -> pre-pass -> split ->
  normalize -> analyze -> CSV review -> generate -> post-pass -> guards, plus
  meta-routes walk, mock smoke suite, docgen chain and the docusaurus site.
- Surface: 10 services, 32 API resources (+1 view), 75 methods (37
  select-routed) from discovery revision 20260729 (80 ops; 5 documented
  exclusions: 3 SSE streaming variants, 2 resumable-upload paths).
- Conversion: the `stackql/google-discovery-to-openapi` CLI is hardwired to
  its four Google provider configs and refuses a seeded document, so
  `factory/convert.mjs` reimplements its conversion semantics (commit
  809d826) against the vendored doc directly. Deliberate deviations are
  documented in the script header (no global boilerplate params, no OAuth
  security schemes, richer param schemas).

## Test status

- `make test-meta-routes`: green, zero errors (10/32/75, 3.4s).
- `make smoke` (mock): 17/17 green. Proves 401-without-header, no `key`
  query param, naive body fan-out (contents arrives as a real JSON array),
  pageToken auto-pagination (5 rows over 2 pages, terminates), objectKey
  list unwrapping, INSERT RETURNING, DELETE, EXEC with the schema_override
  envelope, and the vw_model_capabilities view.
- `make smoke-live`: NOT yet run. GEMINI_API_KEY was not visible to the
  build shells (it lives only in an interactive WSL session; it is in no
  profile file, no running process environment, and not in the Windows
  environment). To run: `export GEMINI_API_KEY=...` (or drop
  `export GEMINI_API_KEY=...` into a git-ignored `.env` at the repo root),
  then `make smoke-live`. Live tests are read-only + free countTokens.
- Website: docgen output builds under docusaurus with the vendored
  stackql/docusaurus-config (see CLAUDE.md for any caveats).

## Open items

1. Run `make smoke-live` once the key is available; then decide the
   OAuth-only question for `tunedModels.*`/`corpora.*` permissions ops
   (CLAUDE.md control-plane note) and either exclude or add a doc callout.
2. Netlify site + DNS (`gemini-provider.stackql.io`) - manual gate.
3. Registry publication PR from `provider-dev/openapi/src/gemini/` - manual
   gate.
4. `models.predict` / `models.predictLongRunning` (Imagen/Veo surface) and
   the legacy PaLM text/message resources are mapped but have no curated doc
   examples - extend factory/docgen-select-examples.yaml if they get real
   usage.
