import React, { useMemo, useState } from 'react';
import { AlertTriangle, Hash, Puzzle, ShieldCheck } from 'lucide-react';
import {
  FASTTEXT_BUCKET_OPTIONS,
  FASTTEXT_COLLISION_WORDS,
  FASTTEXT_OOV_EXAMPLES,
  FASTTEXT_SUBWORD_DEFAULTS,
  FASTTEXT_TRAINING_WORDS,
} from './fastTextConstants.js';
import {
  crossWordBucketCollisions,
  subwordSupportExperiment,
} from './fastTextModel.js';

function Percent({ value }) {
  return <span className="font-mono font-black">{(value * 100).toFixed(1)}%</span>;
}

export default function OOVPanel() {
  const [word, setWord] = useState(FASTTEXT_OOV_EXAMPLES[0]);
  const [bucketCount, setBucketCount] = useState(8);

  const support = useMemo(() => subwordSupportExperiment({
    trainingWords: FASTTEXT_TRAINING_WORDS,
    word,
    bucketCount: FASTTEXT_SUBWORD_DEFAULTS.bucketCount,
  }), [word]);

  const collisions = useMemo(() => crossWordBucketCollisions(
    FASTTEXT_COLLISION_WORDS.first,
    FASTTEXT_COLLISION_WORDS.second,
    bucketCount,
  ), [bucketCount]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-20 md:p-6">
      <header className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-purple-700">
          <Puzzle size={17} /> OOV quality reality check
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">FastText can construct an OOV vector. That does not guarantee a good semantic vector.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          FastText represents words through character n-gram parameters. An unseen spelling can therefore reuse subword parameters learned from other words. Quality depends on whether those pieces carry useful training signal; spelling overlap is evidence about morphology and form, not a proof of semantic similarity.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[310px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-slate-950">Toy training vocabulary</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {FASTTEXT_TRAINING_WORDS.map((token) => (
              <span key={token} className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-bold text-purple-800">{token}</span>
            ))}
          </div>

          <div className="mt-5 text-sm font-bold text-slate-700">Unseen word</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {FASTTEXT_OOV_EXAMPLES.map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => setWord(token)}
                aria-pressed={word === token}
                className={`rounded-lg border px-3 py-2 text-sm font-black ${word === token ? 'border-purple-500 bg-purple-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
              >
                {token}
              </button>
            ))}
          </div>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-950">Subword support for “{word}”</h3>
              <p className="mt-1 text-sm text-slate-600">Character n-grams of length {FASTTEXT_SUBWORD_DEFAULTS.minN}–{FASTTEXT_SUBWORD_DEFAULTS.maxN}, with word boundaries.</p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-black ${support.exactSupportRatio > 0.2 ? 'bg-emerald-100 text-emerald-800' : support.exactSupportRatio > 0 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'}`}>
              exact trained support <Percent value={support.exactSupportRatio} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">Total n-grams</div>
              <strong className="mt-1 block text-2xl text-slate-950">{support.ngrams.length}</strong>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Exact pieces seen</div>
              <strong className="mt-1 block text-2xl text-slate-950">{support.exactSupported.length}</strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">Exact support ratio</div>
              <strong className="mt-1 block text-2xl text-slate-950"><Percent value={support.exactSupportRatio} /></strong>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {support.ngrams.map((ngram) => {
              const trained = support.exactSupported.includes(ngram);
              return (
                <span key={ngram} className={`rounded-md border px-2 py-1 font-mono text-xs font-bold ${trained ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                  {ngram}
                </span>
              );
            })}
          </div>

          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {support.exactSupportRatio === 0
              ? 'This toy vocabulary provides no exact trained character n-grams for the OOV word. FastText can still hash its pieces to buckets, but that alone does not create reliable semantics.'
              : 'The OOV word reuses some genuinely trained character pieces. That is why related morphology can work well—but the remaining pieces and their corpus evidence still matter.'}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-800">
          <Hash size={17} /> Hash-bucket collision lab
        </div>
        <h3 className="mt-2 text-xl font-black text-slate-950">Different n-grams can share one parameter bucket</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          FastText stores subword vectors in a finite hash table instead of allocating a separate vector for every possible string. Collisions are therefore possible. The tiny bucket counts below exaggerate the effect so it is visible; production defaults use a much larger table.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {FASTTEXT_BUCKET_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBucketCount(option)}
              aria-pressed={bucketCount === option}
              className={`rounded-lg border px-3 py-2 text-sm font-black ${bucketCount === option ? 'border-amber-600 bg-amber-600 text-white' : 'border-amber-200 bg-white text-slate-700'}`}
            >
              {option.toLocaleString()} buckets
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">Collision pair</div>
            <div className="mt-2 text-2xl font-black text-slate-950">cat ↔ zoo</div>
            <div className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">Different-string collisions</div>
            <div className="mt-1 text-3xl font-black text-amber-700">{collisions.length}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-4">
            {collisions.length > 0 ? (
              <div className="space-y-2">
                {collisions.slice(0, 8).map((collision, index) => (
                  <div key={`${collision.firstNgram}-${collision.secondNgram}-${index}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm">
                    <span>{collision.firstNgram}</span>
                    <strong className="text-amber-700">bucket {collision.bucket}</strong>
                    <span className="text-right">{collision.secondNgram}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-28 items-center gap-3 text-sm leading-6 text-emerald-900">
                <ShieldCheck size={24} /> No collision for this selected pair at this bucket count. That does not prove the entire vocabulary is collision-free.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
        <AlertTriangle size={18} className="mr-2 inline" />
        <strong>OOV vector ≠ known meaning.</strong> FastText is especially useful for morphology, spelling variants, and related forms, but an unseen word can have weak subword evidence or accidental bucket sharing. Evaluate downstream quality instead of treating “a vector was produced” as success.
      </section>
    </div>
  );
}
