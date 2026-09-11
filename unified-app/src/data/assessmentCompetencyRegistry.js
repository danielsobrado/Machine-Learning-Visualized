import {
  CLASSIC_NLP_AUDITED_LESSON_IDS,
  CLASSIC_NLP_COMPETENCIES,
} from './classicNlpCoverage.js';
import {
  CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS,
  CORE_MODEL_MECHANICS_REQUIREMENTS,
} from './coreModelMechanicsCoverage.js';
import {
  FOUNDATION_ARCHITECTURE_AUDITED_LESSON_IDS,
  FOUNDATION_ARCHITECTURE_COMPETENCIES,
} from './foundationArchitectureCoverage.js';
import {
  FOUNDATION_MODELS_AUDITED_LESSON_IDS,
  FOUNDATION_MODELS_COMPETENCIES,
} from './foundationModelsCoverage.js';
import {
  NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS,
  NUMERICAL_LINEAR_ALGEBRA_COMPETENCIES,
} from './numericalLinearAlgebraCoverage.js';
import {
  PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS,
  PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
} from './productionMlSystemsCoverage.js';

export const ASSESSMENT_COMPETENCY_SOURCES = Object.freeze([
  Object.freeze({
    id: 'classic-nlp',
    auditedLessonIds: CLASSIC_NLP_AUDITED_LESSON_IDS,
    competencies: CLASSIC_NLP_COMPETENCIES,
  }),
  Object.freeze({
    id: 'core-model-mechanics',
    auditedLessonIds: CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS,
    competencies: CORE_MODEL_MECHANICS_REQUIREMENTS,
  }),
  Object.freeze({
    id: 'foundation-architecture',
    auditedLessonIds: FOUNDATION_ARCHITECTURE_AUDITED_LESSON_IDS,
    competencies: FOUNDATION_ARCHITECTURE_COMPETENCIES,
  }),
  Object.freeze({
    id: 'foundation-models',
    auditedLessonIds: FOUNDATION_MODELS_AUDITED_LESSON_IDS,
    competencies: FOUNDATION_MODELS_COMPETENCIES,
  }),
  Object.freeze({
    id: 'numerical-linear-algebra',
    auditedLessonIds: NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS,
    competencies: NUMERICAL_LINEAR_ALGEBRA_COMPETENCIES,
  }),
  Object.freeze({
    id: 'production-ml-systems',
    auditedLessonIds: PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS,
    competencies: PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
  }),
]);

export const ASSESSMENT_COMPETENCY_AUDITED_LESSON_IDS = Object.freeze([
  ...new Set(ASSESSMENT_COMPETENCY_SOURCES.flatMap(({ auditedLessonIds }) => auditedLessonIds)),
]);

export const ASSESSMENT_COMPETENCIES = Object.freeze(
  ASSESSMENT_COMPETENCY_SOURCES.flatMap(({ competencies }) => competencies),
);
