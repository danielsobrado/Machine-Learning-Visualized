export const OBRIEN_FLEMING_FIVE_LOOK_C = 2.04;

const PROPENSITY_ROWS = Object.freeze([
  Object.freeze({ id: 'T1', treatment: 1, outcome: 1, propensity: 0.25, mu0: 0.35, mu1: 0.62 }),
  Object.freeze({ id: 'T2', treatment: 1, outcome: 0, propensity: 0.65, mu0: 0.25, mu1: 0.55 }),
  Object.freeze({ id: 'T3', treatment: 1, outcome: 1, propensity: 0.55, mu0: 0.40, mu1: 0.68 }),
  Object.freeze({ id: 'T4', treatment: 1, outcome: 1, propensity: 0.90, mu0: 0.50, mu1: 0.72 }),
  Object.freeze({ id: 'C1', treatment: 0, outcome: 0, propensity: 0.20, mu0: 0.20, mu1: 0.48 }),
  Object.freeze({ id: 'C2', treatment: 0, outcome: 1, propensity: 0.35, mu0: 0.45, mu1: 0.70 }),
  Object.freeze({ id: 'C3', treatment: 0, outcome: 0, propensity: 0.45, mu0: 0.30, mu1: 0.58 }),
  Object.freeze({ id: 'C4', treatment: 0, outcome: 0, propensity: 0.10, mu0: 0.15, mu1: 0.42 }),
]);

export const CAUSAL_ADVANCED_DEFAULTS = Object.freeze({
  'causal-graphs-dags': Object.freeze({
    pTreatment: 0.40,
    pMediatorGivenControl: 0.25,
    pMediatorGivenTreatment: 0.75,
    outcome: Object.freeze({
      m0x0: 0.10,
      m0x1: 0.25,
      m1x0: 0.55,
      m1x1: 0.70,
    }),
  }),
  'treatment-effects': Object.freeze({
    subgroupEffect: 0.18,
    subgroupStandardError: 0.08,
    populationMean: 0.06,
    betweenGroupSd: 0.05,
  }),
  'propensity-scores': Object.freeze({
    stressedPropensity: 0.25,
    rows: PROPENSITY_ROWS,
  }),
  'confounding-simpsons-paradox': Object.freeze({
    lowShareTreated: 0.75,
    lowShareTarget: 0.50,
    lowControl: 0.20,
    lowTreated: 0.28,
    highControl: 0.60,
    highTreated: 0.80,
  }),
  'cuped-variance-reduction': Object.freeze({
    firstR2: 0.25,
    secondPartialR2: 0.20,
    thirdPartialR2: 0.10,
  }),
  'sequential-testing-peeking': Object.freeze({
    look: 2,
    looks: 5,
    observedZ: 3.10,
    boundaryConstant: OBRIEN_FLEMING_FIVE_LOOK_C,
  }),
});
