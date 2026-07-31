---
title: corpora
hide_title: false
hide_table_of_contents: false
keywords:
  - corpora
  - corpora
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

Creates, updates, deletes, gets or lists a <code>corpora</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="corpora" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.corpora.corpora" /></td></tr>
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
    "description": "Output only. Immutable. Identifier. The `Corpus` resource name. The ID (name excluding the \"corpora/\" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be derived from `display_name` along with a 12 character random suffix. Example: `corpora/my-awesome-corpora-123a456b789c`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Corpus` was created."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `Corpus`. The display name must be no more than 512 characters in length, including spaces. Example: \"Docs on Semantic Retriever\""
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Corpus` was last updated."
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Output only. Immutable. Identifier. The `Corpus` resource name. The ID (name excluding the \"corpora/\" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be derived from `display_name` along with a 12 character random suffix. Example: `corpora/my-awesome-corpora-123a456b789c`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Corpus` was created."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `Corpus`. The display name must be no more than 512 characters in length, including spaces. Example: \"Docs on Semantic Retriever\""
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Corpus` was last updated."
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
    <td><a href="#parameter-corporaId"><code>corporaId</code></a></td>
    <td></td>
    <td>Gets information about a specific `Corpus`.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td></td>
    <td>Lists all `Corpora` owned by the user.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates an empty `Corpus`.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-corporaId"><code>corporaId</code></a></td>
    <td><a href="#parameter-force"><code>force</code></a></td>
    <td>Deletes a `Corpus`.</td>
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
<tr id="parameter-corporaId">
    <td><CopyableCode code="corporaId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-force">
    <td><CopyableCode code="force" /></td>
    <td><code>boolean</code></td>
    <td>Optional. If set to true, any `Document`s and objects related to this `Corpus` will also be deleted. If false (the default), a `FAILED_PRECONDITION` error will be returned if `Corpus` contains any `Document`s.</td>
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

Gets information about a specific `Corpus`.

```sql
SELECT
name,
createTime,
displayName,
updateTime
FROM gemini.corpora.corpora
WHERE corporaId = '{{ corporaId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists all `Corpora` owned by the user.

```sql
SELECT
name,
createTime,
displayName,
updateTime
FROM gemini.corpora.corpora
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

Creates an empty `Corpus`.

```sql
INSERT INTO gemini.corpora.corpora (
displayName
)
SELECT 
'{{ displayName }}'
RETURNING
name,
createTime,
displayName,
updateTime
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: corpora
  props:
    - name: displayName
      value: "{{ displayName }}"
      description: |
        Optional. The human-readable display name for the \`Corpus\`. The display name must be no more than 512 characters in length, including spaces. Example: "Docs on Semantic Retriever"
`}</CodeBlock>

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

Deletes a `Corpus`.

```sql
DELETE FROM gemini.corpora.corpora
WHERE corporaId = '{{ corporaId }}' --required
AND force = '{{ force }}'
;
```
</TabItem>
</Tabs>
