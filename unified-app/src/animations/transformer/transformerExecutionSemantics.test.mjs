import assert from 'node:assert/strict';
import test from 'node:test';
import { EXECUTION_MODES, ORIGINAL_TRANSFORMER_STACKS } from './transformerOverviewConstants.js';
import { DECODER_EXECUTION, DECODER_SUBLAYERS } from './transformerDecoderConstants.js';
import { TRANSFORMER_FAMILIES, TRANSFORMER_SYSTEM_PATTERNS } from './transformerVariantConstants.js';

test('original encoder-decoder stack includes decoder cross-attention', () => {
  const decoder = ORIGINAL_TRANSFORMER_STACKS.find((stack) => stack.id === 'decoder');
  assert.ok(decoder);
  assert.ok(decoder.sublayers.some((sublayer) => /cross-attention/i.test(sublayer)));
  assert.ok(DECODER_SUBLAYERS.some((sublayer) => sublayer.id === 'cross-attention'));
});

test('teacher-forced training and autoregressive inference use different target inputs', () => {
  assert.match(EXECUTION_MODES.training.targetInput, /ground-truth/i);
  assert.match(EXECUTION_MODES.inference.targetInput, /generated prefix|prompt/i);
  assert.match(DECODER_EXECUTION.training.explanation, /all target positions in parallel/i);
  assert.match(DECODER_EXECUTION.inference.explanation, /no ground-truth target sequence/i);
});

test('decoder-only family does not inherit encoder-decoder cross-attention', () => {
  const decoderOnly = TRANSFORMER_FAMILIES.find((family) => family.id === 'decoder-only');
  const encoderDecoder = TRANSFORMER_FAMILIES.find((family) => family.id === 'encoder-decoder');
  assert.match(decoderOnly.crossAttention, /absent/i);
  assert.match(encoderDecoder.crossAttention, /encoder source states/i);
});

test('system pattern notes reject absolute long-context and MoE shortcuts', () => {
  const moe = TRANSFORMER_SYSTEM_PATTERNS.find((pattern) => /mixture/i.test(pattern.title));
  const longContext = TRANSFORMER_SYSTEM_PATTERNS.find((pattern) => /long-context/i.test(pattern.title));
  assert.match(moe.detail, /routing and communication still have cost/i);
  assert.match(longContext.detail, /no single positional method guarantees/i);
});
