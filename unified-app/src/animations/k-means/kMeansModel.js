export const POINTS = Object.freeze([
  [0.8, 1.0], [1.1, 1.4], [1.4, 0.9], [1.7, 1.3], [0.9, 1.8],
  [4.1, 1.0], [4.6, 1.3], [4.9, 0.8], [5.2, 1.5], [4.4, 1.8],
  [2.5, 4.4], [2.9, 4.9], [3.3, 4.3], [3.6, 4.8], [2.7, 5.3],
  [5.3, 4.7], [5.7, 5.1], [6.0, 4.4], [6.4, 5.0],
]);

export const INITIAL_CENTROIDS = Object.freeze([
  [1, 1],
  [5.5, 1.1],
  [3.1, 5],
  [6, 4.8],
]);

export const COLORS = Object.freeze(['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2']);

export function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function assign(points, centroids) {
  return points.map((point) => {
    const distances = centroids.map((centroid) => distance(point, centroid));
    return distances.indexOf(Math.min(...distances));
  });
}

export function updateCentroids(points, assignments, centroids) {
  return centroids.map((centroid, cluster) => {
    const members = points.filter((_, index) => assignments[index] === cluster);
    if (!members.length) return centroid;
    return [
      members.reduce((sum, point) => sum + point[0], 0) / members.length,
      members.reduce((sum, point) => sum + point[1], 0) / members.length,
    ];
  });
}

export function inertia(points, assignments, centroids) {
  return points.reduce((sum, point, index) => sum + distance(point, centroids[assignments[index]]) ** 2, 0);
}

export function runKMeansForData(points, initialCentroids, iterations) {
  let centroids = initialCentroids.map((centroid) => [...centroid]);
  let assignments = assign(points, centroids);

  for (let step = 0; step < iterations; step += 1) {
    centroids = updateCentroids(points, assignments, centroids);
    assignments = assign(points, centroids);
  }

  return {
    centroids,
    assignments,
    inertia: inertia(points, assignments, centroids),
  };
}

export function runKMeans(k, iterations) {
  return runKMeansForData(POINTS, INITIAL_CENTROIDS.slice(0, k), iterations);
}

export function farthestFirstCentroids(points, k) {
  if (!Number.isInteger(k) || k < 1 || k > points.length) {
    throw new RangeError('k must be an integer between 1 and the number of points');
  }

  const centroids = [[...points[0]]];
  while (centroids.length < k) {
    const next = points.reduce((best, point) => {
      const nearestDistance = Math.min(...centroids.map((centroid) => distance(point, centroid)));
      return nearestDistance > best.distance ? { point, distance: nearestDistance } : best;
    }, { point: points[0], distance: -Infinity });
    centroids.push([...next.point]);
  }
  return centroids;
}

export function silhouetteScore(points, assignments) {
  const clusters = [...new Set(assignments)];
  if (clusters.length < 2) return 0;

  const scores = points.map((point, index) => {
    const ownCluster = assignments[index];
    const sameCluster = points.filter((_, candidateIndex) => assignments[candidateIndex] === ownCluster && candidateIndex !== index);
    if (!sameCluster.length) return 0;

    const within = average(sameCluster.map((candidate) => distance(point, candidate)));
    const nearestOther = Math.min(...clusters
      .filter((cluster) => cluster !== ownCluster)
      .map((cluster) => average(points
        .filter((_, candidateIndex) => assignments[candidateIndex] === cluster)
        .map((candidate) => distance(point, candidate)))));

    return (nearestOther - within) / Math.max(within, nearestOther);
  });

  return average(scores);
}

export function evaluateKChoices(points, kValues, iterations = 12) {
  return kValues.map((k) => {
    const initialCentroids = farthestFirstCentroids(points, k);
    const result = runKMeansForData(points, initialCentroids, iterations);
    return {
      k,
      inertia: result.inertia,
      silhouette: silhouetteScore(points, result.assignments),
    };
  });
}

export function toScreen([x, y]) {
  return [40 + x * 46, 330 - y * 48];
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
