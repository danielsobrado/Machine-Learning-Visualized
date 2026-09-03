import React, { useMemo } from 'react';
import { Grid3X3 } from 'lucide-react';
import { multiHeadExperiment } from './attentionModel.js';

function HeadCard({ title, weights, output }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {weights.map((weight, index) => (
          <div key={index} className="grid grid-cols-[70px_1fr_60px] items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Token {index + 1}</span>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${weight * 100}%` }} /></div>
            <span className="text-right font-mono">{(weight * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-slate-950 p-3 text-white"><span className="text-xs uppercase tracking-wide text-slate-400">Head output</span><div className="mt-1 font-mono text-xl font-black">{output.toFixed(3)}</div></div>
    </div>
  );
}

export default function MultiHeadPanel() {
  const result = useMemo(() => multiHeadExperiment(), []);
  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700"><Grid3X3 size={16} /> Multi-head attention</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Multiple heads are separate routing subspaces, not repeated votes</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Different learned Q/K projections can make heads attend to different positions. Their outputs are concatenated and mixed by an output projection, preserving head-specific features before recombination.</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <HeadCard title="Head A · focuses early" weights={result.headAWeights} output={result.headAOutput} />
        <HeadCard title="Head B · focuses late" weights={result.headBWeights} output={result.headBOutput} />
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4"><div className="text-xs font-black uppercase text-violet-700">Concatenate before output projection</div><div className="mt-2 font-mono text-2xl font-black text-slate-950">[{result.concatenated.map((value) => value.toFixed(2)).join(', ')}]</div><p className="mt-2 text-sm leading-6 text-slate-700">Both head features remain available to the learned output projection.</p></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="text-xs font-black uppercase text-amber-700">Naive averaging</div><div className="mt-2 font-mono text-2xl font-black text-slate-950">{result.averaged.toFixed(2)}</div><p className="mt-2 text-sm leading-6 text-slate-700">Averaging here is only a counterexample: it destroys which-head information before any learned recombination.</p></div>
      </section>
    </div>
  );
}
