import React, { useMemo, useState } from 'react';
import { ArrowRight, Braces, Calculator, Layers3, Sparkles } from 'lucide-react';
import {
  FUNDAMENTALS_ARCHITECTURE,
  parameterCount,
  parameterLedger,
  shapeLedger,
  xorReluForward,
  xorTruthTable,
} from './neuralNetworkFundamentalsModel.js';

const XOR_INPUTS = Object.freeze([
  Object.freeze([0, 0]),
  Object.freeze([0, 1]),
  Object.freeze([1, 0]),
  Object.freeze([1, 1]),
]);

function ShapeBadge({ label, shape }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-black text-slate-950">[{shape.join(' × ')}]</div>
    </div>
  );
}

export default function BeginnerPath() {
  const [input, setInput] = useState([1, 0]);
  const trace = useMemo(() => xorReluForward(input), [input]);
  const shapes = useMemo(() => shapeLedger({ batchSize: 4, inputWidth: 2, hiddenWidth: 2, outputWidth: 1 }), []);
  const params = useMemo(() => parameterLedger(FUNDAMENTALS_ARCHITECTURE), []);
  const truth = useMemo(() => xorTruthTable(), []);

  return (
    <section className="mx-auto mb-8 max-w-7xl space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-950 shadow-sm md:p-6">
      <header className="rounded-2xl bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-300">
          <Sparkles size={16} /> Beginner path
        </div>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">One tiny network. Every number visible.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
          Start here before the larger animation below. Follow shapes, count parameters, run one forward pass, then see why two ReLU hidden units can solve XOR while one linear boundary cannot.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700"><Layers3 size={17} /> 1. Shapes first</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {shapes.map((item, index) => (
            <React.Fragment key={item.label}>
              <ShapeBadge {...item} />
              {index < shapes.length - 1 && <ArrowRight className="hidden self-center justify-self-center text-slate-300 lg:block" size={18} />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">The inner dimensions must match: [4×2] · [2×2] → [4×2], then [4×2] · [2×1] → [4×1]. Batch size travels through the network; feature width changes.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-700"><Calculator size={17} /> 2. Count parameters</div>
          <div className="mt-4 space-y-3">
            {params.map((row) => (
              <div key={row.layer} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-bold">Layer {row.layer}: {row.inputWidth} → {row.outputWidth}</span>
                <span className="font-mono">{row.weights} weights + {row.biases} bias = <strong>{row.total}</strong></span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-violet-50 p-4 text-violet-950">
            <div className="text-xs font-black uppercase tracking-wide text-violet-700">Total trainable parameters</div>
            <div className="mt-1 text-3xl font-black">{parameterCount(FUNDAMENTALS_ARCHITECTURE)}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700"><Braces size={17} /> 3. Run a forward pass</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {XOR_INPUTS.map((candidate) => {
              const selected = candidate[0] === input[0] && candidate[1] === input[1];
              return (
                <button key={candidate.join('-')} type="button" onClick={() => setInput([...candidate])} className={`rounded-xl border px-4 py-2 text-sm font-black ${selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  [{candidate.join(', ')}]
                </button>
              );
            })}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <ShapeBadge label="Input x" shape={trace.input} />
            <ShapeBadge label="z = [x₁-x₂, x₂-x₁]" shape={trace.hiddenPre.map((value) => Number(value.toFixed(2)))} />
            <ShapeBadge label="ReLU(z)" shape={trace.hidden.map((value) => Number(value.toFixed(2)))} />
            <ShapeBadge label="Output" shape={[trace.output]} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">The hidden units keep opposite differences. ReLU clips the negative difference, and adding the two hidden activations produces |x₁-x₂|, which is exactly XOR on binary inputs.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="text-sm font-black uppercase tracking-wide text-amber-700">4. See the nonlinearity</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {truth.map((row) => (
            <div key={row.input.join('-')} className="rounded-xl border border-amber-200 bg-white p-4 text-center">
              <div className="font-mono text-sm text-slate-500">[{row.input.join(', ')}]</div>
              <div className="mt-2 text-2xl font-black text-slate-950">{row.prediction}</div>
              <div className="mt-1 text-xs font-bold text-emerald-700">target {row.target}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-amber-950">A single linear boundary cannot separate XOR's diagonal positives from its diagonal negatives. The hidden ReLU features change the representation first; the output becomes simple after that transformation.</p>
      </section>
    </section>
  );
}
