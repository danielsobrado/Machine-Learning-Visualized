function validateProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be in [0, 1]`);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function corruptWithMasks(tokens, maskProbability, seed) {
  if (!Array.isArray(tokens) || tokens.length === 0) throw new TypeError('tokens must be non-empty');
  validateProbability(maskProbability, 'maskProbability');
  const random = mulberry32(seed);
  const maskedIndices = [];
  const corrupted = tokens.map((token, index) => {
    if (random() < maskProbability) {
      maskedIndices.push(index);
      return '[MASK]';
    }
    return token;
  });
  return { corrupted, maskedIndices, maskedFraction: maskedIndices.length / tokens.length };
}

export function expectedMaskedCount(tokenCount, maskProbability) {
  if (!Number.isInteger(tokenCount) || tokenCount < 0) throw new RangeError('tokenCount must be non-negative');
  validateProbability(maskProbability, 'maskProbability');
  return tokenCount * maskProbability;
}

export function denoisingSchedule(tokenCount, steps) {
  if (!Number.isInteger(tokenCount) || tokenCount < 0) throw new RangeError('tokenCount must be non-negative');
  if (!Number.isInteger(steps) || steps <= 0) throw new RangeError('steps must be positive');
  let remaining = tokenCount;
  const rows = [];
  for (let step = 1; step <= steps; step += 1) {
    const stepsLeft = steps - step + 1;
    const reveal = Math.ceil(remaining / stepsLeft);
    remaining -= reveal;
    rows.push({ step, reveal, remaining });
  }
  return rows;
}

export function generationPasses({ mode, sequenceLength, diffusionSteps, blockSize, blockSteps }) {
  if (!Number.isInteger(sequenceLength) || sequenceLength <= 0) throw new RangeError('sequenceLength must be positive');
  if (mode === 'autoregressive') return sequenceLength;
  if (mode === 'full-diffusion') return diffusionSteps;
  if (mode === 'block-diffusion') return Math.ceil(sequenceLength / blockSize) * blockSteps;
  throw new RangeError(`unknown generation mode: ${mode}`);
}

export function averagePositionsFinalizedPerPass(sequenceLength, passes) {
  if (!Number.isInteger(sequenceLength) || sequenceLength <= 0 || !Number.isInteger(passes) || passes <= 0) {
    throw new RangeError('sequenceLength and passes must be positive integers');
  }
  return sequenceLength / passes;
}

export function maskedCrossEntropy(trueTokenProbabilities, maskedIndices) {
  if (!Array.isArray(trueTokenProbabilities) || trueTokenProbabilities.some((value) => !Number.isFinite(value) || value <= 0 || value > 1)) {
    throw new RangeError('trueTokenProbabilities must be in (0, 1]');
  }
  if (!Array.isArray(maskedIndices)) throw new TypeError('maskedIndices must be an array');
  if (maskedIndices.length === 0) return 0;
  let loss = 0;
  for (const index of maskedIndices) {
    if (!Number.isInteger(index) || index < 0 || index >= trueTokenProbabilities.length) throw new RangeError('masked index out of range');
    loss -= Math.log(trueTokenProbabilities[index]);
  }
  return loss / maskedIndices.length;
}

export function revealHighestConfidence(maskedIndices, confidences, count) {
  if (!Array.isArray(maskedIndices) || !Array.isArray(confidences)) throw new TypeError('inputs must be arrays');
  if (!Number.isInteger(count) || count < 0) throw new RangeError('count must be non-negative');
  return [...maskedIndices]
    .sort((left, right) => confidences[right] - confidences[left] || left - right)
    .slice(0, count);
}

export function buildDiffusionLab({ sequenceLength, diffusionSteps, blockSize, blockSteps, corruptionProbability, seed, sampleTokens }) {
  const fullPasses = generationPasses({ mode: 'full-diffusion', sequenceLength, diffusionSteps, blockSize, blockSteps });
  const blockPasses = generationPasses({ mode: 'block-diffusion', sequenceLength, diffusionSteps, blockSize, blockSteps });
  const arPasses = generationPasses({ mode: 'autoregressive', sequenceLength, diffusionSteps, blockSize, blockSteps });
  const corruption = corruptWithMasks(sampleTokens, corruptionProbability, seed);
  const schedule = denoisingSchedule(sequenceLength, diffusionSteps);
  return {
    arPasses,
    fullPasses,
    blockPasses,
    fullParallelism: averagePositionsFinalizedPerPass(sequenceLength, fullPasses),
    blockParallelism: averagePositionsFinalizedPerPass(sequenceLength, blockPasses),
    passReductionVsAr: arPasses / fullPasses,
    corruption,
    expectedMasked: expectedMaskedCount(sampleTokens.length, corruptionProbability),
    schedule,
    totalRevealed: schedule.reduce((sum, row) => sum + row.reveal, 0),
  };
}
