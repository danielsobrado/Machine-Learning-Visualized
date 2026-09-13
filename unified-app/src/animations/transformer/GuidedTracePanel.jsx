import React, { useMemo, useState } from 'react';
import { Boxes, Calculator, Eye, Layers3, Network } from 'lucide-react';
import {
  TRANSFORMER_GUIDE_DEFAULTS,
  TRANSFORMER_GUIDE_STEPS,
} from './transformerFundamentalsConstants.js';
import {
  attentionMaskRule,
  attentionScoreElements,
  transformerCoreParameterLedger,
  transformerShapeLedger,
} from './transformerFundamentalsModel.js';

function ShapeRow({ label, shape, emphasized }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${emphasized ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white'}`}>
      <span className="font-bold text-slate-900">{label}</span>
      <span className="font-mono text-sm font-black text-slate-700">[{shape.join(' × ')}]</span>
    </div>
  );
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
    </div>
  );
}

export default function GuidedTracePanel() {
  const [sequenceLength, setSequenceLength] = useState(TRANSFORMER_GUIDE_DEFAULTS.sequenceLength);
  const [dModel, setDModel] = useState(TRANSFORMER_GUIDE_DEFAULTS.dModel);
  const [numHeads, setNumHeads] = useState(TRANSFORMER_GUIDE_DEFAULTS.numHeads);
  const [dFF, setDFF] = useState(TRANSFORMER_GUIDE_DEFAULTS.dFF);
  const [mode, setMode] = useState(TRANSFORMER_GUIDE_DEFAULTS.mode);
  const [stepId, setStepId] = useState('embed');

  const compatibleHeads = [1, 2, 4, 8, 16].filter((heads) => dModel % heads === 0 && heads <= dModel);
  const effectiveHeads = compatibleHeads.includes(numHeads) ? numHeads : compatibleHeads.at(-1);
  if (effectiveHeads !== numHeads) setNumHeads(effectiveHeads);

  const shapes = useMemo(() => transformerShapeLedger({
    sequenceLength,
    dModel,
    numHeads: effectiveHeads,
    dFF,
  }), [dFF, dModel, effectiveHeads, sequenceLength]);
  const params = useMemo(() => transformerCoreParameterLedger({ dModel, dFF }), [dFF, dModel]);
  const scoreElements = attentionScoreElements({ sequenceLength, numHeads: effectiveHeads });
  const activeStep = TRANSFORMER_GUIDE_STEPS.find((step) => step.id === stepId);
  const highlightedShapeIds = {
    embed: new Set(['tokens', 'embed']),
    project: new Set(['embed', 'qkv']),
    attention: new Set(['qkv', 'scores', 'concat']),
    residual: new Set(['concat', 'output']),
    ffn: new Set(['ffn', 'output']),
    repeat: new Set(['output']),
  }[stepId];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-300"><Network size={16} /> Guided transformer trace</div>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">Follow one token tensor through one block.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">Start here. Keep the architecture small, watch the tensor shapes stay consistent, then open the detailed Encoder, Decoder, Data Flow, and Variants tabs when the basic path is clear.</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-700"><Calculator size={16} /> Block controls</div>
          <div className="mt-4 space-y-4">
            <label className="grid gap-2 text-sm font-bold text-slate-700">Sequence length T: {sequenceLength}<input type="range" min="4" max="64" step="4" value={sequenceLength} onChange={(event) => setSequenceLength(Number(event.target.value))} /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">d_model: {dModel}<select value={dModel} onChange={(event) => setDModel(Number(event.target.value))} className="rounded-lg border border-slate-300 px-3 py-2"><option value={32}>32</option><option value={64}>64</option><option value={128}>128</option><option value={256}>256</option><option value={512}>512</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Attention heads: {effectiveHeads}<select value={effectiveHeads} onChange={(event) => setNumHeads(Number(event.target.value))} className="rounded-lg border border-slate-300 px-3 py-2">{compatibleHeads.map((heads) => <option key={heads} value={heads}>{heads}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">d_ff: {dFF}<select value={dFF} onChange={(event) => setDFF(Number(event.target.value))} className="rounded-lg border border-slate-300 px-3 py-2"><option value={128}>128</option><option value={256}>256</option><option value={512}>512</option><option value={1024}>1024</option><option value={2048}>2048</option></select></label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMode('encoder')} className={`rounded-xl border px-3 py-2 text-sm font-black ${mode === 'encoder' ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>Encoder</button>
              <button type="button" onClick={() => setMode('decoder')} className={`rounded-xl border px-3 py-2 text-sm font-black ${mode === 'decoder' ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>Decoder</button>
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Head width" value={shapes.headDim} detail={`${dModel} ÷ ${effectiveHeads}`} />
            <Stat label="Attention score cells" value={scoreElements.toLocaleString()} detail={`${effectiveHeads} heads × ${sequenceLength} × ${sequenceLength}`} />
            <Stat label="Attention matrices" value={params.attention.toLocaleString()} detail="Q, K, V and output projection weights." />
            <Stat label="FFN matrices" value={params.ffn.toLocaleString()} detail="Expand to d_ff and project back." />
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TRANSFORMER_GUIDE_STEPS.map((step) => (
                <button key={step.id} type="button" onClick={() => setStepId(step.id)} className={`rounded-xl border p-3 text-left ${stepId === step.id ? 'border-amber-500 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  <div className="font-black">{step.label}</div>
                  <div className="mt-1 text-xs leading-5">{step.summary}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Layers3 size={16} /> {activeStep.label}</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{activeStep.summary}</p>
            <div className="mt-4 grid gap-2">
              {shapes.rows.map((row) => <ShapeRow key={row.id} {...row} emphasized={highlightedShapeIds.has(row.id)} />)}
            </div>
          </section>
        </main>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700"><Eye size={16} /> Visibility rule</div><p className="mt-3 text-sm leading-6">{attentionMaskRule(mode)}</p></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-700"><Boxes size={16} /> Shape invariant</div><p className="mt-3 text-sm leading-6">Attention and the FFN may expand internally, but the block returns to <span className="font-mono">[B, T, d_model]</span> so residual addition and stacking remain valid.</p></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700"><Calculator size={16} /> Parameter rule</div><p className="mt-3 text-sm leading-6">Ignoring biases and norm parameters, one standard attention+FFN block has <strong>{params.total.toLocaleString()}</strong> matrix parameters at these dimensions.</p></div>
      </section>
    </div>
  );
}
