---
title: messages
hide_title: false
hide_table_of_contents: false
keywords:
  - messages
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

Creates, updates, deletes, gets or lists a <code>messages</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="messages" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.messages" /></td></tr>
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
    <td><a href="#count_message_tokens"><CopyableCode code="count_message_tokens" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Runs a model's tokenizer on a string and returns the token count.</td>
</tr>
<tr>
    <td><a href="#generate_message"><CopyableCode code="generate_message" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Generates a response from the model given an input `MessagePrompt`.</td>
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

## Lifecycle Methods

<Tabs
    defaultValue="count_message_tokens"
    values={[
        { label: 'count_message_tokens', value: 'count_message_tokens' },
        { label: 'generate_message', value: 'generate_message' }
    ]}
>
<TabItem value="count_message_tokens">

Runs a model's tokenizer on a string and returns the token count.

```sql
EXEC gemini.models.messages.count_message_tokens 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"prompt": "{{ prompt }}"
}'
;
```
</TabItem>
<TabItem value="generate_message">

Generates a response from the model given an input `MessagePrompt`.

```sql
EXEC gemini.models.messages.generate_message 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"topP": {{ topP }}, 
"prompt": "{{ prompt }}", 
"temperature": {{ temperature }}, 
"candidateCount": {{ candidateCount }}, 
"topK": {{ topK }}
}'
;
```
</TabItem>
</Tabs>
