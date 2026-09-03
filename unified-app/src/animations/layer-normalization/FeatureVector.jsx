import React from 'react';

function barWidth(value, maxAbs) {
  if (!Number.isFinite(value) || maxAbs <= 0) return 0;
  return Math.min(48, (Math.abs(value) / maxAbs) * 48);
}

export default function FeatureVector({ title, values, helper, accentClass = 'bg-violet-600' }) {
  const maxAbs = Math.max(1, ...values.map((value) => Math.abs(value)));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{title}</h3>
          {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="grid grid-cols-[32px_56px_1fr] items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">h{index + 1}</span>
            <span className="font-mono text-slate-700">{value.toFixed(2)}</span>
            <div className="relative h-3 rounded-full bg-slate-100">
              <div className="absolute left-1/2 top-[-2px] h-5 w-px bg-slate-300" />
              <div
                className={`absolute top-0 h-3 rounded-full ${accentClass} ${value >= 0 ? 'left-1/2' : 'right-1/2'}`}
                style={{ width: `${barWidth(value, maxAbs)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
