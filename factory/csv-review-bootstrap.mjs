#!/usr/bin/env node
// ONE-TIME CSV mapping review (applied 2026-07-31; the CSV is append-only
// now - new ops from spec bumps land via `analyze` with empty mappings and
// are reviewed by hand, NOT by re-running this).
//
//   node factory/csv-review-bootstrap.mjs
//
// Rewrites provider-dev/config/all_services.csv's mapping columns
// (stackql_resource_name, stackql_method_name, stackql_verb) from the
// reviewed taxonomy below. Design rules applied (CLAUDE.md):
//   - one select shape per resource (rule 7): inference ops split into
//     per-response-shape resources (content, token_counts, embeddings,
//     batch_embeddings, answers, predictions)
//   - create->insert, get/list->select, patch->update, delete->delete;
//     result-set inference ops -> select; lifecycle/RPC and LRO enqueue ops
//     -> exec (rule 5)
//   - legacy PaLM ops (generateText/generateMessage/embedText/batchEmbedText/
//     countTextTokens/countMessageTokens) -> exec on `text`/`messages`
//     resources: deprecated surface, kept dispatchable, not SELECT-routed
//   - batches update ops relocate to per-shape resources
//     (generate_content_batches / embed_content_batches) - their response
//     shapes differ from the Operation-shaped `batches` resource and their
//     required-param signatures would clash under one resource (guard 3)
//   - objectKey column stays EMPTY: post-pass stamps it structurally

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(path.dirname(here), 'provider-dev', 'config', 'all_services.csv');

// operationId -> [resource, method, verb]
const MAP = {
  // models service
  'models.get': ['models', 'get', 'select'],
  'models.list': ['models', 'list', 'select'],
  'models.generateContent': ['content', 'generate_content', 'select'],
  'models.batchGenerateContent': ['content', 'batch_generate_content', 'exec'],
  'models.countTokens': ['token_counts', 'count_tokens', 'select'],
  'models.embedContent': ['embeddings', 'embed_content', 'select'],
  'models.asyncBatchEmbedContent': ['embeddings', 'async_batch_embed_content', 'exec'],
  'models.batchEmbedContents': ['batch_embeddings', 'batch_embed_contents', 'select'],
  'models.generateAnswer': ['answers', 'generate_answer', 'select'],
  'models.predict': ['predictions', 'predict', 'select'],
  'models.predictLongRunning': ['predictions', 'predict_long_running', 'exec'],
  'models.generateText': ['text', 'generate_text', 'exec'],
  'models.embedText': ['text', 'embed_text', 'exec'],
  'models.batchEmbedText': ['text', 'batch_embed_text', 'exec'],
  'models.countTextTokens': ['text', 'count_text_tokens', 'exec'],
  'models.generateMessage': ['messages', 'generate_message', 'exec'],
  'models.countMessageTokens': ['messages', 'count_message_tokens', 'exec'],
  'models.operations.get': ['operations', 'get', 'select'],
  'models.operations.list': ['operations', 'list', 'select'],
  // tuned_models service
  'tunedModels.create': ['tuned_models', 'create', 'insert'],
  'tunedModels.get': ['tuned_models', 'get', 'select'],
  'tunedModels.list': ['tuned_models', 'list', 'select'],
  'tunedModels.patch': ['tuned_models', 'patch', 'update'],
  'tunedModels.delete': ['tuned_models', 'delete', 'delete'],
  'tunedModels.transferOwnership': ['tuned_models', 'transfer_ownership', 'exec'],
  'tunedModels.generateContent': ['content', 'generate_content', 'select'],
  'tunedModels.batchGenerateContent': ['content', 'batch_generate_content', 'exec'],
  'tunedModels.asyncBatchEmbedContent': ['embeddings', 'async_batch_embed_content', 'exec'],
  'tunedModels.generateText': ['text', 'generate_text', 'exec'],
  'tunedModels.operations.get': ['operations', 'get', 'select'],
  'tunedModels.operations.list': ['operations', 'list', 'select'],
  'tunedModels.permissions.create': ['permissions', 'create', 'insert'],
  'tunedModels.permissions.get': ['permissions', 'get', 'select'],
  'tunedModels.permissions.list': ['permissions', 'list', 'select'],
  'tunedModels.permissions.patch': ['permissions', 'patch', 'update'],
  'tunedModels.permissions.delete': ['permissions', 'delete', 'delete'],
  // batches service
  'batches.get': ['batches', 'get', 'select'],
  'batches.list': ['batches', 'list', 'select'],
  'batches.delete': ['batches', 'delete', 'delete'],
  'batches.cancel': ['batches', 'cancel', 'exec'],
  'batches.updateGenerateContentBatch': ['generate_content_batches', 'patch', 'update'],
  'batches.updateEmbedContentBatch': ['embed_content_batches', 'patch', 'update'],
  // files service
  'files.get': ['files', 'get', 'select'],
  'files.list': ['files', 'list', 'select'],
  'files.delete': ['files', 'delete', 'delete'],
  'files.register': ['files', 'register', 'insert'],
  // generated_files service
  'generatedFiles.list': ['generated_files', 'list', 'select'],
  'generatedFiles.operations.get': ['operations', 'get', 'select'],
  // cached_contents service
  'cachedContents.create': ['cached_contents', 'create', 'insert'],
  'cachedContents.get': ['cached_contents', 'get', 'select'],
  'cachedContents.list': ['cached_contents', 'list', 'select'],
  'cachedContents.patch': ['cached_contents', 'patch', 'update'],
  'cachedContents.delete': ['cached_contents', 'delete', 'delete'],
  // corpora service
  'corpora.create': ['corpora', 'create', 'insert'],
  'corpora.get': ['corpora', 'get', 'select'],
  'corpora.list': ['corpora', 'list', 'select'],
  'corpora.delete': ['corpora', 'delete', 'delete'],
  'corpora.operations.get': ['operations', 'get', 'select'],
  'corpora.permissions.create': ['permissions', 'create', 'insert'],
  'corpora.permissions.get': ['permissions', 'get', 'select'],
  'corpora.permissions.list': ['permissions', 'list', 'select'],
  'corpora.permissions.patch': ['permissions', 'patch', 'update'],
  'corpora.permissions.delete': ['permissions', 'delete', 'delete'],
  // file_search_stores service
  'fileSearchStores.create': ['file_search_stores', 'create', 'insert'],
  'fileSearchStores.get': ['file_search_stores', 'get', 'select'],
  'fileSearchStores.list': ['file_search_stores', 'list', 'select'],
  'fileSearchStores.delete': ['file_search_stores', 'delete', 'delete'],
  'fileSearchStores.importFile': ['file_search_stores', 'import_file', 'exec'],
  'fileSearchStores.documents.get': ['documents', 'get', 'select'],
  'fileSearchStores.documents.list': ['documents', 'list', 'select'],
  'fileSearchStores.documents.delete': ['documents', 'delete', 'delete'],
  'fileSearchStores.operations.get': ['operations', 'get', 'select'],
  'fileSearchStores.upload.operations.get': ['upload_operations', 'get', 'select'],
  // auth_tokens service
  'auth_tokens.create': ['tokens', 'create', 'insert'],
  // dynamic service
  'dynamic.generateContent': ['content', 'generate_content', 'select'],
};

// minimal CSV parse that respects quoted fields
function parseLine(line) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
function toLine(fields) {
  return fields.map((f) => (/[",\n]/.test(f) ? `"${f.replace(/"/g, '""')}"` : f)).join(',');
}

const lines = fs.readFileSync(csvPath, 'utf8').split('\n').filter((l) => l.trim());
const header = lines[0];
const seen = new Set();
const out = [header];
for (const line of lines.slice(1)) {
  const f = parseLine(line);
  const opId = f[2];
  const m = MAP[opId];
  if (!m) throw new Error(`no reviewed mapping for operationId ${opId}`);
  f[8] = m[0]; // stackql_resource_name
  f[9] = m[1]; // stackql_method_name
  f[10] = m[2]; // stackql_verb
  f[11] = '';  // stackql_object_key - stamped structurally by post-pass
  out.push(toLine(f));
  seen.add(opId);
}
const unmapped = Object.keys(MAP).filter((k) => !seen.has(k));
if (unmapped.length) throw new Error(`mapping entries not found in CSV: ${unmapped.join(', ')}`);
fs.writeFileSync(csvPath, out.join('\n') + '\n');
console.log(`csv-review: ${out.length - 1} rows mapped across ${new Set([...Object.values(MAP)].map((x) => x[0])).size} resources`);
