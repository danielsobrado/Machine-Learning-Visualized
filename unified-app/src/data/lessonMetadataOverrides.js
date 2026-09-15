export const LESSON_METADATA_OVERRIDES = {
  'attention-mechanism': {
    description: 'Core learned routing for language, vision, audio, and multimodal transformer models',
  },
  relu: {
    name: 'Activation Functions & ReLU',
    description: 'Compare ReLU, Leaky ReLU, sigmoid, tanh, and GELU through their outputs, local derivatives, saturation, and gradient-flow tradeoffs',
  },
};

export function applyLessonMetadataOverrides(animation) {
  if (!animation) return animation;
  const override = LESSON_METADATA_OVERRIDES[animation.id];
  return override ? { ...animation, ...override } : animation;
}
