import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatParameterCount,
  transformerMatrixParameterLedger,
} from './transformerPracticeModel.js';

test('classic dense self-attention plus FFN matrix weights are counted exactly', () => {
  const ledger = transformerMatrixParameterLedger({
    dModel: 512,
    numHeads: 8,
    numLayers: 6,
    dFF: 2048,
  });

  assert.equal(ledger.headDim, 64);
  assert.equal(ledger.selfAttentionPerLayer, 1_048_576);
  assert.equal(ledger.ffnPerLayer, 2_097_152);
  assert.equal(ledger.totalPerLayer, 3_145_728);
  assert.equal(ledger.stackTotal, 18_874_368);
});

test('encoder-decoder cross-attention adds one additional attention module per layer', () => {
  const withoutCross = transformerMatrixParameterLedger({
    dModel: 512,
    numHeads: 8,
    numLayers: 6,
    dFF: 2048,
    includeCrossAttention: false,
  });
  const withCross = transformerMatrixParameterLedger({
    dModel: 512,
    numHeads: 8,
    numLayers: 6,
    dFF: 2048,
    includeCrossAttention: true,
  });

  assert.equal(withCross.crossAttentionPerLayer, 1_048_576);
  assert.equal(withCross.stackTotal - withoutCross.stackTotal, 6 * 1_048_576);
});

test('invalid head partition is rejected rather than producing fractional head width', () => {
  assert.throws(
    () => transformerMatrixParameterLedger({ dModel: 510, numHeads: 8, numLayers: 6, dFF: 2048 }),
    /divisible/,
  );
});

test('parameter formatter preserves readable units', () => {
  assert.equal(formatParameterCount(18_874_368), '18.87M');
});
