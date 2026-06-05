import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const MATH_FUNDAMENTAL_LESSON_LABS = createMappedCategoryLessonLabs('math-fundamentals', {
  kind: 'mathematical computation',
  signalName: 'numeric fit or stability score',
  stages: ['represent', 'compute', 'check'],
  stageExplanation: 'Math code is clearer when representation, computation, and result checks are separate.',
});
