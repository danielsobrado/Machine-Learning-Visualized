import { createCategoryLessonLabs, replaceLessonLabGroup } from '../lessonLabFactory.js';
import { getAlgebraCodeLabsForLesson } from '../../algebra/algebraLessonCodeLabs.js';

const generatedLabs = createCategoryLessonLabs('math-fundamentals', {
  kind: 'mathematical computation',
  signalName: 'numeric fit or stability score',
  stages: ['represent', 'compute', 'check'],
  stageExplanation: 'Math code is clearer when representation, computation, and result checks are separate.',
});

export const MATH_FUNDAMENTAL_LESSON_LABS = replaceLessonLabGroup(
  generatedLabs,
  'matrix-multiplication',
  () => getAlgebraCodeLabsForLesson('matrix-multiplication'),
);
