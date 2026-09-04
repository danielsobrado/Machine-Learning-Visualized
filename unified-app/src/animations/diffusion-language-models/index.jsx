import React, { useMemo, useState } from 'react';
import { Blocks, Eye, Repeat2, Shuffle, Timer } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { DIFFUSION_DEFAULTS, DIFFUSION_SAMPLE_TOKENS } from './diffusionConfig';
import { buildDiffusionLab } from './diffusionModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function DiffusionLanguageModelsAnimation() {
  const [sequenceLength, setSequenceLength] = useState(DIFFUSION_DEFAULTS.sequenceLength);
  const [diffusionSteps, setDiffusionSteps] = useState(DIFFUSION_DEFAULTS.diffusionSteps);
  const [blockSize, setBlockSize] = useState(DIFFUSION_DEFAULTS.blockSize);
  const [blockSteps, setBlockSteps] = useState(DIFFUSION_DEFAULTS.blockSteps);
  const [corruptionProbability, setCorruptionProbability] = useState(DIFFUSION_DEFAULTS.corruptionProbability);
  const [seed, setSeed] = useState(DIFFUSION_DEFAULTS.seed);
  const lab = useMemo(
    () => buildDiffusionLab({ sequenceLength, diffusionSteps, blockSize, blockSteps, corruptionProbability, seed, sampleTokens: DIFFUSION_SAMPLE_TOKENS }),
    [sequenceLength, diffusionSteps, blockSize, blockSteps, corruptionProbability, seed],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Generative language models</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Masked diffusion: fewer sequential passes is not automatically faster</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Autoregressive decoding commits one new token per model call. Masked diffusion can revise many positions in one denoising pass.
          This lab counts corruption, denoising schedules, and sequential model calls exactly while keeping wall-clock claims out of the toy model.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-5">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Sequence: {sequenceLength}<input type="range" min="32" max="512" step="32" value={sequenceLength} onChange={(e) => setSequenceLength(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Diffusion steps: {diffusionSteps}<input type="range" min="2" max="64" step="2" value={diffusionSteps} onChange={(e) => setDiffusionSteps(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Block size: {blockSize}<input type="range" min="16" max="128" step="16" value={blockSize} onChange={(e) => setBlockSize(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Steps / block: {blockSteps}<input type="range" min="2" max="32" step="2" value={blockSteps} onChange={(e) => setBlockSteps(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Training mask p: {corruptionProbability.toFixed(2)}<input type="range" min="0" max="1" step="0.05" value={corruptionProbability} onChange={(e) => setCorruptionProbability(Number(e.target.value))} /></label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="AR passes" value={lab.arPasses} detail="one token committed per pass" />
        <Metric label="Full diffusion" value={lab.fullPasses} detail="whole masked sequence per pass" />
        <Metric label="Block diffusion" value={lab.blockPasses} detail="blocks × denoise steps" />
        <Metric label="Positions / pass" value={lab.fullParallelism.toFixed(1)} detail="average finalized positions" />
        <Metric label="Pass reduction" value={`${lab.passReductionVsAr.toFixed(1)}×`} detail="not a wall-clock speedup claim" />
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Shuffle size={16} /> Forward corruption</h3>
            <button type="button" onClick={() => setSeed((value) => value + 1)} className="rounded border border-slate-300 px-3 py-2 text-xs font-bold">New seed</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {lab.corruption.corrupted.map((token, index) => (
              <span key={index} className={`rounded border px-2 py-1 font-mono text-xs ${token === '[MASK]' ? 'border-indigo-300 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{token}</span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            This seeded sample masked <strong>{lab.corruption.maskedIndices.length}/{DIFFUSION_SAMPLE_TOKENS.length}</strong> positions.
            The expectation is {lab.expectedMasked.toFixed(2)} because each position is independently masked with probability p.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Repeat2 size={16} /> Reverse denoising schedule</h3>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {lab.schedule.map((row) => (
              <div key={row.step} className="rounded border border-slate-200 bg-slate-50 p-2 text-center">
                <strong className="block text-sm text-slate-900">+{row.reveal}</strong>
                <span className="text-[10px] text-slate-500">step {row.step}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">The schedule reveals exactly <strong>{lab.totalRevealed}</strong> positions by the final denoising step. A real model decides <em>which</em> positions using its predicted distribution/confidence.</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-700"><Eye size={15} /> Training objective</strong>
          Masked-token diffusion predicts corrupted positions. Loss should be computed on the chosen corrupted targets, not silently averaged over untouched tokens.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700"><Timer size={15} /> Passes ≠ latency</strong>
          A diffusion pass processes many positions and may cost more than one autoregressive decode step. Hardware, sequence length, batching, and caching decide actual latency.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-700"><Blocks size={15} /> Block diffusion</strong>
          Blocks trade global parallel updates for left-to-right structure. Here the sequential call count is ceil(L / block) × steps-per-block.
        </div>
      </section>

      <AssessmentPanel lessonId="diffusion-language-models" title="Diffusion language model check" />
    </div>
  );
}
