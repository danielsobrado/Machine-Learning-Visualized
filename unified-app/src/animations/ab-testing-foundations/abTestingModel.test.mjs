import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AB_TEST_DEFAULTS,
  OPTIONAL_STOPPING_SIMULATION,
  SIGNIFICANCE_ALPHA,
} from './abTestingConstants.js';
import {
  planningMetrics,
  simulateOptionalStopping,
  twoSidedPValue,
} from './abTestingModel.js';

test('balanced allocation gives better precision than an extreme split', () => {
  const balanced = planningMetrics(AB_TEST_DEFAULTS);
  const uneven = planningMetrics({ ...AB_TEST_DEFAULTS, treatmentShare: 90 });

  assert.ok(balanced.se < uneven.se);
  assert.equal(balanced.allocationRisk, false);
  assert.equal(uneven.allocationRisk, true);
  assert.equal(balanced.controlN + balanced.treatmentN, AB_TEST_DEFAULTS.sampleSize);
});

test('larger planned samples reduce expected standard error', () => {
  const small = planningMetrics({ ...AB_TEST_DEFAULTS, sampleSize: 4000 });
  const large = planningMetrics({ ...AB_TEST_DEFAULTS, sampleSize: 40000 });

  assert.ok(large.se < small.se);
  assert.ok(Math.abs(large.z) > Math.abs(small.z));
});

test('a single fixed-horizon null test stays near alpha while naive peeking inflates false positives', () => {
  const result = simulateOptionalStopping(OPTIONAL_STOPPING_SIMULATION);

  assert.ok(result.fixedHorizonRate > 0.035 && result.fixedHorizonRate < 0.065);
  assert.ok(result.naivePeekingRate > result.fixedHorizonRate * 2);
  assert.ok(result.naivePeekingRate > 0.1);
  assert.ok(result.adjustedMonitoringRate < result.naivePeekingRate);
});

test('the optional-stopping example crosses significance before finishing non-significant', () => {
  const result = simulateOptionalStopping(OPTIONAL_STOPPING_SIMULATION);

  assert.equal(result.examplePath.length, OPTIONAL_STOPPING_SIMULATION.looks);
  assert.ok(result.examplePath.some(({ pValue }) => pValue < SIGNIFICANCE_ALPHA));
  assert.ok(result.examplePath.at(-1).pValue >= SIGNIFICANCE_ALPHA);
});

test('cumulative false-positive risk from peeking cannot decrease as more looks are added', () => {
  const result = simulateOptionalStopping(OPTIONAL_STOPPING_SIMULATION);

  for (let index = 1; index < result.falsePositiveByLook.length; index += 1) {
    assert.ok(result.falsePositiveByLook[index].rate >= result.falsePositiveByLook[index - 1].rate);
  }
  assert.equal(result.falsePositiveByLook.at(-1).rate, result.naivePeekingRate);
});

test('p-values and simulation inputs are validated', () => {
  assert.ok(twoSidedPValue(0) > 0.999999);
  assert.ok(twoSidedPValue(3) < 0.01);
  assert.throws(() => simulateOptionalStopping({ looks: 1, simulations: 1000, seed: 1 }), RangeError);
  assert.throws(() => simulateOptionalStopping({ looks: 5, simulations: 50, seed: 1 }), RangeError);
  assert.throws(() => simulateOptionalStopping({ looks: 5, simulations: 1000, seed: 1, alpha: 1 }), RangeError);
});
