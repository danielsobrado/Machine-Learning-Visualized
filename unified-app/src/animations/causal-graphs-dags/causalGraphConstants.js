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
