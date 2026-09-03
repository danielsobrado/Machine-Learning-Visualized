import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, HeartPulse } from 'lucide-react';
import { recoveryProbe, simulateReluTraining } from './reluModel.js';

const DEFAULTS = {
  input: 1,
  target: 0.2,
  weight: 1,
  bias: 0,
  steps: 5,
};

function format(value) {
  if (Math.abs(value) < 0.0001 && value !== 0) return value.toExponential(2);
  return value.toFixed(3).replace(/\.?0+$/, '');
}

export default function ReluFailureLab() {
  const [learningRate, setLearningRate] = useState(1);
  const [biasNudge, setBiasNudge] = useState(1);
  const run = useMemo(() => simulateReluTraining({ ...DEFAULTS, learningRate }), [learningRate]);
  const firstDead = run.firstDeadStep ? run.history[run.firstDeadStep - 1] : null;
  const deadState = firstDead ?? run.final;
  const recovery = useMemo(() => recoveryProbe({
    input: DEFAULTS.input,
    target: DEFAULTS.target,
    weight: deadState.nextWeight,
    bias: deadState.nextBias,
    learningRate: Math.min(learningRate, 0.4),
    biasNudge,
  }), [biasNudge, deadState.nextBias, deadState.nextWeight, learningRate]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 p-4 md:p-6">
      <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rose-700" />
          <div>
            <div className="text-sm font-black uppercase tracking-wide text-rose-700">Dying ReLU lab</div>
            <h2 className="mt-1 text-xl font-black text-slate-950">A neuron can kill its own learning signal in one bad step</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Start with an active ReLU, train it on the same example, and increase the learning rate. If an update pushes z below zero, ReLU's local derivative becomes zero. For this example, the neuron can no longer use its own gradient to come back.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label htmlFor="relu-failure-lr" className="text-sm font-black text-slate-800">Learning rate α = {learningRate.toFixed(2)}</label>
          <input id="relu-failure-lr" type="range" min="0.05" max="1.4" step="0.05" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} className="mt-3 w-full accent-rose-600" />
          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs uppercase tracking-wide text-slate-400">Initial example</div>
            <div className="mt-2 font-mono text-sm">x=1 · target=0.2</div>
            <div className="font-mono text-sm">w=1 · b=0</div>
            <div className="mt-3 text-xs text-slate-300">Initial z=1, so the neuron starts active.</div>
          </div>
          <div className={`mt-4 rounded-xl border p-4 ${run.firstDeadStep ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className="text-xs font-black uppercase tracking-wide text-slate-600">Outcome</div>
            <div className="mt-1 text-lg font-black text-slate-950">{run.firstDeadStep ? `Dead at step ${run.firstDeadStep}` : 'Still active'}</div>
            <p className="mt-1 text-xs leading-5 text-slate-600">{run.firstDeadStep ? 'Every later parameter gradient is exactly zero for this repeated input.' : 'The neuron keeps receiving nonzero gradients.'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Activity size={16} /> Training trace</div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Step</th><th className="px-3 py-2">z</th><th className="px-3 py-2">ReLU(z)</th><th className="px-3 py-2">slope</th><th className="px-3 py-2">dL/dw</th><th className="px-3 py-2">w → next</th><th className="px-3 py-2">b → next</th><th className="px-3 py-2">loss</th></tr></thead>
              <tbody>
                {run.history.map((entry) => (
                  <tr key={entry.step} className={`border-t border-slate-200 ${entry.dead ? 'bg-rose-50' : 'bg-white'}`}>
                    <td className="px-3 py-2 font-black">{entry.step}</td><td className="px-3 py-2 font-mono">{format(entry.z)}</td><td className="px-3 py-2 font-mono">{format(entry.activation)}</td><td className="px-3 py-2 font-mono">{entry.localSlope}</td><td className="px-3 py-2 font-mono">{format(entry.weightGradient)}</td><td className="px-3 py-2 font-mono">{format(entry.weight)} → {format(entry.nextWeight)}</td><td className="px-3 py-2 font-mono">{format(entry.bias)} → {format(entry.nextBias)}</td><td className="px-3 py-2 font-mono">{format(entry.loss)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700"><HeartPulse size={16} /> External recovery probe</div>
        <p className="mt-2 text-sm leading-6 text-slate-700">A dead ReLU cannot move itself because its gradient is zero. But another mechanism—different data, optimizer state, parameter coupling, or an explicit parameter change—can move z back above zero.</p>
        <label htmlFor="relu-bias-nudge" className="mt-4 block text-sm font-black text-slate-800">External bias nudge +{biasNudge.toFixed(2)}</label>
        <input id="relu-bias-nudge" type="range" min="0" max="1.5" step="0.05" value={biasNudge} onChange={(event) => setBiasNudge(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Before nudge</div><div className="mt-1 font-mono text-lg font-black">z={format(recovery.before.z)} · slope={recovery.before.localSlope}</div></div>
          <div className={`rounded-xl border p-4 ${recovery.revived ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}><div className="text-xs uppercase tracking-wide text-slate-500">After nudge</div><div className="mt-1 font-mono text-lg font-black">z={format(recovery.after.z)} · slope={recovery.after.localSlope}</div></div>
        </div>
      </section>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Important:</strong> ReLU's derivative at exactly zero is mathematically undefined; common autodiff implementations choose a convention. This lab uses slope 0 at z=0 and focuses on the unambiguous negative half-space.</p>
    </div>
  );
}
