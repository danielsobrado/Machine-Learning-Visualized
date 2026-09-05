import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO } from './treatmentEffectsConfig.js';
import { assignTreatment, buildTreatmentEffectsLab, generatePotentialOutcomes } from './treatmentEffectsModel.js';

test('potential outcomes and assignments are deterministic', () => {
  assert.deepEqual(buildTreatmentEffectsLab(DEFAULT_SCENARIO), buildTreatmentEffectsLab(DEFAULT_SCENARIO));
});

test('each observed outcome matches the assigned potential outcome', () => {
  const population = generatePotentialOutcomes(DEFAULT_SCENARIO);
  const rows = assignTreatment(population, DEFAULT_SCENARIO);
  rows.forEach((row) => {
    assert.equal(row.observedOutcome, row.treatment ? row.y1 : row.y0);
    assert.equal(row.counterfactualOutcome, row.treatment ? row.y0 : row.y1);
  });
});

test('oracle ATE is the population mean of individual causal effects', () => {
  const lab = buildTreatmentEffectsLab(DEFAULT_SCENARIO);
  const direct = lab.rows.reduce((sum, row) => sum + row.y1 - row.y0, 0) / lab.rows.length;
  assert.ok(Math.abs(lab.metrics.trueAte - direct) < 1e-10);
});

test('randomized difference in means is unbiased across rerandomizations', () => {
  const estimates = [];
  for (let seed = 1; seed <= 250; seed += 1) {
    estimates.push(buildTreatmentEffectsLab({ ...DEFAULT_SCENARIO, assignmentSeed: seed }).metrics.estimatedAte);
  }
  const average = estimates.reduce((sum, value) => sum + value, 0) / estimates.length;
  const truth = buildTreatmentEffectsLab(DEFAULT_SCENARIO).metrics.trueAte;
  assert.ok(Math.abs(average - truth) < 0.35);
});

test('subgroup estimates expose their own uncertainty and interaction test', () => {
  const lab = buildTreatmentEffectsLab(DEFAULT_SCENARIO);
  assert.ok(Number.isFinite(lab.metrics.highStandardError));
  assert.ok(Number.isFinite(lab.metrics.lowStandardError));
  assert.ok(Number.isFinite(lab.metrics.interactionEstimate));
  assert.ok(lab.metrics.highConfidenceInterval[0] < lab.metrics.highConfidenceInterval[1]);
  assert.ok(lab.metrics.lowConfidenceInterval[0] < lab.metrics.lowConfidenceInterval[1]);
});

test('multiplicity-adjusted subgroup intervals widen as more subgroups are searched', () => {
  const few = buildTreatmentEffectsLab({ ...DEFAULT_SCENARIO, subgroupSearchCount: 2 });
  const many = buildTreatmentEffectsLab({ ...DEFAULT_SCENARIO, subgroupSearchCount: 20 });
  const width = (interval) => interval[1] - interval[0];

  assert.ok(width(few.metrics.highAdjustedInterval) > width(few.metrics.highConfidenceInterval));
  assert.ok(width(many.metrics.highAdjustedInterval) > width(few.metrics.highAdjustedInterval));
  assert.ok(many.metrics.adjustedCriticalValue > few.metrics.adjustedCriticalValue);
});

test('group-optimal targeting avoids a harmed segment', () => {
  const lab = buildTreatmentEffectsLab(DEFAULT_SCENARIO);
  assert.ok(lab.metrics.trueHighCate > 0);
  assert.ok(lab.metrics.trueLowCate < 0);
  assert.ok(lab.metrics.targetedValue > lab.metrics.treatAllValue);
  assert.ok(lab.metrics.targetedValue > lab.metrics.treatNoneValue);
  assert.ok(lab.metrics.evidenceAwarePolicyValue <= lab.metrics.targetedValue + 1e-10);
});

test('when both group effects are positive targeting collapses to treat all', () => {
  const lab = buildTreatmentEffectsLab({ ...DEFAULT_SCENARIO, highEffect: 8, lowEffect: 8 });
  assert.ok(Math.abs(lab.metrics.targetedValue - lab.metrics.treatAllValue) < 1e-10);
});
