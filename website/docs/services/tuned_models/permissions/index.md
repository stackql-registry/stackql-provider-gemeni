---
title: permissions
hide_title: false
hide_table_of_contents: false
keywords:
  - permissions
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

Creates, updates, deletes, gets or lists a <code>permissions</code> resource.

## Overview
<table><tbody>
<tr><td><b>Name</b></td><td><CopyableCode code="permissions" /></td></tr>
<tr><td><b>Type</b></td><td>Resource</td></tr>
<tr><td><b>Id</b></td><td><CopyableCode code="gemini.tuned_models.permissions" /></td></tr>
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
    "description": "Output only. Identifier. The permission name. A unique name will be generated on create. Examples: tunedModels/&#123;tuned_model&#125;/permissions/&#123;permission&#125; corpora/&#123;corpus&#125;/permissions/&#123;permission&#125; Output only."
  },
  {
    "name": "emailAddress",
    "type": "string",
    "description": "Optional. Immutable. The email address of the user of group which this permission refers. Field is not set when permission's grantee type is EVERYONE."
  },
  {
    "name": "granteeType",
    "type": "string",
    "description": "Optional. Immutable. The type of the grantee. (GRANTEE_TYPE_UNSPECIFIED, USER, GROUP, EVERYONE)"
  },
  {
    "name": "role",
    "type": "string",
    "description": "Required. The role granted by this permission. (ROLE_UNSPECIFIED, OWNER, WRITER, READER)"
  }
]} />
</TabItem>
<TabItem value="list">

<SchemaTable fields={[
  {
    "name": "name",
    "type": "string",
    "description": "Output only. Identifier. The permission name. A unique name will be generated on create. Examples: tunedModels/&#123;tuned_model&#125;/permissions/&#123;permission&#125; corpora/&#123;corpus&#125;/permissions/&#123;permission&#125; Output only."
  },
  {
    "name": "emailAddress",
    "type": "string",
    "description": "Optional. Immutable. The email address of the user of group which this permission refers. Field is not set when permission's grantee type is EVERYONE."
  },
  {
    "name": "granteeType",
    "type": "string",
    "description": "Optional. Immutable. The type of the grantee. (GRANTEE_TYPE_UNSPECIFIED, USER, GROUP, EVERYONE)"
  },
  {
    "name": "role",
    "type": "string",
    "description": "Required. The role granted by this permission. (ROLE_UNSPECIFIED, OWNER, WRITER, READER)"
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
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a>, <a href="#parameter-permissionsId"><code>permissionsId</code></a></td>
    <td></td>
    <td>Gets information about a specific Permission.</td>
</tr>
<tr>
    <td><a href="#list"><CopyableCode code="list" /></a></td>
    <td><CopyableCode code="select" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td></td>
    <td>Lists permissions for the specific resource.</td>
</tr>
<tr>
    <td><a href="#create"><CopyableCode code="create" /></a></td>
    <td><CopyableCode code="insert" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a></td>
    <td></td>
    <td>Create a permission to a specific resource.</td>
</tr>
<tr>
    <td><a href="#patch"><CopyableCode code="patch" /></a></td>
    <td><CopyableCode code="update" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a>, <a href="#parameter-permissionsId"><code>permissionsId</code></a></td>
    <td><a href="#parameter-updateMask"><code>updateMask</code></a></td>
    <td>Updates the permission.</td>
</tr>
<tr>
    <td><a href="#delete"><CopyableCode code="delete" /></a></td>
    <td><CopyableCode code="delete" /></td>
    <td><a href="#parameter-tunedModelsId"><code>tunedModelsId</code></a>, <a href="#parameter-permissionsId"><code>permissionsId</code></a></td>
    <td></td>
    <td>Deletes the permission.</td>
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
<tr id="parameter-permissionsId">
    <td><CopyableCode code="permissionsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-tunedModelsId">
    <td><CopyableCode code="tunedModelsId" /></td>
    <td><code>string</code></td>
    <td></td>
</tr>
<tr id="parameter-updateMask">
    <td><CopyableCode code="updateMask" /></td>
    <td><code>string (google-fieldmask)</code></td>
    <td>Required. The list of fields to update. Accepted ones: - role (`Permission.role` field)</td>
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

Gets information about a specific Permission.

```sql
SELECT
name,
emailAddress,
granteeType,
role
FROM gemini.tuned_models.permissions
WHERE tunedModelsId = '{{ tunedModelsId }}' -- required
AND permissionsId = '{{ permissionsId }}' -- required
;
```
</TabItem>
<TabItem value="list">

Lists permissions for the specific resource.

```sql
SELECT
name,
emailAddress,
granteeType,
role
FROM gemini.tuned_models.permissions
WHERE tunedModelsId = '{{ tunedModelsId }}' -- required
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

Create a permission to a specific resource.

```sql
INSERT INTO gemini.tuned_models.permissions (
emailAddress,
granteeType,
role,
tunedModelsId
)
SELECT 
'{{ emailAddress }}',
'{{ granteeType }}',
'{{ role }}',
'{{ tunedModelsId }}'
RETURNING
name,
emailAddress,
granteeType,
role
;
```
</TabItem>
<TabItem value="manifest">

<CodeBlock language="yaml">{`# Description fields are for documentation purposes
- name: permissions
  props:
    - name: tunedModelsId
      value: "{{ tunedModelsId }}"
      description: Required parameter for the permissions resource.
    - name: emailAddress
      value: "{{ emailAddress }}"
      description: |
        Optional. Immutable. The email address of the user of group which this permission refers. Field is not set when permission's grantee type is EVERYONE.
    - name: granteeType
      value: "{{ granteeType }}"
      description: |
        Optional. Immutable. The type of the grantee.
      valid_values: ['GRANTEE_TYPE_UNSPECIFIED', 'USER', 'GROUP', 'EVERYONE']
    - name: role
      value: "{{ role }}"
      description: |
        Required. The role granted by this permission.
      valid_values: ['ROLE_UNSPECIFIED', 'OWNER', 'WRITER', 'READER']
`}</CodeBlock>

</TabItem>
</Tabs>


## `UPDATE` examples

<Tabs
    defaultValue="patch"
    values={[
        { label: 'patch', value: 'patch' }
    ]}
>
<TabItem value="patch">

Updates the permission.

```sql
UPDATE gemini.tuned_models.permissions
SET 
emailAddress = '{{ emailAddress }}',
granteeType = '{{ granteeType }}',
role = '{{ role }}'
WHERE 
tunedModelsId = '{{ tunedModelsId }}' --required
WHERE permissionsId = '{{ permissionsId }}' --required
AND updateMask = '{{ updateMask}}'
RETURNING
name,
emailAddress,
granteeType,
role;
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

Deletes the permission.

```sql
DELETE FROM gemini.tuned_models.permissions
WHERE tunedModelsId = '{{ tunedModelsId }}' --required
AND permissionsId = '{{ permissionsId }}' --required
;
```
</TabItem>
</Tabs>
