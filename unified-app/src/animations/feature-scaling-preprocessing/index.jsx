import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Scale, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  DECISION_QUERY,
  METHODS,
  OUTLIER,
  bounds,
  buildPoints,
  distanceBreakdown,
  fitScaler,
  nearestTrainingNeighbor,
  outlierImpact,
  projectIsotropic,
  scaleMagnitude,
  transformPoint,
} from './featureScalingPreprocessingModel';

const METHOD_PARAMETER_KEYS = Object.freeze({
  raw: [],
  standard: ['mean', 'std'],
  minmax: ['min', 'max'],
  robust: ['median', 'iqr'],
});

const METHOD_SCALE_LABELS = Object.freeze({
  standard: 'standard deviation',
  minmax: 'fitted range',
  robust: 'IQR',
});

const OUTLIER_COMPARISON_METHODS = Object.freeze(['standard', 'minmax', 'robust']);

const PARAMETER_COLUMNS = Object.freeze([
  ['mean', 'Mean'],
  ['std', 'Std'],
  ['min', 'Min'],
  ['max', 'Max'],
  ['median', 'Median'],
  ['iqr', 'IQR'],
]);

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function ContributionBar({ label, value }) {
  const percent = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-cyan-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function NeighborRanking({ title, decision, method }) {
  const visible = decision.ranking.slice(0, 4);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
          <strong className="mt-1 block text-lg font-black text-slate-950">
            Nearest: {decision.nearest.id} · {decision.nearest.label}
          </strong>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">
          {METHODS[method].label}
        </span>
      </div>
      <ol className="mt-4 space-y-2">
        {visible.map((neighbor, index) => (
          <li
            key={neighbor.id}
            className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm ${
              index === 0
                ? 'border-cyan-300 bg-cyan-50 text-cyan-950'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <span className="font-black">#{index + 1} {neighbor.id}</span>
            <span className="font-mono text-xs">{formatDistance(neighbor.distance, method)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function formatFeatureStat(feature, value) {
  if (feature === 'income') return `$${Math.round(value / 1000)}k`;
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function formatDistance(value, method) {
  return method === 'raw' ? value.toFixed(0) : value.toFixed(2);
}

function formatSignedPercent(ratio) {
  const percent = (ratio - 1) * 100;
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(0)}%`;
}

function axisLabels(method) {
  if (method === 'raw') return { x: 'age (years)', y: 'income ($)' };
  return { x: `${METHODS[method].label.toLowerCase()} age`, y: `${METHODS[method].label.toLowerCase()} income` };
}

export default function FeatureScalingPreprocessingAnimation() {
  const [method, setMethod] = useState('standard');
  const [includeOutlier, setIncludeOutlier] = useState(true);
  const [outlierSplit, setOutlierSplit] = useState('train');
  const [fitOnAllData, setFitOnAllData] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState('F');

  const points = useMemo(
    () => buildPoints(includeOutlier, outlierSplit),
    [includeOutlier, outlierSplit],
  );

  useEffect(() => {
    if (!points.some((point) => point.id === selectedPoint)) {
      setSelectedPoint('F');
    }
  }, [points, selectedPoint]);

  const usesFittedScaler = method !== 'raw';
  const effectiveFitOnAllData = usesFittedScaler && fitOnAllData;
  const scaler = useMemo(
    () => fitScaler(points, effectiveFitOnAllData),
    [points, effectiveFitOnAllData],
  );
  const baselineScaler = useMemo(
    () => fitScaler(buildPoints(false), effectiveFitOnAllData),
    [effectiveFitOnAllData],
  );
  const transformed = useMemo(
    () => points.map((point) => transformPoint(point, scaler, method)),
    [points, scaler, method],
  );
  const rawPoints = useMemo(
    () => points.map((point) => ({ ...point, x: point.age, y: point.income })),
    [points],
  );
  const rawDecision = useMemo(
    () => nearestTrainingNeighbor(points, scaler, 'raw'),
    [points, scaler],
  );
  const currentDecision = useMemo(
    () => nearestTrainingNeighbor(points, scaler, method),
    [points, scaler, method],
  );
  const outlierComparisons = useMemo(
    () => OUTLIER_COMPARISON_METHODS.map((id) => outlierImpact(id)),
    [],
  );
  const robustComparison = outlierComparisons.find((comparison) => comparison.method === 'robust');

  const selected = transformed.find((point) => point.id === selectedPoint) || transformed[0];
  const anchor = transformed.find((point) => point.id === 'B');
  const rawSelected = rawPoints.find((point) => point.id === selected.id);
  const rawAnchor = rawPoints.find((point) => point.id === 'B');
  const currentDistance = distanceBreakdown(selected, anchor);
  const rawDistance = distanceBreakdown(rawSelected, rawAnchor);
  const plotBox = bounds(transformed);
  const projectedPoints = transformed.map((point) => ({
    ...point,
    ...projectIsotropic(point, plotBox),
  }));
  const projectedSelected = projectedPoints.find((point) => point.id === selected.id);
  const projectedAnchor = projectedPoints.find((point) => point.id === 'B');
  const labels = axisLabels(method);
  const fitPoints = effectiveFitOnAllData ? points : points.filter((point) => point.split === 'train');
  const activeParameters = new Set(METHOD_PARAMETER_KEYS[method]);

  const currentScale = scaleMagnitude(scaler.income, method);
  const baselineScale = scaleMagnitude(baselineScaler.income, method);
  const outlierScaleChange = includeOutlier && currentScale !== null && baselineScale
    ? ((currentScale - baselineScale) / baselineScale) * 100
    : null;
  const outlierScaleValue = outlierScaleChange === null
    ? '—'
    : `${outlierScaleChange >= 0 ? '+' : ''}${outlierScaleChange.toFixed(0)}%`;

  const decisionChanged = rawDecision.nearest.id !== currentDecision.nearest.id;

  const reset = () => {
    setMethod('standard');
    setIncludeOutlier(true);
    setOutlierSplit('train');
    setFitOnAllData(false);
    setSelectedPoint('F');
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Data preparation</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Feature Scaling and Preprocessing</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Preprocessing is learned model state. Fit it on training rows, reuse those parameters on held-out rows,
              and inspect how feature units and training outliers change the geometry seen by a model.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Preprocessing controls
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Representation</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.entries(METHODS).map(([id, config]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`rounded-lg border px-3 py-2 text-sm font-black transition ${method === id ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Compare with B
            <select
              value={selectedPoint}
              onChange={(event) => setSelectedPoint(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              {points.filter((point) => point.id !== 'B').map((point) => (
                <option key={point.id} value={point.id}>{point.id}: {point.label}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <label className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
              Include outlier
              <input
                type="checkbox"
                checked={includeOutlier}
                onChange={(event) => setIncludeOutlier(event.target.checked)}
              />
            </label>
            <select
              value={outlierSplit}
              disabled={!includeOutlier}
              onChange={(event) => setOutlierSplit(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
              aria-label="Outlier split"
            >
              <option value="train">Outlier in training</option>
              <option value="validation">Outlier in validation</option>
            </select>
          </div>

          <label className={`flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold ${usesFittedScaler ? 'bg-slate-50 text-slate-700' : 'bg-slate-100 text-slate-400'}`}>
            Fit on all data
            <input
              type="checkbox"
              checked={fitOnAllData}
              disabled={!usesFittedScaler}
              onChange={(event) => setFitOnAllData(event.target.checked)}
            />
          </label>
        </div>

        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <strong className="text-slate-950">{METHODS[method].label}:</strong> {METHODS[method].detail}
          {' '}Formula: <span className="font-mono">{METHODS[method].formula}</span>.
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Put the outlier in training to compare scaler robustness. Put it in validation to verify that a safe fitted
          transform does not move when held-out data changes.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Raw distance"
          value={rawDistance.distance.toFixed(0)}
          detail={`B to ${selected.id}, mixing years and dollars`}
        />
        <Stat
          label="Current distance"
          value={formatDistance(currentDistance.distance, method)}
          detail={`${METHODS[method].label} representation`}
        />
        <Stat
          label="Income contribution"
          value={`${Math.round(currentDistance.yShare * 100)}%`}
          detail="share of squared Euclidean distance"
        />
        <Stat
          label="Outlier scale change"
          value={outlierScaleValue}
          detail={usesFittedScaler
            ? `${METHOD_SCALE_LABELS[method]} versus the same fit without G`
            : 'raw mode has no fitted scale'}
        />
      </div>

      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Downstream decision experiment</p>
            <h3 className="mt-1 text-lg font-black text-cyan-950">Scaling can change who 1-NN considers most similar</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-cyan-900">
              Query Q is age {DECISION_QUERY.age} with income ${Math.round(DECISION_QUERY.income / 1000)}k.
              A one-nearest-neighbor model inherits the label of the closest training row, so changed geometry can become a changed prediction.
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-black ${
            decisionChanged ? 'bg-rose-100 text-rose-800' : 'bg-white text-cyan-800'
          }`}>
            {decisionChanged ? 'Decision changed' : 'Same nearest row'}
          </span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <NeighborRanking title="Original units" decision={rawDecision} method="raw" />
          <NeighborRanking title="Active representation" decision={currentDecision} method={method} />
        </div>
        <p className="mt-4 text-sm leading-6 text-cyan-950">
          {decisionChanged
            ? `Raw units choose ${rawDecision.nearest.id}, while ${METHODS[method].label.toLowerCase()} units choose ${currentDecision.nearest.id}. The model did not change; only the feature representation did.`
            : `Both views currently choose ${currentDecision.nearest.id}, but the distances and feature contributions can still change. Scaling matters when those geometric changes cross a model decision boundary.`}
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Scale size={16} />
            Metric-faithful feature space
          </h3>
          <svg
            viewBox="0 0 360 260"
            className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50"
            role="img"
            aria-label={`${METHODS[method].label} feature scatter plot`}
          >
            <line x1="34" y1="226" x2="330" y2="226" stroke="#cbd5e1" />
            <line x1="34" y1="34" x2="34" y2="226" stroke="#cbd5e1" />
            {projectedSelected && projectedAnchor && (
              <line
                x1={projectedAnchor.cx}
                y1={projectedAnchor.cy}
                x2={projectedSelected.cx}
                y2={projectedSelected.cy}
                stroke="#0891b2"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            )}
            {projectedPoints.map((point) => {
              const isSelected = point.id === selected.id || point.id === 'B';
              return (
                <g key={point.id}>
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r={isSelected ? 10 : 7}
                    fill={point.split === 'train' ? '#2563eb' : '#f97316'}
                    stroke={point.id === OUTLIER.id ? '#be123c' : '#ffffff'}
                    strokeWidth="3"
                  />
                  <text x={point.cx + 12} y={point.cy + 4} className="fill-slate-700 text-xs font-black">{point.id}</text>
                </g>
              );
            })}
            <text x="175" y="250" textAnchor="middle" className="fill-slate-600 text-xs font-bold">{labels.x}</text>
            <text x="14" y="140" textAnchor="middle" transform="rotate(-90 14 140)" className="fill-slate-600 text-xs font-bold">{labels.y}</text>
          </svg>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            One numeric unit gets the same pixel length on both axes. In raw mode, dollar differences therefore make
            the age dimension almost collapse; scaling changes the actual distance geometry instead of merely redrawing the axes.
          </p>

          <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">B → {selected.id} squared-distance contribution</p>
            <ContributionBar label="Age" value={currentDistance.xShare} />
            <ContributionBar label="Income" value={currentDistance.yShare} />
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-600" /> Train</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-500" /> Validation</span>
            <span>G has a rose outline</span>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Fitted parameters</h3>
              <p className="mt-1 text-xs text-slate-500">
                Fit rows: {fitPoints.map((point) => point.id).join(', ')}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {fitPoints.length} rows
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2">Feature</th>
                  {PARAMETER_COLUMNS.map(([key, label]) => (
                    <th key={key} className={`py-2 ${activeParameters.has(key) ? 'text-cyan-700' : ''}`}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(scaler).map(([feature, values]) => (
                  <tr key={feature}>
                    <td className="py-3 font-black text-slate-950">{feature}</td>
                    {PARAMETER_COLUMNS.map(([key]) => (
                      <td
                        key={key}
                        className={`py-3 ${activeParameters.has(key) ? 'bg-cyan-50 font-black text-cyan-950' : ''}`}
                      >
                        {formatFeatureStat(feature, values[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Highlighted cells are the parameters actually used by {METHODS[method].label.toLowerCase()} scaling.
          </p>

          {!usesFittedScaler ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-800">
              <strong className="text-sm">No fitted transform</strong>
              <p className="mt-2 text-sm leading-6">
                Raw mode uses the original values directly, so fitting scope does not change this representation.
              </p>
            </div>
          ) : effectiveFitOnAllData ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-950">
              <strong className="text-sm">Leakage warning</strong>
              <p className="mt-2 text-sm leading-6">
                Validation rows are shaping preprocessing parameters. Evaluation is no longer isolated from fitted state.
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
              <strong className="text-sm">Leakage-safe fit</strong>
              <p className="mt-2 text-sm leading-6">
                Only training rows fit the transform. Validation rows reuse those parameters even when their values are extreme.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-violet-200 bg-violet-50 p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Controlled outlier experiment</p>
        <h3 className="mt-1 text-lg font-black text-violet-950">Robust scaling protects ordinary geometry; it does not remove G</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-violet-900">
          G is added to training in every row below. “Ordinary span retained” measures how much of the original A–D
          income separation survives after G changes the fitted scale. Higher retention means the ordinary points are squeezed less.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-violet-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-violet-100 text-xs font-black uppercase tracking-wide text-violet-700">
              <tr>
                <th className="px-3 py-2">Scaler</th>
                <th className="px-3 py-2">Scale inflation</th>
                <th className="px-3 py-2">Ordinary span retained</th>
                <th className="px-3 py-2">G transformed income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100">
              {outlierComparisons.map((comparison) => (
                <tr key={comparison.method}>
                  <td className="px-3 py-3 font-black text-violet-950">{METHODS[comparison.method].label}</td>
                  <td className="px-3 py-3 font-mono">{formatSignedPercent(comparison.scaleChangeRatio)}</td>
                  <td className="px-3 py-3 font-mono">{Math.round(comparison.coreSpanRetention * 100)}%</td>
                  <td className="px-3 py-3 font-mono">{comparison.outlierTransformed.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 rounded-lg border border-violet-200 bg-white p-4 text-sm leading-6 text-violet-950">
          Here robust scaling retains <strong>{Math.round(robustComparison.coreSpanRetention * 100)}%</strong> of the ordinary A–D income span,
          yet G still sits <strong>{robustComparison.outlierTransformed.toFixed(2)} IQR units</strong> above the fitted median.
          Robust scaling changes which statistics define the coordinate system; clipping, winsorizing, removing, or separately modeling an outlier are different decisions.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">Geometry</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            Distance-, kernel-, gradient-, and coefficient-penalty methods can react strongly to numeric scale. Trees are
            usually much less sensitive to simple monotonic rescaling.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Boundary</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            Scalers, imputers, encoders, PCA, and feature selection are fitted state. Fit them inside the training split or
            each cross-validation fold, never on held-out data first.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Experiment</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Put G in training and compare min-max, standard, and robust scale change. Then move G to validation: with a
            safe fit, the fitted parameters should stop moving entirely.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="feature-scaling-preprocessing" title="Feature Scaling and Preprocessing check" />
    </div>
  );
}
