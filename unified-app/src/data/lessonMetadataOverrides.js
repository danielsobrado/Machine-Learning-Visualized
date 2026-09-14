export const LESSON_METADATA_OVERRIDES = {
  'attention-mechanism': {
    description: 'Core learned routing for language, vision, audio, and multimodal transformer models',
  },
};

export function applyLessonMetadataOverrides(animation) {
  if (!animation) return animation;
  const override = LESSON_METADATA_OVERRIDES[animation.id];
  return override ? { ...animation, ...override } : animation;
}
