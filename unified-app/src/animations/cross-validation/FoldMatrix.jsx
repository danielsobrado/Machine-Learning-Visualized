import React from 'react';
import { CROSS_VALIDATION_ROWS } from './crossValidationConstants.js';

const CELL_STYLES = Object.freeze({
  train: 'border-blue-200 bg-blue-100 text-blue-800',
  validation: 'border-amber-300 bg-amber-100 text-amber-900',
  future: 'border-slate-200 bg-slate-50 text-slate-400',
});

function membership(fold, rowId) {
  if (fold.validation.some((row) => row.id === rowId)) return 'validation';
  if (fold.train.some((row) => row.id === rowId)) return 'train';
  return 'future';
}

function legendLabel(kind) {
  if (kind === 'validation') return 'Validate';
  if (kind === 'future') return 'Not available yet';
  return 'Train';
}

export default function FoldMatrix({ folds, selectedIndex, onSelect }) {
  const rows = [...CROSS_VALIDATION_ROWS].sort((a, b) => a.time - b.time);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Sample-level fold map</p>
          <h3 className="mt-1 text-base font-black text-slate-950">See exactly where every observation goes</h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Columns are CV rounds. Rows are observations in time order. A future cell means the sample did not exist yet for that round.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-bold">
          {Object.keys(CELL_STYLES).map((kind) => (
            <span key={kind} className={`rounded border px-2 py-1 ${CELL_STYLES[kind]}`}>
              {legendLabel(kind)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div
          className="grid min-w-[620px] gap-1.5"
          style={{ gridTemplateColumns: `7rem repeat(${folds.length}, minmax(5.2rem, 1fr))` }}
        >
          <div className="px-2 py-2 text-xs font-black uppercase tracking-wide text-slate-500">Observation</div>
          {folds.map((fold, index) => (
            <button
              key={`head-${fold.id}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={selectedIndex === index}
              className={`rounded-lg border px-2 py-2 text-xs font-black transition ${
                selectedIndex === index
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300'
              }`}
            >
              Fold {fold.id + 1}
            </button>
          ))}

          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <div className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-xs">
                <span className="font-black text-slate-800">{row.id}</span>
                <span className="font-mono text-slate-500">{row.user} · t{row.time}</span>
              </div>
              {folds.map((fold, index) => {
                const kind = membership(fold, row.id);
                return (
                  <button
                    key={`${row.id}-${fold.id}`}
                    type="button"
                    onClick={() => onSelect(index)}
                    title={`${row.id}, fold ${fold.id + 1}: ${legendLabel(kind)}`}
                    aria-label={`${row.id}, fold ${fold.id + 1}: ${legendLabel(kind)}`}
                    className={`min-h-8 rounded border px-1 text-[10px] font-black uppercase transition ${CELL_STYLES[kind]} ${
                      selectedIndex === index ? 'ring-2 ring-cyan-300 ring-offset-1' : ''
                    }`}
                  >
                    {kind === 'validation' ? 'VAL' : kind === 'future' ? '—' : 'TRAIN'}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
