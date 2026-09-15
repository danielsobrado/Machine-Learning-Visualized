function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive integer`);
}

function requirePositive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be positive`);
}

export function warmupProgress({
  optimizerStep,
  accumulationSteps,
  warmupOptimizerSteps,
  cadence,
}) {
  requirePositiveInteger(optimizerStep, 'optimizerStep');
  requirePositiveInteger(accumulationSteps, 'accumulationSteps');
  requirePositiveInteger(warmupOptimizerSteps, 'warmupOptimizerSteps');
  if (cadence !== 'optimizer-step' && cadence !== 'micro-batch') {
    throw new RangeError(`unsupported cadence: ${cadence}`);
  }

  const schedulerTicks = cadence === 'optimizer-step'
    ? optimizerStep
    : optimizerStep * accumulationSteps;

  return Math.min(1, schedulerTicks / warmupOptimizerSteps);
}

export function learningRateAtStep({ targetLearningRate, ...config }) {
  requirePositive(targetLearningRate, 'targetLearningRate');
  return targetLearningRate * warmupProgress(config);
}

export function schedulerCadenceSummary({ accumulationSteps, warmupOptimizerSteps }) {
  requirePositiveInteger(accumulationSteps, 'accumulationSteps');
  requirePositiveInteger(warmupOptimizerSteps, 'warmupOptimizerSteps');

  const microBatchesUntilTarget = warmupOptimizerSteps;
  const completedOptimizerStepsAtBugTarget = Math.floor(microBatchesUntilTarget / accumulationSteps);
  const microBatchesIntoNextStep = microBatchesUntilTarget % accumulationSteps;

  return {
    correct: {
      optimizerStepsUntilTarget: warmupOptimizerSteps,
      microBatchesUntilTarget: warmupOptimizerSteps * accumulationSteps,
    },
    microBatchBug: {
      schedulerTicksUntilTarget: warmupOptimizerSteps,
      microBatchesUntilTarget,
      completedOptimizerStepsAtTarget: completedOptimizerStepsAtBugTarget,
      microBatchesIntoNextStep,
    },
    compressionFactor: accumulationSteps,
  };
}
