---
title: generated_files
hide_title: false
hide_table_of_contents: false
keywords:
  - generated_files
  - generated_files
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

Creates, updates, deletes, gets or lists a <code>generated_files</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="generated_files" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.generated_files.generated_files" /></td></tr>
</tbody></table>

## Fields

The following fields are returned by `SELECT` queries:

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Identifier. The name of the generated file. Example: `generatedFiles/abc-123`"
  },
  {
    "name": "error",
    "type": "object",
    "description": "Error details if the GeneratedFile ends up in the STATE_FAILED state.",
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
    "name": "mimeType",
    "type": "string",
    "description": "MIME type of the generatedFile."
  },
  {
    "name": "state",
    "type": "string",
    "description": "Output only. The state of the GeneratedFile. (STATE_UNSPECIFIED, GENERATING, GENERATED, FAILED)"
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
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td></td>
    <td></td>
    <td>Lists the generated files owned by the requesting project.</td>
</tr>
</tbody>
</table>

## Parameters

This resource's methods take no path, query, or request-body parameters; authentication and API-version headers are handled automatically.


## `SELECT` examples

<Tabs
    defaultValue="list"
    values={[
        { label: 'list', value: 'list' }
    ]}
>
<TabItem value="list">

Lists the generated files owned by the requesting project.

```sql
SELECT
name,
error,
mimeType,
state
FROM gemini.generated_files.generated_files
;
```
</TabItem>
</Tabs>
