import React, { useMemo, useState } from 'react';
import { Activity, RefreshCw, Repeat2, Route } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { MARKOV_DEFAULTS, MARKOV_PRESETS } from './markovConfig';
import { buildMarkovLab } from './markovModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function Distribution({ title, states, values }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <strong className="text-sm text-slate-950">{title}</strong>
      <div className="mt-3 space-y-2">
        {states.map((state, index) => (
          <div key={state} className="grid grid-cols-[88px_1fr_58px] items-center gap-2 text-xs">
            <span className="font-bold text-slate-700">{state}</span>
            <div className="h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-violet-500" style={{ width: `${values[index] * 100}%` }} /></div>
            <span className="text-right font-mono text-slate-600">{(values[index] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarkovChainsAnimation() {
  const [presetId, setPresetId] = useState(MARKOV_DEFAULTS.presetId);
  const [steps, setSteps] = useState(MARKOV_DEFAULTS.steps);
  const [seed, setSeed] = useState(MARKOV_DEFAULTS.seed);
  const preset = MARKOV_PRESETS.find((item) => item.id === presetId);
  const lab = useMemo(() => buildMarkovLab({ matrix: preset.matrix, steps, seed }), [preset, steps, seed]);

  const convergenceMessage = lab.irreducible && lab.aperiodic
    ? 'This finite chain is ergodic, so every starting distribution converges to one stationary distribution.'
    : presetId === 'periodic'
      ? 'A stationary distribution exists, but a point-mass start oscillates because the chain has period 2.'
      : 'The chain is not irreducible, so long-run behavior can depend on where probability starts.';

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Stochastic processes</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Markov Chains: stationary does not always mean convergent</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          A Markov chain advances a probability distribution with <strong>pₜ₊₁ = pₜP</strong>. The next state depends on the current state, not the full path. Long-run convergence needs more than merely finding a vector satisfying <strong>π = πP</strong>.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {MARKOV_PRESETS.map((item) => (
            <button key={item.id} type="button" onClick={() => setPresetId(item.id)} className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
        <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
          Transition steps: {steps}
          <input type="range" min="1" max="40" step="1" value={steps} onChange={(event) => setSteps(Number(event.target.value))} />
        </label>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Irreducible" value={lab.irreducible ? 'Yes' : 'No'} detail="all states communicate" />
        <Stat label="Estimated period" value={lab.period ?? '—'} detail={lab.aperiodic ? 'aperiodic' : 'periodic / not applicable'} />
        <Stat label="Start sensitivity" value={lab.startSensitivity.toFixed(3)} detail="L1 gap after selected steps" />
        <Stat label="Stationary residual" value={lab.stationaryResidual.toExponential(1)} detail="max |πP − π|" />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Distribution title={`Start entirely in ${preset.states[0]}`} states={preset.states} values={lab.fromFirst} />
        <Distribution title={`Start entirely in ${preset.states[preset.states.length - 1]}`} states={preset.states} values={lab.fromLast} />
        <Distribution title="Uniform-start iteration candidate" states={preset.states} values={lab.stationaryCandidate} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Route size={16} /> Transition matrix</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-center text-sm">
              <thead><tr><th className="p-2 text-left">from \ to</th>{preset.states.map((state) => <th key={state} className="p-2">{state}</th>)}</tr></thead>
              <tbody>{preset.matrix.map((row, source) => <tr key={preset.states[source]} className="border-t border-slate-100"><th className="p-2 text-left">{preset.states[source]}</th>{row.map((value, target) => <td key={preset.states[target]} className="p-2 font-mono">{value.toFixed(2)}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg bg-violet-50 p-4 text-sm leading-6 text-violet-950">{convergenceMessage}</div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Activity size={16} /> One sampled path</h3>
            <button type="button" onClick={() => setSeed((value) => value + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold"><RefreshCw size={14} /> New path</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {lab.path.map((state, index) => <span key={`${index}-${state}`} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{preset.states[state]}</span>)}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">A sample path is one random realization. The distribution panels track probabilities over many hypothetical realizations.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong className="block text-xs uppercase tracking-wide">Ergodic chain</strong>Irreducible + aperiodic finite chains converge to a unique stationary distribution.</div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong className="block text-xs uppercase tracking-wide">Absorbing chain</strong>Stationary distributions may not be unique, and the limiting mixture can depend on the start.</div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950"><strong className="block text-xs uppercase tracking-wide"><Repeat2 size={14} className="mr-1 inline" />Periodic chain</strong>A stationary distribution can exist even when pₜ oscillates forever from some starts.</div>
      </section>

      <AssessmentPanel lessonId="markov-chains" title="Markov Chains check" />
    </div>
  );
}
