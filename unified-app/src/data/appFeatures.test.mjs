import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { allAnimations } from './animations.js';
import { glossaryTerms } from './glossaryRepository.js';
import { buildCommandPaletteItems, searchCommandPaletteItems } from './commandPalette.js';
import { HUB_LEARNING_PATHS } from './learningPaths.js';
import {
  classifySoftmaxSharpness,
  computeSoftmax,
  nudgeLogit,
  softmaxMetrics,
} from './softmaxModel.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

test('command palette indexes every lesson and glossary term by text and symbol', () => {
  const items = buildCommandPaletteItems(allAnimations, glossaryTerms);

  assert.equal(items.filter((item) => item.kind === 'lesson').length, allAnimations.length);
  assert.equal(items.filter((item) => item.kind === 'glossary').length, glossaryTerms.length);

  const softmax = searchCommandPaletteItems(items, 'softmax')[0];
  assert.equal(softmax.href, '/animation/softmax');

  const temperature = searchCommandPaletteItems(items, 'τ')[0];
  assert.equal(temperature.href, '/glossary/temperature');
  assert.equal(searchCommandPaletteItems(items, 'tau')[0].href, '/glossary/temperature');

  const logits = searchCommandPaletteItems(items, 'raw scores')[0];
  assert.equal(logits.href, '/glossary/logits');
});

test('hub learning paths define animated chains with active lesson ids', () => {
  const animationIds = new Set(allAnimations.map((animation) => animation.id));

  assert.deepEqual(
    HUB_LEARNING_PATHS.map((path) => path.id),
    [
      'start-here',
      'probability-bridge',
      'llm-path',
      'rag-path',
      'model-reliability-path',
      'experimentation-causal-path',
      'vision-path',
      'rl-path',
      'qwen-flash-next',
    ],
  );

  for (const path of HUB_LEARNING_PATHS) {
    assert.ok(path.label);
    assert.ok(path.nodes.length >= 4);
    for (const nodeId of path.nodes) {
      assert.ok(animationIds.has(nodeId), `${path.id} references unknown ${nodeId}`);
    }
  }

  const startHere = HUB_LEARNING_PATHS.find((path) => path.id === 'start-here');
  assert.ok(startHere.nodes.indexOf('gradient-descent') < startHere.nodes.indexOf('computation-graph-backprop'));
  assert.ok(startHere.nodes.indexOf('relu') < startHere.nodes.indexOf('computation-graph-backprop'));
});

test('active lessons expose static SEO entry pages', () => {
  for (const animation of allAnimations) {
    const dir = `${animation.id}-animation`;
    const file = path.join(repoRoot, dir, 'index.html');
    assert.ok(fs.existsSync(file), `${dir} is missing an index.html entry page`);

    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+" \/>/);
    assert.match(html, /<meta property="og:title" content="[^"]+" \/>/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/danielsobrado.github.io\/Machine-Learning-Visualized\/[^"]+\/" \/>/);
  }
});

test('softmax model supports temperature, logit nudging, and sharpness metrics', () => {
  const logits = [2, 1, 0.1];
  const base = computeSoftmax(logits, 1);
  const shifted = computeSoftmax(logits.map((value) => value + 10), 1);
  const hot = computeSoftmax(logits, 2);
  const cold = computeSoftmax(logits, 0.35);

  assert.equal(base.length, logits.length);
  assert.ok(Math.abs(base.reduce((sum, value) => sum + value, 0) - 1) < 1e-10);

  for (let index = 0; index < base.length; index += 1) {
    assert.ok(Math.abs(base[index] - shifted[index]) < 1e-10);
  }

  assert.ok(Math.max(...cold) > Math.max(...base));
  assert.ok(Math.max(...hot) < Math.max(...base));
  assert.equal(nudgeLogit([0, 1, 2], 1, -0.25)[1], 0.75);

  assert.equal(classifySoftmaxSharpness([0.92, 0.06, 0.02]).tone, 'sharp');
  assert.equal(classifySoftmaxSharpness([0.37, 0.33, 0.3]).tone, 'diffuse');
  assert.ok(softmaxMetrics(base).entropy > 0);
});
