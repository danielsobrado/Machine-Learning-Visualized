import React, { useMemo, useState } from 'react';
import { Database, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import {
  BATCH_SCENARIOS,
  DROPOUT_BATCHNORM_DEFAULTS,
} from './dropoutBatchNormConstants.js';
import {
  inferenceBatchNorm,
  trainingBatchNorm,
  updateRunningState,
} from './dropoutBatchNormModel.js';

function Metric({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
  );
}

function RangeControl({ label, value, min, max, step, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="font-mono text-xs">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-cyan-600"
      />
    </label>
  );
}

function BatchRow({ values, outputs }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={`rounded-xl border p-3 ${index === 0 ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-slate-50'}`}
        >
          <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span>{index === 0 ? 'Selected' : `Neighbor ${index}`}</span>
            <span>x={value.toFixed(2)}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <span className="text-slate-500">x̂</span>
            <span className="text-right font-mono font-bold text-slate-900">{outputs[index].normalized.toFixed(3)}</span>
            <span className="text-slate-500">y</span>
            <span className="text-right font-mono font-bold text-slate-900">{outputs[index].output.toFixed(3)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BatchNormWorkbench() {
  const defaults = DROPOUT_BATCHNORM_DEFAULTS;
  const [scenarioId, setScenarioId] = useState(defaults.scenarioId);
  const [gamma, setGamma] = useState(defaults.gamma);
  const [beta, setBeta] = useState(defaults.beta);
  const [updateWeight, setUpdateWeight] = useState(defaults.updateWeight);
  const [mode, setMode] = useState('train');
  const [runningState, setRunningState] = useState({
    mean: defaults.runningMean,
    variance: defaults.runningVariance,
  });

  const scenario = BATCH_SCENARIOS[scenarioId];
  const training = useMemo(
    () => trainingBatchNorm(scenario.values, { gamma, beta }),
    [beta, gamma, scenario.values],
  );
  const inference = useMemo(
    () => inferenceBatchNorm(scenario.values[0], runningState, { gamma, beta }),
    [beta, gamma, runningState, scenario.values],
  );
  const previewRunningState = useMemo(
    () => updateRunningState(runningState, training.stats, updateWeight),
    [runningState, training.stats, updateWeight],
  );
  const selectedOutput = mode === 'train' ? training.selected.output : inference.output;

  const resetRunningState = () => setRunningState({
    mean: defaults.runningMean,
    variance: defaults.runningVariance,
  });

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">BatchNorm workbench</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Make the statistics come from the batch</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Keep the first activation selected and change its neighbors. Training computes statistics from this mini-batch;
            evaluation uses the stored running state instead.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {['train', 'eval'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-wide ${mode === value ? 'bg-slate-950 text-white' : 'text-slate-600'}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <SlidersHorizontal size={17} /> Experiment controls
          </div>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Mini-batch
            <select
              value={scenarioId}
              onChange={(event) => setScenarioId(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              {Object.entries(BATCH_SCENARIOS).map(([id, item]) => (
                <option key={id} value={id}>{item.label}</option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-500">{scenario.description}</p>

          <div className="mt-5 space-y-4">
            <RangeControl label="γ · learned scale" value={gamma} min={0.25} max={2} step={0.05} onChange={setGamma} />
            <RangeControl label="β · learned shift" value={beta} min={-2} max={2} step={0.05} onChange={setBeta} />
            <RangeControl label="EMA update weight α" value={updateWeight} min={0} max={1} step={0.05} onChange={setUpdateWeight} />
          </div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Batch μ" value={training.stats.mean.toFixed(3)} helper="Computed from the displayed mini-batch." />
            <Metric label="Batch variance" value={training.stats.variance.toFixed(3)} helper="Population variance used by this teaching forward pass." />
            <Metric label="Running μ" value={runningState.mean.toFixed(3)} helper="Stored inference state; not a gradient parameter." />
            <Metric label="Selected output" value={selectedOutput.toFixed(3)} helper={mode === 'train' ? 'Uses current batch statistics.' : 'Uses stored running statistics.'} />
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-slate-950">One feature across the mini-batch</h3>
                <p className="text-xs text-slate-500">x̂=(x−μ)/√(variance+ε), then y=γx̂+β.</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">batch size {scenario.values.length}</span>
            </div>
            <BatchRow values={scenario.values} outputs={training.outputs} />
            {scenarioId === 'singleton' && (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                With one scalar observation for this feature, variance is 0, so the standardized value collapses to 0 and the affine output becomes β. Real frameworks may reject configurations with too few values per channel rather than silently train on such statistics.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-black text-emerald-950"><Database size={17} /> Running-state update</div>
                <p className="mt-1 text-xs leading-5 text-emerald-900">
                  Teaching EMA: next=(1−α)·running + α·batch. Frameworks differ in momentum naming and variance-estimator details.
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={resetRunningState} className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-black text-emerald-900">
                  <RefreshCcw size={14} className="mr-1 inline" /> Reset
                </button>
                <button type="button" onClick={() => setRunningState(previewRunningState)} className="rounded-lg bg-emerald-800 px-3 py-2 text-xs font-black text-white">
                  Apply this batch
                </button>
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-3 text-sm">
                <span className="text-slate-500">mean</span>
                <strong className="float-right font-mono text-slate-950">{runningState.mean.toFixed(3)} → {previewRunningState.mean.toFixed(3)}</strong>
              </div>
              <div className="rounded-lg bg-white p-3 text-sm">
                <span className="text-slate-500">variance</span>
                <strong className="float-right font-mono text-slate-950">{runningState.variance.toFixed(3)} → {previewRunningState.variance.toFixed(3)}</strong>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
