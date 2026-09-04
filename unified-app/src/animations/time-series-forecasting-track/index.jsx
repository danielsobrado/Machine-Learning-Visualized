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
        note="Build a forecast the way it would run in production: establish a baseline, freeze a future holdout, backtest across multiple cutoffs, inspect error stability, then distrust anything that uses information unavailable at prediction time."
      >
        <NoteRow>
          <Note label="Goal" title="Beat a credible baseline">
            <p>A forecasting model is useful only when it improves on a simple time-aware alternative such as naive or seasonal naive.</p>
          </Note>
          <Note label="Constraint" title="The future stays hidden">
            <p>Every feature, transformation, model fit, and metric must use only information that existed at the forecast origin.</p>
          </Note>
          <Note label="Evidence" title="One split is not enough">
            <p>Rolling-origin backtests expose whether performance survives different seasons and changing regimes.</p>
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
        <Slider
          label="Seasonal amplitude"
          value={scenario.seasonality}
          {...CONTROL_LIMITS.seasonality}
          format={formatOneDecimal}
          help="Strength of the repeating 12-step pattern."
          onChange={(value) => updateScenario('seasonality', value)}
        />
        <Slider
          label="Trend / step"
          value={scenario.trend}
          {...CONTROL_LIMITS.trend}
          format={formatSigned}
          help="Long-run drift in the level of the series."
          onChange={(value) => updateScenario('trend', value)}
        />
        <Slider
          label="Noise"
          value={scenario.noise}
          {...CONTROL_LIMITS.noise}
          format={formatOneDecimal}
          help="Unpredictable variation around trend and seasonality."
          onChange={(value) => updateScenario('noise', value)}
        />
        <Slider
          label="Late regime shift"
          value={scenario.regimeShift}
          {...CONTROL_LIMITS.regimeShift}
          format={formatSigned}
          help="A level change near the end tests whether old validation windows still represent deployment."
          onChange={(value) => updateScenario('regimeShift', value)}
        />
        <Slider
          label="Forecast horizon"
          value={scenario.horizon}
          {...CONTROL_LIMITS.horizon}
          format={formatCount}
          help="How many future steps must be predicted from each cutoff."
          onChange={(value) => updateScenario('horizon', value)}
        />
        <Slider
          label="Rolling folds"
          value={scenario.folds}
          {...CONTROL_LIMITS.folds}
          format={formatCount}
          help="Independent chronological cutoffs used to estimate stability."
          onChange={(value) => updateScenario('folds', value)}
        />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Scenario presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="ds-btn"
            onClick={() => applyPreset(preset.values)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <Plate label="1 · Freeze the future" title="Chronological holdout">
        <div className="overflow-x-auto">
          <ForecastChart
            series={lab.series}
            origin={lab.origin}
            forecast={lab.selected.forecast}
            modelLabel={lab.selected.label}
          />
        </div>
      </Plate>

      <Plate label="2 · Choose the challenger" title="Baselines before clever models">
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

        <Readouts
          columns={4}
          items={[
            { label: 'Holdout MAE', value: metricValue(lab.selected.metrics.mae), detail: 'Average absolute miss' },
            { label: 'Holdout RMSE', value: metricValue(lab.selected.metrics.rmse), detail: 'Punishes large misses' },
            { label: 'Holdout MASE', value: metricValue(lab.selected.metrics.mase), detail: '< 1 beats one-step naive scale' },
            { label: 'Backtest winner', value: lab.winner.label, detail: `Mean MAE ${metricValue(lab.winner.mae)}` },
          ]}
        />

        <div className="overflow-x-auto mt-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Model</th>
                <th className="py-2 pr-4">Holdout MAE</th>
                <th className="py-2 pr-4">Holdout MASE</th>
                <th className="py-2 pr-4">Rolling MAE</th>
                <th className="py-2">Fold range</th>
              </tr>
            </thead>
            <tbody>
              {lab.holdout.map((model) => {
                const rolling = lab.backtestSummary.find((candidate) => candidate.id === model.id);
                const selected = model.id === lab.selected.id;
                return (
                  <tr key={model.id} className={`border-b border-slate-200 ${selected ? 'font-semibold' : ''}`}>
                    <td className="py-3 pr-4">
                      {model.label}{selected ? ' ← selected' : ''}
                      <div className="font-normal text-xs text-slate-500 mt-1">{model.detail}</div>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{metricValue(model.metrics.mae)}</td>
                    <td className="py-3 pr-4 tabular-nums">{metricValue(model.metrics.mase)}</td>
                    <td className={`py-3 pr-4 tabular-nums ${comparisonTone(rolling.mae, seasonalBaseline.mae)}`}>
                      {metricValue(rolling.mae)}
                    </td>
                    <td className="py-3 tabular-nums text-slate-600">
                      {metricValue(rolling.bestMae)}–{metricValue(rolling.worstMae)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="3 · Walk forward" title={`${scenario.folds} rolling-origin backtests`}>
          <div className="nb-bar-stack">
            {lab.backtests.map((fold, index) => {
              const mae = foldMaes[index];
              return (
                <BarTrack
                  key={fold.fold}
                  label={`Fold ${fold.fold}: train < ${fold.origin}, test ${fold.testStart}–${fold.testEnd}`}
                  value={`MAE ${metricValue(mae)}`}
                  width={(mae / maxFoldMae) * 100}
                  tone={mae <= lab.selectedBacktest.mae ? 'good' : 'warn'}
                />
              );
            })}
          </div>
          <p className="nb-plate-note mt-4">
            Mean MAE {metricValue(lab.selectedBacktest.mae)}; best {metricValue(lab.selectedBacktest.bestMae)}; worst {metricValue(lab.selectedBacktest.worstMae)}. A widening spread is a regime-change warning, not something to average away blindly.
          </p>
        </Plate>

        <Plate label="4 · Shipping checklist" title="Would you trust this forecast?">
          <Steps
            items={[
              {
                title: 'Compare with a time-aware baseline',
                pass: lab.selectedBacktest.mae <= seasonalBaseline.mae,
                body: lab.selectedBacktest.mae <= seasonalBaseline.mae
                  ? `The selected model matches or beats seasonal naive across rolling folds.`
                  : `Seasonal naive is stronger. Complexity has not earned its place yet.`,
              },
              {
                title: 'Demand scaled error below naive',
                pass: lab.selectedBacktest.mase < 1,
                body: lab.selectedBacktest.mase < 1
                  ? `Rolling MASE is ${metricValue(lab.selectedBacktest.mase)}, below the naive error scale.`
                  : `Rolling MASE is ${metricValue(lab.selectedBacktest.mase)}. A naive reference is still competitive.`,
              },
              {
                title: 'Check stability across time',
                pass: stabilityRatio <= 2,
                body: stabilityRatio <= 2
                  ? `Worst-fold MAE is within 2× the best fold.`
                  : `Worst-fold MAE is ${stabilityRatio.toFixed(1)}× the best fold. Investigate drift or regime changes.`,
              },
            ]}
          />
        </Plate>
      </div>

      <Note tone="bad" label="Leakage trap" title="The suspiciously good centered-window feature">
        <p>
          If validation uses both y[t−1] and <strong>y[t+1]</strong> to predict y[t], this scenario reports MAE {metricValue(lab.leakage.mae)} over {lab.leakage.observations} holdout points. It may look attractive, but y[t+1] does not exist when predicting y[t]. The metric is invalid regardless of how small it becomes.
        </p>
      </Note>

      <Note tone="accent" label="Takeaway" title="Forecasting is an evaluation discipline first">
        <p>
          Start with naive baselines, preserve chronology, match the backtest horizon to deployment, inspect fold-by-fold stability, and treat every feature as guilty until you can prove it was knowable at prediction time. Only then is a lower error worth celebrating.
        </p>
      </Note>

      <AssessmentPanel lessonId="time-series-forecasting-track" title="Forecasting check" />
    </div>
  );
}
