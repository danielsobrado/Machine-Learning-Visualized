import React, { useMemo, useState } from 'react';
import { GitBranch } from 'lucide-react';
import {
  SOFTMAX_JACOBIAN_DEFAULTS,
  SOFTMAX_JACOBIAN_LIMITS,
} from './softmaxJacobianConstants.js';
import { perturbSoftmaxLogit } from './softmaxJacobianModel.js';

function format(value) {
  if (Math.abs(value) < 0.001 && value !== 0) return value.toExponential(2);
  return value.toFixed(4);
}

export default function SoftmaxJacobianLab() {
  const [selectedLogit, setSelectedLogit] = useState(SOFTMAX_JACOBIAN_DEFAULTS.selectedLogit);
  const [perturbation, setPerturbation] = useState(SOFTMAX_JACOBIAN_DEFAULTS.perturbation);
  const [temperature, setTemperature] = useState(SOFTMAX_JACOBIAN_DEFAULTS.temperature);
  const result = useMemo(() => perturbSoftmaxLogit({
    logits: SOFTMAX_JACOBIAN_DEFAULTS.logits,
    selectedLogit,
    perturbation,
    temperature,
  }), [perturbation, selectedLogit, temperature]);

  return (
    <section className="mx-auto max-w-6xl space-y-5 rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <div className="rounded-lg bg-violet-100 p-2 text-violet-800"><GitBranch size={20} /></div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Coupled derivatives</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">One logit moves every softmax probability</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Softmax is not an elementwise activation. Its Jacobian has positive diagonal terms and negative off-diagonal terms, so increasing one logit raises its own probability while taking probability mass from the others.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="block text-sm font-semibold text-slate-700">
            Perturb logit
            <select value={selectedLogit} onChange={(event) => setSelectedLogit(Number(event.target.value))} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
              {SOFTMAX_JACOBIAN_DEFAULTS.logits.map((_, index) => <option key={index} value={index}>z{index + 1}</option>)}
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            <span className="flex justify-between gap-3"><span>Δ logit</span><strong className="font-mono">{perturbation.toFixed(2)}</strong></span>
            <input className="mt-2 w-full accent-violet-600" type="range" min={SOFTMAX_JACOBIAN_LIMITS.perturbation.min} max={SOFTMAX_JACOBIAN_LIMITS.perturbation.max} step={SOFTMAX_JACOBIAN_LIMITS.perturbation.step} value={perturbation} onChange={(event) => setPerturbation(Number(event.target.value))} />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            <span className="flex justify-between gap-3"><span>Temperature τ</span><strong className="font-mono">{temperature.toFixed(1)}</strong></span>
            <input className="mt-2 w-full accent-violet-600" type="range" min={SOFTMAX_JACOBIAN_LIMITS.temperature.min} max={SOFTMAX_JACOBIAN_LIMITS.temperature.max} step={SOFTMAX_JACOBIAN_LIMITS.temperature.step} value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
          </label>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 font-mono text-xs leading-6 text-slate-700">base logits = [{SOFTMAX_JACOBIAN_DEFAULTS.logits.join(', ')}]</div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {result.before.map((probability, index) => {
              const change = result.after[index] - probability;
              return (
                <div key={index} className={`rounded-xl border p-4 ${index === selectedLogit ? 'border-violet-300 bg-violet-50' : 'border-slate-200 bg-white'}`}>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">class {index + 1}</div>
                  <div className="mt-2 font-mono text-lg font-black text-slate-950">{(probability * 100).toFixed(1)}% → {(result.after[index] * 100).toFixed(1)}%</div>
                  <div className={`mt-1 font-mono text-sm font-bold ${change >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Δp={format(change)}</div>
                  <div className="mt-2 text-xs text-slate-500">∂p/∂z{selectedLogit + 1} = {format(result.derivatives[index])}</div>
                </div>
              );
            })}
          </div>

          <div className="overflow-auto rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-black text-slate-950">Softmax Jacobian J = ∂pᵢ/∂zⱼ</h3>
            <table className="mt-3 w-full min-w-[520px] text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-2 py-2 text-left">pᵢ</th>{result.jacobian[0].map((_, index) => <th key={index} className="px-2 py-2 text-right">z{index + 1}</th>)}</tr></thead>
              <tbody>{result.jacobian.map((row, rowIndex) => <tr key={rowIndex} className="border-t border-slate-100"><td className="px-2 py-2 font-bold">p{rowIndex + 1}</td>{row.map((value, columnIndex) => <td key={columnIndex} className={`px-2 py-2 text-right font-mono ${columnIndex === selectedLogit ? 'bg-violet-50 font-black' : ''}`}>{format(value)}</td>)}</tr>)}</tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              The selected derivative column sums to <span className="font-mono font-black">{result.derivativeSum.toExponential(1)}</span>. That must be near zero because all probabilities still sum to one as a logit changes.
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              For small Δz, the Jacobian gives a local linear prediction. Temperature divides these derivatives too, so a larger τ generally softens both the distribution and its local sensitivity.
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
