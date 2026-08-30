export const P1_CLASSICAL_ML_DECISION_SCENARIOS_BY_LESSON = Object.freeze({
  'linear-regression': [
    {
      id: 'lr-heteroscedastic-binned-residuals-worked',
      level: 'diagnosis',
      relatedComparison: 'constant-vs-changing-residual-variance',
      scenario: 'Residuals are grouped by fitted-value quartile. Their mean is approximately 0 in every quartile, but residual standard deviations are 2, 4, 9, and 18 as fitted values increase.',
      prompt: 'What is the strongest diagnosis from this pattern?',
      choices: ['The mean fit can be roughly centered while residual variance increases with fitted value, which is heteroscedasticity', 'The model has strong omitted-variable bias because residual means are near zero', 'The residuals are homoscedastic because every quartile contains both positive and negative errors'],
      answerIndex: 0,
      explanation: 'Heteroscedasticity concerns changing conditional error variance, not necessarily a nonzero residual mean. The rapidly increasing residual standard deviation across fitted-value bins is direct evidence that constant variance is questionable.',
      misconceptionTested: 'Residuals with mean near zero must have constant variance and therefore cannot be heteroscedastic.',
    },
  ],
  'cross-validation': [
    {
      id: 'cv-nested-selection-design-worked',
      level: 'design',
      relatedComparison: 'single-vs-nested-cross-validation',
      scenario: 'A team compares 12 model families and many hyperparameter settings. It wants an honest estimate of the full selection procedure before a final production retrain.',
      prompt: 'How should nested cross-validation separate model selection from evaluation?',
      choices: ['Use inner folds to choose the model and hyperparameters inside each outer training split, then score that chosen pipeline on the untouched outer fold', 'Choose the best model using all outer-fold scores, then report those same scores as if selection had not used them', 'Tune directly on each outer validation fold, then report performance on that same fold after selecting the best configuration'],
      answerIndex: 0,
      explanation: 'The inner loop performs model and hyperparameter selection using only the outer training data. The outer fold remains untouched by that selection and estimates how the complete selection procedure generalizes.',
      misconceptionTested: 'Cross-validation remains unbiased for model selection even when the same held-out folds influence which model is chosen and how its performance is reported.',
    },
  ],
  'k-means': [
    {
      id: 'kmeans-k-stability-worked-decision',
      level: 'decision',
      relatedComparison: 'cluster-separation-vs-resampling-stability',
      scenario: 'Across resampled fits, K=2 has silhouette 0.44 and stability 0.92, K=3 has silhouette 0.57 and stability 0.88, and K=4 has silhouette 0.58 and stability 0.40. Stability is the mean adjusted Rand index between resampled cluster assignments.',
      prompt: 'Which K is the strongest default candidate from these diagnostics?',
      choices: ['K=3 because it has near-best separation while remaining much more stable than K=4', 'K=4 because the numerically highest silhouette must always determine K', 'K=2 because stability alone is sufficient and cluster separation should be ignored'],
      answerIndex: 0,
      explanation: 'K=4 gains only 0.01 silhouette over K=3 while its stability collapses from 0.88 to 0.40. K=3 is the stronger default candidate from these diagnostics, although no internal metric proves that a true K exists.',
      misconceptionTested: 'The K with the numerically highest silhouette should always be selected even when its clustering solution is highly unstable.',
    },
  ],
  'tree-ensembles': [
    {
      id: 'tree-post-outcome-feature-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'predictive-importance-vs-prediction-time-availability',
      scenario: 'A model predicts whether an insurance claim will be denied at intake. The feature claim_closed_reason is populated only after adjudication, becomes the top permutation-importance feature, and causes offline AUC to jump sharply.',
      prompt: 'What should the team conclude first?',
      choices: ['This is likely target leakage because the feature is unavailable at the intended prediction time and is downstream of the outcome process', 'The feature is safe because permutation importance proves that it contains genuine predictive signal', 'Tree ensembles are immune to target-like leakage because they do not require feature scaling'],
      answerIndex: 0,
      explanation: 'Feature importance measures predictive contribution inside the supplied dataset; it does not prove causal validity or prediction-time availability. A post-adjudication field cannot be used for an intake-time prediction and can make offline performance look unrealistically strong.',
      misconceptionTested: 'A highly important feature is automatically legitimate for production if a tree ensemble discovers it without manual feature engineering.',
    },
  ],
  overfitting: [
    {
      id: 'overfit-model-selection-reuse-worked',
      level: 'diagnosis',
      relatedComparison: 'adaptive-validation-reuse-vs-final-test',
      scenario: 'Over three months, a team evaluates 100 feature and model variants against the same validation set and keeps the highest-scoring variant. No variant has seen the final test set.',
      prompt: 'How should the reused validation score now be interpreted?',
      choices: ['It is selection-biased and likely optimistic because repeated adaptive choices have overfit the validation set; freeze the procedure and evaluate once on the untouched test set', 'It remains an unbiased generalization estimate because the validation labels were never included in gradient updates', 'The untouched test set is now unnecessary because trying more variants makes the validation estimate increasingly reliable'],
      answerIndex: 0,
      explanation: 'Repeatedly choosing changes based on the same validation results leaks information about that validation set into the model-selection process. The validation score becomes optimistic; an untouched test set is useful only after the final procedure is frozen.',
      misconceptionTested: 'A validation set cannot be overfit unless its labels are directly included in model training or gradient updates.',
    },
  ],
});

export function getP1ClassicalMlDecisionScenariosForLesson(lessonId) {
  return P1_CLASSICAL_ML_DECISION_SCENARIOS_BY_LESSON[lessonId] || [];
}
