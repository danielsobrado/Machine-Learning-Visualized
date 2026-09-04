import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, Lightbulb, Shield } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { SPEARMAN_DEFAULTS, SPEARMAN_PRESETS } from './spearmanConfig';
import { buildSpearmanLab } from './spearmanModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function correlationText(value) {
  return value === null ? 'undefined' : value.toFixed(3);
}

export default function SpearmanCorrelationAnimation() {
  const [presetId, setPresetId] = useState(SPEARMAN_DEFAULTS.presetId);
  const [outlierMultiplier, setOutlierMultiplier] = useState(SPEARMAN_DEFAULTS.outlierMultiplier);
  const preset = SPEARMAN_PRESETS.find((item) => item.id === presetId);
  const multiplier = presetId === 'outlier' ? outlierMultiplier : 1;
  const lab = useMemo(() => buildSpearmanLab({ x: preset.x, y: preset.y, outlierMultiplier: multiplier }), [preset, multiplier]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Rank correlation</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Spearman Correlation</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          The general definition is simple: <strong>rank X, rank Y, then compute Pearson correlation of those ranks</strong>.
          This works with ties when tied values receive average ranks. The familiar Σd² formula is only a no-ties shortcut.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {SPEARMAN_PRESETS.map((item) => (
            <button key={item.id} type="button" onClick={() => setPresetId(item.id)} className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
        {presetId === 'outlier' && (
          <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">Outlier multiplier: {outlierMultiplier.toFixed(1)}×<input type="range" min="1" max="30" step="1" value={outlierMultiplier} onChange={(event) => setOutlierMultiplier(Number(event.target.value))} /></label>
        )}
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Stat label="Spearman ρ" value={correlationText(lab.spearman)} detail="Pearson correlation of ranks" />
        <Stat label="Pearson r" value={correlationText(lab.pearson)} detail="raw-value linear association" />
        <Stat label="Ties" value={lab.hasTies ? 'yes' : 'no'} detail="average ranking required" />
        <Stat label="Σd²" value={lab.sumD2.toFixed(2)} detail="rank-difference diagnostic" />
        <Stat label="Monotonic transform" value={correlationText(lab.transformedSpearman)} detail="ρ after exp(x/10)" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4"><h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Calculator size={16} /> Rank table</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">#</th><th className="p-3">X</th><th className="p-3">Y</th><th className="p-3">rank X</th><th className="p-3">rank Y</th><th className="p-3">d</th><th className="p-3">d²</th></tr></thead>
              <tbody>{lab.rows.map((row) => <tr key={row.index} className="border-t border-slate-100"><td className="p-3 font-bold">{row.index + 1}</td><td className="p-3">{row.x.toFixed(2)}</td><td className="p-3">{row.y.toFixed(2)}</td><td className="p-3 font-mono text-indigo-700">{row.rankX.toFixed(1)}</td><td className="p-3 font-mono text-emerald-700">{row.rankY.toFixed(1)}</td><td className="p-3 font-mono">{row.d.toFixed(1)}</td><td className="p-3 font-mono">{row.d2.toFixed(2)}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Lightbulb size={16} /> General definition</h3>
            <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100">ρₛ = corr(rank(X), rank(Y))</div>
            <p className="mt-3 text-sm leading-6 text-slate-700">This is the definition to remember. It naturally supports average ranks for tied observations.</p>
          </div>
          <div className={`rounded-lg border p-5 ${lab.shortcut === null ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <h3 className="text-sm font-black uppercase tracking-wide">No-ties shortcut</h3>
            <p className="mt-3 font-mono text-sm">1 - 6Σd² / [n(n² - 1)]</p>
            <p className="mt-3 text-sm leading-6">{lab.shortcut === null ? 'Not valid for this dataset because at least one variable contains ties.' : `Valid here: ${lab.shortcut.toFixed(3)}, matching corr(ranks).`}</p>
          </div>
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950"><strong className="block text-xs uppercase tracking-wide text-indigo-700">Nonlinear monotonic</strong>The squared preset has Spearman ρ = 1 because order is perfectly preserved even though Pearson is below 1.</div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong className="block text-xs uppercase tracking-wide text-emerald-700">Outlier magnitude</strong>When the last point stays last in rank, making it 30× larger changes Pearson but leaves Spearman unchanged.</div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950"><strong className="block text-xs uppercase tracking-wide text-rose-700">Not any relationship</strong>The U-shaped preset has a strong deterministic relationship but weak rank correlation because the relationship is not monotonic.</div>
      </section>

      {lab.hasTies && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><AlertTriangle className="mr-2 inline" size={16} /> The previous implementation's Σd² shortcut would teach the wrong general procedure here. Average ranks + Pearson correlation is the correct route.</div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700"><Shield className="mr-2 inline" size={16} /> Spearman measures monotonic association, not causation, linearity, or arbitrary dependence. Always inspect the data shape as well as the coefficient.</section>

      <AssessmentPanel lessonId="spearman-correlation" title="Spearman Correlation check" />
    </div>
  );
}
