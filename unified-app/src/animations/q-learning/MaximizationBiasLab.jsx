import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BIAS_EXAMPLE, doubleEstimatorTargetMean, maximizationBias } from './qLearningModel.js';

export default function MaximizationBiasLab() {
  const single = maximizationBias(BIAS_EXAMPLE);
  const doubleMean = doubleEstimatorTargetMean({ selectionSamples: BIAS_EXAMPLE, evaluationSamples: BIAS_EXAMPLE });
  return (
    <div className="p-6 md:p-8">
      <section className="mx-auto max-w-5xl rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
        <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 text-amber-700" /><div><p className="text-xs font-black uppercase tracking-wide text-amber-700">Maximization bias lab</p><h2 className="mt-1 text-2xl font-black text-slate-950">The max can be optimistic even when every action estimate is unbiased</h2></div></div>
        <p className="mt-3 text-sm leading-6 text-slate-700">Both actions have true value 0 in this toy example. Their noisy estimates average to 0 individually, but choosing the maximum from each noisy pair preferentially selects positive errors.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-500">Mean Q(A)</span><strong className="mt-1 block text-2xl">{single.actionMeans[0].toFixed(1)}</strong></div>
          <div className="rounded-xl border bg-white p-4"><span className="text-xs text-slate-500">Mean Q(B)</span><strong className="mt-1 block text-2xl">{single.actionMeans[1].toFixed(1)}</strong></div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4"><span className="text-xs text-rose-700">E[max Q]</span><strong className="mt-1 block text-2xl">{single.meanOfMax.toFixed(1)}</strong></div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><span className="text-xs text-emerald-700">Independent select/evaluate mean</span><strong className="mt-1 block text-2xl">{doubleMean.toFixed(1)}</strong></div>
        </div>
        <div className="mt-4 overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[460px] text-sm"><thead className="bg-slate-50"><tr><th className="p-2 text-left">sample</th><th>Q(A)</th><th>Q(B)</th><th>max</th></tr></thead><tbody>{BIAS_EXAMPLE.map((row, i) => <tr key={i} className="border-t"><td className="p-2 font-bold">{i + 1}</td><td className="text-center font-mono">{row[0]}</td><td className="text-center font-mono">{row[1]}</td><td className="text-center font-mono font-bold text-rose-700">{Math.max(...row)}</td></tr>)}</tbody></table></div>
        <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"><strong>Double Q idea:</strong> decouple which action is selected from which estimator evaluates it. This reduces the positive feedback caused by using the same noisy estimates for both jobs.</p>
      </section>
    </div>
  );
}
