function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'ml-security-robustness-track',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const ML_SECURITY_ROBUSTNESS_P1_AUDITED_LESSON_IDS = Object.freeze([
  'ml-security-robustness-track',
]);

export const ML_SECURITY_ROBUSTNESS_P1_REQUIREMENTS = Object.freeze([
  competency(
    'security-least-privilege-credential-scope',
    ['mlsec-026-least-privilege'],
    ['security-credential-scope-boundary'],
  ),
  competency(
    'security-tool-side-authorization',
    ['mlsec-030-access-control'],
    ['security-tool-authorization-boundary'],
  ),
  competency(
    'security-attack-success-vs-benign-utility',
    ['mlsec-043-robustness-metric'],
    ['security-attack-success-rate-worked'],
  ),
  competency(
    'security-backdoor-trigger-specific-evaluation',
    ['mlsec-011-backdoor'],
    ['security-backdoor-aggregate-metric-diagnosis'],
  ),
  competency(
    'security-model-extraction-probing',
    ['mlsec-015-model-extraction'],
    ['security-model-extraction-probing-diagnosis'],
  ),
  competency(
    'security-membership-inference-privacy',
    ['mlsec-014-membership'],
    ['security-membership-inference-privacy-decision'],
  ),
  competency(
    'security-adversarial-vs-natural-robustness',
    ['mlsec-012-adversarial-example'],
    ['security-adversarial-vs-natural-shift-diagnosis'],
  ),
]);
