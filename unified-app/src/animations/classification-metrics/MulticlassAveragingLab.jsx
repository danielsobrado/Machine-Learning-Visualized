import React, { useMemo } from 'react';
import { Layers3 } from 'lucide-react';
import {
  MULTICLASS_CONFUSION,
  MULTICLASS_LABELS,
} from './classificationMetricsConstants.js';
import { multiclassMetricsFromConfusion } from './classificationMetricsModel.js';

function pct(value, digits = 1) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : '—';
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function MulticlassAveragingLab() {
  const summary = useMemo(
    () => multiclassMetricsFromConfusion(MULTICLASS_CONFUSION, MULTICLASS_LABELS),
    [],
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700"><Layers3 size={15} /> Multiclass averaging lab</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">Micro, macro, and weighted averages answer different questions.</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
        This three-class example is intentionally imbalanced. Routine cases dominate the dataset, while Critical cases are rare and much harder. One headline average can therefore hide which classes are carrying the score.
      </p>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[420px] w-full text-center text-sm">
            <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Actual ↓ / Predicted →</th>
                {MULTICLASS_LABELS.map((label) => <th key={label} className="px-3 py-2">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {MULTICLASS_CONFUSION.map((row, rowIndex) => (
                <tr key={MULTICLASS_LABELS[rowIndex]} className="border-t border-slate-100">
                  <th className="px-3 py-3 text-left font-black text-slate-800">{MULTICLASS_LABELS[rowIndex]}</th>
                  {row.map((value, columnIndex) => (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                      className={`px-3 py-3 font-mono font-black ${rowIndex === columnIndex ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'}`}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Accuracy" value={pct(summary.accuracy)} detail="13 correct decisions out of 20 rows." />
          <Stat label="Micro F1" value={pct(summary.micro.f1)} detail="Pool all one-vs-rest counts first; large classes dominate." />
          <Stat label="Macro F1" value={pct(summary.macro.f1)} detail="Give Routine, Review, and Critical equal class weight." />
          <Stat label="Weighted F1" value={pct(summary.weighted.f1)} detail="Average class F1 values weighted by class support." />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-[680px] w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2">Support</th>
              <th className="px-3 py-2">Precision</th>
              <th className="px-3 py-2">Recall</th>
              <th className="px-3 py-2">F1</th>
            </tr>
          </thead>
          <tbody>
            {summary.perClass.map((item) => (
              <tr key={item.label} className={item.label === 'Critical' ? 'bg-rose-50 text-rose-950' : 'border-t border-slate-100 text-slate-700'}>
                <td className="px-3 py-3 font-black">{item.label}</td>
                <td className="px-3 py-3">{item.support}</td>
                <td className="px-3 py-3">{pct(item.precision)}</td>
                <td className="px-3 py-3">{pct(item.recall)}</td>
                <td className="px-3 py-3 font-black">{pct(item.f1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          <strong>Micro:</strong> “How good are all individual decisions together?” It is dominated by common classes in single-label classification.
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
          <strong>Macro:</strong> “How good is the average class?” A rare failing class affects the score just as much as a common class.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Weighted:</strong> preserves per-class scoring but gives larger-support classes more influence. It can still hide minority-class weakness.
        </div>
      </div>
    </section>
  );
}
