function requireFiniteVector(values, name) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a non-empty finite vector`);
  }
}

function requirePositiveVector(values, name) {
  requireFiniteVector(values, name);
  if (values.some((value) => value <= 0)) throw new RangeError(`${name} must contain positive values`);
}

function requirePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

function validateConfig({ parameters, dataGradient, adaptiveRms, learningRate, weightDecay, epsilon }) {
  requireFiniteVector(parameters, 'parameters');
  requireFiniteVector(dataGradient, 'dataGradient');
  requirePositiveVector(adaptiveRms, 'adaptiveRms');
  requirePositive(learningRate, 'learningRate');
  requirePositive(weightDecay, 'weightDecay');
  requirePositive(epsilon, 'epsilon');
  if (parameters.length !== dataGradient.length || parameters.length !== adaptiveRms.length) {
    throw new RangeError('parameter, gradient, and adaptive RMS vectors must have equal length');
  }
}

export function adaptiveL2Step(config) {
  validateConfig(config);
  const {
    parameters,
    dataGradient,
    adaptiveRms,
    learningRate,
    weightDecay,
    epsilon,
  } = config;
  const regularizationGradient = parameters.map((value) => weightDecay * value);
  const combinedGradient = dataGradient.map((value, index) => value + regularizationGradient[index]);
  const update = combinedGradient.map((value, index) => (
    -learningRate * value / (adaptiveRms[index] + epsilon)
  ));
  const nextParameters = parameters.map((value, index) => value + update[index]);

  return {
    regularizationGradient,
    combinedGradient,
    update,
    nextParameters,
  };
}

export function decoupledWeightDecayStep(config) {
  validateConfig(config);
  const {
    parameters,
    dataGradient,
    adaptiveRms,
    learningRate,
    weightDecay,
    epsilon,
  } = config;
  const adaptiveDataUpdate = dataGradient.map((value, index) => (
    -learningRate * value / (adaptiveRms[index] + epsilon)
  ));
  const decayUpdate = parameters.map((value) => -learningRate * weightDecay * value);
  const update = adaptiveDataUpdate.map((value, index) => value + decayUpdate[index]);
  const nextParameters = parameters.map((value, index) => value + update[index]);

  return {
    adaptiveDataUpdate,
    decayUpdate,
    update,
    nextParameters,
  };
}

export function compareWeightDecay(config) {
  const l2 = adaptiveL2Step(config);
  const adamw = decoupledWeightDecayStep(config);
  const l2Shrink = config.parameters.map((value, index) => value - l2.nextParameters[index]);
  const adamwShrink = config.parameters.map((value, index) => value - adamw.nextParameters[index]);

  return {
    l2,
    adamw,
    l2Shrink,
    adamwShrink,
  };
}
