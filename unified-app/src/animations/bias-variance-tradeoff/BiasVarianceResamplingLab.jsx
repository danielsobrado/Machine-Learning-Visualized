import React, { useMemo } from 'react';
import { RefreshCw, Sigma } from 'lucide-react';
import { RESAMPLING_SEEDS } from './biasVarianceResamplingConstants.js';
import {
  meanResampledCurvePath,
  project,
  resampledCurvePath,
  resamplingProfile,
  truth,
} from './biasVarianceTradeoffModel.js';

function DecompositionBar({ label, value, total, className }) {
  const width = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
        <span>{label}</span>
        <span className="font-mono">{value.toFixed(1)}</span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</span>
      <strong className="mt-1 block text-xl text-slate-950">{value}</strong>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{detail}</span>
    </div>
  );
}

export default function BiasVarianceResamplingLab({ model, sampleLevel, noise }) {
  const profile = useMemo(
    () => resamplingProfile(model, sampleLevel, noise),
    [model, sampleLevel, noise],
  );
  const truthPath = useMemo(() => {
    return Array.from({ length: 70 }, (_, index) => {
      const x = (index / 69) * 100;
      const { cx, cy } = project({ x, y: truth(x) });
      return `${index === 0 ? 'M' : 'L'} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
    }).join(' ');
  }, []);
  const fitPaths = useMemo(
    () => RESAMPLING_SEEDS.map((seed) => resampledCurvePath(model, sampleLevel, noise, seed)),
    [model, sampleLevel, noise],
  );
  const meanPath = useMemo(
    () => meanResampledCurvePath(model, sampleLevel, noise),
    [model, sampleLevel, noise],
  );
  const probeTarget = project({ x: profile.probeX, y: profile.target });
  const probeMean = project({ x: profile.probeX, y: profile.meanPrediction });
  const total = profile.expectedSquaredError;
  const dominant = profile.biasSquared > profile.variance ? 'bias' : 'variance';

  return (
    <section className="space-y-5 rounded-lg border border-violet-200 bg-violet-50/40 p-5">
      <div>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700">
          <RefreshCw size={15} /> Retraining experiment
        </p>
        <h3 className="mt-1 text-xl font-black text-slate-950">Variance means the fitted model moves when the training sample changes</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Train the same model specification on many plausible samples from the same population. Bias is where the average fitted model misses the truth; variance is how widely individual fitted models move around that average.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Same setup · different training samples</p>
              <p className="mt-1 text-sm text-slate-600">Each faint curve is one retraining run. The dark curve is their mean.</p>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">
              {RESAMPLING_SEEDS.length} retrainings
            </span>
          </div>

          <svg
            viewBox="0 0 400 300"
            className="mt-4 h-auto w-full rounded-lg border border-slate-200 bg-slate-50"
            role="img"
            aria-label="Repeated fitted curves showing bias and variance across different training samples"
          >
            <line x1="34" y1="262" x2="366" y2="262" className="stroke-slate-300" />
            <line x1="34" y1="36" x2="34" y2="262" className="stroke-slate-300" />
            <path d={truthPath} fill="none" className="stroke-slate-500" strokeWidth="3" strokeDasharray="6 6" />
            {fitPaths.map((path, index) => (
              <path key={RESAMPLING_SEEDS[index]} d={path} fill="none" className="stroke-violet-400" strokeWidth="2" opacity="0.22" />
            ))}
            <path d={meanPath} fill="none" className="stroke-cyan-700" strokeWidth="4" />
            <line
              x1={probeTarget.cx}
              y1="36"
              x2={probeTarget.cx}
              y2="262"
              className="stroke-slate-300"
              strokeDasharray="3 5"
            />
            {profile.predictions.map((prediction, index) => {
              const point = project({ x: profile.probeX, y: prediction });
              return <circle key={RESAMPLING_SEEDS[index]} cx={point.cx} cy={point.cy} r="3.5" className="fill-violet-500" opacity="0.55" />;
            })}
            <circle cx={probeTarget.cx} cy={probeTarget.cy} r="6" className="fill-slate-700" />
            <circle cx={probeMean.cx} cy={probeMean.cy} r="6" className="fill-cyan-700" />
            <text x="255" y="52" className="fill-slate-600 text-xs font-bold">truth</text>
            <text x="255" y="72" className="fill-cyan-800 text-xs font-bold">mean fitted model</text>
            <text x={probeTarget.cx + 7} y="282" className="fill-slate-500 text-[10px] font-bold">probe x={profile.probeX}</text>
          </svg>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Metric label="Absolute bias" value={Math.abs(profile.bias).toFixed(1)} detail="distance from truth to mean prediction" />
            <Metric label="Prediction spread" value={profile.predictionStd.toFixed(1)} detail="standard deviation across retrainings" />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <Sigma size={14} /> Squared-error decomposition at the probe
            </p>
            <div className="mt-4 space-y-4">
              <DecompositionBar label="Bias²" value={profile.biasSquared} total={total} className="bg-amber-500" />
              <DecompositionBar label="Variance" value={profile.variance} total={total} className="bg-violet-500" />
              <DecompositionBar label="Irreducible noise" value={profile.irreducibleVariance} total={total} className="bg-slate-400" />
            </div>
            <div className="mt-4 border-t border-slate-200 pt-3 text-sm">
              <span className="text-slate-600">Expected squared error</span>
              <strong className="float-right font-mono text-slate-950">{total.toFixed(1)}</strong>
            </div>
          </div>

          <div className={`rounded-lg border p-4 text-sm leading-6 ${
            dominant === 'bias'
              ? 'border-amber-200 bg-amber-50 text-amber-950'
              : 'border-violet-200 bg-violet-50 text-violet-950'
          }`}>
            <strong className="block">{dominant === 'bias' ? 'Bias dominates at this probe' : 'Variance dominates at this probe'}</strong>
            <span>
              {dominant === 'bias'
                ? 'Retraining is fairly consistent, but the average fitted model is systematically wrong here. More copies of the same data cannot fix the model assumption.'
                : 'The same model specification lands in noticeably different places when the training sample changes. Try a larger sample or less flexibility and watch the fan tighten.'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="block text-slate-950">Simple model</strong>
          The curves tend to agree with each other but can agree on the wrong answer: low variance, high bias.
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="block text-slate-950">Flexible model</strong>
          With scarce noisy data, retraining changes the fitted curve much more: lower structural bias, higher variance.
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <strong className="block text-slate-950">More data</strong>
          Keep the model fixed and move from small to large samples. The prediction fan contracts because sampling uncertainty falls.
        </div>
      </div>
    </section>
  );
}
