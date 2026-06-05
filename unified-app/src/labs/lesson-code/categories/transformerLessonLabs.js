import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const TRANSFORMER_LESSON_LABS = createMappedCategoryLessonLabs('transformers', {
  kind: 'sequence-modeling',
  signalName: 'attention or routing score',
  stages: ['project', 'score', 'mix'],
  stageExplanation: 'Transformer internals depend on explicit projection, scoring, and mixing stages.',
});
