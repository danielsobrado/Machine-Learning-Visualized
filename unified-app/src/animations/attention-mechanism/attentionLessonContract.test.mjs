import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const ROOT = new URL('./', import.meta.url);

async function readSource(name) {
  return readFile(new URL(name, ROOT), 'utf8');
}

test('intuition uses the shared attention computation and reduced-motion handling', async () => {
  const source = await readSource('IntuitionPanel.jsx');
  assert.match(source, /scaledDotProductAttention/);
  assert.match(source, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /relevance\s*:/);
  assert.doesNotMatch(source, /attentionWeights/);
});

test('attention lesson exposes keyboard-compatible tab semantics', async () => {
  const source = await readSource('index.jsx');
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /role="tabpanel"/);
  assert.match(source, /aria-selected=/);
  assert.match(source, /ArrowRight/);
  assert.match(source, /ArrowLeft/);
});

test('QKV panel changes the query through accessible range controls', async () => {
  const source = await readSource('QkvPanel.jsx');
  assert.match(source, /type="range"/);
  assert.match(source, /qkvExperiment\(query\)/);
  assert.match(source, /Softmax weights sum to/);
});
