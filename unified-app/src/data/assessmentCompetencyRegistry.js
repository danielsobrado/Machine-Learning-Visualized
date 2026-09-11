import {
  CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS,
  CORE_MODEL_MECHANICS_REQUIREMENTS,
} from './coreModelMechanicsCoverage.js';
import {
  PRODUCTION_ML_SYSTEMS_AUDITED_LESSON_IDS,
  PRODUCTION_ML_SYSTEMS_REQUIREMENTS,
} from './productionMlSystemsCoverage.js';

export const ASSESSMENT_COMPETENCY_SOURCES = Object.freeze([
  Object.freeze({
    id: 'core-model-mechanics',
    auditedLessonIds: CORE_MODEL_MECHANICS_AUDITED_LESSON_IDS,
    competencies: CORE_MODEL_MECHANICS_REQUIREMENTS,
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
