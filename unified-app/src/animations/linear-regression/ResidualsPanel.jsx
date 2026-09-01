import React, { useMemo, useState } from 'react';
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
  LINEAR_REGRESSION_DEMO_DATA,
  calculateFitMetrics,
  calculateOLS,
} from './linearRegressionModel.js';

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function ResidualsPanel() {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const model = useMemo(() => ({ slope, intercept }), [slope, intercept]);
  const fit = useMemo(() => calculateFitMetrics(LINEAR_REGRESSION_DEMO_DATA, model), [model]);
  const optimum = useMemo(() => calculateOLS(LINEAR_REGRESSION_DEMO_DATA), []);
  const optimumFit = useMemo(() => calculateFitMetrics(LINEAR_REGRESSION_DEMO_DATA, optimum), [optimum]);

  const applyOls = () => {
    setSlope(optimum.slope);
    setIntercept(optimum.intercept);
  };

  const reset = () => {
    setSlope(1);
    setIntercept(0);
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Least-squares objective</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Residuals are what the line failed to explain</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Move the line and watch every vertical residual change. Ordinary least squares chooses the slope and intercept that minimize the sum of squared residuals on this dataset.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="MSE" value={fit.mse.toFixed(3)} detail={`OLS minimum ${optimumFit.mse.toFixed(3)}`} />
        <MetricCard label="RMSE" value={fit.rmse.toFixed(3)} detail="same unit as y" />
        <MetricCard label="R²" value={fit.r2.toFixed(3)} detail="can be negative for a poor manual line" />
        <MetricCard label="OLS solution" value={`m ${optimum.slope.toFixed(2)}`} detail={`b ${optimum.intercept.toFixed(2)}`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.7fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="h-[440px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 14, right: 20, bottom: 12, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={[0, 6]} />
                <YAxis dataKey="y" type="number" domain={[0, 8]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <ReferenceLine
                  segment={[{ x: 0, y: intercept }, { x: 6, y: slope * 6 + intercept }]}
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
                {fit.residuals.map((point) => (
                  <ReferenceLine
                    key={point.x}
                    segment={[{ x: point.x, y: point.y }, { x: point.x, y: point.predictedY }]}
                    stroke="#dc2626"
                    strokeDasharray="4 4"
                  />
                ))}
                <Scatter data={LINEAR_REGRESSION_DEMO_DATA} fill="#0f172a" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Slope: {slope.toFixed(2)}
            <input min="-2" max="4" step="0.05" type="range" value={slope} onChange={(event) => setSlope(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Intercept: {intercept.toFixed(2)}
            <input min="-2" max="8" step="0.05" type="range" value={intercept} onChange={(event) => setIntercept(Number(event.target.value))} />
          </label>
          <button type="button" onClick={applyOls} className="rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-black text-white">
            Jump to OLS minimum
          </button>
          <button type="button" onClick={reset} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700">
            Reset challenge
          </button>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <p className="text-xs font-black uppercase tracking-wide">Do not stop at the minimum</p>
            <p className="mt-2 text-sm leading-6">
              OLS guarantees the smallest squared training residuals among lines. It does not guarantee linearity, constant variance, reliable uncertainty, or resistance to influential points.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
