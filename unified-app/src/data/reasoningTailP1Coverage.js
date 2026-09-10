function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const REASONING_TAIL_P1_AUDITED_LESSON_IDS = Object.freeze([
  'coconut-latent-reasoning',
  'bloom-filter',
  'reasoning-rlvr-grpo',
  'test-time-compute-thinking-budgets',
]);

export const REASONING_TAIL_P1_REQUIREMENTS = Object.freeze([
  competency(
    'coconut-latent-feedback-compute-contract',
    'coconut-latent-reasoning',
    ['coconut-021', 'coconut-023'],
    ['coconut-latent-feedback-path-diagnosis', 'coconut-visible-vs-compute-worked'],
  ),
  competency(
    'coconut-curriculum-faithfulness-auditability',
    'coconut-latent-reasoning',
    ['coconut-030', 'coconut-037', 'coconut-039', 'coconut-040'],
    ['coconut-curriculum-loss-mask-diagnosis', 'coconut-probe-vs-causal-faithfulness-diagnosis', 'coconut-shortcut-latent-dependence-diagnosis', 'coconut-auditability-deployment-decision'],
  ),
  competency(
    'bloom-fpr-sizing-hash-operating-point',
    'bloom-filter',
    ['bf-027', 'bf-028', 'bf-031', 'bf-032', 'bf-044'],
    ['bloom-fpr-worked', 'bloom-optimal-k-worked', 'bloom-capacity-sizing-worked', 'bloom-capacity-drift-diagnosis'],
  ),
  competency(
    'bloom-one-sided-authority-deletion-compatibility',
    'bloom-filter',
    ['bf-025', 'bf-041', 'bf-045', 'bf-048'],
    ['bloom-positive-authority-decision', 'bloom-counting-delete-decision', 'bloom-seed-mismatch-diagnosis'],
  ),
  competency(
    'rlvr-group-relative-vs-absolute-success',
    'reasoning-rlvr-grpo',
    ['rlvr-grpo-031', 'rlvr-grpo-032', 'rlvr-grpo-034', 'rlvr-grpo-039'],
    ['rlvr-grpo-normalized-advantage-worked', 'rlvr-all-negative-relative-trap-diagnosis', 'rlvr-rollout-contrast-health-diagnosis'],
  ),
  competency(
    'rlvr-verifier-process-kl-curation-guardrails',
    'reasoning-rlvr-grpo',
    ['rlvr-grpo-028', 'rlvr-grpo-041', 'rlvr-grpo-042', 'rlvr-grpo-045'],
    ['rlvr-verifier-generalization-decision', 'rlvr-orm-canceling-errors-diagnosis', 'rlvr-kl-drift-health-decision', 'rlvr-rejection-sampling-curation-decision'],
  ),
  competency(
    'ttc-adaptive-budget-cost-quality-routing',
    'test-time-compute-thinking-budgets',
    ['ttc-010', 'ttc-030', 'ttc-031', 'ttc-041', 'ttc-046'],
    ['ttc-adaptive-budget-slo-worked'],
  ),
  competency(
    'ttc-verifier-guided-search-failure',
    'test-time-compute-thinking-budgets',
    ['ttc-023', 'ttc-026', 'ttc-027', 'ttc-047'],
    ['ttc-best-of-n-verifier-selection-trap', 'ttc-tree-search-prm-pruning-failure'],
  ),
]);
