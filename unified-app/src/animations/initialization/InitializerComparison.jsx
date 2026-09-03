import React from 'react';
import { Scale } from 'lucide-react';
import { INITIALIZATION_METHODS } from './initializationConstants.js';

function formatScale(value) {
  if (value === 0) return '0';
  if (value < 0.01 || value >= 1000) return value.toExponential(2);
  return value.toFixed(3).replace(/\.?0+$/, '');
}

function HealthBadge({ health }) {
  const style = health === 'stable'
    ? 'bg-emerald-100 text-emerald-800'
    : health === 'vanishing'
      ? 'bg-sky-100 text-sky-800'
      : 'bg-rose-100 text-rose-800';
  return <span className={`rounded-full px-2 py-1 text-xs font-black capitalize ${style}`}>{health}</span>;
}

export default function InitializerComparison({ results, selectedMethod }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <Scale size={17} className="mt-0.5 shrink-0 text-violet-700" />
        <div>
          <h2 className="font-black text-slate-950">Same network, different initialization rules</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            This comparison keeps activation and architecture fixed. It makes the Xavier compromise and the He fan-in/fan-out tradeoff explicit.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Initializer</th>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Final activation</th>
              <th className="px-3 py-2">Final gradient</th>
              <th className="px-3 py-2">Forward</th>
              <th className="px-3 py-2">Backward</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              const config = INITIALIZATION_METHODS[result.method];
              return (
                <tr key={result.method} className={`border-t border-slate-200 ${result.method === selectedMethod ? 'bg-emerald-50/60' : 'bg-white'}`}>
                  <td className="px-3 py-3 font-black text-slate-900">{config.label}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-600">{config.formula}</td>
                  <td className="px-3 py-3 font-mono">{formatScale(result.finalForward)}</td>
                  <td className="px-3 py-3 font-mono">{formatScale(result.finalBackward)}</td>
                  <td className="px-3 py-3"><HealthBadge health={result.forwardHealth} /></td>
                  <td className="px-3 py-3"><HealthBadge health={result.backwardHealth} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
