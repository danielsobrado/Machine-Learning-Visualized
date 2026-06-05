import { LINEAR_ALGEBRA_CODE_LABS } from '../algebra/linearAlgebraCodeLabs.js';
import { NEURAL_NETWORK_CODE_LABS } from '../neural-networks/neuralNetworkCodeLabs.js';
import { TRANSFORMER_CODE_LABS } from '../transformers/transformerCodeLabs.js';
import { LANGUAGE_MODEL_CODE_LABS } from '../language-models/languageModelCodeLabs.js';
import { RAG_CODE_LABS } from '../rag/ragCodeLabs.js';
import { EVALUATION_CODE_LABS } from '../evaluation/evaluationCodeLabs.js';
import { EXPERIMENTATION_CODE_LABS } from '../experimentation/experimentationCodeLabs.js';
import { NLP_CODE_LABS } from '../nlp/nlpCodeLabs.js';
import { CORE_ML_CODE_LABS } from '../core-ml/coreMlCodeLabs.js';
import { PROBABILITY_CODE_LABS } from '../probability/probabilityCodeLabs.js';
import { REINFORCEMENT_LEARNING_CODE_LABS } from '../reinforcement-learning/reinforcementLearningCodeLabs.js';
import { DIFFUSION_CODE_LABS } from '../diffusion/diffusionCodeLabs.js';
import { ALGORITHMS_CODE_LABS } from '../algorithms/algorithmsCodeLabs.js';
import { FRONTIER_LLM_CODE_LABS } from '../frontier-llms/frontierLlmCodeLabs.js';
import { filterExercisesByGroups } from './filterExercisesByGroups.js';

const SOURCES = {
  linear: LINEAR_ALGEBRA_CODE_LABS,
  nn: NEURAL_NETWORK_CODE_LABS,
  transformer: TRANSFORMER_CODE_LABS,
  lm: LANGUAGE_MODEL_CODE_LABS,
  rag: RAG_CODE_LABS,
  eval: EVALUATION_CODE_LABS,
  exp: EXPERIMENTATION_CODE_LABS,
  nlp: NLP_CODE_LABS,
  core: CORE_ML_CODE_LABS,
  prob: PROBABILITY_CODE_LABS,
  rl: REINFORCEMENT_LEARNING_CODE_LABS,
  diffusion: DIFFUSION_CODE_LABS,
  algo: ALGORITHMS_CODE_LABS,
  frontier: FRONTIER_LLM_CODE_LABS,
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
  'probability-distributions': { source: 'prob', groups: ['Bernoulli mean', 'PDF eval'] },
  'conditional-probability': { source: 'prob', groups: ['P(A|B) formula', 'Chain rule'] },
  'bayes-rule-ml': { source: 'prob', groups: ['Numerator', 'Posterior normalize'] },
  'maximum-likelihood-estimation': { source: 'prob', groups: ['Gaussian mean MLE', 'Per-sample log'] },
  'expected-value-variance': { source: 'prob', groups: ['Weighted sum', 'Variance formula'] },
  'spearman-correlation': { source: 'prob', groups: ['Rank with ties', 'Pearson on ranks'] },

  // Core ML
  'logistic-regression': { source: 'nn', groups: ['Logistic regression bridge'] },
  'classification-metrics': { source: 'eval', groups: ['Confusion matrix', 'Precision / recall / F1'] },
  'roc-pr-curves': { source: 'eval', groups: ['ROC / PR threshold sweeps', 'Cost-sensitive thresholding'] },
  'calibration': { source: 'eval', groups: ['Calibration bins', 'Expected calibration error'] },
  'regularization': { source: 'nn', groups: ['Regularization'] },
  'overfitting': { source: 'nn', groups: ['Regularization', 'Training loop mechanics'] },
  'bias-variance-tradeoff': { source: 'nn', groups: ['Regularization', 'Training loop mechanics'] },
  'train-validation-test-split': { source: 'core', groups: ['Shuffle', 'Train slice', 'No leakage check'] },
  'cross-validation': { source: 'core', groups: ['Fold size', 'Train/val masks'] },
  'data-leakage-deep-dive': { source: 'core', groups: ['Label in features', 'Preprocessing leak'] },
  'feature-scaling-preprocessing': { source: 'core', groups: ['Mean', 'Transform'] },
  'k-means': { source: 'core', groups: ['Distance to centroid', 'Assignment', 'Mean update'] },
  'knn-naive-bayes-svm': { source: 'core', groups: ['kNN vote', 'SVM hinge'] },
  'tree-ensembles': { source: 'core', groups: ['Gini', 'Bagging average'] },
  'time-series-forecasting-track': { source: 'core', groups: ['Window slice', 'One-step forecast'] },
  'data-engineering-for-ml-track': { source: 'core', groups: ['Median impute', 'Dedup key'] },

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
  'lstm': { source: 'nn', groups: ['Forget and input gates', 'Candidate cell', 'Cell state update', 'Output gate & hidden output'] },
  'conv2d': { source: 'nn', groups: ['Output size formula', 'One patch dot product'] },
  'max-pooling': { source: 'nn', groups: ['Window max'] },
  'conv-relu': { source: 'nn', groups: ['ReLU clip'] },
  'initialization': { source: 'nn', groups: ['He std'] },

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
  'rope': { source: 'transformer', groups: ['Rotate 2D block', 'Apply to head dimension'] },
  'transformer-architecture-families': { source: 'transformer', groups: ['FFN expansion ratio', 'Parameter estimate'] },
  'coconut-latent-reasoning': { source: 'transformer', groups: ['Latent residual add', 'Gate blend'] },
  'grouped-query-attention': { source: 'transformer', groups: ['KV head index', 'Repeat/broadcast rule'] },
  'kv-cache': { source: 'transformer', groups: ['Cache append', 'Sequence slicing', 'Cached cross-attention', 'Autoregressive generation step'] },
  'flash-attention': { source: 'transformer', groups: ['Row max update', 'Running sum'] },
  'spec-sparse-attention': {
    source: 'transformer',
    groups: [
      'Draft prefix length',
      'Criticality average',
      'Top-k block selection',
      'KV blocks skipped',
      'Effective KV rows read',
    ],
  },
  'turboquant': {
    source: 'transformer',
    groups: [
      'Cache memory formula',
      'Nearest codebook entry',
      'Dequant reconstruction',
      'Dot-product error',
      'Compression ratio',
    ],
  },
  'efficient-inference-compression-track': {
    source: 'transformer',
    groups: ['Shape guard', 'INT8 dot', 'Dequant fuse', 'Per-channel scale'],
  },
  'bert': { source: 'transformer', groups: ['80-10-10 masking rule', 'Bidirectional attention mask', 'MLM cross-entropy loss', 'BERT MLM step'] },
  'moe': {
    source: 'transformer',
    groups: ['Softmax gate', 'Top-k pick', 'Load per expert', 'Weighted combine'],
  },
  'fine-tuning': { source: 'transformer', groups: ['Alpha scaling', 'Effective delta add'] },
  'native-sparse-attention': {
    source: 'transformer',
    groups: ['Block grid', 'Top-k blocks', 'Mask scatter', 'Effective attention region'],
  },
  'recommender-systems-ranking-track': { source: 'eval', groups: ['Dot score', 'Pairwise hinge'] },
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
  'eagle-3-1-speculative-decoding': { source: 'lm', groups: ['Self-trust threshold', 'Token salvage'] },

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
  'word2vec': {
    source: 'nlp',
    groups: ['Similarity score', 'Sigmoid activation', 'Positive pair likelihood', 'Negative sample loss', 'Skip-gram gradient update'],
  },
  'glove': {
    source: 'nlp',
    groups: ['Co-occurrence weight', 'Dot-plus-bias prediction', 'Full scalar loss'],
  },
  'fasttext': {
    source: 'nlp',
    groups: ['Character n-gram enumerate', 'Hash bucket', 'Subword vector sum'],
  },

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
  'vae': { source: 'nn', groups: ['KL closed form'] },
  'multimodal-llm': { source: 'nn', groups: ['Linear project'] },

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

  // Algorithms
  'bloom-filter': { source: 'algo', groups: ['Hash positions', 'Query all bits'] },
  'pagerank': { source: 'algo', groups: ['Out-link normalize', 'Damping teleport'] },

  // Diffusion Models
  'diffusion-basics': {
    source: 'diffusion',
    groups: ['Noise scale', 'Alpha bar', 'Forward sample', 'Signal-to-noise ratio'],
  },
  'diffusion-sampling': { source: 'diffusion', groups: ['Beta scheduling', 'Forward noise scheduler', 'Posterior mean estimation', 'Denoised reverse step'] },
  'classifier-free-guidance': { source: 'diffusion', groups: ['scale mix'] },
  'unet-vs-dit': { source: 'diffusion', groups: ['skip concat', 'patch tokens'] },
  'sd3-overview': { source: 'diffusion', groups: ['VAE downscale'] },
  'flow-matching': { source: 'diffusion', groups: ['linear interp'] },
  'diffusion-vae': { source: 'diffusion', groups: ['encode scale'] },
  'tokenizer-bpe': { source: 'diffusion', groups: ['pair count', 'merge rule'] },
  'clip-encoder': { source: 'diffusion', groups: ['L2 normalize'] },
  't5-encoder': { source: 'diffusion', groups: ['pad mask'] },
  'joint-attention': { source: 'diffusion', groups: ['Concat Q'] },
  'dit': { source: 'diffusion', groups: ['Time embed inject', 'adaLN scale/shift', 'Self-attn residual', 'MLP residual'] },

  // Frontier LLMs & Evaluation Safety
  'frontier-llm-architecture-overview': { source: 'frontier', groups: ['Weight bytes', 'KV bytes'] },
  'frontier-moe-systems': { source: 'frontier', groups: ['Active fraction'] },
  'multi-head-latent-attention': { source: 'frontier', groups: ['Cache size ratio'] },
  'reasoning-rlvr-grpo': { source: 'frontier', groups: ['Relative advantage'] },
  'test-time-compute-thinking-budgets': { source: 'frontier', groups: ['Budget split'] },
  'long-context-frontier-models': { source: 'frontier', groups: ['Linear seq scaling'] },
  'omni-multimodal-architectures': { source: 'frontier', groups: ['Weighted fuse'] },
  'diffusion-language-models': { source: 'frontier', groups: ['Mask ratio'] },
  'efficient-llm-serving': { source: 'frontier', groups: ['Continuous batching'] },
  'frontier-evaluation-safety': { source: 'eval', groups: ['Pass@k'] },
  'tool-using-reasoning-models': { source: 'frontier', groups: ['Tool call parser', 'Action dispatcher', 'History integration', 'Agent execution loop'] },
  'agentic-coding-systems': { source: 'frontier', groups: ['Hunk apply'] },

  // Reinforcement learning
  'rl-foundations': { source: 'rl', groups: ['One-step return', 'Discount chain'] },
  'mdp-formalism': { source: 'rl', groups: ['Transition sum', 'Gamma discount'] },
  'value-iteration': { source: 'rl', groups: ['Max over actions', 'Backup once'] },
  'policy-iteration': { source: 'rl', groups: ['Eval backup', 'Greedy improve'] },
  'q-learning': { source: 'rl', groups: ['Epsilon-greedy selection', 'Terminal-aware TD target', 'Tabular Q-update', 'Complete agent step'] },
  'rl-exploration': { source: 'rl', groups: ['Epsilon mix', 'UCB formula'] },
  'policy-gradients': { source: 'rl', groups: ['Baseline subtract', 'Return multiply'] },
  'actor-critic': { source: 'rl', groups: ['TD error', 'Actor log grad'] },
  'reward-shaping': { source: 'rl', groups: ['Potential phi', 'Total step reward'] },
  'grpo-reasoning': { source: 'rl', groups: ['Group mean', 'Relative reward'] },
  'dapo-reasoning-rl': { source: 'rl', groups: ['Reward clip', 'Decoupled baseline'] },
  'markov-chains': { source: 'rl', groups: ['One-step multiply', 'Stationary'] },

  // Model reliability
  'model-monitoring': { source: 'eval', groups: ['Drift checks'] },
  'model-debugging': { source: 'transformer', groups: ['Transformer debugging checks'] },
  'model-interpretability': { source: 'eval', groups: ['Marginal contrib', 'Sum to delta'] },
  'model-fairness': { source: 'eval', groups: ['Group rate', 'Parity gap'] },
  'uncertainty-estimation': { source: 'eval', groups: ['Predictive entropy', 'Variance across samples'] },
  'ml-security-robustness-track': { source: 'eval', groups: ['Gradient sign step', 'Perturbation clip'] },
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
