import React, { useMemo, useState } from 'react';
import { AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { BIAS_EXAMPLE, doubleEstimatorTargetMean, maximizationBias } from './qLearningModel.js';

const NOISE_SCALE = Object.freeze({ min: 0, max: 3, step: 0.1, initial: 1 });

export default function MaximizationBiasLab() {
  const [noiseScale, setNoiseScale] = useState(NOISE_SCALE.initial);
  const samples = useMemo(() => BIAS_EXAMPLE.map((row) => row.map((value) => value * noiseScale)), [noiseScale]);
  const single = useMemo(() => maximizationBias(samples), [samples]);
  const doubleMean = useMemo(() => doubleEstimatorTargetMean({ selectionSamples: samples, evaluationSamples: samples }), [samples]);

  return (
    <div className="p-6 md:p-8">
      <section className="mx-auto max-w-5xl rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 text-amber-700" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Start here · maximization bias</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">The max can be optimistic even when every action estimate is unbiased</h2>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">Both actions have true value 0 in this toy example. Their noisy estimates average to 0 individually, but choosing the maximum from each pair preferentially selects positive estimation errors.</p>

        <label className="mt-5 block rounded-xl border border-amber-200 bg-white p-4 text-sm font-bold text-slate-700">
          <span className="flex items-center gap-2"><SlidersHorizontal size={16} /> Estimation noise scale: {noiseScale.toFixed(1)}×</span>
          <input className="mt-3 w-full" type="range" {...NOISE_SCALE} value={noiseScale} onChange={(event) => setNoiseScale(Number(event.target.value))} />
          <span className="mt-2 block font-normal leading-5 text-slate-600">At 0× every estimate is exactly correct. Increase noise while keeping each action unbiased and watch only the max become optimistic.</span>
        </label>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-500">Mean Q(A)</span><strong className="mt-1 block text-2xl">{single.actionMeans[0].toFixed(2)}</strong></div>
          <div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-500">Mean Q(B)</span><strong className="mt-1 block text-2xl">{single.actionMeans[1].toFixed(2)}</strong></div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4"><span className="text-xs text-rose-700">E[max Q]</span><strong className="mt-1 block text-2xl">{single.meanOfMax.toFixed(2)}</strong></div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4"><span className="text-xs text-rose-700">Max bias</span><strong className="mt-1 block text-2xl">+{single.bias.toFixed(2)}</strong></div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><span className="text-xs text-emerald-700">Independent select/evaluate mean</span><strong className="mt-1 block text-2xl">{doubleMean.toFixed(2)}</strong></div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[460px] text-sm">
            <thead className="bg-slate-50"><tr><th className="p-2 text-left">sample</th><th>Q(A)</th><th>Q(B)</th><th>max</th></tr></thead>
            <tbody>{samples.map((row, index) => <tr key={index} className="border-t"><td className="p-2 font-bold">{index + 1}</td><td className="text-center font-mono">{row[0].toFixed(2)}</td><td className="text-center font-mono">{row[1].toFixed(2)}</td><td className="text-center font-mono font-bold text-rose-700">{Math.max(...row).toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>

        <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"><strong>Double Q idea:</strong> use one estimator to choose the action and another independent estimator to evaluate it. Decoupling those jobs reduces the positive feedback created by maximizing the same noisy values used for evaluation.</p>
      </section>
    </div>
  );
}
