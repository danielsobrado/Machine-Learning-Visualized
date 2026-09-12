import assert from 'node:assert/strict';
import test from 'node:test';
import {
  KNN_SCALE_DEMO,
  NAIVE_BAYES_DEPENDENCE_DEMO,
  POINTS,
  classStats,
  classifyKnn,
  classifyNaiveBayes,
  duplicateEvidenceSeries,
  knnScaleSensitivity,
  naiveBayesDuplicateEvidence,
  posteriorFromLogScores,
  project,
} from './knnNaiveBayesSvmModel.js';
import {
  classifySvm,
  fitLinearSvm,
  svmBoundarySegment,
  svmDecisionScore,
} from './linearSvmModel.js';

test('kNN sorts neighbors by distance and reports vote confidence', () => {
  const result = classifyKnn({ x: -1.8, y: 0.8 }, 3);
  assert.deepEqual(result.neighbors.slice(0, 3).map((point) => point.id), ['B', 'A', 'C']);
  assert.equal(result.prediction, 'blue');
  assert.equal(result.confidence, 1);
});

test('kNN rejects invalid neighborhood sizes', () => {
  assert.throws(() => classifyKnn({ x: 0, y: 0 }, 0), RangeError);
  assert.throws(() => classifyKnn({ x: 0, y: 0 }, POINTS.length + 1), RangeError);
});

test('raw large-unit distance can flip the 1-NN decision and training-only scaling repairs geometry', () => {
  const result = knnScaleSensitivity();
  assert.equal(result.raw.prediction, 'orange');
  assert.equal(result.scaled.prediction, 'blue');
  assert.equal(result.raw.selected[0].id, 'C');
  assert.equal(result.scaled.selected[0].id, 'A');
  assert.equal(result.predictionChanged, true);
  assert.ok(result.stats.largeUnit.std > result.stats.signal.std * 1000);
  assert.equal(KNN_SCALE_DEMO.query.largeUnit, result.stats.largeUnit.mean);
});

test('Gaussian Naive Bayes uses class priors and normalized posterior scores', () => {
  const blueStats = classStats('blue');
  const orangeStats = classStats('orange');
  const result = classifyNaiveBayes({ x: 1.5, y: -1.0 });
  assert.equal(blueStats.prior, 0.5);
  assert.equal(orangeStats.prior, 0.5);
  assert.equal(result.prediction, 'orange');
  assert.ok(Math.abs(result.posteriors.blue + result.posteriors.orange - 1) < 1e-12);
});

test('posterior normalization remains stable for very negative log scores', () => {
  const posterior = posteriorFromLogScores({ blue: -1200, orange: -1201 });
  assert.ok(posterior.blue > posterior.orange);
  assert.ok(Math.abs(posterior.blue + posterior.orange - 1) < 1e-12);
});

test('one evidence column matches the dependency-aware posterior', () => {
  const result = naiveBayesDuplicateEvidence({ ...NAIVE_BAYES_DEPENDENCE_DEMO, copies: 1 });
  assert.ok(Math.abs(result.naivePosterior - result.dependencyAwarePosterior) < 1e-12);
  assert.ok(Math.abs(result.dependencyAwarePosterior - 0.72) < 1e-12);
  assert.ok(Math.abs(result.overconfidenceGap) < 1e-12);
});

test('exact duplicate features add no information but make naive Bayes overconfident', () => {
  const fourCopies = naiveBayesDuplicateEvidence({ ...NAIVE_BAYES_DEPENDENCE_DEMO, copies: 4 });
  const eightCopies = naiveBayesDuplicateEvidence({ ...NAIVE_BAYES_DEPENDENCE_DEMO, copies: 8 });
  assert.ok(fourCopies.naivePosterior > 0.97);
  assert.ok(eightCopies.naivePosterior > fourCopies.naivePosterior);
  assert.equal(fourCopies.dependencyAwarePosterior, eightCopies.dependencyAwarePosterior);
});

test('Naive Bayes false certainty rises monotonically as redundant copies are added', () => {
  const series = duplicateEvidenceSeries();
  for (let index = 1; index < series.length; index += 1) {
    assert.ok(series[index].naivePosterior > series[index - 1].naivePosterior);
    assert.equal(series[index].dependencyAwarePosterior, series[0].dependencyAwarePosterior);
  }
});

test('duplicate evidence inputs are validated', () => {
  assert.throws(() => naiveBayesDuplicateEvidence({ copies: 0 }), RangeError);
  assert.throws(() => naiveBayesDuplicateEvidence({ copies: 1.5 }), RangeError);
  assert.throws(() => naiveBayesDuplicateEvidence({ copies: 2, priorBlue: 1 }), RangeError);
  assert.throws(() => naiveBayesDuplicateEvidence({ copies: 2, likelihoodGivenBlue: 0 }), RangeError);
});

test('linear SVM boundary is actually fitted from lesson points', () => {
  const fit = fitLinearSvm(POINTS, 10);
  assert.equal(fit.trainingErrors, 0);
  assert.ok(fit.weight[0] > 0);
  assert.ok(fit.weight[1] < 0);
  assert.ok(fit.marginActive.some((point) => point.id === 'D'));
  assert.ok(fit.marginActive.some((point) => point.id === 'E'));
  assert.ok(fit.training.every((point) => Math.sign(point.decisionScore) === (point.label === 'orange' ? 1 : -1)));
});

test('SVM C changes margin-width versus violation tradeoff', () => {
  const loose = fitLinearSvm(POINTS, 0.1);
  const strict = fitLinearSvm(POINTS, 10);
  assert.ok(loose.marginWidth > strict.marginWidth);
  assert.ok(loose.marginViolations > strict.marginViolations);
  assert.equal(loose.trainingErrors, 0);
  assert.equal(strict.trainingErrors, 0);
});

test('SVM query output is a signed geometric margin distance, not a probability', () => {
  const fit = fitLinearSvm(POINTS, 10);
  const blue = classifySvm({ x: -1.2, y: 1.0 }, fit);
  const orange = classifySvm({ x: 1.4, y: -1.0 }, fit);
  assert.ok(svmDecisionScore({ x: -1.2, y: 1.0 }, fit) < 0);
  assert.equal(blue.prediction, 'blue');
  assert.equal(orange.prediction, 'orange');
  assert.ok(blue.marginDistance >= 0);
  assert.ok(orange.marginDistance >= 0);
});

test('SVM boundary and margin segments are derived from the fitted decision equation', () => {
  const fit = fitLinearSvm(POINTS, 10);
  for (const level of [-1, 0, 1]) {
    const [start, end] = svmBoundarySegment(fit, project, level);
    assert.ok([start.cx, start.cy, end.cx, end.cy].every(Number.isFinite));
  }
});

test('invalid SVM training inputs fail explicitly', () => {
  assert.throws(() => fitLinearSvm(POINTS, 0), RangeError);
  assert.throws(() => fitLinearSvm(POINTS.filter((point) => point.label === 'blue'), 1), RangeError);
});

test('projection keeps lesson points inside the displayed plot bounds', () => {
  for (const point of POINTS) {
    const { cx, cy } = project(point);
    assert.ok(cx >= 36 && cx <= 364, `${point.id} x should be inside chart`);
    assert.ok(cy >= 36 && cy <= 276, `${point.id} y should be inside chart`);
  }
});
