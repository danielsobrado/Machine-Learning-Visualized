import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { maskOrderExperiment } from './attentionMaskModel.js';

function formatWeights(weights) {
  return `[${weights.map((value) => value.toFixed(3)).join(', ')}]`;
}

export default function MaskOrderLab() {
  const result = maskOrderExperiment();

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Mask ordering failure lab</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Zeroing attention after softmax is not the same operation</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            The blocked future token has the largest raw score. Correct masking removes it before normalization. A naive implementation that softmaxes all scores first and only then zeros the forbidden probability lets that future score steal denominator mass.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Correct: mask → softmax</div>
          <div className="mt-2 font-mono text-sm text-slate-900">{formatWeights(result.correctWeights)}</div>
          <div className="mt-3 text-sm text-slate-700">Weight sum: <strong>{result.correctWeightSum.toFixed(3)}</strong></div>
          <div className="text-sm text-slate-700">Output: <strong>{result.correctOutput.toFixed(3)}</strong></div>
        </div>
        <div className="rounded-xl border border-rose-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-rose-700">Wrong: softmax → zero forbidden</div>
          <div className="mt-2 font-mono text-sm text-slate-900">{formatWeights(result.naiveWeights)}</div>
          <div className="mt-3 text-sm text-slate-700">Weight sum: <strong>{result.naiveWeightSum.toFixed(3)}</strong></div>
          <div className="text-sm text-slate-700">Output: <strong>{result.naiveOutput.toFixed(3)}</strong></div>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">
        If probabilities are masked after softmax, they must be renormalized to recover the same visible distribution. Standard attention instead masks logits before softmax, usually by adding a very large negative value or <span className="font-mono">-∞</span> to forbidden positions.
      </p>
    </section>
  );
}
