export const POINTS = Object.freeze([
  { id: 'A', x: -2.4, y: 1.1, label: 'blue' },
  { id: 'B', x: -1.7, y: 0.4, label: 'blue' },
  { id: 'C', x: -1.1, y: 1.5, label: 'blue' },
  { id: 'D', x: -0.6, y: 0.2, label: 'blue' },
  { id: 'E', x: 0.7, y: -0.8, label: 'orange' },
  { id: 'F', x: 1.2, y: -1.5, label: 'orange' },
  { id: 'G', x: 1.8, y: -0.3, label: 'orange' },
  { id: 'H', x: 2.4, y: -1.1, label: 'orange' },
]);

export const MODELS = Object.freeze({
  knn: {
    label: 'kNN',
    detail: 'Classifies by the labels of the nearest training points.',
  },
  naiveBayes: {
    label: 'Naive Bayes',
    detail: 'Multiplies per-feature likelihoods as if features were conditionally independent.',
  },
  svm: {
    label: 'SVM',
    detail: 'Chooses the side of a maximum-margin decision boundary.',
  },
});

export const SVM_PARAMS = Object.freeze({
  weight: Object.freeze([1.05, -0.9]),
  bias: -0.05,
});

export const NAIVE_BAYES_DEPENDENCE_DEMO = Object.freeze({
  priorBlue: 0.5,
  likelihoodGivenBlue: 0.72,
  likelihoodGivenOrange: 0.28,
  minCopies: 1,
  maxCopies: 8,
  defaultCopies: 4,
});
