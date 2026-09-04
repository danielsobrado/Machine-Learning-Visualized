import React, { useMemo, useState } from 'react';
import { AlertTriangle, Binary, Gauge, Sigma } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { CROSS_ENTROPY_DEFAULTS, CROSS_ENTROPY_SCENARIOS } from './crossEntropyConfig';
import { buildCrossEntropyLab } from './crossEntropyModel';

const CLASS_NAMES = ['cat', 'dog', 'fox'];

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function scenarioLab(id) {
  return buildCrossEntropyLab({
    scenario: CROSS_ENTROPY_SCENARIOS.find((item) => item.id === id),
    logitScale: 1,
    labelSmoothing: 0,
  });
}

export default function CrossEntropyAnimation() {
  const [scenarioId, setScenarioId] = useState(CROSS_ENTROPY_DEFAULTS.scenarioId);
  const [logitScale, setLogitScale] = useState(CROSS_ENTROPY_DEFAULTS.logitScale);
  const [labelSmoothing, setLabelSmoothing] = useState(CROSS_ENTROPY_DEFAULTS.labelSmoothing);
  const scenario = CROSS_ENTROPY_SCENARIOS.find((item) => item.id === scenarioId);
  const lab = useMemo(() => buildCrossEntropyLab({ scenario, logitScale, labelSmoothing }), [scenario, logitScale, labelSmoothing]);

  const correctCautious = scenarioLab('correct-cautious');
  const correctConfident = scenarioLab('correct-confident');
  const wrongCautious = scenarioLab('wrong-cautious');
  const wrongOverconfident = scenarioLab('wrong-overconfident');

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Classification objective</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Cross-Entropy: probability assigned to the truth</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Accuracy only asks which class wins. Cross-entropy asks how much probability the model assigned to the target distribution.
          For a one-hot target, the loss collapses to <strong>-ln p(true class)</strong>.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-5">
          {CROSS_ENTROPY_SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScenarioId(item.id)}
              className={`rounded-lg border p-3 text-left ${scenarioId === item.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Logit scale: {logitScale.toFixed(2)}×
            <input type="range" min="0.25" max="3" step="0.05" value={logitScale} onChange={(event) => setLogitScale(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Label smoothing: {(labelSmoothing * 100).toFixed(0)}%
            <input type="range" min="0" max="0.3" step="0.01" value={labelSmoothing} onChange={(event) => setLabelSmoothing(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Stat label="Cross-entropy" value={lab.loss.toFixed(4)} detail="nats" />
        <Stat label="True-class p" value={`${(lab.trueClassProbability * 100).toFixed(2)}%`} detail={CLASS_NAMES[scenario.targetIndex]} />
        <Stat label="Argmax" value={CLASS_NAMES[lab.predictedIndex]} detail={lab.correct ? 'correct prediction' : 'wrong prediction'} />
        <Stat label="Target entropy" value={lab.targetEntropy.toFixed(4)} detail="irreducible target uncertainty" />
        <Stat label="KL mismatch" value={lab.klDivergence.toFixed(4)} detail="extra loss from Q ≠ P" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Gauge size={16} /> Target vs prediction</h3>
          <div className="mt-4 space-y-4">
            {lab.prediction.map((probability, index) => (
              <div key={CLASS_NAMES[index]}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <strong className="text-slate-900">{CLASS_NAMES[index]}</strong>
                  <span className="font-mono text-xs text-slate-600">logit {lab.logits[index].toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-[1fr_70px] gap-2 items-center">
                  <div className="relative h-6 overflow-hidden rounded bg-slate-100">
                    <div className="absolute inset-y-0 left-0 bg-violet-500" style={{ width: `${probability * 100}%` }} />
                    <div className="absolute inset-y-0 left-0 border-r-4 border-emerald-600" style={{ width: `${lab.target[index] * 100}%` }} />
                  </div>
                  <span className="text-right text-sm font-black text-slate-700">{(probability * 100).toFixed(1)}%</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">target {(lab.target[index] * 100).toFixed(1)}% · gradient dL/dz = {lab.gradient[index].toFixed(4)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-violet-200 bg-violet-50 p-4 font-mono text-sm text-violet-950">
            H(P,Q) = H(P) + KL(P || Q) = {lab.targetEntropy.toFixed(4)} + {lab.klDivergence.toFixed(4)} = {lab.loss.toFixed(4)}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Sigma size={16} /> Why logits are the stable path</h3>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Computing <span className="font-mono">-log(softmax(z))</span> naively can overflow or underflow for extreme logits.
            The model uses log-sum-exp, subtracting the largest logit before exponentiating.
          </p>
          <div className="mt-4 rounded-lg bg-slate-950 p-4 font-mono text-sm text-slate-100">
            log softmax(zᵢ) = zᵢ - logΣ exp(zⱼ)
          </div>
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            {Number.isFinite(lab.probabilityLoss)
              ? <>Probability-space loss and stable logit-space loss agree here: difference {Math.abs(lab.loss - lab.probabilityLoss).toExponential(2)}.</>
              : <>The naive probability-space path has underflowed to an infinite loss, while the stable logit-space loss remains {lab.loss.toFixed(4)}.</>}
          </div>
          <div className="mt-4 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
            For softmax + cross-entropy, the gradient is simply <span className="font-mono">prediction - target</span>. Its components sum to {lab.gradientSum.toExponential(1)}.
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Binary size={16} /> Accuracy can hide probability quality</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            ['Correct, cautious', correctCautious],
            ['Correct, confident', correctConfident],
            ['Wrong, cautious', wrongCautious],
            ['Wrong, overconfident', wrongOverconfident],
          ].map(([label, item]) => (
            <div key={label} className={`rounded-lg border p-4 ${item.correct ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <strong className="text-sm text-slate-950">{label}</strong>
              <p className="mt-2 text-2xl font-black text-slate-950">{item.loss.toFixed(3)}</p>
              <p className="text-xs text-slate-600">loss · accuracy {item.correct ? '1' : '0'}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">
          The first two examples have identical accuracy, but cross-entropy prefers the model that assigns more probability to the truth.
          When the model is wrong, extreme confidence is punished much more heavily.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
          <strong className="block text-xs uppercase tracking-wide text-violet-700">One-hot shortcut</strong>
          With no label smoothing, only the true-class probability contributes directly: L = -ln p(y).
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="block text-xs uppercase tracking-wide text-amber-700">Zero probability</strong>
          Assigning exactly zero probability to an event with positive target mass gives infinite probability-space cross-entropy.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="block text-xs uppercase tracking-wide text-emerald-700">Label smoothing</strong>
          Smoothing changes the target from a point mass to a distribution, so loss no longer depends on only one class.
        </div>
      </section>

      {scenarioId === 'extreme-logits' && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <AlertTriangle className="mr-2 inline" size={16} /> Extreme logits remain finite because the implementation uses stable log-sum-exp rather than direct exponentiation of 1000.
        </div>
      )}

      <AssessmentPanel lessonId="cross-entropy" title="Cross-Entropy check" />
    </div>
  );
}
