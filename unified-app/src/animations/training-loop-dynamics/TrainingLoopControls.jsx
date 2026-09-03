import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { LOOP_MODES, TRAINING_LOOP_LIMITS } from './trainingLoopConstants.js';

function RangeControl({ id, label, value, limits, onChange, format = (item) => item }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor={id}>
      <span className="flex items-center justify-between gap-3">
        {label}
        <strong className="font-mono text-slate-950">{format(value)}</strong>
      </span>
      <input
        id={id}
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-indigo-600"
      />
    </label>
  );
}

export default function TrainingLoopControls({
  mode,
  learningRate,
  curvature,
  optimizerSteps,
  microBatches,
  onModeChange,
  onLearningRateChange,
  onCurvatureChange,
  onOptimizerStepsChange,
  onMicroBatchesChange,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-indigo-700">
        <SlidersHorizontal size={16} />
        Loop controls
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {Object.entries(LOOP_MODES).map(([id, config]) => (
          <button
            key={id}
            type="button"
            onClick={() => onModeChange(id)}
            aria-pressed={mode === id}
            className={`rounded-xl border px-4 py-3 text-left transition ${mode === id ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
          >
            <div className="font-black">{config.label}</div>
            <div className={`mt-1 text-xs leading-5 ${mode === id ? 'text-indigo-50' : 'text-slate-500'}`}>{config.description}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <RangeControl
          id="tld-learning-rate"
          label="Learning rate α"
          value={learningRate}
          limits={TRAINING_LOOP_LIMITS.learningRate}
          onChange={onLearningRateChange}
          format={(value) => value.toFixed(2)}
        />
        <RangeControl
          id="tld-curvature"
          label="Quadratic curvature λ"
          value={curvature}
          limits={TRAINING_LOOP_LIMITS.curvature}
          onChange={onCurvatureChange}
          format={(value) => value.toFixed(1)}
        />
        <RangeControl
          id="tld-micro-batches"
          label="Micro-batches / optimizer step"
          value={microBatches}
          limits={TRAINING_LOOP_LIMITS.microBatches}
          onChange={onMicroBatchesChange}
        />
        <RangeControl
          id="tld-optimizer-steps"
          label="Optimizer steps"
          value={optimizerSteps}
          limits={TRAINING_LOOP_LIMITS.optimizerSteps}
          onChange={onOptimizerStepsChange}
        />
      </div>
    </section>
  );
}
