import React, { useMemo } from 'react';
import { Ruler } from 'lucide-react';
import { KNN_SCALE_DEMO, knnScaleSensitivity } from './knnNaiveBayesSvmModel.js';

function NeighborTable({ title, result }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
        <strong className="mt-1 block text-lg text-slate-950">nearest {result.selected[0].id} → {result.prediction}</strong>
      </div>
      <div className="divide-y divide-slate-100">
        {result.neighbors.map((neighbor, index) => (
          <div key={neighbor.id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
            <span className="font-bold text-slate-700">{index + 1}. {neighbor.id} · {neighbor.label}</span>
            <span className="font-mono text-slate-600">{neighbor.distance.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KnnScalingLab() {
  const experiment = useMemo(() => knnScaleSensitivity(), []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <Ruler className="mt-1 text-cyan-700" size={20} />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">kNN scale failure</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Changing units can change who is nearest.</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            This 1-NN query has one small-range signal feature and one large-unit feature. Raw Euclidean distance is dominated by the large-unit coordinate. Standardization is fitted on the training rows only, then the same query is compared again.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Query</p>
          <strong className="mt-1 block text-lg text-slate-950">signal {KNN_SCALE_DEMO.query.signal.toFixed(1)}</strong>
          <span className="text-sm text-slate-600">large-unit feature {KNN_SCALE_DEMO.query.largeUnit.toLocaleString()}</span>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Raw units</p>
          <strong className="mt-1 block text-lg text-rose-950">{experiment.raw.prediction}</strong>
          <span className="text-sm text-rose-800">nearest point {experiment.raw.selected[0].id}</span>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Training-fitted scaling</p>
          <strong className="mt-1 block text-lg text-emerald-950">{experiment.scaled.prediction}</strong>
          <span className="text-sm text-emerald-800">nearest point {experiment.scaled.selected[0].id}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <NeighborTable title="Raw Euclidean ranking" result={experiment.raw} />
        <NeighborTable title="Standardized Euclidean ranking" result={experiment.scaled} />
      </div>

      <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Important:</strong> scaling does not guarantee a better kNN model. It prevents arbitrary measurement units from deciding the geometry. The distance metric, irrelevant dimensions, class imbalance, and the choice of k still need validation.
      </p>
    </section>
  );
}
