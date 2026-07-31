---
title: text
hide_title: false
hide_table_of_contents: false
keywords:
  - text
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

Creates, updates, deletes, gets or lists a <code>text</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="text" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.tuned_models.text" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

`SELECT` not supported for this resource, use `SHOW METHODS` to view available operations for the resource.


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
    <td><a href="#generate_text"><CopyableCode code="generate_text" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td></td>
    <td>Generates a response from the model given an input message.</td>
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
</tbody>
</table>

## Lifecycle Methods

<Tabs
    defaultValue="generate_text"
    values={[
        { label: 'generate_text', value: 'generate_text' }
    ]}
>
<TabItem value="generate_text">

Generates a response from the model given an input message.

```sql
EXEC gemini.tuned_models.text.generate_text 
@tunedModelsId='{{ tunedModelsId }}' --required
@@json=
'{
"topK": {{ topK }}, 
"maxOutputTokens": {{ maxOutputTokens }}, 
"safetySettings": "{{ safetySettings }}", 
"candidateCount": {{ candidateCount }}, 
"temperature": {{ temperature }}, 
"topP": {{ topP }}, 
"stopSequences": "{{ stopSequences }}", 
"prompt": "{{ prompt }}"
}'
;
```
</TabItem>
</Tabs>
