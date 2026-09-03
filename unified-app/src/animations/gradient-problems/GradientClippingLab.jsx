import React, { useMemo } from 'react';
import { Scissors, ShieldCheck } from 'lucide-react';
import { VALUE_BOUNDS } from './gradientProblemsConstants.js';
import { clipByGlobalNorm } from './gradientProblemsModel.js';

function formatNumber(value) {
  if (value === 0) return '0';
  const magnitude = Math.abs(value);
  if (magnitude >= 1000 || magnitude < 0.001) return value.toExponential(2);
  return value.toFixed(4);
}

function Bar({ value, maximum, clipped }) {
  const width = maximum === 0 ? 0 : (Math.abs(value) / maximum) * 100;
  return (
    <div className="h-4 overflow-hidden rounded bg-slate-100">
      <div className={`h-full rounded ${clipped ? 'bg-cyan-500' : 'bg-rose-400'}`} style={{ width: `${Math.max(value === 0 ? 0 : 3, width)}%` }} />
    </div>
  );
}

export default function GradientClippingLab({ trace, clipNorm, onClipNormChange }) {
  const clipping = useMemo(
    () => clipByGlobalNorm(trace.parameterGradients, clipNorm),
    [clipNorm, trace.parameterGradients],
  );
  const maximum = Math.max(1e-12, ...trace.parameterGradients.map((value) => Math.abs(value)));
  const pairs = trace.parameterGradients.slice(0, 12).map((raw, index) => ({ raw, clipped: clipping.clipped[index] }));

  return (
    <section className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Gradient clipping lab</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Clip the parameter-gradient vector after backprop</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The chain above finishes first. Then this lab computes one global L2 norm and, only when needed, rescales the
            whole parameter-gradient vector before an optimizer step. The hidden-state gradient path is not rewritten.
          </p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs leading-5 text-cyan-950">
          <Scissors size={15} className="mr-1 inline" /> scale=min(1, threshold / ||g||₂)
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-sm font-semibold text-slate-700">
            <span className="flex items-center justify-between gap-3">
              <span>Global norm threshold</span>
              <span className="font-mono text-xs">{clipNorm.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min="0"
              max={VALUE_BOUNDS.maxClipNorm}
              step="0.5"
              value={clipNorm}
              onChange={(event) => onClipNormChange(Number(event.target.value))}
              className="mt-2 w-full accent-cyan-600"
            />
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-500">0 means disabled in this teaching lab.</p>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg bg-white p-3"><span className="text-xs font-black uppercase text-slate-500">Raw ||g||₂</span><strong className="mt-1 block font-mono text-xl">{formatNumber(clipping.originalNorm)}</strong></div>
            <div className="rounded-lg bg-white p-3"><span className="text-xs font-black uppercase text-slate-500">Clip scale</span><strong className="mt-1 block font-mono text-xl">{clipping.scale.toFixed(4)}</strong></div>
            <div className="rounded-lg bg-white p-3"><span className="text-xs font-black uppercase text-slate-500">After clipping</span><strong className="mt-1 block font-mono text-xl">{formatNumber(clipping.clippedNorm)}</strong></div>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <span className="text-xs font-black uppercase tracking-wide text-rose-700">Hidden-state gradient before clipping</span>
              <strong className="mt-1 block font-mono text-2xl text-slate-950">{formatNumber(trace.inputGradient)}</strong>
              <p className="mt-1 text-xs leading-5 text-slate-600">This was produced by the chain rule through the network.</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <span className="text-xs font-black uppercase tracking-wide text-emerald-700">Hidden-state gradient after clipping</span>
              <strong className="mt-1 block font-mono text-2xl text-slate-950">{formatNumber(trace.inputGradient)}</strong>
              <p className="mt-1 text-xs leading-5 text-slate-600">Unchanged. Clipping acts on parameter gradients, not by replaying backprop.</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-950">First parameter-gradient components</h3>
                <p className="text-xs text-slate-500">Raw and clipped bars share one scale; global-norm clipping gives every component the same multiplier.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${clipping.wasClipped ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'}`}>{clipping.wasClipped ? 'clipped' : 'unchanged'}</span>
            </div>
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div key={index} className="grid gap-1 sm:grid-cols-[58px_1fr_90px_1fr_90px] sm:items-center">
                  <span className="text-xs font-bold text-slate-500">g{index + 1}</span>
                  <Bar value={pair.raw} maximum={maximum} clipped={false} />
                  <span className="text-right font-mono text-xs text-slate-700">{formatNumber(pair.raw)}</span>
                  <Bar value={pair.clipped} maximum={maximum} clipped />
                  <span className="text-right font-mono text-xs text-slate-700">{formatNumber(pair.clipped)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            <ShieldCheck size={17} className="mr-1 inline" />
            <strong>What clipping can and cannot do:</strong> it can bound an excessively large parameter-gradient norm.
            If the chain already produced a tiny or zero gradient, the scale stays 1 and nothing is restored.
          </div>
        </main>
      </div>
    </section>
  );
}
