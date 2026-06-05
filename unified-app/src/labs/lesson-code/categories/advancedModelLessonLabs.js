import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const ADVANCED_MODEL_LESSON_LABS = createMappedCategoryLessonLabs('advanced-models', {
  kind: 'advanced-model pipeline',
  signalName: 'retrieval or multimodal score',
  stages: ['encode', 'retrieve', 'ground'],
  stageExplanation: 'Advanced model systems often encode inputs, retrieve or combine evidence, and check grounding.',
});
