import React, { useMemo } from 'react';
import { AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { separationExperiment } from './logisticRegressionModel.js';

function normPath(trace, maxNorm) {
  const width = 280;
  const height = 110;
  const maxIteration = Math.max(1, trace.at(-1).iteration);
  return trace.map((point, index) => {
    const x = 10 + (point.iteration / maxIteration) * width;
    const y = 120 - (point.coefficientNorm / maxNorm) * height;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export default function SeparationRegularizationLab() {
  const experiment = useMemo(() => separationExperiment(), []);
  const maxNorm = Math.max(
    ...experiment.unregularized.trace.map((point) => point.coefficientNorm),
    ...experiment.regularized.trace.map((point) => point.coefficientNorm),
  );
  const unregularizedPath = normPath(experiment.unregularized.trace, maxNorm);
  const regularizedPath = normPath(experiment.regularized.trace, maxNorm);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Separation failure lab</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Perfect classification can make unregularized coefficients diverge</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            These twelve training rows are linearly separable. Both fits use the same data and Newton updates. Without a penalty,
            logistic loss keeps falling by pushing the separating logits farther toward ±∞. L2 regularization creates a finite optimum.
          </p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-950">
          ridge λ = {experiment.ridgeLambda}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-600">
            <TrendingUp size={14} /> Coefficient norm by Newton iteration
          </div>
          <svg viewBox="0 0 300 135" className="h-auto w-full rounded-lg bg-white" role="img" aria-label="Coefficient norm growth with and without ridge regularization">
            <line x1="10" x2="290" y1="120" y2="120" stroke="#cbd5e1" />
            <line x1="10" x2="10" y1="10" y2="120" stroke="#cbd5e1" />
            <path d={unregularizedPath} fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
            <path d={regularizedPath} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-2"><i className="h-1 w-7 rounded bg-rose-600" />unregularized</span>
            <span className="inline-flex items-center gap-2"><i className="h-1 w-7 rounded bg-emerald-600" />ridge</span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-950">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-800"><AlertTriangle size={14} /> No penalty</p>
            <strong className="mt-2 block text-3xl">‖w‖ {experiment.unregularized.coefficientNorm.toFixed(1)}</strong>
            <p className="mt-2 text-sm leading-6">Training log loss falls to {experiment.unregularized.logLoss.toExponential(2)}, while the coefficient norm is still growing at the iteration budget.</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-800"><ShieldCheck size={14} /> L2 regularized</p>
            <strong className="mt-2 block text-3xl">‖w‖ {experiment.regularized.coefficientNorm.toFixed(1)}</strong>
            <p className="mt-2 text-sm leading-6">The penalized fit converges in {experiment.regularized.iterations} iterations instead of chasing infinite confidence.</p>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        A perfectly classified training set is not evidence that enormous coefficients are meaningful. Complete or quasi-separation is a fitting pathology; regularization, better data, or specialized estimators are remedies. Threshold tuning does not fix coefficient divergence because it happens after fitting.
      </p>
    </section>
  );
}
