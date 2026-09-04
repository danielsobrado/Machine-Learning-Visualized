import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import ForecastChart from './ForecastChart';
import {
  CONTROL_LIMITS,
  DEFAULT_SCENARIO,
  MODEL_DEFINITIONS,
  SCENARIO_PRESETS,
} from './forecastingConfig.js';
import { buildForecastLab } from './forecastingModel.js';

const formatOneDecimal = (value) => value.toFixed(1);
const formatSigned = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
const formatCount = (value) => String(value);
const formatPercent = (value) => Number.isFinite(value) ? `${value.toFixed(1)}%` : '—';

function metricValue(value) {
  return Number.isFinite(value) ? value.toFixed(2) : '—';
}

function comparisonTone(value, baseline) {
  if (value < baseline * 0.9) return 'text-emerald-700';
  if (value > baseline * 1.1) return 'text-rose-700';
  return 'text-slate-700';
}

export default function TimeSeriesForecastingTrackAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildForecastLab(scenario), [scenario]);
  const seasonalBaseline = lab.backtestSummary.find((model) => model.id === 'seasonal-naive');
  const foldMaes = lab.backtests.map((fold) => (
    fold.models.find((model) => model.id === lab.selected.id).metrics.mae
  ));
  const maxFoldMae = Math.max(...foldMaes, 1);
  const stabilityRatio = lab.selectedBacktest.bestMae > 0
    ? lab.selectedBacktest.worstMae / lab.selectedBacktest.bestMae
    : 1;

  const updateScenario = (key, value) => {
    setScenario((current) => ({ ...current, [key]: value }));
  };

  const applyPreset = (values) => {
    setScenario((current) => ({ ...current, ...values }));
  };

  return (
    <div className="nb-lesson">
      <Plate
        label="Forecasting workbench"
        title="Time Series & Forecasting"
        note="Build a forecast the way it would run in production: establish a baseline, freeze a future holdout, backtest across multiple cutoffs, inspect horizon-specific error and interval coverage, then distrust anything that uses information unavailable at prediction time."
      >
        <NoteRow>
          <Note label="Point metrics" title="MAE, RMSE, MAPE answer different questions">
            <p>MAE tracks typical absolute error, RMSE amplifies large misses, and MAPE expresses relative error but becomes unstable near zero.</p>
          </Note>
          <Note label="Quantiles" title="Pinball loss scores asymmetric forecasts">
            <p>A q=0.90 forecast is punished nine times more for underpredicting than overpredicting by the same amount.</p>
          </Note>
          <Note label="Intervals" title="Coverage is horizon-specific">
            <p>An 80% prediction interval should contain roughly 80% of future observations over repeated forecast origins, not necessarily every point in one holdout.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Generate a forecasting problem"
        actions={(
          <button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>
            Reset
          </button>
        )}
      >
        <Slider label="Seasonal amplitude" value={scenario.seasonality} {...CONTROL_LIMITS.seasonality} format={formatOneDecimal} help="Strength of the repeating 12-step pattern." onChange={(value) => updateScenario('seasonality', value)} />
        <Slider label="Trend / step" value={scenario.trend} {...CONTROL_LIMITS.trend} format={formatSigned} help="Long-run drift in the level of the series." onChange={(value) => updateScenario('trend', value)} />
        <Slider label="Noise" value={scenario.noise} {...CONTROL_LIMITS.noise} format={formatOneDecimal} help="Unpredictable variation around trend and seasonality." onChange={(value) => updateScenario('noise', value)} />
        <Slider label="Late regime shift" value={scenario.regimeShift} {...CONTROL_LIMITS.regimeShift} format={formatSigned} help="A level change near the end tests whether old validation windows still represent deployment." onChange={(value) => updateScenario('regimeShift', value)} />
        <Slider label="Forecast horizon" value={scenario.horizon} {...CONTROL_LIMITS.horizon} format={formatCount} help="How many future steps must be predicted from each cutoff." onChange={(value) => updateScenario('horizon', value)} />
        <Slider label="Rolling folds" value={scenario.folds} {...CONTROL_LIMITS.folds} format={formatCount} help="Chronological cutoffs used to estimate stability and interval coverage." onChange={(value) => updateScenario('folds', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Scenario presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Freeze the future" title="Chronological holdout with prediction interval">
        <div className="overflow-x-auto">
          <ForecastChart
            series={lab.series}
            origin={lab.origin}
            forecast={lab.selected.forecast}
            intervals={lab.selected.intervals}
            modelLabel={lab.selected.label}
          />
        </div>
      </Plate>

      <Plate label="2 · Choose the challenger" title="Metrics should match the decision cost">
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Forecast model">
          {MODEL_DEFINITIONS.map((model) => (
            <button
              key={model.id}
              type="button"
              aria-pressed={scenario.modelId === model.id}
              onClick={() => updateScenario('modelId', model.id)}
              className={`ds-btn ${scenario.modelId === model.id ? 'primary' : ''}`}
              title={model.detail}
            >
              {model.label}
            </button>
          ))}
        </div>

        <Readouts columns={4} items={[
          { label: 'Holdout MAE', value: metricValue(lab.selected.metrics.mae), detail: 'Typical absolute miss' },
          { label: 'Holdout RMSE', value: metricValue(lab.selected.metrics.rmse), detail: 'Amplifies large misses' },
          { label: 'Holdout MAPE', value: formatPercent(lab.selected.metrics.mape), detail: 'Relative error; fragile near zero' },
          { label: 'q90 pinball', value: metricValue(lab.selected.metrics.pinball90), detail: 'Asymmetric upper-quantile loss' },
          { label: '80% interval coverage', value: `${(lab.selected.metrics.intervalCoverage * 100).toFixed(0)}%`, detail: 'One holdout only; use backtests for evidence' },
          { label: 'Rolling MASE', value: metricValue(lab.selectedBacktest.mase), detail: '< 1 beats one-step naive scale' },
          { label: 'Backtest winner', value: lab.winner.label, detail: `Mean MAE ${metricValue(lab.winner.mae)}` },
        ]} />

        <div className="overflow-x-auto mt-5">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-4">Model</th><th className="py-2 pr-4">Rolling MAE</th><th className="py-2 pr-4">RMSE</th><th className="py-2 pr-4">MAPE</th><th className="py-2 pr-4">q90 pinball</th><th className="py-2">80% coverage</th></tr></thead>
            <tbody>{lab.backtestSummary.map((model) => {
              const selected = model.id === lab.selected.id;
              return (
                <tr key={model.id} className={`border-b border-slate-200 ${selected ? 'font-semibold' : ''}`}>
                  <td className="py-3 pr-4">{model.label}{selected ? ' ← selected' : ''}</td>
                  <td className={`py-3 pr-4 tabular-nums ${comparisonTone(model.mae, seasonalBaseline.mae)}`}>{metricValue(model.mae)}</td>
                  <td className="py-3 pr-4 tabular-nums">{metricValue(model.rmse)}</td>
                  <td className="py-3 pr-4 tabular-nums">{formatPercent(model.mape)}</td>
                  <td className="py-3 pr-4 tabular-nums">{metricValue(model.pinball90)}</td>
                  <td className="py-3 tabular-nums">{(model.intervalCoverage * 100).toFixed(0)}%</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="3 · Walk forward" title={`${scenario.folds} rolling-origin backtests`}>
          <div className="nb-bar-stack">
            {lab.backtests.map((fold, index) => {
              const mae = foldMaes[index];
              return (
                <BarTrack key={fold.fold} label={`Fold ${fold.fold}: train < ${fold.origin}, test ${fold.testStart}–${fold.testEnd}`} value={`MAE ${metricValue(mae)}`} width={(mae / maxFoldMae) * 100} tone={mae <= lab.selectedBacktest.mae ? 'good' : 'warn'} />
              );
            })}
          </div>
          <p className="nb-plate-note mt-4">Mean MAE {metricValue(lab.selectedBacktest.mae)}; best {metricValue(lab.selectedBacktest.bestMae)}; worst {metricValue(lab.selectedBacktest.worstMae)}. A widening spread is a regime-change warning, not something to average away blindly.</p>
        </Plate>

        <Plate label="4 · Shipping checklist" title="Would you trust this forecast?">
          <Steps items={[
            { title: 'Compare with a time-aware baseline', pass: lab.selectedBacktest.mae <= seasonalBaseline.mae, body: lab.selectedBacktest.mae <= seasonalBaseline.mae ? 'The selected model matches or beats seasonal naive across rolling folds.' : 'Seasonal naive is stronger. Complexity has not earned its place yet.' },
            { title: 'Check interval calibration', pass: lab.selectedBacktest.intervalCoverage >= 0.65 && lab.selectedBacktest.intervalCoverage <= 0.95, body: `Rolling 80% interval coverage is ${(lab.selectedBacktest.intervalCoverage * 100).toFixed(0)}%. Persistent undercoverage means uncertainty is too narrow; extreme overcoverage means it may be too wide.` },
            { title: 'Check stability across time', pass: stabilityRatio <= 2, body: stabilityRatio <= 2 ? 'Worst-fold MAE is within 2× the best fold.' : `Worst-fold MAE is ${stabilityRatio.toFixed(1)}× the best fold. Investigate drift or regime changes.` },
          ]} />
        </Plate>
      </div>

      <Plate label="5 · Horizon-specific evaluation" title="A single average can hide where the forecast fails">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-4">Horizon</th><th className="py-2 pr-4">MAE</th><th className="py-2 pr-4">RMSE</th><th className="py-2 pr-4">MAPE</th><th className="py-2 pr-4">q90 pinball</th><th className="py-2">80% coverage</th></tr></thead>
            <tbody>{lab.horizonSummary.map((row) => (
              <tr key={row.horizon} className="border-b border-slate-200">
                <td className="py-2 pr-4 font-semibold">t+{row.horizon}</td>
                <td className="py-2 pr-4 tabular-nums">{metricValue(row.mae)}</td>
                <td className="py-2 pr-4 tabular-nums">{metricValue(row.rmse)}</td>
                <td className="py-2 pr-4 tabular-nums">{formatPercent(row.mape)}</td>
                <td className="py-2 pr-4 tabular-nums">{metricValue(row.pinball90)}</td>
                <td className="py-2 tabular-nums">{(row.intervalCoverage * 100).toFixed(0)}%</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Note tone="bad" label="Metric traps" title="RMSE, MAPE and pinball can disagree for good reasons">
        <p>RMSE reacts strongly to rare catastrophic misses. MAPE can explode when actual values approach zero and should not be used blindly for intermittent or zero-heavy series. Pinball loss is appropriate when the decision needs a quantile rather than a symmetric point forecast.</p>
      </Note>

      <Note tone="bad" label="Leakage trap" title="The suspiciously good centered-window feature">
        <p>If validation uses both y[t−1] and <strong>y[t+1]</strong> to predict y[t], this scenario reports MAE {metricValue(lab.leakage.mae)} over {lab.leakage.observations} holdout points. It may look attractive, but y[t+1] does not exist when predicting y[t]. The metric is invalid regardless of how small it becomes.</p>
      </Note>

      <Note tone="accent" label="Takeaway" title="Forecasting is an evaluation discipline first">
        <p>Choose the metric from the business loss, preserve chronology, evaluate every deployment horizon separately, and score uncertainty as well as point accuracy. A model that wins on average but fails at the horizon or quantile the decision uses is not the winner.</p>
      </Note>

      <AssessmentPanel lessonId="time-series-forecasting-track" title="Forecasting check" />
    </div>
  );
}
