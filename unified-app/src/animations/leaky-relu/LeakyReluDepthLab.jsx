import React, { useMemo, useState } from 'react';
import { AlertTriangle, Layers3 } from 'lucide-react';
import { depthForRetention, negativeDepthPropagation } from './leakyReluModel.js';

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && magnitude < 0.001) return value.toExponential(2);
  return value.toFixed(4).replace(/\.?0+$/, '');
}

export default function LeakyReluDepthLab() {
  const [alpha, setAlpha] = useState(0.01);
  const [depth, setDepth] = useState(8);
  const analysis = useMemo(() => negativeDepthPropagation({
    input: -2,
    upstreamGradient: 1,
    alpha,
    depth,
  }), [alpha, depth]);
  const onePercentDepth = depthForRetention({ alpha, minimumRetention: 0.01 });

  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle size={19} className="mt-0.5 shrink-0 text-rose-700" />
        <div>
          <div className="text-sm font-black uppercase tracking-wide text-rose-700">Depth failure lab</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Nonzero is not the same as healthy</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Keep every layer on Leaky ReLU's negative branch. Each local derivative is α, so the backward signal after N layers is multiplied by αᴺ. Leaky ReLU avoids an exact zero, but a tiny leak can still become numerically useless through depth.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label htmlFor="leaky-depth-alpha" className="text-sm font-black text-slate-800">Negative slope α = {alpha.toFixed(2)}</label>
          <input id="leaky-depth-alpha" type="range" min="0" max="0.5" step="0.01" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} className="mt-2 w-full accent-rose-600" />
          <label htmlFor="leaky-depth-layers" className="mt-5 block text-sm font-black text-slate-800">Negative-side depth = {depth}</label>
          <input id="leaky-depth-layers" type="range" min="1" max="12" step="1" value={depth} onChange={(event) => setDepth(Number(event.target.value))} className="mt-2 w-full accent-rose-600" />

          <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs uppercase tracking-wide text-slate-400">Closed form</div>
            <div className="mt-2 font-mono text-xl font-black">retention = αᴺ</div>
            <div className="mt-2 font-mono text-sm text-slate-300">{alpha.toFixed(2)}^{depth} = {format(analysis.retention)}</div>
          </div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <strong>Below 1%:</strong>{' '}
            {Number.isFinite(onePercentDepth) ? `after about ${onePercentDepth} negative-side layer${onePercentDepth === 1 ? '' : 's'}.` : 'never when α=1.'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Layers3 size={16} /> Layer-by-layer signal</div>
          <div className="mt-4 space-y-3">
            {analysis.layers.map((layer) => {
              const width = Math.max(2, Math.min(100, 100 + Math.log10(Math.max(Math.abs(layer.gradient), 1e-20)) * 12));
              return (
                <div key={layer.layer}>
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-black text-slate-800">Layer {layer.layer}</span>
                    <span className="font-mono text-xs text-slate-500">slope={format(layer.localSlope)} · grad={format(layer.gradient)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-rose-500" style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Final activation</div><div className="mt-1 font-mono text-xl font-black">{format(analysis.finalActivation)}</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Final gradient</div><div className="mt-1 font-mono text-xl font-black">{format(analysis.finalGradient)}</div></div>
        <div className={`rounded-xl border p-4 ${analysis.retention < 0.01 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}><div className="text-xs font-black uppercase tracking-wide text-slate-500">Gradient retained</div><div className="mt-1 font-mono text-xl font-black">{format(analysis.retention * 100)}%</div></div>
      </div>

      <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <strong>Tradeoff:</strong> α=0 exactly recovers ReLU's dead negative branch. α=1 preserves the gradient but also makes the negative branch linear with slope 1. The leak is a design choice, not a free guarantee against vanishing gradients.
      </p>
    </section>
  );
}
