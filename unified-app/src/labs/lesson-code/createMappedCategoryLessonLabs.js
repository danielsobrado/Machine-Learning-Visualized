import { createCategoryLessonLabs } from './lessonLabFactory.js';
import { applyLessonLabMappings } from './applyLessonLabMappings.js';

export function createMappedCategoryLessonLabs(categoryId, domain) {
  return applyLessonLabMappings(createCategoryLessonLabs(categoryId, domain));
}
