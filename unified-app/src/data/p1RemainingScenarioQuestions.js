import { P1_GRADIENT_PROBLEMS_SCENARIOS_BY_LESSON } from './p1GradientProblemsScenarioQuestions.js';
import { P1_REMAINING_SCENARIOS_BY_LESSON as P1_REMAINING_BASE_SCENARIOS_BY_LESSON } from './p1RemainingBaseScenarioQuestions.js';

export const P1_REMAINING_SCENARIOS_BY_LESSON = Object.freeze({
  ...P1_REMAINING_BASE_SCENARIOS_BY_LESSON,
  ...P1_GRADIENT_PROBLEMS_SCENARIOS_BY_LESSON,
});

export function getP1RemainingScenariosForLesson(lessonId) {
  return P1_REMAINING_SCENARIOS_BY_LESSON[lessonId] || [];
}
