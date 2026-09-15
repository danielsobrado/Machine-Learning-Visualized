import { stableSoftmax } from './softmaxFailureModel.js';

function requireFiniteArray(values, name) {
  if (!Array.isArray(values) || values.length < 2 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain at least two finite values`);
  }
}

function requirePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

export function softmaxJacobian(logits, temperature = 1) {
  requireFiniteArray(logits, 'logits');
  requirePositive(temperature, 'temperature');
  const probabilities = stableSoftmax(logits, temperature);
  const matrix = probabilities.map((probability, row) => (
    probabilities.map((otherProbability, column) => {
      const identity = row === column ? 1 : 0;
      return (probability * (identity - otherProbability)) / temperature;
    })
  ));

  return { probabilities, matrix };
}

export function perturbSoftmaxLogit({ logits, selectedLogit, perturbation, temperature = 1 }) {
  requireFiniteArray(logits, 'logits');
  if (!Number.isInteger(selectedLogit) || selectedLogit < 0 || selectedLogit >= logits.length) {
    throw new RangeError('selectedLogit must reference a logit');
  }
  if (!Number.isFinite(perturbation)) throw new RangeError('perturbation must be finite');
  requirePositive(temperature, 'temperature');

  const jacobian = softmaxJacobian(logits, temperature);
  const perturbedLogits = logits.map((value, index) => (
    index === selectedLogit ? value + perturbation : value
  ));
  const after = stableSoftmax(perturbedLogits, temperature);
  const derivatives = jacobian.matrix.map((row) => row[selectedLogit]);
  const linearized = jacobian.probabilities.map((value, index) => (
    value + derivatives[index] * perturbation
  ));

  return {
    before: jacobian.probabilities,
    after,
    jacobian: jacobian.matrix,
    derivatives,
    linearized,
    perturbedLogits,
    derivativeSum: derivatives.reduce((sum, value) => sum + value, 0),
  };
}
