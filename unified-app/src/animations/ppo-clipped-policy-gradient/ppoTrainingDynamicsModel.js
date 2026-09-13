import {
  actionProbability,
  bernoulliKl,
  clippedSurrogate,
  policyRatio,
  sigmoid,
} from './ppoModel.js';

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

export function ppoLogitGradient({ oldLogit, newLogit, action, advantage, epsilon }) {
  [oldLogit, newLogit, advantage, epsilon].forEach((value, index) => requireFinite(value, ['oldLogit', 'newLogit', 'advantage', 'epsilon'][index]));
  if (![0, 1].includes(action)) throw new RangeError('action must be 0 or 1');

  const { oldProbability, ratio } = policyRatio({ oldLogit, newLogit, action });
  const surrogate = clippedSurrogate({ ratio, advantage, epsilon });
  if (surrogate.clippingActive) return 0;

  const p = sigmoid(newLogit);
  const probabilityDerivative = action === 1 ? p * (1 - p) : -p * (1 - p);
  return advantage * probabilityDerivative / oldProbability;
}

export function repeatedEpochTrace({
  oldLogit,
  action,
  advantage,
  epsilon,
  learningRate,
  epochs,
}) {
  [oldLogit, advantage, epsilon, learningRate].forEach((value, index) => requireFinite(value, ['oldLogit', 'advantage', 'epsilon', 'learningRate'][index]));
  if (![0, 1].includes(action)) throw new RangeError('action must be 0 or 1');
  if (learningRate <= 0) throw new RangeError('learningRate must be positive');
  if (!Number.isInteger(epochs) || epochs < 1) throw new RangeError('epochs must be a positive integer');

  let newLogit = oldLogit;
  const rows = [];

  for (let epoch = 0; epoch <= epochs; epoch += 1) {
    const probabilities = policyRatio({ oldLogit, newLogit, action });
    const surrogate = clippedSurrogate({ ratio: probabilities.ratio, advantage, epsilon });
    const gradient = ppoLogitGradient({ oldLogit, newLogit, action, advantage, epsilon });
    rows.push({
      epoch,
      newLogit,
      newPolicyProbability: sigmoid(newLogit),
      sampledActionProbability: actionProbability(newLogit, action),
      ratio: probabilities.ratio,
      objective: surrogate.objective,
      clippingActive: surrogate.clippingActive,
      kl: bernoulliKl(oldLogit, newLogit),
      gradient,
    });
    if (epoch === epochs) break;
    newLogit += learningRate * gradient;
  }

  const last = rows.at(-1);
  return {
    rows,
    finalKl: last.kl,
    finalRatio: last.ratio,
    clippedEpochs: rows.filter((row) => row.clippingActive).length,
    oldPolicyProbability: sigmoid(oldLogit),
  };
}
