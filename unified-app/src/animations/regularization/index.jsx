import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  ImagePlus,
  RotateCcw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import RegularizationFailureLab from './RegularizationFailureLab';
import { REGULARIZATION_EXPERIMENT } from './regularizationConstants';
import {
  PENALTIES,
  bestLambda,
  createRegularizationSnapshot,
  diagnosisForState,
  linePath,
  regularizationSummary,
  sweepProfile,
} from './regularizationModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function WeightRow({ feature, baselineWeight }) {
  const scale = Math.max(Math.abs(baselineWeight), Math.abs(feature.weight), 0.25);
  const baselineWidth = Math.min(100, (Math.abs(baselineWeight) / scale) * 100);
  const weightWidth = Math.min(100, (Math.abs(feature.weight) / scale) * 100);
  const tone = feature.useful ? 'bg-cyan-600' : 'bg-amber-500';

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <strong className="text-slate-800">{feature.label}</strong>
        <span className={`rounded px-2 py-1 text-xs font-black ${feature.useful ? 'bg-cyan-100 text-cyan-700' : 'bg-amber-100 text-amber-700'}`}>
          {feature.useful ? 'signal proxy' : 'nuisance'}
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
            <span>same data, λ = 0</span>
            <span>{baselineWeight.toFixed(2)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-slate-400" style={{ width: `${baselineWidth}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
            <span>fitted at current λ</span>
            <span>{feature.removed ? '0.00' : feature.weight.toFixed(2)}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-200">
            <div className={`h-3 rounded-full ${feature.removed ? 'bg-slate-300' : tone}`} style={{ width: `${weightWidth}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MechanismCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="flex items-center gap-2 text-sm font-black text-slate-900"><Icon size={17} />{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}

export default function RegularizationAnimation() {
  const [penaltyId, setPenaltyId] = useState('l2');
  const [lambda, setLambda] = useState(REGULARIZATION_EXPERIMENT.defaultLambda);
  const [showValidationSweep, setShowValidationSweep] = useState(true);

  const snapshot = useMemo(
    () => createRegularizationSnapshot(penaltyId, lambda),
    [penaltyId, lambda],
  );
  const unregularized = useMemo(() => createRegularizationSnapshot('none', 0), []);
  const sweep = useMemo(() => sweepProfile(penaltyId), [penaltyId]);
  const best = bestLambda(sweep);
  const summary = regularizationSummary(snapshot);
  const diagnosis = diagnosisForState({ snapshot, best, unregularized });
  const chartMax = Math.max(...sweep.flatMap((point) => [point.train, point.validation]), 1);
  const selectedLambda = snapshot.lambda;

  const reset = () => {
    setPenaltyId('l2');
    setLambda(REGULARIZATION_EXPERIMENT.defaultLambda);
    setShowValidationSweep(true);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Generalization control</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Regularization</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              These curves come from actual fitted linear models. Every lambda refits the same deterministic training sample,
              scaling is learned from training rows only, and the validation curve is measured on a separate generated sample.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Penalty controls
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Penalty family</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(PENALTIES).map(([id, penalty]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPenaltyId(id)}
                  aria-pressed={penaltyId === id}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-black transition ${
                    penaltyId === id ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {penalty.label}
                  <span className={`mt-1 block text-xs font-semibold normal-case leading-4 ${penaltyId === id ? 'text-cyan-50' : 'text-slate-500'}`}>
                    {penalty.detail}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Lambda: {selectedLambda.toFixed(2)}
            <input
              min="0"
              max={REGULARIZATION_EXPERIMENT.maxLambda}
              step="0.01"
              type="range"
              value={penaltyId === 'none' ? 0 : lambda}
              disabled={penaltyId === 'none'}
              aria-label="Regularization strength lambda"
              onChange={(event) => setLambda(Number(event.target.value))}
            />
            <span className="text-xs font-semibold text-slate-500">
              Lambda multiplies the coefficient penalty; the intercept is not penalized.
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={showValidationSweep}
              onChange={(event) => setShowValidationSweep(event.target.checked)}
              className="mt-1"
            />
            <span>
              Show validation sweep
              <small className="mt-1 block font-semibold leading-5 text-slate-500">
                Tune lambda on validation data; the test set stays untouched.
              </small>
            </span>
          </label>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <BarChart3 size={16} />
            Fitted coefficients
          </div>
          <p className="mb-4 text-xs leading-5 text-slate-500">
            Signal/nuisance tags reveal the generator for teaching only. The optimizer receives only X, y, the penalty family,
            and lambda. Correlated signals A and B are near-duplicate measurements of the same latent signal.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {snapshot.weights.map((feature, index) => (
              <WeightRow
                key={feature.id}
                feature={feature}
                baselineWeight={unregularized.weights[index].weight}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <Scale size={16} />
              Training objective
            </div>
            <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm text-slate-800">
              objective = 0.5 × train MSE + weighted penalty
              <br />
              {snapshot.losses.total.toFixed(3)} = {snapshot.losses.dataLoss.toFixed(3)} + {snapshot.losses.penaltyLoss.toFixed(3)}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Validation MSE is not part of this fitted objective. It is measured separately to choose lambda.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <BarChart3 size={16} />
              Measured lambda sweep
            </div>
            <svg viewBox="0 0 360 205" role="img" aria-label="Measured training and validation MSE over lambda" className="h-auto w-full rounded-lg bg-slate-50">
              <rect x="28" y="28" width="300" height="140" rx="8" fill="#ffffff" stroke="#cbd5e1" />
              {[0, 0.5, 1].map((mark) => (
                <line key={mark} x1={28 + mark * 300} x2={28 + mark * 300} y1="28" y2="168" stroke="#e2e8f0" />
              ))}
              <path d={linePath(sweep, 'train')} fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
              {showValidationSweep && <path d={linePath(sweep, 'validation')} fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />}
              <line
                x1={28 + (selectedLambda / REGULARIZATION_EXPERIMENT.maxLambda) * 300}
                x2={28 + (selectedLambda / REGULARIZATION_EXPERIMENT.maxLambda) * 300}
                y1="24"
                y2="172"
                stroke="#0f172a"
                strokeWidth="3"
              />
              {showValidationSweep && (
                <circle
                  cx={28 + (best.lambda / REGULARIZATION_EXPERIMENT.maxLambda) * 300}
                  cy={168 - (best.validation / chartMax) * 130}
                  r="7"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
              )}
              <text x="178" y="195" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">lambda</text>
            </svg>
            <div className="mt-3 grid gap-2 text-sm font-bold text-slate-700">
              <span className="inline-flex items-center gap-2"><i className="h-1 w-8 rounded bg-sky-600" />training MSE</span>
              <span className="inline-flex items-center gap-2"><i className="h-1 w-8 rounded bg-rose-600" />validation MSE</span>
              <span className="inline-flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-emerald-500" />best measured λ: {best.lambda.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="Validation MSE" value={snapshot.losses.validation.toFixed(3)} detail={`Unregularized baseline: ${unregularized.losses.validation.toFixed(3)}`} />
        <Stat label="Active coefficients" value={`${summary.activeCount}/${snapshot.weights.length}`} detail={`${summary.noisyActive} nuisance coefficients remain above the display threshold.`} />
        <Stat label="Diagnosis" value={penaltyId === 'none' ? 'Baseline' : Math.abs(selectedLambda - best.lambda) <= 0.05 ? 'Near optimum' : selectedLambda > best.lambda ? 'Stronger' : 'Weaker'} detail={diagnosis} />
      </section>

      <RegularizationFailureLab />

      <section className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Mechanism boundary</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">“Regularization” is a goal, not one interchangeable operation</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            Different techniques can reduce overfitting through different mechanisms. Do not assume a dropout rate, an L2
            coefficient, and an augmentation strength are alternative units on the same knob.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <MechanismCard icon={Scale} title="Weight penalty / decay">
            Directly constrains parameter updates or magnitudes. Under adaptive optimizers, AdamW-style decoupled weight decay
            is not generally equivalent to adding L2 to the loss.
          </MechanismCard>
          <MechanismCard icon={Boxes} title="Dropout">
            Randomly masks activations during training, changing the network computation and discouraging fragile co-adaptation.
            It does not directly solve the L1/L2 objective shown above.
          </MechanismCard>
          <MechanismCard icon={ImagePlus} title="Data augmentation">
            Changes the training examples and the invariances the model is asked to learn. Its validity depends on whether the
            transformation preserves the task label and deployment semantics.
          </MechanismCard>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Predict before running</p>
          <p className="mt-2 text-sm leading-6 text-cyan-950">
            Compare L2 and L1 at the same lambda. Predict which coefficients become exactly zero and whether that necessarily
            identifies the true generating features.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700">
            <AlertTriangle size={14} />
            Failure mode
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-950">
            Stronger regularization is not automatically better. Past the measured validation optimum, useful signal is
            increasingly suppressed and bias wins the tradeoff.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
            <ShieldCheck size={14} />
            Practical rule
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Fit preprocessing inside training folds, tune regularization on validation evidence, inspect sparse-selection
            stability, and reserve the test set for the final estimate.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="regularization" title="Regularization check" />
    </div>
  );
}
