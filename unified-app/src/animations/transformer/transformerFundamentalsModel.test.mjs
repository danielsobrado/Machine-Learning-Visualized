import assert from 'node:assert/strict';
import test from 'node:test';
import {
  attentionMaskRule,
  attentionScoreElements,
  transformerCoreParameterLedger,
  transformerShapeLedger,
} from './transformerFundamentalsModel.js';

test('shape ledger derives per-head width and attention matrix shape', () => {
  const ledger = transformerShapeLedger({ batchSize: 2, sequenceLength: 16, dModel: 512, numHeads: 8, dFF: 2048 });
  assert.equal(ledger.headDim, 64);
  assert.deepEqual(ledger.rows.find((row) => row.id === 'scores').shape, [2, 8, 16, 16]);
});

test('core block parameter ledger matches QKV plus output plus FFN matrices', () => {
  const ledger = transformerCoreParameterLedger({ dModel: 512, dFF: 2048 });
  assert.equal(ledger.attention, 1_048_576);
  assert.equal(ledger.ffn, 2_097_152);
  assert.equal(ledger.total, 3_145_728);
});

test('attention score storage scales quadratically with sequence length', () => {
  const small = attentionScoreElements({ sequenceLength: 128, numHeads: 8 });
  const large = attentionScoreElements({ sequenceLength: 256, numHeads: 8 });
  assert.equal(large, small * 4);
});

test('encoder and decoder modes have different visibility rules', () => {
  assert.match(attentionMaskRule('encoder'), /every token/i);
  assert.match(attentionMaskRule('decoder'), /future/i);
});

test('head count must divide dModel', () => {
  assert.throws(() => transformerShapeLedger({ sequenceLength: 8, dModel: 63, numHeads: 4, dFF: 256 }), /divisible/);
});
