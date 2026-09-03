import React, { useMemo, useState } from 'react';
import { AlertTriangle, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import {
  FEATURES,
  SCALE_SENSITIVITY_DEMO,
} from './regularizationConstants';
import {
  shrinkFeature,
  unitScalePenalty,
} from './regularizationModel';

function formatPercent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export default function RegularizationFailureLab() {
  const [lassoLambda, setLassoLambda] = useState(0.8);
  const [penaltyId, setPenaltyId] = useState('l2');
  const [scale, setScale] = useState(SCALE_SENSITIVITY_DEMO.defaultScale);

  const sparseWeights = useMemo(
    () => FEATURES.map((feature) => shrinkFeature(feature, 'l1', lassoLambda)),
    [lassoLambda],
  );
  const weakSignal = sparseWeights.find((feature) => feature.id === 'weakSignal');
  const largeNoise = sparseWeights.find((feature) => feature.id === 'noiseA');

  const scaled = unitScalePenalty({ scale, penaltyId });
  const baseline = unitScalePenalty({ scale: 1, penaltyId });
  const rawPenaltyRatio = scaled.rawPenalty / baseline.rawPenalty;

  return (
    <section className="space-y-5 rounded-lg border border-amber-200 bg-amber-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · sparsity and feature scale</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Regularization is not an oracle for feature truth</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            L1 and L2 penalize coefficient geometry. They do not know which feature is genuinely useful, and their raw
            coefficient penalties depend on how features are scaled. Use validation evidence and a leakage-safe pipeline;
            do not interpret a zero coefficient as automatic proof that a feature was useless.
          </p>
        </div>
        <Sparkles className="text-amber-700" size={30} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Trap 1 · sparsity ≠ truth</p>
          <h4 className="mt-1 text-lg font-black text-slate-950">A useful small weight can disappear before a larger noisy one</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The same L1 soft-threshold is applied to every coefficient. Increase lambda and watch what coefficient magnitude,
            not the hidden “signal/noise” label, determines which weight reaches zero first.
          </p>

          <label className="mt-4 block text-sm font-bold text-slate-700">
            L1 lambda: {lassoLambda.toFixed(2)}
            <input
              className="mt-2 w-full"
              min="0.4"
              max="0.9"
              step="0.01"
              type="range"
              value={lassoLambda}
              aria-label="L1 regularization strength for sparsity failure example"
              onChange={(event) => setLassoLambda(Number(event.target.value))}
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className={`rounded-lg border p-4 ${weakSignal.removed ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Weak useful signal</p>
              <strong className="mt-1 block text-2xl font-black text-slate-950">
                {weakSignal.removed ? 'zeroed' : weakSignal.weight.toFixed(2)}
              </strong>
              <p className="mt-1 text-sm text-slate-600">Started at coefficient {weakSignal.base.toFixed(2)}.</p>
            </div>
            <div className={`rounded-lg border p-4 ${largeNoise.removed ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Larger noisy coefficient</p>
              <strong className="mt-1 block text-2xl font-black text-slate-950">
                {largeNoise.removed ? 'zeroed' : largeNoise.weight.toFixed(2)}
              </strong>
              <p className="mt-1 text-sm text-slate-600">Started at coefficient {largeNoise.base.toFixed(2)}.</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-950">
            <strong>What this fixes:</strong> the previous toy secretly penalized features differently based on whether the
            code already knew they were useful. Real regularization does not get that answer key.
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700">
            <Ruler size={15} />
            Trap 2 · units change the penalty
          </p>
          <h4 className="mt-1 text-lg font-black text-slate-950">Same prediction, different units, different raw penalty</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Suppose a feature has effect 2 when measured in base units. If you multiply the feature values by {scale}, the
            equivalent coefficient becomes 2/{scale}. The model prediction can stay identical while the raw coefficient
            penalty changes dramatically.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {['l1', 'l2'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPenaltyId(id)}
                aria-pressed={penaltyId === id}
                className={`rounded-lg border px-3 py-2 text-sm font-black ${
                  penaltyId === id
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-sm font-bold text-slate-700">
            Unit multiplier: ×{scale}
            <input
              className="mt-2 w-full"
              min={SCALE_SENSITIVITY_DEMO.minScale}
              max={SCALE_SENSITIVITY_DEMO.maxScale}
              step={SCALE_SENSITIVITY_DEMO.scaleStep}
              type="range"
              value={scale}
              aria-label="Feature unit scale multiplier"
              onChange={(event) => setScale(Number(event.target.value))}
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Raw coefficient</p>
              <strong className="mt-1 block text-xl font-black text-slate-950">{scaled.rawCoefficient.toFixed(4)}</strong>
              <p className="mt-1 text-xs text-slate-600">Same physical effect.</p>
            </div>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-rose-700">Raw penalty left</p>
              <strong className="mt-1 block text-xl font-black text-slate-950">{formatPercent(rawPenaltyRatio, 2)}</strong>
              <p className="mt-1 text-xs text-slate-600">Relative to base units.</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">After standardizing</p>
              <strong className="mt-1 block text-xl font-black text-slate-950">100%</strong>
              <p className="mt-1 text-xs text-slate-600">Comparable coordinate scale.</p>
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            With ×100 units, L1's raw penalty becomes 1/100 as large and L2's becomes 1/10,000 as large for the equivalent
            coefficient. Standardizing continuous features makes coefficient penalties comparable across arbitrary units.
          </p>
        </section>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-rose-900"><AlertTriangle size={16} />Interpret carefully</p>
          <p className="mt-2 text-sm leading-6 text-rose-950">
            L1 selection can be unstable among correlated predictors, and a zero coefficient is model- and preprocessing-dependent.
            It is not a causal verdict about the feature.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-emerald-900"><ShieldCheck size={16} />Production habit</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Fit scaling inside each training fold, tune penalty strength on validation data, and inspect stability across folds
            when using sparsity for feature selection.
          </p>
        </div>
      </div>
    </section>
  );
}
