---
title: batch_embeddings
hide_title: false
hide_table_of_contents: false
keywords:
  - batch_embeddings
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

Creates, updates, deletes, gets or lists a <code>batch_embeddings</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="batch_embeddings" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.batch_embeddings" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="batch_embed_contents"
    values={[
        { label: 'batch_embed_contents', value: 'batch_embed_contents' }
    ]}
>
<TabItem value="batch_embed_contents">

<SchemaTable fields={[
  {
    "name": "embeddings",
    "type": "array",
    "description": "Output only. The embeddings for each request, in the same order as provided in the batch request.",
    "children": [
      {
        "name": "values",
        "type": "array",
        "description": "The embedding values. This is for 3P users only and will not be populated for 1P calls."
      },
      {
        "name": "shape",
        "type": "array",
        "description": "This field stores the soft tokens tensor frame shape (e.g. [1, 1, 256, 2048])."
      }
    ]
  },
  {
    "name": "usageMetadata",
    "type": "object",
    "description": "Output only. The usage metadata for the request.",
    "children": [
      {
        "name": "promptTokenCount",
        "type": "integer (int32)",
        "description": "Output only. Number of tokens in the prompt."
      },
      {
        "name": "promptTokenDetails",
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
      }
    ]
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
    <td><a href="#batch_embed_contents"><CopyableCode code="batch_embed_contents" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td><a href="#parameter-requests"><code>requests</code></a></td>
    <td>Generates multiple embedding vectors from the input `Content` which consists of a batch of strings represented as `EmbedContentRequest` objects.</td>
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
<tr id="parameter-requests">
    <td><CopyableCode code="requests" /></td>
    <td><code>array</code></td>
    <td>Required. Embed requests for the batch. The model in each of these requests must match the model specified `BatchEmbedContentsRequest.model`.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="batch_embed_contents"
    values={[
        { label: 'batch_embed_contents', value: 'batch_embed_contents' }
    ]}
>
<TabItem value="batch_embed_contents">

Generates multiple embedding vectors from the input `Content` which consists of a batch of strings represented as `EmbedContentRequest` objects.

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
embeddings,
usageMetadata
FROM gemini.models.batch_embeddings
WHERE modelsId = '{{ modelsId }}' -- required
AND requests = '{{ requests }}'
;
```
</TabItem>
<TabItem value="example">

```sql
SELECT
embeddings
FROM gemini.models.batch_embeddings
WHERE modelsId = 'gemini-embedding-001'
AND requests = '[
  {"model": "models/gemini-embedding-001", "content": {"parts":[{"text":"first passage"}]}},
  {"model": "models/gemini-embedding-001", "content": {"parts":[{"text":"second passage"}]}}
]'
;
```
</TabItem>
</Tabs>
</TabItem>
</Tabs>
