import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import BranchAccumulationLab from './BranchAccumulationLab.jsx';
import ChainBackpropLab from './ChainBackpropLab.jsx';

export default function ComputationGraphBackpropAnimation() {
  return (
    <div className="min-h-full bg-[#fbf8f1] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Training loop bridge</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Computation Graph & Backpropagation</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700 md:text-base">
            Backpropagation is reverse-mode automatic differentiation: cache the forward values, propagate sensitivities backward through local derivatives, and accumulate contributions whenever a value feeds more than one downstream path.
          </p>
        </header>

        <ChainBackpropLab />
        <BranchAccumulationLab />

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-sm font-black uppercase tracking-wide text-emerald-700">Single path</h2>
            <p className="mt-3 text-sm leading-6 text-emerald-950">
              Along one path, reverse mode multiplies the upstream gradient by each local derivative. ReLU can therefore gate an entire chain to zero.
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <h2 className="text-sm font-black uppercase tracking-wide text-violet-700">Fan-out</h2>
            <p className="mt-3 text-sm leading-6 text-violet-950">
              When one value is used more than once, reverse mode waits for all downstream contributions and sums them. “Multiply backward” alone is an incomplete description of backpropagation.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-sm font-black uppercase tracking-wide text-amber-700">Debugging</h2>
            <p className="mt-3 text-sm leading-6 text-amber-950">
              Finite-difference checks compare the analytic backward pass with the forward computation itself. They are especially useful when custom operations, branching, or gradient accumulation may be wrong.
            </p>
          </div>
        </section>

        <AssessmentPanel lessonId="computation-graph-backprop" title="Backpropagation check" />
      </div>
    </div>
  );
}
