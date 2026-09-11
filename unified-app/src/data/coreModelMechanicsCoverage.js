import { defineQuizCompetency } from './assessmentCompetencies.js';

export const CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS = Object.freeze([
  'softmax',
  'cross-entropy',
  'optimization',
  'lstm',
  'vae',
]);

export const CORE_MODEL_MECHANICS_REQUIREMENTS = Object.freeze([
  defineQuizCompetency('softmax-numerical-stability-and-shift-invariance', 'softmax', [
    'softmax-053',
    'softmax-054',
    'softmax-083',
  ]),
  defineQuizCompetency('softmax-confidence-and-output-semantics', 'softmax', [
    'softmax-055',
    'softmax-059',
    'softmax-079',
  ]),
  defineQuizCompetency('cross-entropy-probability-quality-and-calibration', 'cross-entropy', [
    'ce-052-overconfident-wrong',
    'ce-062-calibration',
    'ce-083-calibration-trap',
  ]),
  defineQuizCompetency('cross-entropy-task-and-api-contract', 'cross-entropy', [
    'ce-058-multilabel-case',
    'ce-060-logits-input-error',
    'ce-063-thresholding',
  ]),
  defineQuizCompetency('optimization-nonconvexity-and-fair-comparison', 'optimization', [
    'opt-054-adam-case',
    'opt-072-nonconvex-case',
    'opt-073-compare-optimizers-case',
  ]),
  defineQuizCompetency('optimization-state-and-decoupled-regularization', 'optimization', [
    'opt-056-adamw-case',
    'opt-062-bias-correction-case',
    'opt-080-trap-weight-decay',
  ]),
  defineQuizCompetency('lstm-state-boundaries-and-causality', 'lstm', [
    'lstm-057-state-leak-case',
    'lstm-059-bidirectional-case',
    'lstm-085-trap-stateful',
  ]),
  defineQuizCompetency('lstm-memory-and-gradient-limits', 'lstm', [
    'lstm-060-truncation-case',
    'lstm-082-trap-gradient',
    'lstm-095-interview-gradients',
  ]),
  defineQuizCompetency('vae-prior-regularization-and-posterior-collapse', 'vae', [
    'vae-055-debug-holes',
    'vae-057-debug-collapse',
    'vae-084-misleading-collapse',
  ]),
  defineQuizCompetency('vae-objective-and-reparameterization-tradeoffs', 'vae', [
    'vae-056-debug-blur',
    'vae-081-misleading-reparam',
    'vae-093-interview-elbo',
  ]),
]);
