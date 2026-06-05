import { LINEAR_ALGEBRA_CODE_LABS } from '../algebra/linearAlgebraCodeLabs.js';
import { NEURAL_NETWORK_CODE_LABS } from '../neural-networks/neuralNetworkCodeLabs.js';
import { TRANSFORMER_CODE_LABS } from '../transformers/transformerCodeLabs.js';
import { LANGUAGE_MODEL_CODE_LABS } from '../language-models/languageModelCodeLabs.js';
import { RAG_CODE_LABS } from '../rag/ragCodeLabs.js';
import { EVALUATION_CODE_LABS } from '../evaluation/evaluationCodeLabs.js';
import { EXPERIMENTATION_CODE_LABS } from '../experimentation/experimentationCodeLabs.js';
import { filterExercisesByGroups } from './filterExercisesByGroups.js';

const SOURCES = {
  linear: LINEAR_ALGEBRA_CODE_LABS,
  nn: NEURAL_NETWORK_CODE_LABS,
  transformer: TRANSFORMER_CODE_LABS,
  lm: LANGUAGE_MODEL_CODE_LABS,
  rag: RAG_CODE_LABS,
  eval: EVALUATION_CODE_LABS,
  exp: EXPERIMENTATION_CODE_LABS,
};

/** Lessons with hand-authored exercises in category files (skip auto-mapping). */
export const CUSTOM_LESSON_CODE_LABS = new Set([
  'optimizers',
  'ppo-clipped-policy-gradient',
]);

/**
 * lessonId -> { source, groups }
 * Unlisted lessons intentionally have no page-level code lab until real exercises exist.
 */
export const LESSON_GROUP_MAPPINGS = {
  // Math fundamentals
  'matrix-multiplication': {
    source: 'linear',
    groups: ['Dot product', 'Matrix cell', 'Matrix multiplication', 'Shape compatibility'],
  },
  'matrix-decompositions': {
    source: 'linear',
    groups: ['Transpose', 'Identity matrix', 'Shape compatibility'],
  },
  'fundamental-subspaces': {
    source: 'linear',
    groups: ['Projection', 'Orthogonality', 'Matrix-vector multiplication'],
  },
  'least-squares-projection': {
    source: 'linear',
    groups: [
      'Least-squares residual',
      'Orthogonality',
      'Projection matrix',
      'Normal equations',
      'Least-squares line fit',
    ],
  },
  'pseudoinverse': { source: 'linear', groups: ['Pseudoinverse bridge'] },
  'change-of-basis': { source: 'linear', groups: ['Change of basis'] },
  'condition-number': { source: 'linear', groups: ['Numerical stability'] },
  'determinant-volume': { source: 'linear', groups: ['Determinant and invertibility'] },
  'projection-matrices': { source: 'linear', groups: ['Projection matrix', 'Projection'] },
  'low-rank-approximation': { source: 'linear', groups: ['Low-rank approximation'] },
  'pca': { source: 'linear', groups: ['Centering and covariance', 'PCA bridge'] },
  'eigenvalue': { source: 'linear', groups: ['Eigenvalues'] },
  'svd': { source: 'linear', groups: ['Low-rank approximation', 'Pseudoinverse bridge', 'Eigenvalues'] },
  'qr-decomposition': { source: 'linear', groups: ['Orthonormal bases', 'QR bridge'] },
  'gradient-descent': [
    { source: 'nn', groups: ['Derivative basics'] },
    { source: 'nn', groups: ['Gradient descent least squares'] },
  ],
  'optimization': [
    { source: 'linear', groups: ['Derivative basics', 'Chain rule'] },
    { source: 'nn', groups: ['Optimizer updates'] },
  ],
  'linear-regression': [
    { source: 'linear', groups: ['Least-squares line fit', 'Gradient descent least squares'] },
    { source: 'nn', groups: ['Training loop mechanics'] },
  ],

  // Probability & stats
  'cosine-similarity': { source: 'linear', groups: ['Cosine similarity'] },
  'cross-entropy': [
    { source: 'nn', groups: ['Softmax cross-entropy'] },
    { source: 'lm', groups: ['Cross-entropy over sequence positions'] },
  ],
  'entropy': { source: 'lm', groups: ['Cross-entropy over sequence positions'] },
  'loss-functions-likelihoods': [
    { source: 'nn', groups: ['Softmax cross-entropy'] },
    { source: 'lm', groups: ['Cross-entropy over sequence positions', 'Tiny language-model loss'] },
  ],
  'sampling-confidence-intervals': {
    source: 'exp',
    groups: ['Standard error and confidence intervals'],
  },
  'hypothesis-testing-intuition': { source: 'exp', groups: ['A/B test z-statistic'] },

  // Core ML
  'logistic-regression': { source: 'nn', groups: ['Logistic regression bridge'] },
  'classification-metrics': { source: 'eval', groups: ['Confusion matrix', 'Precision / recall / F1'] },
  'roc-pr-curves': { source: 'eval', groups: ['ROC / PR threshold sweeps', 'Cost-sensitive thresholding'] },
  'calibration': { source: 'eval', groups: ['Calibration bins', 'Expected calibration error'] },
  'regularization': { source: 'nn', groups: ['Regularization'] },
  'overfitting': { source: 'nn', groups: ['Regularization', 'Training loop mechanics'] },
  'bias-variance-tradeoff': { source: 'nn', groups: ['Regularization', 'Training loop mechanics'] },

  // Neural networks
  'relu': { source: 'nn', groups: ['One neuron', 'Activation gradients'] },
  'leaky-relu': { source: 'nn', groups: ['Activation gradients'] },
  'softmax': { source: 'nn', groups: ['Softmax cross-entropy', 'Attention algebra bridge'] },
  'neural-network': { source: 'nn', groups: ['One neuron', 'Mini neural network layer', 'Batch matrix shapes'] },
  'computation-graph-backprop': {
    source: 'nn',
    groups: ['Chain rule', 'One-neuron backprop', 'Activation gradients', 'Matrix multiplication backprop'],
  },
  'training-loop-dynamics': { source: 'nn', groups: ['Training loop mechanics'] },
  'dropout-batchnorm': { source: 'nn', groups: ['Regularization'] },
  'gradient-problems': { source: 'nn', groups: ['Activation gradients', 'Derivative basics'] },
  'layer-normalization': { source: 'transformer', groups: ['LayerNorm and RMSNorm'] },

  // Transformers
  'attention-mechanism': [
    { source: 'nn', groups: ['Attention algebra bridge'] },
    { source: 'transformer', groups: ['Mini self-attention'] },
  ],
  'self-attention': { source: 'transformer', groups: ['Mini self-attention'] },
  'attention-masks': { source: 'transformer', groups: ['Transformer mini-block shapes', 'Mini self-attention'] },
  'positional-encoding': { source: 'transformer', groups: ['Transformer mini-block shapes'] },
  'transformer': {
    source: 'transformer',
    groups: [
      'Transformer mini-block shapes',
      'Mini self-attention',
      'LayerNorm and RMSNorm',
      'Residual stream mechanics',
      'MLP and SwiGLU',
      'Tiny transformer block',
      'Transformer debugging checks',
    ],
  },
  'residual-stream': { source: 'transformer', groups: ['Residual stream mechanics', 'Tiny transformer block'] },
  'llm-training-objectives': {
    source: 'lm',
    groups: [
      'Teacher forcing',
      'Causal label shifting',
      'Cross-entropy over sequence positions',
      'Tiny language-model loss',
    ],
  },
  'transformer-token-generation': {
    source: 'lm',
    groups: ['Mini vocabulary and logits', 'Sampling from logits'],
  },
  'sampling-strategies': {
    source: 'lm',
    groups: ['Sampling from logits', 'Temperature and top-k / top-p'],
  },
  'gpt2-comprehensive': {
    source: 'lm',
    groups: [
      'Mini vocabulary and logits',
      'Cross-entropy over sequence positions',
      'Tiny language-model loss',
      'Teacher forcing',
      'Causal label shifting',
      'Mini token training step',
      'Sampling from logits',
      'Temperature and top-k / top-p',
    ],
  },

  // NLP
  'bag-of-words': { source: 'rag', groups: ['Bag-of-words vectors'] },
  'tokenization': [
    { source: 'rag', groups: ['Token counts and chunking'] },
    { source: 'lm', groups: ['Mini vocabulary and logits'] },
  ],
  'embeddings': [
    { source: 'transformer', groups: ['Transformer mini-block shapes'] },
    { source: 'lm', groups: ['Mini vocabulary and logits'] },
  ],

  // Advanced models / RAG
  'rag': {
    source: 'rag',
    groups: [
      'Token counts and chunking',
      'Bag-of-words vectors',
      'Cosine retrieval',
      'Retrieval metrics',
      'Reranking and grounding checks',
      'Prompt packing / context budget',
    ],
  },
  'rag-chunking-context': { source: 'rag', groups: ['Token counts and chunking', 'Prompt packing / context budget'] },
  'rag-vector-indexing': { source: 'rag', groups: ['Cosine retrieval'] },
  'rag-reranking-grounding': { source: 'rag', groups: ['Reranking and grounding checks'] },
  'rag-retrieval-evaluation': { source: 'rag', groups: ['Retrieval metrics'] },
  'rag-failure-modes': { source: 'rag', groups: ['Reranking and grounding checks', 'Retrieval metrics'] },

  // Experimentation & causal ML
  'ab-testing-foundations': {
    source: 'exp',
    groups: ['Treatment/control split', 'Difference in means', 'A/B test z-statistic'],
  },
  'power-sample-size': { source: 'exp', groups: ['Power and MDE intuition'] },
  'cuped-variance-reduction': { source: 'exp', groups: ['CUPED adjustment'] },
  'causal-graphs-dags': { source: 'exp', groups: ['DAG adjustment-set checks'] },
  'treatment-effects': { source: 'exp', groups: ['Difference in means'] },
  'propensity-scores': { source: 'exp', groups: ['Propensity score weighting'] },
  'sequential-testing-peeking': { source: 'exp', groups: ['A/B test z-statistic'] },
  'confounding-simpsons-paradox': { source: 'exp', groups: ['DAG adjustment-set checks'] },

  // Model reliability
  'model-monitoring': { source: 'eval', groups: ['Drift checks'] },
  'model-debugging': { source: 'transformer', groups: ['Transformer debugging checks'] },
};

function resolveMapping(mapping) {
  const parts = Array.isArray(mapping) ? mapping : [mapping];
  const exercises = [];

  for (const part of parts) {
    const pool = SOURCES[part.source];
    exercises.push(...filterExercisesByGroups(pool, part.groups));
  }

  return exercises;
}

export function getMappedLessonExercises(lessonId) {
  if (CUSTOM_LESSON_CODE_LABS.has(lessonId)) return null;

  const mapping = LESSON_GROUP_MAPPINGS[lessonId];
  if (!mapping) return null;

  const exercises = resolveMapping(mapping);
  return exercises.length > 0 ? exercises : null;
}

export function hasRealLessonCodeLab(lessonId) {
  return CUSTOM_LESSON_CODE_LABS.has(lessonId) || Boolean(getMappedLessonExercises(lessonId));
}
