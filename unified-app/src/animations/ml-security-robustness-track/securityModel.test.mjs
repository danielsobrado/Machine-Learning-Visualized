import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './securityConfig.js';
import { buildSecurityLab, evaluateProfile, layerAblations } from './securityModel.js';

test('defense in depth lowers attack success versus no guardrails', () => {
  const none = evaluateProfile(DEFAULT_SCENARIO, 'none');
  const layered = evaluateProfile(DEFAULT_SCENARIO, 'defense-in-depth');
  assert.ok(layered.metrics.attackSuccessRate < none.metrics.attackSuccessRate);
});

test('input-only defense does not outperform full defense in depth', () => {
  const inputOnly = evaluateProfile(DEFAULT_SCENARIO, 'input-only');
  const layered = evaluateProfile(DEFAULT_SCENARIO, 'defense-in-depth');
  assert.ok(layered.metrics.attackSuccessRate <= inputOnly.metrics.attackSuccessRate);
});

test('higher strictness cannot increase attack success for the same profile', () => {
  const loose = evaluateProfile({ ...DEFAULT_SCENARIO, strictness: 30 }, 'defense-in-depth');
  const strict = evaluateProfile({ ...DEFAULT_SCENARIO, strictness: 95 }, 'defense-in-depth');
  assert.ok(strict.metrics.attackSuccessRate <= loose.metrics.attackSuccessRate);
});

test('stricter layered policy can reduce benign pass rate', () => {
  const loose = evaluateProfile({ ...DEFAULT_SCENARIO, strictness: 30 }, 'defense-in-depth');
  const strict = evaluateProfile({ ...DEFAULT_SCENARIO, strictness: 100 }, 'defense-in-depth');
  assert.ok(strict.metrics.benignPassRate <= loose.metrics.benignPassRate);
});

test('ablation analysis returns one result per defense layer', () => {
  const ablations = layerAblations(DEFAULT_SCENARIO);
  assert.equal(ablations.length, 4);
  ablations.forEach((result) => assert.ok(result.delta >= 0));
});

test('security lab exposes bounded rates', () => {
  const lab = buildSecurityLab(DEFAULT_SCENARIO);
  Object.values(lab.selected.metrics)
    .filter((value) => typeof value === 'number' && value <= 1)
    .forEach((value) => assert.ok(value >= 0 && value <= 1));
});
