import React from 'react';
import { Activity, TrendingDown } from 'lucide-react';

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 0.001 || magnitude >= 1000)) return value.toExponential(2);
  return value.toFixed(4);
}

function pathFor(history, key, width, height, maxValue) {
  if (!history.length) return '';
  return history.map((point, index) => {
    const x = history.length === 1 ? 0 : (index / (history.length - 1)) * width;
    const normalized = maxValue === 0 ? 0 : Math.min(1, Math.abs(point[key]) / maxValue);
    const y = height - (normalized * (height - 16)) - 8;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export default function LoopTracePanel({ result }) {
  const { history } = result;
  const maxLoss = Math.max(...history.map((point) => point.loss), 1e-12);
  const maxUpdate = Math.max(...history.map((point) => Math.abs(point.update)), 1e-12);
  const lossPath = pathFor(history, 'loss', 520, 180, maxLoss);
  const updatePath = pathFor(history, 'update', 520, 180, maxUpdate);
  const recent = history.slice(1).slice(-8);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Final parameter</div>
          <strong className="mt-1 block font-mono text-2xl text-slate-950">{format(result.final.parameter)}</strong>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Final loss</div>
          <strong className="mt-1 block font-mono text-2xl text-slate-950">{format(result.final.loss)}</strong>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-indigo-700">Base αλ</div>
          <strong className="mt-1 block font-mono text-2xl text-slate-950">{result.baseStabilityProduct.toFixed(3)}</strong>
          <div className="mt-1 text-xs capitalize text-slate-600">{result.baseRegime.replaceAll('-', ' ')}</div>
        </div>
        <div className={`rounded-xl border p-4 ${result.effectiveStabilityProduct >= 2 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
          <div className="text-xs font-black uppercase tracking-wide text-slate-600">Effective αλ</div>
          <strong className="mt-1 block font-mono text-2xl text-slate-950">{result.effectiveStabilityProduct.toFixed(3)}</strong>
          <div className="mt-1 text-xs text-slate-600">exact deterministic boundary is 2</div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <TrendingDown size={16} />
            Loss produced by the updates
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">No hand-shaped exponential curve: every point is recomputed from the parameter after that optimizer step.</p>
          <svg viewBox="0 0 520 180" className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50" role="img" aria-label="Training loss across optimizer steps">
            <path d={lossPath} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {history.map((point, index) => {
              const x = history.length === 1 ? 0 : (index / (history.length - 1)) * 520;
              const y = 180 - ((Math.min(1, point.loss / maxLoss)) * 164) - 8;
              return <circle key={point.step} cx={x} cy={y} r={index === history.length - 1 ? 6 : 3} fill={index === history.length - 1 ? '#0f172a' : '#4f46e5'} />;
            })}
          </svg>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Activity size={16} />
            Update magnitude
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">The update trace exposes a loop bug even before the loss becomes obviously catastrophic.</p>
          <svg viewBox="0 0 520 180" className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50" role="img" aria-label="Optimizer update magnitude across steps">
            <path d={updatePath} fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Step</th>
              <th className="px-3 py-2">θ before update signal</th>
              <th className="px-3 py-2">true grad</th>
              <th className="px-3 py-2">avg micro-grad</th>
              <th className="px-3 py-2">optimizer grad</th>
              <th className="px-3 py-2">Δθ</th>
              <th className="px-3 py-2">loss after</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((point) => (
              <tr key={point.step} className="border-t border-slate-200">
                <td className="px-3 py-2 font-black">{point.step}</td>
                <td className="px-3 py-2 font-mono">{format(point.parameter - point.update)}</td>
                <td className="px-3 py-2 font-mono">{format(point.trueGradient)}</td>
                <td className="px-3 py-2 font-mono">{format(point.averagedGradient)}</td>
                <td className="px-3 py-2 font-mono font-black text-indigo-700">{format(point.optimizerGradient)}</td>
                <td className="px-3 py-2 font-mono">{format(point.update)}</td>
                <td className="px-3 py-2 font-mono">{format(point.loss)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
