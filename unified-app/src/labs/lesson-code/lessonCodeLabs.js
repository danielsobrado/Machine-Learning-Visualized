import { QWEN_NEXT_LABS } from './categories/qwenNextLabs.js';
import { NLP_LESSON_LABS } from './categories/nlpLessonLabs.js';
import { TRANSFORMER_LESSON_LABS } from './categories/transformerLessonLabs.js';
import { PAPER_LESSON_LABS } from './categories/paperLessonLabs.js';
import { FRONTIER_LLM_LESSON_LABS } from './categories/frontierLlmLessonLabs.js';
import { NEURAL_NETWORK_LESSON_LABS } from './categories/neuralNetworkLessonLabs.js';
import { ADVANCED_MODEL_LESSON_LABS } from './categories/advancedModelLessonLabs.js';
import { MATH_FUNDAMENTAL_LESSON_LABS } from './categories/mathFundamentalLessonLabs.js';
import { CORE_ML_LESSON_LABS } from './categories/coreMlLessonLabs.js';
import { RELIABILITY_LESSON_LABS } from './categories/reliabilityLessonLabs.js';
import { EXPERIMENTATION_LESSON_LABS } from './categories/experimentationLessonLabs.js';
import { PROBABILITY_STATS_LESSON_LABS } from './categories/probabilityStatsLessonLabs.js';
import { REINFORCEMENT_LEARNING_LESSON_LABS } from './categories/reinforcementLearningLessonLabs.js';
import { ALGORITHM_LESSON_LABS } from './categories/algorithmLessonLabs.js';
import { DIFFUSION_LESSON_LABS } from './categories/diffusionLessonLabs.js';

export const LESSON_CODE_LAB_GROUPS = [
  ...NLP_LESSON_LABS,
  ...TRANSFORMER_LESSON_LABS,
  ...PAPER_LESSON_LABS,
  ...FRONTIER_LLM_LESSON_LABS.filter(group => !QWEN_NEXT_LABS.some(q => q.lessonId === group.lessonId)),
  ...QWEN_NEXT_LABS,
  ...NEURAL_NETWORK_LESSON_LABS,
  ...ADVANCED_MODEL_LESSON_LABS,
  ...MATH_FUNDAMENTAL_LESSON_LABS,
  ...CORE_ML_LESSON_LABS,
  ...RELIABILITY_LESSON_LABS,
  ...EXPERIMENTATION_LESSON_LABS,
  ...PROBABILITY_STATS_LESSON_LABS,
  ...REINFORCEMENT_LEARNING_LESSON_LABS,
  ...ALGORITHM_LESSON_LABS,
  ...DIFFUSION_LESSON_LABS,
];

export const LESSON_CODE_LAB_BY_ID = Object.fromEntries(
  LESSON_CODE_LAB_GROUPS.map((group) => [group.lessonId, group]),
);

export const LESSON_CODE_LABS = LESSON_CODE_LAB_GROUPS.flatMap((group) => group.exercises);

export function getLessonCodeLabGroup(lessonId) {
  return LESSON_CODE_LAB_BY_ID[lessonId] || null;
}

export function getLessonCodeLabExercises(lessonId) {
  return getLessonCodeLabGroup(lessonId)?.exercises || [];
}
