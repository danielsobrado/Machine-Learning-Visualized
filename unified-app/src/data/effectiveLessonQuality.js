import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { LESSON_QUALITY_NEXT_OVERRIDES } from './lessonQualityNextOverrides.js';
import { P1_COMPLETED_QUALITY_OVERRIDES } from './lessonQualityP1Overrides.js';
import { PRODUCTION_RELIABILITY_NEXT_QUALITY_OVERRIDES } from './lessonQualityProductionNextOverrides.js';
import { P1_SYSTEMS_NEXT_QUALITY_OVERRIDES } from './lessonQualitySystemsNextOverrides.js';
import { LINEAR_ALGEBRA_NEXT_QUALITY_OVERRIDES } from './lessonQualityLinearAlgebraNextOverrides.js';

function mergeQuality(base, ...overrides) {
  return Object.freeze(
    overrides.reduce((current, override) => ({
      ...current,
      ...override,
    }), { ...base }),
  );
}

export const EFFECTIVE_MANUAL_LESSON_QUALITY = Object.freeze(
  Object.fromEntries(
    Object.entries(MANUAL_LESSON_QUALITY).map(([id, quality]) => [
      id,
      mergeQuality(
        quality,
        P1_COMPLETED_QUALITY_OVERRIDES[id],
        LESSON_QUALITY_NEXT_OVERRIDES[id],
        PRODUCTION_RELIABILITY_NEXT_QUALITY_OVERRIDES[id],
        P1_SYSTEMS_NEXT_QUALITY_OVERRIDES[id],
        LINEAR_ALGEBRA_NEXT_QUALITY_OVERRIDES[id],
      ),
    ]),
  ),
);

export function getEffectiveLessonQuality(id) {
  return EFFECTIVE_MANUAL_LESSON_QUALITY[id] || null;
}
