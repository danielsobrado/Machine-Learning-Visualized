import assert from 'node:assert/strict';
import test from 'node:test';
import { WEIGHT_DECAY_DEFAULTS } from './weightDecayConstants.js';
import {
  adaptiveL2Step,
  compareWeightDecay,
  decoupledWeightDecayStep,
} from './weightDecayModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('adaptive L2 shrinkage is distorted by per-coordinate RMS scaling', () => {
  const result = adaptiveL2Step(WEIGHT_DECAY_DEFAULTS);
  close(result.regularizationGradient[0], 0.2);
  close(result.regularizationGradient[1], 0.2);
  close(result.update[0], -0.2, 1e-6);
  close(result.update[1], -0.002, 1e-9);
});

test('decoupled weight decay applies the same proportional shrinkage to equal parameters', () => {
  const result = decoupledWeightDecayStep(WEIGHT_DECAY_DEFAULTS);
  close(result.decayUpdate[0], -0.02);
  close(result.decayUpdate[1], -0.02);
  close(result.nextParameters[0], 1.98);
  close(result.nextParameters[1], 1.98);
});

test('comparison exposes different regularization behavior under adaptive scaling', () => {
  const result = compareWeightDecay(WEIGHT_DECAY_DEFAULTS);
  assert.ok(result.l2Shrink[0] > result.l2Shrink[1] * 50);
  close(result.adamwShrink[0], result.adamwShrink[1]);
});

test('equal adaptive scales make isolated L2 and decoupled decay coincide when data gradient is zero', () => {
  const config = { ...WEIGHT_DECAY_DEFAULTS, adaptiveRms: [1, 1] };
  const l2 = adaptiveL2Step(config);
  const adamw = decoupledWeightDecayStep(config);
  close(l2.nextParameters[0], adamw.nextParameters[0], 1e-9);
  close(l2.nextParameters[1], adamw.nextParameters[1], 1e-9);
});

test('invalid vector shapes fail explicitly', () => {
  assert.throws(() => adaptiveL2Step({ ...WEIGHT_DECAY_DEFAULTS, adaptiveRms: [1] }), RangeError);
  assert.throws(() => decoupledWeightDecayStep({ ...WEIGHT_DECAY_DEFAULTS, weightDecay: 0 }), RangeError);
});
