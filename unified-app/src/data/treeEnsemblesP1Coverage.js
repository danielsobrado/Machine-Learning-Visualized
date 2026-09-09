function competency(id, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId: 'tree-ensembles',
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const TREE_ENSEMBLES_P1_AUDITED_LESSON_IDS = Object.freeze([
  'tree-ensembles',
]);

export const TREE_ENSEMBLES_P1_REQUIREMENTS = Object.freeze([
  competency(
    'tree-oob-bootstrap-membership',
    ['treeens-012-oob'],
    ['tree-oob-bootstrap-membership-worked'],
  ),
  competency(
    'tree-boosting-residual-correction',
    ['treeens-014-residuals'],
    ['tree-boosting-residual-update-worked'],
  ),
  competency(
    'tree-boosting-early-stopping',
    ['treeens-038-early-stopping'],
    ['boosting-overfit-rounds'],
  ),
  competency(
    'tree-correlated-feature-importance',
    ['treeens-045-permutation'],
    ['tree-attribution-correlated-features'],
  ),
  competency(
    'tree-post-outcome-feature-leakage',
    ['treeens-060-leakage-case'],
    ['tree-post-outcome-feature-diagnosis'],
  ),
  competency(
    'tree-regression-extrapolation-support',
    ['treeens-047-extrapolation'],
    ['tree-regression-extrapolation-support-decision'],
  ),
]);
