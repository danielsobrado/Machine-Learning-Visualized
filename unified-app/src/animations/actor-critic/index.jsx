import React, { useMemo, useState } from 'react';
import { Brain, SlidersHorizontal, Users } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { ACTOR_CRITIC_DEFAULTS, ACTOR_CRITIC_LIMITS } from './actorCriticConstants.js';
import { actorCriticStep, policySensitivityExperiment, tdTarget } from './actorCriticModel.js';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs leading-5 text-slate-600">{detail}</div>
    </div>
  );
}

export default function ActorCriticAnimation() {
  const [policyLogit, setPolicyLogit] = useState(ACTOR_CRITIC_DEFAULTS.policyLogit);
  const [sampledAction, setSampledAction] = useState(ACTOR_CRITIC_DEFAULTS.sampledAction);
  const [criticValue, setCriticValue] = useState(ACTOR_CRITIC_DEFAULTS.criticValue);
  const [actorStep, setActorStep] = useState(ACTOR_CRITIC_DEFAULTS.actorStep);
  const [criticStep, setCriticStep] = useState(ACTOR_CRITIC_DEFAULTS.criticStep);
  const [targetMode, setTargetMode] = useState('td');

  const targetValue = targetMode === 'td'
    ? tdTarget({ reward: ACTOR_CRITIC_DEFAULTS.reward, gamma: ACTOR_CRITIC_DEFAULTS.gamma, nextValue: ACTOR_CRITIC_DEFAULTS.nextValue })
    : ACTOR_CRITIC_DEFAULTS.returnValue;

  const update = useMemo(() => actorCriticStep({
    policyLogit,
    sampledAction,
    targetValue,
    criticValue,
    actorStep,
    criticStep,
  }), [actorStep, criticStep, criticValue, policyLogit, sampledAction, targetValue]);
  const sensitivity = policySensitivityExperiment({ advantage: 4, actorStep, sampledAction: 1 });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Policy gradient + value baseline</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Actor–Critic</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Advantage tells the actor whether the sampled action was better or worse than the critic expected. The actual parameter update also depends on the policy score gradient: <span className="font-mono">A · ∇ log π(a|s)</span>.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-violet-700"><SlidersHorizontal size={16} /> Shared transition</div>

          <label className="block text-sm font-semibold text-slate-700" htmlFor="ac-policy-logit">
            Policy logit θ: {policyLogit.toFixed(1)}
            <input id="ac-policy-logit" type="range" {...ACTOR_CRITIC_LIMITS.policyLogit} value={policyLogit} onChange={(event) => setPolicyLogit(Number(event.target.value))} className="mt-2 w-full accent-violet-500" />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {[0, 1].map((action) => (
              <button key={action} type="button" aria-pressed={sampledAction === action} onClick={() => setSampledAction(action)} className={`rounded-xl border px-3 py-2 text-sm font-black ${sampledAction === action ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>sample action {action}</button>
            ))}
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="ac-critic">
            Critic V(s): {criticValue}
            <input id="ac-critic" type="range" {...ACTOR_CRITIC_LIMITS.value} value={criticValue} onChange={(event) => setCriticValue(Number(event.target.value))} className="mt-2 w-full accent-violet-500" />
          </label>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="ac-actor-step">Actor step {actorStep.toFixed(2)}<input id="ac-actor-step" type="range" {...ACTOR_CRITIC_LIMITS.step} value={actorStep} onChange={(event) => setActorStep(Number(event.target.value))} className="mt-2 w-full accent-violet-500" /></label>
            <label className="block text-sm font-semibold text-slate-700" htmlFor="ac-critic-step">Critic step {criticStep.toFixed(2)}<input id="ac-critic-step" type="range" {...ACTOR_CRITIC_LIMITS.step} value={criticStep} onChange={(event) => setCriticStep(Number(event.target.value))} className="mt-2 w-full accent-violet-500" /></label>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setTargetMode('td')} className={`rounded-xl border px-3 py-2 text-sm font-black ${targetMode === 'td' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 bg-white'}`}>TD(0) target</button>
            <button type="button" onClick={() => setTargetMode('return')} className={`rounded-xl border px-3 py-2 text-sm font-black ${targetMode === 'return' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 bg-white'}`}>Observed return</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="π(action=1)" value={`${(update.probability * 100).toFixed(1)}%`} detail="before the update" />
            <Stat label="Advantage" value={update.advantage.toFixed(2)} detail={`target ${targetValue.toFixed(2)} - V(s) ${criticValue.toFixed(2)}`} />
            <Stat label="∂ log π / ∂θ" value={update.scoreGradient.toFixed(3)} detail={`sampled action ${sampledAction}`} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-900"><Brain size={16} /> Actor</div>
              <div className="mt-3 font-mono text-sm text-violet-950">Δθ = α · A · ∂logπ/∂θ</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{update.actorDelta >= 0 ? '+' : ''}{update.actorDelta.toFixed(3)}</div>
              <p className="mt-2 text-sm text-slate-700">Policy probability moves to {(update.nextProbability * 100).toFixed(1)}% for action 1.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Users size={16} /> Critic</div>
              <div className="mt-3 font-mono text-sm text-slate-700">V ← V + β(target - V)</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{update.nextCritic.toFixed(2)}</div>
              <p className="mt-2 text-sm text-slate-700">Critic delta {update.criticDelta >= 0 ? '+' : ''}{update.criticDelta.toFixed(2)}.</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs uppercase tracking-wide text-violet-200">Target used</div>
            <div className="mt-1 text-2xl font-black">{targetMode === 'td' ? 'r + γV(s′)' : 'trajectory return'}</div>
            <p className="mt-2 text-sm text-slate-300">TD(0) bootstraps from the next-state critic estimate. A full return does not. Both can provide an advantage target, but they have different bias/variance tradeoffs.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab: advantage is not the update</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Same advantage, 10× different actor parameter movement</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">For action 1 and A=4, compare a policy where the action has probability 0.50 with one where it already has probability 0.95.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sensitivity.map((row) => (
            <div key={row.policyLogit} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-black text-slate-900">π(a=1) = {(row.probability * 100).toFixed(0)}%</div>
              <div className="mt-2 font-mono text-sm">score gradient = {row.scoreGradient.toFixed(3)}</div>
              <div className="mt-1 font-mono text-sm">actor Δθ = {row.actorDelta.toFixed(3)}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-amber-950">The old visualization showed only <span className="font-mono">α × advantage</span>. That is a learning signal, not the policy-parameter gradient.</p>
      </section>

      <AssessmentPanel lessonId="actor-critic" title="Actor-critic check" />
    </div>
  );
}
