import React, { useMemo } from 'react';
import { Target } from 'lucide-react';
import { thresholdStats } from './calibrationModel.js';

function Stat({ label, raw, calibrated, formatter = Math.round }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <span className="block text-[10px] font-black uppercase text-rose-500">Raw</span>
          <strong className="text-lg text-rose-700">{formatter(raw)}</strong>
        </div>
        <span className="pb-1 text-slate-400">→</span>
        <div className="text-right">
          <span className="block text-[10px] font-black uppercase text-cyan-600">Recalibrated</span>
          <strong className="text-lg text-cyan-800">{formatter(calibrated)}</strong>
        </div>
      </div>
    </div>
  );
}

export default function CalibrationDecisionImpact({ rawBins, calibratedBins, threshold, onThresholdChange }) {
  const raw = useMemo(() => thresholdStats(rawBins, threshold), [rawBins, threshold]);
  const calibrated = useMemo(() => thresholdStats(calibratedBins, threshold), [calibratedBins, threshold]);
  const percent = (value) => `${Math.round(value * 100)}%`;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500"><Target size={15} /> Decision consequence</p>
          <h3 className="mt-1 text-lg font-black text-slate-950">Same threshold, different actions</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Recalibration changes probability meaning, so a fixed probability threshold can move cases across the operating boundary even though the base model ranking is unchanged.
          </p>
        </div>
        <label className="min-w-56 text-sm font-bold text-slate-700">
          Decision threshold: {threshold.toFixed(2)}
          <input
            className="mt-2 block w-full"
            min="0.1"
            max="0.9"
            step="0.05"
            type="range"
            value={threshold}
            onChange={(event) => onThresholdChange(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Stat label="Predicted positive" raw={raw.predictedPositive} calibrated={calibrated.predictedPositive} />
        <Stat label="Precision" raw={raw.precision} calibrated={calibrated.precision} formatter={percent} />
        <Stat label="Recall" raw={raw.recall} calibrated={calibrated.recall} formatter={percent} />
      </div>

      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
        After changing calibration, revalidate the deployment threshold against real costs and capacity. Do not assume an old cutoff remains the best policy.
      </p>
    </section>
  );
}
