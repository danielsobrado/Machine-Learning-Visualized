import React, { useMemo } from 'react';
import {
  ACTIVATION_CHART_STROKES,
  ACTIVATION_KINDS,
  DERIVATIVE_CHART,
} from './activationComparisonConstants.js';
import { activationState } from './activationComparisonModel.js';

function scaleX(value) {
  const { padding, width, xMin, xMax } = DERIVATIVE_CHART;
  return padding + ((value - xMin) / (xMax - xMin)) * (width - (2 * padding));
}

function scaleY(value) {
  const { padding, height, yMin, yMax } = DERIVATIVE_CHART;
  return height - padding - ((value - yMin) / (yMax - yMin)) * (height - (2 * padding));
}

function derivativePath(kind) {
  const { samples, xMin, xMax } = DERIVATIVE_CHART;
  return Array.from({ length: samples }, (_, index) => {
    const x = xMin + (index / (samples - 1)) * (xMax - xMin);
    const y = activationState(kind, x).derivative;
    return `${index === 0 ? 'M' : 'L'} ${scaleX(x).toFixed(2)} ${scaleY(y).toFixed(2)}`;
  }).join(' ');
}

export default function ActivationDerivativeChart({ input }) {
  const paths = useMemo(
    () => Object.fromEntries(ACTIVATION_KINDS.map(({ id }) => [id, derivativePath(id)])),
    [],
  );
  const markerInput = Math.max(DERIVATIVE_CHART.xMin, Math.min(DERIVATIVE_CHART.xMax, input));
  const markerX = scaleX(markerInput);
  const zeroY = scaleY(0);
  const oneY = scaleY(1);
  const zeroX = scaleX(0);

  return (
    <svg
      viewBox={`0 0 ${DERIVATIVE_CHART.width} ${DERIVATIVE_CHART.height}`}
      className="h-auto w-full"
      role="img"
      aria-labelledby="activation-derivative-chart-title activation-derivative-chart-description"
    >
      <title id="activation-derivative-chart-title">Local derivative by activation function</title>
      <desc id="activation-derivative-chart-description">
        ReLU and Leaky ReLU keep constant positive-side slopes, sigmoid and tanh derivatives shrink toward zero at large input magnitude, and GELU changes smoothly with input.
      </desc>

      <rect width={DERIVATIVE_CHART.width} height={DERIVATIVE_CHART.height} rx="16" fill="#ffffff" />
      <line x1={DERIVATIVE_CHART.padding} x2={DERIVATIVE_CHART.width - DERIVATIVE_CHART.padding} y1={zeroY} y2={zeroY} stroke="#cbd5e1" />
      <line x1={DERIVATIVE_CHART.padding} x2={DERIVATIVE_CHART.width - DERIVATIVE_CHART.padding} y1={oneY} y2={oneY} stroke="#e2e8f0" strokeDasharray="5 5" />
      <line x1={zeroX} x2={zeroX} y1={DERIVATIVE_CHART.padding} y2={DERIVATIVE_CHART.height - DERIVATIVE_CHART.padding} stroke="#cbd5e1" />

      {ACTIVATION_KINDS.map(({ id }) => (
        <path
          key={id}
          d={paths[id]}
          fill="none"
          stroke={ACTIVATION_CHART_STROKES[id]}
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <line
        x1={markerX}
        x2={markerX}
        y1={DERIVATIVE_CHART.padding}
        y2={DERIVATIVE_CHART.height - DERIVATIVE_CHART.padding}
        stroke="#0f172a"
        strokeWidth="2"
        strokeDasharray="6 5"
        vectorEffect="non-scaling-stroke"
      />

      <text x={DERIVATIVE_CHART.padding} y={DERIVATIVE_CHART.height - 10} fontSize="12" fill="#64748b">x = {DERIVATIVE_CHART.xMin}</text>
      <text x={DERIVATIVE_CHART.width - DERIVATIVE_CHART.padding} y={DERIVATIVE_CHART.height - 10} textAnchor="end" fontSize="12" fill="#64748b">x = {DERIVATIVE_CHART.xMax}</text>
      <text x={DERIVATIVE_CHART.padding + 4} y={oneY - 6} fontSize="12" fill="#64748b">derivative = 1</text>
      <text x={markerX + 6} y={DERIVATIVE_CHART.padding + 14} fontSize="12" fill="#0f172a">current x</text>
    </svg>
  );
}
