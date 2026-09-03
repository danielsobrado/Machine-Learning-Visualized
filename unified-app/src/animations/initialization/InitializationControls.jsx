import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  ACTIVATION_PROFILES,
  ARCHITECTURE_PRESETS,
  CONTROL_LIMITS,
  INITIALIZATION_METHODS,
} from './initializationConstants.js';

export default function InitializationControls({
  method,
  activation,
  inputWidth,
  hiddenWidth,
  layers,
  onMethodChange,
  onActivationChange,
  onArchitectureChange,
  onInputWidthChange,
  onHiddenWidthChange,
  onLayersChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
        <SlidersHorizontal size={16} />
        Initialization controls
      </div>

      <div className="mt-4 grid gap-2 xl:grid-cols-2">
        {Object.entries(INITIALIZATION_METHODS).map(([id, config]) => (
          <button
            key={id}
            type="button"
            onClick={() => onMethodChange(id)}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              method === id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="font-black">{config.label}</div>
            <div className="mt-1 font-mono text-xs text-slate-500">{config.formula}</div>
            <div className="mt-1 text-xs leading-5">{config.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
        {Object.entries(ACTIVATION_PROFILES).map(([id, config]) => (
          <button
            key={id}
            type="button"
            onClick={() => onActivationChange(id)}
            className={`rounded-lg px-3 py-2 ${activation === id ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'}`}
          >
            {config.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{ACTIVATION_PROFILES[activation].note}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {Object.values(ARCHITECTURE_PRESETS).map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onArchitectureChange(preset)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            <div className="text-sm font-black text-slate-800">{preset.label}</div>
            <div className="mt-1 font-mono text-xs text-slate-500">{preset.inputWidth} → {preset.hiddenWidth}</div>
            <div className="mt-1 text-xs leading-5 text-slate-600">{preset.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700" htmlFor="init-input-width">
          Input width {inputWidth}
          <input
            id="init-input-width"
            type="range"
            min={CONTROL_LIMITS.width.min}
            max={CONTROL_LIMITS.width.max}
            step={CONTROL_LIMITS.width.step}
            value={inputWidth}
            onChange={(event) => onInputWidthChange(Number(event.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700" htmlFor="init-hidden-width">
          Hidden width {hiddenWidth}
          <input
            id="init-hidden-width"
            type="range"
            min={CONTROL_LIMITS.width.min}
            max={CONTROL_LIMITS.width.max}
            step={CONTROL_LIMITS.width.step}
            value={hiddenWidth}
            onChange={(event) => onHiddenWidthChange(Number(event.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="init-layers">
        Trainable layers {layers}
      </label>
      <input
        id="init-layers"
        type="range"
        min={CONTROL_LIMITS.layers.min}
        max={CONTROL_LIMITS.layers.max}
        step={CONTROL_LIMITS.layers.step}
        value={layers}
        onChange={(event) => onLayersChange(Number(event.target.value))}
        className="mt-2 w-full accent-emerald-500"
      />
    </section>
  );
}
