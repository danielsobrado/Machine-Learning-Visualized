import assert from 'node:assert/strict';
import test from 'node:test';
import { asymmetricClippedSurrogate, buildDapoLab, isDynamicSamplingGroup, normalizedAdvantages, overlongPenalty, sequenceLevelObjective, tokenLevelObjective } from './dapoModel.js';
import { DAPO_GROUPS } from './dapoConfig.js';

test('dynamic sampling keeps only groups with mixed reward outcomes', () => {
  assert.equal(isDynamicSamplingGroup([1, 0, 1, 0]), true);
  assert.equal(isDynamicSamplingGroup([1, 1, 1, 1]), false);
  assert.equal(isDynamicSamplingGroup([0, 0, 0, 0]), false);
});

test('normalized advantages vanish for a uniform reward group', () => assert.deepEqual(normalizedAdvantages([1, 1, 1, 1]), [0, 0, 0, 0]));

test('Clip-Higher increases only the upper ratio ceiling', () => {
  const base = asymmetricClippedSurrogate(1.4, 1, 0.2, 0.2);
  const higher = asymmetricClippedSurrogate(1.4, 1, 0.2, 0.28);
  assert.equal(base.objective, 1.2);
  assert.equal(higher.objective, 1.28);
  assert.equal(asymmetricClippedSurrogate(0.6, -1, 0.2, 0.2).objective, asymmetricClippedSurrogate(0.6, -1, 0.2, 0.28).objective);
});

test('token-level and sequence-level reductions differ when sequence lengths differ', () => {
  const sequences = [[1.1], [0.8, 0.8, 0.8, 0.8]];
  const advantages = [1, -1];
  const sample = sequenceLevelObjective(sequences, advantages, 0.2, 0.28);
  const token = tokenLevelObjective(sequences, advantages, 0.2, 0.28);
  assert.notEqual(sample, token);
  assert.ok(token < sample);
});

test('soft overlong punishment matches DAPO piecewise boundaries', () => {
  assert.equal(overlongPenalty(80, 100, 20), 0);
  assert.equal(overlongPenalty(90, 100, 20), -0.5);
  assert.equal(overlongPenalty(100, 100, 20), -1);
  assert.equal(overlongPenalty(101, 100, 20), -1);
});

test('lab reports useful and zero-gradient groups separately', () => {
  const lab = buildDapoLab({ groups: DAPO_GROUPS, lowerEpsilon: 0.2, upperEpsilon: 0.28, maxLength: 100, cacheLength: 20 });
  assert.equal(lab.usefulGroups, 2);
  assert.equal(lab.totalGroups, 3);
});
