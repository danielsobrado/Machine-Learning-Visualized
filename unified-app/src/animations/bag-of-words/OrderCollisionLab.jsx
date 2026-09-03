import React from 'react';
import { AlertTriangle, ArrowRightLeft, Layers3 } from 'lucide-react';
import { ORDER_COLLISION_SENTENCES, orderCollisionExperiment } from './bagOfWordsModel';

function VectorRow({ vocabulary, vector, label }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {vocabulary.map((term, index) => (
          <span key={term} className="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-700">
            <span className="font-medium">{term}</span>
            <span className="ml-1 font-mono font-bold text-slate-950">{vector[index]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OrderCollisionLab() {
  const result = orderCollisionExperiment();

  return (
    <div className="p-4 md:p-6">
      <section className="mx-auto max-w-6xl rounded-xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-amber-800">Representation failure lab</div>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Different meaning, identical Bag-of-Words vector</h2>
            <p className="mt-2 max-w-4xl text-sm text-slate-700">
              Unigram Bag of Words records which words occur and how often. It does not record who did what to whom.
              Reordering the same tokens can therefore create a representation collision even when the sentence meaning changes.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 font-bold text-slate-950">
              <ArrowRightLeft size={18} />
              Unigram collision
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-slate-50 p-3 text-lg font-semibold text-slate-900">
                “{ORDER_COLLISION_SENTENCES.first}”
              </div>
              <VectorRow vocabulary={result.unigramVocabulary} vector={result.firstUnigram} label="unigram vector A" />
              <div className="rounded-lg bg-slate-50 p-3 text-lg font-semibold text-slate-900">
                “{ORDER_COLLISION_SENTENCES.second}”
              </div>
              <VectorRow vocabulary={result.unigramVocabulary} vector={result.secondUnigram} label="unigram vector B" />
            </div>
            <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-900">
              Collision: <strong>{result.unigramCollision ? 'yes' : 'no'}</strong>. A unigram model receives exactly the same input vector.
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 font-bold text-slate-950">
              <Layers3 size={18} />
              Bigrams preserve some local order
            </div>
            <div className="mt-4 space-y-3">
              <VectorRow vocabulary={result.bigramVocabulary} vector={result.firstBigram} label="bigram vector A" />
              <VectorRow vocabulary={result.bigramVocabulary} vector={result.secondBigram} label="bigram vector B" />
            </div>
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
              Collision: <strong>{result.bigramCollision ? 'yes' : 'no'}</strong>. Local word order now separates this pair.
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Bigrams help, but they increase vocabulary size and still do not encode long-range syntax or semantics. They are a tradeoff, not a universal fix.
            </p>
          </article>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-700">
          <strong className="text-slate-950">Correction:</strong> “Bag of Words loses word order” is not a cosmetic limitation. It means two examples with materially different labels can become mathematically indistinguishable before the classifier even starts learning.
        </div>
      </section>
    </div>
  );
}
