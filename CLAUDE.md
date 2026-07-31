# Project rules - StackQL Gemini provider factory

This repo masters ONE StackQL provider, `gemini`, from one pipeline ("the factory").
Unlike the Anthropic archetype (two providers, two disjoint key types), the Gemini
data plane and control plane are collapsed into a single provider wherever a single
credential (`GEMINI_API_KEY`) can reach both. See "Control plane scope" for the hard
boundary and the decision gate.

| Provider | Surface | Auth env var | Wire auth |
|---|---|---|---|
| `gemini` | Generative Language API (`generativelanguage.googleapis.com`, `v1beta`): inference (generateContent, embeddings, token counting, interactions, batches) plus the API's own management surface (models, tuned models + permissions, files, cached contents, corpora/documents/chunks + permissions, long-running operations) | `GEMINI_API_KEY` | `x-goog-api-key` header |

Default branch: `main` (plain repo, not a fork - the `stackql-provider` default-branch
convention applies only to forked SDK repos). Rules marked **(verified)** were
empirically confirmed on the wire during the Anthropic provider build (stackql
v0.10.542) and are ENGINE behaviours, not Anthropic-specific - do not re-litigate
them. Rules marked **(gemini: verify)** must be confirmed in the Phase 0 spike before
being promoted to (verified).

Reference archetype: https://github.com/stackql-registry/stackql-provider-anthropic
(factory layout, guards, meta-routes harness, smoke suite, docgen chain). Copy the
patterns, not the taxonomy.

## Sources of truth

- **Canonical spec**: the Google discovery document at
  `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta`
  (public, no auth). It is NOT listed in the `discovery.googleapis.com` directory
  index - seed the URL directly, never resolve it from the directory.
- **Drift detection**: the discovery doc carries `revision` and `etag` fields. Vendor
  the downloaded doc into `provider-dev/downloaded/` (committed) and hard-fail regen
  when the upstream `revision` differs from the vendored snapshot (conscious bump
  required). This replaces the Anthropic `.stats.yml` hash check.
- **Do NOT derive anything from SDK source** (`google-genai` Python/TS). The SDKs are
  generated from the same protos as the discovery doc and add client-side aliases,
  chat-session state, retry and streaming wrappers that have no wire meaning. The
  discovery doc is canonical; the human-readable reference at `ai.google.dev/api` is
  itself generated from the same source and is for gap-checking descriptions only.
- **Conversion**: discovery format -> OpenAPI 3 via `stackql/google-discovery-to-openapi`
  (the same tool that masters the `google` provider). Verify the current entry point
  and version at build time in `factory/locate.mjs`. Discovery format has no
  anyOf/oneOf, so the normalize burden is lighter than Anthropic's 3.1 spec - but do
  not skip normalize or the guards on that assumption.

## Toolchain

- `@stackql/provider-utils` **latest** (`^0.7.7` at authoring, published 2026-07-28).
  Two CLI bins: `provider-dev-utils` (split / normalize / analyze / generate) and
  `docgen-utils` (generate-docs-v2). Call them through `node
  node_modules/@stackql/provider-utils/bin/<bin>.mjs` in npm scripts (never rely on
  `.bin` shims - they do not link for `.mjs` on Windows). Pass flags after `--`.
- `.npmrc` requires `@jsr:registry=https://npm.jsr.io` (transitive dependency
  `@jsr/stackql__deno-openapi-dereferencer`).
- Anthropic carried a local docgen patch (`factory/patch-provider-utils.mjs`, npm
  postinstall) because provider-utils omitted body-required fields from Required
  Params on SELECT-routed methods. **Before porting the patch, check whether 0.7.7
  contains the fix** (`docgen/resource/methods.js` access-type allowlist includes
  `select`). Only carry the patch if it does not.
- `stackql` binary for testing (meta routes, smoke). Pin the version used in CI and
  record it here when the spike lands.

## The factory pipeline

```
locate    fetch discovery doc metadata; alert if `revision` differs from the
          committed snapshot
download  fetch discovery doc -> provider-dev/downloaded/ (committed)
convert   discovery -> OpenAPI 3 (google-discovery-to-openapi) ->
          provider-dev/source/gemini-converted.yaml
pre-pass  custom script (factory/pre-pass.mjs):
            - drop excluded ops (policy below): bidi/live methods, SSE streaming
              variants, resumable/multipart upload paths, /openai/* compat shim
              if present
            - strip the `key` query param from all ops if the converter emits it
              (auth is the header, never the query string)
            - any residual 3.1-isms from conversion (expect none; assert)
split     converted spec -> per-service specs. Service taxonomy comes from the
          discovery doc's resource tree (svc-discriminator function,
          factory/service-map.mjs), NOT from tags
normalize provider-utils `normalize` (+ factory/scrub-unions.mjs if the converted
          spec contains any residual unions or additionalProperties - run it
          unconditionally; it is a no-op on clean input)
analyze   provider-utils mappings -> provider-dev/config/all_services.csv
          (REVIEWED, committed, append-only; resource/method/verb surgery lives
          here - see few-shots in the Anthropic CLAUDE.md, same contract)
generate  provider tree -> provider-dev/openapi/src/gemini/v00.00.00000/
          with --naive-req-body-translate, --views-dir provider-dev/views,
          --provider-config '{"auth":{"type":"custom","location":"header",
          "name":"x-goog-api-key","credentialsenvvar":"GEMINI_API_KEY"}}'
          and --servers '[{"url":"https://generativelanguage.googleapis.com"}]'
post-pass custom script (factory/post-pass.mjs):
            - `objectKey` on list envelopes (discovery lists wrap in a named
              array property, e.g. `$.models`, `$.tunedModels`, `$.files` -
              detect structurally per response schema, do not hardcode)
            - pagination config on pageToken lists (policy below)
            - LIMIT pushdown config on pageSize params (policy below)
            - `response.schema_override` EXEC envelope where required (rule 8)
guards    CI hard-fails (below)
```

Every step is an npm script; `npm run build` chains them. Mirror the Anthropic
`package.json` script names (`locate`, `download`, `prepass`, `split`, `normalize`,
`analyze`, `generate`, `guards`, `build`, `test-meta-routes`, `smoke`, `smoke-live`,
`docgen`, `check-doc-examples`) minus the `-admin` variants - there is no second
provider here.

## Auth

```yaml
config:
  auth:
    type: custom
    location: header
    name: x-goog-api-key
    credentialsenvvar: GEMINI_API_KEY
```

- `type: custom` is REQUIRED - `type: api_key` puts `api_key <key>` in the
  Authorization header regardless of location/name **(verified)**.
- The API also accepts `?key=` in the query string; we never use or document it
  (keys in URLs leak into logs).
- All development, smoke-live and CI-live runs require `GEMINI_API_KEY` set in the
  environment. Mock-mode smoke tests must REJECT requests without the header (401)
  to prove the wire contract.

## Control plane scope - the collapse, and its boundary

"One provider" means: everything reachable with `GEMINI_API_KEY` on
`generativelanguage.googleapis.com` ships in `gemini`. That includes the management
resources that would look like a separate admin surface elsewhere - tuned model CRUD
and permissions, corpora permissions, file and cache lifecycle, operations. This is
the collapse, and it holds because the credential and host are uniform.

What does NOT ship in `gemini`: GCP-side control plane - billing (`cloudbilling`),
quota (`serviceusage` / `cloudquotas`), key management (`apikeys`), IAM
(`iam` / `cloudresourcemanager`). Different hosts, OAuth/ADC credentials, and a
StackQL provider carries ONE auth config. These already exist (or belong) in the
`google` provider; StackQL does cross-provider joins, so the product answer is
**documented views and doc pages that join `gemini` to `google.*`**, not duplicated
services under an auth config that cannot call them.

Decision gate (Phase 0): if a per-service auth override mechanism is verified in the
target stackql version, revisit embedding the GCP services. Until then the position
above stands. Do not soft-launch GCP services into `gemini` "for completeness" -
guard 1 (coverage diff) treats the discovery doc as the universe, and anything
outside it is out of scope by construction.

Note in the docs: some `tunedModels` / `corpora` permission operations may require
OAuth rather than an API key server-side **(gemini: verify)**. If verified live,
either exclude them (documented) or ship them with an explicit doc callout - do not
leave silently broken methods in the provider.

## Output rules

### 1. No polymorphism; flat SQL-result-set rows

Final specs contain zero anyOf/oneOf/allOf/additionalProperties. One level of named
properties; deeper structures are JSON columns. Enforced by guard 4.

### 2. Pagination - pageToken lists get config **(gemini: verify)**

Google list methods use `pageSize`/`pageToken` -> `nextPageToken`, and
`nextPageToken` is absent/empty on the final page - the safe cursor shape. Stamp
`config.pagination: {requestToken: {key: pageToken, location: query}, responseToken:
{key: $.nextPageToken, location: body}}` on every list matching the pattern
(detected structurally in post-pass, no hand list). Wire-verify multi-page walk in
the smoke mock before marking this (verified). Any list NOT matching the pattern
gets no pagination config and a documented reason.

### 3. LIMIT pushdown + paging-param suppression **(verified)**

Every method with a `pageSize` query param gets `config.queryParamPushdown: {top:
{paramName: pageSize, maxValue: <schema maximum, when declared>}}`. Client-side
LIMIT stays authoritative; this is a fetch optimisation. scrub-docs then suppresses
`pageToken` (auto-pagination owns it) and `pageSize` (SQL LIMIT owns it) from user
docs, derived from the stamped configs, not hardcoded.

### 4. Request bodies - naive translator **(verified)**

Every body-bearing method: `request.mediaType: application/json` + `config:
{requestBodyTranslate: {algorithm: naive}}`. SQL keys pass straight into the JSON
body, required body fields surface without `data__` prefixes, and JSON-typed values
fan out (`contents = '[{"parts":[{"text":"..."}]}]'` arrives as a real array).

### 5. SQL-verb mapping

`create -> INSERT`, `get/list -> SELECT`, `patch/update -> UPDATE`,
`delete -> DELETE`. Inference ops whose response IS a result set -> SELECT:
`generateContent`, `countTokens`, `embedContent`, `batchEmbedContents`
(Anthropic precedent: `messages.create` is SELECT). Lifecycle/RPC ops
(`cancel`, `transferOwnership`, batch state changes) -> EXEC. Streaming, bidi and
multipart ops do not get verbs - they are excluded or EXEC per the policies below.

### 6. Exclusions (documented in factory/exclusions.yaml, balanced by guard 1)

- **Bidi/live methods** (`BidiGenerateContent` / live API): WebSocket/gRPC only,
  not expressible over REST. Excluded.
- **SSE streaming variants** (`streamGenerateContent` and any `alt=sse` op):
  excluded, same policy as Anthropic's 2 SSE endpoints. Unary `generateContent`
  is the SELECT surface.
- **Resumable/multipart upload** (`media.upload`, `/upload/v1beta/...` paths):
  stackql v0.10.542 rejects multipart dispatch ("media type not supported") -
  excluded or EXEC-mapped with a documented caveat, never INSERT **(verified
  policy, gemini: verify the path shapes)**.
- **`/v1beta/openai/*` compat shim** (if present in the discovery doc): excluded -
  it duplicates the native surface in a foreign dialect.

### 7. ONE select shape per resource

Methods with different response schemas must not share a resource - split into
separate resources in the CSV (e.g. `generateContent` -> `contents` or similar vs
`countTokens` -> `token_counts`, mirroring the Anthropic messages/token_counts
split). Enforced by guard 2.

### 8. EXEC schema_override envelope **(verified)**

stackql v0.10.542 SIGSEGVs on EXEC prepare when the method's response schema has no
array-typed property, and fails dispatch on bare-scalar responses. Post-pass stamps
`response.schema_override` -> a synthetic `StackqlExecResult` envelope (object with
an array property) on every exec-only method matching either shape. Mechanical, no
hand list. Re-check whether the target stackql version still needs this before
carrying it forward.

### 9. Header defaults **(verified)**

An optional (`required: false`) HEADER param's `schema.default` is auto-injected
when not supplied in SQL; query-param defaults are NOT injected; a `required: true`
header param must be satisfied in every WHERE clause - never ship one. (Gemini has
no equivalent of `anthropic-version`, so this is mostly a guard against converter
artefacts.)

### 10. Reserved-word and grammar check

Every service/resource/method name must survive
`SHOW METHODS IN gemini.<service>.<resource>` in stackql's SQL parser.
Known engine trap: `work` (COMMIT WORK). Watch converter-emitted names like
`operations.list` collisions and anything colliding with SQL keywords.

### 11. YAML 1.1 booleans **(verified)**

stackql's Go YAML parser is YAML 1.1 - quote `y/yes/no/on/off` when they appear as
strings or keys.

### 12. MDX-safe descriptions

Single-line; HTML stripped; bare `<placeholders>` and `{braces}` backticked.
Bracketed identifiers (if any survive conversion) are DOUBLE-QUOTED in SQL samples,
not backticked **(verified)**.

## Taxonomy

NOT pre-agreed. Phase 0 enumerates the discovery doc's resource tree and proposes
the service/resource taxonomy for explicit confirmation before the CSV review.
Expected top-level resources based on the published surface (confirm against the
vendored doc, do not trust this list): `models`, `tunedModels` (+ `permissions`),
`files`, `cachedContents`, `corpora` (+ `documents`, `chunks`, `permissions`),
`media`, `batches`, `interactions`, `operations` (`generatedFiles` if present).
v1beta moves quickly - the `interactions` surface is new; make sure the vendored
revision includes it, and treat any resource present in the doc but absent from
this list as in-scope by default (guard 1 will force the conversation).

## Views

Convenience views live in `provider-dev/views/<service>/views.yaml`
(hand-authored, committed), spliced in via `generate --views-dir`. Stanza per view:
`name`, `id`, `config.docs.fields`, `config.views.select` with dialect-predicated
DDL (`sqlDialect == "sqlite3"` primary, `postgres` fallback;
`JSON_EXTRACT('$.a.b')` <-> `json_extract_path_text(col::json,'a','b')`).
Planned first views:
- `gemini.models.vw_model_capabilities` - capability/limit flags fanned out of the
  model JSON columns (mirrors `anthropic.models.vw_model_capabilities`).
- Cross-provider control-plane views documented on the website (joins to
  `google.cloudbilling` / `google.serviceusage`) - these live in doc pages, not in
  the provider, since they reference a second provider's auth.

## Build guards (CI hard-fails)

1. **Spec-coverage diff**: discovery doc ops minus provider ops must equal EXACTLY
   the documented exclusion list (factory/exclusions.yaml).
2. **Select-shape consistency**: within a resource, all SELECT methods project the
   same column set.
3. **Signature uniqueness**: within (resource, sqlVerb), no two methods share a
   required-params signature; clashes relocate via CSV (preferred) or demote to EXEC.
4. **No-polymorphism scan**: zero anyOf/oneOf/allOf/additionalProperties in
   generated services.
5. **Revision drift check**: fail regen when the upstream discovery `revision`
   differs from the vendored snapshot.
6. **Zero-column selects**: every SELECT-routed method projects >= 1 column.
7. **Docs examples are tested**: every sql block on the docs index must match,
   modulo whitespace, an `.iql` under `tests/queries` (exemptions by heading, with
   reasons, in the check script).

## Tests

- **Meta routes** (must pass): pgwire harness walks every service/resource/method
  (SHOW SERVICES/RESOURCES/METHODS + DESCRIBE EXTENDED), owns the server lifecycle,
  zero errors. Archetype: stackql-registry/stackql-provider-aws
  `bin/test-meta-routes.cjs`.
- **Smoke** (manifest-driven): mock mode default - a local mock that rejects wire
  contract violations (missing `x-goog-api-key` -> 401) and serves a 2-page
  `nextPageToken` list to prove auto-pagination walks; suite copies the generated
  registry to a temp dir and rewrites `servers:` to the mock. Mocks must parse
  request URLs, not string-match them (stackql appends a bare `?` when no query
  params are supplied **(verified)**). Live mode gated on `GEMINI_API_KEY`;
  live tests are READ-ONLY plus cheap inference (`countTokens` against a flash
  model; no paid `generateContent` in CI without explicit opt-in).

## Phase 0 spike (before any bulk work)

Walk ONE service end-to-end: locate -> download -> convert -> pre-pass -> split ->
normalize -> analyze -> CSV review -> generate -> post-pass -> stackql load ->
meta routes -> mock SELECTs. Use `models` + `generateContent` as the walk. Pin in
this file when done: stackql version, provider-utils version, discovery `revision`,
whether the EXEC envelope workaround (rule 8) and the docgen patch are still needed,
the pagination pattern (rule 2) promoted to (verified), the OAuth-only method list
(control plane note), and the confirmed taxonomy. Findings land HERE, marked
(verified) with dates - the next session must not re-derive them.

## Website - one, Netlify

One Docusaurus site (`gemini-provider.stackql.io`), vendored shared config
(stackql/docusaurus-config cloned to `.shared-config` at build), docgen via
provider-utils `generate-docs-v2`, `sharp` pinned `^0.33` via resolutions.
Netlify builds the site (deploy previews on PRs); CI carries NO website jobs.
Docs must state plainly: this provider covers the Gemini API surface under
`GEMINI_API_KEY`; billing, quota, key management and IAM are `google` provider
services, with worked cross-provider join examples on a dedicated page.

## Directory structure

```
.
|-- CLAUDE.md
|-- factory/                 # pipeline scripts (locate, download, pre-pass,
|                            #   service-map, scrub-unions, post-pass, guards,
|                            #   exclusions.yaml, scrub-docs, check-doc-examples)
|-- provider-dev/
|   |-- downloaded/          # vendored discovery doc (committed)
|   |-- source/              # converted + split/normalized specs
|   |-- config/              # all_services.csv (reviewed, committed, append-only)
|   |-- openapi/src/gemini/  # generated provider (v00.00.00000)
|   |-- views/               # hand-authored views
|   `-- docgen/provider-data # headerContent1.txt / headerContent2.txt
|-- bin/                     # test-meta-routes.cjs
|-- tests/                   # smoke.cjs, manifest.yaml, queries/*.iql, mock
|-- website/                 # docusaurus site
`-- package.json             # npm scripts wrap every factory step
```

## House style (repo-wide)

Australian spelling. No em dashes (hyphens only), no non-ASCII arrows (use `->`),
plain ASCII punctuation. No hyperbole. Commit messages and docs are matter-of-fact.

## Phase 0 findings (pinned 2026-07-31)

The spike ran the FULL pipeline (all services, not just `models`) end-to-end:
locate -> download -> convert -> pre-pass -> split -> normalize -> analyze ->
CSV review -> generate -> post-pass -> guards -> stackql load -> meta routes ->
mock smoke. Do not re-derive any of the following.

- **stackql**: v0.10.559 Linux (pinned binary at repo root, run under WSL).
- **provider-utils**: 0.7.7.
- **discovery revision**: 20260729 (pinned in factory/spec-snapshot.json,
  vendored in provider-dev/downloaded/gemini-discovery.json). 80 ops, 210
  schemas. The `interactions` surface is NOT in this revision (the earlier
  surface list in this file predated the vendored doc); neither are corpora
  `documents`/`chunks` (documents live under `fileSearchStores` now). New
  surfaces present instead: `fileSearchStores`, `dynamic`, `auth_tokens`,
  `generatedFiles`.
- **Converter**: `stackql/google-discovery-to-openapi` is NOT usable as a
  seeded CLI (hardwired provider allowlist, directory-driven). Its conversion
  semantics are reimplemented in factory/convert.mjs (from commit 809d826);
  deviations documented in the script header. (verified)
- **EXEC envelope (rule 8) still needed at v0.10.559** (verified 2026-07-31):
  the v0.10.542 SIGSEGV is gone but an exec-only method whose response schema
  has no array-typed property hard-fails dispatch with
  "analyzeUnarySelection(): schema unsuitable for select query". The
  post-pass schema_override envelope fixes it (11 methods stamped).
- **Docgen patch still needed at provider-utils 0.7.7** (verified): docgen
  `getRequiredBodyParams` allowlist still lacks 'select';
  factory/patch-provider-utils.mjs carries the fix (npm postinstall).
- **Pagination (rule 2) promoted to (verified)** 2026-07-31: mock serves
  models in 2 pageToken pages (3+2, nextPageToken absent on the final page);
  `models_list_paginated` returns all 5 rows and terminates. 13 pageToken
  lists carry the config, stamped structurally in post-pass.
- **objectKey detection**: structural rule is "200 envelope has nextPageToken
  plus exactly ONE array-typed property, ignoring the google.longrunning
  `unreachable` list" (ListOperationsResponse carries operations +
  unreachable). 13 lists stamped.
- **Guard 4 is a structural scan, not a text scan**: the Gemini `Schema` type
  has a PROPERTY literally named `anyOf` (it embeds JSON Schema as data);
  keys directly under a `properties` map are exempt.
- **Discovery quirks handled in pre-pass**: 26 `type: any` members (Operation
  metadata/response et al) -> opaque string; global boilerplate params (incl.
  `key`) never emitted by convert, with a pre-pass tripwire; no 3.1-isms.
- **Taxonomy (confirmed)**: 10 services, one per surviving top-level
  discovery resource: models, tuned_models, files, generated_files,
  cached_contents, corpora, file_search_stores, batches, auth_tokens,
  dynamic (`media` disappears - both methods are excluded upload paths).
  32 resources; inference split per response shape (content, token_counts,
  embeddings, batch_embeddings, answers, predictions); legacy PaLM ops
  (generateText/generateMessage/embedText/batchEmbedText/countTextTokens/
  countMessageTokens) are exec-only on `text`/`messages` resources; batches
  update ops live on generate_content_batches / embed_content_batches
  (response shapes and guard-3 signatures both force the split).
- **Exclusions (guard 1 contract)**: exactly 5 - 3 SSE streaming variants
  (models/tunedModels/dynamic streamGenerateContent), 2 upload paths
  (media.upload POST /v1beta/files, media.uploadToFileSearchStore). No bidi
  methods and no /openai/* shim exist in the discovery doc.
- **Reserved words**: all 75 method routes pass SHOW/DESCRIBE (meta-routes
  walk, zero errors) - `text` is safe as a resource name.
- **Mock smoke**: 17/17 green (auth 401, no key-in-URL, body fan-out, cursor
  walk, INSERT RETURNING, DELETE, EXEC envelope, view).
- **Live smoke**: pending - GEMINI_API_KEY is only present in the user's
  interactive WSL session (no profile file, not inherited by build shells).
  `make smoke-live` sources a git-ignored `.env` if present. The OAuth-only
  question for tunedModels/corpora permissions ops remains (gemini: verify)
  until a live run.
