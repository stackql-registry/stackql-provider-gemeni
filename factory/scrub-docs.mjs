#!/usr/bin/env node
// Post-docgen scrub for the generated microsite docs.
//
//   node factory/scrub-docs.mjs --docs-dir DIR --provider-root DIR
//
// API primitives stay beneath the user-visible SQL surface. Suppressed from
// the docs (all derived mechanically from the generated provider specs):
//   - ALL header params (`in: header`): auth (`x-api-key`) must never be
//     shown as a queryable param, and `anthropic-version` / `anthropic-beta`
//     are auto-injected by stackql from their schema defaults (wire-verified);
//   - pagination request tokens (`page`): auto-pagination walks the cursor,
//     collected from each method's `config.pagination.requestToken` (query
//     location only);
//   - LIMIT-pushdown params (`limit`): SQL `LIMIT n` reaches the wire via
//     each method's `config.queryParamPushdown.top.paramName` (wire-verified
//     on v0.10.542) — users write LIMIT, not a `limit` param.
// Documented params are therefore path, query (minus paging), and
// request-body ONLY. Every doc surface is scrubbed:
//   1. SQL samples: WHERE/AND condition lines, INSERT column/value pairs
//      (positional), EXEC @param lines (comma re-fixing throughout);
//   2. Methods-table Required/Optional Params cells (link removal);
//   3. Parameters-table rows (a table left empty collapses to a sentence);
//   4. INSERT "Manifest" yaml props.
// KEEP_HEADERS is the escape hatch for functional headers that should stay
// user-visible (empty by design for now — e.g. add 'Anthropic-Worker-ID' to
// re-document work_items worker identity).
//
// Also (unchanged from the original scrub): identifiers stackql's parser
// cannot take bare — hyphenated or bracketed (`created_at[gte]`, `group_by[]`)
// — are DOUBLE-QUOTED in conditions and column lists. (Empirical, stackql
// v0.10.542: backtick-quoting is a parser error for both shapes; double
// quotes are the only working form.)
//
// Runs AFTER enrich-select-docs.mjs in the docgen npm scripts (enrich adds
// body-param rows before empty-table collapse is evaluated); idempotent.

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

function argOf(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}
const docsDir = argOf('--docs-dir');
const providerRoot = argOf('--provider-root');
if (!docsDir || !providerRoot) {
  console.error('usage: scrub-docs.mjs --docs-dir DIR --provider-root DIR [--keep h1,h2]');
  process.exit(1);
}

// escape hatch for functional headers that should stay user-visible for a
// given provider (comma-separated), e.g. --keep anthropic-beta on the admin
// docgen would re-document the fast-mode usage/cost reports
const KEEP_HEADERS = (argOf('--keep') || '').split(',').filter(Boolean);

// ---- suppressed-param set, from the generated specs ---------------------------

function collectSuppressedParams() {
  const names = new Set();
  const svcDir = path.join(providerRoot, 'services');
  for (const f of fs.readdirSync(svcDir).filter((n) => /\.yaml$/.test(n))) {
    const doc = yaml.load(fs.readFileSync(path.join(svcDir, f), 'utf8'));
    const shared = ((doc.components || {}).parameters) || {};
    const collect = (p) => {
      if (p && p.$ref) p = shared[p.$ref.split('/').pop()];
      if (p && p.in === 'header' && !KEEP_HEADERS.includes(p.name)) names.add(p.name);
    };
    for (const pathItem of Object.values(doc.paths || {})) {
      (pathItem.parameters || []).forEach(collect);
      for (const op of Object.values(pathItem)) {
        if (op && typeof op === 'object' && Array.isArray(op.parameters)) op.parameters.forEach(collect);
      }
    }
    // paging primitives, from the stamped method configs
    for (const res of Object.values((doc.components || {})['x-stackQL-resources'] || {})) {
      for (const m of Object.values(res.methods || {})) {
        const pag = m.config?.pagination?.requestToken;
        if (pag && pag.location === 'query' && pag.key) names.add(pag.key);
        const top = m.config?.queryParamPushdown?.top;
        if (top && top.paramName) names.add(top.paramName);
      }
    }
  }
  return names;
}
const SUPPRESSED = collectSuppressedParams();
const isSuppressed = (name) => SUPPRESSED.has(String(name).replace(/^["'`]|["'`]$/g, ''));

// ---- SQL sample scrub ---------------------------------------------------------

function quoteIdentifier(name) {
  if (/^".*"$/.test(name)) return name;
  if (/[-[\]]/.test(name)) return `"${name}"`;
  return name;
}

// a WHERE/AND condition line for a header param, e.g.
//   `AND "x-api-key" = '{{ x-api-key }}'` or `WHERE authorization = '...'`
function isSuppressedCond(line) {
  const m = /^(WHERE|AND)\s+(\S+)\s*=/.exec(line.trim());
  return m ? isSuppressed(m[2]) : false;
}

function stripTrailingComma(line) {
  return line.replace(/,\s*$/, '').trimEnd();
}
function ensureTrailingComma(line) {
  return /,\s*$/.test(line) ? line.trimEnd() : line.trimEnd() + ',';
}

// INSERT samples: columns and values are line-aligned lists — drop header
// columns together with their positional value lines, then re-fix commas
function scrubInsertBlock(lines) {
  const openIdx = lines.findIndex((l) => /^INSERT INTO\s+\S+\s*\($/.test(l.trim()));
  if (openIdx < 0) return lines;
  const closeIdx = lines.findIndex((l, i) => i > openIdx && l.trim() === ')');
  const selIdx = lines.findIndex((l, i) => i > closeIdx && /^SELECT\s*$/.test(l.trim()));
  if (closeIdx < 0 || selIdx < 0) return lines;
  const valEnd = lines.findIndex((l, i) => i > selIdx && /^(RETURNING|;)\s*$/.test(l.trim()));
  const end = valEnd < 0 ? lines.length : valEnd;

  const cols = lines.slice(openIdx + 1, closeIdx);
  const vals = lines.slice(selIdx + 1, end);
  if (cols.length !== vals.length) return lines; // unexpected shape — leave untouched

  const kept = [];
  for (let i = 0; i < cols.length; i++) {
    const name = stripTrailingComma(cols[i]).trim();
    if (!isSuppressed(name)) kept.push([cols[i], vals[i]]);
  }
  const fix = (arr) => arr.map((l, i) => (i < arr.length - 1 ? ensureTrailingComma(stripTrailingComma(l)) : stripTrailingComma(l)));
  const newCols = fix(kept.map((p) => p[0]));
  const newVals = fix(kept.map((p) => p[1]));
  return [
    ...lines.slice(0, openIdx + 1),
    ...newCols,
    ...lines.slice(closeIdx, selIdx + 1),
    ...newVals,
    ...lines.slice(end),
  ];
}

// EXEC samples: drop @header='...' lines, re-fix the trailing commas
// (`--required` line comments swallow a following comma, so a surviving last
// line also gets its post-comment comma stripped)
function scrubExecBlock(lines) {
  if (!lines.some((l) => /^EXEC\s/.test(l.trim()))) return lines;
  const isParam = (l) => /^@[\w"-]+\s*=/.test(l.trim());
  const kept = lines.filter((l) => {
    if (!isParam(l)) return true;
    const name = /^@("?[\w-]+"?)\s*=/.exec(l.trim())[1];
    return !isSuppressed(name);
  });
  const paramIdxs = kept.map((l, i) => (isParam(l) ? i : -1)).filter((i) => i >= 0);
  return kept.map((l, i) => {
    if (!paramIdxs.includes(i)) return l;
    const last = i === paramIdxs[paramIdxs.length - 1];
    return last ? stripTrailingComma(l) : ensureTrailingComma(stripTrailingComma(l)) + ' ';
  });
}

function scrubSqlBlock(lines) {
  // drop header-param conditions, then re-chain so the first surviving
  // condition uses WHERE
  let kept = lines.filter((l) => !isSuppressedCond(l));
  const isCond = (l) => /^(WHERE|AND)\s+\S+\s*=/.test(l.trim());
  let seenFirst = false;
  kept = kept.map((l) => {
    if (!isCond(l)) return l;
    const t = l.trim();
    const rest = t.replace(/^(WHERE|AND)\s+/, '');
    const out = (seenFirst ? 'AND ' : 'WHERE ') + rest;
    seenFirst = true;
    return out;
  });
  // double-quote awkward identifiers in surviving conditions
  kept = kept.map((l) => {
    const m = /^(WHERE|AND)\s+(\S+)(\s*=.*)$/.exec(l);
    if (!m) return l;
    return `${m[1]} ${quoteIdentifier(m[2])}${m[3]}`;
  });
  kept = scrubInsertBlock(kept);
  kept = scrubExecBlock(kept);
  // column-list lines that are a bare awkward identifier — same quoting rule
  kept = kept.map((l) => {
    const m = /^([A-Za-z_][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+)(,?)\s*$/.exec(l);
    if (!m) return l;
    return `${quoteIdentifier(m[1])}${m[2]}`;
  });
  return kept;
}

// ---- table and manifest scrubs ------------------------------------------------

// Methods table: remove header-param links from Required/Optional Params cells
function scrubMethodsCells(text) {
  const start = text.indexOf('\n## Methods');
  if (start < 0) return text;
  const end = text.indexOf('\n## ', start + 1);
  const region = text.slice(start, end < 0 ? text.length : end);
  const scrubbed = region.split('\n').map((line) => {
    const m = /^(\s*)<td>(.*#parameter-.*)<\/td>\s*$/.exec(line);
    if (!m) return line;
    const parts = m[2].split(', ').filter((part) => {
      const pm = /#parameter-([^"]+)"/.exec(part);
      return !(pm && isSuppressed(decodeURIComponent(pm[1])));
    });
    return `${m[1]}<td>${parts.join(', ')}</td>`;
  }).join('\n');
  return text.slice(0, start) + scrubbed + (end < 0 ? '' : text.slice(end));
}

// Parameters table: remove header rows; collapse the table if nothing is left
function scrubParametersTable(text) {
  for (const h of SUPPRESSED) {
    // header names are [\w-]+ — no regex metachars to escape
    const re = new RegExp(`<tr id="parameter-${h}">[\\s\\S]*?</tr>\\n?`, 'g');
    text = text.replace(re, '');
  }
  const start = text.indexOf('\n## Parameters');
  if (start < 0) return text;
  const end = text.indexOf('\n## ', start + 1);
  const region = text.slice(start, end < 0 ? text.length : end);
  if (region.includes('<tr id="parameter-')) return text;
  const collapsed = `\n## Parameters\n\nThis resource's methods take no path, query, or request-body parameters; authentication and API-version headers are handled automatically.\n\n`;
  return text.slice(0, start) + collapsed + (end < 0 ? '' : text.slice(end));
}

// INSERT "Manifest" yaml tabs: remove header-param prop entries
function scrubManifest(lines) {
  const out = [];
  let skipping = false;
  for (const line of lines) {
    const m = /^(\s{4})- name: (\S+)\s*$/.exec(line);
    if (m) skipping = isSuppressed(m[2]);
    else if (skipping && !/^\s{6,}/.test(line)) skipping = false;
    if (!skipping) out.push(line);
  }
  return out;
}

// ---- main ---------------------------------------------------------------------

let filesChanged = 0;
const stack = [docsDir];
while (stack.length) {
  const d = stack.pop();
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { stack.push(p); continue; }
    if (!/\.mdx?$/.test(e.name)) continue;
    const text = fs.readFileSync(p, 'utf8');
    let next = scrubMethodsCells(text);
    next = scrubParametersTable(next);
    const lines = next.split('\n');
    const out = [];
    let inSql = false, inManifest = false, block = [];
    for (const line of lines) {
      if (!inSql && !inManifest && /^```sql\s*$/.test(line)) { inSql = true; out.push(line); block = []; continue; }
      if (inSql && /^```\s*$/.test(line)) { out.push(...scrubSqlBlock(block)); out.push(line); inSql = false; continue; }
      if (!inSql && !inManifest && /<CodeBlock language="yaml">\{`/.test(line)) { inManifest = true; out.push(line); block = []; continue; }
      if (inManifest && /`\}<\/CodeBlock>/.test(line)) { out.push(...scrubManifest(block)); out.push(line); inManifest = false; continue; }
      if (inSql || inManifest) block.push(line);
      else out.push(line);
    }
    next = out.join('\n');
    if (next !== text) { fs.writeFileSync(p, next); filesChanged++; }
  }
}
console.log(`scrub-docs: scrubbed ${SUPPRESSED.size} suppressed param(s) [${[...SUPPRESSED].join(', ')}] from ${filesChanged} file(s) under ${docsDir}`);
