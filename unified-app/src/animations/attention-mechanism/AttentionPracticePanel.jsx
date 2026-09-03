import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { attentionInterpretationTrap } from './attentionModel.js';

function CaseCard({ title, weights, values, output }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {weights.map((weight, index) => (
          <div key={index} className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs font-black uppercase text-slate-500">Item {index + 1}</div>
            <div className="mt-1 font-mono text-sm">weight={(weight * 100).toFixed(0)}%</div>
            <div className="font-mono text-sm">value={values[index][0].toFixed(1)}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-slate-950 p-3 text-white"><span className="text-xs uppercase tracking-wide text-slate-400">Attention output</span><div className="mt-1 font-mono text-2xl font-black">{output.toFixed(3)}</div></div>
    </div>
  );
}

export default function AttentionPracticePanel() {
  const result = useMemo(() => attentionInterpretationTrap(), []);
  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-rose-700"><AlertTriangle size={16} /> Interpretation failure lab</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Attention weights are routing coefficients, not a complete explanation</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Weights matter, but so do the value vectors, residual stream, other heads, later layers, nonlinearities, and the final readout. Reading the largest attention weight as “the reason for the prediction” is a much stronger claim than the computation supports.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CaseCard title={result.caseA.label} weights={result.caseA.weights} values={result.caseA.values} output={result.outputA} />
        <CaseCard title={result.caseB.label} weights={result.caseB.weights} values={result.caseB.values} output={result.outputB} />
      </section>

      <section className={`rounded-2xl border p-5 ${result.outputsMatch ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={19} />
          <div><h3 className="font-black text-emerald-950">Same output, very different attention maps</h3><p className="mt-1 text-sm leading-6 text-emerald-900">Case A uses 50/50 routing over values 0 and 2. Case B uses 90/10 routing over two identical values of 1. Both outputs are exactly 1.0. Attention weights alone therefore do not uniquely determine even this tiny attention result without the values.</p></div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm leading-6 text-slate-700">
        <h3 className="font-black text-slate-950">A better debugging checklist</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Inspect QK scores and masks, not just post-softmax weights.</li><li>Inspect value vectors and per-head outputs.</li><li>Check residual and output-projection contributions.</li><li>Use causal interventions or attribution methods when the question is causal explanation.</li></ul>
      </section>
    </div>
  );
}
