import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const SRC_ROOT = new URL('../', import.meta.url);

async function readSource(relativePath) {
  return readFile(new URL(relativePath, SRC_ROOT), 'utf8');
}

test('animation route defers non-visual lesson modules and curriculum depth data', async () => {
  const source = await readSource('pages/AnimationPage.jsx');

  assert.match(source, /lazy\(\(\) => import\('\.\.\/components\/lesson\/LessonSectionView'\)\)/);
  assert.match(source, /lazy\(\(\) => import\('\.\.\/components\/priority-labs\/P1PriorityLab'\)\)/);
  assert.match(source, /useLessonDepthAvailability/);
  assert.doesNotMatch(source, /from '\.\.\/data\/curriculumDepth/);
  assert.doesNotMatch(source, /from '\.\.\/components\/lesson\/LessonDepthView/);
});

test('application shell does not statically load glossary repository data', async () => {
  const source = await readSource('App.jsx');

  assert.match(source, /import\('\.\/data\/glossaryRepository\.js'\)/);
  assert.doesNotMatch(source, /^import .*glossaryRepository/m);
});
