import React, { useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import {
  MAJORITY_SLICE_BANDS,
  MINORITY_SLICE_BANDS,
} from './rocPrCurvesConstants.js';
import {
  curvePoints,
  mergeBands,
  metricPercent,
  prAuc,
  prevalenceOf,
  rocAuc,
  totalCounts,
} from './rocPrCurvesModel.js';
import RocPrCurvePanel from './RocPrCurvePanel.jsx';

function SliceRow({ name, bands, emphasis = false }) {
  const totals = totalCounts(bands);
  return (
    <tr className={emphasis ? 'bg-rose-50' : ''}>
      <td className="px-3 py-3 font-black text-slate-900">{name}</td>
      <td className="px-3 py-3 text-right font-mono text-sm">{(totals.positives + totals.negatives).toLocaleString()}</td>
      <td className="px-3 py-3 text-right font-mono text-sm">{metricPercent(prevalenceOf(bands), 1)}</td>
      <td className="px-3 py-3 text-right font-mono text-sm">{rocAuc(bands).toFixed(3)}</td>
      <td className="px-3 py-3 text-right font-mono text-sm">{prAuc(bands).toFixed(3)}</td>
    </tr>
  );
}

export default function MinoritySliceAudit() {
  const aggregate = useMemo(() => mergeBands(MAJORITY_SLICE_BANDS, MINORITY_SLICE_BANDS), []);
  const aggregatePoints = useMemo(() => curvePoints(aggregate), [aggregate]);
  const minorityPoints = useMemo(() => curvePoints(MINORITY_SLICE_BANDS), []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-1 text-rose-600" size={20} />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Aggregate-metric ambush</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">The overall ROC can look excellent while one slice is nearly random.</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            The majority slice dominates the evaluation set. The minority slice has much weaker ranking and a rare positive class, but its failure barely dents the aggregate score.
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 text-left">Slice</th>
              <th className="px-3 py-3 text-right">Rows</th>
              <th className="px-3 py-3 text-right">Positive rate</th>
              <th className="px-3 py-3 text-right">ROC AUC</th>
              <th className="px-3 py-3 text-right">PR AUC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <SliceRow name="Aggregate" bands={aggregate} />
            <SliceRow name="Majority slice" bands={MAJORITY_SLICE_BANDS} />
            <SliceRow name="Minority slice" bands={MINORITY_SLICE_BANDS} emphasis />
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <RocPrCurvePanel
          title="Aggregate vs minority ROC"
          xLabel="False positive rate"
          yLabel="True positive rate"
          xKey="fpr"
          yKey="tpr"
          threshold={0.8}
          primary={{ label: 'Minority slice', points: minorityPoints }}
          comparison={{ label: 'Aggregate', points: aggregatePoints }}
        />
        <RocPrCurvePanel
          title="Aggregate vs minority PR"
          xLabel="Recall"
          yLabel="Precision"
          xKey="recall"
          yKey="precisionPlot"
          threshold={0.8}
          baseline={prevalenceOf(MINORITY_SLICE_BANDS)}
          primary={{ label: 'Minority slice', points: minorityPoints }}
          comparison={{ label: 'Aggregate', points: aggregatePoints }}
        />
      </div>

      <p className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
        <strong>Deployment rule:</strong> report ROC/PR and threshold metrics on important slices, not only globally. A high aggregate AUC is not evidence that every subgroup receives useful ranking or acceptable precision.
      </p>
    </section>
  );
}
