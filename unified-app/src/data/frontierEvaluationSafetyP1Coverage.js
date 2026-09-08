function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'frontier-evaluation-safety',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const FRONTIER_EVALUATION_SAFETY_P1_AUDITED_LESSON_IDS = Object.freeze([
  'frontier-evaluation-safety',
]);

export const FRONTIER_EVALUATION_SAFETY_P1_REQUIREMENTS = Object.freeze([
  competency(
    'frontier-benchmark-generalization-release-gate',
    ['frontier-045', 'frontier-076'],
    ['frontier-release-evidence-decision'],
  ),
  competency(
    'frontier-safe-success-accounting',
    ['frontier-047', 'frontier-054'],
    ['frontier-safe-success-accounting-worked'],
  ),
  competency(
    'frontier-guardrail-precision-recall',
    ['frontier-009', 'frontier-067'],
    ['frontier-guardrail-precision-recall-worked'],
  ),
  competency(
    'frontier-repeated-trial-reliability',
    ['frontier-025', 'frontier-070'],
    ['frontier-repeated-trial-reliability-worked'],
  ),
  competency(
    'frontier-observed-action-safety',
    ['frontier-031', 'frontier-071'],
    ['frontier-injection-action-log-diagnosis'],
  ),
  competency(
    'frontier-oversight-sensitivity',
    ['frontier-042', 'frontier-065'],
    ['frontier-oversight-randomization-diagnosis'],
  ),
  competency(
    'frontier-staged-rollout-residual-risk',
    ['frontier-046', 'frontier-074'],
    ['frontier-staged-rollout-rare-risk-decision'],
  ),
]);
