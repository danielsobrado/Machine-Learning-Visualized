export const ACTOR_CRITIC_DEFAULTS = {
  policyLogit: 0,
  sampledAction: 1,
  returnValue: 8,
  criticValue: 4,
  actorStep: 0.4,
  criticStep: 0.35,
  reward: 2,
  nextValue: 5,
  gamma: 0.9,
};

export const ACTOR_CRITIC_LIMITS = {
  policyLogit: { min: -4, max: 4, step: 0.1 },
  value: { min: -8, max: 14, step: 1 },
  step: { min: 0.05, max: 0.8, step: 0.05 },
};
