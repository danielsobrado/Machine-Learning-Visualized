import assert from 'node:assert/strict';
import test from 'node:test';
import { positionBiasExperiment } from './positionBiasModel.js';

test('rank stays explicit even when both positions have equal examination probability', () => {
  const result = positionBiasExperiment({
    impressions: 10000,
    topExamination: 1,
    secondExamination: 1,
    itemARelevance: 0.32,
    itemBRelevance: 0.24,
    itemAOnTop: false,
  });
  assert.equal(result.itemA.rank, 2);
  assert.equal(result.itemB.rank, 1);
});
