import React, { useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { scalingExperiment } from './attentionModel.js';

function WeightBars({ title, weights, entropy }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {weights.map((weight, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs font-bold text-slate-600"><span>Key {index + 1}</span><span>{(weight * 100).toFixed(1)}%</span></div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${weight * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="mt-3 font-mono text-xs text-slate-600">entropy = {entropy.toFixed(3)}</div>
    </div>
  );
}

export default function ScaledDotProductPanel() {
  const [dimension, setDimension] = useState(64);
  const result = useMemo(() => scalingExperiment(dimension), [dimension]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700"><Gauge size={16} /> Scaled dot-product attention</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">The √dₖ divisor is a numerical stabilizer, not decoration</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">If query/key components have comparable variance, raw dot-product magnitude tends to grow with dimension. Larger logits push softmax toward saturation. Dividing by √dₖ keeps score scale more comparable.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-bold text-slate-700" htmlFor="attention-dimension">Key dimension dₖ = {dimension}</label>
        <input id="attention-dimension" type="range" min="1" max="512" step="1" value={dimension} onChange={(event) => setDimension(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <WeightBars title="Without 1/√dₖ" weights={result.rawWeights} entropy={result.rawEntropy} />
          <WeightBars title="With 1/√dₖ" weights={result.scaledWeights} entropy={result.scaledEntropy} />
        </div>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">This teaching experiment keeps the underlying normalized score pattern fixed while letting raw dot products grow like √dₖ. The scaled distribution therefore stays stable while the unscaled softmax becomes increasingly peaky.</p>
      </section>
    </div>
  );
}
