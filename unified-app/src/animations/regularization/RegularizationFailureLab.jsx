import React, { useMemo, useState } from 'react';
import { AlertTriangle, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import {
  CORRELATED_STABILITY_DEMO,
  SCALE_SENSITIVITY_DEMO,
} from './regularizationConstants';
import {
  correlatedFeatureStability,
  unitScalePenalty,
} from './regularizationModel';

function formatPercent(value, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

function StabilityCard({ title, stats, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">
        {formatPercent(stats.meanPairImbalance)} imbalance
      </strong>
      <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-700">
        <span className="rounded bg-white px-2 py-2">A wins {stats.dominantA}/{stats.runs.length}</span>
        <span className="rounded bg-white px-2 py-2">B wins {stats.dominantB}/{stats.runs.length}</span>
        <span className="rounded bg-white px-2 py-2">one zero {stats.zeroedPairMemberCount}/{stats.runs.length}</span>
      </div>
    </div>
  );
}

export default function RegularizationFailureLab() {
  const [stabilityLambda, setStabilityLambda] = useState(CORRELATED_STABILITY_DEMO.lambda);
  const [penaltyId, setPenaltyId] = useState('l2');
  const [scale, setScale] = useState(SCALE_SENSITIVITY_DEMO.defaultScale);

  const lassoStability = useMemo(
    () => correlatedFeatureStability('l1', stabilityLambda),
    [stabilityLambda],
  );
  const elasticStability = useMemo(
    () => correlatedFeatureStability('elastic', stabilityLambda),
    [stabilityLambda],
  );

  const scaled = unitScalePenalty({ scale, penaltyId });
  const baseline = unitScalePenalty({ scale: 1, penaltyId });
  const rawPenaltyRatio = scaled.rawPenalty / baseline.rawPenalty;

  return (
    <section className="space-y-5 rounded-lg border border-amber-200 bg-amber-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Failure lab · correlated features and scale</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Regularization is not an oracle for feature truth</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The experiments below use fitted models. They show two traps that coefficient penalties cannot solve for you:
            correlated substitutes can make L1 selection unstable, and arbitrary measurement units can change raw penalties.
          </p>
        </div>
        <Sparkles className="text-amber-700" size={30} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Trap 1 · correlated substitutes</p>
          <h4 className="mt-1 text-lg font-black text-slate-950">Pure L1 can switch which near-duplicate feature survives</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Eight independent training samples contain two near-duplicate measurements of the same latent signal. Each run is
            fitted from scratch. Compare how pure L1 and Elastic Net distribute weight across the pair.
          </p>

          <label className="mt-4 block text-sm font-bold text-slate-700">
            Stability lambda: {stabilityLambda.toFixed(2)}
            <input
              className="mt-2 w-full"
              min={CORRELATED_STABILITY_DEMO.minLambda}
              max={CORRELATED_STABILITY_DEMO.maxLambda}
              step={CORRELATED_STABILITY_DEMO.lambdaStep}
              type="range"
              value={stabilityLambda}
              aria-label="Regularization strength for correlated feature stability"
              onChange={(event) => setStabilityLambda(Number(event.target.value))}
            />
          </label>

          <div className="mt-4 grid gap-3">
            <StabilityCard
              title="Pure L1 / lasso"
              stats={lassoStability}
              detail="A high pair imbalance means the fit often concentrates the shared signal in one arbitrary substitute."
            />
            <StabilityCard
              title="Elastic Net"
              stats={elasticStability}
              detail="The L2 component encourages correlated predictors to share weight instead of competing as aggressively."
            />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {lassoStability.runs.map((run) => (
              <div key={run.seed} className="rounded border border-slate-200 bg-slate-50 px-2 py-2 text-center">
                <span className="block text-[10px] font-bold text-slate-500">seed {run.seed}</span>
                <strong className="block text-sm text-slate-900">{run.dominant}</strong>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Letters show which correlated feature has the larger absolute L1 coefficient in each independently fitted sample.
          </p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700">
            <Ruler size={15} />
            Trap 2 · units change the penalty
          </p>
          <h4 className="mt-1 text-lg font-black text-slate-950">Same prediction, different units, different raw penalty</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            If a feature is multiplied by {scale}, its equivalent coefficient is divided by {scale}. Predictions can remain
            identical even though the coefficient penalty changes.
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
            At ×100 units, the equivalent raw coefficient carries 1/100 of the L1 penalty and 1/10,000 of the L2 penalty.
            Fit scaling inside each training fold so validation rows never influence preprocessing.
          </p>
        </section>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-rose-900"><AlertTriangle size={16} />Interpret carefully</p>
          <p className="mt-2 text-sm leading-6 text-rose-950">
            A zero L1 coefficient is conditional on this sample, preprocessing, correlated alternatives, and lambda. It is not
            proof that the feature is useless or non-causal.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-emerald-900"><ShieldCheck size={16} />Production habit</p>
          <p className="mt-2 text-sm leading-6 text-emerald-950">
            Tune lambda on validation data and inspect selection stability across folds or resamples whenever sparse coefficients
            are being interpreted as feature selection.
          </p>
        </div>
      </div>
    </section>
  );
}
