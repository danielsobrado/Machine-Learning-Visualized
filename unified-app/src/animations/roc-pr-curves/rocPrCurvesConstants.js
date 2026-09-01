export const DEFAULT_THRESHOLD = 0.8;
export const DEFAULT_PREVALENCE = 0.02;
export const DEPLOYMENT_POPULATION = 10000;
export const DEFAULT_REVIEW_CAPACITY = 300;

export const THRESHOLDS = Object.freeze([
  1.01,
  ...Array.from({ length: 21 }, (_, index) => Number((1 - index / 20).toFixed(2))),
]);

export const REFERENCE_BANDS = Object.freeze([
  { score: 0.95, positives: 38, negatives: 1 },
  { score: 0.85, positives: 32, negatives: 2 },
  { score: 0.75, positives: 26, negatives: 4 },
  { score: 0.65, positives: 20, negatives: 7 },
  { score: 0.55, positives: 15, negatives: 12 },
  { score: 0.45, positives: 10, negatives: 18 },
  { score: 0.35, positives: 6, negatives: 28 },
  { score: 0.25, positives: 3, negatives: 40 },
  { score: 0.15, positives: 1, negatives: 55 },
  { score: 0.05, positives: 0, negatives: 70 },
]);

export const MAJORITY_SLICE_BANDS = Object.freeze(
  REFERENCE_BANDS.map((band) => ({
    score: band.score,
    positives: band.positives * 5,
    negatives: band.negatives * 5,
  })),
);

export const MINORITY_SLICE_BANDS = Object.freeze([
  { score: 0.95, positives: 2, negatives: 10 },
  { score: 0.85, positives: 2, negatives: 15 },
  { score: 0.75, positives: 2, negatives: 20 },
  { score: 0.65, positives: 3, negatives: 25 },
  { score: 0.55, positives: 3, negatives: 25 },
  { score: 0.45, positives: 3, negatives: 25 },
  { score: 0.35, positives: 3, negatives: 25 },
  { score: 0.25, positives: 3, negatives: 25 },
  { score: 0.15, positives: 2, negatives: 20 },
  { score: 0.05, positives: 2, negatives: 15 },
]);
