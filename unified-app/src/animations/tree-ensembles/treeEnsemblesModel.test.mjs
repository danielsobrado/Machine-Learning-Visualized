import assert from 'node:assert/strict';
import test from 'node:test';
import {
  POINTS,
  buildRandomForest,
  effectiveIndependentTreeCount,
  ensembleVarianceRatio,
  fitDecisionTree,
  fitLogisticBoosting,
  forestDiversityDiagnostics,
  forestDiversitySeries,
  forestPrediction,
  giniImpurity,
  outOfBagReport,
  predictBoosting,
  predictTree,
  toScreen,
  treeAccuracy,
  treeSplitSegments,
} from './treeEnsemblesModel.js';

const closeTo = (actual, expected, tolerance = 1e-8) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be within ${tolerance} of ${expected}`);
};

test('Gini impurity is zero for pure rows and positive for mixed rows', () => {
  assert.equal(giniImpurity(POINTS.filter((row) => row.label === 1)), 0);
  assert.ok(giniImpurity(POINTS) > 0);
});

test('single decision tree learns its split rules from the lesson data', () => {
  const depthOne = fitDecisionTree(POINTS, 1);
  const depthTwo = fitDecisionTree(POINTS, 2);
  const depthThree = fitDecisionTree(POINTS, 3);

  assert.equal(depthOne.feature, 'x');
  closeTo(depthOne.threshold, 0.28);
  assert.equal(treeAccuracy(depthOne), 10 / 12);
  assert.equal(treeAccuracy(depthTwo), 11 / 12);
  assert.equal(treeAccuracy(depthThree), 1);
  assert.ok(treeSplitSegments(depthThree).length >= 3);
});

test('tree predictions follow the fitted tree instead of hard-coded depth rules', () => {
  const tree = fitDecisionTree(POINTS, 3);
  for (const row of POINTS) assert.equal(predictTree(row, tree), row.label);
});

test('random forest uses distinct bootstrap samples and per-node feature subsampling', () => {
  const forest = buildRandomForest(15, 3);
  const diagnostics = forestDiversityDiagnostics(forest);

  assert.equal(forest.trees.length, 15);
  assert.ok(diagnostics.uniqueBootstrapSamples > 10);
  assert.ok(diagnostics.pairwiseDisagreement > 0.05);
});

test('out-of-bag evaluation scores rows only with trees that omitted them', () => {
  const forest = buildRandomForest(25, 3);
  const report = outOfBagReport(forest);

  assert.equal(report.coverage, 1);
  assert.ok(report.accuracy >= 0.6 && report.accuracy <= 1);
  for (const rowReport of report.rowReports) {
    assert.ok(rowReport.eligibleTrees > 0);
    const eligible = forest.trees.filter(({ oobIds }) => oobIds.includes(rowReport.id));
    assert.equal(eligible.length, rowReport.eligibleTrees);
    assert.ok(eligible.every(({ sampleIds }) => !sampleIds.includes(rowReport.id)));
  }
});

test('forest vote is derived from fitted bootstrap trees', () => {
  const forest = buildRandomForest(15, 3);
  const result = forestPrediction(POINTS[8], forest);

  assert.equal(result.votes.length, 15);
  assert.equal(result.positiveVotes, result.votes.reduce((sum, vote) => sum + vote, 0));
  assert.equal(result.positiveVoteShare, result.positiveVotes / 15);
  assert.equal('probability' in result, false);
});

test('gradient boosting fits residual corrections that lower training log loss every round', () => {
  const model = fitLogisticBoosting(10, 0.5);
  assert.equal(model.steps.length, 10);
  for (let index = 1; index < model.steps.length; index += 1) {
    assert.ok(model.steps[index].trainLogLoss < model.steps[index - 1].trainLogLoss);
  }
  assert.ok(model.steps.at(-1).trainLogLoss < 0.4);
});

test('boosting prediction is the base score plus fitted stump contributions', () => {
  const model = fitLogisticBoosting(5, 0.5);
  const prediction = predictBoosting(POINTS[10], model);
  const deltaSum = prediction.steps.reduce((sum, step) => sum + step.delta, 0);

  closeTo(prediction.score, model.baseScore + deltaSum);
  assert.ok(prediction.probability > 0.5);
});

test('smaller learning rates require more boosting rounds to reach comparable training loss', () => {
  const slowShort = fitLogisticBoosting(3, 0.2);
  const slowLong = fitLogisticBoosting(12, 0.2);
  assert.ok(slowLong.steps.at(-1).trainLogLoss < slowShort.steps.at(-1).trainLogLoss - 0.1);
});

test('independent trees recover one-over-tree-count variance reduction in the analytical diversity model', () => {
  assert.equal(ensembleVarianceRatio(1, 0), 1);
  assert.equal(ensembleVarianceRatio(10, 0), 0.1);
  assert.equal(ensembleVarianceRatio(100, 0), 0.01);
});

test('correlated trees hit a variance floor in the analytical diversity model', () => {
  assert.equal(ensembleVarianceRatio(100, 0.9), 0.901);
  assert.ok(effectiveIndependentTreeCount(100, 0.9) < 1.2);
  const series = forestDiversitySeries(0.8, 100);
  assert.equal(series.length, 100);
  assert.ok(series.at(-1).varianceRatio > 0.8);
});

test('invalid ensemble and boosting inputs fail explicitly', () => {
  assert.throws(() => fitDecisionTree(POINTS, 0), RangeError);
  assert.throws(() => buildRandomForest(0, 3), RangeError);
  assert.throws(() => buildRandomForest(41, 3), RangeError);
  assert.throws(() => fitLogisticBoosting(0, 0.5), RangeError);
  assert.throws(() => fitLogisticBoosting(5, 0.01), RangeError);
  assert.throws(() => fitDecisionTree([{ id: 'x', x: 0, y: 0, label: 1 }], 2), RangeError);
});

test('toScreen projects normalized points into the split-map chart bounds', () => {
  for (const point of POINTS) {
    const [x, y] = toScreen(point);
    assert.ok(x >= 32 && x <= 328);
    assert.ok(y >= 32 && y <= 328);
  }
});
