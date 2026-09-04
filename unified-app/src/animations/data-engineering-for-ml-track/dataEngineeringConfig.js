export const ENTITY_COUNT = 6;
export const BASE_EVENT_COUNT = 72;
export const PREDICTION_TIMES = [24, 32, 40, 48, 56, 64];
export const EXPECTED_SCHEMA_VERSION = 1;

export const DEFAULT_SCENARIO = {
  lateArrivalRate: 25,
  duplicateRate: 12,
  schemaDriftRate: 10,
  freshnessSla: 8,
  serveTransform: 'v1',
};

export const CONTROL_LIMITS = {
  lateArrivalRate: { min: 0, max: 60, step: 5 },
  duplicateRate: { min: 0, max: 35, step: 5 },
  schemaDriftRate: { min: 0, max: 35, step: 5 },
  freshnessSla: { min: 2, max: 16, step: 2 },
};

export const TRANSFORMS = [
  { id: 'v1', label: 'v1 · raw / 10' },
  { id: 'v2', label: 'v2 · log1p(raw)' },
];

export const SCENARIO_PRESETS = [
  { id: 'clean', label: 'Clean pipeline', values: { lateArrivalRate: 0, duplicateRate: 0, schemaDriftRate: 0, freshnessSla: 8, serveTransform: 'v1' } },
  { id: 'backfill', label: 'Late backfill', values: { lateArrivalRate: 55, duplicateRate: 5, schemaDriftRate: 0, freshnessSla: 6, serveTransform: 'v1' } },
  { id: 'contract-break', label: 'Contract break', values: { lateArrivalRate: 15, duplicateRate: 20, schemaDriftRate: 30, freshnessSla: 8, serveTransform: 'v1' } },
  { id: 'skew', label: 'Train/serve skew', values: { lateArrivalRate: 10, duplicateRate: 5, schemaDriftRate: 0, freshnessSla: 8, serveTransform: 'v2' } },
];
