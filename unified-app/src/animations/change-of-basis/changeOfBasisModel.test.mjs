import assert from 'node:assert/strict';
import test from 'node:test';

import {
  conditionNumber2,
  determinant,
  perturbationAmplification,
  reconstruct,
  scaleBasis,
  solveCoordinates,
} from './changeOfBasisModel.js';

function close(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('identity basis has condition number one', () => {
  close(conditionNumber2({ b1: [1, 0], b2: [0, 1] }), 1);
});

test('coordinate solve reconstructs the original vector', () => {
  const b1 = [1, 1];
  const b2 = [-1, 1];
  const coordinates = solveCoordinates({ b1, b2, vector: [3, 2] });
  const rebuilt = reconstruct({ b1, b2, coordinates });
  close(rebuilt[0], 3);
  close(rebuilt[1], 2);
});

test('nearly collinear basis is invertible but severely ill-conditioned', () => {
  const b1 = [1, 0];
  const b2 = [1, 0.01];
  assert.notEqual(determinant(b1, b2), 0);
  assert.ok(conditionNumber2({ b1, b2 }) > 200);
});

test('tiny vector perturbation can produce a huge coordinate perturbation', () => {
  const result = perturbationAmplification({
    b1: [1, 0],
    b2: [1, 0.01],
    vector: [2, 0.01],
    perturbation: [0, 0.001],
  });
  assert.ok(result.amplification > 140);
});

test('determinant magnitude changes under harmless global basis scaling while condition number does not', () => {
  const original = { b1: [1, 0], b2: [1, 0.01] };
  const scaled = scaleBasis({ ...original, factor: 100 });
  close(conditionNumber2(original), conditionNumber2(scaled), 1e-6);
  close(determinant(scaled.b1, scaled.b2), determinant(original.b1, original.b2) * 10000);
});

test('singular basis is rejected', () => {
  assert.equal(conditionNumber2({ b1: [1, 0], b2: [2, 0] }), Number.POSITIVE_INFINITY);
  assert.throws(() => solveCoordinates({ b1: [1, 0], b2: [2, 0], vector: [1, 1] }), RangeError);
});

test('invalid vectors fail explicitly', () => {
  assert.throws(() => determinant([1], [0, 1]), TypeError);
  assert.throws(() => scaleBasis({ b1: [1, 0], b2: [0, 1], factor: 0 }), RangeError);
});
