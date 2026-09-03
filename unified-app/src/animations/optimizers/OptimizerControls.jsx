import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { OPTIMIZER_CONTROL_LIMITS, OPTIMIZERS } from './optimizerConstants.js';

function RangeControl({ id, label, value, min, max, step, onChange, format = (item) => item }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700" htmlFor={id}>
      <span className="flex items-center justify-between gap-3">
        {label}
        <strong className="text-slate-950">{format(value)}</strong>
      </span>
      <input
        id={id}
        min={min}
        max={max}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-blue-600"
      />
    </label>
  );
}

export default function OptimizerControls({
  optimizer,
  learningRate,
  beta1,
  beta2,
  batchSize,
  steps,
  onOptimizerChange,
  onLearningRateChange,
  onBeta1Change,
  onBeta2Change,
  onBatchSizeChange,
  onStepsChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
        <SlidersHorizontal size={16} />
        Optimizer controls
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {Object.entries(OPTIMIZERS).map(([id, config]) => (
          <button
            key={id}
            type="button"
            onClick={() => onOptimizerChange(id)}
            aria-pressed={optimizer === id}
            className={`rounded-xl border px-4 py-3 text-left transition ${optimizer === id ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'}`}
          >
            <div className="font-black">{config.label}</div>
            <div className={`mt-1 text-xs leading-5 ${optimizer === id ? 'text-blue-50' : 'text-slate-500'}`}>{config.detail}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <RangeControl
          id="optimizer-learning-rate"
          label="Learning rate"
          value={learningRate}
          {...OPTIMIZER_CONTROL_LIMITS.learningRate}
          onChange={onLearningRateChange}
          format={(value) => value.toFixed(2)}
        />
        <RangeControl
          id="optimizer-beta1"
          label="β₁ / momentum"
          value={beta1}
          {...OPTIMIZER_CONTROL_LIMITS.beta1}
          onChange={onBeta1Change}
          format={(value) => value.toFixed(2)}
        />
        <RangeControl
          id="optimizer-beta2"
          label="Adam β₂"
          value={beta2}
          {...OPTIMIZER_CONTROL_LIMITS.beta2}
          onChange={onBeta2Change}
          format={(value) => value.toFixed(3)}
        />
        <RangeControl
          id="optimizer-batch-size"
          label="Mini-batch"
          value={batchSize}
          {...OPTIMIZER_CONTROL_LIMITS.batchSize}
          onChange={onBatchSizeChange}
        />
        <RangeControl
          id="optimizer-steps"
          label="Steps"
          value={steps}
          {...OPTIMIZER_CONTROL_LIMITS.steps}
          onChange={onStepsChange}
        />
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
        β₁ affects Momentum velocity and Adam's first moment. β₂ affects Adam only. Sharing one learning rate across optimizers is useful for mechanism comparison, but it is not a fair final performance comparison.
      </p>
    </section>
  );
}
