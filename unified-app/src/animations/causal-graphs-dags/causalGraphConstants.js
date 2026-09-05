export const CAUSAL_NODES = {
  C: { label: 'C', name: 'Confounder' },
  T: { label: 'T', name: 'Treatment' },
  M: { label: 'M', name: 'Mediator' },
  S: { label: 'S', name: 'Selection / collider' },
  U: { label: 'U', name: 'Unobserved cause' },
  Y: { label: 'Y', name: 'Outcome' },
};

export const CAUSAL_EDGES = Object.freeze([
  ['C', 'T'],
  ['C', 'Y'],
  ['T', 'Y'],
  ['T', 'M'],
  ['M', 'Y'],
  ['T', 'S'],
  ['U', 'S'],
  ['U', 'Y'],
]);

export const CANONICAL_PATHS = Object.freeze([
  {
    id: 'direct',
    label: 'Direct causal path',
    type: 'causal',
    nodes: ['T', 'Y'],
    explanation: 'Part of the total causal effect.',
  },
  {
    id: 'mediated',
    label: 'Mediated causal path',
    type: 'causal',
    nodes: ['T', 'M', 'Y'],
    explanation: 'Conditioning on M blocks this part of the total effect.',
  },
  {
    id: 'backdoor',
    label: 'Confounding backdoor',
    type: 'backdoor',
    nodes: ['T', 'C', 'Y'],
    explanation: 'Open unless the common cause C is blocked.',
  },
  {
    id: 'collider',
    label: 'Collider path',
    type: 'collider',
    nodes: ['T', 'S', 'U', 'Y'],
    explanation: 'Blocked at T → S ← U until S is conditioned on.',
  },
]);

export const ADJUSTMENT_PRESETS = Object.freeze([
  { id: 'none', label: 'Adjust nothing', nodes: [] },
  { id: 'confounder', label: 'Adjust C', nodes: ['C'] },
  { id: 'mediator', label: 'Adjust M', nodes: ['M'] },
  { id: 'collider', label: 'Adjust S', nodes: ['S'] },
  { id: 'confounder-mediator', label: 'Adjust C + M', nodes: ['C', 'M'] },
  { id: 'confounder-collider', label: 'Adjust C + S', nodes: ['C', 'S'] },
]);

export const M_BIAS_NODES = Object.freeze({
  T: { label: 'T', name: 'Treatment' },
  A: { label: 'A', name: 'Cause of treatment' },
  K: { label: 'K', name: 'Collider covariate' },
  B: { label: 'B', name: 'Cause of outcome' },
  Y: { label: 'Y', name: 'Outcome' },
});

export const M_BIAS_EDGES = Object.freeze([
  ['A', 'T'],
  ['A', 'K'],
  ['B', 'K'],
  ['B', 'Y'],
  ['T', 'Y'],
]);

export const M_BIAS_PATH = Object.freeze({
  id: 'm-bias',
  label: 'M-shaped non-causal path',
  nodes: ['T', 'A', 'K', 'B', 'Y'],
  explanation: 'K is a collider on T ← A → K ← B → Y. Conditioning on K opens the path.',
});

export const FRONT_DOOR_SCENARIOS = Object.freeze({
  valid: {
    label: 'Valid front-door',
    detail: 'M intercepts the T→Y effect, T→M has no open backdoor, and conditioning on T blocks M→Y backdoors.',
    directBypass: false,
    treatmentMediatorConfounding: false,
    mediatorOutcomeConfounding: false,
  },
  directBypass: {
    label: 'Direct T → Y remains',
    detail: 'A direct causal path bypasses M, so the mediator no longer intercepts every directed T→Y path.',
    directBypass: true,
    treatmentMediatorConfounding: false,
    mediatorOutcomeConfounding: false,
  },
  treatmentMediatorConfounding: {
    label: 'T ↔ M confounded',
    detail: 'An unblocked common cause of T and M violates the no-backdoor requirement for the first front-door stage.',
    directBypass: false,
    treatmentMediatorConfounding: true,
    mediatorOutcomeConfounding: false,
  },
  mediatorOutcomeConfounding: {
    label: 'M ↔ Y confounded',
    detail: 'A mediator-outcome backdoor remains after conditioning on T, so the second front-door stage is not identified.',
    directBypass: false,
    treatmentMediatorConfounding: false,
    mediatorOutcomeConfounding: true,
  },
});
