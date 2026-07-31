---
title: vw_model_capabilities
hide_title: false
hide_table_of_contents: false
keywords:
  - vw_model_capabilities
  - models
  - gemini
  - infrastructure-as-code
  - configuration-as-data
  - cloud inventory
description: Query, deploy and manage gemini resources using SQL
custom_edit_url: null
image: /img/stackql-gemini-provider-featured-image.png
---

import CopyableCode from '@site/src/components/CopyableCode/CopyableCode';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaTable from '@site/src/components/SchemaTable/SchemaTable';

Creates, updates, deletes, gets or lists a <code>vw_model_capabilities</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="vw_model_capabilities" /></td></tr>
<tr><td><b>Type</b></td><td>View</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.vw_model_capabilities" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by this view:

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><CopyableCode code="name" /></td>
    <td><CopyableCode code="string" /></td>
    <td>Model resource name, e.g. `models/gemini-2.5-flash`.</td>
</tr>
<tr>
    <td><CopyableCode code="display_name" /></td>
    <td><CopyableCode code="string" /></td>
    <td>Human-readable name of the model.</td>
</tr>
<tr>
    <td><CopyableCode code="version" /></td>
    <td><CopyableCode code="string" /></td>
    <td>Model version string.</td>
</tr>
<tr>
    <td><CopyableCode code="input_token_limit" /></td>
    <td><CopyableCode code="integer" /></td>
    <td>Maximum number of input tokens allowed.</td>
</tr>
<tr>
    <td><CopyableCode code="output_token_limit" /></td>
    <td><CopyableCode code="integer" /></td>
    <td>Maximum number of output tokens available.</td>
</tr>
<tr>
    <td><CopyableCode code="supports_generate_content" /></td>
    <td><CopyableCode code="boolean" /></td>
    <td>Whether the model supports `generateContent`.</td>
</tr>
<tr>
    <td><CopyableCode code="supports_count_tokens" /></td>
    <td><CopyableCode code="boolean" /></td>
    <td>Whether the model supports `countTokens`.</td>
</tr>
<tr>
    <td><CopyableCode code="supports_embed_content" /></td>
    <td><CopyableCode code="boolean" /></td>
    <td>Whether the model supports `embedContent`.</td>
</tr>
<tr>
    <td><CopyableCode code="supports_batching" /></td>
    <td><CopyableCode code="boolean" /></td>
    <td>Whether the model supports `batchGenerateContent`.</td>
</tr>
<tr>
    <td><CopyableCode code="supports_caching" /></td>
    <td><CopyableCode code="boolean" /></td>
    <td>Whether the model supports `createCachedContent`.</td>
</tr>
<tr>
    <td><CopyableCode code="thinking" /></td>
    <td><CopyableCode code="boolean" /></td>
    <td>Whether the model supports extended thinking.</td>
</tr>
<tr>
    <td><CopyableCode code="temperature" /></td>
    <td><CopyableCode code="number" /></td>
    <td>Default sampling temperature.</td>
</tr>
<tr>
    <td><CopyableCode code="max_temperature" /></td>
    <td><CopyableCode code="number" /></td>
    <td>Maximum sampling temperature the model accepts.</td>
</tr>
<tr>
    <td><CopyableCode code="top_p" /></td>
    <td><CopyableCode code="number" /></td>
    <td>Default nucleus sampling probability mass.</td>
</tr>
<tr>
    <td><CopyableCode code="top_k" /></td>
    <td><CopyableCode code="integer" /></td>
    <td>Default top-k sampling cutoff.</td>
</tr>
</tbody>
</table>

## `SELECT` Examples

```sql
SELECT
  name,
  display_name,
  version,
  input_token_limit,
  output_token_limit,
  supports_generate_content,
  supports_count_tokens,
  supports_embed_content,
  supports_batching,
  supports_caching,
  thinking,
  temperature,
  max_temperature,
  top_p,
  top_k
FROM gemini.models.vw_model_capabilities;
```

## SQL Definition

<Tabs
defaultValue="Sqlite3"
values={[
{ label: 'Sqlite3', value: 'Sqlite3' },
{ label: 'Postgres', value: 'Postgres' }
]}
>
<TabItem value="Sqlite3">

```sql
SELECT
  name,
  displayName AS display_name,
  version,
  inputTokenLimit AS input_token_limit,
  outputTokenLimit AS output_token_limit,
  CASE WHEN supportedGenerationMethods LIKE '%generateContent%' THEN 1 ELSE 0 END AS supports_generate_content,
  CASE WHEN supportedGenerationMethods LIKE '%countTokens%' THEN 1 ELSE 0 END AS supports_count_tokens,
  CASE WHEN supportedGenerationMethods LIKE '%embedContent%' THEN 1 ELSE 0 END AS supports_embed_content,
  CASE WHEN supportedGenerationMethods LIKE '%batchGenerateContent%' THEN 1 ELSE 0 END AS supports_batching,
  CASE WHEN supportedGenerationMethods LIKE '%createCachedContent%' THEN 1 ELSE 0 END AS supports_caching,
  thinking,
  temperature,
  maxTemperature AS max_temperature,
  topP AS top_p,
  topK AS top_k
FROM gemini.models.models
```

</TabItem>
<TabItem value="Postgres">

```sql
SELECT
  name,
  displayName AS display_name,
  version,
  inputTokenLimit AS input_token_limit,
  outputTokenLimit AS output_token_limit,
  CASE WHEN supportedGenerationMethods LIKE '%generateContent%' THEN 1 ELSE 0 END AS supports_generate_content,
  CASE WHEN supportedGenerationMethods LIKE '%countTokens%' THEN 1 ELSE 0 END AS supports_count_tokens,
  CASE WHEN supportedGenerationMethods LIKE '%embedContent%' THEN 1 ELSE 0 END AS supports_embed_content,
  CASE WHEN supportedGenerationMethods LIKE '%batchGenerateContent%' THEN 1 ELSE 0 END AS supports_batching,
  CASE WHEN supportedGenerationMethods LIKE '%createCachedContent%' THEN 1 ELSE 0 END AS supports_caching,
  thinking,
  temperature,
  maxTemperature AS max_temperature,
  topP AS top_p,
  topK AS top_k
FROM gemini.models.models
```

</TabItem>
</Tabs>
