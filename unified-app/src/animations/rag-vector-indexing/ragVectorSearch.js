import {
  RAG_VECTOR_DEFAULTS,
  generateVectorCorpus,
  materializeEmbeddingSpace,
} from './ragVectorData.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distanceSquared(left, right) {
  const dx = left[0] - right[0];
  const dy = left[1] - right[1];
  return dx * dx + dy * dy;
}

function matchesFilter(point, filterGroup) {
  return filterGroup === 'all' || point.group === filterGroup;
}

function rankPoints(points, queryVector) {
  return points
    .map((point) => ({ ...point, distance: Math.sqrt(distanceSquared(point.vector, queryVector)) }))
    .sort((left, right) => left.distance - right.distance || left.id.localeCompare(right.id));
}

export function exactSearch(points, queryVector, { topK, filterGroup = 'all' }) {
  const eligible = points.filter((point) => matchesFilter(point, filterGroup));
  return {
    results: rankPoints(eligible, queryVector).slice(0, topK),
    visitedIds: eligible.map((point) => point.id),
    distanceChecks: eligible.length,
  };
}

export function buildIvfIndex(points, clusterCount = 6, iterations = 8) {
  const actualClusterCount = Math.min(clusterCount, points.length);
  let centroids = Array.from({ length: actualClusterCount }, (_, index) => (
    [...points[Math.floor((index * points.length) / actualClusterCount)].vector]
  ));
  let assignments = new Array(points.length).fill(0);

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    assignments = points.map((point) => centroids.reduce((best, centroid, centroidIndex) => (
      distanceSquared(point.vector, centroid) < distanceSquared(point.vector, centroids[best]) ? centroidIndex : best
    ), 0));
    centroids = centroids.map((centroid, centroidIndex) => {
      const members = points.filter((_, pointIndex) => assignments[pointIndex] === centroidIndex);
      if (members.length === 0) return centroid;
      return [
        members.reduce((sum, point) => sum + point.vector[0], 0) / members.length,
        members.reduce((sum, point) => sum + point.vector[1], 0) / members.length,
      ];
    });
  }

  const clusters = Array.from({ length: actualClusterCount }, () => []);
  assignments.forEach((clusterIndex, pointIndex) => clusters[clusterIndex].push(pointIndex));
  return { centroids, clusters };
}

export function ivfSearch(points, queryVector, index, { topK, probeCount, filterGroup = 'all' }) {
  const selectedClusters = index.centroids
    .map((centroid, clusterIndex) => ({ clusterIndex, distance: distanceSquared(centroid, queryVector) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, clamp(probeCount, 1, index.centroids.length));
  const candidateIndices = [...new Set(selectedClusters.flatMap(({ clusterIndex }) => index.clusters[clusterIndex]))];
  const ranked = rankPoints(candidateIndices.map((pointIndex) => points[pointIndex]), queryVector)
    .filter((point) => matchesFilter(point, filterGroup));
  return {
    results: ranked.slice(0, topK),
    visitedIds: candidateIndices.map((pointIndex) => points[pointIndex].id),
    distanceChecks: index.centroids.length + candidateIndices.length,
  };
}

export function buildNavigableGraph(points, neighborCount = 6) {
  const adjacency = points.map((point, index) => {
    const nearest = points
      .map((candidate, candidateIndex) => ({
        candidateIndex,
        distance: candidateIndex === index ? Number.POSITIVE_INFINITY : distanceSquared(point.vector, candidate.vector),
      }))
      .sort((left, right) => left.distance - right.distance)
      .slice(0, Math.min(neighborCount, points.length - 1));
    return new Set(nearest.map(({ candidateIndex }) => candidateIndex));
  });
  adjacency.forEach((neighbors, index) => {
    neighbors.forEach((neighborIndex) => adjacency[neighborIndex].add(index));
    if (points.length > 1) {
      adjacency[index].add((index + 1) % points.length);
      adjacency[index].add((index - 1 + points.length) % points.length);
    }
  });
  return adjacency.map((neighbors) => [...neighbors]);
}

export function graphSearch(points, queryVector, graph, { topK, visitBudget, filterGroup = 'all' }) {
  const entryIndex = Math.max(0, points.length - 2);
  const visited = new Set();
  const queued = new Set([entryIndex]);
  const firstDistance = distanceSquared(points[entryIndex].vector, queryVector);
  const frontier = [{ index: entryIndex, distance: firstDistance }];
  const scored = new Map([[entryIndex, firstDistance]]);

  while (frontier.length > 0 && visited.size < visitBudget) {
    frontier.sort((left, right) => left.distance - right.distance);
    const current = frontier.shift();
    queued.delete(current.index);
    if (visited.has(current.index)) continue;
    visited.add(current.index);
    graph[current.index].forEach((neighborIndex) => {
      if (visited.has(neighborIndex) || queued.has(neighborIndex)) return;
      const distance = distanceSquared(points[neighborIndex].vector, queryVector);
      scored.set(neighborIndex, distance);
      frontier.push({ index: neighborIndex, distance });
      queued.add(neighborIndex);
    });
  }

  const ranked = rankPoints([...visited].map((index) => points[index]), queryVector)
    .filter((point) => matchesFilter(point, filterGroup));
  return {
    results: ranked.slice(0, topK),
    visitedIds: [...visited].map((index) => points[index].id),
    distanceChecks: scored.size,
  };
}

function recallAtK(results, truth) {
  if (truth.length === 0) return 1;
  const returned = new Set(results.map(({ id }) => id));
  const hits = truth.reduce((count, point) => count + (returned.has(point.id) ? 1 : 0), 0);
  return hits / truth.length;
}

export function runVectorSearchExperiment({
  count = RAG_VECTOR_DEFAULTS.count,
  breadth = RAG_VECTOR_DEFAULTS.breadth,
  topK = RAG_VECTOR_DEFAULTS.topK,
  method = RAG_VECTOR_DEFAULTS.method,
  filterGroup = RAG_VECTOR_DEFAULTS.filterGroup,
  embeddingMode = RAG_VECTOR_DEFAULTS.embeddingMode,
  seed = RAG_VECTOR_DEFAULTS.seed,
  query = RAG_VECTOR_DEFAULTS.query,
} = {}) {
  const corpus = generateVectorCorpus(count, seed);
  const semanticPoints = corpus.map((point) => ({ ...point, vector: [...point.semantic] }));
  const truth = exactSearch(semanticPoints, query, { topK, filterGroup }).results;
  const embedded = materializeEmbeddingSpace(corpus, query, embeddingMode);
  let search;
  let methodDetail;

  if (method === 'exact') {
    search = exactSearch(embedded.points, embedded.queryVector, { topK, filterGroup });
    methodDetail = 'Scores every eligible vector.';
  } else if (method === 'ivf') {
    const index = buildIvfIndex(embedded.points);
    const probeCount = 1 + Math.round(clamp(breadth, 0, 1) * (index.centroids.length - 1));
    search = ivfSearch(embedded.points, embedded.queryVector, index, { topK, probeCount, filterGroup });
    methodDetail = `Probes ${probeCount}/${index.centroids.length} centroid buckets.`;
  } else if (method === 'hnsw') {
    const graph = buildNavigableGraph(embedded.points);
    const minBudget = Math.min(count, Math.max(topK + 4, 10));
    const visitBudget = Math.round(minBudget + clamp(breadth, 0, 1) * (count - minBudget));
    search = graphSearch(embedded.points, embedded.queryVector, graph, { topK, visitBudget, filterGroup });
    methodDetail = `Visits at most ${visitBudget}/${count} nodes in a single-layer navigable graph.`;
  } else {
    throw new RangeError(`unknown search method: ${method}`);
  }

  return {
    corpus,
    query,
    truth,
    results: search.results,
    visitedIds: search.visitedIds,
    distanceChecks: search.distanceChecks,
    recall: recallAtK(search.results, truth),
    shortage: Math.max(0, truth.length - search.results.length),
    methodDetail,
    embeddedQuery: embedded.queryVector,
  };
}
