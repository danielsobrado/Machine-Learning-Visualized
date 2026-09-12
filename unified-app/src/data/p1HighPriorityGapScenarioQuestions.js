export const P1_HIGH_PRIORITY_GAP_SCENARIOS_BY_LESSON = Object.freeze({
  'ab-testing-foundations': Object.freeze([
    Object.freeze({
      id: 'ab-sample-ratio-mismatch-randomization-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'expected-randomization-allocation-vs-observed-sample-ratio',
      scenario: 'A 50/50 randomized experiment expects roughly equal treatment and control traffic. After 200,000 eligible assignments, treatment contains 118,000 users and control contains 82,000. The product has no planned unequal allocation, and the difference is far beyond ordinary random fluctuation.',
      prompt: 'What should the team do before interpreting the treatment effect?',
      choices: Object.freeze([
        'Treat the sample-ratio mismatch as an experiment-integrity failure and investigate assignment, eligibility, logging, filtering, and exposure pipelines before trusting the effect estimate',
        'Continue normally because randomization guarantees unbiased treatment effects even when the observed arm counts strongly contradict the configured allocation',
        'Reweight the smaller arm until the counts become equal and then declare the randomization healthy without investigating why users disappeared or moved between arms',
      ]),
      answerIndex: 0,
      explanation: 'A large unexplained departure from the configured allocation is evidence that something may be wrong in assignment, exposure, logging, eligibility, or post-assignment filtering. Effect estimation should not proceed as though the experiment were healthy until the sample-ratio mismatch is understood. Blind reweighting can hide the symptom without restoring the missing randomization or measurement contract.',
      misconceptionTested: 'A randomized experiment remains trustworthy by definition even when observed arm allocation strongly contradicts the configured randomization ratio.',
    }),
  ]),
  'knn-naive-bayes-svm': Object.freeze([
    Object.freeze({
      id: 'classifier-knn-distance-concentration-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'low-dimensional-neighborhood-structure-vs-high-dimensional-distance-concentration',
      scenario: 'A kNN classifier works well with 12 standardized informative features. A new pipeline adds 800 weak or irrelevant numeric features. Validation accuracy drops, and for many queries the nearest and farthest training distances become very similar even though k and the distance metric are unchanged.',
      prompt: 'What failure mode should be investigated first?',
      choices: Object.freeze([
        'The curse of dimensionality and distance concentration: many irrelevant dimensions can make local neighborhoods less meaningful, so feature selection or dimensionality reduction should be tested before assuming a different k alone will fix the geometry',
        'Naive Bayes conditional-independence failure, because kNN distances become invalid only when features are statistically independent',
        'SVM margin collapse, because every nearest-neighbor model internally fits a maximum-margin hyperplane before measuring distances',
      ]),
      answerIndex: 0,
      explanation: 'kNN depends directly on the geometry of the feature space. In high dimensions, especially after adding many irrelevant coordinates, distances can concentrate and nominally nearest examples may no longer be meaningfully local. Scaling remains necessary, but it cannot recover useful neighborhood structure from hundreds of noisy dimensions by itself.',
      misconceptionTested: 'kNN can absorb arbitrarily many irrelevant standardized features because normalization alone guarantees that nearest-neighbor geometry remains informative.',
    }),
  ]),
  'computation-graph-backprop': Object.freeze([
    Object.freeze({
      id: 'backprop-detached-branch-gradient-check',
      level: 'diagnosis',
      relatedComparison: 'autodiff-gradient-vs-finite-difference-reference',
      scenario: 'A scalar loss depends on parameter w through two branches, but one branch accidentally calls detach before recombination. Autodiff reports dL/dw = 1.2. A central finite-difference check using the full forward function gives approximately 3.7 across several small epsilon values, while the forward loss itself looks correct.',
      prompt: 'What is the strongest debugging conclusion?',
      choices: Object.freeze([
        'The backward graph is missing a gradient path, so inspect detach or stop-gradient boundaries and branch accumulation before tuning the optimizer; the finite-difference reference shows the full forward function is more sensitive to w than autodiff reports',
        'The optimizer learning rate is necessarily too small because finite differences always produce larger derivatives than automatic differentiation',
        'The forward pass must be wrong because a detached branch changes only forward values and cannot affect which derivative paths autodiff follows',
      ]),
      answerIndex: 0,
      explanation: 'Finite differences perturb the parameter and observe the complete forward loss, so they provide an independent local sensitivity check. A stable 3.7 numerical derivative versus 1.2 from autodiff is strong evidence that the implemented backward graph omits part of the dependency. An accidental detach is a direct mechanism for exactly this mismatch.',
      misconceptionTested: 'If the scalar forward loss looks correct, automatic differentiation must also contain every intended gradient path and therefore does not need independent gradient checking.',
    }),
  ]),
  'attention-masks': Object.freeze([
    Object.freeze({
      id: 'attention-mask-before-softmax-composition',
      level: 'diagnosis',
      relatedComparison: 'logit-masking-before-softmax-vs-probability-masking-after-softmax',
      scenario: 'A decoder batch contains both future-token positions and right-padding positions. The implementation computes softmax over all attention logits first, then multiplies forbidden probabilities by zero. The remaining allowed probabilities are not renormalized, and some probability mass disappears on rows with many masked positions.',
      prompt: 'What masking rule should replace this implementation?',
      choices: Object.freeze([
        'Combine the causal and padding constraints on the attention logits before softmax, using a sufficiently negative additive mask for forbidden positions so the softmax normalizes only over allowed keys',
        'Keep post-softmax zeroing because losing probability mass is the intended way causal attention represents uncertainty about future tokens',
        'Apply the causal mask before softmax but always apply padding after softmax because padding positions are part of the normalization domain even when they contain no real token',
      ]),
      answerIndex: 0,
      explanation: 'Attention masking defines which keys belong to the softmax normalization domain. Forbidden future and padded positions should receive effectively minus-infinite logits before softmax, usually by composing the relevant masks. Zeroing probabilities afterward changes the row sum and does not reproduce the intended normalized distribution over valid positions.',
      misconceptionTested: 'Masking forbidden attention positions after softmax is equivalent to excluding them from the softmax normalization before probabilities are computed.',
    }),
  ]),
  'kv-cache': Object.freeze([
    Object.freeze({
      id: 'kv-cache-beam-memory-worked',
      level: 'calculation',
      relatedComparison: 'single-sequence-cache-vs-beam-search-cache-multiplication',
      scenario: 'One decoding sequence requires 1.5 GiB of KV cache at the current context length. A beam-search configuration keeps 4 live beams after they diverge, and assume for this simplified capacity calculation that each live beam needs its own full logical KV state with no prefix-sharing optimization.',
      prompt: 'Approximately how much KV-cache capacity must be budgeted for the 4 live beams?',
      choices: Object.freeze([
        'About 6 GiB, because 4 independent live beam states multiply the 1.5 GiB per-sequence cache requirement',
        'About 1.5 GiB, because beam search changes token probabilities but never increases live sequence state',
        'About 2 GiB, because cache size grows with the square root of the number of beams',
      ]),
      answerIndex: 0,
      explanation: 'Under the stated no-sharing simplification, each diverged beam is an active sequence with its own logical cached K/V history. Four beams therefore require 4 * 1.5 GiB = 6 GiB. Real engines can share common-prefix blocks before divergence, but beam width still creates additional live cache pressure after branches separate.',
      misconceptionTested: 'Beam search affects only sampling logic and therefore has no impact on KV-cache capacity or the number of simultaneously live decoding states.',
    }),
  ]),
  'model-fairness': Object.freeze([
    Object.freeze({
      id: 'fairness-base-rate-objective-tradeoff',
      level: 'decision',
      relatedComparison: 'group-calibration-vs-equalized-odds-under-different-base-rates',
      scenario: 'Two evaluation groups have materially different observed positive base rates. A calibrated risk score is being converted into binary decisions. The team demands, simultaneously and exactly, equal calibration within groups, equal true-positive rates, and equal false-positive rates while retaining nontrivial predictive information.',
      prompt: 'What should the audit team conclude about the metric specification before tuning thresholds?',
      choices: Object.freeze([
        'The objectives can be mutually incompatible when base rates differ, so the team must choose and justify a fairness criterion based on the decision context rather than assuming one thresholding scheme can satisfy every parity definition exactly',
        'All three criteria are always jointly achievable by lowering the threshold for the group with the lower base rate until every fairness metric becomes identical',
        'Calibration automatically implies equalized odds, so matching predicted probabilities within each group makes true-positive and false-positive rates equal by definition',
      ]),
      answerIndex: 0,
      explanation: 'Fairness metrics encode different conditional relationships. With differing base rates and an informative imperfect predictor, exact calibration and equalized-odds style error-rate parity generally cannot all be imposed simultaneously except in special cases. The product must identify which harms and decision constraints matter, document the trade-off, and evaluate consequences rather than treating fairness as one universally satisfiable scalar target.',
      misconceptionTested: 'Fairness definitions such as calibration and equalized odds are interchangeable constraints that can always be satisfied simultaneously by threshold tuning.',
    }),
  ]),
  'q-learning': Object.freeze([
    Object.freeze({
      id: 'qlearn-max-overestimation-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'single-estimator-max-target-vs-decoupled-action-selection-evaluation',
      scenario: 'A Q-learning agent has several actions whose true values are similar, but each learned Q estimate contains noise. Training repeatedly uses the maximum noisy next-action estimate in the bootstrap target. Evaluation shows action values drifting systematically above realized returns even though rewards are logged correctly.',
      prompt: 'Which mechanism best explains the optimistic value estimates?',
      choices: Object.freeze([
        'Maximization bias: taking the maximum over noisy estimates preferentially selects positive estimation errors, motivating approaches such as Double Q-learning that separate action selection from value evaluation',
        'Terminal-state handling, because overestimation can occur only when the environment forgets to bootstrap from terminal states',
        'Discounting, because any gamma below one mathematically forces Q-values to exceed observed returns',
      ]),
      answerIndex: 0,
      explanation: 'When multiple noisy action-value estimates compete inside a max, the selected estimate tends to contain an unusually positive error even when individual estimators are unbiased. Repeating that target can create systematic overestimation. Double-estimator methods reduce the coupling between choosing the action and evaluating its target value.',
      misconceptionTested: 'The max operator in ordinary Q-learning cannot introduce bias when individual action-value estimates are noisy but unbiased on average.',
    }),
  ]),
  'ppo-clipped-policy-gradient': Object.freeze([
    Object.freeze({
      id: 'ppo-clipping-not-kl-guarantee',
      level: 'diagnosis',
      relatedComparison: 'samplewise-ratio-clipping-vs-global-policy-divergence-control',
      scenario: 'A PPO run uses epsilon = 0.2. After several optimizer epochs over the same rollout batch, the measured mean KL divergence from the behavior policy becomes much larger than the team expected. An engineer argues this is impossible because every PPO objective uses ratio clipping.',
      prompt: 'What is the correct interpretation of the clipping mechanism?',
      choices: Object.freeze([
        'The clipped surrogate limits incentive from sampled probability ratios but is not a hard global KL constraint; repeated epochs and aggregate policy changes can still move the policy substantially, so KL monitoring or an explicit stopping or penalty rule may be needed',
        'Ratio clipping mathematically guarantees that global KL divergence can never exceed epsilon, so the KL metric implementation must be wrong',
        'PPO clipping applies only to critic updates, so policy divergence is intentionally unrestricted by the actor objective',
      ]),
      answerIndex: 0,
      explanation: 'PPO clipping modifies the surrogate objective on sampled action ratios; it does not project the entire new policy into a strict KL ball. Multiple minibatch epochs, state and action coverage, and changes to unsampled probabilities can produce larger overall divergence than the clip parameter might suggest. Monitoring approximate KL and stopping or penalizing excessive updates is therefore a separate control.',
      misconceptionTested: 'The PPO clip parameter epsilon is a guaranteed upper bound on whole-policy KL divergence after arbitrary optimization over a rollout batch.',
    }),
  ]),
  'least-squares-projection': Object.freeze([
    Object.freeze({
      id: 'least-squares-qr-vs-normal-equations-stability',
      level: 'decision',
      relatedComparison: 'normal-equations-conditioning-vs-qr-or-svd-solve',
      scenario: 'A least-squares design matrix has nearly collinear columns and condition number around 1e8. A proposed implementation explicitly forms X^T X and solves the normal equations. Another implementation solves the original least-squares problem with QR, while SVD is available if rank deficiency must be diagnosed.',
      prompt: 'Which numerical strategy is the safer default for this ill-conditioned problem?',
      choices: Object.freeze([
        'Prefer QR for a standard least-squares solve, or SVD when rank or near-null directions matter, because explicitly forming X^T X squares the condition number and can magnify numerical error',
        'Prefer the normal equations because multiplying by X^T always improves conditioning by averaging away near-collinear feature directions',
        'All three approaches have identical numerical sensitivity because they minimize the same mathematical objective and therefore perform the same floating-point operations',
      ]),
      answerIndex: 0,
      explanation: 'The mathematical least-squares optimum can be equivalent while the numerical algorithms are not. Forming X^T X roughly squares the condition number, so an already ill-conditioned design can lose substantial numerical precision. QR avoids that squaring for ordinary solves, while SVD exposes small singular directions and supports robust rank-deficiency handling at additional cost.',
      misconceptionTested: 'Equivalent least-squares formulas are automatically equivalent numerical algorithms, so explicitly solving the normal equations is always as stable as QR or SVD.',
    }),
  ]),
});

export function getP1HighPriorityGapScenariosForLesson(lessonId) {
  return P1_HIGH_PRIORITY_GAP_SCENARIOS_BY_LESSON[lessonId] || [];
}
