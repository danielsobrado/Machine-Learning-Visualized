import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDistributionAssumptionLab,
  buildLabelSmoothingLab,
  buildMapLab,
} from './foundationPriorityModel.js';
import {
  buildCupedCovariateLab,
  buildDagPathLab,
  buildPropensityBalanceLab,
  buildSequentialSpendingLab,
  buildTreatmentInferenceLab,
} from './causalPriorityModel.js';
import {
  buildCalibrationLab,
  buildInferenceMemoryLab,
  buildTargetEncodingLab,
} from './productionPriorityModel.js';

test('distribution assumptions expose different outlier penalties', () => {
  const lab = buildDistributionAssumptionLab({ residual: 4, scale: 1 });
  assert.ok(lab.gaussianPenalty > lab.laplacePenalty);
});

test('label smoothing preserves a probability target and softens the true class', () => {
  const lab = buildLabelSmoothingLab({ confidence: 0.8, smoothing: 0.1, classes: 4 });
  assert.ok(Math.abs(lab.smoothTargets.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  assert.ok(lab.trueClassTarget < 1);
  assert.ok(lab.otherClassTarget > 0);
});

test('MAP sits between a symmetric prior mode and the Bernoulli MLE', () => {
  const lab = buildMapLab({ successes: 9, trials: 10, alpha: 2, beta: 2 });
  assert.equal(lab.mle, 0.9);
  assert.ok(lab.map < lab.mle);
  assert.ok(lab.map > lab.priorMode);
});

test('mediator and collider conditioning change path status for the right reasons', () => {
  const open = buildDagPathLab({ conditionMediator: false, conditionCollider: false });
  const conditioned = buildDagPathLab({ conditionMediator: true, conditionCollider: true });
  assert.equal(open.safeForTotalEffect, true);
  assert.equal(conditioned.totalEffectStatus, 'blocked');
  assert.equal(conditioned.colliderPathStatus, 'opened by conditioning');
});

test('subgroup inference reports multiplicity pressure', () => {
  const lab = buildTreatmentInferenceLab({ effect: 0.08, standardError: 0.02, subgroupCount: 10, alpha: 0.05 });
  assert.ok(lab.lower > 0);
  assert.ok(lab.familywiseFalsePositiveRisk > 0.05);
});

test('propensity trimming example improves standardized balance', () => {
  const lab = buildPropensityBalanceLab({
    treatedMean: 0.72,
    controlMean: 0.43,
    pooledSd: 0.28,
    trimmedTreatedMean: 0.58,
    trimmedControlMean: 0.52,
    trimmedPooledSd: 0.27,
    extremeWeightShare: 0.16,
  });
  assert.equal(lab.improved, true);
  assert.ok(Math.abs(lab.afterSmd) < Math.abs(lab.beforeSmd));
});

test('CUPED model separates variance reduction from post-treatment validity', () => {
  const valid = buildCupedCovariateLab({ rSquared: 0.36, postTreatmentCovariate: false });
  const invalid = buildCupedCovariateLab({ rSquared: 0.36, postTreatmentCovariate: true });
  assert.ok(Math.abs(valid.varianceLeft - 0.64) < 1e-12);
  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
});

test('Lan-DeMets spending presets finish at the planned alpha', () => {
  const lab = buildSequentialSpendingLab({ alpha: 0.05, looks: 5 });
  const last = lab.rows.at(-1);
  assert.ok(Math.abs(last.pocock - 0.05) < 1e-4);
  assert.ok(Math.abs(last.obrienFleming - 0.05) < 2e-4);
  assert.ok(lab.rows[0].obrienFleming < lab.rows[0].pocock);
});

test('calibration lab computes weighted reliability gaps', () => {
  const lab = buildCalibrationLab({ buckets: [
    { confidence: 0.6, accuracy: 0.5, share: 0.5 },
    { confidence: 0.9, accuracy: 0.8, share: 0.5 },
  ] });
  assert.ok(Math.abs(lab.ece - 0.1) < 1e-12);
  assert.equal(lab.diagnosis, 'overconfident');
});

test('target encoding exposes self-label and point-in-time leakage', () => {
  const lab = buildTargetEncodingLab({
    categoryPositives: 3,
    categoryRows: 4,
    currentTarget: 1,
    featureTimestampOffsetHours: 3,
  });
  assert.equal(lab.globalEncoding, 0.75);
  assert.ok(lab.globalEncoding > lab.leaveOneOutEncoding);
  assert.equal(lab.pointInTimeLeak, true);
});

test('KV cache memory grows linearly with batch size', () => {
  const base = {
    paramsBillions: 7,
    weightBits: 4,
    layers: 32,
    sequenceLength: 8192,
    kvHeads: 8,
    headDim: 128,
    cacheBytes: 2,
  };
  const one = buildInferenceMemoryLab({ ...base, batchSize: 1 });
  const two = buildInferenceMemoryLab({ ...base, batchSize: 2 });
  assert.ok(Math.abs(two.kvGiB - 2 * one.kvGiB) < 1e-12);
  assert.equal(two.parameterGiB, one.parameterGiB);
});
