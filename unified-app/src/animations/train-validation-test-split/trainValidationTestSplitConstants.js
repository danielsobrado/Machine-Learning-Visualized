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
    detail: 'Shuffles rows. Valid only when rows are exchangeable and repeated entities do not leak identity.',
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
    detail: 'Assigns whole entities by their first-seen time, preserving both entity isolation and chronology.',
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

export const SELECTION_REPLAY = Object.freeze([
  { id: 1, testDelta: 0.002, freshDelta: -0.004 },
  { id: 2, testDelta: -0.006, freshDelta: 0.003 },
  { id: 3, testDelta: 0.011, freshDelta: -0.002 },
  { id: 4, testDelta: 0.004, freshDelta: 0.005 },
  { id: 5, testDelta: 0.018, freshDelta: -0.006 },
  { id: 6, testDelta: 0.007, freshDelta: 0.001 },
  { id: 7, testDelta: 0.014, freshDelta: 0.002 },
  { id: 8, testDelta: 0.025, freshDelta: -0.008 },
  { id: 9, testDelta: 0.009, freshDelta: 0.004 },
  { id: 10, testDelta: 0.017, freshDelta: -0.001 },
  { id: 11, testDelta: 0.031, freshDelta: -0.009 },
  { id: 12, testDelta: 0.012, freshDelta: 0.003 },
  { id: 13, testDelta: 0.021, freshDelta: -0.005 },
  { id: 14, testDelta: 0.036, freshDelta: -0.010 },
  { id: 15, testDelta: 0.016, freshDelta: 0.001 },
  { id: 16, testDelta: 0.028, freshDelta: -0.004 },
  { id: 17, testDelta: 0.041, freshDelta: -0.012 },
  { id: 18, testDelta: 0.019, freshDelta: 0.002 },
  { id: 19, testDelta: 0.033, freshDelta: -0.007 },
  { id: 20, testDelta: 0.046, freshDelta: -0.013 },
]);

export const REPLAY_BASE_QUALITY = 0.75;
