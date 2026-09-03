import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DIAGNOSTIC_ITERATIONS,
  INITIALIZATION_CASES,
  K_DIAGNOSTIC_VALUES,
} from './kMeansDiagnosticsConstants.js';
import {
  INITIAL_CENTROIDS,
  POINTS,
  assign,
  evaluateKChoices,
  farthestFirstCentroids,
  inertia,
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

test('centroid update computes means and preserves empty clusters', () => {
  const updated = updateCentroids(
    [[0, 0], [2, 2], [10, 10]],
    [0, 0, 2],
    [[9, 9], [5, 5], [0, 0]],
  );

  assert.deepEqual(updated[0], [1, 1]);
  assert.deepEqual(updated[1], [5, 5]);
  assert.deepEqual(updated[2], [10, 10]);
});

test('displayed k-means iterations monotonically reduce inertia after full update cycles', () => {
  let previous = Infinity;

  for (let iterations = 0; iterations <= 6; iterations += 1) {
    const result = runKMeans(3, iterations);
    assert.ok(result.inertia <= previous, `iteration ${iterations} should not increase inertia`);
    previous = result.inertia;
  }
});

test('runKMeans returns one assignment per point and stable centroid dimensions', () => {
  const result = runKMeans(4, 6);
  const clusterSizes = result.centroids.map((_, cluster) => result.assignments.filter((value) => value === cluster).length);

  assert.equal(result.assignments.length, POINTS.length);
  assert.equal(result.centroids.length, 4);
  assert.equal(clusterSizes.reduce((sum, size) => sum + size, 0), POINTS.length);
  assert.ok(clusterSizes.every((size) => size > 0));
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

test('inertia keeps falling after the dataset silhouette has already peaked', () => {
  const choices = evaluateKChoices(POINTS, K_DIAGNOSTIC_VALUES, DIAGNOSTIC_ITERATIONS);
  const bestSilhouette = choices.reduce((best, choice) => (choice.silhouette > best.silhouette ? choice : best));

  assert.equal(bestSilhouette.k, 4);
  assert.ok(choices.every((choice) => choice.silhouette >= -1 && choice.silhouette <= 1));
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
