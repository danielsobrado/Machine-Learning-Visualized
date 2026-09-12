import React, { useMemo } from 'react';
import { Activity, Gauge, Sigma } from 'lucide-react';
import { DECISION_SURFACE } from './logisticRegressionConstants.js';
import { decisionSurfacePointToSvg, modelProbability } from './logisticRegressionModel.js';

const LOW_PROBABILITY_RGB = Object.freeze([224, 242, 254]);
const HIGH_PROBABILITY_RGB = Object.freeze([255, 228, 230]);

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

function interpolateChannel(low, high, probability) {
  return Math.round(low + (high - low) * probability);
}

function probabilityFill(probability) {
  const channels = LOW_PROBABILITY_RGB.map((low, index) => (
    interpolateChannel(low, HIGH_PROBABILITY_RGB[index], probability)
  ));
  return `rgb(${channels.join(', ')})`;
}

function probabilitySurface(weightRisk, weightEngagement, bias) {
  const featureSpan = DECISION_SURFACE.featureMax - DECISION_SURFACE.featureMin;
  const featureStep = featureSpan / DECISION_SURFACE.gridSize;
  const svgSpan = DECISION_SURFACE.svgMax - DECISION_SURFACE.svgMin;
  const svgStep = svgSpan / DECISION_SURFACE.gridSize;
  const cells = [];

  for (let riskIndex = 0; riskIndex < DECISION_SURFACE.gridSize; riskIndex += 1) {
    for (let engagementIndex = 0; engagementIndex < DECISION_SURFACE.gridSize; engagementIndex += 1) {
      const riskMin = DECISION_SURFACE.featureMin + riskIndex * featureStep;
      const engagementMin = DECISION_SURFACE.featureMin + engagementIndex * featureStep;
      const riskCenter = riskMin + featureStep / 2;
      const engagementCenter = engagementMin + featureStep / 2;
      const topLeft = decisionSurfacePointToSvg({
        risk: riskMin,
        engagement: engagementMin + featureStep,
      });

      cells.push({
        key: `${riskIndex}-${engagementIndex}`,
        x: topLeft.x,
        y: topLeft.y,
        width: svgStep + 0.5,
        height: svgStep + 0.5,
        probability: modelProbability(riskCenter, engagementCenter, weightRisk, weightEngagement, bias),
      });
    }
  }

  return cells;
}

function visibleProbabilityRange(weightRisk, weightEngagement, bias) {
  const corners = [
    [DECISION_SURFACE.featureMin, DECISION_SURFACE.featureMin],
    [DECISION_SURFACE.featureMin, DECISION_SURFACE.featureMax],
    [DECISION_SURFACE.featureMax, DECISION_SURFACE.featureMin],
    [DECISION_SURFACE.featureMax, DECISION_SURFACE.featureMax],
  ];
  const probabilities = corners.map(([risk, engagement]) => (
    modelProbability(risk, engagement, weightRisk, weightEngagement, bias)
  ));
  return { min: Math.min(...probabilities), max: Math.max(...probabilities) };
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
  const surface = useMemo(
    () => probabilitySurface(weightRisk, weightEngagement, bias),
    [weightRisk, weightEngagement, bias],
  );
  const probabilityRange = useMemo(
    () => visibleProbabilityRange(weightRisk, weightEngagement, bias),
    [weightRisk, weightEngagement, bias],
  );
  const thresholdPosition = `${threshold * 100}%`;
  const boundaryMessage = boundary
    ? `The black line is p(class 1) = ${threshold.toFixed(2)}.`
    : probabilityRange.min >= threshold
      ? `No threshold line is visible: the whole feature window predicts class 1 at threshold ${threshold.toFixed(2)}.`
      : `No threshold line is visible: the whole feature window predicts class 0 at threshold ${threshold.toFixed(2)}.`;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Gauge size={16} /> Probability + decision surface
        </div>
        <svg viewBox="0 0 360 360" role="img" aria-label="Logistic regression probability surface and decision boundary" className="h-auto w-full rounded-lg bg-slate-50">
          <defs>
            <clipPath id="logistic-decision-surface-clip">
              <rect
                x={DECISION_SURFACE.svgMin}
                y={DECISION_SURFACE.svgMin}
                width={DECISION_SURFACE.svgMax - DECISION_SURFACE.svgMin}
                height={DECISION_SURFACE.svgMax - DECISION_SURFACE.svgMin}
                rx="10"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#logistic-decision-surface-clip)">
            {surface.map((cell) => (
              <rect
                key={cell.key}
                x={cell.x}
                y={cell.y}
                width={cell.width}
                height={cell.height}
                fill={probabilityFill(cell.probability)}
              />
            ))}
          </g>
          <rect
            x={DECISION_SURFACE.svgMin}
            y={DECISION_SURFACE.svgMin}
            width={DECISION_SURFACE.svgMax - DECISION_SURFACE.svgMin}
            height={DECISION_SURFACE.svgMax - DECISION_SURFACE.svgMin}
            rx="10"
            fill="none"
            stroke="#cbd5e1"
          />
          {[25, 50, 75].map((value) => {
            const position = decisionSurfacePointToSvg({ risk: value, engagement: value });
            return (
              <g key={value}>
                <line x1={position.x} x2={position.x} y1={DECISION_SURFACE.svgMin} y2={DECISION_SURFACE.svgMax} stroke="#94a3b8" strokeDasharray="4 4" opacity="0.7" />
                <line x1={DECISION_SURFACE.svgMin} x2={DECISION_SURFACE.svgMax} y1={position.y} y2={position.y} stroke="#94a3b8" strokeDasharray="4 4" opacity="0.7" />
              </g>
            );
          })}
          {boundary && (
            <line x1={boundary.x1} y1={boundary.y1} x2={boundary.x2} y2={boundary.y2} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          )}
          {scored.map((point) => {
            const position = decisionSurfacePointToSvg(point);
            const correct = point.y === point.predicted;
            const selectedPoint = point.id === selectedId;
            const selectPoint = () => onSelect(point.id);
            return (
              <g
                key={point.id}
                onClick={selectPoint}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectPoint();
                  }
                }}
                className="cursor-pointer"
                role="button"
                tabIndex="0"
                aria-label={`Point ${point.id}: probability ${point.probability.toFixed(2)}, predicted class ${point.predicted}, actual class ${point.y}`}
              >
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={selectedPoint ? 11 : 8}
                  fill={point.y ? '#e11d48' : '#0284c7'}
                  stroke={correct ? '#ffffff' : '#f59e0b'}
                  strokeWidth={correct ? 3 : 5}
                />
                <text x={position.x} y={position.y + 4} textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff" pointerEvents="none">
                  {point.id}
                </text>
              </g>
            );
          })}
          <text x="180" y="352" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">risk score</text>
          <text x="-180" y="14" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569" transform="rotate(-90)">engagement</text>
        </svg>
        <div className="mt-3 grid gap-3 text-xs font-bold text-slate-600 sm:grid-cols-2">
          <div>
            <div className="h-3 rounded-full bg-gradient-to-r from-sky-100 to-rose-100" />
            <div className="mt-1 flex justify-between"><span>low p(class 1)</span><span>high p(class 1)</span></div>
          </div>
          <p className="leading-5">{boundaryMessage}</p>
        </div>
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
          <div className="relative mt-4 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-cyan-600" style={{ width: `${selected.probability * 100}%` }} />
            <span
              className="absolute top-[-4px] h-5 w-0.5 bg-slate-950"
              style={{ left: thresholdPosition }}
              title={`Decision threshold ${threshold.toFixed(2)}`}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs font-bold text-slate-500">
            <span>p = 0</span>
            <span>threshold {threshold.toFixed(2)}</span>
            <span>p = 1</span>
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
