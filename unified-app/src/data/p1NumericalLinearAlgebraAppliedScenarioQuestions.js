export const P1_NUMERICAL_LINEAR_ALGEBRA_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'change-of-basis': [
    {
      id: 'basis-coordinate-solve-worked',
      level: 'calculation',
      relatedComparison: 'active-vector-transform-vs-passive-coordinate-change',
      scenario: 'A 2D basis has b1 = (2, 0) and b2 = (0, 0.5), so the basis matrix is B = [[2, 0], [0, 0.5]]. The geometric vector x = (4, 1) is written in standard coordinates. You want coordinates c in the new basis such that Bc = x; the vector itself is not being physically transformed.',
      prompt: 'What are the coordinates c of x in this basis?',
      choices: [
        'c = (2, 2), because 2c1 = 4 and 0.5c2 = 1',
        'c = (8, 0.5), because each coordinate should be multiplied by the corresponding basis scale',
        'c = (4, 1), because changing basis never changes coordinate numbers',
      ],
      answerIndex: 0,
      explanation: 'A passive change of basis solves Bc = x. Here c1 = 4 / 2 = 2 and c2 = 1 / 0.5 = 2, so c = (2, 2). The geometric vector stays the same; only the numbers used to represent it change.',
      misconceptionTested: 'Changing basis means applying the basis matrix directly to the vector rather than solving for the coordinates that represent the same vector.',
    },
  ],
  'projection-matrices': [
    {
      id: 'projection-vector-worked',
      level: 'calculation',
      relatedComparison: 'orthogonal-projection-vs-component-wise-scaling',
      scenario: 'A vector x = (5, 0) is projected orthogonally onto the line spanned by u = (3, 4). Use proj_u(x) = ((x dot u) / (u dot u))u. Here x dot u = 15 and u dot u = 25, so the projection coefficient is 0.6.',
      prompt: 'What is the projected vector, and what property should its residual satisfy?',
      choices: [
        'proj_u(x) = (1.8, 2.4), and the residual x - proj_u(x) is orthogonal to u',
        'proj_u(x) = (3, 4), and the residual must be parallel to u',
        'proj_u(x) = (5, 0), because projection preserves the original vector whenever the dot product is positive',
      ],
      answerIndex: 0,
      explanation: 'Multiplying u by 0.6 gives (1.8, 2.4). The residual is (3.2, -2.4), and its dot product with u is 3.2*3 + (-2.4)*4 = 0, which is the defining orthogonality condition for an orthogonal projection.',
      misconceptionTested: 'Projection onto a direction means replacing the vector with the spanning vector itself or scaling coordinates independently instead of removing the orthogonal residual.',
    },
  ],
  'least-squares-projection': [
    {
      id: 'least-squares-normal-equation-worked',
      level: 'calculation',
      relatedComparison: 'least-squares-fit-vs-exact-interpolation',
      scenario: 'Fit y = beta0 + beta1*x to the three points (0,1), (1,2), and (2,2). The design matrix has rows (1,0), (1,1), and (1,2), giving X^T X = [[3,3],[3,5]] and X^T y = (5,6). The data do not lie exactly on one straight line.',
      prompt: 'What least-squares coefficients solve the normal equations?',
      choices: [
        'beta0 = 7/6 (about 1.167) and beta1 = 1/2',
        'beta0 = 1 and beta1 = 1/2 because the intercept must equal the first observed y value',
        'beta0 = 1 and beta1 = 1 because least squares must pass through the first two observations exactly',
      ],
      answerIndex: 0,
      explanation: 'Solving 3beta0 + 3beta1 = 5 and 3beta0 + 5beta1 = 6 gives 2beta1 = 1, so beta1 = 1/2 and beta0 = 7/6. Least squares minimizes total squared residuals; it does not generally interpolate any chosen pair of points.',
      misconceptionTested: 'A least-squares line is required to pass through the first observation or exactly interpolate enough observations to determine its parameters.',
    },
  ],
  pseudoinverse: [
    {
      id: 'pseudoinverse-minimum-norm-worked',
      level: 'calculation',
      relatedComparison: 'arbitrary-exact-solution-vs-moore-penrose-minimum-norm-solution',
      scenario: 'The underdetermined system Ax = b has A = [1 1] and b = 4, so every vector satisfying x1 + x2 = 4 is an exact solution. Examples include (4,0), (3,1), and (2,2). The Moore-Penrose pseudoinverse selects the exact solution with minimum Euclidean norm.',
      prompt: 'Which solution does A+ b return?',
      choices: [
        'x = (2, 2), whose squared norm 8 is minimal among points on x1 + x2 = 4',
        'x = (4, 0), because the pseudoinverse always concentrates the solution in the first variable',
        'x = (3, 1), because the pseudoinverse chooses the lexicographically first nonzero exact solution',
      ],
      answerIndex: 0,
      explanation: 'For x1 + x2 = 4, symmetry and convexity put the minimum-norm point at x1 = x2 = 2. Its squared norm is 2^2 + 2^2 = 8, compared with 16 for (4,0) and 10 for (3,1).',
      misconceptionTested: 'The pseudoinverse merely returns any exact solution of an underdetermined system rather than the unique Moore-Penrose minimum-norm solution.',
    },
  ],
  'condition-number': [
    {
      id: 'condition-error-amplification-worked',
      level: 'calculation',
      relatedComparison: 'solver-roundoff-vs-problem-conditioning',
      scenario: 'A linear solve uses a matrix with condition number kappa = 1000. Measurement noise introduces a relative input perturbation of about 0.01%, which is 0.0001 as a fraction. For small perturbations, kappa times the relative input error gives the scale of the worst-case relative output amplification.',
      prompt: 'What output-error scale should make you cautious even if the numerical solver itself is implemented correctly?',
      choices: [
        'About 10%, because 1000 * 0.0001 = 0.1',
        'About 0.01%, because a correct solver prevents the matrix from amplifying measurement error',
        'About 1000%, because the condition number should be interpreted directly as a percent error',
      ],
      answerIndex: 0,
      explanation: 'The condition number describes sensitivity of the problem, not merely quality of the solver. Multiplying 1000 by 0.0001 gives 0.1, or about 10%, as a worst-case first-order error scale. The bound is not a guarantee that every perturbation reaches it.',
      misconceptionTested: 'Using a stable numerical algorithm removes sensitivity caused by an ill-conditioned problem, so input uncertainty cannot be strongly amplified.',
    },
  ],
  'determinant-volume': [
    {
      id: 'determinant-area-orientation-worked',
      level: 'calculation',
      relatedComparison: 'signed-determinant-vs-absolute-volume-scale',
      scenario: 'A 2D linear transformation uses A = [[3, 1], [0, 2]]. Apply it to the unit square. The determinant is det(A) = 3*2 - 0*1 = 6. The absolute determinant gives the area-scaling factor, while the sign indicates whether orientation is preserved or reversed.',
      prompt: 'What happens to area and orientation under this transformation?',
      choices: [
        'Area is multiplied by 6 and orientation is preserved because det(A) is positive',
        'Area is multiplied by 5 because the matrix entries should be added, and orientation is reversed',
        'Area is unchanged because determinant affects only invertibility, not geometric scale',
      ],
      answerIndex: 0,
      explanation: 'The unit square has area 1, so its transformed parallelogram has area |det(A)| = 6. Since the determinant is positive, the transformation preserves orientation. A negative determinant would keep the absolute area scale but reverse orientation.',
      misconceptionTested: 'The determinant only tells whether a matrix is invertible and has no direct geometric meaning for volume scaling or orientation.',
    },
  ],
  'low-rank-approximation': [
    {
      id: 'low-rank-storage-worked',
      level: 'calculation',
      relatedComparison: 'dense-matrix-storage-vs-truncated-svd-factor-storage',
      scenario: 'A dense 4000 x 3000 matrix contains 12,000,000 scalar entries. A rank-50 truncated SVD stores U_k with shape 4000 x 50, 50 singular values, and V_k with shape 3000 x 50. Ignore metadata and assume each stored scalar has the same cost.',
      prompt: 'How many scalar values does the rank-50 representation store?',
      choices: [
        '350,050 scalars: 4000*50 + 50 + 3000*50',
        '12,000,000 scalars because low-rank approximation changes compute but not storage',
        '700,050 scalars because both U_k and V_k must be stored twice to reconstruct the matrix',
      ],
      answerIndex: 0,
      explanation: 'The factors require 200,000 values for U_k, 50 singular values, and 150,000 values for V_k, totaling 350,050. That is roughly 34 times fewer scalars than the original 12 million, at the cost of reconstruction error from discarded singular directions.',
      misconceptionTested: 'Truncated SVD can reduce arithmetic but does not materially reduce storage because reconstructing the matrix supposedly requires retaining the dense matrix too.',
    },
  ],
  eigenvalue: [
    {
      id: 'eigen-power-method-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'dominant-eigenvector-convergence-vs-coordinate-magnitude',
      scenario: 'For A = [[2,1],[1,2]], start a power iteration with x0 = (1,0). The next unnormalized iterates are x1 = (2,1) and x2 = (5,4). Matrix A has eigenvectors proportional to (1,1) and (1,-1), with eigenvalues 3 and 1 respectively.',
      prompt: 'What trend should repeated normalized multiplication by A produce, and why?',
      choices: [
        'The direction approaches (1,1) because its eigenvalue magnitude 3 dominates the component associated with eigenvalue 1',
        'The direction approaches (1,-1) because the smaller eigenvalue produces a more stable normalized vector',
        'The direction remains (1,0) because eigenvectors affect eigenvalues but not repeated matrix-vector multiplication',
      ],
      answerIndex: 0,
      explanation: 'Power iteration repeatedly multiplies each eigenvector component by its eigenvalue. The component along (1,1) grows by a factor of 3 per step while the component along (1,-1) grows only by 1, so normalization increasingly aligns the iterate with the dominant eigenvector.',
      misconceptionTested: 'Power iteration converges according to whichever coordinate is initially largest rather than according to the eigenvalue magnitudes of the matrix eigen-directions.',
    },
  ],
});

export function getP1NumericalLinearAlgebraAppliedScenariosForLesson(lessonId) {
  return P1_NUMERICAL_LINEAR_ALGEBRA_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
