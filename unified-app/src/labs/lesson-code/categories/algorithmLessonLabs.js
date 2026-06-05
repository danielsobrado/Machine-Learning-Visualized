import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const ALGORITHM_LESSON_LABS = createMappedCategoryLessonLabs('algorithms', {
  kind: 'algorithmic data structure',
  signalName: 'rank or membership score',
  stages: ['insert', 'query', 'verify'],
  stageExplanation: 'Algorithmic structures are useful when updates, queries, and checks are kept explicit.',
});
