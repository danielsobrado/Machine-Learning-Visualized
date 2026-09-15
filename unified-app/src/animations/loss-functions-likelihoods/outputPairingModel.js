import { bernoulliNllFromLogit, sigmoid } from './lossModel.js';
import { OUTPUT_PAIRING_TASKS } from './outputPairingConstants.js';

function requireLogits(logits) {
  if (!Array.isArray(logits) || logits.length === 0) throw new TypeError('logits must be non-empty');
  if (logits.some((value) => !Number.isFinite(value))) throw new TypeError('logits must be finite');
}

export function logSumExp(logits) {
  requireLogits(logits);
  const maximum = Math.max(...logits);
  return maximum + Math.log(logits.reduce((sum, value) => sum + Math.exp(value - maximum), 0));
}

export function softmaxFromLogits(logits) {
  requireLogits(logits);
  const normalizer = logSumExp(logits);
  return logits.map((value) => Math.exp(value - normalizer));
}

export function categoricalNllFromLogits(logits, targetIndex) {
  requireLogits(logits);
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= logits.length) {
    throw new RangeError('targetIndex must identify one logit');
  }
  return logSumExp(logits) - logits[targetIndex];
}

export function multilabelNllFromLogits(logits, targets) {
  requireLogits(logits);
  if (!Array.isArray(targets) || targets.length !== logits.length) {
    throw new TypeError('targets must match logits length');
  }
  return targets.reduce((sum, target, index) => sum + bernoulliNllFromLogit(target, logits[index]), 0);
}

export function buildOutputPairingState(taskId, logits) {
  requireLogits(logits);
  const task = OUTPUT_PAIRING_TASKS.find((item) => item.id === taskId);
  if (!task) throw new RangeError(`unsupported task: ${taskId}`);

  if (taskId === 'binary') {
    const logit = logits[0];
    const probability = sigmoid(logit);
    return {
      task,
      logits: [logit],
      probabilities: [probability],
      probabilitySum: probability,
      loss: bernoulliNllFromLogit(task.target[0], logit),
      contract: 'Pass the raw logit to a logits-aware BCE loss. Apply sigmoid for probability reporting or threshold decisions.',
      wrongPairing: 'Applying sigmoid first and then passing that probability to a loss that expects a raw logit changes the loss contract.',
    };
  }

  if (taskId === 'exclusive-multiclass') {
    const activeLogits = logits.slice(0, task.target.length);
    const probabilities = softmaxFromLogits(activeLogits);
    const targetIndex = task.target.findIndex((value) => value === 1);
    return {
      task,
      logits: activeLogits,
      probabilities,
      probabilitySum: probabilities.reduce((sum, value) => sum + value, 0),
      loss: categoricalNllFromLogits(activeLogits, targetIndex),
      contract: 'Pass competing class logits to a categorical cross-entropy-from-logits loss. Softmax probabilities are useful for interpretation.',
      wrongPairing: 'Independent sigmoid+BCE heads do not encode that exactly one class must be true.',
    };
  }

  const activeLogits = logits.slice(0, task.target.length);
  const probabilities = activeLogits.map(sigmoid);
  return {
    task,
    logits: activeLogits,
    probabilities,
    probabilitySum: probabilities.reduce((sum, value) => sum + value, 0),
    loss: multilabelNllFromLogits(activeLogits, task.target),
    contract: 'Pass independent logits to BCE-from-logits per label. Apply sigmoid independently when label probabilities are needed.',
    wrongPairing: 'One softmax would force independent labels to compete for a probability budget of one.',
  };
}
