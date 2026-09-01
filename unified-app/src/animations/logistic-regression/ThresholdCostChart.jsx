import React from 'react';
import { THRESHOLD_RANGE } from './logisticRegressionConstants.js';

const CHART = Object.freeze({ width: 720, height: 230, left: 54, right: 18, top: 20, bottom: 42 });

function nearestPoint(sweep, threshold) {
  return sweep.reduce((nearest, point) => (
    !nearest || Math.abs(point.threshold - threshold) < Math.abs(nearest.threshold - threshold) ? point : nearest
  ), null);
}

export default function ThresholdCostChart({ sweep, currentThreshold, optimalThreshold }) {
  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  const minCost = Math.min(...sweep.map((point) => point.cost));
  const maxCost = Math.max(...sweep.map((point) => point.cost));
  const costSpan = Math.max(1, maxCost - minCost);
  const thresholdSpan = THRESHOLD_RANGE.max - THRESHOLD_RANGE.min;
  const x = (threshold) => CHART.left + ((threshold - THRESHOLD_RANGE.min) / thresholdSpan) * plotWidth;
  const y = (cost) => CHART.top + ((maxCost - cost) / costSpan) * plotHeight;
  const current = nearestPoint(sweep, currentThreshold);
  const optimal = nearestPoint(sweep, optimalThreshold);
  const points = sweep.map((point) => `${x(point.threshold)},${y(point.cost)}`).join(' ');

  return (
    <svg
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      role="img"
      aria-label="Expected decision cost across classification thresholds"
      className="h-auto w-full"
    >
      <rect x={CHART.left} y={CHART.top} width={plotWidth} height={plotHeight} rx="10" fill="#f8fafc" />
      {[0.25, 0.5, 0.75].map((threshold) => (
        <g key={threshold}>
          <line
            x1={x(threshold)}
            x2={x(threshold)}
            y1={CHART.top}
            y2={CHART.top + plotHeight}
            stroke="#cbd5e1"
            strokeDasharray="4 4"
          />
          <text x={x(threshold)} y={CHART.height - 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">
            {threshold.toFixed(2)}
          </text>
        </g>
      ))}
      <polyline points={points} fill="none" stroke="#0891b2" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      <line
        x1={x(current.threshold)}
        x2={x(current.threshold)}
        y1={CHART.top}
        y2={CHART.top + plotHeight}
        stroke="#0f172a"
        strokeWidth="2"
        strokeDasharray="6 5"
      />
      <circle cx={x(current.threshold)} cy={y(current.cost)} r="6" fill="#0f172a" />
      <circle cx={x(optimal.threshold)} cy={y(optimal.cost)} r="8" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
      <text x={CHART.left} y={14} fontSize="11" fontWeight="800" fill="#64748b">
        higher expected cost
      </text>
      <text x={CHART.width / 2} y={CHART.height - 2} textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">
        decision threshold
      </text>
      <text x={x(optimal.threshold)} y={Math.max(14, y(optimal.cost) - 12)} textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857">
        best {optimal.threshold.toFixed(2)}
      </text>
    </svg>
  );
}
