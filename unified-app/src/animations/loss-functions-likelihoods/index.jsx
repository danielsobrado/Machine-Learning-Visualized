import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, Calculator, RotateCcw, ShieldCheck } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { CLASSIFICATION_POINTS, LOSS_DEFAULTS, LOSS_MODES, REGRESSION_POINTS } from './lossConfig';
import { buildLossLab, gaussianNll, laplaceNll } from './lossModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function RegressionRow({ row, mode, scale }) {
  const nll = mode === 'gaussian' ? gaussianNll(row.residual, scale) : laplaceNll(row.residual, scale);
  return (
    <div className="grid gap-2 sm:grid-cols-[36px_86px_1fr_72px] sm:items-center">
      <strong>{row.id}</strong>
      <span className="font-mono text-xs text-slate-600">r={row.residual.toFixed(2)}</span>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, Math.max(2, nll * 12))}%` }} />
      </div>
      <span className="text-right text-sm font-black text-slate-700">{nll.toFixed(2)}</span>
    </div>
  );
}

export default function LossFunctionsLikelihoodsAnimation() {
  const [mode, setMode] = useState(LOSS_DEFAULTS.mode);
  const [slope, setSlope] = useState(LOSS_DEFAULTS.slope);
  const [intercept, setIntercept] = useState(LOSS_DEFAULTS.intercept);
  const [gaussianSigma, setGaussianSigma] = useState(LOSS_DEFAULTS.gaussianSigma);
  const [laplaceScale, setLaplaceScale] = useState(LOSS_DEFAULTS.laplaceScale);
  const [logitScale, setLogitScale] = useState(LOSS_DEFAULTS.logitScale);
  const [bias, setBias] = useState(LOSS_DEFAULTS.bias);
  const [outlierOn, setOutlierOn] = useState(LOSS_DEFAULTS.outlierOn);
  const [flippedLabel, setFlippedLabel] = useState(LOSS_DEFAULTS.flippedLabel);

  const lab = useMemo(() => buildLossLab({
    regressionPoints: REGRESSION_POINTS,
    classificationPoints: CLASSIFICATION_POINTS,
    mode,
    slope,
    intercept,
    gaussianSigma,
    laplaceScale,
    logitScale,
    bias,
    outlierOn,
    flippedLabel,
  }), [mode, slope, intercept, gaussianSigma, laplaceScale, logitScale, bias, outlierOn, flippedLabel]);

  const reset = () => {
    setMode(LOSS_DEFAULTS.mode);
    setSlope(LOSS_DEFAULTS.slope);
    setIntercept(LOSS_DEFAULTS.intercept);
    setGaussianSigma(LOSS_DEFAULTS.gaussianSigma);
    setLaplaceScale(LOSS_DEFAULTS.laplaceScale);
    setLogitScale(LOSS_DEFAULTS.logitScale);
    setBias(LOSS_DEFAULTS.bias);
    setOutlierOn(false);
    setFlippedLabel(false);
  };

  const classification = mode === 'bernoulli';
  const activeMode = LOSS_MODES.find((item) => item.id === mode);
  const activeScale = mode === 'gaussian' ? gaussianSigma : laplaceScale;
  const scaleLabel = mode === 'gaussian' ? 'σ' : 'b';

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Loss as a probabilistic assumption</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Loss Functions and Likelihoods</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              A negative log-likelihood is not just a familiar error shape. It includes the distribution's scale and normalization.
              Choosing Gaussian, Laplace, or Bernoulli noise changes what the model says generated the observations.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {LOSS_MODES.map((item) => (
            <button key={item.id} type="button" onClick={() => setMode(item.id)} className={`rounded-lg border p-3 text-left ${mode === item.id ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {classification ? (
            <>
              <label className="grid gap-2 text-sm font-bold text-slate-700">Logit scale: {logitScale.toFixed(1)}<input type="range" min="0.5" max="10" step="0.1" value={logitScale} onChange={(event) => setLogitScale(Number(event.target.value))} /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">Bias: {bias.toFixed(2)}<input type="range" min="-2" max="2" step="0.05" value={bias} onChange={(event) => setBias(Number(event.target.value))} /></label>
              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"><input className="mt-1" type="checkbox" checked={flippedLabel} onChange={(event) => setFlippedLabel(event.target.checked)} /><span>Flip one label<small className="mt-1 block font-semibold text-slate-500">Confident disagreement becomes expensive.</small></span></label>
            </>
          ) : (
            <>
              <label className="grid gap-2 text-sm font-bold text-slate-700">Slope: {slope.toFixed(2)}<input type="range" min="0.3" max="1.7" step="0.02" value={slope} onChange={(event) => setSlope(Number(event.target.value))} /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">Intercept: {intercept.toFixed(2)}<input type="range" min="-0.2" max="1.8" step="0.02" value={intercept} onChange={(event) => setIntercept(Number(event.target.value))} /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">{scaleLabel}: {activeScale.toFixed(2)}<input type="range" min="0.1" max="2" step="0.05" value={activeScale} onChange={(event) => mode === 'gaussian' ? setGaussianSigma(Number(event.target.value)) : setLaplaceScale(Number(event.target.value))} /></label>
              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700"><input className="mt-1" type="checkbox" checked={outlierOn} onChange={(event) => setOutlierOn(event.target.checked)} /><span>Add outlier<small className="mt-1 block font-semibold text-slate-500">Compare Gaussian and Laplace tail assumptions.</small></span></label>
            </>
          )}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Total NLL" value={lab.activeNll.toFixed(3)} detail="lower is better" />
        {classification ? (
          <>
            <Stat label="0/1 errors" value={lab.errors} detail={`${CLASSIFICATION_POINTS.length} examples`} />
            <Stat label="Best bias on sweep" value={lab.best.bias.toFixed(2)} detail={`NLL ${lab.best.nll.toFixed(2)}`} />
            <Stat label="Likelihood ratio" value={Math.exp(Math.min(0, lab.best.nll - lab.activeNll)).toFixed(3)} detail="current vs best sweep point" />
          </>
        ) : (
          <>
            <Stat label={`${scaleLabel} MLE`} value={lab.scaleMle.toFixed(3)} detail="best scale for current residuals" />
            <Stat label="NLL at scale MLE" value={lab.mleNll.toFixed(3)} detail="scale optimized, line fixed" />
            <Stat label="Best slope on sweep" value={lab.best.slope.toFixed(2)} detail={`NLL ${lab.best.nll.toFixed(2)}`} />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><BarChart3 size={16} /> Example-level negative log-likelihood</h3>
          <div className="mt-4 space-y-3">
            {classification ? lab.classification.map((row) => (
              <div key={row.id} className="grid gap-2 sm:grid-cols-[42px_150px_1fr_68px] sm:items-center">
                <strong>{row.id}</strong>
                <span className="font-mono text-xs text-slate-600">y={row.y} · p={row.probability.toFixed(3)}</span>
                <div className="h-3 rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, Math.max(2, row.nll * 20))}%` }} /></div>
                <span className="text-right text-sm font-black">{row.nll.toFixed(3)}</span>
              </div>
            )) : lab.regression.map((row) => <RegressionRow key={row.id} row={row} mode={mode} scale={activeScale} />)}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Calculator size={16} /> Full likelihood, not shape-only loss</h3>
          <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100">
            {mode === 'gaussian' && <>NLL = ½log(2π) + log σ + r²/(2σ²)</>}
            {mode === 'laplace' && <>NLL = log(2b) + |r|/b</>}
            {mode === 'bernoulli' && <>NLL = softplus(z) - y·z</>}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">{activeMode.detail}</p>
          {!classification && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <strong>Scale trap:</strong> making {scaleLabel} huge shrinks the residual penalty but increases the normalization term. Making it tiny does the opposite. The likelihood has an interior optimum.
            </div>
          )}
        </section>
      </div>

      {!classification && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
            <strong className="block text-xs uppercase tracking-wide text-rose-700">Outlier stress</strong>
            With the outlier enabled, Gaussian NLL grows quadratically with residual size while Laplace grows linearly. That is a modeling assumption about tail probability, not merely a robustness trick.
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950">
            <strong className="block text-xs uppercase tracking-wide text-emerald-700">Scale MLE</strong>
            For a fixed mean model, Gaussian σ̂ is RMS residual; Laplace b̂ is mean absolute residual. Change the line and watch the implied noise estimate change too.
          </div>
        </section>
      )}

      {classification && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <AlertTriangle className="mr-2 inline" size={16} /> Bernoulli NLL is computed from logits with a stable softplus identity, so extreme confidence does not require clipping probabilities to 0.001 or 0.999.
        </section>
      )}

      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-sm leading-6 text-cyan-950">
        <ShieldCheck className="mr-2 inline" size={16} /> A lower NLL only means better fit inside the assumed distribution family. It does not prove Gaussian, Laplace, or Bernoulli is the right data-generating model.
      </section>

      <AssessmentPanel lessonId="loss-functions-likelihoods" title="Loss Functions and Likelihoods check" />
    </div>
  );
}
