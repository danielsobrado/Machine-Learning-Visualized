import {
  defineAssessmentCompetency,
  defineQuizCompetency,
  quizEvidence,
  scenarioEvidence,
} from './assessmentCompetencies.js';

export const PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS = Object.freeze([
  'model-debugging',
  'model-interpretability',
  'model-monitoring',
  'rag',
]);

export const PRODUCTION_ML_SYSTEMS_REQUIREMENTS = Object.freeze([
  defineQuizCompetency('debugging-localize-before-intervening', 'model-debugging', [
    'dbg-051-new-region-case',
    'dbg-073-two-signals-case',
    'dbg-076-trap-hyperparameter-first',
  ]),
  defineQuizCompetency('debugging-leakage-and-train-serve-parity', 'model-debugging', [
    'dbg-052-validation-too-good',
    'dbg-061-parity-test-case',
    'dbg-080-trap-serving',
  ]),
  defineQuizCompetency('interpretability-attribution-is-not-causality', 'model-interpretability', [
    'interp-054-correlation-case',
    'interp-072-causal-study-case',
    'interp-076-trap-causal-proof',
  ]),
  defineQuizCompetency('interpretability-scope-plausibility-and-stability', 'model-interpretability', [
    'interp-051-global-case',
    'interp-059-impossible-counterfactual',
    'interp-077-trap-global-local',
  ]),
  defineAssessmentCompetency({
    id: 'monitoring-drift-performance-and-label-delay',
    lessonId: 'model-monitoring',
    evidence: [
      quizEvidence('mon-051-covariate-case'),
      quizEvidence('mon-053-concept-case'),
      quizEvidence('mon-067-label-delay-case'),
      scenarioEvidence('monitoring-drift-types'),
    ],
  }),
  defineQuizCompetency('monitoring-slices-actions-and-recovery', 'model-monitoring', [
    'mon-062-slice-case',
    'mon-088-trap-rollback',
    'mon-099-interview-rollback',
  ]),
  defineQuizCompetency('rag-stage-localization-retrieval-vs-generation', 'rag', [
    'rag-056-missing-doc-case',
    'rag-063-irrel-case',
    'rag-064-grounding-case',
    'rag-087-wrong-eval',
  ]),
  defineQuizCompetency('rag-source-quality-access-and-grounding', 'rag', [
    'rag-061-stale-case',
    'rag-079-false-citation',
    'rag-083-false-access',
    'rag-088-dangerous-conflict',
  ]),
]);
