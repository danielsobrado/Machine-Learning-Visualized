import React, { useMemo } from 'react';
import { Repeat2 } from 'lucide-react';
import { repeatedStratifiedReplay } from './crossValidationModel.js';

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function RepeatedCvLab({ repeatCount, onRepeatCountChange, k }) {
  const replay = useMemo(() => repeatedStratifiedReplay(repeatCount, k), [repeatCount, k]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Repeat2 size={15} /> Partition sensitivity</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">One K-fold run is one partition of the data</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            Repeated stratified CV redraws class-balanced folds and shows how much the estimate depends on a lucky or unlucky partition.
            It reduces dependence on one split; it does not make correlated fold scores independent observations.
          </p>
        </div>
        <label className="min-w-56 text-sm font-bold text-slate-700">
          Repeats: {repeatCount}
          <input className="mt-2 block w-full" min="1" max="10" step="1" type="range" value={repeatCount} onChange={(event) => onRepeatCountChange(Number(event.target.value))} />
        </label>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">First K-fold run</p>
          <strong className="mt-1 block text-2xl text-slate-950">{percent(replay.firstRepeatMean)}</strong>
          <span className="text-sm text-slate-600">what one partition would report</span>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
          <p className="text-xs font-black uppercase text-violet-700">Repeated mean</p>
          <strong className="mt-1 block text-2xl text-violet-950">{percent(replay.mean)}</strong>
          <span className="text-sm text-violet-800">average across repeat means</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">Repeat std</p>
          <strong className="mt-1 block text-2xl text-slate-950">{(replay.repeatStd * 100).toFixed(1)} pts</strong>
          <span className="text-sm text-slate-600">partition-to-partition movement</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">Observed range</p>
          <strong className="mt-1 block text-2xl text-slate-950">{((replay.max - replay.min) * 100).toFixed(1)} pts</strong>
          <span className="text-sm text-slate-600">best repeat minus worst repeat</span>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {replay.repeats.map((repeat) => (
          <div key={repeat.repeat} className="grid grid-cols-[70px_1fr_58px] items-center gap-3 text-xs">
            <span className="font-black text-slate-600">Repeat {repeat.repeat}</span>
            <div className="h-3 overflow-hidden rounded bg-slate-100">
              <div className="h-full rounded bg-violet-500" style={{ width: `${Math.max(4, repeat.mean * 100)}%` }} />
            </div>
            <strong className="text-right font-mono text-slate-800">{percent(repeat.mean)}</strong>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        Repeating a wrong split strategy only measures the wrong thing more precisely. If users repeat, use groups. If the future is the target, preserve time. Keep a final test set outside this development loop.
      </p>
    </section>
  );
}
