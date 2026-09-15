import React, { useState } from 'react';
import { ArrowRight, GitBranch, Lock, Network } from 'lucide-react';
import {
  CAUSAL_MASK,
  DECODER_EXECUTION,
  DECODER_SUBLAYERS,
} from './transformerDecoderConstants.js';

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
        active
          ? 'border-violet-700 bg-violet-700 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-violet-300'
      }`}
    >
      {children}
    </button>
  );
}

function TokenRow({ label, tokens, tone }) {
  const styles = tone === 'input'
    ? 'border-blue-200 bg-blue-50 text-blue-950'
    : 'border-emerald-200 bg-emerald-50 text-emerald-950';

  return (
    <div>
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`} className={`rounded-lg border px-3 py-2 font-mono text-sm font-bold ${styles}`}>
            {token}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DecoderPanel() {
  const [mode, setMode] = useState('training');
  const execution = DECODER_EXECUTION[mode];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700">
          <Network size={16} />
          Encoder–decoder Transformer
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">The decoder stack</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">
          This tab models the decoder from the original encoder–decoder Transformer family. It has causal target
          self-attention, cross-attention into encoder states, and a position-wise FFN. A decoder-only language model keeps
          causal self-attention and the FFN but normally has no encoder cross-attention branch.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-black uppercase tracking-wide text-slate-600">One decoder block</div>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-900">
              Target-prefix residual stream
            </div>
            {DECODER_SUBLAYERS.map((sublayer) => (
              <React.Fragment key={sublayer.id}>
                <div className="flex justify-center text-slate-400">↓</div>
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <div className="font-black text-violet-950">{sublayer.label}</div>
                  <p className="mt-2 text-sm leading-6 text-violet-900">{sublayer.detail}</p>
                  <div className="mt-3 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600">
                    Residual addition + architecture-specific normalization placement
                  </div>
                </div>
              </React.Fragment>
            ))}
            <div className="flex justify-center text-slate-400">↓</div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-950">
              Final hidden state → vocabulary logits
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <Lock size={16} />
              Causal target mask
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Rows are target queries and columns are target keys. A query may read its own position and earlier target positions,
              but not later target positions.
            </p>
            <div className="mt-4 grid w-fit grid-cols-5 gap-1">
              {CAUSAL_MASK.flatMap((row, rowIndex) => row.map((enabled, columnIndex) => (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={`flex h-9 w-9 items-center justify-center rounded border text-xs font-black ${
                    enabled
                      ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                      : 'border-rose-200 bg-rose-50 text-rose-500'
                  }`}
                  title={`query ${rowIndex}, key ${columnIndex}`}
                >
                  {enabled ? '✓' : '×'}
                </div>
              )))}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-700">
              <ArrowRight size={16} />
              Cross-attention
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg border border-violet-200 bg-white p-3"><strong>Q</strong><br />decoder states</div>
              <div className="rounded-lg border border-cyan-200 bg-white p-3"><strong>K</strong><br />encoder states</div>
              <div className="rounded-lg border border-cyan-200 bg-white p-3"><strong>V</strong><br />encoder states</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-amber-950">
              The causal target mask does not mean the decoder can see only part of the source. Cross-attention normally allows
              each target query to read all valid encoder source positions, subject to source padding or task-specific masks.
            </p>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <GitBranch size={16} />
              Training and inference are different loops
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              “Shift right” describes how target examples are constructed for teacher-forced training. It is not an operation
              applied to a ground-truth target sequence during inference because no such target sequence exists then.
            </p>
          </div>
          <div className="flex gap-2">
            {Object.entries(DECODER_EXECUTION).map(([id, option]) => (
              <ModeButton key={id} active={mode === id} onClick={() => setMode(id)}>
                {option.label}
              </ModeButton>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <TokenRow label={execution.inputLabel} tokens={execution.input} tone="input" />
          <ArrowRight className="mx-auto hidden text-slate-400 lg:block" size={24} />
          <TokenRow label={execution.outputLabel} tokens={execution.output} tone="output" />
        </div>
        <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {execution.explanation}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-blue-700">Training parallelism</h3>
          <p className="mt-3 text-sm leading-6 text-blue-950">
            Teacher forcing exposes the correct previous target tokens as inputs, so all target positions can be scored in one
            forward pass while the causal mask prevents future-target leakage.
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-violet-700">Inference seriality</h3>
          <p className="mt-3 text-sm leading-6 text-violet-950">
            At inference, token t+1 depends on the token selected at step t. The outer generation loop is therefore serial even
            though the matrix operations inside each decode step are parallel.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Modern optimization</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            KV caching reuses prior target self-attention keys and values during decoding. It is an inference optimization, not
            a change to the causal modeling objective.
          </p>
        </div>
      </section>
    </div>
  );
}
