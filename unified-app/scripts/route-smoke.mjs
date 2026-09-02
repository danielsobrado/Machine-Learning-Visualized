import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

import { normalizeRoute, toUniqueRoutes } from './route-smoke-plan.mjs';

const PORT = Number(process.env.CURRICULUM_SMOKE_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const PACKAGE_DIR = process.cwd();

async function checkServerReady() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok;
  } catch {
    return false;
  }
}

function startViteServer() {
  const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
  const child = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(PORT)], {
    cwd: PACKAGE_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  return child;
}

async function waitForServerReady(timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkServerReady()) return true;
    await sleep(500);
  }
  throw new Error(`Timed out waiting for Vite dev server at ${BASE_URL}`);
}

async function runRouteChecks() {
  const spawned = (await checkServerReady()) ? null : startViteServer();
  const stopServer = async () => {
    if (!spawned) return;

    spawned.kill('SIGTERM');
    await new Promise((resolve) => {
      spawned.on('exit', resolve);
      setTimeout(resolve, 4000);
    });
  };

  try {
    await waitForServerReady();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const routes = toUniqueRoutes().map((route) => ({
      source: route,
      path: normalizeRoute(route),
      isAnimationRoute: route.startsWith('/animation/'),
      isBaseAnimationRoute: /^\/animation\/[^/]+$/.test(route),
    }));

    for (const route of routes) {
      const response = await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: 'domcontentloaded',
      });

      assert.equal(response?.status(), 200, `${route.path} should return HTTP 200`);
      const heading = await page
        .locator('h1')
        .first()
        .textContent({ timeout: 10000 })
        .catch((error) => {
          throw new Error(`${route.path} did not render an h1 before timeout: ${error.message}`);
        });
      assert.ok(heading && heading.trim(), `${route.path} should render an h1`);

      if (route.isAnimationRoute) {
        const bodyText = (await page.textContent('body')) || '';
        assert.ok(
          !/animation not found/i.test(bodyText),
          `${route.path} should resolve to an implemented lesson route`,
        );
      }

      if (route.isBaseAnimationRoute) {
        assert.equal(
          await page.locator('.ua-assessment-panel').count(),
          0,
          `${route.path} should not embed the lesson check in the scrolling lesson body`,
        );
        assert.equal(
          await page.locator('.ua-concept-map').count(),
          0,
          `${route.path} should not embed the concept map in the scrolling lesson body`,
        );
      }

      if (route.source === '/animation/kv-cache/questions') {
        assert.equal(
          await page.locator('.ua-assessment-panel').count(),
          1,
          `${route.path} should render the routed lesson check`,
        );
      }

      if (route.source === '/animation/kv-cache/concept-map') {
        assert.equal(
          await page.locator('.ua-concept-map').count(),
          1,
          `${route.path} should render the routed concept map`,
        );
      }
    }

    await browser.close();
  } finally {
    await stopServer();
  }
}

runRouteChecks().catch((error) => {
  if (error?.code === 'ERR_MODULE_NOT_FOUND' && /playwright/.test(String(error))) {
    console.error('Playwright is required to run this smoke test.');
  } else {
    console.error(error);
  }
  process.exit(1);
});
