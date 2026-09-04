function validateGamma(gamma) {
  if (!Number.isFinite(gamma) || gamma < 0 || gamma > 1) throw new RangeError('gamma must be in [0, 1]');
}

function validateRewards(rewards) {
  if (!Array.isArray(rewards) || rewards.length === 0 || rewards.some((value) => !Number.isFinite(value))) throw new TypeError('rewards must be a non-empty finite array');
}

function validateOutcomes(outcomes) {
  if (!Array.isArray(outcomes) || outcomes.length === 0) throw new TypeError('outcomes must be non-empty');
  const total = outcomes.reduce((sum, outcome) => sum + outcome.probability, 0);
  if (outcomes.some((outcome) => !Number.isFinite(outcome.probability) || outcome.probability < 0)) throw new RangeError('outcome probabilities must be non-negative');
  if (Math.abs(total - 1) > 1e-9) throw new RangeError('outcome probabilities must sum to one');
  outcomes.forEach((outcome) => validateRewards(outcome.rewards));
}

export function discountedReturn(rewards, gamma) {
  validateRewards(rewards);
  validateGamma(gamma);
  return rewards.reduce((sum, reward, index) => sum + (gamma ** index) * reward, 0);
}

export function returnsByStep(rewards, gamma) {
  validateRewards(rewards);
  validateGamma(gamma);
  const returns = Array(rewards.length).fill(0);
  let continuation = 0;
  for (let index = rewards.length - 1; index >= 0; index -= 1) {
    continuation = rewards[index] + gamma * continuation;
    returns[index] = continuation;
  }
  return returns;
}

export function expectedActionReturn(outcomes, gamma) {
  validateOutcomes(outcomes);
  validateGamma(gamma);
  return outcomes.reduce((sum, outcome) => sum + outcome.probability * discountedReturn(outcome.rewards, gamma), 0);
}

export function expectedImmediateReward(outcomes) {
  validateOutcomes(outcomes);
  return outcomes.reduce((sum, outcome) => sum + outcome.probability * outcome.rewards[0], 0);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function sampleOutcome(outcomes, seed) {
  validateOutcomes(outcomes);
  const draw = mulberry32(seed)();
  let cumulative = 0;
  for (let index = 0; index < outcomes.length; index += 1) {
    cumulative += outcomes[index].probability;
    if (draw <= cumulative || index === outcomes.length - 1) return outcomes[index];
  }
  return outcomes[outcomes.length - 1];
}

export function effectiveDiscountHorizon(gamma, weightThreshold = 0.05) {
  validateGamma(gamma);
  if (!Number.isFinite(weightThreshold) || weightThreshold <= 0 || weightThreshold >= 1) throw new RangeError('weightThreshold must be in (0, 1)');
  if (gamma === 0) return 1;
  if (gamma === 1) return Number.POSITIVE_INFINITY;
  return Math.ceil(Math.log(weightThreshold) / Math.log(gamma));
}

export function buildRlFoundationsLab({ scenario, gamma, seed }) {
  if (!scenario || !Array.isArray(scenario.actions) || scenario.actions.length === 0) throw new TypeError('scenario is required');
  validateGamma(gamma);
  const actions = scenario.actions.map((action, actionIndex) => {
    const sampledOutcome = sampleOutcome(action.outcomes, seed + actionIndex * 997);
    const sampledReturns = returnsByStep(sampledOutcome.rewards, gamma);
    return {
      ...action,
      expectedReturn: expectedActionReturn(action.outcomes, gamma),
      immediateReward: expectedImmediateReward(action.outcomes),
      sampledOutcome,
      sampledReturn: sampledReturns[0],
      sampledReturns,
    };
  });
  const bestAction = actions.reduce((best, action) => action.expectedReturn > best.expectedReturn ? action : best, actions[0]);
  return { actions, bestActionId: bestAction.id, horizon: effectiveDiscountHorizon(gamma) };
}
