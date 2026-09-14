import { MANUAL_LESSON_QUALITY } from './lessonQualityManifest.js';
import { P1_COMPLETED_QUALITY_OVERRIDES } from './lessonQualityP1Overrides.js';

function mergeQuality(base, override) {
  return Object.freeze({
    ...base,
    ...override,
  });
}

export const EFFECTIVE_MANUAL_LESSON_QUALITY = Object.freeze(
  Object.fromEntries(
    Object.entries(MANUAL_LESSON_QUALITY).map(([id, quality]) => [
      id,
      mergeQuality(quality, P1_COMPLETED_QUALITY_OVERRIDES[id]),
    ]),
  ),
);

export function getEffectiveLessonQuality(id) {
  return EFFECTIVE_MANUAL_LESSON_QUALITY[id] || null;
}
