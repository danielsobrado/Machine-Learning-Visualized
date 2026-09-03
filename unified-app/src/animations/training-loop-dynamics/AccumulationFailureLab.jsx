import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LOOP_MODES } from './trainingLoopConstants.js';
import { compareLoopModes } from './trainingLoopModel.js';

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 0.001 || magnitude >= 1000)) return value.toExponential(2);
  return value.toFixed(4);
}

export default function AccumulationFailureLab({ config }) {
  const results = useMemo(() => compareLoopModes(config), [config]);
  const byMode = Object.fromEntries(results.map((result) => [result.mode, result]));
  const correct = byMode.correct;
  const unscaled = byMode.unscaled;
  const stale = byMode.stale;
  const firstCorrect = correct.history[1];
  const firstUnscaled = unscaled.history[1];
  const scaleRatio = Math.abs(firstUnscaled.optimizerGradient / firstCorrect.optimizerGradient);

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
      <div className="max-w-4xl">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Gradient accumulation failure lab</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">A larger effective batch should not secretly multiply your learning rate</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          To emulate one larger batch from several micro-batches, average their gradients before stepping. Summing them without scaling changes the optimizer update itself. Forgetting to clear gradients is a different bug: old optimizer-step gradients leak into the next step.
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {results.map((result) => {
          const broken = result.mode !== 'correct';
          return (
            <div key={result.mode} className={`rounded-xl border p-4 ${broken ? 'border-rose-200 bg-white' : 'border-emerald-200 bg-emerald-50'}`}>
              <div className="flex items-center gap-2">
                {broken ? <AlertTriangle size={16} className="text-rose-600" /> : <CheckCircle2 size={16} className="text-emerald-600" />}
                <h3 className="font-black text-slate-950">{LOOP_MODES[result.mode].label}</h3>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{LOOP_MODES[result.mode].description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="block text-xs text-slate-500">final loss</span><strong className="font-mono">{format(result.final.loss)}</strong></div>
                <div><span className="block text-xs text-slate-500">best loss</span><strong className="font-mono">{format(result.best.loss)}</strong></div>
                <div><span className="block text-xs text-slate-500">effective αλ</span><strong className="font-mono">{result.effectiveStabilityProduct.toFixed(3)}</strong></div>
                <div><span className="block text-xs text-slate-500">last |Δθ|</span><strong className="font-mono">{format(Math.abs(result.final.update))}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <strong>Missing loss scaling:</strong> on the first optimizer step, the broken gradient is <span className="font-mono font-black">{scaleRatio.toFixed(1)}×</span> the correctly averaged gradient. With {config.microBatches} micro-batches, this is mathematically similar to multiplying α by {config.microBatches} when the micro-gradients agree.
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
          <strong>Forgot zero_grad:</strong> by step 2, the optimizer sees <span className="font-mono font-black">{format(stale.history[2]?.optimizerGradient ?? 0)}</span> instead of only the current averaged gradient <span className="font-mono font-black">{format(stale.history[2]?.averagedGradient ?? 0)}</span>. This is stale state, not a larger batch.
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        Framework details differ, but the invariant is simple: decide whether your loss is a sum or mean, decide the intended effective batch, and make the gradient scale at <code>optimizer.step()</code> explicit. Gradient accumulation is not automatically equivalent to a larger batch if normalization, dropout randomness, BatchNorm behavior, clipping order, or scheduler semantics differ.
      </p>
    </section>
  );
}
