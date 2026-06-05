import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const FRONTIER_LLM_LESSON_LABS = createMappedCategoryLessonLabs('frontier-llms', {
  kind: 'frontier-model evaluation',
  signalName: 'capability or risk score',
  stages: ['measure', 'compare', 'gate'],
  stageExplanation: 'Frontier-model systems need measurement, comparison, and release gates before deployment decisions.',
});
