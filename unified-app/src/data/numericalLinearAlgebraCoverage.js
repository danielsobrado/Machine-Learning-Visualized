function requirement(scenarioIds) {
  return Object.freeze({ scenarioIds: Object.freeze(scenarioIds) });
}

function depthRequirement(id, lessonId, scenarioIds) {
  return Object.freeze({ id, lessonId, scenarioIds: Object.freeze(scenarioIds) });
}

export const NUMERICAL_LINEAR_ALGEBRA_AUDITED_LESSON_IDS = Object.freeze([
  'change-of-basis',
  'projection-matrices',
  'least-squares-projection',
  'pseudoinverse',
  'condition-number',
  'determinant-volume',
  'low-rank-approximation',
  'eigenvalue',
]);

export const NUMERICAL_LINEAR_ALGEBRA_COVERAGE = Object.freeze({
  'change-of-basis': requirement(['basis-coordinate-solve-worked']),
  'projection-matrices': requirement(['projection-vector-worked']),
  'least-squares-projection': requirement(['least-squares-normal-equation-worked']),
  pseudoinverse: requirement(['pseudoinverse-minimum-norm-worked']),
  'condition-number': requirement(['condition-error-amplification-worked']),
  'determinant-volume': requirement(['determinant-area-orientation-worked']),
  'low-rank-approximation': requirement(['low-rank-storage-worked']),
  eigenvalue: requirement(['eigen-power-method-diagnosis']),
});

export const NUMERICAL_LINEAR_ALGEBRA_DEPTH_REQUIREMENTS = Object.freeze([
  depthRequirement('passive-change-of-basis-coordinate-calculation', 'change-of-basis', ['basis-coordinate-solve-worked']),
  depthRequirement('orthogonal-projection-vector-calculation', 'projection-matrices', ['projection-vector-worked']),
  depthRequirement('least-squares-normal-equation-calculation', 'least-squares-projection', ['least-squares-normal-equation-worked']),
  depthRequirement('pseudoinverse-minimum-norm-calculation', 'pseudoinverse', ['pseudoinverse-minimum-norm-worked']),
  depthRequirement('condition-number-error-amplification-calculation', 'condition-number', ['condition-error-amplification-worked']),
  depthRequirement('determinant-volume-orientation-calculation', 'determinant-volume', ['determinant-area-orientation-worked']),
  depthRequirement('low-rank-storage-calculation', 'low-rank-approximation', ['low-rank-storage-worked']),
  depthRequirement('dominant-eigenvector-power-iteration-diagnosis', 'eigenvalue', ['eigen-power-method-diagnosis']),
]);
