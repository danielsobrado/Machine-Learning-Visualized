function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'gradient-descent',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const GRADIENT_DESCENT_P1_AUDITED_LESSON_IDS = Object.freeze(['gradient-descent']);

export const GRADIENT_DESCENT_P1_REQUIREMENTS = Object.freeze([
  competency('gd-learning-rate-overshoot', ['gd-008-large-lr'], ['gd-quadratic-step-worked']),
  competency('gd-saddle-vs-convergence', ['gd-040-saddle'], ['gd-saddle-gradient-small']),
  competency('gd-update-sign-correctness', ['gd-025-sign-error'], ['gd-wrong-sign-local-increase-worked']),
  competency('gd-gradient-reset-accumulation', ['gd-045-zero-grad'], ['gd-missing-zero-grad-accumulation-worked']),
  competency('gd-feature-scale-conditioning', ['gd-030-feature-scaling'], ['gd-feature-scaling-conditioning-diagnosis']),
]);
