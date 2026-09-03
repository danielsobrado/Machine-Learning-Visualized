import React, { useMemo, useState } from 'react';
import { RefreshCw, Shuffle } from 'lucide-react';
import { DROPOUT_BATCHNORM_DEFAULTS, DROPOUT_DEMO } from './dropoutBatchNormConstants.js';
import {
  dropoutPasses,
  summarizePasses,
  theoreticalDropoutMoments,
} from './dropoutBatchNormModel.js';

export default function DropoutExperiment() {
  const [value, setValue] = useState(2);
  const [dropoutRate, setDropoutRate] = useState(DROPOUT_BATCHNORM_DEFAULTS.dropoutRate);
  const [seed, setSeed] = useState(DROPOUT_DEMO.initialSeed);
  const trainingPasses = useMemo(
    () => dropoutPasses({ value, dropoutRate, trainingMode: true, seed }),
    [dropoutRate, seed, value],
  );
  const inferencePasses = useMemo(
    () => dropoutPasses({ value, dropoutRate, trainingMode: false, seed }),
    [dropoutRate, seed, value],
  );
  const sample = summarizePasses(trainingPasses);
  const inference = summarizePasses(inferencePasses);
  const theory = theoreticalDropoutMoments(value, dropoutRate);
  const maxMagnitude = Math.max(1, ...trainingPasses.map((pass) => Math.abs(pass.output)));

  return (
    <section className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Dropout experiment</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Expectation is not a forward pass</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Inverted dropout preserves the expected activation during training, but each pass is still either masked or rescaled.
            Compare the exact theoretical moments with a finite sample of forward passes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((current) => current + 1)}
          className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-black text-violet-900"
        >
          <RefreshCw size={16} /> Resample
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="block text-sm font-semibold text-slate-700">
            <span className="flex justify-between"><span>Incoming activation</span><span className="font-mono">{value.toFixed(1)}</span></span>
            <input type="range" min="-4" max="4" step="0.25" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            <span className="flex justify-between"><span>Dropout rate p</span><span className="font-mono">{(dropoutRate * 100).toFixed(0)}%</span></span>
            <input type="range" min="0" max="0.8" step="0.05" value={dropoutRate} onChange={(event) => setDropoutRate(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
          </label>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs leading-5 text-violet-950">
            <strong>Training:</strong> output is 0 or x/(1−p).<br />
            <strong>Evaluation:</strong> standard dropout is identity.
          </div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-4"><span className="text-xs font-black uppercase text-slate-500">Theory E[y]</span><strong className="mt-1 block text-2xl font-black">{theory.mean.toFixed(3)}</strong></div>
            <div className="rounded-xl border border-slate-200 p-4"><span className="text-xs font-black uppercase text-slate-500">Sample mean</span><strong className="mt-1 block text-2xl font-black">{sample.mean.toFixed(3)}</strong></div>
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4"><span className="text-xs font-black uppercase text-violet-700">Theory σ</span><strong className="mt-1 block text-2xl font-black">{theory.std.toFixed(3)}</strong></div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><span className="text-xs font-black uppercase text-emerald-700">Eval σ</span><strong className="mt-1 block text-2xl font-black">{inference.std.toFixed(3)}</strong></div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-3 text-sm font-black text-slate-900">
              <span className="flex items-center gap-2"><Shuffle size={16} className="text-violet-700" /> {trainingPasses.length} training passes</span>
              <span className="text-xs text-slate-500">masked {sample.droppedCount}/{trainingPasses.length}</span>
            </div>
            <div className="grid grid-cols-8 gap-1 sm:grid-cols-12">
              {trainingPasses.map((pass) => (
                <div key={pass.index} className="flex h-20 items-end rounded bg-slate-100 p-1" title={`pass ${pass.index + 1}: ${pass.output.toFixed(3)}`}>
                  <div
                    className={`w-full rounded ${pass.kept ? 'bg-violet-500' : 'bg-rose-300'}`}
                    style={{ height: `${Math.max(5, (Math.abs(pass.output) / maxMagnitude) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
