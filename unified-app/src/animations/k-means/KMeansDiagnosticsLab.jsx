import React, { useMemo } from 'react';
import { AlertTriangle, BarChart3, Shuffle } from 'lucide-react';
import {
  DIAGNOSTIC_ITERATIONS,
  INITIALIZATION_CASES,
  K_DIAGNOSTIC_VALUES,
} from './kMeansDiagnosticsConstants.js';
import {
  COLORS,
  POINTS,
  evaluateKChoices,
  runKMeansForData,
  toScreen,
} from './kMeansModel.js';

function MiniClusterPlot({ result, initialCentroids, label }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm text-slate-950">{label}</strong>
        <span className="font-mono text-xs font-black text-slate-600">inertia {result.inertia.toFixed(1)}</span>
      </div>
      <svg viewBox="0 0 360 360" className="mt-3 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label={`${label} clustering result`}>
        {POINTS.map((point, index) => {
          const [x, y] = toScreen(point);
          const cluster = result.assignments[index];
          return <circle key={`${point[0]}-${point[1]}`} cx={x} cy={y} r="6" fill={COLORS[cluster]} opacity="0.84" />;
        })}
        {initialCentroids.map((centroid, index) => {
          const [x, y] = toScreen(centroid);
          return (
            <path
              key={`initial-${index}`}
              d={`M ${x - 7} ${y - 7} L ${x + 7} ${y + 7} M ${x + 7} ${y - 7} L ${x - 7} ${y + 7}`}
              stroke={COLORS[index]}
              strokeWidth="3"
              opacity="0.55"
            />
          );
        })}
        {result.centroids.map((centroid, index) => {
          const [x, y] = toScreen(centroid);
          return <circle key={`final-${index}`} cx={x} cy={y} r="11" fill="white" stroke={COLORS[index]} strokeWidth="4" />;
        })}
      </svg>
      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">× = initial seed · ring = final centroid</p>
    </div>
  );
}

export default function KMeansDiagnosticsLab() {
  const kChoices = useMemo(
    () => evaluateKChoices(POINTS, K_DIAGNOSTIC_VALUES, DIAGNOSTIC_ITERATIONS),
    [],
  );
  const bestChoice = kChoices.reduce((best, choice) => (choice.silhouette > best.silhouette ? choice : best));
  const maxInertia = Math.max(...kChoices.map((choice) => choice.inertia));
  const initializationResults = useMemo(
    () => Object.entries(INITIALIZATION_CASES).map(([id, config]) => ({
      id,
      ...config,
      result: runKMeansForData(POINTS, config.centroids, DIAGNOSTIC_ITERATIONS),
    })),
    [],
  );
  const bestInitialization = initializationResults.reduce((best, current) => (
    current.result.inertia < best.result.inertia ? current : best
  ));
  const worstInitialization = initializationResults.reduce((worst, current) => (
    current.result.inertia > worst.result.inertia ? current : worst
  ));
  const seedPenalty = worstInitialization.result.inertia - bestInitialization.result.inertia;

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Failure-mode lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">A low inertia is not proof that the clustering is useful</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          K-means optimizes one geometric objective. You still have to choose k, rerun different initializations, scale features deliberately,
          and check whether roughly spherical Euclidean clusters match the structure you care about.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <BarChart3 size={16} /> The inertia trap
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Inertia must fall as k increases, so choosing the smallest inertia would always push you toward more clusters. Compare it with separation quality instead.
          </p>

          <div className="mt-5 space-y-3">
            {kChoices.map((choice) => {
              const selected = choice.k === bestChoice.k;
              return (
                <div key={choice.k} className={`rounded-lg border p-3 ${selected ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm text-slate-950">k = {choice.k}</strong>
                    <div className="flex gap-3 font-mono text-xs font-bold text-slate-600">
                      <span>inertia {choice.inertia.toFixed(1)}</span>
                      <span>silhouette {choice.silhouette.toFixed(3)}</span>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Inertia ↓</span><span>{Math.round((choice.inertia / maxInertia) * 100)}%</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-slate-500" style={{ width: `${(choice.inertia / maxInertia) * 100}%` }} /></div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Silhouette ↑</span><span>{(choice.silhouette * 100).toFixed(0)}%</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(0, choice.silhouette) * 100}%` }} /></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-800">What this dataset is telling you</p>
          <strong className="mt-2 block text-3xl font-black text-emerald-950">k = {bestChoice.k}</strong>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            The sample has four compact visible groups, and silhouette peaks at {bestChoice.silhouette.toFixed(3)} for k={bestChoice.k}.
            Inertia continues falling beyond that point, which is why inertia alone cannot choose k.
          </p>
          <div className="mt-4 rounded-lg border border-emerald-200 bg-white/70 p-4 text-sm leading-6 text-emerald-950">
            Silhouette is not a universal truth either. It favors separated compact clusters and should be combined with domain meaning, stability, and downstream usefulness.
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Shuffle size={16} /> Same k, different initialization
        </div>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Lloyd's algorithm converges to a local optimum. With k=3, the same observations can finish at different solutions depending on where the centroids begin.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {initializationResults.map((entry) => (
            <MiniClusterPlot
              key={entry.id}
              label={entry.label}
              initialCentroids={entry.centroids}
              result={entry.result}
            />
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800"><AlertTriangle size={14} /> Initialization penalty</p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            The unlucky start finishes with {seedPenalty.toFixed(1)} more inertia on exactly the same data and k. Production implementations use smarter initialization such as k-means++ and multiple restarts, then keep the best stable solution.
          </p>
        </div>
      </div>
    </section>
  );
}
