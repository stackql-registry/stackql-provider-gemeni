#!/usr/bin/env node
// Post-docgen enrichment for body-bearing SELECT methods (POST-as-SELECT
// inference ops — messages.create, token_counts.count_tokens,
// completions.create).
//
//   node factory/enrich-select-docs.mjs --provider NAME --provider-root DIR \
//     --docs-dir DIR --examples factory/docgen-select-examples.yaml
//
// docgen only documents path/query/header params, so the request-body params
// these methods take through the WHERE clause (temperature, system, tools, ...)
// are invisible. For every SELECT method whose operation has a JSON request
// body this script:
//   1. appends the optional body params to the method's "Optional Params"
//      cell in the Methods table (required body params are already there via
//      factory/patch-provider-utils.mjs);
//   2. adds a Parameters-table row for every body param missing one (this
//      also repairs the dangling #parameter-* anchors for required body
//      params like model/messages/max_tokens);
//   3. appends the optional body params to the method's SELECT sample, and —
//      when factory/docgen-select-examples.yaml has a curated entry — renders
//      the sample as nested tabs: "Query Shape" (placeholders) and
//      "Query Example" (complete runnable query with nested JSON values).
//
// `stream` is deliberately not documented: stream:true switches the endpoint
// to SSE, which stackql cannot consume (the SSE endpoints are excluded from
// the provider — see factory/exclusions.yaml).
//
// Runs BEFORE scrub-docs.mjs in the docgen npm scripts (so the Parameters
// table already holds the body-param rows when scrub-docs strips the header
// rows and evaluates empty-table collapse); idempotent.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}
const provider = argOf('--provider');
const providerRoot = argOf('--provider-root');
const docsDir = argOf('--docs-dir');
const examplesPath = argOf('--examples');
if (!provider || !providerRoot || !docsDir || !examplesPath) {
  console.error('usage: enrich-select-docs.mjs --provider NAME --provider-root DIR --docs-dir DIR --examples FILE');
  process.exit(1);
}

const UNDOCUMENTED_BODY_PARAMS = ['stream']; // SSE switch — not consumable via SQL

const examplesDoc = yaml.load(fs.readFileSync(examplesPath, 'utf8')) || {};
const examples = examplesDoc[provider] || {};

function deref(doc, node) {
  while (node && node.$ref) {
    const parts = node.$ref.replace(/^#\//, '').split('/')
      .map((s) => s.replace(/~1/g, '/').replace(/~0/g, '~'));
    node = parts.reduce((n, p) => n && n[p], doc);
  }
  return node;
}

// ---- discovery: SELECT methods with a JSON request body ----------------------

function discover() {
  const out = [];
  const svcDir = path.join(providerRoot, 'services');
  for (const f of fs.readdirSync(svcDir).filter((n) => /\.yaml$/.test(n))) {
    const doc = yaml.load(fs.readFileSync(path.join(svcDir, f), 'utf8'));
    const service = path.basename(f, '.yaml');
    const resources = (doc.components || {})['x-stackQL-resources'] || {};
    for (const [resource, res] of Object.entries(resources)) {
      const selectRefs = new Set(
        ((res.sqlVerbs || {}).select || []).map((s) => s.$ref.split('/').pop()),
      );
      for (const [method, m] of Object.entries(res.methods || {})) {
        if (!selectRefs.has(method)) continue;
        const op = deref(doc, m.operation);
        const media = op && op.requestBody && op.requestBody.content
          && op.requestBody.content['application/json'];
        if (!media) continue;
        const schema = deref(doc, media.schema) || {};
        const required = schema.required || [];
        const params = Object.entries(schema.properties || {})
          .filter(([name]) => !UNDOCUMENTED_BODY_PARAMS.includes(name))
          .map(([name, prop]) => {
            const p = deref(doc, prop) || {};
            return {
              name,
              type: p.type || 'string',
              required: required.includes(name),
              description: firstParagraph(p.description),
            };
          });
        if (params.length) out.push({ service, resource, method, params });
      }
    }
  }
  return out;
}

// first paragraph only, single line, MDX-safe (full descriptions can contain
// multi-paragraph markdown with code fences — too much for a table cell)
function firstParagraph(desc) {
  const para = String(desc || '').split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, ' ').trim();
  return para
    .replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
    .replace(/<([^>]*)>/g, '`$1`');
}

// ---- doc edits ----------------------------------------------------------------

function paramLink(name) {
  return `<a href="#parameter-${name}"><code>${name}</code></a>`;
}

// Methods table: append missing optional body params to the method row's
// "Optional Params" cell (body params first, header params after)
function enrichMethodsTable(lines, method, optionalParams) {
  const nameCell = `<td><a href="#${method}"><CopyableCode code="${method}" /></a></td>`;
  for (let i = 0; i < lines.length - 3; i++) {
    if (lines[i].trim() !== nameCell) continue;
    if (!lines[i + 1].includes('code="select"')) continue;
    const cellIdx = i + 3;
    const m = /^(\s*)<td>(.*)<\/td>\s*$/.exec(lines[cellIdx]);
    if (!m) return false;
    const existing = m[2];
    const add = optionalParams.filter((p) => !existing.includes(`#parameter-${p.name}"`));
    if (!add.length) return true;
    const links = add.map((p) => paramLink(p.name)).join(', ');
    lines[cellIdx] = `${m[1]}<td>${links}${existing ? ', ' + existing : ''}</td>`;
    return true;
  }
  return false;
}

// Parameters table: add a row for every body param that has no
// id="parameter-<name>" row yet (appended before </tbody>, alphabetical
// among themselves; existing rows untouched)
function enrichParametersTable(text, params) {
  const missing = params
    .filter((p) => !text.includes(`<tr id="parameter-${p.name}">`))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!missing.length) return text;
  const heading = text.indexOf('\n## Parameters');
  if (heading < 0) return text;
  const close = text.indexOf('</tbody>', heading);
  if (close < 0) return text;
  const rows = missing.map((p) => [
    `<tr id="parameter-${p.name}">`,
    `    <td><CopyableCode code="${p.name}" /></td>`,
    `    <td><code>${p.type}</code></td>`,
    `    <td>${p.description}</td>`,
    '</tr>',
    '',
  ].join('\n')).join('');
  return text.slice(0, close) + rows + text.slice(close);
}

// SELECT examples: extend the method's SQL sample with the optional body
// params; nest into Query Shape / Query Example tabs when a curated example
// exists
function enrichSelectExample(text, method, optionalParams, example) {
  const heading = text.indexOf('\n## `SELECT` examples');
  if (heading < 0) return text;
  const tabOpen = text.indexOf(`<TabItem value="${method}">`, heading);
  if (tabOpen < 0) return text;
  const sqlStart = text.indexOf('```sql', tabOpen);
  if (sqlStart < 0) return text;
  if (text.slice(tabOpen, sqlStart).includes('<Tabs')) return text; // already enriched (defensive)
  const sqlEnd = text.indexOf('\n```', sqlStart + 6);
  if (sqlEnd < 0) return text;
  const blockEnd = sqlEnd + '\n```'.length;
  const sql = text.slice(sqlStart + '```sql\n'.length, sqlEnd);

  // append optional body params ahead of the closing `;`
  const lines = sql.split('\n');
  const semi = lines.lastIndexOf(';');
  const insertAt = semi >= 0 ? semi : lines.length;
  const hasWhere = lines.some((l) => /^WHERE\s/.test(l.trim()));
  const add = optionalParams
    .filter((p) => !lines.some((l) => new RegExp(`^(WHERE|AND)\\s+"?${p.name}"?\\s*=`).test(l.trim())))
    .map((p, i) => `${!hasWhere && i === 0 ? 'WHERE' : 'AND'} ${p.name} = '{{ ${p.name} }}'`);
  const shapeSql = [...lines.slice(0, insertAt), ...add, ...lines.slice(insertAt)].join('\n');
  const shapeBlock = '```sql\n' + shapeSql + '\n```';

  if (!example) {
    return text.slice(0, sqlStart) + shapeBlock + text.slice(blockEnd);
  }
  const exampleBlock = '```sql\n' + example.trimEnd() + '\n```';
  const nested = [
    '<Tabs',
    "    defaultValue=\"shape\"",
    '    values={[',
    "        { label: 'Query Shape', value: 'shape' },",
    "        { label: 'Query Example', value: 'example' }",
    '    ]}',
    '>',
    '<TabItem value="shape">',
    '',
    shapeBlock,
    '</TabItem>',
    '<TabItem value="example">',
    '',
    exampleBlock,
    '</TabItem>',
    '</Tabs>',
  ].join('\n');
  return text.slice(0, sqlStart) + nested + text.slice(blockEnd);
}

// ---- main ---------------------------------------------------------------------

const targets = discover();
let changed = 0;
for (const t of targets) {
  const docPath = path.join(docsDir, 'services', t.service, t.resource, 'index.md');
  if (!fs.existsSync(docPath)) {
    console.warn(`enrich-select-docs: no doc page for ${t.service}.${t.resource} (${docPath})`);
    continue;
  }
  const optional = t.params.filter((p) => !p.required);
  const exampleKey = `${t.service}.${t.resource}.${t.method}`;
  const example = examples[exampleKey];
  if (!example) {
    console.warn(`enrich-select-docs: no curated example for ${provider}:${exampleKey} — Query Shape only`);
  }
  let text = fs.readFileSync(docPath, 'utf8');
  const before = text;

  const lines = text.split('\n');
  if (!enrichMethodsTable(lines, t.method, optional)) {
    console.warn(`enrich-select-docs: Methods-table row not found for ${exampleKey}`);
  }
  text = lines.join('\n');
  text = enrichParametersTable(text, t.params);
  text = enrichSelectExample(text, t.method, optional, example);

  if (text !== before) {
    fs.writeFileSync(docPath, text);
    changed++;
  }
}
console.log(`enrich-select-docs (${provider}): ${targets.length} body-bearing SELECT method(s), ${changed} page(s) updated`);
