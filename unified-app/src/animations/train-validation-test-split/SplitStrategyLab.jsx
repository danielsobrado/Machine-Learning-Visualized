import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Shuffle, Sparkles } from 'lucide-react';
import {
  EVALUATION_TARGETS,
  SPLIT_MODES,
} from './trainValidationTestSplitConstants.js';
import {
  assignByMode,
  auditSplit,
  positiveRate,
} from './trainValidationTestSplitModel.js';

const BUCKET_STYLE = Object.freeze({
  train: 'border-blue-200 bg-blue-50',
  validation: 'border-amber-200 bg-amber-50',
  test: 'border-emerald-200 bg-emerald-50',
});

function SplitColumn({ bucket, rows }) {
  return (
    <div className={`rounded-lg border p-4 ${BUCKET_STYLE[bucket]}`}>
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm font-black uppercase tracking-wide text-slate-800">{bucket}</strong>
        <span className="font-mono text-xs font-black text-slate-600">{rows.length} rows</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {rows.map((row) => (
          <div key={row.id} className="rounded border border-white bg-white px-2 py-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <strong className="font-mono text-slate-800">{row.id} · entity {row.entity}</strong>
              <span className={row.y ? 'font-black text-rose-700' : 'font-black text-slate-500'}>y{row.y}</span>
            </div>
            <span className="text-slate-500">time {row.time} · {row.segment}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SplitStrategyLab({ targetId, mode, validationPercent, testPercent, onTargetChange, onModeChange, onValidationChange, onTestChange }) {
  const splits = useMemo(
    () => assignByMode(mode, validationPercent, testPercent),
    [mode, validationPercent, testPercent],
  );
  const audit = useMemo(() => auditSplit(mode, targetId, splits), [mode, targetId, splits]);
  const target = EVALUATION_TARGETS[targetId];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Split strategy lab</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Design the boundary around deployment</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Split ratios are secondary. First decide what must generalize: new rows, new entities, future events, or both future and unseen entities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onModeChange(target.recommendedMode)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white"
        >
          <Sparkles size={15} /> Use recommended split
        </button>
      </div>

      <div className="mt-5">
        <span className="text-sm font-bold text-slate-700">1. What does production need to generalize to?</span>
        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(EVALUATION_TARGETS).map(([id, config]) => (
            <button
              key={id}
              type="button"
              onClick={() => onTargetChange(id)}
              className={`rounded-lg border p-3 text-left ${targetId === id ? 'border-cyan-500 bg-cyan-50 text-cyan-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
            >
              <span className="block text-sm font-black">{config.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{config.short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <span className="text-sm font-bold text-slate-700">2. Choose a split mechanism</span>
        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(SPLIT_MODES).map(([id, config]) => (
            <button
              key={id}
              type="button"
              onClick={() => onModeChange(id)}
              className={`rounded-lg border p-3 text-left ${mode === id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
            >
              <span className="block text-sm font-black">{config.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-75">{config.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Validation target: {Math.round(validationPercent * 100)}%
          <input min="0.1" max="0.3" step="0.05" type="range" value={validationPercent} onChange={(event) => onValidationChange(Number(event.target.value))} />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Test target: {Math.round(testPercent * 100)}%
          <input min="0.1" max="0.3" step="0.05" type="range" value={testPercent} onChange={(event) => onTestChange(Number(event.target.value))} />
        </label>
      </div>

      <div className={`mt-5 rounded-lg border p-4 ${audit.valid ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-rose-200 bg-rose-50 text-rose-950'}`}>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
          {audit.valid ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          {audit.valid ? 'Boundary matches the deployment target' : 'Boundary is optimistic for this deployment target'}
        </p>
        <p className="mt-2 text-sm leading-6">
          {audit.valid
            ? `${SPLIT_MODES[mode].label} respects the required independence for ${target.label.toLowerCase()}.`
            : audit.failures.join(' · ')}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {['train', 'validation', 'test'].map((bucket) => <SplitColumn key={bucket} bucket={bucket} rows={splits[bucket]} />)}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {['train', 'validation', 'test'].map((bucket) => (
          <div key={bucket} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{bucket} positive rate</p>
            <strong className="mt-1 block text-xl text-slate-950">{Math.round(positiveRate(splits[bucket]) * 100)}%</strong>
          </div>
        ))}
      </div>

      {audit.overlap.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide"><Shuffle size={14} /> Entity overlap</p>
          <p className="mt-2 text-sm leading-6">
            {audit.overlap.map((item) => `${item.entity}: ${item.buckets.join(' → ')}`).join(' · ')}. Row-level balance can look excellent while identity leaks across partitions.
          </p>
        </div>
      )}
    </section>
  );
}
