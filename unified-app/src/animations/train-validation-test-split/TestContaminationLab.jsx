import React, { useMemo } from 'react';
import { AlertTriangle, FlaskConical } from 'lucide-react';
import { SELECTION_EXPERIMENT } from './trainValidationTestSplitConstants.js';
import { simulateRepeatedSelection } from './trainValidationTestSplitModel.js';

const percent = (value) => `${(value * 100).toFixed(1)}%`;
const points = (value) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)} pts`;

export default function TestContaminationLab({
  candidateCount,
  testSize,
  onCandidateCountChange,
  onTestSizeChange,
}) {
  const experiment = useMemo(
    () => simulateRepeatedSelection(candidateCount, testSize),
    [candidateCount, testSize],
  );
  const { candidates, selected } = experiment.representative;
  const candidateScores = candidates.map((candidate) => candidate.testScore);
  const scoreFloor = Math.min(experiment.trueAccuracy - 0.1, ...candidateScores);
  const scoreCeiling = Math.max(experiment.trueAccuracy + 0.1, ...candidateScores);
  const scoreRange = Math.max(0.01, scoreCeiling - scoreFloor);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><FlaskConical size={15} /> Repeated-selection experiment</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">A test set can become training feedback without gradients</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Every candidate below has the same true accuracy. Each trial measures them on the same-sized finite test set, picks the apparent winner, then measures that winner on an independent fresh holdout. The gap is produced by selection on test noise—not by a hand-authored winner.
          </p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-950">
          {experiment.trials} deterministic retrials
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Candidate recipes tried after test feedback: {experiment.count}
          <input
            min={SELECTION_EXPERIMENT.candidateMin}
            max={SELECTION_EXPERIMENT.candidateMax}
            step={SELECTION_EXPERIMENT.candidateStep}
            type="range"
            value={candidateCount}
            onChange={(event) => onCandidateCountChange(Number(event.target.value))}
          />
          <span className="text-xs font-semibold text-slate-500">More attempts create more chances to select a lucky test fluctuation.</span>
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Test observations per candidate: {experiment.testSize}
          <input
            min={SELECTION_EXPERIMENT.testSizeMin}
            max={SELECTION_EXPERIMENT.testSizeMax}
            step={SELECTION_EXPERIMENT.testSizeStep}
            type="range"
            value={testSize}
            onChange={(event) => onTestSizeChange(Number(event.target.value))}
          />
          <span className="text-xs font-semibold text-slate-500">Larger untouched samples reduce noise, but do not make repeated peeking valid.</span>
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">True accuracy</p>
          <strong className="mt-1 block text-2xl text-slate-950">{percent(experiment.trueAccuracy)}</strong>
          <span className="text-xs font-semibold text-slate-500">identical for every candidate</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Mean selected test</p>
          <strong className="mt-1 block text-2xl text-slate-950">{percent(experiment.meanSelectedTestScore)}</strong>
          <span className="text-xs font-semibold text-slate-500">average winner across retrials</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Mean fresh holdout</p>
          <strong className="mt-1 block text-2xl text-slate-950">{percent(experiment.meanFreshScore)}</strong>
          <span className="text-xs font-semibold text-slate-500">same selected recipe, new observations</span>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Selection optimism</p>
          <strong className="mt-1 block text-2xl text-rose-950">{points(experiment.optimism)}</strong>
          <span className="text-xs font-semibold text-rose-700">measured test-selection bias</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">One representative finite test draw</p>
          <p className="text-xs font-semibold text-slate-500">winner: candidate {selected.id} at {percent(selected.testScore)} · fresh: {percent(selected.freshScore)}</p>
        </div>
        <div className="flex h-36 items-end gap-1">
          {candidates.map((candidate) => {
            const height = 14 + ((candidate.testScore - scoreFloor) / scoreRange) * 106;
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
          Test contamination is cumulative. Once test outcomes influence architecture, features, thresholds, prompts, or hyperparameters, that test set is part of development. Use validation or cross-validation during search, freeze the recipe, then evaluate once on untouched final evidence.
        </p>
      </div>
    </section>
  );
}
