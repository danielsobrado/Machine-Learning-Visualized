import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const DIFFUSION_LESSON_LABS = createMappedCategoryLessonLabs('diffusion-models', {
  kind: 'diffusion-model pipeline',
  signalName: 'noise or denoising score',
  stages: ['noise', 'condition', 'denoise'],
  stageExplanation: 'Diffusion systems manage noise, conditioning, and denoising as separate implementation stages.',
});
