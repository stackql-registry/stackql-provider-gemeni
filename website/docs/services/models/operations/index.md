---
title: operations
hide_title: false
hide_table_of_contents: false
keywords:
  - operations
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

Creates, updates, deletes, gets or lists an <code>operations</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="operations" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.models.operations" /></td></tr>
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
    "description": "The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/&#123;unique_id&#125;`."
  },
  {
    "name": "done",
    "type": "boolean",
    "description": "If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available."
  },
  {
    "name": "error",
    "type": "object",
    "description": "The error result of the operation in case of failure or cancellation.",
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
    "name": "metadata",
    "type": "object",
    "description": "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any."
  },
  {
    "name": "response",
    "type": "object",
    "description": "The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`."
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/&#123;unique_id&#125;`."
  },
  {
    "name": "done",
    "type": "boolean",
    "description": "If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available."
  },
  {
    "name": "error",
    "type": "object",
    "description": "The error result of the operation in case of failure or cancellation.",
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
    "name": "metadata",
    "type": "object",
    "description": "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any."
  },
  {
    "name": "response",
    "type": "object",
    "description": "The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`."
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
    <td><a href="#parameter-modelsId"><code>modelsId</code></a>, <a href="#parameter-operationsId"><code>operationsId</code></a></td>
    <td></td>
    <td>Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-modelsId"><code>modelsId</code></a></td>
    <td><a href="#parameter-returnPartialSuccess"><code>returnPartialSuccess</code></a>, <a href="#parameter-filter"><code>filter</code></a></td>
    <td>Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.</td>
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
<tr id="parameter-operationsId">
    <td><CopyableCode code="operationsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-filter">
    <td><CopyableCode code="filter" /></td>
    <td><code>string</code></td>
    <td>The standard list filter.</td>
</tr>
<tr id="parameter-returnPartialSuccess">
    <td><CopyableCode code="returnPartialSuccess" /></td>
    <td><code>boolean</code></td>
    <td>When set to `true`, operations that are reachable are returned as normal, and those that are unreachable are returned in the ListOperationsResponse.unreachable field. This can only be `true` when reading across collections. For example, when `parent` is set to `"projects/example/locations/-"`. This field is not supported by default and will result in an `UNIMPLEMENTED` error if set unless explicitly documented otherwise in service or product specific documentation.</td>
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

Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.

```sql
SELECT
name,
done,
error,
metadata,
response
FROM gemini.models.operations
WHERE modelsId = '{{ modelsId }}' -- required
AND operationsId = '{{ operationsId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.

```sql
SELECT
name,
done,
error,
metadata,
response
FROM gemini.models.operations
WHERE modelsId = '{{ modelsId }}' -- required
AND returnPartialSuccess = '{{ returnPartialSuccess }}'
AND filter = '{{ filter }}'
;
```
</TabItem>
</Tabs>
