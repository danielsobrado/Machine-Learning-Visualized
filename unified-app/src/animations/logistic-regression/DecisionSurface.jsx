import React from 'react';
import { Activity, Gauge, Sigma } from 'lucide-react';

function ConfusionCell({ label, value, tone }) {
  const toneClass = {
    good: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warn: 'border-amber-200 bg-amber-50 text-amber-800',
    miss: 'border-rose-200 bg-rose-50 text-rose-800',
    quiet: 'border-slate-200 bg-slate-50 text-slate-700',
  }[tone];

  return (
    <div className={`rounded-lg border p-3 text-center ${toneClass}`}>
      <span className="block text-xs font-black uppercase tracking-wide">{label}</span>
      <strong className="mt-1 block text-2xl font-black">{value}</strong>
    </div>
  );
}

export default function DecisionSurface({
  scored,
  selected,
  selectedId,
  onSelect,
  boundary,
  threshold,
  weightRisk,
  weightEngagement,
  bias,
  counts,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Gauge size={16} /> Decision surface
        </div>
        <svg viewBox="0 0 360 360" role="img" aria-label="Logistic regression decision boundary" className="h-auto w-full rounded-lg bg-slate-50">
          <defs>
            <linearGradient id="logisticBoundaryFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>
          </defs>
          <rect x="24" y="24" width="312" height="312" rx="10" fill="url(#logisticBoundaryFill)" />
          {[25, 50, 75].map((value) => (
            <g key={value}>
              <line x1={24 + value * 3.12} x2={24 + value * 3.12} y1="24" y2="336" stroke="#cbd5e1" strokeDasharray="4 4" />
              <line x1="24" x2="336" y1={336 - value * 3.12} y2={336 - value * 3.12} stroke="#cbd5e1" strokeDasharray="4 4" />
            </g>
          ))}
          <line x1={boundary.x1} y1={boundary.y1} x2={boundary.x2} y2={boundary.y2} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          {scored.map((point) => {
            const x = 24 + point.risk * 3.12;
            const y = 336 - point.engagement * 3.12;
            const correct = point.y === point.predicted;
            const selectedPoint = point.id === selectedId;
            return (
              <g key={point.id} onClick={() => onSelect(point.id)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={selectedPoint ? 11 : 8}
                  fill={point.y ? '#e11d48' : '#0284c7'}
                  stroke={correct ? '#ffffff' : '#f59e0b'}
                  strokeWidth={correct ? 3 : 5}
                />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff">
                  {point.id}
                </text>
              </g>
            );
          })}
          <text x="180" y="352" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">risk score</text>
          <text x="-180" y="14" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569" transform="rotate(-90)">engagement</text>
        </svg>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
          <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-sky-600" />actual negative</span>
          <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-rose-600" />actual positive</span>
          <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full border-4 border-amber-500 bg-white" />mistake</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Sigma size={16} /> Selected point {selected.id}
          </div>
          <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm text-slate-800">
            z = ({weightRisk.toFixed(2)} * {((selected.risk - 50) / 18).toFixed(2)}) + ({weightEngagement.toFixed(2)} *{' '}
            {((selected.engagement - 50) / 18).toFixed(2)}) + {bias.toFixed(2)}
            <br />
            p = sigmoid({selected.z.toFixed(2)}) = {selected.probability.toFixed(2)}
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-cyan-600" style={{ width: `${selected.probability * 100}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            At threshold {threshold.toFixed(2)}, this point is predicted <strong>class {selected.predicted}</strong> and the true label is{' '}
            <strong>class {selected.y}</strong>.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Activity size={16} /> Confusion matrix
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ConfusionCell label="TP" value={counts.tp} tone="good" />
            <ConfusionCell label="FP" value={counts.fp} tone="warn" />
            <ConfusionCell label="FN" value={counts.fn} tone="miss" />
            <ConfusionCell label="TN" value={counts.tn} tone="quiet" />
          </div>
        </div>
      </div>
    </section>
  );
}
