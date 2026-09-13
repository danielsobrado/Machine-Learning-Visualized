import React, { useMemo, useState } from 'react';
import {
  HETEROSCEDASTIC_DEFAULTS,
  HETEROSCEDASTIC_GROUPS,
  HETEROSCEDASTIC_SIGMA_LIMITS,
} from './heteroscedasticConstants.js';
import { buildHeteroscedasticLab } from './heteroscedasticModel.js';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <strong className="mt-1 block text-xl text-slate-950">{value}</strong>
      {detail && <small className="text-slate-500">{detail}</small>}
    </div>
  );
}

function GroupCard({ group, sigma, breakdown, sigmaMle, onChange }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <strong className="text-sm text-slate-950">{group.label}</strong>
          <p className="mt-1 text-xs text-slate-500">Residuals: {group.residuals.map((value) => value.toFixed(2)).join(', ')}</p>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">scale MLE {sigmaMle.toFixed(2)}</span>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
        Predicted sigma: {sigma.toFixed(2)}
        <input type="range" {...HETEROSCEDASTIC_SIGMA_LIMITS} value={sigma} onChange={(event) => onChange(Number(event.target.value))} />
      </label>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Metric label="Residual" value={breakdown.residualPenalty.toFixed(2)} />
        <Metric label="Scale" value={breakdown.normalizationPenalty.toFixed(2)} />
        <Metric label="Group NLL" value={breakdown.nll.toFixed(2)} />
      </div>
    </div>
  );
}

export default function HeteroscedasticLikelihoodLab() {
  const [stableSigma, setStableSigma] = useState(HETEROSCEDASTIC_DEFAULTS.stableSigma);
  const [noisySigma, setNoisySigma] = useState(HETEROSCEDASTIC_DEFAULTS.noisySigma);
  const lab = useMemo(() => buildHeteroscedasticLab({
    stableResiduals: HETEROSCEDASTIC_GROUPS.stable.residuals,
    noisyResiduals: HETEROSCEDASTIC_GROUPS.noisy.residuals,
    stableSigma,
    noisySigma,
  }), [stableSigma, noisySigma]);

  const correctDirection = noisySigma > stableSigma;
  const nearOptimum = Math.abs(stableSigma - lab.stableSigmaMle) < 0.12
    && Math.abs(noisySigma - lab.noisySigmaMle) < 0.12;
  const inflated = stableSigma > 1.5 && noisySigma > 1.5;

  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-5">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">4 - Learned uncertainty</p>
      <h3 className="mt-1 text-lg font-black text-slate-950">Heteroscedastic Gaussian NLL learns where data is noisy</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
        A model may predict a different noise scale for different inputs. A larger scale reduces the squared-residual penalty for genuinely noisy examples,
        while the log-scale term charges the model for claiming uncertainty. Both terms are required.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <GroupCard group={HETEROSCEDASTIC_GROUPS.stable} sigma={stableSigma} breakdown={lab.stable} sigmaMle={lab.stableSigmaMle} onChange={setStableSigma} />
        <GroupCard group={HETEROSCEDASTIC_GROUPS.noisy} sigma={noisySigma} breakdown={lab.noisy} sigmaMle={lab.noisySigmaMle} onChange={setNoisySigma} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Metric label="Current NLL" value={lab.totalNll.toFixed(2)} detail="two predicted scales" />
        <Metric label="Best shared scale" value={lab.sharedSigmaMle.toFixed(2)} detail={`NLL ${lab.sharedNll.toFixed(2)}`} />
        <Metric label="Best two-scale NLL" value={lab.bestHeteroscedasticNll.toFixed(2)} detail="group scales at their MLEs" />
        <Metric label="Residual-only objective" value={lab.residualOnlyObjective.toFixed(2)} detail="missing the log-scale penalty" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className={`rounded-lg border p-4 text-sm leading-6 ${correctDirection ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
          <strong>Different noise levels:</strong> the noisy region should receive a larger predicted scale than the stable region.
        </div>
        <div className={`rounded-lg border p-4 text-sm leading-6 ${nearOptimum ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-slate-200 bg-white text-slate-700'}`}>
          <strong>Find the optimum:</strong> move each slider near the RMS residual for that region and compare against the best single shared scale.
        </div>
        <div className={`rounded-lg border p-4 text-sm leading-6 ${inflated ? 'border-rose-300 bg-rose-50 text-rose-950' : 'border-slate-200 bg-white text-slate-700'}`}>
          <strong>Inflate both scales:</strong> the residual-only objective shrinks, but the full NLL gets worse once the scale penalty dominates.
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100">
        NLL = 0.5 log(2 pi) + log(sigma) + residual^2 / (2 sigma^2)
        <br />
        Without log(sigma), increasing predicted uncertainty can reduce the objective without improving the mean prediction.
      </div>
    </section>
  );
}
