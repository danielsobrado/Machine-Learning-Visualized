import React, { useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  LEAKAGE_MODES,
  LEAKAGE_ROWS,
  getLeakageState,
} from './dataLeakageDeepDiveModel.js';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block break-words text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function points(value) {
  return `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)} pts`;
}

function auditStyle(role) {
  if (role?.kind === 'source') return 'bg-rose-50 text-rose-950';
  if (role?.kind === 'affected') return 'bg-amber-50 text-amber-950';
  return 'bg-white text-slate-700';
}

function auditLabel(role, repairApplied) {
  if (repairApplied || !role) return 'contained';
  return role.label;
}

function PreprocessingExperiment({ experiment, repairApplied }) {
  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50 p-5">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">Measured transform contamination</p>
      <h3 className="mt-1 text-lg font-black text-violet-950">The same holdout row gets a different representation</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-violet-900">
        The scaler is the experiment. No accuracy bonus is invented: allowing holdout rows into fitting changes the parameters themselves.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Train-only fit"
          value={`μ ${experiment.trainOnlyFit.mean.toFixed(1)}`}
          detail={`σ ${experiment.trainOnlyFit.std.toFixed(2)} from training rows only`}
        />
        <Stat
          label="All-row fit"
          value={`μ ${experiment.leakedFit.mean.toFixed(1)}`}
          detail={`σ ${experiment.leakedFit.std.toFixed(2)} after holdout contamination`}
        />
        <Stat
          label={`Row ${experiment.example.id}: safe z`}
          value={experiment.example.safeTransformed.toFixed(2)}
          detail={`raw value ${experiment.example.raw}, transformed with train-only statistics`}
        />
        <Stat
          label={`Row ${experiment.example.id}: leaked z`}
          value={experiment.example.leakedTransformed.toFixed(2)}
          detail="same raw value, transformed after fitting on all rows"
        />
      </div>
      <p className={`mt-4 rounded-lg border p-4 text-sm font-semibold leading-6 ${
        repairApplied
          ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
          : 'border-rose-200 bg-rose-50 text-rose-950'
      }`}>
        Active scaler: <strong>{experiment.activeFitSource}</strong>. Fitting on all rows shifts the center by {experiment.meanShift.toFixed(1)} and the scale by {experiment.scaleShift.toFixed(2)} before the model sees validation or test data.
      </p>
    </section>
  );
}

function TestTuningExperiment({ experiment, repairApplied }) {
  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50 p-5">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">Finite-sample selection experiment</p>
      <h3 className="mt-1 text-lg font-black text-violet-950">{experiment.candidateCount} equally good recipes can still produce a lucky winner</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-violet-900">
        Every simulated recipe has the same {percent(experiment.trueAccuracy)} true accuracy. The only difference is finite-sample evaluation noise. Selection uses {experiment.selectionSource}; the reported estimate uses {experiment.reportSource}.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Recipes" value={experiment.candidateCount} detail="all have identical true accuracy" />
        <Stat label="True accuracy" value={percent(experiment.trueAccuracy)} detail="known because this is a controlled simulation" />
        <Stat label={`Selected R${experiment.selectedCandidate}`} value={percent(experiment.selectionScore)} detail={`best score on ${experiment.selectionSource}`} />
        <Stat label="Reported estimate" value={percent(experiment.reportScore)} detail={experiment.reportSource} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {experiment.candidateScores.map((candidate) => (
          <div
            key={candidate.index}
            className={`rounded-lg border p-3 ${
              candidate.index === experiment.selectedCandidate
                ? 'border-violet-400 bg-white'
                : 'border-violet-100 bg-violet-100/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs font-black text-violet-900">
              <span>R{candidate.index}</span>
              <span className="font-mono">{percent(candidate.selectionScore)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${candidate.selectionScore * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className={`mt-4 rounded-lg border p-4 text-sm font-semibold leading-6 ${
        repairApplied
          ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
          : 'border-rose-200 bg-rose-50 text-rose-950'
      }`}>
        {repairApplied
          ? `The ${percent(experiment.selectionScore)} validation winner is frozen before the final test is opened. Its untouched final-test estimate is ${percent(experiment.reportScore)}, ${points(experiment.optimism)} from the known truth in this simulation.`
          : `Selecting and reporting the best final-test result gives ${percent(experiment.reportScore)}. A fresh independent sample gives ${percent(experiment.referenceScore)}, exposing ${points(experiment.optimism)} of winner optimism.`}
      </p>
    </section>
  );
}

function ExperimentEvidence({ experiment, repairApplied }) {
  if (experiment?.type === 'preprocessing') {
    return <PreprocessingExperiment experiment={experiment} repairApplied={repairApplied} />;
  }
  if (experiment?.type === 'testTuning') {
    return <TestTuningExperiment experiment={experiment} repairApplied={repairApplied} />;
  }
  return null;
}

export default function DataLeakageDeepDiveAnimation() {
  const [mode, setMode] = useState('target');
  const [repairApplied, setRepairApplied] = useState(false);
  const state = useMemo(() => getLeakageState(mode, repairApplied), [mode, repairApplied]);
  const config = state.mode;
  const showPostOutcome = mode === 'target';
  const showMeasurement = mode === 'preprocessing';

  const reset = () => {
    setMode('target');
    setRepairApplied(false);
  };

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setRepairApplied(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Evaluation integrity</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Data Leakage Deep Dive</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              Leakage happens when fitting, feature construction, model selection, or evaluation uses information that
              would not be available at the intended prediction boundary. Code can run perfectly while the experiment
              answers an easier, invalid question.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Leakage controls
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Leakage mechanism</span>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {Object.entries(LEAKAGE_MODES).map(([id, option]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectMode(id)}
                  aria-pressed={mode === id}
                  className={`rounded-lg border px-3 py-2 text-sm font-black transition ${
                    mode === id
                      ? 'border-rose-500 bg-rose-600 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-rose-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            <span>
              Apply repair
              <span className="mt-1 block text-xs font-semibold text-slate-500">{config.repairLabel}</span>
            </span>
            <input
              type="checkbox"
              checked={repairApplied}
              onChange={(event) => setRepairApplied(event.target.checked)}
            />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Boundary status"
          value={state.unsafe ? 'Unsafe' : 'Contained'}
          detail={state.unsafe ? 'forbidden information crosses the active contract' : 'selected leakage path is blocked'}
        />
        <Stat
          label="Detected violations"
          value={state.violationCount}
          detail={config.violationUnit}
        />
        <Stat
          label="Crossed information"
          value={state.crossedInformation}
          detail="what should not influence this decision"
        />
        <Stat
          label="Repair"
          value={repairApplied ? 'Applied' : 'Not applied'}
          detail={config.repairLabel}
        />
      </div>

      <ExperimentEvidence experiment={state.experiment} repairApplied={repairApplied} />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <AlertTriangle size={16} />
            Boundary audit table
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The scenario split can change with the selected mechanism. The audit marks the actual information source,
            not merely every row that happens to be in validation or test.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Row</th>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Time</th>
                  <th className="px-3 py-2">Scenario split</th>
                  <th className="px-3 py-2">Target</th>
                  {showMeasurement && <th className="px-3 py-2">signal_value</th>}
                  {showPostOutcome && <th className="px-3 py-2">post_outcome_code</th>}
                  <th className="px-3 py-2">Audit</th>
                </tr>
              </thead>
              <tbody>
                {LEAKAGE_ROWS.map((row) => {
                  const role = state.rowRoles[row.id];
                  return (
                    <tr key={row.id} className={auditStyle(repairApplied ? null : role)}>
                      <td className="px-3 py-2 font-black">{row.id}</td>
                      <td className="px-3 py-2">{row.user}</td>
                      <td className="px-3 py-2">{row.time}</td>
                      <td className="px-3 py-2 font-semibold">{state.scenarioSplits[row.id]}</td>
                      <td className="px-3 py-2 font-mono font-bold">{row.target}</td>
                      {showMeasurement && <td className="px-3 py-2 font-mono">{row.measurement}</td>}
                      {showPostOutcome && (
                        <td className="px-3 py-2 font-mono text-xs">{repairApplied ? 'excluded' : row.postOutcomeCode}</td>
                      )}
                      <td className="px-3 py-2 font-bold">{auditLabel(role, repairApplied)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <ShieldCheck size={16} />
            Diagnosis
          </h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-cyan-700">Active evaluation contract</h4>
              <p className="mt-2 text-sm font-black text-cyan-950">{config.contract}</p>
              <p className="mt-2 text-sm leading-6 text-cyan-900">{config.contractNote}</p>
            </div>
            <div className={`rounded-lg border p-4 ${
              state.unsafe ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'
            }`}>
              <h4 className={`text-sm font-black uppercase tracking-wide ${state.unsafe ? 'text-rose-700' : 'text-emerald-700'}`}>
                Information path
              </h4>
              <p className={`mt-2 font-mono text-xs leading-5 ${state.unsafe ? 'text-rose-950' : 'text-emerald-950'}`}>
                {state.flow}
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-amber-700">Evidence</h4>
              <p className="mt-2 text-sm leading-6 text-amber-950">{state.evidence}</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="text-sm font-black uppercase tracking-wide text-emerald-700">Correct repair</h4>
              <p className="mt-2 text-sm leading-6 text-emerald-950">{config.fix}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">Prediction boundary</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            Ask what is genuinely known for this entity at this prediction timestamp. A feature can exist in the warehouse and still be unavailable to the deployed model.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Fitting boundary</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            Define what must generalize first, then choose the split unit. Fit scalers, imputers, selectors, encoders, and other learned transforms inside the resulting training boundary or fold.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Feedback boundary</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Validation can guide development. A final test result cannot guide another recipe choice and remain an untouched estimate of that development process.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="data-leakage-deep-dive" title="Data Leakage Deep Dive check" />
    </div>
  );
}
