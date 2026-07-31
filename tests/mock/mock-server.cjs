#!/usr/bin/env node
// Wire-contract mock for the stackql `gemini` provider smoke suite.
//
//   node tests/mock/mock-server.cjs [port]
//
// The mock REJECTS wire-contract violations rather than pattern-matching
// SQL plumbing:
//   - every request without an `x-goog-api-key` header -> 401
//   - any request carrying a `key` query param -> 400 (auth must never be
//     in the query string)
//   - body-bearing inference ops validate that naive body translate fanned
//     JSON-typed SQL values out to REAL arrays/objects (contents must be an
//     array of objects with `parts`), not strings
//   - request URLs are PARSED, never string-matched (stackql appends a bare
//     `?` when no query params are supplied - wire-verified)
//   - GET /v1beta/models is served in 2 pageToken pages (3+2) so a passing
//     list test proves auto-pagination walks nextPageToken to the end

const http = require('http');

const port = parseInt(process.argv[2] || '8990', 10);

const MODELS = [1, 2, 3, 4, 5].map((i) => ({
  name: `models/mock-model-${i}`,
  displayName: `Mock Model ${i}`,
  version: '001',
  description: `Mock model number ${i}`,
  inputTokenLimit: 1048576,
  outputTokenLimit: 65536,
  supportedGenerationMethods: ['generateContent', 'countTokens'],
  temperature: 1,
  topP: 0.95,
  topK: 64,
}));

const FILES = [
  { name: 'files/mock-file-1', displayName: 'mock-file-1.txt', mimeType: 'text/plain', sizeBytes: '42', state: 'ACTIVE' },
  { name: 'files/mock-file-2', displayName: 'mock-file-2.png', mimeType: 'image/png', sizeBytes: '1042', state: 'ACTIVE' },
];

const CACHED = [
  { name: 'cachedContents/mock-cache-1', model: 'models/mock-model-1', displayName: 'smoke cache', usageMetadata: { totalTokenCount: 512 } },
];

const BATCHES = [
  { name: 'batches/mock-batch-1', metadata: { state: 'BATCH_STATE_SUCCEEDED' }, done: true },
  { name: 'batches/mock-batch-2', metadata: { state: 'BATCH_STATE_PENDING' }, done: false },
];

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(body);
}

function err(res, code, message) {
  send(res, code, { error: { code, message, status: code === 401 ? 'UNAUTHENTICATED' : 'INVALID_ARGUMENT' } });
}

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const p = url.pathname;
    const method = req.method;

    // ---- wire contract ------------------------------------------------------
    if (url.searchParams.has('key')) {
      return err(res, 400, 'mock: `key` query param is forbidden - auth is the x-goog-api-key header');
    }
    if (!req.headers['x-goog-api-key']) {
      return err(res, 401, 'mock: missing x-goog-api-key header');
    }

    let json = null;
    if (body) {
      try { json = JSON.parse(body); } catch { return err(res, 400, 'mock: request body is not JSON'); }
    }

    // ---- models -------------------------------------------------------------
    if (method === 'GET' && p === '/v1beta/models') {
      const tok = url.searchParams.get('pageToken');
      if (!tok) return send(res, 200, { models: MODELS.slice(0, 3), nextPageToken: 'page-2' });
      if (tok === 'page-2') return send(res, 200, { models: MODELS.slice(3) });
      return err(res, 400, `mock: unknown pageToken ${tok}`);
    }
    let m = p.match(/^\/v1beta\/models\/([^/:]+)$/);
    if (method === 'GET' && m) {
      const found = MODELS.find((x) => x.name === `models/${m[1]}`);
      return found ? send(res, 200, found) : err(res, 404, 'mock: no such model');
    }
    m = p.match(/^\/v1beta\/models\/([^/:]+):generateContent$/);
    if (method === 'POST' && m) {
      if (!Array.isArray(json?.contents) || !json.contents.every((c) => c && typeof c === 'object' && Array.isArray(c.parts))) {
        return err(res, 400, 'mock: `contents` must arrive as a real array of objects with `parts` (naive body translate)');
      }
      return send(res, 200, {
        candidates: [{ content: { parts: [{ text: 'mock completion' }], role: 'model' }, finishReason: 'STOP', index: 0 }],
        usageMetadata: { promptTokenCount: 7, candidatesTokenCount: 3, totalTokenCount: 10 },
        modelVersion: m[1],
        responseId: 'mock-response-1',
      });
    }
    m = p.match(/^\/v1beta\/models\/([^/:]+):countTokens$/);
    if (method === 'POST' && m) {
      if (!Array.isArray(json?.contents) && !json?.generateContentRequest) {
        return err(res, 400, 'mock: countTokens needs `contents` (array) or `generateContentRequest`');
      }
      return send(res, 200, { totalTokens: 42, promptTokensDetails: [{ modality: 'TEXT', tokenCount: 42 }] });
    }
    m = p.match(/^\/v1beta\/models\/([^/:]+):embedContent$/);
    if (method === 'POST' && m) {
      if (typeof json?.content !== 'object' || json.content === null) {
        return err(res, 400, 'mock: embedContent needs a `content` object');
      }
      return send(res, 200, { embedding: { values: [0.1, 0.2, 0.3] } });
    }

    // ---- files --------------------------------------------------------------
    if (method === 'GET' && p === '/v1beta/files') {
      return send(res, 200, { files: FILES });
    }

    // ---- cachedContents -----------------------------------------------------
    if (method === 'GET' && p === '/v1beta/cachedContents') {
      return send(res, 200, { cachedContents: CACHED });
    }
    m = p.match(/^\/v1beta\/cachedContents\/([^/:]+)$/);
    if (method === 'DELETE' && m) {
      return send(res, 200, {});
    }

    // ---- corpora (INSERT lifecycle) ----------------------------------------
    if (method === 'POST' && p === '/v1beta/corpora') {
      if (typeof json?.displayName !== 'string') {
        return err(res, 400, 'mock: corpora.create needs a string `displayName`');
      }
      return send(res, 200, { name: 'corpora/mock-corpus-1', displayName: json.displayName, createTime: '2026-07-31T00:00:00Z', updateTime: '2026-07-31T00:00:00Z' });
    }

    // ---- batches (Operation-shaped resource + EXEC cancel) ------------------
    if (method === 'GET' && p === '/v1beta/batches') {
      return send(res, 200, { operations: BATCHES });
    }
    m = p.match(/^\/v1beta\/batches\/([^/:]+)$/);
    if (method === 'GET' && m) {
      const found = BATCHES.find((x) => x.name === `batches/${m[1]}`);
      return found ? send(res, 200, found) : err(res, 404, 'mock: no such batch');
    }
    m = p.match(/^\/v1beta\/batches\/([^/:]+):cancel$/);
    if (method === 'POST' && m) {
      return send(res, 200, {});
    }

    // ---- tunedModels --------------------------------------------------------
    if (method === 'GET' && p === '/v1beta/tunedModels') {
      return send(res, 200, { tunedModels: [{ name: 'tunedModels/mock-tuned-1', displayName: 'Mock Tuned', state: 'ACTIVE', baseModel: 'models/mock-model-1' }] });
    }

    return err(res, 404, `mock: unhandled route ${method} ${p}`);
  });
});

server.listen(port, () => {
  console.log(`gemini mock listening on ${port}`);
});
