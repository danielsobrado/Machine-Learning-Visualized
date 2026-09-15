import React from 'react';

import { BarTrack, Formula, Note, NoteRow, Plate, Readouts } from '../../animations/_shared/notebook.jsx';
import {
  LINEAR_REGRESSION_NEXT_DEFAULTS,
  LOGISTIC_REGRESSION_NEXT_DEFAULTS,
} from './classicalMlNextConstants.js';
import {
  analyzeRobustRegression,
  calculateRegressionIntervals,
  compareThresholdPolicies,
  shiftProbabilityByLogit,
} from './classicalMlNextModel.js';

const formatNumber = (value, digits = 2) => value.toFixed(digits);
const formatProbability = (value) => `${(value * 100).toFixed(1)}%`;

function LinearRegressionAdvancedLab() {
  const intervals = calculateRegressionIntervals(LINEAR_REGRESSION_NEXT_DEFAULTS);
  const robustness = analyzeRobustRegression(
    LINEAR_REGRESSION_NEXT_DEFAULTS.points,
    LINEAR_REGRESSION_NEXT_DEFAULTS.probeX,
  );

  return (
    <>
      <Plate
        label="Uncertainty"
        title="Mean confidence is not future-observation confidence"
        note="The prediction interval adds irreducible observation noise on top of uncertainty in the estimated mean."
      >
        <Readouts items={[
          { label: 'Predicted mean', value: formatNumber(LINEAR_REGRESSION_NEXT_DEFAULTS.prediction) },
          { label: '95% confidence half-width', value: `±${formatNumber(intervals.confidenceHalfWidth)}` },
          { label: '95% prediction half-width', value: `±${formatNumber(intervals.predictionHalfWidth)}` },
        ]} />
        <Formula lines={[
          'SE(mean at x₀) = s √(1/n + (x₀ − x̄)²/Sxx)',
          'SE(new y at x₀) = s √(1 + 1/n + (x₀ − x̄)²/Sxx)',
        ]} />
        <BarTrack
          label="Confidence interval width"
          value={formatNumber(intervals.confidenceHalfWidth * 2)}
          width={(intervals.confidenceHalfWidth / intervals.predictionHalfWidth) * 100}
        />
        <BarTrack
          label="Prediction interval width"
          value={formatNumber(intervals.predictionHalfWidth * 2)}
          width={100}
          tone="warn"
        />
      </Plate>

      <Plate
        label="Robustness"
        title="One response outlier can rotate least squares"
        note="Theil–Sen uses the median pairwise slope, so a single extreme response has much less leverage over the fitted trend."
      >
        <Readouts items={[
          { label: 'OLS slope', value: formatNumber(robustness.ordinary.slope) },
          { label: 'Theil–Sen slope', value: formatNumber(robustness.robust.slope) },
          { label: `OLS prediction at x=${LINEAR_REGRESSION_NEXT_DEFAULTS.probeX}`, value: formatNumber(robustness.ordinaryPrediction) },
          { label: `Robust prediction at x=${LINEAR_REGRESSION_NEXT_DEFAULTS.probeX}`, value: formatNumber(robustness.robustPrediction) },
        ]} />
        <Note tone="warn" title="Diagnostic rule">
          A narrow confidence interval around a biased or outlier-dominated fit is still a bad model. Inspect residual structure and influence before trusting interval width.
        </Note>
      </Plate>
    </>
  );
}

function LogisticRegressionAdvancedLab() {
  const shiftedProbability = shiftProbabilityByLogit(
    LOGISTIC_REGRESSION_NEXT_DEFAULTS.probability,
    LOGISTIC_REGRESSION_NEXT_DEFAULTS.logitShift,
  );
  const policy = compareThresholdPolicies(LOGISTIC_REGRESSION_NEXT_DEFAULTS);

  return (
    <>
      <Plate
        label="Calibration shift"
        title="The same ranking can produce different deployment decisions"
        note="A log-odds calibration shift changes the absolute probability even when ranking information is unchanged."
      >
        <Readouts items={[
          { label: 'Original score', value: formatProbability(LOGISTIC_REGRESSION_NEXT_DEFAULTS.probability) },
          { label: 'Shifted score', value: formatProbability(shiftedProbability) },
          { label: 'Logit shift', value: formatNumber(LOGISTIC_REGRESSION_NEXT_DEFAULTS.logitShift, 1) },
        ]} />
        <Formula lines={[
          'logit(p′) = logit(p) + Δ',
          'p′ = sigmoid(logit(p) + Δ)',
        ]} />
        <Note tone="warn" title="Operational consequence">
          A threshold chosen on the old probability scale can become wrong after calibration drift even if AUC barely changes.
        </Note>
      </Plate>

      <Plate
        label="Threshold policy"
        title="Business costs may favor different subgroup thresholds"
        note="This is a cost optimization exercise, not a fairness guarantee. Fairness constraints must be evaluated separately."
      >
        <Readouts items={[
          { label: 'Global threshold', value: formatNumber(policy.global.threshold, 1) },
          { label: 'Global policy cost', value: formatNumber(policy.global.totalCost, 0) },
          { label: 'Group-specific cost', value: formatNumber(policy.groupSpecificCost, 0) },
          { label: 'Cost reduction', value: formatNumber(policy.costReduction, 0) },
        ]} />
        <NoteRow>
          {policy.groupPolicies.map((groupPolicy) => (
            <Note key={groupPolicy.group} title={`Group ${groupPolicy.group}`}>
              Best tested threshold: <strong>{formatNumber(groupPolicy.threshold, 1)}</strong>. Cost: <strong>{groupPolicy.totalCost}</strong>.
            </Note>
          ))}
        </NoteRow>
        <Note tone="warn" title="Keep the objectives separate">
          Different costs can justify different operating points, but subgroup calibration, equalized odds, legal constraints, and product policy remain separate questions.
        </Note>
      </Plate>
    </>
  );
}

export default function RegressionPolicyNextLab({ lessonId }) {
  if (lessonId === 'linear-regression') return <LinearRegressionAdvancedLab />;
  if (lessonId === 'logistic-regression') return <LogisticRegressionAdvancedLab />;
  return null;
}
