export const P1_QR_DECOMPOSITION_SCENARIOS_BY_LESSON = Object.freeze({
  'qr-decomposition': [
    {
      id: 'qr-pivoted-rank-revelation-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'unpivoted-qr-vs-column-pivoted-rank-revelation',
      scenario: 'A least-squares design matrix has three columns where the third is almost a linear combination of the first two. An unpivoted QR factorization produces diagonal magnitudes in R of [8.1, 3.2, 1e-10]. Back substitution then produces an enormous third coefficient that changes dramatically under tiny input perturbations.',
      prompt: 'What is the most defensible numerical response?',
      choices: [
        'Treat the tiny R diagonal as rank-deficiency evidence and use column-pivoted QR or another rank-aware solver with an explicit numerical-rank tolerance',
        'Keep unpivoted back substitution because every nonzero diagonal guarantees a stable full-rank solve in floating point',
        'Square the system into normal equations so the tiny diagonal direction becomes easier to identify',
      ],
      answerIndex: 0,
      explanation: 'A diagonal entry near numerical precision relative to the leading pivots signals a nearly dependent direction. Column pivoting helps expose numerical rank and prevents blindly dividing by a tiny pivot; SVD is another rank-aware option when stronger diagnostics are needed.',
      misconceptionTested: 'A mathematically nonzero R diagonal is sufficient evidence that ordinary back substitution is numerically safe on a nearly rank-deficient matrix.',
    },
    {
      id: 'qr-orthogonality-loss-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'classical-gram-schmidt-vs-householder-floating-point-stability',
      scenario: 'Two columns of A are nearly parallel. Classical Gram-Schmidt reconstructs A with a small residual, but the largest off-diagonal entry of Q^T Q is 2e-3. A Householder QR on the same matrix keeps the corresponding orthogonality error near 1e-15.',
      prompt: 'What does this comparison diagnose?',
      choices: [
        'The reconstruction check alone proves both Q factors are equally reliable because QR quality is only about QR being close to A',
        'Classical Gram-Schmidt has lost meaningful orthogonality on the nearly dependent columns, so a more stable QR algorithm should be preferred',
        'Householder QR must be wrong because a smaller Q^T Q off-diagonal means it changed the column space',
      ],
      answerIndex: 1,
      explanation: 'A small reconstruction error does not guarantee a numerically orthogonal Q. Nearly dependent columns are a classic stress case for Gram-Schmidt ordering, while Householder transformations preserve orthogonality much more robustly in floating point.',
      misconceptionTested: 'If QR reconstructs A accurately, loss of orthogonality in Q cannot matter or cannot occur.',
    },
    {
      id: 'qr-normal-equation-conditioning-worked',
      level: 'calculation',
      relatedComparison: 'qr-least-squares-vs-normal-equation-condition-squaring',
      scenario: 'A tall regression matrix has condition number kappa(A) approximately 10^6. A proposed implementation forms A^T A and solves the normal equations. For a full-column-rank matrix, kappa(A^T A) is approximately kappa(A)^2.',
      prompt: 'What condition-number scale should the normal-equation matrix have, and what decision follows?',
      choices: [
        'About 10^6, so forming A^T A does not materially change numerical sensitivity',
        'About 10^3, because multiplying by A^T takes a square root of the condition number',
        'About 10^12, so QR or SVD is a safer least-squares route when numerical stability matters',
      ],
      answerIndex: 2,
      explanation: 'Squaring 10^6 gives about 10^12. Explicit normal equations can therefore amplify the conditioning problem dramatically, while QR works with orthogonal transformations without first squaring the condition number.',
      misconceptionTested: 'Normal equations preserve the original design matrix conditioning, so QR has no numerical advantage on ill-conditioned least-squares problems.',
    },
    {
      id: 'qr-residual-optimality-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'small-reconstruction-error-vs-least-squares-first-order-condition',
      scenario: 'A QR routine reconstructs A accurately and returns coefficients x for min ||Ax - b||. The resulting residual r = b - Ax has Q^T r = [0.04, -0.01]^T even though the expected numerical tolerance is around 1e-10.',
      prompt: 'What should the solver review conclude?',
      choices: [
        'The factorization may reconstruct A, but the returned coefficients do not satisfy the QR least-squares orthogonality condition at the stated tolerance',
        'The residual is valid because least-squares residuals should generally have large components inside Col(A)',
        'The nonzero Q^T r proves only that QR sign conventions differ between libraries',
      ],
      answerIndex: 0,
      explanation: 'At a least-squares optimum the residual must be orthogonal to the column space, so Q^T r should be near zero when Q spans that space. Accurate factor reconstruction does not by itself prove the downstream projection or triangular solve was performed correctly.',
      misconceptionTested: 'Checking A approximately equals QR is enough to prove the entire least-squares solve is correct.',
    },
    {
      id: 'qr-reduced-storage-worked',
      level: 'calculation',
      relatedComparison: 'full-qr-vs-reduced-qr-storage',
      scenario: 'A full-column-rank matrix A has shape 10,000 x 50. A dense full QR stores Q with 10,000 x 10,000 entries and R with 10,000 x 50 entries. A reduced QR stores Q with 10,000 x 50 entries and R with 50 x 50 entries.',
      prompt: 'Approximately how many scalar entries do the reduced factors store, compared with the full factors?',
      choices: [
        'About 100.5 million reduced entries versus about 502,500 full entries, because reduced QR adds basis vectors',
        'About 502,500 reduced entries versus about 100.5 million full entries, roughly a 200x reduction in factor storage',
        'Exactly 500,000 entries in both forms because Q and R always have the same total size as A',
      ],
      answerIndex: 1,
      explanation: 'Reduced Q stores 10,000*50 = 500,000 values and reduced R stores 50*50 = 2,500, totaling 502,500. Full Q alone stores 100,000,000 values, and full R adds 500,000 more. When only Col(A) and least-squares solves are needed, the extra full-Q basis is wasteful.',
      misconceptionTested: 'Full and reduced QR have essentially the same storage cost for tall matrices, so choosing reduced QR is only a notational preference.',
    },
    {
      id: 'qr-factor-reuse-decision',
      level: 'decision',
      relatedComparison: 'repeated-factorization-vs-reused-qr-many-right-hand-sides',
      scenario: 'A service repeatedly solves least-squares problems with the same tall matrix A but 200 different right-hand sides b. Profiling shows QR factorization dominates runtime, while applying Q^T and triangular back substitution are much cheaper.',
      prompt: 'Which implementation strategy best matches this workload?',
      choices: [
        'Recompute QR for every right-hand side so each solve has an independent orthonormal basis',
        'Form and cache an explicit inverse of A because inverses are always the most stable reusable representation',
        'Factor A once, reuse Q and R for every right-hand side, and rerun the factorization only when A changes materially',
      ],
      answerIndex: 2,
      explanation: 'The expensive factorization depends on A, not on b. Reusing the same validated Q and R amortizes factorization cost across many solves while preserving the stable orthogonal-plus-triangular solve path.',
      misconceptionTested: 'A QR factorization must be recomputed whenever the right-hand side changes, even if the design matrix is identical.',
    },
  ],
});

export function getP1QrDecompositionScenariosForLesson(lessonId) {
  return P1_QR_DECOMPOSITION_SCENARIOS_BY_LESSON[lessonId] || [];
}
