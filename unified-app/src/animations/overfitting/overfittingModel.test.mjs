import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PROFILE_EPOCHS,
  bestEpoch,
  curvePath,
  epochProfile,
  errorPath,
  generalizationDiagnostics,
  makePoints,
  observedProfile,
  predict,
  project,
  pseudoNoise,
} from './overfittingModel.js';

test('point generation is deterministic and marks only noisy-label examples in the noisy dataset', () => {
  const clean = makePoints('clean');
  const noisy = makePoints('noisy');
  const tiny = makePoints('tiny');

  assert.equal(clean.length, 26);
  assert.equal(noisy.length, 26);
  assert.equal(tiny.length, 14);
  assert.deepEqual(noisy.filter((point) => point.noisy).map((point) => point.id), [4, 10, 17, 22]);
  assert.ok(clean.every((point) => !point.noisy));
  assert.deepEqual(makePoints('noisy'), noisy);
  assert.throws(() => makePoints('missing'), RangeError);
});

test('pseudo-noise and projection stay within expected display ranges', () => {
  for (let index = 0; index < 20; index += 1) {
    const noise = pseudoNoise(index);
    assert.ok(noise >= 0 && noise < 1, `noise ${index} should be in [0, 1)`);
  }

  assert.deepEqual(project({ x: 0, y: 12 }), { cx: 34, cy: 262 });
  assert.deepEqual(project({ x: 100, y: 116 }), { cx: 366, cy: 36 });
});

test('profile always models the full training horizon while observation is truncated separately', () => {
  const profile = epochProfile('noisy', 'mild');
  const observed = observedProfile(profile, 4);

  assert.equal(profile.length, PROFILE_EPOCHS);
  assert.deepEqual(observed.map((point) => point.epoch), [1, 2, 3, 4]);
  assert.throws(() => observedProfile(profile, 0), RangeError);
  assert.throws(() => observedProfile(profile, PROFILE_EPOCHS + 1), RangeError);
});

test('best observed epoch never uses validation evidence from the future', () => {
  const profile = epochProfile('noisy', 'none');
  const atThree = generalizationDiagnostics(profile, 3);
  const atTwelve = generalizationDiagnostics(profile, 12);

  assert.ok(atThree.best.epoch <= 3);
  assert.equal(atThree.current.epoch, 3);
  assert.ok(atTwelve.best.epoch < atTwelve.current.epoch);
});

test('no regularization on noisy data shows the defining overfitting divergence after the observed best epoch', () => {
  const diagnostics = generalizationDiagnostics(epochProfile('noisy', 'none'), 12);

  assert.equal(diagnostics.status, 'overfit');
  assert.ok(diagnostics.current.train < diagnostics.best.train);
  assert.ok(diagnostics.current.validation > diagnostics.best.validation);
  assert.ok(diagnostics.validationExcess > 0);
  assert.ok(diagnostics.trainingImprovementSinceBest > 0);
});

test('an early run is not called overfit merely because train and validation differ', () => {
  const diagnostics = generalizationDiagnostics(epochProfile('noisy', 'none'), 3);

  assert.notEqual(diagnostics.status, 'overfit');
  assert.equal(diagnostics.best.epoch, diagnostics.current.epoch);
});

test('regularization reduces the late noisy-data generalization gap', () => {
  const none = generalizationDiagnostics(epochProfile('noisy', 'none'), 12);
  const mild = generalizationDiagnostics(epochProfile('noisy', 'mild'), 12);
  const strong = generalizationDiagnostics(epochProfile('noisy', 'strong'), 12);

  assert.ok(none.gap > mild.gap);
  assert.ok(mild.gap > strong.gap);
});

test('underfit-style early complexity is visibly smoother than late flexible fits', () => {
  const early = predict(50, 1, 'noisy', 'mild');
  const middle = predict(50, 4, 'noisy', 'mild');
  const late = predict(50, 12, 'noisy', 'mild');

  assert.notEqual(early, middle);
  assert.notEqual(middle, late);
});

test('bestEpoch rejects empty profiles and selects minimum validation error', () => {
  const profile = epochProfile('clean', 'mild');
  const best = bestEpoch(profile);

  assert.equal(best.validation, Math.min(...profile.map((point) => point.validation)));
  assert.throws(() => bestEpoch([]), RangeError);
});

test('svg path helpers render only the observations supplied to them', () => {
  const observed = observedProfile(epochProfile('noisy', 'mild'), 7);

  assert.equal(curvePath(7, 'noisy', 'mild').split(' ').filter((token) => token === 'M' || token === 'L').length, 75);
  assert.equal(errorPath(observed, 'validation').split(' ').filter((token) => token === 'M' || token === 'L').length, 7);
  assert.throws(() => errorPath(observed, 'test'), RangeError);
});
