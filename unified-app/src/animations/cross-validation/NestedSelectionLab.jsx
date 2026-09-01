import React, { useMemo } from 'react';
import { SearchCheck } from 'lucide-react';
import { nestedSelectionReplay } from './crossValidationModel.js';

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function NestedSelectionLab({ candidateCount, onCandidateCountChange }) {
  const replay = useMemo(() => nestedSelectionReplay(candidateCount), [candidateCount]);
  const ranked = [...replay.candidates].sort((a, b) => b.fullInnerScore - a.fullInnerScore).slice(0, 6);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700"><SearchCheck size={15} /> Model-selection bias</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">The CV score used to choose a winner is not an untouched evaluation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Once many recipes compete on the same CV loop, selection favors candidates with positive validation noise. Nested CV puts that search inside each outer training split and reserves the outer fold for evaluation.
          </p>
        </div>
        <label className="min-w-64 text-sm font-bold text-slate-700">
          Candidate recipes: {candidateCount}
          <input className="mt-2 block w-full" min="2" max="12" step="1" type="range" value={candidateCount} onChange={(event) => onCandidateCountChange(Number(event.target.value))} />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-black uppercase text-rose-700">Naive winner score</p>
          <strong className="mt-1 block text-3xl text-rose-950">{percent(replay.naive.fullInnerScore)}</strong>
          <span className="text-sm text-rose-800">recipe {replay.naive.index}, selected and reported on same CV search</span>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase text-emerald-700">Nested outer estimate</p>
          <strong className="mt-1 block text-3xl text-emerald-950">{percent(replay.nestedMean)}</strong>
          <span className="text-sm text-emerald-800">selection reruns inside every outer fold</span>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-black uppercase text-amber-700">Selection optimism</p>
          <strong className="mt-1 block text-3xl text-amber-950">+{(replay.optimism * 100).toFixed(1)} pts</strong>
          <span className="text-sm text-amber-800">search score minus outer estimate</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">Top search results</h3>
          <div className="mt-3 space-y-2">
            {ranked.map((candidate) => (
              <div key={candidate.index} className="flex items-center justify-between gap-3 rounded bg-white px-3 py-2 text-sm">
                <span className="font-bold text-slate-700">Recipe {candidate.index}</span>
                <span className="font-mono font-black text-slate-900">{percent(candidate.fullInnerScore)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-black uppercase tracking-wide text-slate-500">Outer-fold replay</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {replay.outerResults.map((result) => (
              <div key={result.outerFold} className="rounded bg-white p-3 text-center">
                <span className="block text-[10px] font-black uppercase text-slate-400">Outer {result.outerFold}</span>
                <strong className="mt-1 block text-sm text-slate-900">R{result.selectedIndex}</strong>
                <span className="mt-1 block font-mono text-xs text-emerald-700">{percent(result.outerScore)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Inner folds choose the recipe. The outer validation fold answers a different question: how well does the entire selection procedure generalize to unseen data?
          </p>
        </div>
      </div>
    </section>
  );
}
