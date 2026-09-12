import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { APP_BASE_PATH } from './route-smoke-plan.mjs';

const PORT = Number(process.env.ASSESSMENT_SMOKE_PORT || 4174);
const BASE_URL = `http://127.0.0.1:${PORT}${APP_BASE_PATH}`;
const PACKAGE_DIR = process.cwd();
const SERVER_TIMEOUT_MS = 45000;

function startPreviewServer() {
  const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
  return spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(PORT)], {
    cwd: PACKAGE_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });
}

async function serverReady() {
  try {
    return (await fetch(`${BASE_URL}/`)).ok;
  } catch {
    return false;
  }
}

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < SERVER_TIMEOUT_MS) {
    if (await serverReady()) return;
    await sleep(500);
  }
  throw new Error(`Timed out waiting for preview server at ${BASE_URL}`);
}

async function openAssessment(page, lessonId) {
  const response = await page.goto(`${BASE_URL}/animation/${lessonId}/questions`, {
    waitUntil: 'domcontentloaded',
  });
  assert.equal(response?.status(), 200, `${lessonId} assessment route should return HTTP 200`);
  await page.locator('.ua-assessment-panel').waitFor({ state: 'visible' });
}

async function verifyQuizInteraction(page) {
  const quizCard = page.locator('.ua-quiz-card:not(.ua-scenario-card)').first();
  await quizCard.locator('.ua-choice-button').first().click();
  await quizCard.locator('.ua-answer-panel').waitFor({ state: 'visible' });
  assert.ok((await quizCard.locator('.ua-answer-panel p').textContent())?.trim(), 'answer explanation should render');
}

async function verifyQuizPagination(page) {
  const pager = page.locator('nav[aria-label="Lesson check pages"]').first();
  await pager.waitFor({ state: 'visible' });
  await pager.locator('button[title^="Questions 11-"]').click();
  await page.getByText(/Questions 11-20 of 100/).first().waitFor({ state: 'visible' });
}

async function verifyScenarioPagination(page) {
  await openAssessment(page, 'time-series-forecasting-track');
  const pager = page.locator('nav[aria-label="Scenario pages"]');
  await pager.waitFor({ state: 'visible' });
  await pager.getByRole('button', { name: 'Next →' }).click();
  await pager.getByText(/Scenarios 5-/).waitFor({ state: 'visible' });
}

async function run() {
  const server = startPreviewServer();

  try {
    await waitForServer();
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await openAssessment(page, 'probability-distributions');
    assert.ok(await page.locator('.ua-visual-plot').count(), 'visual-state scenario should render a compact plot');
    await verifyQuizInteraction(page);
    await verifyQuizPagination(page);
    await verifyScenarioPagination(page);

    await browser.close();
  } finally {
    server.kill('SIGTERM');
    await Promise.race([
      new Promise((resolve) => server.once('exit', resolve)),
      sleep(4000),
    ]);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
