import assert from 'node:assert/strict';
import test from 'node:test';

import { buildEvaluationModeState } from './evaluationModeModel.js';

test('evaluation mode does not disable gradient recording', () => {
  const state = buildEvaluationModeState({ trainingMode: false, recordGradients: true });
  assert.equal(state.dropoutStochastic, false);
  assert.equal(state.batchNormUsesBatchStats, false);
  assert.equal(state.autogradRecordsGraph, true);
  assert.equal(state.ordinaryInferenceReady, false);
});

test('disabling gradient recording does not switch modules to evaluation behavior', () => {
  const state = buildEvaluationModeState({ trainingMode: true, recordGradients: false });
  assert.equal(state.dropoutStochastic, true);
  assert.equal(state.batchNormUsesBatchStats, true);
  assert.equal(state.batchNormUpdatesRunningState, true);
  assert.equal(state.autogradRecordsGraph, false);
  assert.equal(state.ordinaryInferenceReady, false);
});

test('ordinary inference needs both evaluation behavior and no gradient graph', () => {
  const state = buildEvaluationModeState({ trainingMode: false, recordGradients: false });
  assert.equal(state.ordinaryInferenceReady, true);
});

test('invalid mode flags fail explicitly', () => {
  assert.throws(() => buildEvaluationModeState({ trainingMode: 'false', recordGradients: false }), TypeError);
  assert.throws(() => buildEvaluationModeState({ trainingMode: false, recordGradients: 0 }), TypeError);
});
