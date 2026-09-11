import { metricsFromCounts } from '../animations/classification-metrics/classificationMetricsModel.js';
import { RESIDUAL_SCENARIOS } from '../animations/linear-regression/linearRegressionConstants.js';
import { diagnoseResidualPattern } from '../animations/linear-regression/linearRegressionModel.js';
import { distributionMoments } from '../animations/probability-distributions/distributionModel.js';

function freezeResiduals(residuals) {
  return Object.freeze(residuals.map(({ predictedY, error }) => Object.freeze({
    fitted: predictedY,
    residual: error,
  })));
}

export function normalDistributionAssessmentState({ mean, sigma, marker }) {
  const moments = distributionMoments({ family: 'normal', mean, sigma });
  return Object.freeze({
    family: 'Normal',
    mean: moments.mean,
    standardDeviation: Math.sqrt(moments.variance),
    marker,
  });
}

export function linearRegressionResidualAssessmentState(scenarioId = 'nonlinear') {
  const scenario = RESIDUAL_SCENARIOS[scenarioId];
  if (!scenario) throw new RangeError(`unsupported residual scenario: ${scenarioId}`);

  const diagnosis = diagnoseResidualPattern(scenario.points);
  const pattern = diagnosis.status === 'nonlinear'
    ? 'U-shaped'
    : diagnosis.status === 'heteroscedastic'
      ? 'fan-out'
      : 'random';

  return Object.freeze({
    type: 'residual-diagnostic',
    status: diagnosis.status,
    residualPattern: pattern,
    residuals: freezeResiduals(diagnosis.residuals),
    r2: diagnosis.r2,
    rmse: diagnosis.rmse,
  });
}

export function classificationThresholdAssessmentState({
  threshold,
  counts,
  falseNegativeCost = 'high',
}) {
  const metrics = metricsFromCounts(counts);
  return Object.freeze({
    type: 'threshold-confusion',
    threshold,
    precision: metrics.precision,
    recall: metrics.recall,
    falseNegativeCost,
    confusion: Object.freeze({ ...counts }),
  });
}
