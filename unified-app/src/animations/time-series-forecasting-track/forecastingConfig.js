export const SERIES_LENGTH = 108;
export const SEASON_PERIOD = 12;
export const MIN_TRAIN_POINTS = 36;

export const MODEL_DEFINITIONS = [
  { id: 'naive', label: 'Naive', detail: 'Repeat the latest observation.' },
  { id: 'seasonal-naive', label: 'Seasonal naive', detail: 'Repeat the value from one season ago.' },
  { id: 'trend-seasonal', label: 'Trend + seasonal', detail: 'Fit a linear trend, then average residuals by season.' },
];

export const DEFAULT_SCENARIO = {
  seasonality: 12,
  trend: 0.25,
  noise: 2.5,
  regimeShift: 0,
  horizon: 12,
  folds: 5,
  modelId: 'seasonal-naive',
};

export const CONTROL_LIMITS = {
  seasonality: { min: 0, max: 20, step: 1 },
  trend: { min: -0.2, max: 0.8, step: 0.05 },
  noise: { min: 0, max: 8, step: 0.5 },
  regimeShift: { min: -20, max: 20, step: 2 },
  horizon: { min: 3, max: 12, step: 1 },
  folds: { min: 2, max: 6, step: 1 },
};

export const SCENARIO_PRESETS = [
  { id: 'seasonal', label: 'Stable seasonal', values: { seasonality: 14, trend: 0.2, noise: 2, regimeShift: 0 } },
  { id: 'weak', label: 'Weak signal', values: { seasonality: 2, trend: 0.05, noise: 6, regimeShift: 0 } },
  { id: 'shift', label: 'Regime shift', values: { seasonality: 12, trend: 0.2, noise: 2.5, regimeShift: 16 } },
];
