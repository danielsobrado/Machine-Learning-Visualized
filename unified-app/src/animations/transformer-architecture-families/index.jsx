import React, { useMemo, useState } from 'react';
import { GitBranch, RotateCcw, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  CAUSAL_ATTENTION_MATRIX,
  FAMILY_COLORS,
  FULL_ATTENTION_MATRIX,
  TRANSFORMER_ARCHITECTURE_FAMILIES,
} from './architectureFamilyConstants.js';

function attentionMatrix(family) {
  return family === 'encoder' ? FULL_ATTENTION_MATRIX : CAUSAL_ATTENTION_MATRIX;
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function TokenRow({ label, tokens, activeColor }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`} className={`rounded-lg border px-3 py-2 text-sm font-black ${activeColor}`}>
            {token}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TransformerArchitectureFamiliesAnimation() {
  const [family, setFamily] = useState('decoder');
  const config = TRANSFORMER_ARCHITECTURE_FAMILIES[family];
  const color = FAMILY_COLORS[config.color];
  const matrix = useMemo(() => attentionMatrix(family), [family]);

  const reset = () => setFamily('decoder');

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Transformer families</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Encoder-Only vs Decoder-Only vs Encoder-Decoder</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              These families differ in attention visibility, available context, output contract, and common training objectives.
              Autoregressive generation is a serial inference loop; causal training can still score many token positions in parallel.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Architecture controls
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {Object.entries(TRANSFORMER_ARCHITECTURE_FAMILIES).map(([id, option]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFamily(id)}
              className={`rounded-lg border px-3 py-3 text-sm font-black transition ${family === id ? FAMILY_COLORS[option.color].active : 'border-slate-200 bg-slate-50 text-slate-700'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Family" value={config.label} detail={config.example} />
        <Stat label="Objective" value={config.objectiveLabel} detail="common training signal" />
        <Stat label="Visibility" value={family === 'encoder' ? 'Full' : family === 'decoder' ? 'Causal' : 'Mixed'} detail="attention pattern" />
        <Stat label="Natural output" value={family === 'encoder' ? 'Representations' : 'Token logits'} detail="before any decoding policy" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <GitBranch size={16} />
            Information flow
          </h3>
          <div className="mt-5 grid gap-4">
            <TokenRow label="Input / source" tokens={config.prompt} activeColor={color.soft} />
            {family === 'encoderDecoder' && (
              <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
                The encoder builds source representations first. The decoder uses a causally visible target prefix plus
                cross-attention into those source states.
              </div>
            )}
            <TokenRow label={config.targetLabel} tokens={config.target} activeColor="border-slate-200 bg-slate-50 text-slate-950" />
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Attention mask intuition</p>
            <div className="mt-3 grid w-fit grid-cols-5 gap-1">
              {matrix.flatMap((row, rowIndex) => row.map((enabled, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="h-8 w-8 rounded border border-white"
                  style={{ background: enabled ? color.line : '#e2e8f0' }}
                  title={`query ${rowIndex + 1}, key ${colIndex + 1}`}
                />
              )))}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{config.visible}</p>
            {family === 'encoderDecoder' && (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                The matrix shown here is the decoder's causal target self-attention. Cross-attention into encoder source states is a separate attention matrix.
              </p>
            )}
          </div>
        </section>

        <section className={`rounded-lg border p-5 ${color.soft}`}>
          <h3 className="text-sm font-black uppercase tracking-wide">Why this family exists</h3>
          <div className="mt-4 space-y-4 text-sm leading-6">
            <p><strong>Example:</strong> {config.example}</p>
            <p><strong>Common training objective:</strong> {config.objective}</p>
            <p><strong>Attention rule:</strong> {config.attention}</p>
            <p><strong>Execution:</strong> {config.execution}</p>
            <p><strong>Natural output contract:</strong> {config.output}</p>
          </div>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-cyan-700">Problem solved</h3>
          <p className="mt-3 text-sm leading-6 text-cyan-950">
            Architecture families explain why representation models, causal language models, and source-conditioned
            sequence-to-sequence models expose different information flows even when all use Transformer blocks.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-amber-700">Mistake to avoid</h3>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            Do not equate “autoregressive” with “training one token per forward pass.” Causal masking lets teacher-forced
            training score multiple next-token targets in parallel; serial dependence appears across inference decisions.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-emerald-700">Understanding check</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950">
            Pick a task, then identify the available context, required output, attention visibility, and training objective before choosing a family.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="transformer-architecture-families" title="Transformer Architecture Families check" />
    </div>
  );
}
