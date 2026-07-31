#!/usr/bin/env node
// Manifest-driven smoke runner for the `gemini` provider (architecture
// mirrors stackql-provider-anthropic/tests/smoke.cjs).
//
// Modes:
//   mock (default) — starts tests/mock/mock-server.cjs, copies the generated
//     registry to a temp dir, rewrites each service's `servers:` block to the
//     mock, and runs the manifest with a synthetic key. The mock REJECTS
//     wire-contract violations, so a passing run proves headers/auth/body
//     behaviour, not just row plumbing.
//   live — gated on the provider env var (config.live_env_var); runs only
//     manifest tests tagged `live: true`. Admin live tests are READ-ONLY.
//
//   node tests/smoke.cjs [--manifest tests/manifest.yaml] [--live]
//     [--only name1,name2] [--stackql PATH] [--verbose]
//
// Manifest schema (per test):
//   name, description, file (relative to config.queries_dir)
//   env:          extra env vars for this invocation
//   expect:       { min_rows, contains: [..], not_contains: [..], equals_rows }
//   expect_error: substring that must appear in stderr/stdout (test PASSES on it)
//   exports:      [{ name, column }] — publish row[0][column] as {{test.name}}
//   always_run:   run even after an earlier failure (cleanup steps)
//   live:         include in --live runs (default: mock-only)
//   skip_mock:    exclude from mock runs
//
// Templates: {{ var }} placeholders resolve from manifest `vars` + exports.
// Fatal patterns (config.fatal_patterns + built-ins) fail a test even when
// expectations pass — stackql exits 0 on several hard failures.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const YAML = require('yaml');

const baseDir = path.resolve(__dirname, '..');

const DEFAULT_FATAL = [
  'duplicate column name',
  'aborting DDL run',
  'error processing response',
  'failed to transform',
  'schema unsuitable for select',
  'no such column',
  'cannot find matching operation',
  'unknown flag',
];

function argOf(flag, dflt) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : dflt;
}
const hasFlag = (f) => process.argv.includes(f);

const manifestPath = argOf('--manifest', path.join(__dirname, 'manifest.yaml'));
const live = hasFlag('--live');
const verbose = hasFlag('--verbose');
const only = (argOf('--only', '') || '').split(',').filter(Boolean);

const manifest = YAML.parse(fs.readFileSync(manifestPath, 'utf8'));
const cfg = manifest.config || {};

// Resolve the stackql binary to an ABSOLUTE path. fs.existsSync resolves
// bare names against the CWD while spawn() resolves them against PATH, so
// relative candidates must be absolutized before spawning. Order:
// --stackql / $STACKQL / config.stackql (path or PATH-resolved command) →
// <provider>/stackql → ./stackql → `stackql` on PATH → download the latest
// release into the provider dir.
function resolveStackql() {
  const { execSync } = require('child_process');
  const tryPath = (p) => {
    if (!p) return null;
    const abs = path.resolve(p);
    return fs.existsSync(abs) && fs.statSync(abs).isFile() ? abs : null;
  };
  const fromPathLookup = (cmd) => {
    try {
      const found = execSync(
        process.platform === 'win32' ? `where ${cmd}` : `command -v ${cmd}`,
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).split('\n')[0].trim();
      return found ? found : null;
    } catch (e) {
      return null;
    }
  };
  for (const candidate of [argOf('--stackql', null), process.env.STACKQL, cfg.stackql]) {
    if (!candidate) continue;
    const resolved = candidate.includes(path.sep) || candidate.includes('/')
      ? tryPath(path.resolve(path.dirname(manifestPath), candidate)) || tryPath(candidate)
      : (tryPath(candidate) || fromPathLookup(candidate));
    if (resolved) return resolved;
    console.warn(`stackql candidate '${candidate}' does not resolve to a binary - falling back`);
  }
  const local = tryPath(path.join(baseDir, 'stackql')) || tryPath(path.join(process.cwd(), 'stackql'));
  if (local) return local;
  const onPath = fromPathLookup('stackql');
  if (onPath) return onPath;
  if (process.platform !== 'linux' && process.platform !== 'darwin') {
    console.error('stackql binary not found (set STACKQL, or place ./stackql in the provider dir)');
    process.exit(2);
  }
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
  const url = `https://releases.stackql.io/stackql/latest/stackql_${process.platform}_${arch}.zip`;
  console.log(`stackql binary not found - downloading ${url}`);
  try {
    execSync(
      `curl -sSL -o stackql.zip "${url}" && unzip -o stackql.zip stackql && rm -f stackql.zip && chmod +x stackql`,
      { cwd: baseDir, stdio: ['ignore', 'inherit', 'inherit'] },
    );
  } catch (e) {
    console.error(`stackql download failed: ${e.message}`);
    process.exit(2);
  }
  const downloaded = tryPath(path.join(baseDir, 'stackql'));
  if (!downloaded) {
    console.error('stackql download did not produce a usable binary');
    process.exit(2);
  }
  return downloaded;
}
const stackqlBin = resolveStackql();
const queriesDir = path.resolve(path.dirname(manifestPath), cfg.queries_dir || 'queries');
const mockPort = cfg.mock_port || 8990;
const fatalPatterns = [...DEFAULT_FATAL, ...(cfg.fatal_patterns || [])];

if (live && !process.env[cfg.live_env_var]) {
  console.error(`--live requires ${cfg.live_env_var} to be set`);
  process.exit(2);
}

// ---- registry ----------------------------------------------------------------
function prepareRegistry() {
  const srcReg = path.resolve(path.dirname(manifestPath), cfg.registry_path || '../provider-dev/openapi');
  if (!live) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stackql-mock-reg-'));
    fs.cpSync(srcReg, tmp, { recursive: true });
    const stack = [tmp];
    while (stack.length) {
      const d = stack.pop();
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) stack.push(p);
        else if (/\.ya?ml$/.test(e.name)) {
          const text = fs.readFileSync(p, 'utf8');
          const next = text.replace(/- url: https:\/\/generativelanguage\.googleapis\.com/g, `- url: http://localhost:${mockPort}`);
          if (next !== text) fs.writeFileSync(p, next);
        }
      }
    }
    return tmp;
  }
  return srcReg;
}

// ---- template + expectation helpers -------------------------------------------
function render(tpl, vars, testName) {
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`unresolved template variable {{ ${key} }} in ${testName}`);
    return vars[key];
  });
}

function runStackql(registry, sql, extraEnv) {
  const reg = JSON.stringify({ url: `file://${registry}`, localDocRoot: registry, verifyConfig: { nopVerify: true } });
  const r = spawnSync(stackqlBin, ['--registry=' + reg, '--output=json', 'exec', sql], {
    env: { ...process.env, ...extraEnv },
    encoding: 'utf8',
    timeout: (cfg.query_timeout_seconds || 120) * 1000,
  });
  return { stdout: r.stdout || '', stderr: r.stderr || '', code: r.status };
}

function parseRows(stdout) {
  // stackql --output=json prints a JSON array (or nothing for DDL/exec)
  const text = stdout.trim();
  if (!text) return [];
  try { return JSON.parse(text); } catch { /* non-JSON chatter */ }
  const m = text.match(/\[[\s\S]*\]/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* fall through */ } }
  return [];
}

// ---- runner --------------------------------------------------------------------
async function main() {
  const registry = prepareRegistry();

  let mockChild = null;
  if (!live) {
    mockChild = spawn(process.execPath, [path.join(__dirname, 'mock', 'mock-server.cjs'), String(mockPort)], { stdio: verbose ? 'inherit' : 'ignore' });
    await new Promise((res) => setTimeout(res, 600));
    process.on('exit', () => { try { mockChild.kill(); } catch { /* gone */ } });
    // synthetic credential for the mock (the mock enforces presence via the
    // x-goog-api-key header; per-test env can override)
    process.env[cfg.live_env_var] = cfg.mock_key || 'mock-gemini-key';
  }

  const vars = { ...(manifest.vars || {}), mock_port: String(mockPort) };
  const results = [];
  let failed = false;

  for (const t of manifest.tests || []) {
    if (only.length && !only.includes(t.name)) continue;
    if (live && !t.live) continue;
    if (!live && t.skip_mock) continue;
    if (failed && !t.always_run) {
      results.push({ name: t.name, status: 'SKIP', detail: 'earlier failure' });
      continue;
    }

    const t0 = Date.now();
    let sql;
    try {
      sql = render(fs.readFileSync(path.join(queriesDir, t.file), 'utf8'), vars, t.name).trim();
    } catch (e) {
      const status = t.always_run ? 'SKIP' : 'FAIL';
      results.push({ name: t.name, status, detail: e.message });
      if (status === 'FAIL') failed = true;
      continue;
    }

    const env = {};
    for (const [k, v] of Object.entries(t.env || {})) env[k] = render(String(v), vars, t.name);
    const { stdout, stderr, code } = runStackql(registry, sql, env);
    const combined = stdout + '\n' + stderr;
    const problems = [];

    for (const pat of fatalPatterns) {
      if (combined.includes(pat)) problems.push(`fatal pattern: '${pat}'`);
    }

    if (t.expect_error) {
      if (!combined.includes(render(t.expect_error, vars, t.name))) {
        problems.push(`expected error containing '${t.expect_error}', got exit=${code}: ${combined.slice(0, 300)}`);
      }
    } else {
      if (code !== 0) problems.push(`exit code ${code}: ${combined.slice(0, 300)}`);
      const rows = parseRows(stdout);
      const exp = t.expect || {};
      if (exp.min_rows !== undefined && rows.length < exp.min_rows) {
        problems.push(`expected >= ${exp.min_rows} rows, got ${rows.length}: ${stdout.slice(0, 300)}`);
      }
      if (exp.equals_rows !== undefined && rows.length !== exp.equals_rows) {
        problems.push(`expected exactly ${exp.equals_rows} rows, got ${rows.length}`);
      }
      for (const c of exp.contains || []) {
        const needle = render(c, vars, t.name);
        if (!combined.includes(needle)) problems.push(`missing expected content '${needle}'`);
      }
      for (const c of exp.not_contains || []) {
        const needle = render(c, vars, t.name);
        if (combined.includes(needle)) problems.push(`found forbidden content '${needle}'`);
      }
      for (const ex of t.exports || []) {
        if (!rows.length || rows[0][ex.column] === undefined) {
          problems.push(`export '${ex.name}': column '${ex.column}' not in first row`);
        } else {
          vars[`${t.name}.${ex.name}`] = String(rows[0][ex.column]);
        }
      }
    }

    const status = problems.length ? 'FAIL' : 'PASS';
    if (status === 'FAIL') failed = true;
    results.push({ name: t.name, status, detail: problems.join('; '), ms: Date.now() - t0 });
    console.log(`${status === 'PASS' ? '✅' : '❌'} ${t.name} (${Date.now() - t0}ms)${problems.length ? ' — ' + problems.join('; ') : ''}`);
    if (verbose && status === 'FAIL') console.log(combined.slice(0, 1500));
  }

  const pass = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  const skip = results.filter((r) => r.status === 'SKIP').length;
  console.log(`\n${pass} passed, ${failCount} failed, ${skip} skipped`);
  process.exit(failCount ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
