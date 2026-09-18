import {
  competencyLessonIds,
  defineAssessmentCompetency,
  scenarioEvidence,
} from './assessmentCompetencies.js';
import { P1_MATH_CLASSICAL_REVIEW_SCENARIOS_BY_LESSON } from './p1MathClassicalReviewScenarioQuestions.js';
import { P1_NEURAL_TRAINING_REVIEW_SCENARIOS_BY_LESSON } from './p1NeuralTrainingReviewScenarioQuestions.js';
import { P1_RL_DIFFUSION_SYSTEMS_REVIEW_SCENARIOS_BY_LESSON } from './p1RlDiffusionSystemsReviewScenarioQuestions.js';
import { P1_STATISTICS_CAUSAL_REVIEW_SCENARIOS_BY_LESSON } from './p1StatisticsCausalReviewScenarioQuestions.js';
import { P1_TRANSFORMER_RAG_REVIEW_SCENARIOS_BY_LESSON } from './p1TransformerRagReviewScenarioQuestions.js';

export const CURRICULUM_REVIEW_GAP_SCENARIO_SOURCES = Object.freeze([
  Object.freeze({ id: 'statistics-causal', questionsByLesson: P1_STATISTICS_CAUSAL_REVIEW_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'math-classical', questionsByLesson: P1_MATH_CLASSICAL_REVIEW_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'neural-training', questionsByLesson: P1_NEURAL_TRAINING_REVIEW_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'transformer-rag', questionsByLesson: P1_TRANSFORMER_RAG_REVIEW_SCENARIOS_BY_LESSON }),
  Object.freeze({ id: 'rl-diffusion-systems', questionsByLesson: P1_RL_DIFFUSION_SYSTEMS_REVIEW_SCENARIOS_BY_LESSON }),
]);

export const CURRICULUM_REVIEW_GAP_COMPETENCIES = Object.freeze(
  CURRICULUM_REVIEW_GAP_SCENARIO_SOURCES.flatMap(({ id: sourceId, questionsByLesson }) => (
    Object.entries(questionsByLesson).flatMap(([lessonId, questions]) => (
      questions.map(({ id: scenarioId }) => defineAssessmentCompetency({
        id: `curriculum-review.${sourceId}.${lessonId}.${scenarioId}`,
        lessonId,
        evidence: [scenarioEvidence(scenarioId)],
      }))
    ))
  )),
);

export const CURRICULUM_REVIEW_GAP_AUDITED_LESSON_IDS = competencyLessonIds(
  CURRICULUM_REVIEW_GAP_COMPETENCIES,
);
