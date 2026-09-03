import {
  ACTIVATION_PROFILES,
  GAUSSIAN_INTEGRATION,
  HEALTH_THRESHOLDS,
  INITIALIZATION_METHODS,
} from './initializationConstants.js';

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
}

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

function requireKnownKey(collection, key, name) {
  if (!Object.hasOwn(collection, key)) throw new RangeError(`Unknown ${name}: ${key}`);
}

export function weightVariance(method, { fanIn, fanOut }) {
  requireKnownKey(INITIALIZATION_METHODS, method, 'initialization method');
  requirePositiveInteger(fanIn, 'fanIn');
  requirePositiveInteger(fanOut, 'fanOut');

  switch (method) {
    case 'tiny': return 0.0064 / fanIn;
    case 'xavier': return 2 / (fanIn + fanOut);
    case 'heFanIn': return 2 / fanIn;
    case 'heFanOut': return 2 / fanOut;
    case 'huge': return 9 / fanIn;
    default: throw new RangeError(`Unknown initialization method: ${method}`);
  }
}

export function buildWidthSchedule({ inputWidth, hiddenWidth, layers }) {
  requirePositiveInteger(inputWidth, 'inputWidth');
  requirePositiveInteger(hiddenWidth, 'hiddenWidth');
  requirePositiveInteger(layers, 'layers');
  return [inputWidth, ...Array.from({ length: layers }, () => hiddenWidth)];
}

export function classifyScale(scale) {
  if (!Number.isFinite(scale) || scale < 0) throw new RangeError('scale must be a finite non-negative number');
  if (scale < HEALTH_THRESHOLDS.vanishing) return 'vanishing';
  if (scale > HEALTH_THRESHOLDS.exploding) return 'exploding';
  return 'stable';
}

function gaussianExpectation(fn) {
  const { minStandardDeviations: min, maxStandardDeviations: max, steps } = GAUSSIAN_INTEGRATION;
  const h = (max - min) / steps;
  let weightedSum = 0;

  for (let index = 0; index <= steps; index += 1) {
    const x = min + (index * h);
    const density = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    const coefficient = index === 0 || index === steps ? 1 : index % 2 === 0 ? 2 : 4;
    weightedSum += coefficient * fn(x) * density;
  }

  return (h / 3) * weightedSum;
}

export function activationMoments(activation, preActivationSecondMoment) {
  requireKnownKey(ACTIVATION_PROFILES, activation, 'activation');
  requireFinite(preActivationSecondMoment, 'preActivationSecondMoment');
  if (preActivationSecondMoment < 0) throw new RangeError('preActivationSecondMoment must be non-negative');

  if (activation === 'linear') {
    return { activationSecondMoment: preActivationSecondMoment, derivativeSecondMoment: 1 };
  }

  if (activation === 'relu') {
    return { activationSecondMoment: 0.5 * preActivationSecondMoment, derivativeSecondMoment: 0.5 };
  }

  const standardDeviation = Math.sqrt(preActivationSecondMoment);
  const activationSecondMoment = gaussianExpectation((standardNormal) => {
    const value = Math.tanh(standardDeviation * standardNormal);
    return value * value;
  });
  const derivativeSecondMoment = gaussianExpectation((standardNormal) => {
    const value = Math.tanh(standardDeviation * standardNormal);
    const derivative = 1 - (value * value);
    return derivative * derivative;
  });

  return { activationSecondMoment, derivativeSecondMoment };
}

export function analyzeInitialization({ method, activation, inputWidth, hiddenWidth, layers }) {
  requireKnownKey(INITIALIZATION_METHODS, method, 'initialization method');
  requireKnownKey(ACTIVATION_PROFILES, activation, 'activation');
  const widths = buildWidthSchedule({ inputWidth, hiddenWidth, layers });
  let activationSecondMoment = 1;

  const forwardLayers = widths.slice(0, -1).map((fanIn, index) => {
    const fanOut = widths[index + 1];
    const variance = weightVariance(method, { fanIn, fanOut });
    const preActivationSecondMoment = fanIn * variance * activationSecondMoment;
    const moments = activationMoments(activation, preActivationSecondMoment);
    const forwardGain = activationSecondMoment === 0 ? 0 : moments.activationSecondMoment / activationSecondMoment;
    const layer = {
      layerNumber: index + 1,
      fanIn,
      fanOut,
      weightVariance: variance,
      weightStd: Math.sqrt(variance),
      inputActivationSecondMoment: activationSecondMoment,
      preActivationSecondMoment,
      activationSecondMoment: moments.activationSecondMoment,
      derivativeSecondMoment: moments.derivativeSecondMoment,
      forwardGain,
      forwardHealth: classifyScale(moments.activationSecondMoment),
    };
    activationSecondMoment = moments.activationSecondMoment;
    return layer;
  });

  let gradientSecondMoment = 1;
  const backwardSeries = [];
  const layersWithBackward = [...forwardLayers];

  for (let index = layersWithBackward.length - 1; index >= 0; index -= 1) {
    const layer = layersWithBackward[index];
    const backwardGain = layer.fanOut * layer.weightVariance * layer.derivativeSecondMoment;
    const gradientInSecondMoment = gradientSecondMoment * backwardGain;
    layersWithBackward[index] = {
      ...layer,
      gradientOutSecondMoment: gradientSecondMoment,
      gradientInSecondMoment,
      backwardGain,
      backwardHealth: classifyScale(gradientInSecondMoment),
    };
    backwardSeries.push({
      depth: layersWithBackward.length - index,
      layerNumber: layer.layerNumber,
      fanIn: layer.fanIn,
      fanOut: layer.fanOut,
      gain: backwardGain,
      scale: gradientInSecondMoment,
      health: classifyScale(gradientInSecondMoment),
    });
    gradientSecondMoment = gradientInSecondMoment;
  }

  const forwardSeries = layersWithBackward.map((layer) => ({
    depth: layer.layerNumber,
    layerNumber: layer.layerNumber,
    fanIn: layer.fanIn,
    fanOut: layer.fanOut,
    gain: layer.forwardGain,
    scale: layer.activationSecondMoment,
    health: layer.forwardHealth,
  }));
  const finalForward = activationSecondMoment;
  const finalBackward = gradientSecondMoment;
  const forwardHealth = classifyScale(finalForward);
  const backwardHealth = classifyScale(finalBackward);
  const saturatedLayerCount = activation === 'tanh'
    ? layersWithBackward.filter((layer) => layer.derivativeSecondMoment < HEALTH_THRESHOLDS.tanhDerivativeSaturated).length
    : 0;

  return {
    method,
    activation,
    widths,
    layers: layersWithBackward,
    forwardSeries,
    backwardSeries,
    finalForward,
    finalBackward,
    forwardHealth,
    backwardHealth,
    healthAgreement: forwardHealth === backwardHealth,
    hiddenGradientFailure: forwardHealth === 'stable' && backwardHealth !== 'stable',
    saturatedLayerCount,
  };
}

export function compareInitializers({ activation, inputWidth, hiddenWidth, layers }) {
  return Object.keys(INITIALIZATION_METHODS).map((method) => analyzeInitialization({
    method,
    activation,
    inputWidth,
    hiddenWidth,
    layers,
  }));
}

export function symmetryStep({ input, target, hiddenWeight, outputWeight, learningRate, perturbation = 0 }) {
  [input, target, hiddenWeight, outputWeight, learningRate, perturbation].forEach((value, index) => {
    requireFinite(value, ['input', 'target', 'hiddenWeight', 'outputWeight', 'learningRate', 'perturbation'][index]);
  });
  if (learningRate <= 0) throw new RangeError('learningRate must be positive');

  const hiddenWeights = [hiddenWeight, hiddenWeight + perturbation];
  const outputWeights = [outputWeight, outputWeight];
  const hidden = hiddenWeights.map((weight) => Math.tanh(weight * input));
  const prediction = hidden.reduce((sum, value, index) => sum + (value * outputWeights[index]), 0);
  const error = prediction - target;
  const hiddenGradients = hidden.map((value, index) => error * outputWeights[index] * (1 - (value * value)) * input);
  const outputGradients = hidden.map((value) => error * value);
  const nextHiddenWeights = hiddenWeights.map((weight, index) => weight - (learningRate * hiddenGradients[index]));
  const nextOutputWeights = outputWeights.map((weight, index) => weight - (learningRate * outputGradients[index]));

  return {
    hiddenWeights,
    outputWeights,
    hidden,
    prediction,
    loss: 0.5 * error * error,
    hiddenGradients,
    outputGradients,
    nextHiddenWeights,
    nextOutputWeights,
    symmetryBrokenBefore: Math.abs(hiddenWeights[0] - hiddenWeights[1]) > 1e-12,
    symmetryBrokenAfter: Math.abs(nextHiddenWeights[0] - nextHiddenWeights[1]) > 1e-12,
  };
}

export function scaleToPercent(scale) {
  if (!Number.isFinite(scale) || scale < 0) return 100;
  if (scale === 0) return 4;
  const logScale = Math.log10(scale);
  return Math.min(100, Math.max(4, 50 + logScale * 24));
}
