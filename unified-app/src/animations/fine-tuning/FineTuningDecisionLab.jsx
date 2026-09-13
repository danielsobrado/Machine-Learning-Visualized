import React, { useMemo, useState } from 'react';
import { AlertTriangle, Database, Gauge, Layers3, ShieldAlert } from 'lucide-react';
import {
  FINE_TUNING_DEFAULTS,
  FINE_TUNING_PRESETS,
} from './fineTuningDecisionConstants.js';
import {
  bytesToGiB,
  fineTuningDataRisks,
  fineTuningResourceTable,
} from './fineTuningDecisionModel.js';

function formatParams(value) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toLocaleString();
}

export default function FineTuningDecisionLab() {
  const [presetId, setPresetId] = useState(FINE_TUNING_DEFAULTS.presetId);
  const [rank, setRank] = useState(FINE_TUNING_DEFAULTS.rank);
  const [benchmarkOverlap, setBenchmarkOverlap] = useState(FINE_TUNING_DEFAULTS.benchmarkOverlap);
  const [formatMatch, setFormatMatch] = useState(FINE_TUNING_DEFAULTS.formatMatch);
  const [domainExamples, setDomainExamples] = useState(FINE_TUNING_DEFAULTS.domainExamples);
  const preset = FINE_TUNING_PRESETS[presetId];

  const table = useMemo(() => fineTuningResourceTable({
    ...preset,
    rank,
    adaptedMatricesPerLayer: FINE_TUNING_DEFAULTS.adaptedMatricesPerLayer,
  }), [preset, rank]);
  const risks = useMemo(() => fineTuningDataRisks({ benchmarkOverlap, formatMatch, domainExamples }), [benchmarkOverlap, domainExamples, formatMatch]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-purple-300"><Gauge size={16} /> Fine-tuning decision lab</div>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">Compare the same adaptation job three ways.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">Full fine-tuning, LoRA, and QLoRA solve different resource problems. Change the model and rank, then deliberately break the data pipeline to see why method choice cannot rescue contaminated or mismatched training data.</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-purple-700"><Layers3 size={16} /> Adaptation controls</div>
          <div className="mt-4 space-y-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">Base model<select value={presetId} onChange={(event) => setPresetId(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">{Object.entries(FINE_TUNING_PRESETS).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">LoRA rank r: {rank}<input type="range" min="4" max="64" step="4" value={rank} onChange={(event) => setRank(Number(event.target.value))} /></label>
            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">Teaching estimate: {preset.layers} layers, d_model {preset.dModel}, adapting {FINE_TUNING_DEFAULTS.adaptedMatricesPerLayer} square projections per layer.</div>
          </div>
        </aside>

        <main className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-3 text-left">Method</th><th className="px-3 py-3 text-right">Trainable</th><th className="px-3 py-3 text-right">Trainable %</th><th className="px-3 py-3 text-right">Base weight storage</th><th className="px-3 py-3 text-right">Adam moments</th><th className="px-3 py-3 text-left">What changes</th></tr></thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-3 py-4 font-black text-slate-950">{row.label}</td>
                  <td className="px-3 py-4 text-right font-mono">{formatParams(row.trainableParameters)}</td>
                  <td className="px-3 py-4 text-right font-mono">{(row.trainableFraction * 100).toFixed(row.trainableFraction < 0.01 ? 3 : 1)}%</td>
                  <td className="px-3 py-4 text-right font-mono">{bytesToGiB(row.baseWeightBytes).toFixed(2)} GiB</td>
                  <td className="px-3 py-4 text-right font-mono">{bytesToGiB(row.optimizerMomentBytes).toFixed(2)} GiB</td>
                  <td className="px-3 py-4 text-slate-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs leading-5 text-slate-500">These are teaching estimates for weight storage and Adam moments only. Activations, gradients, quantization metadata, temporary buffers, sharding, and checkpointing can materially change real training memory.</p>
        </main>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-rose-700"><Database size={16} /> Data quality controls</div>
          <div className="mt-4 space-y-4">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={benchmarkOverlap} onChange={(event) => setBenchmarkOverlap(event.target.checked)} className="mt-1" /><span>Benchmark examples leaked into SFT data<small className="mt-1 block font-semibold leading-5 text-slate-500">Turn this on to contaminate evaluation.</small></span></label>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={formatMatch} onChange={(event) => setFormatMatch(event.target.checked)} className="mt-1" /><span>Training chat format matches serving format<small className="mt-1 block font-semibold leading-5 text-slate-500">Turn this off to create a train/serve interface mismatch.</small></span></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Domain examples: {domainExamples.toLocaleString()}<input type="range" min="100" max="20000" step="100" value={domainExamples} onChange={(event) => setDomainExamples(Number(event.target.value))} /></label>
          </div>
        </div>

        <div className="space-y-3">
          {risks.length === 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700"><ShieldAlert size={16} /> No injected data failure</div><p className="mt-3 text-sm leading-6">The lab cannot prove the dataset is good, but the explicit contamination, format-mismatch, and very-small-data traps are currently absent.</p></div>
          ) : risks.map((risk) => (
            <div key={risk.id} className={`rounded-2xl border p-5 ${risk.severity === 'critical' ? 'border-rose-300 bg-rose-50 text-rose-950' : risk.severity === 'high' ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-yellow-200 bg-yellow-50 text-yellow-950'}`}>
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide"><AlertTriangle size={16} /> {risk.title}</div>
              <p className="mt-2 text-sm leading-6">{risk.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 text-purple-950"><h3 className="font-black">Full FT</h3><p className="mt-2 text-sm leading-6">Maximum freedom, maximum optimizer state. Use when changing all weights is justified by data, budget, and validation—not because it is the default.</p></div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950"><h3 className="font-black">LoRA</h3><p className="mt-2 text-sm leading-6">Keep the base frozen and learn low-rank updates. Rank changes adapter capacity and trainable parameter count.</p></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><h3 className="font-black">QLoRA</h3><p className="mt-2 text-sm leading-6">Keep LoRA trainable while quantizing the frozen base. It reduces base-weight storage; it does not make bad data safe.</p></div>
      </section>
    </div>
  );
}
