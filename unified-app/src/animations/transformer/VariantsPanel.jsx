import React, { useState } from 'react';
import { GitBranch, Network, Sparkles } from 'lucide-react';
import {
  TRANSFORMER_FAMILIES,
  TRANSFORMER_SYSTEM_PATTERNS,
} from './transformerVariantConstants.js';

function FamilyButton({ family, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
        active
          ? 'border-indigo-700 bg-indigo-700 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
      }`}
    >
      {family.label}
    </button>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 md:grid-cols-[180px_1fr]">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm leading-6 text-slate-800">{children}</div>
    </div>
  );
}

export default function VariantsPanel() {
  const [selectedId, setSelectedId] = useState('decoder-only');
  const selected = TRANSFORMER_FAMILIES.find((family) => family.id === selectedId);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700">
          <GitBranch size={16} />
          Transformer family map
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Three common architecture families</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">
          “Transformer” does not mean one fixed stack. The family is determined by which stacks are present, the visibility
          pattern inside self-attention, whether cross-attention exists, and the training objective. These are common patterns,
          not rules that every model must follow exactly.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-2 md:grid-cols-3">
          {TRANSFORMER_FAMILIES.map((family) => (
            <FamilyButton
              key={family.id}
              family={family}
              active={selectedId === family.id}
              onClick={() => setSelectedId(family.id)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-indigo-700">
            <Network size={16} />
            {selected.label}
          </div>
          <div className="mt-4 text-xs font-black uppercase tracking-wide text-indigo-700">Documented examples</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.examples.map((example) => (
              <span key={example} className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-bold text-indigo-950">
                {example}
              </span>
            ))}
          </div>
          <div className="mt-5 text-xs font-black uppercase tracking-wide text-indigo-700">Typical uses</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.typicalUses.map((useCase) => (
              <span key={useCase} className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-900">
                {useCase}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <DetailRow label="Self-attention">{selected.selfAttention}</DetailRow>
          <DetailRow label="Cross-attention">{selected.crossAttention}</DetailRow>
          <DetailRow label="Common objective">{selected.commonObjective}</DetailRow>
          <DetailRow label="Natural output">{selected.naturalOutput}</DetailRow>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {TRANSFORMER_FAMILIES.map((family) => (
          <article key={family.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-black text-slate-950">{family.label}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{family.selfAttention}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700"><strong>Cross:</strong> {family.crossAttention}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Sparkles size={16} />
          Orthogonal system patterns
        </div>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          MoE, long-context techniques, and multimodal wiring are not fourth/fifth/sixth architecture families. They can be
          combined with different Transformer families and should be reasoned about separately.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {TRANSFORMER_SYSTEM_PATTERNS.map((pattern) => (
            <article key={pattern.title} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-black text-slate-950">{pattern.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{pattern.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Do not infer private architectures</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            If a vendor has not publicly documented a model's architecture, do not use that model as a canonical example of a
            specific family merely because external speculation is common.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">No universal 512-token limit</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            The Transformer architecture itself does not impose a universal 512-token context limit. Practical limits come from
            model configuration, training, position handling, attention cost, memory, and serving constraints.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">MoE compute caveat</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Sparse routing can activate fewer parameters per token than the model stores, but it does not make routing,
            communication, memory traffic, or expert computation free.
          </p>
        </div>
      </section>
    </div>
  );
}
