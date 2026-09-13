export const OPTIMIZATION_LANDSCAPES = Object.freeze({
  bowl: Object.freeze({
    label: 'Well-conditioned bowl',
    description: 'Similar curvature in both directions.',
    value: (x, y) => x * x + y * y,
    gradient: (x, y) => [2 * x, 2 * y],
  }),
  ravine: Object.freeze({
    label: 'Narrow ravine',
    description: 'One direction is much steeper than the other.',
    value: (x, y) => 0.2 * x * x + 4 * y * y,
    gradient: (x, y) => [0.4 * x, 8 * y],
  }),
  saddle: Object.freeze({
    label: 'Saddle',
    description: 'Downhill in one direction and uphill in another.',
    value: (x, y) => x * x - y * y,
    gradient: (x, y) => [2 * x, -2 * y],
  }),
});

function requireLandscape(id) {
  const landscape = OPTIMIZATION_LANDSCAPES[id];
  if (!landscape) throw new RangeError(`Unknown landscape: ${id}`);
  return landscape;
}

export function gradientDescentTrace({ landscapeId = 'ravine', start = [2.5, 2], learningRate = 0.08, steps = 18 } = {}) {
  if (!Array.isArray(start) || start.length !== 2 || start.some((value) => !Number.isFinite(value))) {
    throw new TypeError('start must be a finite 2D point');
  }
  if (!Number.isFinite(learningRate) || learningRate <= 0) throw new RangeError('learningRate must be positive');
  if (!Number.isInteger(steps) || steps < 1) throw new RangeError('steps must be a positive integer');

  const landscape = requireLandscape(landscapeId);
  let [x, y] = start;
  const trace = [];

  for (let step = 0; step <= steps; step += 1) {
    const [gx, gy] = landscape.gradient(x, y);
    trace.push({ step, x, y, value: landscape.value(x, y), gradient: [gx, gy] });
    if (step === steps) break;
    x -= learningRate * gx;
    y -= learningRate * gy;
  }

  return trace;
}

export function classifyTrace(trace) {
  if (!Array.isArray(trace) || trace.length < 2) throw new TypeError('trace must contain at least two points');
  const firstPoint = trace[0];
  const lastPoint = trace.at(-1);
  const first = firstPoint.value;
  const last = lastPoint.value;
  const firstMagnitude = Math.hypot(firstPoint.x, firstPoint.y);
  const lastMagnitude = Math.hypot(lastPoint.x, lastPoint.y);
  const maxMagnitude = Math.max(...trace.map((point) => Math.hypot(point.x, point.y)));

  const escapingParameterSpace = lastMagnitude > firstMagnitude * 1.5
    && Math.abs(last) > Math.abs(first) * 2 + 0.1;
  if (!Number.isFinite(last) || maxMagnitude > 50 || escapingParameterSpace) return 'diverged';
  if (last < first * 0.1) return 'converging';
  if (last < first) return 'improving slowly';
  return 'not improving';
}
