import React, { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, ShieldCheck } from 'lucide-react';
import {
  STABILITY_CHART,
  STABILITY_LAB,
  STABILITY_PRESETS,
} from './gradientDescentConstants';
import {
  convergenceFactor,
  learningRateStatus,
  simulateQuadraticDescent,
  updateMultiplier,
} from './gradientDescentModel';

function chartPoints(history) {
  const chart = STABILITY_CHART;
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const maxAbsWeight = Math.max(1, ...history.map((item) => Math.abs(item.weight)));

  return history.map((item, index) => ({
    ...item,
    x: chart.left + (index / Math.max(1, history.length - 1)) * plotWidth,
    y: chart.top + plotHeight / 2 - (item.weight / maxAbsWeight) * (plotHeight * 0.44),
  }));
}

function pathFor(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
}

function formatNumber(value) {
  if (Math.abs(value) >= 1000) return value.toExponential(2);
  return value.toFixed(3);
}

export default function GradientDescentStabilityLab() {
  const [learningRate, setLearningRate] = useState(STABILITY_LAB.defaultLearningRate);
  const history = useMemo(() => simulateQuadraticDescent({ learningRate }), [learningRate]);
  const points = useMemo(() => chartPoints(history), [history]);
  const status = learningRateStatus(learningRate);
  const multiplier = updateMultiplier(learningRate);
  const factor = convergenceFactor(learningRate);
  const final = history[history.length - 1];
  const zeroY = STABILITY_CHART.top + (STABILITY_CHART.height - STABILITY_CHART.top - STABILITY_CHART.bottom) / 2;

  return (
    <div className="space-y-5 p-4">
      <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · learning-rate stability</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">A step can point downhill and still be too large to converge</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              For L(w)=w², gradient descent follows wₜ₊₁=(1−2α)wₜ. Convergence requires |1−2α|&lt;1, so this specific
              quadratic converges only for 0&lt;α&lt;1. The sign controls whether the path crosses the minimum; the magnitude
              controls whether those crossings shrink or explode.
            </p>
          </div>
          <Gauge size={30} className="text-amber-700" />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-bold text-slate-700">
          Learning rate α: {learningRate.toFixed(2)}
          <input
            className="mt-3 w-full"
            type="range"
            min={STABILITY_LAB.minLearningRate}
            max={STABILITY_LAB.maxLearningRate}
            step={STABILITY_LAB.learningRateStep}
            value={learningRate}
            onChange={(event) => setLearningRate(Number(event.target.value))}
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {STABILITY_PRESETS.map((preset) => (
            <button
              key={preset.learningRate}
              type="button"
              onClick={() => setLearningRate(preset.learningRate)}
              aria-pressed={learningRate === preset.learningRate}
              className={`rounded-lg border px-3 py-2 text-xs font-black transition ${
                learningRate === preset.learningRate
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              α={preset.learningRate.toFixed(2)} · {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Regime</p>
          <strong className={`mt-1 block text-lg font-black ${status.color}`}>{status.text}</strong>
          <p className="mt-1 text-sm text-slate-600">Exact behavior on L(w)=w².</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Update multiplier</p>
          <strong className="mt-1 block text-2xl font-black text-slate-950">{multiplier.toFixed(2)}</strong>
          <p className="mt-1 text-sm text-slate-600">wₜ₊₁ / wₜ = 1−2α</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Magnitude per step</p>
          <strong className="mt-1 block text-2xl font-black text-slate-950">×{factor.toFixed(2)}</strong>
          <p className="mt-1 text-sm text-slate-600">Below 1 shrinks; above 1 grows.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">After {STABILITY_LAB.steps} steps</p>
          <strong className="mt-1 block text-2xl font-black text-slate-950">w={formatNumber(final.weight)}</strong>
          <p className="mt-1 text-sm text-slate-600">loss {formatNumber(final.loss)}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Weight trajectory around the minimum</h3>
          <svg
            viewBox={`0 0 ${STABILITY_CHART.width} ${STABILITY_CHART.height}`}
            className="mt-4 h-auto w-full"
            role="img"
            aria-label={`Gradient descent weight trajectory for learning rate ${learningRate.toFixed(2)}`}
          >
            <line
              x1={STABILITY_CHART.left}
              x2={STABILITY_CHART.width - STABILITY_CHART.right}
              y1={zeroY}
              y2={zeroY}
              stroke="#94a3b8"
              strokeDasharray="6 5"
            />
            <text x={STABILITY_CHART.left - 8} y={zeroY + 4} textAnchor="end" className="fill-slate-500 text-xs">w=0</text>
            <path d={pathFor(points)} fill="none" stroke="#2563eb" strokeWidth="4" />
            {points.map((point) => (
              <g key={point.iteration}>
                <circle cx={point.x} cy={point.y} r="5" fill="#2563eb" />
                <text x={point.x} y={STABILITY_CHART.height - 14} textAnchor="middle" className="fill-slate-500 text-xs">
                  {point.iteration}
                </text>
              </g>
            ))}
            <text
              x={STABILITY_CHART.width / 2}
              y={STABILITY_CHART.height - 1}
              textAnchor="middle"
              className="fill-slate-600 text-xs font-bold"
            >
              iteration
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-rose-900">
              <AlertTriangle size={16} />
              The trap
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-950">
              “Oscillation” does not automatically mean failure. At α=0.95 the sign flips every step, but the magnitude
              shrinks by 10%. At α=1.00 it never shrinks. Above 1.00 the same zig-zag expands and diverges.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-900">
              <ShieldCheck size={16} />
              General lesson
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-950">
              The safe learning-rate range depends on curvature. Real losses have many directions with different curvature,
              which is why scaling, conditioning, schedules, momentum, and adaptive optimizers matter beyond this 1D bowl.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
