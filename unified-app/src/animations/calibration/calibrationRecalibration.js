import { FIT_RANGES } from './calibrationConstants.js';
import { clampProbability, logLoss, reliabilityMetrics } from './calibrationModel.js';

export function fitRecalibrator(method, bins) {
  if (method === 'none') return Object.freeze({});
  if (method === 'intercept') return fitIntercept(bins);
  if (method === 'temperature') return fitTemperature(bins);
  if (method === 'platt') return fitPlatt(bins);
  if (method === 'isotonic') return fitIsotonic(bins);
  throw new Error(`Unsupported recalibration method: ${method}`);
}

export function applyRecalibrator(method, bins, parameters) {
  return bins.map((bin) => ({
    ...bin,
    rawConfidence: bin.confidence,
    confidence: transformProbability(method, bin.confidence, parameters),
  }));
}

export function evaluateRecalibration(method, calibrationBins, evaluationBins) {
  const parameters = fitRecalibrator(method, calibrationBins);
  const calibratedBins = applyRecalibrator(method, evaluationBins, parameters);
  return {
    parameters,
    calibratedBins,
    rawMetrics: reliabilityMetrics(evaluationBins),
    calibratedMetrics: reliabilityMetrics(calibratedBins),
  };
}

export function formatParameters(method, parameters) {
  if (method === 'none') return 'identity mapping';
  if (method === 'intercept') return `logit(p) + ${parameters.intercept.toFixed(2)}`;
  if (method === 'temperature') return `temperature = ${parameters.temperature.toFixed(2)}`;
  if (method === 'isotonic') return `${parameters.blocks.length} monotone probability blocks`;
  return `slope = ${parameters.slope.toFixed(2)}, intercept = ${parameters.intercept.toFixed(2)}`;
}

function fitIntercept(bins) {
  const range = FIT_RANGES.intercept;
  let best = { loss: Number.POSITIVE_INFINITY, intercept: 0 };
  forEachRange(range, (intercept) => {
    const loss = transformedLogLoss('intercept', bins, { intercept });
    if (loss < best.loss) best = { loss, intercept };
  });
  return { intercept: best.intercept };
}

function fitTemperature(bins) {
  const range = FIT_RANGES.temperature;
  let best = { loss: Number.POSITIVE_INFINITY, temperature: 1 };
  forEachRange(range, (temperature) => {
    const loss = transformedLogLoss('temperature', bins, { temperature });
    if (loss < best.loss) best = { loss, temperature };
  });
  return { temperature: best.temperature };
}

function fitPlatt(bins) {
  let best = { loss: Number.POSITIVE_INFINITY, slope: 1, intercept: 0 };
  forEachRange(FIT_RANGES.plattSlope, (slope) => {
    forEachRange(FIT_RANGES.plattIntercept, (intercept) => {
      const loss = transformedLogLoss('platt', bins, { slope, intercept });
      if (loss < best.loss) best = { loss, slope, intercept };
    });
  });
  return { slope: best.slope, intercept: best.intercept };
}

function fitIsotonic(bins) {
  if (!Array.isArray(bins) || bins.length === 0) {
    throw new TypeError('isotonic calibration requires at least one bin');
  }

  const sorted = [...bins].sort((left, right) => left.confidence - right.confidence);
  const blocks = [];

  sorted.forEach((bin) => {
    blocks.push({
      minConfidence: bin.confidence,
      maxConfidence: bin.confidence,
      weight: bin.count,
      value: bin.observed,
    });

    while (blocks.length >= 2 && blocks.at(-2).value > blocks.at(-1).value) {
      const right = blocks.pop();
      const left = blocks.pop();
      const weight = left.weight + right.weight;
      blocks.push({
        minConfidence: left.minConfidence,
        maxConfidence: right.maxConfidence,
        weight,
        value: (left.value * left.weight + right.value * right.weight) / weight,
      });
    }
  });

  return {
    blocks: blocks.map((block) => ({
      minConfidence: block.minConfidence,
      maxConfidence: block.maxConfidence,
      value: clampProbability(block.value),
    })),
  };
}

function transformedLogLoss(method, bins, parameters) {
  return logLoss(applyRecalibrator(method, bins, parameters));
}

function transformProbability(method, probability, parameters) {
  if (method === 'none') return probability;
  if (method === 'isotonic') {
    const blocks = parameters.blocks;
    const block = blocks.find((candidate) => probability <= candidate.maxConfidence) || blocks.at(-1);
    return clampProbability(block.value);
  }

  const score = logit(probability);
  if (method === 'intercept') return sigmoid(score + parameters.intercept);
  if (method === 'temperature') return sigmoid(score / parameters.temperature);
  return sigmoid(parameters.slope * score + parameters.intercept);
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function logit(probability) {
  const safeProbability = clampProbability(probability);
  return Math.log(safeProbability / (1 - safeProbability));
}

function forEachRange(range, callback) {
  const steps = Math.round((range.max - range.min) / range.step);
  for (let index = 0; index <= steps; index += 1) {
    callback(range.min + index * range.step);
  }
}
