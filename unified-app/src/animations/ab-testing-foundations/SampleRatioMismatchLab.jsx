import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Shuffle } from 'lucide-react';
import { sampleRatioMismatch } from './abTestingModel.js';
import { SRM_DEFAULTS, SRM_FLAG_P_VALUE, SRM_LIMITS } from './abTestingIntegrityConstants.js';

function Stat({ label, value, detail, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-200 bg-white text-slate-950',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    rose: 'border-rose-200 bg-rose-50 text-rose-950',
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="text-xs font-black uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
      <p className="mt-1 text-xs leading-5 opacity-80">{detail}</p>
    </div>
  );
}

export default function SampleRatioMismatchLab() {
  const [total, setTotal] = useState(SRM_DEFAULTS.total);
  const [plannedTreatmentShare, setPlannedTreatmentShare] = useState(SRM_DEFAULTS.plannedTreatmentShare);
  const expectedTreatment = Math.round(total * plannedTreatmentShare);
  const [offset, setOffset] = useState(0);
  const observedTreatment = Math.min(total, Math.max(0, expectedTreatment + offset));

  const result = useMemo(() => sampleRatioMismatch({ total, plannedTreatmentShare, observedTreatment }), [observedTreatment, plannedTreatmentShare, total]);
  const maximumOffset = Math.max(50, Math.round(total * 0.08));

  return (
    <section className="space-y-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
      <header>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700"><Shuffle size={16} /> Assignment integrity lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Planned imbalance is fine. Unexpected imbalance is a warning.</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">A 70/30 experiment is not broken if 70/30 was the design. Sample ratio mismatch asks a different question: did the observed assignment counts deviate implausibly far from the pre-declared randomization ratio?</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Total assigned: {total.toLocaleString()}
          <input type="range" {...SRM_LIMITS.total} value={total} onChange={(event) => { setTotal(Number(event.target.value)); setOffset(0); }} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Planned treatment share: {(plannedTreatmentShare * 100).toFixed(0)}%
          <input type="range" {...SRM_LIMITS.treatmentShare} value={plannedTreatmentShare} onChange={(event) => { setPlannedTreatmentShare(Number(event.target.value)); setOffset(0); }} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Treatment count deviation: {offset >= 0 ? '+' : ''}{offset.toLocaleString()}
          <input type="range" min={-maximumOffset} max={maximumOffset} step="10" value={offset} onChange={(event) => setOffset(Number(event.target.value))} />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Expected treatment" value={Math.round(result.expectedTreatment).toLocaleString()} detail="From the planned randomization ratio." />
        <Stat label="Observed treatment" value={result.observedTreatment.toLocaleString()} detail={`${(result.observedTreatmentShare * 100).toFixed(2)}% of assigned users.`} />
        <Stat label="Assignment z" value={result.z.toFixed(2)} detail="Deviation measured in randomization standard errors." />
        <Stat label="SRM p-value" value={result.pValue < 0.0001 ? '<0.0001' : result.pValue.toFixed(4)} detail={`Flag threshold p < ${SRM_FLAG_P_VALUE}.`} tone={result.flagged ? 'rose' : 'emerald'} />
      </div>

      <div className={`rounded-xl border bg-white p-4 ${result.flagged ? 'border-rose-300 text-rose-950' : 'border-emerald-300 text-emerald-950'}`}>
        <div className="flex items-center gap-2 font-black">{result.flagged ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}{result.flagged ? 'Investigate assignment before reading treatment effect' : 'No strong assignment-count anomaly'}</div>
        <p className="mt-2 text-sm leading-6">{result.flagged ? 'Large SRM can come from logging loss, eligibility differences, bucketing bugs, redirects, bot filtering, or exposure instrumentation. A tiny treatment-effect p-value does not repair broken randomization.' : 'The observed counts are plausible under the planned split. This does not prove the experiment is otherwise valid; it only clears this assignment-count check.'}</p>
      </div>
    </section>
  );
}
