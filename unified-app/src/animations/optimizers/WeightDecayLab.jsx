import React, { useMemo, useState } from 'react';
import { Scale, SplitSquareHorizontal } from 'lucide-react';
import {
  WEIGHT_DECAY_CONTROL_LIMITS,
  WEIGHT_DECAY_DEFAULTS,
} from './weightDecayConstants.js';
import { compareWeightDecay } from './weightDecayModel.js';

function format(value) {
  if (Math.abs(value) < 0.001 && value !== 0) return value.toExponential(2);
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function Control({ label, value, limits, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <strong className="font-mono text-slate-950">{format(value)}</strong>
      </span>
      <input
        className="mt-2 w-full accent-violet-600"
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

function ResultCard({ title, subtitle, shrink, next, tone }) {
  return (
    <article className={`rounded-xl border p-4 ${tone}`}>
      <h3 className="font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-600">{subtitle}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {shrink.map((value, index) => (
          <div key={index} className="rounded-lg bg-white p-3">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">coordinate {index + 1}</div>
            <div className="mt-2 font-mono text-sm text-slate-700">shrink {format(value)}</div>
            <div className="font-mono text-lg font-black text-slate-950">θ′={format(next[index])}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function WeightDecayLab() {
  const [learningRate, setLearningRate] = useState(WEIGHT_DECAY_DEFAULTS.learningRate);
  const [weightDecay, setWeightDecay] = useState(WEIGHT_DECAY_DEFAULTS.weightDecay);
  const [secondCoordinateRms, setSecondCoordinateRms] = useState(WEIGHT_DECAY_DEFAULTS.adaptiveRms[1]);

  const config = useMemo(() => ({
    ...WEIGHT_DECAY_DEFAULTS,
    adaptiveRms: [WEIGHT_DECAY_DEFAULTS.adaptiveRms[0], secondCoordinateRms],
    learningRate,
    weightDecay,
  }), [learningRate, secondCoordinateRms, weightDecay]);
  const comparison = useMemo(() => compareWeightDecay(config), [config]);

  const l2Ratio = comparison.l2Shrink[1] === 0
    ? Infinity
    : comparison.l2Shrink[0] / comparison.l2Shrink[1];

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-violet-100 p-2 text-violet-800"><SplitSquareHorizontal size={20} /></div>
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Regularization mechanics</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">L2 inside an adaptive gradient is not AdamW decay</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            This snapshot isolates regularization by setting the current data gradient to zero while keeping different Adam-style RMS states from earlier gradients. The two parameters both start at 2, so any unequal shrinkage comes from where the regularization term enters the update.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 font-black text-slate-950"><Scale size={17} /> Shared setup</div>
          <div className="mt-3 rounded-lg bg-slate-50 p-3 font-mono text-xs leading-6 text-slate-700">
            θ = [2, 2]<br />
            data gradient = [0, 0]<br />
            RMS state = [0.1, {format(secondCoordinateRms)}]
          </div>
          <div className="mt-4 space-y-4">
            <Control label="Learning rate" value={learningRate} limits={WEIGHT_DECAY_CONTROL_LIMITS.learningRate} onChange={setLearningRate} />
            <Control label="Regularization λ" value={weightDecay} limits={WEIGHT_DECAY_CONTROL_LIMITS.weightDecay} onChange={setWeightDecay} />
            <Control label="Coordinate 2 RMS" value={secondCoordinateRms} limits={WEIGHT_DECAY_CONTROL_LIMITS.secondCoordinateRms} onChange={setSecondCoordinateRms} />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ResultCard
              title="L2 term inside adaptive gradient"
              subtitle="λθ is added to the gradient first, then each coordinate is divided by its own RMS state."
              shrink={comparison.l2Shrink}
              next={comparison.l2.nextParameters}
              tone="border-rose-200 bg-rose-50"
            />
            <ResultCard
              title="Decoupled weight decay"
              subtitle="The adaptive data update is computed separately, then the decay component applies −α·λ·θ directly."
              shrink={comparison.adamwShrink}
              next={comparison.adamw.nextParameters}
              tone="border-emerald-200 bg-emerald-50"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
            <strong className="text-slate-950">What changes:</strong> with the current RMS states, the isolated L2 shrink on coordinate 1 is about <span className="font-mono font-black">{format(l2Ratio)}×</span> the shrink on coordinate 2, even though both parameters are equal. Decoupled decay applies the same proportional shrink to equal parameters because it bypasses the adaptive preconditioner.
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            With plain SGD and no coordinate-wise preconditioner, an L2 penalty and multiplicative weight decay can be closely related under common formulations. The distinction becomes important when adaptive scaling changes the gradient coordinate by coordinate.
          </div>
        </div>
      </div>
    </section>
  );
}
