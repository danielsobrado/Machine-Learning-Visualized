import { spawn } from 'node:child_process';
import { execFile } from 'node:child_process';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../..');
const appRoot = path.join(repoRoot, 'unified-app');
const appRequire = createRequire(path.join(appRoot, 'package.json'));
const { chromium } = appRequire('playwright');
const screenshotRoot = path.join(repoRoot, 'screenshots', 'theme-audit');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(screenshotRoot, timestamp);
const port = Number(process.env.THEME_AUDIT_PORT || 5317);
const serverUrl = `http://127.0.0.1:${port}`;
const basePath = process.env.THEME_AUDIT_BASE_PATH || '/Machine-Learning-Visualized';
const baseUrl = `${serverUrl}${basePath.replace(/\/$/, '')}`;
const channel = process.env.THEME_AUDIT_CHANNEL || 'chrome';

const args = new Set(process.argv.slice(2));
const quick = args.has('--quick');
const utilitiesOnly = args.has('--utilities');
const keepServer = args.has('--keep-server');
const routeFilter = valueAfter('--route');
const limit = Number(valueAfter('--limit') || 0);

function valueAfter(name) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] : '';
}

function slug(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'screen';
}

async function readCatalog() {
  if (utilitiesOnly) return [];
  const source = await readFile(path.join(appRoot, 'src', 'data', 'animations.js'), 'utf8');
  const matches = [...source.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*icon:\s*[^,]+,\s*description:\s*'([^']*)'/g)];
  let routes = matches.map((match) => ({
    id: match[1],
    name: match[2],
    description: match[3],
    url: `${baseUrl}/animation/${match[1]}`,
  }));

  if (routeFilter) {
    routes = routes.filter((route) => route.id.includes(routeFilter));
  }
  if (quick) {
    routes = routes.slice(0, 8);
  }
  if (limit > 0) {
    routes = routes.slice(0, limit);
  }
  return routes;
}

async function waitForServer(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Keep polling until Vite is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startServer() {
  const child = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: appRoot,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, BROWSER: 'none' },
  });

  child.stdout.on('data', (data) => process.stdout.write(`[vite] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[vite] ${data}`));
  return child;
}

async function stopServer(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      execFile('taskkill', ['/pid', String(child.pid), '/t', '/f'], () => resolve());
    });
    return;
  }
  child.kill('SIGTERM');
}

async function waitForPage(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.locator('#root').waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(350);
}

async function capture(page, filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await page.screenshot({ path: filePath, fullPage: true });
  return (await stat(filePath)).size;
}

function drainRuntimeIssues(page) {
  const issues = page.__themeAuditRuntimeIssues || [];
  page.__themeAuditRuntimeIssues = [];
  return issues;
}

async function healthFindings(page, screenshotBytes) {
  const rootTextLength = await page.locator('#root').innerText()
    .then((text) => text.trim().length)
    .catch(() => 0);
  const findings = [];

  if (rootTextLength === 0) {
    findings.push({ type: 'blank-root', message: 'The React root rendered no visible text.' });
  }
  if (screenshotBytes < 10000) {
    findings.push({ type: 'tiny-screenshot', screenshotBytes, message: 'Screenshot is likely an empty or crashed page.' });
  }

  return findings;
}

async function themeFindings(page) {
  return page.evaluate(() => {
    const allowedColor = new Set([
      'rgb(251, 248, 241)',
      'rgb(244, 239, 226)',
      'rgb(254, 252, 247)',
      'rgb(26, 26, 26)',
      'rgb(42, 42, 42)',
      'rgb(74, 74, 74)',
      'rgb(122, 122, 120)',
      'rgb(217, 210, 192)',
      'rgb(182, 172, 147)',
      'rgb(236, 230, 211)',
      'rgb(38, 66, 115)',
      'rgb(58, 90, 150)',
      'rgb(168, 90, 58)',
      'rgb(58, 106, 58)',
      'rgb(138, 29, 29)',
      'rgba(0, 0, 0, 0)',
      'rgba(38, 66, 115, 0.04)',
      'rgba(38, 66, 115, 0.06)',
      'rgba(38, 66, 115, 0.08)',
      'rgba(168, 90, 58, 0.08)',
      'rgba(168, 90, 58, 0.1)',
      'rgba(168, 90, 58, 0.12)',
      'rgba(58, 106, 58, 0.1)',
      'rgb(243, 249, 239)',
      'rgb(255, 248, 230)',
    ]);

    const tokenRgb = [
      [251, 248, 241],
      [244, 239, 226],
      [254, 252, 247],
      [26, 26, 26],
      [42, 42, 42],
      [74, 74, 74],
      [122, 122, 120],
      [217, 210, 192],
      [182, 172, 147],
      [236, 230, 211],
      [38, 66, 115],
      [49, 76, 121],
      [58, 90, 150],
      [168, 90, 58],
      [58, 106, 58],
      [138, 29, 29],
      [243, 249, 239],
      [255, 248, 230],
    ];

    function isTokenishColor(value) {
      if (allowedColor.has(value)) return true;
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      if (!match) return false;
      const [, rText, gText, bText, alphaText] = match;
      const alpha = alphaText === undefined ? 1 : Number(alphaText);
      if (alpha === 0) return true;
      const rgb = [Number(rText), Number(gText), Number(bText)];
      return tokenRgb.some((token) => (
        Math.abs(rgb[0] - token[0]) <= 8
        && Math.abs(rgb[1] - token[1]) <= 8
        && Math.abs(rgb[2] - token[2]) <= 8
      ));
    }

    const interesting = [...document.querySelectorAll(
      '.ua-animation-page button, .ua-animation-page nav, .ua-animation-page [class*="bg-"], .ua-animation-page [class*="rounded"], .ua-animation-page [class*="shadow"], .ua-animation-page [class*="text-"], .ua-animation-page [class*="border-"]'
    )];

    const findings = [];
    for (const el of interesting) {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) continue;

      const label = (el.innerText || el.getAttribute('aria-label') || el.className || el.tagName)
        .toString()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);

      if (style.backgroundImage && /gradient\(/.test(style.backgroundImage)) {
        findings.push({ type: 'gradient-background', label, className: el.className.toString().slice(0, 160) });
      }

      const radius = Math.max(
        parseFloat(style.borderTopLeftRadius) || 0,
        parseFloat(style.borderTopRightRadius) || 0,
        parseFloat(style.borderBottomRightRadius) || 0,
        parseFloat(style.borderBottomLeftRadius) || 0
      );
      if (radius > 8) {
        findings.push({ type: 'large-radius', radius, label, className: el.className.toString().slice(0, 160) });
      }

      if (el.tagName === 'BUTTON' && !isTokenishColor(style.backgroundColor)) {
        findings.push({ type: 'button-background-token', backgroundColor: style.backgroundColor, label, className: el.className.toString().slice(0, 160) });
      }

      if (
        el.tagName !== 'BUTTON'
        && (
          style.backgroundColor === 'rgb(15, 23, 42)'
          || style.backgroundColor === 'rgb(30, 41, 59)'
          || style.backgroundColor === 'rgb(31, 41, 55)'
          || style.backgroundColor === 'rgb(17, 24, 39)'
        )
      ) {
        findings.push({ type: 'dark-panel-background', backgroundColor: style.backgroundColor, label, className: el.className.toString().slice(0, 160) });
      }
    }

    return findings.slice(0, 30);
  });
}

async function captureRoute(page, route, manifest) {
  const routeDir = path.join(outDir, 'animations', route.id);
  await page.goto(route.url);
  await waitForPage(page);

  const defaultFile = path.join(routeDir, '00-default.png');
  const defaultBytes = await capture(page, defaultFile);
  manifest.screens.push({
    route: route.id,
    title: route.name,
    state: 'default',
    file: path.relative(repoRoot, defaultFile).replaceAll('\\', '/'),
    screenshotBytes: defaultBytes,
    runtimeIssues: drainRuntimeIssues(page),
    findings: [
      ...(await themeFindings(page)),
      ...(await healthFindings(page, defaultBytes)),
    ],
  });

  const tabLocator = page.locator('.ua-animation-page > div > nav button, .ua-animation-page .ds-tabs button');
  const count = await tabLocator.count();
  for (let index = 0; index < count; index += 1) {
    const label = await tabLocator.nth(index).innerText().catch(() => `tab-${index + 1}`);
    await tabLocator.nth(index).click({ timeout: 5000 }).catch(() => {});
    await waitForPage(page);
    const file = path.join(routeDir, `${String(index + 1).padStart(2, '0')}-${slug(label)}.png`);
    const bytes = await capture(page, file);
    manifest.screens.push({
      route: route.id,
      title: route.name,
      state: label.replace(/\s+/g, ' ').trim(),
      file: path.relative(repoRoot, file).replaceAll('\\', '/'),
      screenshotBytes: bytes,
    runtimeIssues: drainRuntimeIssues(page),
    findings: [
        ...(await themeFindings(page)),
        ...(await healthFindings(page, bytes)),
      ],
    });
  }
}

async function captureUtilityRoute(browser, route, manifest) {
  for (const viewport of [
    { state: 'desktop', width: 1365, height: 900 },
    { state: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await newAuditPage(browser, { width: viewport.width, height: viewport.height });
    try {
      await page.goto(`${baseUrl}${route.path}`);
      await waitForPage(page);
      const file = path.join(outDir, 'utilities', route.id, `${viewport.state}.png`);
      const bytes = await capture(page, file);
      manifest.screens.push({
        route: route.id,
        state: viewport.state,
        file: path.relative(repoRoot, file).replaceAll('\\', '/'),
        screenshotBytes: bytes,
        runtimeIssues: drainRuntimeIssues(page),
        findings: [
          ...(await themeFindings(page)),
          ...(await healthFindings(page, bytes)),
        ],
      });
    } finally {
      await page.close();
    }
  }
}

async function newAuditPage(browser, viewport = { width: 1365, height: 900 }) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.__themeAuditRuntimeIssues = [];
  page.on('pageerror', (error) => {
    page.__themeAuditRuntimeIssues.push({
      type: 'pageerror',
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n') || '',
    });
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      page.__themeAuditRuntimeIssues.push({
        type: 'console-error',
        message: message.text().slice(0, 500),
      });
    }
  });
  return page;
}

async function main() {
  if (!existsSync(path.join(appRoot, 'node_modules', 'playwright'))) {
    throw new Error('Playwright is not installed in unified-app. Run: rtk npm install --prefix unified-app');
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const server = startServer();
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    screens: [],
  };

  try {
    await waitForServer(`${baseUrl}/`);
    const browser = await chromium.launch(channel === 'chromium' ? {} : { channel });
    const page = await newAuditPage(browser);

    await page.goto(`${baseUrl}/`);
    await waitForPage(page);
    const homeFile = path.join(outDir, 'home', 'desktop.png');
    const homeBytes = await capture(page, homeFile);
    manifest.screens.push({
      route: 'home',
      state: 'desktop',
      file: path.relative(repoRoot, homeFile).replaceAll('\\', '/'),
      screenshotBytes: homeBytes,
      runtimeIssues: drainRuntimeIssues(page),
      findings: [
        ...(await themeFindings(page)),
        ...(await healthFindings(page, homeBytes)),
      ],
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/`);
    await waitForPage(page);
    const mobileFile = path.join(outDir, 'home', 'mobile.png');
    const mobileBytes = await capture(page, mobileFile);
    manifest.screens.push({
      route: 'home',
      state: 'mobile',
      file: path.relative(repoRoot, mobileFile).replaceAll('\\', '/'),
      screenshotBytes: mobileBytes,
      runtimeIssues: drainRuntimeIssues(page),
      findings: [
        ...(await themeFindings(page)),
        ...(await healthFindings(page, mobileBytes)),
      ],
    });

    await page.locator('button[aria-label="Toggle menu"]').click({ timeout: 5000 });
    await page.waitForTimeout(250);
    const mobileMenuFile = path.join(outDir, 'home', 'mobile-menu-open.png');
    const mobileMenuBytes = await capture(page, mobileMenuFile);
    const mobileMenuOpen = await page.locator('.ua-sidebar:not(.closed)').isVisible().catch(() => false);
    manifest.screens.push({
      route: 'home',
      state: 'mobile-menu-open',
      file: path.relative(repoRoot, mobileMenuFile).replaceAll('\\', '/'),
      screenshotBytes: mobileMenuBytes,
      runtimeIssues: drainRuntimeIssues(page),
      findings: [
        ...(mobileMenuOpen ? [] : [{ type: 'menu-toggle', message: 'Mobile menu button did not open the sidebar.' }]),
        ...(await themeFindings(page)),
        ...(await healthFindings(page, mobileMenuBytes)),
      ],
    });

    await page.setViewportSize({ width: 1365, height: 900 });
    for (const utilityRoute of [
      { id: 'labs', path: '/labs' },
      { id: 'settings', path: '/settings' },
      { id: 'glossary', path: '/glossary' },
    ]) {
      console.log(`Capturing ${utilityRoute.id}`);
      await captureUtilityRoute(browser, utilityRoute, manifest);
    }

    const routes = await readCatalog();
    for (const route of routes) {
      console.log(`Capturing ${route.id}`);
      const routePage = await newAuditPage(browser);
      try {
        await captureRoute(routePage, route, manifest);
      } finally {
        await routePage.close();
      }
    }

    await page.close();
    await browser.close();
  } finally {
    await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    if (!keepServer) {
      await stopServer(server);
    }
  }

  const findingCount = manifest.screens.reduce((sum, screen) => sum + screen.findings.length, 0);
  const runtimeIssueCount = manifest.screens.reduce((sum, screen) => sum + screen.runtimeIssues.length, 0);
  console.log(`Captured ${manifest.screens.length} screens in ${path.relative(repoRoot, outDir)}`);
  console.log(`Automated theme findings: ${findingCount}`);
  console.log(`Runtime issues: ${runtimeIssueCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
