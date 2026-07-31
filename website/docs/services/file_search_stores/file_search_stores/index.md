---
title: file_search_stores
hide_title: false
hide_table_of_contents: false
keywords:
  - file_search_stores
  - file_search_stores
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

Creates, updates, deletes, gets or lists a <code>file_search_stores</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="file_search_stores" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.file_search_stores.file_search_stores" /></td></tr>
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
    "description": "Output only. Immutable. Identifier. The `FileSearchStore` resource name. It is an ID (name excluding the \"fileSearchStores/\" prefix) that can contain up to 40 characters that are lowercase alphanumeric or dashes (-). It is output only. The unique name will be derived from `display_name` along with a 12 character random suffix. Example: `fileSearchStores/my-awesome-file-search-store-123a456b789c` If `display_name` is not provided, the name will be randomly generated."
  },
  {
    "name": "activeDocumentsCount",
    "type": "string (int64)",
    "description": "Output only. The number of documents in the `FileSearchStore` that are active and ready for retrieval."
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `FileSearchStore` was created."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `FileSearchStore`. The display name must be no more than 512 characters in length, including spaces. Example: \"Docs on Semantic Retriever\""
  },
  {
    "name": "embeddingModel",
    "type": "string",
    "description": "Optional. The embedding model to use for the `FileSearchStore`. The model's resource name. This serves as an ID for the Model to use. Format: `models/&#123;model&#125;`. If not specified, the default embedding model will be used."
  },
  {
    "name": "failedDocumentsCount",
    "type": "string (int64)",
    "description": "Output only. The number of documents in the `FileSearchStore` that have failed processing."
  },
  {
    "name": "pendingDocumentsCount",
    "type": "string (int64)",
    "description": "Output only. The number of documents in the `FileSearchStore` that are being processed."
  },
  {
    "name": "sizeBytes",
    "type": "string (int64)",
    "description": "Output only. The size of raw bytes ingested into the `FileSearchStore`. This is the total size of all the documents in the `FileSearchStore`."
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `FileSearchStore` was last updated."
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Output only. Immutable. Identifier. The `FileSearchStore` resource name. It is an ID (name excluding the \"fileSearchStores/\" prefix) that can contain up to 40 characters that are lowercase alphanumeric or dashes (-). It is output only. The unique name will be derived from `display_name` along with a 12 character random suffix. Example: `fileSearchStores/my-awesome-file-search-store-123a456b789c` If `display_name` is not provided, the name will be randomly generated."
  },
  {
    "name": "activeDocumentsCount",
    "type": "string (int64)",
    "description": "Output only. The number of documents in the `FileSearchStore` that are active and ready for retrieval."
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `FileSearchStore` was created."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `FileSearchStore`. The display name must be no more than 512 characters in length, including spaces. Example: \"Docs on Semantic Retriever\""
  },
  {
    "name": "embeddingModel",
    "type": "string",
    "description": "Optional. The embedding model to use for the `FileSearchStore`. The model's resource name. This serves as an ID for the Model to use. Format: `models/&#123;model&#125;`. If not specified, the default embedding model will be used."
  },
  {
    "name": "failedDocumentsCount",
    "type": "string (int64)",
    "description": "Output only. The number of documents in the `FileSearchStore` that have failed processing."
  },
  {
    "name": "pendingDocumentsCount",
    "type": "string (int64)",
    "description": "Output only. The number of documents in the `FileSearchStore` that are being processed."
  },
  {
    "name": "sizeBytes",
    "type": "string (int64)",
    "description": "Output only. The size of raw bytes ingested into the `FileSearchStore`. This is the total size of all the documents in the `FileSearchStore`."
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `FileSearchStore` was last updated."
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
    <td><a href="#parameter-fileSearchStoresId"><code>fileSearchStoresId</code></a></td>
    <td></td>
    <td>Gets information about a specific `FileSearchStore`.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td></td>
    <td>Lists all `FileSearchStores` owned by the user.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Creates an empty `FileSearchStore`.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-fileSearchStoresId"><code>fileSearchStoresId</code></a></td>
    <td><a href="#parameter-force"><code>force</code></a></td>
    <td>Deletes a `FileSearchStore`.</td>
</tr>
<tr>
    <td><a href="#import_file"><CopyableCode code="import_file" /></a></td>
    <td><CopyableCode code="exec" /></td>
    <td><a href="#parameter-fileSearchStoresId"><code>fileSearchStoresId</code></a></td>
    <td></td>
    <td>Imports a `File` from File Service to a `FileSearchStore`.</td>
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
<tr id="parameter-fileSearchStoresId">
    <td><CopyableCode code="fileSearchStoresId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-force">
    <td><CopyableCode code="force" /></td>
    <td><code>boolean</code></td>
    <td>Optional. If set to true, any `Document`s and objects related to this `FileSearchStore` will also be deleted. If false (the default), a `FAILED_PRECONDITION` error will be returned if `FileSearchStore` contains any `Document`s.</td>
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

Gets information about a specific `FileSearchStore`.

```sql
SELECT
name,
activeDocumentsCount,
createTime,
displayName,
embeddingModel,
failedDocumentsCount,
pendingDocumentsCount,
sizeBytes,
updateTime
FROM gemini.file_search_stores.file_search_stores
WHERE fileSearchStoresId = '{{ fileSearchStoresId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists all `FileSearchStores` owned by the user.

```sql
SELECT
name,
activeDocumentsCount,
createTime,
displayName,
embeddingModel,
failedDocumentsCount,
pendingDocumentsCount,
sizeBytes,
updateTime
FROM gemini.file_search_stores.file_search_stores
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

Creates an empty `FileSearchStore`.

```sql
INSERT INTO gemini.file_search_stores.file_search_stores (
embeddingModel,
displayName
)
SELECT 
'{{ embeddingModel }}',
'{{ displayName }}'
RETURNING
name,
activeDocumentsCount,
createTime,
displayName,
embeddingModel,
failedDocumentsCount,
pendingDocumentsCount,
sizeBytes,
updateTime
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: file_search_stores
  props:
    - name: embeddingModel
      value: "{{ embeddingModel }}"
      description: |
        Optional. The embedding model to use for the \`FileSearchStore\`. The model's resource name. This serves as an ID for the Model to use. Format: \`models/{model}\`. If not specified, the default embedding model will be used.
    - name: displayName
      value: "{{ displayName }}"
      description: |
        Optional. The human-readable display name for the \`FileSearchStore\`. The display name must be no more than 512 characters in length, including spaces. Example: "Docs on Semantic Retriever"
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

Deletes a `FileSearchStore`.

```sql
DELETE FROM gemini.file_search_stores.file_search_stores
WHERE fileSearchStoresId = '{{ fileSearchStoresId }}' --required
AND force = '{{ force }}'
;
```
</TabItem>
</Tabs>


## Lifecycle Methods

<Tabs
    defaultValue="import_file"
    values={[
        { label: 'import_file', value: 'import_file' }
    ]}
>
<TabItem value="import_file">

Imports a `File` from File Service to a `FileSearchStore`.

```sql
EXEC gemini.file_search_stores.file_search_stores.import_file 
@fileSearchStoresId='{{ fileSearchStoresId }}' --required
@@json=
'{
"fileName": "{{ fileName }}", 
"chunkingConfig": "{{ chunkingConfig }}", 
"customMetadata": "{{ customMetadata }}"
}'
;
```
</TabItem>
</Tabs>
