import React, { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Repeat2 } from 'lucide-react';
import { PPO_EPOCH_DEFAULTS, PPO_EPOCH_LIMITS, PPO_KL_WARNING } from './ppoTrainingDynamicsConstants.js';
import { repeatedEpochTrace } from './ppoTrainingDynamicsModel.js';

export default function PpoRepeatedEpochLab({ epsilon }) {
  const [learningRate, setLearningRate] = useState(PPO_EPOCH_DEFAULTS.learningRate);
  const [epochs, setEpochs] = useState(PPO_EPOCH_DEFAULTS.epochs);
  const trace = useMemo(() => repeatedEpochTrace({
    ...PPO_EPOCH_DEFAULTS,
    epsilon,
    learningRate,
    epochs,
  }), [epsilon, epochs, learningRate]);
  const last = trace.rows.at(-1);
  const klWarning = trace.finalKl > PPO_KL_WARNING;

  return (
    <section className="space-y-5 rounded-lg border border-violet-200 bg-violet-50/50 p-5">
      <header>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Repeat2 size={16} /> Repeated-epoch lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Clipping reacts after the policy moves. It is not a step-size limiter.</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Reuse one positive-advantage action collected under the old 50/50 policy. The denominator in the ratio stays fixed at the collection policy while the current policy changes across optimization epochs.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">Optimizer step size: {learningRate.toFixed(1)}<input type="range" {...PPO_EPOCH_LIMITS.learningRate} value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Epochs over same sample: {epochs}<input type="range" {...PPO_EPOCH_LIMITS.epochs} value={epochs} onChange={(event) => setEpochs(Number(event.target.value))} /></label>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Old π(a=1)</div><div className="mt-1 text-2xl font-black">{(trace.oldPolicyProbability * 100).toFixed(1)}%</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Current π(a=1)</div><div className="mt-1 text-2xl font-black">{(last.newPolicyProbability * 100).toFixed(1)}%</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Final ratio</div><div className="mt-1 text-2xl font-black">{trace.finalRatio.toFixed(3)}</div></div>
        <div className={`rounded-xl border p-4 ${klWarning ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}><div className="text-xs font-black uppercase tracking-wide text-slate-500">Exact KL</div><div className="mt-1 text-2xl font-black">{trace.finalKl.toFixed(3)}</div><div className="mt-1 text-xs">warning above {PPO_KL_WARNING}</div></div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-2 text-left">Epoch</th><th>π new</th><th>Ratio</th><th>KL</th><th>Gradient</th><th>Status</th></tr></thead>
          <tbody>{trace.rows.map((row) => <tr key={row.epoch} className="border-t border-slate-100"><td className="p-2 font-bold">{row.epoch}</td><td className="text-center font-mono">{row.newPolicyProbability.toFixed(3)}</td><td className="text-center font-mono">{row.ratio.toFixed(3)}</td><td className="text-center font-mono">{row.kl.toFixed(3)}</td><td className="text-center font-mono">{row.gradient.toFixed(3)}</td><td className="text-center"><span className={`rounded px-2 py-1 text-xs font-black ${row.clippingActive ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{row.clippingActive ? 'clipped' : 'updating'}</span></td></tr>)}</tbody>
        </table>
      </div>

      <div className={`rounded-xl border bg-white p-4 ${klWarning ? 'border-rose-300 text-rose-950' : 'border-emerald-300 text-emerald-950'}`}>
        <div className="flex items-center gap-2 font-black">{klWarning ? <AlertTriangle size={18} /> : <Gauge size={18} />}{klWarning ? 'Clip objective did not prevent a large policy jump' : 'Policy drift remains modest in this run'}</div>
        <p className="mt-2 text-sm leading-6">A large optimizer step can jump past the clip range in one update. On the next epoch the surrogate becomes clipped, but the parameter move already happened. This is why practical PPO implementations also watch KL, learning rate, epoch count, and sometimes stop early on excessive drift.</p>
      </div>
    </section>
  );
}
