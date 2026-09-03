import React, { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import AdamMechanicsLab from './AdamMechanicsLab.jsx';
import OptimizerControls from './OptimizerControls.jsx';
import OptimizerFairnessLab from './OptimizerFairnessLab.jsx';
import OptimizerLandscape3D from './OptimizerLandscape3D.jsx';
import OptimizerPathPanel from './OptimizerPathPanel.jsx';
import OptimizerPredictionCheck from './OptimizerPredictionCheck.jsx';
import { OPTIMIZER_DEFAULTS, OPTIMIZERS } from './optimizerConstants.js';
import { simulate } from './optimizerModel.js';

export default function OptimizersAnimation() {
  const [optimizer, setOptimizer] = useState(OPTIMIZER_DEFAULTS.optimizer);
  const [learningRate, setLearningRate] = useState(OPTIMIZER_DEFAULTS.learningRate);
  const [beta1, setBeta1] = useState(OPTIMIZER_DEFAULTS.beta1);
  const [beta2, setBeta2] = useState(OPTIMIZER_DEFAULTS.beta2);
  const [batchSize, setBatchSize] = useState(OPTIMIZER_DEFAULTS.batchSize);
  const [steps, setSteps] = useState(OPTIMIZER_DEFAULTS.steps);

  const simulationConfig = useMemo(() => ({
    learningRate,
    beta1,
    beta2,
    epsilon: OPTIMIZER_DEFAULTS.epsilon,
    batchSize,
    steps,
  }), [batchSize, beta1, beta2, learningRate, steps]);

  const allPaths = useMemo(() => Object.fromEntries(
    Object.keys(OPTIMIZERS).map((id) => [id, simulate({ optimizer: id, ...simulationConfig })]),
  ), [simulationConfig]);
  const selectedPath = allPaths[optimizer];

  const reset = () => {
    setOptimizer(OPTIMIZER_DEFAULTS.optimizer);
    setLearningRate(OPTIMIZER_DEFAULTS.learningRate);
    setBeta1(OPTIMIZER_DEFAULTS.beta1);
    setBeta2(OPTIMIZER_DEFAULTS.beta2);
    setBatchSize(OPTIMIZER_DEFAULTS.batchSize);
    setSteps(OPTIMIZER_DEFAULTS.steps);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">Training dynamics</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Optimizers: compare mechanisms without inventing a winner</h1>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              SGD, Momentum, and Adam transform the same noisy gradient differently. This lesson separates two questions that are often mixed together: what an update rule does, and which tuned optimizer works best for a particular training setup.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </header>

      <OptimizerControls
        optimizer={optimizer}
        learningRate={learningRate}
        beta1={beta1}
        beta2={beta2}
        batchSize={batchSize}
        steps={steps}
        onOptimizerChange={setOptimizer}
        onLearningRateChange={setLearningRate}
        onBeta1Change={setBeta1}
        onBeta2Change={setBeta2}
        onBatchSizeChange={setBatchSize}
        onStepsChange={setSteps}
      />

      <OptimizerPredictionCheck path={selectedPath} />
      <OptimizerPathPanel path={selectedPath} batchSize={batchSize} />
      <OptimizerLandscape3D paths={allPaths} activeOptimizer={optimizer} />

      <OptimizerFairnessLab
        learningRate={learningRate}
        beta1={beta1}
        beta2={beta2}
        epsilon={OPTIMIZER_DEFAULTS.epsilon}
        batchSize={batchSize}
        steps={steps}
      />

      <AdamMechanicsLab />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-blue-700">Controlled comparison</h2>
          <p className="mt-3 text-sm leading-6 text-blue-950">
            Keeping α and the sampled gradients fixed isolates how update rules transform the same signal. Use the 2D and 3D paths for mechanism, not a universal ranking.
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-violet-700">Fair model selection</h2>
          <p className="mt-3 text-sm leading-6 text-violet-950">
            Tune each optimizer separately on training/validation criteria, compare schedules and wall-clock cost, and repeat across seeds before claiming one optimizer is better.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-amber-700">Adam caveat</h2>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            Adam's second moment rescales coordinates from gradient history. It is not a direct curvature oracle, and fast training-loss reduction is not evidence of better generalization.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="optimizers" title="Optimizer check" />
    </div>
  );
}
