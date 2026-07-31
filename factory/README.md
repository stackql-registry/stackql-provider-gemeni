# factory/ - the provider pipeline

The `gemini` provider is mastered here, spec-driven from the vendored Google
discovery document.

```
locate.mjs        fetch upstream discovery metadata; hard-fail when `revision`
                  differs from factory/spec-snapshot.json (guard 5, CI);
                  --pin consciously bumps the snapshot
download.mjs      fetch the discovery doc -> provider-dev/downloaded/ (vendored)
convert.mjs       discovery format -> OpenAPI 3.0.3 (semantics of
                  stackql/google-discovery-to-openapi @ 809d826, adapted for a
                  seeded document; global boilerplate params never emitted)
pre-pass.mjs      drop excluded ops (exclusions.yaml) · `key` query-param
                  tripwire · `type: any` -> opaque string · 3.1-ism tripwire
service-map.mjs   path -> service taxonomy (10 services, one per top-level
                  discovery resource) for provider-utils split
scrub-unions.mjs  post-normalize: collapse residual NESTED anyOf/oneOf/allOf;
                  delete every additionalProperties (guard 4 input)
csv-review-bootstrap.mjs  ONE-TIME mapping review (applied 2026-07-31; the
                  CSV is append-only now)
post-pass.mjs     request.mediaType + requestBodyTranslate:naive on
                  body-bearing methods · objectKey on list envelopes
                  (structural) · pageToken pagination config · pageSize LIMIT
                  pushdown · EXEC schema_override envelope · YAML 1.1 re-dump
guards.mjs        guards 1-4 + 6: spec-coverage diff == exclusions exactly ·
                  select-shape consistency · signature uniqueness ·
                  no-polymorphism scan (properties-map aware) · zero-column
                  selects
patch-provider-utils.mjs  local docgen fix (Required Params for SELECT-routed
                  body methods) - postinstall hook; still needed at
                  provider-utils 0.7.7; upstream diff in upstream/
enrich-select-docs.mjs    post-docgen: body params for POST-as-SELECT pages,
                  curated Query Example tabs (docgen-select-examples.yaml)
scrub-docs.mjs    post-docgen: suppress pageToken/pageSize (and any header
                  params) from SQL samples and param tables
check-doc-examples.mjs    guard 7: docs-index SQL blocks must match smoke
                  queries verbatim (exemptions by heading, with reasons)
exclusions.yaml   the documented 5-op exclusion list (guard 1 contract)
spec-snapshot.json  pinned discovery revision
```

Orchestration lives in the root `package.json` scripts and the `Makefile`
(`make all`). See the repo `CLAUDE.md` for the binding engineering rules and
all empirical findings.
