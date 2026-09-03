import React, { useMemo, useState } from 'react';
import { AlertTriangle, GitBranch, ShieldCheck } from 'lucide-react';
import { BRANCH_CONTROL_LIMITS, BRANCH_DEFAULTS } from './backpropConstants.js';
import { branchGradientCheck, computeBranchGraph } from './backpropModel.js';

function format(value) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(2);
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function Control({ id, label, config, value, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700" htmlFor={id}>
      <span className="flex items-center justify-between gap-3"><span>{label}</span><strong className="font-mono text-slate-950">{format(value)}</strong></span>
      <input id={id} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
    </label>
  );
}

function BranchCard({ title, formula, loss, gradient, tone }) {
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 font-mono text-sm text-slate-700">{formula}</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><span className="block text-xs text-slate-500">branch loss</span><strong className="font-mono text-lg">{format(loss)}</strong></div>
        <div><span className="block text-xs text-slate-500">contribution to dL/dh</span><strong className="font-mono text-lg">{format(gradient)}</strong></div>
      </div>
    </div>
  );
}

export default function BranchAccumulationLab() {
  const [config, setConfig] = useState(BRANCH_DEFAULTS);
  const result = useMemo(() => computeBranchGraph(config), [config]);
  const check = useMemo(() => branchGradientCheck(config), [config]);
  const setValue = (key) => (value) => setConfig((current) => ({ ...current, [key]: value }));

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700">
          <GitBranch size={16} />
          Reverse accumulation lab
        </div>
        <h2 className="mt-1 text-xl font-black text-slate-950">At a branch, backprop adds paths—it does not choose one</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          The shared value h feeds two downstream losses. Each branch is differentiated locally, then both contributions are accumulated into one upstream gradient before earlier nodes are processed.
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Control id="branch-h" label="Shared value h" config={BRANCH_CONTROL_LIMITS.h} value={config.h} onChange={setValue('h')} />
        <Control id="branch-target-a" label="Target A" config={BRANCH_CONTROL_LIMITS.targetA} value={config.targetA} onChange={setValue('targetA')} />
        <Control id="branch-target-b" label="Target B" config={BRANCH_CONTROL_LIMITS.targetB} value={config.targetB} onChange={setValue('targetB')} />
        <Control id="branch-scale" label="Branch B weight λ" config={BRANCH_CONTROL_LIMITS.branchScale} value={config.branchScale} onChange={setValue('branchScale')} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.7fr_1fr_1fr_0.8fr] lg:items-center">
        <div className="rounded-xl border border-violet-300 bg-white p-5 text-center">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700">shared node</div>
          <div className="mt-2 font-mono text-3xl font-black text-slate-950">h={format(result.h)}</div>
          <div className="mt-3 rounded-lg bg-violet-100 px-3 py-2 font-mono text-sm font-black text-violet-950">dL/dh={format(result.totalGradient)}</div>
        </div>
        <BranchCard title="Branch A" formula="Lₐ = ½(h - yₐ)²" loss={result.lossA} gradient={result.gradientFromA} tone="border-emerald-200 bg-emerald-50" />
        <BranchCard title="Branch B" formula="Lᵦ = λ·½(h² - yᵦ)²" loss={result.lossB} gradient={result.gradientFromB} tone="border-blue-200 bg-blue-50" />
        <div className="rounded-xl border border-slate-300 bg-slate-900 p-5 text-white">
          <div className="text-xs font-black uppercase tracking-wide text-violet-200">reverse accumulation</div>
          <div className="mt-3 font-mono text-sm">{format(result.gradientFromA)} + {format(result.gradientFromB)}</div>
          <div className="mt-1 text-3xl font-black">= {format(result.totalGradient)}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <div className="flex items-center gap-2 font-black"><AlertTriangle size={17} /> Bug: backprop through only one branch</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div><span className="block text-xs uppercase tracking-wide text-rose-700">wrong gradient</span><strong className="font-mono text-xl">{format(result.onePathOnlyGradient)}</strong></div>
            <div><span className="block text-xs uppercase tracking-wide text-rose-700">missed contribution</span><strong className="font-mono text-xl">{format(result.missedGradient)}</strong></div>
          </div>
          <p className="mt-3">Every derivative on branch A can be locally correct and the final gradient can still be wrong because branch B was never accumulated.</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <div className="flex items-center gap-2 font-black"><ShieldCheck size={17} /> Numerical gradient check</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div><span className="block text-xs uppercase tracking-wide text-emerald-700">analytic</span><strong className="font-mono">{format(check.analytic)}</strong></div>
            <div><span className="block text-xs uppercase tracking-wide text-emerald-700">finite diff</span><strong className="font-mono">{format(check.numerical)}</strong></div>
            <div><span className="block text-xs uppercase tracking-wide text-emerald-700">abs error</span><strong className="font-mono">{format(check.absoluteError)}</strong></div>
          </div>
          <p className="mt-3">Centered finite differences perturb the forward computation only. Matching them is a useful way to catch an incorrect backward graph.</p>
          <p className="mt-2 font-semibold">One-path-only absolute error: <span className="font-mono">{format(check.onePathAbsoluteError)}</span></p>
        </div>
      </div>
    </section>
  );
}
