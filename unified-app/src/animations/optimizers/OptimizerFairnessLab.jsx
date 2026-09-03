import React, { useMemo } from 'react';
import { AlertTriangle, Trophy } from 'lucide-react';
import { OPTIMIZERS } from './optimizerConstants.js';
import { evaluateOptimizerFairness } from './optimizerModel.js';

function ResultTable({ title, subtitle, rows, highlightLearningRate }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
      <div className="mt-3 space-y-2">
        {rows.map((row, index) => (
          <div key={row.optimizer} className={`grid grid-cols-[28px_1fr_auto_auto] items-center gap-2 rounded-lg border px-3 py-2 ${index === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
            <span className="text-sm font-black text-slate-500">#{index + 1}</span>
            <span className="font-black text-slate-900">{OPTIMIZERS[row.optimizer].label}</span>
            <span className={`font-mono text-xs ${highlightLearningRate ? 'font-black text-violet-700' : 'text-slate-500'}`}>α={row.learningRate.toFixed(2)}</span>
            <span className="font-mono text-sm font-black text-slate-800">L={row.finalLoss.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OptimizerFairnessLab({ learningRate, beta1, beta2, epsilon, batchSize, steps }) {
  const analysis = useMemo(() => evaluateOptimizerFairness({
    learningRate,
    beta1,
    beta2,
    epsilon,
    batchSize,
    steps,
  }), [batchSize, beta1, beta2, epsilon, learningRate, steps]);

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700">
            <Trophy size={16} />
            Optimizer leaderboard trap
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Same learning rate is controlled. It is not necessarily fair.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Sharing α isolates the update-rule mechanism, which is useful. But using that result to declare a winner can be misleading because SGD, Momentum, and Adam generally need their own tuned step sizes.
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${analysis.rankingChanged ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
          {analysis.rankingChanged ? 'ranking changed after tuning' : 'ranking unchanged here'}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ResultTable
          title={`Shared α = ${learningRate.toFixed(2)}`}
          subtitle="Mechanism comparison: every optimizer is forced to use the same learning rate."
          rows={analysis.sameRate}
        />
        <ResultTable
          title="Each optimizer tuned separately"
          subtitle="Small grid search over the same deterministic training setup."
          rows={analysis.tuned}
          highlightLearningRate
        />
      </div>

      <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${analysis.rankingChanged ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-white text-slate-700'}`}>
        {analysis.rankingChanged ? (
          <>
            <AlertTriangle size={17} className="mr-1 inline" />
            <strong>The ranking reversed:</strong> shared-α winner is {OPTIMIZERS[analysis.sameRateWinner].label}, while the tuned winner is {OPTIMIZERS[analysis.tunedWinner].label}. Do not turn one shared-hyperparameter demo into an optimizer leaderboard.
          </>
        ) : (
          <>
            The winner happened to stay the same for these controls, but the comparison principle does not change: tune competing optimizers separately before making a performance claim.
          </>
        )}
      </div>
    </section>
  );
}
