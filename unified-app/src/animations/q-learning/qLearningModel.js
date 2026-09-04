function requireSamples(samples, name) {
  if (!Array.isArray(samples) || samples.length === 0 || samples.some((row) => !Array.isArray(row) || row.length < 2 || row.some((v) => !Number.isFinite(v)))) {
    throw new TypeError(`${name} must be a non-empty matrix of finite action estimates`);
  }
}

export function qLearningTarget({ reward, gamma, nextActionValues, terminal = false }) {
  if (![reward, gamma].every(Number.isFinite)) throw new TypeError('reward and gamma must be finite');
  if (gamma < 0 || gamma > 1) throw new RangeError('gamma must be in [0, 1]');
  if (terminal) return reward;
  if (!Array.isArray(nextActionValues) || nextActionValues.length === 0 || nextActionValues.some((v) => !Number.isFinite(v))) throw new TypeError('nextActionValues must be finite');
  return reward + gamma * Math.max(...nextActionValues);
}

export function qUpdate({ current, target, alpha }) {
  if (![current, target, alpha].every(Number.isFinite)) throw new TypeError('update inputs must be finite');
  if (alpha < 0 || alpha > 1) throw new RangeError('alpha must be in [0, 1]');
  return current + alpha * (target - current);
}

export function maximizationBias(samples) {
  requireSamples(samples, 'samples');
  const actionCount = samples[0].length;
  if (samples.some((row) => row.length !== actionCount)) throw new RangeError('all sample rows must have the same action count');
  const actionMeans = Array.from({ length: actionCount }, (_, action) => samples.reduce((sum, row) => sum + row[action], 0) / samples.length);
  const meanOfMax = samples.reduce((sum, row) => sum + Math.max(...row), 0) / samples.length;
  const maxOfMeans = Math.max(...actionMeans);
  return { actionMeans, meanOfMax, maxOfMeans, bias: meanOfMax - maxOfMeans };
}

export function doubleEstimatorTargetMean({ selectionSamples, evaluationSamples }) {
  requireSamples(selectionSamples, 'selectionSamples');
  requireSamples(evaluationSamples, 'evaluationSamples');
  const actionCount = selectionSamples[0].length;
  if (evaluationSamples.some((row) => row.length !== actionCount) || selectionSamples.some((row) => row.length !== actionCount)) throw new RangeError('sample shapes must agree');

  let total = 0;
  let count = 0;
  selectionSamples.forEach((selection) => {
    const selectedAction = selection.reduce((best, value, index) => value > selection[best] ? index : best, 0);
    evaluationSamples.forEach((evaluation) => {
      total += evaluation[selectedAction];
      count += 1;
    });
  });
  return total / count;
}

export const BIAS_EXAMPLE = Object.freeze([
  [1, -1],
  [-1, 1],
  [0.8, -0.8],
  [-0.8, 0.8],
]);
