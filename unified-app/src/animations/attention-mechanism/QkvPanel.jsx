import React, { useMemo } from 'react';
import { ArrowRight, KeyRound } from 'lucide-react';
import { qkvExperiment } from './attentionModel.js';

function formatVector(vector) {
  return `[${vector.map((value) => value.toFixed(2)).join(', ')}]`;
}

export default function QkvPanel() {
  const result = useMemo(() => qkvExperiment(), []);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700"><KeyRound size={16} /> Query, Key, Value</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Keys decide where to read. Values decide what gets read.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Q and K create routing scores. The resulting weights are then applied to V. Treating keys and values as the same conceptual object hides one of attention's most important design choices.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="rounded-xl bg-slate-950 p-4 text-white"><span className="text-xs uppercase tracking-wide text-blue-200">Query</span><div className="mt-1 font-mono text-xl font-black">{formatVector(result.query)}</div></div>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Key</th><th className="px-3 py-2">Value</th><th className="px-3 py-2">Scaled score</th><th className="px-3 py-2">Weight</th></tr></thead>
            <tbody>{result.keys.map((key, index) => <tr key={index} className="border-t border-slate-200"><td className="px-3 py-3 font-black">Item {index + 1}</td><td className="px-3 py-3 font-mono">{formatVector(key)}</td><td className="px-3 py-3 font-mono">{formatVector(result.values[index])}</td><td className="px-3 py-3 font-mono">{result.scores[index].toFixed(3)}</td><td className="px-3 py-3 font-mono font-black text-blue-700">{(result.weights[index] * 100).toFixed(1)}%</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950"><ArrowRight size={18} /><span className="text-sm">Weighted value output = <strong className="font-mono">{formatVector(result.output)}</strong></span></div>
      </section>
    </div>
  );
}
