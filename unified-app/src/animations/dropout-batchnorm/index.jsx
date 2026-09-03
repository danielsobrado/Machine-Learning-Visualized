import React from 'react';
import { Activity } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import BatchNormWorkbench from './BatchNormWorkbench.jsx';
import DropoutExperiment from './DropoutExperiment.jsx';
import ModeFailureLab from './ModeFailureLab.jsx';

export default function DropoutBatchNormAnimation() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-300"><Activity size={16} /> Mode-dependent layers</p>
        <h1 className="mt-2 text-2xl font-black md:text-3xl">Dropout + Batch Normalization</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
          BatchNorm and dropout both change behavior between training and evaluation, but for different reasons. Build BatchNorm statistics from actual mini-batches, watch running state evolve, then inspect dropout as a stochastic distribution rather than a single expected value.
        </p>
      </header>

      <BatchNormWorkbench />
      <ModeFailureLab />
      <DropoutExperiment />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-black text-slate-950">Parameter vs state</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">γ and β are learned by gradient descent. Running mean and variance are stored state accumulated from training batches.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-black text-slate-950">Small-batch warning</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Training BatchNorm needs informative per-feature statistics. Tiny local batches can be noisy; one scalar observation has zero empirical variance.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-black text-slate-950">Deployment check</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Evaluation mode should normally use stored BatchNorm state and disable dropout. Test repeatability before serving.</p>
        </div>
      </section>

      <AssessmentPanel lessonId="dropout-batchnorm" title="Dropout and BatchNorm check" />
    </div>
  );
}
