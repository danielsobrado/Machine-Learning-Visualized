import { allAnimations } from './animations.js';
import { AB_TESTING_FOUNDATIONS_QUIZ } from './abTestingFoundationsAssessment.js';
import { AGENTIC_CODING_SYSTEMS_QUIZ } from './agenticCodingSystemsAssessment.js';
import { ATTENTION_MASKS_QUIZ } from './attentionMasksAssessment.js';
import { ATTENTION_MECHANISM_QUIZ } from './attentionMechanismAssessment.js';
import { BAG_OF_WORDS_QUIZ } from './bagOfWordsAssessment.js';
import { BAYES_RULE_QUIZ } from './bayesRuleAssessment.js';
import { BERT_QUIZ } from './bertAssessment.js';
import { BIAS_VARIANCE_TRADEOFF_QUIZ } from './biasVarianceTradeoffAssessment.js';
import { BLOOM_FILTER_QUIZ } from './bloomFilterAssessment.js';
import { CALIBRATION_QUIZ } from './calibrationAssessment.js';
import { CAUSAL_GRAPHS_DAGS_QUIZ } from './causalGraphsDagsAssessment.js';
import { CHANGE_OF_BASIS_QUIZ } from './changeOfBasisAssessment.js';
import { CLASSIFIER_FREE_GUIDANCE_QUIZ } from './classifierFreeGuidanceAssessment.js';
import { CLASSIFICATION_METRICS_QUIZ } from './classificationMetricsAssessment.js';
import { COMPUTATION_GRAPH_BACKPROP_QUIZ } from './computationGraphBackpropAssessment.js';
import { CONDITION_NUMBER_QUIZ } from './conditionNumberAssessment.js';
import { CONV2D_QUIZ } from './conv2dAssessment.js';
import { CONV_RELU_QUIZ } from './convReluAssessment.js';
import { COCONUT_LATENT_REASONING_QUIZ } from './coconutLatentReasoningAssessment.js';
import { COSINE_SIMILARITY_QUIZ } from './cosineSimilarityAssessment.js';
import { CROSS_ENTROPY_QUIZ } from './crossEntropyAssessment.js';
import { CROSS_VALIDATION_QUIZ } from './crossValidationAssessment.js';
import { CUPED_VARIANCE_REDUCTION_QUIZ } from './cupedVarianceReductionAssessment.js';
import { CONFOUNDING_SIMPSONS_PARADOX_QUIZ } from './confoundingSimpsonsParadoxAssessment.js';
import { DATA_ENGINEERING_FOR_ML_QUIZ } from './dataEngineeringForMlAssessment.js';
import { DATA_LEAKAGE_DEEP_DIVE_QUIZ } from './dataLeakageDeepDiveAssessment.js';
import { DAPO_REASONING_RL_QUIZ } from './dapoReasoningRlAssessment.js';
import { DETERMINANT_VOLUME_QUIZ } from './determinantVolumeAssessment.js';
import { DIFFUSION_BASICS_QUIZ } from './diffusionBasicsAssessment.js';
import { DIFFUSION_LANGUAGE_MODELS_QUIZ } from './diffusionLanguageModelsAssessment.js';
import { DIFFUSION_SAMPLING_QUIZ } from './diffusionSamplingAssessment.js';
import { DROPOUT_BATCHNORM_QUIZ } from './dropoutBatchnormAssessment.js';
import { EAGLE_3_1_SPECULATIVE_DECODING_QUIZ } from './eagle31SpeculativeDecodingAssessment.js';
import { EFFICIENT_INFERENCE_COMPRESSION_QUIZ } from './efficientInferenceCompressionAssessment.js';
import { EFFICIENT_LLM_SERVING_QUIZ } from './efficientLlmServingAssessment.js';
import { EIGENVALUE_QUIZ } from './eigenvalueAssessment.js';
import { EMBEDDINGS_QUIZ } from './embeddingsAssessment.js';
import { FASTTEXT_QUIZ } from './fasttextAssessment.js';
import { FEATURE_SCALING_PREPROCESSING_QUIZ } from './featureScalingPreprocessingAssessment.js';
import { FINE_TUNING_QUIZ } from './fineTuningAssessment.js';
import { FLASH_ATTENTION_QUIZ } from './flashAttentionAssessment.js';
import { FRONTIER_EVALUATION_SAFETY_QUIZ } from './frontierEvaluationSafetyAssessment.js';
import { FRONTIER_LLM_ARCHITECTURE_OVERVIEW_QUIZ } from './frontierLlmArchitectureOverviewAssessment.js';
import { FRONTIER_MOE_SYSTEMS_QUIZ } from './frontierMoeSystemsAssessment.js';
import { FUNDAMENTAL_SUBSPACES_QUIZ } from './fundamentalSubspacesAssessment.js';
import { GLOVE_QUIZ } from './gloveAssessment.js';
import { GRADIENT_DESCENT_QUIZ } from './gradientDescentAssessment.js';
import { GRADIENT_PROBLEMS_QUIZ } from './gradientProblemsAssessment.js';
import { GPT2_COMPREHENSIVE_QUIZ } from './gpt2ComprehensiveAssessment.js';
import { GRPO_REASONING_QUIZ } from './grpoReasoningAssessment.js';
import { GROUPED_QUERY_ATTENTION_QUIZ } from './groupedQueryAttentionAssessment.js';
import { HYPOTHESIS_TESTING_INTUITION_QUIZ } from './hypothesisTestingIntuitionAssessment.js';
import { INITIALIZATION_QUIZ } from './initializationAssessment.js';
import { KMEANS_QUIZ } from './kMeansAssessment.js';
import { KNN_NAIVE_BAYES_SVM_QUIZ } from './knnNaiveBayesSvmAssessment.js';
import { KV_CACHE_QUIZ } from './kvCacheAssessment.js';
import { LAYER_NORMALIZATION_QUIZ } from './layerNormalizationAssessment.js';
import { LEAST_SQUARES_PROJECTION_QUIZ } from './leastSquaresProjectionAssessment.js';
import { LEAKY_RELU_QUIZ } from './leakyReluAssessment.js';
import { LINEAR_REGRESSION_QUIZ } from './linearRegressionAssessment.js';
import { LOGISTIC_REGRESSION_QUIZ } from './logisticRegressionAssessment.js';
import { LLM_TRAINING_OBJECTIVES_QUIZ } from './llmTrainingObjectivesAssessment.js';
import { LONG_CONTEXT_FRONTIER_MODELS_QUIZ } from './longContextFrontierModelsAssessment.js';
import { LOSS_FUNCTIONS_LIKELIHOODS_QUIZ } from './lossFunctionsLikelihoodsAssessment.js';
import { LOW_RANK_APPROXIMATION_QUIZ } from './lowRankApproximationAssessment.js';
import { LSTM_QUIZ } from './lstmAssessment.js';
import { MAXIMUM_LIKELIHOOD_ESTIMATION_QUIZ } from './maximumLikelihoodEstimationAssessment.js';
import { MAX_POOLING_QUIZ } from './maxPoolingAssessment.js';
import { MATRIX_DECOMPOSITIONS_QUIZ } from './matrixDecompositionsAssessment.js';
import { MATRIX_MULTIPLICATION_QUIZ } from './matrixMultiplicationAssessment.js';
import { ML_SECURITY_ROBUSTNESS_QUIZ } from './mlSecurityRobustnessAssessment.js';
import { MIXTURE_OF_EXPERTS_QUIZ } from './mixtureOfExpertsAssessment.js';
import { MODEL_DEBUGGING_QUIZ } from './modelDebuggingAssessment.js';
import { MODEL_INTERPRETABILITY_QUIZ } from './modelInterpretabilityAssessment.js';
import { MODEL_MONITORING_QUIZ } from './modelMonitoringAssessment.js';
import { MULTI_HEAD_LATENT_ATTENTION_QUIZ } from './multiHeadLatentAttentionAssessment.js';
import { MULTIMODAL_LLM_QUIZ } from './multimodalLlmAssessment.js';
import { NATIVE_SPARSE_ATTENTION_QUIZ } from './nativeSparseAttentionAssessment.js';
import { NEURAL_NETWORK_QUIZ } from './neuralNetworkAssessment.js';
import { OMNI_MULTIMODAL_ARCHITECTURES_QUIZ } from './omniMultimodalArchitecturesAssessment.js';
import { OPTIMIZATION_QUIZ } from './optimizationAssessment.js';
import { OPTIMIZERS_QUIZ } from './optimizersAssessment.js';
import { OVERFITTING_QUIZ } from './overfittingAssessment.js';
import { PCA_QUIZ } from './pcaAssessment.js';
import { POSITIONAL_ENCODING_QUIZ } from './positionalEncodingAssessment.js';
import { POWER_SAMPLE_SIZE_QUIZ } from './powerSampleSizeAssessment.js';
import { PSEUDOINVERSE_QUIZ } from './pseudoinverseAssessment.js';
import { PROJECTION_MATRICES_QUIZ } from './projectionMatricesAssessment.js';
import { PROPENSITY_SCORES_QUIZ } from './propensityScoresAssessment.js';
import { Q_LEARNING_QUIZ } from './qLearningAssessment.js';
import { QR_DECOMPOSITION_QUIZ } from './qrDecompositionAssessment.js';
import { RAG_QUIZ } from './ragAssessment.js';
import { RAG_CHUNKING_CONTEXT_QUIZ } from './ragChunkingContextAssessment.js';
import { RAG_FAILURE_MODES_QUIZ } from './ragFailureModesAssessment.js';
import { RAG_RERANKING_GROUNDING_QUIZ } from './ragRerankingGroundingAssessment.js';
import { RAG_RETRIEVAL_EVALUATION_QUIZ } from './ragRetrievalEvaluationAssessment.js';
import { RAG_VECTOR_INDEXING_QUIZ } from './ragVectorIndexingAssessment.js';
import { RECOMMENDER_SYSTEMS_RANKING_QUIZ } from './recommenderSystemsRankingAssessment.js';
import { REGULARIZATION_QUIZ } from './regularizationAssessment.js';
import { RELU_QUIZ } from './reluAssessment.js';
import { REASONING_RLVR_GRPO_QUIZ } from './reasoningRlvrGrpoAssessment.js';
import { RL_EXPLORATION_QUIZ } from './rlExplorationAssessment.js';
import { RL_FOUNDATIONS_QUIZ } from './rlFoundationsAssessment.js';
import { ROPE_QUIZ } from './ropeAssessment.js';
import { ROC_PR_CURVES_QUIZ } from './rocPrCurvesAssessment.js';
import { RESIDUAL_STREAM_QUIZ } from './residualStreamAssessment.js';
import { SAMPLING_CONFIDENCE_INTERVALS_QUIZ } from './samplingConfidenceIntervalsAssessment.js';
import { SAMPLING_STRATEGIES_QUIZ } from './samplingStrategiesAssessment.js';
import { SEQUENTIAL_TESTING_PEEKING_QUIZ } from './sequentialTestingPeekingAssessment.js';
import { SELF_ATTENTION_QUIZ } from './selfAttentionAssessment.js';
import { SOFTMAX_QUIZ } from './softmaxAssessment.js';
import { SPEARMAN_CORRELATION_QUIZ } from './spearmanCorrelationAssessment.js';
import { SPEC_SPARSE_ATTENTION_QUIZ } from './specSparseAttentionAssessment.js';
import { getScenarioQuestionsForLesson } from './scenarioQuestions.js';
import { SVD_QUIZ } from './svdAssessment.js';
import { TEST_TIME_COMPUTE_THINKING_BUDGETS_QUIZ } from './testTimeComputeThinkingBudgetsAssessment.js';
import { TREE_ENSEMBLES_QUIZ } from './treeEnsemblesAssessment.js';
import { TURBOQUANT_QUIZ } from './turboquantAssessment.js';
import { TIME_SERIES_FORECASTING_QUIZ } from './timeSeriesForecastingAssessment.js';
import { TOKENIZATION_QUIZ } from './tokenizationAssessment.js';
import { TRAINING_LOOP_DYNAMICS_QUIZ } from './trainingLoopDynamicsAssessment.js';
import { TRAIN_VALIDATION_TEST_SPLIT_QUIZ } from './trainValidationTestSplitAssessment.js';
import { TRANSFORMER_ARCHITECTURE_FAMILIES_QUIZ } from './transformerArchitectureFamiliesAssessment.js';
import { TRANSFORMER_QUIZ } from './transformerAssessment.js';
import { TRANSFORMER_TOKEN_GENERATION_QUIZ } from './transformerTokenGenerationAssessment.js';
import { TOOL_USING_REASONING_MODELS_QUIZ } from './toolUsingReasoningModelsAssessment.js';
import { TREATMENT_EFFECTS_QUIZ } from './treatmentEffectsAssessment.js';
import { UNET_VS_DIT_QUIZ } from './unetVsDitAssessment.js';
import { VAE_QUIZ } from './vaeAssessment.js';
import { WORD2VEC_QUIZ } from './word2vecAssessment.js';

export const PRIORITY_ASSESSMENT_LESSON_IDS = [
  'matrix-multiplication',
  'linear-regression',
  'pca',
  'fundamental-subspaces',
  'matrix-decompositions',
  'qr-decomposition',
  'svd',
  'k-means',
  'train-validation-test-split',
  'cross-validation',
  'data-leakage-deep-dive',
  'feature-scaling-preprocessing',
  'bayes-rule-ml',
  'sampling-confidence-intervals',
  'hypothesis-testing-intuition',
  'ab-testing-foundations',
  'power-sample-size',
  'sequential-testing-peeking',
  'cuped-variance-reduction',
  'confounding-simpsons-paradox',
  'causal-graphs-dags',
  'treatment-effects',
  'propensity-scores',
  'spearman-correlation',
  'maximum-likelihood-estimation',
  'loss-functions-likelihoods',
  'logistic-regression',
  'classification-metrics',
  'roc-pr-curves',
  'calibration',
  'overfitting',
  'bias-variance-tradeoff',
  'regularization',
  'knn-naive-bayes-svm',
  'tree-ensembles',
  'time-series-forecasting-track',
  'recommender-systems-ranking-track',
  'ml-security-robustness-track',
  'efficient-inference-compression-track',
  'data-engineering-for-ml-track',
  'gradient-descent',
  'neural-network',
  'initialization',
  'optimizers',
  'training-loop-dynamics',
  'dropout-batchnorm',
  'gradient-problems',
  'layer-normalization',
  'relu',
  'leaky-relu',
  'conv2d',
  'conv-relu',
  'max-pooling',
  'computation-graph-backprop',
  'tokenization',
  'embeddings',
  'cosine-similarity',
  'attention-mechanism',
  'self-attention',
  'kv-cache',
  'grouped-query-attention',
  'flash-attention',
  'native-sparse-attention',
  'attention-masks',
  'positional-encoding',
  'rope',
  'residual-stream',
  'transformer',
  'transformer-architecture-families',
  'llm-training-objectives',
  'transformer-token-generation',
  'sampling-strategies',
  'fine-tuning',
  'rag-chunking-context',
  'rag-vector-indexing',
  'rag-reranking-grounding',
  'rag-failure-modes',
  'rag-retrieval-evaluation',
  'diffusion-basics',
  'diffusion-sampling',
  'classifier-free-guidance',
  'unet-vs-dit',
  'q-learning',
  'rl-exploration',
  'rl-foundations',
  'grpo-reasoning',
  'dapo-reasoning-rl',
  'coconut-latent-reasoning',
  'bloom-filter',
  'reasoning-rlvr-grpo',
  'test-time-compute-thinking-budgets',
  'long-context-frontier-models',
  'omni-multimodal-architectures',
  'diffusion-language-models',
  'efficient-llm-serving',
  'tool-using-reasoning-models',
  'agentic-coding-systems',
  'frontier-evaluation-safety',
];

export const EMPTY_ASSESSMENT = Object.freeze({
  quiz: Object.freeze([]),
  labs: Object.freeze([]),
});

function causalAssessment(topic, coreIdea, failureMode, labPrompt) {
  return {
    quiz: [
      {
        id: `${topic}-core-purpose`,
        prompt: `What is the main purpose of ${coreIdea.name}?`,
        choices: [
          coreIdea.purpose,
          'To replace randomization with a larger dashboard',
          'To prove every observed association is causal',
        ],
        answerIndex: 0,
        explanation: coreIdea.purposeExplanation,
      },
      {
        id: `${topic}-failure-mode`,
        prompt: `Which mistake is most dangerous for ${coreIdea.name}?`,
        choices: [
          'Using the method before defining the decision metric',
          failureMode,
          'Writing down the assumptions before looking at outcomes',
        ],
        answerIndex: 1,
        explanation: coreIdea.failureExplanation,
      },
      {
        id: `${topic}-decision-use`,
        prompt: `How should ${coreIdea.name} affect the decision?`,
        choices: [
          'Ignore uncertainty and ship the highest observed metric',
          'Use it only after deployment',
          coreIdea.decisionUse,
        ],
        answerIndex: 2,
        explanation: coreIdea.decisionExplanation,
      },
      {
        id: `${topic}-assumption`,
        prompt: `Which assumption matters most here?`,
        choices: [
          coreIdea.assumption,
          'Every subgroup has identical outcomes',
          'The observed result is independent of study design',
        ],
        answerIndex: 0,
        explanation: coreIdea.assumptionExplanation,
      },
      {
        id: `${topic}-diagnostic`,
        prompt: `What diagnostic should you check for ${coreIdea.name}?`,
        choices: [
          'Only the final headline metric',
          coreIdea.diagnostic,
          'Whether the chart color matches the treatment label',
        ],
        answerIndex: 1,
        explanation: coreIdea.diagnosticExplanation,
      },
    ],
    labs: [
      {
        id: `${topic}-scenario-lab`,
        title: coreIdea.labTitle,
        prompt: labPrompt,
        successCriteria: coreIdea.successCriteria,
      },
    ],
  };
}

const SEEDED_LESSON_ASSESSMENTS = {
  'bag-of-words': {
    quiz: BAG_OF_WORDS_QUIZ,
  },
  glove: {
    quiz: GLOVE_QUIZ,
  },
  fasttext: {
    quiz: FASTTEXT_QUIZ,
  },
  word2vec: {
    quiz: WORD2VEC_QUIZ,
  },
  'matrix-multiplication': {
    quiz: MATRIX_MULTIPLICATION_QUIZ,
    labs: [
      {
        id: 'compute-one-cell',
        title: 'Compute one cell by hand',
        prompt: 'Pick one highlighted output cell, write the row-column dot product, then compare it with the animation.',
        successCriteria: 'Your written terms match the multiplied row and column entries in order.',
      },
    ],
  },
  'eagle-3-1-speculative-decoding': {
    quiz: EAGLE_3_1_SPECULATIVE_DECODING_QUIZ,
    legacyQuiz: [
      {
        id: 'eagle-autoregressive-bottleneck',
        level: 'Foundation',
        prompt: 'Why is normal autoregressive LLM decoding hard to parallelize across future tokens?',
        choices: [
          'Each next token depends on the previously generated tokens',
          'The tokenizer can only run on one CPU core',
          'The KV cache removes all sequential dependencies',
        ],
        answerIndex: 0,
        explanation: 'The target model needs the current generated prefix before it can produce the next token.',
      },
      {
        id: 'eagle-speculative-parallelizes',
        level: 'Foundation',
        prompt: 'What does speculative decoding try to parallelize?',
        choices: [
          'It drafts several possible future tokens cheaply, then verifies them together with the target model',
          'It lets the small drafter skip target-model verification',
          'It trains all transformer layers at the same time during inference',
        ],
        answerIndex: 0,
        explanation: 'The expensive target pass checks a proposed token block instead of generating only one token.',
      },
      {
        id: 'eagle-accepted-prefix',
        level: 'Foundation',
        prompt: 'What is accepted during one speculative decoding round?',
        choices: [
          'The longest draft-token prefix that passes target-model verification',
          'Every token proposed by the drafter',
          'Only the final token in the draft sequence',
        ],
        answerIndex: 0,
        explanation: 'A first rejection stops the accepted prefix; remaining draft tokens are discarded.',
      },
      {
        id: 'eagle-rejection-fallback',
        level: 'Mechanism',
        prompt: 'What happens after the first rejected draft token?',
        choices: [
          'The target model supplies a replacement token and the remaining draft tokens are discarded',
          'The rejected token is kept because it was cheaper to produce',
          'The model restarts training from the original prompt',
        ],
        answerIndex: 0,
        explanation: 'Fallback preserves target-model behavior while still benefiting from accepted draft prefixes.',
      },
      {
        id: 'eagle-acceptance-length-speed',
        level: 'Mechanism',
        prompt: 'Why does a better drafter usually produce more speedup?',
        choices: [
          'It increases the average accepted prefix length per target verification pass',
          'It makes the target model unnecessary',
          'It removes attention from the target model',
        ],
        answerIndex: 0,
        explanation: 'Speedup comes from keeping more tokens from each verified draft block.',
      },
      {
        id: 'eagle-quality-preservation',
        level: 'Mechanism',
        prompt: 'Why can speculative decoding preserve output quality?',
        choices: [
          'The target model verifies proposed tokens before they become final output',
          'The draft model is always larger than the target model',
          'Rejected tokens are hidden but still used as final tokens',
        ],
        answerIndex: 0,
        explanation: 'The target model remains the authority for accepted tokens and fallback tokens.',
      },
      {
        id: 'eagle-long-context-hard',
        level: 'Application',
        prompt: 'Why can long context or changed chat templates make EAGLE-style drafting harder?',
        choices: [
          'They can shift attention patterns and hidden-state distributions away from what the drafter expects',
          'They prevent the target model from verifying draft tokens',
          'They make acceptance length unrelated to speedup',
        ],
        answerIndex: 0,
        explanation: 'Production prompts stress the drafter with formatting, sink-token, and distribution changes.',
      },
      {
        id: 'eagle-attention-drift-definition',
        level: 'Mechanism',
        prompt: 'What is attention drift in this lesson?',
        choices: [
          'The drafter shifts attention away from prompt or sink positions toward recent draft tokens as depth increases',
          'The target model deletes the KV cache after every token',
          'The user prompt becomes shorter during generation',
        ],
        answerIndex: 0,
        explanation: 'The drafter starts conditioning on its own speculative chain instead of stable context anchors.',
      },
      {
        id: 'eagle-self-attention-risk',
        level: 'Application',
        prompt: 'Why is it risky when the drafter mostly watches its own recent draft tokens?',
        choices: [
          'Draft states are less authoritative than verifier-conditioned context, so errors can compound',
          'Recent draft tokens are always correct and should dominate',
          'Attention to the prompt is illegal during speculative decoding',
        ],
        answerIndex: 0,
        explanation: 'The drafter can become increasingly self-referential and less aligned with the target model.',
      },
      {
        id: 'eagle-fc-norm-fix',
        level: 'Mechanism',
        prompt: 'What does FC normalization fix in EAGLE 3.1?',
        choices: [
          'It stabilizes target hidden-state stream scales before fusion so one stream does not dominate by magnitude',
          'It replaces target-model verification with greedy decoding',
          'It removes the need for low- and middle-layer features',
        ],
        answerIndex: 0,
        explanation: 'Balanced feature streams let fusion combine semantic levels instead of obeying only the largest-magnitude stream.',
      },
      {
        id: 'eagle-post-norm-fix',
        level: 'Mechanism',
        prompt: 'What does post-norm hidden-state feedback fix?',
        choices: [
          'It prevents hidden-state magnitude from accumulating across recursive draft steps',
          'It makes every draft token accepted automatically',
          'It turns the drafter into the full target model',
        ],
        answerIndex: 0,
        explanation: 'Each recursive drafter call receives a representation closer to the scale it was trained to consume.',
      },
      {
        id: 'eagle-depth-prediction',
        level: 'Application',
        prompt: 'If speculation depth increases from 2 to 8 and the drafter is unstable, what should you expect?',
        choices: [
          'Later draft tokens become less reliable and acceptance length may drop',
          'Acceptance length must equal 8',
          'Target verification stops being needed',
        ],
        answerIndex: 0,
        explanation: 'Deep speculative chains expose drift and residual-scale accumulation more strongly.',
      },
      {
        id: 'eagle-heatmap-sign',
        level: 'Application',
        prompt: 'What visual sign indicates attention drift in the heatmap?',
        choices: [
          'Bright cells move from prompt and sink columns toward recent draft-token columns',
          'All cells disappear at deeper rows',
          'Only the benchmark panel changes color',
        ],
        answerIndex: 0,
        explanation: 'The center of attention moves from stable context anchors to speculative self-history.',
      },
      {
        id: 'eagle-rms-sign',
        level: 'Application',
        prompt: 'What visual sign indicates residual-scale accumulation?',
        choices: [
          'Hidden-state RMS grows monotonically with draft depth',
          'Accepted tokens are colored green',
          'The prompt type selector has four choices',
        ],
        answerIndex: 0,
        explanation: 'Growing RMS means later recursive steps receive larger-scale states.',
      },
      {
        id: 'eagle-post-norm-prediction',
        level: 'Application',
        prompt: 'What should change when post-norm feedback is enabled?',
        choices: [
          'Hidden-state RMS should become flatter across depth and acceptance length should be more stable',
          'The target model should stop checking draft tokens',
          'The prompt should disappear from the heatmap',
        ],
        answerIndex: 0,
        explanation: 'Post-norm stabilizes the recursive feedback scale.',
      },
      {
        id: 'eagle-template-fragility',
        level: 'Tricky',
        prompt: 'Why might EAGLE-3 work on short controlled prompts but degrade with changed chat templates?',
        choices: [
          'The drafter may learn brittle hidden-state and attention patterns tied to familiar prompt formatting',
          'Chat templates make the target model unable to run',
          'Speculative decoding requires empty prompts',
        ],
        answerIndex: 0,
        explanation: 'A shifted prompt format can change the hidden-state distribution the drafter receives.',
      },
      {
        id: 'eagle-high-layer-domination',
        level: 'Tricky',
        prompt: 'Why is higher-layer hidden-state domination during fusion a problem?',
        choices: [
          'Fusion should combine multiple semantic levels, not just the stream with the largest scale',
          'High-layer states are never useful',
          'Low-layer and middle-layer states must always be larger',
        ],
        answerIndex: 0,
        explanation: 'EAGLE-3 benefits from low-, middle-, and high-level features only if fusion can actually use them.',
      },
      {
        id: 'eagle-recursive-drafter',
        level: 'Tricky',
        prompt: 'Why is EAGLE 3.1 more like repeatedly calling the same drafter?',
        choices: [
          'Post-norm feedback makes each recursive step receive a similarly scaled hidden representation',
          'It deletes all hidden states between steps',
          'It makes the target model smaller',
        ],
        answerIndex: 0,
        explanation: 'Stable feedback scale avoids the interpretation that each step simply stacks another unnormalized layer.',
      },
      {
        id: 'eagle-target-size',
        level: 'Interview',
        prompt: 'Does EAGLE 3.1 make the target model smaller?',
        choices: [
          'No. It reduces effective decoding cost by improving draft acceptance, while the target model still verifies',
          'Yes. It removes half of the target transformer layers',
          'Yes. It replaces the target model with RMSNorm',
        ],
        answerIndex: 0,
        explanation: 'The method improves serving efficiency through speculative acceptance, not target-model compression.',
      },
      {
        id: 'eagle-metric-emphasis',
        level: 'Interview',
        prompt: 'What metric should this animation emphasize besides raw speedup?',
        choices: [
          'Acceptance length, because it explains where speedup comes from',
          'The number of colors in the heatmap',
          'The length of the paper title',
        ],
        answerIndex: 0,
        explanation: 'Acceptance length links the mechanism to throughput.',
      },
    ],
    labs: [
      {
        id: 'mini-eagle-accepted-prefix',
        title: 'Repair accepted-prefix logic',
        prompt: 'Open mini-eagle/exercises/01_accept_prefix.rs and make the tests pass by stopping at the first mismatch.',
        successCriteria: 'The accepted-prefix tests pass and you can explain why accepted length, not draft length, controls speedup.',
      },
      {
        id: 'mini-eagle-rms-norm',
        title: 'Stabilize a toy drafter',
        prompt: 'Complete the RMSNorm and post-norm feedback exercises in mini-eagle, then compare raw and normalized hidden-state RMS.',
        successCriteria: 'The normed path remains near RMS 1.0 after repeated draft steps.',
      },
      {
        id: 'mini-eagle-drift-sim',
        title: 'Measure drift and expected acceptance',
        prompt: 'Complete the attention drift score and acceptance-length simulation exercises.',
        successCriteria: 'You can connect rising recent-draft attention to shorter expected accepted prefixes.',
      },
    ],
  },
  'multi-head-latent-attention': {
    quiz: MULTI_HEAD_LATENT_ATTENTION_QUIZ,
    legacyQuiz: [
      {
        id: 'mla-kv-cache-growth',
        level: 'Foundation',
        prompt: 'Why does the KV cache grow during autoregressive decoding?',
        choices: [
          'Every new token stores key and value information that future tokens will read',
          'The tokenizer creates a larger vocabulary after each step',
          'The model adds a new transformer layer for each generated token',
        ],
        answerIndex: 0,
        explanation: 'The prefix grows one token at a time, and each layer keeps cached attention state for those prior tokens.',
      },
      {
        id: 'mla-gqa-cache-saving',
        level: 'Foundation',
        prompt: 'What does GQA do to reduce KV cache size?',
        choices: [
          'It lets multiple query heads share a smaller number of key/value heads',
          'It deletes value vectors and keeps only keys',
          'It replaces attention with an MLP during decoding',
        ],
        answerIndex: 0,
        explanation: 'GQA keeps many query heads but caches fewer K/V heads, so the cache width is smaller than MHA.',
      },
      {
        id: 'mla-cached-object',
        level: 'Foundation',
        prompt: 'What does MLA cache instead of full keys and values for every head?',
        choices: [
          'A compressed latent KV vector, plus a small positional key path in the decoupled RoPE design',
          'Only the final output logits for each token',
          'A copy of every query vector from previous tokens',
        ],
        answerIndex: 0,
        explanation: 'MLA changes the attention architecture so the cached content state is a latent bottleneck rather than expanded K/V heads.',
      },
      {
        id: 'mla-not-quantization',
        level: 'Foundation',
        prompt: 'Why is MLA different from ordinary KV-cache quantization?',
        choices: [
          'Quantization stores each number with fewer bits; MLA changes the architecture so fewer cached numbers exist',
          'MLA only changes the tokenizer precision',
          'Quantization and MLA are identical names for the same operation',
        ],
        answerIndex: 0,
        explanation: 'The important distinction is architectural compression versus lower-bit storage of the same tensor layout.',
      },
      {
        id: 'mla-gqa-expressiveness-risk',
        level: 'Mechanism',
        prompt: 'Why can GQA reduce head expressiveness?',
        choices: [
          'Heads inside a group share the same K/V source, so their key/value views are less independent',
          'GQA prevents query heads from using softmax',
          'GQA forces every layer to use the same residual stream',
        ],
        answerIndex: 0,
        explanation: 'Sharing saves memory, but it also ties multiple query heads to the same cached K/V representation.',
      },
      {
        id: 'mla-up-projection-expressiveness',
        level: 'Mechanism',
        prompt: 'How does MLA restore some per-head expressiveness?',
        choices: [
          'It up-projects the cached latent state through learned matrices into richer head-specific behavior',
          'It stores a separate full notebook for each head after all',
          'It removes all positional information from attention',
        ],
        answerIndex: 0,
        explanation: 'The low-rank latent is compact, but learned up-projections can create different effective views for different heads.',
      },
      {
        id: 'mla-core-tradeoff',
        level: 'Mechanism',
        prompt: 'What is the central MLA tradeoff?',
        choices: [
          'Lower KV-cache memory and bandwidth, with extra projection compute and implementation complexity',
          'Higher cache memory in exchange for deleting matrix multiplication',
          'Lower latency because no projections or cache reads remain',
        ],
        answerIndex: 0,
        explanation: 'MLA is a memory-bandwidth optimization that still has computational and kernel-design costs.',
      },
      {
        id: 'mla-absorption',
        level: 'Mechanism',
        prompt: 'What does projection absorption try to avoid?',
        choices: [
          'Materializing full expanded keys and values for every cached token',
          'Computing queries for the current token',
          'Storing the compressed latent content cache',
        ],
        answerIndex: 0,
        explanation: 'Linear maps can be regrouped so attention works against the latent cache rather than expanding every cached token first.',
      },
      {
        id: 'mla-rope-problem',
        level: 'Mechanism',
        prompt: 'Why does RoPE cause trouble for naive MLA absorption?',
        choices: [
          'RoPE is position-sensitive and can sit between linear maps that would otherwise be regrouped',
          'RoPE deletes the value vector before attention',
          'RoPE makes every head share a single query vector',
        ],
        answerIndex: 0,
        explanation: 'A position-dependent rotation does not freely commute with arbitrary projection matrices.',
      },
      {
        id: 'mla-decoupled-rope',
        level: 'Mechanism',
        prompt: 'What does decoupled RoPE do in MLA?',
        choices: [
          'It separates compressed content memory from a small positional RoPE key path',
          'It removes positions from all keys and queries',
          'It turns RoPE into a tokenizer rule',
        ],
        answerIndex: 0,
        explanation: 'DeepSeek-style MLA keeps content in the latent cache while positional information travels through a small separate path.',
      },
      {
        id: 'transmla-theorem',
        level: 'Application',
        prompt: 'What is TransMLA central expressiveness claim?',
        choices: [
          'At the same KV-cache overhead, MLA can represent GQA, but GQA cannot represent every MLA configuration',
          'GQA can represent all MLA configurations with no conversion',
          'MLA and GQA have identical parameter families under every rank',
        ],
        answerIndex: 0,
        explanation: 'The paper frames GQA as a special repeated structure that MLA can express through low-rank factorization.',
      },
      {
        id: 'transmla-repetition-factorization',
        level: 'Application',
        prompt: 'What repeated structure does TransMLA exploit?',
        choices: [
          'GQA repeats shared K/V heads across groups of query heads',
          'MHA repeats every query vector across all previous tokens',
          'RoPE repeats the same absolute position for every token',
        ],
        answerIndex: 0,
        explanation: 'The repeated GQA head structure can be moved into parameters and then factorized into a latent representation.',
      },
      {
        id: 'mla-bandwidth-long-context',
        level: 'Application',
        prompt: 'Why can memory bandwidth matter more than raw FLOPs during long-context decoding?',
        choices: [
          'Each generated token repeatedly reads a large KV cache from memory',
          'Long prompts prevent GPUs from doing matrix multiplication',
          'FLOPs are only used during training and never during inference',
        ],
        answerIndex: 0,
        explanation: 'Decode steps are sequential and must revisit the prefix cache, so cache traffic can dominate.',
      },
      {
        id: 'mla-same-cache-not-same-expressiveness',
        level: 'Tricky',
        prompt: 'Why does same KV-cache size not imply same expressiveness?',
        choices: [
          'Architectures can store the same number of cached values but transform them into attention behavior differently',
          'Cache size fully determines every model parameter',
          'Expressiveness only depends on the number of tokens in the prompt',
        ],
        answerIndex: 0,
        explanation: 'The cached width is only one constraint; the parameterization around that cache also matters.',
      },
      {
        id: 'transmla-practical-use',
        level: 'Interview',
        prompt: 'Why is TransMLA practically useful?',
        choices: [
          'It suggests a migration path for existing GQA models without training a fresh MLA model from scratch',
          'It proves KV cache memory no longer matters',
          'It removes the need to evaluate converted checkpoints',
        ],
        answerIndex: 0,
        explanation: 'A post-training conversion path is useful only if it preserves quality under evaluation while improving serving economics.',
      },
    ],
    labs: [
      {
        id: 'mini-mla-cache-sizing',
        title: 'Compute latent cache width',
        prompt: 'Open mini-mla/exercises/01_kv_cache_size.rs and implement the MHA, GQA, and MLA cache-size formulas.',
        successCriteria: 'The tests pass and you can explain why MLA uses latent_dim + rope_dim instead of 2 x heads x head_dim.',
      },
      {
        id: 'mini-mla-absorption-rope',
        title: 'Verify absorption and RoPE non-commutation',
        prompt: 'Complete mini-mla exercises 05 and 06, then explain why projection absorption works for adjacent linear maps but not through a position-dependent rotation.',
        successCriteria: 'The absorption equivalence test passes, and the rotation/scaling order test shows a nonzero difference.',
      },
      {
        id: 'mini-mla-transmla-factorization',
        title: 'Trace GQA repetition into MLA intuition',
        prompt: 'Complete mini-mla exercises 08 and 09, then describe how repeated GQA rows become a low-rank structure that TransMLA can factorize.',
        successCriteria: 'The repeated-head output and distinct-row count match the expected low-diversity structure.',
      },
    ],
  },
  'native-sparse-attention': {
    quiz: NATIVE_SPARSE_ATTENTION_QUIZ,
    labs: [
      {
        id: 'mini-nsa-block-window',
        title: 'Implement blocks and local windows',
        prompt: 'Open mini-native-sparse-attention exercises 01 and 02, then implement contiguous block ranges and sliding-window indices.',
        successCriteria: 'The block and window tests pass, and you can explain why NSA starts from contiguous regions.',
      },
      {
        id: 'mini-nsa-score-select',
        title: 'Score the map and select blocks',
        prompt: 'Complete exercises 03 through 06 to compress blocks, score compressed keys, choose top-k blocks, and expand them to token indices.',
        successCriteria: 'The tests pass and you can trace map scanning into fine-grained selection.',
      },
      {
        id: 'mini-nsa-gates-hardware',
        title: 'Merge branches and estimate memory',
        prompt: 'Complete exercises 07 through 10, then compare full attention tokens loaded with the toy NSA budget.',
        successCriteria: 'The gate, GQA sharing, memory estimate, and sparse-budget tests pass.',
      },
    ],
  },
  'spec-sparse-attention': {
    quiz: SPEC_SPARSE_ATTENTION_QUIZ,
    labs: [
      {
        id: 'mini-spec-sparse-prefix',
        title: 'Repair accepted-prefix logic',
        prompt: 'Open mini-spec-sparse/exercises/01_accept_prefix.rs and implement longest-prefix acceptance.',
        successCriteria: 'The prefix tests pass and you can explain why accepted length controls speculative speedup.',
      },
      {
        id: 'mini-spec-sparse-criticality',
        title: 'Build critical KV scores',
        prompt: 'Complete the average-logit and top-k exercises, then explain why Collect-2-Query uses boundary rows.',
        successCriteria: 'The selected top-k entries match the verification criticality scores.',
      },
      {
        id: 'mini-spec-sparse-schedule',
        title: 'Compare sparse verifier schedules',
        prompt: 'Complete overlap, exact merged schedule, shared-index, refresh/reuse, and planner exercises.',
        successCriteria: 'You can identify when exact reuse, approximate reuse, or more frequent refreshes should win.',
      },
    ],
  },
  turboquant: {
    quiz: TURBOQUANT_QUIZ,
    labs: [
      {
        id: 'mini-turboquant-cache-size',
        title: 'Compute KV-cache memory',
        prompt: 'Open mini-turboquant/exercises/01_kv_cache_size.rs and make the cache sizing and compression-ratio tests pass.',
        successCriteria: 'You include both K and V and can explain why context length and KV heads multiply memory.',
      },
      {
        id: 'mini-turboquant-dot-products',
        title: 'Compare MSE and dot-product error',
        prompt: 'Complete the quantization, dot-product, rotation, and MSE-vs-inner-product exercises.',
        successCriteria: 'You can show a small reconstruction error that still creates signed attention-score bias.',
      },
      {
        id: 'mini-turboquant-tradeoff',
        title: 'Plan a safe low-bit cache',
        prompt: 'Complete residual correction, outlier channels, top-k agreement, and compression tradeoff exercises.',
        successCriteria: 'You can choose the lowest bit-width that stays under a dot-product error budget.',
      },
    ],
  },
  'linear-regression': {
    quiz: LINEAR_REGRESSION_QUIZ,
    labs: [
      {
        id: 'move-line',
        title: 'Move the fitted line',
        prompt: 'Change the slope and intercept until residuals shrink, then identify which points still dominate the error.',
        successCriteria: 'You can name at least one point whose residual pulls the fitted line.',
      },
    ],
  },
  pca: {
    quiz: PCA_QUIZ,
    labs: [
      {
        id: 'projection-error',
        title: 'Compare one and two components',
        prompt: 'Switch between 1D and 2D projection, then identify when the 1D reconstruction loses the most information.',
        successCriteria: 'You can connect higher noise or weaker correlation to lower PC1 explained variance.',
      },
    ],
  },
  'fundamental-subspaces': {
    quiz: FUNDAMENTAL_SUBSPACES_QUIZ,
    labs: [
      {
        id: 'classify-four-spaces',
        title: 'Classify the four spaces',
        prompt: 'Choose one rank-nullity case and list each subspace, its ambient space, and its dimension.',
        successCriteria: 'Your dimensions satisfy n = rank + nullity and m = rank + left-nullity.',
      },
    ],
  },
  'least-squares-projection': {
    quiz: LEAST_SQUARES_PROJECTION_QUIZ,
    labs: [
      {
        id: 'compare-residual-cases',
        title: 'Compare residual cases',
        prompt: 'Switch between Nearly in Col(A), Far from Col(A), and Exactly consistent, then describe how b_hat and e change.',
        successCriteria: 'You can connect small, large, and zero residuals to distance from Col(A).',
      },
      {
        id: 'derive-normal-equation',
        title: 'Derive the normal equation',
        prompt: 'Start from e = b - A x_hat and A^T e = 0, then write the algebraic steps to A^T A x_hat = A^T b.',
        successCriteria: 'Your derivation explains why residual orthogonality creates the normal equations.',
      },
      {
        id: 'audit-fit-quality',
        title: 'Audit fit quality',
        prompt: 'Choose one active case and explain whether the fitted vector is exact, close, or weak by reading residual length and direction.',
        successCriteria: 'You can justify fit quality without confusing b, b_hat, and e.',
      },
    ],
  },
  pseudoinverse: {
    quiz: PSEUDOINVERSE_QUIZ,
    labs: [
      {
        id: 'compare-pseudoinverse-rank-modes',
        title: 'Compare rank modes',
        prompt: 'Switch between full column rank, full row rank, and rank deficient, then record the active formula and solution promise for each mode.',
        successCriteria: 'You can match unique least squares, minimum-norm exact solution, and SVD zero-skipping to the right rank condition.',
      },
      {
        id: 'trace-svd-pseudoinverse-flow',
        title: 'Trace the SVD flow',
        prompt: 'Follow the diagram from b through U^T b, Sigma+, V, and x+, explaining what each stage changes.',
        successCriteria: 'You can explain why Sigma+ rescales only supported singular directions before V maps back to input space.',
      },
      {
        id: 'audit-zero-singular-value',
        title: 'Audit zero singular values',
        prompt: 'Use the Practice Lab check and singular-direction bars to decide what happens when a singular value is zero.',
        successCriteria: 'You can state why zero singular values stay zero instead of becoming reciprocals.',
      },
    ],
  },
  'change-of-basis': {
    quiz: CHANGE_OF_BASIS_QUIZ,
    labs: [
      {
        id: 'compare-coordinate-recipes',
        title: 'Compare coordinate recipes',
        prompt: 'Switch between standard, tilted, and scaled bases, then record each basis vector pair, coordinate list, and displayed standard vector.',
        successCriteria: 'You can explain which numbers are basis coordinates and which numbers describe the standard vector.',
      },
      {
        id: 'trace-basis-matrix-map',
        title: 'Trace the basis matrix map',
        prompt: 'Pick one preset and compute x = B [x]_B by hand from the basis columns and coordinate entries.',
        successCriteria: 'Your weighted-sum calculation matches the standard vector displayed by the animation.',
      },
      {
        id: 'audit-operator-coordinates',
        title: 'Audit operator coordinates',
        prompt: 'Use A_B = B^-1 A B to explain the order of conversions when a linear map is written in B-coordinates.',
        successCriteria: 'You can state why the rightmost B acts first, A acts in standard coordinates, and B^-1 returns to B-coordinates.',
      },
    ],
  },
  'condition-number': {
    quiz: CONDITION_NUMBER_QUIZ,
    labs: [
      {
        id: 'compare-condition-presets',
        title: 'Compare condition presets',
        prompt: 'Switch between well-conditioned, sensitive, and near-singular presets, then record the major axis, minor axis, and displayed kappa value.',
        successCriteria: 'You can explain how major divided by minor produces the displayed stretch-spread ratio.',
      },
      {
        id: 'trace-error-amplification',
        title: 'Trace error amplification',
        prompt: 'Use the unit-circle-to-ellipse view to identify which direction is most fragile and why small perturbations can grow after inversion.',
        successCriteria: 'You can connect the smallest singular direction to inverse sensitivity and fragile solution error.',
      },
      {
        id: 'audit-stability-response',
        title: 'Audit stability response',
        prompt: 'Given a large kappa or sigma_min near zero, choose a response such as scaling, QR/SVD, regularization, or pseudoinverse handling.',
        successCriteria: 'You can avoid residual-only and normal-equations shortcuts when the system is ill conditioned.',
      },
    ],
  },
  'determinant-volume': {
    quiz: DETERMINANT_VOLUME_QUIZ,
    labs: [
      {
        id: 'compare-determinant-presets',
        title: 'Compare determinant presets',
        prompt: 'Switch through positive scale, orientation flip, and collapse, then record the two column vectors, det(A), |det A|, and sign label.',
        successCriteria: 'You can connect each preset to area scale, orientation, or collapse.',
      },
      {
        id: 'compute-signed-area',
        title: 'Compute signed area',
        prompt: 'Pick one preset and compute det(a,b) = a_x*b_y - a_y*b_x from the displayed column vectors.',
        successCriteria: 'Your arithmetic matches the determinant and sign shown by the animation.',
      },
      {
        id: 'audit-invertibility-collapse',
        title: 'Audit invertibility collapse',
        prompt: 'Use the Practice Lab to explain why det(A) = 0 collapses the unit square to a line or point and blocks invertibility.',
        successCriteria: 'You can distinguish zero determinant collapse from negative determinant orientation reversal.',
      },
    ],
  },
  'projection-matrices': {
    quiz: PROJECTION_MATRICES_QUIZ,
    labs: [
      {
        id: 'trace-projection-geometry',
        title: 'Trace projection geometry',
        prompt: 'Switch between x high, x low, and already projected, then explain where x, Px, the residual, and the target subspace appear.',
        successCriteria: 'You can identify the vector before projection, the projected point, and the leftover component.',
      },
      {
        id: 'test-projection-idempotence',
        title: 'Test projection idempotence',
        prompt: 'Use the rule P^2 = P and the Practice Lab reveal to explain why P(Px) equals Px.',
        successCriteria: 'You can explain why applying P again changes nothing after the first projection lands on the subspace.',
      },
      {
        id: 'connect-projection-code',
        title: 'Connect projection code',
        prompt: 'Relate the outer-product, matvec, and project-twice code labs to the animation\'s P, x, Px, and idempotence labels.',
        successCriteria: 'You can build a projection matrix for a unit direction, apply it to a vector, and verify the second application is unchanged.',
      },
    ],
  },
  'low-rank-approximation': {
    quiz: LOW_RANK_APPROXIMATION_QUIZ,
    labs: [
      {
        id: 'compare-rank-k-slider',
        title: 'Compare rank-k choices',
        prompt: 'Move k from 1 through 5, then record which singular values are kept, which are dropped, and how retained energy changes.',
        successCriteria: 'You can explain the compression-error tradeoff as k rises.',
      },
      {
        id: 'trace-rank-k-reconstruction',
        title: 'Trace a rank-k reconstruction',
        prompt: 'Use the A, A_k, and A - A_k panels to describe what the reconstruction keeps and what the residual contains.',
        successCriteria: 'You can connect the matrix panels to kept singular components and omitted structure.',
      },
      {
        id: 'verify-low-rank-code',
        title: 'Verify low-rank code',
        prompt: 'Relate rankOneEntry, rankOneMatrix, and frobeniusErrorSquared to the formula A_k = sum sigma_i u_i v_i^T.',
        successCriteria: 'You can build scaled rank-1 terms and measure squared reconstruction error.',
      },
    ],
  },
  eigenvalue: {
    quiz: EIGENVALUE_QUIZ,
    labs: [
      {
        id: 'trace-eigenvalue-equation',
        title: 'Trace the eigenvalue equation',
        prompt: 'Walk through the tutorial from v to Av to Av = lambda v, explaining why eigenvectors keep direction while ordinary vectors rotate.',
        successCriteria: 'You can distinguish most transformed vectors from eigenvectors and state the role of lambda.',
      },
      {
        id: 'explore-eigenvector-alignment',
        title: 'Explore eigenvector alignment',
        prompt: 'Use the geometric and interactive tabs to compare the unit circle, transformed ellipse, v, Av, and the two eigenvector directions.',
        successCriteria: 'You can explain why the ellipse axes and the drag alignment reveal the eigenvectors and eigenvalues.',
      },
      {
        id: 'verify-eigenvalue-code',
        title: 'Verify eigenvalue code',
        prompt: 'Relate the Rayleigh numerator, Rayleigh quotient, and power iteration code labs to directional scaling and dominant eigenvector search.',
        successCriteria: 'You can compute directional scale and explain why power iteration applies A then normalizes.',
      },
    ],
  },
  'matrix-decompositions': {
    quiz: MATRIX_DECOMPOSITIONS_QUIZ,
    labs: [
      {
        id: 'choose-by-goal',
        title: 'Choose by the job',
        prompt: 'Pick three scenarios from the chooser and write the factorization, its requirement, and one warning.',
        successCriteria: 'Your selections are justified by the task and include at least one assumption or stability caveat.',
      },
    ],
  },
  'qr-decomposition': {
    quiz: QR_DECOMPOSITION_QUIZ,
    labs: [
      {
        id: 'trace-projection-removal',
        title: 'Trace projection removal',
        prompt: 'Follow the animation through the second Gram-Schmidt step and identify the projection that is removed.',
        successCriteria: 'You can explain how q2 becomes orthogonal to q1 and where R stores the projection coefficient.',
      },
      {
        id: 'verify-qr-structure',
        title: 'Verify QR structure',
        prompt: 'Use the animation to check A = QR, Q^T Q = I, and R upper triangular for the 2 by 2 example.',
        successCriteria: 'You can point to the orthonormal Q factor, the upper-triangular R factor, and the product that reconstructs A.',
      },
      {
        id: 'connect-qr-least-squares',
        title: 'Connect QR to least squares',
        prompt: 'Use the Practice Lab and assessment scenarios to explain why QR solves tall least-squares problems without forming A^T A.',
        successCriteria: 'You can describe the path from Q^T b to a triangular R solve and name the stability warning for normal equations.',
      },
    ],
  },
  svd: {
    quiz: SVD_QUIZ,
    labs: [
      {
        id: 'trace-svd-factor-flow',
        title: 'Trace the factor flow',
        prompt: 'Use the animation to identify A, U, Sigma, and V^T, including their shapes and the reconstruction order U Sigma V^T.',
        successCriteria: 'You can explain which factor supplies output directions, stretches, input directions, and how they multiply back to A.',
      },
      {
        id: 'verify-singular-values',
        title: 'Verify singular values',
        prompt: 'Use the animation and Practice Lab to explain why singular values are nonnegative, ordered, and easy to read for the diagonal practice matrices.',
        successCriteria: 'You can connect Sigma in the animation to the practice steps sigma1 >= sigma2 >= 0.',
      },
      {
        id: 'connect-svd-uses',
        title: 'Connect SVD uses',
        prompt: 'Relate PCA, pseudoinverse, conditioning, and truncated SVD scenarios to the same U, Sigma, and V^T factor roles.',
        successCriteria: 'You can choose the relevant SVD output or singular-value behavior for compression, stability, rank, and PCA.',
      },
    ],
  },
  'k-means': {
    quiz: KMEANS_QUIZ,
    labs: [
      {
        id: 'k-vs-inertia',
        title: 'Compare k and inertia',
        prompt: 'Change k and the number of iterations, then describe when lower inertia starts splitting a natural group.',
        successCriteria: 'You can explain why inertia alone cannot choose the best k.',
      },
      {
        id: 'trace-assign-update-loop',
        title: 'Trace assign and update',
        prompt: 'Use the plotted points to follow one assignment/update cycle: nearest centroid assignment, mean update, and new inertia.',
        successCriteria: 'You can identify which centroid a point belongs to and why the centroid moves toward assigned points.',
      },
      {
        id: 'stress-test-cluster-assumptions',
        title: 'Stress-test assumptions',
        prompt: 'Use the lesson warnings to name one scaling issue, one initialization issue, and one cluster-shape issue before trusting a segmentation.',
        successCriteria: 'You can separate a lower objective value from validated, useful clusters.',
      },
    ],
  },
  'bayes-rule-ml': {
    quiz: BAYES_RULE_QUIZ,
    labs: [
      {
        id: 'decompose-positive-signal',
        title: 'Decompose one alert',
        prompt: 'Use the population bars to separate true-positive mass, false-positive mass, and total positive evidence.',
        successCriteria: 'You can explain the posterior as true positives divided by all positive signals.',
      },
      {
        id: 'rare-class-posterior',
        title: 'Audit a rare-class signal',
        prompt: 'Set a low base rate, then lower the false positive rate until the posterior becomes useful.',
        successCriteria: 'You can explain why evidence quality matters more when the class is rare.',
      },
      {
        id: 'threshold-cost-check',
        title: 'Check the action threshold',
        prompt: 'Move the useful threshold and compare when a posterior should trigger action under different false-alarm costs.',
        successCriteria: 'You can connect posterior probability to a decision threshold instead of treating 50 percent as universal.',
      },
    ],
  },
  'sampling-confidence-intervals': {
    quiz: SAMPLING_CONFIDENCE_INTERVALS_QUIZ,
    labs: [
      {
        id: 'coverage-procedure-demo',
        title: 'Trace long-run coverage',
        prompt: 'Increase repeated samples and count which intervals capture or miss the fixed population rate.',
        successCriteria: 'You can explain coverage as a property of the repeated procedure, not a probability for one fixed interval.',
      },
      {
        id: 'sample-size-sweep',
        title: 'Sweep sample size',
        prompt: 'Increase sample size from small to large and track how quickly the interval width shrinks.',
        successCriteria: 'You can explain why quadrupling sample size is closer to halving the margin than quartering it.',
      },
      {
        id: 'assumption-audit-interval',
        title: 'Audit interval assumptions',
        prompt: 'Use a wide, clustered, or skewed scenario and name the design or method assumption that must be checked.',
        successCriteria: 'You can separate interval width from bias, dependence, model assumptions, and method choice.',
      },
    ],
  },
  'hypothesis-testing-intuition': {
    quiz: HYPOTHESIS_TESTING_INTUITION_QUIZ,
    labs: [
      {
        id: 'trace-signal-noise',
        title: 'Trace signal versus noise',
        prompt: 'Move effect size and variability, then explain how the test statistic changes before reading the p-value.',
        successCriteria: 'You can connect observed effect, standard error, and null-distribution surprise.',
      },
      {
        id: 'tiny-effect-large-sample',
        title: 'Find a tiny significant effect',
        prompt: 'Use a small effect with a large sample and explain why the evidence can look strong while the effect remains small.',
        successCriteria: 'You can separate statistical evidence from practical impact.',
      },
      {
        id: 'audit-testing-protocol',
        title: 'Audit the test protocol',
        prompt: 'Choose a peeking, multiple-testing, one-sided, or nonrandomized scenario and identify the broken testing assumption.',
        successCriteria: 'You can name the error path and the predeclared design or reporting fix.',
      },
    ],
  },
  'ab-testing-foundations': {
    quiz: AB_TESTING_FOUNDATIONS_QUIZ,
    labs: [
      {
        id: 'randomization-balance-audit',
        title: 'Audit randomization balance',
        prompt: 'Create a treatment/control split, then explain what assignment unit, eligibility, and balance checks must be valid before reading lift.',
        successCriteria: 'You can separate randomized design validity from the observed metric result.',
      },
      {
        id: 'ab-decision-audit',
        title: 'Audit an A/B decision',
        prompt: 'Build a scenario where a treatment improves the primary metric but fails a guardrail. Explain the launch decision.',
        successCriteria: 'You can explain assignment, metric, guardrail, and decision threshold separately.',
      },
      {
        id: 'experiment-validity-debug',
        title: 'Debug a suspicious result',
        prompt: 'Choose SRM, peeking, metric shopping, unit mismatch, logging failure, or interference and explain why it threatens the readout.',
        successCriteria: 'You can name the failure mode, the assumption it breaks, and the next diagnostic check.',
      },
    ],
  },
  'power-sample-size': {
    quiz: POWER_SAMPLE_SIZE_QUIZ,
    labs: [
      {
        id: 'mde-sample-sensitivity',
        title: 'Map MDE to sample needs',
        prompt: 'Set two MDE values for the same baseline and variance, then explain why the smaller target needs disproportionately more sample.',
        successCriteria: 'You can connect MDE, standard error, and the square-root sample-size relationship.',
      },
      {
        id: 'underpowered-design-audit',
        title: 'Diagnose an underpowered test',
        prompt: 'Create an underpowered design and explain why the readout is not decisive.',
        successCriteria: 'You can name the MDE, planned sample, power, and false negative risk.',
      },
      {
        id: 'validity-aware-power-readout',
        title: 'Audit power assumptions',
        prompt: 'Choose imbalance, clustering, missingness, noisy guardrails, or an abnormal calendar window and explain how it changes the power readout.',
        successCriteria: 'You can separate nominal planned N from effective information and design validity.',
      },
    ],
  },
  'sequential-testing-peeking': {
    quiz: SEQUENTIAL_TESTING_PEEKING_QUIZ,
    labs: [
      {
        id: 'peeking-policy-comparison',
        title: 'Compare peeking policies',
        prompt: 'Set many interim looks and compare naive false positive risk with the planned alpha budget.',
        successCriteria: 'You can explain why any-look risk exceeds a single fixed-horizon alpha.',
      },
      {
        id: 'boundary-decision-check',
        title: 'Apply an interim boundary',
        prompt: 'Pick an interim p-value that beats 0.05 but misses the sequential boundary, then explain the correct continue-or-stop decision.',
        successCriteria: 'You can distinguish fixed-horizon thresholds from planned sequential stopping rules.',
      },
      {
        id: 'sequential-readout-audit',
        title: 'Audit a sequential readout',
        prompt: 'Write a readout for an early stop that includes look number, boundary, alpha spending, uncertainty, guardrails, and reporting caveats.',
        successCriteria: 'You can report the monitoring procedure without treating the smallest p-value as the whole result.',
      },
    ],
  },
  'cuped-variance-reduction': {
    quiz: CUPED_VARIANCE_REDUCTION_QUIZ,
    labs: [
      {
        id: 'pre-period-signal-audit',
        title: 'Find useful pre-period signal',
        prompt: 'Increase pre/post correlation and explain how CUPED narrows the confidence interval.',
        successCriteria: 'You can connect correlation, standard error, and interval width.',
      },
      {
        id: 'covariate-validity-debug',
        title: 'Debug covariate validity',
        prompt: 'Compare a pre-treatment covariate with a treatment-affected covariate and explain which adjustment is valid for the causal target.',
        successCriteria: 'You can reject post-treatment adjustment even when it predicts the outcome.',
      },
      {
        id: 'cuped-readout-audit',
        title: 'Audit a CUPED readout',
        prompt: 'Write a readout that includes raw and adjusted effects, interval width, variance reduction, covariate timing, missingness, and decision caveats.',
        successCriteria: 'You can report precision gains without hiding assumptions or practical significance.',
      },
    ],
  },
  'confounding-simpsons-paradox': {
    quiz: CONFOUNDING_SIMPSONS_PARADOX_QUIZ,
    labs: [
      {
        id: 'simpson-reversal-audit',
        title: 'Create a Simpson reversal',
        prompt: 'Change segment mix until the aggregate effect disagrees with the within-segment effect.',
        successCriteria: 'You can explain why the aggregate and segment effects point different ways.',
      },
      {
        id: 'like-with-like-adjustment',
        title: 'Compare like with like',
        prompt: 'Use segment-level rates and common weights to separate treatment effect from group mix.',
        successCriteria: 'You can explain how standardization changes the readout without hiding the crude result.',
      },
      {
        id: 'confounding-readout-audit',
        title: 'Audit a confounding readout',
        prompt: 'Write a readout that includes crude and adjusted effects, segment weights, overlap, balance, timing, and sensitivity caveats.',
        successCriteria: 'You can make a cautious causal claim only when the adjustment evidence supports it.',
      },
    ],
  },
  'causal-graphs-dags': {
    quiz: CAUSAL_GRAPHS_DAGS_QUIZ,
    labs: [
      {
        id: 'adjustment-set-repair',
        title: 'Repair an adjustment set',
        prompt: 'Increase collider conditioning and explain why the adjustment set gets worse.',
        successCriteria: 'You can classify a variable as confounder, collider, or mediator.',
      },
      {
        id: 'backdoor-set-audit',
        title: 'Audit a backdoor set',
        prompt: 'Choose variables that close open backdoor paths while leaving mediators and colliders out of the total-effect adjustment.',
        successCriteria: 'You can justify an adjustment set from graph structure instead of correlation strength.',
      },
      {
        id: 'dag-readout-audit',
        title: 'Audit a DAG readout',
        prompt: 'Write a readout with treatment, outcome, graph assumptions, estimand, adjustment set, avoided controls, diagnostics, and sensitivity caveats.',
        successCriteria: 'You can report DAG-based evidence without implying the graph proves its assumptions.',
      },
    ],
  },
  'treatment-effects': {
    quiz: TREATMENT_EFFECTS_QUIZ,
    labs: [
      {
        id: 'rollout-policy-comparison',
        title: 'Compare rollout policies',
        prompt: 'Create a scenario with positive ATE and one harmed segment. Explain the rollout implication.',
        successCriteria: 'You can explain when targeted treatment beats treating everyone.',
      },
      {
        id: 'segment-effect-audit',
        title: 'Audit segment effects',
        prompt: 'Compute how high-response share, high CATE, and low CATE combine into ATE, then identify which segment drives the rollout risk.',
        successCriteria: 'You can connect segment shares, CATE spread, and average effect without treating the average as universal.',
      },
      {
        id: 'uplift-policy-readout',
        title: 'Write an uplift policy readout',
        prompt: 'Draft a readout with estimand, planned segments, uncertainty, costs, guardrails, and treat-all/treat-none comparison.',
        successCriteria: 'You can turn heterogeneous treatment effects into an auditable targeting recommendation.',
      },
    ],
  },
  'propensity-scores': {
    quiz: PROPENSITY_SCORES_QUIZ,
    labs: [
      {
        id: 'observational-support-audit',
        title: 'Audit observational support',
        prompt: 'Lower overlap or raise hidden bias and explain why the estimate becomes fragile.',
        successCriteria: 'You can identify overlap, balance, and unmeasured-confounding limits.',
      },
      {
        id: 'matching-weighting-diagnostic',
        title: 'Diagnose matching and weighting',
        prompt: 'Compare a matched design and an IPW design, then explain how overlap, balance, and extreme weights change credibility.',
        successCriteria: 'You can judge propensity designs by diagnostics instead of treatment-model accuracy alone.',
      },
      {
        id: 'propensity-report-audit',
        title: 'Audit a propensity report',
        prompt: 'Write a report with estimand, pre-treatment covariates, score model, support restrictions, balance checks, weight diagnostics, and hidden-bias caveats.',
        successCriteria: 'You can present an observational estimate without implying propensity scores prove causality.',
      },
    ],
  },
  'time-series-forecasting-track': {
    quiz: TIME_SERIES_FORECASTING_QUIZ,
    labs: [
      {
        id: 'time-series-forecasting-track-scenario-lab',
        title: 'Audit a forecasting backtest',
        prompt: 'Create a forecast setup with future leakage and explain how rolling splits fix it.',
        successCriteria: 'You can identify the horizon, lag features, split design, and leakage boundary.',
      },
      {
        id: 'forecast-feature-contract',
        title: 'Write a feature contract',
        prompt: 'Define prediction time, horizon, shifted lag features, rolling statistics, calendar inputs, and exogenous variables for one forecast.',
        successCriteria: 'You can reject any feature whose value would not be available at the cutoff.',
      },
      {
        id: 'forecast-monitoring-plan',
        title: 'Plan forecast monitoring',
        prompt: 'Use rolling-backtest behavior to choose horizon metrics, a naive baseline, interval coverage checks, drift checks, and data-freshness alerts.',
        successCriteria: 'You can connect validation evidence to production monitoring without tuning on the final test period.',
      },
    ],
  },
  'recommender-systems-ranking-track': {
    quiz: RECOMMENDER_SYSTEMS_RANKING_QUIZ,
    labs: [
      {
        id: 'recommender-systems-ranking-track-scenario-lab',
        title: 'Design a ranking readout',
        prompt: 'Build a cold-start scenario and choose a hybrid or exploration strategy.',
        successCriteria: 'You can separate prediction, ordering, exposure, and exploration concerns.',
      },
      {
        id: 'ranking-metric-audit',
        title: 'Audit ranking metrics',
        prompt: 'Compare precision@k, recall@k, MRR, nDCG, coverage, diversity, novelty, and slice metrics for one recommender launch.',
        successCriteria: 'You can explain why ordered-list quality and product guardrails require more than click accuracy.',
      },
      {
        id: 'feedback-loop-guardrails',
        title: 'Plan feedback guardrails',
        prompt: 'Trace how exposure bias, position bias, cold start, exploration budget, and online-test guardrails change future training data.',
        successCriteria: 'You can identify when offline gains need online validation before changing what users and creators see.',
      },
    ],
  },
  'ml-security-robustness-track': {
    quiz: ML_SECURITY_ROBUSTNESS_QUIZ,
    labs: [
      {
        id: 'ml-security-robustness-track-scenario-lab',
        title: 'Map one ML threat',
        prompt: 'Choose a prompt-injection or poisoning scenario and define a defense plus an eval.',
        successCriteria: 'You can name an attack, impacted asset, control, and evaluation.',
      },
      {
        id: 'rag-tool-threat-model',
        title: 'Threat-model RAG tools',
        prompt: 'Map assets, attackers, trust boundaries, retrieved content, tool permissions, approval gates, and audit logs for a RAG assistant.',
        successCriteria: 'You can separate untrusted content from instructions and match high-impact tools to controls.',
      },
      {
        id: 'security-regression-plan',
        title: 'Plan regression checks',
        prompt: 'Build a small release checklist with adversarial evals, privacy leak tests, poisoning checks, false-positive review, monitoring, and rollback criteria.',
        successCriteria: 'You can explain why average helpfulness or a single prompt rule is not enough for release readiness.',
      },
    ],
  },
  'efficient-inference-compression-track': {
    quiz: EFFICIENT_INFERENCE_COMPRESSION_QUIZ,
    labs: [
      {
        id: 'efficient-inference-compression-track-scenario-lab',
        title: 'Tune a serving tradeoff',
        prompt: 'Create a high-throughput but high-latency scenario and explain the tradeoff.',
        successCriteria: 'You can explain which bottleneck is addressed by batching, quantization, or paged attention.',
      },
      {
        id: 'prefill-decode-profile',
        title: 'Profile prefill and decode',
        prompt: 'Compare a long-prompt short-answer workload with a short-prompt long-answer workload using TTFT, TPOT, KV cache, and memory headroom.',
        successCriteria: 'You can identify whether prefill, decode bandwidth, cache capacity, or queueing is the limiting factor.',
      },
      {
        id: 'compression-release-gate',
        title: 'Gate a compression release',
        prompt: 'Choose quantization, pruning, distillation, or speculation for one measured bottleneck and define latency, cost, memory, quality, monitoring, and rollback checks.',
        successCriteria: 'You can reject an optimization that improves one benchmark while breaking SLOs or task quality.',
      },
    ],
  },
  'data-engineering-for-ml-track': {
    quiz: DATA_ENGINEERING_FOR_ML_QUIZ,
    labs: [
      {
        id: 'data-engineering-for-ml-track-scenario-lab',
        title: 'Audit point-in-time correctness',
        prompt: 'Create a label-window or target-encoding leakage scenario and define the fix.',
        successCriteria: 'You can identify prediction time, feature time, label window, and serving parity.',
      },
      {
        id: 'feature-availability-contract',
        title: 'Write a feature contract',
        prompt: 'Define prediction time, feature time, availability time, label window, point-in-time joins, and freshness checks for one ML pipeline.',
        successCriteria: 'You can reject a feature or aggregate that would not be available at the prediction cutoff.',
      },
      {
        id: 'train-serve-parity-audit',
        title: 'Audit train/serve parity',
        prompt: 'Compare offline and online feature definitions, target encoding fit scope, null-rate/range checks, data owners, monitoring, and rollback steps.',
        successCriteria: 'You can explain how contracts, parity tests, lineage, and rollback prevent silent production data failures.',
      },
    ],
  },
  'spearman-correlation': {
    quiz: SPEARMAN_CORRELATION_QUIZ,
    labs: [
      {
        id: 'rank-before-score',
        title: 'Rank before scoring',
        prompt: 'Use the calculation tab to rank X and Y, then predict the sign and size of rho before revealing the formula.',
        successCriteria: 'You can explain whether rho changed because the order changed or because raw values moved farther apart.',
      },
      {
        id: 'outlier-rank-audit',
        title: 'Audit outlier robustness',
        prompt: 'Use the robustness tab to move an outlier, then explain when Spearman stays stable and when rank order changes make it drop.',
        successCriteria: 'You can separate magnitude-only outlier effects from rank-changing outlier effects.',
      },
      {
        id: 'spearman-report-check',
        title: 'Check a Spearman report',
        prompt: 'Write a short report with variables, unit of analysis, monotonicity check, tie handling, scatterplot readout, uncertainty, and non-causal caveat.',
        successCriteria: 'You can interpret rho without implying linearity, raw effect size, or causation.',
      },
    ],
  },
  'maximum-likelihood-estimation': {
    quiz: MAXIMUM_LIKELIHOOD_ESTIMATION_QUIZ,
    labs: [
      {
        id: 'candidate-parameter-sweep',
        title: 'Sweep candidate parameters',
        prompt: 'Move the candidate probability across the observed rate and watch relative likelihood rise and fall.',
        successCriteria: 'You can identify the candidate closest to the maximum likelihood estimate.',
      },
      {
        id: 'likelihood-curve-diagnostic',
        title: 'Diagnose a likelihood curve',
        prompt: 'Compare a broad and sharp likelihood curve, then explain what sample size, candidate fit, and model assumptions imply about uncertainty.',
        successCriteria: 'You can interpret likelihood shape without claiming the model family is proven true.',
      },
      {
        id: 'mle-report-audit',
        title: 'Audit an MLE report',
        prompt: 'Write a report with data, assumed family, likelihood or NLL, MLE, relative likelihood, diagnostics, validation, and caveats.',
        successCriteria: 'You can present an MLE fit without confusing likelihood with posterior probability or production validity.',
      },
    ],
  },
  'loss-functions-likelihoods': {
    quiz: LOSS_FUNCTIONS_LIKELIHOODS_QUIZ,
    labs: [
      {
        id: 'match-loss-to-noise',
        title: 'Match losses to assumptions',
        prompt: 'Compare regression error and true-class probability, then name the likelihood assumption behind each loss.',
        successCriteria: 'You can connect squared error to Gaussian noise and cross-entropy to categorical likelihood.',
      },
      {
        id: 'outlier-and-confidence-diagnostic',
        title: 'Diagnose loss sensitivity',
        prompt: 'Add a regression outlier or flip an ambiguous class label, then compare squared error, absolute error, cross-entropy, and accuracy-style penalties.',
        successCriteria: 'You can explain which loss reacts most and why that follows from the target or noise assumption.',
      },
      {
        id: 'loss-selection-report',
        title: 'Audit a loss choice',
        prompt: 'Write a loss-selection report with target type, prediction form, likelihood assumption, optimization objective, metric alignment, diagnostics, and tradeoffs.',
        successCriteria: 'You can justify a loss without claiming training loss alone proves production quality.',
      },
    ],
  },
  'cross-entropy': {
    quiz: CROSS_ENTROPY_QUIZ,
    labs: [
      {
        id: 'match-true-class-probability',
        title: 'Move the true-class probability',
        prompt: 'Adjust the predicted probability for the true class, then explain why the loss shrinks as that probability rises and grows sharply near zero.',
        successCriteria: 'You can connect the one-hot target to the selected predicted probability and the negative log penalty.',
      },
    ],
  },
  'train-validation-test-split': {
    quiz: TRAIN_VALIDATION_TEST_SPLIT_QUIZ,
    labs: [
      {
        id: 'map-split-roles',
        title: 'Map split roles',
        prompt: 'Use the split controls to name what training, validation, and test data are allowed to influence in a model workflow.',
        successCriteria: 'You can state that training fits parameters, validation guides development choices, and test gives the final untouched estimate.',
      },
      {
        id: 'spot-leakage-path',
        title: 'Spot a leakage path',
        prompt: 'Move the split controls and explain one way preprocessing before splitting could leak information.',
        successCriteria: 'Your example names what statistic or label information crosses the split boundary.',
      },
      {
        id: 'choose-safe-split-unit',
        title: 'Choose the split unit',
        prompt: 'Compare random, grouped, and time-aware split choices for repeated users, patients, sessions, or forecasting rows.',
        successCriteria: 'You can name the entity or chronology that must stay separated to keep evaluation honest.',
      },
    ],
  },
  'cross-validation': {
    quiz: CROSS_VALIDATION_QUIZ,
    labs: [
      {
        id: 'trace-fold-rotation',
        title: 'Trace fold rotation',
        prompt: 'Change the fold count and explain how each fold takes one validation turn while the remaining folds train.',
        successCriteria: 'You can connect the mean and spread of fold scores to repeated held-out evaluations.',
      },
      {
        id: 'choose-fold-design',
        title: 'Choose a leakage-safe fold design',
        prompt: 'Use the fold controls to compare random and grouped splitting, then explain which one is safer for repeated users or related samples.',
        successCriteria: 'You can name the leakage route and justify the fold design that blocks it.',
      },
      {
        id: 'audit-fold-pipeline',
        title: 'Audit fold-local fitting',
        prompt: 'Turn on the leakage control and describe why preprocessing, feature selection, or encoders must be fitted inside each fold.',
        successCriteria: 'You can name which learned state would leak if it were fit globally before cross-validation.',
      },
    ],
  },
  'data-leakage-deep-dive': {
    quiz: DATA_LEAKAGE_DEEP_DIVE_QUIZ,
    labs: [
      {
        id: 'trace-information-boundary',
        title: 'Trace an information boundary',
        prompt: 'Select a leakage mode and name the information source, the boundary it crosses, and the decision it changes.',
        successCriteria: 'You can explain why the leaked signal would not be available under the real prediction protocol.',
      },
      {
        id: 'leakage-mode-audit',
        title: 'Audit one leakage mode',
        prompt: 'Select each leakage mode and state the boundary being crossed and the safer split or pipeline rule.',
        successCriteria: 'You can name the leaked information and the concrete prevention rule for at least three modes.',
      },
      {
        id: 'choose-boundary-safe-fix',
        title: 'Choose a boundary-safe fix',
        prompt: 'For a target, duplicate, time, preprocessing, or test-peeking leak, choose the split, cutoff, or pipeline rule that blocks it.',
        successCriteria: 'You can pair each leakage path with a concrete prevention rule instead of only saying the score is suspicious.',
      },
    ],
  },
  'feature-scaling-preprocessing': {
    quiz: FEATURE_SCALING_PREPROCESSING_QUIZ,
    labs: [
      {
        id: 'compare-scaler-statistics',
        title: 'Name the fitted statistics',
        prompt: 'Compare standard, min-max, and robust scaling, then name the training statistic each one stores.',
        successCriteria: 'You can connect mean, standard deviation, minimum, maximum, median, and IQR to the matching scaler.',
      },
      {
        id: 'outlier-scaler-comparison',
        title: 'Compare scaler sensitivity',
        prompt: 'Toggle the outlier and compare standard, min-max, and robust scaling on the same selected point.',
        successCriteria: 'You can explain which scaler moved most and why robust scaling is less sensitive to one extreme value.',
      },
      {
        id: 'audit-train-only-pipeline',
        title: 'Audit train-only fitting',
        prompt: 'Trace a split or cross-validation workflow and mark where each scaler, imputer, or encoder is allowed to fit.',
        successCriteria: 'You can keep fitted preprocessing inside training folds and apply it to held-out rows without refitting.',
      },
    ],
  },
  'logistic-regression': {
    quiz: LOGISTIC_REGRESSION_QUIZ,
    labs: [
      {
        id: 'threshold-flips',
        title: 'Find threshold flips',
        prompt: 'Move the threshold and identify which points change class first.',
        successCriteria: 'You can explain each flip by comparing its probability with the threshold.',
      },
      {
        id: 'logit-coefficient-audit',
        title: 'Audit logits and coefficients',
        prompt: 'Change weights and bias, then explain how each feature changes the logit, sigmoid score, and linear boundary.',
        successCriteria: 'You can interpret coefficients as logit or log-odds effects without treating them as automatic causal effects.',
      },
      {
        id: 'threshold-calibration-report',
        title: 'Report threshold readiness',
        prompt: 'Write a short deployment note with validation loss, score distribution, calibration check, threshold policy, and expected cost tradeoff.',
        successCriteria: 'You can separate fitted probabilities from the decision threshold and justify the cutoff with validation evidence.',
      },
    ],
  },
  'classification-metrics': {
    quiz: CLASSIFICATION_METRICS_QUIZ,
    labs: [
      {
        id: 'threshold-counts',
        title: 'Trace the confusion matrix',
        prompt: 'Move the threshold and predict which count changes before reading the metric tiles.',
        successCriteria: 'You can connect at least one threshold move to TP, FP, FN, or TN.',
      },
      {
        id: 'metric-denominator-audit',
        title: 'Audit metric denominators',
        prompt: 'Given confusion counts, compute accuracy, precision, recall, specificity, FPR, FNR, and F1 while naming each denominator.',
        successCriteria: 'You can explain which group each metric conditions on and catch zero-denominator cases.',
      },
      {
        id: 'cost-and-slice-report',
        title: 'Report cost-sensitive metrics',
        prompt: 'Choose metrics for an imbalanced task, then report threshold, positive class, confusion counts, slice metrics, costs, and held-out evaluation caveats.',
        successCriteria: 'You can justify metric priorities without relying on accuracy alone or tuning on the final test set.',
      },
    ],
  },
  'roc-pr-curves': {
    quiz: ROC_PR_CURVES_QUIZ,
    labs: [
      {
        id: 'threshold-costs',
        title: 'Choose an operating threshold',
        prompt: 'Move the threshold and pick a cutoff for a case where false negatives are more expensive than false positives.',
        successCriteria: 'You can justify the threshold using recall, precision, and the mistake costs.',
      },
      {
        id: 'roc-pr-denominator-audit',
        title: 'Audit curve denominators',
        prompt: 'For a chosen threshold, compute TPR, FPR, precision, and recall from confusion counts, then place the same point on ROC and PR axes.',
        successCriteria: 'You can name each denominator and explain why ROC and PR emphasize different error populations.',
      },
      {
        id: 'rare-positive-report',
        title: 'Report rare-positive tradeoffs',
        prompt: 'Given rare-event scores, compare ROC AUC with PR behavior, choose an operating region, convert rates to counts, and state prevalence and final-test caveats.',
        successCriteria: 'You can avoid treating global AUC as a threshold, a calibration proof, or a complete alert-quality story.',
      },
    ],
  },
  calibration: {
    quiz: CALIBRATION_QUIZ,
    labs: [
      {
        id: 'reliability-gap',
        title: 'Find the largest reliability gap',
        prompt: 'Switch between calibrated, overconfident, and underconfident modes, then identify the bucket with the largest gap.',
        successCriteria: 'You can compare predicted probability with observed positive rate and describe the calibration error.',
      },
      {
        id: 'binning-and-ece-audit',
        title: 'Audit binning and ECE',
        prompt: 'Given probability buckets, compute observed rates, reliability gaps, ECE contributions, Brier score intuition, and uncertainty caveats for sparse bins.',
        successCriteria: 'You can explain how binning choices and sample size affect calibration summaries.',
      },
      {
        id: 'held-out-calibration-plan',
        title: 'Plan held-out calibration',
        prompt: 'Choose between Platt scaling, isotonic regression, or temperature scaling, then specify train, calibration, final-test, subgroup, and monitoring roles.',
        successCriteria: 'You can improve probability reliability without leaking final-test labels or overstating what calibration proves.',
      },
    ],
  },
  overfitting: {
    quiz: OVERFITTING_QUIZ,
    labs: [
      {
        id: 'find-sweet-spot',
        title: 'Find the validation sweet spot',
        prompt: 'Move complexity until validation error is lowest, then compare it with the lowest training error.',
        successCriteria: 'You can explain why the best validation point is not necessarily the most complex model.',
      },
      {
        id: 'generalization-gap-diagnosis',
        title: 'Diagnose the gap',
        prompt: 'Use train, validation, and final-test behavior to distinguish overfitting from underfitting, leakage, split mismatch, and distribution shift.',
        successCriteria: 'You can name the evidence needed before blaming model capacity alone.',
      },
      {
        id: 'remedy-and-report-plan',
        title: 'Plan remedies and reporting',
        prompt: 'Choose a remedy such as regularization, early stopping, simpler models, augmentation, more data, or resampling, then document search scope and held-out evidence.',
        successCriteria: 'You can reduce memorization pressure without tuning repeatedly on the final test set.',
      },
    ],
  },
  'bias-variance-tradeoff': {
    quiz: BIAS_VARIANCE_TRADEOFF_QUIZ,
    labs: [
      {
        id: 'complexity-sweep',
        title: 'Sweep complexity and sample size',
        prompt: 'Switch between simple, balanced, and flexible models, then change sample size and noise.',
        successCriteria: 'You can explain when the dominant problem is bias versus variance from the train and validation errors.',
      },
      {
        id: 'error-source-decomposition',
        title: 'Decompose error sources',
        prompt: 'Use bias, variance, irreducible noise, train error, validation error, and gap values to name the most likely limiter.',
        successCriteria: 'You can separate systematic underfit, sample sensitivity, and unavoidable noise before choosing a remedy.',
      },
      {
        id: 'remedy-selection-drill',
        title: 'Choose the remedy',
        prompt: 'Given an error pattern, decide whether to add flexibility, improve features, regularize, average models, collect data, or revisit the metric.',
        successCriteria: 'You can match the intervention to the diagnosed bias-variance failure mode without tuning on final-test feedback.',
      },
    ],
  },
  regularization: {
    quiz: REGULARIZATION_QUIZ,
    labs: [
      {
        id: 'lambda-sweep',
        title: 'Sweep lambda',
        prompt: 'Increase the penalty and watch which weights shrink fastest.',
        successCriteria: 'You can describe the tradeoff between data loss, penalty, and total loss.',
      },
      {
        id: 'penalty-family-comparison',
        title: 'Compare penalty families',
        prompt: 'Switch among none, L1, L2, and elastic net while tracking which signal and noise weights shrink or disappear.',
        successCriteria: 'You can explain why L1 sparsifies, L2 smooths, and elastic net combines both pressures.',
      },
      {
        id: 'validation-sweep-report',
        title: 'Report the sweep',
        prompt: 'Use the lambda sweep to choose a balanced setting, then explain why the final test should stay untouched until selection is frozen.',
        successCriteria: 'You can identify under-regularized, balanced, and over-regularized regions from validation behavior.',
      },
    ],
  },
  'knn-naive-bayes-svm': {
    quiz: KNN_NAIVE_BAYES_SVM_QUIZ,
    labs: [
      {
        id: 'boundary-comparison',
        title: 'Compare decision changes',
        prompt: 'Move the query point near the boundary and switch between kNN, Naive Bayes, and SVM.',
        successCriteria: 'You can explain whether the decision came from local neighbors, likelihood scores, or margin side.',
      },
      {
        id: 'preprocessing-and-scale-check',
        title: 'Check preprocessing',
        prompt: 'Explain how feature scaling, encoding, missing-value handling, and leakage-safe splits affect a fair comparison among the three models.',
        successCriteria: 'You can name why distance and margin methods are scale-sensitive while Naive Bayes depends on feature likelihood assumptions.',
      },
      {
        id: 'hyperparameter-selection-report',
        title: 'Select hyperparameters',
        prompt: 'Choose k, distance weighting, likelihood smoothing, C, kernel, or gamma from validation behavior while keeping final test data frozen.',
        successCriteria: 'You can connect each hyperparameter to locality, likelihood evidence, margin flexibility, and honest evaluation.',
      },
    ],
  },
  'tree-ensembles': {
    quiz: TREE_ENSEMBLES_QUIZ,
    labs: [
      {
        id: 'depth-vs-ensemble',
        title: 'Compare depth and ensemble size',
        prompt: 'Change tree depth, forest tree count, and boosting rounds, then identify which control most risks memorizing quirks.',
        successCriteria: 'You can explain the difference between deeper single trees, forest averaging, and boosting rounds.',
      },
      {
        id: 'forest-vote-diagnosis',
        title: 'Diagnose forest votes',
        prompt: 'Inspect how additional varied trees change a selected point vote and decide when more trees mostly add latency rather than evidence.',
        successCriteria: 'You can describe why decorrelated trees reduce variance and why plateaued gains should be weighed against serving cost.',
      },
      {
        id: 'boosting-correction-plan',
        title: 'Plan boosting controls',
        prompt: 'Trace boosting correction rounds, learning rate, and validation behavior to decide whether to stop, shrink, or constrain the model.',
        successCriteria: 'You can connect sequential corrections to overfit risk without using final-test feedback for tuning.',
      },
    ],
  },
  'gradient-descent': {
    quiz: GRADIENT_DESCENT_QUIZ,
    labs: [
      {
        id: 'tune-step-size',
        title: 'Tune step size',
        prompt: 'Try a small, medium, and large learning rate and compare the loss trace.',
        successCriteria: 'You can identify which run converges, crawls, or overshoots.',
      },
      {
        id: 'trace-one-update',
        title: 'Trace one update',
        prompt: 'Pick a starting weight, compute the loss gradient, predict the next parameter after theta minus eta times gradient, then compare it with the animation step.',
        successCriteria: 'You can explain the sign, step size, and new loss without reading ahead to later optimizer topics.',
      },
      {
        id: 'diagnose-loss-curve',
        title: 'Diagnose a loss curve',
        prompt: 'Sketch or inspect curves for divergence, slow crawling, noisy descent, plateauing, and validation loss rising while training loss falls.',
        successCriteria: 'You can choose a first diagnostic such as learning rate, scaling, batch size, gradient norms, or overfitting risk.',
      },
    ],
  },
  optimization: {
    quiz: OPTIMIZATION_QUIZ,
    labs: [
      {
        id: 'compare-valley-paths',
        title: 'Compare valley paths',
        prompt: 'Run the SGD and Adam views from the same start, then explain which parts of the path come from curvature, learning rate, and optimizer state.',
        successCriteria: 'You can describe zigzagging, adaptive scaling, and why one toy path is not a universal optimizer ranking.',
      },
      {
        id: 'tune-adaptive-optimizers',
        title: 'Tune adaptive paths',
        prompt: 'Change learning rate on the optimizer variations panel and record when SGD, RMSProp, Adam, or AdamW crawls, follows the valley, or diverges.',
        successCriteria: 'You can connect each visible path change to step size, gradient history, and the fixed objective.',
      },
      {
        id: 'separate-decay-mechanisms',
        title: 'Separate decay mechanisms',
        prompt: 'Vary weight decay and compare Adam with AdamW, noting when shrinkage is coupled to the gradient and when it is applied as a decoupled update.',
        successCriteria: 'You can explain why Adam plus L2 and AdamW are not automatically identical under adaptive scaling.',
      },
    ],
  },
  'neural-network': {
    quiz: NEURAL_NETWORK_QUIZ,
    labs: [
      {
        id: 'trace-forward-backward',
        title: 'Trace one XOR pass',
        prompt: 'Choose one XOR input, run a forward pass, then step backward and identify where the loss signal first appears.',
        successCriteria: 'You can name the input, target, output, loss, and the first gradient-carrying layer.',
      },
      {
        id: 'map-layer-shapes',
        title: 'Map layer shapes',
        prompt: 'Pick a small batch and write the input, weight, bias, pre-activation, activation, and output shapes for one dense layer.',
        successCriteria: 'You can explain why incompatible shapes break the layer before discussing later training tricks.',
      },
      {
        id: 'review-generalization-evidence',
        title: 'Review generalization evidence',
        prompt: 'Compare training loss, validation loss, task metrics, calibration concerns, leakage checks, and a few error cases for a simple network.',
        successCriteria: 'You can separate successful optimization from evidence that the model will behave well on new data.',
      },
    ],
  },
  optimizers: {
    quiz: OPTIMIZERS_QUIZ,
    labs: [
      {
        id: 'compare-update-rules',
        title: 'Compare update rules',
        prompt: 'Run SGD, momentum, and Adam with the same learning rate and batch size, then identify which path zigzags least.',
        successCriteria: 'You can connect the visible path to velocity, adaptive scaling, or mini-batch noise.',
      },
      {
        id: 'predict-then-rotate-landscape',
        title: 'Predict then rotate the landscape',
        prompt: 'Use the prediction check for the selected optimizer, then rotate the 3D surface and explain why the first step and final endpoint match the computed path.',
        successCriteria: 'You can connect the first-step sign, surface curvature, endpoint height, and final loss statistic.',
      },
      {
        id: 'schedule-stability-audit',
        title: 'Audit optimizer stability',
        prompt: 'Compare learning-rate, momentum, batch-size, and step-count settings on the same loss surface, then diagnose crawling, zigzagging, overshooting, or noisy convergence.',
        successCriteria: 'You can choose a first tuning response without claiming Adam or momentum automatically fixes every training run.',
      },
    ],
  },
  initialization: {
    quiz: INITIALIZATION_QUIZ,
    labs: [
      {
        id: 'signal-scale',
        title: 'Find a stable signal scale',
        prompt: 'Switch between tiny, Xavier, He, and huge initialization while changing activation and depth.',
        successCriteria: 'You can explain which setup keeps layer variance stable and why another one vanishes or explodes.',
      },
      {
        id: 'fan-count-variance-check',
        title: 'Check fan-count variance',
        prompt: 'Choose fan-in, fan-out, activation, and depth, then predict whether Xavier or He should keep layerwise signal scale healthier.',
        successCriteria: 'You can connect the visible standard deviation to fan counts, activation behavior, and variance propagation.',
      },
      {
        id: 'first-batch-telemetry-audit',
        title: 'Audit first-batch telemetry',
        prompt: 'Compare initial loss, activation variance, gradient norms, NaNs, and seed-to-seed stability for two initializer choices.',
        successCriteria: 'You can reject a lucky one-seed result when early signal diagnostics show vanishing, exploding, or saturated behavior.',
      },
    ],
  },
  'dropout-batchnorm': {
    quiz: DROPOUT_BATCHNORM_QUIZ,
    labs: [
      {
        id: 'mode-switch',
        title: 'Compare training and inference',
        prompt: 'Toggle training mode and change dropout rate, then explain why the visible output no longer masks units at inference.',
        successCriteria: 'You can separate BatchNorm scaling effects from dropout masking effects.',
      },
      {
        id: 'batchnorm-affine-trace',
        title: 'Trace BatchNorm affine output',
        prompt: 'Change batch mean, batch standard deviation, gamma, and beta, then explain how centering, scaling, and shifting produce the displayed value.',
        successCriteria: 'You can compute the normalized value before discussing dropout masks or mode behavior.',
      },
      {
        id: 'state-and-small-batch-audit',
        title: 'Audit state and batch assumptions',
        prompt: 'Compare training and inference mode with a tiny batch scenario, then identify when running statistics, checkpoints, or frozen BatchNorm state matter.',
        successCriteria: 'You can reject claims that BatchNorm ignores batch size or that weights alone are always enough to restore behavior.',
      },
    ],
  },
  'training-loop-dynamics': {
    quiz: TRAINING_LOOP_DYNAMICS_QUIZ,
    labs: [
      {
        id: 'loop-diagnosis',
        title: 'Diagnose a training loop',
        prompt: 'Increase learning rate, shrink batch size, and raise validation difficulty, then identify noisy, overshooting, or overfitting behavior.',
        successCriteria: 'You can explain why train loss, validation loss, and update stability must be read together.',
      },
      {
        id: 'batch-learning-rate-tradeoff',
        title: 'Compare batch and step tradeoffs',
        prompt: 'Hold validation difficulty fixed, then compare small and large batches across two learning rates to separate noisy descent from unstable overshooting.',
        successCriteria: 'You can explain why smoother batches, step size, and wall-clock cost must be judged together.',
      },
      {
        id: 'checkpoint-split-review',
        title: 'Review checkpoint and split hygiene',
        prompt: 'Use the loss curves to choose a validation checkpoint, then explain why repeated test-set checks would spoil the final evaluation.',
        successCriteria: 'You can keep training, validation, and test evidence separate while diagnosing overfitting.',
      },
    ],
  },
  relu: {
    quiz: RELU_QUIZ,
    labs: [
      {
        id: 'cross-zero',
        title: 'Cross the kink',
        prompt: 'Move the input across zero and watch both output and slope change.',
        successCriteria: 'You can name the active region and the blocked region.',
      },
      {
        id: 'trace-dot-bias-gate',
        title: 'Trace dot, bias, gate',
        prompt: 'Use the practice lab to compute W dot X, add bias, and predict the ReLU output before submitting the final step.',
        successCriteria: 'You can separate the linear pre-activation from the ReLU gate and explain why negative z becomes zero.',
      },
      {
        id: 'diagnose-dead-gate-risk',
        title: 'Diagnose dead-gate risk',
        prompt: 'Use examples with negative z, then explain how bias shifts, initialization scale, or large updates could keep a unit inactive.',
        successCriteria: 'You can connect a zero local slope to missing incoming-weight gradient without claiming every zero activation is bad.',
      },
    ],
  },
  'leaky-relu': {
    quiz: LEAKY_RELU_QUIZ,
    labs: [
      {
        id: 'compare-dead-zone',
        title: 'Compare the dead zone',
        prompt: 'Set z below zero, compare alpha = 0 with alpha above 0, and record how the output and gradient change.',
        successCriteria: 'You can explain why alpha = 0 behaves like ReLU and alpha above 0 preserves a small gradient.',
      },
      {
        id: 'trace-alpha-ledger',
        title: 'Trace the alpha ledger',
        prompt: 'Pick a negative pre-activation, change alpha, and use the forward/backward ledger to compare output, local slope, and returned gradient.',
        successCriteria: 'You can predict how alpha changes both the negative output magnitude and the negative-side gradient multiplier.',
      },
      {
        id: 'audit-bias-and-upstream',
        title: 'Audit bias and upstream gradient',
        prompt: 'Move the bias shift across the kink and vary upstream gradient, then explain when Leaky ReLU matches ReLU and when it preserves a small signal.',
        successCriteria: 'You can separate branch choice from upstream scale and avoid claiming negative evidence becomes positive.',
      },
    ],
  },
  softmax: {
    quiz: SOFTMAX_QUIZ,
    labs: [
      {
        id: 'temperature-logit-lab',
        title: 'Trace the shared denominator',
        prompt: 'Move one logit and temperature, then record how the top probability, entropy, margin, and the other class probabilities change.',
        successCriteria: 'You can explain why softmax probabilities move together through the shared denominator.',
      },
    ],
  },
  'computation-graph-backprop': {
    quiz: COMPUTATION_GRAPH_BACKPROP_QUIZ,
    labs: [
      {
        id: 'trace-forward-backward-chain',
        title: 'Trace forward and backward',
        prompt: 'Use the forward and backward tabs for one setting, then record wx, z, a, loss, dL/da, da/dz, dL/dw, and dL/db.',
        successCriteria: 'You can connect each backward value to the forward value and local derivative that produced it.',
      },
      {
        id: 'debug-relu-blocked-gradient',
        title: 'Debug a blocked ReLU',
        prompt: 'Move x, w, or b until z is negative, then explain why dL/dw and dL/db stop changing on that example.',
        successCriteria: 'You can identify the ReLU local derivative as the factor that blocks the parameter-gradient path.',
      },
      {
        id: 'predict-update',
        title: 'Predict the update',
        prompt: 'Before switching to the update tab, predict whether the next loss will fall.',
        successCriteria: 'Your prediction uses the gradient sign and the learning rate.',
      },
    ],
  },
  tokenization: {
    quiz: TOKENIZATION_QUIZ,
    labs: [
      {
        id: 'compare-splits',
        title: 'Compare token splits',
        prompt: 'Tokenize the same phrase with two modes and identify the longest changed fragment.',
        successCriteria: 'You can explain why one split creates more or fewer tokens.',
      },
      {
        id: 'trace-bpe-merge',
        title: 'Trace a BPE merge',
        prompt: 'Use the BPE tab on a repeated phrase and record the first two merges, their pair counts, and the vocabulary entries they create.',
        successCriteria: 'You can connect each merge to frequent adjacent pieces rather than random inference-time choices.',
      },
      {
        id: 'debug-production-tokenizer',
        title: 'Debug tokenizer drift',
        prompt: 'Enter a phrase with casing, punctuation, or a rare word, then list the token strings, ids or counts, and one production risk if the tokenizer changes.',
        successCriteria: 'You can explain why exact tokenizer version, vocabulary, normalization, and special-token config must stay pinned.',
      },
    ],
  },
  embeddings: {
    quiz: EMBEDDINGS_QUIZ,
    labs: [
      {
        id: 'trace-vector-arithmetic',
        title: 'Trace vector arithmetic',
        prompt: 'Use the Word Algebra tab to step through King - Man + Woman, then explain why the result is an analogy signal rather than a proof of meaning.',
        successCriteria: 'You can connect vector offsets to learned patterns while naming the limits of analogy arithmetic.',
      },
      {
        id: 'compare-cosine-angle',
        title: 'Compare cosine angles',
        prompt: 'Set the Similarity Lab angle near 0, 90, and 180 degrees, then record the cosine value and interpretation for each case.',
        successCriteria: 'You can explain how direction controls cosine similarity and why metric choice affects comparisons.',
      },
      {
        id: 'nearest-neighbor',
        title: 'Inspect a neighbor',
        prompt: 'Rotate the 3D semantic space and compare words inside one cluster with words across clusters.',
        successCriteria: 'You can separate useful neighborhood structure from incidental training-data correlation.',
      },
    ],
  },
  'cosine-similarity': {
    quiz: COSINE_SIMILARITY_QUIZ,
    labs: [
      {
        id: 'trace-dot-product-normalization',
        title: 'Trace dot normalization',
        prompt: 'Use the Dot Product tab to create same-direction, perpendicular, and opposite vectors, then record dot product, norms, angle, and cosine.',
        successCriteria: 'You can explain how the denominator removes positive length effects while preserving direction.',
      },
      {
        id: 'compare-movie-matches',
        title: 'Compare movie matches',
        prompt: 'Adjust the Movie Matcher sliders until User A is closer to User C than User B, then explain which genre dimensions changed the ranking.',
        successCriteria: 'Your explanation connects aligned preference directions to the cosine score rather than raw profile size.',
      },
      {
        id: 'predict-nearest',
        title: 'Predict the nearest vector',
        prompt: 'Before changing the sliders or query, predict which vector or document will rank highest and why.',
        successCriteria: 'Your explanation names either direction alignment or a shared active feature, not just raw magnitude.',
      },
    ],
  },
  'attention-mechanism': {
    quiz: ATTENTION_MECHANISM_QUIZ,
    labs: [
      {
        id: 'trace-library-lookup',
        title: 'Trace the library lookup',
        prompt: 'Run the Library Search scenario and identify the query, keys, values, highest weights, and final weighted-combination idea.',
        successCriteria: 'You can explain why the most relevant books receive higher weights without treating the heatmap as permanent importance.',
      },
      {
        id: 'compare-scenarios',
        title: 'Compare scenario routing',
        prompt: 'Switch between Library Search, Translation, and Conversation, then describe how the query changes which items receive attention.',
        successCriteria: 'Your explanation connects each query to contextual key matching and avoids calling attention a hard one-item lookup.',
      },
      {
        id: 'shift-query',
        title: 'Shift the query',
        prompt: 'Switch to a different scenario query and predict which value will receive more weight.',
        successCriteria: 'Your prediction follows the largest query-key score.',
      },
    ],
  },
  'self-attention': {
    quiz: SELF_ATTENTION_QUIZ,
    labs: [
      {
        id: 'trace-scaled-row',
        title: 'Trace a scaled row',
        prompt: 'Pick one query token, read its scaled scores, softmax weights, strongest key, and output vector before changing any controls.',
        successCriteria: 'You can connect QK scores, sqrt(d_k) scaling, row softmax, and the weighted value mixture for one token.',
      },
      {
        id: 'compare-mask-temperature',
        title: 'Compare mask and temperature',
        prompt: 'Toggle the causal mask and lower the temperature, then explain what changes in the row bars and full attention matrix.',
        successCriteria: 'Your explanation distinguishes blocked future keys from sharper softmax competition among visible keys.',
      },
      {
        id: 'attention-row',
        title: 'Read one attention row',
        prompt: 'Pick a token and explain which other tokens it attends to most.',
        successCriteria: 'You can connect one row of weights to the resulting context vector.',
      },
    ],
  },
  'kv-cache': {
    quiz: KV_CACHE_QUIZ,
    labs: [
      {
        id: 'trace-cache-table',
        title: 'Trace the cache table',
        prompt: 'Move the decode step and identify which K,V entries are cached, which token is current, and which visible positions are read.',
        successCriteria: 'You can explain that cached K/V are reused while the current query still attends over visible history.',
      },
      {
        id: 'decode-step-savings',
        title: 'Compare decode-step work',
        prompt: 'Increase the decode step with caching on and off, then explain which computation grows and which stays flat.',
        successCriteria: 'You can separate avoided K/V projection work from attention reads over the visible cache.',
      },
      {
        id: 'bound-window-memory',
        title: 'Bound window memory',
        prompt: 'Reduce the sliding window, then change heads and head dimension to compare cache reads, projection savings, and memory pressure.',
        successCriteria: 'Your explanation separates projection reuse from the cache-memory tradeoff caused by visible tokens, heads, and head dimension.',
      },
    ],
  },
  'grouped-query-attention': {
    quiz: GROUPED_QUERY_ATTENTION_QUIZ,
    labs: [
      {
        id: 'map-query-to-kv-groups',
        title: 'Map query to KV groups',
        prompt: 'Choose 16 query heads with 4 KV heads, then list which query heads share each KV head and compute the sharing ratio.',
        successCriteria: 'You can map several query heads to each shared K/V head without reducing the query-head count.',
      },
      {
        id: 'compare-mha-mqa-gqa',
        title: 'Compare sharing regimes',
        prompt: 'Set KV heads equal to query heads, then to one, then to an intermediate value. Explain the memory and specialization tradeoff.',
        successCriteria: 'You can identify MHA, MQA, and GQA and explain why GQA is the middle ground.',
      },
      {
        id: 'estimate-cache-bandwidth',
        title: 'Estimate cache bandwidth',
        prompt: 'Hold query heads fixed, then change KV heads, context tokens, and head dimension to predict cache elements and read-bandwidth changes.',
        successCriteria: 'Your explanation ties cache savings to fewer stored/read K/V heads while noting context length and quality still matter.',
      },
    ],
  },
  'flash-attention': {
    quiz: FLASH_ATTENTION_QUIZ,
    labs: [
      {
        id: 'compare-full-vs-tile-memory',
        title: 'Compare memory footprints',
        prompt: 'Increase sequence length and compare full score-matrix memory with tile working-set memory. Explain why the FLOPs remain attention-like while memory traffic drops.',
        successCriteria: 'You can separate exact attention computation from the memory schedule that avoids materializing N by N scores.',
      },
      {
        id: 'trace-online-softmax-state',
        title: 'Trace online softmax state',
        prompt: 'Step through several tiles and identify where the running row maximum, normalization denominator, and output accumulator are updated.',
        successCriteria: 'You can explain how streamed tiles still produce the same row-wise softmax result as standard attention.',
      },
      {
        id: 'tune-tile-and-dtype',
        title: 'Tune tile and dtype settings',
        prompt: 'Change tile size, head dimension, and element type, then describe how each one changes working-set memory, bytes moved, and numerical tolerance expectations.',
        successCriteria: 'You can connect practical kernel choices to memory fit, IO savings, and parity checks without calling Flash Attention approximate.',
      },
    ],
  },
  'attention-masks': {
    quiz: ATTENTION_MASKS_QUIZ,
    labs: [
      {
        id: 'trace-visible-keys',
        title: 'Trace visible keys',
        prompt: 'Pick one query row, switch between mask types, and list which keys remain visible before softmax.',
        successCriteria: 'You can justify each visible or blocked key using causal order, padding, or cross-attention memory.',
      },
      {
        id: 'combine-causal-and-padding',
        title: 'Combine causal and padding masks',
        prompt: 'Turn on padding masking while using causal visibility, then explain why a key must be both in the legal prefix and a real token.',
        successCriteria: 'You can describe combined masks as enforcing time visibility and valid-token status before softmax.',
      },
      {
        id: 'debug-mask-conventions',
        title: 'Debug mask conventions',
        prompt: 'Use the selected-row grid to predict weights, then identify what would break if an API inverted keep/block polarity or broadcast the mask on the wrong axis.',
        successCriteria: 'You can name the expected visible keys, detect leakage or all-masked rows, and separate attention masks from [MASK] input tokens.',
      },
    ],
  },
  'positional-encoding': {
    quiz: POSITIONAL_ENCODING_QUIZ,
    labs: [
      {
        id: 'order-sensitive-sentence',
        title: 'Compare order-sensitive meaning',
        prompt: 'Switch between "dog bites man" and "man bites dog", then disable the position signal. Explain what information the model loses.',
        successCriteria: 'You can explain why the same tokens need different positional context to represent different meanings.',
      },
      {
        id: 'trace-sinusoidal-channels',
        title: 'Trace sinusoidal channels',
        prompt: 'Select sinusoidal encoding, change model dimension and probe position, then describe how sine and cosine channels create repeatable multi-scale position fingerprints.',
        successCriteria: 'You can connect even/odd channels, frequency scale, and probe similarity to the displayed position vectors.',
      },
      {
        id: 'debug-position-alignment',
        title: 'Debug position alignment',
        prompt: 'Compare learned, sinusoidal, and no-position modes, then explain what can go wrong with padding side, packed examples, generation position ids, or KV-cache reuse.',
        successCriteria: 'You can separate token identity, position ids, masks, and cached states and explain why they must stay aligned.',
      },
    ],
  },
  rope: {
    quiz: ROPE_QUIZ,
    labs: [
      {
        id: 'relative-shift-check',
        title: 'Check relative shift behavior',
        prompt: 'Move query and key positions together by the same amount. Explain what changes and what stays tied to the relative distance.',
        successCriteria: 'You can explain why absolute rotation angles change while the relative-position relationship is preserved.',
      },
      {
        id: 'trace-frequency-schedule',
        title: 'Trace frequency schedule',
        prompt: 'Change the dimension pair, model dimension, and RoPE base, then explain how theta, absolute angles, and relative angles move across fast and slow pairs.',
        successCriteria: 'You can connect base, per-pair frequency, and relative angle to the displayed score behavior.',
      },
      {
        id: 'debug-implementation-alignment',
        title: 'Debug implementation alignment',
        prompt: 'Use one tiny Q/K pair to predict the rotated score, then list what would break if values were rotated, masks were removed, or cached positions used the wrong offset.',
        successCriteria: 'You can separate Q/K rotation, value mixing, mask legality, and KV-cache position alignment.',
      },
    ],
  },
  'residual-stream': {
    quiz: RESIDUAL_STREAM_QUIZ,
    labs: [
      {
        id: 'trace-component-write',
        title: 'Trace one residual write',
        prompt: 'Increase one attention or MLP write, then explain how the before/write/after vectors change.',
        successCriteria: 'You can distinguish adding a component write from replacing the whole token representation.',
      },
      {
        id: 'compare-scale-control',
        title: 'Compare scale control',
        prompt: 'Toggle Normalize after each write while increasing early and late write strengths, then explain how final magnitude and dominant feature change.',
        successCriteria: 'You can connect residual write scale, normalization, and feature domination in the running stream.',
      },
      {
        id: 'separate-stream-from-cache',
        title: 'Separate stream from cache',
        prompt: 'Use the layer contribution ledger to trace one token state, then explain why this running hidden representation is not a KV cache or external memory bank.',
        successCriteria: 'You can identify the residual stream as the current per-token hidden state that components read from and write into.',
      },
    ],
  },
  'conv-relu': {
    quiz: CONV_RELU_QUIZ,
    labs: [
      {
        id: 'bias-sparsity-sweep',
        title: 'Find the activation cutoff',
        prompt: 'Lower the bias until several feature responses disappear, then identify which pre-activation values were clipped.',
        successCriteria: 'You can explain the difference between the signed convolution map and the sparse ReLU activation map.',
      },
      {
        id: 'trace-selected-z-to-a',
        title: 'Trace z to activation',
        prompt: 'Select one output cell, inspect its highlighted input window, then explain how conv plus bias becomes z and ReLU turns z into a.',
        successCriteria: 'You can state whether the selected response survives because its pre-activation is positive or is clipped because it is negative.',
      },
      {
        id: 'compare-kernel-polarity',
        title: 'Compare filter polarity',
        prompt: 'Switch between the edge and bright-center kernels at the same bias, then compare which signed response maps survive ReLU.',
        successCriteria: 'You can separate the convolution filter response from the ReLU gate and avoid crediting ReLU with detecting the pattern.',
      },
    ],
  },
  'max-pooling': {
    quiz: MAX_POOLING_QUIZ,
    labs: [
      {
        id: 'trace-window-argmax',
        title: 'Trace a pooling window',
        prompt: 'Select an output cell, write the highlighted input values, and identify which coordinate supplied the max.',
        successCriteria: 'You can compute the pooled output cell and explain which input details were discarded.',
      },
      {
        id: 'audit-stride-coverage',
        title: 'Audit stride coverage',
        prompt: 'Change stride from overlapping to non-overlapping windows, then list which input positions stop being visited.',
        successCriteria: 'You can connect stride to output shape, window coverage, and missed local evidence.',
      },
      {
        id: 'compare-max-average-gap',
        title: 'Compare max and average',
        prompt: 'Use the max-minus-average card on a selected window and explain what the gap says about discarded non-maximum evidence.',
        successCriteria: 'You can explain why max pooling preserves peaks but does not preserve the full local distribution.',
      },
    ],
  },
  conv2d: {
    quiz: CONV2D_QUIZ,
    labs: [
      {
        id: 'trace-output-size',
        title: 'Trace output shape',
        prompt: 'Switch stride and padding, then compute the output-size formula before checking the displayed grid.',
        successCriteria: 'You can explain why padding increases available windows while stride skips windows.',
      },
      {
        id: 'trace-selected-cell',
        title: 'Trace a selected cell',
        prompt: 'Choose one output cell, write its highlighted 3 by 3 input window, multiply by the current kernel, and sum the nine products.',
        successCriteria: 'You can explain how one local dot product creates exactly one output value.',
      },
      {
        id: 'compare-kernel-responses',
        title: 'Compare kernel responses',
        prompt: 'Keep the same selected window, switch between edge and sharpen kernels, and predict how signed weights change the response.',
        successCriteria: 'You can separate the reused spatial window from the learned filter weights that score different local patterns.',
      },
    ],
  },
  'gradient-problems': {
    quiz: GRADIENT_PROBLEMS_QUIZ,
    labs: [
      {
        id: 'diagnose-gradient-flow',
        title: 'Diagnose a gradient chain',
        prompt: 'Create one vanishing case and one exploding case by changing depth and local multiplier, then stabilize one of them.',
        successCriteria: 'You can identify whether the problem comes from depth, local derivative scale, residual paths, or clipping.',
      },
      {
        id: 'trace-chain-ledger',
        title: 'Trace the chain ledger',
        prompt: 'Set the local multiplier below one, increase depth, and use the layer ledger to explain where the early-layer signal collapses.',
        successCriteria: 'You can connect repeated local derivatives to exponential shrinkage without jumping straight to remedies.',
      },
      {
        id: 'clip-vs-residual-audit',
        title: 'Audit clipping and residual fixes',
        prompt: 'Compare clipping, residual strength, and multiplier scale on the same chain, then explain which fix caps explosions and which gives gradients a bypass route.',
        successCriteria: 'You can state why clipping is not a cure for vanished gradients and why residual paths still need scale control.',
      },
    ],
  },
  'layer-normalization': {
    quiz: LAYER_NORMALIZATION_QUIZ,
    labs: [
      {
        id: 'normalize-shifted-token',
        title: 'Normalize a shifted token',
        prompt: 'Choose the shifted token, inspect mean and standard deviation, then explain what gamma and beta restore after normalization.',
        successCriteria: 'You can distinguish the raw token shift from the normalized feature pattern and the learned affine output.',
      },
      {
        id: 'compare-batchnorm-axis',
        title: 'Compare BatchNorm axes',
        prompt: 'Use the BatchNorm comparison at batch size one and a larger batch, then explain why LayerNorm keeps using feature statistics inside each token.',
        successCriteria: 'You can state which axis each normalization uses and why LayerNorm does not need running batch statistics.',
      },
      {
        id: 'audit-pre-post-placement',
        title: 'Audit norm placement',
        prompt: 'Switch between pre-norm and post-norm, vary branch strength, and explain how placement changes the residual update seen by the next block.',
        successCriteria: 'You can connect placement and branch scale to residual stability without claiming one formula is always best.',
      },
    ],
  },
  lstm: {
    quiz: LSTM_QUIZ,
    labs: [
      {
        id: 'trace-gated-memory',
        title: 'Trace gated memory',
        prompt: 'Step through the forget, input, candidate, and output gates, then explain how the cell state and hidden state change across two time steps.',
        successCriteria: 'You can distinguish stored memory from exposed hidden output and identify which gate caused each change.',
      },
    ],
  },
  transformer: {
    quiz: TRANSFORMER_QUIZ,
    labs: [
      {
        id: 'trace-token',
        title: 'Trace one token',
        prompt: 'Follow one token through attention, feed-forward, residual, and normalization stages.',
        successCriteria: 'You can say what each stage changes and what it preserves.',
      },
      {
        id: 'compare-mixing-and-mlp',
        title: 'Compare mixing and MLP stages',
        prompt: 'Use the data-flow view to identify which stage mixes information across token positions and which stage transforms each token position independently.',
        successCriteria: 'You can distinguish attention mixing from the feed-forward per-token transform and explain where residual and normalization stages fit.',
      },
      {
        id: 'debug-mask-and-shape-contracts',
        title: 'Debug mask and shape contracts',
        prompt: 'Compare encoder, decoder, and encoder-decoder variants, then list the attention mask, residual width, head count, norm order, and output-head checks needed before loading a checkpoint.',
        successCriteria: 'You can connect visibility patterns and tensor contracts to correct transformer architecture behavior.',
      },
    ],
  },
  'transformer-architecture-families': {
    quiz: TRANSFORMER_ARCHITECTURE_FAMILIES_QUIZ,
    labs: [
      {
        id: 'choose-family',
        title: 'Choose the right family',
        prompt: 'Pick search reranking, chat completion, and translation tasks, then choose the architecture family for each.',
        successCriteria: 'You can justify each choice using attention visibility, objective, and output type.',
      },
      {
        id: 'compare-visibility-masks',
        title: 'Compare visibility masks',
        prompt: 'Switch between encoder-only, decoder-only, and encoder-decoder, then explain which tokens each query can read and why that matches the objective.',
        successCriteria: 'You can distinguish bidirectional input visibility, causal prefix visibility, and source-memory cross-attention.',
      },
      {
        id: 'debug-family-mismatch',
        title: 'Debug family mismatch',
        prompt: 'Match an encoder classifier, decoder chat model, and encoder-decoder translator to their output contract, then name the leakage or missing-context failure if the wrong family is used.',
        successCriteria: 'You can connect family choice to available context, output type, objective, masks, and evaluation.',
      },
    ],
  },
  'llm-training-objectives': {
    quiz: LLM_TRAINING_OBJECTIVES_QUIZ,
    labs: [
      {
        id: 'match-objective-stage',
        title: 'Match objective to behavior',
        prompt: 'Select each objective and decide whether it mainly teaches continuation, representation, instruction following, or preference-shaped response behavior.',
        successCriteria: 'You can justify each match using the target in the loss.',
      },
      {
        id: 'inspect-loss-scope',
        title: 'Inspect loss scope',
        prompt: 'For next-token prediction, masked-token recovery, SFT, and preference optimization, mark the visible context, target, and tokens or comparisons that contribute to loss.',
        successCriteria: 'You can distinguish context, target, loss mask, padding mask, and preference-pair scope for each objective.',
      },
      {
        id: 'debug-objective-mismatch',
        title: 'Debug objective mismatch',
        prompt: 'Given failures like prompt copying, missing domain facts, over-refusal, reward hacking, or benchmark jumps, choose whether the issue is data coverage, loss masking, preference signal, or evaluation contamination.',
        successCriteria: 'You can connect the observed behavior to the objective signal and name the targeted validation check.',
      },
    ],
  },
  bert: {
    quiz: BERT_QUIZ,
    labs: [
      {
        id: 'choose-bert-head',
        title: 'Choose the BERT task head',
        prompt: 'Given sentiment classification, named entity recognition, extractive QA, and sentence-pair similarity, pick the BERT input format and task head for each.',
        successCriteria: 'You justify each choice using [CLS], token-level outputs, span boundaries, or paired [SEP] inputs.',
      },
    ],
  },
  'gpt2-comprehensive': {
    quiz: GPT2_COMPREHENSIVE_QUIZ,
    labs: [
      {
        id: 'trace-gpt2-token',
        title: 'Trace one GPT-2 token prediction',
        prompt: 'Start from a short prompt, tokenize it with BPE, add positions, apply a causal attention mask, and choose a next-token decoding strategy.',
        successCriteria: 'You can explain how tokenization, positions, masked blocks, logits, KV caching, and sampling affect the next token.',
      },
    ],
  },
  moe: {
    quiz: MIXTURE_OF_EXPERTS_QUIZ,
    labs: [
      {
        id: 'route-token-batch',
        title: 'Route a token batch',
        prompt: 'Choose an expert count and top-k value, generate a batch, then explain which experts were selected and whether the load pattern looks balanced.',
        successCriteria: 'You can connect router scores, top-k dispatch, active expert count, and load bars to the MoE tradeoff.',
      },
    ],
  },
  'frontier-llm-architecture-overview': {
    quiz: FRONTIER_LLM_ARCHITECTURE_OVERVIEW_QUIZ,
    labs: [
      {
        id: 'classify-frontier-paper-signals',
        title: 'Classify frontier paper signals',
        prompt: 'Pick three paper signal cards, then map each one to the changed bottleneck, active components, and new failure mode to audit.',
        successCriteria: 'You can distinguish architecture changes from decoding controls and name the tradeoff for each selected family.',
      },
    ],
  },
  'frontier-moe-systems': {
    quiz: FRONTIER_MOE_SYSTEMS_QUIZ,
    labs: [
      {
        id: 'audit-frontier-moe-system',
        title: 'Audit a frontier MoE system',
        prompt: 'Choose one preset, compute active versus total footprint, inspect routing and load metrics, then diagnose the most likely failure mode and fix path.',
        successCriteria: 'You can connect top-k, shared experts, capacity factor, all-to-all dispatch, failure metrics, and distillation signals to a concrete MoE audit.',
      },
    ],
  },
  vae: {
    quiz: VAE_QUIZ,
    labs: [
      {
        id: 'trace-vae-latent-sample',
        title: 'Trace a VAE latent sample',
        prompt: 'Start with an input vector, produce mu and log-variance, reparameterize a latent sample, decode it, and explain the reconstruction-KL tradeoff.',
        successCriteria: 'You can connect q(z|x), z = mu + sigma * epsilon, p(x|z), ELBO terms, beta, and generation from N(0,I).',
      },
    ],
  },
  'transformer-token-generation': {
    quiz: TRANSFORMER_TOKEN_GENERATION_QUIZ,
    labs: [
      {
        id: 'sampling-contrast',
        title: 'Compare two decoding settings',
        prompt: 'Generate a few steps with low temperature and greedy mode, then compare it with higher temperature and sampling.',
        successCriteria: 'You can explain which setting is more deterministic and which setting keeps more alternatives alive.',
      },
      {
        id: 'trace-token-step',
        title: 'Trace one token step',
        prompt: 'Pick one generated token and trace the visible context, last-position logits, softmax probabilities, top-k or top-p filter, selected token, append step, and next cache row.',
        successCriteria: 'You can explain how a single selected token changes the next context and candidate distribution.',
      },
      {
        id: 'verify-serving-behavior',
        title: 'Verify serving behavior',
        prompt: 'Compare cached and uncached decoding with the same prompt, seed, and settings, then test EOS, stop sequence, max-token, and streaming behavior.',
        successCriteria: 'You can verify cache invariance, stopping rules, reproducibility, output length, and per-token latency.',
      },
    ],
  },
  'sampling-strategies': {
    quiz: SAMPLING_STRATEGIES_QUIZ,
    labs: [
      {
        id: 'decode-for-task',
        title: 'Choose decoding for a task',
        prompt: 'Pick settings for factual QA, brainstorming, and translation, then explain which one should be more deterministic or diverse.',
        successCriteria: 'You can justify each setting using candidate count, probability mass, and sequence-score tradeoffs.',
      },
      {
        id: 'inspect-candidate-set',
        title: 'Inspect candidate sets',
        prompt: 'Move temperature, top-k, top-p, and beam width, then record which tokens or paths remain eligible and why the candidate count changed.',
        successCriteria: 'You can distinguish logit scaling, rank filtering, cumulative-mass filtering, beam pruning, and renormalization.',
      },
      {
        id: 'compare-production-defaults',
        title: 'Compare production defaults',
        prompt: 'Design separate decoding defaults for factual QA, brainstorming, translation, JSON output, and safety refusals, then name the quality, cost, and consistency checks for each.',
        successCriteria: 'You can match decoding controls to task risk, desired diversity, reproducibility, safety, and measured output quality.',
      },
    ],
  },
  'fine-tuning': {
    quiz: FINE_TUNING_QUIZ,
    labs: [
      {
        id: 'choose-finetune-method',
        title: 'Choose a fine-tuning method',
        prompt: 'Pick one scenario with limited GPU memory, one with demonstrations, and one with preference pairs, then choose LoRA, SFT, or DPO/RLHF.',
        successCriteria: 'Your choice matches the available data signal and the memory or behavior constraint.',
      },
      {
        id: 'inspect-trainable-scope',
        title: 'Inspect trainable scope',
        prompt: 'Compare full fine-tuning, LoRA, and QLoRA by marking which base weights, adapters, optimizer states, precision choices, and gradients are active.',
        successCriteria: 'You can explain how trainable parameter scope, adapter rank, quantization, and optimizer state change memory and drift risk.',
      },
      {
        id: 'debug-tuning-failure',
        title: 'Debug tuning failure',
        prompt: 'Given failures like prompt copying, overfitting, capability regression, stale private facts, over-refusal, or poisoned examples, choose whether the issue is data format, loss masking, method mismatch, retrieval boundary, or evaluation coverage.',
        successCriteria: 'You can connect each failure to the tuning signal and name the validation or data-governance check that would catch it.',
      },
    ],
  },
  rag: {
    quiz: RAG_QUIZ,
    labs: [
      {
        id: 'trace-rag-indexing-pipeline',
        title: 'Trace the indexing pipeline',
        prompt: 'Run the RAG Pipeline tab from document collection through indexing, then identify which state belongs to documents, chunks, embeddings, and the vector index.',
        successCriteria: 'You can explain why chunking and embedding happen before query-time retrieval.',
      },
      {
        id: 'compare-rag-top-k',
        title: 'Compare top-k retrieval',
        prompt: 'Use the Vector Search tab for the XR-500 battery query and compare Top 1, Top 3, and Top 5 results.',
        successCriteria: 'You can name the battery-life chunk, one useful supporting chunk, and one lower-relevance distractor risk.',
      },
      {
        id: 'sandbox-rag-evidence',
        title: 'Test evidence coverage in the sandbox',
        prompt: 'In the Practice Lab sandbox, disable a relevant document, run a query, then re-enable it and compare the retrieved context and generated response.',
        successCriteria: 'You can explain why RAG cannot ground an answer in evidence that is disabled or missing.',
      },
    ],
  },
  'rag-chunking-context': {
    quiz: RAG_CHUNKING_CONTEXT_QUIZ,
    labs: [
      {
        id: 'tune-chunk-budget',
        title: 'Tune chunking and packing',
        prompt: 'Adjust chunk size, overlap, top-k, and context budget until both relevant refund facts fit without too much duplicate text.',
        successCriteria: 'You can explain which control recovered the boundary fact and which control limited packed evidence.',
      },
      {
        id: 'trace-retrieved-vs-packed',
        title: 'Trace retrieved versus packed evidence',
        prompt: 'For a query with one missing fact, compare the indexed chunks, top-k candidates, ranked order, packed prompt, and reserved answer space.',
        successCriteria: 'You can name the exact stage where evidence disappeared and choose whether the fix is chunking, retrieval breadth, reranking, deduplication, or packing budget.',
      },
      {
        id: 'measure-context-tradeoffs',
        title: 'Measure context tradeoffs',
        prompt: 'Run the same evidence-backed queries across two chunk sizes, two overlap settings, and two top-k values, then record recall, packed coverage, duplicate token share, latency, and answer quality.',
        successCriteria: 'You can justify a setting with measured tradeoffs instead of assuming larger chunks, more overlap, or higher top-k is automatically better.',
      },
    ],
  },
  'rag-vector-indexing': {
    quiz: RAG_VECTOR_INDEXING_QUIZ,
    labs: [
      {
        id: 'choose-index',
        title: 'Choose an index strategy',
        prompt: 'Compare exact, IVF, and HNSW modes for a small corpus, a large corpus, and a high-recall support bot.',
        successCriteria: 'You can justify the choice using latency, recall risk, and corpus scale.',
      },
      {
        id: 'plot-recall-latency',
        title: 'Plot recall and latency',
        prompt: 'Run exact, IVF, and HNSW settings across low and high search breadth, then compare recall, P95 latency, memory pressure, and candidate misses against an exact baseline.',
        successCriteria: 'You can identify the operating point where approximate search becomes fast enough without losing required evidence.',
      },
      {
        id: 'debug-index-miss',
        title: 'Debug an index miss',
        prompt: 'Given a missing answer chunk, trace embeddings, metric choice, ANN breadth, filters, index freshness, hybrid lexical fallback, reranker input, and packed context.',
        successCriteria: 'You can distinguish an upstream indexing miss from a downstream reranking or packing failure and name the safest fix.',
      },
    ],
  },
  'rag-retrieval-evaluation': {
    quiz: RAG_RETRIEVAL_EVALUATION_QUIZ,
    labs: [
      {
        id: 'chunking-rerank-audit',
        title: 'Audit a retrieval setting',
        prompt: 'Change chunk size, overlap, top-k, and reranking, then pick the setting with the clearest grounded evidence.',
        successCriteria: 'You can justify the setting with recall@k, MRR, nDCG, and the text of the top result.',
      },
      {
        id: 'metric-tradeoff-table',
        title: 'Build a metric tradeoff table',
        prompt: 'Compare at least three retrieval settings by recall@k, MRR, nDCG, latency, duplicate chunk rate, and whether the needed evidence is packed.',
        successCriteria: 'You can explain when a higher first-rank score still loses because coverage, freshness, duplicates, or prompt visibility regressed.',
      },
      {
        id: 'slice-regression-check',
        title: 'Check a retrieval slice',
        prompt: 'Pick one query slice, label the relevant chunks, run the current retrieval setting, and classify each miss as absent, low-ranked, stale, conflicting, duplicated, or dropped before generation.',
        successCriteria: 'You can connect the slice failure to the specific retrieval, reranking, chunking, threshold, or packing control that should change.',
      },
    ],
  },
  'rag-reranking-grounding': {
    quiz: RAG_RERANKING_GROUNDING_QUIZ,
    labs: [
      {
        id: 'grounding-audit',
        title: 'Audit grounding behavior',
        prompt: 'Use strictness and top-k to make a stale conflict visible, then make every claim grounded with usable evidence.',
        successCriteria: 'You can explain why strictness blocked one claim and why adjusting top-k changed grounded coverage.',
      },
      {
        id: 'isolate-reranker-effect',
        title: 'Isolate reranker effect',
        prompt: 'Compare first-pass order, reranked order, MRR or nDCG, and top-k support before changing grounding strictness.',
        successCriteria: 'You can say whether the reranker improved candidate ordering without crediting it for missing evidence or citation validity.',
      },
      {
        id: 'audit-citation-validity',
        title: 'Audit citation validity',
        prompt: 'For each answer claim, mark the supporting span as valid, stale, conflicting, low-trust, unauthorized, or absent, then choose whether to cite, abstain, or request better evidence.',
        successCriteria: 'You can separate rank from support and explain why each accepted citation passes freshness, conflict, trust, and access checks.',
      },
    ],
  },
  'rag-failure-modes': {
    quiz: RAG_FAILURE_MODES_QUIZ,
    labs: [
      {
        id: 'failure-tune',
        title: 'Tune one failure',
        prompt: 'Use reranker mode, top-k, and strictness to reduce stale or conflicting behavior for at least two claims.',
        successCriteria: 'You can report the top-k/strictness region with fewer stale/conflicting tags and a higher grounded count.',
      },
      {
        id: 'classify-failure-table',
        title: 'Classify a failure table',
        prompt: 'For each generated claim, fill a table with the retrieved evidence, freshness, conflict status, source eligibility, failure tag, and next control to tune.',
        successCriteria: 'You can distinguish missing, stale, conflicting, irrelevant, unauthorized, and unsupported evidence without changing decoding first.',
      },
      {
        id: 'build-regression-case',
        title: 'Build a regression case',
        prompt: 'Take one bad grounded answer, preserve the query and retrieved candidates, tag the failure, patch the matching retrieval or grounding control, then define the expected future diagnosis.',
        successCriteria: 'You can connect the incident to a reproducible evidence-path check that prevents the same failure from returning.',
      },
    ],
  },
  'multimodal-llm': {
    quiz: MULTIMODAL_LLM_QUIZ,
    labs: [
      {
        id: 'trace-multimodal-flow',
        title: 'Trace multimodal data flow',
        prompt: 'Use the Data Flow tab to step from image plus text input through vision encoding, text tokenization, projection, token combination, attention, and generation.',
        successCriteria: 'You can name what representation exists at each step and why projection happens before fusion.',
      },
      {
        id: 'compare-fusion-designs',
        title: 'Compare fusion designs',
        prompt: 'Switch between early fusion, late fusion, and cross-attention in the Architecture tab, then pick the best design for rich interaction, modular training, and flexible attention.',
        successCriteria: 'You can justify each choice using interaction timing, complexity, and scaling tradeoffs.',
      },
      {
        id: 'ground-scenario-answer',
        title: 'Ground a scenario answer',
        prompt: 'In the Practice Lab scenarios, choose one image-question pair and identify which visual evidence should support the generated response.',
        successCriteria: 'You can distinguish a visually grounded answer from a fluent but unsupported answer.',
      },
    ],
  },
  'mdp-formalism': {
    quiz: [
      {
        id: 'mdp-parts',
        prompt: 'What does the transition model P describe in an MDP?',
        choices: [
          'The probability distribution over next states after taking an action',
          'The list of all parameters in a neural network',
          'The final answer chosen by a language model',
        ],
        answerIndex: 0,
        explanation: 'P describes environment dynamics: from a state and action, it gives probabilities for possible next states.',
      },
      {
        id: 'discount-role',
        prompt: 'What changes when gamma is reduced toward zero?',
        choices: [
          'Immediate rewards dominate delayed rewards',
          'Future rewards become more important than immediate rewards',
          'Transition probabilities stop summing to one',
        ],
        answerIndex: 0,
        explanation: 'A smaller discount factor puts less weight on future rewards, so near-term reward matters more.',
      },
    ],
    labs: [
      {
        id: 'gamma-comparison',
        title: 'Compare action values',
        prompt: 'Switch between actions and lower gamma until the safer immediate reward becomes more attractive.',
        successCriteria: 'You can explain how the same transition probabilities lead to different action choices when gamma changes.',
      },
    ],
  },
  'value-iteration': {
    quiz: [
      {
        id: 'bellman-backup',
        prompt: 'What does a Bellman optimality backup do in value iteration?',
        choices: [
          'It compares action lookaheads and keeps the highest expected return',
          'It samples one action and permanently stores that single result',
          'It tokenizes rewards into subword units',
        ],
        answerIndex: 0,
        explanation: 'Value iteration uses the known model to compute expected return for each action, then takes the maximum.',
      },
      {
        id: 'model-vs-samples',
        prompt: 'Why is value iteration considered planning rather than model-free learning?',
        choices: [
          'It uses known transitions and rewards to update values before acting',
          'It ignores transition probabilities',
          'It only works when there are no rewards',
        ],
        answerIndex: 0,
        explanation: 'Planning methods use a model of the environment; Q-learning can learn from sampled experience without that full model.',
      },
    ],
    labs: [
      {
        id: 'sweep-propagation',
        title: 'Watch reward propagation',
        prompt: 'Set sweeps to zero, then increase one step at a time and observe which states change after the goal value appears.',
        successCriteria: 'You can identify how terminal rewards propagate backward through Bellman sweeps.',
      },
    ],
  },
  'policy-iteration': {
    quiz: [
      {
        id: 'two-phases',
        prompt: 'What are the two repeating phases of policy iteration?',
        choices: [
          'Evaluate the current policy, then greedily improve it',
          'Tokenize the state, then sample a reward',
          'Split train and test data, then fit a classifier',
        ],
        answerIndex: 0,
        explanation: 'Policy iteration alternates policy evaluation with policy improvement until the greedy policy stops changing.',
      },
      {
        id: 'stable-policy',
        prompt: 'What does it mean when the improved policy matches the current policy?',
        choices: [
          'The policy is stable under the current value estimates',
          'The transition model has been deleted',
          'Rewards no longer affect decisions',
        ],
        answerIndex: 0,
        explanation: 'If greedy improvement no longer changes any state action, policy iteration has reached a stable policy for the model.',
      },
    ],
    labs: [
      {
        id: 'policy-flip',
        title: 'Find a policy flip',
        prompt: 'Increase improvement rounds and identify the first state whose action changes from the initial policy.',
        successCriteria: 'You can name the state, the old action, and the improved greedy action.',
      },
    ],
  },
  'rl-foundations': {
    quiz: RL_FOUNDATIONS_QUIZ,
    labs: [
      {
        id: 'design-reward',
        title: 'Design a reward safely',
        prompt: 'Use the reward editor to create a path with a tempting side reward, then explain whether it could distract from the goal.',
        successCriteria: 'You can identify the intended behavior, the numeric incentive, and one possible reward-hacking failure.',
      },
    ],
  },
  'q-learning': {
    quiz: Q_LEARNING_QUIZ,
    labs: [
      {
        id: 'trace-one-update',
        title: 'Trace one Q update',
        prompt: 'Use the Bellman update tab to choose old Q, reward, future Q, alpha, and gamma, then predict the new Q before reading it.',
        successCriteria: 'You can name the target, TD error, and final nudged Q-value for one transition.',
      },
    ],
  },
  'rl-exploration': {
    quiz: RL_EXPLORATION_QUIZ,
    labs: [
      {
        id: 'tune-epsilon',
        title: 'Tune exploration for risk',
        prompt: 'Compare low and high epsilon in the epsilon and cliff tabs, then choose a setting for fast learning without frequent falls.',
        successCriteria: 'You can justify the setting using exploration count, exploitation count, falls, and wins.',
      },
    ],
  },
  'policy-gradients': {
    quiz: [
      {
        id: 'positive-advantage',
        prompt: 'What happens to the sampled action when its advantage is positive?',
        choices: [
          'Its log-probability is pushed upward',
          'Its probability is forced to zero',
          'The transition model is recomputed exactly',
        ],
        answerIndex: 0,
        explanation: 'Policy gradients reinforce sampled actions that beat the baseline by increasing their log-probability.',
      },
      {
        id: 'policy-object',
        prompt: 'What is optimized directly in policy-gradient methods?',
        choices: [
          'The stochastic policy action probabilities',
          'Only a fixed Q-table',
          'Only the train/test split',
        ],
        answerIndex: 0,
        explanation: 'Unlike tabular value methods, policy gradients update policy parameters that control action probabilities.',
      },
      {
        id: 'advantage-guarantee',
        prompt: 'What is a policy-gradient misconception?',
        choices: [
          'Thinking one positive-advantage sample guarantees the globally best policy',
          'Using advantage sign to push a sampled action up or down',
          'Updating stochastic action probabilities directly',
        ],
        answerIndex: 0,
        explanation: 'A sampled policy-gradient update is noisy local evidence, not a global guarantee.',
      },
    ],
    labs: [
      {
        id: 'advantage-flip',
        title: 'Flip the advantage',
        prompt: 'Move return below and above the baseline and watch the sampled action probability move down or up.',
        successCriteria: 'You can explain how the sign of advantage changes the policy update direction.',
      },
    ],
  },
  'actor-critic': {
    quiz: [
      {
        id: 'actor-vs-critic',
        prompt: 'What does the critic provide to the actor?',
        choices: [
          'A value baseline used to compute advantage',
          'The final sampled action with no policy',
          'A train/test split for supervised learning',
        ],
        answerIndex: 0,
        explanation: 'The critic estimates value; the actor uses return minus that value as an advantage signal.',
      },
      {
        id: 'negative-advantage',
        prompt: 'If return is below the critic value, what should happen to the sampled action?',
        choices: [
          'The actor should reduce its log-probability',
          'The critic should choose the action directly',
          'The action must become deterministic',
        ],
        answerIndex: 0,
        explanation: 'A negative advantage means the action underperformed the critic baseline, so the actor is pushed away from it.',
      },
      {
        id: 'critic-action-choice',
        prompt: 'What is an actor-critic misconception?',
        choices: [
          'Thinking the critic directly chooses the action instead of estimating value for the actor update',
          'Using the critic value as a baseline',
          'Letting the actor own the stochastic policy',
        ],
        answerIndex: 0,
        explanation: 'The actor selects actions; the critic estimates value so the update has a lower-variance advantage signal.',
      },
    ],
    labs: [
      {
        id: 'critic-baseline',
        title: 'Find the sign flip',
        prompt: 'Move critic value above and below return and watch the actor update switch from reinforcing to discouraging.',
        successCriteria: 'You can explain why the critic changes update sign without choosing actions itself.',
      },
    ],
  },
  'ppo-clipped-policy-gradient': {
    quiz: [
      {
        id: 'positive-advantage-upper-clip',
        prompt: 'With a positive advantage, which PPO ratio side can be clipped?',
        choices: [
          'A ratio above 1 + epsilon because extra probability increase stops getting extra objective gain',
          'Only a ratio below 1 - epsilon because positive advantages always punish actions',
          'No ratio can be clipped when the advantage is positive',
        ],
        answerIndex: 0,
        explanation: 'For positive advantage, the unclipped objective keeps growing with ratio, so PPO caps the useful gain at the upper clipping bound.',
      },
      {
        id: 'negative-advantage-lower-clip',
        prompt: 'With a negative advantage, which ratio side is dangerous enough to activate PPO clipping?',
        choices: [
          'A ratio below 1 - epsilon because it would reduce the bad action too aggressively',
          'A ratio above 1 + epsilon because it always improves the policy',
          'Only a ratio exactly equal to 1',
        ],
        answerIndex: 0,
        explanation: 'For negative advantage, the minimum selects the more conservative objective when the ratio falls too far below the lower bound.',
      },
      {
        id: 'ratio-definition',
        prompt: 'What does the PPO policy ratio r_t compare?',
        choices: [
          'The new policy probability for the sampled action divided by the old collection-policy probability',
          'The critic value divided by the immediate reward',
          'The training loss divided by the validation loss',
        ],
        answerIndex: 0,
        explanation: 'PPO is an on-policy-style update that reuses sampled actions by comparing new action probability with the behavior policy probability.',
      },
      {
        id: 'ppo-not-proof',
        prompt: 'What is a PPO clipping misconception?',
        choices: [
          'Thinking clipping proves monotonic policy improvement without KL, entropy, or value-function checks',
          'Computing both unclipped and clipped surrogate terms',
          'Using advantages from an actor-critic baseline',
        ],
        answerIndex: 0,
        explanation: 'PPO clipping is a practical guardrail, not the full trust-region guarantee; diagnostics still matter.',
      },
      {
        id: 'kl-monitoring',
        prompt: 'Why monitor approximate KL during PPO training?',
        choices: [
          'To detect policy drift that can accumulate even when individual clipped terms look acceptable',
          'To replace the advantage calculation entirely',
          'To make the old policy probability always equal one',
        ],
        answerIndex: 0,
        explanation: 'The clipped objective only constrains sampled ratio gains locally, while the full policy distribution can still drift across updates.',
      },
    ],
    labs: [
      {
        id: 'clip-sign-audit',
        title: 'Audit clipping by advantage sign',
        prompt: 'Set a positive advantage and push the ratio above 1 + epsilon, then set a negative advantage and push the ratio below 1 - epsilon.',
        successCriteria: 'You can state which side clipped in each case and compute both surrogate candidates for one minibatch row.',
      },
    ],
  },
  'reward-shaping': {
    quiz: [
      {
        id: 'sparse-vs-shaped',
        prompt: 'Why add a shaping reward to a sparse-reward task?',
        choices: [
          'To provide denser learning feedback while the real goal remains sparse',
          'To replace the environment objective with an easier one',
          'To remove the need for discounting or value estimates',
        ],
        answerIndex: 0,
        explanation: 'Shaping gives the agent intermediate feedback, but the task reward should still define success.',
      },
      {
        id: 'potential-based-safety',
        prompt: 'What is the main reason to prefer potential-based shaping?',
        choices: [
          'It can guide progress without changing which policy is optimal',
          'It always makes rewards larger than zero',
          'It turns policy gradients into supervised learning',
        ],
        answerIndex: 0,
        explanation: 'Potential-based shaping rewards progress between states and is designed to preserve the intended optimum.',
      },
    ],
    labs: [
      {
        id: 'sparse-to-dense',
        title: 'Turn sparse reward into a hint',
        prompt: 'Move the next state toward and away from the goal and compare task reward, shaping bonus, and total signal.',
        successCriteria: 'You can identify when shaping helps exploration and when it would risk changing the objective.',
      },
    ],
  },
  'diffusion-basics': {
    quiz: DIFFUSION_BASICS_QUIZ,
    labs: [
      {
        id: 'noise-prediction-error',
        title: 'Tune the noise prediction',
        prompt: 'Move timestep and prediction error to see how noisy sample and denoised estimate diverge from the clean signal.',
        successCriteria: 'You can explain why a better noise estimate produces a cleaner recovered sample.',
      },
      {
        id: 'schedule-signal-audit',
        title: 'Audit the noise schedule',
        prompt: 'Record the signal weight, noise weight, noisy sample, predicted noise, and recovered estimate at low, middle, and high timesteps.',
        successCriteria: 'You can explain why the same prediction error has different visual effects as the signal-to-noise balance changes.',
      },
      {
        id: 'denoising-debug-note',
        title: 'Write a denoising debug note',
        prompt: 'Given a noisy or blurry final sample, trace whether the likely cause is under-removal, over-removal, data scaling, too few steps, or a schedule mismatch.',
        successCriteria: 'You can connect the artifact to a concrete failure in the forward/noise-prediction/reverse-update loop.',
      },
    ],
  },
  'diffusion-sampling': {
    quiz: DIFFUSION_SAMPLING_QUIZ,
    labs: [
      {
        id: 'compare-samplers',
        title: 'Compare sampler paths',
        prompt: 'Switch between DDPM, DDIM, and flow/ODE while changing step count and prediction quality.',
        successCriteria: 'You can describe how stochasticity, step count, and prediction quality change the path from noise to sample.',
      },
      {
        id: 'step-count-ablation',
        title: 'Run a step-count ablation',
        prompt: 'Hold the denoiser quality and seed fixed, then compare low, medium, and high step counts for clarity, artifact rate, latency, and late-detail recovery.',
        successCriteria: 'You can explain when fewer steps are faster but more fragile, and when more steps are worth the added denoiser calls.',
      },
      {
        id: 'seed-stochasticity-report',
        title: 'Report seed and stochasticity',
        prompt: 'Compare deterministic and stochastic settings across multiple seeds, then separate reproducibility, diversity, best-case quality, and failure variance.',
        successCriteria: 'You can avoid judging a sampler from one lucky seed and can identify whether randomness improved variety, quality, or neither.',
      },
    ],
  },
  'classifier-free-guidance': {
    quiz: CLASSIFIER_FREE_GUIDANCE_QUIZ,
    labs: [
      {
        id: 'guidance-scale-sweep',
        title: 'Sweep guidance scale',
        prompt: 'Move guidance scale from low to high and compare prompt match, diversity, and artifact risk.',
        successCriteria: 'You can explain why a moderate scale can be better than the maximum scale.',
      },
      {
        id: 'branch-difference-inspection',
        title: 'Inspect branch differences',
        prompt: 'Set conditional and unconditional predictions close together, then far apart, and predict how the guidance direction changes before moving the scale.',
        successCriteria: 'You can explain why scale has little steering effect when the two denoiser predictions are nearly identical.',
      },
      {
        id: 'production-scale-calibration',
        title: 'Calibrate a production preset',
        prompt: 'Hold the seed, sampler, steps, and model fixed while sweeping scale across prompt slices, then record prompt match, diversity, saturation, artifacts, and latency.',
        successCriteria: 'You can choose a guidance preset from measured tradeoffs rather than from one lucky high-scale sample.',
      },
    ],
  },
  'unet-vs-dit': {
    quiz: UNET_VS_DIT_QUIZ,
    labs: [
      {
        id: 'patch-cost',
        title: 'Inspect patch-token cost',
        prompt: 'Change resolution and patch size and watch token count and attention-pair cost move.',
        successCriteria: 'You can explain why smaller patches improve detail but increase transformer attention cost.',
      },
      {
        id: 'backbone-constraint-comparison',
        title: 'Compare backbone constraints',
        prompt: 'Switch between U-Net and DiT while holding resolution, depth, and patch size steady, then record local bias, global mixing, and memory pressure.',
        successCriteria: 'You can explain how representation and mixing change when the backbone changes, without claiming either architecture is universally better.',
      },
      {
        id: 'detail-memory-sweep',
        title: 'Sweep detail against memory',
        prompt: 'Increase resolution and decrease patch size in stages, then explain how detail potential, token count, attention pairs, and latency move together.',
        successCriteria: 'You can justify a patch and resolution setting from measured quality-cost tradeoffs rather than from the smallest patch alone.',
      },
    ],
  },
  'model-debugging': {
    quiz: MODEL_DEBUGGING_QUIZ,
    labs: [
      {
        id: 'debug-loop',
        title: 'Run a constrained debugging loop',
        prompt: 'Choose a scenario, run checks by stage, pick the highest-support root-cause, and select one targeted intervention.',
        successCriteria: 'You should produce one slice with improved recall and describe why the root-cause hypothesis aligned with a later signal.',
      },
    ],
  },
  'model-interpretability': {
    quiz: MODEL_INTERPRETABILITY_QUIZ,
    labs: [
      {
        id: 'compare-modes',
        title: 'Find an unstable attribution mode',
        prompt: 'Enable correlation mode and compare top attributions before and after a counterfactual perturbation.',
        successCriteria: 'You can explain one case where explanation confidence drops when correlation increases.',
      },
    ],
  },
  'model-monitoring': {
    quiz: MODEL_MONITORING_QUIZ,
    labs: [
      {
        id: 'configure-playbook',
        title: 'Tune monitoring and choose a playbook',
        prompt: 'Set a strictness profile and scenario to create 1-2 active alerts, then choose the best response playbook.',
        successCriteria: 'You should describe which metric triggered first and why the selected playbook matches that risk.',
      },
    ],
  },
  'uncertainty-estimation': {
    quiz: [
      {
        id: 'calibration-vs-confidence',
        prompt: 'What is the distinction between confidence and calibration in this context?',
        choices: [
          'Confidence is uncertainty width; calibration is long-run reliability of probabilities or intervals',
          'They are always equivalent',
          'Calibration is only for classification, confidence only for regression',
        ],
        answerIndex: 0,
        explanation: 'A model can be highly confident and still poorly calibrated.',
      },
      {
        id: 'wide-interval',
        prompt: 'A very wide interval should usually be interpreted as:',
        choices: [
          'A warning about higher uncertainty or distribution mismatch',
          'A guaranteed prediction failure',
          'Proof that the model is overfitting',
        ],
        answerIndex: 0,
        explanation: 'Width is a caution signal; it is useful when interpreted with coverage and abstain policies.',
      },
      {
        id: 'abstain-policy',
        prompt: 'What is the operational role of abstain or defer in uncertainty-aware systems?',
        choices: [
          'Send low-confidence cases to fallback review or broader context',
          'Drop half the data for free speed gains',
          'Replace training labels with a prior mean',
        ],
        answerIndex: 0,
        explanation: 'Abstain policies convert uncertain predictions into explicit review cases.',
      },
    ],
    labs: [
      {
        id: 'coverage-vs-width',
        title: 'Balance width and coverage',
        prompt: 'Increase target coverage and adjust abstain threshold while watching coverage and mean interval width.',
        successCriteria: 'You can keep coverage stable while preventing too much unnecessary abstention.',
      },
    ],
  },
  'model-fairness': {
    quiz: [
      {
        id: 'parity-difference',
        prompt: 'Which objective best focuses on equal selection proportions across groups?',
        choices: [
          'Selection-rate parity',
          'FPR parity',
          'TPR parity',
        ],
        answerIndex: 0,
        explanation: 'Selection parity compares the share of positive predictions across groups.',
      },
      {
        id: 'conflict-rule',
        prompt: 'A practical implication of fairness trade-offs is:',
        choices: [
          'Satisfying one constraint may worsen another',
          'Every fairness metric can be optimized simultaneously at full strength',
          'No threshold changes are needed if one metric is equal',
        ],
        answerIndex: 0,
        explanation: 'Metrics can conflict; governance choices must set priorities.',
      },
      {
        id: 'counterfactual-use',
        prompt: 'When should group-specific thresholds be considered?',
        choices: [
          'When global thresholds cannot meet the chosen fairness and utility trade-off',
          'Never, because they always invalidate comparisons',
          'Only when model training accuracy is below 50%',
        ],
        answerIndex: 0,
        explanation: 'Group thresholds are a controlled tool to rebalance operational parity, but they should be policy-driven.',
      },
    ],
    labs: [
      {
        id: 'objective-target',
        title: 'Match one fairness objective',
        prompt: 'Pick an objective and tune thresholds/shift until your selected objective gap is materially reduced.',
        successCriteria: 'You can explain which other metric moved and why this reflects a trade-off.',
      },
    ],
  },
  'bloom-filter': {
    quiz: BLOOM_FILTER_QUIZ,
    labs: [
      {
        id: 'force-collision',
        title: 'Force and explain a collision',
        prompt: 'Use the false positive lab to add several words, then query a word that was not added until the filter reports probably present.',
        successCriteria: 'You can list the queried hash positions and explain which inserted words already set those bits.',
      },
    ],
  },
  'grpo-reasoning': {
    quiz: GRPO_REASONING_QUIZ,
    labs: [
      {
        id: 'mini-grpo-advantages',
        title: 'Compute group advantages',
        prompt: 'Open mini-grpo exercises 01 and 02, then implement mean reward, population standard deviation, and group-relative advantages.',
        successCriteria: 'The tests show positive advantages for above-average rewards, negative advantages for below-average rewards, and zero signal when variance is zero.',
      },
      {
        id: 'mini-grpo-clipping-kl',
        title: 'Bound the policy update',
        prompt: 'Open mini-grpo exercises 05, 06, and 07, then implement policy ratio, clipped surrogate, and KL-penalized objective.',
        successCriteria: 'The clipped objective handles positive and negative advantages correctly, and KL reduces the reward objective.',
      },
      {
        id: 'mini-grpo-distillation',
        title: 'Filter teacher outputs',
        prompt: 'Open mini-grpo exercises 09 and 10, then detect useful groups and keep high-reward samples for distillation.',
        successCriteria: 'Only contrastive groups count as useful, and only samples above the reward threshold remain in the student dataset.',
      },
    ],
  },
  'dapo-reasoning-rl': {
    quiz: DAPO_REASONING_RL_QUIZ,
    labs: [
      {
        id: 'mini-dapo-group-signal',
        title: 'Filter useful rollout groups',
        prompt: 'Open mini-dapo exercises 01, 02, 03, and 08, then implement group accuracy, dynamic sampling, normalized advantages, and effective batch counts.',
        successCriteria: 'All-correct and all-wrong groups are rejected, mixed groups remain, and normalized advantages become zero when reward variance is zero.',
      },
      {
        id: 'mini-dapo-objective',
        title: 'Implement the DAPO update pieces',
        prompt: 'Open mini-dapo exercises 04, 05, and 09, then implement Clip-Higher ranges, token-level loss, and the toy DAPO sample objective.',
        successCriteria: 'The objective combines shaped reward, group advantage, token ratios, and asymmetric clipping with the expected sign.',
      },
      {
        id: 'mini-dapo-training-health',
        title: 'Diagnose long-CoT training health',
        prompt: 'Open mini-dapo exercises 06, 07, and 10, then implement overlong reward shaping, entropy collapse detection, and training health labels.',
        successCriteria: 'The dashboard flags low signal, entropy collapse, too-overlong batches, and healthy batches according to the specified thresholds.',
      },
    ],
  },
  'coconut-latent-reasoning': {
    quiz: COCONUT_LATENT_REASONING_QUIZ,
    labs: [
      {
        id: 'trace-latent-feedback',
        title: 'Trace language mode versus latent mode',
        prompt: 'Use the Coconut lesson controls to compare CoT and Coconut, then explain when the LM head is used and when h_t becomes x_t+1.',
        successCriteria: 'You can identify the hidden-state feedback edge and explain why the visible token count differs from the compute-step count.',
      },
      {
        id: 'measure-delayed-commitment',
        title: 'Measure delayed commitment',
        prompt: 'Switch to the planning task, vary latent thoughts from 1 to 8, and watch branch entropy and commitment step change.',
        successCriteria: 'You can explain why high early entropy and low final entropy mean the model delayed a hard branch choice.',
      },
      {
        id: 'run-mini-coconut',
        title: 'Implement the mini-coconut mechanics',
        prompt: 'Open mini-coconut exercises 01 through 10 and implement mode switching, latent feedback, masked loss, entropy, perturbation, token budgets, and nearest-token probes.',
        successCriteria: 'The exercise tests pass and you can connect each function to the lesson panel it supports.',
      },
    ],
  },
  'reasoning-rlvr-grpo': {
    quiz: REASONING_RLVR_GRPO_QUIZ,
    labs: [
      {
        id: 'grpo-group-advantage-lab',
        title: 'Compute GRPO group advantages',
        prompt: 'Implement total_reward, group_advantages, and update_direction in the browser Python lab.',
        successCriteria: [
          'Rewards match the reference formula',
          'Advantages are group-normalized',
          'Update directions follow the advantage threshold',
          'Learner can explain which candidate is reinforced',
        ],
      },
      {
        id: 'tune-grpo-rewards',
        title: 'Balance reasoning rewards',
        prompt: 'Configure correctness, format, and language weights to achieve 90% accuracy without triggering overthinking or formatting hacks.',
        successCriteria: 'You can find a reward configuration where accuracy is high, formatting is correct, and trace length remains under 500 tokens.',
      },
      {
        id: 'solve-all-negatives',
        title: 'Mitigate all-negative groups',
        prompt: 'Identify a prompt where all initial samples are incorrect, and adjust temperature or group size to discover at least one correct trace.',
        successCriteria: 'You can explain how increasing group size or temperature helps recover from all-negative training groups.',
      },
      {
        id: 'process-credit',
        title: 'Step-level credit assignment',
        prompt: 'Compare outcome-based vs step-based rewards on a multi-step proof and identify which step receives incorrect credit under an ORM.',
        successCriteria: 'You can pinpoint the exact line where the proof failed but still received a positive score under ORM evaluation.',
      },
      {
        id: 'detect-reward-hacking',
        title: 'Detect formatting exploitation',
        prompt: 'Trigger a formatting hack by setting format reward above 1.0, and capture a generated trace that contains empty thinking tags.',
        successCriteria: 'You can capture a trace where the model outputs `<think></think>` multiple times to collect rewards without reasoning.',
      },
      {
        id: 'distill-student',
        title: 'Verify student distillation',
        prompt: 'Train a 1.5B student on teacher traces and evaluate its accuracy vs trace length on a test set of mathematical word problems.',
        successCriteria: 'You can explain where the student mimics the teacher\'s format but fails to solve the underlying math.',
      },
      {
        id: 'prevent-kl-drift',
        title: 'Control KL divergence',
        prompt: 'Tune the KL coefficient during online policy updates and find the threshold where the model\'s language consistency collapses.',
        successCriteria: 'You can report the KL penalty value that preserves natural language structure while allowing the model to optimize rewards.',
      },
    ],
  },
  'test-time-compute-thinking-budgets': {
    quiz: TEST_TIME_COMPUTE_THINKING_BUDGETS_QUIZ,
    labs: [
      {
        id: 'bon-verifier-sweep',
        title: 'Best-of-N verifier quality sweep',
        prompt: 'Set N=16 and adjust verifier quality from 20% to 100%. Record effective accuracy at each quality level and identify where improving the verifier provides more value than doubling N.',
        successCriteria: 'You can explain why improving verifier quality from 60% to 80% often beats doubling N from 16 to 32.',
      },
      {
        id: 'budget-forcing-inflection',
        title: 'Find the accuracy inflection point',
        prompt: 'Sweep the thinking budget from 64 to 8192 tokens and identify the budget at which accuracy stops improving by more than 1% per doubling.',
        successCriteria: 'You can report the inflection budget and explain why the latency-accuracy Pareto frontier favors stopping there.',
      },
      {
        id: 'react-token-savings',
        title: 'Measure ReAct token savings',
        prompt: 'Step through the ReAct walkthrough for a factual query and estimate how many reasoning tokens the model would need if tools were unavailable.',
        successCriteria: 'You can calculate the token savings from delegating fact retrieval to a search tool versus generating the facts directly.',
      },
      {
        id: 'adaptive-routing',
        title: 'Design an adaptive budget policy',
        prompt: 'Given three query difficulty classes (trivial, moderate, hard), propose budget caps (in tokens) for each class and justify the choice using the budget-forcing accuracy curves.',
        successCriteria: 'Your policy reduces average token spend by at least 40% relative to the max-budget baseline while maintaining ≥95% of peak accuracy on the hard class.',
      },
    ],
  },
  'long-context-frontier-models': {
    quiz: LONG_CONTEXT_FRONTIER_MODELS_QUIZ,
    labs: [
      {
        id: 'strategy-selection',
        title: 'Choose a context strategy',
        prompt: 'Given 200 legal documents, 3 relevant clauses, sparse evidence, and citation requirements, choose full context, RAG, compressed memory, or hybrid.',
        successCriteria: 'You justify the choice using evidence recall, distractor load, citation quality, cost, and latency.',
      },
      {
        id: 'lost-middle-mitigation',
        title: 'Mitigate lost-in-the-middle',
        prompt: 'Move key evidence from the beginning to the middle of a long context, then choose a mitigation such as reranking, reordering, or citation-aware packing.',
        successCriteria: 'You explain why position matters and how the mitigation improves evidence use.',
      },
      {
        id: 'hybrid-packing',
        title: 'Tune hybrid packing',
        prompt: 'Retrieve top-k chunks, rerank them, and pack a long-context prompt for a multi-hop question with distractors.',
        successCriteria: 'You maximize included relevant evidence while minimizing distractor ratio and cost.',
      },
    ],
  },
  'omni-multimodal-architectures': {
    quiz: OMNI_MULTIMODAL_ARCHITECTURES_QUIZ,
    labs: [
      {
        id: 'multimodal-token-stream',
        title: 'Build a multimodal token stream',
        prompt: 'Add text, one image, a 10-second video, and a spoken question. Count how many tokens each modality contributes.',
        successCriteria: 'You explain why video and audio can dominate the token budget.',
      },
      {
        id: 'fusion-strategy',
        title: 'Choose a fusion strategy',
        prompt: 'Compare early fusion, late fusion, cross-attention, and Thinker-Talker for chart QA, video QA, and real-time voice chat.',
        successCriteria: 'You match fusion design to task constraints and latency requirements.',
      },
      {
        id: 'grounding-audit',
        title: 'Audit grounding',
        prompt: 'Ask about an object in a cluttered image and compare ungrounded answer, attention heatmap, and bounding-box grounding.',
        successCriteria: 'You distinguish correct captioning from grounded localization.',
      },
      {
        id: 'audio-codec-streaming',
        title: 'Compare speech generators',
        prompt: 'Compare diffusion-style audio generation with codec autoregression, then tune first-packet latency and quality.',
        successCriteria: 'You explain why codec autoregression can start speech earlier and what quality tradeoff it creates.',
      },
    ],
  },
  'diffusion-language-models': {
    quiz: DIFFUSION_LANGUAGE_MODELS_QUIZ,
    labs: [
      {
        id: 'ar-diffusion-timeline',
        title: 'Compare generation timelines',
        prompt: 'Generate a 16-token response with AR and masked diffusion. Count sequential steps and compare revision behavior.',
        successCriteria: 'You explain left-to-right commitment versus iterative masked-token refinement.',
      },
      {
        id: 'mask-schedule-tuning',
        title: 'Tune the mask schedule',
        prompt: 'Try linear, cosine, and confidence-based schedules. Find which completes a response with fewest contradictions.',
        successCriteria: 'You connect schedule choice to coherence, latency, and revision instability.',
      },
      {
        id: 'confidence-locking',
        title: 'Audit confidence locking',
        prompt: 'Set confidence threshold low, medium, and high. Watch premature locking and slow completion trade off.',
        successCriteria: 'You explain why too-low and too-high thresholds fail differently.',
      },
      {
        id: 'block-diffusion-lab',
        title: 'Explore block diffusion',
        prompt: 'Generate a 64-token answer with 8-token, 16-token, and 32-token blocks. Compare boundary coherence and speed.',
        successCriteria: 'You explain why block size affects flexibility, KV-cache usefulness, and coherence.',
      },
    ],
  },
  'efficient-llm-serving': {
    quiz: EFFICIENT_LLM_SERVING_QUIZ,
    labs: [
      {
        id: 'prefill-decode-diagnosis',
        title: 'Diagnose prefill vs decode',
        prompt: 'Given requests with different prompt and output lengths, identify whether each stresses TTFT or TPOT more.',
        successCriteria: 'You distinguish long-prompt prefill pressure from long-answer decode pressure.',
      },
      {
        id: 'paged-kv-allocation',
        title: 'Allocate paged KV cache',
        prompt: 'Allocate KV cache for mixed short and long requests using contiguous allocation, then switch to paged allocation.',
        successCriteria: 'You explain fragmentation, KV blocks, and block-table mapping.',
      },
      {
        id: 'speculation-acceptance',
        title: 'Tune speculation',
        prompt: 'Vary draft quality and draft length. Find when speculative decoding speeds up and when it wastes work.',
        successCriteria: 'You explain acceptance rate, target verification, and draft compute cost.',
      },
      {
        id: 'goodput-slo',
        title: 'Tune for goodput',
        prompt: 'Tune max batch tokens, queue timeout, and speculation under a P95 latency SLO.',
        successCriteria: 'You maximize useful throughput under the latency target, not raw tokens/sec.',
      },
    ],
  },
  'frontier-evaluation-safety': {
    quiz: FRONTIER_EVALUATION_SAFETY_QUIZ,
    labs: [
      {
        id: 'capability-product-layer',
        title: 'Capability vs product eval',
        prompt: 'Given a model that scores high on a coding benchmark but fails approval rules in a code-agent product, classify which eval layer failed.',
        successCriteria: 'You separate benchmark capability from product-safe completion.',
      },
      {
        id: 'prompt-injection-defense',
        title: 'Prompt injection defense',
        prompt: 'Inject malicious instructions into a retrieved webpage or file. Configure source trust labels, prompt guards, and permission gates.',
        successCriteria: 'You block the injected instruction while preserving useful task completion.',
      },
      {
        id: 'reward-hacking-simulator',
        title: 'Reward hacking simulator',
        prompt: 'Reward a coding agent only for passing one target test. Watch it game the test, then add regression and review checks.',
        successCriteria: 'You explain measured reward versus intended objective.',
      },
      {
        id: 'deployment-gate-lab',
        title: 'Deployment gate',
        prompt: 'A model passes capability evals but fails prompt-injection and unsafe-action evals. Choose launch, limited beta, restricted tools, or delay.',
        successCriteria: 'You justify deployment mode from residual risk and mitigation confidence.',
      },
    ],
  },
  'tool-using-reasoning-models': {
    quiz: TOOL_USING_REASONING_MODELS_QUIZ,
    labs: [
      {
        id: 'choose-the-right-tool',
        title: 'Choose the right tool',
        prompt: 'Given five tasks, choose whether to answer directly, search, use Python, read files, or ask for approval.',
        successCriteria: 'Learner explains the missing information or uncertainty that justifies each tool.',
      },
      {
        id: 'query-refinement',
        title: 'Search-R1 style query refinement',
        prompt: 'Start with a broad search query, inspect weak results, generate a better query, and stop when evidence is sufficient.',
        successCriteria: 'Learner explains why each new query improved relevance or freshness.',
      },
      {
        id: 'python-verifier',
        title: 'Python verifier',
        prompt: 'Solve a math/data question by reasoning first, then use Python to check the result.',
        successCriteria: 'Learner identifies whether Python corrected computation or merely confirmed it.',
      },
      {
        id: 'file-grounding-audit',
        title: 'File-grounding audit',
        prompt: 'Answer a document question using only evidence from provided files. Flag unsupported claims.',
        successCriteria: 'Learner distinguishes grounded claims from plausible but unsupported claims.',
      },
      {
        id: 'function-vs-plan',
        title: 'Function call vs agent plan',
        prompt: 'Classify tasks as single function call, multi-step agent plan, or approval-required workflow.',
        successCriteria: 'Learner explains why a valid function call is not the same as a safe plan.',
      },
      {
        id: 'tool-result-masking',
        title: 'Tool-result masking',
        prompt: 'Inspect a trajectory with model tokens and search-result tokens. Mark which tokens should contribute to the RL generation loss.',
        successCriteria: 'Learner masks tool observations while keeping model actions and final answer trainable.',
      },
      {
        id: 'failure-injection',
        title: 'Failure injection',
        prompt: 'Turn on stale search, prompt injection, or hallucinated tool output. Diagnose the failure and choose a mitigation.',
        successCriteria: 'Learner identifies the failure source and applies the right guardrail.',
      },
    ],
  },
  'agentic-coding-systems': {
    quiz: AGENTIC_CODING_SYSTEMS_QUIZ,
    labs: [
      {
        id: 'swe-bench-loop-trace',
        title: 'SWE-bench loop trace',
        prompt: 'Given an issue and repo map, identify likely files, propose a minimal patch plan, and choose target plus regression tests.',
        successCriteria: 'Learner maps issue to files, patch, tests, and review evidence.',
      },
      {
        id: 'patch-review-lab',
        title: 'Patch review',
        prompt: 'Compare three diffs: a minimal fix, an overbroad refactor, and a test-gaming patch.',
        successCriteria: 'Learner identifies reviewability, scope, and correctness risks.',
      },
      {
        id: 'approval-boundary-lab',
        title: 'Approval boundary',
        prompt: 'Configure approval gates for risky edits, shell commands, secrets, package installs, and PR submission.',
        successCriteria: 'Learner distinguishes safe reads, test execution, side effects, and irreversible actions.',
      },
    ],
  },
};

const TARGET_QUIZ_QUESTIONS = 100;
const DEFAULT_COMPLETION_POLICY = Object.freeze({
  quickCheckRequired: 5,
  masteryRequired: 12,
  passThreshold: 0.8,
  labsRequired: 1,
  strategyReviewOptional: true,
});

function cleanSentence(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .trim();
}

function withPeriod(value) {
  const sentence = cleanSentence(value);
  if (!sentence) return '';
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

function rotateChoices(choices, offset) {
  const rotation = offset % choices.length;
  const rotated = [...choices.slice(rotation), ...choices.slice(0, rotation)];
  return {
    choices: rotated,
    answerIndex: rotated.indexOf(choices[0]),
  };
}

function sentenceFromList(values, fallback) {
  const cleaned = values.map(cleanSentence).filter(Boolean);
  if (!cleaned.length) return fallback;
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(', ')}, and ${cleaned.at(-1)}`;
}

function makeGeneratedQuestion(index, level, prompt, correct, distractors, explanation) {
  const { choices, answerIndex } = rotateChoices([correct, ...distractors], index);
  return {
    id: `generated-${index + 1}`,
    level,
    skill: level === 'Foundation' ? 'recall' : level === 'Mechanism' ? 'mechanism' : 'transfer',
    countsForCompletion: index < DEFAULT_COMPLETION_POLICY.masteryRequired,
    prompt,
    choices,
    answerIndex,
    explanation,
  };
}

const CORE_SCENARIO_CONTEXTS = [
  'During an error analysis pass',
  'In a validation check',
  'When comparing two candidate settings',
  'After changing an input example',
  'While explaining a surprising output',
  'Before trusting a deployment decision',
  'When debugging a failed case',
  'For a small worked example',
];

function lowerFirst(value) {
  if (!value) return value;
  return `${value[0].toLowerCase()}${value.slice(1)}`;
}

function contextualizeCoreSpec(spec, cycleIndex) {
  if (cycleIndex === 0) return spec;
  const [level, prompt, correct, firstDistractor, secondDistractor, explanation] = spec;
  const context = CORE_SCENARIO_CONTEXTS[(cycleIndex - 1) % CORE_SCENARIO_CONTEXTS.length];

  return [
    level,
    `${context}, ${lowerFirst(prompt)}`,
    correct,
    firstDistractor,
    secondDistractor,
    explanation,
  ];
}

const TARGET_STRATEGY_REVIEW_QUESTIONS = 100;

function makeLearningStrategyDeck(animation) {
  const objectives = animation.learningObjectives?.length
    ? animation.learningObjectives
    : [
      `Explain the core idea behind ${animation.name}`,
      `Use the animation to predict how ${animation.description.toLowerCase()} changes the output`,
    ];
  const [primaryObjective] = objectives;
  const prereqs = animation.prerequisites?.length ? animation.prerequisites.join(', ') : 'the lesson setup';
  const misconception = animation.commonMisconception || `${animation.name} is a simplified teaching view; real systems add scale, data, and implementation details.`;
  const description = cleanSentence(animation.description).toLowerCase();
  const category = animation.categoryName || 'machine learning';
  const name = animation.name;
  const baseDifficulty = animation.difficulty || 'intermediate';
  const objectiveSummary = sentenceFromList(objectives, `explain ${description}`);
  const laterUse = `later ${category} lessons that depend on this mechanism`;
  const safeScope = `${name} teaches the core mechanism; production systems add data constraints, scale, monitoring, and edge cases`;
  const changePrompt = `a key input, parameter, threshold, representation, or assumption changes`;

  const specs = [
    ['Foundation', `What is the main job of ${name}?`, `To help explain ${description}`, 'To hide the input data from the learner', 'To replace evaluation with memorization', `${name} is introduced as a way to understand ${description}.`],
    ['Foundation', `Which learning goal best fits ${name}?`, withPeriod(primaryObjective), 'Ignore the visual behavior and memorize labels only.', 'Tune the final test set until it looks better.', withPeriod(primaryObjective)],
    ['Foundation', `When first opening ${name}, what should you identify before touching controls?`, 'The input, the transformation, and the output or decision', 'Only the color of the selected tab', 'The final answer without the setup', 'Strong understanding starts by locating what enters the system, what changes it, and what comes out.'],
    ['Foundation', `Which background is most useful before ${name}?`, prereqs, 'A production deployment checklist before any concept work', 'Only unrelated UI terminology', `The listed prerequisites prepare the concepts that ${name} builds on.`],
    ['Foundation', `What part of the curriculum does ${name} support?`, `${category} concept practice`, 'A storage persistence exercise', 'A Git workflow exercise', `${name} belongs to the ${category} part of the curriculum.`],
    ['Foundation', `What is the safest one-sentence summary of ${name}?`, `${name} explains ${description}`, `${name} proves every real system works the same way`, `${name} is only a naming exercise`, `The lesson is centered on ${description}.`],
    ['Foundation', `Which habit turns ${name} from passive reading into learning?`, 'Predict the next visual state before revealing or advancing it', 'Click every control without forming a hypothesis', 'Skip explanations after wrong answers', 'Prediction makes the animation a test of your mental model.'],
    ['Foundation', `What should a beginner be able to say after the first pass through ${name}?`, `What problem ${name} addresses and what output it produces`, 'The route URL from memory', 'The exact source file name only', 'The first milestone is conceptual orientation, not implementation trivia.'],
    ['Foundation', `Which choice is a useful definition-level check for ${name}?`, `Describe ${description} without relying on the animation labels`, 'Repeat the title word for word', 'Choose the longest answer automatically', 'A definition is useful only if it survives without UI hints.'],
    ['Foundation', `Why do the explanations after each answer matter in ${name}?`, 'They repair the reasoning path, not just reveal the correct letter', 'They are decorative text with no learning role', 'They replace the need to retry missed questions', 'The answer explains why the choice is correct so the concept can transfer.'],
    ['Foundation', `What should you not infer from a simplified ${name} diagram?`, 'That every production implementation has exactly the same internals', 'That the core mechanism is useless', 'That prerequisites never matter', 'Teaching diagrams remove details so the central mechanism is easier to see.'],
    ['Foundation', `Which phrase best describes the lesson difficulty for ${name}?`, `${baseDifficulty} concept with concrete visual checks`, 'No concept work is required', 'Advanced only because every answer is numerical', `The lesson metadata marks this as ${baseDifficulty}, while the assessment builds from recall to diagnosis.`],
    ['Foundation', `What is the first question to ask when a ${name} example is confusing?`, 'What changed between the previous state and the current state?', 'Which option letter appeared most often?', 'How many pixels moved on screen?', 'Most confusion clears when you isolate the changed variable or assumption.'],
    ['Foundation', `Which answer shows that you understand the vocabulary in ${name}?`, `You can connect the key terms to ${description}`, 'You can spell the title but cannot explain behavior', 'You can skip the glossary and still guess', 'Vocabulary is useful when it points to behavior and relationships.'],
    ['Foundation', `Why is ${name} included instead of only showing formulas?`, 'The visual state helps link symbols, data, and behavior', 'Visuals remove the need for mathematical reasoning', 'Formulas are never useful in interviews', 'Good animations connect intuition to formal reasoning.'],
    ['Foundation', `What should you write in a quick note after studying ${name}?`, `A one-line mechanism, one example, and one limitation`, 'Only that the lesson was opened', 'A copy of every button label', 'A compact note should preserve the idea, use case, and caution.'],
    ['Foundation', `Which beginner mistake should you avoid in ${name}?`, 'Treating the animation as a memorized sequence instead of a causal mechanism', 'Reading the prompt before choosing', 'Checking the prerequisite list', 'The goal is to know why the next state happens.'],
    ['Foundation', `What makes a wrong answer useful in ${name}?`, 'It exposes the assumption that needs to be corrected', 'It proves the topic should be skipped', 'It means the answer choices are random', 'Misses reveal where the mental model is incomplete.'],
    ['Foundation', `How should ${name} connect to its prerequisites?`, 'Use prerequisites as the concepts that make the current mechanism understandable', 'Ignore prerequisites because every lesson is isolated', 'Treat prerequisites as optional decoration only', 'Prerequisites are part of the reasoning chain.'],
    ['Foundation', `What is the foundation-level success criterion for ${name}?`, `Explain ${description} in plain language`, 'Memorize every generated question id', 'Finish the assessment without reading explanations', 'Plain-language explanation is the base layer before problem solving.'],

    ['Mechanism', `How should you use the controls in ${name}?`, 'Change one variable, predict the effect, then compare with the animation', 'Change every variable randomly and ignore the output', 'Reveal answers before forming a prediction', 'Interactive controls are most useful when they test a prediction.'],
    ['Mechanism', `Which statement is the safest interpretation of ${name}?`, safeScope, `${name} proves every dataset behaves identically`, `${name} removes the need for validation`, 'The lesson is a conceptual model, not a guarantee about every deployment.'],
    ['Mechanism', `What does a good self-check for ${name} ask you to do?`, `Use ${description} to predict a result before reading the explanation`, 'Repeat the title without connecting it to behavior', 'Skip the explanation after a wrong answer', 'A useful self-check connects the concept to a concrete prediction.'],
    ['Mechanism', `Why does ${name} matter in a larger ML workflow?`, 'It clarifies a decision or transformation that affects model behavior', 'It guarantees a model is fair and calibrated by itself', 'It removes the need to inspect data', 'Most lessons matter because a local mechanism changes downstream behavior.'],
    ['Mechanism', `Which question tests applied understanding of ${name}?`, `What changes when ${changePrompt}?`, 'What is the exact pixel color of the card border?', 'Can the title be alphabetized?', 'Applied understanding means predicting behavior under a meaningful change.'],
    ['Mechanism', `What should you do after a wrong answer in this check?`, 'Read the explanation and retry the same idea with a smaller example', 'Mark the lesson complete without revisiting it', 'Assume the animation is irrelevant', 'The explanation is meant to repair the mental model before moving on.'],
    ['Mechanism', `Which mechanism-level answer is strongest for ${name}?`, `It explains how ${objectiveSummary}`, 'It lists unrelated tools with no causal link', 'It ignores the observed output', 'Mechanism-level answers connect the lesson goal to a causal process.'],
    ['Mechanism', `What is a useful invariant to look for in ${name}?`, 'Something that should stay true even as examples or settings change', 'A fact that is true only for one pixel arrangement', 'A random detail that disappears after reset', 'Invariants help you separate the concept from incidental presentation.'],
    ['Mechanism', `When ${name} has multiple steps, how should you reason through them?`, 'Track the intermediate state after each step before jumping to the final output', 'Jump straight to the answer choice that sounds complex', 'Ignore intermediate values because only the last screen matters', 'Interviewers often test whether you can trace the chain, not just name it.'],
    ['Mechanism', `Which comparison deepens understanding of ${name}?`, 'Compare the current state with a nearby counterexample or alternative setting', 'Compare the font size with the page header', 'Compare unrelated lessons alphabetically', 'A counterexample clarifies what the mechanism is and is not doing.'],
    ['Mechanism', `What should you inspect when two ${name} outputs differ?`, 'The input, setting, assumption, or intermediate value that changed', 'Only whether the page was refreshed', 'The order of answer letters', 'Different outputs usually come from a changed condition in the mechanism.'],
    ['Mechanism', `How can you explain ${name} without hand-waving?`, 'Name the inputs, the transformation rule, the output, and the limitation', 'Use more jargon until the listener stops asking', 'Say it is obvious from the diagram', 'Clear explanations expose the actual moving parts.'],
    ['Mechanism', `What is the role of the common misconception in ${name}?`, 'It marks a tempting but wrong shortcut in the reasoning', 'It is the recommended answer for hard questions', 'It is unrelated to the lesson', 'Misconceptions are included because they often appear in interviews and debugging.'],
    ['Mechanism', `Which answer shows that you can trace ${name}?`, 'You can predict the next state from the current state and the selected control', 'You can remember the lesson category only', 'You can avoid all calculations by guessing', 'Tracing requires using the current state to forecast the next one.'],
    ['Mechanism', `Why should ${name} include both easy and hard questions?`, 'Easy questions establish vocabulary; hard questions test transfer and edge cases', 'All questions should be equally vague', 'Only trick questions teach concepts', 'A good progression builds the concept before stressing it.'],
    ['Mechanism', `What makes an explanation for ${name} interview-ready?`, 'It is precise, causal, and includes a boundary condition', 'It is long but avoids the main idea', 'It only names libraries', 'Interview explanations need correctness and scope, not just fluency.'],
    ['Mechanism', `How should you handle a formula or diagram in ${name}?`, 'Map each symbol or component to the visible behavior it controls', 'Memorize the shape without knowing what it represents', 'Ignore the diagram once the quiz starts', 'Symbols become useful when grounded in behavior.'],
    ['Mechanism', `Which detail is most likely to matter in a ${name} implementation?`, 'The assumption that controls when the simplified mechanism remains valid', 'The exact order of decorative labels', 'Whether the lesson card is first in the catalog', 'Implementation failures often come from violated assumptions.'],
    ['Mechanism', `What should you test if you think you understand ${name}?`, 'A small changed example that forces the mechanism to update', 'The same memorized example only', 'An unrelated page route', 'A new example tests whether the rule transfers.'],
    ['Mechanism', `What is the mechanism-level success criterion for ${name}?`, 'You can walk from input to output and justify each step', 'You can finish by guessing repeated letters', 'You can avoid the explanation panel', 'Mechanism mastery means the path from cause to effect is clear.'],

    ['Application', `How would you use ${name} in a practical ML discussion?`, `Explain when ${description} changes a model or system decision`, 'Use it as proof that no evaluation is needed', 'Mention it without connecting it to a system', 'Applied understanding ties the concept to decisions in a workflow.'],
    ['Application', `A teammate asks why ${name} matters. What is the best answer?`, 'It changes how we reason about inputs, outputs, trade-offs, or failure modes', 'It matters only because it appears in the catalog', 'It matters because all options are usually correct', 'A practical answer connects the lesson to engineering judgment.'],
    ['Application', `Which practical question should ${name} help you answer?`, `How to choose or diagnose behavior when ${changePrompt}`, 'How to avoid reading validation results', 'How to make every model larger', 'The useful skill is making or diagnosing a decision under a changed condition.'],
    ['Application', `What is a good experiment after learning ${name}?`, 'Construct a tiny example, predict the result, then compare with the lesson behavior', 'Only reread the title', 'Skip directly to deployment', 'Small experiments make abstract concepts operational.'],
    ['Application', `How should ${name} affect debugging?`, 'It gives a checklist of mechanism, assumptions, inputs, and observed output', 'It removes the need to inspect intermediate states', 'It makes every error a UI problem', 'Debugging starts by matching observed behavior to the mechanism.'],
    ['Application', `Which scenario shows good transfer from ${name}?`, `Applying ${objectiveSummary} to a new example with different values`, 'Repeating one memorized answer on every page', 'Ignoring prerequisites and constraints', 'Transfer means the concept works beyond the exact animation state.'],
    ['Application', `What should you ask before using ${name} in a production design?`, 'Do the lesson assumptions match the real data, scale, latency, and evaluation goal?', 'Can we avoid defining success?', 'Will a bigger model make the concept irrelevant?', 'Production use requires matching assumptions to constraints.'],
    ['Application', `Which metric or observation would make ${name} actionable?`, 'One that reveals whether the mechanism improved the intended behavior', 'One chosen only because it is easy to maximize', 'One measured on data that influenced the design repeatedly', 'Metrics matter when they align with the decision the concept affects.'],
    ['Application', `What should you communicate to a non-expert about ${name}?`, `The simple purpose, the key trade-off, and one example of ${description}`, 'Every internal implementation detail first', 'Only the acronym if one exists', 'Stakeholder explanations should preserve purpose and risk.'],
    ['Application', `When should you revisit the prerequisite material for ${name}?`, 'When you can follow the words but cannot predict the behavior', 'Only after completing every advanced question', 'Never, because prerequisites are unrelated', 'Prediction failure often points to a missing prerequisite.'],
    ['Application', `How can ${name} guide model review?`, 'Use it to ask whether the model behavior matches the intended mechanism and limits', 'Use it to approve any high training score', 'Use it to ignore data quality', 'Review should connect behavior to intent and constraints.'],
    ['Application', `Which application answer is too shallow for ${name}?`, 'It works because the animation says so', `It works when ${description} matches the task`, 'Its failure modes should be checked', 'A shallow answer cites authority instead of mechanism.'],
    ['Application', `How does ${name} help with trade-off thinking?`, 'It shows what improves, what may degrade, and what assumption controls the trade-off', 'It proves there are no trade-offs', 'It makes every setting equally good', 'Most ML concepts are useful because they expose a trade-off.'],
    ['Application', `What is a practical sign that you only memorized ${name}?`, 'You cannot adjust your answer when the setup changes', 'You can explain the limitation', 'You can name the prerequisite', 'Memorization breaks when the example changes.'],
    ['Application', `How should you answer a "when would you not use this?" question about ${name}?`, 'Name a violated assumption, failure mode, or better alternative', 'Say there is never a reason not to use it', 'Say only that it is complicated', 'Good applied knowledge includes when to avoid a tool.'],
    ['Application', `Which project note would be useful after studying ${name}?`, `Use ${name} when the task needs ${description}; check assumptions and evaluation before trusting results`, 'Question complete', 'Button clicked', 'Useful notes turn lesson knowledge into future engineering action.'],
    ['Application', `A result from ${name} improves one metric but worsens another. What should you do?`, 'Tie the decision to the real objective and document the trade-off', 'Always keep the setting that improves the first metric seen', 'Ignore the worsened metric', 'Applied ML requires choosing trade-offs against the task objective.'],
    ['Application', `What makes ${name} useful in an interview system-design answer?`, 'It gives a concrete mechanism plus operational caveats', 'It fills time without details', 'It avoids mentioning evaluation', 'Strong system-design answers include mechanism and operations.'],
    ['Application', `How can ${name} connect to ${laterUse}?`, 'It provides a mental model that later lessons reuse or stress-test', 'It blocks later lessons from adding nuance', 'It is unrelated once the page is closed', 'Curriculum concepts compound across lessons.'],
    ['Application', `What is the application-level success criterion for ${name}?`, 'You can choose, explain, and validate the concept in a realistic scenario', 'You can only answer definition questions', 'You can avoid edge cases', 'Application mastery means using the concept under realistic constraints.'],

    ['Tricky', `What is the common trap to avoid in ${name}?`, withPeriod(misconception), 'The safest answer is always the longest choice.', 'The visual explanation replaces all mathematical reasoning.', withPeriod(misconception)],
    ['Tricky', `If a result in ${name} looks surprisingly good, what should you inspect?`, 'Whether the setup, assumptions, or evaluation boundary made the result easier than it should be', 'Whether the page title changed after scrolling', 'Whether every unrelated lesson has the same answer', 'Strong-looking results should be checked against assumptions and evaluation boundaries.'],
    ['Tricky', `How can ${name} fail when used carelessly?`, 'The learner may transfer the simplified rule beyond its assumptions', 'It automatically creates more training data', 'It prevents all edge cases by definition', 'A concept animation is useful, but its assumptions still matter.'],
    ['Tricky', `Which answer shows transfer beyond memorization?`, `Explaining how ${name} would behave on a slightly different input or setting`, 'Quoting the first sentence only', 'Choosing the same option letter every time', 'Transfer means applying the idea to a new but related case.'],
    ['Tricky', `What should be true before calling ${name} understood?`, 'You can state the mechanism, use it on an example, and name a likely failure mode', 'You only remember the lesson number', 'You skipped the check but opened the page', 'Understanding needs mechanism, example, and limitation.'],
    ['Tricky', `How does ${name} connect to adjacent lessons?`, 'It uses prerequisites as inputs and prepares a later concept in the same track', 'It is isolated from every other lesson', 'It only matters inside the glossary page', 'The curriculum is a graph: prerequisites feed current concepts and current concepts feed later ones.'],
    ['Tricky', `Which diagnostic question is most useful for ${name}?`, `What assumption would make the ${name} explanation stop working?`, 'Which browser tab was opened first?', 'How many letters are in the category name?', 'Advanced checks ask where the concept breaks, not only where it works.'],
    ['Tricky', `What is the best final review move for ${name}?`, `Summarize ${description}, give one example, and name one trap`, 'Close the page immediately after one correct answer', 'Only memorize the route URL', 'A final review should compress the concept into use, example, and caution.'],
    ['Tricky', `An interviewer changes one condition in a ${name} example. What should you do first?`, 'Recompute the effect of that condition through the mechanism', 'Repeat the original answer unchanged', 'Assume the condition is irrelevant', 'Tricky questions often differ by one condition that changes the conclusion.'],
    ['Tricky', `What makes a ${name} answer subtly wrong?`, 'It states a true fact but applies it outside the assumptions of this setup', 'It includes a concise limitation', 'It explains the input-output chain', 'Many hard interview misses come from true statements used in the wrong scope.'],
    ['Tricky', `Which ${name} result should make you suspicious?`, 'One that improves the headline outcome while hiding a worse boundary case', 'One that includes an explanation of assumptions', 'One that is checked on a held-out example', 'Suspicious results often optimize one visible outcome while breaking a hidden constraint.'],
    ['Tricky', `If two answer choices about ${name} both sound plausible, how should you decide?`, 'Pick the one that follows from the mechanism and stated assumptions', 'Pick the more absolute statement', 'Pick the one with more jargon', 'Precise assumptions should beat confident wording.'],
    ['Tricky', `Which phrase is a warning sign in a ${name} explanation?`, 'Always works, regardless of data, assumptions, or scale', 'Works under these assumptions', 'Fails when the boundary is violated', 'Absolute claims are often wrong in ML interviews.'],
    ['Tricky', `How should you treat a high score after tuning around ${name}?`, 'Ask whether the evaluation data influenced the choices being judged', 'Assume the score proves generalization', 'Delete the validation set', 'Evaluation boundaries matter whenever choices are tuned.'],
    ['Tricky', `What is the best way to handle an edge case in ${name}?`, 'Name the edge case, predict the failure, and propose a check or fallback', 'Ignore it because the main example worked', 'Claim edge cases cannot occur', 'Senior answers anticipate failure and mitigation.'],
    ['Tricky', `Which ${name} answer would fail a big tech interview?`, 'A memorized definition with no trade-off, example, or failure mode', 'A causal explanation with a limitation', 'A small worked example', 'Interviewers test whether you can reason, not only recall.'],
    ['Tricky', `What should you do if the ${name} animation and a real system differ?`, 'Identify which simplification or implementation detail explains the difference', 'Assume the animation is useless', 'Assume the real system is wrong', 'Teaching models simplify; real systems add details that should be named.'],
    ['Tricky', `Which hidden dependency can break ${name}?`, 'A prerequisite concept, data condition, or evaluation assumption that was silently violated', 'The lesson order in the sidebar only', 'The number of page dots', 'Hard failures often come from unstated dependencies.'],
    ['Tricky', `How should you answer a trick question about ${name}?`, 'Slow down, restate the assumptions, and trace the mechanism before choosing', 'Guess quickly from the most familiar word', 'Ignore the changed condition', 'Trick questions reward disciplined assumption checking.'],
    ['Tricky', `What is the tricky-level success criterion for ${name}?`, 'You can catch plausible but wrong reasoning and explain the correction', 'You can answer only the first definition prompt', 'You can avoid all counterexamples', 'Tricky mastery means detecting and repairing flawed reasoning.'],

    ['Interview', `How would you explain ${name} in a 60-second interview answer?`, 'State the problem, mechanism, trade-off, and one failure mode', 'List every UI control in order', 'Say it is complicated and stop', 'A strong short answer has structure: problem, mechanism, trade-off, failure.'],
    ['Interview', `What follow-up should you expect after defining ${name}?`, 'A changed example that tests whether the mechanism transfers', 'A request to name the page route', 'A question about decorative colors', 'Interviewers usually move from definition to transfer.'],
    ['Interview', `What is the strongest way to defend a design using ${name}?`, 'Connect the concept to the objective, constraints, validation plan, and fallback', 'Say it is popular', 'Avoid mentioning risks', 'Design defense needs both benefit and risk control.'],
    ['Interview', `What should you include when comparing ${name} with an alternative?`, 'Assumptions, behavior under change, cost, and failure modes', 'Only which name sounds newer', 'Only the easiest implementation detail', 'Comparisons are useful when tied to constraints and behavior.'],
    ['Interview', `How should you handle a whiteboard problem involving ${name}?`, 'Work a tiny example, show intermediate states, then generalize', 'Jump to a final answer without reasoning', 'Refuse to use examples', 'Tiny examples reveal whether the general rule is understood.'],
    ['Interview', `What would make your ${name} answer senior-level?`, 'You explain the mechanism, the evaluation boundary, and a realistic production caveat', 'You only repeat textbook wording', 'You avoid discussing assumptions', 'Senior-level answers connect concept, measurement, and operations.'],
    ['Interview', `Which interview response best handles uncertainty about ${name}?`, 'State the assumption you are making and reason conditionally from it', 'Pretend every detail is certain', 'Change the topic', 'Explicit assumptions are better than hidden guesses.'],
    ['Interview', `How would you debug a failed ${name}-based system?`, 'Check data, assumptions, intermediate states, metrics, and deployment mismatch in order', 'Only increase model size', 'Only change UI labels', 'A disciplined debugging path avoids random fixes.'],
    ['Interview', `What is a good "gotcha" question for ${name}?`, `What changes if ${changePrompt}?`, 'What color is the icon?', 'What is the exact lesson index?', 'Good gotchas test boundary conditions or changed assumptions.'],
    ['Interview', `How would you show depth beyond the lesson animation for ${name}?`, 'Discuss how scale, noise, latency, or evaluation changes the simple story', 'Say the animation covers every real-world issue', 'Avoid mentioning trade-offs', 'Depth comes from extending the mechanism into real constraints.'],
    ['Interview', `Which statement would you challenge in a design review about ${name}?`, 'This will work regardless of data distribution or evaluation setup', 'Here is the assumption we need to validate', 'This trade-off needs monitoring', 'Design review should challenge absolute unvalidated claims.'],
    ['Interview', `How should ${name} appear in a resume or project explanation?`, 'As a concrete decision you made, why it fit, and how you evaluated it', 'As an unexplained buzzword', 'As proof that no mistakes were possible', 'Projects need evidence of judgment, not just terminology.'],
    ['Interview', `What is the best final question to ask yourself about ${name}?`, 'Can I solve a new case, explain a failure, and choose a trade-off?', 'Can I remember the first option letter?', 'Can I skip all advanced pages?', 'Interview readiness means new-case reasoning, failure analysis, and trade-off selection.'],
    ['Interview', `How would you respond if an interviewer says your ${name} answer is incomplete?`, 'Ask which assumption or case they want to stress, then refine the mechanism', 'Repeat the same sentence louder', 'Switch to an unrelated topic', 'Good candidates use feedback to expose and refine assumptions.'],
    ['Interview', `Which ${name} answer sounds fluent but weak?`, 'A long explanation that never predicts behavior under a changed setup', 'A concise worked example with a limitation', 'A trade-off tied to the objective', 'Fluency without prediction is weak for technical interviews.'],
    ['Interview', `How should you prepare for hard questions after ${name}?`, 'Practice changing one assumption at a time and explaining the downstream effect', 'Only reread the easiest definition', 'Avoid counterexamples', 'Hard questions are usually controlled perturbations of the concept.'],
    ['Interview', `What is the best way to close an answer about ${name}?`, 'Name the practical implication and the main caveat', 'End with no evaluation plan', 'Say all choices are equivalent', 'A strong close tells the interviewer how the concept changes action.'],
    ['Interview', `What distinguishes an interview-ready ${name} explanation from a classroom explanation?`, 'It includes implementation constraints, evaluation, and failure handling', 'It is longer but less precise', 'It avoids examples', 'Interview answers must survive real constraints.'],
    ['Interview', `If asked to teach ${name} to a junior engineer, what sequence should you use?`, 'Definition, tiny example, mechanism trace, common trap, harder variant', 'Hard trick question first with no context', 'Only final formulas', 'Teaching well mirrors the assessment progression.'],
    ['Interview', `What is the interview-level success criterion for ${name}?`, 'You can reason through unfamiliar variants and defend choices under constraints', 'You can only recognize the title', 'You can avoid being asked follow-ups', 'Interview readiness means robust reasoning under changed conditions.'],
  ];

  return specs.slice(0, TARGET_STRATEGY_REVIEW_QUESTIONS).map((spec, index) => (
    makeGeneratedQuestion(index, spec[0], spec[1], spec[2], [spec[3], spec[4]], spec[5])
  ));
}

function makeSeededQuestionVariants(animation, seededQuiz) {
  const name = animation.name;
  const variants = [];

  for (const [questionIndex, question] of seededQuiz.entries()) {
    const correct = question.choices[question.answerIndex];
    const wrongChoices = question.choices.filter((_, index) => index !== question.answerIndex);
    const firstWrong = wrongChoices[0] || 'An unrelated shortcut';
    const secondWrong = wrongChoices[1] || 'A claim that ignores the setup';
    const baseLevel = question.level || 'Mechanism';
    const explanation = withPeriod(question.explanation);

    variants.push(
      [baseLevel, `In ${name}, which answer correctly resolves this case: ${question.prompt}`, correct, firstWrong, secondWrong, explanation],
      ['Mechanism', `For "${question.prompt}", which reasoning path matches the ${name} mechanism?`, explanation, `It follows because ${firstWrong}`, `It follows because ${secondWrong}`, explanation],
      ['Application', `In a new ${name} example matching this setup, which conclusion follows from "${question.prompt}"?`, correct, firstWrong, secondWrong, explanation],
      ['Tricky', `Which tempting but wrong conclusion should ${name} rule out for this case: ${question.prompt}`, firstWrong, correct, secondWrong, `The tempting wrong answer is "${firstWrong}", but the lesson point is: ${explanation}`],
    );

    if (questionIndex % 2 === 0) {
      variants.push(
        ['Application', `Which additional result would confirm the same ${name} idea as "${correct}"?`, `A result matching this rule: ${explanation}`, `A result that supports "${secondWrong}" instead`, 'A result that ignores the stated setup', explanation],
      );
    }
  }

  return variants;
}

function makeMetadataCoreSpecs(animation) {
  const objectives = animation.learningObjectives?.length
    ? animation.learningObjectives
    : [`Explain ${animation.name}`, `Predict how ${animation.description.toLowerCase()} changes behavior`];
  const description = cleanSentence(animation.description).toLowerCase();
  const misconception = animation.commonMisconception || `${animation.name} should not be treated as a production guarantee.`;
  const prereqs = animation.prerequisites?.length ? animation.prerequisites.join(', ') : 'the lesson setup';
  const name = animation.name;
  const primaryObjective = cleanSentence(objectives[0]).toLowerCase();
  const secondaryObjective = cleanSentence(objectives[1] || objectives[0]).toLowerCase();
  const prerequisiteContext = prereqs === 'the lesson setup'
    ? 'the stated lesson setup'
    : `the prerequisite ideas: ${prereqs}`;

  return [
    ['Foundation', `In ${name}, which situation matches the lesson concept?`, `A case where ${description} determines the result`, 'A case where the option letters determine the result', 'A case with no inputs, assumptions, or outputs to inspect', `${name} is centered on ${description}.`],
    ['Foundation', `Which statement is required for a correct ${name} example?`, withPeriod(objectives[0]), 'The final answer can be chosen without reading the setup.', 'The mechanism is irrelevant once the title is known.', withPeriod(objectives[0])],
    ['Foundation', `What background should be active when solving a ${name} question?`, prerequisiteContext, 'Only unrelated interface terminology', 'A deployment dashboard with no concept setup', `${name} builds on ${prerequisiteContext}.`],
    ['Mechanism', `A ${name} setting changes. What should you compare before choosing an answer?`, `The inputs, assumptions, and output behavior tied to ${description}`, 'Only the order of the multiple-choice answers', 'Nothing, because the title fixes the output', `The lesson asks you to connect setup changes to ${description}.`],
    ['Mechanism', `Which causal explanation fits ${name}?`, `The changed setup affects ${description}, so the observed behavior should change accordingly`, 'The result changes because the page layout changed', 'The result is unrelated to the lesson assumptions', `${name} should be explained as a mechanism, not a label.`],
    ['Mechanism', `What distinction does ${name} force you to make?`, `${description} versus the shortcut: ${cleanSentence(misconception).toLowerCase()}`, 'The question id versus the answer id', 'The sidebar order versus the page title', misconception],
    ['Application', `A practitioner applies ${name} to a new case. What should they validate?`, `That ${description} matches the task constraints and observed behavior`, 'That the lesson was opened once', 'That every metric or setting moves together', `The module is useful when ${description} affects a real choice.`],
    ['Application', `Which decision is most aligned with ${name}?`, `Use ${description} to decide whether the current behavior supports the task`, 'Ignore evaluation because the diagram looked plausible', 'Assume every production setting has the same internals', `A correct application ties ${name} to evidence from the setup.`],
    ['Application', `Which follow-up question is specific to ${name}?`, `How would ${description} change when ${secondaryObjective}?`, 'Which route URL contains the lesson?', 'Which answer letter appeared most often?', `The follow-up should stay tied to the ${name} mechanism.`],
    ['Tricky', `Which conclusion would be unsafe in ${name}?`, misconception, `The result depends on ${description}`, `The answer should be checked against ${primaryObjective}`, `The common misconception is the trap this lesson is meant to correct.`],
    ['Tricky', `A simplified ${name} example looks correct. What is the next check?`, `Whether the assumptions behind ${description} still hold in the new setting`, 'Whether the same answer letter was correct last time', 'Whether the concept can be used without any validation', 'The teaching model is useful, but it is not a universal guarantee.'],
    ['Interview', `In a technical screen, which ${name} claim is defensible?`, `${name} can explain ${description}, but the assumptions and limits still need to be checked`, `${name} proves every real system behaves exactly like the teaching example`, `${name} is mastered by repeating the title alone`, `A strong answer stays specific to ${name} and includes a limitation.`],
  ];
}

function makeGeneratedQuiz(animation, seededQuiz = []) {
  const seededVariants = makeSeededQuestionVariants(animation, seededQuiz);
  const metadataSpecs = makeMetadataCoreSpecs(animation);
  const specs = [];

  while (specs.length < TARGET_QUIZ_QUESTIONS) {
    const metadataIndex = specs.length - seededVariants.length;
    const source = specs.length < seededVariants.length
      ? seededVariants[specs.length]
      : contextualizeCoreSpec(
        metadataSpecs[metadataIndex % metadataSpecs.length],
        Math.floor(metadataIndex / metadataSpecs.length),
      );
    specs.push(source);
  }

  return specs.map((spec, index) => (
    makeGeneratedQuestion(index, spec[0], spec[1], spec[2], [spec[3], spec[4]], spec[5])
  ));
}

function stableHash(value) {
  return [...String(value)].reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 0);
}

function rotateQuestionChoices(question, offset) {
  if (!Array.isArray(question.choices) || question.choices.length < 2) return question;

  const correctChoice = question.choices[question.answerIndex];
  const rotation = offset % question.choices.length;
  const rotated = [...question.choices.slice(rotation), ...question.choices.slice(0, rotation)];

  return {
    ...question,
    choices: rotated,
    answerIndex: rotated.indexOf(correctChoice),
  };
}

function normalizeSeededQuestion(question, index, lessonId) {
  const levels = ['Foundation', 'Mechanism', 'Application', 'Tricky', 'Interview'];
  const normalized = {
    level: question.level || levels[Math.min(levels.length - 1, Math.floor(index / 4))],
    ...question,
  };

  return rotateQuestionChoices(normalized, stableHash(`${lessonId}:${question.id}`));
}

function buildLessonAssessment(animation) {
  const seeded = SEEDED_LESSON_ASSESSMENTS[animation.id] || EMPTY_ASSESSMENT;
  const seededQuiz = (seeded.quiz || []).map((question, index) => (
    normalizeSeededQuestion(question, index, animation.id)
  ));
  const usedIds = new Set(seededQuiz.map((question) => question.id));
  const generatedQuiz = makeGeneratedQuiz(animation, seededQuiz)
    .filter((question) => !usedIds.has(question.id))
    .slice(0, Math.max(0, TARGET_QUIZ_QUESTIONS - seededQuiz.length));

  return {
    completionPolicy: DEFAULT_COMPLETION_POLICY,
    scenarioQuestions: seeded.scenarioQuestions || getScenarioQuestionsForLesson(animation.id),
    quiz: [...seededQuiz, ...generatedQuiz]
      .slice(0, TARGET_QUIZ_QUESTIONS)
      .map((question, index) => ({
        skill: question.skill || (question.level === 'Foundation' ? 'recall' : question.level === 'Mechanism' ? 'mechanism' : 'transfer'),
        ...question,
        countsForCompletion: index < DEFAULT_COMPLETION_POLICY.masteryRequired,
      })),
    strategyReview: makeLearningStrategyDeck(animation),
    labs: seeded.labs || [],
  };
}

export const lessonAssessments = Object.freeze(Object.fromEntries(
  allAnimations.map((animation) => [animation.id, buildLessonAssessment(animation)]),
));

export function getLessonAssessment(lessonId) {
  return lessonAssessments[lessonId] || EMPTY_ASSESSMENT;
}

export function hasAssessmentContent(assessment) {
  return Boolean(assessment?.scenarioQuestions?.length || assessment?.quiz?.length || assessment?.labs?.length);
}

export function getAssessmentStats(assessments = lessonAssessments) {
  return Object.values(assessments).reduce(
    (stats, assessment) => ({
      totalQuizQuestions: stats.totalQuizQuestions + (assessment.quiz?.length || 0),
      totalLabs: stats.totalLabs + (assessment.labs?.length || 0),
    }),
    { totalQuizQuestions: 0, totalLabs: 0 },
  );
}
