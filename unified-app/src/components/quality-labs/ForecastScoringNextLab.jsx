import React from 'react';

import { BarTrack, Note, Plate, Readouts } from '../../animations/_shared/notebook.jsx';
import { FORECAST_SCORING_DEFAULTS } from './classicalMlNextConstants.js';
import { scoreForecastRows } from './classicalMlNextModel.js';

const formatNumber = (value, digits = 1) => value.toFixed(digits);
const formatPercent = (value) => `${(value * 100).toFixed(0)}%`;

export default function ForecastScoringNextLab() {
  const result = scoreForecastRows(FORECAST_SCORING_DEFAULTS);
  const maxCost = Math.max(...result.byHorizon.map(({ averageCost }) => averageCost), 1);

  return (
    <>
      <Plate
        label="Decision-aware scoring"
        title="Equal absolute errors can have unequal business cost"
        note="Under-forecasting is four times as expensive as over-forecasting in this scenario, so MAE alone cannot describe the operating objective."
      >
        <Readouts items={[
          { label: 'Under-forecast unit cost', value: formatNumber(FORECAST_SCORING_DEFAULTS.underForecastCost, 0) },
          { label: 'Over-forecast unit cost', value: formatNumber(FORECAST_SCORING_DEFAULTS.overForecastCost, 0) },
          { label: 'Total business cost', value: formatNumber(result.totalCost, 0) },
          { label: 'Overall interval coverage', value: formatPercent(result.overallCoverage) },
        ]} />
        <Note tone="warn" title="Metric choice follows the decision">
          RMSE or MAE can still be useful diagnostics, but the release decision should also score the asymmetric consequence the business actually pays.
        </Note>
      </Plate>

      <Plate
        label="Horizon calibration"
        title="Aggregate coverage can hide where intervals fail"
        note="Coverage and decision cost are reported separately at each horizon so long-range degradation cannot be averaged away."
      >
        {result.byHorizon.map((row) => (
          <div key={row.horizon} className="mb-5 last:mb-0">
            <BarTrack
              label={`Horizon ${row.horizon} average business cost`}
              value={formatNumber(row.averageCost)}
              width={(row.averageCost / maxCost) * 100}
              tone={row.horizon === 1 ? 'accent' : 'warn'}
            />
            <div className="mt-2 text-sm text-[var(--ds-faint)]">
              MAE {formatNumber(row.mae)} · interval coverage {formatPercent(row.coverage)}
            </div>
          </div>
        ))}
      </Plate>

      <Note tone="neutral" title="Two different questions">
        Business cost asks whether the point forecast supports the decision. Coverage asks whether uncertainty intervals contain outcomes at the promised rate. A forecasting system can improve one while worsening the other.
      </Note>
    </>
  );
}
