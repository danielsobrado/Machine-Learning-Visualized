function question(value) {
  return Object.freeze({
    ...value,
    choices: Object.freeze([...value.choices]),
  });
}

function lesson(questions) {
  return Object.freeze(questions.map(question));
}

export const P1_STATISTICS_CAUSAL_REVIEW_SCENARIOS_BY_LESSON = Object.freeze({
  'ab-testing-foundations': lesson([
    {
      id: 'review-ab-interference-randomization-unit',
      level: 'diagnosis',
      relatedComparison: 'individual-randomization-vs-cluster-randomization-under-interference',
      scenario: 'A messaging experiment randomizes individual users to treatment and control, but users frequently communicate with household members who may be assigned to the opposite arm. The treatment changes how often a user sends invitations, so one person\'s assignment can directly change another person\'s outcome even when that second person is in control.',
      prompt: 'What experimental-design problem should the team diagnose before interpreting the ordinary difference in means as an individual treatment effect?',
      choices: [
        'Interference violates the usual no-cross-unit-effect assumption, so a cluster or network-aware design may be needed when one unit\'s treatment changes another unit\'s outcome',
        'The experiment is automatically valid because randomization removes every possible dependency between users',
        'The only problem is unequal sample size; balancing treatment and control counts would restore the standard assumptions',
      ],
      answerIndex: 0,
      explanation: 'Randomization balances baseline confounders, but it does not make one unit\'s outcome independent of other units\' treatment assignments. When treatment changes messages or invitations sent to connected users, the standard stable-unit-treatment assumption can fail. The estimand and design may need household, cluster, or network-aware randomization and analysis rather than an ordinary user-level difference in means.',
      misconceptionTested: 'Randomization alone guarantees valid individual treatment effects even when treated users can directly alter outcomes for control users through spillovers.',
    },
  ]),
  'bayes-rule-ml': lesson([
    {
      id: 'review-bayes-prevalence-ppv-shift',
      kind: 'visual-state',
      visualState: Object.freeze({ prevalencePercent: 1, sensitivityPercent: 90, specificityPercent: 95, posteriorPositivePercent: 15.4 }),
      level: 'calculation',
      relatedComparison: 'stable-sensitivity-specificity-vs-prior-dependent-posterior',
      scenario: 'A detector keeps 90% sensitivity and 95% specificity when deployed to a new population where only 1% of cases are actually positive. Consider 10,000 cases so the expected counts are easy to reason about: about 100 positives and 9,900 negatives.',
      prompt: 'Approximately what posterior probability should be assigned to a case being truly positive after the detector fires?',
      choices: [
        'About 15%, because roughly 90 true positives compete with about 495 false positives',
        'About 90%, because sensitivity is the probability that a positive alert is correct',
        'About 95%, because specificity directly equals the posterior probability of disease after a positive alert',
      ],
      answerIndex: 0,
      explanation: 'Among 100 true positives, sensitivity yields about 90 positive alerts. Among 9,900 negatives, a 5% false-positive rate yields about 495 false alerts. Bayes reasoning therefore gives 90/(90+495), about 15.4%. The likelihood terms can remain stable while the posterior changes sharply because the class prior changed.',
      misconceptionTested: 'Sensitivity or specificity can be read directly as the probability that a positive prediction is correct without incorporating prevalence.',
    },
  ]),
  'bias-variance-tradeoff': lesson([
    {
      id: 'review-bias-variance-learning-curves',
      level: 'diagnosis',
      relatedComparison: 'high-bias-learning-curves-vs-high-variance-learning-curves',
      scenario: 'A model reaches 22% training error and 24% validation error. Adding more training examples barely changes either curve, while a substantially more expressive model reduces both errors. The team proposes stronger regularization because validation error is not low enough.',
      prompt: 'What diagnosis best matches the learning curves, and what direction should the next intervention take?',
      choices: [
        'The small train-validation gap with both errors high indicates dominant bias, so stronger capacity or better features are more plausible than adding regularization',
        'The model has dominant variance because every non-zero validation error is overfitting, so regularization should be increased',
        'The curves prove irreducible noise is 24%, so changing model class cannot help',
      ],
      answerIndex: 0,
      explanation: 'High variance usually appears as a substantially better training result than validation result. Here both are poor and close together, and more data does not close a meaningful gap. The fact that a more expressive model improves both curves further supports an underfitting or high-bias diagnosis. Additional regularization would normally push in the wrong direction.',
      misconceptionTested: 'Any disappointing validation score should be treated as overfitting even when training performance is similarly poor and there is little generalization gap.',
    },
  ]),
  'causal-graphs-dags': lesson([
    {
      id: 'review-dag-collider-conditioning',
      level: 'diagnosis',
      relatedComparison: 'open-fork-confounding-vs-closed-collider-path',
      scenario: 'In a DAG, skill influences hiring and networking also influences hiring: Skill → Hired ← Network. Skill and Network are otherwise independent in the source population. An analyst restricts the data to hired candidates and then observes a negative association between Skill and Network.',
      prompt: 'Why can conditioning on Hired create an association that was absent in the source population?',
      choices: [
        'Hired is a collider, and conditioning on a collider opens the path between its causes, creating selection-induced association',
        'Hired is a confounder, so conditioning on it closes a backdoor path and removes bias',
        'Any conditioning operation makes parent variables independent by construction',
      ],
      answerIndex: 0,
      explanation: 'A collider is a node with arrows pointing into it from two causes. Without conditioning, the path Skill → Hired ← Network is blocked. Restricting or adjusting on Hired opens that path, so among selected hired candidates one cause can become informative about the other. This is a classic form of collider or selection bias rather than confounding control.',
      misconceptionTested: 'Conditioning on any common variable between two causes is automatically bias-reducing, including variables that are colliders.',
    },
  ]),
  'conditional-probability': lesson([
    {
      id: 'review-conditional-selection-population',
      level: 'diagnosis',
      relatedComparison: 'population-conditional-probability-vs-selection-conditioned-probability',
      scenario: 'Two independent conditions each increase the chance that a patient is admitted to a specialist clinic. In the general population the conditions are nearly independent, but inside the clinic they appear negatively associated because patients with either condition are more likely to enter the sample.',
      prompt: 'What probability mistake would be made by treating the clinic association as if it described the general population?',
      choices: [
        'The analysis conditions on a selected event whose probability depends on both conditions, so P(A|B, selected) need not match P(A|B) in the source population',
        'Conditional probability is invariant to how the sample was selected, so the clinic association must generalize',
        'Independence in the population implies independence after conditioning on every possible event',
      ],
      answerIndex: 0,
      explanation: 'Conditioning changes the reference population. If selection depends on both variables, the selected sample can induce associations even when the variables are independent before selection. The correct conditional probability must include the selection event explicitly; dropping that condition silently changes the target population and can produce Berkson-style bias.',
      misconceptionTested: 'A conditional probability estimated in a selected subpopulation can be interpreted as the same conditional probability in the original population without checking the selection mechanism.',
    },
  ]),
  'cross-validation': lesson([
    {
      id: 'review-cv-nested-model-selection',
      level: 'design',
      relatedComparison: 'single-cv-model-selection-vs-nested-cv-performance-estimation',
      scenario: 'A team evaluates 40 hyperparameter configurations using the same five-fold CV table, selects the configuration with the highest mean score, and reports that maximum CV score as the expected performance of the selected model. No untouched outer evaluation is used.',
      prompt: 'How should the evaluation be redesigned if the goal is an approximately unbiased estimate of the model-selection procedure?',
      choices: [
        'Use nested CV: tune hyperparameters inside each outer training split and evaluate the selected inner-CV model on that outer held-out split',
        'Keep the same CV and average only the best two hyperparameter scores, which removes selection bias',
        'Increase the number of hyperparameter configurations because a larger search makes the maximum CV score more reliable',
      ],
      answerIndex: 0,
      explanation: 'Choosing the maximum from many noisy validation estimates optimizes partly for validation noise. Nested CV separates model selection from model assessment: the inner loop chooses hyperparameters using only outer-training data, while the outer fold estimates how that entire selection procedure generalizes to data it did not use. Reusing the same folds for both tasks produces optimistic estimates.',
      misconceptionTested: 'Cross-validation remains an unbiased final performance estimate even after the same fold scores are repeatedly searched to choose the best hyperparameters.',
    },
  ]),
  'cuped-variance-reduction': lesson([
    {
      id: 'review-cuped-post-treatment-covariate',
      level: 'diagnosis',
      relatedComparison: 'pre-treatment-covariate-adjustment-vs-post-treatment-bias',
      scenario: 'An experiment team wants to reduce variance with CUPED. Instead of a pre-experiment metric, they choose a highly predictive feature measured two days after treatment starts. Treatment itself changes that feature for many users, and the feature also predicts the final outcome.',
      prompt: 'Why is this covariate unsuitable for ordinary CUPED adjustment?',
      choices: [
        'It is post-treatment and can lie on the treatment-to-outcome path, so adjusting for it can remove part of the treatment effect or introduce bias rather than merely reduce baseline variance',
        'CUPED requires weakly predictive covariates, so a highly predictive feature is invalid regardless of timing',
        'Any variable measured after randomization is safe because random assignment guarantees it cannot be affected by treatment',
      ],
      answerIndex: 0,
      explanation: 'The usual CUPED logic uses pre-treatment information that is correlated with the outcome but unaffected by treatment. A post-treatment variable can be a mediator or otherwise treatment-induced. Regressing it out changes the estimand and may block part of the causal effect or introduce additional bias. Predictiveness is useful only when the timing and causal role are appropriate.',
      misconceptionTested: 'For variance reduction, predictive strength matters but the causal timing of the covariate does not.',
    },
  ]),
  entropy: lesson([
    {
      id: 'review-entropy-cross-entropy-kl',
      level: 'mechanism',
      relatedComparison: 'cross-entropy-minimization-vs-kl-divergence-minimization',
      scenario: 'For a supervised task, the target distribution p is fixed while a model changes its predicted distribution q. The team writes the identity H(p,q) = H(p) + KL(p||q) and asks what this implies for training when H(p) does not depend on model parameters.',
      prompt: 'Why does minimizing cross-entropy with respect to q also minimize KL(p||q) in this setting?',
      choices: [
        'Because H(p) is constant with respect to q, so the two objectives differ only by an additive constant',
        'Because entropy H(p) becomes zero for every real dataset, making cross-entropy identical to KL by definition',
        'Because KL divergence is symmetric, so changing q automatically changes H(p) by the same amount',
      ],
      answerIndex: 0,
      explanation: 'The decomposition separates uncertainty intrinsic to the fixed target distribution from mismatch between p and q. During optimization over q, H(p) contributes no gradient because it is constant. Therefore any q that minimizes H(p,q) also minimizes KL(p||q). This does not make KL symmetric and does not require H(p) to be zero.',
      misconceptionTested: 'Cross-entropy and KL have the same optimum only because target entropy is always zero or because KL divergence is symmetric.',
    },
  ]),
  'expected-value-variance': lesson([
    {
      id: 'review-expectation-variance-dependence',
      level: 'calculation',
      relatedComparison: 'linearity-of-expectation-vs-covariance-sensitive-variance',
      scenario: 'Two random variables X and Y each have variance 4 and covariance 3. Their means are arbitrary. A student claims independence is required both for E[X+Y]=E[X]+E[Y] and for Var(X+Y)=Var(X)+Var(Y).',
      prompt: 'Which calculation correctly separates the two rules?',
      choices: [
        'Expectation remains additive without independence, while Var(X+Y)=4+4+2×3=14 because covariance contributes',
        'Both formulas require independence, so neither quantity can be computed from the supplied information',
        'Expectation needs covariance correction, but variance is always 4+4=8',
      ],
      answerIndex: 0,
      explanation: 'Linearity of expectation does not require independence: E[X+Y] is always E[X]+E[Y] when expectations exist. Variance is different because cross terms remain after centering: Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y). Here that is 4+4+6=14. Independence would imply zero covariance under ordinary finite-moment conditions, but it is not needed for expectation additivity.',
      misconceptionTested: 'Independence is a prerequisite for linearity of expectation, while variance of a sum never needs a covariance term.',
    },
  ]),
  'hypothesis-testing-intuition': lesson([
    {
      id: 'review-hypothesis-multiple-testing-familywise',
      level: 'calculation',
      relatedComparison: 'single-test-alpha-vs-familywise-false-positive-risk',
      scenario: 'A dashboard runs 50 independent null-hypothesis tests at alpha=0.05 and highlights any result with p<0.05. Assume for this calculation that every null hypothesis is actually true and the tests are independent.',
      prompt: 'Approximately what is the probability of seeing at least one false positive among the 50 tests?',
      choices: [
        'About 92%, because 1 - 0.95^50 is approximately 0.923',
        'Exactly 5%, because alpha controls the false-positive probability for the entire family automatically',
        'About 2.5%, because running more tests divides the original alpha without any explicit correction',
      ],
      answerIndex: 0,
      explanation: 'For one true null the probability of no false positive is 0.95. Under the stated independence assumption, the probability all 50 avoid false positives is 0.95^50, roughly 0.077. The complement is about 0.923. This illustrates why multiplicity procedures or pre-specified analysis plans are needed when many hypotheses are searched.',
      misconceptionTested: 'A per-test alpha of 0.05 guarantees only a 5% chance of any false positive across an arbitrarily large family of tests.',
    },
  ]),
  'maximum-likelihood-estimation': lesson([
    {
      id: 'review-mle-likelihood-not-parameter-probability',
      level: 'mechanism',
      relatedComparison: 'likelihood-over-parameters-vs-probability-distribution-over-parameters',
      scenario: 'Observed data x are fixed after collection. An analyst writes L(theta)=p(x|theta) and then says L(theta)=0.8 means there is an 80% probability that theta is the true parameter value. No prior distribution over theta has been introduced.',
      prompt: 'What is wrong with that interpretation of the likelihood function?',
      choices: [
        'Likelihood compares how different parameter values explain the fixed observed data; it is not, by itself, a normalized probability distribution over theta',
        'Likelihood cannot depend on theta once data are observed, so maximum likelihood has no optimization step',
        'Likelihood is always a posterior distribution over theta even without a prior or normalization constant',
      ],
      answerIndex: 0,
      explanation: 'After observing x, the numerical expression p(x|theta) can be viewed as a function of theta and used to compare parameter values. But probability statements about theta require a different inferential framework, such as a Bayesian posterior with a prior and normalization. A likelihood need not integrate or sum to one over parameter space.',
      misconceptionTested: 'The numeric value of a likelihood can be read directly as the probability that a parameter value is true.',
    },
  ]),
  'power-sample-size': lesson([
    {
      id: 'review-power-mde-sample-scaling',
      level: 'calculation',
      relatedComparison: 'minimum-detectable-effect-vs-required-sample-size',
      scenario: 'Under a standard two-sample approximation, required sample size is proportional to variance divided by the square of the minimum detectable effect, while alpha and target power remain fixed. A team wants to detect an effect half as large without changing outcome variance.',
      prompt: 'Approximately how should the required sample size change under this square-law approximation?',
      choices: [
        'It should increase by about 4× because halving the detectable effect multiplies 1/effect² by four',
        'It should increase by about 2× because sample size scales linearly with the detectable effect',
        'It should decrease by about 4× because smaller effects require fewer observations to avoid noise',
      ],
      answerIndex: 0,
      explanation: 'Signal-to-noise improves only with the square root of sample size in the common asymptotic setting. If the target effect is divided by two, maintaining the same standardized detection threshold requires roughly four times as many observations. Exact formulas depend on design and metric, but the inverse-square relationship is the key planning intuition.',
      misconceptionTested: 'Minimum detectable effect and required sample size have an approximately linear relationship under otherwise fixed test-design assumptions.',
    },
  ]),
  'sampling-confidence-intervals': lesson([
    {
      id: 'review-ci-frequentist-interpretation',
      level: 'mechanism',
      relatedComparison: 'procedure-coverage-vs-posterior-probability-statement',
      scenario: 'A frequentist 95% confidence interval for a population mean has already been computed from one realized sample. A report says, "There is a 95% probability that the fixed true mean lies inside this particular interval." No Bayesian prior or posterior analysis was performed.',
      prompt: 'What interpretation should replace that statement in a standard frequentist analysis?',
      choices: [
        'The interval procedure is constructed so that, over repeated samples under its assumptions, about 95% of such intervals would contain the fixed true parameter',
        'The parameter is random after sampling, so this realized interval contains it with exactly 95% posterior probability',
        'A 95% confidence interval means 95% of observed data points must fall inside the interval',
      ],
      answerIndex: 0,
      explanation: 'In the usual frequentist formulation the parameter is fixed and the interval is random before data are observed. Coverage is a property of the repeated-sampling procedure. Once a specific interval is computed, it either contains the parameter or it does not. A probability statement about the parameter itself requires additional probabilistic structure such as a Bayesian posterior.',
      misconceptionTested: 'Frequentist confidence level is automatically a posterior probability that the fixed parameter lies inside the one interval already observed.',
    },
  ]),
  'spearman-correlation': lesson([
    {
      id: 'review-spearman-monotonic-nonlinear',
      level: 'diagnosis',
      relatedComparison: 'rank-monotonic-association-vs-linear-association',
      scenario: 'Data follow Y=X^3 with X spread symmetrically across a broad range and almost no noise. The relationship is perfectly monotonic increasing, but it is strongly curved rather than linear. An analyst expects Pearson and Spearman correlations to encode exactly the same property.',
      prompt: 'Which conclusion best distinguishes the two correlation measures?',
      choices: [
        'Spearman can be near 1 because ranks preserve the monotonic ordering even when Pearson is lower because it measures linear association',
        'Spearman must be near 0 whenever the relationship is nonlinear, even if ordering is perfectly monotonic',
        'Pearson is always 1 for every deterministic relationship regardless of shape',
      ],
      answerIndex: 0,
      explanation: 'Spearman correlation is Pearson correlation applied to ranks, so a nearly perfect monotonic ordering can yield a rank correlation near one even when the numeric relationship is curved. Pearson correlation depends on linear alignment of raw values. Deterministic does not imply linearly correlated unless the functional relationship is affine in the relevant distribution.',
      misconceptionTested: 'A nonlinear relationship necessarily has weak Spearman correlation, or any deterministic relationship necessarily has perfect Pearson correlation.',
    },
  ]),
  'treatment-effects': lesson([
    {
      id: 'review-treatment-ate-vs-att',
      level: 'calculation',
      relatedComparison: 'population-average-effect-vs-treated-population-effect',
      scenario: 'A population contains 80 untreated-eligible users whose treatment effect would be +2 points and 20 users who actually receive treatment and whose treatment effect is +10 points. Assume these individual effects are known for illustration.',
      prompt: 'What are the ATE and ATT, and why can they differ even without estimation error?',
      choices: [
        'ATE is 3.6 points while ATT is 10 points because the treated subgroup has systematically larger effects than the overall population',
        'ATE and ATT must both equal 10 points because treatment effects are defined only for treated units',
        'ATE is 2 points while ATT is 3.6 points because untreated users determine the treated estimand',
      ],
      answerIndex: 0,
      explanation: 'The ATE averages effects across all 100 units: (80×2 + 20×10)/100 = 3.6 points. The ATT averages effects only over the 20 treated units, giving 10 points. The estimands target different populations, so heterogeneous treatment effects and non-random treatment composition can make them genuinely different even if both are identified perfectly.',
      misconceptionTested: 'ATE and ATT are merely two names for the same causal quantity and can differ only because of sampling or estimation error.',
    },
  ]),
  'uncertainty-estimation': lesson([
    {
      id: 'review-uncertainty-aleatoric-epistemic-data',
      level: 'diagnosis',
      relatedComparison: 'irreducible-outcome-noise-vs-model-knowledge-uncertainty',
      scenario: 'A vision model is uncertain for two different reasons. Some images are intrinsically ambiguous because labels are noisy even for experts. Other images come from a rare camera type that is almost absent from training but becomes well represented after collecting much more labeled data.',
      prompt: 'Which uncertainty should additional representative training data reduce most directly?',
      choices: [
        'Epistemic uncertainty from limited model knowledge should shrink, while aleatoric uncertainty from irreducible label or outcome noise may remain',
        'Aleatoric uncertainty should disappear with more data, while epistemic uncertainty is irreducible by definition',
        'Both uncertainties are identical because every predictive probability mixes them into one number',
      ],
      answerIndex: 0,
      explanation: 'Epistemic uncertainty reflects lack of knowledge about the model or function in regions with limited evidence, so representative data can reduce it. Aleatoric uncertainty reflects randomness or ambiguity in the data-generating process itself and generally remains even with abundant data. Practical estimators can mix the two, but the conceptual distinction matters for deciding whether more data can help.',
      misconceptionTested: 'All predictive uncertainty is irreducible, or the uncertainty caused by sparse training coverage is the same as intrinsic label noise.',
    },
  ]),
});
