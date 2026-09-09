function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'initialization',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const INITIALIZATION_P1_AUDITED_LESSON_IDS = Object.freeze(['initialization']);

export const INITIALIZATION_P1_REQUIREMENTS = Object.freeze([
  competency(
    'init-hidden-unit-symmetry-breaking',
    ['init-003-randomness', 'init-004-symmetry'],
    ['init-identical-hidden-units-symmetry-diagnosis'],
  ),
  competency(
    'init-he-fan-in-scale-arithmetic',
    ['init-015-he', 'init-026-he-rule'],
    ['init-he-fan-in-worked'],
  ),
  competency(
    'init-exploding-signal-variance',
    ['init-010-too-large', 'init-030-exploding'],
    ['init-variance-explosion'],
  ),
  competency(
    'init-vanishing-signal-variance',
    ['init-009-too-small', 'init-029-vanishing'],
    ['init-variance-suppression'],
  ),
]);
