---
title: models
hide_title: false
hide_table_of_contents: false
keywords:
  - models
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

Creates, updates, deletes, gets or lists a <code>models</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="models" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.models" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="get">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Required. The resource name of the `Model`. Refer to [Model variants](https://ai.google.dev/gemini-api/docs/models/gemini#model-variations) for all allowed values. Format: `models/&#123;model&#125;` with a `&#123;model&#125;` naming convention of: * \"&#123;base_model_id&#125;-&#123;version&#125;\" Examples: * `models/gemini-1.5-flash-001`"
  },
  {
    "name": "baseModelId",
    "type": "string",
    "description": "Required. The name of the base model, pass this to the generation request. Examples: * `gemini-1.5-flash`"
  },
  {
    "name": "description",
    "type": "string",
    "description": "A short description of the model."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "The human-readable name of the model. E.g. \"Gemini 1.5 Flash\". The name can be up to 128 characters long and can consist of any UTF-8 characters."
  },
  {
    "name": "inputTokenLimit",
    "type": "integer (int32)",
    "description": "Maximum number of input tokens allowed for this model."
  },
  {
    "name": "maxTemperature",
    "type": "number (float)",
    "description": "The maximum temperature this model can use."
  },
  {
    "name": "outputTokenLimit",
    "type": "integer (int32)",
    "description": "Maximum number of output tokens available for this model."
  },
  {
    "name": "supportedGenerationMethods",
    "type": "array",
    "description": "The model's supported generation methods. The corresponding API method names are defined as Pascal case strings, such as `generateMessage` and `generateContent`."
  },
  {
    "name": "temperature",
    "type": "number (float)",
    "description": "Controls the randomness of the output. Values can range over `[0.0,max_temperature]`, inclusive. A higher value will produce responses that are more varied, while a value closer to `0.0` will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model."
  },
  {
    "name": "thinking",
    "type": "boolean",
    "description": "Whether the model supports thinking."
  },
  {
    "name": "topK",
    "type": "integer (int32)",
    "description": "For Top-k sampling. Top-k sampling considers the set of `top_k` most probable tokens. This value specifies default to be used by the backend while making the call to the model. If empty, indicates the model doesn't use top-k sampling, and `top_k` isn't allowed as a generation parameter."
  },
  {
    "name": "topP",
    "type": "number (float)",
    "description": "For [Nucleus sampling](https://ai.google.dev/gemini-api/docs/prompting-strategies#top-p). Nucleus sampling considers the smallest set of tokens whose probability sum is at least `top_p`. This value specifies default to be used by the backend while making the call to the model."
  },
  {
    "name": "version",
    "type": "string",
    "description": "Required. The version number of the model. This represents the major version (`1.0` or `1.5`)"
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Required. The resource name of the `Model`. Refer to [Model variants](https://ai.google.dev/gemini-api/docs/models/gemini#model-variations) for all allowed values. Format: `models/&#123;model&#125;` with a `&#123;model&#125;` naming convention of: * \"&#123;base_model_id&#125;-&#123;version&#125;\" Examples: * `models/gemini-1.5-flash-001`"
  },
  {
    "name": "baseModelId",
    "type": "string",
    "description": "Required. The name of the base model, pass this to the generation request. Examples: * `gemini-1.5-flash`"
  },
  {
    "name": "description",
    "type": "string",
    "description": "A short description of the model."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "The human-readable name of the model. E.g. \"Gemini 1.5 Flash\". The name can be up to 128 characters long and can consist of any UTF-8 characters."
  },
  {
    "name": "inputTokenLimit",
    "type": "integer (int32)",
    "description": "Maximum number of input tokens allowed for this model."
  },
  {
    "name": "maxTemperature",
    "type": "number (float)",
    "description": "The maximum temperature this model can use."
  },
  {
    "name": "outputTokenLimit",
    "type": "integer (int32)",
    "description": "Maximum number of output tokens available for this model."
  },
  {
    "name": "supportedGenerationMethods",
    "type": "array",
    "description": "The model's supported generation methods. The corresponding API method names are defined as Pascal case strings, such as `generateMessage` and `generateContent`."
  },
  {
    "name": "temperature",
    "type": "number (float)",
    "description": "Controls the randomness of the output. Values can range over `[0.0,max_temperature]`, inclusive. A higher value will produce responses that are more varied, while a value closer to `0.0` will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model."
  },
  {
    "name": "thinking",
    "type": "boolean",
    "description": "Whether the model supports thinking."
  },
  {
    "name": "topK",
    "type": "integer (int32)",
    "description": "For Top-k sampling. Top-k sampling considers the set of `top_k` most probable tokens. This value specifies default to be used by the backend while making the call to the model. If empty, indicates the model doesn't use top-k sampling, and `top_k` isn't allowed as a generation parameter."
  },
  {
    "name": "topP",
    "type": "number (float)",
    "description": "For [Nucleus sampling](https://ai.google.dev/gemini-api/docs/prompting-strategies#top-p). Nucleus sampling considers the smallest set of tokens whose probability sum is at least `top_p`. This value specifies default to be used by the backend while making the call to the model."
  },
  {
    "name": "version",
    "type": "string",
    "description": "Required. The version number of the model. This represents the major version (`1.0` or `1.5`)"
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
    <td><a href="#get"><CopyableCode code="get" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Gets information about a specific `Model` such as its version number, token limits, [parameters](https://ai.google.dev/gemini-api/docs/models/generative-models#model-parameters) and other metadata. Refer to the [Gemini models guide](https://ai.google.dev/gemini-api/docs/models/gemini) for detailed model information.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td></td>
    <td>Lists the [`Model`s](https://ai.google.dev/gemini-api/docs/models/gemini) available through the Gemini API.</td>
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
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="get"
    values={[
        { label: 'get', value: 'get' },
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="get">

Gets information about a specific `Model` such as its version number, token limits, [parameters](https://ai.google.dev/gemini-api/docs/models/generative-models#model-parameters) and other metadata. Refer to the [Gemini models guide](https://ai.google.dev/gemini-api/docs/models/gemini) for detailed model information.

```sql
SELECT
name,
baseModelId,
description,
displayName,
inputTokenLimit,
maxTemperature,
outputTokenLimit,
supportedGenerationMethods,
temperature,
thinking,
topK,
topP,
version
FROM gemini.models.models
WHERE modelsId = '{{ modelsId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists the [`Model`s](https://ai.google.dev/gemini-api/docs/models/gemini) available through the Gemini API.

```sql
SELECT
name,
baseModelId,
description,
displayName,
inputTokenLimit,
maxTemperature,
outputTokenLimit,
supportedGenerationMethods,
temperature,
thinking,
topK,
topP,
version
FROM gemini.models.models
;
```
</TabItem>
</Tabs>
