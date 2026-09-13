import React, { useMemo, useState } from 'react';
import { Calculator, Eye, SlidersHorizontal } from 'lucide-react';
import { scaledDotProductAttention } from './attentionModel.js';
import {
  ATTENTION_ROW_DEFAULTS,
  ATTENTION_ROW_KEYS,
  ATTENTION_ROW_LABELS,
  ATTENTION_ROW_VALUES,
} from './attentionRowLabConstants.js';

function Vector({ label, values }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-black text-slate-950">[{values.map((value) => value.toFixed(2)).join(', ')}]</div>
    </div>
  );
}

export default function AttentionRowLab() {
  const [queryX, setQueryX] = useState(ATTENTION_ROW_DEFAULTS.queryX);
  const [queryY, setQueryY] = useState(ATTENTION_ROW_DEFAULTS.queryY);
  const [scale, setScale] = useState(ATTENTION_ROW_DEFAULTS.scale);
  const query = useMemo(() => [queryX, queryY], [queryX, queryY]);
  const result = useMemo(() => scaledDotProductAttention({
    query,
    keys: ATTENTION_ROW_KEYS,
    values: ATTENTION_ROW_VALUES,
    scale,
  }), [query, scale]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-300"><Eye size={16} /> One attention row</p>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">Move Q and watch routing change.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">One query compares with three keys. Softmax converts those scores into routing weights, then those weights mix the value vectors. This is the smallest complete attention calculation.</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-700"><SlidersHorizontal size={16} /> Query controls</div>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Q₁: {queryX.toFixed(2)}<input type="range" min="-2" max="2" step="0.05" value={queryX} onChange={(event) => setQueryX(Number(event.target.value))} /></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Q₂: {queryY.toFixed(2)}<input type="range" min="-2" max="2" step="0.05" value={queryY} onChange={(event) => setQueryY(Number(event.target.value))} /></label>
          <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={scale} onChange={(event) => setScale(event.target.checked)} className="mt-1" /><span>Divide scores by √dₖ<small className="mt-1 block font-semibold leading-5 text-slate-500">Turn this off to see how larger dot products make softmax sharper.</small></span></label>
          <div className="mt-4 rounded-xl bg-cyan-50 p-3 text-sm text-cyan-950"><strong>Current Q:</strong> [{queryX.toFixed(2)}, {queryY.toFixed(2)}]</div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {ATTENTION_ROW_KEYS.map((key, index) => <Vector key={ATTENTION_ROW_LABELS[index]} label={`${ATTENTION_ROW_LABELS[index]} · K`} values={key} />)}
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black uppercase tracking-wide text-slate-600"><Calculator size={16} /> Exact trace</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-white text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3 text-left">Token</th><th className="px-4 py-3 text-right">Q·K / divisor</th><th className="px-4 py-3 text-right">Softmax weight</th><th className="px-4 py-3 text-right">Value V</th></tr></thead>
                <tbody>
                  {ATTENTION_ROW_LABELS.map((label, index) => (
                    <tr key={label} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-black text-slate-900">{label}</td>
                      <td className="px-4 py-3 text-right font-mono">{result.scores[index].toFixed(3)}</td>
                      <td className="px-4 py-3 text-right font-mono">{(result.weights[index] * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right font-mono">[{ATTENTION_ROW_VALUES[index].join(', ')}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-3">
            {result.weights.map((weight, index) => (
              <div key={ATTENTION_ROW_LABELS[index]} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm"><strong>{ATTENTION_ROW_LABELS[index]}</strong><span className="font-mono">{(weight * 100).toFixed(1)}%</span></div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${weight * 100}%` }} /></div>
              </div>
            ))}
          </div>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Context output = weights × V</div>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-950">[{result.output.map((value) => value.toFixed(3)).join(', ')}]</div>
            <p className="mt-2 text-sm leading-6 text-emerald-950">The key vectors decided <em>where to read</em>; the value vectors decided <em>what content came back</em>. Change Q until another token becomes dominant.</p>
          </section>
        </main>
      </section>
    </div>
  );
}
