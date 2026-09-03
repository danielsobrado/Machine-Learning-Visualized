import React, { useMemo, useState } from 'react';
import { Activity, Clock3, Sigma } from 'lucide-react';
import { lstmScalarStep, retentionSeries, stepsUntilRetentionBelow } from './lstmModel.js';

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && magnitude < 0.001) return value.toExponential(2);
  return value.toFixed(3);
}

function GateCard({ label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{format(value)}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{note}</p>
    </div>
  );
}

function Range({ id, label, value, min, max, step, onChange }) {
  return (
    <label className="block text-sm font-bold text-slate-700" htmlFor={id}>
      <span className="flex items-center justify-between gap-3"><span>{label}</span><span className="font-mono">{value.toFixed(1)}</span></span>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-indigo-600" />
    </label>
  );
}

export default function LstmNumericFlowLab() {
  const [previousCell, setPreviousCell] = useState(1.2);
  const [forgetLogit, setForgetLogit] = useState(2);
  const [inputLogit, setInputLogit] = useState(-1);
  const [candidateLogit, setCandidateLogit] = useState(0.8);
  const [outputLogit, setOutputLogit] = useState(1.3);
  const [horizon, setHorizon] = useState(100);

  const step = useMemo(() => lstmScalarStep({
    previousCell,
    forgetLogit,
    inputLogit,
    candidateLogit,
    outputLogit,
  }), [candidateLogit, forgetLogit, inputLogit, outputLogit, previousCell]);
  const retention = useMemo(() => retentionSeries(step.forgetGate, horizon), [horizon, step.forgetGate]);
  const finalRetention = retention.at(-1).retention;
  const onePercentHorizon = stepsUntilRetentionBelow(step.forgetGate, 0.01);

  return (
    <div className="space-y-5 p-4 md:p-6">
      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-indigo-700"><Sigma size={16} />Numerical LSTM cell</div>
        <h2 className="mt-1 text-xl font-black text-slate-950">The gates are numbers, not doors in a cartoon</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          This scalar cell exposes the exact update: f=σ(f-logit), i=σ(i-logit), g=tanh(g-logit), c=f·cₜ₋₁+i·g, and h=o·tanh(c). Change a gate logit and watch the arithmetic move.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Range id="lstm-prev-cell" label="Previous cell cₜ₋₁" value={previousCell} min={-2} max={2} step={0.1} onChange={setPreviousCell} />
          <Range id="lstm-forget-logit" label="Forget-gate logit" value={forgetLogit} min={-4} max={4} step={0.1} onChange={setForgetLogit} />
          <Range id="lstm-input-logit" label="Input-gate logit" value={inputLogit} min={-4} max={4} step={0.1} onChange={setInputLogit} />
          <Range id="lstm-candidate-logit" label="Candidate logit" value={candidateLogit} min={-3} max={3} step={0.1} onChange={setCandidateLogit} />
          <Range id="lstm-output-logit" label="Output-gate logit" value={outputLogit} min={-4} max={4} step={0.1} onChange={setOutputLogit} />
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <GateCard label="Forget gate f" value={step.forgetGate} note="Direct multiplier on old cell state and its direct gradient path." />
            <GateCard label="Input gate i" value={step.inputGate} note="Scales how much candidate memory is written." />
            <GateCard label="Candidate g" value={step.candidate} note="Signed candidate content from tanh." />
            <GateCard label="Output gate o" value={step.outputGate} note="Controls how much cell content becomes hidden state." />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <div className="rounded-xl bg-amber-50 p-4 text-center"><div className="text-xs font-black uppercase text-amber-700">Retained old memory</div><div className="mt-1 text-2xl font-black">{format(step.retainedMemory)}</div><div className="mt-1 font-mono text-xs">f × cₜ₋₁</div></div>
              <span className="text-center text-2xl font-black text-slate-400">+</span>
              <div className="rounded-xl bg-emerald-50 p-4 text-center"><div className="text-xs font-black uppercase text-emerald-700">Written memory</div><div className="mt-1 text-2xl font-black">{format(step.writtenMemory)}</div><div className="mt-1 font-mono text-xs">i × g</div></div>
              <span className="text-center text-2xl font-black text-slate-400">=</span>
              <div className="rounded-xl bg-indigo-50 p-4 text-center"><div className="text-xs font-black uppercase text-indigo-700">New cell cₜ</div><div className="mt-1 text-2xl font-black">{format(step.cell)}</div><div className="mt-1 font-mono text-xs">hₜ={format(step.hidden)}</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-rose-700"><Clock3 size={16} />Memory horizon failure lab</div>
        <h2 className="mt-1 text-xl font-black text-slate-950">An LSTM helps gradient flow; it does not guarantee permanent memory</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          If no new memory is written, the direct cell-state sensitivity across time is the product of forget gates. With a constant gate, ∂cₜ/∂c₀=fᵀ.
        </p>

        <label className="mt-4 block max-w-xl text-sm font-bold text-slate-700" htmlFor="lstm-horizon">
          Time horizon {horizon} steps
          <input id="lstm-horizon" type="range" min="1" max="200" step="1" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} className="mt-2 w-full accent-rose-600" />
        </label>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <GateCard label="Per-step forget gate" value={step.forgetGate} note={`Direct cell gradient multiplier each step.`} />
          <GateCard label={`Retention after ${horizon}`} value={finalRetention} note={`${(finalRetention * 100).toFixed(4)}% of the direct cell-state signal remains.`} />
          <GateCard label="Below 1% after" value={onePercentHorizon} note={Number.isFinite(onePercentHorizon) ? 'steps at this constant forget gate.' : 'Never, because f=1.'} />
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex h-40 items-end gap-1">
            {retention.filter((_, index) => index % Math.max(1, Math.floor(horizon / 40)) === 0).map((point) => (
              <div key={point.step} className="flex-1 rounded-t bg-indigo-500" title={`step ${point.step}: ${point.retention}`} style={{ height: `${Math.max(2, point.retention * 100)}%` }} />
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600">Direct retention through the cell-state path only. Full recurrent gradients also include indirect dependencies through gates and hidden state.</p>
        </div>

        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <Activity size={17} className="mr-1 inline" />
          <strong>Roast-worthy misconception:</strong> the “conveyor belt” is not a lossless wire. If forget gates consistently sit below one, memory and direct gradient sensitivity still decay exponentially with sequence length.
        </p>
      </section>
    </div>
  );
}
