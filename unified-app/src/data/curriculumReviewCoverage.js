import { ADVANCED_INFERENCE_AUDITED_LESSON_IDS } from './advancedInferenceCoverage.js';
import { ADVANCED_NEURAL_ARCHITECTURES_AUDITED_LESSON_IDS } from './advancedNeuralArchitecturesCoverage.js';
import { ASSESSMENT_QUALITY_PRIORITY_LESSON_IDS } from './assessmentQualityManifest.js';
import { CLASSIC_NLP_AUDITED_LESSON_IDS } from './classicNlpCoverage.js';
import { CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS } from './coreRlAlgorithmsCoverage.js';
import { FOUNDATION_MODELS_AUDITED_LESSON_IDS } from './foundationModelsCoverage.js';
import { INFORMATION_THEORY_AUDITED_LESSON_IDS } from './informationTheoryCoverage.js';
import { LATENT_DIFFUSION_PIPELINE_AUDITED_LESSON_IDS } from './latentDiffusionPipelineCoverage.js';
import { MODEL_RELIABILITY_AUDITED_LESSON_IDS } from './modelReliabilityCoverage.js';
import { NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS } from './numericalLinearAlgebraCoverage.js';
import { PROBABILITY_REASONING_AUDITED_LESSON_IDS } from './probabilityReasoningCoverage.js';

export const CURRICULUM_TAIL_AUDITED_LESSON_IDS = Object.freeze([
  'frontier-llm-architecture-overview',
  'frontier-moe-systems',
  'rag',
  'optimization',
  'tokenizer-bpe',
]);

const REVIEW_COVERAGE_SOURCES = Object.freeze([
  ASSESSMENT_QUALITY_PRIORITY_LESSON_IDS,
  ADVANCED_INFERENCE_AUDITED_LESSON_IDS,
  ADVANCED_NEURAL_ARCHITECTURES_AUDITED_LESSON_IDS,
  CLASSIC_NLP_AUDITED_LESSON_IDS,
  CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS,
  FOUNDATION_MODELS_AUDITED_LESSON_IDS,
  INFORMATION_THEORY_AUDITED_LESSON_IDS,
  LATENT_DIFFUSION_PIPELINE_AUDITED_LESSON_IDS,
  MODEL_RELIABILITY_AUDITED_LESSON_IDS,
  NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS,
  PROBABILITY_REASONING_AUDITED_LESSON_IDS,
  CURRICULUM_TAIL_AUDITED_LESSON_IDS,
]);

export const CURRICULUM_REVIEWED_LESSON_IDS = Object.freeze([
  ...new Set(REVIEW_COVERAGE_SOURCES.flat()),
].sort());

export const CURRICULUM_TAIL_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    lessonId: 'frontier-llm-architecture-overview',
    competency: 'kv-cache architecture bottleneck calculation',
    scenarioIds: Object.freeze(['tail-frontier-kv-cache-bottleneck-worked']),
  }),
  Object.freeze({
    lessonId: 'frontier-moe-systems',
    competency: 'expert capacity sizing from top-k routing load',
    scenarioIds: Object.freeze(['tail-frontier-moe-capacity-worked']),
  }),
  Object.freeze({
    lessonId: 'rag',
    competency: 'end-to-end retrieval ceiling and grounded release decision',
    scenarioIds: Object.freeze([
      'tail-rag-retrieval-ceiling-worked',
      'tail-rag-grounding-release-decision',
    ]),
  }),
  Object.freeze({
    lessonId: 'optimization',
    competency: 'projected gradient step under a hard constraint',
    scenarioIds: Object.freeze(['tail-optimization-projected-step-worked']),
  }),
  Object.freeze({
    lessonId: 'tokenizer-bpe',
    competency: 'BPE merge mechanics and tokenizer-model migration tradeoff',
    scenarioIds: Object.freeze([
      'tail-bpe-merge-count-worked',
      'tail-bpe-domain-shift-decision',
    ]),
  }),
]);
