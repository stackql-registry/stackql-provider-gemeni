#!/usr/bin/env node

const { runQuery } = require('@stackql/pgwire-lite');
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn, execSync } = require('child_process');

// Get current directory
const baseDir = path.resolve(path.dirname(process.argv[1]), '..');

// Default connection settings
const defaultOptions = {
  user: 'stackql',
  database: 'stackql',
  host: 'localhost',
  port: 5444,
  debug: false,
};

// Parse command line arguments
const args = process.argv.slice(2);
let provider = null;
let host = 'localhost';
let port = 5444;
let verbose = false;
let outputFormat = 'json';
let timeoutMs = 60000; // Default timeout: 60 seconds
let noServer = false;

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    switch (args[i]) {
      case '--host':
        host = args[++i];
        break;
      case '--port':
        port = parseInt(args[++i], 10);
        break;
      case '--verbose':
        verbose = true;
        break;
      case '--format':
        outputFormat = args[++i];
        if (!['json', 'csv', 'markdown'].includes(outputFormat)) {
          console.error(`Error: Invalid output format "${outputFormat}". Must be json, csv, or markdown.`);
          process.exit(1);
        }
        break;
      case '--timeout':
        timeoutMs = parseInt(args[++i], 10);
        break;
      case '--no-server':
        noServer = true;
        break;
      case '--help':
        console.log(`
Usage: test-meta-routes.js <provider> [OPTIONS]

Test all metadata routes for a StackQL provider.

Arguments:
  provider                  Name of the provider to test

Options:
  --host HOST               Server host (default: localhost). A non-local
                            host implies --no-server.
  --port PORT               Server port (default: 5444)
  --verbose                 Enable verbose output
  --format FORMAT           Output format: json, csv, markdown (default: json)
  --timeout MILLISECONDS    Query timeout in milliseconds (default: 60000)
  --no-server               Do not manage the server lifecycle; expect a
                            server already listening on host:port
  --help                    Display this help message

By default this harness owns the full server lifecycle: it kills any
stackql server on the port, starts a FRESH one (so provider specs are
never cached between runs), runs the walk, and stops the server on exit.
        `);
        process.exit(0);
        break;
      default:
        console.error(`Error: Unknown option "${args[i]}"`);
        process.exit(1);
    }
  } else if (!provider) {
    provider = args[i];
  }
}

// Check that provider was specified
if (!provider) {
  console.error('Error: Provider name must be specified');
  console.error('Usage: test-meta-routes.js <provider> [OPTIONS]');
  process.exit(1);
}

// Set up connection options
const connectionOptions = {
  ...defaultOptions,
  host,
  port,
  // Set query timeout
  statement_timeout: timeoutMs,
};

// ----- server lifecycle -----------------------------------------------------
// By default the harness owns the server: kill anything on the port, start
// fresh (provider specs are cached in-process by the server, so a stale
// server yields stale results), walk, stop. Skipped for non-local hosts
// (can't manage a remote process) and on win32 (the pinned binary is a
// Linux ELF; run the harness under WSL for managed mode).
const isLocalHost = ['localhost', '127.0.0.1'].includes(host);
const manageServer = !noServer && isLocalHost && process.platform !== 'win32';

let serverChild = null;
let serverShuttingDown = false;

function slog(msg) {
  console.log(`[server] ${msg}`);
}

function probePort() {
  return new Promise((resolve) => {
    const sock = net.connect(port, host);
    const done = (up) => {
      sock.destroy();
      resolve(up);
    };
    sock.on('connect', () => done(true));
    sock.on('error', () => done(false));
    setTimeout(() => done(false), 1500);
  });
}

async function waitUntil(cond, timeoutTotalMs, intervalMs = 500) {
  const t0 = Date.now();
  for (;;) {
    if (await cond()) return true;
    if (Date.now() - t0 > timeoutTotalMs) return false;
    await new Promise((res) => setTimeout(res, intervalMs));
  }
}

async function stopExistingServer() {
  slog(`checking for an existing server on ${host}:${port}...`);
  if (!(await probePort())) {
    slog('no existing server found');
    return;
  }
  slog('existing server found - stopping it (fresh registry load required)');
  try {
    execSync(`pkill -f -- "--pgsrv.port=${port}"`, { stdio: 'ignore' });
  } catch (e) {
    // pkill exits 1 when nothing matched; the port re-probe below decides.
  }
  if (await waitUntil(async () => !(await probePort()), 10000)) {
    slog('existing server stopped');
    return;
  }
  slog('still listening after SIGTERM - escalating to SIGKILL');
  try {
    execSync(`pkill -9 -f -- "--pgsrv.port=${port}"`, { stdio: 'ignore' });
  } catch (e) { /* see above */ }
  if (await waitUntil(async () => !(await probePort()), 8000)) {
    slog('existing server stopped');
    return;
  }
  console.error(`[server] ERROR: port ${port} is still occupied and could not be freed`);
  process.exit(1);
}

// Resolve the stackql binary to an ABSOLUTE path. fs.existsSync resolves
// bare names against the CWD while spawn() resolves them against PATH, so
// a relative candidate must be absolutized before spawning (a bare
// `STACKQL=stackql` once passed the exists-check via a repo-root file and
// then died in spawn with an unhandled ENOENT).
//
// Order: $STACKQL (path or PATH-resolved command) → <provider>/stackql →
// ./stackql → `stackql` on PATH → download the latest release into the
// provider dir (same fallback bin/start-server.sh has always had).
function resolveStackql() {
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

  const envBin = process.env.STACKQL;
  if (envBin) {
    const resolved = envBin.includes(path.sep) || envBin.includes('/')
      ? tryPath(envBin)
      : (tryPath(envBin) || fromPathLookup(envBin));
    if (resolved) return resolved;
    console.warn(`[server] STACKQL='${envBin}' does not resolve to a binary - falling back`);
  }
  const local = tryPath(path.join(baseDir, 'stackql')) || tryPath(path.join(process.cwd(), 'stackql'));
  if (local) return local;
  const onPath = fromPathLookup('stackql');
  if (onPath) return onPath;

  // Last resort: download the latest release (linux/darwin, amd64/arm64).
  if (process.platform !== 'linux' && process.platform !== 'darwin') {
    console.error('[server] ERROR: stackql binary not found (set STACKQL, or place ./stackql in the provider dir)');
    process.exit(1);
  }
  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
  const url = `https://releases.stackql.io/stackql/latest/stackql_${process.platform}_${arch}.zip`;
  slog(`stackql binary not found - downloading ${url}`);
  try {
    execSync(
      `curl -sSL -o stackql.zip "${url}" && unzip -o stackql.zip stackql && rm -f stackql.zip && chmod +x stackql`,
      { cwd: baseDir, stdio: ['ignore', 'inherit', 'inherit'] },
    );
  } catch (e) {
    console.error(`[server] ERROR: stackql download failed: ${e.message}`);
    process.exit(1);
  }
  const downloaded = tryPath(path.join(baseDir, 'stackql'));
  if (!downloaded) {
    console.error('[server] ERROR: stackql download did not produce a usable binary');
    process.exit(1);
  }
  slog(`downloaded stackql to ${downloaded}`);
  return downloaded;
}

async function startServer() {
  const bin = resolveStackql();
  const regPath = path.join(baseDir, 'provider-dev', 'openapi');
  const reg = JSON.stringify({
    url: `file://${regPath}`,
    localDocRoot: regPath,
    verifyConfig: { nopVerify: true },
  });
  const serverLogPath = path.join(baseDir, 'stackql-server.log');
  const out = fs.openSync(serverLogPath, 'w');
  slog(`starting ${bin}`);
  slog(`registry: ${regPath}`);
  slog(`server log: ${serverLogPath}`);
  serverChild = spawn(bin, [`--registry=${reg}`, `--pgsrv.port=${port}`, 'srv'], {
    stdio: ['ignore', out, out],
  });
  // Without this handler a failed spawn (ENOENT, EACCES) is an unhandled
  // 'error' event that crashes node with a raw stack trace.
  serverChild.on('error', (err) => {
    console.error(`[server] ERROR: failed to start '${bin}': ${err.message}`);
    process.exit(1);
  });
  serverChild.on('exit', (code, signal) => {
    if (!serverShuttingDown) {
      console.error(`[server] ERROR: server exited unexpectedly (code=${code} signal=${signal}) - see ${serverLogPath}`);
    }
  });
  const t0 = Date.now();
  if (!(await waitUntil(probePort, 45000))) {
    console.error('[server] ERROR: server did not accept connections within 45s; log tail:');
    try {
      console.error(fs.readFileSync(serverLogPath, 'utf8').slice(-2000));
    } catch (e) { /* no log to show */ }
    process.exit(1);
  }
  slog(`ready in ${Date.now() - t0}ms (pid ${serverChild.pid})`);
}

function stopServer() {
  if (!serverChild || serverShuttingDown) return;
  serverShuttingDown = true;
  if (serverChild.pid === undefined) return; // spawn never succeeded
  slog(`stopping server (pid ${serverChild.pid})`);
  try {
    serverChild.kill('SIGTERM');
  } catch (e) { /* already gone */ }
  slog('server stopped');
}

// Runs on EVERY exit path (summary exit, hard failures, uncaught errors),
// so a managed server can never outlive the harness.
process.on('exit', stopServer);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

// Get start time
const startTime = new Date();

const results = {
  provider,
  totalServices: 0,
  totalResources: 0,
  totalMethods: 0,
  selectableMethods: 0,
  nonSelectableResourceCount: 0,
  nonSelectableResources: [],
  errors: [],
  summary: { errors: 0 },
};

/**
 * Run a query and handle errors
 * @param {string} query - SQL query to run
 * @param {string} description - Description for logging
 * @returns {Promise<Array>} - Query results
 */
async function executeQuery(query, description) {
  if (verbose) {
    console.log(`Running: ${query}`);
  } else {
    process.stdout.write(`${description}... `);
  }

  try {
    // Client-side watchdog: statement_timeout in connection options is not
    // enforced by pgwire-lite, so a wedged connection would hang the whole
    // run silently. Racing the query against a timer turns that into a
    // loud, attributable failure. Timeouts get retried - every query runs
    // on a fresh connection and a ~25k-connection walk occasionally hits a
    // transient stall (the same query answers in milliseconds on re-probe).
    let result;
    for (let attempt = 1; ; attempt++) {
      // The watchdog timer MUST be cleared when the query wins the race -
      // dangling timers keep the node event loop alive for up to
      // timeoutMs after the walk finishes (observed as a ~2 minute hang
      // between the summary printing and the process exiting).
      let watchdog;
      try {
        result = await Promise.race([
          runQuery(connectionOptions, query),
          new Promise((_, reject) => {
            watchdog = setTimeout(
              () => reject(new Error(`client-side timeout after ${timeoutMs}ms: ${query}`)),
              timeoutMs,
            );
          }),
        ]);
        clearTimeout(watchdog);
        break;
      } catch (raceErr) {
        clearTimeout(watchdog);
        if (attempt < 4 && /client-side timeout/.test(raceErr.message)) {
          // Stall windows last minutes (ephemeral-port exhaustion under
          // ~25k short-lived connections) - back off so the retry lands
          // after the window drains, not inside it.
          const backoffMs = 30000 * attempt;
          console.warn(`  retry ${attempt}/3 in ${backoffMs / 1000}s after timeout: ${query}`);
          await new Promise((res) => setTimeout(res, backoffMs));
          continue;
        }
        throw raceErr;
      }
    }
    
    if (!verbose) {
      if (result.data && result.data.length) {
        console.log(`✅ (${result.data.length} rows)`);
      } else {
        console.log('✅');
      }
    } else {
      console.info(result.data);
    }
    
    return result.data;
  } catch (error) {
    if (!verbose) {
      console.log('❌');
    }
    
    results.errors.push({
      query,
      description,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    results.summary.errors++;
    
    if (error.message.includes('the last operation didn\'t produce a result')) {
      return [];
    }
    
    if (error.message.includes('SELECT not supported for this resource')) {
      if (verbose) {
        console.warn(`  Warning: Resource is not selectable`);
      }
      return null;
    }
    
    console.error(`Error executing ${description}: ${error.message}`);
    return [];
  }
}

/**
 * Test all provider meta routes
 */
async function testMetaRoutes() {
  try {
    console.log(`\n🔍 Testing meta routes for provider: ${provider}\n`);
    
    // SHOW PROVIDERS to verify provider exists
    const registryQuery = "SHOW PROVIDERS";
    const providers = await executeQuery(registryQuery, "Checking registry providers");
    
    const providerExists = providers && providers.some(p => p.name === provider);
    if (!providerExists) {
      console.error(`Error: Provider '${provider}' not found in registry`);
      if (providers && providers.length > 0) {
        console.log("Available providers:");
        providers.forEach(p => console.log(`  - ${p.name}`));
      }
      process.exit(1);
    }

    // SHOW SERVICES IN <provider>
    const servicesQuery = `SHOW SERVICES IN ${provider}`;
    const services = await executeQuery(servicesQuery, "Getting services");
    
    if (!services || services.length === 0) {
      console.error(`Error: No services found for provider '${provider}'`);
      process.exit(1);
    }
    
    console.log(`\nFound ${services.length} services in ${provider}`);
    results.totalServices += services.length;

    // for each service
    for (const service of services) {
      const serviceName = service.name;
      console.log(`\n📊 Processing service: ${serviceName}`);
      
      // SHOW RESOURCES IN <provider>.<service>
      const resourcesQuery = `SHOW RESOURCES IN ${provider}.${serviceName}`;
      const resources = await executeQuery(resourcesQuery, `Getting resources for ${serviceName}`);
     
      if (!resources || resources.length === 0) {
        console.error(`Error: No resources found for ${provider}.${serviceName}`);
        process.exit(1);
      }
      
      console.log(`Found ${resources.length} resources in ${serviceName}`);
      results.totalResources += resources.length;
      
      // for each resource
      for (const resource of resources) {
        const resourceName = resource.name;
        console.log(`\n  🔹 Testing resource: ${resourceName}`);
        
        const resourceFQRN = `${provider}.${serviceName}.${resourceName}`;
        const resourceData = {
          name: resourceName,
          service: serviceName,
          selectable: false,
          sqlVerbs: {}
        };

        // SHOW EXTENDED METHODS IN <provider>.<service>.<resource>
        const methodsQuery = `SHOW EXTENDED METHODS IN ${resourceFQRN}`;
        const methods = await executeQuery(methodsQuery, `  Getting methods for ${resourceName}`);
        if (!methods || methods.length === 0) {
          console.error(`Error: Resource ${resourceName} has no methods`);
          process.exit(1);
        } else {
          console.log(`Found ${methods.length} methods for ${resourceName}`);
        }

        results.totalMethods += methods.length;

        for (const method of methods) {
          const methodName = method.MethodName;
          const sqlVerb = method.SQLVerb || 'exec';
          
          if(sqlVerb.toLowerCase() === 'select') {
            results.selectableMethods++;
            resourceData.selectable = true;
          }
          
          // Initialize the array if it doesn't exist yet
          if(!resourceData.sqlVerbs[sqlVerb]) {
            resourceData.sqlVerbs[sqlVerb] = [];
          }
          
          // Convert comma-delimited list to an array of trimmed values
          let requiredParamsArray = [];
          if (method.RequiredParams) {
            requiredParamsArray = method.RequiredParams
              .split(',')
              .map(param => param.trim())
              .filter(param => param.length > 0);
          }
          
          // Push the method info to the array with the parsed required params
          resourceData.sqlVerbs[sqlVerb].push({
            methodName,
            requiredParams: requiredParamsArray
          });
        }

        // non exec methods must have unique signatures within a resource 
        // in other words no two methods mapped to the same sqlVerb should have the exact same set of required params, order is not important
        // if this condition is detected, log it and exit the program immediately
        let hasSelect = false;
        for (const [verb, methods] of Object.entries(resourceData.sqlVerbs)) {
          if (verb.toLowerCase() === 'select') {
            hasSelect = true;
          }
          if (verb.toLowerCase() === 'exec') {
            continue;
          }
          const seenSignatures = new Set();
          for (const method of methods) {
            const signature = JSON.stringify(method.requiredParams);
            if (seenSignatures.has(signature)) {
              console.error(`Error: Duplicate method signature found for ${verb} in ${resourceData.service}.${resourceName}:`, method);
              process.exit(1);
            }
            seenSignatures.add(signature);
          }
        }

        if (!hasSelect) {
          results.nonSelectableResourceCount++;
          results.nonSelectableResources.push(`${resourceData.service}.${resourceName}`);
        }

        // Try DESCRIBE EXTENDED if available
        if(resourceData.selectable) {
          try {
            const describeExtendedQuery = `DESCRIBE EXTENDED ${resourceFQRN}`;
            const extendedColumns = await executeQuery(describeExtendedQuery, `  Describing extended ${resourceName}`);

            if (extendedColumns !== null && extendedColumns.length > 0) {
              console.log(`Found ${extendedColumns.length} extended columns for ${resourceName}`);
            } else {
              console.error(`ERROR: No columns found for ${resourceName}`);
              process.exit(1);
            }
          } catch (error) {
            console.error(`Error describing extended ${resourceName}:`, error.message);
            process.exit(1);
          }
        }

      }
    }
    
    // Calculate execution time
    const endTime = new Date();
    const executionTime = (endTime - startTime) / 1000; // in seconds
    results.executionTime = executionTime;
    
    // Output summary
    console.log("\n📋 Test Summary:");
    console.info(results);

    // Exit explicitly: pgwire-lite sockets or any stray timer would
    // otherwise keep the event loop (and the terminal) hanging after the
    // walk is done. The meta-routes contract is ZERO errors - any
    // accumulated query error fails the run.
    process.exit(results.summary.errors > 0 ? 1 : 0);

    // Save results to file
    // const resultsDir = path.join(baseDir, 'test-results');
    // if (!fs.existsSync(resultsDir)) {
    //   fs.mkdirSync(resultsDir, { recursive: true });
    // }
    
    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // if (outputFormat === 'json') {
    //   const resultsFile = path.join(resultsDir, `${provider}-meta-test-${timestamp}.json`);
    //   fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    //   console.log(`\nDetailed results saved to: ${resultsFile}`);
    // } 
    // else if (outputFormat === 'csv') {
    //   // Generate CSV files
      
    //   // Main summary CSV
    //   const summaryFile = path.join(resultsDir, `${provider}-meta-test-summary-${timestamp}.csv`);
    //   const summaryCSV = [
    //     'Provider,Timestamp,Services,Resources,Methods,Selectable,Insertable,Updatable,Deletable,Executable,Errors,ExecutionTime',
    //     `${provider},${results.timestamp},${results.summary.totalServices},${results.summary.totalResources},${results.summary.totalMethods},${results.summary.selectableMethods},${results.summary.insertableMethods},${results.summary.updatableMethods},${results.summary.deletableMethods},${results.summary.executableMethods},${results.summary.errors},${results.executionTime}`
    //   ].join('\n');
    //   fs.writeFileSync(summaryFile, summaryCSV);
      
    //   // Services CSV
    //   const servicesFile = path.join(resultsDir, `${provider}-meta-test-services-${timestamp}.csv`);
    //   const servicesCSV = [
    //     'Service,Title,ResourceCount',
    //     ...results.services.map(s => `${s.name},${s.title || ''},${s.resourceCount || 0}`)
    //   ].join('\n');
    //   fs.writeFileSync(servicesFile, servicesCSV);
      
    //   // Resources CSV
    //   const resourcesFile = path.join(resultsDir, `${provider}-meta-test-resources-${timestamp}.csv`);
    //   const resourcesCSV = [
    //     'Service,Resource,FQRN,Selectable,ColumnCount,MethodCount',
    //     ...results.resources.map(r => `${r.service},${r.name},${r.fqrn},${r.selectable},${r.columnCount || 0},${r.methodCount || 0}`)
    //   ].join('\n');
    //   fs.writeFileSync(resourcesFile, resourcesCSV);
      
    //   // Methods CSV
    //   const methodsFile = path.join(resultsDir, `${provider}-meta-test-methods-${timestamp}.csv`);
    //   const methodsCSV = [
    //     'Service,Resource,Method,SQLVerb,FQRN',
    //     ...results.methods.map(m => `${m.service},${m.resource},${m.name},${m.sqlVerb},${m.fqrn}`)
    //   ].join('\n');
    //   fs.writeFileSync(methodsFile, methodsCSV);
      
    //   console.log(`\nDetailed results saved to CSV files in: ${resultsDir}`);
    // }
    // else if (outputFormat === 'markdown') {
    //   const mdFile = path.join(resultsDir, `${provider}-meta-test-${timestamp}.md`);
      
    //   const markdownContent = [
    //     `# StackQL Provider Test Results: ${provider}`,
    //     '',
    //     `Test run: ${results.timestamp}`,
    //     '',
    //     '## Summary',
    //     '',
    //     '| Metric | Count |',
    //     '|--------|-------|',
    //     `| Services | ${results.summary.totalServices} |`,
    //     `| Resources | ${results.summary.totalResources} |`,
    //     `| Methods | ${results.summary.totalMethods} |`,
    //     `| Errors | ${results.summary.errors} |`,
    //     `| Execution Time | ${results.executionTime.toFixed(2)} seconds |`,
    //     '',
    //     '### Methods by SQL Verb',
    //     '',
    //     '| Verb | Count |',
    //     '|------|-------|',
    //     ...Object.entries(results.verbs).map(([verb, count]) => `| ${verb.toUpperCase()} | ${count} |`),
    //     '',
    //     '## Services',
    //     '',
    //     '| Service | Resources |',
    //     '|---------|-----------|',
    //     ...results.services.map(s => `| ${s.name} | ${s.resourceCount || 0} |`),
    //     '',
    //     '## Resources with Most Methods',
    //     '',
    //     '| Resource | Service | Methods | Selectable |',
    //     '|----------|---------|---------|------------|',
    //     ...results.resources
    //       .sort((a, b) => (b.methodCount || 0) - (a.methodCount || 0))
    //       .slice(0, 20)
    //       .map(r => `| ${r.name} | ${r.service} | ${r.methodCount || 0} | ${r.selectable ? '✓' : '✗'} |`),
    //     '',
    //     '## Errors',
    //     '',
    //     results.errors.length > 0 
    //       ? [
    //           '| Query | Error |',
    //           '|-------|-------|',
    //           ...results.errors.map(e => `| \`${e.query}\` | ${e.error} |`)
    //         ].join('\n')
    //       : 'No errors encountered during testing.',
    //   ].join('\n');
      
    //   fs.writeFileSync(mdFile, markdownContent);
    //   console.log(`\nDetailed results saved to: ${mdFile}`);
    // }
    
  } catch (error) {
    console.error('Error in meta routes test:', error);
    process.exit(1);
  }
}

// Run: manage the server lifecycle (default), then walk the provider.
(async () => {
  if (manageServer) {
    await stopExistingServer();
    await startServer();
  } else {
    const why = noServer
      ? '--no-server'
      : !isLocalHost
        ? `non-local host ${host}`
        : 'win32 host (Linux binary; run under WSL for managed mode)';
    slog(`external-server mode (${why}) - expecting a server on ${host}:${port}`);
  }
  await testMetaRoutes();
})();