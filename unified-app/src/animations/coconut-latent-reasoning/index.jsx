import React, { useMemo, useState } from 'react';
import { Brain, ExternalLink, GitBranch, Layers3, ShieldCheck } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  COCONUT_BRANCHES,
  COCONUT_DEFAULTS,
  COCONUT_SOURCES,
  COCONUT_VOCABULARY,
} from './coconutConfig';
import { buildCoconutLab } from './coconutModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function Vector({ label, vector }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {vector.map((value, index) => (
          <div key={index} className="rounded bg-white p-2 text-center font-mono text-sm text-slate-800">
            {value.toFixed(3)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoconutLatentReasoning() {
  const [branchWeight, setBranchWeight] = useState(COCONUT_DEFAULTS.branchWeight);
  const [latentSteps, setLatentSteps] = useState(COCONUT_DEFAULTS.latentSteps);

  const lab = useMemo(() => buildCoconutLab({
    branchA: COCONUT_BRANCHES[0],
    branchB: COCONUT_BRANCHES[1],
    vocabulary: COCONUT_VOCABULARY,
    branchWeight,
    latentSteps,
    reasoningSteps: COCONUT_DEFAULTS.reasoningSteps,
    answerTokens: COCONUT_DEFAULTS.answerTokens,
  }), [branchWeight, latentSteps]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Latent reasoning</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Coconut: feed hidden state back before decoding a word</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Coconut&apos;s defining operation is mechanical: during the continuous-thought region, the previous last hidden state becomes the next input embedding directly.
          A normal chain-of-thought step first projects that state through the vocabulary, chooses a discrete token, then feeds that token&apos;s embedding back.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Toy branch-A weight: {(branchWeight * 100).toFixed(0)}%
            <input
              data-math-control
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={branchWeight}
              onChange={(event) => setBranchWeight(Number(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Curriculum latent steps: {latentSteps}/{COCONUT_DEFAULTS.reasoningSteps}
            <input
              data-math-control
              type="range"
              min="0"
              max={COCONUT_DEFAULTS.reasoningSteps}
              step="1"
              value={latentSteps}
              onChange={(event) => setLatentSteps(Number(event.target.value))}
            />
          </label>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          The branch vectors below are an explicit geometry toy for understanding continuous versus discrete state. They are not benchmark accuracies or claimed model internals.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="Route A similarity" value={lab.routeASimilarity.toFixed(3)} detail="cosine to toy route A" />
        <Metric label="Route B similarity" value={lab.routeBSimilarity.toFixed(3)} detail="cosine to toy route B" />
        <Metric label="Branch entropy" value={`${lab.branchEntropyBits.toFixed(3)} bits`} detail="1 bit is maximally mixed" />
        <Metric label="Nearest token" value={lab.decoded.token} detail={`cosine ${lab.decoded.similarity.toFixed(3)}`} />
        <Metric label="Projection loss" value={lab.projectionError.toFixed(3)} detail="distance after forced token decode" />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Brain size={16} /> Continuous feedback
          </h3>
          <div className="mt-4 space-y-3">
            <Vector label="hₜ fed directly into position t+1" vector={lab.latentFeedbackInput} />
            <p className="text-sm leading-6 text-slate-700">
              No vocabulary argmax is required inside latent mode. The continuous vector can retain components that do not correspond exactly to one token embedding.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <GitBranch size={16} /> Discrete CoT feedback
          </h3>
          <div className="mt-4 space-y-3">
            <Vector label={`embedding(${lab.decoded.token})`} vector={lab.decodedFeedbackInput} />
            <p className="text-sm leading-6 text-slate-700">
              Decoding chooses one vocabulary item. In this toy geometry, that projection moves the feedback state by {lab.projectionError.toFixed(3)} in normalized Euclidean distance.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Layers3 size={16} /> Curriculum and loss mask
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {lab.layout.positions.map((position, index) => (
            <div
              key={`${position.label}-${index}`}
              className={`rounded border px-3 py-2 text-center ${position.type === 'latent' ? 'border-indigo-300 bg-indigo-50' : position.type === 'answer-token' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}
            >
              <strong className="block font-mono text-sm text-slate-900">{position.label}</strong>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{position.supervised ? 'loss target' : 'no token target'}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Metric label="Latent positions" value={lab.layout.latentCount} detail="hidden-state feedback steps" />
          <Metric label="Visible reasoning" value={lab.layout.visibleReasoningCount} detail="remaining text reasoning targets" />
          <Metric label="Supervised targets" value={lab.layout.supervisedCount} detail="remaining reasoning + answer tokens" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
          <strong className="text-xs uppercase tracking-wide text-indigo-700">Delayed commitment</strong>
          {lab.delayedCommitment
            ? ' The toy state is still distributed across both branches; neither exceeds the 85% commitment threshold.'
            : ' One toy branch exceeds the 85% threshold, so this state is already strongly committed.'}
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="text-xs uppercase tracking-wide text-emerald-700">What is exact here</strong>
          The vector projection, cosine similarities, entropy, curriculum layout, and loss-mask counts are deterministic calculations.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700"><ShieldCheck size={14} /> What is not claimed</strong>
          This lesson does not turn latent-step count into a fictional accuracy score. Whether latent states are useful or faithful is an empirical question.
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Source</h3>
        {COCONUT_SOURCES.map((source) => (
          <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="mt-3 block rounded border border-slate-200 p-3 text-sm hover:border-indigo-400">
            <strong className="flex items-center gap-2 text-slate-950">{source.label}<ExternalLink size={14} /></strong>
            <span className="mt-1 block text-xs leading-5 text-slate-600">{source.note}</span>
          </a>
        ))}
      </section>

      <AssessmentPanel lessonId="coconut-latent-reasoning" title="Coconut latent reasoning check" />
    </div>
  );
}
