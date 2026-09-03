import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, Scale, Sigma } from 'lucide-react';
import {
  GLOVE_COUNT_OPTIONS,
  GLOVE_RESIDUAL_LIMITS,
  GLOVE_WEIGHTING_DEFAULTS,
} from './gloveConstants.js';
import { glovePairLoss, gloveWeightingExperiment } from './gloveModel.js';

function format(value) {
  if (value === null) return 'excluded';
  if (Math.abs(value) >= 1000 || (value !== 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return value.toFixed(4);
}

export default function ObjectivePanel() {
  const [count, setCount] = useState(10);
  const [residual, setResidual] = useState(GLOVE_WEIGHTING_DEFAULTS.residual);

  const rows = useMemo(() => gloveWeightingExperiment({
    counts: GLOVE_COUNT_OPTIONS,
    residual,
  }), [residual]);

  const selectedPair = useMemo(() => {
    if (count === 0) return glovePairLoss({ count, prediction: 0 });
    const target = Math.log(count);
    return glovePairLoss({ count, prediction: target + residual });
  }, [count, residual]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-20 md:p-6">
      <header className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700">
          <Calculator size={17} /> GloVe objective reality check
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">GloVe does not downweight frequent pairs below rare pairs</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          For observed co-occurrences, GloVe fits a dot-product-plus-bias prediction to log(Xᵢⱼ) with weighted least squares. The standard weighting function gives tiny counts less trust, increases their weight with evidence, then caps sufficiently frequent pairs at weight 1.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-black text-slate-950"><Scale size={17} /> Pair controls</h3>

          <div className="mt-5">
            <div className="text-sm font-bold text-slate-700">Co-occurrence count Xᵢⱼ</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {GLOVE_COUNT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCount(option)}
                  aria-pressed={count === option}
                  className={`rounded-lg border px-3 py-2 font-mono text-sm font-black ${count === option ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="glove-residual">
            <span className="flex justify-between gap-3"><span>Model residual</span><strong>{residual.toFixed(2)}</strong></span>
            <input
              id="glove-residual"
              type="range"
              {...GLOVE_RESIDUAL_LIMITS}
              value={residual}
              onChange={(event) => setResidual(Number(event.target.value))}
              className="mt-2 w-full accent-violet-600"
            />
          </label>

          <div className="mt-5 rounded-xl bg-slate-50 p-3 font-mono text-xs leading-6 text-slate-700">
            <div>x_max = {GLOVE_WEIGHTING_DEFAULTS.xMax}</div>
            <div>α = {GLOVE_WEIGHTING_DEFAULTS.alpha}</div>
            <div>f(x) = (x/x_max)^α for x &lt; x_max</div>
            <div>f(x) = 1 otherwise</div>
          </div>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-black text-slate-950"><Sigma size={17} /> Selected objective term</h3>
          {selectedPair.included ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-slate-500">log(Xᵢⱼ)</div>
                <div className="mt-1 text-2xl font-black text-slate-950">{format(selectedPair.target)}</div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-amber-700">weight f(X)</div>
                <div className="mt-1 text-2xl font-black text-slate-950">{format(selectedPair.weight)}</div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-blue-700">residual</div>
                <div className="mt-1 text-2xl font-black text-slate-950">{format(selectedPair.residual)}</div>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-violet-700">loss contribution</div>
                <div className="mt-1 text-2xl font-black text-slate-950">{format(selectedPair.contribution)}</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
              <AlertTriangle size={17} className="mr-2 inline" />
              <strong>Xᵢⱼ = 0 is not a log target.</strong> Standard GloVe implementations iterate over nonzero co-occurrences. The pair contributes nothing because it is absent from the sparse training entries—not because JavaScript, NumPy, or algebra somehow makes 0 × log(0) safe.
            </div>
          )}

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            For one observed pair: <span className="font-mono font-black">f(Xᵢⱼ) · (wᵢ·w̃ⱼ + bᵢ + b̃ⱼ − log Xᵢⱼ)²</span>. The full objective sums this over stored nonzero co-occurrence entries.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-black text-slate-950">Same residual, different evidence</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">Hold the model error fixed. Only the co-occurrence count changes.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-2">X</th><th className="px-3 py-2">log X</th><th className="px-3 py-2">f(X)</th><th className="px-3 py-2">weighted residual²</th><th className="px-3 py-2">Interpretation</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.count} className="border-t border-slate-200">
                  <td className="px-3 py-3 font-mono font-black">{row.count}</td>
                  <td className="px-3 py-3 font-mono">{format(row.target)}</td>
                  <td className="px-3 py-3 font-mono">{format(row.weight)}</td>
                  <td className="px-3 py-3 font-mono font-black">{format(row.contribution)}</td>
                  <td className="px-3 py-3 text-slate-600">{row.count === 0 ? 'not stored as a positive co-occurrence' : row.weight < 1 ? 'rare pair is downweighted' : 'weight has reached the cap'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
        <strong>The subtle point:</strong> GloVe prevents huge raw counts from dominating partly by fitting <em>log</em> co-occurrence counts and by capping f(x). The weighting function itself is primarily distrustful of low-count pairs; it is not an inverse-frequency weight.
      </section>
    </div>
  );
}
