import React, { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, ShieldCheck } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { PPO_DEFAULTS, PPO_PRESETS } from './ppoConfig';
import { buildPpoCounterexamples, evaluatePpoBatch } from './ppoModel';

function Stat({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function PpoClippedPolicyGradientAnimation() {
  const [presetId, setPresetId] = useState(PPO_DEFAULTS.presetId);
  const [epsilon, setEpsilon] = useState(PPO_DEFAULTS.epsilon);
  const preset = PPO_PRESETS.find((item) => item.id === presetId);
  const batch = useMemo(() => evaluatePpoBatch(preset.samples, epsilon), [preset, epsilon]);
  const examples = useMemo(() => buildPpoCounterexamples(epsilon), [epsilon]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Policy optimization</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">PPO: clip the surrogate, not the whole policy</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">For an action sampled under πold, PPO uses the feasible ratio <strong>r = πnew(a|s) / πold(a|s)</strong>. The clipped objective limits surrogate improvement in dangerous directions, but it is not a hard KL trust region.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">{PPO_PRESETS.map((item) => <button key={item.id} type="button" onClick={() => setPresetId(item.id)} className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span></button>)}</div>
        <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">Clip ε: {epsilon.toFixed(2)}<input type="range" min="0.05" max="0.4" step="0.01" value={epsilon} onChange={(event) => setEpsilon(Number(event.target.value))} /></label>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Mean clipped objective" value={batch.meanObjective.toFixed(3)} detail="min(rA, clip(r)A)" />
        <Stat label="Clip fraction" value={`${(batch.clipFraction * 100).toFixed(0)}%`} detail="samples where clipping is active" />
        <Stat label="Mean exact KL" value={batch.meanKl.toFixed(3)} detail="Bernoulli KL(πold || πnew)" />
        <Stat label="Max ratio drift" value={batch.maxRatioDeviation.toFixed(2)} detail="max |r − 1| in minibatch" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Gauge size={16} /> Valid policy-ratio minibatch</h3>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500"><th className="p-2">Action</th><th className="p-2">π old</th><th className="p-2">π new</th><th className="p-2">Ratio</th><th className="p-2">Advantage</th><th className="p-2">Objective</th><th className="p-2">KL</th><th className="p-2">Status</th></tr></thead><tbody>{batch.rows.map((row, index) => <tr key={index} className="border-b border-slate-100"><td className="p-2 font-mono">{row.action}</td><td className="p-2 font-mono">{row.oldProbability.toFixed(3)}</td><td className="p-2 font-mono">{row.newProbability.toFixed(3)}</td><td className="p-2 font-mono">{row.ratio.toFixed(3)}</td><td className="p-2 font-mono">{row.advantage.toFixed(2)}</td><td className="p-2 font-mono">{row.objective.toFixed(3)}</td><td className="p-2 font-mono">{row.kl.toFixed(3)}</td><td className="p-2"><span className={`rounded px-2 py-1 text-xs font-black ${row.clippingActive ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{row.clippingActive ? 'clipped' : 'unclipped'}</span></td></tr>)}</tbody></table></div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><h3 className="flex items-center gap-2 font-black"><ShieldCheck size={16} /> Helpful-direction clipping</h3><p className="mt-2">Positive advantage + excessively high ratio clips: {examples.positiveHelpful.objective.toFixed(2)}. Negative advantage + excessively low ratio also clips: {examples.negativeHelpful.objective.toFixed(2)}.</p></div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><h3 className="flex items-center gap-2 font-black"><AlertTriangle size={16} /> Not a hard trust region</h3><p className="mt-2">Large wrong-way moves can remain unclipped because they already make the surrogate worse. PPO clipping prevents excessive surrogate improvement; monitor KL separately if policy drift matters.</p></div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">The previous lesson let a ratio imply an impossible action probability and then silently clamped it. This version starts from complete old/new policies, so every displayed ratio is realizable by construction.</section>
      <AssessmentPanel lessonId="ppo-clipped-policy-gradient" title="PPO clipped policy gradient check" />
    </div>
  );
}
