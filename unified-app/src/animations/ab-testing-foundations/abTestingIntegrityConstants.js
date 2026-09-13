export const SRM_DEFAULTS = Object.freeze({
  total: 20000,
  plannedTreatmentShare: 0.5,
  observedTreatment: 10000,
});

export const SRM_LIMITS = Object.freeze({
  total: Object.freeze({ min: 2000, max: 50000, step: 1000 }),
  treatmentShare: Object.freeze({ min: 0.1, max: 0.9, step: 0.1 }),
});

export const SRM_FLAG_P_VALUE = 0.001;
