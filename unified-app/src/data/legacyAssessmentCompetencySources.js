import {
  competencyLessonIds,
  defineScenarioCompetenciesFromRequirements,
} from './assessmentCompetencies.js';
import { ADVANCED_INFERENCE_DEPTH_REQUIREMENTS } from './advancedInferenceCoverage.js';
import { CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS } from './classicalMlStatisticsCoverage.js';
import { FRONTIER_SYSTEMS_DEPTH_REQUIREMENTS } from './frontierSystemsCoverage.js';
import { NEURAL_NETWORK_DEPTH_REQUIREMENTS } from './neuralNetworkCoverage.js';
import { NLP_TRANSFORMER_DEPTH_REQUIREMENTS } from './nlpTransformerCoverage.js';

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
  migratedSource('classical-ml-statistics', CLASSICAL_ML_STATISTICS_DEPTH_REQUIREMENTS),
  migratedSource('frontier-systems', FRONTIER_SYSTEMS_DEPTH_REQUIREMENTS),
  migratedSource('neural-network-depth', NEURAL_NETWORK_DEPTH_REQUIREMENTS),
  migratedSource('nlp-transformer-depth', NLP_TRANSFORMER_DEPTH_REQUIREMENTS),
]);
