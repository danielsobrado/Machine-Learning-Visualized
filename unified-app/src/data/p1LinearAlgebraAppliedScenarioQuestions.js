export const P1_LINEAR_ALGEBRA_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'matrix-multiplication': [
    {
      id: 'matmul-batched-linear-layer-worked',
      level: 'calculation',
      relatedComparison: 'batch-shape-vs-weight-shape-vs-output-shape',
      scenario: 'A dense layer receives a batch X with shape 32 x 128 and uses a weight matrix W with shape 128 x 64. Ignore the bias. The team wants to verify both the output shape and the multiply-accumulate scale before replacing the layer with a larger projection.',
      prompt: 'What output shape and scalar-multiplication count does XW require for one forward pass?',
      choices: [
        '32 x 128 and 262,144 multiplications because the output keeps the input feature dimension',
        '32 x 64 and 262,144 multiplications because 32 x 128 x 64 = 262,144',
        '128 x 64 and 8,192 multiplications because only the two feature dimensions matter',
      ],
      answerIndex: 1,
      explanation: 'The inner dimensions 128 match, so XW has shape 32 x 64. Each of 32 x 64 output values is a dot product of length 128, giving 32 x 64 x 128 = 262,144 scalar multiplications. Matrix dimensions therefore determine both representational shape and compute cost.',
      misconceptionTested: 'Matrix multiplication shape rules can be reasoned about independently from the compute implied by the same dimensions, or the input feature width must remain the output width.',
    },
  ],
  pca: [
    {
      id: 'pca-whitening-variance-worked',
      level: 'calculation',
      relatedComparison: 'pca-projection-vs-whitening-scale',
      scenario: 'A centered dataset has PCA eigenvalues 9, 4, and 1 along its three principal directions. A projected sample has PCA coordinates [6, 2, 1]. The pipeline is considering PCA whitening, which divides each principal coordinate by the square root of its corresponding eigenvalue.',
      prompt: 'What whitened coordinates should this sample have, and what property is whitening trying to equalize?',
      choices: [
        '[2, 1, 1], and whitening rescales principal components toward unit variance rather than merely rotating into the PCA basis',
        '[54, 8, 1], and whitening amplifies components in proportion to their explained variance',
        '[6, 2, 1], because PCA projection and PCA whitening are numerically identical operations',
      ],
      answerIndex: 0,
      explanation: 'The square roots of the eigenvalues are 3, 2, and 1. Dividing [6, 2, 1] by [3, 2, 1] gives [2, 1, 1]. Ordinary PCA projection decorrelates into principal axes; whitening additionally rescales those axes so their variances are approximately one.',
      misconceptionTested: 'Projecting onto principal components automatically whitens the data, so explained-variance scale no longer differs across retained PCA coordinates.',
    },
  ],
  'fundamental-subspaces': [
    {
      id: 'subspaces-consistency-diagnosis-worked',
      level: 'diagnosis',
      relatedComparison: 'column-space-consistency-vs-left-null-space-test',
      scenario: 'A matrix A has a left-null-space vector y = [1, -2, 1]^T satisfying y^T A = 0. A proposed right-hand side is b = [3, 4, 1]^T. For Ax = b to be consistent, b must be orthogonal to every vector in the left null space.',
      prompt: 'What does the left-null-space test say about this system?',
      choices: [
        'The system is consistent because every b is automatically in the column space of A',
        'The test is inconclusive because only the ordinary null space can determine consistency',
        'The system is inconsistent because y^T b = 3 - 8 + 1 = -4, not zero, so b is not in the column space of A',
      ],
      answerIndex: 2,
      explanation: 'Every vector in the left null space is orthogonal to the column space. If Ax = b had a solution, b would lie in the column space and therefore satisfy y^T b = 0. Here y^T b = -4, so the proposed b cannot be produced by A and the system is inconsistent.',
      misconceptionTested: 'The left null space is only an abstract companion to the ordinary null space and cannot diagnose whether a particular right-hand side belongs to the column space.',
    },
  ],
  'matrix-decompositions': [
    {
      id: 'decomp-structure-cost-decision',
      level: 'decision',
      relatedComparison: 'cholesky-vs-qr-vs-svd-structure-and-cost',
      scenario: 'A production solver repeatedly solves Ax = b for the same 5000 x 5000 matrix A. A is symmetric positive definite, dense, well-conditioned, and the workload needs many right-hand sides. The team can use Cholesky, a general QR factorization, or a full SVD.',
      prompt: 'Which decomposition is the strongest default choice for this stated workload?',
      choices: [
        'A full SVD, because the most general decomposition should always be preferred even when stronger matrix structure is known',
        'Cholesky, because it exploits symmetry and positive definiteness and is typically cheaper than QR or full SVD for repeated solves',
        'QR only, because Cholesky cannot solve systems with more than one right-hand side',
      ],
      answerIndex: 1,
      explanation: 'For a dense symmetric positive-definite matrix, Cholesky directly exploits the matrix structure and produces triangular solves that can be reused across many right-hand sides. QR and especially full SVD are valuable for different numerical or rank-deficiency needs but pay unnecessary cost for this stated case.',
      misconceptionTested: 'The most general matrix decomposition is automatically the best engineering choice even when the matrix has structure that permits a cheaper specialized factorization.',
    },
  ],
  'qr-decomposition': [
    {
      id: 'qr-least-squares-worked',
      level: 'calculation',
      relatedComparison: 'normal-equations-vs-qr-least-squares',
      scenario: 'For a least-squares problem, A = QR with orthonormal Q. After computing c = Q^T b, the upper-triangular system is R x = c with R = [[2, 1], [0, 3]] and c = [5, 6]^T. The team wants the QR-based solution without forming A^T A.',
      prompt: 'What solution x follows from triangular back-substitution?',
      choices: [
        'x = [1.5, 2]^T because x2 = 6/3 = 2 and 2x1 + 2 = 5',
        'x = [2.5, 0]^T because QR requires solving only the first row of R',
        'x = [5, 2]^T because orthonormal Q makes R irrelevant after Q^T b is computed',
      ],
      answerIndex: 0,
      explanation: 'The second row gives 3x2 = 6, so x2 = 2. Substituting into the first row gives 2x1 + 2 = 5, hence x1 = 1.5. QR solves least squares through an orthogonal transform followed by a stable triangular solve, avoiding the conditioning damage of explicitly forming A^T A.',
      misconceptionTested: 'Once Q^T b is computed, least squares is solved directly without using R, or normal equations are the only practical route from a rectangular system to coefficients.',
    },
  ],
  svd: [
    {
      id: 'svd-energy-rank-selection-worked',
      level: 'calculation',
      relatedComparison: 'rank-budget-vs-retained-singular-energy',
      scenario: 'A matrix has singular values [8, 4, 2, 1]. A compression rule chooses the smallest rank k that retains at least 95% of the squared Frobenius energy. Squared singular values are therefore [64, 16, 4, 1], with total energy 85.',
      prompt: 'What is the smallest acceptable rank k?',
      choices: [
        'k = 2 because 64 + 16 = 80 and 80/85 is already at least 95%',
        'k = 3 because 80/85 is about 94.1%, while (64 + 16 + 4)/85 is about 98.8%',
        'k = 4 because any discarded singular value makes the retained energy less than 95%',
      ],
      answerIndex: 1,
      explanation: 'Rank 2 retains 80/85 = 94.1%, which misses the 95% target. Rank 3 retains 84/85 = 98.8%, so it is the smallest rank that satisfies the energy requirement. Rank selection should use the cumulative squared singular values when the objective is retained Frobenius energy.',
      misconceptionTested: 'Singular-value rank selection can use raw singular values or rounded intuition without checking the squared-energy threshold that defines Frobenius reconstruction quality.',
    },
  ],
});

export function getP1LinearAlgebraAppliedScenariosForLesson(lessonId) {
  return P1_LINEAR_ALGEBRA_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
