import assert from 'node:assert/strict';
import test from 'node:test';
import { bonferroniAlpha, buildMultiplicityLab, uncorrectedFamilyError } from './multiplicityModel.js';

test('one hypothesis leaves alpha unchanged', () => {
  assert.equal(bonferroniAlpha(5, 1), 5);
  const lab = buildMultiplicityLab({ hypotheses: 1, familyAlpha: 5, relativeLift: 6 });
  assert.equal(lab.correctedRequired, lab.singleTestRequired);
});

test('more hypotheses reduce per-test alpha and increase required sample', () => {
  const one = buildMultiplicityLab({ hypotheses: 1, familyAlpha: 5, relativeLift: 6 });
  const eight = buildMultiplicityLab({ hypotheses: 8, familyAlpha: 5, relativeLift: 6 });
  assert.ok(eight.perTestAlpha < one.perTestAlpha);
  assert.ok(eight.correctedRequired > one.correctedRequired);
  assert.ok(eight.sampleInflation > 1);
});

test('uncorrected family error grows with the number of tests', () => {
  assert.ok(uncorrectedFamilyError(5, 10) > uncorrectedFamilyError(5, 2));
  assert.ok(uncorrectedFamilyError(5, 10) > 0.35);
});

test('smaller MDE still increases sample under multiplicity control', () => {
  const large = buildMultiplicityLab({ hypotheses: 4, familyAlpha: 5, relativeLift: 10 });
  const small = buildMultiplicityLab({ hypotheses: 4, familyAlpha: 5, relativeLift: 4 });
  assert.ok(small.correctedRequired > large.correctedRequired);
});
