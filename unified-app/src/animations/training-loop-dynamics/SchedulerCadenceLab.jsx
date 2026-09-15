import React, { useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';
import {
  SCHEDULER_CADENCE_DEFAULTS,
  SCHEDULER_CADENCE_LIMITS,
} from './schedulerCadenceConstants.js';
import {
  learningRateAtStep,
  schedulerCadenceSummary,
  warmupProgress,
} from './schedulerCadenceModel.js';

function Control({ label, value, limits, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <strong className="font-mono text-slate-950">{value}</strong>
      </span>
      <input
        className="mt-2 w-full accent-indigo-600"
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ProgressCard({ title, progress, learningRate, detail, tone }) {
  return (
    <article className={`rounded-xl border p-4 ${tone}`}>
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div><span className="block text-xs text-slate-500">warm-up progress</span><strong className="font-mono">{(progress * 100).toFixed(1)}%</strong></div>
        <div><span className="block text-xs text-slate-500">learning rate</span><strong className="font-mono">{learningRate.toExponential(2)}</strong></div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">{detail}</p>
    </article>
  );
}

export default function SchedulerCadenceLab() {
  const [accumulationSteps, setAccumulationSteps] = useState(SCHEDULER_CADENCE_DEFAULTS.accumulationSteps);
  const [warmupOptimizerSteps, setWarmupOptimizerSteps] = useState(SCHEDULER_CADENCE_DEFAULTS.warmupOptimizerSteps);
  const [inspectedOptimizerStep, setInspectedOptimizerStep] = useState(SCHEDULER_CADENCE_DEFAULTS.inspectedOptimizerStep);

  const summary = useMemo(() => schedulerCadenceSummary({ accumulationSteps, warmupOptimizerSteps }), [accumulationSteps, warmupOptimizerSteps]);
  const shared = {
    optimizerStep: inspectedOptimizerStep,
    accumulationSteps,
    warmupOptimizerSteps,
    targetLearningRate: SCHEDULER_CADENCE_DEFAULTS.targetLearningRate,
  };
  const correctProgress = warmupProgress({ ...shared, cadence: 'optimizer-step' });
  const brokenProgress = warmupProgress({ ...shared, cadence: 'micro-batch' });
  const correctLearningRate = learningRateAtStep({ ...shared, cadence: 'optimizer-step' });
  const brokenLearningRate = learningRateAtStep({ ...shared, cadence: 'micro-batch' });

  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-800"><Clock3 size={20} /></div>
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Scheduler cadence lab</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Warm-up should count the event it was defined in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            If warm-up is specified in optimizer updates, advancing the scheduler after every micro-batch compresses the schedule by the accumulation factor. The parameter update still happens only after the accumulation boundary.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[310px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="space-y-4">
            <Control label="Micro-batches per optimizer step" value={accumulationSteps} limits={SCHEDULER_CADENCE_LIMITS.accumulationSteps} onChange={setAccumulationSteps} />
            <Control label="Warm-up optimizer steps" value={warmupOptimizerSteps} limits={SCHEDULER_CADENCE_LIMITS.warmupOptimizerSteps} onChange={setWarmupOptimizerSteps} />
            <Control label="Inspect optimizer step" value={inspectedOptimizerStep} limits={SCHEDULER_CADENCE_LIMITS.inspectedOptimizerStep} onChange={setInspectedOptimizerStep} />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ProgressCard
              title="Correct: scheduler.step() with optimizer.step()"
              progress={correctProgress}
              learningRate={correctLearningRate}
              detail={`${inspectedOptimizerStep} optimizer updates produce ${inspectedOptimizerStep} scheduler ticks.`}
              tone="border-emerald-200 bg-emerald-50"
            />
            <ProgressCard
              title="Bug: scheduler.step() every micro-batch"
              progress={brokenProgress}
              learningRate={brokenLearningRate}
              detail={`${inspectedOptimizerStep} optimizer updates contain ${inspectedOptimizerStep * accumulationSteps} micro-batches, so the scheduler advances that many times.`}
              tone="border-rose-200 bg-rose-50"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
            <strong className="text-slate-950">Target-rate timing:</strong> the correct schedule reaches its target after <span className="font-mono font-black">{summary.correct.optimizerStepsUntilTarget}</span> optimizer updates and <span className="font-mono font-black">{summary.correct.microBatchesUntilTarget}</span> micro-batches. The broken schedule reaches the same scheduler tick after only <span className="font-mono font-black">{summary.microBatchBug.completedOptimizerStepsAtTarget}</span> completed optimizer updates{summary.microBatchBug.microBatchesIntoNextStep > 0 ? ` plus ${summary.microBatchBug.microBatchesIntoNextStep} micro-batches` : ''}.
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            The rule is not “always step schedulers after optimizers.” Some schedules are intentionally defined per epoch, token, or other event. The bug is advancing a schedule on a different clock than the one used to configure it.
          </div>
        </div>
      </div>
    </section>
  );
}
