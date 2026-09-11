import {
  competencyLessonIds,
  defineScenarioCompetenciesFromRequirements,
} from './assessmentCompetencies.js';
import { ADVANCED_INFERENCE_DEPTH_REQUIREMENTS } from './advancedInferenceCoverage.js';
import { ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS } from './advancedNeuralArchitecturesCoverage.js';
import { BLOOM_FILTER_DEPTH_REQUIREMENTS } from './bloomFilterCoverage.js';
import { CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS } from './classicalMlStatisticsCoverage.js';
import { FRONTIER_SYSTEMS_DEPTH_REQUIREMENTS } from './frontierSystemsCoverage.js';
import { GENERATIVE_RL_DEPTH_REQUIREMENTS } from './generativeRlCoverage.js';
import { INFORMATION_THEORY_DEPTH_REQUIREMENTS } from './informationTheoryCoverage.js';
import { LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS } from './latentDiffusionPipelineCoverage.js';
import { LINEAR_ALGEBRA_DEPTH_REQUIREMENTS } from './linearAlgebraCoverage.js';
import { NEURAL_NETWORK_DEPTH_REQUIREMENTS } from './neuralNetworkCoverage.js';
import { NLP_TRANSFORMER_DEPTH_REQUIREMENTS } from './nlpTransformerCoverage.js';
import { PROBABILITY_REASONING_DEPTH_REQUIREMENTS } from './probabilityReasoningCoverage.js';
import { PRODUCTION_ML_DEPTH_REQUIREMENTS } from './productionMlCoverage.js';
import { RAG_DEPTH_REQUIREMENTS } from './ragCoverage.js';
import { RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS } from './recommenderSystemsCoverage.js';
import { TIME_SERIES_FORECASTING_DEPTH_REQUIREMENTS } from './timeSeriesForecastingCoverage.js';

function migratedSource(id, requirements) {
  const competencies = defineScenarioCompetenciesFromRequirements(requirements, {
    idPrefix: `${id}.`,
  });

  return Object.freeze({
    id,
    auditedLessonIds: competencyLessonIds(competencies),
    competencies,
  });
}

export const LEGACY_MIGRATED_COMPETENCY_SOURCES = Object.freeze([
  migratedSource('advanced-inference', ADVANCED_INFERENCE_DEPTH_REQUIREMENTS),
  migratedSource('advanced-neural-architectures', ADVANCED_NEURAL_ARCHITECTURES_DEPTH_REQUIREMENTS),
  migratedSource('bloom-filter-depth', BLOOM_FILTER_DEPTH_REQUIREMENTS),
  migratedSource('classical-ml-statistics', CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS),
  migratedSource('frontier-systems', FRONTIER_SYSTEMS_DEPTH_REQUIREMENTS),
  migratedSource('generative-rl', GENERATIVE_RL_DEPTH_REQUIREMENTS),
  migratedSource('information-theory', INFORMATION_THEORY_DEPTH_REQUIREMENTS),
  migratedSource('latent-diffusion-pipeline', LATENT_DIFFUSION_PIPELINE_DEPTH_REQUIREMENTS),
  migratedSource('linear-algebra-depth', LINEAR_ALGEBRA_DEPTH_REQUIREMENTS),
  migratedSource('neural-network-depth', NEURAL_NETWORK_DEPTH_REQUIREMENTS),
  migratedSource('nlp-transformer-depth', NLP_TRANSFORMER_DEPTH_REQUIREMENTS),
  migratedSource('probability-reasoning', PROBABILITY_REASONING_DEPTH_REQUIREMENTS),
  migratedSource('production-ml-depth', PRODUCTION_ML_DEPTH_REQUIREMENTS),
  migratedSource('rag-depth', RAG_DEPTH_REQUIREMENTS),
  migratedSource('recommender-systems', RECOMMENDER_SYSTEMS_DEPTH_REQUIREMENTS),
  migratedSource('time-series-forecasting', TIME_SERIES_FORECASTING_DEPTH_REQUIREMENTS),
]);
