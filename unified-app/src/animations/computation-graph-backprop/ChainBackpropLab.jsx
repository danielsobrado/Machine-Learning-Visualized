import React, { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { BACKPROP_CONTROL_LIMITS, BACKPROP_DEFAULTS } from './backpropConstants.js';
import { computeChainGraph } from './backpropModel.js';

function format(value) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(2);
  return Number.isInteger(value) ? String(value) : value.toFixed(3);
}

function Control({ id, label, config, value, onChange }) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-white p-3" htmlFor={id}>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-semibold text-slate-800">
        <span>{label}</span>
        <span className="font-mono">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-700"
      />
    </label>
  );
}

function Node({ label, value, gradient, tone = 'slate' }) {
  const toneClass = {
    slate: 'border-slate-200 bg-white',
    blue: 'border-blue-200 bg-blue-50',
    amber: 'border-amber-200 bg-amber-50',
    emerald: 'border-emerald-200 bg-emerald-50',
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-2xl font-black text-slate-950">{format(value)}</div>
      {gradient !== undefined && (
        <div className="mt-2 rounded-lg bg-slate-900 px-2 py-1 font-mono text-xs text-white">gradient {format(gradient)}</div>
      )}
    </div>
  );
}

function Arrow({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
      <ArrowRight size={18} />
      <span className="font-mono text-xs">{label}</span>
    </div>
  );
}

export default function ChainBackpropLab() {
  const [params, setParams] = useState(BACKPROP_DEFAULTS);
  const result = useMemo(() => computeChainGraph(params), [params]);
  const setParam = (key) => (value) => setParams((current) => ({ ...current, [key]: value }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Single-path warmup</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Chain rule: multiply along one path</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            For this simple chain, reverse mode really is repeated multiplication by local derivatives. This is the easy case—not the complete rule for a graph with fan-out.
          </p>
        </div>
        <button type="button" onClick={() => setParams(BACKPROP_DEFAULTS)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700">
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Control id="cgb-x" label="Input x" config={BACKPROP_CONTROL_LIMITS.x} value={params.x} onChange={setParam('x')} />
        <Control id="cgb-w" label="Weight w" config={BACKPROP_CONTROL_LIMITS.w} value={params.w} onChange={setParam('w')} />
        <Control id="cgb-b" label="Bias b" config={BACKPROP_CONTROL_LIMITS.b} value={params.b} onChange={setParam('b')} />
        <Control id="cgb-target" label="Target y" config={BACKPROP_CONTROL_LIMITS.target} value={params.target} onChange={setParam('target')} />
        <Control id="cgb-lr" label="Learning rate" config={BACKPROP_CONTROL_LIMITS.learningRate} value={params.learningRate} onChange={setParam('learningRate')} />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid min-w-[820px] grid-cols-[1fr_70px_1fr_70px_1fr_70px_1fr] items-center gap-2">
          <Node label="x" value={params.x} gradient={result.dLossDx} tone="blue" />
          <Arrow label="× w" />
          <Node label="w·x + b" value={result.z} gradient={result.dLossDz} tone="amber" />
          <Arrow label="ReLU" />
          <Node label="a" value={result.a} gradient={result.dLossDa} tone="emerald" />
          <Arrow label="MSE" />
          <Node label="loss" value={result.loss} tone="amber" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <div className="font-black text-slate-950">Local ReLU derivative</div>
          <div className="mt-1 font-mono">da/dz = {format(result.dAdZ)}</div>
          <p className="mt-1">When z is negative, that local zero blocks every upstream parameter gradient through this path.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <div className="font-black text-slate-950">Parameter gradients</div>
          <div className="mt-1 font-mono">dL/dw = {format(result.dLossDw)}</div>
          <div className="font-mono">dL/db = {format(result.dLossDb)}</div>
        </div>
        <div className={`rounded-xl border p-4 text-sm leading-6 ${result.nextLoss < result.loss ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-rose-200 bg-rose-50 text-rose-950'}`}>
          <div className="font-black">One gradient-descent step</div>
          <div className="mt-1 font-mono">w′={format(result.nextW)}, b′={format(result.nextB)}</div>
          <div className="font-mono">loss {format(result.loss)} → {format(result.nextLoss)}</div>
          <p className="mt-1">A gradient is a local direction; an oversized learning rate can still increase the recomputed loss.</p>
        </div>
      </div>
    </section>
  );
}
