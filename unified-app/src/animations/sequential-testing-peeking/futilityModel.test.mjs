import assert from 'node:assert/strict';
import test from 'node:test';
import { FUTILITY_DEFAULTS } from './futilityConstants.js';
import { buildFutilityLab, conditionalPower } from './futilityModel.js';

test('two-sided five-percent final threshold is approximately 1.96', () => {
  const result = conditionalPower(FUTILITY_DEFAULTS);
  assert.ok(Math.abs(result.finalCriticalZ - 1.96) < 0.01);
});

test('stronger interim evidence increases conditional power', () => {
  const weak = conditionalPower({ ...FUTILITY_DEFAULTS, currentZ: 0 });
  const strong = conditionalPower({ ...FUTILITY_DEFAULTS, currentZ: 2 });
  assert.ok(strong.power > weak.power);
});

test('larger assumed future effect increases conditional power', () => {
  const small = conditionalPower({ ...FUTILITY_DEFAULTS, assumedEffect: 0.02 });
  const large = conditionalPower({ ...FUTILITY_DEFAULTS, assumedEffect: 0.15 });
  assert.ok(large.power > small.power);
});

test('futility decision compares conditional power with the prespecified threshold', () => {
  const scenario = { ...FUTILITY_DEFAULTS, currentZ: -0.5, futilityThreshold: 0.3 };
  const result = buildFutilityLab(scenario);
  assert.equal(result.metrics.stopForFutility, result.metrics.power < scenario.futilityThreshold);
});
