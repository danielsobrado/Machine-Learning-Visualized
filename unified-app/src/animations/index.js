import { lazy } from 'react';

// Registry of available animation components
// All animations are now integrated from their individual projects
const animationRegistry = {
  // NLP & Text Processing
  'bag-of-words': lazy(() => import('./bag-of-words')),
  'word2vec': lazy(() => import('./word2vec')),
  'glove': lazy(() => import('./glove')),
  'fasttext': lazy(() => import('./fasttext')),
  'tokenization': lazy(() => import('./tokenization')),
  'embeddings': lazy(() => import('./embeddings')),

  // Transformers & Attention
  'attention-mechanism': lazy(() => import('./attention-mechanism')),
  'self-attention': lazy(() => import('./self-attention')),
  'attention-masks': lazy(() => import('./attention-masks')),
  'grouped-query-attention': lazy(() => import('./grouped-query-attention')),
  'kv-cache': lazy(() => import('./kv-cache')),
  'flash-attention': lazy(() => import('./flash-attention')),
  'eagle-3-1-speculative-decoding': lazy(() => import('./eagle-3-1-speculative-decoding')),
  'native-sparse-attention': lazy(() => import('./native-sparse-attention')),
  'spec-sparse-attention': lazy(() => import('./spec-sparse-attention')),
  'turboquant': lazy(() => import('./turboquant')),
  'grpo-reasoning': lazy(() => import('./grpo-reasoning')),
  'dapo-reasoning-rl': lazy(() => import('./dapo-reasoning-rl')),
  'coconut-latent-reasoning': lazy(() => import('./coconut-latent-reasoning')),
  'recommender-systems-ranking-track': lazy(() => import('./recommender-systems-ranking-track')),
  'efficient-inference-compression-track': lazy(() => import('./efficient-inference-compression-track')),
  'transformer': lazy(() => import('./transformer')),
  'transformer-architecture-families': lazy(() => import('./transformer-architecture-families')),
  'llm-training-objectives': lazy(() => import('./llm-training-objectives')),
  'transformer-token-generation': lazy(() => import('./transformer-token-generation')),
  'sampling-strategies': lazy(() => import('./sampling-strategies')),
  'bert': lazy(() => import('./bert')),
  'gpt2-comprehensive': lazy(() => import('./gpt2-comprehensive')),
  'positional-encoding': lazy(() => import('./positional-encoding')),
  'rope': lazy(() => import('./rope')),
  'residual-stream': lazy(() => import('./residual-stream')),

  // Neural Network Components
  'relu': lazy(() => import('./relu')),
  'leaky-relu': lazy(() => import('./leaky-relu')),
  'conv2d': lazy(() => import('./conv2d')),
  'max-pooling': lazy(() => import('./max-pooling')),
  'conv-relu': lazy(() => import('./conv-relu')),
  'neural-network': lazy(() => import('./neural-network/EnhancedNeuralNetwork')),
  'lstm': lazy(() => import('./lstm')),
  'layer-normalization': lazy(() => import('./layer-normalization')),
  'softmax': lazy(() => import('./softmax')),
  initialization: lazy(() => import('./initialization')),
  'optimizers': lazy(() => import('./optimizers')),
  'training-loop-dynamics': lazy(() => import('./training-loop-dynamics')),
  'dropout-batchnorm': lazy(() => import('./dropout-batchnorm')),

  // Advanced Models
  'vae': lazy(() => import('./vae')),
  'frontier-llm-architecture-overview': lazy(() => import('./frontier-llm-architecture-overview')),
  'frontier-moe-systems': lazy(() => import('./frontier-moe-systems')),
  'multi-head-latent-attention': lazy(() => import('./multi-head-latent-attention')),
  'reasoning-rlvr-grpo': lazy(() => import('./reasoning-rlvr-grpo')),
  'test-time-compute-thinking-budgets': lazy(() => import('./test-time-compute-thinking-budgets')),
  'long-context-frontier-models': lazy(() => import('./long-context-frontier-models')),
  'omni-multimodal-architectures': lazy(() => import('./omni-multimodal-architectures')),
  'diffusion-language-models': lazy(() => import('./diffusion-language-models')),
  'efficient-llm-serving': lazy(() => import('./efficient-llm-serving')),
  'frontier-evaluation-safety': lazy(() => import('./frontier-evaluation-safety')),
  'tool-using-reasoning-models': lazy(() => import('./tool-using-reasoning-models')),
  'agentic-coding-systems': lazy(() => import('./agentic-coding-systems')),
  'moe': lazy(() => import('./moe')),
  'rag': lazy(() => import('./rag')),
  'rag-chunking-context': lazy(() => import('./rag-chunking-context')),
  'rag-vector-indexing': lazy(() => import('./rag-vector-indexing')),
  'rag-reranking-grounding': lazy(() => import('./rag-reranking-grounding')),
  'rag-failure-modes': lazy(() => import('./rag-failure-modes')),
  'rag-retrieval-evaluation': lazy(() => import('./rag-retrieval-evaluation')),
  'multimodal-llm': lazy(() => import('./multimodal-llm')),
  'fine-tuning': lazy(() => import('./fine-tuning')),

  // Model Reliability
  'model-debugging': lazy(() => import('./model-debugging')),
  'model-interpretability': lazy(() => import('./model-interpretability')),
  'model-monitoring': lazy(() => import('./model-monitoring')),
  'model-fairness': lazy(() => import('./model-fairness')),
  'uncertainty-estimation': lazy(() => import('./uncertainty-estimation')),
  'ml-security-robustness-track': lazy(() => import('./ml-security-robustness-track')),

  // Linear Algebra & Math
  'matrix-multiplication': lazy(() => import('./matrix-multiplication')),
  'matrix-decompositions': lazy(() => import('./matrix-decompositions')),
  'fundamental-subspaces': lazy(() => import('./fundamental-subspaces')),
  'least-squares-projection': lazy(() => import('./least-squares-projection')),
  'pseudoinverse': lazy(() => import('./pseudoinverse')),
  'change-of-basis': lazy(() => import('./change-of-basis')),
  'condition-number': lazy(() => import('./condition-number')),
  'determinant-volume': lazy(() => import('./determinant-volume')),
  'projection-matrices': lazy(() => import('./projection-matrices')),
  'low-rank-approximation': lazy(() => import('./low-rank-approximation')),
  'pca': lazy(() => import('./pca')),
  'eigenvalue': lazy(() => import('./eigenvalue')),
  'svd': lazy(() => import('./svd')),
  'qr-decomposition': lazy(() => import('./qr-decomposition')),
  'linear-regression': lazy(() => import('./linear-regression')),
  'gradient-descent': lazy(() => import('./gradient-descent')),
  'optimization': lazy(() => import('./optimization')),
  'gradient-problems': lazy(() => import('./gradient-problems')),

  // Core ML
  'train-validation-test-split': lazy(() => import('./train-validation-test-split')),
  'cross-validation': lazy(() => import('./cross-validation')),
  'data-leakage-deep-dive': lazy(() => import('./data-leakage-deep-dive')),
  'feature-scaling-preprocessing': lazy(() => import('./feature-scaling-preprocessing')),
  'overfitting': lazy(() => import('./overfitting')),
  'k-means': lazy(() => import('./k-means')),
  'logistic-regression': lazy(() => import('./logistic-regression')),
  'classification-metrics': lazy(() => import('./classification-metrics')),
  'roc-pr-curves': lazy(() => import('./roc-pr-curves')),
  'calibration': lazy(() => import('./calibration')),
  'bias-variance-tradeoff': lazy(() => import('./bias-variance-tradeoff')),
  'regularization': lazy(() => import('./regularization')),
  'knn-naive-bayes-svm': lazy(() => import('./knn-naive-bayes-svm')),
  'tree-ensembles': lazy(() => import('./tree-ensembles')),
  'time-series-forecasting-track': lazy(() => import('./time-series-forecasting-track')),
  'data-engineering-for-ml-track': lazy(() => import('./data-engineering-for-ml-track')),
  'computation-graph-backprop': lazy(() => import('./computation-graph-backprop')),

  // Probability & Statistics
  'probability-distributions': lazy(() => import('./probability-distributions')),
  'conditional-probability': lazy(() => import('./conditional-probability')),
  'bayes-rule-ml': lazy(() => import('./bayes-rule-ml')),
  'sampling-confidence-intervals': lazy(() => import('./sampling-confidence-intervals')),
  'hypothesis-testing-intuition': lazy(() => import('./hypothesis-testing-intuition')),
  'ab-testing-foundations': lazy(() => import('./ab-testing-foundations')),
  'power-sample-size': lazy(() => import('./power-sample-size')),
  'sequential-testing-peeking': lazy(() => import('./sequential-testing-peeking')),
  'cuped-variance-reduction': lazy(() => import('./cuped-variance-reduction')),
  'confounding-simpsons-paradox': lazy(() => import('./confounding-simpsons-paradox')),
  'causal-graphs-dags': lazy(() => import('./causal-graphs-dags')),
  'treatment-effects': lazy(() => import('./treatment-effects')),
  'propensity-scores': lazy(() => import('./propensity-scores')),
  'maximum-likelihood-estimation': lazy(() => import('./maximum-likelihood-estimation')),
  'loss-functions-likelihoods': lazy(() => import('./loss-functions-likelihoods')),
  'entropy': lazy(() => import('./entropy')),
  'cross-entropy': lazy(() => import('./cross-entropy')),
  'expected-value-variance': lazy(() => import('./expected-value-variance')),
  'cosine-similarity': lazy(() => import('./cosine-similarity')),
  'spearman-correlation': lazy(() => import('./spearman-correlation')),

  // Reinforcement Learning
  'rl-foundations': lazy(() => import('./rl-foundations')),
  'mdp-formalism': lazy(() => import('./mdp-formalism')),
  'value-iteration': lazy(() => import('./value-iteration')),
  'policy-iteration': lazy(() => import('./policy-iteration')),
  'rl-exploration': lazy(() => import('./rl-exploration')),
  'q-learning': lazy(() => import('./q-learning')),
  'policy-gradients': lazy(() => import('./policy-gradients')),
  'actor-critic': lazy(() => import('./actor-critic')),
  'ppo-clipped-policy-gradient': lazy(() => import('./ppo-clipped-policy-gradient')),
  'reward-shaping': lazy(() => import('./reward-shaping')),

  // Algorithms & Data Structures
  'bloom-filter': lazy(() => import('./bloom-filter')),
  'markov-chains': lazy(() => import('./markov-chains')),
  'pagerank': lazy(() => import('./pagerank')),

  // Diffusion Models (SD3)
  'diffusion-basics': lazy(() => import('./diffusion-basics')),
  'diffusion-sampling': lazy(() => import('./diffusion-sampling')),
  'classifier-free-guidance': lazy(() => import('./classifier-free-guidance')),
  'unet-vs-dit': lazy(() => import('./unet-vs-dit')),
  'sd3-overview': lazy(() => import('./sd3-overview')),
  'flow-matching': lazy(() => import('./flow-matching')),
  'diffusion-vae': lazy(() => import('./diffusion-vae')),
  'tokenizer-bpe': lazy(() => import('./tokenizer-bpe')),
  'clip-encoder': lazy(() => import('./clip-encoder')),
  't5-encoder': lazy(() => import('./t5-encoder')),
  'joint-attention': lazy(() => import('./joint-attention')),
  'dit': lazy(() => import('./dit')),
};

export function getAnimationComponent(id) {
  return animationRegistry[id] || null;
}

export function isAnimationAvailable(id) {
  return id in animationRegistry;
}

export const availableAnimations = Object.keys(animationRegistry);
