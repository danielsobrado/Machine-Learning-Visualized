import { LOOP_MODES, STABILITY } from './trainingLoopConstants.js';

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

function requirePositive(value, name) {
  requireFinite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
}

function requireMode(mode) {
  if (!Object.hasOwn(LOOP_MODES, mode)) throw new RangeError(`Unknown loop mode: ${mode}`);
}

export function quadraticLoss(parameter, curvature) {
  requireFinite(parameter, 'parameter');
  requirePositive(curvature, 'curvature');
  return 0.5 * curvature * parameter * parameter;
}

export function quadraticGradient(parameter, curvature) {
  requireFinite(parameter, 'parameter');
  requirePositive(curvature, 'curvature');
  return curvature * parameter;
}

export function deterministicMicroBatchNoise(step, microBatchIndex, amplitude) {
  requirePositiveInteger(step, 'step');
  requirePositiveInteger(microBatchIndex, 'microBatchIndex');
  requireFinite(amplitude, 'amplitude');
  if (amplitude < 0) throw new RangeError('amplitude must be non-negative');
  return amplitude * Math.sin((step * 1.7) + (microBatchIndex * 1.3));
}

export function exactStabilityProduct(learningRate, curvature) {
  requirePositive(learningRate, 'learningRate');
  requirePositive(curvature, 'curvature');
  return learningRate * curvature;
}

export function classifyQuadraticStep(learningRate, curvature) {
  const product = exactStabilityProduct(learningRate, curvature);
  if (product < 1) return 'monotonic';
  if (product === 1) return 'one-step';
  if (product < STABILITY.stableUpperExclusive) return 'oscillatory-stable';
  if (product === STABILITY.stableUpperExclusive) return 'critical';
  return 'divergent';
}

export function effectiveStabilityProduct({ learningRate, curvature, microBatches, mode }) {
  requirePositiveInteger(microBatches, 'microBatches');
  requireMode(mode);
  const base = exactStabilityProduct(learningRate, curvature);
  return mode === 'unscaled' ? base * microBatches : base;
}

export function simulateTrainingLoop({
  learningRate,
  curvature,
  optimizerSteps,
  microBatches,
  startParameter,
  noiseAmplitude,
  mode = 'correct',
}) {
  requirePositive(learningRate, 'learningRate');
  requirePositive(curvature, 'curvature');
  requirePositiveInteger(optimizerSteps, 'optimizerSteps');
  requirePositiveInteger(microBatches, 'microBatches');
  requireFinite(startParameter, 'startParameter');
  requireFinite(noiseAmplitude, 'noiseAmplitude');
  if (noiseAmplitude < 0) throw new RangeError('noiseAmplitude must be non-negative');
  requireMode(mode);

  let parameter = startParameter;
  let staleGradient = 0;
  const history = [{
    step: 0,
    parameter,
    loss: quadraticLoss(parameter, curvature),
    gradient: quadraticGradient(parameter, curvature),
    update: 0,
  }];

  for (let step = 1; step <= optimizerSteps; step += 1) {
    const trueGradient = quadraticGradient(parameter, curvature);
    const microBatchGradients = Array.from({ length: microBatches }, (_, index) => (
      trueGradient + deterministicMicroBatchNoise(step, index + 1, noiseAmplitude)
    ));
    const gradientSum = microBatchGradients.reduce((sum, value) => sum + value, 0);
    const averagedGradient = gradientSum / microBatches;

    let optimizerGradient;
    if (mode === 'unscaled') {
      optimizerGradient = gradientSum;
    } else if (mode === 'stale') {
      staleGradient += averagedGradient;
      optimizerGradient = staleGradient;
    } else {
      optimizerGradient = averagedGradient;
    }

    const update = -learningRate * optimizerGradient;
    parameter += update;
    history.push({
      step,
      parameter,
      loss: quadraticLoss(parameter, curvature),
      trueGradient,
      microBatchGradients,
      averagedGradient,
      gradientSum,
      optimizerGradient,
      update,
    });
  }

  const final = history.at(-1);
  const best = history.reduce((candidate, point) => (point.loss < candidate.loss ? point : candidate), history[0]);
  const effectiveProduct = effectiveStabilityProduct({ learningRate, curvature, microBatches, mode });

  return {
    mode,
    history,
    final,
    best,
    baseStabilityProduct: exactStabilityProduct(learningRate, curvature),
    effectiveStabilityProduct: effectiveProduct,
    baseRegime: classifyQuadraticStep(learningRate, curvature),
    expectedUnscaledRegime: mode === 'unscaled'
      ? classifyQuadraticStep(learningRate * microBatches, curvature)
      : null,
  };
}

export function compareLoopModes(config) {
  return Object.keys(LOOP_MODES).map((mode) => simulateTrainingLoop({ ...config, mode }));
}

export function accumulationScaleRatio({ learningRate, curvature, microBatches }) {
  requirePositiveInteger(microBatches, 'microBatches');
  const correct = effectiveStabilityProduct({ learningRate, curvature, microBatches, mode: 'correct' });
  const broken = effectiveStabilityProduct({ learningRate, curvature, microBatches, mode: 'unscaled' });
  return broken / correct;
}
