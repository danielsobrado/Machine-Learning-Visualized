import { categories } from './animations.js';

export function formatLessonCatalogNumber(categoryIndex, itemIndex) {
  return `${String(categoryIndex + 1).padStart(2, '0')}.${String(itemIndex + 1).padStart(2, '0')}`;
}

export function getLessonCatalogNumber(lessonId, categoryId) {
  const categoryIndex = categories.findIndex((category) => category.id === categoryId);
  if (categoryIndex < 0) return null;

  const itemIndex = categories[categoryIndex].items.findIndex((item) => item.id === lessonId);
  if (itemIndex < 0) return null;

  return formatLessonCatalogNumber(categoryIndex, itemIndex);
}
