import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildRewardShapingLab,
  discountedReturn,
  potentialBonus,
  potentialShapedReturn,
  telescopingOffset,
} from './rewardShapingModel.js';
import { SHAPING_TRAJECTORIES, STATE_POTENTIALS } from './rewardShapingConfig.js';

test('discounted return uses the reward timing exactly', () => {
  assert.ok(Math.abs(discountedReturn([0, 10], 0.9) - 9) < 1e-12);
});

test('potential bonus is gamma Phi(next) minus Phi(current)', () => {
  const value = potentialBonus({ currentState: 0, nextState: 1, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 1 });
  assert.ok(Math.abs(value - 2.1) < 1e-12);
});

test('potential shaping telescopes to a boundary term', () => {
  for (const trajectory of SHAPING_TRAJECTORIES) {
    const task = discountedReturn(trajectory.rewards, 0.9);
    const shaped = potentialShapedReturn({ states: trajectory.states, rewards: trajectory.rewards, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 1 });
    const offset = telescopingOffset({ states: trajectory.states, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 1 });
    assert.ok(Math.abs(shaped - task - offset) < 1e-10);
  }
});

test('terminal-zero potential gives the same additive offset to goal-reaching trajectories', () => {
  const fast = SHAPING_TRAJECTORIES[0];
  const slow = SHAPING_TRAJECTORIES[1];
  const fastOffset = telescopingOffset({ states: fast.states, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 1 });
  const slowOffset = telescopingOffset({ states: slow.states, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 1 });
  assert.ok(Math.abs(fastOffset - slowOffset) < 1e-12);
});

test('potential shaping preserves the preferred goal trajectory', () => {
  const lab = buildRewardShapingLab({ trajectories: SHAPING_TRAJECTORIES.slice(0, 2), potentials: STATE_POTENTIALS, gamma: 0.9, weight: 2, naiveProgressBonus: 5 });
  assert.equal(lab.taskBest, 'fast-goal');
  assert.equal(lab.potentialBest, 'fast-goal');
  assert.equal(lab.potentialPreservesBest, true);
});

test('naive positive-only progress bonuses can create a reward-hacking loop', () => {
  const lab = buildRewardShapingLab({ trajectories: SHAPING_TRAJECTORIES, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 1, naiveProgressBonus: 5 });
  assert.equal(lab.taskBest, 'fast-goal');
  assert.equal(lab.naiveBest, 'bonus-loop');
  assert.equal(lab.naiveChangesBest, true);
});

test('zero shaping weight leaves task return unchanged', () => {
  const trajectory = SHAPING_TRAJECTORIES[0];
  const task = discountedReturn(trajectory.rewards, 0.9);
  const shaped = potentialShapedReturn({ states: trajectory.states, rewards: trajectory.rewards, potentials: STATE_POTENTIALS, gamma: 0.9, weight: 0 });
  assert.ok(Math.abs(task - shaped) < 1e-12);
});
