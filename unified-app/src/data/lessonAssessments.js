import * as base from './lessonAssessmentsBase.js';
import { getP0ScenarioQuestionsForLesson } from './p0ScenarioQuestions.js';
import { PROBABILITY_DISTRIBUTIONS_QUIZ } from './probabilityDistributionsAssessment.js';

export * from './lessonAssessmentsBase.js';

const P0_PRIORITY_LESSON_IDS = Object.freeze([
  'probability-distributions',
  'model-debugging',
  'model-monitoring',
  'model-interpretability',
]);

const CURATED_QUIZ_OVERRIDES = Object.freeze({
  'probability-distributions': PROBABILITY_DISTRIBUTIONS_QUIZ,
});

function questionSkill(level) {
  if (level === 'Foundation') return 'recall';
  if (level === 'Mechanism') return 'mechanism';
  return 'transfer';
}

function applyQuizOverride(assessment, quiz) {
  if (!quiz) return assessment;

  const masteryRequired = assessment.completionPolicy?.masteryRequired ?? 10;
  return {
    ...assessment,
    quiz: quiz.map((question, index) => ({
      skill: question.skill || questionSkill(question.level),
      ...question,
      countsForCompletion: index < masteryRequired,
    })),
  };
}

function assessmentSource(assessment) {
  const quiz = assessment?.quiz || [];
  if (quiz.length === 0) return 'empty';
  return quiz.some((question) => String(question.id || '').startsWith('generated-'))
    ? 'fallback'
    : 'curated';
}

function buildAssessment(lessonId, assessment) {
  const withOverride = applyQuizOverride(assessment, CURATED_QUIZ_OVERRIDES[lessonId]);
  const p0Scenarios = getP0ScenarioQuestionsForLesson(lessonId);
  const scenarioQuestions = [
    ...(withOverride.scenarioQuestions || []),
    ...p0Scenarios,
  ];

  return Object.freeze({
    ...withOverride,
    source: assessmentSource(withOverride),
    quiz: Object.freeze([...(withOverride.quiz || [])]),
    scenarioQuestions: Object.freeze(scenarioQuestions),
    strategyReview: Object.freeze([...(withOverride.strategyReview || [])]),
    labs: Object.freeze([...(withOverride.labs || [])]),
  });
}

export const PRIORITY_ASSESSMENT_LESSON_IDS = Object.freeze([
  ...new Set([
    ...base.PRIORITY_ASSESSMENT_LESSON_IDS,
    ...P0_PRIORITY_LESSON_IDS,
  ]),
]);

export const lessonAssessments = Object.freeze(Object.fromEntries(
  Object.entries(base.lessonAssessments).map(([lessonId, assessment]) => [
    lessonId,
    buildAssessment(lessonId, assessment),
  ]),
));

export function getLessonAssessment(lessonId) {
  return lessonAssessments[lessonId] || base.EMPTY_ASSESSMENT;
}
