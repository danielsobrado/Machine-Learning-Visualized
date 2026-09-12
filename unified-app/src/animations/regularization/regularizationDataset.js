import { FEATURES, REGULARIZATION_EXPERIMENT } from './regularizationConstants.js';

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalSample(random) {
  const u1 = Math.max(random(), Number.EPSILON);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function createRegularizationDataset({
  seed,
  size,
  targetNoiseStd = REGULARIZATION_EXPERIMENT.targetNoiseStd,
} = {}) {
  if (!Number.isInteger(seed) || seed < 0) throw new RangeError('seed must be a non-negative integer');
  if (!Number.isInteger(size) || size < 2) throw new RangeError('size must be an integer of at least 2');
  if (!Number.isFinite(targetNoiseStd) || targetNoiseStd < 0) {
    throw new RangeError('targetNoiseStd must be a finite non-negative number');
  }

  const random = createRng(seed);
  const rows = [];
  const targets = [];

  for (let index = 0; index < size; index += 1) {
    const sharedSignal = normalSample(random);
    const signalA = sharedSignal + REGULARIZATION_EXPERIMENT.correlatedJitterStd * normalSample(random);
    const signalB = sharedSignal + REGULARIZATION_EXPERIMENT.correlatedJitterStd * normalSample(random);
    const independentSignal = normalSample(random);
    const noiseA = normalSample(random);
    const noiseB = normalSample(random);
    const noiseC = normalSample(random);
    const outcomeNoise = targetNoiseStd * normalSample(random);

    rows.push([signalA, signalB, independentSignal, noiseA, noiseB, noiseC]);
    targets.push(
      REGULARIZATION_EXPERIMENT.sharedSignalWeight * sharedSignal
      + REGULARIZATION_EXPERIMENT.independentSignalWeight * independentSignal
      + outcomeNoise,
    );
  }

  return Object.freeze({
    featureIds: Object.freeze(FEATURES.map((feature) => feature.id)),
    rows: Object.freeze(rows.map((row) => Object.freeze(row))),
    targets: Object.freeze(targets),
  });
}
