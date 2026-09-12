export const BUCKETS = Object.freeze(['train', 'validation', 'test']);

export const DEFAULT_SPLIT = Object.freeze({ validation: 0.2, test: 0.2 });

export const EVALUATION_TARGETS = Object.freeze({
  exchangeable: {
    label: 'New exchangeable rows',
    short: 'Rows are independent and drawn from the same population.',
    recommendedMode: 'stratified',
  },
  unseenEntity: {
    label: 'Unseen entities',
    short: 'Production contains customers, devices, or patients never seen during training.',
    recommendedMode: 'group',
  },
  future: {
    label: 'Future events',
    short: 'Production predicts later timestamps from earlier history.',
    recommendedMode: 'time',
  },
  futureEntity: {
    label: 'Future unseen entities',
    short: 'Both chronology and entity isolation matter.',
    recommendedMode: 'groupTime',
  },
});

export const SPLIT_MODES = Object.freeze({
  random: {
    label: 'Random',
    detail: 'Shuffles rows. Valid when rows are exchangeable; label proportions can still vary by chance.',
  },
  stratified: {
    label: 'Stratified',
    detail: 'Balances labels, but does not solve entity or time dependence.',
  },
  group: {
    label: 'Grouped entity',
    detail: 'Keeps each entity in exactly one partition so identity cannot cross the evaluation boundary.',
  },
  time: {
    label: 'Time ordered',
    detail: 'Trains on earlier rows and evaluates later rows, but repeated entities can still cross partitions.',
  },
  groupTime: {
    label: 'Grouped + time',
    detail: 'Keeps entities whole and orders them by first-seen time; the audit verifies that the resulting partitions are also strictly chronological.',
  },
});

export const PIPELINE_CONTRACTS = Object.freeze({
  aligned: {
    label: 'Aligned contract',
    trainWindowDays: 7,
    serveWindowDays: 7,
    trainMissing: 'median',
    serveMissing: 'median',
    detail: 'Training and serving compute the same feature definition and missing-value policy.',
  },
  windowSkew: {
    label: 'Window skew',
    trainWindowDays: 7,
    serveWindowDays: 30,
    trainMissing: 'median',
    serveMissing: 'median',
    detail: 'The feature keeps the same name but changes from a 7-day to a 30-day window in production.',
  },
  missingSkew: {
    label: 'Missing-value skew',
    trainWindowDays: 7,
    serveWindowDays: 7,
    trainMissing: 'median',
    serveMissing: 'zero',
    detail: 'Training imputes a learned median while serving silently replaces missing values with zero.',
  },
  doubleSkew: {
    label: 'Double skew',
    trainWindowDays: 7,
    serveWindowDays: 30,
    trainMissing: 'median',
    serveMissing: 'zero',
    detail: 'Both feature semantics and missing-value behavior drift between training and serving.',
  },
});

export const SELECTION_EXPERIMENT = Object.freeze({
  trueAccuracy: 0.75,
  candidateMin: 1,
  candidateMax: 20,
  candidateStep: 1,
  defaultCandidates: 4,
  testSizeMin: 40,
  testSizeMax: 320,
  testSizeStep: 20,
  defaultTestSize: 80,
  freshSize: 400,
  trials: 400,
  seed: 0x51f15e,
});

export const PREPROCESSING_LEAKAGE_DEMO = Object.freeze({
  trainValues: Object.freeze([10, 12, 14, 16, 18, 20]),
  holdoutBaseValues: Object.freeze([22, 24]),
  shiftMin: 0,
  shiftMax: 30,
  shiftStep: 2,
  defaultShift: 16,
});
