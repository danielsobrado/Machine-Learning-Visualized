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
  'probability-distributions': { source: 'prob', groups: ['Distribution eval'] },
  'conditional-probability': { source: 'prob', groups: ['Conditional probability chain'] },
  'bayes-rule-ml': { source: 'prob', groups: ['Bayes posterior'] },
  'maximum-likelihood-estimation': { source: 'prob', groups: ['MLE log-likelihood'] },
  'expected-value-variance': { source: 'prob', groups: ['Moments from PMF'] },
  'spearman-correlation': { source: 'prob', groups: ['Spearman correlation'] },

  // Core ML
  'logistic-regression': { source: 'nn', groups: ['Logistic regression bridge'] },
  'classification-metrics': { source: 'eval', groups: ['Confusion matrix', 'Precision / recall / F1'] },
  'roc-pr-curves': { source: 'eval', groups: ['ROC / PR threshold sweeps', 'Cost-sensitive thresholding'] },
  'calibration': { source: 'eval', groups: ['Calibration bins', 'Expected calibration error'] },
  'regularization': { source: 'nn', groups: ['Regularization'] },
  'overfitting': { source: 'nn', groups: ['Regularization', 'Training loop mechanics'] },
  'bias-variance-tradeoff': { source: 'nn', groups: ['Regularization', 'Training loop mechanics'] },
  'train-validation-test-split': { source: 'core', groups: ['Dataset split pipeline'] },
  'cross-validation': { source: 'core', groups: ['K-fold split'] },
  'data-leakage-deep-dive': { source: 'core', groups: ['Leak-safe scaling'] },
  'feature-scaling-preprocessing': { source: 'core', groups: ['Feature scaling pipeline'] },
  'k-means': { source: 'core', groups: ['K-means iteration'] },
  'knn-naive-bayes-svm': { source: 'core', groups: ['kNN predict'] },
  'tree-ensembles': { source: 'core', groups: ['Ensemble predict'] },
  'time-series-forecasting-track': { source: 'core', groups: ['Forecast smooth'] },
  'data-engineering-for-ml-track': { source: 'core', groups: ['Pipeline clean'] },

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
  'conv2d': { source: 'nn', groups: ['Conv2D step'] },
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
  'rope': { source: 'transformer', groups: ['RoPE pair rotation'] },
  'transformer-architecture-families': { source: 'transformer', groups: ['Block parameter estimate'] },
  'coconut-latent-reasoning': { source: 'transformer', groups: ['Latent thought step'] },
  'grouped-query-attention': { source: 'transformer', groups: ['KV head expansion'] },
  'kv-cache': { source: 'transformer', groups: ['Cache append', 'Sequence slicing', 'Cached cross-attention', 'Autoregressive generation step'] },
  'flash-attention': { source: 'transformer', groups: ['Online softmax block'] },
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
  'fine-tuning': { source: 'transformer', groups: ['LoRA forward step'] },
  'native-sparse-attention': {
    source: 'transformer',
    groups: ['Block grid', 'Top-k blocks', 'Mask scatter', 'Effective attention region'],
  },
  'recommender-systems-ranking-track': { source: 'eval', groups: ['Ranking training step'] },
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
  'eagle-3-1-speculative-decoding': { source: 'lm', groups: ['EAGLE verify step'] },

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
  'glove': { source: 'nlp', groups: ['GloVe pair loss'] },
  'fasttext': { source: 'nlp', groups: ['FastText word vector'] },

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
  'vae': {
    source: 'nn',
    groups: ['Reparameterize z', 'Reconstruction MSE', 'KL closed form', 'Combined ELBO', 'Latent edge cases'],
  },
  'multimodal-llm': { source: 'nn', groups: ['Multimodal projection'] },

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
  'bloom-filter': { source: 'algo', groups: ['Bloom filter step'] },
  'pagerank': { source: 'algo', groups: ['PageRank iteration'] },

  // Diffusion Models
  'diffusion-basics': {
    source: 'diffusion',
    groups: ['Noise scale', 'Alpha bar', 'Forward sample', 'Signal-to-noise ratio'],
  },
  'diffusion-sampling': { source: 'diffusion', groups: ['Beta scheduling', 'Forward noise scheduler', 'Posterior mean estimation', 'Denoised reverse step'] },
  'classifier-free-guidance': {
    source: 'diffusion',
    groups: ['Uncond branch', 'Cond branch', 'Scale mix', 'Zero-scale identity'],
  },
  'unet-vs-dit': { source: 'diffusion', groups: ['U-Net vs DiT step'] },
  'sd3-overview': { source: 'diffusion', groups: ['VAE downscale'] },
  'flow-matching': { source: 'diffusion', groups: ['Flow matching step'] },
  'diffusion-vae': { source: 'diffusion', groups: ['encode scale'] },
  'tokenizer-bpe': { source: 'diffusion', groups: ['BPE train step'] },
  'clip-encoder': { source: 'diffusion', groups: ['L2 normalize'] },
  't5-encoder': { source: 'diffusion', groups: ['pad mask'] },
  'joint-attention': { source: 'diffusion', groups: ['Joint attention sequence'] },
  'dit': {
    source: 'diffusion',
    groups: ['Time embed inject', 'adaLN scale/shift', 'Self-attn residual', 'MLP residual'],
  },

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
  'rl-foundations': { source: 'rl', groups: ['Discounted return'] },
  'mdp-formalism': { source: 'rl', groups: ['Bellman expectation'] },
  'value-iteration': { source: 'rl', groups: ['Value iteration step'] },
  'policy-iteration': { source: 'rl', groups: ['Policy iteration step'] },
  'q-learning': { source: 'rl', groups: ['Epsilon-greedy selection', 'Terminal-aware TD target', 'Tabular Q-update', 'Complete agent step'] },
  'rl-exploration': { source: 'rl', groups: ['Exploration step'] },
  'policy-gradients': { source: 'rl', groups: ['Policy gradient step'] },
  'actor-critic': { source: 'rl', groups: ['Actor-critic step'] },
  'reward-shaping': { source: 'rl', groups: ['Shaped reward step'] },
  'grpo-reasoning': { source: 'rl', groups: ['Relative advantage'] },
  'dapo-reasoning-rl': { source: 'rl', groups: ['DAPO advantage'] },
  'markov-chains': { source: 'rl', groups: ['Markov chain step'] },

  // Model reliability
  'model-monitoring': { source: 'eval', groups: ['Drift checks'] },
  'model-debugging': { source: 'transformer', groups: ['Transformer debugging checks'] },
  'model-interpretability': { source: 'eval', groups: ['Shapley attribution check'] },
  'model-fairness': { source: 'eval', groups: ['Fairness audit'] },
  'uncertainty-estimation': { source: 'eval', groups: ['Uncertainty report'] },
  'ml-security-robustness-track': { source: 'eval', groups: ['Adversarial perturbation'] },
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
