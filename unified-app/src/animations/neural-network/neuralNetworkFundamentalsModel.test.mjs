import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FUNDAMENTALS_ARCHITECTURE,
  parameterCount,
  parameterLedger,
  shapeLedger,
  xorReluForward,
  xorTruthTable,
} from './neuralNetworkFundamentalsModel.js';

test('parameter count includes weights and biases', () => {
  assert.equal(parameterCount([2, 4, 4, 1]), 37);
  assert.equal(parameterCount(FUNDAMENTALS_ARCHITECTURE), 9);
});

test('parameter ledger reconciles with total count', () => {
  const ledger = parameterLedger([2, 3, 1]);
  assert.equal(ledger.reduce((sum, row) => sum + row.total, 0), parameterCount([2, 3, 1]));
});

test('shape ledger preserves matrix multiplication dimensions', () => {
  assert.deepEqual(shapeLedger({ batchSize: 8, inputWidth: 3, hiddenWidth: 5, outputWidth: 2 }), [
    { label: 'Input X', shape: [8, 3] },
    { label: 'W₁', shape: [3, 5] },
    { label: 'Hidden H', shape: [8, 5] },
    { label: 'W₂', shape: [5, 2] },
    { label: 'Output ŷ', shape: [8, 2] },
  ]);
});

test('two ReLU hidden units represent XOR exactly on binary inputs', () => {
  const rows = xorTruthTable();
  assert.deepEqual(rows.map((row) => row.prediction), [0, 1, 1, 0]);
  assert.deepEqual(rows.map((row) => row.target), [0, 1, 1, 0]);
});

test('forward trace exposes hidden pre-activations and activations', () => {
  assert.deepEqual(xorReluForward([1, 0]), {
    input: [1, 0],
    hiddenPre: [1, -1],
    hidden: [1, 0],
    output: 1,
    prediction: 1,
  });
});
