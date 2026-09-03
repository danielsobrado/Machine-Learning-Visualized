import { RAW_POINTS } from './pcaConstants.js';

const EPSILON = 1e-12;

export function rotate([x, y], angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos];
}

export function makePoints(correlation, noise, rawPoints = RAW_POINTS) {
  const angle = correlation * 0.65;
  const spreadY = 0.35 + (1 - Math.abs(correlation)) * 0.75 + noise * 0.35;

  return rawPoints.map(([x, y], index) => {
    const jitter = Math.sin(index * 2.3) * noise;
    return rotate([x, y * spreadY + jitter], angle);
  });
}

export function covariance(points) {
  if (points.length < 2) {
    throw new RangeError('PCA requires at least two points.');
  }

  const mean = points
    .reduce((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0])
    .map((value) => value / points.length);
  const centered = points.map(([x, y]) => [x - mean[0], y - mean[1]]);
  const [xx, xy, yy] = centered
    .reduce((acc, [x, y]) => [acc[0] + x * x, acc[1] + x * y, acc[2] + y * y], [0, 0, 0])
    .map((value) => value / (points.length - 1));
  const trace = xx + yy;
  const determinant = xx * yy - xy * xy;
  const root = Math.sqrt(Math.max(0, trace * trace - 4 * determinant));
  const lambda1 = (trace + root) / 2;
  const lambda2 = (trace - root) / 2;
  const angle = 0.5 * Math.atan2(2 * xy, xx - yy);

  return { mean, centered, lambda1, lambda2, angle, covariance: { xx, xy, yy } };
}

export function explainedVarianceRatio(pca) {
  const total = pca.lambda1 + pca.lambda2;
  return total <= EPSILON ? 0 : pca.lambda1 / total;
}

export function principalLoadings(angle) {
  return [Math.cos(angle), Math.sin(angle)];
}

export function project(point, mean, angle) {
  const unit = principalLoadings(angle);
  const centered = [point[0] - mean[0], point[1] - mean[1]];
  const score = centered[0] * unit[0] + centered[1] * unit[1];
  return [mean[0] + score * unit[0], mean[1] + score * unit[1]];
}

export function componentScore(point, mean, angle) {
  const unit = principalLoadings(angle);
  return (point[0] - mean[0]) * unit[0] + (point[1] - mean[1]) * unit[1];
}

export function standardize(points) {
  if (points.length < 2) {
    throw new RangeError('Standardization requires at least two points.');
  }

  const mean = [0, 1].map((dimension) => (
    points.reduce((sum, point) => sum + point[dimension], 0) / points.length
  ));
  const standardDeviation = [0, 1].map((dimension) => {
    const variance = points.reduce(
      (sum, point) => sum + (point[dimension] - mean[dimension]) ** 2,
      0,
    ) / (points.length - 1);
    return Math.sqrt(variance);
  });

  return points.map((point) => point.map((value, dimension) => (
    standardDeviation[dimension] <= EPSILON
      ? 0
      : (value - mean[dimension]) / standardDeviation[dimension]
  )));
}

export function classMeanGapOnComponent(labeledPoints, angle) {
  const groups = new Map();
  const points = labeledPoints.map((item) => item.point);
  const pca = covariance(points);

  labeledPoints.forEach((item) => {
    const scores = groups.get(item.label) ?? [];
    scores.push(componentScore(item.point, pca.mean, angle));
    groups.set(item.label, scores);
  });

  const means = [...groups.values()].map((scores) => (
    scores.reduce((sum, score) => sum + score, 0) / scores.length
  ));

  if (means.length !== 2) {
    throw new RangeError('Class-gap diagnostic expects exactly two labels.');
  }

  return Math.abs(means[0] - means[1]);
}

export function toScreen([x, y], size = 360, scale = 58) {
  return [size / 2 + x * scale, size / 2 - y * scale];
}
