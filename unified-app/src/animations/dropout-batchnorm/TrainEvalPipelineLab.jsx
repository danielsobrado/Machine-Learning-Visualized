import React, { useMemo, useState } from 'react';
import { Activity, RefreshCw, ShieldCheck } from 'lucide-react';
import { BATCH_SCENARIOS, DROPOUT_BATCHNORM_DEFAULTS, DROPOUT_DEMO } from './dropoutBatchNormConstants.js';
import { modePipelinePasses } from './modePipelineModel.js';

function OutputDots({ samples }) {
  const max = Math.max(1, ...samples.map((sample) => Math.abs(sample.output)));
  return (
    <div className="flex min-h-28 items-center gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
      {samples.map((sample) => (
        <div key={sample.index} className="flex min-w-7 flex-col items-center justify-end gap-1">
          <div
            className={`w-5 rounded-t ${sample.output === 0 ? 'bg-slate-300' : 'bg-cyan-500'}`}
            style={{ height: `${Math.max(4, (Math.abs(sample.output) / max) * 72)}px` }}
            title={`pass ${sample.index + 1}: ${sample.output.toFixed(3)}`}
          />
          <span className="text-[10px] text-slate-400">{sample.index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export default function TrainEvalPipelineLab() {
  const defaults = DROPOUT_BATCHNORM_DEFAULTS;
  const [scenarioId, setScenarioId] = useState(defaults.scenarioId);
  const [dropoutRate, setDropoutRate] = useState(defaults.dropoutRate);
  const [seed, setSeed] = useState(DROPOUT_DEMO.initialSeed);
  const batch = BATCH_SCENARIOS[scenarioId].values;
  const runningState = { mean: defaults.runningMean, variance: defaults.runningVariance };

  const training = useMemo(() => modePipelinePasses({
    batch,
    selectedIndex: 0,
    runningState,
    dropoutRate,
    trainingMode: true,
    passes: 12,
    seed,
  }), [batch, dropoutRate, runningState.mean, runningState.variance, seed]);

  const evaluation = useMemo(() => modePipelinePasses({
    batch,
    selectedIndex: 0,
    runningState,
    dropoutRate,
    trainingMode: false,
    passes: 12,
    seed,
  }), [batch, dropoutRate, runningState.mean, runningState.variance, seed]);

  return (
    <section className="space-y-5 rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700"><Activity size={16} /> End-to-end mode lab</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Run the same activation through BatchNorm → Dropout.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Training mode uses current batch statistics and stochastic dropout. Evaluation mode uses stored BatchNorm state and turns dropout into the identity. A forgotten mode switch changes both layers at once.</p>
        </div>
        <button type="button" onClick={() => setSeed((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700"><RefreshCw size={15} /> New dropout draws</button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">Mini-batch<select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">{Object.entries(BATCH_SCENARIOS).filter(([id]) => id !== 'singleton').map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Dropout rate: {dropoutRate.toFixed(2)}<input type="range" min="0" max="0.8" step="0.05" value={dropoutRate} onChange={(event) => setDropoutRate(Number(event.target.value))} /></label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-rose-700">Training mode</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-3"><div className="text-xs text-slate-500">selected x</div><strong className="text-xl">{training.selectedValue.toFixed(2)}</strong></div>
            <div className="rounded-lg bg-white p-3"><div className="text-xs text-slate-500">after BatchNorm</div><strong className="text-xl">{training.batchNormOutput.toFixed(3)}</strong></div>
            <div className="rounded-lg bg-white p-3"><div className="text-xs text-slate-500">dropout std</div><strong className="text-xl">{training.dropoutSummary.std.toFixed(3)}</strong></div>
          </div>
          <div className="mt-4"><OutputDots samples={training.dropoutSamples} /></div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700"><ShieldCheck size={15} /> Evaluation mode</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-3"><div className="text-xs text-slate-500">selected x</div><strong className="text-xl">{evaluation.selectedValue.toFixed(2)}</strong></div>
            <div className="rounded-lg bg-white p-3"><div className="text-xs text-slate-500">after BatchNorm</div><strong className="text-xl">{evaluation.batchNormOutput.toFixed(3)}</strong></div>
            <div className="rounded-lg bg-white p-3"><div className="text-xs text-slate-500">dropout std</div><strong className="text-xl">{evaluation.dropoutSummary.std.toFixed(3)}</strong></div>
          </div>
          <div className="mt-4"><OutputDots samples={evaluation.dropoutSamples} /></div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Deployment diagnostic:</strong> repeated inference on the same input should not jump between dropout masks, and another request's examples should not redefine this activation's BatchNorm statistics.
      </div>
    </section>
  );
}
