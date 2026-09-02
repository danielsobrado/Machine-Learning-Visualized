export const DEFAULT_THRESHOLD = 0.5;
export const THRESHOLD_GRID = Object.freeze(
  Array.from({ length: 13 }, (_, index) => Number((0.2 + index * 0.05).toFixed(2))),
);
export const DEFAULT_FALSE_POSITIVE_COST = 2;
export const DEFAULT_FALSE_NEGATIVE_COST = 10;
export const PROJECTION_POPULATION = 10000;

export const CLASSIFICATION_ROWS = Object.freeze([
  { id: 'C01', group: 'Core', actual: 1, score: 0.95 },
  { id: 'C02', group: 'Core', actual: 1, score: 0.88 },
  { id: 'C03', group: 'Core', actual: 1, score: 0.82 },
  { id: 'C04', group: 'Core', actual: 1, score: 0.76 },
  { id: 'C05', group: 'Core', actual: 1, score: 0.68 },
  { id: 'C06', group: 'Core', actual: 1, score: 0.61 },
  { id: 'C07', group: 'Core', actual: 0, score: 0.72 },
  { id: 'C08', group: 'Core', actual: 0, score: 0.48 },
  { id: 'C09', group: 'Core', actual: 0, score: 0.42 },
  { id: 'C10', group: 'Core', actual: 0, score: 0.35 },
  { id: 'C11', group: 'Core', actual: 0, score: 0.30 },
  { id: 'C12', group: 'Core', actual: 0, score: 0.25 },
  { id: 'C13', group: 'Core', actual: 0, score: 0.18 },
  { id: 'C14', group: 'Core', actual: 0, score: 0.12 },
  { id: 'C15', group: 'Core', actual: 0, score: 0.08 },
  { id: 'C16', group: 'Core', actual: 0, score: 0.05 },
  { id: 'E01', group: 'Edge', actual: 1, score: 0.85 },
  { id: 'E02', group: 'Edge', actual: 1, score: 0.64 },
  { id: 'E03', group: 'Edge', actual: 1, score: 0.52 },
  { id: 'E04', group: 'Edge', actual: 1, score: 0.46 },
  { id: 'E05', group: 'Edge', actual: 1, score: 0.41 },
  { id: 'E06', group: 'Edge', actual: 1, score: 0.35 },
  { id: 'E07', group: 'Edge', actual: 0, score: 0.78 },
  { id: 'E08', group: 'Edge', actual: 0, score: 0.58 },
  { id: 'E09', group: 'Edge', actual: 0, score: 0.49 },
  { id: 'E10', group: 'Edge', actual: 0, score: 0.38 },
  { id: 'E11', group: 'Edge', actual: 0, score: 0.28 },
  { id: 'E12', group: 'Edge', actual: 0, score: 0.15 },
]);

export const CALIBRATION_ROWS = Object.freeze([
  { id: 'P1', actual: 1, calibrated: 0.65, overconfident: 0.95 },
  { id: 'P2', actual: 1, calibrated: 0.65, overconfident: 0.95 },
  { id: 'P3', actual: 1, calibrated: 0.65, overconfident: 0.95 },
  { id: 'P4', actual: 1, calibrated: 0.65, overconfident: 0.95 },
  { id: 'P5', actual: 0, calibrated: 0.65, overconfident: 0.95 },
  { id: 'P6', actual: 0, calibrated: 0.65, overconfident: 0.95 },
  { id: 'N1', actual: 1, calibrated: 0.35, overconfident: 0.05 },
  { id: 'N2', actual: 1, calibrated: 0.35, overconfident: 0.05 },
  { id: 'N3', actual: 0, calibrated: 0.35, overconfident: 0.05 },
  { id: 'N4', actual: 0, calibrated: 0.35, overconfident: 0.05 },
  { id: 'N5', actual: 0, calibrated: 0.35, overconfident: 0.05 },
  { id: 'N6', actual: 0, calibrated: 0.35, overconfident: 0.05 },
]);

export const PREVALENCE_PRESETS = Object.freeze([
  { id: 'rare', label: 'Rare event', prevalence: 0.02 },
  { id: 'moderate', label: 'Moderate', prevalence: 0.15 },
  { id: 'balanced', label: 'Balanced', prevalence: 0.5 },
]);
