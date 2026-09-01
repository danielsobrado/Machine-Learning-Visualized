import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ScanSearch,
  Waves,
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
  LINEAR_REGRESSION_CHART_LIMITS,
  RESIDUAL_SCENARIOS,
} from './linearRegressionConstants.js';
import { diagnoseResidualPattern } from './linearRegressionModel.js';

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function DiagnosticBanner({ diagnosis }) {
  const config = {
    'well-behaved': {
      icon: CheckCircle2,
      title: 'No obvious residual failure in this toy sample',
      detail: 'The residual cloud is roughly centered and its spread stays reasonably stable. That supports the linear form, but it does not prove every regression assumption.',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    },
    heteroscedastic: {
      icon: Waves,
      title: 'Residual variance changes with the prediction level',
      detail: 'The mean line can still be useful, but constant-variance standard errors and prediction intervals are suspect. Consider robust standard errors, a justified transformation, or a variance-aware model.',
      className: 'border-amber-200 bg-amber-50 text-amber-950',
    },
    nonlinear: {
      icon: AlertTriangle,
      title: 'The residuals contain systematic curvature',
      detail: 'This is not random scatter around a correct mean function. Revisit features or functional form before celebrating a high R².',
      className: 'border-rose-200 bg-rose-50 text-rose-950',
    },
  }[diagnosis.status];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.className}`}>
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide"><Icon size={15} /> Residual diagnosis</p>
      <strong className="mt-2 block text-base">{config.title}</strong>
      <p className="mt-1 text-sm leading-6">{config.detail}</p>
    </div>
  );
}

export default function DiagnosticsPanel() {
  const [scenarioId, setScenarioId] = useState('heteroscedastic');
  const scenario = RESIDUAL_SCENARIOS[scenarioId];
  const diagnosis = useMemo(() => diagnoseResidualPattern(scenario.points), [scenario]);
  const [xMin, xMax] = LINEAR_REGRESSION_CHART_LIMITS.diagnostics.x;
  const [yMin, yMax] = LINEAR_REGRESSION_CHART_LIMITS.diagnostics.y;
  const maxSpread = Math.max(...diagnosis.spreadBins.map((bin) => bin.rmse), 1e-12);
  const r2Warning = diagnosis.r2 > 0.9 && diagnosis.status !== 'well-behaved';

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700"><ScanSearch size={15} /> Residual diagnostics</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">A small MSE does not make the model healthy</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Fit the least-squares line, then inspect what remains. Random-looking residuals support the linear mean function; funnels and curves are evidence the model is missing structure.
        </p>

        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {Object.entries(RESIDUAL_SCENARIOS).map(([id, config]) => (
            <button
              key={id}
              type="button"
              onClick={() => setScenarioId(id)}
              className={`rounded-xl border p-3 text-left transition ${
                scenarioId === id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300'
              }`}
            >
              <span className="block text-sm font-black">{config.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{config.short}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{scenario.detail}</p>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="R²" value={diagnosis.r2.toFixed(3)} detail="variance explained by this line" />
        <MetricCard label="RMSE" value={diagnosis.rmse.toFixed(2)} detail="typical residual scale" />
        <MetricCard label="Spread ratio" value={`${diagnosis.spreadRatio.toFixed(1)}×`} detail="widest vs narrowest x-bin" />
        <MetricCard label="Curvature signal" value={Math.abs(diagnosis.curvatureCorrelation).toFixed(2)} detail="|corr(residual, centered x²)|" />
      </div>

      <DiagnosticBanner diagnosis={diagnosis} />

      {r2Warning && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-violet-950">
          <p className="text-xs font-black uppercase tracking-wide">R² trap</p>
          <p className="mt-2 text-sm leading-6">
            R² is still <strong>{diagnosis.r2.toFixed(3)}</strong>. A strong aggregate fit score does not erase a structured residual failure.
          </p>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Observed data + OLS line</h3>
          <div className="mt-3 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={[xMin, xMax]} name="x" />
                <YAxis dataKey="y" type="number" domain={[yMin, yMax]} name="y" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <ReferenceLine
                  segment={[
                    { x: xMin, y: diagnosis.model.intercept + diagnosis.model.slope * xMin },
                    { x: xMax, y: diagnosis.model.intercept + diagnosis.model.slope * xMax },
                  ]}
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
                <Scatter data={scenario.points} fill="#0f172a" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Residuals vs fitted value</h3>
          <div className="mt-3 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="predictedY" type="number" name="fitted value" />
                <YAxis dataKey="error" type="number" name="residual" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="6 6" />
                <Scatter data={diagnosis.residuals} fill="#dc2626" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Residual spread by x region</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {diagnosis.spreadBins.map((bin) => (
            <div key={bin.index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm text-slate-950">x {bin.minX}–{bin.maxX}</strong>
                <span className="font-mono text-xs font-black text-slate-500">RMSE {bin.rmse.toFixed(2)}</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(bin.rmse / maxSpread) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500">Mean |residual| {bin.meanAbsoluteResidual.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
