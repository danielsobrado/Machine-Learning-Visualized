import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyTrace, gradientDescentTrace } from './optimizationConceptModel.js';

test('well-conditioned bowl converges with a reasonable learning rate', () => {
  const trace = gradientDescentTrace({ landscapeId: 'bowl', learningRate: 0.1, steps: 20 });
  assert.equal(classifyTrace(trace), 'converging');
  assert.ok(trace.at(-1).value < trace[0].value);
});

test('ravine exposes anisotropic gradients', () => {
  const trace = gradientDescentTrace({ landscapeId: 'ravine', start: [2, 2], learningRate: 0.08, steps: 1 });
  assert.deepEqual(trace[0].gradient, [0.8, 16]);
});

test('saddle can move away from the origin along the negative-curvature direction', () => {
  const trace = gradientDescentTrace({ landscapeId: 'saddle', start: [0.4, 0.4], learningRate: 0.1, steps: 6 });
  assert.ok(Math.abs(trace.at(-1).y) > Math.abs(trace[0].y));
});
