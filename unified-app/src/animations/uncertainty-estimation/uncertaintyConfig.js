export const CALIBRATION_POOL_SIZE = 160;
export const TEST_SIZE = 240;

export const DEFAULT_SCENARIO = {
  targetCoverage: 0.9,
  calibrationSize: 80,
  noiseScale: 4,
  distributionShift: 0,
  abstainWidth: 18,
};

export const CONTROL_LIMITS = {
  targetCoverage: { min: 0.8, max: 0.95, step: 0.05 },
  calibrationSize: { min: 20, max: 160, step: 20 },
  noiseScale: { min: 1, max: 8, step: 1 },
  distributionShift: { min: 0, max: 10, step: 1 },
  abstainWidth: { min: 8, max: 32, step: 2 },
};

export const SCENARIO_PRESETS = [
  { id: 'iid', label: 'Exchangeable', values: { targetCoverage: 0.9, calibrationSize: 80, noiseScale: 4, distributionShift: 0, abstainWidth: 18 } },
  { id: 'small-calibration', label: 'Tiny calibration set', values: { targetCoverage: 0.9, calibrationSize: 20, noiseScale: 4, distributionShift: 0, abstainWidth: 18 } },
  { id: 'noisy', label: 'High aleatoric noise', values: { targetCoverage: 0.9, calibrationSize: 100, noiseScale: 8, distributionShift: 0, abstainWidth: 26 } },
  { id: 'ood', label: 'Distribution shift', values: { targetCoverage: 0.9, calibrationSize: 100, noiseScale: 4, distributionShift: 8, abstainWidth: 20 } },
];
