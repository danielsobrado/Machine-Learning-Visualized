export const MLE_FAILURE_DEMO = Object.freeze({
  boundary: Object.freeze({ successes: 20, failures: 0 }),
  underflow: Object.freeze({ successes: 1200, failures: 800, candidateA: 0.6, candidateB: 0.58 }),
});

export const MLE_FAILURE_LIMITS = Object.freeze({
  failures: Object.freeze({ min: 0, max: 8, step: 1 }),
  observationsScale: Object.freeze({ min: 1, max: 5, step: 1 }),
});
