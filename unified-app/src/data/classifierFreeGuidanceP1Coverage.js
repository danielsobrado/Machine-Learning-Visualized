function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const CLASSIFIER_FREE_GUIDANCE_P1_AUDITED_LESSON_IDS = Object.freeze([
  'classifier-free-guidance',
]);

export const CLASSIFIER_FREE_GUIDANCE_P1_REQUIREMENTS = Object.freeze([
  competency(
    'cfg-guidance-equation-combination',
    'classifier-free-guidance',
    ['cfg-021-equation', 'cfg-025-scale-large'],
    ['cfg-guidance-combination-worked'],
  ),
  competency(
    'cfg-conditioning-dropout-training-contract',
    'classifier-free-guidance',
    ['cfg-014-training-drop', 'cfg-027-dropout-conditioning'],
    ['cfg-conditioning-dropout-training-contract'],
  ),
  competency(
    'cfg-scale-quality-operating-point',
    'classifier-free-guidance',
    ['cfg-009-high-scale', 'cfg-011-moderate-scale', 'cfg-047-eval'],
    ['cfg-scale-quality-operating-point'],
  ),
  competency(
    'cfg-guidance-overshoot-rescaling',
    'classifier-free-guidance',
    ['cfg-033-norm', 'cfg-034-rescale', 'cfg-049-failure-path'],
    ['cfg-overshoot-rescale-diagnosis'],
  ),
  competency(
    'cfg-sampler-step-schedule-interaction',
    'classifier-free-guidance',
    ['cfg-045-sampler-interaction', 'cfg-046-step-count'],
    ['cfg-sampler-step-interaction-debugging'],
  ),
  competency(
    'cfg-negative-unconditional-baseline-semantics',
    'classifier-free-guidance',
    ['cfg-035-negative-prompt', 'cfg-036-unconditional-choice', 'cfg-043-null-text'],
    ['cfg-negative-baseline-semantics'],
  ),
]);
