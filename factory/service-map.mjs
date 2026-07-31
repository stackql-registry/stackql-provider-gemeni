// Path -> service taxonomy for the `gemini` provider (10 services).
// One service per top-level discovery resource (the `media` resource
// disappears: both its methods are excluded upload paths). The converted
// spec has no tags, so provider-utils `split` runs with
// --svc-discriminator=function pointed at this module's default export.
//
// Taxonomy is pinned in CLAUDE.md - changes need explicit confirmation.

const PREFIX_MAP = [
  ['/v1beta/models', 'models'],
  ['/v1beta/tunedModels', 'tuned_models'],
  ['/v1beta/files', 'files'],
  ['/v1beta/generatedFiles', 'generated_files'],
  ['/v1beta/cachedContents', 'cached_contents'],
  ['/v1beta/corpora', 'corpora'],
  ['/v1beta/fileSearchStores', 'file_search_stores'],
  ['/v1beta/batches', 'batches'],
  ['/v1beta/auth_tokens', 'auth_tokens'],
  ['/v1beta/dynamic', 'dynamic'],
];

export default function serviceForPath(pathKey /*, operationId, tags, ctx */) {
  for (const [prefix, service] of PREFIX_MAP) {
    if (pathKey === prefix || pathKey.startsWith(`${prefix}/`) || pathKey.startsWith(`${prefix}:`) || pathKey.startsWith(`${prefix}?`)) {
      return service;
    }
  }
  throw new Error(`service-map: no service mapping for path '${pathKey}' - extend PREFIX_MAP (taxonomy change needs confirmation)`);
}
