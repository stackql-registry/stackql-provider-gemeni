---
title: token_counts
hide_title: false
hide_table_of_contents: false
keywords:
  - token_counts
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

Creates, updates, deletes, gets or lists a <code>token_counts</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="token_counts" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.token_counts" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="count_tokens"
    values={[
        { label: 'count_tokens', value: 'count_tokens' }
    ]}
>
<TabItem value="count_tokens">

<SchemaTable fields={[
  {
    "name": "cachedContentTokenCount",
    "type": "integer (int32)",
    "description": "Number of tokens in the cached part of the prompt (the cached content)."
  },
  {
    "name": "cacheTokensDetails",
    "type": "array",
    "description": "Output only. List of modalities that were processed in the cached content.",
    "children": [
      {
        "name": "modality",
        "type": "string",
        "description": "The modality associated with this token count. (MODALITY_UNSPECIFIED, TEXT, IMAGE, VIDEO, AUDIO, DOCUMENT)"
      },
      {
        "name": "tokenCount",
        "type": "integer (int32)",
        "description": "Number of tokens."
      }
    ]
  },
  {
    "name": "promptTokensDetails",
    "type": "array",
    "description": "Output only. List of modalities that were processed in the request input.",
    "children": [
      {
        "name": "modality",
        "type": "string",
        "description": "The modality associated with this token count. (MODALITY_UNSPECIFIED, TEXT, IMAGE, VIDEO, AUDIO, DOCUMENT)"
      },
      {
        "name": "tokenCount",
        "type": "integer (int32)",
        "description": "Number of tokens."
      }
    ]
  },
  {
    "name": "totalTokens",
    "type": "integer (int32)",
    "description": "The number of tokens that the `Model` tokenizes the `prompt` into. Always non-negative."
  }
]} />
</TabItem>
</Tabs>

## Methods

The following methods are available for this resource:

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Accessible by</th>
    <th>Required Params</th>
    <th>Optional Params</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr>
    <td><a href="#count_tokens"><CopyableCode code="count_tokens" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td><a href="#parameter-generateContentRequest"><code>generateContentRequest</code></a>, <a href="#parameter-contents"><code>contents</code></a></td>
    <td>Runs a model's tokenizer on input `Content` and returns the token count. Refer to the [tokens guide](https://ai.google.dev/gemini-api/docs/tokens) to learn more about tokens.</td>
</tr>
</tbody>
</table>

## Parameters

Parameters can be passed in the `WHERE` clause of a query. Check the [Methods](#methods) section to see which parameters are required or optional for each operation.

<table>
<thead>
    <tr>
    <th>Name</th>
    <th>Datatype</th>
    <th>Description</th>
    </tr>
</thead>
<tbody>
<tr id="parameter-modelsId">
    <td><CopyableCode code="modelsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-contents">
    <td><CopyableCode code="contents" /></td>
    <td><code>array</code></td>
    <td>Optional. The input given to the model as a prompt. This field is ignored when `generate_content_request` is set.</td>
</tr>
<tr id="parameter-generateContentRequest">
    <td><CopyableCode code="generateContentRequest" /></td>
    <td><code>object</code></td>
    <td>Request to generate a completion from the model.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="count_tokens"
    values={[
        { label: 'count_tokens', value: 'count_tokens' }
    ]}
>
<TabItem value="count_tokens">

Runs a model's tokenizer on input `Content` and returns the token count. Refer to the [tokens guide](https://ai.google.dev/gemini-api/docs/tokens) to learn more about tokens.

<Tabs
    defaultValue="shape"
    values={[
        { label: 'Query Shape', value: 'shape' },
        { label: 'Query Example', value: 'example' }
    ]}
>
<TabItem value="shape">

```sql
SELECT
cacheTokensDetails,
cachedContentTokenCount,
promptTokensDetails,
totalTokens
FROM gemini.models.token_counts
WHERE modelsId = '{{ modelsId }}' -- required
AND generateContentRequest = '{{ generateContentRequest }}'
AND contents = '{{ contents }}'
;
```
</TabItem>
<TabItem value="example">

```sql
SELECT
totalTokens
FROM gemini.models.token_counts
WHERE modelsId = 'gemini-2.5-flash'
AND contents = '[
  {
    "role": "user",
    "parts": [{"text": "how does stackql work?"}]
  }
]'
;
```
</TabItem>
</Tabs>
</TabItem>
</Tabs>
