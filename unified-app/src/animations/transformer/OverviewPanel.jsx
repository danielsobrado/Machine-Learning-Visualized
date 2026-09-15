import React, { useState } from 'react';
import { ArrowRight, GitBranch, Layers3, Network, Workflow } from 'lucide-react';
import {
  ARCHITECTURE_SCOPE_NOTE,
  EXECUTION_MODES,
  ORIGINAL_TRANSFORMER_FLOW,
  ORIGINAL_TRANSFORMER_STACKS,
} from './transformerOverviewConstants.js';

function StackCard({ stack }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
        <Layers3 size={16} />
        {stack.label}
      </div>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800">
        {stack.input}
      </div>
      <div className="my-3 flex justify-center text-slate-400">↓</div>
      <div className="space-y-2">
        {stack.sublayers.map((sublayer) => (
          <div key={sublayer} className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-950">
            {sublayer}
          </div>
        ))}
      </div>
      <div className="my-3 flex justify-center text-slate-400">↓</div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-950">
        {stack.output}
      </div>
    </article>
  );
}

function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-black transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  );
}

export default function OverviewPanel() {
  const [mode, setMode] = useState('training');
  const execution = EXECUTION_MODES[mode];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700">
          <Network size={16} />
          Original Transformer architecture
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
          Encoder–decoder Transformer, without mixing training and generation
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">
          The 2017 Transformer is a sequence-to-sequence encoder–decoder model. Its encoder builds source representations;
          its decoder uses causal target self-attention plus cross-attention into those source states. Modern models often
          keep only one side of this architecture.
        </p>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          {ARCHITECTURE_SCOPE_NOTE}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {ORIGINAL_TRANSFORMER_STACKS.map((stack) => <StackCard key={stack.id} stack={stack} />)}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Workflow size={16} />
          End-to-end data flow
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
          {ORIGINAL_TRANSFORMER_FLOW.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-black text-slate-950">{step.label}</div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{step.detail}</p>
              </div>
              {index < ORIGINAL_TRANSFORMER_FLOW.length - 1 && (
                <ArrowRight className="mx-auto hidden text-slate-400 lg:block" size={18} />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <GitBranch size={16} />
              Training vs inference
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Causal masking is used in both modes, but the source of the target prefix and the amount of parallel work are different.
            </p>
          </div>
          <div className="flex gap-2">
            {Object.entries(EXECUTION_MODES).map(([id, option]) => (
              <ModeButton key={id} active={mode === id} onClick={() => setMode(id)}>
                {option.label}
              </ModeButton>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-blue-700">Decoder input</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-blue-950">{execution.targetInput}</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-violet-700">Parallelism</div>
            <p className="mt-2 text-sm leading-6 text-violet-950">{execution.parallelism}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Output use</div>
            <p className="mt-2 text-sm leading-6 text-emerald-950">{execution.output}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">Parallelism caveat</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            Attention evaluates visible positions in parallel inside a forward pass. Autoregressive inference is still serial
            across newly generated tokens because each next step depends on the token selected previously.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-rose-700">Visibility caveat</h3>
          <p className="mt-3 text-sm leading-6 text-rose-950">
            “Any token can attend to any token” is true only for full attention without a causal restriction. Decoder self-attention
            cannot read future target positions, and sparse/local variants impose additional limits.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Normalization caveat</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            The original Transformer used residual addition followed by LayerNorm. Many modern models use pre-norm instead;
            the residual-stream lesson shows that ordering explicitly.
          </p>
        </div>
      </section>
    </div>
  );
}
