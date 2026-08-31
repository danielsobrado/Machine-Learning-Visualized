import { P0_EXPERIMENTATION_SCENARIOS_BY_LESSON } from './p0ExperimentationScenarioQuestions.js';
import { P0_SCENARIO_QUESTIONS_BY_LESSON } from './p0ScenarioQuestions.js';
import { P0_STATISTICS_DECISION_SCENARIOS_BY_LESSON } from './p0StatisticsDecisionScenarioQuestions.js';
import { P0_STATISTICS_GAP_SCENARIOS_BY_LESSON } from './p0StatisticsGapScenarioQuestions.js';
import { P1_ADDITIONAL_SCENARIOS_BY_LESSON } from './p1AdditionalScenarioQuestions.js';
import { P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON } from './p1ClassicalMlAppliedDecisionScenarioQuestions.js';
import { P1_CLASSICAL_ML_DECISION_SCENARIOS_BY_LESSON } from './p1ClassicalMlDecisionScenarioQuestions.js';
import { P1_CLASSICAL_ML_GAP_SCENARIOS_BY_LESSON } from './p1ClassicalMlGapScenarioQuestions.js';
import { P1_GENERATIVE_APPLIED_SCENARIOS_BY_LESSON } from './p1GenerativeAppliedScenarioQuestions.js';
import { P1_GENERATIVE_RL_SCENARIOS_BY_LESSON } from './p1GenerativeRlScenarioQuestions.js';
import { P1_MATH_SCENARIOS_BY_LESSON } from './p1MathScenarioQuestions.js';
import { P1_NEURAL_APPLIED_ARCHITECTURE_SCENARIOS_BY_LESSON } from './p1NeuralAppliedArchitectureScenarioQuestions.js';
import { P1_NEURAL_APPLIED_TRAINING_SCENARIOS_BY_LESSON } from './p1NeuralAppliedTrainingScenarioQuestions.js';
import { P1_NEURAL_SCENARIOS_BY_LESSON } from './p1NeuralScenarioQuestions.js';
import { P1_NLP_TRANSFORMER_APPLIED_REPRESENTATION_SCENARIOS_BY_LESSON } from './p1NlpTransformerAppliedRepresentationScenarioQuestions.js';
import { P1_NLP_TRANSFORMER_APPLIED_SYSTEMS_SCENARIOS_BY_LESSON } from './p1NlpTransformerAppliedSystemsScenarioQuestions.js';
import { P1_NLP_TRANSFORMER_SCENARIOS_BY_LESSON } from './p1NlpTransformerScenarioQuestions.js';
import { P1_PRODUCTION_GOVERNANCE_APPLIED_SCENARIOS_BY_LESSON } from './p1ProductionGovernanceAppliedScenarioQuestions.js';
import { P1_PRODUCTION_SERVING_APPLIED_SCENARIOS_BY_LESSON } from './p1ProductionServingAppliedScenarioQuestions.js';
import { P1_PRODUCTION_SCENARIOS_BY_LESSON } from './p1ProductionScenarioQuestions.js';
import { P1_RAG_GROUNDING_APPLIED_SCENARIOS_BY_LESSON } from './p1RagGroundingAppliedScenarioQuestions.js';
import { P1_RAG_RETRIEVAL_APPLIED_SCENARIOS_BY_LESSON } from './p1RagRetrievalAppliedScenarioQuestions.js';
import { P1_REINFORCEMENT_LEARNING_APPLIED_SCENARIOS_BY_LESSON } from './p1ReinforcementLearningAppliedScenarioQuestions.js';
import { P1_REMAINING_SCENARIOS_BY_LESSON } from './p1RemainingScenarioQuestions.js';
import { P1_SCENARIO_QUESTIONS_BY_LESSON } from './p1ScenarioQuestions.js';
import { P1_STATISTICS_APPLIED_DECISION_SCENARIOS_BY_LESSON } from './p1StatisticsAppliedDecisionScenarioQuestions.js';
import { P1_STATISTICS_DECISION_SCENARIOS_BY_LESSON } from './p1StatisticsDecisionScenarioQuestions.js';
import { P1_STATISTICS_GAP_SCENARIOS_BY_LESSON } from './p1StatisticsGapScenarioQuestions.js';
import { P1_STATISTICS_SCENARIOS_BY_LESSON } from './p1StatisticsScenarioQuestions.js';
import { P2_SCENARIOS_BY_LESSON } from './p2ScenarioQuestions.js';

export const ASSESSMENT_SCENARIO_EXTENSION_SOURCES = Object.freeze([
  Object.freeze({ id: 'p0-core', priority: 'P0', questionsByLesson: P0_SCENARIO_QUESTIONS_BY_LESSON }),
  Object.freeze({ id: 'p0-experimentation', priority: 'P0', questionsByLesson: P0_EXPERIMENTATION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p0-statistics-decisions', priority: 'P0', questionsByLesson: P0_STATISTICS_DECISION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p0-statistics-gaps', priority: 'P0', questionsByLesson: P0_STATISTICS_GAP_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-core', priority: 'P1', questionsByLesson: P1_SCENARIO_QUESTIONS_BY_LESSON }),
  Object.freeze({ id: 'p1-classical-ml-applied-decisions', priority: 'P1', questionsByLesson: P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-classical-ml-decisions', priority: 'P1', questionsByLesson: P1_CLASSICAL_ML_DECISION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-classical-ml-gaps', priority: 'P1', questionsByLesson: P1_CLASSICAL_ML_GAP_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-statistics', priority: 'P1', questionsByLesson: P1_STATISTICS_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-statistics-applied-decisions', priority: 'P1', questionsByLesson: P1_STATISTICS_APPLIED_DECISION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-statistics-decisions', priority: 'P1', questionsByLesson: P1_STATISTICS_DECISION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-statistics-gaps', priority: 'P1', questionsByLesson: P1_STATISTICS_GAP_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-math', priority: 'P1', questionsByLesson: P1_MATH_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-neural-applied-training', priority: 'P1', questionsByLesson: P1_NEURAL_APPLIED_TRAINING_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-neural-applied-architecture', priority: 'P1', questionsByLesson: P1_NEURAL_APPLIED_ARCHITECTURE_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-neural', priority: 'P1', questionsByLesson: P1_NEURAL_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-nlp-transformers-applied-representation', priority: 'P1', questionsByLesson: P1_NLP_TRANSFORMER_APPLIED_REPRESENTATION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-nlp-transformers-applied-systems', priority: 'P1', questionsByLesson: P1_NLP_TRANSFORMER_APPLIED_SYSTEMS_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-nlp-transformers', priority: 'P1', questionsByLesson: P1_NLP_TRANSFORMER_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-generative-applied', priority: 'P1', questionsByLesson: P1_GENERATIVE_APPLIED_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-reinforcement-learning-applied', priority: 'P1', questionsByLesson: P1_REINFORCEMENT_LEARNING_APPLIED_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-generative-rl', priority: 'P1', questionsByLesson: P1_GENERATIVE_RL_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-rag-retrieval-applied', priority: 'P1', questionsByLesson: P1_RAG_RETRIEVAL_APPLIED_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-rag-grounding-applied', priority: 'P1', questionsByLesson: P1_RAG_GROUNDING_APPLIED_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-production-serving-applied', priority: 'P1', questionsByLesson: P1_PRODUCTION_SERVING_APPLIED_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-production-governance-applied', priority: 'P1', questionsByLesson: P1_PRODUCTION_GOVERNANCE_APPLIED_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-production', priority: 'P1', questionsByLesson: P1_PRODUCTION_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-remaining', priority: 'P1', questionsByLesson: P1_REMAINING_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p1-additional', priority: 'P1', questionsByLesson: P1_ADDITIONAL_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'p2-cleanup', priority: 'P2', questionsByLesson: P2_SCENARIOS_BY_LESSON }),
]);

export function getAssessmentScenarioExtensions(lessonId) {
  return ASSESSMENT_SCENARIO_EXTENSION_SOURCES.flatMap(
    ({ questionsByLesson }) => questionsByLesson[lessonId] || [],
  );
}

export function getAssessmentScenarioExtensionEntries() {
  return ASSESSMENT_SCENARIO_EXTENSION_SOURCES.flatMap(({ id, priority, questionsByLesson }) => (
    Object.entries(questionsByLesson).flatMap(([lessonId, questions]) => (
      questions.map((question) => ({ sourceId: id, priority, lessonId, question }))
    ))
  ));
}
