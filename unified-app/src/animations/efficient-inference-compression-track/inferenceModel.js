import {
  DEFAULT_SCENARIO,
  HARDWARE_PROFILES,
  MODEL,
  WEIGHT_FORMATS,
} from './inferenceConfig.js';

const BYTES_PER_GIB = 1024 ** 3;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hardwareById(id) {
  return HARDWARE_PROFILES.find((hardware) => hardware.id === id) ?? HARDWARE_PROFILES[0];
}

function weightFormat(bits) {
  return WEIGHT_FORMATS.find((format) => format.bits === bits) ?? WEIGHT_FORMATS[0];
}

export function weightMemoryGiB(bits, model = MODEL) {
  return (model.parameters * bits / 8) / BYTES_PER_GIB;
}

export function kvMemoryGiB({ context, batch, kvBits }, model = MODEL) {
  const bytesPerElement = kvBits / 8;
  const elementsPerToken = model.layers * model.kvHeads * model.headDim * 2;
  return (elementsPerToken * context * batch * bytesPerElement) / BYTES_PER_GIB;
}

function computeUtilization(batch) {
  return clamp(0.16 + Math.log2(Math.max(1, batch)) * 0.085, 0.16, 0.58);
}

export function performanceEstimate(scenario = DEFAULT_SCENARIO) {
  const hardware = hardwareById(scenario.hardwareId);
  const format = weightFormat(scenario.weightBits);
  const weightsGiB = weightMemoryGiB(scenario.weightBits);
  const kvGiB = kvMemoryGiB(scenario);
  const workspaceGiB = MODEL.workspaceGiB + weightsGiB * 0.06;
  const totalGiB = weightsGiB + kvGiB + workspaceGiB;
  const fits = totalGiB <= hardware.vramGiB;

  const weightBytes = weightsGiB * BYTES_PER_GIB;
  const bandwidthStepsPerSecond = hardware.bandwidthGBs * 1e9 / Math.max(1, weightBytes);
  const bandwidthBoundTokens = bandwidthStepsPerSecond * scenario.batch * 0.78;

  const operationsPerToken = MODEL.parameters * 2;
  const computeBoundTokens = hardware.peakTflops * 1e12
    / operationsPerToken
    * computeUtilization(scenario.batch)
    * format.kernelFactor;

  const baseAggregateTokens = Math.min(bandwidthBoundTokens, computeBoundTokens);
  const speculativeMultiplier = 1 + clamp(scenario.speculativeAcceptance / 100, 0, 0.8) * 0.55;
  const aggregateTokensPerSecond = fits ? baseAggregateTokens * speculativeMultiplier : 0;
  const perRequestTokensPerSecond = aggregateTokensPerSecond / Math.max(1, scenario.batch);
  const decodeMsPerToken = perRequestTokensPerSecond > 0 ? 1000 / perRequestTokensPerSecond : Infinity;

  const prefillOps = MODEL.parameters * 2 * scenario.context;
  const prefillSeconds = prefillOps
    / Math.max(1, hardware.peakTflops * 1e12 * hardware.prefillUtilization);
  const queueMs = Math.max(0, scenario.batch - 1) * 6;
  const ttftMs = fits ? prefillSeconds * 1000 + queueMs : Infinity;

  return {
    hardware,
    format,
    weightsGiB,
    kvGiB,
    workspaceGiB,
    totalGiB,
    fitMarginGiB: hardware.vramGiB - totalGiB,
    fits,
    aggregateTokensPerSecond,
    perRequestTokensPerSecond,
    decodeMsPerToken,
    ttftMs,
    bottleneck: bandwidthBoundTokens <= computeBoundTokens ? 'memory bandwidth' : 'compute',
    bandwidthBoundTokens,
    computeBoundTokens,
    speculativeMultiplier,
  };
}

export function compareWeightFormats(scenario = DEFAULT_SCENARIO) {
  return WEIGHT_FORMATS.map((format) => ({
    bits: format.bits,
    label: format.label,
    estimate: performanceEstimate({ ...scenario, weightBits: format.bits }),
  }));
}

function dominates(left, right) {
  return left.estimate.aggregateTokensPerSecond >= right.estimate.aggregateTokensPerSecond
    && left.estimate.perRequestTokensPerSecond >= right.estimate.perRequestTokensPerSecond
    && left.estimate.totalGiB <= right.estimate.totalGiB
    && (
      left.estimate.aggregateTokensPerSecond > right.estimate.aggregateTokensPerSecond
      || left.estimate.perRequestTokensPerSecond > right.estimate.perRequestTokensPerSecond
      || left.estimate.totalGiB < right.estimate.totalGiB
    );
}

export function paretoCandidates(scenario = DEFAULT_SCENARIO) {
  const candidates = [];
  for (const format of WEIGHT_FORMATS) {
    for (const batch of [1, 2, 4, 8, 16]) {
      const candidateScenario = { ...scenario, weightBits: format.bits, batch };
      const estimate = performanceEstimate(candidateScenario);
      if (estimate.fits) {
        candidates.push({
          id: `${format.label}-b${batch}`,
          label: `${format.label} · batch ${batch}`,
          scenario: candidateScenario,
          estimate,
        });
      }
    }
  }

  return candidates.filter((candidate) => (
    !candidates.some((other) => other.id !== candidate.id && dominates(other, candidate))
  ));
}

export function buildInferenceLab(scenario = DEFAULT_SCENARIO) {
  return {
    scenario,
    selected: performanceEstimate(scenario),
    formats: compareWeightFormats(scenario),
    pareto: paretoCandidates(scenario),
  };
}
