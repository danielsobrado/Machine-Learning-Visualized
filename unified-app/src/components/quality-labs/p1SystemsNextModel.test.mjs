import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildImplicitFeedbackObjective,
  buildLateArrivalFeature,
  buildServingMemoryBudget,
  compareSampledNegativeEvaluation,
  joinSlowlyChangingDimension,
  simulateSecurityTrace,
} from './p1SystemsNextModel.js';
import {
  DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS,
  INFERENCE_SYSTEMS_NEXT_DEFAULTS,
  RECOMMENDER_SYSTEMS_NEXT_DEFAULTS,
  SECURITY_SYSTEMS_NEXT_DEFAULTS,
} from './p1SystemsNextConstants.js';

test('sampled easy negatives inflate ranking quality by omitting harder catalog items', () => {
  const result = compareSampledNegativeEvaluation(RECOMMENDER_SYSTEMS_NEXT_DEFAULTS);
  assert.equal(result.fullRank, 4);
  assert.equal(result.sampledRank, 1);
  assert.equal(result.fullMrr, 0.25);
  assert.equal(result.sampledMrr, 1);
  assert.equal(result.omittedHardNegatives, 3);
});

test('implicit-feedback confidence weights observed interactions without calling missing events negatives', () => {
  const result = buildImplicitFeedbackObjective({
    observations: RECOMMENDER_SYSTEMS_NEXT_DEFAULTS.observations,
    alpha: RECOMMENDER_SYSTEMS_NEXT_DEFAULTS.implicitAlpha,
  });
  assert.equal(result.rows[0].confidence, 13);
  assert.equal(result.rows[1].confidence, 1);
  assert.ok(result.observedShare > 0.7);
});

test('security trace shows authorization alone does not stop output exfiltration', () => {
  const weak = simulateSecurityTrace({
    attack: SECURITY_SYSTEMS_NEXT_DEFAULTS.attack,
    controls: SECURITY_SYSTEMS_NEXT_DEFAULTS.presets.weak,
  });
  const authOnly = simulateSecurityTrace({
    attack: SECURITY_SYSTEMS_NEXT_DEFAULTS.attack,
    controls: SECURITY_SYSTEMS_NEXT_DEFAULTS.presets.authorizationOnly,
  });
  const defended = simulateSecurityTrace({
    attack: SECURITY_SYSTEMS_NEXT_DEFAULTS.attack,
    controls: SECURITY_SYSTEMS_NEXT_DEFAULTS.presets.defenseInDepth,
  });

  assert.equal(weak.compromised, true);
  assert.equal(authOnly.toolExecuted, false);
  assert.equal(authOnly.secretReleased, true);
  assert.equal(defended.compromised, false);
  assert.ok(defended.blockedStages >= 1);
});

test('point-in-time SCD join rejects the latest-value shortcut', () => {
  const result = joinSlowlyChangingDimension({
    dimensionVersions: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.dimensionVersions,
    eventTime: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.predictionTime,
    latestAsOf: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.latestAsOf,
  });
  assert.equal(result.pointInTime.segment, 'SMB');
  assert.equal(result.latest.segment, 'Enterprise');
  assert.equal(result.leaked, true);
});

test('late-arriving events must not appear in a reconstructed feature before they were known', () => {
  const result = buildLateArrivalFeature({
    events: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.events,
    predictionTime: 10,
    featureWindowHours: DATA_ENGINEERING_SYSTEMS_NEXT_DEFAULTS.featureWindowHours,
  });
  assert.equal(result.eventTimeOnlyCount, 2);
  assert.equal(result.pointInTimeCount, 1);
  assert.deepEqual(result.lateEventIds, ['e2']);
  assert.equal(result.leakageDelta, 1);
});

test('serving memory includes paged-KV fragmentation plus activation and runtime overhead', () => {
  const result = buildServingMemoryBudget(INFERENCE_SYSTEMS_NEXT_DEFAULTS);
  assert.ok(result.fragmentationGiB > 0);
  assert.ok(result.allocatedKvGiB > result.usedKvGiB);
  assert.ok(result.servingTotalGiB > result.simplifiedTotalGiB);
  assert.ok(result.overheadGiB > INFERENCE_SYSTEMS_NEXT_DEFAULTS.activationGiB);
});
