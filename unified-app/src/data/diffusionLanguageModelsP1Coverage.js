function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'diffusion-language-models',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const DIFFUSION_LANGUAGE_MODELS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'diffusion-language-models',
]);

export const DIFFUSION_LANGUAGE_MODELS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'difflm-latency-quality-frontier',
    ['difflm-028', 'difflm-065'],
    ['difflm-latency-quality-frontier-worked'],
  ),
  competency(
    'difflm-confidence-locking-calibration',
    ['difflm-029', 'difflm-079'],
    ['difflm-confidence-shift-locking-diagnosis'],
  ),
  competency(
    'difflm-remasking-revision-stability',
    ['difflm-032', 'difflm-057'],
    ['difflm-remasking-oscillation-diagnosis'],
  ),
  competency(
    'difflm-block-boundary-coherence',
    ['difflm-037', 'difflm-059'],
    ['difflm-block-boundary-coherence-diagnosis'],
  ),
  competency(
    'difflm-adaptive-output-length',
    ['difflm-049', 'difflm-058'],
    ['difflm-length-control-architecture-decision'],
  ),
  competency(
    'difflm-minimal-change-editing',
    ['difflm-045', 'difflm-054'],
    ['difflm-minimal-change-editing-audit'],
  ),
  competency(
    'difflm-post-conversion-alignment',
    ['difflm-040', 'difflm-060'],
    ['difflm-ar-conversion-alignment-regression-diagnosis'],
  ),
]);
