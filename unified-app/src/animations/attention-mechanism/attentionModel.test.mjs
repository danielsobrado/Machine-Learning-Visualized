import assert from 'node:assert/strict';
import test from 'node:test';

import {
  attentionInterpretationTrap,
  dotProduct,
  multiHeadExperiment,
  qkvExperiment,
  scaledDotProductAttention,
  scalingExperiment,
  selfAttentionExperiment,
  softmax,
} from './attentionModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('stable softmax returns a normalized distribution', () => {
  const probabilities = softmax([1000, 999, 998]);
  close(probabilities.reduce((sum, value) => sum + value, 0), 1);
  assert.ok(probabilities[0] > probabilities[1]);
});

test('scaled dot-product attention normalizes query-key scores by sqrt(dk)', () => {
  const result = scaledDotProductAttention({
    query: [1, 1, 1, 1],
    keys: [[1, 1, 1, 1], [0, 0, 0, 0]],
    values: [[2], [0]],
  });
  close(result.divisor, 2);
  close(result.scores[0], 2);
});

test('QKV experiment uses keys for routing and values for output content', () => {
  const result = qkvExperiment();
  assert.ok(result.weights[0] > result.weights[1]);
  assert.notDeepEqual(result.keys, result.values);
  assert.equal(result.output.length, 2);
});

test('without scaling, increasing dk makes the same score pattern more peaky', () => {
  const small = scalingExperiment(4);
  const large = scalingExperiment(256);
  assert.ok(large.rawEntropy < small.rawEntropy);
  close(large.scaledEntropy, small.scaledEntropy);
});

test('multi-head experiment preserves distinct routing patterns before projection', () => {
  const result = multiHeadExperiment();
  assert.ok(result.headAWeights[0] > result.headAWeights[2]);
  assert.ok(result.headBWeights[2] > result.headBWeights[0]);
  assert.notEqual(result.headAOutput, result.headBOutput);
});

test('self-attention computes one attention distribution per query token', () => {
  const result = selfAttentionExperiment();
  assert.equal(result.rows.length, result.tokenNames.length);
  result.rows.forEach((row) => close(row.weights.reduce((sum, value) => sum + value, 0), 1));
});

test('different attention weights can produce the same output when values differ', () => {
  const result = attentionInterpretationTrap();
  assert.equal(result.outputsMatch, true);
  assert.notDeepEqual(result.caseA.weights, result.caseB.weights);
  close(result.outputA, 1);
  close(result.outputB, 1);
});

test('attention helpers reject malformed shapes', () => {
  assert.throws(() => dotProduct([1], [1, 2]), RangeError);
  assert.throws(() => scaledDotProductAttention({ query: [1], keys: [[1]], values: [[1], [2]] }), RangeError);
  assert.throws(() => scalingExperiment(0), RangeError);
});
