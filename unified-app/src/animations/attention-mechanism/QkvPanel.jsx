import React, { useMemo, useState } from 'react';
import { ArrowRight, KeyRound, RotateCcw } from 'lucide-react';
import { qkvExperiment } from './attentionModel.js';

const QUERY_MIN = -2;
const QUERY_MAX = 2;
const QUERY_STEP = 0.1;
const PLOT_SIZE = 260;
const PLOT_CENTER = PLOT_SIZE / 2;
const PLOT_SCALE = 52;

function formatVector(vector) {
  return `[${vector.map((value) => value.toFixed(2)).join(', ')}]`;
}

function plotPoint(vector) {
  return {
    x: PLOT_CENTER + vector[0] * PLOT_SCALE,
    y: PLOT_CENTER - vector[1] * PLOT_SCALE,
  };
}

function QueryPlot({ query, keys }) {
  const queryPoint = plotPoint(query);

  return (
    <svg viewBox={`0 0 ${PLOT_SIZE} ${PLOT_SIZE}`} className="h-auto w-full max-w-[280px]" role="img" aria-label={`Two-dimensional query vector ${formatVector(query)} and three fixed key vectors`}>
      <line x1="20" y1={PLOT_CENTER} x2={PLOT_SIZE - 20} y2={PLOT_CENTER} stroke="currentColor" className="text-slate-300" />
      <line x1={PLOT_CENTER} y1="20" x2={PLOT_CENTER} y2={PLOT_SIZE - 20} stroke="currentColor" className="text-slate-300" />
      {keys.map((key, index) => {
        const point = plotPoint(key);
        return (
          <g key={index}>
            <line x1={PLOT_CENTER} y1={PLOT_CENTER} x2={point.x} y2={point.y} stroke="currentColor" strokeWidth="2" className="text-blue-400" />
            <circle cx={point.x} cy={point.y} r="5" fill="currentColor" className="text-blue-600" />
            <text x={point.x + 7} y={point.y - 7} className="fill-slate-700 text-[11px] font-bold">K{index + 1}</text>
          </g>
        );
      })}
      <line x1={PLOT_CENTER} y1={PLOT_CENTER} x2={queryPoint.x} y2={queryPoint.y} stroke="currentColor" strokeWidth="4" className="text-amber-500" />
      <circle cx={queryPoint.x} cy={queryPoint.y} r="6" fill="currentColor" className="text-amber-600" />
      <text x={queryPoint.x + 8} y={queryPoint.y + 14} className="fill-amber-800 text-[12px] font-black">Q</text>
    </svg>
  );
}

function QuerySlider({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
        <span>{label}</span><span className="font-mono text-slate-950">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={QUERY_MIN}
        max={QUERY_MAX}
        step={QUERY_STEP}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />
    </label>
  );
}

export default function QkvPanel() {
  const [query, setQuery] = useState([1, 0]);
  const result = useMemo(() => qkvExperiment(query), [query]);
  const weightTotal = result.weights.reduce((sum, weight) => sum + weight, 0);

  const setQueryCoordinate = (index, value) => {
    setQuery((current) => current.map((coordinate, coordinateIndex) => (coordinateIndex === index ? value : coordinate)));
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700"><KeyRound size={16} /> Query, Key, Value</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Keys decide where to read. Values decide what gets read.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Move the two query coordinates and watch routing change live. Q and K create scores; softmax turns those scores into a probability distribution; the resulting weights are applied to V.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">Live query</div>
              <div className="mt-1 font-mono text-xl font-black text-slate-950">Q = {formatVector(result.query)}</div>
            </div>
            <button type="button" onClick={() => setQuery([1, 0])} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><RotateCcw size={14} /> Reset</button>
          </div>

          <div className="mt-5 space-y-5">
            <QuerySlider label="q₁ · horizontal" value={query[0]} onChange={(value) => setQueryCoordinate(0, value)} />
            <QuerySlider label="q₂ · vertical" value={query[1]} onChange={(value) => setQueryCoordinate(1, value)} />
          </div>

          <div className="mt-5 flex justify-center rounded-xl bg-slate-50 p-2">
            <QueryPlot query={result.query} keys={result.keys} />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Blue vectors are fixed keys. The amber vector is the query. Alignment increases the dot-product score.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Key</th><th className="px-3 py-2">Value</th><th className="px-3 py-2">Scaled score</th><th className="px-3 py-2">Weight</th></tr></thead>
              <tbody>{result.keys.map((key, index) => <tr key={index} className="border-t border-slate-200"><td className="px-3 py-3 font-black">Item {index + 1}</td><td className="px-3 py-3 font-mono">{formatVector(key)}</td><td className="px-3 py-3 font-mono">{formatVector(result.values[index])}</td><td className="px-3 py-3 font-mono">{result.scores[index].toFixed(3)}</td><td className="px-3 py-3 font-mono font-black text-blue-700">{(result.weights[index] * 100).toFixed(1)}%</td></tr>)}</tbody>
            </table>
          </div>
          <div className="mt-3 text-right text-xs font-bold text-slate-600">Softmax weights sum to {(weightTotal * 100).toFixed(1)}%</div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950" aria-live="polite"><ArrowRight size={18} /><span className="text-sm">Weighted value output = <strong className="font-mono">{formatVector(result.output)}</strong></span></div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
        <strong className="text-slate-950">Try this:</strong> move Q toward K₂ = [0, 1], then toward K₃ = [-1, 0]. The largest weight should follow the key that aligns best with the query, while the output changes according to that item's value vector.
      </section>
    </div>
  );
}
