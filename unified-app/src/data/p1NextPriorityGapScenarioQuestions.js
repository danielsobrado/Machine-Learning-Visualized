export const P1_NEXT_PRIORITY_GAP_SCENARIOS_BY_LESSON = Object.freeze({
  'hypothesis-testing-intuition': Object.freeze([
    Object.freeze({
      id: 'hypothesis-equivalence-tost-decision',
      level: 'decision',
      relatedComparison: 'failure-to-reject-difference-vs-positive-equivalence-evidence',
      scenario: 'A product team defines effects between -2 and +2 percentage points as practically equivalent. A properly constructed 90% confidence interval for the treatment difference is [-1.1, +0.8] points, and the pre-specified analysis uses the two one-sided tests (TOST) procedure at alpha = 0.05.',
      prompt: 'What conclusion is justified under the stated equivalence design?',
      choices: Object.freeze([
        'The data support equivalence within the pre-specified +/-2 point margin because the entire 90% interval lies inside that margin',
        'Equivalence cannot ever be concluded from confidence intervals; only failure to reject an ordinary zero-difference test can establish it',
        'The treatments are exactly identical because zero lies inside the interval, so the equivalence margin is unnecessary',
      ]),
      answerIndex: 0,
      explanation: 'Equivalence is a positive claim relative to a pre-specified practical margin. Under the usual TOST confidence-interval correspondence, a 90% interval entirely inside [-2, +2] supports equivalence at alpha = 0.05. Merely failing to reject a conventional difference test would not provide the same evidence, and equivalence within a margin does not mean the true effect is exactly zero.',
      misconceptionTested: 'Failing to find a statistically significant difference is automatically evidence that two treatments are practically equivalent or exactly identical.',
    }),
  ]),
  calibration: Object.freeze([
    Object.freeze({
      id: 'calibration-ece-binning-sensitivity-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'coarse-binned-ece-vs-local-reliability-errors',
      scenario: 'A classifier has one group of predictions around 0.55 that realizes positives 35% of the time and another around 0.75 that realizes positives 95% of the time. A coarse calibration report merges both groups into one large bin whose average predicted probability and observed frequency happen to be close, producing a small ECE.',
      prompt: 'What is the strongest interpretation of the small ECE?',
      choices: Object.freeze([
        'The model is well calibrated everywhere because a low ECE is invariant to bin definitions and cannot hide opposite local errors',
        'The summary can hide substantial local over- and under-confidence through coarse binning or cancellation, so inspect reliability structure and sensitivity to the calibration metric or bins',
        'ECE proves discrimination is poor because calibration error and ranking quality are the same quantity',
      ]),
      answerIndex: 1,
      explanation: 'Expected calibration error is a binned summary, so its value depends on how predictions are partitioned. Opposite local calibration errors can partially cancel after aggregation, especially in coarse bins. A small ECE therefore does not prove every probability region is reliable; reliability diagrams, alternative binning, and complementary proper scoring rules can expose structure the scalar summary misses.',
      misconceptionTested: 'A single low ECE value is a binning-invariant certificate of local calibration quality and cannot conceal offsetting calibration errors within a bin.',
    }),
  ]),
  'cross-validation': Object.freeze([
    Object.freeze({
      id: 'cv-preprocessing-fit-inside-folds-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'global-learned-preprocessing-vs-fold-local-pipeline-fitting',
      scenario: 'Before five-fold cross-validation, a team fits a median imputer, standardizer, and PCA transform once on the full dataset, then performs CV only for the downstream classifier. Labels were not used by those preprocessing steps, but every validation fold influenced the learned medians, means, variances, and PCA directions.',
      prompt: 'How should the evaluation pipeline be corrected?',
      choices: Object.freeze([
        'Keep the global preprocessing because leakage requires direct use of validation labels',
        'Fit preprocessing globally only for PCA, but refit the imputer and scaler inside each validation fold',
        'Fit every learned preprocessing step on each training fold and apply that fitted pipeline to its validation fold, so validation features do not influence training-time transformations',
      ]),
      answerIndex: 2,
      explanation: 'Cross-validation must reproduce the full model-fitting procedure, not only the final estimator fit. Imputation statistics, scaling parameters, and PCA directions are learned from data, so estimating them with validation rows lets held-out feature information influence the trained pipeline. A fold-local pipeline fits all learned transforms using only the training partition before transforming the validation partition.',
      misconceptionTested: 'Unsupervised preprocessing cannot leak validation information because leakage exists only when held-out labels directly participate in fitting the model.',
    }),
  ]),
  'probability-distributions': Object.freeze([
    Object.freeze({
      id: 'probability-zero-inflation-count-model-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'single-poisson-process-vs-structural-zero-mixture',
      scenario: 'A daily incident count has mean about 3, yet roughly 70% of days contain zero incidents. A Poisson model with mean 3 would assign only about exp(-3), or 5%, probability to zero. Domain review suggests many locations are inactive on some days and cannot generate an incident at all.',
      prompt: 'What modeling issue should be investigated first?',
      choices: Object.freeze([
        'The counts are necessarily Gaussian because the empirical zero rate is larger than the mean',
        'A zero-inflated or hurdle-style process may be more appropriate because structural inactive days create far more zeros than a single Poisson process with the same mean predicts',
        'The Poisson model is validated because matching the mean guarantees the full count distribution, including its zero probability, is correct',
      ]),
      answerIndex: 1,
      explanation: 'For a Poisson mean of 3, P(Y=0)=e^-3 is about 0.05, far below the observed 0.70 zero fraction. The inactive-versus-active mechanism also provides a plausible second process that can generate structural zeros. This does not automatically prove one specific zero-inflated model is correct, but it is strong evidence that a single equidispersed Poisson mechanism is inadequate.',
      misconceptionTested: 'A count model that matches the sample mean is automatically distributionally adequate even when the observed zero frequency is radically different from what the model predicts.',
    }),
  ]),
  'classification-metrics': Object.freeze([
    Object.freeze({
      id: 'metrics-prevalence-shift-ppv-worked',
      level: 'calculation',
      relatedComparison: 'stable-sensitivity-specificity-vs-prevalence-dependent-precision',
      scenario: 'A deployed binary classifier keeps sensitivity at 90% and false-positive rate at 5%. In a new population the positive prevalence is only 1%. Consider 10,000 cases: about 100 are positive and 9,900 are negative.',
      prompt: 'Approximately what precision (positive predictive value) should the team expect in this new population?',
      choices: Object.freeze([
        'About 90%, because precision is identical to sensitivity when the classifier threshold is unchanged',
        'About 95%, because one minus the false-positive rate is the positive predictive value',
        'About 15%, because there are about 90 true positives and 495 false positives, giving 90/(90+495)',
      ]),
      answerIndex: 2,
      explanation: 'At 1% prevalence there are about 100 positives, of which 90 are detected, and 9,900 negatives, of which about 495 become false positives. Precision is therefore 90 / 585, about 15.4%. Sensitivity and false-positive rate can stay approximately stable while predictive values change sharply with prevalence.',
      misconceptionTested: 'Precision is an intrinsic threshold metric like sensitivity and therefore remains unchanged when class prevalence shifts but conditional error rates stay fixed.',
    }),
  ]),
  'propensity-scores': Object.freeze([
    Object.freeze({
      id: 'propensity-doubly-robust-estimator-decision',
      level: 'decision',
      relatedComparison: 'single-model-adjustment-vs-doubly-robust-combination',
      scenario: 'An observational study has a propensity model for treatment assignment and a separate outcome regression. The team considers an augmented inverse-probability weighted estimator under the usual exchangeability, consistency, and positivity assumptions. Reviewers ask what the phrase doubly robust actually guarantees about nuisance-model misspecification.',
      prompt: 'Which statement correctly describes the robustness property?',
      choices: Object.freeze([
        'The estimator is consistent only when both the propensity model and the outcome model are perfectly specified, so using two models adds no robustness',
        'The estimator is guaranteed unbiased even if both nuisance models are arbitrarily wrong and positivity fails',
        'Under the standard assumptions, consistency can be retained if either the propensity model or the outcome model is correctly specified, but not as a license for both models to be wrong or for causal assumptions to fail',
      ]),
      answerIndex: 2,
      explanation: 'Doubly robust estimators combine treatment and outcome nuisance models so that, under the underlying causal identification assumptions and regularity conditions, correct specification of either nuisance component can be sufficient for consistency. The property does not rescue simultaneous serious misspecification, unmeasured confounding, interference, or lack of overlap.',
      misconceptionTested: 'Doubly robust means the estimator remains causally valid regardless of whether both nuisance models are wrong or core identification assumptions such as positivity fail.',
    }),
  ]),
});

export function getP1NextPriorityGapScenariosForLesson(lessonId) {
  return P1_NEXT_PRIORITY_GAP_SCENARIOS_BY_LESSON[lessonId] || [];
}
