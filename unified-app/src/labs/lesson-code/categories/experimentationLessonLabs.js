import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const EXPERIMENTATION_LESSON_LABS = createMappedCategoryLessonLabs('experimentation-causal-ml', {
  kind: 'experiment analysis',
  signalName: 'effect or balance score',
  stages: ['assign', 'measure', 'compare'],
  stageExplanation: 'Experiment code must separate assignment, measurement, and comparison to support causal claims.',
});
