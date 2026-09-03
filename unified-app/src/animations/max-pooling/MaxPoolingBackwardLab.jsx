import React, { useMemo, useState } from 'react';
import { AlertTriangle, GitBranch, Layers3 } from 'lucide-react';
import { argmaxFlipExperiment, informationCollision, maxPoolWindow } from './maxPoolingModel.js';

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && magnitude < 0.001) return value.toExponential(2);
  return value.toFixed(3).replace(/\.?0+$/, '');
}

function WindowCard({ title, values, result }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3"><h3 className="font-black text-slate-900">{title}</h3><span className="font-mono text-sm font-black text-blue-700">max={format(result.maxValue)}</span></div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {values.map((value, index) => (
          <div key={index} className={`rounded-lg border p-3 text-center ${index === result.winnerIndex ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="font-mono text-lg font-black">{format(value)}</div>
            <div className="mt-1 text-xs text-slate-500">grad {format(result.inputGradients[index])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MaxPoolingBackwardLab() {
  const [perturbation, setPerturbation] = useState(0.02);
  const flip = useMemo(() => argmaxFlipExperiment({ first: 5, second: 4.99, perturbation, upstreamGradient: 1 }), [perturbation]);
  const tie = useMemo(() => maxPoolWindow([5, 5, 1, 0], 1), []);
  const collision = useMemo(() => informationCollision([9, 0, 0, 0], [9, 8, 7, 6]), []);

  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle size={19} className="mt-0.5 shrink-0 text-rose-700" />
        <div>
          <div className="text-sm font-black uppercase tracking-wide text-rose-700">Backward-routing failure lab</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Almost the same pooled output can send the gradient somewhere completely different</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Max pooling stores an argmax decision. During backprop, the upstream gradient goes to that winner and every other input in the window gets zero. That routing is discontinuous when two activations are close.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label htmlFor="pool-perturbation" className="text-sm font-black text-slate-800">Perturb second activation by +{perturbation.toFixed(3)}</label>
          <input id="pool-perturbation" type="range" min="0" max="0.05" step="0.001" value={perturbation} onChange={(event) => setPerturbation(Number(event.target.value))} className="mt-3 w-full accent-rose-600" />
          <div className={`mt-4 rounded-xl border p-4 ${flip.routeFlipped ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">Route status</div>
            <div className="mt-1 text-lg font-black">{flip.routeFlipped ? 'argmax flipped' : 'same winner'}</div>
          </div>
          <div className="mt-3 rounded-xl bg-slate-900 p-4 text-white">
            <div className="text-xs uppercase tracking-wide text-slate-400">Output change</div>
            <div className="mt-1 font-mono text-xl font-black">{format(flip.outputChange)}</div>
            <div className="mt-3 text-xs uppercase tracking-wide text-slate-400">Gradient L1 change</div>
            <div className="mt-1 font-mono text-xl font-black">{format(flip.gradientL1Change)}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <WindowCard title="Before perturbation" values={flip.beforeValues} result={flip.before} />
          <WindowCard title="After perturbation" values={flip.afterValues} result={flip.after} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-800"><GitBranch size={16} /> Tie case</div>
          <p className="mt-2 text-sm leading-6 text-amber-950">Window `[5, 5, 1, 0]` has two equal maxima. This teaching model routes to the first maximum, so the backward vector is:</p>
          <div className="mt-3 rounded-lg bg-white p-3 font-mono text-sm">[{tie.inputGradients.join(', ')}]</div>
          <p className="mt-2 text-xs leading-5 text-amber-900">Tie behavior is implementation-defined at the kernel/framework level. Do not build model semantics around which equal maximum receives the gradient.</p>
        </div>

        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-800"><Layers3 size={16} /> Information collision</div>
          <p className="mt-2 text-sm leading-6 text-violet-950">`[9,0,0,0]` and `[9,8,7,6]` both pool to <strong>9</strong>, even though their means are {format(collision.firstMean)} and {format(collision.secondMean)}.</p>
          <p className="mt-2 text-sm leading-6 text-violet-950">The next layer cannot reconstruct the discarded within-window evidence from the pooled value alone.</p>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"><strong>Takeaway:</strong> max pooling is piecewise constant with respect to non-winning inputs and piecewise identity with respect to the winner. Its forward robustness to small location changes can coexist with abrupt backward-routing changes.</p>
    </section>
  );
}
