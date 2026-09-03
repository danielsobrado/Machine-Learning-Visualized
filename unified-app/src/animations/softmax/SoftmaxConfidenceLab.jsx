import React, { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Target } from 'lucide-react';
import { confidenceScalingExperiment, shiftInvarianceExperiment } from './softmaxFailureModel.js';

const BASE_LOGITS = [2, 1, 0];
const TARGET_INDEX = 1;

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function Distribution({ title, logits, probabilities, targetIndex, prediction }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {probabilities.map((probability, index) => (
          <div key={index}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-700">
                class {index}{index === targetIndex ? ' · true label' : ''}{index === prediction ? ' · predicted' : ''}
              </span>
              <span className="font-mono text-slate-700">logit {logits[index].toFixed(1)} · {percent(probability)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(1, probability * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SoftmaxConfidenceLab() {
  const [scale, setScale] = useState(5);
  const experiment = useMemo(() => confidenceScalingExperiment({
    logits: BASE_LOGITS,
    scale,
    targetIndex: TARGET_INDEX,
  }), [scale]);
  const shift = useMemo(() => shiftInvarianceExperiment(BASE_LOGITS, 1000), []);

  return (
    <section className="space-y-5 rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-700">
            <Gauge size={16} />
            Confidence trap
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Softmax sharpness is not calibration</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Multiplying every logit by the same positive scale preserves the class ranking, but can push the largest softmax probability arbitrarily close to 100%. The model has not learned anything new.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-3 text-sm text-slate-700">
          True class = 1 · initial prediction = class {experiment.beforePrediction}
        </div>
      </div>

      <label className="block max-w-xl text-sm font-bold text-slate-700" htmlFor="softmax-logit-scale">
        Multiply all logits by {scale.toFixed(1)}×
        <input
          id="softmax-logit-scale"
          type="range"
          min="0.5"
          max="8"
          step="0.5"
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
          className="mt-2 w-full accent-amber-600"
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <Distribution
          title="Original logits"
          logits={experiment.logits}
          probabilities={experiment.before}
          targetIndex={TARGET_INDEX}
          prediction={experiment.beforePrediction}
        />
        <Distribution
          title={`${scale.toFixed(1)}× scaled logits`}
          logits={experiment.scaledLogits}
          probabilities={experiment.after}
          targetIndex={TARGET_INDEX}
          prediction={experiment.afterPrediction}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Prediction</div>
          <div className="mt-1 text-2xl font-black">{experiment.beforePrediction} → {experiment.afterPrediction}</div>
          <p className="mt-1 text-xs text-slate-600">Class ranking is unchanged.</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-blue-700">Max probability</div>
          <div className="mt-1 text-2xl font-black">{percent(experiment.beforeMaxProbability)} → {percent(experiment.afterMaxProbability)}</div>
          <p className="mt-1 text-xs text-slate-600">Sharpness can increase without new evidence.</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-rose-700">True-class probability</div>
          <div className="mt-1 text-2xl font-black">{percent(experiment.beforeTargetProbability)} → {percent(experiment.afterTargetProbability)}</div>
          <p className="mt-1 text-xs text-slate-600">Here the model is confidently wrong.</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-rose-700">NLL</div>
          <div className="mt-1 text-2xl font-black">{experiment.beforeNll.toFixed(2)} → {experiment.afterNll.toFixed(2)}</div>
          <p className="mt-1 text-xs text-slate-600">Overconfidence is punished when the label disagrees.</p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <AlertTriangle size={17} className="mr-1 inline" />
          <strong>Deployment lesson:</strong> a 99% softmax output is not evidence that 99% of equally scored predictions are correct. Calibration must be measured on held-out data under the deployment distribution.
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <Target size={17} className="mr-1 inline" />
          <strong>Numerical lesson:</strong> adding +1000 to every logit changes the probabilities by at most {shift.maxAbsoluteDifference.toExponential(1)} because stable softmax depends on relative logits, not their common offset.
        </div>
      </div>
    </section>
  );
}
