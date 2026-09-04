function assertGamma(gamma) {
  if (!Number.isFinite(gamma) || gamma < 0 || gamma > 1) throw new RangeError('gamma must be in [0, 1]');
}

export function discountedReturn(rewards, gamma) {
  assertGamma(gamma);
  if (!Array.isArray(rewards) || rewards.some((value) => !Number.isFinite(value))) throw new TypeError('rewards must be finite');
  return rewards.reduce((sum, reward, index) => sum + (gamma ** index) * reward, 0);
}

export function potentialBonus({ currentState, nextState, potentials, gamma, weight = 1 }) {
  assertGamma(gamma);
  if (!Number.isFinite(weight)) throw new TypeError('weight must be finite');
  const current = potentials[currentState];
  const next = potentials[nextState];
  if (![current, next].every(Number.isFinite)) throw new RangeError('every state needs a finite potential');
  return weight * (gamma * next - current);
}

export function potentialShapedRewards({ states, rewards, potentials, gamma, weight = 1 }) {
  if (!Array.isArray(states) || states.length !== rewards.length + 1) throw new RangeError('states must have one more item than rewards');
  return rewards.map((reward, index) => reward + potentialBonus({
    currentState: states[index],
    nextState: states[index + 1],
    potentials,
    gamma,
    weight,
  }));
}

export function potentialShapedReturn(args) {
  return discountedReturn(potentialShapedRewards(args), args.gamma);
}

export function telescopingOffset({ states, potentials, gamma, weight = 1 }) {
  assertGamma(gamma);
  const start = potentials[states[0]];
  const terminal = potentials[states[states.length - 1]];
  if (![start, terminal].every(Number.isFinite)) throw new RangeError('start and final potentials must be finite');
  return weight * (-start + (gamma ** (states.length - 1)) * terminal);
}

export function naiveProgressRewards({ states, rewards, potentials, bonusWeight }) {
  if (!Number.isFinite(bonusWeight) || bonusWeight < 0) throw new RangeError('bonusWeight must be non-negative');
  return rewards.map((reward, index) => {
    const improvement = potentials[states[index + 1]] - potentials[states[index]];
    return reward + bonusWeight * Math.max(0, improvement);
  });
}

export function naiveProgressReturn(args) {
  return discountedReturn(naiveProgressRewards(args), args.gamma);
}

export function evaluateTrajectory({ trajectory, potentials, gamma, weight, naiveProgressBonus }) {
  const taskReturn = discountedReturn(trajectory.rewards, gamma);
  const shapedRewards = potentialShapedRewards({
    states: trajectory.states,
    rewards: trajectory.rewards,
    potentials,
    gamma,
    weight,
  });
  const shapedReturn = discountedReturn(shapedRewards, gamma);
  const naiveRewards = naiveProgressRewards({
    states: trajectory.states,
    rewards: trajectory.rewards,
    potentials,
    bonusWeight: naiveProgressBonus,
  });
  const naiveReturn = discountedReturn(naiveRewards, gamma);
  return {
    ...trajectory,
    taskReturn,
    shapedRewards,
    shapedReturn,
    expectedOffset: telescopingOffset({ states: trajectory.states, potentials, gamma, weight }),
    actualOffset: shapedReturn - taskReturn,
    naiveRewards,
    naiveReturn,
  };
}

export function buildRewardShapingLab({ trajectories, potentials, gamma, weight, naiveProgressBonus }) {
  const rows = trajectories.map((trajectory) => evaluateTrajectory({ trajectory, potentials, gamma, weight, naiveProgressBonus }));
  const byTask = [...rows].sort((a, b) => b.taskReturn - a.taskReturn);
  const byPotential = [...rows].sort((a, b) => b.shapedReturn - a.shapedReturn);
  const byNaive = [...rows].sort((a, b) => b.naiveReturn - a.naiveReturn);
  return {
    rows,
    taskBest: byTask[0].id,
    potentialBest: byPotential[0].id,
    naiveBest: byNaive[0].id,
    potentialPreservesBest: byTask[0].id === byPotential[0].id,
    naiveChangesBest: byTask[0].id !== byNaive[0].id,
  };
}
