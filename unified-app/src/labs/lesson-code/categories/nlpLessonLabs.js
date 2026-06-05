import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const NLP_LESSON_LABS = createMappedCategoryLessonLabs('nlp', {
  kind: 'text representation',
  signalName: 'text relevance',
  stages: ['tokenize', 'vectorize', 'compare'],
  stageExplanation: 'NLP code usually has to tokenize text before it can build or compare representations.',
});
