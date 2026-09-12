import React, { useMemo, useRef, useState } from 'react';
import { LINEAR_REGRESSION_INTERACTIVE_PLOT } from './linearRegressionConstants.js';
import {
  interactivePlotBounds,
  regressionPointFromViewBox,
  regressionPointToViewBox,
} from './linearRegressionGeometry.js';
import { calculateFitMetrics, calculateOLS } from './linearRegressionModel.js';

function equationText(model) {
  if (!model) return null;
  const sign = model.intercept >= 0 ? '+' : '−';
  return `y = ${model.slope.toFixed(2)}x ${sign} ${Math.abs(model.intercept).toFixed(2)}`;
}

export default function InteractivePanel() {
  const [points, setPoints] = useState([]);
  const nextPointId = useRef(1);
  const model = useMemo(() => calculateOLS(points), [points]);
  const fit = useMemo(() => (model ? calculateFitMetrics(points, model) : null), [model, points]);
  const bounds = interactivePlotBounds();
  const { domain, ticks, viewBox } = LINEAR_REGRESSION_INTERACTIVE_PLOT;
  const [xMin, xMax] = domain.x;
  const [yMin, yMax] = domain.y;

  const addPoint = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const svgX = ((event.clientX - rect.left) / rect.width) * viewBox.width;
    const svgY = ((event.clientY - rect.top) / rect.height) * viewBox.height;
    const point = regressionPointFromViewBox(svgX, svgY);
    if (!point) return;

    const id = `point-${nextPointId.current}`;
    nextPointId.current += 1;
    setPoints((current) => [...current, { ...point, id }]);
  };

  const undoPoint = () => setPoints((current) => current.slice(0, -1));
  const clearPoints = () => setPoints([]);

  const fittedLine = model
    ? [
        regressionPointToViewBox({ x: xMin, y: model.slope * xMin + model.intercept }),
        regressionPointToViewBox({ x: xMax, y: model.slope * xMax + model.intercept }),
      ]
    : null;

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Interactive least squares</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Build a dataset and watch the fitted line move</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Tap or click inside the axes to add points. Ordinary least squares updates immediately once there are at least two points with different x values. Add one extreme point and compare how much the line moves.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.65fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-3 md:p-4">
          <svg
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            className="block h-auto w-full select-none touch-none cursor-crosshair"
            onPointerDown={addPoint}
            role="img"
            aria-label="Interactive x-y plot. Tap or click inside the plotting area to add a data point."
          >
            <defs>
              <clipPath id="linear-regression-interactive-clip">
                <rect
                  x={bounds.left}
                  y={bounds.top}
                  width={bounds.right - bounds.left}
                  height={bounds.bottom - bounds.top}
                />
              </clipPath>
            </defs>

            <rect
              x={bounds.left}
              y={bounds.top}
              width={bounds.right - bounds.left}
              height={bounds.bottom - bounds.top}
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {ticks.map((tick) => {
              const vertical = regressionPointToViewBox({ x: tick, y: yMin });
              const horizontal = regressionPointToViewBox({ x: xMin, y: tick });
              return (
                <g key={tick}>
                  <line x1={vertical.x} x2={vertical.x} y1={bounds.top} y2={bounds.bottom} stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1={bounds.left} x2={bounds.right} y1={horizontal.y} y2={horizontal.y} stroke="#e2e8f0" strokeWidth="1.5" />
                  <text x={vertical.x} y={bounds.bottom + 30} textAnchor="middle" fontSize="17" fill="#475569">{tick}</text>
                  <text x={bounds.left - 18} y={horizontal.y + 6} textAnchor="end" fontSize="17" fill="#475569">{tick}</text>
                </g>
              );
            })}

            <text x={(bounds.left + bounds.right) / 2} y={viewBox.height - 14} textAnchor="middle" fontSize="18" fontWeight="700" fill="#334155">x</text>
            <text
              x="22"
              y={(bounds.top + bounds.bottom) / 2}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fill="#334155"
              transform={`rotate(-90 22 ${(bounds.top + bounds.bottom) / 2})`}
            >
              y
            </text>

            <g clipPath="url(#linear-regression-interactive-clip)">
              {fittedLine && (
                <line
                  x1={fittedLine[0].x}
                  y1={fittedLine[0].y}
                  x2={fittedLine[1].x}
                  y2={fittedLine[1].y}
                  stroke="#4f46e5"
                  strokeWidth="5"
                />
              )}
              {points.map((point) => {
                const position = regressionPointToViewBox(point);
                return <circle key={point.id} cx={position.x} cy={position.y} r="8" fill="#dc2626" stroke="#fff" strokeWidth="3" />;
              })}
            </g>
          </svg>
        </section>

        <aside className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">OLS equation</p>
            {model ? (
              <p className="mt-2 font-mono text-xl font-black text-indigo-700">{equationText(model)}</p>
            ) : (
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                {points.length < 2 ? 'Add at least two points.' : 'The x values need to vary; a vertical stack has no unique OLS slope.'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-black uppercase text-slate-500">Points</p>
              <strong className="mt-1 block text-xl text-slate-950">{points.length}</strong>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs font-black uppercase text-slate-500">MSE</p>
              <strong className="mt-1 block text-xl text-slate-950">{fit ? fit.mse.toFixed(2) : '—'}</strong>
            </div>
          </div>

          {fit && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-indigo-950">
              <p className="text-xs font-black uppercase tracking-wide">Fit check</p>
              <p className="mt-2 text-sm leading-6">
                R²: <strong>{fit.r2 === null ? 'undefined for constant y' : fit.r2.toFixed(3)}</strong>. A large R² describes this sample; it does not prove the line is the right model.
              </p>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <button
              type="button"
              onClick={undoPoint}
              disabled={!points.length}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Undo last point
            </button>
            <button
              type="button"
              onClick={clearPoints}
              disabled={!points.length}
              className="rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-sm font-black text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear all
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
