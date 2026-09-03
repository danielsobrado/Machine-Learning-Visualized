import React, { useMemo } from 'react';
import { AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import {
  OPTIONAL_STOPPING_SIMULATION,
  SIGNIFICANCE_ALPHA,
} from './abTestingConstants.js';
import { simulateOptionalStopping } from './abTestingModel.js';

const P_VALUE_CHART_MAX = 0.25;
const CHART_LEFT = 40;
const CHART_RIGHT = 500;
const CHART_TOP = 28;
const CHART_BOTTOM = 194;

function formatPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function pValueX(look, looks) {
  return CHART_LEFT + ((look - 1) / (looks - 1)) * (CHART_RIGHT - CHART_LEFT);
}

function pValueY(pValue) {
  const clipped = Math.min(P_VALUE_CHART_MAX, Math.max(0, pValue));
  return CHART_TOP + (clipped / P_VALUE_CHART_MAX) * (CHART_BOTTOM - CHART_TOP);
}

function ExamplePath({ path, looks }) {
  const points = path
    .map((point) => `${pValueX(point.look, looks).toFixed(1)},${pValueY(point.pValue).toFixed(1)}`)
    .join(' ');
  const thresholdY = pValueY(SIGNIFICANCE_ALPHA);

  return (
    <svg
      viewBox="0 0 540 235"
      className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50"
      role="img"
      aria-label="Example null experiment where repeated interim p-values cross 0.05 before returning above it"
    >
      <line x1={CHART_LEFT} y1={CHART_BOTTOM} x2={CHART_RIGHT} y2={CHART_BOTTOM} className="stroke-slate-300" />
      <line x1={CHART_LEFT} y1={CHART_TOP} x2={CHART_LEFT} y2={CHART_BOTTOM} className="stroke-slate-300" />
      <line
        x1={CHART_LEFT}
        y1={thresholdY}
        x2={CHART_RIGHT}
        y2={thresholdY}
        className="stroke-rose-400"
        strokeDasharray="5 5"
      />
      <polyline points={points} fill="none" className="stroke-violet-600" strokeWidth="3" strokeLinejoin="round" />
      {path.map((point) => (
        <circle
          key={point.look}
          cx={pValueX(point.look, looks)}
          cy={pValueY(point.pValue)}
          r="4"
          className={point.pValue < SIGNIFICANCE_ALPHA ? 'fill-rose-600' : 'fill-violet-600'}
        />
      ))}
      <text x={CHART_LEFT + 6} y={thresholdY - 7} className="fill-rose-700 text-[11px] font-bold">p = 0.05</text>
      <text x="270" y="222" textAnchor="middle" className="fill-slate-600 text-[11px] font-bold">interim look</text>
      <text x="14" y="112" textAnchor="middle" transform="rotate(-90 14 112)" className="fill-slate-600 text-[11px] font-bold">p-value</text>
    </svg>
  );
}

function RateCard({ label, value, detail, tone }) {
  const classes = tone === 'danger'
    ? 'border-rose-200 bg-rose-50 text-rose-950'
    : tone === 'safe'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
      : 'border-slate-200 bg-slate-50 text-slate-950';

  return (
    <div className={`rounded-lg border p-4 ${classes}`}>
      <span className="text-[10px] font-black uppercase tracking-wide opacity-70">{label}</span>
      <strong className="mt-1 block text-2xl">{formatPct(value)}</strong>
      <span className="mt-1 block text-xs leading-5 opacity-80">{detail}</span>
    </div>
  );
}

export default function OptionalStoppingLab() {
  const result = useMemo(
    () => simulateOptionalStopping(OPTIONAL_STOPPING_SIMULATION),
    [],
  );
  const selectedLooks = result.falsePositiveByLook.filter(({ look }) => (
    look === 1 || look === 4 || look === 8 || look === result.looks
  ));

  return (
    <section className="space-y-5 rounded-lg border border-rose-200 bg-rose-50/40 p-5">
      <div>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-700">
          <Eye size={15} /> Optional-stopping trap
        </p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Checking the same 5% test again and again is not still a 5% test</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          These simulations contain no treatment effect. The only thing that changes is the analysis policy: either test once at the pre-declared final look, or repeatedly inspect the accumulating evidence and stop as soon as p drops below 0.05.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <RateCard
          label="Pre-declared final test"
          value={result.fixedHorizonRate}
          detail="One 5% test at the planned horizon."
          tone="safe"
        />
        <RateCard
          label="Naive repeated peeking"
          value={result.naivePeekingRate}
          detail={`Stop on the first p < 0.05 across ${result.looks} looks.`}
          tone="danger"
        />
        <RateCard
          label="Simple adjusted monitoring"
          value={result.adjustedMonitoringRate}
          detail={`Bonferroni uses 0.05 / ${result.looks} per look; conservative but valid.`}
          tone="neutral"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">One null experiment</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Red points are moments when a naive analyst could have declared victory. This example later finishes non-significant.
              </p>
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-800">true effect = 0</span>
          </div>
          <ExamplePath path={result.examplePath} looks={result.looks} />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">False positives accumulate</p>
            <div className="mt-4 space-y-3">
              {selectedLooks.map(({ look, rate }) => (
                <div key={look}>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>By look {look}</span>
                    <span className="font-mono">{formatPct(rate)}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-rose-500"
                      style={{ width: `${Math.min(100, rate * 400)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Naive monitoring produces about <strong>{result.inflationMultiple.toFixed(1)}×</strong> as many false discoveries as the single planned test in this simulation.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <p className="flex items-center gap-2 font-black"><AlertTriangle size={15} /> Why this happens</p>
            <p className="mt-2">
              Every extra opportunity to stop on a lucky fluctuation adds another route to a false positive. The interim tests are correlated because they reuse earlier observations, but the family-wise error still grows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="block text-slate-950">Fixed-horizon option</strong>
          Pre-declare the sample size and primary analysis, then avoid significance-based early stopping.
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="block text-slate-950">Sequential option</strong>
          If early decisions matter, design them in advance with alpha spending, group-sequential boundaries, or another valid sequential method.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <p className="flex items-center gap-2 font-black"><ShieldCheck size={15} /> Same principle</p>
          Looking repeatedly, adding metrics after seeing results, or testing many variants all consume error budget. The analysis plan is part of the experiment design.
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Simulation: {result.simulations.toLocaleString()} null z-test paths with {result.looks} equally spaced information looks and a two-sided {Math.round(result.alpha * 100)}% threshold.
      </p>
    </section>
  );
}
