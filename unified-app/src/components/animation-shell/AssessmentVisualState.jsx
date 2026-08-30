import React from 'react';
import './AssessmentVisualState.css';

const PERCENT_MAX = 100;
const SVG_WIDTH = 320;
const SVG_HEIGHT = 120;

function formatLabel(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return String(value);
}

function MetricBar({ label, value, max }) {
  const width = max > 0 ? Math.max(4, Math.min(PERCENT_MAX, (value / max) * PERCENT_MAX)) : 4;

  return (
    <div className="ua-visual-metric">
      <div className="ua-visual-metric-head">
        <span>{label}</span>
        <strong>{formatValue(value)}</strong>
      </div>
      <div className="ua-visual-meter" aria-hidden="true">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function NormalPreview({ state }) {
  const { mean, standardDeviation, marker } = state;
  const domainMin = mean - (3 * standardDeviation);
  const domainMax = mean + (3 * standardDeviation);
  const markerRatio = (marker - domainMin) / (domainMax - domainMin);
  const markerX = Math.max(12, Math.min(SVG_WIDTH - 12, markerRatio * SVG_WIDTH));

  return (
    <div className="ua-visual-plot" aria-label={`Normal distribution centered at ${mean}, standard deviation ${standardDeviation}, marker ${marker}`}>
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} role="img">
        <path
          className="ua-visual-curve"
          d="M8 108 C54 108 72 82 100 50 C128 18 160 12 188 50 C216 82 234 108 312 108"
        />
        <line className="ua-visual-axis" x1="8" y1="108" x2="312" y2="108" />
        <line className="ua-visual-marker" x1={markerX} y1="12" x2={markerX} y2="108" />
      </svg>
      <div className="ua-visual-caption-grid">
        <span>μ {formatValue(mean)}</span>
        <span>σ {formatValue(standardDeviation)}</span>
        <span>x {formatValue(marker)}</span>
      </div>
    </div>
  );
}

function ResidualPreview() {
  const points = [
    [22, 30], [48, 48], [76, 68], [104, 82], [132, 90],
    [160, 92], [188, 88], [216, 78], [244, 62], [272, 44], [298, 28],
  ];

  return (
    <div className="ua-visual-plot" aria-label="Residual plot with a U-shaped pattern">
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} role="img">
        <line className="ua-visual-axis" x1="8" y1="60" x2="312" y2="60" />
        {points.map(([x, y]) => <circle className="ua-visual-point" key={`${x}-${y}`} cx={x} cy={y} r="4" />)}
      </svg>
      <div className="ua-visual-caption-grid">
        <span>Residuals</span>
        <strong>U-shaped pattern</strong>
      </div>
    </div>
  );
}

function MetricPreview({ state, keys }) {
  const numericValues = keys.map((key) => Number(state[key])).filter(Number.isFinite);
  const max = Math.max(...numericValues, 1);

  return (
    <div className="ua-visual-metrics">
      {keys.map((key) => (
        <MetricBar key={key} label={formatLabel(key)} value={Number(state[key])} max={max} />
      ))}
    </div>
  );
}

function RatioPreview({ state }) {
  const total = Number(state.retrievedChunks) || 0;
  const relevant = Number(state.relevantChunks) || 0;
  const relevantWidth = total > 0 ? (relevant / total) * PERCENT_MAX : 0;

  return (
    <div className="ua-visual-ratio">
      <div className="ua-visual-ratio-track" aria-label={`${relevant} relevant chunks out of ${total} retrieved`}>
        <span style={{ width: `${relevantWidth}%` }} />
      </div>
      <div className="ua-visual-caption-grid">
        <span>{relevant} relevant</span>
        <span>{total} retrieved</span>
        <span>{formatValue(state.answerQuality)}</span>
      </div>
    </div>
  );
}

function ComparisonPreview({ state }) {
  return (
    <div className="ua-visual-comparison">
      {Object.entries(state).map(([key, value]) => (
        <div key={key}>
          <span>{formatLabel(key)}</span>
          <strong>{formatValue(value)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function AssessmentVisualState({ state }) {
  if (!state || typeof state !== 'object') return null;

  if (state.family === 'Normal') return <NormalPreview state={state} />;
  if (state.residualPattern === 'U-shaped') return <ResidualPreview />;
  if ('threshold' in state && 'precision' in state && 'recall' in state) {
    return <MetricPreview state={state} keys={['threshold', 'precision', 'recall']} />;
  }
  if ('horizon1MAE' in state && 'horizon7MAE' in state) {
    return <MetricPreview state={state} keys={['horizon1MAE', 'overallMAE', 'horizon7MAE']} />;
  }
  if ('retrievedChunks' in state && 'relevantChunks' in state) return <RatioPreview state={state} />;
  if ('sampleMean' in state && 'sampleVariance' in state) {
    return <MetricPreview state={state} keys={['sampleMean', 'sampleVariance']} />;
  }

  return <ComparisonPreview state={state} />;
}
