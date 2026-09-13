import assert from 'node:assert/strict';
import test from 'node:test';
import { positionBiasExperiment } from './positionBiasModel.js';

function close(actual, expected, tolerance = 1e-12) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('strong position bias can make the less relevant top item win naive CTR', () => {
  const result = positionBiasExperiment({
    impressions: 10000,
    topExamination: 1,
    secondExamination: 0.45,
    itemARelevance: 0.32,
    itemBRelevance: 0.24,
    itemAOnTop: false,
  });
  assert.equal(result.trueWinner, 'A');
  assert.equal(result.naiveWinner, 'B');
  assert.equal(result.naiveRankingWrong, true);
});

test('propensity correction recovers underlying preference in the simplified examination model', () => {
  const result = positionBiasExperiment({
    impressions: 10000,
    topExamination: 1,
    secondExamination: 0.45,
    itemARelevance: 0.32,
    itemBRelevance: 0.24,
    itemAOnTop: false,
  });
  close(result.itemA.correctedPreference, 0.32);
  close(result.itemB.correctedPreference, 0.24);
  assert.equal(result.correctedWinner, 'A');
  assert.equal(result.correctedRankingWrong, false);
});

test('removing position bias makes naive CTR agree with true preference', () => {
  const result = positionBiasExperiment({
    impressions: 10000,
    topExamination: 1,
    secondExamination: 1,
    itemARelevance: 0.32,
    itemBRelevance: 0.24,
    itemAOnTop: false,
  });
  assert.equal(result.naiveWinner, 'A');
});

test('invalid probabilities and impression counts fail explicitly', () => {
  assert.throws(() => positionBiasExperiment({ impressions: 0, topExamination: 1, secondExamination: 0.5, itemARelevance: 0.3, itemBRelevance: 0.2 }), RangeError);
  assert.throws(() => positionBiasExperiment({ impressions: 100, topExamination: 1.2, secondExamination: 0.5, itemARelevance: 0.3, itemBRelevance: 0.2 }), RangeError);
});
