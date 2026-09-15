import React, { useState } from 'react';
import { GitBranch, Layers3, Network } from 'lucide-react';
import {
  ENCODER_OUTPUT_DESTINATIONS,
  ENCODER_STEPS,
  ORIGINAL_ENCODER_DIMENSIONS,
} from './transformerEncoderConstants.js';

function StepButton({ step, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-950'
          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
      }`}
    >
      <div className="font-black">{step.label}</div>
    </button>
  );
}

export default function EncoderPanel() {
  const [selectedStepId, setSelectedStepId] = useState('attention');
  const selectedStep = ENCODER_STEPS.find((step) => step.id === selectedStepId);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-blue-700">
          <Network size={16} />
          Encoder stack
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Full-context source representations</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">
          An encoder block uses self-attention to mix information across visible source positions and a position-wise FFN to
          transform each position. Q, K, and V all come from the same source stream. “Full attention” still respects padding
          or task-specific masks; it does not mean invalid tokens must be visible.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Layers3 size={16} />
            Block anatomy
          </div>
          <div className="mt-4 grid gap-2">
            {ENCODER_STEPS.map((step) => (
              <StepButton
                key={step.id}
                step={step}
                active={selectedStepId === step.id}
                onClick={() => setSelectedStepId(step.id)}
              />
            ))}
          </div>
        </aside>

        <main className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">{selectedStep.label}</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-amber-700">Original 2017 design</div>
                <p className="mt-2 text-sm leading-6 text-amber-950">{selectedStep.original}</p>
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-cyan-700">General lesson</div>
                <p className="mt-2 text-sm leading-6 text-cyan-950">{selectedStep.modern}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Self-attention source</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {['Q', 'K', 'V'].map((label) => (
                <div key={label} className="rounded-xl border border-blue-200 bg-white p-4 text-center">
                  <div className="text-xl font-black text-blue-700">{label}</div>
                  <div className="mt-1 text-sm text-slate-700">projected from encoder input states</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Multiple heads provide independently learned projections. They <strong>can</strong> learn different useful
              subspaces or relationships, but separate parameters do not guarantee one unique interpretable role per head.
            </p>
          </section>
        </main>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <GitBranch size={16} />
          Where encoder output goes
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {ENCODER_OUTPUT_DESTINATIONS.map((destination) => (
            <article key={destination.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-black text-slate-950">{destination.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{destination.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Original d_model</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{ORIGINAL_ENCODER_DIMENSIONS.dModel}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Original heads</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{ORIGINAL_ENCODER_DIMENSIONS.heads}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Head width</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{ORIGINAL_ENCODER_DIMENSIONS.headDim}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Original d_ff</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{ORIGINAL_ENCODER_DIMENSIONS.dFF}</div>
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
        <strong>Mistake to avoid:</strong> “encoder” does not imply “feeds a decoder.” Encoder-only systems terminate in task,
        pooling, ranking, or embedding heads. Cross-attention memory is only one possible destination.
      </section>
    </div>
  );
}
