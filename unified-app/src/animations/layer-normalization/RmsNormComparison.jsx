import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, Calculator, Scale } from 'lucide-react';
import { TOKEN_CASES } from './layerNormalizationConstants.js';
import {
  layerNormalize,
  rmsNormalize,
  rootMeanSquare,
} from './layerNormalizationModel.js';

function fmt(value) {
  return Number(value).toFixed(3);
}

function VectorStrip({ label, values, tone }) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-xs font-black uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {values.map((value, index) => (
          <div key={index} className="rounded-lg bg-white/80 px-2 py-3 text-center font-mono text-sm font-black text-slate-900">{fmt(value)}</div>
        ))}
      </div>
    </div>
  );
}

export default function RmsNormComparison() {
  const [tokenId, setTokenId] = useState('spiky');
  const [offset, setOffset] = useState(0);
  const base = TOKEN_CASES[tokenId].values;
  const values = useMemo(() => base.map((value) => value + offset), [base, offset]);
  const gamma = useMemo(() => Array(values.length).fill(1), [values.length]);
  const layer = useMemo(() => layerNormalize(values, { gamma }), [gamma, values]);
  const rms = useMemo(() => rmsNormalize(values, { gamma }), [gamma, values]);

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header>
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-fuchsia-700"><ArrowRightLeft size={17} /> LayerNorm vs RMSNorm</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Same vector, different normalization rule.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">LayerNorm subtracts the feature mean before scaling by standard deviation. RMSNorm skips mean-centering and scales only by the root-mean-square magnitude. Add a constant offset and watch the difference appear.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Token case<select value={tokenId} onChange={(event) => setTokenId(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">{Object.entries(TOKEN_CASES).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">Add the same offset to every feature: {offset >= 0 ? '+' : ''}{offset.toFixed(1)}<input type="range" min="-5" max="5" step="0.5" value={offset} onChange={(event) => setOffset(Number(event.target.value))} /></label>
          <div className="mt-4 rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-3 text-xs leading-5 text-fuchsia-950"><strong>Prediction:</strong> LayerNorm's normalized vector should barely change under a constant shift. RMSNorm's should change because its denominator depends on raw magnitude around zero.</div>
        </aside>

        <main className="space-y-3">
          <VectorStrip label="Input vector" values={values} tone="border-slate-200 bg-slate-50" />
          <div className="grid gap-3 md:grid-cols-2">
            <VectorStrip label="LayerNorm normalized" values={layer.normalized} tone="border-violet-200 bg-violet-50" />
            <VectorStrip label="RMSNorm normalized" values={rms.normalized} tone="border-fuchsia-200 bg-fuchsia-50" />
          </div>
        </main>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Input mean</div><div className="mt-1 text-2xl font-black text-slate-950">{fmt(layer.inputStats.mean)}</div></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-black uppercase tracking-wide text-slate-500">Input RMS</div><div className="mt-1 text-2xl font-black text-slate-950">{fmt(rootMeanSquare(values))}</div></div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4"><div className="text-xs font-black uppercase tracking-wide text-violet-700">LayerNorm output mean</div><div className="mt-1 text-2xl font-black text-violet-950">{fmt(layer.normalizedStats.mean)}</div></div>
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-4"><div className="text-xs font-black uppercase tracking-wide text-fuchsia-700">RMSNorm output mean</div><div className="mt-1 text-2xl font-black text-fuchsia-950">{fmt(rms.normalizedStats.mean)}</div></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-violet-950"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700"><Calculator size={16} /> LayerNorm</div><div className="mt-3 font-mono text-sm">(x - μ) / √(Var(x) + ε)</div><p className="mt-2 text-sm leading-6">Centers the token first, so adding the same constant to every hidden feature does not change the standardized direction.</p></div>
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-4 text-fuchsia-950"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-fuchsia-700"><Scale size={16} /> RMSNorm</div><div className="mt-3 font-mono text-sm">x / √(mean(x²) + ε)</div><p className="mt-2 text-sm leading-6">Does not subtract μ. It controls vector magnitude with less computation, but a constant shift changes the normalized direction.</p></div>
      </div>
    </section>
  );
}
