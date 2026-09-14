import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { allAnimations } from '../src/data/animations.js';
import { applyLessonMetadataOverrides } from '../src/data/lessonMetadataOverrides.js';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(SCRIPT_DIR, '..');
const DIST_DIR = path.join(APP_DIR, 'dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const SITE_BASE_URL = 'https://danielsobrado.github.io/Machine-Learning-Visualized';
const SITE_NAME = 'Machine Learning Visualized';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Expected metadata tag was not found: ${pattern}`);
  return html.replace(pattern, replacement);
}

function buildLessonHtml(template, animation) {
  const lesson = applyLessonMetadataOverrides(animation);
  const title = `${lesson.name} - ${SITE_NAME}`;
  const description = `${lesson.description}. Interactive visual lesson with worked examples and controls.`;
  const url = `${SITE_BASE_URL}/animation/${lesson.id}/`;

  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceTag(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceTag(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${escapeHtml(url)}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceTag(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceTag(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${escapeHtml(url)}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  return html;
}

const template = await readFile(INDEX_PATH, 'utf8');

for (const animation of allAnimations) {
  const targetDir = path.join(DIST_DIR, 'animation', animation.id);
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, 'index.html'), buildLessonHtml(template, animation), 'utf8');
}

console.log(`Generated route metadata for ${allAnimations.length} lessons.`);
