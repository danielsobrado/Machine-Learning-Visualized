import test from 'node:test';
import assert from 'node:assert/strict';
import {
  affineDistribution,
  buildMomentsLab,
  exactMoments,
  independentAverageMoments,
  probabilityAtOrBelow,
  simulateMoments,
} from './momentsModel.js';
import { DISTRIBUTION_PRESETS } from './momentsConfig.js';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const preset = (id) => DISTRIBUTION_PRESETS.find((item) => item.id === id);

test('fair die has the standard mean and variance', () => {
  const die = preset('fair-die');
  const moments = exactMoments(die.outcomes, die.probabilities);
  close(moments.mean, 3.5);
  close(moments.variance, 35 / 12);
});

test('affine transformation obeys expectation and variance identities', () => {
  const die = preset('fair-die');
  const transformed = affineDistribution(die.outcomes, -2, 3);
  const moments = exactMoments(transformed, die.probabilities);
  const base = exactMoments(die.outcomes, die.probabilities);
  close(moments.mean, -2 * base.mean + 3);
  close(moments.variance, 4 * base.variance);
});

test('same expected value can hide radically different variance', () => {
  const stable = exactMoments(preset('stable-five').outcomes, preset('stable-five').probabilities);
  const risky = exactMoments(preset('risky-five').outcomes, preset('risky-five').probabilities);
  close(stable.mean, risky.mean);
  assert.ok(risky.variance > stable.variance * 100);
});

test('rare jackpot has zero expected value but substantial variance', () => {
  const jackpot = exactMoments(preset('rare-jackpot').outcomes, preset('rare-jackpot').probabilities);
  close(jackpot.mean, 0);
  assert.ok(jackpot.variance > 90);
});

test('averaging independent copies preserves the mean and divides variance by n', () => {
  const moments = { mean: 5, variance: 25, standardDeviation: 5 };
  const average = independentAverageMoments(moments, 4);
  close(average.mean, 5);
  close(average.variance, 6.25);
  close(average.standardDeviation, 2.5);
});

test('downside probability is computed from probability mass, not distance from the mean', () => {
  const risky = preset('risky-five');
  close(probabilityAtOrBelow(risky.outcomes, risky.probabilities, 0), 0.5);
});

test('simulation is deterministic and converges toward expectation', () => {
  const die = preset('fair-die');
  const a = simulateMoments(die.outcomes, die.probabilities, 3000, 77);
  const b = simulateMoments(die.outcomes, die.probabilities, 3000, 77);
  assert.deepEqual(a.values.slice(0, 30), b.values.slice(0, 30));
  close(a.mean, 3.5, 0.08);
});

test('build lab identifies when expectation is not an observable outcome', () => {
  const lab = buildMomentsLab({
    preset: preset('fair-die'),
    scale: 1,
    shift: 0,
    independentCopies: 4,
    lossThreshold: 0,
    sampleSize: 500,
    seed: 1,
  });
  assert.equal(lab.meanIsPossibleOutcome, false);
});
