import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildConditioningTrajectory,
  buildSaddleDiagnosis,
} from './optimizationPriorityModel.js';

test('ill-conditioned curvature shrinks the stable learning-rate range', () => {
  const mild = buildConditioningTrajectory({ conditionNumber: 2, learningRate: 0.08 });
  const severe = buildConditioningTrajectory({ conditionNumber: 20, learningRate: 0.08 });
  assert.ok(severe.maxStableLearningRate < mild.maxStableLearningRate);
  assert.equal(mild.stable, true);
  assert.equal(severe.stable, true);
});

test('a learning rate above 2 over the steep curvature diverges', () => {
  const unstable = buildConditioningTrajectory({ conditionNumber: 20, learningRate: 0.11 });
  assert.equal(unstable.stable, false);
  assert.ok(unstable.improvementRatio > 1);
});

test('the origin of x squared minus y squared is stationary but not a minimum', () => {
  const saddle = buildSaddleDiagnosis({ x: 0, y: 0 });
  assert.equal(saddle.gradientNorm, 0);
  assert.equal(saddle.nearStationary, true);
  assert.equal(saddle.isMinimum, false);
  assert.ok(saddle.curvatureX > 0);
  assert.ok(saddle.curvatureY < 0);
});
