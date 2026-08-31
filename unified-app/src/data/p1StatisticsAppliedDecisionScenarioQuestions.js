export const P1_STATISTICS_APPLIED_DECISION_SCENARIOS_BY_LESSON = Object.freeze({
  'bayes-rule-ml': [
    {
      id: 'bayes-base-rate-worked',
      level: 'calculation',
      relatedComparison: 'sensitivity-fpr-vs-posterior-probability',
      scenario: 'A screening model is used on 10,000 cases where prevalence is 1%. Sensitivity is 90% and false-positive rate is 5%. That gives about 90 true positives and 495 false positives.',
      prompt: 'Approximately what probability of a true positive does a positive prediction have?',
      choices: ['15%', '90%', '95%'],
      answerIndex: 0,
      explanation: 'Among positive predictions there are about 90 true positives and 495 false positives. The posterior positive probability is therefore 90 / (90 + 495) ≈ 15.4%. Base rate matters even when sensitivity is high and the false-positive rate looks small.',
      misconceptionTested: 'Sensitivity can be read directly as the probability that a positive prediction is actually positive.',
    },
  ],
  'loss-functions-likelihoods': [
    {
      id: 'loss-huber-outlier-worked',
      level: 'calculation',
      relatedComparison: 'squared-error-vs-huber-outlier-penalty',
      scenario: 'For residual r = 10, squared error contributes r² = 100. Huber loss with δ = 2 uses δ(|r| - 0.5δ) when |r| > δ.',
      prompt: 'What Huber loss does this residual contribute?',
      choices: ['18', '20', '100'],
      answerIndex: 0,
      explanation: 'Because |r| = 10 exceeds δ = 2, Huber loss is 2 × (10 - 1) = 18. The loss grows linearly outside the quadratic region, so one extreme residual has less leverage than under squared error.',
      misconceptionTested: 'Robust regression losses penalize large residuals exactly like squared error once the residual is outside the central region.',
    },
  ],
  'sampling-confidence-intervals': [
    {
      id: 'ci-clustered-sampling-unit-decision',
      level: 'design',
      relatedComparison: 'row-bootstrap-vs-cluster-bootstrap',
      scenario: 'An experiment has 100 patients with 100 daily measurements each. Treatment is assigned at the patient level and measurements from the same patient are strongly correlated. A row-level bootstrap treats all 10,000 rows as independent and produces a very narrow confidence interval.',
      prompt: 'What resampling unit best preserves the experiment’s independence structure?',
      choices: ['Resample patients as clusters and keep each selected patient’s repeated measurements together', 'Resample individual daily rows because 10,000 rows always imply 10,000 independent units', 'Resample only treatment-arm labels while holding every patient and row fixed'],
      answerIndex: 0,
      explanation: 'The independent experimental units are patients, not daily rows. Cluster-level resampling preserves within-patient dependence and avoids pretending repeated measurements create independent information. The confidence-interval method should match the sampling and assignment structure.',
      misconceptionTested: 'Confidence intervals can treat every recorded row as independent even when treatment and dependence operate at a higher grouping level.',
    },
  ],
  'sequential-testing-peeking': [
    {
      id: 'sequential-three-look-boundary-worked',
      level: 'calculation',
      relatedComparison: 'repeated-ordinary-alpha-vs-planned-look-threshold',
      scenario: 'A simple pre-specified three-look design uses an equal Bonferroni allocation of total α = 0.05, so each look has threshold 0.05 / 3 ≈ 0.0167. At the second look the ordinary p-value is 0.020.',
      prompt: 'What decision follows from this stated sequential rule at the second look?',
      choices: ['Do not reject yet because 0.020 is above the pre-specified 0.0167 threshold', 'Reject because 0.020 is below 0.05 and every look can reuse the full alpha', 'Multiply the observed effect by three and reject if the adjusted effect remains positive'],
      answerIndex: 0,
      explanation: 'The design spends only about 0.0167 of significance level at each of the three looks. Since 0.020 is larger than 0.0167, the result does not cross the stated boundary. More efficient sequential boundaries exist, but the pre-specified rule must be followed rather than reverting to 0.05 after looking.',
      misconceptionTested: 'Repeated interim looks may each use the full ordinary significance threshold without changing the experiment-wide false-positive rate.',
    },
  ],
  'cuped-variance-reduction': [
    {
      id: 'cuped-variance-reduction-worked',
      level: 'calculation',
      relatedComparison: 'raw-outcome-variance-vs-cuped-residual-variance',
      scenario: 'A valid pre-treatment covariate has correlation ρ = 0.80 with the experiment outcome. Under the standard single-covariate CUPED approximation, the optimized residual variance fraction is 1 - ρ².',
      prompt: 'Approximately what variance reduction is available from this covariate?',
      choices: ['64%', '80%', '36%'],
      answerIndex: 0,
      explanation: 'ρ² = 0.80² = 0.64, so CUPED can remove about 64% of the outcome variance under the stated approximation, leaving about 36%. The benefit depends on using a genuinely pre-treatment covariate and estimating the adjustment without leaking post-treatment information.',
      misconceptionTested: 'CUPED variance reduction is equal to the raw correlation rather than the squared correlation under the standard single-covariate approximation.',
    },
  ],
  'confounding-simpsons-paradox': [
    {
      id: 'simpson-standardized-rate-worked',
      level: 'calculation',
      relatedComparison: 'aggregate-rate-vs-standardized-subgroup-rate',
      scenario: 'Low-risk conversion is A: 9/10 = 90% and B: 72/90 = 80%. High-risk conversion is A: 18/90 = 20% and B: 1/10 = 10%. Aggregated conversion is therefore A: 27% and B: 73% because the risk-group mix differs sharply.',
      prompt: 'If both treatments are standardized to a 50/50 low-risk and high-risk population, what conversion rates result?',
      choices: ['A = 55% and B = 45%', 'A = 27% and B = 73%', 'A = 90% and B = 80%'],
      answerIndex: 0,
      explanation: 'Under equal weighting, A is (90% + 20%) / 2 = 55% and B is (80% + 10%) / 2 = 45%. A is better within each subgroup, but the unadjusted aggregate reverses the comparison because A contains many more high-risk cases.',
      misconceptionTested: 'An aggregate rate is always a fair treatment comparison even when subgroup composition differs and the direction reverses within strata.',
    },
  ],
  'treatment-effects': [
    {
      id: 'cate-uncertainty-worked-decision',
      level: 'decision',
      relatedComparison: 'cate-point-estimate-vs-uncertainty',
      scenario: 'A heterogeneous-treatment analysis reports subgroup A uplift +4 percentage points with 95% CI [1, 7], and subgroup B uplift +8 points with 95% CI [-3, 19]. The next step is to decide which subgroup has clearer evidence of a positive effect.',
      prompt: 'Which subgroup has stronger evidence of a reliably positive treatment effect from these intervals?',
      choices: ['Subgroup A because its entire interval is above zero despite the smaller point estimate', 'Subgroup B because the larger point estimate automatically means stronger evidence', 'Both are equally certain because both point estimates are positive'],
      answerIndex: 0,
      explanation: 'Subgroup A has a smaller estimated uplift but its interval excludes zero, while subgroup B has much greater uncertainty and remains compatible with a negative effect. Policy decisions should consider uncertainty and multiplicity, not rank subgroups only by point estimates.',
      misconceptionTested: 'The subgroup with the largest estimated treatment effect is automatically the subgroup with the strongest evidence or best targeting case.',
    },
  ],
  'spearman-correlation': [
    {
      id: 'spearman-tied-ranks-worked',
      level: 'calculation',
      relatedComparison: 'raw-values-vs-average-tied-ranks',
      scenario: 'For X = [1, 2, 2, 4] and Y = [10, 20, 30, 40], the tied X values receive average ranks, giving X ranks [1, 2.5, 2.5, 4] and Y ranks [1, 2, 3, 4]. Spearman correlation is the Pearson correlation of these ranks.',
      prompt: 'What is the approximate Spearman correlation?',
      choices: ['0.95', '1.00', '0.00'],
      answerIndex: 0,
      explanation: 'Correlating rank vectors [1, 2.5, 2.5, 4] and [1, 2, 3, 4] gives approximately 0.949. The relationship is strongly monotonic but not perfectly rank-aligned because the tie in X maps to two different Y ranks.',
      misconceptionTested: 'Spearman correlation must be exactly 1 whenever the raw values mostly increase together, even when tied ranks prevent perfect rank agreement.',
    },
  ],
});

export function getP1StatisticsAppliedDecisionScenariosForLesson(lessonId) {
  return P1_STATISTICS_APPLIED_DECISION_SCENARIOS_BY_LESSON[lessonId] || [];
}
