export const LINEAR_ALGEBRA_NEXT_QUALITY_OVERRIDES = Object.freeze({
  'matrix-decompositions': Object.freeze({
    reason: 'Matrix-decomposition lesson now factors the same symmetric positive-definite matrix with LU, QR, SVD, and Cholesky, compares reconstruction numerically, and ties each factorization to the structure it exposes.',
    nextAction: 'Add decomposition failure modes, conditioning sensitivity, and operation-cost comparisons on non-SPD and rank-deficient matrices.',
  }),
  'qr-decomposition': Object.freeze({
    reason: 'QR lesson now compares classical Gram-Schmidt with Householder reflections on nearly collinear columns and measures loss of orthogonality separately from reconstruction error.',
    nextAction: 'Add rank-revealing QR with column pivoting and a least-squares residual comparison on numerically rank-deficient systems.',
  }),
  svd: Object.freeze({
    reason: 'SVD lesson now exposes an explicit rank-1 reconstruction with controllable singular values, retained spectral energy, and the Frobenius error contributed by the discarded singular direction.',
    nextAction: 'Add noisy low-rank denoising and truncated-pseudoinverse regularization so rank selection connects directly to inverse problems.',
  }),
  'fundamental-subspaces': Object.freeze({
    reason: 'Fundamental-subspaces lesson now row-reduces a concrete rank-deficient matrix and derives numeric bases for Col(A), Row(A), N(A), and N(A^T) with explicit rank-nullity checks.',
    nextAction: 'Add numerical orthogonal-complement and projection examples linking Col(A)^perp to N(A^T) and Row(A)^perp to N(A).',
  }),
  'matrix-multiplication': Object.freeze({
    reason: 'Matrix-multiplication lesson now treats a 2x3 matrix as a map from R3 to R2, showing Ax simultaneously as row dot-products and a weighted sum of output-space columns, with explicit rectangular shape reasoning.',
    nextAction: 'Add composition-order and batched tensor-contraction examples that connect matrix products to multilayer linear maps.',
  }),
});
