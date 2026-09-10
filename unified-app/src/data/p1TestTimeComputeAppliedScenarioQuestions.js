export const P1_TEST_TIME_COMPUTE_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'test-time-compute-thinking-budgets': Object.freeze([
    Object.freeze({
      id: 'ttc-best-of-n-verifier-selection-trap',
      level: 'diagnosis',
      relatedComparison: 'oracle-sample-quality-vs-realized-verifier-selection-quality',
      scenario: 'Best-of-8 generates one fully correct solution, five ordinary wrong solutions, and two polished wrong solutions that exploit a formatting pattern favored by the selector. The oracle accuracy for this query is therefore 100%, but the deployed verifier assigns its highest score to one of the polished wrong answers.',
      prompt: 'What is the primary bottleneck, and what should be fixed before increasing N further?',
      choices: Object.freeze([
        'Selection quality is the bottleneck; strengthen and validate the verifier on hidden correctness cases before spending more compute on additional candidates',
        'Sampling quality is the bottleneck because a correct candidate never appeared in the group',
        'Increase N immediately because a larger candidate set guarantees the verifier will select the correct response',
      ]),
      answerIndex: 0,
      explanation: 'The candidate set already contains a correct solution, so the oracle bound is high. The deployed system fails because its verifier prefers an exploitable proxy. More samples can increase cost without improving realized accuracy when the selector cannot recognize the best candidate.',
      misconceptionTested: 'Best-of-N quality is determined only by whether a correct sample exists; verifier selection quality cannot become the limiting stage.',
    }),
    Object.freeze({
      id: 'ttc-tree-search-prm-pruning-failure',
      level: 'diagnosis',
      relatedComparison: 'partial-path-score-vs-correct-branch-survival',
      scenario: 'A reasoning tree has four partial branches at depth 3. Hidden evaluation later shows branch C would reach the only correct final answer. The process scorer assigns branch scores A=0.82, B=0.79, C=0.41, D=0.76, and beam width 2 keeps only A and B. Increasing search depth afterward never recovers the correct solution.',
      prompt: 'What should the team investigate first?',
      choices: Object.freeze([
        'The PRM/value signal and pruning aggressiveness, because the correct branch was removed before extra search depth could help',
        'Only the final-answer verifier, because partial-path scoring cannot affect which branches survive',
        'Increase maximum depth while keeping the same beam and scorer, because deeper search recreates branches that were already pruned',
      ]),
      answerIndex: 0,
      explanation: 'Tree search can only expand branches that survive pruning. A weak process scorer can assign a low value to a promising but incomplete path, causing irreversible search error. Calibration, wider beams, uncertainty-aware pruning, or a better PRM should be tested before simply adding depth.',
      misconceptionTested: 'More search depth always improves reasoning quality even when the scoring policy already pruned the only correct branch.',
    }),
  ]),
});
