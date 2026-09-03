import React, { useMemo, useState } from 'react';
import { AlertTriangle, Eye, Users } from 'lucide-react';
import { CALIBRATION_SLICE_EXAMPLE } from './calibrationSliceConstants.js';
import { aggregateCalibrationSlices, reliabilityMetrics, totalCount } from './calibrationModel.js';

function weightedSignedGap(bins) {
  const total = totalCount(bins);
  if (total === 0) return 0;
  return bins.reduce(
    (sum, bin) => sum + bin.count * (bin.observed - bin.confidence),
    0,
  ) / total;
}

function ReliabilityRow({ bin }) {
  const start = Math.min(bin.confidence, bin.observed) * 100;
  const width = Math.abs(bin.observed - bin.confidence) * 100;

  return (
    <div className="grid gap-2 sm:grid-cols-[5rem_1fr_7.5rem] sm:items-center">
      <span className="font-mono text-xs font-black text-slate-600">{Math.round(bin.confidence * 100)}% score</span>
      <div className="relative h-8 rounded-lg bg-slate-100" aria-hidden="true">
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-amber-300"
          style={{ left: `${start}%`, width: `${Math.max(width, 0.8)}%` }}
        />
        <span
          className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800"
          style={{ left: `${bin.confidence * 100}%` }}
        />
        <span
          className="absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500"
          style={{ left: `${bin.observed * 100}%` }}
        />
      </div>
      <span className="text-right font-mono text-xs font-black text-cyan-700">{Math.round(bin.observed * 100)}% observed</span>
    </div>
  );
}

export default function CalibrationSliceAudit() {
  const [selectedId, setSelectedId] = useState('overall');
  const slices = CALIBRATION_SLICE_EXAMPLE.slices;
  const aggregateBins = useMemo(() => aggregateCalibrationSlices(slices), [slices]);
  const views = useMemo(() => [
    {
      id: 'overall',
      label: 'Overall',
      short: 'Pooled population',
      bins: aggregateBins,
    },
    ...slices,
  ], [aggregateBins, slices]);
  const selected = views.find((view) => view.id === selectedId) ?? views[0];
  const metrics = reliabilityMetrics(selected.bins);
  const signedGap = weightedSignedGap(selected.bins);
  const isAggregate = selected.id === 'overall';

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700">
            <Users size={15} /> Slice audit
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{CALIBRATION_SLICE_EXAMPLE.title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">{CALIBRATION_SLICE_EXAMPLE.detail}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-1.5 rounded bg-slate-800" /> Predicted</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-1.5 rounded bg-cyan-500" /> Observed</span>
        </div>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-3">
        {views.map((view) => {
          const viewMetrics = reliabilityMetrics(view.bins);
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setSelectedId(view.id)}
              aria-pressed={selectedId === view.id}
              className={`rounded-lg border p-4 text-left transition ${
                selectedId === view.id
                  ? 'border-violet-500 bg-violet-50 text-violet-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm">{view.label}</strong>
                <span className="font-mono text-xs font-black">ECE {(viewMetrics.ece * 100).toFixed(1)}%</span>
              </div>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{view.short}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          {selected.bins.map((bin) => (
            <ReliabilityRow key={bin.confidence} bin={bin} />
          ))}
        </div>

        <div className={`rounded-lg border p-4 ${
          isAggregate
            ? 'border-amber-200 bg-amber-50 text-amber-950'
            : 'border-rose-200 bg-rose-50 text-rose-950'
        }`}>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
            {isAggregate ? <Eye size={15} /> : <AlertTriangle size={15} />}
            {isAggregate ? 'Aggregation trap' : 'Hidden segment failure'}
          </p>
          <strong className="mt-2 block text-lg">
            {isAggregate
              ? `Overall ECE looks excellent: ${(metrics.ece * 100).toFixed(1)}%`
              : `${Math.abs(signedGap * 100).toFixed(1)} pts ${signedGap < 0 ? 'overconfident' : 'underconfident'} on average`}
          </strong>
          <p className="mt-2 text-sm leading-6">
            {isAggregate
              ? 'The two segment errors point in opposite directions and cancel when pooled. A healthy aggregate reliability curve is not evidence that important deployment slices are calibrated.'
              : 'This segment is systematically wrong even though the pooled population looks calibrated. Monitor important slices separately and require enough support before acting on noisy subgroup estimates.'}
          </p>
        </div>
      </div>
    </section>
  );
}
