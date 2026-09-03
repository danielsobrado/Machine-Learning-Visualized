import React, { useMemo, useState } from 'react';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import { DROPOUT_DEMO } from './dropoutBatchNormConstants.js';
import {
  batchNormModeComparison,
  dropoutPasses,
  summarizePasses,
} from './dropoutBatchNormModel.js';

function format(value) {
  return Number(value).toFixed(2);
}

export default function ModeFailureLab({
  activation,
  batchMean,
  batchStd,
  runningMean,
  runningStd,
  gamma,
  beta,
  dropoutRate,
}) {
  const [seed, setSeed] = useState(DROPOUT_DEMO.initialSeed);
  const comparison = useMemo(
    () => batchNormModeComparison({
      activation,
      batchMean,
      batchStd,
      runningMean,
      runningStd,
      gamma,
      beta,
    }),
    [activation, batchMean, batchStd, runningMean, runningStd, gamma, beta],
  );
  const trainingPasses = useMemo(
    () => dropoutPasses({
      value: comparison.training.output,
      dropoutRate,
      trainingMode: true,
      seed,
    }),
    [comparison.training.output, dropoutRate, seed],
  );
  const inferencePasses = useMemo(
    () => dropoutPasses({
      value: comparison.inference.output,
      dropoutRate,
      trainingMode: false,
      seed,
    }),
    [comparison.inference.output, dropoutRate, seed],
  );
  const trainingSummary = summarizePasses(trainingPasses);
  const inferenceSummary = summarizePasses(inferencePasses);
  const maxMagnitude = Math.max(
    1,
    ...trainingPasses.map((pass) => Math.abs(pass.output)),
    ...inferencePasses.map((pass) => Math.abs(pass.output)),
  );

  return (
    <section className="space-y-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · train mode is part of the model</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">The same activation can follow two different inference paths</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            BatchNorm and dropout change behavior between training and evaluation. Forgetting to switch modes is not a small
            implementation detail: it changes the function the network computes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-black text-amber-900"
        >
          <RefreshCw size={16} />
          Resample dropout
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">BatchNorm mode mismatch</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-rose-50 p-3">
              <span className="text-xs font-bold uppercase tracking-wide text-rose-700">Training stats</span>
              <strong className="mt-1 block text-2xl font-black text-slate-950">{format(comparison.training.output)}</strong>
              <span className="text-xs text-slate-600">current batch μ={format(batchMean)}, σ={format(batchStd)}</span>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Inference stats</span>
              <strong className="mt-1 block text-2xl font-black text-slate-950">{format(comparison.inference.output)}</strong>
              <span className="text-xs text-slate-600">running μ={format(runningMean)}, σ={format(runningStd)}</span>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Output gap: <strong>{format(comparison.modeGap)}</strong>. Using the current request batch at inference makes one
            prediction depend on which other examples happen to arrive beside it.
          </p>
        </div>

        <div className="rounded-xl border border-violet-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Dropout mode mismatch</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-violet-50 p-3">
              <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Training passes</span>
              <strong className="mt-1 block text-2xl font-black text-slate-950">σ={format(trainingSummary.std)}</strong>
              <span className="text-xs text-slate-600">{trainingSummary.droppedCount}/{trainingPasses.length} masked this sample</span>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">Inference passes</span>
              <strong className="mt-1 block text-2xl font-black text-slate-950">σ={format(inferenceSummary.std)}</strong>
              <span className="text-xs text-slate-600">dropout disabled</span>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Inverted dropout preserves the <em>expected</em> activation during training, but individual passes are still random.
            Showing only the expectation hides the regularizer's actual behavior.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            ['Training', trainingPasses, 'bg-violet-500'],
            ['Inference', inferencePasses, 'bg-emerald-500'],
          ].map(([label, passes, tone]) => (
            <div key={label}>
              <div className="mb-3 flex items-center justify-between text-sm font-black text-slate-800">
                <span>{label} · {passes.length} forward passes</span>
                <span>{label === 'Training' ? `mean ${format(trainingSummary.mean)}` : `mean ${format(inferenceSummary.mean)}`}</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {passes.map((pass) => (
                  <div key={pass.index} className="flex h-24 items-end rounded-lg bg-slate-100 p-1" title={`pass ${pass.index + 1}: ${format(pass.output)}`}>
                    <div
                      className={`w-full rounded ${pass.kept ? tone : 'bg-rose-300'}`}
                      style={{ height: `${Math.max(4, (Math.abs(pass.output) / maxMagnitude) * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-rose-900"><AlertTriangle size={16} />Production failure</p>
          <p className="mt-2 text-sm leading-6 text-rose-950">
            Leaving a model in training mode can keep dropout random and make BatchNorm depend on live batch composition.
            Batch size one can make that especially pathological.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-emerald-900"><ShieldCheck size={16} />Production habit</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Switch explicitly to evaluation mode, verify running-statistics behavior, and test deterministic repeatability.
            Keep dropout active at inference only when you intentionally use a method such as Monte Carlo dropout.
          </p>
        </div>
      </div>
    </section>
  );
}
