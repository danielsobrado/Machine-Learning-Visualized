function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const INFORMATION_THEORY_AUDITED_LESSON_IDS = Object.freeze([
  'softmax',
  'entropy',
  'cross-entropy',
]);

export const INFORMATION_THEORY_COVERAGE = Object.freeze({
  softmax: requirement(['softmax-stable-probabilities-worked']),
  entropy: requirement(['entropy-bernoulli-worked']),
  'cross-entropy': requirement(['cross-entropy-nll-worked']),
});

export const INFORMATION_THEORY_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('stable-softmax-probability-calculation', 'softmax', ['softmax-stable-probabilities-worked']),
  depthRequirement('entropy-uncertainty-calculation', 'entropy', ['entropy-bernoulli-worked']),
  depthRequirement('cross-entropy-probability-sensitivity-calculation', 'cross-entropy', ['cross-entropy-nll-worked']),
]);
