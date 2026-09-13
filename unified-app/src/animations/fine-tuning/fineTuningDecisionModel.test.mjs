import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fineTuningDataRisks,
  fineTuningResourceTable,
  loraTrainableParameters,
} from './fineTuningDecisionModel.js';

test('LoRA parameter count follows two low-rank matrices per adapted weight', () => {
  assert.equal(loraTrainableParameters({ layers: 32, dModel: 4096, rank: 16, adaptedMatricesPerLayer: 4 }), 16_777_216);
});

test('QLoRA keeps LoRA trainable count but reduces frozen base storage', () => {
  const table = fineTuningResourceTable({ baseParameters: 7_000_000_000, layers: 32, dModel: 4096, rank: 16, adaptedMatricesPerLayer: 4 });
  const lora = table.find((row) => row.id === 'lora');
  const qlora = table.find((row) => row.id === 'qlora');
  assert.equal(qlora.trainableParameters, lora.trainableParameters);
  assert.ok(qlora.baseWeightBytes < lora.baseWeightBytes);
});

test('full fine-tuning trains every base parameter', () => {
  const table = fineTuningResourceTable({ baseParameters: 3_000_000_000, layers: 28, dModel: 3072, rank: 8, adaptedMatricesPerLayer: 4 });
  const full = table.find((row) => row.id === 'full');
  assert.equal(full.trainableParameters, 3_000_000_000);
  assert.equal(full.trainableFraction, 1);
});

test('benchmark overlap and serving-format mismatch are explicit independent risks', () => {
  const risks = fineTuningDataRisks({ benchmarkOverlap: true, formatMatch: false, domainExamples: 5000 });
  assert.deepEqual(risks.map((risk) => risk.id), ['contamination', 'format']);
});
