export const P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON = Object.freeze({
  calibration: [
    {
      id: 'calibration-reliability-gap-worked',
      level: 'calculation',
      relatedComparison: 'predicted-probability-vs-observed-frequency',
      scenario: 'A reliability bin contains 200 predictions whose average predicted probability is 0.80. Exactly 120 of those cases are actually positive.',
      prompt: 'What calibration gap does this bin show, and in which direction?',
      choices: ['Observed frequency is 60%, so the model is overconfident by 20 percentage points', 'Observed frequency is 60%, so the model is underconfident by 20 percentage points', 'Observed frequency is 80%, so this bin is perfectly calibrated'],
      answerIndex: 0,
      explanation: 'The observed frequency is 120 / 200 = 0.60. The model predicts 0.80 on average, so predicted probability exceeds observed frequency by 0.20, or 20 percentage points. This bin is therefore overconfident.',
      misconceptionTested: 'High predicted probabilities are trustworthy merely because the classifier separates classes well.',
    },
  ],
  'train-validation-test-split': [
    {
      id: 'split-entity-generalization-worked',
      level: 'decision',
      relatedComparison: 'row-random-vs-grouped-entity-split',
      scenario: 'A churn dataset contains many monthly rows per customer. A random row split scores 94% accuracy because the same customers appear in train and validation. A customer-grouped holdout scores 71%. Production must predict churn for customers not present in training.',
      prompt: 'Which validation result is the more relevant estimate for the stated deployment target?',
      choices: ['The 71% grouped holdout because it preserves the unseen-customer boundary required in production', 'The 94% random-row split because its larger score proves it uses more information efficiently', 'The average of 94% and 71% because combining biased and deployment-matched estimates removes leakage'],
      answerIndex: 0,
      explanation: 'The evaluation split should reproduce the independence boundary that matters at deployment. Randomly splitting repeated rows lets customer-specific information cross the boundary and can inflate performance. The grouped holdout better estimates generalization to unseen customers.',
      misconceptionTested: 'A random row split is valid whenever rows were sampled independently from a table, even when entities repeat across rows.',
    },
  ],
  'bias-variance-tradeoff': [
    {
      id: 'bias-variance-learning-curve-worked',
      level: 'diagnosis',
      relatedComparison: 'small-data-gap-vs-large-data-convergence',
      scenario: 'A model has train/validation error of 4%/18% with 1,000 examples, 7%/11% with 10,000 examples, and 8%/9% with 50,000 examples. Model family and preprocessing stay fixed.',
      prompt: 'What does the learning-curve pattern most strongly suggest?',
      choices: ['Variance was a major problem at small sample sizes because the train-validation gap shrinks substantially as more data arrives', 'Bias is the dominant problem because training error must decrease whenever sample size grows', 'The model is becoming more overfit because training error rises from 4% to 8%'],
      answerIndex: 0,
      explanation: 'The initial 14-point train-validation gap falls to 1 point as the sample grows, while validation error improves sharply. That pattern is consistent with a variance-limited regime becoming more stable with additional data; the slight rise in training error is normal as memorizing a larger sample becomes harder.',
      misconceptionTested: 'Any increase in training error as the dataset grows means generalization is worsening or bias must be the dominant issue.',
    },
  ],
  regularization: [
    {
      id: 'regularization-validation-curve-worked',
      level: 'decision',
      relatedComparison: 'under-regularized-vs-balanced-vs-over-regularized',
      scenario: 'For the same model and split, regularization strength λ=0 gives train loss 0.8 and validation loss 1.7; λ=1 gives 1.0 and 1.2; λ=100 gives 2.3 and 2.4. Lower loss is better.',
      prompt: 'Which setting is the strongest candidate from these validation results?',
      choices: ['λ=1 because it gives the lowest validation loss while reducing the large train-validation gap', 'λ=0 because the lowest training loss must always determine the regularization strength', 'λ=100 because the strongest regularization is safest whenever overfitting is possible'],
      answerIndex: 0,
      explanation: 'λ=1 has the best validation loss at 1.2 and materially narrows the generalization gap. λ=0 is under-regularized for this split, while λ=100 raises both losses substantially and is consistent with excessive constraint. Selection should still be confirmed with the project’s validation protocol.',
      misconceptionTested: 'Regularization should be chosen by minimizing training loss or by always preferring the strongest penalty.',
    },
  ],
  'knn-naive-bayes-svm': [
    {
      id: 'classifier-family-latency-tradeoff-worked',
      level: 'decision',
      relatedComparison: 'validation-quality-vs-serving-latency',
      scenario: 'Three validated text classifiers have F1 / p95 latency of: linear SVM 0.842 / 2 ms, RBF SVM 0.849 / 17 ms, and kNN 0.846 / 45 ms. The production service has a hard p95 latency SLO of 5 ms and no second-stage reranker.',
      prompt: 'Which model is the defensible production choice from the supplied evidence?',
      choices: ['The linear SVM because it satisfies the hard latency SLO with only a small measured F1 trade-off', 'The RBF SVM because the highest offline F1 should override a hard serving constraint', 'kNN because storing the training examples makes its 45 ms latency irrelevant to model selection'],
      answerIndex: 0,
      explanation: 'Only the linear SVM satisfies the stated 5 ms p95 SLO. The RBF SVM gains 0.007 F1 but violates the serving requirement by more than 3×, while kNN is slower still. Model selection must optimize the deployable system rather than a single offline metric.',
      misconceptionTested: 'The classifier with the numerically best offline metric is automatically the best production model regardless of serving constraints.',
    },
  ],
});

export function getP1ClassicalMlAppliedDecisionScenariosForLesson(lessonId) {
  return P1_CLASSICAL_ML_APPLIED_DECISION_SCENARIOS_BY_LESSON[lessonId] || [];
}
