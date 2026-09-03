import React, { useMemo, useState } from 'react';
import { AlertTriangle, Copy, ShieldCheck, TrendingUp } from 'lucide-react';
import { NAIVE_BAYES_DEPENDENCE_DEMO } from './knnNaiveBayesSvmConstants';
import {
  duplicateEvidenceSeries,
  naiveBayesDuplicateEvidence,
} from './knnNaiveBayesSvmModel';

const CHART = Object.freeze({
  width: 520,
  height: 220,
  left: 46,
  right: 18,
  top: 18,
  bottom: 36,
  minProbability: 0.5,
  maxProbability: 1,
});

function formatPercent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function chartPoint(item, index, count, probabilityKey) {
  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  const x = CHART.left + (index / Math.max(1, count - 1)) * plotWidth;
  const normalized = (item[probabilityKey] - CHART.minProbability)
    / (CHART.maxProbability - CHART.minProbability);
  const y = CHART.top + (1 - normalized) * plotHeight;
  return { x, y };
}

function pathFor(series, probabilityKey) {
  return series.map((item, index) => {
    const { x, y } = chartPoint(item, index, series.length, probabilityKey);
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

export default function NaiveBayesDependenceLab() {
  const [copies, setCopies] = useState(NAIVE_BAYES_DEPENDENCE_DEMO.defaultCopies);
  const result = useMemo(() => naiveBayesDuplicateEvidence({
    ...NAIVE_BAYES_DEPENDENCE_DEMO,
    copies,
  }), [copies]);
  const series = useMemo(() => duplicateEvidenceSeries(), []);
  const naivePath = pathFor(series, 'naivePosterior');
  const awarePath = pathFor(series, 'dependencyAwarePosterior');

  return (
    <section className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · correlated features</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">One witness copied {copies} times is still one witness</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Imagine one sensor fires. Under equal class priors, this signal has a 72% posterior for blue. Now duplicate
            that exact sensor output into several feature columns. The copies contain no new information because they are
            perfectly correlated.
          </p>
        </div>
        <Copy className="text-amber-700" size={28} />
      </div>

      <label className="block rounded-lg border border-amber-200 bg-white p-4 text-sm font-bold text-slate-700">
        Duplicate copies of the same signal: {copies}
        <input
          className="mt-3 w-full"
          min={NAIVE_BAYES_DEPENDENCE_DEMO.minCopies}
          max={NAIVE_BAYES_DEPENDENCE_DEMO.maxCopies}
          step="1"
          type="range"
          value={copies}
          onChange={(event) => setCopies(Number(event.target.value))}
        />
        <span className="mt-2 block font-normal leading-6 text-slate-600">
          P(signal | blue) = 72%, P(signal | orange) = 28%. Every extra column is an exact copy, not a new measurement.
        </span>
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Count evidence once</p>
          <strong className="mt-1 block text-3xl font-black text-slate-950">
            {formatPercent(result.dependencyAwarePosterior)}
          </strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">Correct for exact duplicates: confidence does not change.</p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Naive independence</p>
          <strong className="mt-1 block text-3xl font-black text-slate-950">
            {formatPercent(result.naivePosterior)}
          </strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">The same likelihood ratio is multiplied {copies} times.</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">False certainty added</p>
          <strong className="mt-1 block text-3xl font-black text-slate-950">
            +{formatPercent(result.overconfidenceGap)}
          </strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">Probability increase created only by redundant columns.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <TrendingUp size={16} />
            Posterior as duplicate columns are added
          </div>
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="h-auto w-full"
            role="img"
            aria-label="Naive Bayes confidence rises with duplicate correlated features while dependency-aware confidence stays flat"
          >
            {[0.5, 0.75, 1].map((probability) => {
              const plotHeight = CHART.height - CHART.top - CHART.bottom;
              const normalized = (probability - CHART.minProbability) / (CHART.maxProbability - CHART.minProbability);
              const y = CHART.top + (1 - normalized) * plotHeight;
              return (
                <g key={probability}>
                  <line x1={CHART.left} x2={CHART.width - CHART.right} y1={y} y2={y} stroke="#e2e8f0" />
                  <text x={CHART.left - 8} y={y + 4} textAnchor="end" className="fill-slate-500 text-xs">
                    {Math.round(probability * 100)}%
                  </text>
                </g>
              );
            })}
            <path d={awarePath} fill="none" stroke="#059669" strokeWidth="4" />
            <path d={naivePath} fill="none" stroke="#e11d48" strokeWidth="4" />
            {series.map((item, index) => {
              const naive = chartPoint(item, index, series.length, 'naivePosterior');
              const aware = chartPoint(item, index, series.length, 'dependencyAwarePosterior');
              return (
                <g key={item.copies}>
                  <circle cx={aware.x} cy={aware.y} r="4" fill="#059669" />
                  <circle cx={naive.x} cy={naive.y} r="4" fill="#e11d48" />
                  <text x={naive.x} y={CHART.height - 12} textAnchor="middle" className="fill-slate-500 text-xs">
                    {item.copies}
                  </text>
                </g>
              );
            })}
            <text x={CHART.width / 2} y={CHART.height - 1} textAnchor="middle" className="fill-slate-600 text-xs font-bold">
              exact copies of one feature
            </text>
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-600" />Count once</span>
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-rose-600" />Naive Bayes</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-rose-900">
              <AlertTriangle size={16} />
              What broke?
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-950">
              Naive Bayes assumes conditional independence, so each copied column is treated like fresh evidence. Exact
              duplicates violate that assumption maximally and make the posterior overconfident.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-900">
              <ShieldCheck size={16} />
              Production habit
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-950">
              Audit highly correlated or derived features, compare probability calibration on held-out data, and remove
              redundant signals when they manufacture certainty. Naive Bayes can still classify well even when its raw
              probabilities are poorly calibrated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
