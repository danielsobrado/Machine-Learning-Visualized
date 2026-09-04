import React, { useMemo, useState } from 'react';
import { Activity, Sigma, TrendingUp } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { POLICY_GRADIENT_ACTIONS, POLICY_GRADIENT_DEFAULTS } from './policyGradientConfig';
import { buildPolicyGradientStep, exactPolicyGradient, reinforceGradientVariance } from './policyGradientModel';

function Stat({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function PolicyGradientsAnimation() {
  const [sampledAction, setSampledAction] = useState(POLICY_GRADIENT_DEFAULTS.sampledAction);
  const [sampledReturn, setSampledReturn] = useState(POLICY_GRADIENT_DEFAULTS.sampledReturn);
  const [baseline, setBaseline] = useState(POLICY_GRADIENT_DEFAULTS.baseline);
  const [learningRate, setLearningRate] = useState(POLICY_GRADIENT_DEFAULTS.learningRate);
  const actionReturns = POLICY_GRADIENT_ACTIONS.map((action) => action.expectedReturn);
  const step = useMemo(() => buildPolicyGradientStep({ logits: POLICY_GRADIENT_DEFAULTS.logits, actionReturns, sampledAction, sampledReturn, baseline, learningRate }), [sampledAction, sampledReturn, baseline, learningRate]);
  const exact = useMemo(() => exactPolicyGradient(POLICY_GRADIENT_DEFAULTS.logits, actionReturns), []);
  const bestVarianceBaseline = exact.objective;
  const bestLikeVariance = reinforceGradientVariance(POLICY_GRADIENT_DEFAULTS.logits, actionReturns, bestVarianceBaseline);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-sky-700">REINFORCE lab</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Policy Gradients: increase log-probability in proportion to advantage</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">For a categorical softmax policy, the sampled-action score gradient is <strong>onehot(a) − π</strong>. Every logit participates; changing only the sampled logit is not the REINFORCE gradient.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {POLICY_GRADIENT_ACTIONS.map((action, index) => <button key={action.id} type="button" onClick={() => setSampledAction(index)} className={`rounded-lg border p-3 text-left ${sampledAction === index ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}><strong className="block text-sm">{action.label}</strong><span className="text-xs text-slate-600">environment E[G|a] = {action.expectedReturn}</span></button>)}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Sampled return G: {sampledReturn}<input type="range" min="-6" max="10" step="0.5" value={sampledReturn} onChange={(event) => setSampledReturn(Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Baseline b: {baseline.toFixed(1)}<input type="range" min="-4" max="8" step="0.25" value={baseline} onChange={(event) => setBaseline(Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Learning rate: {learningRate.toFixed(2)}<input type="range" min="0" max="0.8" step="0.02" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} /></label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Advantage" value={step.advantage.toFixed(2)} detail="G − b for this sample" />
        <Stat label="Expected return J" value={step.objective.toFixed(3)} detail="under current policy" />
        <Stat label="Gradient sum" value={step.gradientSum.toExponential(1)} detail="softmax shift-invariance ⇒ 0" />
        <Stat label="Gradient variance" value={step.selectedBaselineVariance.toFixed(3)} detail={`without baseline ${step.zeroBaselineVariance.toFixed(3)}`} />
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><TrendingUp size={16} /> One sampled REINFORCE step</h3>
          <div className="mt-4 space-y-3">
            {POLICY_GRADIENT_ACTIONS.map((action, index) => (
              <div key={action.id} className={`rounded-lg border p-4 ${sampledAction === index ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex flex-wrap justify-between gap-3"><strong>{action.label}</strong><span className="font-mono text-sm">∂J/∂z ≈ {step.gradient[index].toFixed(4)}</span></div>
                <div className="mt-3 grid gap-2"><div className="h-2 rounded bg-white"><div className="h-2 rounded bg-slate-400" style={{ width: `${step.before[index] * 100}%` }} /></div><div className="h-2 rounded bg-white"><div className="h-2 rounded bg-sky-500" style={{ width: `${step.after[index] * 100}%` }} /></div></div>
                <p className="mt-2 text-xs text-slate-600">π before {(step.before[index] * 100).toFixed(1)}% → after {(step.after[index] * 100).toFixed(1)}% · exact expected gradient {step.exactGradient[index].toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
            <strong className="block text-xs uppercase tracking-wide text-rose-700">Fixed update bug</strong>
            Old toy rule: only add αA to the sampled logit. Correct softmax REINFORCE: <span className="font-mono">A(onehot(a) − π)</span>, so non-sampled logits receive gradient components too.
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950">
            <Sigma className="mr-2 inline" size={16} /> A baseline does <strong>not</strong> change the expected policy gradient when it does not depend on the sampled action. It changes variance. Current variance {step.selectedBaselineVariance.toFixed(3)}; using b≈J ({bestVarianceBaseline.toFixed(2)}) gives {bestLikeVariance.toFixed(3)} in this toy policy.
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-950">
            <Activity className="mr-2 inline" size={16} /> A single Monte Carlo gradient can point away from the exact expected gradient because returns are noisy. REINFORCE is unbiased in expectation, not noiseless per trajectory.
          </div>
        </div>
      </section>

      <AssessmentPanel lessonId="policy-gradients" title="Policy gradients check" />
    </div>
  );
}
