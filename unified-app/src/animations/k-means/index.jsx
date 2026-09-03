import React, { useMemo, useState } from 'react';
import { LocateFixed, RotateCcw, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import KMeansDiagnosticsLab from './KMeansDiagnosticsLab.jsx';
import { COLORS, POINTS, runKMeans, toScreen } from './kMeansModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-900">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function KMeansAnimation() {
  const [k, setK] = useState(4);
  const [iterations, setIterations] = useState(2);
  const result = useMemo(() => runKMeans(k, iterations), [k, iterations]);
  const clusterSizes = result.centroids.map((_, cluster) => result.assignments.filter((value) => value === cluster).length);

  const reset = () => {
    setK(4);
    setIterations(2);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Unsupervised grouping</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">K-Means Clustering</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              K-means alternates between assigning each point to the nearest centroid and moving each centroid
              to the mean of its assigned points. The objective is to reduce within-cluster squared distance.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Clusters" value={k} detail="chosen centroids" />
        <Stat label="Iterations" value={iterations} detail="assignment/update cycles" />
        <Stat label="Inertia" value={result.inertia.toFixed(1)} detail="sum of squared distances" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Controls
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            k: {k}
            <input
              min="2"
              max="4"
              step="1"
              type="range"
              value={k}
              aria-label={`Number of clusters: ${k}`}
              onChange={(event) => setK(Number(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Iterations: {iterations}
            <input
              min="0"
              max="6"
              step="1"
              type="range"
              value={iterations}
              aria-label={`K-means iterations: ${iterations}`}
              onChange={(event) => setIterations(Number(event.target.value))}
            />
          </label>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <LocateFixed size={16} />
            Assign to nearest centroid, then move centroid to the mean
          </div>
          <svg viewBox="0 0 360 360" className="h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label={`K-means clustering with ${k} clusters after ${iterations} iterations`}>
            {Array.from({ length: 7 }, (_, index) => (
              <g key={index}>
                <line x1={40 + index * 46} y1="24" x2={40 + index * 46} y2="330" stroke="#e2e8f0" />
                <line x1="40" y1={330 - index * 48} x2="330" y2={330 - index * 48} stroke="#e2e8f0" />
              </g>
            ))}
            {POINTS.map((point, index) => {
              const [x, y] = toScreen(point);
              const cluster = result.assignments[index];
              const centroid = toScreen(result.centroids[cluster]);
              return (
                <g key={`${point[0]}-${point[1]}`}>
                  <line x1={x} y1={y} x2={centroid[0]} y2={centroid[1]} stroke={COLORS[cluster]} strokeOpacity="0.18" />
                  <circle cx={x} cy={y} r="5" fill={COLORS[cluster]} opacity="0.82" />
                </g>
              );
            })}
            {result.centroids.map((centroid, index) => {
              const [x, y] = toScreen(centroid);
              return (
                <g key={index}>
                  <circle cx={x} cy={y} r="12" fill="white" stroke={COLORS[index]} strokeWidth="4" />
                  <path d={`M ${x - 7} ${y} L ${x + 7} ${y} M ${x} ${y - 7} L ${x} ${y + 7}`} stroke={COLORS[index]} strokeWidth="3" />
                </g>
              );
            })}
          </svg>
        </section>

        <aside className="grid gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Cluster sizes</h3>
            <div className="mt-4 space-y-3">
              {clusterSizes.map((size, index) => (
                <div key={index} className="grid grid-cols-[80px_1fr_40px] items-center gap-3 text-sm">
                  <span className="font-bold" style={{ color: COLORS[index] }}>cluster {index + 1}</span>
                  <div className="h-3 rounded bg-slate-100">
                    <div className="h-3 rounded" style={{ width: `${(size / POINTS.length) * 100}%`, backgroundColor: COLORS[index] }} />
                  </div>
                  <span className="text-right font-mono text-slate-700">{size}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-blue-700">What to watch</h3>
            <p className="mt-3 text-sm leading-6 text-blue-950">
              Increasing iterations lowers inertia until assignments stabilize. Increasing k also lowers inertia by construction,
              so inertia alone cannot tell you how many clusters are useful.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Algorithm loop</h3>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li className="flex gap-3"><strong>1</strong><span>Choose k initial centroids.</span></li>
              <li className="flex gap-3"><strong>2</strong><span>Assign every point to its nearest centroid.</span></li>
              <li className="flex gap-3"><strong>3</strong><span>Replace each centroid with the mean of its assigned points.</span></li>
            </ol>
          </section>
        </aside>
      </div>

      <KMeansDiagnosticsLab />

      <AssessmentPanel lessonId="k-means" title="K-Means Clustering check" />
    </div>
  );
}
