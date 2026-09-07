import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chapters } from '../src/data/qwenNext.js';
import { QWEN_NEXT_LABS } from '../src/labs/lesson-code/categories/qwenNextLabs.js';
const base = process.env.QWEN_TEST_URL || 'http://127.0.0.1:5174/Machine-Learning-Visualized';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await fs.mkdir('/tmp/qwen-next-evidence', { recursive: true });
try {
  for (const c of chapters) {
    await page.goto(`${base}/animation/${c.id}`);
    await page.getByRole('heading', { name: c.short, exact: true }).waitFor();
    assert.match(await page.title(), new RegExp(c.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    const results = page.locator('.qw-results');
    const before = await results.innerText();
    const slider = page.getByRole('slider').first();
    await slider.fill(String(c.controls[0].max));
    assert.notEqual(await results.innerText(), before);
    await page.getByRole('button', { name: 'Reset experiment' }).click();
    assert.equal(await results.innerText(), before);
    await page.locator('summary').first().click();
    assert.ok(await page.locator('details[open]').count());
    await page.locator('.qw-lab').screenshot({ path: `/tmp/qwen-next-evidence/${c.id}-desktop.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator('.qw-lab').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${c.id} mobile overflow`);
    await page.locator('.qw-lab').screenshot({ path: `/tmp/qwen-next-evidence/${c.id}-mobile.png` });
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const section of ['glossary', 'concept-map', 'deep-dive']) {
      await page.goto(`${base}/animation/${c.id}/${section}`);
      await page.locator(section === 'deep-dive' ? '.ua-depth-panel' : '.qw-course h2').first().waitFor();
      assert.ok((await page.locator('body').innerText()).includes(c.title));
    }
    await page.goto(`${base}/animation/${c.id}/questions`);
    await page.getByText(c.questions[0][0], { exact: true }).waitFor();
    await page.goto(`${base}/animation/${c.id}/code`);
    const group = QWEN_NEXT_LABS.find(g => g.lessonId === c.id);
    for (let i = 0; i < group.exercises.length; i++) {
      const lab = group.exercises[i];
      if (i) await page.getByRole('button', { name: new RegExp(lab.title) }).click();
      const editor = page.getByRole('textbox', { name: `${lab.title} code editor` });
      await editor.fill(lab.solution);
      await page.getByRole('button', { name: 'Run tests', exact: true }).click();
      await page.waitForFunction(() => document.body.innerText.includes('All tests passed'), null, { timeout: 15000 });
    }
    console.log(`PASS ${c.id}: controls, reset, solutions, mobile layout, sections and two code labs`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
