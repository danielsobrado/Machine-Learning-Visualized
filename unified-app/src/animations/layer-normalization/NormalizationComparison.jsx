import React from 'react';
import { ArrowRightLeft, Users } from 'lucide-react';
import { BATCH_CONTEXTS } from './layerNormalizationConstants.js';
import { batchNormalizeColumns, layerNormalizeRows } from './layerNormalizationModel.js';

function distance(left, right) {
  return Math.sqrt(left.reduce((sum, value, index) => sum + (value - right[index]) ** 2, 0));
}

function MiniVector({ values }) {
  return (
    <div className="grid grid-cols-6 gap-1">
      {values.map((value, index) => (
        <div key={index} className="rounded bg-slate-100 px-1 py-2 text-center font-mono text-[11px] text-slate-700">
          {value.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

export default function NormalizationComparison({ token, contextId, onContextChange }) {
  const identity = {
    gamma: Array(token.length).fill(1),
    beta: Array(token.length).fill(0),
  };
  const ordinaryBatch = [token, ...BATCH_CONTEXTS.ordinary.neighbors];
  const currentBatch = [token, ...BATCH_CONTEXTS[contextId].neighbors];
  const ordinaryLayerNorm = layerNormalizeRows(ordinaryBatch, identity)[0].normalized;
  const currentLayerNorm = layerNormalizeRows(currentBatch, identity)[0].normalized;
  const ordinaryBatchNorm = batchNormalizeColumns(ordinaryBatch).rows[0];
  const currentBatchNorm = batchNormalizeColumns(currentBatch).rows[0];
  const layerNormDelta = distance(ordinaryLayerNorm, currentLayerNorm);
  const batchNormDelta = distance(ordinaryBatchNorm, currentBatchNorm);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <ArrowRightLeft size={18} className="text-violet-700" />
            Change another row, not this token
          </div>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            The selected token stays identical. Only its batch neighbors change. That should have no effect on LayerNorm,
            but training-mode BatchNorm uses those neighbors when estimating each feature statistic.
          </p>
        </div>
        <select
          value={contextId}
          onChange={(event) => onContextChange(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800"
        >
          {Object.entries(BATCH_CONTEXTS).map(([id, context]) => (
            <option key={id} value={id}>{context.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-emerald-950">LayerNorm(selected token)</div>
              <div className="text-xs text-emerald-800">Statistics come from this row's features.</div>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
              neighbor Δ {layerNormDelta.toFixed(3)}
            </div>
          </div>
          <div className="mt-3"><MiniVector values={currentLayerNorm} /></div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-amber-950">
                <Users size={15} /> BatchNorm training(selected token)
              </div>
              <div className="text-xs text-amber-800">Statistics come from each feature across rows.</div>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-800 shadow-sm">
              neighbor Δ {batchNormDelta.toFixed(3)}
            </div>
          </div>
          <div className="mt-3"><MiniVector values={currentBatchNorm} /></div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Δ is Euclidean change from the ordinary-neighbor baseline for this same selected token.
      </p>
    </section>
  );
}
