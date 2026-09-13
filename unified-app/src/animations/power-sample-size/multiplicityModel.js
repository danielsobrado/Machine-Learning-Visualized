import { DEFAULT_SCENARIO } from './powerConfig.js';
import { requiredSampleSize } from './powerModel.js';

function assertCount(value) {
  if (!Number.isInteger(value) || value < 1) throw new RangeError('hypotheses must be a positive integer');
}

function assertPercent(value, name) {
  if (!Number.isFinite(value) || value <= 0 || value >= 100) throw new RangeError(`${name} must be between 0 and 100`);
}

export function bonferroniAlpha(familyAlpha, hypotheses) {
  assertPercent(familyAlpha, 'familyAlpha');
  assertCount(hypotheses);
  return familyAlpha / hypotheses;
}

export function uncorrectedFamilyError(alphaPercent, hypotheses) {
  assertPercent(alphaPercent, 'alphaPercent');
  assertCount(hypotheses);
  const alpha = alphaPercent / 100;
  return 1 - Math.pow(1 - alpha, hypotheses);
}

export function buildMultiplicityLab({ hypotheses, familyAlpha, relativeLift }) {
  const perTestAlpha = bonferroniAlpha(familyAlpha, hypotheses);
  const base = { ...DEFAULT_SCENARIO, alpha: familyAlpha, relativeLift };
  const corrected = { ...base, alpha: perTestAlpha };
  const singleTestRequired = requiredSampleSize(base);
  const correctedRequired = requiredSampleSize(corrected);

  return {
    perTestAlpha,
    singleTestRequired,
    correctedRequired,
    sampleInflation: correctedRequired / singleTestRequired,
    extraSample: correctedRequired - singleTestRequired,
    uncorrectedFamilyError: uncorrectedFamilyError(familyAlpha, hypotheses),
  };
}
