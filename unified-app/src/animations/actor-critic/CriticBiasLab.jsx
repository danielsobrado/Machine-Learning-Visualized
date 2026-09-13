import React, { useMemo, useState } from 'react';
import { AlertTriangle, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { criticBiasComparison } from './criticBiasModel.js';

const TARGET_VALUE = 8;
const TRUE_STATE_VALUE = 5;
const ACTOR_STEP = 0.2;
const POLICY_LOGIT = 0;
const SAMPLED_ACTION = 1;

function DeltaCard({ title, result, tone }) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-xs font-black uppercase tracking-wide">{title}</div>
      <div className="mt-2 font-mono text-sm">advantage = {result.advantage.toFixed(2)}</div>
      <div className="mt-1 text-3xl font-black text-slate-950">Δθ {result.actorDelta >= 0 ? '+' : ''}{result.actorDelta.toFixed(3)}</div>
      <div className="mt-2 text-xs text-slate-600">π(a=1): {(result.probability * 100).toFixed(1)}% → {(result.nextProbability * 100).toFixed(1)}%</div>
    </div>
  );
}

export default function CriticBiasLab() {
  const [criticValue, setCriticValue] = useState(9);
  const comparison = useMemo(() => criticBiasComparison({
    policyLogit: POLICY_LOGIT,
    sampledAction: SAMPLED_ACTION,
    targetValue: TARGET_VALUE,
    trueStateValue: TRUE_STATE_VALUE,
    criticValue,
    actorStep: ACTOR_STEP,
  }), [criticValue]);

  return (
    <section className="space-y-5 rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm">
      <header>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-700"><BrainCircuit size={16} /> Failure lab · critic bias</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">A bad critic can tell the actor to move the wrong way.</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Keep the transition target fixed at {TARGET_VALUE} and assume the true state value is {TRUE_STATE_VALUE}. Move only the critic estimate. The actor never sees the true baseline; it trusts the critic's advantage estimate.</p>
      </header>

      <label className="block max-w-xl text-sm font-black text-slate-700">
        Critic estimate V̂(s): {criticValue.toFixed(1)}
        <input type="range" min="0" max="10" step="0.25" value={criticValue} onChange={(event) => setCriticValue(Number(event.target.value))} className="mt-2 w-full accent-rose-600" />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <DeltaCard title="Ideal update using true V(s)" result={comparison.ideal} tone="border-emerald-200 bg-emerald-50 text-emerald-900" />
        <DeltaCard title="Actor update using critic estimate" result={comparison.estimated} tone={comparison.directionFlipped ? 'border-rose-300 bg-rose-100 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'} />
      </div>

      <div className={`rounded-xl border p-4 ${comparison.directionFlipped ? 'border-rose-300 bg-white text-rose-950' : 'border-emerald-300 bg-white text-emerald-950'}`}>
        <div className="flex items-center gap-2 font-black">{comparison.directionFlipped ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}{comparison.directionFlipped ? 'Update direction flipped' : 'Update direction still agrees'}</div>
        <p className="mt-2 text-sm leading-6">Critic error is {comparison.criticError >= 0 ? '+' : ''}{comparison.criticError.toFixed(2)}. When V̂(s) rises above the observed target, the estimated advantage becomes negative even though the true advantage is positive.</p>
      </div>
    </section>
  );
}
