import React, { useMemo } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { deletionExperiment } from './bloomFilterModel.js';

function Bits({ values, counters = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value, index) => (
        <div key={index} className={`flex h-11 min-w-11 items-center justify-center rounded-lg border font-mono font-black ${value > 0 ? 'border-indigo-300 bg-indigo-100 text-indigo-900' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
          {counters ? value : value > 0 ? 1 : 0}
        </div>
      ))}
    </div>
  );
}

export default function DeletionFailureLab() {
  const result = useMemo(() => deletionExperiment(), []);

  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rose-700" />
        <div>
          <div className="text-sm font-black uppercase tracking-wide text-rose-700">Deletion failure lab</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Clearing bits can delete someone else's evidence</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Insert {result.deletedItem} and {result.protectedItem}. Their hash positions overlap. A standard Bloom filter stores only shared 0/1 bits, so it cannot tell which item owns a bit.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-slate-500">Before naive delete</div>
          <div className="mt-3"><Bits values={result.beforeBits} /></div>
          <p className="mt-3 text-sm text-slate-700">
            {result.deletedItem}: [{result.deletedIndices.join(', ')}] · {result.protectedItem}: [{result.protectedIndices.join(', ')}]
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-rose-700">After clearing {result.deletedItem}'s bits</div>
          <div className="mt-3"><Bits values={result.afterNaiveDelete} /></div>
          <p className="mt-3 text-sm font-bold text-rose-950">
            Query {result.protectedItem}: {result.protectedPresentAfterNaiveDelete ? 'possibly present' : 'definitely absent'} — a false negative even though it was inserted.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
          <ShieldCheck size={15} /> Counting Bloom alternative
        </div>
        <p className="mt-2 text-sm leading-6 text-emerald-950">
          Store small counters instead of one bit. Shared positions can decrement from 2 → 1 instead of 1 → 0, preserving the other item.
        </p>
        <div className="mt-3"><Bits values={result.afterCountingDelete} counters /></div>
        <p className="mt-3 text-sm font-bold text-emerald-950">
          Query {result.protectedItem}: {result.protectedPresentAfterCountingDelete ? 'possibly present' : 'definitely absent'}.
        </p>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-600">
        Ordinary Bloom filters support safe insertion and membership queries, not arbitrary deletion. Counting Bloom filters trade additional memory for controlled decrements and still require correct insert/delete bookkeeping.
      </p>
    </section>
  );
}
