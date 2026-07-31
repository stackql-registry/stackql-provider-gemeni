---
title: gemini
hide_title: false
hide_table_of_contents: false
keywords:
  - gemini
  - google
  - generative language
  - stackql
  - infrastructure-as-code
  - configuration-as-data
  - cloud inventory
description: Query and interact with the Google Gemini API using SQL
custom_edit_url: null
image: /img/stackql-cover.png
id: 'provider-intro'
---

import CopyableCode from '@site/src/components/CopyableCode/CopyableCode';

Run Gemini inference, count tokens, generate embeddings, and manage models, tuned models, files, cached contents, corpora, file search stores and batches on the Google Gemini API (`generativelanguage.googleapis.com`) using SQL.

:::info

This provider covers the Gemini API surface reachable with a <CopyableCode code="GEMINI_API_KEY" />. Billing, quota, API key management and IAM are GCP control-plane services (`cloudbilling`, `serviceusage`, `apikeys`, `iam`) that authenticate with OAuth/ADC - they live in the [__`google`__](https://google.stackql.io/) provider. StackQL does cross-provider joins, so the two compose: see [Joining to the GCP control plane](/google-control-plane).

:::


:::info[Provider Summary]

total services: __10__
total resources: __43__

:::

See also:    [[` SHOW `]](https://stackql.io/docs/language-spec/show) [[` DESCRIBE `]](https://stackql.io/docs/language-spec/describe)  [[` REGISTRY `]](https://stackql.io/docs/language-spec/registry)

* * *

## Installation

```bash
REGISTRY PULL gemini;
```

## Authentication

The `gemini` provider authenticates with a Gemini API key sent in the `x-goog-api-key` header. Set the following environment variable:

- <CopyableCode code="GEMINI_API_KEY" /> - a Gemini API key, created in [Google AI Studio](https://aistudio.google.com/apikey)

The key is only ever sent as a request header - never in the URL query string.

## Inference as a result set

Asking Gemini a question is a `SELECT`. The reply comes back as a row, with the text in the `candidates` array and the token spend in `usageMetadata`:

```sql
SELECT
  JSON_EXTRACT(candidates, '$[0].content.parts[0].text') AS reply,
  JSON_EXTRACT(usageMetadata, '$.totalTokenCount') AS total_tokens
FROM gemini.models.content
WHERE modelsId = 'gemini-2.5-flash'
AND contents = '[{"parts":[{"text":"Name the four Galilean moons of Jupiter, comma separated."}]}]';
```

Token counting is free of charge, so a prompt can be priced before it is sent:

```sql
SELECT totalTokens
FROM gemini.models.token_counts
WHERE modelsId = 'gemini-2.5-flash'
AND contents = '[{"parts":[{"text":"Name the four Galilean moons of Jupiter, comma separated."}]}]';
```

## Which model can do what

The `vw_model_capabilities` view fans each model's supported generation methods and limits out into columns, so picking a model for a workload is a `WHERE` clause:

```sql
SELECT name, display_name, input_token_limit, thinking, supports_generate_content
FROM gemini.models.vw_model_capabilities
ORDER BY name;
```

## Batch progress and triage

Batches are long-running operations; their state lives in the `metadata` JSON column:

```sql
SELECT
  name,
  done,
  JSON_EXTRACT(metadata, '$.state') AS state
FROM gemini.batches.batches;
```

## Resource lifecycle

Corpora, cached contents, files and tuned models are managed with the corresponding SQL verbs:

```sql
-- create
INSERT INTO gemini.corpora.corpora (displayName)
SELECT 'my-knowledge-base'
RETURNING name, displayName;

-- read
SELECT name, model FROM gemini.cached_contents.cached_contents;

-- delete
DELETE FROM gemini.cached_contents.cached_contents
WHERE cachedContentsId = 'my-cache-id';

-- lifecycle op on the EXEC surface
EXEC gemini.batches.batches.cancel @batchesId = 'my-batch-id';
```


## Services
<div class="row">
<div class="providerDocColumn">
<a href="/services/auth_tokens/">auth_tokens</a><br />
<a href="/services/batches/">batches</a><br />
<a href="/services/cached_contents/">cached_contents</a><br />
<a href="/services/corpora/">corpora</a><br />
<a href="/services/dynamic/">dynamic</a><br />
</div>
<div class="providerDocColumn">
<a href="/services/file_search_stores/">file_search_stores</a><br />
<a href="/services/files/">files</a><br />
<a href="/services/generated_files/">generated_files</a><br />
<a href="/services/models/">models</a><br />
<a href="/services/tuned_models/">tuned_models</a><br />
</div>
</div>
