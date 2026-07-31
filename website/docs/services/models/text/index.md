---
title: text
hide_title: false
hide_table_of_contents: false
keywords:
  - text
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

Creates, updates, deletes, gets or lists a <code>text</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="text" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.text" /></td></tr>
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
    <td><a href="#batch_embed_text"><CopyableCode code="batch_embed_text" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Generates multiple embeddings from the model given input text in a synchronous call.</td>
</tr>
<tr>
    <td><a href="#generate_text"><CopyableCode code="generate_text" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Generates a response from the model given an input message.</td>
</tr>
<tr>
    <td><a href="#embed_text"><CopyableCode code="embed_text" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Generates an embedding from the model given an input message.</td>
</tr>
<tr>
    <td><a href="#count_text_tokens"><CopyableCode code="count_text_tokens" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td></td>
    <td>Runs a model's tokenizer on a text and returns the token count.</td>
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
    defaultValue="batch_embed_text"
    values={[
        { label: 'batch_embed_text', value: 'batch_embed_text' },
        { label: 'generate_text', value: 'generate_text' },
        { label: 'embed_text', value: 'embed_text' },
        { label: 'count_text_tokens', value: 'count_text_tokens' }
    ]}
>
<TabItem value="batch_embed_text">

Generates multiple embeddings from the model given input text in a synchronous call.

```sql
EXEC gemini.models.text.batch_embed_text 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"requests": "{{ requests }}", 
"texts": "{{ texts }}"
}'
;
```
</TabItem>
<TabItem value="generate_text">

Generates a response from the model given an input message.

```sql
EXEC gemini.models.text.generate_text 
@modelsId='{{ modelsId }}' --required
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
<TabItem value="embed_text">

Generates an embedding from the model given an input message.

```sql
EXEC gemini.models.text.embed_text 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"model": "{{ model }}", 
"text": "{{ text }}"
}'
;
```
</TabItem>
<TabItem value="count_text_tokens">

Runs a model's tokenizer on a text and returns the token count.

```sql
EXEC gemini.models.text.count_text_tokens 
@modelsId='{{ modelsId }}' --required
@@json=
'{
"prompt": "{{ prompt }}"
}'
;
```
</TabItem>
</Tabs>
