import React, { useMemo, useState } from 'react';
import { CheckCircle2, GitBranch, RefreshCw } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { POLICY_ITERATION_DEFAULTS, POLICY_ITERATION_MDP } from './policyIterationConfig';
import { actionValue, evaluatePolicyForSweeps, runPolicyIteration } from './policyIterationModel';

const NON_TERMINAL_STATES = POLICY_ITERATION_MDP.states.filter((state) => !POLICY_ITERATION_MDP.terminalStates.includes(state));

function Stat({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function PolicyIterationAnimation() {
  const [discount, setDiscount] = useState(POLICY_ITERATION_DEFAULTS.discount);
  const [round, setRound] = useState(0);
  const result = useMemo(() => runPolicyIteration(
    POLICY_ITERATION_MDP,
    POLICY_ITERATION_DEFAULTS.initialPolicy,
    discount,
    POLICY_ITERATION_DEFAULTS,
  ), [discount]);
  const selectedRound = Math.min(round, result.history.length - 1);
  const snapshot = result.history[selectedRound];
  const shortValues = useMemo(() => evaluatePolicyForSweeps(POLICY_ITERATION_MDP, snapshot.policy, discount, 2), [snapshot, discount]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Dynamic programming</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Policy Iteration: evaluate to a fixed point, then improve</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          A policy is not evaluated by an arbitrary number of lookahead steps. Policy evaluation solves its Bellman equations to a tolerance;
          policy improvement then replaces actions with greedy choices under those converged values.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Discount γ: {discount.toFixed(2)}
          <input type="range" min="0" max="0.99" step="0.01" value={discount} onChange={(event) => { setDiscount(Number(event.target.value)); setRound(0); }} />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.history.map((item, index) => (
            <button key={item.round} type="button" onClick={() => setRound(index)} className={`rounded-lg border px-3 py-2 text-sm font-bold ${selectedRound === index ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 text-slate-700'}`}>
              Round {index + 1}{item.improvement.stable ? ' · stable' : ''}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Policy rounds" value={result.rounds} detail={result.stable ? 'stable policy reached' : 'iteration cap reached'} />
        <Stat label="Eval iterations" value={snapshot.evaluation.iterations} detail="Bellman sweeps this round" />
        <Stat label="Eval residual" value={snapshot.evaluation.residual.toExponential(1)} detail="policy Bellman error" />
        <Stat label="Changes" value={snapshot.improvement.changes.length} detail="actions replaced after evaluation" />
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><GitBranch size={16} /> Policy evaluation + improvement</h3>
          <div className="mt-4 space-y-3">
            {NON_TERMINAL_STATES.map((state) => {
              const currentAction = snapshot.policy[state];
              const improvedAction = snapshot.improvement.policy[state];
              return (
                <div key={state} className={`rounded-lg border p-4 ${currentAction === improvedAction ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><strong className="text-slate-950">{state}</strong><p className="text-sm text-slate-600">Vπ(s) = {snapshot.evaluation.values[state].toFixed(3)}</p></div>
                    <div className="text-right text-sm text-slate-700"><div>π(s): <strong>{currentAction}</strong></div><div>greedy: <strong>{improvedAction}</strong></div></div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {Object.keys(POLICY_ITERATION_MDP.actions[state]).map((actionId) => (
                      <div key={actionId} className="rounded bg-white px-3 py-2 text-xs text-slate-700">Qπ({state}, {actionId}) = <strong>{actionValue(POLICY_ITERATION_MDP, state, actionId, snapshot.evaluation.values, discount).toFixed(3)}</strong></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-rose-700">Truncated-evaluation trap</h3>
            <p className="mt-2 text-sm leading-6 text-rose-950">Two sweeps can look plausible while still being far from Vπ. This is modified policy iteration, not exact policy iteration, unless you control the approximation error.</p>
            <div className="mt-3 space-y-2 text-sm">
              {NON_TERMINAL_STATES.map((state) => <div key={state} className="flex justify-between"><span>{state}</span><span className="font-mono">2 sweeps {shortValues[state].toFixed(2)} · converged {snapshot.evaluation.values[state].toFixed(2)}</span></div>)}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950">
            <CheckCircle2 className="mr-2 inline" size={16} /> Goal is truly terminal: reward is paid on entry and <strong>V(Goal)=0</strong>. There is no hidden +10 self-loop.
          </div>
          <button type="button" onClick={() => { setDiscount(POLICY_ITERATION_DEFAULTS.discount); setRound(0); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"><RefreshCw size={16} /> Reset</button>
        </div>
      </section>

      <AssessmentPanel lessonId="policy-iteration" title="Policy iteration check" />
    </div>
  );
}
