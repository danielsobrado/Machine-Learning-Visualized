import assert from 'node:assert/strict';
import test from 'node:test';

import {
  attentionMatrix,
  attentionRow,
  buildTokenProjections,
  entropy,
} from './selfAttentionModel.js';

const projections = buildTokenProjections();

test('projects embeddings into explicit Q, K, and V spaces', () => {
  assert.equal(projections.length, 5);
  assert.equal(projections[0].embedding.length, 4);
  assert.equal(projections[0].q.length, 3);
  assert.equal(projections[0].k.length, 3);
  assert.equal(projections[0].v.length, 2);
});

test('attention weights form a probability distribution and produce a value-sized output', () => {
  const row = attentionRow({ projections, queryIndex: 4 });
  assert.ok(Math.abs(row.weights.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  assert.equal(row.output.length, 2);
});

test('causal masking removes all future-token probability before softmax', () => {
  const row = attentionRow({ projections, queryIndex: 1, causal: true });
  assert.deepEqual(row.weights.slice(2), [0, 0, 0]);
  assert.ok(Math.abs(row.weights[0] + row.weights[1] - 1) < 1e-12);
});

test('lower temperature makes the same attention row sharper', () => {
  const warm = attentionRow({ projections, queryIndex: 4, temperature: 1.6 });
  const cool = attentionRow({ projections, queryIndex: 4, temperature: 0.5 });
  assert.ok(entropy(cool.weights) < entropy(warm.weights));
});

test('query feature intervention changes only the selected matrix row', () => {
  const base = attentionMatrix({ projections, selectedQueryIndex: 2 });
  const changed = attentionMatrix({ projections, selectedQueryIndex: 2, queryFeatureOffset: 0.5 });
  assert.deepEqual(changed[0].weights, base[0].weights);
  assert.notDeepEqual(changed[2].weights, base[2].weights);
  assert.deepEqual(changed[4].weights, base[4].weights);
});
