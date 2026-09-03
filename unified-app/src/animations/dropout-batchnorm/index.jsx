import React, { useMemo, useState } from 'react';
import { Activity, Layers, SlidersHorizontal, ToggleLeft } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { DROPOUT_BATCHNORM_DEFAULTS } from './dropoutBatchNormConstants.js';
import { layerFlow } from './dropoutBatchNormModel.js';
import ModeFailureLab from './ModeFailureLab.jsx';

function RangeControl({ id, label, value, min, max, step, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700" htmlFor={id}>
      {label}: {value.toFixed(1)}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-cyan-500"
      />
    </label>
  );
}

export default function DropoutBatchNormAnimation() {
  const defaults = DROPOUT_BATCHNORM_DEFAULTS;
  const [activation, setActivation] = useState(defaults.activation);
  const [batchMean, setBatchMean] = useState(defaults.batchMean);
  const [batchStd, setBatchStd] = useState(defaults.batchStd);
  const [runningMean, setRunningMean] = useState(defaults.runningMean);
  const [runningStd, setRunningStd] = useState(defaults.runningStd);
  const [gamma, setGamma] = useState(defaults.gamma);
  const [beta, setBeta] = useState(defaults.beta);
  const [dropoutRate, setDropoutRate] = useState(defaults.dropoutRate);
  const [trainingMode, setTrainingMode] = useState(defaults.trainingMode);

  const flow = useMemo(() => layerFlow({
    activation,
    batchMean,
    batchStd,
    runningMean,
    runningStd,
    gamma,
    beta,
    dropoutRate,
    trainingMode,
  }), [activation, batchMean, batchStd, runningMean, runningStd, gamma, beta, dropoutRate, trainingMode]);

  const sampledPass = flow.passes[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Regularization and activation statistics</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Dropout + BatchNorm</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          BatchNorm and dropout both change behavior between training and evaluation. BatchNorm uses current batch statistics
          while training and running statistics during normal inference; dropout randomly masks units only while training.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-700">
            <SlidersHorizontal size={16} />
            Layer controls
          </div>

          <RangeControl id="dbn-activation" label="Incoming activation" value={activation} min={-4} max={6} step={0.5} onChange={setActivation} />

          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-violet-700">Training · current batch statistics</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <RangeControl id="dbn-mean" label="Batch mean" value={batchMean} min={-3} max={4} step={0.5} onChange={setBatchMean} />
              <RangeControl id="dbn-std" label="Batch std" value={batchStd} min={0.5} max={4} step={0.5} onChange={setBatchStd} />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-emerald-700">Inference · learned running statistics</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <RangeControl id="dbn-running-mean" label="Running mean" value={runningMean} min={-3} max={4} step={0.5} onChange={setRunningMean} />
              <RangeControl id="dbn-running-std" label="Running std" value={runningStd} min={0.5} max={4} step={0.5} onChange={setRunningStd} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <RangeControl id="dbn-gamma" label="BatchNorm gamma" value={gamma} min={0} max={2} step={0.1} onChange={setGamma} />
            <RangeControl id="dbn-beta" label="BatchNorm beta" value={beta} min={-2} max={2} step={0.1} onChange={setBeta} />
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="dbn-dropout">
            Dropout rate {(dropoutRate * 100).toFixed(0)}%
          </label>
          <input
            id="dbn-dropout"
            type="range"
            min="0"
            max="0.8"
            step="0.1"
            value={dropoutRate}
            onChange={(event) => setDropoutRate(Number(event.target.value))}
            className="mt-2 w-full accent-cyan-500"
          />

          <button
            type="button"
            aria-pressed={trainingMode}
            onClick={() => setTrainingMode((value) => !value)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900"
          >
            <ToggleLeft size={18} />
            {trainingMode ? 'Training mode · stochastic' : 'Inference mode · deterministic'}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-700">
            <Layers size={16} />
            BatchNorm then dropout
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Normalize</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{flow.normalized.toFixed(2)}</div>
              <p className="mt-2 text-sm text-slate-600">Using {flow.statsSource}.</p>
            </div>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
              <div className="text-xs uppercase tracking-wide text-cyan-700">Scale and shift</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{flow.batchNormOutput.toFixed(2)}</div>
              <p className="mt-2 text-sm text-slate-700">Gamma and beta restore learnable range.</p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-900 p-4 text-white">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-200">
                <Activity size={14} />
                One forward pass
              </div>
              <div className="mt-2 text-3xl font-bold">{sampledPass.output.toFixed(2)}</div>
              <p className="mt-2 text-sm text-slate-300">
                {trainingMode
                  ? sampledPass.kept ? 'Unit kept and scaled by inverted dropout.' : 'Unit masked on this sampled pass.'
                  : 'Dropout disabled during normal inference.'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">Expected dropout output</div>
              <strong className="mt-2 block text-2xl font-black text-slate-950">{flow.expectedDropoutOutput.toFixed(2)}</strong>
              <p className="mt-1 text-sm text-slate-600">Expectation is preserved; individual training passes are not.</p>
            </div>
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-violet-700">Pass variation</div>
              <strong className="mt-2 block text-2xl font-black text-slate-950">σ={flow.passSummary.std.toFixed(2)}</strong>
              <p className="mt-1 text-sm text-slate-600">Zero in inference mode under standard dropout behavior.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-amber-700">Masked passes</div>
              <strong className="mt-2 block text-2xl font-black text-slate-950">{flow.passSummary.droppedCount}/{flow.passes.length}</strong>
              <p className="mt-1 text-sm text-slate-600">Deterministic teaching sample of repeated forward passes.</p>
            </div>
          </div>

          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            BatchNorm stabilizes activation statistics; dropout regularizes by randomly removing pathways. Their training/evaluation mode switch is part of their behavior, not UI decoration.
          </p>
        </div>
      </section>

      <ModeFailureLab
        activation={activation}
        batchMean={batchMean}
        batchStd={batchStd}
        runningMean={runningMean}
        runningStd={runningStd}
        gamma={gamma}
        beta={beta}
        dropoutRate={dropoutRate}
      />

      <AssessmentPanel lessonId="dropout-batchnorm" title="Dropout and BatchNorm check" />
    </div>
  );
}
