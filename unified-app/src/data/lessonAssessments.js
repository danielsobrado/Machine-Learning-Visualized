import * as base from './lessonAssessmentsBase.js';
import { getAssessmentSource } from './assessmentQuality.js';
import { ASSESSMENT_QUALITY_PRIORITY_LESSON_IDS } from './assessmentQualityManifest.js';
import { getP0ExperimentationScenariosForLesson } from './p0ExperimentationScenarioQuestions.js';
import { getP0ScenarioQuestionsForLesson } from './p0ScenarioQuestions.js';
import { getP1GenerativeRlScenariosForLesson } from './p1GenerativeRlScenarioQuestions.js';
import { getP1MathScenariosForLesson } from './p1MathScenarioQuestions.js';
import { getP1NeuralScenariosForLesson } from './p1NeuralScenarioQuestions.js';
import { getP1NlpTransformerScenariosForLesson } from './p1NlpTransformerScenarioQuestions.js';
import { getP1ProductionScenariosForLesson } from './p1ProductionScenarioQuestions.js';
import { getP1ScenarioQuestionsForLesson } from './p1ScenarioQuestions.js';
import { getP1StatisticsScenariosForLesson } from './p1StatisticsScenarioQuestions.js';
import { PROBABILITY_DISTRIBUTIONS_QUIZ } from './probabilityDistributionsAssessment.js';

export * from './lessonAssessmentsBase.js';

const CURATED_QUIZ_OVERRIDES = Object.freeze({
  'probability-distributions': PROBABILITY_DISTRIBUTIONS_QUIZ,
});

function stableHash(value) {
  return [...String(value)].reduce((hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0, 0);
}

function rotateScenarioChoices(lessonId, question) {
  if (!Array.isArray(question.choices) || question.choices.length < 2) return question;

  const correctChoice = question.choices[question.answerIndex];
  const rotation = stableHash(`${lessonId}:${question.id}`) % question.choices.length;
  const choices = [...question.choices.slice(rotation), ...question.choices.slice(0, rotation)];

  return {
    ...question,
    choices,
    answerIndex: choices.indexOf(correctChoice),
  };
}

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

function buildAssessment(lessonId, assessment) {
  const withOverride = applyQuizOverride(assessment, CURATED_QUIZ_OVERRIDES[lessonId]);
  const scenarioQuestions = [
    ...(withOverride.scenarioQuestions || []),
    ...getP0ScenarioQuestionsForLesson(lessonId),
    ...getP0ExperimentationScenariosForLesson(lessonId),
    ...getP1ScenarioQuestionsForLesson(lessonId),
    ...getP1StatisticsScenariosForLesson(lessonId),
    ...getP1MathScenariosForLesson(lessonId),
    ...getP1NeuralScenariosForLesson(lessonId),
    ...getP1NlpTransformerScenariosForLesson(lessonId),
    ...getP1GenerativeRlScenariosForLesson(lessonId),
    ...getP1ProductionScenariosForLesson(lessonId),
  ].map((question) => rotateScenarioChoices(lessonId, question));

  return Object.freeze({
    ...withOverride,
    source: getAssessmentSource(withOverride.quiz || []),
    quiz: Object.freeze([...(withOverride.quiz || [])]),
    scenarioQuestions: Object.freeze(scenarioQuestions),
    strategyReview: Object.freeze([...(withOverride.strategyReview || [])]),
    labs: Object.freeze([...(withOverride.labs || [])]),
  });
}

export const PRIORITY_ASSESSMENT_LESSON_IDS = ASSESSMENT_QUALITY_PRIORITY_LESSON_IDS;

export const lessonAssessments = Object.freeze(Object.fromEntries(
  Object.entries(base.lessonAssessments).map(([lessonId, assessment]) => [
    lessonId,
    buildAssessment(lessonId, assessment),
  ]),
));

export function getLessonAssessment(lessonId) {
  return lessonAssessments[lessonId] || base.EMPTY_ASSESSMENT;
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
