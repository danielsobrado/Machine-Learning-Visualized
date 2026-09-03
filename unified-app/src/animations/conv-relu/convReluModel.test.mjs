import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BRIGHT_LEFT_PATCH,
  BRIGHT_RIGHT_PATCH,
  POLARITY_KERNEL,
  filterResponse,
  negateKernel,
  pairedPolarityResponse,
  polarityExperiment,
  relu,
} from './convReluModel.js';

test('contrast reversal flips the signed edge response', () => {
  assert.equal(filterResponse(BRIGHT_RIGHT_PATCH, POLARITY_KERNEL), 4);
  assert.equal(filterResponse(BRIGHT_LEFT_PATCH, POLARITY_KERNEL), -4);
});

test('ReLU drops one edge polarity entirely', () => {
  assert.equal(relu(filterResponse(BRIGHT_RIGHT_PATCH, POLARITY_KERNEL)), 4);
  assert.equal(relu(filterResponse(BRIGHT_LEFT_PATCH, POLARITY_KERNEL)), 0);
});

test('paired opposite filters recover equal edge strength', () => {
  const right = pairedPolarityResponse(BRIGHT_RIGHT_PATCH, POLARITY_KERNEL);
  const left = pairedPolarityResponse(BRIGHT_LEFT_PATCH, POLARITY_KERNEL);
  assert.equal(right.combinedStrength, 4);
  assert.equal(left.combinedStrength, 4);
});

test('negating the kernel negates a zero-bias filter response', () => {
  const response = filterResponse(BRIGHT_RIGHT_PATCH, POLARITY_KERNEL);
  const opposite = filterResponse(BRIGHT_RIGHT_PATCH, negateKernel(POLARITY_KERNEL));
  assert.equal(opposite, -response);
});

test('polarity experiment identifies the single-filter blind spot', () => {
  const experiment = polarityExperiment();
  assert.equal(experiment.singleFilterDropsOnePolarity, true);
  assert.equal(experiment.pairedStrengthMatches, true);
});

test('invalid filter configurations fail explicitly', () => {
  assert.throws(() => filterResponse([[1, 2]], [[1], [2]]), RangeError);
  assert.throws(() => filterResponse([[1, Number.NaN]], [[1, 1]]), TypeError);
  assert.throws(() => relu(Number.POSITIVE_INFINITY), TypeError);
});
