import React, { useMemo, useState } from 'react';
import { BookOpen, EyeOff } from 'lucide-react';
import {
  MLM_CORRUPTION_PROBABILITIES,
  MLM_SELECTION_RATE,
} from './bertPretrainingConstants.js';
import {
  defaultMlmExperiment,
  expectedMlmCounts,
  mlmLossMask,
} from './bertPretrainingModel.js';

function TokenRow({ tokens, selectedIndices = [], lossMask = [], originalTokens = [] }) {
  const selected = new Set(selectedIndices);
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token, index) => (
        <div key={`${index}-${token}`} className={`rounded-lg border px-3 py-2 font-mono text-sm ${selected.has(index) ? 'border-amber-400 bg-amber-50 text-amber-950' : 'border-slate-200 bg-white text-slate-700'}`}>
          <div>{token}</div>
          {lossMask[index] && <div className="mt-1 text-[10px] font-black uppercase tracking-wide text-rose-700">loss target: {originalTokens[index]}</div>}
        </div>
      ))}
    </div>
  );
}

export default function PreTrainingPanel() {
  const [task, setTask] = useState('mlm');
  const experiment = useMemo(() => defaultMlmExperiment(), []);
  const lossMask = useMemo(() => mlmLossMask(experiment.original.length, experiment.selectedIndices), [experiment]);
  const expectation = expectedMlmCounts(100);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Original BERT pre-training objectives</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">MLM and NSP</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Masked Language Modeling selects positions to predict, then corrupts their visible inputs. Selection, visible corruption, and loss positions are three related but different things.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:max-w-md">
          <button type="button" onClick={() => setTask('mlm')} aria-pressed={task === 'mlm'} className={`rounded-xl border px-4 py-3 font-black ${task === 'mlm' ? 'border-amber-500 bg-amber-500 text-slate-950' : 'border-slate-200 bg-white text-slate-700'}`}><EyeOff size={16} className="mr-2 inline" />MLM</button>
          <button type="button" onClick={() => setTask('nsp')} aria-pressed={task === 'nsp'} className={`rounded-xl border px-4 py-3 font-black ${task === 'nsp' ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}><BookOpen size={16} className="mr-2 inline" />NSP</button>
        </div>
      </section>

      {task === 'mlm' ? (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <div className="text-xs font-black uppercase tracking-wide text-blue-700">1. Select prediction positions</div>
              <div className="mt-2 text-3xl font-black text-slate-950">15%</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">The selection rate applies to token positions. On 100 tokens, the expectation is {expectation.selected.toFixed(0)} selected positions.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="text-xs font-black uppercase tracking-wide text-amber-700">2. Corrupt selected inputs</div>
              <div className="mt-2 font-mono text-sm font-black text-slate-950">80% [MASK] · 10% random · 10% unchanged</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">These percentages are conditional on already being selected. They are probabilities over many selected positions, not a quota every short sentence must exactly match.</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="text-xs font-black uppercase tracking-wide text-rose-700">3. Compute MLM loss</div>
              <div className="mt-2 text-xl font-black text-slate-950">All selected positions</div>
              <p className="mt-2 text-sm leading-6 text-slate-700">Loss is not restricted to positions visibly replaced by <span className="font-mono">[MASK]</span>. Random-replacement and unchanged selected positions are prediction targets too.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">20-token corruption example</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Exactly 3 of 20 positions are selected here, so the example really is 15%. To make all three corruption cases visible in one small row, this teaching example intentionally uses one mask, one random replacement, and one unchanged token; that local 1/1/1 split is illustrative, not the population 80/10/10 ratio.
            </p>
            <div className="mt-5">
              <div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Original</div>
              <TokenRow tokens={experiment.original} />
            </div>
            <div className="mt-5">
              <div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Visible model input + loss targets</div>
              <TokenRow tokens={experiment.corrupted} selectedIndices={experiment.selectedIndices} lossMask={lossMask} originalTokens={experiment.original} />
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <h3 className="font-black text-amber-950">The subtle failure in the old visualization</h3>
            <p className="mt-2 text-sm leading-6 text-amber-950">
              It labeled a 9-token example with 3 visible <span className="font-mono">[MASK]</span> tokens as “15% masking,” which visually looked like 33%, and then described the loss as applying only to “masked positions.” The corrected lesson separates <strong>selected prediction positions</strong> from the subset literally replaced by <span className="font-mono">[MASK]</span>.
            </p>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/50 p-5 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">Next Sentence Prediction in original BERT</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Original BERT also trained a binary sentence-pair objective: roughly half the pairs used the actual next sentence and half used a sampled alternative. The pair is encoded as <span className="font-mono">[CLS] A [SEP] B [SEP]</span>, and the classification head reads the final representation associated with <span className="font-mono">[CLS]</span>.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-emerald-700">IsNext</div><p className="mt-2 text-sm">A: The cat sat on the mat.</p><p className="mt-1 text-sm">B: It was very comfortable.</p></div>
            <div className="rounded-xl border border-rose-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-wide text-rose-700">NotNext</div><p className="mt-2 text-sm">A: The cat sat on the mat.</p><p className="mt-1 text-sm">B: Python is a programming language.</p></div>
          </div>
          <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">NSP and MLM are separate objectives. Replacing input tokens for MLM is also separate from an attention mask, which controls which positions a query can read.</p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
        <strong>Expected proportions over 100 original tokens:</strong> {100 * MLM_SELECTION_RATE} selected; among those selected, about {(expectation.mask).toFixed(1)} literal masks, {expectation.random.toFixed(1)} random replacements, and {expectation.unchanged.toFixed(1)} unchanged inputs.
      </section>
    </div>
  );
}
