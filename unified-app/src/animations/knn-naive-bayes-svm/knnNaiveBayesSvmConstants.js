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
  knn: { label: 'kNN', detail: 'Classifies by the labels of the nearest training points.' },
  naiveBayes: { label: 'Naive Bayes', detail: 'Multiplies per-feature likelihoods as if features were conditionally independent.' },
  svm: { label: 'SVM', detail: 'Fits a linear soft-margin boundary that trades margin width against violations.' },
});

export const GAUSSIAN_VARIANCE_FLOOR = 0.08;

export const NAIVE_BAYES_DEPENDENCE_DEMO = Object.freeze({
  priorBlue: 0.5,
  likelihoodGivenBlue: 0.72,
  likelihoodGivenOrange: 0.28,
  minCopies: 1,
  maxCopies: 8,
  defaultCopies: 4,
});

export const KNN_SCALE_DEMO = Object.freeze({
  k: 1,
  query: Object.freeze({ signal: 0, largeUnit: 5000 }),
  points: Object.freeze([
    Object.freeze({ id: 'A', signal: 0.1, largeUnit: 1000, label: 'blue' }),
    Object.freeze({ id: 'B', signal: -0.1, largeUnit: 9000, label: 'blue' }),
    Object.freeze({ id: 'C', signal: 5.0, largeUnit: 4900, label: 'orange' }),
    Object.freeze({ id: 'D', signal: 5.2, largeUnit: 5100, label: 'orange' }),
  ]),
});

export const SVM_FIT = Object.freeze({
  defaultC: 10,
  cOptions: Object.freeze([0.1, 1, 10, 100]),
  iterations: 20000,
  initialLearningRate: 0.08,
  learningRateDecay: 0.0005,
  marginTolerance: 0.03,
});
