export const DEFAULT_SCENARIO = {
  attackPressure: 80,
  strictness: 55,
  sensitiveData: 55,
  profileId: 'defense-in-depth',
};

export const CONTROL_LIMITS = {
  attackPressure: { min: 20, max: 100, step: 5 },
  strictness: { min: 20, max: 100, step: 5 },
  sensitiveData: { min: 0, max: 100, step: 5 },
};

export const LAYERS = [
  { id: 'input', label: 'Input gate', detail: 'Detect suspicious instructions and malformed requests before model execution.' },
  { id: 'retrieval', label: 'Retrieval isolation', detail: 'Treat retrieved content as data, not authority, and preserve provenance.' },
  { id: 'tool', label: 'Tool policy', detail: 'Use least privilege, allowlists, argument validation, and approval boundaries.' },
  { id: 'output', label: 'Output privacy', detail: 'Check responses for sensitive-data exposure before release.' },
];

export const DEFENSE_PROFILES = [
  { id: 'none', label: 'No guardrails', layers: [] },
  { id: 'input-only', label: 'Input-only filter', layers: ['input'] },
  { id: 'defense-in-depth', label: 'Defense in depth', layers: LAYERS.map((layer) => layer.id) },
];

export const ATTACK_CASES = [
  { id: 'direct-1', family: 'Instruction override', vector: 'input', strength: 0.78, privacy: 0.15 },
  { id: 'direct-2', family: 'Instruction override', vector: 'input', strength: 0.92, privacy: 0.10 },
  { id: 'direct-3', family: 'Instruction override', vector: 'input', strength: 0.61, privacy: 0.05 },
  { id: 'retrieval-1', family: 'Retrieval poisoning', vector: 'retrieval', strength: 0.74, privacy: 0.20 },
  { id: 'retrieval-2', family: 'Retrieval poisoning', vector: 'retrieval', strength: 0.88, privacy: 0.35 },
  { id: 'retrieval-3', family: 'Retrieval poisoning', vector: 'retrieval', strength: 0.66, privacy: 0.10 },
  { id: 'tool-1', family: 'Unsafe tool request', vector: 'tool', strength: 0.82, privacy: 0.15 },
  { id: 'tool-2', family: 'Unsafe tool request', vector: 'tool', strength: 0.95, privacy: 0.25 },
  { id: 'tool-3', family: 'Unsafe tool request', vector: 'tool', strength: 0.70, privacy: 0.05 },
  { id: 'privacy-1', family: 'Sensitive-data extraction', vector: 'output', strength: 0.72, privacy: 0.90 },
  { id: 'privacy-2', family: 'Sensitive-data extraction', vector: 'output', strength: 0.87, privacy: 1.00 },
  { id: 'privacy-3', family: 'Sensitive-data extraction', vector: 'output', strength: 0.64, privacy: 0.80 },
];

export const BENIGN_CASES = [
  { id: 'benign-1', family: 'Normal Q&A', friction: 0.08 },
  { id: 'benign-2', family: 'Code explanation', friction: 0.14 },
  { id: 'benign-3', family: 'Document summary', friction: 0.21 },
  { id: 'benign-4', family: 'Tool-assisted lookup', friction: 0.34 },
  { id: 'benign-5', family: 'Long instruction', friction: 0.42 },
  { id: 'benign-6', family: 'Sensitive but allowed workflow', friction: 0.55 },
  { id: 'benign-7', family: 'Retrieved-content analysis', friction: 0.38 },
  { id: 'benign-8', family: 'Structured automation request', friction: 0.46 },
];

export const LAYER_EFFECTIVENESS = {
  input: { input: 0.62, retrieval: 0.08, tool: 0.10, output: 0.05 },
  retrieval: { input: 0.03, retrieval: 0.72, tool: 0.05, output: 0.08 },
  tool: { input: 0.02, retrieval: 0.06, tool: 0.78, output: 0.04 },
  output: { input: 0.04, retrieval: 0.10, tool: 0.05, output: 0.74 },
};
