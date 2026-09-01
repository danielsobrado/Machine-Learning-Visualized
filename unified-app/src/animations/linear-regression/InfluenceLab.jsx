import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Crosshair,
  ShieldCheck,
} from 'lucide-react';
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  INFLUENCE_SCENARIOS,
  LINEAR_REGRESSION_CHART_LIMITS,
} from './linearRegressionConstants.js';
import {
  calculateFitMetrics,
  calculateInfluence,
  influenceThresholds,
} from './linearRegressionModel.js';

function MetricCard({ label, value, detail, warning }) {
  return (
    <div className={`rounded-xl border p-4 ${warning ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}>
      <p className={`text-xs font-black uppercase tracking-wide ${warning ? 'text-rose-700' : 'text-slate-500'}`}>{label}</p>
      <strong className={`mt-1 block text-2xl font-black ${warning ? 'text-rose-950' : 'text-slate-950'}`}>{value}</strong>
      <span className={`text-sm ${warning ? 'text-rose-800' : 'text-slate-600'}`}>{detail}</span>
    </div>
  );
}

export default function InfluenceLab() {
  const [scenarioId, setScenarioId] = useState('verticalOutlier');
  const scenario = INFLUENCE_SCENARIOS[scenarioId];
  const fit = useMemo(() => calculateFitMetrics(scenario.points), [scenario]);
  const influence = useMemo(() => calculateInfluence(scenario.points, fit.model), [scenario, fit]);
  const special = influence.find((point) => point.id === scenario.specialId);
  const thresholds = influenceThresholds(scenario.points.length);
  const ordinaryPoints = scenario.points.filter((point) => point.id !== scenario.specialId);
  const highLeverage = special.leverage > thresholds.leverage;
  const largeResidual = Math.abs(special.standardizedResidual) > thresholds.standardizedResidual;
  const highInfluence = special.cooksDistance > thresholds.cooksDistance;
  const [xMin, xMax] = LINEAR_REGRESSION_CHART_LIMITS.influence.x;
  const [yMin, yMax] = LINEAR_REGRESSION_CHART_LIMITS.influence.y;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700"><Crosshair size={15} /> Influence lab</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Outlier, leverage, and influence are different questions</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          A point can be vertically surprising, unusual in x, or powerful enough to change the fitted model. Those properties overlap, but they are not synonyms.
        </p>

        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {Object.entries(INFLUENCE_SCENARIOS).map(([id, config]) => (
            <button
              key={id}
              type="button"
              onClick={() => setScenarioId(id)}
              className={`rounded-xl border p-3 text-left transition ${
                scenarioId === id
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300'
              }`}
            >
              <span className="block text-sm font-black">{config.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{config.short}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Leverage" value={special.leverage.toFixed(3)} detail={`flag above ${thresholds.leverage.toFixed(3)}`} warning={highLeverage} />
        <MetricCard label="|Std. residual|" value={Math.abs(special.standardizedResidual).toFixed(2)} detail={`flag above ${thresholds.standardizedResidual.toFixed(1)}`} warning={largeResidual} />
        <MetricCard label="Cook's D" value={special.cooksDistance.toFixed(2)} detail={`rough flag above ${thresholds.cooksDistance.toFixed(2)}`} warning={highInfluence} />
        <MetricCard label="Slope shift" value={Math.abs(special.slopeShift).toFixed(3)} detail="full fit vs leave-one-out fit" warning={Math.abs(special.slopeShift) > 0.25} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">What happens to the fitted line?</h3>
            <div className="mt-3 h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" type="number" domain={[xMin, xMax]} />
                  <YAxis dataKey="y" type="number" domain={[yMin, yMax]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <ReferenceLine
                    segment={[
                      { x: xMin, y: fit.model.intercept + fit.model.slope * xMin },
                      { x: xMax, y: fit.model.intercept + fit.model.slope * xMax },
                    ]}
                    stroke="#dc2626"
                    strokeWidth={3}
                  />
                  <ReferenceLine
                    segment={[
                      { x: xMin, y: special.leaveOneOutModel.intercept + special.leaveOneOutModel.slope * xMin },
                      { x: xMax, y: special.leaveOneOutModel.intercept + special.leaveOneOutModel.slope * xMax },
                    ]}
                    stroke="#0891b2"
                    strokeWidth={3}
                    strokeDasharray="7 6"
                  />
                  <Scatter data={ordinaryPoints} fill="#0f172a" />
                  <Scatter data={[scenario.points.find((point) => point.id === scenario.specialId)]} fill="#f97316" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-600">
              <span><span className="mr-2 inline-block h-0.5 w-5 bg-red-600 align-middle" />fit with special point</span>
              <span><span className="mr-2 inline-block h-0.5 w-5 border-t-2 border-dashed border-cyan-600 align-middle" />fit without special point</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`rounded-xl border p-4 ${highLeverage ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <p className="text-xs font-black uppercase tracking-wide">Leverage asks</p>
              <strong className="mt-2 block text-sm">Is x unusual enough to give this point geometric power?</strong>
            </div>
            <div className={`rounded-xl border p-4 ${largeResidual ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <p className="text-xs font-black uppercase tracking-wide">Residual asks</p>
              <strong className="mt-2 block text-sm">Is y surprising relative to the fitted line?</strong>
            </div>
            <div className={`rounded-xl border p-4 ${highInfluence ? 'border-rose-200 bg-rose-50 text-rose-950' : 'border-emerald-200 bg-emerald-50 text-emerald-950'}`}>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">{highInfluence ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />} Influence asks</p>
              <strong className="mt-2 block text-sm">Does the fitted model materially change when this point is removed?</strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Slope comparison</p>
              <p className="mt-2 font-mono text-sm font-bold text-slate-800">with point: {fit.model.slope.toFixed(3)}</p>
              <p className="mt-1 font-mono text-sm font-bold text-slate-800">without: {special.leaveOneOutModel.slope.toFixed(3)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-violet-950">
        <p className="text-xs font-black uppercase tracking-wide">Practical rule</p>
        <p className="mt-2 text-sm leading-6">
          Never delete a point merely because a diagnostic flag is large. First check data quality, whether the case belongs to the deployment population, and how conclusions change with and without it.
        </p>
      </div>
    </div>
  );
}
