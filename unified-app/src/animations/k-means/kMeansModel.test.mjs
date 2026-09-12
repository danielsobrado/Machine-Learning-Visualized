import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DIAGNOSTIC_ITERATIONS,
  EMPTY_CLUSTER_CASE,
  INITIALIZATION_CASES,
  K_DIAGNOSTIC_VALUES,
  NON_CONVEX_CASE,
  OUTLIER_SENSITIVITY_CASE,
} from './kMeansDiagnosticsConstants.js';
import {
  INITIAL_CENTROIDS,
  POINTS,
  assign,
  assignmentChanges,
  buildConcentricRingCase,
  clusterLabelComposition,
  clusterSizes,
  compareOutlierSensitivity,
  emptyClusterIds,
  evaluateKChoices,
  evaluateNonConvexCase,
  farthestFirstCentroids,
  inertia,
  labelPurity,
  maxCentroidShift,
  runKMeans,
  runKMeansForData,
  silhouetteScore,
  updateCentroids,
} from './kMeansModel.js';

function closeTo(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test('assignment sends points to the nearest centroid with deterministic tie handling', () => {
  assert.deepEqual(assign([[0, 0], [10, 0], [5, 0]], [[0, 0], [10, 0]]), [0, 1, 0]);
});

test('centroid update computes means and preserves empty clusters under the lesson policy', () => {
  const updated = updateCentroids(
    [[0, 0], [2, 2], [10, 10]],
    [0, 0, 2],
    [[9, 9], [5, 5], [0, 0]],
  );

  assert.deepEqual(updated[0], [1, 1]);
  assert.deepEqual(updated[1], [5, 5]);
  assert.deepEqual(updated[2], [10, 10]);
});

test('cluster-size helpers expose unused centroids explicitly', () => {
  assert.deepEqual(clusterSizes([0, 0, 2], 3), [2, 0, 1]);
  assert.deepEqual(emptyClusterIds([0, 0, 2], 3), [1]);
});

test('assignment and centroid movement diagnostics are exact', () => {
  assert.equal(assignmentChanges([0, 0, 1], [0, 1, 1]), 1);
  closeTo(maxCentroidShift([[0, 0], [2, 2]], [[0, 0], [5, 6]]), 5);
});

test('displayed k-means iterations monotonically reduce inertia after full update cycles', () => {
  let previous = Infinity;

  for (let iterations = 0; iterations <= 6; iterations += 1) {
    const result = runKMeans(3, iterations);
    assert.ok(result.inertia <= previous + 1e-12, `iteration ${iterations} should not increase inertia`);
    previous = result.inertia;
  }
});

test('runKMeans records one trace entry per requested state and exposes convergence', () => {
  const result = runKMeans(4, 6);
  const clusterCounts = clusterSizes(result.assignments, result.centroids.length);

  assert.equal(result.assignments.length, POINTS.length);
  assert.equal(result.centroids.length, 4);
  assert.equal(result.trace.length, 7);
  assert.equal(clusterCounts.reduce((sum, size) => sum + size, 0), POINTS.length);
  assert.ok(clusterCounts.every((size) => size > 0));
  assert.equal(result.emptyClusters.length, 0);
  assert.equal(result.converged, true);
  assert.ok(result.convergedAt >= 1 && result.convergedAt <= 6);
  assert.equal(result.trace[result.convergedAt].assignmentChanges, 0);
});

test('runKMeansForData rejects invalid geometry and iteration budgets', () => {
  assert.throws(() => runKMeansForData(POINTS, INITIAL_CENTROIDS, -1), RangeError);
  assert.throws(() => runKMeansForData(POINTS, INITIAL_CENTROIDS, 1.5), RangeError);
  assert.throws(() => runKMeansForData(POINTS, [], 1), RangeError);
  assert.throws(() => runKMeansForData([], INITIAL_CENTROIDS, 1), RangeError);
  assert.throws(() => runKMeansForData([[Number.NaN, 0]], [[0, 0]], 1), TypeError);
  assert.throws(() => runKMeans(5, 1), RangeError);
});

test('computed inertia matches assigned squared distances', () => {
  const result = runKMeans(3, 2);
  const manual = POINTS.reduce((sum, point, index) => {
    const centroid = result.centroids[result.assignments[index]];
    return sum + ((point[0] - centroid[0]) ** 2) + ((point[1] - centroid[1]) ** 2);
  }, 0);

  closeTo(result.inertia, manual);
  closeTo(inertia(POINTS, assign(POINTS, INITIAL_CENTROIDS.slice(0, 3)), INITIAL_CENTROIDS.slice(0, 3)), runKMeans(3, 0).inertia);
});

test('farthest-first initialization returns distinct spread-out seeds', () => {
  const centroids = farthestFirstCentroids(POINTS, 4);
  assert.equal(centroids.length, 4);
  assert.equal(new Set(centroids.map((centroid) => centroid.join(','))).size, 4);
  assert.throws(() => farthestFirstCentroids(POINTS, 0), RangeError);
});

test('the diagnostic finite runs show decreasing inertia after silhouette peaks on this dataset', () => {
  const choices = evaluateKChoices(POINTS, K_DIAGNOSTIC_VALUES, DIAGNOSTIC_ITERATIONS);
  const bestSilhouette = choices.reduce((best, choice) => (choice.silhouette > best.silhouette ? choice : best));

  assert.equal(bestSilhouette.k, 4);
  assert.ok(choices.every((choice) => choice.silhouette >= -1 && choice.silhouette <= 1));
  assert.ok(choices.every((choice) => choice.converged));
  assert.ok(choices.every((choice) => choice.emptyClusters.length === 0));
  for (let index = 1; index < choices.length; index += 1) {
    assert.ok(choices[index].inertia < choices[index - 1].inertia);
  }
});

test('different initializations can converge to different local optima for the same k', () => {
  const spread = runKMeansForData(POINTS, INITIALIZATION_CASES.spread.centroids, DIAGNOSTIC_ITERATIONS);
  const crowded = runKMeansForData(POINTS, INITIALIZATION_CASES.crowded.centroids, DIAGNOSTIC_ITERATIONS);

  assert.ok(crowded.inertia > spread.inertia + 10);
  assert.ok(silhouetteScore(POINTS, spread.assignments) > silhouetteScore(POINTS, crowded.assignments));
});

test('duplicate initial seeds expose the preserve-centroid empty-cluster policy', () => {
  const result = runKMeansForData(POINTS, EMPTY_CLUSTER_CASE.centroids, 4);

  assert.ok(result.trace[0].emptyClusters.includes(1));
  assert.ok(result.emptyClusters.includes(1));
  assert.equal(result.converged, true);
});

test('one distant observation measurably pulls a mean centroid and raises converged inertia', () => {
  const experiment = compareOutlierSensitivity(
    POINTS,
    OUTLIER_SENSITIVITY_CASE.point,
    INITIAL_CENTROIDS,
    DIAGNOSTIC_ITERATIONS,
  );

  assert.equal(experiment.outlierCluster, 1);
  assert.equal(experiment.largestShiftCluster, 1);
  assert.ok(experiment.largestCentroidShift > 0.3);
  assert.ok(experiment.inertiaIncrease > 3);
  assert.ok(experiment.contaminated.inertia > experiment.baseline.inertia);
});

test('concentric rings expose the non-convex shape limitation despite convergence', () => {
  const experiment = evaluateNonConvexCase(NON_CONVEX_CASE, DIAGNOSTIC_ITERATIONS);

  assert.equal(experiment.result.converged, true);
  closeTo(experiment.purity, 0.5);
  assert.deepEqual(
    experiment.composition.map((cluster) => [cluster.counts.inner, cluster.counts.outer]),
    [[7, 7], [5, 5]],
  );
});

test('shape-diagnostic helpers calculate label composition and purity explicitly', () => {
  const assignments = [0, 0, 1, 1];
  const labels = ['inner', 'outer', 'inner', 'inner'];

  assert.deepEqual(clusterLabelComposition(assignments, labels, 2), [
    { cluster: 0, counts: { inner: 1, outer: 1 }, size: 2 },
    { cluster: 1, counts: { inner: 2 }, size: 2 },
  ]);
  closeTo(labelPurity(assignments, labels, 2), 0.75);
  assert.throws(() => clusterLabelComposition([0], ['a', 'b'], 2), RangeError);
});

test('concentric-ring generator rejects invalid geometry instead of producing a misleading case', () => {
  const valid = buildConcentricRingCase(NON_CONVEX_CASE);
  assert.equal(valid.points.length, NON_CONVEX_CASE.pointsPerRing * 2);
  assert.equal(valid.labels.filter((label) => label === 'inner').length, NON_CONVEX_CASE.pointsPerRing);
  assert.throws(() => buildConcentricRingCase({ ...NON_CONVEX_CASE, outerRadius: 0.5 }), RangeError);
  assert.throws(() => buildConcentricRingCase({ ...NON_CONVEX_CASE, pointsPerRing: 3 }), RangeError);
});
