import assert from 'node:assert/strict';
import test from 'node:test';
import { POLICY_ITERATION_DEFAULTS, POLICY_ITERATION_MDP } from './policyIterationConfig.js';
import {
  actionValue,
  evaluatePolicy,
  evaluatePolicyForSweeps,
  improvePolicy,
  policyBellmanResidual,
  runPolicyIteration,
  validateMdp,
} from './policyIterationModel.js';

test('MDP transition distributions are valid and terminal state has no actions', () => {
  assert.equal(validateMdp(POLICY_ITERATION_MDP), true);
  assert.deepEqual(POLICY_ITERATION_MDP.actions.Goal, {});
});

test('transition into terminal state pays reward once and has no continuation value', () => {
  const lowGoal = { Start: 0, Bridge: 0, Trap: 5, Goal: 0 };
  const highGoal = { ...lowGoal, Goal: 999 };
  const low = actionValue(POLICY_ITERATION_MDP, 'Bridge', 'forward', lowGoal, 0.9);
  const high = actionValue(POLICY_ITERATION_MDP, 'Bridge', 'forward', highGoal, 0.9);
  assert.equal(high, low);
  const terminalOnly = { ...POLICY_ITERATION_MDP, actions: { ...POLICY_ITERATION_MDP.actions, Bridge: { finish: [{ to: 'Goal', probability: 1, reward: 10 }] } } };
  assert.equal(actionValue(terminalOnly, 'Bridge', 'finish', highGoal, 0.9), 10);
});

test('policy evaluation converges to its Bellman fixed point', () => {
  const result = evaluatePolicy(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, 0.9);
  assert.equal(result.converged, true);
  assert.ok(result.residual < 1e-7);
  assert.ok(policyBellmanResidual(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, result.values, 0.9) < 1e-7);
});

test('policy improvement returns a greedy policy under evaluated values', () => {
  const evaluation = evaluatePolicy(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, 0.9);
  const improvement = improvePolicy(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, evaluation.values, 0.9);
  assert.ok(improvement.changes.length > 0);
});

test('policy iteration reaches a stable policy', () => {
  const result = runPolicyIteration(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, 0.9);
  assert.equal(result.stable, true);
  assert.deepEqual(result.policy, { Start: 'safe', Bridge: 'forward', Trap: 'recover' });
});

test('terminal state remains exactly zero under policy iteration', () => {
  const result = runPolicyIteration(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, 0.95);
  assert.equal(result.values.Goal, 0);
});

test('truncated evaluation can differ materially from converged evaluation', () => {
  const short = evaluatePolicyForSweeps(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, 0.95, 1);
  const full = evaluatePolicy(POLICY_ITERATION_MDP, POLICY_ITERATION_DEFAULTS.initialPolicy, 0.95).values;
  assert.ok(Math.abs(short.Trap - full.Trap) > 1);
});
