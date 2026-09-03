import React, { useMemo, useState } from 'react';
import { AlertTriangle, GitFork, ShieldCheck, Trees } from 'lucide-react';
import {
  FOREST_DIVERSITY_CHART,
  FOREST_DIVERSITY_DEMO,
} from './treeEnsemblesConstants';
import {
  effectiveIndependentTreeCount,
  ensembleVarianceRatio,
  forestDiversitySeries,
} from './treeEnsemblesModel';

function formatPercent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function chartPoint(item, index, count, key) {
  const chart = FOREST_DIVERSITY_CHART;
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  return {
    x: chart.left + (index / Math.max(1, count - 1)) * plotWidth,
    y: chart.top + (1 - item[key]) * plotHeight,
  };
}

function pathFor(series, key) {
  return series.map((item, index) => {
    const point = chartPoint(item, index, series.length, key);
    return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(' ');
}

export default function ForestDiversityFailureLab() {
  const [treeCount, setTreeCount] = useState(FOREST_DIVERSITY_DEMO.defaultTrees);
  const [correlation, setCorrelation] = useState(FOREST_DIVERSITY_DEMO.defaultCorrelation);
  const series = useMemo(() => forestDiversitySeries(correlation), [correlation]);
  const varianceRatio = ensembleVarianceRatio(treeCount, correlation);
  const independentVarianceRatio = ensembleVarianceRatio(treeCount, 0);
  const effectiveTrees = effectiveIndependentTreeCount(treeCount, correlation);
  const selectedIndex = treeCount - 1;
  const selectedCorrelated = chartPoint(series[selectedIndex], selectedIndex, series.length, 'varianceRatio');
  const selectedIndependent = chartPoint(series[selectedIndex], selectedIndex, series.length, 'independentVarianceRatio');

  return (
    <section className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · correlated trees</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">A hundred copies of one tree are still almost one tree</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Averaging reduces variance only when tree errors are different enough. This lab uses the standard equal-variance,
            equal-correlation model to isolate that mechanism: as pairwise error correlation rises, adding more trees hits a
            hard variance floor.
          </p>
        </div>
        <GitFork className="text-amber-700" size={30} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block rounded-lg border border-amber-200 bg-white p-4 text-sm font-bold text-slate-700">
          Trees in the forest: {treeCount}
          <input
            className="mt-3 w-full"
            min={FOREST_DIVERSITY_DEMO.minTrees}
            max={FOREST_DIVERSITY_DEMO.maxTrees}
            step="1"
            type="range"
            value={treeCount}
            onChange={(event) => setTreeCount(Number(event.target.value))}
          />
        </label>
        <label className="block rounded-lg border border-amber-200 bg-white p-4 text-sm font-bold text-slate-700">
          Average pairwise error correlation: {correlation.toFixed(2)}
          <input
            className="mt-3 w-full"
            min={FOREST_DIVERSITY_DEMO.minCorrelation}
            max={FOREST_DIVERSITY_DEMO.maxCorrelation}
            step={FOREST_DIVERSITY_DEMO.correlationStep}
            type="range"
            value={correlation}
            onChange={(event) => setCorrelation(Number(event.target.value))}
          />
          <span className="mt-2 block font-normal leading-6 text-slate-600">
            0 means errors move independently. Values near 1 mean the trees tend to make the same mistakes.
          </span>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-rose-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Variance left</p>
          <strong className="mt-1 block text-3xl font-black text-slate-950">{formatPercent(varianceRatio)}</strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">Relative to one tree under the selected correlation.</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">If errors were independent</p>
          <strong className="mt-1 block text-3xl font-black text-slate-950">{formatPercent(independentVarianceRatio)}</strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">The idealized 1/T variance reduction benchmark.</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Effective independent trees</p>
          <strong className="mt-1 block text-3xl font-black text-slate-950">{effectiveTrees.toFixed(1)}</strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">Independent trees needed to match the same variance.</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Trees size={16} />
            Remaining ensemble variance
          </div>
          <svg
            viewBox={`0 0 ${FOREST_DIVERSITY_CHART.width} ${FOREST_DIVERSITY_CHART.height}`}
            className="h-auto w-full"
            role="img"
            aria-label="Ensemble variance falls rapidly for independent trees but plateaus when tree errors are correlated"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const chart = FOREST_DIVERSITY_CHART;
              const y = chart.top + (1 - ratio) * (chart.height - chart.top - chart.bottom);
              return (
                <g key={ratio}>
                  <line x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} stroke="#e2e8f0" />
                  <text x={chart.left - 8} y={y + 4} textAnchor="end" className="fill-slate-500 text-xs">
                    {Math.round(ratio * 100)}%
                  </text>
                </g>
              );
            })}
            <path d={pathFor(series, 'independentVarianceRatio')} fill="none" stroke="#059669" strokeWidth="4" />
            <path d={pathFor(series, 'varianceRatio')} fill="none" stroke="#e11d48" strokeWidth="4" />
            <line
              x1={selectedCorrelated.x}
              x2={selectedCorrelated.x}
              y1={FOREST_DIVERSITY_CHART.top}
              y2={FOREST_DIVERSITY_CHART.height - FOREST_DIVERSITY_CHART.bottom}
              stroke="#94a3b8"
              strokeDasharray="5 5"
            />
            <circle cx={selectedIndependent.x} cy={selectedIndependent.y} r="5" fill="#059669" />
            <circle cx={selectedCorrelated.x} cy={selectedCorrelated.y} r="5" fill="#e11d48" />
            {[1, 25, 50, 75, 100].map((count) => {
              const item = series[count - 1];
              const point = chartPoint(item, count - 1, series.length, 'varianceRatio');
              return (
                <text
                  key={count}
                  x={point.x}
                  y={FOREST_DIVERSITY_CHART.height - 14}
                  textAnchor="middle"
                  className="fill-slate-500 text-xs"
                >
                  {count}
                </text>
              );
            })}
            <text
              x={FOREST_DIVERSITY_CHART.width / 2}
              y={FOREST_DIVERSITY_CHART.height - 1}
              textAnchor="middle"
              className="fill-slate-600 text-xs font-bold"
            >
              number of trees
            </text>
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-600" />Independent errors</span>
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-rose-600" />Selected correlation</span>
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            Teaching model: Var(mean) / Var(tree) = ρ + (1 − ρ) / T. Real forests do not have identical variances or one
            exact pairwise correlation, but this approximation exposes why diversity matters.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-rose-900">
              <AlertTriangle size={16} />
              What broke?
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-950">
              More trees are not automatically more independent evidence. If bootstrapped samples and candidate features
              keep producing nearly the same splits, the trees repeat the same errors and averaging cannot remove them.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-sm font-black text-emerald-900">
              <ShieldCheck size={16} />
              Production habit
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-950">
              Tune feature subsampling and tree regularization, check out-of-bag or held-out performance, and stop treating
              tree count as the only ensemble knob. Strong correlated predictors can make many trees choose the same early
              splits, reducing the variance benefit you expected from bagging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
