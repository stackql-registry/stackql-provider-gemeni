---
title: files
hide_title: false
hide_table_of_contents: false
keywords:
  - files
  - files
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

Creates, updates, deletes, gets or lists a <code>files</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="files" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.files.files" /></td></tr>
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
    "description": "Immutable. Identifier. The `File` resource name. The ID (name excluding the \"files/\" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be generated. Example: `files/123-456`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp of when the `File` was created."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `File`. The display name must be no more than 512 characters in length, including spaces. Example: \"Welcome Image\""
  },
  {
    "name": "downloadUri",
    "type": "string",
    "description": "Output only. The download uri of the `File`."
  },
  {
    "name": "error",
    "type": "object",
    "description": "Output only. Error status if File processing failed.",
    "children": [
      {
        "name": "message",
        "type": "string",
        "description": "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client."
      },
      {
        "name": "code",
        "type": "integer (int32)",
        "description": "The status code, which should be an enum value of google.rpc.Code."
      },
      {
        "name": "details",
        "type": "array",
        "description": "A list of messages that carry the error details. There is a common set of message types for APIs to use."
      }
    ]
  },
  {
    "name": "expirationTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp of when the `File` will be deleted. Only set if the `File` is scheduled to expire."
  },
  {
    "name": "mimeType",
    "type": "string",
    "description": "Output only. MIME type of the file."
  },
  {
    "name": "sha256Hash",
    "type": "string (byte)",
    "description": "Output only. SHA-256 hash of the uploaded bytes."
  },
  {
    "name": "sizeBytes",
    "type": "string (int64)",
    "description": "Output only. Size of the file in bytes."
  },
  {
    "name": "source",
    "type": "string",
    "description": "Source of the File. (SOURCE_UNSPECIFIED, UPLOADED, GENERATED, REGISTERED)"
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. Processing state of the File. (STATE_UNSPECIFIED, PROCESSING, ACTIVE, FAILED)"
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp of when the `File` was last updated."
  },
  {
    "name": "uri",
    "type": "string",
    "description": "Output only. The uri of the `File`."
  },
  {
    "name": "videoMetadata",
    "type": "object",
    "description": "Output only. Metadata for a video.",
    "children": [
      {
        "name": "videoDuration",
        "type": "string (google-duration)",
        "description": "Duration of the video."
      }
    ]
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Immutable. Identifier. The `File` resource name. The ID (name excluding the \"files/\" prefix) can contain up to 40 characters that are lowercase alphanumeric or dashes (-). The ID cannot start or end with a dash. If the name is empty on create, a unique name will be generated. Example: `files/123-456`"
  },
  {
    "name": "createTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp of when the `File` was created."
  },
  {
    "name": "displayName",
    "type": "string",
    "description": "Optional. The human-readable display name for the `File`. The display name must be no more than 512 characters in length, including spaces. Example: \"Welcome Image\""
  },
  {
    "name": "downloadUri",
    "type": "string",
    "description": "Output only. The download uri of the `File`."
  },
  {
    "name": "error",
    "type": "object",
    "description": "Output only. Error status if File processing failed.",
    "children": [
      {
        "name": "message",
        "type": "string",
        "description": "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client."
      },
      {
        "name": "code",
        "type": "integer (int32)",
        "description": "The status code, which should be an enum value of google.rpc.Code."
      },
      {
        "name": "details",
        "type": "array",
        "description": "A list of messages that carry the error details. There is a common set of message types for APIs to use."
      }
    ]
  },
  {
    "name": "expirationTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp of when the `File` will be deleted. Only set if the `File` is scheduled to expire."
  },
  {
    "name": "mimeType",
    "type": "string",
    "description": "Output only. MIME type of the file."
  },
  {
    "name": "sha256Hash",
    "type": "string (byte)",
    "description": "Output only. SHA-256 hash of the uploaded bytes."
  },
  {
    "name": "sizeBytes",
    "type": "string (int64)",
    "description": "Output only. Size of the file in bytes."
  },
  {
    "name": "source",
    "type": "string",
    "description": "Source of the File. (SOURCE_UNSPECIFIED, UPLOADED, GENERATED, REGISTERED)"
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. Processing state of the File. (STATE_UNSPECIFIED, PROCESSING, ACTIVE, FAILED)"
  },
  {
    "name": "updateTime",
    "type": "string (google-datetime)",
    "description": "Output only. The timestamp of when the `File` was last updated."
  },
  {
    "name": "uri",
    "type": "string",
    "description": "Output only. The uri of the `File`."
  },
  {
    "name": "videoMetadata",
    "type": "object",
    "description": "Output only. Metadata for a video.",
    "children": [
      {
        "name": "videoDuration",
        "type": "string (google-duration)",
        "description": "Duration of the video."
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
    <td><a href="#get"><CopyableCode code="get" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-filesId"><code>filesId</code></a></td>
    <td></td>
    <td>Gets the metadata for the given `File`.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td></td>
    <td>Lists the metadata for `File`s owned by the requesting project.</td>
</tr>
<tr>
    <td><a href="#register"><CopyableCode code="register" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td></td>
    <td></td>
    <td>Registers a Google Cloud Storage files with FileService. The user is expected to provide Google Cloud Storage URIs and will receive a File resource for each URI in return. Note that the files are not copied, just registered with File API. If one file fails to register, the whole request fails.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-filesId"><code>filesId</code></a></td>
    <td></td>
    <td>Deletes the `File`.</td>
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
<tr id="parameter-filesId">
    <td><CopyableCode code="filesId" /></td>
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

Gets the metadata for the given `File`.

```sql
SELECT
name,
createTime,
displayName,
downloadUri,
error,
expirationTime,
mimeType,
sha256Hash,
sizeBytes,
source,
state,
updateTime,
uri,
videoMetadata
FROM gemini.files.files
WHERE filesId = '{{ filesId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists the metadata for `File`s owned by the requesting project.

```sql
SELECT
name,
createTime,
displayName,
downloadUri,
error,
expirationTime,
mimeType,
sha256Hash,
sizeBytes,
source,
state,
updateTime,
uri,
videoMetadata
FROM gemini.files.files
;
```
</TabItem>
</Tabs>


## `INSERT` examples

<Tabs
    defaultValue="register"
    values={[
        { label: 'register', value: 'register' },
        { label: 'Manifest', value: 'manifest' }
    ]}
>
<TabItem value="register">

Registers a Google Cloud Storage files with FileService. The user is expected to provide Google Cloud Storage URIs and will receive a File resource for each URI in return. Note that the files are not copied, just registered with File API. If one file fails to register, the whole request fails.

```sql
INSERT INTO gemini.files.files (
uris
)
SELECT 
'{{ uris }}'
RETURNING
files
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: files
  props:
    - name: uris
      value:
        - "{{ uris }}"
      description: |
        Required. The Google Cloud Storage URIs to register. Example: \`gs://bucket/object\`.
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

Deletes the `File`.

```sql
DELETE FROM gemini.files.files
WHERE filesId = '{{ filesId }}' --required
;
```
</TabItem>
</Tabs>
