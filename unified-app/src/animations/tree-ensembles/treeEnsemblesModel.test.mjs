import assert from 'node:assert/strict';
import test from 'node:test';
import {
  POINTS,
  accuracy,
  boostedScore,
  effectiveIndependentTreeCount,
  ensembleVarianceRatio,
  forestDiversitySeries,
  forestPrediction,
  predictTree,
  ruleVote,
  toScreen,
} from './treeEnsemblesModel.js';

test('single tree depth increases the displayed training fit on the toy data', () => {
  assert.equal(POINTS.length, 12);
  assert.ok(accuracy(2) >= accuracy(1));
  assert.ok(accuracy(3) >= accuracy(2));
  assert.equal(accuracy(3), 11 / 12);
});

test('single tree split rules match the displayed depth controls', () => {
  const leftLow = { x: 0.25, y: 0.64, label: 0 };
  const leftHigh = { x: 0.31, y: 0.79, label: 1 };
  const rightLow = { x: 0.60, y: 0.34, label: 0 };
  const farRightLow = { x: 0.81, y: 0.28, label: 1 };

  assert.equal(predictTree(leftLow, 2), 0);
  assert.equal(predictTree(leftHigh, 2), 1);
  assert.equal(predictTree(rightLow, 2), 0);
  assert.equal(predictTree(farRightLow, 3), 1);
});

test('forest prediction aggregates only the selected number of rule votes', () => {
  const selectedPoint = POINTS[8];
  const forest = forestPrediction(selectedPoint, 5);

  assert.equal(forest.votes.length, 5);
  assert.equal(forest.positiveVotes, forest.votes.filter(Boolean).length);
  assert.equal(forest.positiveVoteShare, forest.positiveVotes / 5);
  assert.equal(forest.label, forest.positiveVotes >= 3 ? 1 : 0);
  assert.equal('probability' in forest, false);
});

test('forest prediction validates the teaching forest tree count', () => {
  assert.throws(() => forestPrediction(POINTS[0], 0), RangeError);
  assert.throws(() => forestPrediction(POINTS[0], 8), RangeError);
});

test('ruleVote honors positive and inverted threshold polarity', () => {
  assert.equal(ruleVote({ x: 0.8 }, { feature: 'x', threshold: 0.74, polarity: 1 }), 1);
  assert.equal(ruleVote({ x: 0.8 }, { feature: 'x', threshold: 0.74, polarity: -1 }), 0);
});

test('boosting score applies only matched correction rounds with learning-rate shrinkage', () => {
  const point = { x: 0.81, y: 0.28, label: 1 };
  const boosted = boostedScore(point, 5, 0.5);
  const matchedDeltaSum = boosted.steps.reduce((sum, step) => sum + step.delta, 0);

  assert.equal(boosted.steps.length, 5);
  assert.equal(boosted.steps.filter((step) => step.matched).length, 3);
  assert.equal(Number((boosted.score - (-0.15)).toFixed(6)), Number(matchedDeltaSum.toFixed(6)));
  assert.ok(boosted.probability > 0.5);
});

test('independent trees recover the familiar one-over-tree-count variance reduction', () => {
  assert.equal(ensembleVarianceRatio(1, 0), 1);
  assert.equal(ensembleVarianceRatio(10, 0), 0.1);
  assert.equal(ensembleVarianceRatio(100, 0), 0.01);
});

test('correlated trees hit a variance floor even as the forest grows', () => {
  assert.equal(ensembleVarianceRatio(100, 0.9), 0.901);
  assert.ok(ensembleVarianceRatio(100, 0.9) > ensembleVarianceRatio(10, 0));
  assert.ok(ensembleVarianceRatio(100, 0.9) > 0.9);
});

test('near-clone trees can have an effective independent count close to one', () => {
  const effectiveTrees = effectiveIndependentTreeCount(100, 0.9);

  assert.ok(effectiveTrees > 1);
  assert.ok(effectiveTrees < 1.2);
});

test('forest diversity series improves with more trees but preserves the correlation floor', () => {
  const series = forestDiversitySeries(0.8, 100);

  assert.equal(series.length, 100);
  assert.equal(series[0].varianceRatio, 1);
  assert.equal(series[99].independentVarianceRatio, 0.01);
  assert.ok(series[99].varianceRatio > 0.8);
  for (let index = 1; index < series.length; index += 1) {
    assert.ok(series[index].varianceRatio < series[index - 1].varianceRatio);
  }
});

test('forest diversity inputs reject invalid counts and correlations', () => {
  assert.throws(() => ensembleVarianceRatio(0, 0.5), RangeError);
  assert.throws(() => ensembleVarianceRatio(10.5, 0.5), RangeError);
  assert.throws(() => ensembleVarianceRatio(10, -0.1), RangeError);
  assert.throws(() => ensembleVarianceRatio(10, 1.1), RangeError);
  assert.throws(() => forestDiversitySeries(0.5, 0), RangeError);
});

test('toScreen projects normalized points into the split-map chart bounds', () => {
  for (const point of POINTS) {
    const [x, y] = toScreen(point);
    assert.ok(x >= 32 && x <= 328);
    assert.ok(y >= 32 && y <= 328);
  }
});
