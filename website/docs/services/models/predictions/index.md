---
title: predictions
hide_title: false
hide_table_of_contents: false
keywords:
  - predictions
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

Creates, updates, deletes, gets or lists a <code>predictions</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="predictions" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.predictions" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="predict"
    values={[
        { label: 'predict', value: 'predict' }
    ]}
>
<TabItem value="predict">

<SchemaTable fields={[
  {
    "name": "predictions",
    "type": "array",
    "description": "The outputs of the prediction call."
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
    <td><a href="#predict"><CopyableCode code="predict" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td><a href="#parameter-parameters"><code>parameters</code></a>, <a href="#parameter-instances"><code>instances</code></a></td>
    <td>Performs a prediction request.</td>
</tr>
<tr>
    <td><a href="#predict_long_running"><CopyableCode code="predict_long_running" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Same as Predict but returns an LRO.</td>
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
<tr id="parameter-instances">
    <td><CopyableCode code="instances" /></td>
    <td><code>array</code></td>
    <td>Required. The instances that are the input to the prediction call.</td>
</tr>
<tr id="parameter-parameters">
    <td><CopyableCode code="parameters" /></td>
    <td><code>string</code></td>
    <td>Optional. The parameters that govern the prediction call. (arbitrary JSON, projected as a string column)</td>
</tr>
</tbody>
</table>

## `SELECT` examples

<Tabs
    defaultValue="predict"
    values={[
        { label: 'predict', value: 'predict' }
    ]}
>
<TabItem value="predict">

Performs a prediction request.

```sql
SELECT
predictions
FROM gemini.models.predictions
WHERE modelsId = '{{ modelsId }}' -- required
AND parameters = '{{ parameters }}'
AND instances = '{{ instances }}'
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

<Tabs
    defaultValue="predict_long_running"
    values={[
        { label: 'predict_long_running', value: 'predict_long_running' }
    ]}
>
<TabItem value="predict_long_running">

Same as Predict but returns an LRO.

```sql
EXEC gemini.models.predictions.predict_long_running 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"instances": "{{ instances }}", 
"parameters": "{{ parameters }}"
}'
;
```
</TabItem>
</Tabs>
