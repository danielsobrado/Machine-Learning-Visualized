function freezeLessonContract(contract) {
  return Object.freeze({
    lessonId: contract.lessonId,
    role: contract.role,
    owns: Object.freeze([...contract.owns]),
    excludes: Object.freeze([...(contract.excludes || [])]),
  });
}

function family(id, lessons) {
  return Object.freeze({
    id,
    lessons: Object.freeze(lessons.map(freezeLessonContract)),
  });
}

export const LESSON_OWNERSHIP_CONTRACTS = Object.freeze([
  family('transformer-core', [
    {
      lessonId: 'transformer',
      role: 'mechanics',
      owns: ['canonical transformer block composition', 'residual and normalization flow', 'block-level shape and parameter reasoning'],
      excludes: ['encoder versus decoder family selection', 'autoregressive token-generation runtime'],
    },
    {
      lessonId: 'transformer-architecture-families',
      role: 'comparison',
      owns: ['encoder-only versus decoder-only versus encoder-decoder topology', 'workload-to-architecture-family selection'],
      excludes: ['generic transformer block derivation', 'sampling and decode-loop mechanics'],
    },
    {
      lessonId: 'transformer-token-generation',
      role: 'runtime',
      owns: ['autoregressive decode loop', 'prefill versus decode behavior', 'token append, stopping, and KV-cache reuse'],
      excludes: ['architecture-family taxonomy', 'generic block internals'],
    },
  ]),
  family('rag-pipeline', [
    {
      lessonId: 'rag',
      role: 'overview',
      owns: ['end-to-end retrieval-augmented generation pipeline', 'when retrieval is useful and where pipeline ceilings arise'],
      excludes: ['detailed chunking policy', 'ANN internals', 'specialized retrieval metrics'],
    },
    {
      lessonId: 'rag-chunking-context',
      role: 'data-preparation',
      owns: ['chunk boundaries and overlap', 'metadata-aware context packing', 'context-budget tradeoffs'],
      excludes: ['ANN index tuning', 'retrieval metric derivations'],
    },
    {
      lessonId: 'rag-vector-indexing',
      role: 'retrieval-systems',
      owns: ['embedding-space compatibility', 'ANN recall-latency tradeoffs', 'vector index migration and tuning'],
      excludes: ['chunk segmentation policy', 'generation grounding policy'],
    },
    {
      lessonId: 'rag-reranking-grounding',
      role: 'post-retrieval',
      owns: ['candidate reranking', 'evidence selection for final context', 'claim-to-evidence grounding'],
      excludes: ['ANN candidate-generation internals', 'retrieval metric definitions'],
    },
    {
      lessonId: 'rag-retrieval-evaluation',
      role: 'evaluation',
      owns: ['retrieval recall and ranking metrics', 'retrieval-versus-generation failure attribution', 'offline retrieval evaluation design'],
      excludes: ['index implementation', 'chunk creation'],
    },
    {
      lessonId: 'rag-failure-modes',
      role: 'diagnosis',
      owns: ['missing, stale, irrelevant, conflicting, and unused evidence diagnosis', 'pipeline failure localization'],
      excludes: ['metric derivation as the primary objective', 'ANN implementation details'],
    },
  ]),
  family('reasoning-rl', [
    {
      lessonId: 'grpo-reasoning',
      role: 'algorithm',
      owns: ['group-relative advantage construction', 'GRPO policy-update mechanics', 'group sampling effects'],
      excludes: ['verifier design as the main topic', 'DAPO-specific stabilization changes'],
    },
    {
      lessonId: 'reasoning-rlvr-grpo',
      role: 'training-pipeline',
      owns: ['verifiable reward design', 'SFT-to-RLVR training pipeline', 'verifier generalization and reward validity'],
      excludes: ['generic GRPO derivation', 'DAPO-specific objective changes'],
    },
    {
      lessonId: 'dapo-reasoning-rl',
      role: 'algorithm-extension',
      owns: ['Dynamic Sampling', 'Clip-Higher', 'token-level loss', 'overlong reward shaping'],
      excludes: ['generic GRPO fundamentals', 'general RLVR verifier design'],
    },
  ]),
  family('tokenization', [
    {
      lessonId: 'tokenization',
      role: 'representation',
      owns: ['text-to-token interface', 'Unicode and domain segmentation effects', 'token-budget and special-token consequences'],
      excludes: ['BPE merge-learning algorithm'],
    },
    {
      lessonId: 'tokenizer-bpe',
      role: 'algorithm',
      owns: ['BPE pair counting and merge mechanics', 'vocabulary-size tradeoffs', 'tokenizer-to-model interface migration'],
      excludes: ['generic tokenization definitions as the primary topic'],
    },
  ]),
  family('optimization-training', [
    {
      lessonId: 'gradient-descent',
      role: 'first-order-method',
      owns: ['gradient step mechanics', 'learning-rate effects', 'conditioning and zig-zag behavior'],
      excludes: ['adaptive optimizer comparison', 'full training-loop orchestration'],
    },
    {
      lessonId: 'optimization',
      role: 'problem-geometry',
      owns: ['objective geometry', 'constraints', 'non-convexity', 'optimization problem versus update rule'],
      excludes: ['optimizer catalog memorization', 'training-loop state transitions'],
    },
    {
      lessonId: 'optimizers',
      role: 'algorithm-comparison',
      owns: ['SGD, momentum, RMSProp, Adam, and AdamW update behavior', 'optimizer-state and regularization tradeoffs'],
      excludes: ['generic objective geometry', 'checkpointing and train-eval orchestration'],
    },
    {
      lessonId: 'training-loop-dynamics',
      role: 'orchestration',
      owns: ['batching and accumulation', 'schedules and clipping', 'train-eval state', 'validation and checkpoint dynamics'],
      excludes: ['deriving optimizer equations', 'generic loss-surface geometry'],
    },
  ]),
  family('cnn-activation', [
    {
      lessonId: 'conv2d',
      role: 'operator',
      owns: ['2D convolution geometry', 'kernel-stride-padding-dilation shape arithmetic', 'receptive-field construction'],
      excludes: ['activation-function comparison'],
    },
    {
      lessonId: 'relu',
      role: 'activation',
      owns: ['activation nonlinearity', 'local derivatives and saturation behavior', 'dead-unit diagnosis'],
      excludes: ['convolution geometry'],
    },
    {
      lessonId: 'conv-relu',
      role: 'composition',
      owns: ['hierarchical feature extraction from convolution followed by nonlinearity', 'feature-map transformation through the composed block'],
      excludes: ['standalone convolution arithmetic', 'general activation-family survey'],
    },
  ]),
  family('diffusion-transformers', [
    {
      lessonId: 'dit',
      role: 'architecture',
      owns: ['diffusion transformer block design', 'patch or latent token processing in diffusion models'],
      excludes: ['generic U-Net comparison as the main topic'],
    },
    {
      lessonId: 'unet-vs-dit',
      role: 'comparison',
      owns: ['U-Net versus DiT inductive biases', 'scaling and compute tradeoffs', 'architecture selection'],
      excludes: ['full DiT implementation walkthrough'],
    },
    {
      lessonId: 'sd3-overview',
      role: 'case-study',
      owns: ['Stable Diffusion 3 component integration', 'how text encoders, latent representation, joint attention, and flow matching fit together'],
      excludes: ['reteaching every prerequisite mechanism'],
    },
  ]),
]);

export const COMPARISON_SYNTHESIS_LESSON_CONTRACTS = Object.freeze([
  Object.freeze({
    lessonId: 'knn-naive-bayes-svm',
    role: 'comparison',
    owns: Object.freeze(['contrast neighbor voting, probabilistic assumptions, and margin classification', 'choose among the three families from data geometry and assumptions']),
  }),
  Object.freeze({
    lessonId: 'dropout-batchnorm',
    role: 'comparison',
    owns: Object.freeze(['contrast stochastic regularization with activation normalization', 'train-versus-eval behavior of both mechanisms']),
  }),
  Object.freeze({
    lessonId: 'loss-functions-likelihoods',
    role: 'synthesis',
    owns: Object.freeze(['map observation models to negative log-likelihood losses', 'explain why squared error and cross-entropy arise from different likelihood assumptions']),
  }),
]);

export function lessonOwnershipContract(lessonId) {
  for (const group of LESSON_OWNERSHIP_CONTRACTS) {
    const lesson = group.lessons.find((item) => item.lessonId === lessonId);
    if (lesson) return lesson;
  }
  return COMPARISON_SYNTHESIS_LESSON_CONTRACTS.find((item) => item.lessonId === lessonId) || null;
}
