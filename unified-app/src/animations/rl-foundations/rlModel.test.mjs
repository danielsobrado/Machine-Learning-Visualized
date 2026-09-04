import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRlFoundationsLab, discountedReturn, effectiveDiscountHorizon, expectedActionReturn, returnsByStep, sampleOutcome } from './rlModel.js';
import { RL_SCENARIOS } from './rlConfig.js';

test('gamma zero keeps only the immediate reward', () => assert.equal(discountedReturn([3, 100, 100], 0), 3));
test('gamma one sums an episodic reward sequence without discounting', () => assert.equal(discountedReturn([1, -2, 5], 1), 4));
test('returns satisfy the trajectory recurrence', () => { const rewards = [1, 2, 3]; const gamma = 0.8; const values = returnsByStep(rewards, gamma); assert.ok(Math.abs(values[0] - (rewards[0] + gamma * values[1])) < 1e-12); assert.ok(Math.abs(values[1] - (rewards[1] + gamma * values[2])) < 1e-12); });
test('expected return averages discounted outcomes', () => { const outcomes = [{ probability: 0.25, rewards: [8] }, { probability: 0.75, rewards: [0, 4] }]; assert.ok(Math.abs(expectedActionReturn(outcomes, 0.5) - 3.5) < 1e-12); });
test('seeded outcome sampling is deterministic', () => { const outcomes = [{ probability: 0.5, label: 'a', rewards: [1] }, { probability: 0.5, label: 'b', rewards: [2] }]; assert.deepEqual(sampleOutcome(outcomes, 42), sampleOutcome(outcomes, 42)); });
test('discounting can flip the preferred action', () => { const scenario = RL_SCENARIOS.find((item) => item.id === 'now-vs-later'); assert.equal(buildRlFoundationsLab({ scenario, gamma: 0.5, seed: 1 }).bestActionId, 'take-now'); assert.equal(buildRlFoundationsLab({ scenario, gamma: 0.9, seed: 1 }).bestActionId, 'wait'); });
test('effective horizon is finite below one and infinite at one', () => { assert.equal(effectiveDiscountHorizon(0), 1); assert.ok(Number.isFinite(effectiveDiscountHorizon(0.9))); assert.equal(effectiveDiscountHorizon(1), Number.POSITIVE_INFINITY); });
