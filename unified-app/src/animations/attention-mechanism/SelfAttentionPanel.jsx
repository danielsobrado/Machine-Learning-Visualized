import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { selfAttentionExperiment } from './attentionModel.js';

export default function SelfAttentionPanel() {
  const result = useMemo(() => selfAttentionExperiment(), []);
  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-indigo-700"><Eye size={16} /> Self-attention</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Every token asks its own question of the same sequence</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Self-attention is not one global attention distribution. Each token produces its own query, so the attention matrix has one normalized row per query position.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[620px] text-center text-sm">
            <thead className="bg-slate-50"><tr><th className="px-3 py-3 text-left text-xs uppercase tracking-wide text-slate-500">Query ↓ / Key →</th>{result.tokenNames.map((token) => <th key={token} className="px-3 py-3 font-black text-slate-900">{token}</th>)}</tr></thead>
            <tbody>{result.rows.map((row, rowIndex) => <tr key={result.tokenNames[rowIndex]} className="border-t border-slate-200"><th className="px-3 py-3 text-left font-black text-slate-900">{result.tokenNames[rowIndex]}</th>{row.weights.map((weight, columnIndex) => <td key={columnIndex} className="px-3 py-3"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 font-mono font-black text-indigo-900" style={{ opacity: 0.3 + weight * 0.7 }}>{(weight * 100).toFixed(1)}%</div></td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">Rows sum to 100%. Columns do not need to. Changing one query changes one row; changing a key can affect many rows because many queries compare against it.</p>
      </section>
    </div>
  );
}
