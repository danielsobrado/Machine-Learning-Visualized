import React, { useMemo, useState } from 'react';
import { GitFork, Sparkles } from 'lucide-react';
import { SYMMETRY_DEFAULTS } from './initializationConstants.js';
import { symmetryStep } from './initializationModel.js';

function format(value) {
  return Math.abs(value) < 0.0001 ? value.toExponential(2) : value.toFixed(4);
}

function NeuronCard({ name, weight, activation, gradient, nextWeight }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{name}</div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div><span className="block text-xs text-slate-500">w before</span><strong className="font-mono">{format(weight)}</strong></div>
        <div><span className="block text-xs text-slate-500">activation</span><strong className="font-mono">{format(activation)}</strong></div>
        <div><span className="block text-xs text-slate-500">dL/dw</span><strong className="font-mono">{format(gradient)}</strong></div>
        <div><span className="block text-xs text-slate-500">w after</span><strong className="font-mono">{format(nextWeight)}</strong></div>
      </div>
    </div>
  );
}

export default function SymmetryBreakLab() {
  const [breakSymmetry, setBreakSymmetry] = useState(false);
  const perturbation = breakSymmetry ? SYMMETRY_DEFAULTS.perturbation : 0;
  const result = useMemo(() => symmetryStep({ ...SYMMETRY_DEFAULTS, perturbation }), [perturbation]);

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700">
            <GitFork size={16} />
            Symmetry-breaking lab
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Two identical hidden neurons are one neuron wearing two name tags</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Both tanh units see the same input and start with the same downstream weight. If their hidden weights are identical, their activations and gradients are identical, so one gradient step keeps them identical.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setBreakSymmetry((value) => !value)}
          className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
            breakSymmetry
              ? 'border-violet-500 bg-violet-600 text-white'
              : 'border-slate-300 bg-white text-slate-700'
          }`}
        >
          <Sparkles size={15} className="mr-1 inline" />
          {breakSymmetry ? `Perturbation +${SYMMETRY_DEFAULTS.perturbation}` : 'Identical start'}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <NeuronCard
          name="Hidden neuron A"
          weight={result.hiddenWeights[0]}
          activation={result.hidden[0]}
          gradient={result.hiddenGradients[0]}
          nextWeight={result.nextHiddenWeights[0]}
        />
        <NeuronCard
          name="Hidden neuron B"
          weight={result.hiddenWeights[1]}
          activation={result.hidden[1]}
          gradient={result.hiddenGradients[1]}
          nextWeight={result.nextHiddenWeights[1]}
        />
      </div>

      <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
        result.symmetryBrokenAfter
          ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
          : 'border-amber-200 bg-amber-50 text-amber-950'
      }`}>
        <strong>{result.symmetryBrokenAfter ? 'Symmetry broken:' : 'Symmetry preserved:'}</strong>{' '}
        {result.symmetryBrokenAfter
          ? 'the neurons now receive different gradients and can specialize.'
          : 'the two copies take the same update and remain functionally redundant.'}
        <span className="ml-2 font-mono text-xs">loss={format(result.loss)}</span>
      </div>
    </section>
  );
}
