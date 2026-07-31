---
title: Joining to the GCP control plane
hide_title: false
hide_table_of_contents: false
keywords:
  - gemini
  - google
  - billing
  - quota
  - stackql
description: Combine the gemini provider with the google provider for billing, quota, key management and IAM
custom_edit_url: null
id: 'google-control-plane'
---

The `gemini` provider covers everything reachable with a `GEMINI_API_KEY` on `generativelanguage.googleapis.com` - inference, models, tuned models, files, cached contents, corpora, file search stores and batches.

Billing, quota, API key management and IAM are GCP control-plane surfaces on different hosts with OAuth/ADC credentials. A StackQL provider carries one auth config, so these live where they belong - in the [`google`](https://google.stackql.io/) provider - and StackQL's cross-provider joins put the two together in one query.

To run the examples below, authenticate the `google` provider with Application Default Credentials or a service account (see the [google provider docs](https://google.stackql.io/)) alongside your `GEMINI_API_KEY`.

## Is the Generative Language API enabled, and what models does it serve?

```sql
SELECT
  svc.state,
  m.name,
  m.displayName
FROM google.serviceusage.services svc
JOIN gemini.models.models m
ON 1 = 1
WHERE svc.parent = 'projects/my-project'
AND svc.servicesId = 'generativelanguage.googleapis.com';
```

## Which API keys can reach the Gemini API?

```sql
SELECT
  k.displayName,
  k.uid,
  JSON_EXTRACT(k.restrictions, '$.apiTargets') AS api_targets
FROM google.apikeys.keys k
WHERE k.projectsId = 'my-project'
AND k.locationsId = 'global';
```

## Billing account behind the project running Gemini workloads

```sql
SELECT
  b.billingAccountName,
  b.billingEnabled
FROM google.cloudbilling.billing_info b
WHERE b.projectsId = 'my-project';
```

These queries are illustrative - substitute your own project id. They require the `google` provider (`REGISTRY PULL google;`) and OAuth/ADC credentials in addition to the `GEMINI_API_KEY` used by this provider.
