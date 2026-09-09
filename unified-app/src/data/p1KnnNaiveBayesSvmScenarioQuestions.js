export const P1_KNN_NAIVE_BAYES_SVM_SCENARIOS_BY_LESSON = Object.freeze({
  'knn-naive-bayes-svm': [
    {
      id: 'classifier-naive-bayes-correlated-evidence-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'conditionally-independent-evidence-vs-redundant-features',
      scenario: 'A spam Naive Bayes model uses two binary features: contains_free and contains_free_offer. In the data, contains_free_offer almost always implies contains_free, so the two features carry nearly the same evidence. The model multiplies both likelihood contributions and produces extremely confident posterior scores.',
      prompt: 'What is the strongest diagnosis?',
      choices: [
        'The conditional-independence approximation is double-counting redundant evidence, so probability magnitudes may become overconfident even if ranking remains useful',
        'The model is guaranteed well calibrated because multiplying more feature likelihoods always adds independent evidence',
        'The problem is that Naive Bayes requires every feature to have identical marginal frequency',
      ],
      answerIndex: 0,
      explanation: 'Naive Bayes treats feature evidence as conditionally independent within each class. When two features encode almost the same signal, multiplying both terms can count that signal twice and exaggerate posterior odds. The classifier may still rank well, but probability calibration and feature design need review.',
      misconceptionTested: 'Correlated or redundant Naive Bayes features merely add harmless duplicate information and cannot distort posterior confidence.',
    },
    {
      id: 'classifier-svm-c-gamma-grid-diagnosis',
      level: 'decision',
      relatedComparison: 'rbf-svm-locality-vs-violation-penalty',
      scenario: 'An RBF SVM grid gives: C=1, gamma=0.1 -> train 91%, validation 90%; C=1000, gamma=10 -> train 100%, validation 73%; C=0.001, gamma=0.0001 -> train 62%, validation 61%. The same preprocessing and split are used.',
      prompt: 'Which interpretation best matches these results?',
      choices: [
        'The moderate setting is the strongest candidate; very large C with high gamma is overfitting, while tiny C with tiny gamma is underfitting',
        'The 100% training-accuracy setting is best because SVM hyperparameters should minimize training violations regardless of validation',
        'The tiny-C tiny-gamma setting is safest because the widest, smoothest possible margin always generalizes best',
      ],
      answerIndex: 0,
      explanation: 'Large C heavily punishes violations and high gamma makes RBF influence extremely local, a combination that can fit training points too specifically. Tiny C and gamma can make the classifier too smooth and permissive. Validation identifies the useful bias-variance region rather than either extreme.',
      misconceptionTested: 'SVM C and gamma should be pushed to an extreme because either perfect training separation or maximum smoothness is always optimal.',
    },
  ],
});
