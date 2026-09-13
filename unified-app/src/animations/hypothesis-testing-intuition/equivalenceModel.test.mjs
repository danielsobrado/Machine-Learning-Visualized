import assert from 'node:assert/strict';
import test from 'node:test';
import { buildEquivalenceLab } from './equivalenceModel.js';

test('precise near-zero estimate can demonstrate equivalence without significance', () => {
  const lab = buildEquivalenceLab({ estimate: 0, standardError: 0.5, margin: 2, alpha: 5 });
  assert.equal(lab.significantVsZero, false);
  assert.equal(lab.equivalent, true);
  assert.ok(lab.tostPValue < 0.05);
});

test('wide uncertainty is not evidence of equivalence', () => {
  const lab = buildEquivalenceLab({ estimate: 0, standardError: 1.5, margin: 2, alpha: 5 });
  assert.equal(lab.significantVsZero, false);
  assert.equal(lab.equivalent, false);
  assert.equal(lab.diagnosis, 'Inconclusive');
});

test('an effect can be statistically different from zero and still practically equivalent', () => {
  const lab = buildEquivalenceLab({ estimate: 1.3, standardError: 0.3, margin: 2, alpha: 5 });
  assert.equal(lab.significantVsZero, true);
  assert.equal(lab.equivalent, true);
  assert.equal(lab.diagnosis, 'Different from zero, but still equivalent');
});

test('non-inferiority requires the one-sided lower bound above the negative margin', () => {
  const pass = buildEquivalenceLab({ estimate: -1, standardError: 0.3, margin: 2, alpha: 5 });
  const fail = buildEquivalenceLab({ estimate: -1.8, standardError: 0.4, margin: 2, alpha: 5 });
  assert.equal(pass.nonInferior, true);
  assert.equal(fail.nonInferior, false);
});
