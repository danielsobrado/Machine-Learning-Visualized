function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const PROBABILITY_REASONING_AUDITED_LESSON_IDS = Object.freeze([
  'expected-value-variance',
  'conditional-probability',
]);

export const PROBABILITY_REASONING_COVERAGE = Object.freeze({
  'expected-value-variance': requirement([
    'expected-value-payoff-calculation',
    'variance-risk-worked',
  ]),
  'conditional-probability': requirement([
    'conditional-probability-counts-worked',
    'independence-product-rule-worked',
  ]),
});

export const PROBABILITY_REASONING_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('expected-value-from-discrete-outcomes', 'expected-value-variance', ['expected-value-payoff-calculation']),
  depthRequirement('variance-and-operational-risk', 'expected-value-variance', ['variance-risk-worked']),
  depthRequirement('conditional-probability-from-counts', 'conditional-probability', ['conditional-probability-counts-worked']),
  depthRequirement('independence-from-joint-factorization', 'conditional-probability', ['independence-product-rule-worked']),
]);
