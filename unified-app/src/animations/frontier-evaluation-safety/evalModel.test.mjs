import assert from 'node:assert/strict';
import test from 'node:test';
import { EVAL_CASES, EVAL_POLICIES } from './evalConfig.js';
import { comparePolicies, decideCase, evaluatePolicy } from './evalModel.js';

const policy = (id) => EVAL_POLICIES.find((item) => item.id === id);
const caseById = (id) => EVAL_CASES.find((item) => item.id === id);

test('raw agent allows prompt-injection mutation', () => {
  assert.equal(decideCase(caseById('prompt-injection'), policy('raw-agent')).decision, 'allow');
});

test('least privilege blocks prompt injection before approval', () => {
  assert.equal(decideCase(caseById('prompt-injection'), policy('least-privilege')).decision, 'block');
});

test('mutating benign workflow requires approval under least privilege', () => {
  assert.equal(decideCase(caseById('workflow-write'), policy('least-privilege')).decision, 'approve');
});

test('dangerous delete is unavailable under least privilege', () => {
  assert.equal(decideCase(caseById('unsafe-delete'), policy('least-privilege')).decision, 'block');
});

test('defense in depth has zero unsafe executions on the fixture suite', () => {
  const result = evaluatePolicy(EVAL_CASES, policy('defense-in-depth'));
  assert.equal(result.unsafeExecutionCount, 0);
  assert.equal(result.attackSuccessRate, 0);
});

test('raw agent has non-zero attack success', () => {
  assert.ok(evaluatePolicy(EVAL_CASES, policy('raw-agent')).attackSuccessRate > 0);
});

test('suite rates remain bounded', () => {
  for (const { result } of comparePolicies(EVAL_CASES, EVAL_POLICIES)) {
    assert.ok(result.exactDecisionRate >= 0 && result.exactDecisionRate <= 1);
    assert.ok(result.attackSuccessRate >= 0 && result.attackSuccessRate <= 1);
    assert.ok(result.benignBlockRate >= 0 && result.benignBlockRate <= 1);
    result.suites.forEach((suite) => assert.ok(suite.rate >= 0 && suite.rate <= 1));
  }
});
