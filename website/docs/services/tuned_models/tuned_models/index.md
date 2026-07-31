---
title: tuned_models
hide_title: false
hide_table_of_contents: false
keywords:
  - tuned_models
  - tuned_models
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

Creates, updates, deletes, gets or lists a <code>tuned_models</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="tuned_models" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.tuned_models.tuned_models" /></td></tr>
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
    "description": "Output only. The tuned model name. A unique name will be generated on create. Example: `tunedModels/az2mb0bpw6i` If display_name is set on create, the id portion of the name will be set by concatenating the words of the display_name with hyphens and adding a random portion for uniqueness. Example: * display_name = `Sentence Translator` * name = `tunedModels/sentence-translator-u3b7m`"
  },
  {
    "name": "baseModel",
    "type": "string",
    "description": "Immutable. The name of the `Model` to tune. Example: `models/gemini-1.5-flash-001`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp when this model was created."
  },
  {
    "name": "description",
    "type": "string",
    "description": "Optional. A short description of this model."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The name to display for this model in user interfaces. The display name must be up to 40 characters including spaces."
  },
  {
    "name": "readerProjectNumbers",
    "type": "array",
    "description": "Optional. List of project numbers that have read access to the tuned model."
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. The state of the tuned model. (STATE_UNSPECIFIED, CREATING, ACTIVE, FAILED)"
  },
  {
    "name": "temperature",
    "type": "number (float)",
    "description": "Optional. Controls the randomness of the output. Values can range over `[0.0,1.0]`, inclusive. A value closer to `1.0` will produce responses that are more varied, while a value closer to `0.0` will typically result in less surprising responses from the model. This value specifies default to be the one used by the base model while creating the model."
  },
  {
    "name": "topK",
    "type": "integer (int32)",
    "description": "Optional. For Top-k sampling. Top-k sampling considers the set of `top_k` most probable tokens. This value specifies default to be used by the backend while making the call to the model. This value specifies default to be the one used by the base model while creating the model."
  },
  {
    "name": "topP",
    "type": "number (float)",
    "description": "Optional. For Nucleus sampling. Nucleus sampling considers the smallest set of tokens whose probability sum is at least `top_p`. This value specifies default to be the one used by the base model while creating the model."
  },
  {
    "name": "tunedModelSource",
    "type": "object",
    "description": "Optional. TunedModel to use as the starting point for training the new model.",
    "children": [
      {
        "name": "tunedModel",
        "type": "string",
        "description": "Immutable. The name of the `TunedModel` to use as the starting point for training the new model. Example: `tunedModels/my-tuned-model`"
      },
      {
        "name": "baseModel",
        "type": "string",
        "description": "Output only. The name of the base `Model` this `TunedModel` was tuned from. Example: `models/gemini-1.5-flash-001`"
      }
    ]
  },
  {
    "name": "tuningTask",
    "type": "object",
    "description": "Required. The tuning task that creates the tuned model.",
    "children": [
      {
        "name": "trainingData",
        "type": "object",
        "description": "Required. Input only. Immutable. The model training data.",
        "children": [
          {
            "name": "examples",
            "type": "object",
            "description": "Optional. Inline examples with simple input/output text.",
            "children": [
              {
                "name": "examples",
                "type": "array",
                "description": "The examples. Example input can be for text or discuss, but all examples in a set must be of the same type."
              }
            ]
          }
        ]
      },
      {
        "name": "hyperparameters",
        "type": "object",
        "description": "Immutable. Hyperparameters controlling the tuning process. If not provided, default values will be used.",
        "children": [
          {
            "name": "learningRateMultiplier",
            "type": "number (float)",
            "description": "Optional. Immutable. The learning rate multiplier is used to calculate a final learning_rate based on the default (recommended) value. Actual learning rate := learning_rate_multiplier * default learning rate Default learning rate is dependent on base model and dataset size. If not set, a default of 1.0 will be used."
          },
          {
            "name": "batchSize",
            "type": "integer (int32)",
            "description": "Immutable. The batch size hyperparameter for tuning. If not set, a default of 4 or 16 will be used based on the number of training examples."
          },
          {
            "name": "epochCount",
            "type": "integer (int32)",
            "description": "Immutable. The number of training epochs. An epoch is one pass through the training data. If not set, a default of 5 will be used."
          },
          {
            "name": "learningRate",
            "type": "number (float)",
            "description": "Optional. Immutable. The learning rate hyperparameter for tuning. If not set, a default of 0.001 or 0.0002 will be calculated based on the number of training examples."
          }
        ]
      },
      {
        "name": "startTime",
        "type": "string (google-datetime)",
        "description": "Output only. The timestamp when tuning this model started."
      },
      {
        "name": "completeTime",
        "type": "string (google-datetime)",
        "description": "Output only. The timestamp when tuning this model completed."
      },
      {
        "name": "snapshots",
        "type": "array",
        "description": "Output only. Metrics collected during tuning.",
        "children": [
          {
            "name": "step",
            "type": "integer (int32)",
            "description": "Output only. The tuning step."
          },
          {
            "name": "epoch",
            "type": "integer (int32)",
            "description": "Output only. The epoch this step was part of."
          },
          {
            "name": "computeTime",
            "type": "string (google-datetime)",
            "description": "Output only. The timestamp when this metric was computed."
          },
          {
            "name": "meanLoss",
            "type": "number (float)",
            "description": "Output only. The mean loss of the training examples for this step."
          }
        ]
      }
    ]
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp when this model was updated."
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Output only. The tuned model name. A unique name will be generated on create. Example: `tunedModels/az2mb0bpw6i` If display_name is set on create, the id portion of the name will be set by concatenating the words of the display_name with hyphens and adding a random portion for uniqueness. Example: * display_name = `Sentence Translator` * name = `tunedModels/sentence-translator-u3b7m`"
  },
  {
    "name": "baseModel",
    "type": "string",
    "description": "Immutable. The name of the `Model` to tune. Example: `models/gemini-1.5-flash-001`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp when this model was created."
  },
  {
    "name": "description",
    "type": "string",
    "description": "Optional. A short description of this model."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The name to display for this model in user interfaces. The display name must be up to 40 characters including spaces."
  },
  {
    "name": "readerProjectNumbers",
    "type": "array",
    "description": "Optional. List of project numbers that have read access to the tuned model."
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. The state of the tuned model. (STATE_UNSPECIFIED, CREATING, ACTIVE, FAILED)"
  },
  {
    "name": "temperature",
    "type": "number (float)",
    "description": "Optional. Controls the randomness of the output. Values can range over `[0.0,1.0]`, inclusive. A value closer to `1.0` will produce responses that are more varied, while a value closer to `0.0` will typically result in less surprising responses from the model. This value specifies default to be the one used by the base model while creating the model."
  },
  {
    "name": "topK",
    "type": "integer (int32)",
    "description": "Optional. For Top-k sampling. Top-k sampling considers the set of `top_k` most probable tokens. This value specifies default to be used by the backend while making the call to the model. This value specifies default to be the one used by the base model while creating the model."
  },
  {
    "name": "topP",
    "type": "number (float)",
    "description": "Optional. For Nucleus sampling. Nucleus sampling considers the smallest set of tokens whose probability sum is at least `top_p`. This value specifies default to be the one used by the base model while creating the model."
  },
  {
    "name": "tunedModelSource",
    "type": "object",
    "description": "Optional. TunedModel to use as the starting point for training the new model.",
    "children": [
      {
        "name": "tunedModel",
        "type": "string",
        "description": "Immutable. The name of the `TunedModel` to use as the starting point for training the new model. Example: `tunedModels/my-tuned-model`"
      },
      {
        "name": "baseModel",
        "type": "string",
        "description": "Output only. The name of the base `Model` this `TunedModel` was tuned from. Example: `models/gemini-1.5-flash-001`"
      }
    ]
  },
  {
    "name": "tuningTask",
    "type": "object",
    "description": "Required. The tuning task that creates the tuned model.",
    "children": [
      {
        "name": "trainingData",
        "type": "object",
        "description": "Required. Input only. Immutable. The model training data.",
        "children": [
          {
            "name": "examples",
            "type": "object",
            "description": "Optional. Inline examples with simple input/output text.",
            "children": [
              {
                "name": "examples",
                "type": "array",
                "description": "The examples. Example input can be for text or discuss, but all examples in a set must be of the same type."
              }
            ]
          }
        ]
      },
      {
        "name": "hyperparameters",
        "type": "object",
        "description": "Immutable. Hyperparameters controlling the tuning process. If not provided, default values will be used.",
        "children": [
          {
            "name": "learningRateMultiplier",
            "type": "number (float)",
            "description": "Optional. Immutable. The learning rate multiplier is used to calculate a final learning_rate based on the default (recommended) value. Actual learning rate := learning_rate_multiplier * default learning rate Default learning rate is dependent on base model and dataset size. If not set, a default of 1.0 will be used."
          },
          {
            "name": "batchSize",
            "type": "integer (int32)",
            "description": "Immutable. The batch size hyperparameter for tuning. If not set, a default of 4 or 16 will be used based on the number of training examples."
          },
          {
            "name": "epochCount",
            "type": "integer (int32)",
            "description": "Immutable. The number of training epochs. An epoch is one pass through the training data. If not set, a default of 5 will be used."
          },
          {
            "name": "learningRate",
            "type": "number (float)",
            "description": "Optional. Immutable. The learning rate hyperparameter for tuning. If not set, a default of 0.001 or 0.0002 will be calculated based on the number of training examples."
          }
        ]
      },
      {
        "name": "startTime",
        "type": "string (google-datetime)",
        "description": "Output only. The timestamp when tuning this model started."
      },
      {
        "name": "completeTime",
        "type": "string (google-datetime)",
        "description": "Output only. The timestamp when tuning this model completed."
      },
      {
        "name": "snapshots",
        "type": "array",
        "description": "Output only. Metrics collected during tuning.",
        "children": [
          {
            "name": "step",
            "type": "integer (int32)",
            "description": "Output only. The tuning step."
          },
          {
            "name": "epoch",
            "type": "integer (int32)",
            "description": "Output only. The epoch this step was part of."
          },
          {
            "name": "computeTime",
            "type": "string (google-datetime)",
            "description": "Output only. The timestamp when this metric was computed."
          },
          {
            "name": "meanLoss",
            "type": "number (float)",
            "description": "Output only. The mean loss of the training examples for this step."
          }
        ]
      }
    ]
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp when this model was updated."
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
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td></td>
    <td>Gets information about a specific TunedModel.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td><a href="#parameter-filter"><code>filter</code></a></td>
    <td>Lists created tuned models.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td><a href="#parameter-tunedModelId"><code>tunedModelId</code></a></td>
    <td>Creates a tuned model. Check intermediate tuning progress (if any) through the [google.longrunning.Operations] service. Access status and results through the Operations service. Example: GET /v1/tunedModels/az2mb0bpw6i/operations/000-111-222</td>
</tr>
<tr>
    <td><a href="#patch"><CopyableCode code="patch" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td><a href="#parameter-updateMask"><code>updateMask</code></a></td>
    <td>Updates a tuned model.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td></td>
    <td>Deletes a tuned model.</td>
</tr>
<tr>
    <td><a href="#transfer_ownership"><CopyableCode code="transfer_ownership" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td></td>
    <td>Transfers ownership of the tuned model. This is the only way to change ownership of the tuned model. The current owner will be downgraded to writer role.</td>
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
<tr id="parameter-tunedModelsId">
    <td><CopyableCode code="tunedModelsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-filter">
    <td><CopyableCode code="filter" /></td>
    <td><code>string</code></td>
    <td>Optional. A filter is a full text search over the tuned model's description and display name. By default, results will not include tuned models shared with everyone. Additional operators: - owner:me - writers:me - readers:me - readers:everyone Examples: "owner:me" returns all tuned models to which caller has owner role "readers:me" returns all tuned models to which caller has reader role "readers:everyone" returns all tuned models that are shared with everyone</td>
</tr>
<tr id="parameter-tunedModelId">
    <td><CopyableCode code="tunedModelId" /></td>
    <td><code>string</code></td>
    <td>Optional. The unique id for the tuned model if specified. This value should be up to 40 characters, the first character must be a letter, the last could be a letter or a number. The id must match the regular expression: `[a-z]([a-z0-9-]&#123;0,38&#125;[a-z0-9])?`.</td>
</tr>
<tr id="parameter-updateMask">
    <td><CopyableCode code="updateMask" /></td>
    <td><code>string (google-fieldmask)</code></td>
    <td>Optional. The list of fields to update.</td>
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

Gets information about a specific TunedModel.

```sql
SELECT
name,
baseModel,
createTime,
description,
displayName,
readerProjectNumbers,
state,
temperature,
topK,
topP,
tunedModelSource,
tuningTask,
updateTime
FROM gemini.tuned_models.tuned_models
WHERE tunedModelsId = '{{ tunedModelsId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists created tuned models.

```sql
SELECT
name,
baseModel,
createTime,
description,
displayName,
readerProjectNumbers,
state,
temperature,
topK,
topP,
tunedModelSource,
tuningTask,
updateTime
FROM gemini.tuned_models.tuned_models
WHERE filter = '{{ filter }}'
;
```
</TabItem>
</Tabs>


## `INSERT` examples

<Tabs
    defaultValue="create"
    values={[
        { label: 'create', value: 'create' },
        { label: 'Manifest', value: 'manifest' }
    ]}
>
<TabItem value="create">

Creates a tuned model. Check intermediate tuning progress (if any) through the [google.longrunning.Operations] service. Access status and results through the Operations service. Example: GET /v1/tunedModels/az2mb0bpw6i/operations/000-111-222

```sql
INSERT INTO gemini.tuned_models.tuned_models (
description,
tuningTask,
displayName,
temperature,
tunedModelSource,
topP,
topK,
readerProjectNumbers,
baseModel,
tunedModelId
)
SELECT 
'{{ description }}',
'{{ tuningTask }}',
'{{ displayName }}',
{{ temperature }},
'{{ tunedModelSource }}',
{{ topP }},
{{ topK }},
'{{ readerProjectNumbers }}',
'{{ baseModel }}',
'{{ tunedModelId }}'
RETURNING
name,
done,
error,
metadata,
response
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: tuned_models
  props:
    - name: description
      value: "{{ description }}"
      description: |
        Optional. A short description of this model.
    - name: tuningTask
      description: |
        Required. The tuning task that creates the tuned model.
      value:
        trainingData:
          examples:
            examples:
              - output: "{{ output }}"
                textInput: "{{ textInput }}"
        hyperparameters:
          learningRateMultiplier: {{ learningRateMultiplier }}
          batchSize: {{ batchSize }}
          epochCount: {{ epochCount }}
          learningRate: {{ learningRate }}
        startTime: "{{ startTime }}"
        completeTime: "{{ completeTime }}"
        snapshots:
          - step: {{ step }}
            epoch: {{ epoch }}
            computeTime: "{{ computeTime }}"
            meanLoss: {{ meanLoss }}
    - name: displayName
      value: "{{ displayName }}"
      description: |
        Optional. The name to display for this model in user interfaces. The display name must be up to 40 characters including spaces.
    - name: temperature
      value: {{ temperature }}
      description: |
        Optional. Controls the randomness of the output. Values can range over \`[0.0,1.0]\`, inclusive. A value closer to \`1.0\` will produce responses that are more varied, while a value closer to \`0.0\` will typically result in less surprising responses from the model. This value specifies default to be the one used by the base model while creating the model.
    - name: tunedModelSource
      description: |
        Optional. TunedModel to use as the starting point for training the new model.
      value:
        tunedModel: "{{ tunedModel }}"
        baseModel: "{{ baseModel }}"
    - name: topP
      value: {{ topP }}
      description: |
        Optional. For Nucleus sampling. Nucleus sampling considers the smallest set of tokens whose probability sum is at least \`top_p\`. This value specifies default to be the one used by the base model while creating the model.
    - name: topK
      value: {{ topK }}
      description: |
        Optional. For Top-k sampling. Top-k sampling considers the set of \`top_k\` most probable tokens. This value specifies default to be used by the backend while making the call to the model. This value specifies default to be the one used by the base model while creating the model.
    - name: readerProjectNumbers
      value:
        - "{{ readerProjectNumbers }}"
      description: |
        Optional. List of project numbers that have read access to the tuned model.
    - name: baseModel
      value: "{{ baseModel }}"
      description: |
        Immutable. The name of the \`Model\` to tune. Example: \`models/gemini-1.5-flash-001\`
    - name: tunedModelId
      value: "{{ tunedModelId }}"
      description: Optional. The unique id for the tuned model if specified. This value should be up to 40 characters, the first character must be a letter, the last could be a letter or a number. The id must match the regular expression: \`[a-z]([a-z0-9-]{0,38}[a-z0-9])?\`.
      description: Optional. The unique id for the tuned model if specified. This value should be up to 40 characters, the first character must be a letter, the last could be a letter or a number. The id must match the regular expression: \`[a-z]([a-z0-9-]{0,38}[a-z0-9])?\`.
`}</CodeBlock>

</TabItem>
</Tabs>


## `UPDATE` examples

<Tabs
    defaultValue="patch"
    values={[
        { label: 'patch', value: 'patch' }
    ]}
>
<TabItem value="patch">

Updates a tuned model.

```sql
UPDATE gemini.tuned_models.tuned_models
SET 
description = '{{ description }}',
tuningTask = '{{ tuningTask }}',
displayName = '{{ displayName }}',
temperature = {{ temperature }},
tunedModelSource = '{{ tunedModelSource }}',
topP = {{ topP }},
topK = {{ topK }},
readerProjectNumbers = '{{ readerProjectNumbers }}',
baseModel = '{{ baseModel }}'
WHERE 
tunedModelsId = '{{ tunedModelsId }}' --required
WHERE updateMask = '{{ updateMask}}'
RETURNING
name,
baseModel,
createTime,
description,
displayName,
readerProjectNumbers,
state,
temperature,
topK,
topP,
tunedModelSource,
tuningTask,
updateTime;
```
</TabItem>
</Tabs>


## `DELETE` examples

<Tabs
    defaultValue="delete"
    values={[
        { label: 'delete', value: 'delete' }
    ]}
>
<TabItem value="delete">

Deletes a tuned model.

```sql
DELETE FROM gemini.tuned_models.tuned_models
WHERE tunedModelsId = '{{ tunedModelsId }}' --required
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

<Tabs
    defaultValue="transfer_ownership"
    values={[
        { label: 'transfer_ownership', value: 'transfer_ownership' }
    ]}
>
<TabItem value="transfer_ownership">

Transfers ownership of the tuned model. This is the only way to change ownership of the tuned model. The current owner will be downgraded to writer role.

```sql
EXEC gemini.tuned_models.tuned_models.transfer_ownership 
@tunedModelsId='{{ tunedModelsId }}' --required
@@json=
'{
"emailAddress": "{{ emailAddress }}"
}'
;
```
</TabItem>
</Tabs>
