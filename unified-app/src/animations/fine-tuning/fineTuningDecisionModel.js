import {
  BYTES_PER_ADAM_MOMENTS,
  BYTES_PER_BF16_WEIGHT,
  BYTES_PER_INT4_WEIGHT,
} from './fineTuningDecisionConstants.js';

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new TypeError(`${name} must be a positive integer`);
}

function requirePositiveNumber(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${name} must be positive`);
}

export function loraTrainableParameters({ layers, dModel, rank, adaptedMatricesPerLayer }) {
  [layers, dModel, rank, adaptedMatricesPerLayer].forEach((value, index) => {
    requirePositiveInteger(value, ['layers', 'dModel', 'rank', 'adaptedMatricesPerLayer'][index]);
  });
  return layers * adaptedMatricesPerLayer * (2 * rank * dModel);
}

export function fineTuningResourceTable({ baseParameters, layers, dModel, rank, adaptedMatricesPerLayer }) {
  requirePositiveNumber(baseParameters, 'baseParameters');
  const adapterParameters = loraTrainableParameters({ layers, dModel, rank, adaptedMatricesPerLayer });

  const methods = [
    {
      id: 'full',
      label: 'Full fine-tuning',
      trainableParameters: baseParameters,
      baseWeightBytes: baseParameters * BYTES_PER_BF16_WEIGHT,
      optimizerMomentBytes: baseParameters * BYTES_PER_ADAM_MOMENTS,
      note: 'All model weights receive gradients and optimizer state.',
    },
    {
      id: 'lora',
      label: 'LoRA',
      trainableParameters: adapterParameters,
      baseWeightBytes: baseParameters * BYTES_PER_BF16_WEIGHT,
      optimizerMomentBytes: adapterParameters * BYTES_PER_ADAM_MOMENTS,
      note: 'Base weights stay frozen; low-rank adapters are trained.',
    },
    {
      id: 'qlora',
      label: 'QLoRA',
      trainableParameters: adapterParameters,
      baseWeightBytes: baseParameters * BYTES_PER_INT4_WEIGHT,
      optimizerMomentBytes: adapterParameters * BYTES_PER_ADAM_MOMENTS,
      note: 'Frozen base weights are quantized while LoRA adapters train.',
    },
  ];

  return methods.map((method) => ({
    ...method,
    trainableFraction: method.trainableParameters / baseParameters,
  }));
}

export function fineTuningDataRisks({ benchmarkOverlap, formatMatch, domainExamples }) {
  if (typeof benchmarkOverlap !== 'boolean' || typeof formatMatch !== 'boolean') {
    throw new TypeError('benchmarkOverlap and formatMatch must be booleans');
  }
  requirePositiveInteger(domainExamples, 'domainExamples');

  const risks = [];
  if (benchmarkOverlap) {
    risks.push({
      id: 'contamination',
      severity: 'critical',
      title: 'Evaluation contamination',
      detail: 'Benchmark answers in SFT data invalidate that benchmark as an independent test.',
    });
  }
  if (!formatMatch) {
    risks.push({
      id: 'format',
      severity: 'high',
      title: 'Train/serve format mismatch',
      detail: 'A different chat template or control-token format can erase gains even when task examples are good.',
    });
  }
  if (domainExamples < 500) {
    risks.push({
      id: 'coverage',
      severity: 'medium',
      title: 'Thin task coverage',
      detail: 'Very few examples can make validation noisy and encourage memorization of narrow patterns.',
    });
  }
  return risks;
}

export function bytesToGiB(bytes) {
  requirePositiveNumber(bytes, 'bytes');
  return bytes / (1024 ** 3);
}
