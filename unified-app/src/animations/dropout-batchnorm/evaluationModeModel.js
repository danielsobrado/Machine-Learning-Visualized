export function buildEvaluationModeState({ trainingMode, recordGradients }) {
  if (typeof trainingMode !== 'boolean') throw new TypeError('trainingMode must be boolean');
  if (typeof recordGradients !== 'boolean') throw new TypeError('recordGradients must be boolean');

  return {
    trainingMode,
    recordGradients,
    dropoutStochastic: trainingMode,
    batchNormUsesBatchStats: trainingMode,
    batchNormUpdatesRunningState: trainingMode,
    autogradRecordsGraph: recordGradients,
    ordinaryInferenceReady: !trainingMode && !recordGradients,
  };
}
