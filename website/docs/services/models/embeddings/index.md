---
title: embeddings
hide_title: false
hide_table_of_contents: false
keywords:
  - embeddings
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

Creates, updates, deletes, gets or lists an <code>embeddings</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="embeddings" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.embeddings" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="embed_content"
    values={[
        { label: 'embed_content', value: 'embed_content' }
    ]}
>
<TabItem value="embed_content">

<SchemaTable fields={[
  {
    "name": "embedding",
    "type": "object",
    "description": "Output only. The embedding generated from the input content.",
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
    <td><a href="#embed_content"><CopyableCode code="embed_content" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td><a href="#parameter-content"><code>content</code></a>, <a href="#parameter-taskType"><code>taskType</code></a>, <a href="#parameter-title"><code>title</code></a>, <a href="#parameter-model"><code>model</code></a>, <a href="#parameter-embedContentConfig"><code>embedContentConfig</code></a>, <a href="#parameter-outputDimensionality"><code>outputDimensionality</code></a></td>
    <td>Generates a text embedding vector from the input `Content` using the specified [Gemini Embedding model](https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding).</td>
</tr>
<tr>
    <td><a href="#async_batch_embed_content"><CopyableCode code="async_batch_embed_content" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Enqueues a batch of `EmbedContent` requests for batch processing. We have a `BatchEmbedContents` handler in `GenerativeService`, but it was synchronized. So we name this one to be `Async` to avoid confusion.</td>
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
<tr id="parameter-content">
    <td><CopyableCode code="content" /></td>
    <td><code>object</code></td>
    <td>The base structured datatype containing multi-part content of a message. A `Content` includes a `role` field designating the producer of the `Content` and a `parts` field containing multi-part data that contains the content of the message turn.</td>
</tr>
<tr id="parameter-embedContentConfig">
    <td><CopyableCode code="embedContentConfig" /></td>
    <td><code>object</code></td>
    <td>Configurations for the EmbedContent request.</td>
</tr>
<tr id="parameter-model">
    <td><CopyableCode code="model" /></td>
    <td><code>string</code></td>
    <td>Required. The model's resource name. This serves as an ID for the Model to use. This name should match a model name returned by the `ListModels` method. Format: `models/&#123;model&#125;`</td>
</tr>
<tr id="parameter-outputDimensionality">
    <td><CopyableCode code="outputDimensionality" /></td>
    <td><code>integer</code></td>
    <td>Optional. Deprecated: Please use EmbedContentConfig.output_dimensionality instead. Optional reduced dimension for the output embedding. If set, excessive values in the output embedding are truncated from the end. Supported by newer models since 2024 only. You cannot set this value if using the earlier model (`models/embedding-001`).</td>
</tr>
<tr id="parameter-taskType">
    <td><CopyableCode code="taskType" /></td>
    <td><code>string</code></td>
    <td>Optional. Deprecated: Please use EmbedContentConfig.task_type instead. Optional task type for which the embeddings will be used. Not supported on earlier models (`models/embedding-001`).</td>
</tr>
<tr id="parameter-title">
    <td><CopyableCode code="title" /></td>
    <td><code>string</code></td>
    <td>Optional. Deprecated: Please use EmbedContentConfig.title instead. An optional title for the text. Only applicable when TaskType is `RETRIEVAL_DOCUMENT`. Note: Specifying a `title` for `RETRIEVAL_DOCUMENT` provides better quality embeddings for retrieval.</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="embed_content"
    values={[
        { label: 'embed_content', value: 'embed_content' }
    ]}
>
<TabItem value="embed_content">

Generates a text embedding vector from the input `Content` using the specified [Gemini Embedding model](https://ai.google.dev/gemini-api/docs/models/gemini#text-embedding).

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
embedding,
usageMetadata
FROM gemini.models.embeddings
WHERE modelsId = '{{ modelsId }}' -- required
AND content = '{{ content }}'
AND taskType = '{{ taskType }}'
AND title = '{{ title }}'
AND model = '{{ model }}'
AND embedContentConfig = '{{ embedContentConfig }}'
AND outputDimensionality = '{{ outputDimensionality }}'
;
```
</TabItem>
<TabItem value="example">

```sql
SELECT
JSON_EXTRACT(embedding, '$.values[0]') AS first_dimension
FROM gemini.models.embeddings
WHERE modelsId = 'gemini-embedding-001'
AND content = '{"parts":[{"text":"stackql lets you query cloud APIs with SQL"}]}'
;
```
</TabItem>
</Tabs>
</TabItem>
</Tabs>


## Lifecycle Methods

<Tabs
    defaultValue="async_batch_embed_content"
    values={[
        { label: 'async_batch_embed_content', value: 'async_batch_embed_content' }
    ]}
>
<TabItem value="async_batch_embed_content">

Enqueues a batch of `EmbedContent` requests for batch processing. We have a `BatchEmbedContents` handler in `GenerativeService`, but it was synchronized. So we name this one to be `Async` to avoid confusion.

```sql
EXEC gemini.models.embeddings.async_batch_embed_content 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"batch": "{{ batch }}"
}'
;
```
</TabItem>
</Tabs>
