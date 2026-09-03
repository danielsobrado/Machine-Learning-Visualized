import assert from 'node:assert/strict';
import test from 'node:test';
import {
  NAIVE_BAYES_DEPENDENCE_DEMO,
  POINTS,
  classStats,
  classifyKnn,
  classifyNaiveBayes,
  classifySvm,
  duplicateEvidenceSeries,
  naiveBayesDuplicateEvidence,
  posteriorFromLogScores,
  project,
  svmBoundarySegment,
  svmMarginScore,
} from './knnNaiveBayesSvmModel.js';

test('kNN sorts neighbors by distance and reports vote confidence', () => {
  const result = classifyKnn({ x: -1.8, y: 0.8 }, 3);

  assert.equal(result.neighbors.length, POINTS.length);
  assert.deepEqual(result.neighbors.slice(0, 3).map((point) => point.id), ['B', 'A', 'C']);
  assert.equal(result.prediction, 'blue');
  assert.equal(result.confidence, 1);
});

test('Gaussian Naive Bayes uses class priors and normalized posterior scores', () => {
  const blueStats = classStats('blue');
  const orangeStats = classStats('orange');
  const result = classifyNaiveBayes({ x: 1.5, y: -1.0 });

  assert.equal(blueStats.prior, 0.5);
  assert.equal(orangeStats.prior, 0.5);
  assert.ok(Number.isFinite(result.scores.blue));
  assert.ok(Number.isFinite(result.scores.orange));
  assert.equal(result.prediction, 'orange');
  assert.ok(Math.abs(result.posteriors.blue + result.posteriors.orange - 1) < 1e-12);
  assert.equal(result.confidence, result.posteriors.orange);
});

test('posterior normalization remains stable for very negative log scores', () => {
  const posterior = posteriorFromLogScores({ blue: -1200, orange: -1201 });

  assert.ok(Number.isFinite(posterior.blue));
  assert.ok(Number.isFinite(posterior.orange));
  assert.ok(posterior.blue > posterior.orange);
  assert.ok(Math.abs(posterior.blue + posterior.orange - 1) < 1e-12);
});

test('one evidence column matches the dependency-aware posterior', () => {
  const result = naiveBayesDuplicateEvidence({
    ...NAIVE_BAYES_DEPENDENCE_DEMO,
    copies: 1,
  });

  assert.ok(Math.abs(result.naivePosterior - result.dependencyAwarePosterior) < 1e-12);
  assert.ok(Math.abs(result.dependencyAwarePosterior - 0.72) < 1e-12);
  assert.ok(Math.abs(result.overconfidenceGap) < 1e-12);
});

test('exact duplicate features add no information but make naive Bayes overconfident', () => {
  const fourCopies = naiveBayesDuplicateEvidence({
    ...NAIVE_BAYES_DEPENDENCE_DEMO,
    copies: 4,
  });
  const eightCopies = naiveBayesDuplicateEvidence({
    ...NAIVE_BAYES_DEPENDENCE_DEMO,
    copies: 8,
  });

  assert.ok(fourCopies.naivePosterior > 0.97);
  assert.ok(eightCopies.naivePosterior > fourCopies.naivePosterior);
  assert.equal(fourCopies.dependencyAwarePosterior, eightCopies.dependencyAwarePosterior);
  assert.ok(fourCopies.overconfidenceGap > 0.25);
});

test('Naive Bayes false certainty rises monotonically as redundant copies are added', () => {
  const series = duplicateEvidenceSeries();

  assert.equal(series.length, NAIVE_BAYES_DEPENDENCE_DEMO.maxCopies);
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

test('SVM prediction follows the sign of the displayed margin score', () => {
  const blueQuery = { x: -1.2, y: 1.0 };
  const orangeQuery = { x: 1.4, y: -1.0 };

  assert.ok(svmMarginScore(blueQuery) < 0);
  assert.ok(svmMarginScore(orangeQuery) > 0);
  assert.equal(classifySvm(blueQuery).prediction, 'blue');
  assert.equal(classifySvm(orangeQuery).prediction, 'orange');
});

test('SVM boundary segment is derived from the same margin equation as classification', () => {
  const [start, end] = svmBoundarySegment();

  assert.ok(Number.isFinite(start.cx));
  assert.ok(Number.isFinite(start.cy));
  assert.ok(Number.isFinite(end.cx));
  assert.ok(Number.isFinite(end.cy));
  assert.ok(start.cx < end.cx);
  assert.ok(start.cy > end.cy);
  assert.equal(start.cy, project({ x: 0, y: -2.4 }).cy);
  assert.equal(end.cy, project({ x: 0, y: 2.4 }).cy);
});

test('projection keeps lesson points inside the displayed plot bounds', () => {
  for (const point of POINTS) {
    const { cx, cy } = project(point);
    assert.ok(cx >= 36 && cx <= 364, `${point.id} x should be inside chart`);
    assert.ok(cy >= 36 && cy <= 276, `${point.id} y should be inside chart`);
  }
});
