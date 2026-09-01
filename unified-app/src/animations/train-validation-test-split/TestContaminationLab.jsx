import React, { useMemo } from 'react';
import { AlertTriangle, FlaskConical } from 'lucide-react';
import { simulateRepeatedSelection } from './trainValidationTestSplitModel.js';

const percent = (value) => `${(value * 100).toFixed(1)}%`;

export default function TestContaminationLab({ candidateCount, onCandidateCountChange }) {
  const replay = useMemo(() => simulateRepeatedSelection(candidateCount), [candidateCount]);
  const selected = replay.selected;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><FlaskConical size={15} /> Repeated-selection replay</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">A test set can become training feedback without gradients</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            This synthetic replay gives many equally good candidate recipes noisy scores on the same finite test set. If you keep the best-looking test result, you select test-set noise.
          </p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-950">
          {replay.count} candidate{replay.count === 1 ? '' : 's'} compared
        </div>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
        How many model recipes did the team try after looking at test results? {replay.count}
        <input min="1" max="20" step="1" type="range" value={candidateCount} onChange={(event) => onCandidateCountChange(Number(event.target.value))} />
      </label>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Selected test score</p>
          <strong className="mt-1 block text-2xl text-slate-950">{percent(selected.testScore)}</strong>
          <span className="text-xs font-semibold text-slate-500">candidate {selected.id} won on reused test feedback</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Fresh holdout score</p>
          <strong className="mt-1 block text-2xl text-slate-950">{percent(selected.freshScore)}</strong>
          <span className="text-xs font-semibold text-slate-500">same selected candidate, independent sample</span>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Winner's optimism</p>
          <strong className="mt-1 block text-2xl text-rose-950">+{(replay.optimism * 100).toFixed(1)} pts</strong>
          <span className="text-xs font-semibold text-rose-700">selection adapted to finite test noise</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex h-36 items-end gap-1">
          {replay.candidates.map((candidate) => {
            const height = 20 + ((candidate.testScore - 0.735) / 0.065) * 100;
            const selectedCandidate = candidate.id === selected.id;
            return (
              <div key={candidate.id} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
                <div
                  title={`candidate ${candidate.id}: ${percent(candidate.testScore)}`}
                  className={`w-full rounded-t ${selectedCandidate ? 'bg-violet-700' : 'bg-violet-300'}`}
                  style={{ height: `${Math.max(8, Math.min(120, height))}px` }}
                />
                <span className="text-[9px] font-bold text-slate-400">{candidate.id}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide"><AlertTriangle size={14} /> Process failure</p>
        <p className="mt-2 text-sm leading-6">
          Test contamination is cumulative. Once test outcomes influence architecture, features, thresholds, prompts, or hyperparameters, that test set is part of development. Freeze the recipe first, then evaluate once on a fresh final set.
        </p>
      </div>
    </section>
  );
}
