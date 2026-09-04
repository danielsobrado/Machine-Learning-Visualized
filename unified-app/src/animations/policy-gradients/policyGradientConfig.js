export const POLICY_GRADIENT_ACTIONS = Object.freeze([
  { id: 'left', label: 'Left', expectedReturn: 1 },
  { id: 'right', label: 'Right', expectedReturn: 5 },
  { id: 'jump', label: 'Jump', expectedReturn: -2 },
]);

export const POLICY_GRADIENT_DEFAULTS = Object.freeze({
  logits: [0.4, 0.1, -0.2],
  sampledAction: 1,
  sampledReturn: 7,
  baseline: 2,
  learningRate: 0.2,
});
