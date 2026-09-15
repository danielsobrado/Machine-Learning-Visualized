import React, { useMemo, useState } from 'react';
import { Calculator, CheckCircle2, Info, Layers3 } from 'lucide-react';
import {
  PARAMETER_OMISSIONS,
  PARAMETER_SCOPE,
  TRANSFORMER_CALCULATOR_DEFAULTS,
  TRANSFORMER_CALCULATOR_LIMITS,
} from './transformerPracticeConstants.js';
import {
  formatParameterCount,
  transformerMatrixParameterLedger,
} from './transformerPracticeModel.js';

function NumberControl({ label, value, limits, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <input
        type="number"
        min={limits.min}
        max={limits.max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
      />
    </label>
  );
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p>
    </div>
  );
}

export default function PracticePanel() {
  const [dModel, setDModel] = useState(TRANSFORMER_CALCULATOR_DEFAULTS.dModel);
  const [numHeads, setNumHeads] = useState(TRANSFORMER_CALCULATOR_DEFAULTS.numHeads);
  const [numLayers, setNumLayers] = useState(TRANSFORMER_CALCULATOR_DEFAULTS.numLayers);
  const [dFF, setDFF] = useState(TRANSFORMER_CALCULATOR_DEFAULTS.dFF);
  const [includeCrossAttention, setIncludeCrossAttention] = useState(
    TRANSFORMER_CALCULATOR_DEFAULTS.includeCrossAttention,
  );

  const calculation = useMemo(() => {
    try {
      return {
        ledger: transformerMatrixParameterLedger({
          dModel,
          numHeads,
          numLayers,
          dFF,
          includeCrossAttention,
        }),
        error: null,
      };
    } catch (error) {
      return { ledger: null, error: error.message };
    }
  }, [dFF, dModel, includeCrossAttention, numHeads, numLayers]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-indigo-700">
          <Calculator size={16} />
          Practice lab
        </div>
        <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Dense block parameter calculator</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700">
          Count matrix weights for a deliberately narrow architecture: one standard multi-head self-attention module plus a
          classic two-linear-layer FFN per layer. Turn on cross-attention to model an encoder–decoder decoder layer. This is
          not a universal model-size estimator.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Layers3 size={16} />
            Dimensions
          </div>
          <div className="mt-5 grid gap-4">
            <NumberControl
              label={`d_model: ${dModel}`}
              value={dModel}
              limits={TRANSFORMER_CALCULATOR_LIMITS.dModel}
              onChange={setDModel}
            />
            <NumberControl
              label={`Attention heads: ${numHeads}`}
              value={numHeads}
              limits={TRANSFORMER_CALCULATOR_LIMITS.numHeads}
              onChange={setNumHeads}
            />
            <NumberControl
              label={`Layers: ${numLayers}`}
              value={numLayers}
              limits={TRANSFORMER_CALCULATOR_LIMITS.numLayers}
              onChange={setNumLayers}
            />
            <NumberControl
              label={`d_ff: ${dFF}`}
              value={dFF}
              limits={TRANSFORMER_CALCULATOR_LIMITS.dFF}
              onChange={setDFF}
            />
            <label className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm font-semibold text-violet-950">
              <input
                type="checkbox"
                checked={includeCrossAttention}
                onChange={(event) => setIncludeCrossAttention(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-violet-700"
              />
              <span>
                Add one cross-attention module per layer
                <span className="mt-1 block text-xs font-normal leading-5 text-violet-800">
                  Use this for the decoder side of a classic encoder–decoder Transformer, not for a standard decoder-only LM.
                </span>
              </span>
            </label>
          </div>
        </aside>

        <main className="space-y-4">
          {calculation.error ? (
            <section className="rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-950">
              <h3 className="font-black">Configuration is not shape-compatible</h3>
              <p className="mt-2 text-sm">{calculation.error}</p>
              <p className="mt-2 text-sm">Choose a head count that divides d_model exactly.</p>
            </section>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Head width" value={calculation.ledger.headDim} detail={`${dModel} ÷ ${numHeads}`} />
                <Metric
                  label="Self-attention / layer"
                  value={formatParameterCount(calculation.ledger.selfAttentionPerLayer)}
                  detail="Q, K, V, and output projection matrices"
                />
                <Metric
                  label="FFN / layer"
                  value={formatParameterCount(calculation.ledger.ffnPerLayer)}
                  detail="d_model → d_ff → d_model matrix weights"
                />
                <Metric
                  label="Stack matrix weights"
                  value={formatParameterCount(calculation.ledger.stackTotal)}
                  detail={`${numLayers} layer${numLayers === 1 ? '' : 's'}`}
                />
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-black text-slate-950">Parameter ledger</h3>
                <div className="mt-4 divide-y divide-slate-100 text-sm">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-slate-700">Self-attention matrices across stack</span>
                    <strong className="font-mono text-slate-950">{formatParameterCount(calculation.ledger.selfAttentionTotal)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-slate-700">FFN matrices across stack</span>
                    <strong className="font-mono text-slate-950">{formatParameterCount(calculation.ledger.ffnTotal)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-slate-700">Cross-attention matrices across stack</span>
                    <strong className="font-mono text-slate-950">{formatParameterCount(calculation.ledger.crossAttentionTotal)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3 font-black">
                    <span className="text-slate-950">Total in this scoped calculator</span>
                    <span className="font-mono text-indigo-700">{formatParameterCount(calculation.ledger.stackTotal)}</span>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
            <CheckCircle2 size={16} />
            Counted here
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
            {PARAMETER_SCOPE.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-700">
            <Info size={16} />
            Deliberately omitted
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
            {PARAMETER_OMISSIONS.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
        <strong>Position-method reminder:</strong> sinusoidal encodings and RoPE do not require a learned
        <span className="font-mono"> max_positions × d_model </span>
        table. Learned absolute position embeddings do. That choice therefore belongs in an architecture-specific parameter
        model, not in this generic block calculation.
      </section>
    </div>
  );
}
