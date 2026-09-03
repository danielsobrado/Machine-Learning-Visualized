import React, { useMemo, useState } from 'react';
import { AlertTriangle, Braces, Gauge } from 'lucide-react';
import {
  contextBudgetUsage,
  greedyLongestMatchTokenize,
  leadingBoundaryExperiment,
  unicodeNormalizationExperiment,
} from './tokenizationModel.js';

function TokenRow({ label, text, tokens }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 rounded-lg bg-slate-950 px-3 py-2 font-mono text-sm text-white">{text}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tokens.map((item, index) => (
          <span key={`${item.start}-${index}`} className={`rounded-lg border px-2 py-1 font-mono text-xs ${item.known ? 'border-indigo-200 bg-indigo-50 text-indigo-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            {item.token === ' ' ? '␣' : item.token}
          </span>
        ))}
      </div>
      <div className="mt-2 text-sm font-bold text-slate-700">{tokens.length} token{tokens.length === 1 ? '' : 's'}</div>
    </div>
  );
}

export default function BoundaryFailureLab() {
  const [contextLimit, setContextLimit] = useState(5);
  const boundary = useMemo(() => leadingBoundaryExperiment(), []);
  const unicode = useMemo(() => unicodeNormalizationExperiment(), []);
  const budget = useMemo(() => contextBudgetUsage(boundary.withoutBoundary, contextLimit), [contextLimit, boundary.withoutBoundary]);
  const normalizedTokens = useMemo(() => greedyLongestMatchTokenize(unicode.decomposed.normalize('NFC')), [unicode.decomposed]);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-indigo-700">
          <Braces size={16} /> Token boundary failure lab
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">One tiny text change can completely change token cost</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          This uses an explicit toy whitespace-aware vocabulary. It is not pretending to be GPT BPE. The point is structural: tokenization depends on exact learned vocabulary entries and preprocessing boundaries, not only on visible words.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <TokenRow label="Leading-space form" text={boundary.withBoundary} tokens={boundary.withTokens} />
        <TokenRow label="Same words, boundary removed" text={boundary.withoutBoundary} tokens={boundary.withoutTokens} />
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={19} />
          <div>
            <h3 className="font-black text-amber-950">Token count inflated {boundary.inflation.toFixed(1)}×</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              The visible content barely changed, but this toy vocabulary has a single token for " hello" and only character fallbacks for "hello" at the beginning of a string. Production tokenizers differ, but the failure mode is real: whitespace, casing, punctuation, normalization, and nearby characters can change segmentation and cost.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700">
          <Gauge size={16} /> Context budget
        </div>
        <label className="mt-4 block text-sm font-bold text-slate-700" htmlFor="token-context-limit">
          Context limit: {contextLimit} tokens
        </label>
        <input id="token-context-limit" type="range" min="2" max="12" step="1" value={contextLimit} onChange={(event) => setContextLimit(Number(event.target.value))} className="mt-2 w-full accent-violet-600" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-500">Characters</div><div className="mt-1 text-2xl font-black">{boundary.withoutBoundary.length}</div></div>
          <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-black uppercase text-slate-500">Tokens</div><div className="mt-1 text-2xl font-black">{budget.count}</div></div>
          <div className={`rounded-xl p-4 ${budget.overflow > 0 ? 'bg-rose-50 text-rose-900' : 'bg-emerald-50 text-emerald-900'}`}><div className="text-xs font-black uppercase">Budget result</div><div className="mt-1 text-2xl font-black">{budget.overflow > 0 ? `+${budget.overflow} over` : `${budget.remaining} left`}</div></div>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
        <h3 className="font-black text-slate-950">Unicode normalization trap</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          These two strings normalize to the same NFC text, but their raw code-point sequences differ. A tokenizer/preprocessing pipeline that does not normalize them identically can produce different token sequences.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <TokenRow label={`Composed · ${unicode.composedCodePoints.join(' ')}`} text={unicode.composed} tokens={unicode.composedTokens} />
          <TokenRow label={`Decomposed · ${unicode.decomposedCodePoints.join(' ')}`} text={unicode.decomposed} tokens={unicode.decomposedTokens} />
        </div>
        <p className="mt-4 rounded-xl border border-cyan-200 bg-white p-3 text-sm text-slate-700">
          NFC-normalizing the decomposed form gives {normalizedTokens.length} token in this toy vocabulary. The engineering lesson is to version and test tokenizer + normalization behavior together.
        </p>
      </section>
    </div>
  );
}
