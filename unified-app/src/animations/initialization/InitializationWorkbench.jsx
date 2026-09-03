import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, SlidersHorizontal, Zap } from 'lucide-react';
import {
  ACTIVATION_PROFILES,
  ARCHITECTURE_PRESETS,
  CONTROL_LIMITS,
  INITIALIZATION_DEFAULTS,
  INITIALIZATION_METHODS,
} from './initializationConstants.js';
import { analyzeInitialization } from './initializationModel.js';
import PropagationScale from './PropagationScale.jsx';

function formatMultiplier(value) {
  if (value < 0.01 || value >= 1000) return `${value.toExponential(2)}×`;
  return `${value.toFixed(3).replace(/\.?0+$/, '')}×`;
}

function StatusCard({ label, value, status }) {
  const tone = status === 'stable'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : status === 'vanishing'
      ? 'border-sky-200 bg-sky-50 text-sky-900'
      : 'border-rose-200 bg-rose-50 text-rose-900';

  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <div className="text-xs font-black uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-black">{formatMultiplier(value)}</div>
      <div className="mt-1 text-xs font-semibold capitalize">{status}</div>
    </div>
  );
}

export default function InitializationWorkbench() {
  const [method, setMethod] = useState(INITIALIZATION_DEFAULTS.method);
  const [activation, setActivation] = useState(INITIALIZATION_DEFAULTS.activation);
  const [fanIn, setFanIn] = useState(INITIALIZATION_DEFAULTS.fanIn);
  const [fanOut, setFanOut] = useState(INITIALIZATION_DEFAULTS.fanOut);
  const [layers, setLayers] = useState(INITIALIZATION_DEFAULTS.layers);

  const analysis = useMemo(
    () => analyzeInitialization({ method, activation, fanIn, fanOut, layers }),
    [activation, fanIn, fanOut, layers, method],
  );
  const activationProfile = ACTIVATION_PROFILES[activation];

  const applyPreset = (preset) => {
    setFanIn(preset.fanIn);
    setFanOut(preset.fanOut);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
            <SlidersHorizontal size={16} />
            Initialization controls
          </div>

          <div className="grid gap-2">
            {Object.entries(INITIALIZATION_METHODS).map(([id, config]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  method === id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-black">{config.label}</div>
                <div className="text-sm">{config.description}</div>
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
            {Object.entries(ACTIVATION_PROFILES).map(([id, config]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActivation(id)}
                className={`rounded-lg px-3 py-2 ${
                  activation === id ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">{activationProfile.note}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
            <Activity size={16} />
            Architecture stress test
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {Object.entries(ARCHITECTURE_PRESETS).map(([id, preset]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(preset)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                <div className="text-sm font-black text-slate-800">{preset.label}</div>
                <div className="mt-1 font-mono text-xs text-slate-500">{preset.fanIn} → {preset.fanOut}</div>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="init-fan-in">
              Fan-in {fanIn}
              <input
                id="init-fan-in"
                type="range"
                min={CONTROL_LIMITS.fan.min}
                max={CONTROL_LIMITS.fan.max}
                step={CONTROL_LIMITS.fan.step}
                value={fanIn}
                onChange={(event) => setFanIn(Number(event.target.value))}
                className="mt-2 w-full accent-emerald-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700" htmlFor="init-fan-out">
              Fan-out {fanOut}
              <input
                id="init-fan-out"
                type="range"
                min={CONTROL_LIMITS.fan.min}
                max={CONTROL_LIMITS.fan.max}
                step={CONTROL_LIMITS.fan.step}
                value={fanOut}
                onChange={(event) => setFanOut(Number(event.target.value))}
                className="mt-2 w-full accent-emerald-500"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="init-layers">
            Repeated layers {layers}
          </label>
          <input
            id="init-layers"
            type="range"
            min={CONTROL_LIMITS.layers.min}
            max={CONTROL_LIMITS.layers.max}
            step={CONTROL_LIMITS.layers.step}
            value={layers}
            onChange={(event) => setLayers(Number(event.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />

          <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-200">
              <Zap size={14} />
              Weight scale
            </div>
            <div className="mt-1 text-3xl font-black">σ = {analysis.weightStd.toFixed(4)}</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-slate-400">Forward / layer</div>
                <div className="font-black text-white">{formatMultiplier(analysis.forwardMultiplier)}</div>
              </div>
              <div>
                <div className="text-slate-400">Backward / layer</div>
                <div className="font-black text-white">{formatMultiplier(analysis.backwardMultiplier)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {analysis.hiddenGradientFailure && (
        <section className="rounded-2xl border border-rose-300 bg-rose-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-rose-700" size={20} />
            <div>
              <h3 className="font-black text-rose-950">The forward path is hiding a gradient failure</h3>
              <p className="mt-1 text-sm leading-6 text-rose-900">
                Activations finish in the stable range, but gradients are {analysis.backwardHealth}. He initialization preserves
                ReLU's forward scale from fan-in; it does not guarantee backward scale when fan-out is very different.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <StatusCard label="Final activations" value={analysis.finalForward} status={analysis.forwardHealth} />
        <StatusCard label="Final gradients" value={analysis.finalBackward} status={analysis.backwardHealth} />
        <div className={`rounded-xl border p-3 ${
          analysis.forwardHealth === 'stable' && analysis.backwardHealth === 'stable'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-amber-200 bg-amber-50 text-amber-900'
        }`}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
            {analysis.forwardHealth === 'stable' && analysis.backwardHealth === 'stable'
              ? <CheckCircle2 size={15} />
              : <AlertTriangle size={15} />}
            Combined check
          </div>
          <div className="mt-2 text-lg font-black">
            {analysis.forwardHealth === 'stable' && analysis.backwardHealth === 'stable'
              ? 'Both paths healthy'
              : 'Inspect both paths'}
          </div>
          <p className="mt-1 text-xs leading-5">
            Initialization is not healthy just because the forward activations look healthy.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PropagationScale
          direction="forward"
          multiplier={analysis.forwardMultiplier}
          series={analysis.forwardSeries}
          health={analysis.forwardHealth}
        />
        <PropagationScale
          direction="backward"
          multiplier={analysis.backwardMultiplier}
          series={analysis.backwardSeries}
          health={analysis.backwardHealth}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
        <h3 className="font-black text-slate-900">What this approximation measures</h3>
        <p className="mt-2">
          The tracks show multiplicative <strong>second-moment scale</strong>, not an exact finite-network variance. For ReLU,
          the mean-field approximation uses a 1/2 factor in both the forward activation and backward derivative paths.
          Xavier and He are therefore starting-point variance rules, not guarantees that every architecture stays numerically healthy.
        </p>
        {activation === 'tanh' && (
          <p className="mt-2 font-semibold text-amber-800">
            tanh is shown in its local-linear regime. Once pre-activations saturate, derivatives approach zero and real gradients can vanish faster.
          </p>
        )}
      </section>
    </div>
  );
}
