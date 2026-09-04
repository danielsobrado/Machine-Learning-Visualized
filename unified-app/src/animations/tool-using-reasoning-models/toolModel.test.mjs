import assert from 'node:assert/strict';
import test from 'node:test';
import { TOOL_POLICIES, TOOL_SCENARIOS } from './toolConfig.js';
import { compareToolPolicies, decideToolStep, runScenario } from './toolModel.js';

const policy = (id) => TOOL_POLICIES.find((item) => item.id === id);
const scenario = (id) => TOOL_SCENARIOS.find((item) => item.id === id);

test('no-tools policy cannot ground a research task', () => {
  const result = runScenario(scenario('grounded-research'), policy('no-tools'));
  assert.equal(result.groundingRecall, 0);
  assert.equal(result.goalAchieved, false);
});

test('read-only tools complete grounded research', () => {
  const result = runScenario(scenario('grounded-research'), policy('read-only'));
  assert.equal(result.groundingRecall, 1);
  assert.equal(result.goalAchieved, true);
});

test('approval policy blocks mutation sourced from untrusted search output', () => {
  const injected = scenario('prompt-injection').steps.find((step) => step.id === 'injected-write');
  assert.equal(decideToolStep(injected, policy('approval')).status, 'blocked');
});

test('broad policy executes injected unsafe write', () => {
  const result = runScenario(scenario('prompt-injection'), policy('broad'));
  assert.equal(result.unsafeExecutions, 1);
  assert.equal(result.goalAchieved, false);
});

test('approval policy completes trusted mutation when approval is granted', () => {
  const result = runScenario(scenario('approved-update'), policy('approval'), { approvalsGranted: true });
  assert.equal(result.approvalRequests, 1);
  assert.equal(result.mutationCompleted, true);
  assert.equal(result.goalAchieved, true);
});

test('denied approval prevents mutation completion', () => {
  const result = runScenario(scenario('approved-update'), policy('approval'), { approvalsGranted: false });
  assert.equal(result.mutationCompleted, false);
  assert.equal(result.goalAchieved, false);
});

test('tool accounting is non-negative across policies and scenarios', () => {
  for (const item of TOOL_SCENARIOS) {
    for (const { result } of compareToolPolicies(item, TOOL_POLICIES)) {
      assert.ok(result.executedToolCalls >= 0);
      assert.ok(result.blockedToolCalls >= 0);
      assert.ok(result.latencyMs >= 0);
      assert.ok(result.tokenCost >= 0);
      assert.ok(result.groundingRecall >= 0 && result.groundingRecall <= 1);
    }
  }
});
