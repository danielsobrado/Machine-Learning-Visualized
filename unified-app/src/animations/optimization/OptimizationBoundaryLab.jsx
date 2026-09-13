import React, { useMemo, useState } from 'react';
import { Activity, ArrowRight, Gauge, Mountain, Route } from 'lucide-react';
import {
  OPTIMIZATION_LANDSCAPES,
  classifyTrace,
  gradientDescentTrace,
} from './optimizationConceptModel.js';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-950 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
    </div>
  );
}

export default function OptimizationBoundaryLab() {
  const [landscapeId, setLandscapeId] = useState('ravine');
  const [learningRate, setLearningRate] = useState(0.08);
  const trace = useMemo(() => gradientDescentTrace({ landscapeId, learningRate, steps: 18 }), [landscapeId, learningRate]);
  const first = trace[0];
  const last = trace.at(-1);
  const status = classifyTrace(trace);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-2xl border border-cyan-500/30 bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-300"><Route size={16} /> What this lesson owns</div>
        <h2 className="mt-2 text-2xl font-black">Optimization asks where the objective sends us.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">Change the loss geometry or step size here. If you want to compare Momentum, Adam, bias correction, or per-coordinate adaptive updates, that belongs to the separate <strong>Optimizers</strong> lesson.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-300"><Mountain size={17} /> Objective geometry</div>
          <div className="mt-4 grid gap-2">
            {Object.entries(OPTIMIZATION_LANDSCAPES).map(([id, landscape]) => (
              <button key={id} type="button" onClick={() => setLandscapeId(id)} className={`rounded-xl border p-3 text-left ${landscapeId === id ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 bg-slate-800'}`}>
                <div className="font-black">{landscape.label}</div>
                <div className="mt-1 text-xs leading-5 text-slate-300">{landscape.description}</div>
              </button>
            ))}
          </div>
          <label className="mt-5 grid gap-2 text-sm font-bold text-slate-200">
            Learning rate α: {learningRate.toFixed(3)}
            <input type="range" min="0.01" max="0.35" step="0.01" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} />
          </label>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Initial loss" value={first.value.toFixed(3)} detail="Same starting point for every geometry." />
            <Stat label="Final loss" value={last.value.toFixed(3)} detail="After 18 vanilla gradient-descent steps." />
            <Stat label="Behavior" value={status} detail="A property of objective geometry plus step size." />
          </div>

          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-300"><Activity size={17} /> Path through parameter space</div>
            <div className="mt-4 flex h-48 items-end gap-1 overflow-hidden rounded-xl bg-slate-950 p-3">
              {trace.map((point) => {
                const height = Math.min(100, Math.max(3, Math.log10(Math.abs(point.value) + 1) * 45));
                return <div key={point.step} title={`step ${point.step}: loss ${point.value.toFixed(3)}`} className="flex-1 rounded-t bg-cyan-400" style={{ height: `${height}%` }} />;
              })}
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-xs text-slate-400"><span>step 0</span><ArrowRight size={16} /><span>step 18</span></div>
          </section>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-950">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700"><Mountain size={16} /> Optimization owns</div>
          <p className="mt-3 text-sm leading-6">Objective functions, gradients, constraints, curvature, saddles, conditioning, convergence criteria, and whether a step size is compatible with the landscape.</p>
        </div>
        <div className="rounded-2xl border border-violet-300 bg-violet-50 p-5 text-violet-950">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700"><Gauge size={16} /> Optimizers owns</div>
          <p className="mt-3 text-sm leading-6">How an update rule transforms gradient history: momentum, Adam moments, AdamW, adaptive scaling, optimizer state, tuning fairness, and training-cost tradeoffs.</p>
        </div>
      </section>
    </div>
  );
}
