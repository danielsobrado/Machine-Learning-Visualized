export const TOOL_POLICIES = [
  { id: 'no-tools', label: 'No tools', detail: 'Reason from prior context only.', allowedTools: [], requireApprovalForWrites: true, blockUntrustedWrites: true },
  { id: 'read-only', label: 'Read-only tools', detail: 'Search, files, and Python are available; mutation tools are unavailable.', allowedTools: ['search', 'file', 'python'], requireApprovalForWrites: true, blockUntrustedWrites: true },
  { id: 'approval', label: 'Least privilege + approval', detail: 'Read tools run directly; writes require approval and untrusted-sourced writes are blocked.', allowedTools: ['search', 'file', 'python', 'write'], requireApprovalForWrites: true, blockUntrustedWrites: true },
  { id: 'broad', label: 'Broad autonomous tools', detail: 'All tools execute without provenance gating or approval.', allowedTools: ['search', 'file', 'python', 'write'], requireApprovalForWrites: false, blockUntrustedWrites: false },
];

export const TOOL_SCENARIOS = [
  {
    id: 'grounded-research', label: 'Grounded research', detail: 'Find two facts, verify a calculation, then answer.',
    requiredFacts: ['renewal-rate', 'invoice-total', 'verified-total'], requiresMutation: false,
    steps: [
      { id: 'search', type: 'tool', tool: 'search', costMs: 900, tokenCost: 650, yields: ['renewal-rate'], trusted: false },
      { id: 'file', type: 'tool', tool: 'file', costMs: 300, tokenCost: 420, yields: ['invoice-total'], trusted: true },
      { id: 'python', type: 'tool', tool: 'python', costMs: 220, tokenCost: 120, yields: ['verified-total'], trusted: true },
      { id: 'answer', type: 'answer' },
    ],
  },
  {
    id: 'prompt-injection', label: 'Prompt injection in search result', detail: 'A search result contains useful evidence plus an instruction to send internal data.',
    requiredFacts: ['supplier-status'], requiresMutation: false,
    steps: [
      { id: 'search', type: 'tool', tool: 'search', costMs: 900, tokenCost: 700, yields: ['supplier-status'], trusted: false },
      { id: 'injected-write', type: 'tool', tool: 'write', costMs: 450, tokenCost: 80, yields: [], trusted: false, mutation: true, unsafe: true },
      { id: 'answer', type: 'answer' },
    ],
  },
  {
    id: 'approved-update', label: 'Research then update', detail: 'Read the record, compute a value, then request a mutation.',
    requiredFacts: ['current-value', 'new-value'], requiresMutation: true,
    steps: [
      { id: 'file', type: 'tool', tool: 'file', costMs: 300, tokenCost: 300, yields: ['current-value'], trusted: true },
      { id: 'python', type: 'tool', tool: 'python', costMs: 220, tokenCost: 120, yields: ['new-value'], trusted: true },
      { id: 'write', type: 'tool', tool: 'write', costMs: 450, tokenCost: 100, yields: [], trusted: true, mutation: true },
      { id: 'answer', type: 'answer' },
    ],
  },
];

export const TOOL_DEFAULTS = { scenarioId: 'prompt-injection', policyId: 'approval' };
