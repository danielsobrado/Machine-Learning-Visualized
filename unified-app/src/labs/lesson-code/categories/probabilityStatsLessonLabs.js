import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const PROBABILITY_STATS_LESSON_LABS = createMappedCategoryLessonLabs('probability-stats', {
  kind: 'probability/statistics calculation',
  signalName: 'probability or uncertainty score',
  stages: ['count', 'normalize', 'summarize'],
  stageExplanation: 'Probability code often counts outcomes, normalizes them, then summarizes uncertainty.',
});
