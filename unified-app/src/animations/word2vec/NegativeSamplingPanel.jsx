import React, { useMemo, useState } from 'react';
import { BarChart3, Dice5, Info, Zap } from 'lucide-react';
import {
  NEGATIVE_SAMPLING_COUNTS,
  NEGATIVE_SAMPLING_DEFAULTS,
  NEGATIVE_SAMPLING_EXPONENTS,
  NEGATIVE_SAMPLING_LIMITS,
} from './word2VecConstants.js';
import { negativeSamplingExperiment, noiseDistribution } from './word2VecModel.js';

function DistributionTable({ distribution }) {
  const maxProbability = Math.max(...distribution.map((item) => item.probability));
  return (
    <div className="space-y-3">
      {distribution.map((item) => (
        <div key={item.token} className="grid grid-cols-[72px_64px_1fr_70px] items-center gap-3">
          <strong className="font-mono text-slate-900">{item.token}</strong>
          <span className="text-right font-mono text-xs text-slate-500">n={item.count}</span>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${Math.max(1.5, (item.probability / maxProbability) * 100)}%` }}
            />
          </div>
          <span className="text-right font-mono text-sm font-black text-slate-800">
            {(item.probability * 100).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function NegativeSamplingPanel() {
  const [exponent, setExponent] = useState(NEGATIVE_SAMPLING_DEFAULTS.exponent);
  const [sampleCount, setSampleCount] = useState(NEGATIVE_SAMPLING_DEFAULTS.samples);

  const experiment = useMemo(() => negativeSamplingExperiment({
    counts: NEGATIVE_SAMPLING_COUNTS,
    exponent,
    samples: sampleCount,
    seed: NEGATIVE_SAMPLING_DEFAULTS.seed,
  }), [exponent, sampleCount]);

  const references = useMemo(() => ({
    uniform: noiseDistribution(NEGATIVE_SAMPLING_COUNTS, 0),
    word2vec: noiseDistribution(NEGATIVE_SAMPLING_COUNTS, 0.75),
    unigram: noiseDistribution(NEGATIVE_SAMPLING_COUNTS, 1),
  }), []);

  const probabilityFor = (distribution, token) => distribution.find((item) => item.token === token).probability;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-20 md:p-6">
      <header className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-orange-700">
          <Zap size={17} /> Negative sampling reality check
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">The negatives are sampled from a noise distribution—not from the first k vocabulary words</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Skip-gram with negative sampling replaces a full-vocabulary objective with one observed pair plus a small number of noise pairs. The classic Word2Vec choice samples context words approximately in proportion to unigram frequency raised to the 0.75 power.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-black text-slate-950"><Dice5 size={17} /> Noise controls</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">The corpus counts are intentionally skewed so the sampling choice is obvious.</p>

          <div className="mt-5 space-y-2">
            {NEGATIVE_SAMPLING_EXPONENTS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setExponent(option.value)}
                aria-pressed={exponent === option.value}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-black ${exponent === option.value ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
              >
                {option.label} <span className="float-right font-mono">p(w) ∝ n(w)^{option.value}</span>
              </button>
            ))}
          </div>

          <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="word2vec-negative-count">
            <span className="flex justify-between"><span>Preview samples</span><strong>{sampleCount}</strong></span>
            <input
              id="word2vec-negative-count"
              type="range"
              {...NEGATIVE_SAMPLING_LIMITS.samples}
              value={sampleCount}
              onChange={(event) => setSampleCount(Number(event.target.value))}
              className="mt-2 w-full accent-orange-600"
            />
          </label>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-black text-slate-950"><BarChart3 size={17} /> Current noise distribution</h3>
          <div className="mt-5"><DistributionTable distribution={experiment.distribution} /></div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">Seeded sample preview</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {experiment.samples.map((token, index) => (
                <span key={`${index}-${token}`} className="rounded-lg border border-orange-200 bg-white px-3 py-1 font-mono text-sm font-black text-orange-800">{token}</span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">The preview is seeded for reproducible teaching. A training implementation draws repeatedly from the chosen noise distribution.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Uniform</div>
          <strong className="mt-1 block text-xl text-slate-950">the: {(probabilityFor(references.uniform, 'the') * 100).toFixed(1)}%</strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">Ignores corpus frequency entirely. Useful as a contrast, not the classic Word2Vec choice.</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-orange-700">Unigram^0.75</div>
          <strong className="mt-1 block text-xl text-slate-950">the: {(probabilityFor(references.word2vec, 'the') * 100).toFixed(1)}%</strong>
          <p className="mt-1 text-sm leading-5 text-slate-700">Still samples common words more often, but less aggressively than raw unigram frequency.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Raw unigram</div>
          <strong className="mt-1 block text-xl text-slate-950">the: {(probabilityFor(references.unigram, 'the') * 100).toFixed(1)}%</strong>
          <p className="mt-1 text-sm leading-5 text-slate-600">Tracks frequency directly and is more concentrated on very common words.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
        <div className="flex items-start gap-3">
          <Info size={18} className="mt-1 shrink-0" />
          <p><strong>Do not mix two different tricks:</strong> the noise distribution decides which negative context words are sampled. Word2Vec's frequent-word subsampling is a separate preprocessing/training heuristic that can discard very common observed tokens. Negative sampling is also an alternative training objective, not an exact shortcut that computes the full softmax probability.</p>
        </div>
      </section>
    </div>
  );
}
