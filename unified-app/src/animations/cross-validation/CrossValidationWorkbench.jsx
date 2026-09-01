import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import FoldDesignLab from './FoldDesignLab.jsx';
import NestedSelectionLab from './NestedSelectionLab.jsx';
import RepeatedCvLab from './RepeatedCvLab.jsx';
import {
  DEFAULT_CANDIDATE_COUNT,
  DEFAULT_K,
  DEFAULT_REPEATS,
  DEFAULT_STRATEGY,
} from './crossValidationConstants.js';

export default function CrossValidationWorkbench() {
  const [strategy, setStrategy] = useState(DEFAULT_STRATEGY);
  const [k, setK] = useState(DEFAULT_K);
  const [preprocessingInsideFold, setPreprocessingInsideFold] = useState(true);
  const [selectedFold, setSelectedFold] = useState(0);
  const [repeatCount, setRepeatCount] = useState(DEFAULT_REPEATS);
  const [candidateCount, setCandidateCount] = useState(DEFAULT_CANDIDATE_COUNT);

  const reset = () => {
    setStrategy(DEFAULT_STRATEGY);
    setK(DEFAULT_K);
    setPreprocessingInsideFold(true);
    setSelectedFold(0);
    setRepeatCount(DEFAULT_REPEATS);
    setCandidateCount(DEFAULT_CANDIDATE_COUNT);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Evaluation design under dependence</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">Cross-Validation That Matches Deployment</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              Cross-validation is a resampling protocol, not a magic accuracy multiplier. A mean across invalid folds is still an invalid estimate.
              Design the boundary first, then study partition variance and model-selection bias.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <FoldDesignLab
        strategy={strategy}
        onStrategyChange={setStrategy}
        k={k}
        onKChange={setK}
        preprocessingInsideFold={preprocessingInsideFold}
        onPreprocessingChange={setPreprocessingInsideFold}
        selectedFold={selectedFold}
        onSelectedFoldChange={setSelectedFold}
      />

      <RepeatedCvLab repeatCount={repeatCount} onRepeatCountChange={setRepeatCount} k={k} />
      <NestedSelectionLab candidateCount={candidateCount} onCandidateCountChange={setCandidateCount} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-blue-700">Boundary first</h2>
          <p className="mt-3 text-sm leading-6 text-blue-950">Use stratification for label balance, groups for repeated entities, and forward-only windows when deployment predicts the future. These constraints can need to be combined.</p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-violet-700">Variance second</h2>
          <p className="mt-3 text-sm leading-6 text-violet-950">Repeated CV reveals sensitivity to fold assignment. It does not repair a bad boundary and its overlapping training sets mean fold scores are correlated.</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-emerald-700">Selection last</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-950">When CV chooses architectures or hyperparameters, use nested CV when you need an estimate of the whole selection procedure—and still keep the final test outside development.</p>
        </div>
      </section>
    </div>
  );
}
