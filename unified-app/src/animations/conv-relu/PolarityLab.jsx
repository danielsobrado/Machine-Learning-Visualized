import React from 'react';
import { AlertTriangle, ArrowRight, ScanLine } from 'lucide-react';
import {
  BRIGHT_LEFT_PATCH,
  BRIGHT_RIGHT_PATCH,
  POLARITY_KERNEL,
  pairedPolarityResponse,
} from './convReluModel';

const CASES = [
  { id: 'bright-right', label: 'Dark → bright', patch: BRIGHT_RIGHT_PATCH },
  { id: 'bright-left', label: 'Bright → dark', patch: BRIGHT_LEFT_PATCH },
];

function Matrix({ matrix, title }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {matrix.flat().map((value, index) => (
          <div
            key={index}
            className="flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-900"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResponseCard({ item }) {
  const response = pairedPolarityResponse(item.patch, POLARITY_KERNEL);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-slate-950">{item.label}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
          same edge strength
        </span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
        <Matrix matrix={item.patch} title="3×3 patch" />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">signed z</div>
            <div className="mt-1 text-2xl font-bold text-slate-950">{response.positiveResponse}</div>
            <p className="mt-1 text-xs text-slate-600">The filter keeps direction in the sign.</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-rose-700">ReLU(z)</div>
            <div className="mt-1 text-2xl font-bold text-rose-950">{response.positiveChannel}</div>
            <p className="mt-1 text-xs text-rose-800">A negative response becomes exactly zero.</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">paired filters</div>
            <div className="mt-1 text-2xl font-bold text-emerald-950">{response.combinedStrength}</div>
            <p className="mt-1 text-xs text-emerald-800">ReLU(K·x) + ReLU(-K·x) = |K·x|.</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PolarityLab() {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 shadow-sm md:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-amber-800">Failure lab</div>
          <h2 className="mt-1 text-xl font-bold text-slate-950">ReLU can erase a real feature just because its polarity flipped</h2>
          <p className="mt-2 max-w-4xl text-sm text-slate-700">
            For an oriented edge filter, a negative response can mean “the same edge, opposite contrast,” not “no edge.”
            A single Conv → ReLU channel therefore detects only one response polarity unless the learned filter bank provides
            another channel for the opposite orientation.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <ScanLine size={17} />
            Vertical-edge kernel
          </div>
          <div className="mt-3">
            <Matrix matrix={POLARITY_KERNEL} title="K" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <span>K·x</span>
            <ArrowRight size={14} />
            <span>ReLU</span>
          </div>
        </div>

        <div className="space-y-4">
          {CASES.map((item) => <ResponseCard key={item.id} item={item} />)}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-700">
        <strong className="text-slate-950">Correction:</strong> ReLU removes negative activation values. It does not know
        whether the sign represents useless evidence. In CNNs, learned channels can specialize for opposite polarities;
        hand-designed filters often need an explicit ±K pair or another sign-preserving strategy.
      </div>
    </section>
  );
}
