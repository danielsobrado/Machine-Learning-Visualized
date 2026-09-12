import React, { useMemo } from 'react';
import { AlertTriangle, BarChart3, CircleDot, Shuffle } from 'lucide-react';
import {
  DIAGNOSTIC_ITERATIONS,
  EMPTY_CLUSTER_CASE,
  INITIALIZATION_CASES,
  K_DIAGNOSTIC_VALUES,
  NON_CONVEX_CASE,
  OUTLIER_SENSITIVITY_CASE,
} from './kMeansDiagnosticsConstants.js';
import {
  COLORS,
  INITIAL_CENTROIDS,
  POINTS,
  compareOutlierSensitivity,
  evaluateKChoices,
  evaluateNonConvexCase,
  runKMeansForData,
  toScreen,
} from './kMeansModel.js';

function MiniClusterPlot({ result, initialCentroids, label, points = POINTS }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-sm text-slate-950">{label}</strong>
        <span className="font-mono text-xs font-black text-slate-600">inertia {result.inertia.toFixed(1)}</span>
      </div>
      <svg viewBox="0 0 360 360" className="mt-3 h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label={`${label} clustering result`}>
        {points.map((point, index) => {
          const [x, y] = toScreen(point);
          const cluster = result.assignments[index];
          return <circle key={`${index}-${point[0]}-${point[1]}`} cx={x} cy={y} r="6" fill={COLORS[cluster]} opacity="0.84" />;
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

function CompositionRow({ cluster }) {
  const inner = cluster.counts.inner || 0;
  const outer = cluster.counts.outer || 0;
  return (
    <div className="grid grid-cols-[90px_1fr_1fr] gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
      <strong style={{ color: COLORS[cluster.cluster] }}>cluster {cluster.cluster + 1}</strong>
      <span>inner: <strong>{inner}</strong></span>
      <span>outer: <strong>{outer}</strong></span>
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
  const emptyClusterResult = useMemo(
    () => runKMeansForData(POINTS, EMPTY_CLUSTER_CASE.centroids, 4),
    [],
  );
  const outlierExperiment = useMemo(
    () => compareOutlierSensitivity(
      POINTS,
      OUTLIER_SENSITIVITY_CASE.point,
      INITIAL_CENTROIDS,
      DIAGNOSTIC_ITERATIONS,
    ),
    [],
  );
  const nonConvexExperiment = useMemo(
    () => evaluateNonConvexCase(NON_CONVEX_CASE, DIAGNOSTIC_ITERATIONS),
    [],
  );
  const bestInitialization = initializationResults.reduce((best, current) => (
    current.result.inertia < best.result.inertia ? current : best
  ));
  const worstInitialization = initializationResults.reduce((worst, current) => (
    current.result.inertia > worst.result.inertia ? current : worst
  ));
  const seedPenalty = worstInitialization.result.inertia - bestInitialization.result.inertia;
  const outlierPoints = [...POINTS, OUTLIER_SENSITIVITY_CASE.point];

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Failure-mode lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">A low inertia is not proof that the clustering is useful</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          K-means optimizes one geometric objective. You still have to choose k, rerun different initializations, scale features deliberately,
          handle empty clusters, inspect outlier influence, and check whether Voronoi-style Euclidean clusters match the structure you care about.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <BarChart3 size={16} /> The inertia trap
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The best achievable k-means objective cannot increase when k grows because an extra centroid adds flexibility. A particular finite run can still finish worse because initialization and local optima matter. These diagnostic runs all converged before comparison.
          </p>

          <div className="mt-5 space-y-3">
            {kChoices.map((choice) => {
              const selected = choice.k === bestChoice.k;
              return (
                <div key={choice.k} className={`rounded-lg border p-3 ${selected ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-sm text-slate-950">k = {choice.k}</strong>
                    <div className="flex flex-wrap gap-3 font-mono text-xs font-bold text-slate-600">
                      <span>inertia {choice.inertia.toFixed(1)}</span>
                      <span>silhouette {choice.silhouette.toFixed(3)}</span>
                      <span>{choice.converged ? 'converged' : 'budget-limited'}</span>
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
            The converged diagnostic inertia continues falling beyond that point, which is why inertia alone cannot choose k.
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
            The unlucky start finishes with {seedPenalty.toFixed(1)} more inertia on exactly the same data and k. Production implementations commonly use k-means++ and multiple restarts, select the lowest-objective run, then assess whether the resulting structure is stable and meaningful.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800"><AlertTriangle size={14} /> Mean-centroid sensitivity</p>
        <h4 className="mt-2 text-lg font-black text-amber-950">One distant observation pulls the centroid even after convergence</h4>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-amber-950">
          Both runs use the same k=4 initialization and converge. The only change is adding point ({OUTLIER_SENSITIVITY_CASE.point[0]}, {OUTLIER_SENSITIVITY_CASE.point[1]}). Because each centroid is an arithmetic mean, that single point moves its assigned cluster center.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <MiniClusterPlot
            label="Original observations"
            initialCentroids={INITIAL_CENTROIDS}
            result={outlierExperiment.baseline}
          />
          <MiniClusterPlot
            label="Same data + one distant point"
            initialCentroids={INITIAL_CENTROIDS}
            result={outlierExperiment.contaminated}
            points={outlierPoints}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-200 bg-white/70 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Affected cluster</p>
            <strong className="mt-1 block text-2xl text-amber-950">{outlierExperiment.largestShiftCluster + 1}</strong>
          </div>
          <div className="rounded-lg border border-amber-200 bg-white/70 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Centroid movement</p>
            <strong className="mt-1 block text-2xl text-amber-950">{outlierExperiment.largestCentroidShift.toFixed(3)}</strong>
          </div>
          <div className="rounded-lg border border-amber-200 bg-white/70 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Inertia increase</p>
            <strong className="mt-1 block text-2xl text-amber-950">+{outlierExperiment.inertiaIncrease.toFixed(1)}</strong>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-amber-950">
          Scaling fixes unequal feature units; it does not make arithmetic means robust to extreme observations. Outlier policy and the choice of clustering algorithm are separate decisions.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <MiniClusterPlot
          label={NON_CONVEX_CASE.label}
          initialCentroids={NON_CONVEX_CASE.initialCentroids}
          result={nonConvexExperiment.result}
          points={nonConvexExperiment.points}
        />
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-800"><CircleDot size={14} /> Shape mismatch</p>
          <h4 className="mt-2 text-lg font-black text-cyan-950">Converged does not mean the geometry matches the real groups</h4>
          <p className="mt-2 text-sm leading-6 text-cyan-950">
            The known structure is an inner ring and an outer ring. K-means with k=2 still converges, but nearest-centroid Voronoi regions cut the plane into spatial halves instead of recovering concentric membership.
          </p>
          <div className="mt-4 space-y-2">
            {nonConvexExperiment.composition.map((cluster) => (
              <CompositionRow key={cluster.cluster} cluster={cluster} />
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-cyan-200 bg-white/70 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Ring-label purity</p>
            <strong className="mt-1 block text-3xl text-cyan-950">{(nonConvexExperiment.purity * 100).toFixed(0)}%</strong>
            <p className="mt-2 text-sm leading-6 text-cyan-950">
              Every found cluster mixes inner and outer points. The algorithm optimized its squared-distance objective correctly; the objective simply encodes the wrong cluster shape for this problem.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <MiniClusterPlot
          label={EMPTY_CLUSTER_CASE.label}
          initialCentroids={EMPTY_CLUSTER_CASE.centroids}
          result={emptyClusterResult}
        />
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-800"><AlertTriangle size={14} /> Empty-cluster policy</p>
          <h4 className="mt-2 text-lg font-black text-rose-950">One requested centroid has no members</h4>
          <p className="mt-2 text-sm leading-6 text-rose-950">
            Duplicate initial seeds tie on every nearby point, so deterministic tie-breaking sends those points to the first seed. Cluster {emptyClusterResult.emptyClusters.map((cluster) => cluster + 1).join(', ')} remains empty.
          </p>
          <p className="mt-3 text-sm leading-6 text-rose-950">
            This lesson's model keeps an empty centroid at its previous location instead of dividing by zero. That is a documented fallback, not a universal k-means rule. Production libraries may reinitialize an empty centroid, choose a difficult point, or apply another explicit recovery policy.
          </p>
          <div className="mt-4 rounded-lg border border-rose-200 bg-white/70 p-4 text-sm leading-6 text-rose-950">
            A run can be stationary under its empty-cluster policy while using fewer than k effective clusters. “Converged” therefore does not automatically mean the requested clustering is healthy.
          </div>
        </div>
      </div>
    </section>
  );
}
