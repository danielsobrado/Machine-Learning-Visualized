import React, { useMemo } from 'react';
import { AlertTriangle, CalendarClock, Layers3, ShieldCheck, Users } from 'lucide-react';
import FoldMatrix from './FoldMatrix.jsx';
import { CROSS_VALIDATION_ROWS, SPLIT_STRATEGIES } from './crossValidationConstants.js';
import { buildFolds, positiveRate, summarizeFolds } from './crossValidationModel.js';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function RateBar({ label, rate, baseline }) {
  const delta = (rate - baseline) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
        <span>{label}</span>
        <span className="font-mono">{(rate * 100).toFixed(0)}% positive</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${rate * 100}%` }} />
      </div>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">
        {Math.abs(delta) < 0.5 ? 'matches dataset rate' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} pts vs dataset`}
      </p>
    </div>
  );
}

function timeRange(rows) {
  if (!rows.length) return '—';
  const times = rows.map((row) => row.time);
  return `t${Math.min(...times)}–t${Math.max(...times)}`;
}

function FoldCard({ fold, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-lg border p-3 text-left transition ${
        selected ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-slate-50 hover:border-cyan-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <strong className="text-sm text-slate-950">Fold {fold.id + 1}</strong>
        <span className="font-mono text-xs font-black text-slate-500">{Math.round(fold.score * 100)}%</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
        <span>{fold.train.length} train</span>
        <span>{fold.validation.length} validate</span>
        <span>{timeRange(fold.train)}</span>
        <span>{timeRange(fold.validation)}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {fold.audit.entityOverlap.length > 0 && (
          <span className="rounded bg-rose-100 px-2 py-1 text-[10px] font-black uppercase text-rose-700">entity leak</span>
        )}
        {!fold.audit.chronological && (
          <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-black uppercase text-amber-800">not future-safe</span>
        )}
        {!fold.audit.preprocessingContained && (
          <span className="rounded bg-rose-100 px-2 py-1 text-[10px] font-black uppercase text-rose-700">preprocess leak</span>
        )}
        {fold.audit.entityOverlap.length === 0 && fold.audit.preprocessingContained && (
          <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">contained</span>
        )}
      </div>
    </button>
  );
}

export default function FoldDesignLab({
  strategy,
  onStrategyChange,
  k,
  onKChange,
  preprocessingInsideFold,
  onPreprocessingChange,
  selectedFold,
  onSelectedFoldChange,
}) {
  const folds = useMemo(() => buildFolds(k, strategy), [k, strategy]);
  const summary = useMemo(
    () => summarizeFolds(folds, preprocessingInsideFold),
    [folds, preprocessingInsideFold],
  );
  const selectedIndex = Math.min(selectedFold, Math.max(0, summary.folds.length - 1));
  const selected = summary.folds[selectedIndex];
  const strategyConfig = SPLIT_STRATEGIES[strategy];
  const futureStrategy = strategy === 'time' || strategy === 'groupedTime';
  const datasetPositiveRate = positiveRate(CROSS_VALIDATION_ROWS);
  const classBalanceDrift = summary.folds.length
    ? summary.folds.reduce((sum, fold) => sum + Math.abs(positiveRate(fold.validation) - datasetPositiveRate), 0) / summary.folds.length
    : 0;

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Resampling contract</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">Choose folds from the deployment boundary—not from habit</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          K-fold is valid only when its held-out rows represent the independence you will face after deployment. Class balance, entity identity,
          chronology, and preprocessing scope are separate constraints.
        </p>

        <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(SPLIT_STRATEGIES).map(([id, option]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                onStrategyChange(id);
                onSelectedFoldChange(0);
              }}
              aria-pressed={strategy === id}
              className={`rounded-lg border p-3 text-left transition ${
                strategy === id
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300'
              }`}
            >
              <span className="block text-sm font-black">{option.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{option.short}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.7fr_1fr_1.8fr]">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Fold count: {k}
            <input
              min="3"
              max="5"
              step="1"
              type="range"
              value={k}
              aria-label={`Fold count: ${k}`}
              onChange={(event) => {
                const nextK = Number(event.target.value);
                onKChange(nextK);
                onSelectedFoldChange((current) => Math.min(current, nextK - 1));
              }}
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            Fit preprocessing inside each fold
            <input
              type="checkbox"
              checked={preprocessingInsideFold}
              onChange={(event) => onPreprocessingChange(event.target.checked)}
            />
          </label>
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
            <strong className="text-sm text-cyan-950">{strategyConfig.label}</strong>
            <p className="mt-1 text-xs font-semibold leading-5 text-cyan-900">{strategyConfig.detail}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Mean CV score" value={`${(summary.mean * 100).toFixed(1)}%`} detail="average held-out score" />
        <Stat label="Fold spread" value={`${((summary.max - summary.min) * 100).toFixed(1)} pts`} detail="best minus worst fold" />
        <Stat label="Class drift" value={`${(classBalanceDrift * 100).toFixed(1)} pts`} detail="mean validation-rate drift" />
        <Stat label="Entity-leak folds" value={`${summary.entityLeakFolds}/${summary.folds.length}`} detail="validation user also in train" />
        <Stat
          label="Future-unsafe folds"
          value={`${summary.timeViolationFolds}/${summary.folds.length}`}
          detail={futureStrategy ? 'must be zero for this contract' : 'relevant when predicting future events'}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Layers3 size={16} /> Fold replay
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {summary.folds.map((fold, index) => (
            <FoldCard
              key={fold.id}
              fold={fold}
              selected={index === selectedIndex}
              onSelect={() => onSelectedFoldChange(index)}
            />
          ))}
        </div>
      </div>

      <FoldMatrix
        folds={summary.folds}
        selectedIndex={selectedIndex}
        onSelect={onSelectedFoldChange}
      />

      {selected && (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Selected fold boundary</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-black uppercase text-blue-700">Training</p>
                <strong className="mt-1 block text-xl text-blue-950">{selected.train.length} rows</strong>
                <p className="mt-1 text-sm text-blue-900">{new Set(selected.train.map((row) => row.user)).size} users · {timeRange(selected.train)}</p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase text-amber-700">Validation</p>
                <strong className="mt-1 block text-xl text-amber-950">{selected.validation.length} rows</strong>
                <p className="mt-1 text-sm text-amber-900">{new Set(selected.validation.map((row) => row.user)).size} users · {timeRange(selected.validation)}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <RateBar label="Training class balance" rate={positiveRate(selected.train)} baseline={datasetPositiveRate} />
              <RateBar label="Validation class balance" rate={positiveRate(selected.validation)} baseline={datasetPositiveRate} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
              <span className={`inline-flex items-center gap-1 rounded px-2 py-1 ${selected.audit.entityOverlap.length ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                <Users size={13} /> {selected.audit.entityOverlap.length ? `${selected.audit.entityOverlap.length} overlapping users` : 'entities separated'}
              </span>
              <span className={`inline-flex items-center gap-1 rounded px-2 py-1 ${selected.audit.chronological ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                <CalendarClock size={13} /> {selected.audit.chronological ? 'train is earlier' : 'future rows leak into training'}
              </span>
            </div>
          </div>

          <div className={`rounded-lg border p-5 ${
            (selected.audit.entityOverlap.length > 0 || !preprocessingInsideFold || (futureStrategy && !selected.audit.chronological))
              ? 'border-rose-200 bg-rose-50'
              : 'border-emerald-200 bg-emerald-50'
          }`}>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
              {(selected.audit.entityOverlap.length > 0 || !preprocessingInsideFold || (futureStrategy && !selected.audit.chronological))
                ? <AlertTriangle size={15} />
                : <ShieldCheck size={15} />}
              Boundary diagnosis
            </p>
            <p className="mt-3 text-sm leading-6">
              {selected.audit.entityOverlap.length > 0
                ? `Users ${selected.audit.entityOverlap.join(', ')} occur on both sides. A class-balanced fold can still memorize entity-specific signal.`
                : futureStrategy && !selected.audit.chronological
                  ? 'The validation window is not strictly after training. This cannot estimate future generalization.'
                  : !preprocessingInsideFold
                    ? 'The rows are separated, but preprocessing still learns from validation statistics before scoring.'
                    : 'This selected fold satisfies the active entity/preprocessing boundary. Check whether its time semantics also match deployment.'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
