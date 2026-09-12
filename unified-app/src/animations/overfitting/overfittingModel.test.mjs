import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COMPLEXITY_STEPS,
  bestCandidate,
  complexityProfile,
  errorChart,
  fitPolynomial,
  fittedCurvePath,
  freshTestAudit,
  generalizationDiagnostics,
  makeDataSplits,
  meanSquaredError,
  observedProfile,
  pathFromChart,
  predictFitted,
  pseudoNoise,
  truth,
  truthCurvePath,
} from './overfittingModel.js';

function closeTo(actual, expected, tolerance = 1e-8) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test('data splits are deterministic, independent, and only training carries injected noisy labels', () => {
  const noisy = makeDataSplits('noisy');
  assert.equal(noisy.train.length, 26);
  assert.equal(noisy.validation.length, 24);
  assert.equal(noisy.test.length, 80);
  assert.deepEqual(noisy.train.filter((point) => point.noisy).map((point) => Number(point.id.split('-')[1])), [4, 10, 17, 22]);
  assert.ok(noisy.validation.every((point) => !point.noisy));
  assert.ok(noisy.test.every((point) => !point.noisy));
  assert.deepEqual(makeDataSplits('noisy'), noisy);
  assert.throws(() => makeDataSplits('missing'), RangeError);
});

test('pseudo noise and truth remain deterministic', () => {
  closeTo(truth(40), truth(40));
  for (let index = 0; index < 20; index += 1) {
    const value = pseudoNoise(index, 3);
    assert.ok(value >= -0.5 && value < 0.5);
  }
});

test('polynomial fitting is genuine and higher degree reduces noisy training MSE', () => {
  const splits = makeDataSplits('noisy');
  const degree4 = fitPolynomial(splits.train, 4, 'none');
  const degree12 = fitPolynomial(splits.train, 12, 'none');
  assert.ok(meanSquaredError(splits.train, degree12) < meanSquaredError(splits.train, degree4));
  assert.ok(Number.isFinite(predictFitted(50, degree12)));
});

test('noisy unregularized complexity shows empirical overfitting after the validation optimum', () => {
  const profile = complexityProfile('noisy', 'none');
  const diagnostics = generalizationDiagnostics(profile, COMPLEXITY_STEPS);
  assert.equal(diagnostics.status, 'overfit');
  assert.equal(diagnostics.best.degree, 5);
  assert.ok(diagnostics.current.train < diagnostics.best.train);
  assert.ok(diagnostics.current.validation > diagnostics.best.validation * 1.5);
  assert.ok(diagnostics.trainingImprovementSinceBest > 20);
});

test('tiny-sample interpolation can destroy held-out error while training error keeps falling', () => {
  const profile = complexityProfile('tiny', 'none');
  const best = bestCandidate(profile, 'validation');
  const last = profile.at(-1);
  assert.ok(last.train < best.train);
  assert.ok(last.validation > best.validation * 3);
  const bestAudit = freshTestAudit('tiny', 'none', best.degree);
  const lastAudit = freshTestAudit('tiny', 'none', last.degree);
  assert.ok(lastAudit.testMse > bestAudit.testMse * 3);
});

test('mild ridge materially limits late noisy-data validation damage', () => {
  const none = complexityProfile('noisy', 'none').at(-1);
  const mild = complexityProfile('noisy', 'mild').at(-1);
  assert.ok(mild.validation < none.validation * 0.7);
  assert.ok(freshTestAudit('noisy', 'mild', mild.degree).testMse < freshTestAudit('noisy', 'none', none.degree).testMse * 0.7);
});

test('strong ridge can trade training fit for substantially higher held-out bias', () => {
  const mild = bestCandidate(complexityProfile('noisy', 'mild'), 'validation');
  const strong = bestCandidate(complexityProfile('noisy', 'strong'), 'validation');
  assert.ok(strong.train > mild.train * 2);
  assert.ok(strong.validation > mild.validation * 2);
});

test('fresh test evidence is absent from model-selection profiles until the recipe is frozen', () => {
  const profile = complexityProfile('noisy', 'none');
  assert.ok(profile.every((candidate) => !Object.hasOwn(candidate, 'test')));

  const selected = bestCandidate(profile, 'validation');
  const audit = freshTestAudit('noisy', 'none', selected.degree);
  assert.equal(audit.degree, selected.degree);
  assert.ok(audit.validationMse > 0);
  assert.ok(audit.testMse > 0);
  assert.equal(audit.testCount, 80);
});

test('observed profile never uses unrevealed higher-complexity candidates', () => {
  const profile = complexityProfile('noisy', 'none');
  const observed = observedProfile(profile, 5);
  const diagnostics = generalizationDiagnostics(profile, 5);
  assert.deepEqual(observed.map((point) => point.degree), [1, 2, 3, 4, 5]);
  assert.ok(diagnostics.best.degree <= 5);
  assert.throws(() => observedProfile(profile, 0), RangeError);
  assert.throws(() => observedProfile(profile, COMPLEXITY_STEPS + 1), RangeError);
});

test('fit and score helpers reject malformed requests', () => {
  const splits = makeDataSplits('clean');
  assert.throws(() => fitPolynomial([], 2, 'none'), RangeError);
  assert.throws(() => fitPolynomial(splits.train, 0, 'none'), RangeError);
  assert.throws(() => fitPolynomial(splits.train, 2, 'missing'), RangeError);
  assert.throws(() => meanSquaredError([], fitPolynomial(splits.train, 2, 'none')), RangeError);
  assert.throws(() => bestCandidate([], 'validation'), RangeError);
  assert.throws(() => bestCandidate(complexityProfile('clean', 'none'), 'bogus'), RangeError);
});

test('chart and curve helpers render measured candidates only', () => {
  const profile = observedProfile(complexityProfile('noisy', 'mild'), 7);
  const chart = errorChart(profile, 'validation');
  assert.equal(chart.length, 7);
  assert.equal(pathFromChart(chart).split(' ').filter((token) => token === 'M' || token === 'L').length, 7);
  assert.equal(fittedCurvePath(profile.at(-1).fit).split(' ').filter((token) => token === 'M' || token === 'L').length, 92);
  assert.equal(truthCurvePath().split(' ').filter((token) => token === 'M' || token === 'L').length, 92);
  assert.throws(() => errorChart(profile, 'bogus'), RangeError);
});
