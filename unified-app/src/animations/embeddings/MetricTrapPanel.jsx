import React, { useMemo, useState } from 'react';
import { AlertTriangle, Ruler, Scale } from 'lucide-react';
import { metricTrapExperiment, scalingInvarianceExperiment } from './embeddingMetricsModel.js';

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs leading-5 text-slate-600">{detail}</div>
    </div>
  );
}

export default function MetricTrapPanel() {
  const [scale, setScale] = useState(100);
  const ranking = useMemo(() => metricTrapExperiment(scale), [scale]);
  const invariance = useMemo(() => scalingInvarianceExperiment([0.6, 0.8], scale), [scale]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-700"><Scale size={16} /> Metric trap lab</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Cosine is geometry, not a semantic truth detector</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Cosine similarity measures angle. It does not know whether two words are synonyms, antonyms, causal alternatives, or merely distributionally related. Its usefulness depends on how the embedding space was trained and how you validate the downstream task.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-bold text-slate-700" htmlFor="embedding-scale">Scale candidate vector by {scale}×</label>
        <input id="embedding-scale" type="range" min="2" max="200" step="2" value={scale} onChange={(event) => setScale(Number(event.target.value))} className="mt-2 w-full accent-cyan-600" />
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <MetricCard label="Cosine" value={invariance.cosine.toFixed(3)} detail="unchanged under positive rescaling" />
          <MetricCard label="Original norm" value={invariance.originalNorm.toFixed(2)} detail="vector magnitude before scaling" />
          <MetricCard label="Scaled norm" value={invariance.scaledNorm.toFixed(2)} detail="magnitude changes dramatically" />
          <MetricCard label="Euclidean Δ" value={invariance.distance.toFixed(2)} detail="absolute separation does change" />
        </div>
      </section>

      <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700"><Ruler size={16} /> Nearest-neighbor disagreement</div>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Query = [1, 0]. Candidate A = [{scale}, 0] is perfectly collinear but far away. Candidate B = [0.8, 0.2] is nearby but not perfectly aligned.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Candidate</th><th className="px-3 py-2">Cosine</th><th className="px-3 py-2">Euclidean</th><th className="px-3 py-2">Dot product</th></tr></thead>
            <tbody>
              <tr className="border-t border-slate-200"><td className="px-3 py-3 font-black">A · far but collinear</td><td className="px-3 py-3 font-mono">{ranking.collinearCosine.toFixed(3)}</td><td className="px-3 py-3 font-mono">{ranking.collinearDistance.toFixed(3)}</td><td className="px-3 py-3 font-mono">{ranking.collinearDot.toFixed(3)}</td></tr>
              <tr className="border-t border-slate-200"><td className="px-3 py-3 font-black">B · nearby, slight angle</td><td className="px-3 py-3 font-mono">{ranking.nearbyCosine.toFixed(3)}</td><td className="px-3 py-3 font-mono">{ranking.nearbyDistance.toFixed(3)}</td><td className="px-3 py-3 font-mono">{ranking.nearbyDot.toFixed(3)}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <AlertTriangle size={17} className="mr-1 inline" />
          <strong>The ranking depends on the metric.</strong> Cosine prefers A; Euclidean distance prefers B. There is no universal “closest embedding” until you specify the metric and validate that metric for the application.
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
        <h3 className="font-black text-slate-950">Fix the vocabulary too</h3>
        <p className="mt-2">The old labels “0 = unrelated” and “−1 = opposite” are only geometric descriptions. In a learned embedding space, zero cosine does not prove semantic independence, and negative cosine does not automatically mean antonymy.</p>
      </section>
    </div>
  );
}
