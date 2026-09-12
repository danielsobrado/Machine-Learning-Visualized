import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  LineChart,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  COMPLEXITY_STEPS,
  DATASETS,
  REGULARIZATION,
  complexityProfile,
  errorChart,
  fittedCurvePath,
  freshTestAudit,
  generalizationDiagnostics,
  makeDataSplits,
  pathFromChart,
  project,
  truthCurvePath,
} from './overfittingModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function SignalCard({ title, children, tone, icon }) {
  const toneClass = {
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-950',
    amber: 'border-amber-200 bg-amber-50 text-amber-950',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  }[tone];
  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
        {icon}
        {title}
      </p>
      <p className="mt-2 text-sm leading-6">{children}</p>
    </div>
  );
}

export default function OverfittingAnimation() {
  const [datasetId, setDatasetId] = useState('noisy');
  const [regularizationId, setRegularizationId] = useState('mild');
  const [maxComplexity, setMaxComplexity] = useState(7);
  const [showValidationChoice, setShowValidationChoice] = useState(true);
  const [auditSnapshot, setAuditSnapshot] = useState(null);

  const splits = useMemo(() => makeDataSplits(datasetId), [datasetId]);
  const profile = useMemo(
    () => complexityProfile(datasetId, regularizationId),
    [datasetId, regularizationId],
  );
  const diagnostics = useMemo(
    () => generalizationDiagnostics(profile, maxComplexity),
    [profile, maxComplexity],
  );
  const trainChart = useMemo(() => errorChart(diagnostics.observed, 'train'), [diagnostics.observed]);
  const validationChart = useMemo(() => errorChart(diagnostics.observed, 'validation'), [diagnostics.observed]);
  const currentCurve = useMemo(() => fittedCurvePath(diagnostics.current.fit), [diagnostics.current.fit]);
  const trueCurve = useMemo(() => truthCurvePath(), []);
  const recipeFrozen = auditSnapshot !== null;

  const {
    current,
    best,
    gap,
    validationExcess,
    trainingImprovementSinceBest,
  } = diagnostics;

  const reset = () => {
    setDatasetId('noisy');
    setRegularizationId('mild');
    setMaxComplexity(7);
    setShowValidationChoice(true);
    setAuditSnapshot(null);
  };

  const openFreshTest = () => {
    const audit = freshTestAudit(datasetId, regularizationId, best.degree);
    setAuditSnapshot({
      ...audit,
      datasetLabel: DATASETS[datasetId].label,
      regularizationLabel: REGULARIZATION[regularizationId].label,
      candidatesCompared: maxComplexity,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Generalization diagnosis</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Overfitting</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Every point in this lesson is now a real fitted polynomial. Overfitting appears when extra model capacity keeps lowering training MSE after validation MSE has already started worsening.
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
          Development controls
        </div>
        {recipeFrozen && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            <strong className="inline-flex items-center gap-2"><LockKeyhole size={15} /> Recipe frozen.</strong>{' '}
            Fresh-test evidence is open, so development controls stay locked. Reset to start a new independent development run.
          </div>
        )}
        <div className="grid gap-4 xl:grid-cols-[1.35fr_1.1fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Dataset condition</span>
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              {Object.entries(DATASETS).map(([id, dataset]) => (
                <button
                  key={id}
                  type="button"
                  disabled={recipeFrozen}
                  onClick={() => setDatasetId(id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    datasetId === id ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {dataset.label}
                  <span className={`mt-1 block text-xs font-semibold normal-case leading-4 ${datasetId === id ? 'text-cyan-50' : 'text-slate-500'}`}>
                    {dataset.detail}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Ridge regularization</span>
            <div className="grid gap-2">
              {Object.entries(REGULARIZATION).map(([id, config]) => (
                <button
                  key={id}
                  type="button"
                  disabled={recipeFrozen}
                  onClick={() => setRegularizationId(id)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    regularizationId === id ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {config.label}
                  <span className={`mt-1 block text-xs font-semibold normal-case leading-4 ${regularizationId === id ? 'text-emerald-50' : 'text-slate-500'}`}>
                    λ = {config.lambda}. {config.detail}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Highest degree revealed: {maxComplexity}
            <input
              min="1"
              max={COMPLEXITY_STEPS}
              step="1"
              type="range"
              disabled={recipeFrozen}
              value={maxComplexity}
              onChange={(event) => setMaxComplexity(Number(event.target.value))}
            />
            <span className="text-xs font-semibold leading-5 text-slate-500">
              Each step refits a degree-1…degree-{maxComplexity} polynomial to the same training rows. This is model capacity, not a fake epoch counter.
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={showValidationChoice}
              onChange={(event) => setShowValidationChoice(event.target.checked)}
              className="mt-1"
            />
            <span>
              Show validation-guided choice
              <small className="mt-1 block font-semibold leading-5 text-slate-500">
                Validation chooses among the revealed candidates. The fresh test remains unavailable until the recipe is frozen.
              </small>
            </span>
          </label>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <BrainCircuit size={16} />
            Actual fitted model
          </div>
          <svg viewBox="0 0 400 300" role="img" aria-label={`Degree-${current.degree} polynomial fitted to training data`} className="h-auto w-full rounded-lg bg-slate-50">
            <rect x="34" y="36" width="332" height="226" rx="10" fill="#f8fafc" stroke="#cbd5e1" />
            <path d={trueCurve} fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 6" />
            <path d={currentCurve} fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            {splits.validation.map((point) => {
              const { cx, cy } = project(point);
              return <circle key={`v-${point.id}`} cx={cx} cy={cy} r="4" fill="#f97316" opacity="0.65" />;
            })}
            {splits.train.map((point) => {
              const { cx, cy } = project(point);
              return (
                <circle
                  key={`t-${point.id}`}
                  cx={cx}
                  cy={cy}
                  r={point.noisy ? 6 : 5}
                  fill={point.noisy ? '#f59e0b' : '#0ea5e9'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              );
            })}
            <text x="200" y="288" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">feature value</text>
          </svg>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-sky-500" />training row</span>
            <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-orange-500" />validation row</span>
            <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-amber-500" />corrupted training outcome</span>
            <span className="inline-flex items-center gap-2"><i className="h-1 w-6 rounded bg-slate-900" />degree-{current.degree} fit</span>
            <span className="inline-flex items-center gap-2"><i className="h-1 w-6 border-t-2 border-dashed border-slate-400" />true signal</span>
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
            Validation points are drawn for comparison only. They never enter the polynomial fit or ridge coefficients.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <LineChart size={16} />
            Measured error by model capacity
          </div>
          <svg viewBox="0 0 380 210" role="img" aria-label={`Training and validation MSE through polynomial degree ${maxComplexity}`} className="h-auto w-full rounded-lg bg-slate-50">
            <rect x="34" y="30" width="308" height="140" rx="8" fill="#ffffff" stroke="#cbd5e1" />
            {[1, 4, 8, 12].map((degree) => (
              <line key={degree} x1={34 + ((degree - 1) / 11) * 308} x2={34 + ((degree - 1) / 11) * 308} y1="30" y2="170" stroke="#e2e8f0" />
            ))}
            <path d={pathFromChart(trainChart)} fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
            <path d={pathFromChart(validationChart)} fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
            <line x1={34 + ((maxComplexity - 1) / 11) * 308} x2={34 + ((maxComplexity - 1) / 11) * 308} y1="26" y2="174" stroke="#0f172a" strokeWidth="3" />
            {showValidationChoice && (() => {
              const marker = validationChart.find((point) => point.degree === best.degree);
              return marker ? <circle cx={marker.x} cy={marker.y} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="3" /> : null;
            })()}
            <text x="188" y="198" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">polynomial degree</text>
          </svg>
          <div className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
            <span className="inline-flex items-center gap-2"><i className="h-1 w-8 rounded bg-sky-600" />training MSE: {current.train.toFixed(1)}</span>
            <span className="inline-flex items-center gap-2"><i className="h-1 w-8 rounded bg-rose-600" />validation MSE: {current.validation.toFixed(1)}</span>
            {showValidationChoice && (
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-emerald-500" />best revealed validation degree: {best.degree}</span>
            )}
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
            Only candidate degrees 1–{maxComplexity} participate in model selection. Higher-degree validation results remain unrevealed.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="Generalization gap" value={gap.toFixed(1)} detail="Current validation MSE minus training MSE; useful context, not proof by itself." />
        <Stat
          label="Best revealed degree"
          value={showValidationChoice ? `Degree ${best.degree}` : 'Hidden'}
          detail={showValidationChoice ? `Validation MSE ${best.validation.toFixed(1)}.` : 'Validation-guided model selection is hidden.'}
        />
        <Stat
          label="Since validation best"
          value={diagnostics.pastBest ? `+${validationExcess.toFixed(1)} val` : 'No decline yet'}
          detail={diagnostics.pastBest ? `Training MSE improved ${trainingImprovementSinceBest.toFixed(1)} over the same capacity increase.` : 'Current degree is still the best revealed validation candidate.'}
        />
        <Stat label="Diagnosis" value={diagnostics.label} detail={diagnostics.explanation} />
      </section>

      <section className="rounded-lg border border-violet-200 bg-violet-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">Evaluation boundary</p>
            <h3 className="mt-1 text-lg font-black text-violet-950">Freeze the validation-selected recipe before opening the test</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-violet-900">
              The test split is not part of the complexity profile at all. It is scored only when you freeze the currently selected degree. After that, controls lock so test feedback cannot guide another modeling choice.
            </p>
          </div>
          {!auditSnapshot && (
            <button
              type="button"
              onClick={openFreshTest}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-black text-white"
            >
              <LockKeyhole size={16} /> Freeze recipe & open test
            </button>
          )}
        </div>

        {auditSnapshot ? (
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Stat label="Frozen recipe" value={`Degree ${auditSnapshot.degree}`} detail={`${auditSnapshot.datasetLabel} · ${auditSnapshot.regularizationLabel}`} />
            <Stat label="Candidates compared" value={auditSnapshot.candidatesCompared} detail="Validation-visible candidates before the freeze." />
            <Stat label="Selected validation MSE" value={auditSnapshot.validationMse.toFixed(1)} detail="Used for model selection." />
            <Stat label="Fresh test MSE" value={auditSnapshot.testMse.toFixed(1)} detail={`${auditSnapshot.testCount} untouched test observations; report-only evidence.`} />
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-violet-200 bg-white/70 p-4 text-sm leading-6 text-violet-950">
            No test metric has been computed yet. Continue developing with training and validation evidence, then freeze the recipe once.
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SignalCard title="Capacity, not epoch" tone="cyan" icon={<LineChart size={14} />}>
          Increasing polynomial degree adds real representational capacity. Training longer and making a model more expressive are different mechanisms, even though either can eventually produce overfitting.
        </SignalCard>
        <SignalCard title="Failure mode" tone="amber" icon={<AlertTriangle size={14} />}>
          Strong evidence is divergence: a more flexible fitted model improves training MSE while validation MSE moves materially away from its previous minimum.
        </SignalCard>
        <SignalCard title="Practical fix" tone="emerald" icon={<ShieldCheck size={14} />}>
          Use representative data, regularization, sensible capacity, and disciplined validation. Freeze choices before opening the final test; do not turn test evidence into another tuning loop.
        </SignalCard>
      </section>

      <AssessmentPanel lessonId="overfitting" />
    </div>
  );
}
