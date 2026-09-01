import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, GitCompareArrows } from 'lucide-react';
import { PIPELINE_CONTRACTS } from './trainValidationTestSplitConstants.js';
import { trainServeSkew } from './trainValidationTestSplitModel.js';

function ContractCell({ label, train, serve, matches }) {
  return (
    <div className={`rounded-lg border p-4 ${matches ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
        <div><span className="block text-[10px] font-black uppercase text-slate-400">Training</span><strong className="text-sm text-slate-950">{train}</strong></div>
        <GitCompareArrows size={16} className="text-slate-400" />
        <div><span className="block text-[10px] font-black uppercase text-slate-400">Serving</span><strong className="text-sm text-slate-950">{serve}</strong></div>
      </div>
    </div>
  );
}

export default function TrainServeSkewLab({ contractId, onContractChange }) {
  const audit = useMemo(() => trainServeSkew(contractId), [contractId]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-sky-700">Train / serve contract lab</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">A clean offline split cannot save different production semantics</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Evaluation assumes serving computes the same inputs as training. A feature can have the same column name and still mean something different online.
        </p>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(PIPELINE_CONTRACTS).map(([id, contract]) => (
          <button
            key={id}
            type="button"
            onClick={() => onContractChange(id)}
            className={`rounded-lg border p-3 text-left ${contractId === id ? 'border-sky-500 bg-sky-50 text-sky-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
          >
            <span className="block text-sm font-black">{contract.label}</span>
            <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{contract.detail}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <ContractCell label="Feature window" train={`${audit.trainWindowDays} days`} serve={`${audit.serveWindowDays} days`} matches={!audit.semanticSkew} />
        <ContractCell label="Missing-value policy" train={audit.trainMissing} serve={audit.serveMissing} matches={!audit.missingSkew} />
      </div>

      <div className={`mt-4 rounded-lg border p-4 ${audit.aligned ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-rose-200 bg-rose-50 text-rose-950'}`}>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
          {audit.aligned ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          {audit.aligned ? 'Feature contract aligned' : 'Train / serve skew detected'}
        </p>
        <p className="mt-2 text-sm leading-6">
          {audit.aligned
            ? 'Offline evaluation and production serving share the same feature semantics and missing-value behavior.'
            : audit.issues.join(' · ')}
        </p>
      </div>
    </section>
  );
}
