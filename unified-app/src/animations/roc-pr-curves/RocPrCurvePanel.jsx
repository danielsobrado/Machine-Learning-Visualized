import React from 'react';

const CHART = Object.freeze({ size: 360, left: 36, right: 36, top: 36, bottom: 36 });

function linePoints(points, xKey, yKey) {
  const span = CHART.size - CHART.left - CHART.right;
  return [...points]
    .sort((left, right) => left[xKey] - right[xKey] || left[yKey] - right[yKey])
    .map((point) => `${CHART.left + point[xKey] * span},${CHART.size - CHART.bottom - point[yKey] * span}`)
    .join(' ');
}

function nearest(points, threshold) {
  return points.reduce((best, point) => (
    !best || Math.abs(point.threshold - threshold) < Math.abs(best.threshold - threshold) ? point : best
  ), null);
}

export default function RocPrCurvePanel({
  title,
  xLabel,
  yLabel,
  xKey,
  yKey,
  primary,
  comparison,
  threshold,
  baseline = null,
}) {
  const span = CHART.size - CHART.left - CHART.right;
  const active = nearest(primary.points, threshold);
  const x = (value) => CHART.left + value * span;
  const y = (value) => CHART.size - CHART.bottom - value * span;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">{primary.label}</p>
        </div>
        {comparison && (
          <div className="text-right text-xs font-bold text-slate-500">
            <span className="inline-block h-0.5 w-5 bg-slate-400 align-middle" /> {comparison.label}
          </div>
        )}
      </div>

      <svg viewBox="0 0 360 360" className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label={title}>
        <line x1="36" y1="324" x2="324" y2="324" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="36" y1="324" x2="36" y2="36" stroke="#cbd5e1" strokeWidth="2" />
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} y1="324" x2={x(tick)} y2="329" stroke="#94a3b8" />
            <line x1="31" y1={y(tick)} x2="36" y2={y(tick)} stroke="#94a3b8" />
          </g>
        ))}
        {baseline !== null && (
          <line x1="36" y1={y(baseline)} x2="324" y2={y(baseline)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 5" />
        )}
        {comparison && (
          <polyline
            points={linePoints(comparison.points, xKey, yKey)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="7 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <polyline
          points={linePoints(primary.points, xKey, yKey)}
          fill="none"
          stroke="#0891b2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {active && (
          <circle cx={x(active[xKey])} cy={y(active[yKey])} r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
        )}
        <text x="180" y="350" textAnchor="middle" className="fill-slate-600 text-xs font-bold">{xLabel}</text>
        <text x="16" y="184" textAnchor="middle" transform="rotate(-90 16 184)" className="fill-slate-600 text-xs font-bold">{yLabel}</text>
      </svg>
    </section>
  );
}
