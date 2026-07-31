---
title: generate_content_batches
hide_title: false
hide_table_of_contents: false
keywords:
  - generate_content_batches
  - batches
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

Creates, updates, deletes, gets or lists a <code>generate_content_batches</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="generate_content_batches" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.batches.generate_content_batches" /></td></tr>
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
    <td><a href="#patch"><CopyableCode code="patch" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-batchesId"><code>batchesId</code></a></td>
    <td><a href="#parameter-updateMask"><code>updateMask</code></a></td>
    <td>Updates a batch of GenerateContent requests for batch processing.</td>
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
<tr id="parameter-batchesId">
    <td><CopyableCode code="batchesId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-updateMask">
    <td><CopyableCode code="updateMask" /></td>
    <td><code>string (google-fieldmask)</code></td>
    <td>Optional. The list of fields to update.</td>
</tr>
</tbody>
</table>

## `UPDATE` examples

<Tabs
    defaultValue="patch"
    values={[
        { label: 'patch', value: 'patch' }
    ]}
>
<TabItem value="patch">

Updates a batch of GenerateContent requests for batch processing.

```sql
UPDATE gemini.batches.generate_content_batches
SET 
priority = '{{ priority }}',
inputConfig = '{{ inputConfig }}',
model = '{{ model }}',
displayName = '{{ displayName }}'
WHERE 
batchesId = '{{ batchesId }}' --required
WHERE updateMask = '{{ updateMask}}'
RETURNING
name,
batchStats,
createTime,
displayName,
endTime,
inputConfig,
model,
output,
priority,
state,
updateTime;
```
</TabItem>
</Tabs>
