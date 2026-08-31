import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(path, before, after) {
  const source = readFileSync(path, 'utf8');
  const occurrences = source.split(before).length - 1;
  if (occurrences !== 1) {
    throw new Error(`${path}: expected exactly one match, found ${occurrences}`);
  }
  writeFileSync(path, source.replace(before, after));
}

replaceOnce(
  'unified-app/src/data/animationLearning.js',
  "export const LEARNING_CARD_OVERRIDES = {\n  'matrix-multiplication': cardSet(",
  `export const LEARNING_CARD_OVERRIDES = {
  'probability-distributions': cardSet(
    'Probability distributions describe how uncertainty is allocated across possible outcomes and which values a variable can take.',
    'Start with the support, then choose a family whose shape and assumptions fit the data-generating process instead of forcing every dataset into a normal model.',
    'The math connects probability mass or density to expectation, variance, likelihoods, quantiles, and downstream uncertainty.',
    'Compare Bernoulli, Poisson, normal, and exponential examples, then change parameters and watch support, center, spread, and tails respond.',
    'Mistake to avoid: a familiar distribution name is not evidence that its assumptions fit the observed data.',
    'Check understanding by diagnosing when overdispersed counts, heavy tails, or support constraints make a simple family inappropriate.',
  ),
  'matrix-multiplication': cardSet(`,
);

replaceOnce(
  'unified-app/src/data/lessonAssessments.js',
  `const CURATED_QUIZ_OVERRIDES = Object.freeze({
  'probability-distributions': PROBABILITY_DISTRIBUTIONS_QUIZ,
});`,
  `const CURATED_QUIZ_OVERRIDES = Object.freeze({
  'probability-distributions': PROBABILITY_DISTRIBUTIONS_QUIZ,
});

const CURATED_LAB_OVERRIDES = Object.freeze({
  'probability-distributions': Object.freeze([
    Object.freeze({
      id: 'compare-distribution-assumptions',
      title: 'Compare distribution assumptions',
      prompt: 'Compare a count example with a continuous example, choose a candidate distribution for each, then identify which support, shape, and dispersion assumptions justify or reject that choice.',
      successCriteria: 'You can justify each candidate from support and diagnostics and name one observed pattern that would make its assumptions inappropriate.',
    }),
  ]),
});`,
);

replaceOnce(
  'unified-app/src/data/lessonAssessments.js',
  `function buildAssessment(lessonId, assessment) {
  const withOverride = applyQuizOverride(assessment, CURATED_QUIZ_OVERRIDES[lessonId]);
  const scenarioQuestions = [`,
  `function buildAssessment(lessonId, assessment) {
  const withQuizOverride = applyQuizOverride(assessment, CURATED_QUIZ_OVERRIDES[lessonId]);
  const withOverride = CURATED_LAB_OVERRIDES[lessonId]
    ? { ...withQuizOverride, labs: CURATED_LAB_OVERRIDES[lessonId] }
    : withQuizOverride;
  const scenarioQuestions = [`,
);

replaceOnce(
  'unified-app/src/data/probabilityDistributionsAssessment.js',
  "'Observed event counts have variance far larger than their mean. What does that suggest about a simple Poisson model?'",
  "'Observed event counts are overdispersed: their variance is far larger than their mean. What does that suggest about a simple Poisson model?'",
);

replaceOnce(
  'unified-app/src/data/matrixMultiplicationAssessment.js',
  "['The left matrix A', 'The matrix with the larger entries']",
  "['Whichever factor has the larger row count', 'The matrix with the larger entries']",
);

replaceOnce(
  'unified-app/src/data/linearRegressionAssessment.js',
  "'What is a residual?'",
  "'In linear regression, what is a residual?'",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "'What is Null(A)?'",
  "'What does the null space Null(A) contain?'",
);

replaceOnce(
  'unified-app/src/data/matrixDecompositionsAssessment.js',
  "q('md-054-scenario-rank-k', 'Application', 'You need the best rank-k approximation of a general matrix. What should you choose?', 'Truncated SVD', ['Cholesky', 'Unpivoted LU'],",
  "q('md-054-scenario-rank-k', 'Application', 'You need the best rank-k approximation of a general matrix. What should you choose?', 'Truncated SVD', ['A full-rank factorization with no truncation', 'Unpivoted LU'],",
);

replaceOnce(
  'unified-app/src/data/trainValidationTestSplitAssessment.js',
  "q('tvt-051-scenario-threshold', 'Application', 'You need to choose a fraud alert threshold. Which split should guide it?', 'A held-out development split', ['The untouched test split', 'Rows from the final public report'],",
  "q('tvt-051-scenario-threshold', 'Application', 'You need to choose a fraud alert threshold. Which split should guide it?', 'A held-out development split', ['The final evaluation holdout reserved for one-time reporting', 'Rows from the final public report'],",
);

replaceOnce(
  'unified-app/src/data/bayesRuleAssessment.js',
  "q('bayes-008-sensitivity', 'Foundation', 'What is sensitivity or true positive rate?', 'The chance of a positive signal when the class is truly present', ['The chance of a positive signal when the class is absent', 'The chance the posterior is exactly one'],",
  "q('bayes-008-sensitivity', 'Foundation', 'What is sensitivity or true positive rate?', 'The chance of a positive signal when the class is truly present', ['The fraction of all signals that are positive regardless of the true class', 'The chance the posterior is exactly one'],",
);

replaceOnce(
  'unified-app/src/data/causalGraphsDagsAssessment.js',
  "q('dag-010-collider', 'Foundation', 'In DAG adjustment, what is a collider node?', 'A variable with two arrows pointing into it from different causes', ['A common cause of treatment and outcome', 'A direct cause of treatment only'],",
  "q('dag-010-collider', 'Foundation', 'In DAG adjustment, what is a collider node?', 'A variable with two arrows pointing into it from different causes', ['A pre-treatment variable that causes only the treatment', 'A direct cause of treatment only'],",
);

replaceOnce(
  'unified-app/src/data/logisticRegressionAssessment.js',
  "q('logreg-053-scenario-low-logit', 'Application', 'A point has a large negative logit. What class-1 score should you expect?', 'Close to 0', ['Close to 1', 'Larger than 1'],",
  "q('logreg-053-scenario-low-logit', 'Application', 'A point has a large negative logit. What class-1 score should you expect?', 'Close to 0', ['Above 0.5 despite the negative logit', 'Larger than 1'],",
);

replaceOnce(
  'unified-app/src/data/rocPrCurvesAssessment.js',
  "q('rocpr-052-scenario-pr-axis', 'Application', 'A chart labels y-axis precision and x-axis recall. What curve is it?', 'The PR curve, because its axes are precision and recall', ['ROC curve', 'Residual plot'],",
  "q('rocpr-052-scenario-pr-axis', 'Application', 'A chart labels y-axis precision and x-axis recall. What curve is it?', 'The PR curve, because its axes are precision and recall', ['A calibration curve of predicted probability versus observed frequency', 'Residual plot'],",
);

replaceOnce(
  'unified-app/src/data/p1ProductionScenarioQuestions.js',
  "id: 'ts-prediction-interval-coverage',\n      level: 'application',",
  "id: 'ts-horizon14-prediction-interval-coverage',\n      level: 'application',",
);

replaceOnce(
  'unified-app/src/data/p2ScenarioQuestions.js',
  "id: 'relu-dead-unit',\n      level: 'diagnosis',\n      kind: 'visual-state',\n      visualState: { preActivation: 'negative for all batch examples', output: 0, localGradient: 0 },\n      scenario: 'Visual state: one ReLU unit receives negative pre-activations for every example, outputs zero, and its local derivative remains zero.',\n      prompt: 'What failure mode is visible?'",
  "id: 'relu-dead-unit',\n      level: 'diagnosis',\n      kind: 'visual-state',\n      visualState: { preActivation: 'negative for all batch examples', output: 0, localGradient: 0 },\n      scenario: 'Visual state: one ReLU unit receives negative pre-activations for every example, outputs zero, and its local derivative remains zero.',\n      prompt: 'Which ReLU failure mode best matches this persistent zero-gradient state?'",
);

replaceOnce(
  'unified-app/src/data/p2ScenarioQuestions.js',
  "choices: ['-3', '3', '0'],",
  "choices: ['-3', 'Positive 3', '0'],",
);

replaceOnce(
  'unified-app/src/data/p1NlpTransformerScenarioQuestions.js',
  "  'gpt-2': [",
  "  'gpt2-comprehensive': [",
);

replaceOnce(
  'unified-app/src/data/p1RemainingScenarioQuestions.js',
  "  'mixture-of-experts': [",
  "  'frontier-moe-systems': [",
);

replaceOnce(
  'unified-app/src/data/matrixMultiplicationAssessment.js',
  "['The right matrix B', 'The smaller of the two matrices']",
  "['Whichever factor has more columns', 'The smaller of the two matrices']",
);

replaceOnce(
  'unified-app/src/data/linearRegressionAssessment.js',
  "'Compute 2*4 + 3 = 11.'",
  "'Substitute x = 4 into the fitted line: 2*4 + 3 = 11, so the predicted target value is 11.'",
);

replaceOnce(
  'unified-app/src/data/fundamentalSubspacesAssessment.js',
  "'A subspace must include zero.'",
  "'Every vector subspace must contain the zero vector, so Null(A) is never empty even when its only member is zero.'",
);

replaceOnce(
  'unified-app/src/data/matrixDecompositionsAssessment.js',
  "q('md-055-scenario-nonnegative-parts', 'Application', 'You need additive parts for a nonnegative document-term matrix. What is a good fit?', 'NMF', ['QR', 'Cholesky'],",
  "q('md-055-scenario-nonnegative-parts', 'Application', 'You need additive parts for a nonnegative document-term matrix. What is a good fit?', 'NMF', ['An orthogonal-triangular solve with no nonnegativity constraint', 'A positive-definite triangular solve'],",
);

replaceOnce(
  'unified-app/src/data/logisticRegressionAssessment.js',
  "q('logreg-052-scenario-high-logit', 'Application', 'A point has a large positive logit. What class-1 score should you expect?', 'Close to 1', ['Close to 0', 'Always exactly 0.5'],",
  "q('logreg-052-scenario-high-logit', 'Application', 'A point has a large positive logit. What class-1 score should you expect?', 'Close to 1', ['Below 0.5 despite the positive logit', 'Always exactly 0.5'],",
);

console.log('Assessment baseline source fixes applied.');
