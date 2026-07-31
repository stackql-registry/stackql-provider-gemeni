---
title: documents
hide_title: false
hide_table_of_contents: false
keywords:
  - documents
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

Creates, updates, deletes, gets or lists a <code>documents</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="documents" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.file_search_stores.documents" /></td></tr>
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
    "description": "Immutable. Identifier. The `Document` resource name. The ID (name excluding the \"fileSearchStores/*/documents/\" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be derived from `display_name` along with a 12 character random suffix. Example: `fileSearchStores/&#123;file_search_store_id&#125;/documents/my-awesome-doc-123a456b789c`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Document` was created."
  },
  {
    "name": "customMetadata",
    "type": "array",
    "description": "Optional. User provided custom metadata stored as key-value pairs used for querying. A `Document` can have a maximum of 20 `CustomMetadata`.",
    "children": [
      {
        "name": "stringValue",
        "type": "string",
        "description": "The string value of the metadata to store."
      },
      {
        "name": "numericValue",
        "type": "number (float)",
        "description": "The numeric value of the metadata to store."
      },
      {
        "name": "key",
        "type": "string",
        "description": "Required. The key of the metadata to store."
      },
      {
        "name": "stringListValue",
        "type": "object",
        "description": "The StringList value of the metadata to store.",
        "children": [
          {
            "name": "values",
            "type": "array",
            "description": "The string values of the metadata to store."
          }
        ]
      }
    ]
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `Document`. The display name must be no more than 512 characters in length, including spaces. Example: \"Semantic Retriever Documentation\""
  },
  {
    "name": "mimeType",
    "type": "string",
    "description": "Output only. The mime type of the Document."
  },
  {
    "name": "sizeBytes",
    "type": "string (int64)",
    "description": "Output only. The size of raw bytes ingested into the Document."
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. Current state of the `Document`. (STATE_UNSPECIFIED, STATE_PENDING, STATE_ACTIVE, STATE_FAILED)"
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Document` was last updated."
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Immutable. Identifier. The `Document` resource name. The ID (name excluding the \"fileSearchStores/*/documents/\" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be derived from `display_name` along with a 12 character random suffix. Example: `fileSearchStores/&#123;file_search_store_id&#125;/documents/my-awesome-doc-123a456b789c`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Document` was created."
  },
  {
    "name": "customMetadata",
    "type": "array",
    "description": "Optional. User provided custom metadata stored as key-value pairs used for querying. A `Document` can have a maximum of 20 `CustomMetadata`.",
    "children": [
      {
        "name": "stringValue",
        "type": "string",
        "description": "The string value of the metadata to store."
      },
      {
        "name": "numericValue",
        "type": "number (float)",
        "description": "The numeric value of the metadata to store."
      },
      {
        "name": "key",
        "type": "string",
        "description": "Required. The key of the metadata to store."
      },
      {
        "name": "stringListValue",
        "type": "object",
        "description": "The StringList value of the metadata to store.",
        "children": [
          {
            "name": "values",
            "type": "array",
            "description": "The string values of the metadata to store."
          }
        ]
      }
    ]
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `Document`. The display name must be no more than 512 characters in length, including spaces. Example: \"Semantic Retriever Documentation\""
  },
  {
    "name": "mimeType",
    "type": "string",
    "description": "Output only. The mime type of the Document."
  },
  {
    "name": "sizeBytes",
    "type": "string (int64)",
    "description": "Output only. The size of raw bytes ingested into the Document."
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. Current state of the `Document`. (STATE_UNSPECIFIED, STATE_PENDING, STATE_ACTIVE, STATE_FAILED)"
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The Timestamp of when the `Document` was last updated."
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
    <td><a href="#parameter-fileSearchStoresId"><code>fileSearchStoresId</code></a>, <a href="#parameter-documentsId"><code>documentsId</code></a></td>
    <td></td>
    <td>Gets information about a specific `Document`.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-fileSearchStoresId"><code>fileSearchStoresId</code></a></td>
    <td></td>
    <td>Lists all `Document`s in a `Corpus`.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-fileSearchStoresId"><code>fileSearchStoresId</code></a>, <a href="#parameter-documentsId"><code>documentsId</code></a></td>
    <td><a href="#parameter-force"><code>force</code></a></td>
    <td>Deletes a `Document`.</td>
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
<tr id="parameter-documentsId">
    <td><CopyableCode code="documentsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-fileSearchStoresId">
    <td><CopyableCode code="fileSearchStoresId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-force">
    <td><CopyableCode code="force" /></td>
    <td><code>boolean</code></td>
    <td>Optional. If set to true, any `Chunk`s and objects related to this `Document` will also be deleted. If false (the default), a `FAILED_PRECONDITION` error will be returned if `Document` contains any `Chunk`s.</td>
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

Gets information about a specific `Document`.

```sql
SELECT
name,
createTime,
customMetadata,
displayName,
mimeType,
sizeBytes,
state,
updateTime
FROM gemini.file_search_stores.documents
WHERE fileSearchStoresId = '{{ fileSearchStoresId }}' -- required
AND documentsId = '{{ documentsId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists all `Document`s in a `Corpus`.

```sql
SELECT
name,
createTime,
customMetadata,
displayName,
mimeType,
sizeBytes,
state,
updateTime
FROM gemini.file_search_stores.documents
WHERE fileSearchStoresId = '{{ fileSearchStoresId }}' -- required
;
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

Deletes a `Document`.

```sql
DELETE FROM gemini.file_search_stores.documents
WHERE fileSearchStoresId = '{{ fileSearchStoresId }}' --required
AND documentsId = '{{ documentsId }}' --required
AND force = '{{ force }}'
;
```
</TabItem>
</Tabs>
