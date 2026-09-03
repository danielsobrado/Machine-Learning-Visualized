import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import AccumulationFailureLab from './AccumulationFailureLab.jsx';
import LoopTracePanel from './LoopTracePanel.jsx';
import TrainingLoopControls from './TrainingLoopControls.jsx';
import { TRAINING_LOOP_DEFAULTS } from './trainingLoopConstants.js';
import { simulateTrainingLoop } from './trainingLoopModel.js';

export default function TrainingLoopDynamicsAnimation() {
  const [mode, setMode] = useState('correct');
  const [learningRate, setLearningRate] = useState(TRAINING_LOOP_DEFAULTS.learningRate);
  const [curvature, setCurvature] = useState(TRAINING_LOOP_DEFAULTS.curvature);
  const [optimizerSteps, setOptimizerSteps] = useState(TRAINING_LOOP_DEFAULTS.optimizerSteps);
  const [microBatches, setMicroBatches] = useState(TRAINING_LOOP_DEFAULTS.microBatches);

  const config = useMemo(() => ({
    learningRate,
    curvature,
    optimizerSteps,
    microBatches,
    startParameter: TRAINING_LOOP_DEFAULTS.startParameter,
    noiseAmplitude: TRAINING_LOOP_DEFAULTS.noiseAmplitude,
  }), [curvature, learningRate, microBatches, optimizerSteps]);

  const result = useMemo(() => simulateTrainingLoop({ ...config, mode }), [config, mode]);

  const reset = () => {
    setMode('correct');
    setLearningRate(TRAINING_LOOP_DEFAULTS.learningRate);
    setCurvature(TRAINING_LOOP_DEFAULTS.curvature);
    setOptimizerSteps(TRAINING_LOOP_DEFAULTS.optimizerSteps);
    setMicroBatches(TRAINING_LOOP_DEFAULTS.microBatches);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Training loop dynamics</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Make the loop execute the bug instead of drawing a scary curve</h1>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              This lab runs gradient descent on a one-parameter quadratic objective. Every loss point comes from an actual parameter update, so learning-rate stability, micro-batch accumulation, and stale gradients have causal consequences rather than hand-authored labels.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </header>

      <TrainingLoopControls
        mode={mode}
        learningRate={learningRate}
        curvature={curvature}
        optimizerSteps={optimizerSteps}
        microBatches={microBatches}
        onModeChange={setMode}
        onLearningRateChange={setLearningRate}
        onCurvatureChange={setCurvature}
        onOptimizerStepsChange={setOptimizerSteps}
        onMicroBatchesChange={setMicroBatches}
      />

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm leading-6 text-indigo-950">
        <strong>Exact deterministic baseline:</strong> for <span className="font-mono">L(θ)=½λθ²</span>, gradient descent obeys <span className="font-mono">θₜ₊₁=(1−αλ)θₜ</span>. The deterministic stability condition is <span className="font-mono font-black">0 &lt; αλ &lt; 2</span>. Mini-batch noise perturbs the path, but it does not justify inventing a different stability boundary.
      </section>

      <LoopTracePanel result={result} />
      <AccumulationFailureLab config={config} />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-emerald-700">What this lab measures</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Parameter values, true gradients, noisy micro-batch gradients, the exact gradient presented to the optimizer, update magnitude, and resulting training loss.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-amber-700">What it deliberately does not fake</h2>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            There is no “validation difficulty” knob that manufactures overfitting. Train/validation divergence needs a model/data generalization story, not an arbitrary offset added to training loss.
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-violet-700">Production checks</h2>
          <p className="mt-3 text-sm leading-6 text-violet-950">
            Log gradient and update norms separately, define accumulation normalization, clear gradients at the intended boundary, record scheduler step semantics, save optimizer state, and run validation in evaluation mode.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="training-loop-dynamics" title="Training loop check" />
    </div>
  );
}
