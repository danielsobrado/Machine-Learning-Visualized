import assert from 'node:assert/strict';
import test from 'node:test';

import { metricsFromCounts } from '../animations/classification-metrics/classificationMetricsModel.js';
import { RESIDUAL_SCENARIOS } from '../animations/linear-regression/linearRegressionConstants.js';
import { diagnoseResidualPattern } from '../animations/linear-regression/linearRegressionModel.js';
import { distributionMoments } from '../animations/probability-distributions/distributionModel.js';
import { getLessonAssessment } from './lessonAssessments.js';
import {
  classificationThresholdAssessmentState,
  linearRegressionResidualAssessmentState,
  normalDistributionAssessmentState,
} from './assessmentVisualizerStateAdapters.js';

function scenarioState(lessonId, scenarioId) {
  const scenario = getLessonAssessment(lessonId).scenarioQuestions.find(({ id }) => id === scenarioId);
  assert.ok(scenario, `missing ${lessonId} scenario ${scenarioId}`);
  return scenario.visualState;
}

test('normal assessment state is derived from the lesson distribution model', () => {
  const state = normalDistributionAssessmentState({ mean: 0, sigma: 2, marker: 4 });
  const moments = distributionMoments({ family: 'normal', mean: 0, sigma: 2 });

  assert.equal(state.mean, moments.mean);
  assert.equal(state.standardDeviation, Math.sqrt(moments.variance));
  assert.equal(state.marker, 4);
});

test('linear-regression assessment state is derived from the lesson residual diagnosis', () => {
  const state = linearRegressionResidualAssessmentState('nonlinear');
  const diagnosis = diagnoseResidualPattern(RESIDUAL_SCENARIOS.nonlinear.points);

  assert.equal(state.status, diagnosis.status);
  assert.equal(state.residualPattern, 'U-shaped');
  assert.deepEqual(
    state.residuals,
    diagnosis.residuals.map(({ predictedY, error }) => ({ fitted: predictedY, residual: error })),
  );
});

test('classification assessment state is derived from the lesson confusion metrics model', () => {
  const counts = { tp: 28, fp: 2, fn: 62, tn: 108 };
  const state = classificationThresholdAssessmentState({ threshold: 0.8, counts });
  const metrics = metricsFromCounts(counts);

  assert.equal(state.precision, metrics.precision);
  assert.equal(state.recall, metrics.recall);
  assert.deepEqual(state.confusion, counts);
});

test('live representative assessment states use canonical adapters and stay serializable', () => {
  const states = [
    scenarioState('probability-distributions', 'prob-visual-normal-spread'),
    scenarioState('linear-regression', 'lr-visual-residual-curve'),
    scenarioState('classification-metrics', 'metrics-visual-threshold-cost'),
  ];

  assert.deepEqual(states[0], normalDistributionAssessmentState({ mean: 0, sigma: 2, marker: 4 }));
  assert.deepEqual(states[1], linearRegressionResidualAssessmentState('nonlinear'));
  assert.deepEqual(states[2], classificationThresholdAssessmentState({
    threshold: 0.8,
    counts: { tp: 28, fp: 2, fn: 62, tn: 108 },
    falseNegativeCost: 'high',
  }));

  for (const state of states) {
    assert.deepEqual(JSON.parse(JSON.stringify(state)), state);
  }
});
