import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const PAPER_LESSON_LABS = createMappedCategoryLessonLabs('papers', {
  kind: 'paper-reading',
  signalName: 'claim, mechanism, or evidence score',
  stages: ['claim', 'mechanism', 'evidence'],
  stageExplanation: 'Paper lessons work best when the claim, mechanism, and evidence are checked separately.',
});
