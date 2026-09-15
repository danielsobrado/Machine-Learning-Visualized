import test from 'node:test';
import assert from 'node:assert/strict';
import { CAUSAL_ADVANCED_DEFAULTS } from './causalAdvancedDefaults.js';
import {
  buildDoublyRobustEssLab,
  buildFrontDoorAdjustmentLab,
  buildMatchingVsStandardizationLab,
  buildMultiCovariateCupedLab,
  buildPartialPoolingLab,
  buildSequentialObservedZLab,
} from './causalAdvancedPriorityModel.js';

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};

test('front-door adjustment performs both treatment and mediator standardizations', () => {
  const lab = buildFrontDoorAdjustmentLab(CAUSAL_ADVANCED_DEFAULTS['causal-graphs-dags']);
  closeTo(lab.mediatorOutcome0, 0.16);
  closeTo(lab.mediatorOutcome1, 0.61);
  closeTo(lab.doControl, 0.2725);
  closeTo(lab.doTreatment, 0.4975);
  closeTo(lab.frontDoorEffect, 0.225);
});

test('partial pooling shrinks a noisy subgroup toward the population mean', () => {
  const lab = buildPartialPoolingLab(CAUSAL_ADVANCED_DEFAULTS['treatment-effects']);
  closeTo(lab.dataWeight, 0.2808988764044944);
  closeTo(lab.pooledEffect, 0.09370786516853932);
  assert.ok(lab.pooledEffect < 0.18);
  assert.ok(lab.pooledEffect > 0.06);
  assert.ok(lab.pooledStandardError < 0.08);
});

test('AIPW exposes residual correction and IPTW effective sample size', () => {
  const defaults = CAUSAL_ADVANCED_DEFAULTS['propensity-scores'];
  const lab = buildDoublyRobustEssLab(defaults.rows);
  closeTo(lab.pluginEstimate, 0.26875);
  closeTo(lab.aipwEstimate, 0.4790928515928516);
  closeTo(lab.effectiveSampleSize, 6.413267295348305);
  assert.equal(lab.maxWeight, 4);
  assert.ok(lab.essFraction < 1);
});

test('worse overlap lowers effective sample size', () => {
  const defaults = CAUSAL_ADVANCED_DEFAULTS['propensity-scores'];
  const stressedRows = defaults.rows.map((row) => row.id === 'T1' ? { ...row, propensity: 0.10 } : row);
  const relaxedRows = defaults.rows.map((row) => row.id === 'T1' ? { ...row, propensity: 0.80 } : row);
  const stressed = buildDoublyRobustEssLab(stressedRows);
  const relaxed = buildDoublyRobustEssLab(relaxedRows);
  assert.ok(stressed.effectiveSampleSize < relaxed.effectiveSampleSize);
  assert.ok(stressed.maxWeight > relaxed.maxWeight);
});

test('matching ATT and standardized ATE differ when target populations differ', () => {
  const lab = buildMatchingVsStandardizationLab(CAUSAL_ADVANCED_DEFAULTS['confounding-simpsons-paradox']);
  closeTo(lab.lowEffect, 0.08);
  closeTo(lab.highEffect, 0.20);
  closeTo(lab.matchedAtt, 0.11);
  closeTo(lab.standardizedAte, 0.14);
  closeTo(lab.estimandGap, -0.03);
});

test('multi-covariate CUPED accumulates partial R-squared on residual variance', () => {
  const lab = buildMultiCovariateCupedLab(CAUSAL_ADVANCED_DEFAULTS['cuped-variance-reduction']);
  closeTo(lab.afterFirst, 0.25);
  closeTo(lab.afterSecond, 0.40);
  closeTo(lab.afterThird, 0.46);
  closeTo(lab.varianceLeft, 0.54);
  closeTo(lab.sampleEquivalentMultiplier, 1 / 0.54);
});

test('five-look OBrien-Fleming boundary is harder to cross early than late', () => {
  const defaults = CAUSAL_ADVANCED_DEFAULTS['sequential-testing-peeking'];
  const early = buildSequentialObservedZLab(defaults);
  const final = buildSequentialObservedZLab({ ...defaults, look: 5, observedZ: 2.10 });
  closeTo(early.criticalZ, 2.04 / Math.sqrt(0.4));
  closeTo(final.criticalZ, 2.04);
  assert.equal(early.stopForEfficacy, false);
  assert.equal(final.stopForEfficacy, true);
  assert.ok(early.criticalZ > final.criticalZ);
});
