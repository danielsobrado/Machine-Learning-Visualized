import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleRatioMismatch } from './abTestingModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('planned 70/30 allocation is healthy when observed counts match the plan', () => {
  const result = sampleRatioMismatch({ total: 10000, plannedTreatmentShare: 0.7, observedTreatment: 7000 });
  close(result.z, 0);
  close(result.pValue, 1);
  assert.equal(result.flagged, false);
});

test('large unexpected assignment imbalance is flagged', () => {
  const result = sampleRatioMismatch({ total: 20000, plannedTreatmentShare: 0.5, observedTreatment: 10600 });
  assert.ok(result.z > 8);
  assert.ok(result.pValue < 0.001);
  assert.equal(result.flagged, true);
});

test('invalid assignment inputs fail explicitly', () => {
  assert.throws(() => sampleRatioMismatch({ total: 1, plannedTreatmentShare: 0.5, observedTreatment: 1 }), RangeError);
  assert.throws(() => sampleRatioMismatch({ total: 100, plannedTreatmentShare: 1, observedTreatment: 50 }), RangeError);
  assert.throws(() => sampleRatioMismatch({ total: 100, plannedTreatmentShare: 0.5, observedTreatment: 101 }), RangeError);
});
