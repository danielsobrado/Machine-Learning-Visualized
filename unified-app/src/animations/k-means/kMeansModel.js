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

export function clusterSizes(assignments, clusterCount) {
  return Array.from(
    { length: clusterCount },
    (_, cluster) => assignments.filter((assignment) => assignment === cluster).length,
  );
}

export function emptyClusterIds(assignments, clusterCount) {
  return clusterSizes(assignments, clusterCount)
    .map((size, cluster) => (size === 0 ? cluster : null))
    .filter((cluster) => cluster !== null);
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

export function assignmentChanges(previousAssignments, assignments) {
  return assignments.reduce(
    (count, assignment, index) => count + (assignment !== previousAssignments[index] ? 1 : 0),
    0,
  );
}

export function maxCentroidShift(previousCentroids, centroids) {
  return Math.max(
    0,
    ...centroids.map((centroid, index) => distance(previousCentroids[index], centroid)),
  );
}

export function runKMeansForData(points, initialCentroids, iterations) {
  validatePointSet(points, 'points');
  validatePointSet(initialCentroids, 'initialCentroids');
  if (!Number.isInteger(iterations) || iterations < 0) {
    throw new RangeError('iterations must be a non-negative integer');
  }

  let centroids = initialCentroids.map((centroid) => [...centroid]);
  let assignments = assign(points, centroids);
  const trace = [{
    iteration: 0,
    inertia: inertia(points, assignments, centroids),
    assignmentChanges: null,
    maxCentroidShift: null,
    emptyClusters: emptyClusterIds(assignments, centroids.length),
  }];
  let convergedAt = null;

  for (let step = 1; step <= iterations; step += 1) {
    const previousCentroids = centroids;
    const previousAssignments = assignments;
    centroids = updateCentroids(points, assignments, centroids);
    assignments = assign(points, centroids);
    const changedAssignments = assignmentChanges(previousAssignments, assignments);
    const centroidShift = maxCentroidShift(previousCentroids, centroids);
    const emptyClusters = emptyClusterIds(assignments, centroids.length);

    trace.push({
      iteration: step,
      inertia: inertia(points, assignments, centroids),
      assignmentChanges: changedAssignments,
      maxCentroidShift: centroidShift,
      emptyClusters,
    });

    if (convergedAt === null && changedAssignments === 0) {
      convergedAt = step;
    }
  }

  return {
    centroids,
    assignments,
    inertia: inertia(points, assignments, centroids),
    trace,
    converged: convergedAt !== null,
    convergedAt,
    emptyClusters: emptyClusterIds(assignments, centroids.length),
  };
}

export function runKMeans(k, iterations) {
  if (!Number.isInteger(k) || k < 1 || k > INITIAL_CENTROIDS.length) {
    throw new RangeError(`k must be an integer between 1 and ${INITIAL_CENTROIDS.length}`);
  }
  return runKMeansForData(POINTS, INITIAL_CENTROIDS.slice(0, k), iterations);
}

export function farthestFirstCentroids(points, k) {
  validatePointSet(points, 'points');
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
  validatePointSet(points, 'points');
  if (!Array.isArray(assignments) || assignments.length !== points.length) {
    throw new RangeError('assignments must match the number of points');
  }
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
  validatePointSet(points, 'points');
  if (!Array.isArray(kValues) || !kValues.length) {
    throw new RangeError('kValues must be a non-empty array');
  }
  return kValues.map((k) => {
    const initialCentroids = farthestFirstCentroids(points, k);
    const result = runKMeansForData(points, initialCentroids, iterations);
    return {
      k,
      inertia: result.inertia,
      silhouette: silhouetteScore(points, result.assignments),
      converged: result.converged,
      emptyClusters: result.emptyClusters,
    };
  });
}

export function compareOutlierSensitivity(points, outlier, initialCentroids, iterations = 12) {
  validatePointSet(points, 'points');
  validatePoint(outlier, 'outlier');
  validatePointSet(initialCentroids, 'initialCentroids');

  const baseline = runKMeansForData(points, initialCentroids, iterations);
  const contaminated = runKMeansForData([...points, outlier], initialCentroids, iterations);
  const shifts = baseline.centroids.map((centroid, cluster) => ({
    cluster,
    shift: distance(centroid, contaminated.centroids[cluster]),
  }));
  const largestShift = shifts.reduce((best, current) => (current.shift > best.shift ? current : best));

  return {
    baseline,
    contaminated,
    outlierCluster: contaminated.assignments[contaminated.assignments.length - 1],
    largestShiftCluster: largestShift.cluster,
    largestCentroidShift: largestShift.shift,
    inertiaIncrease: contaminated.inertia - baseline.inertia,
  };
}

export function buildConcentricRingCase(config) {
  if (!config || !Array.isArray(config.center) || config.center.length !== 2) {
    throw new TypeError('ring config must contain a two-dimensional center');
  }
  const { center, innerRadius, outerRadius, pointsPerRing } = config;
  if (![...center, innerRadius, outerRadius].every(Number.isFinite)) {
    throw new TypeError('ring geometry must be finite');
  }
  if (innerRadius <= 0 || outerRadius <= innerRadius) {
    throw new RangeError('outerRadius must be greater than innerRadius > 0');
  }
  if (!Number.isInteger(pointsPerRing) || pointsPerRing < 4) {
    throw new RangeError('pointsPerRing must be an integer of at least 4');
  }

  const points = [];
  const labels = [];
  for (const [label, radius] of [['inner', innerRadius], ['outer', outerRadius]]) {
    for (let index = 0; index < pointsPerRing; index += 1) {
      const angle = (2 * Math.PI * index) / pointsPerRing;
      points.push([
        center[0] + radius * Math.cos(angle),
        center[1] + radius * Math.sin(angle),
      ]);
      labels.push(label);
    }
  }
  return { points, labels };
}

export function clusterLabelComposition(assignments, labels, clusterCount) {
  if (!Array.isArray(assignments) || !Array.isArray(labels) || assignments.length !== labels.length) {
    throw new RangeError('assignments and labels must have the same length');
  }
  if (!Number.isInteger(clusterCount) || clusterCount < 1) {
    throw new RangeError('clusterCount must be a positive integer');
  }

  return Array.from({ length: clusterCount }, (_, cluster) => {
    const counts = {};
    assignments.forEach((assignment, index) => {
      if (assignment !== cluster) return;
      counts[labels[index]] = (counts[labels[index]] || 0) + 1;
    });
    return { cluster, counts, size: Object.values(counts).reduce((sum, count) => sum + count, 0) };
  });
}

export function labelPurity(assignments, labels, clusterCount) {
  const composition = clusterLabelComposition(assignments, labels, clusterCount);
  if (!labels.length) return 0;
  const dominant = composition.reduce((sum, cluster) => {
    const largest = Math.max(0, ...Object.values(cluster.counts));
    return sum + largest;
  }, 0);
  return dominant / labels.length;
}

export function evaluateNonConvexCase(config, iterations = 12) {
  if (!config?.initialCentroids) {
    throw new TypeError('non-convex case requires initialCentroids');
  }
  const { points, labels } = buildConcentricRingCase(config);
  const result = runKMeansForData(points, config.initialCentroids, iterations);
  return {
    points,
    labels,
    result,
    composition: clusterLabelComposition(result.assignments, labels, result.centroids.length),
    purity: labelPurity(result.assignments, labels, result.centroids.length),
  };
}

export function toScreen([x, y]) {
  return [40 + x * 46, 330 - y * 48];
}

function validatePointSet(points, name) {
  if (!Array.isArray(points) || !points.length) {
    throw new RangeError(`${name} must be a non-empty array of points`);
  }
  points.forEach((point, index) => validatePoint(point, `${name}[${index}]`));
}

function validatePoint(point, name) {
  if (!Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)) {
    throw new TypeError(`${name} must be a finite two-dimensional point`);
  }
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
