import React, { useMemo } from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { CLASSIFICATION_ROWS } from './classificationMetricsConstants.js';
import {
  confusionMatrix,
  maxMetricGap,
  metricsByGroup,
  metricsFromCounts,
} from './classificationMetricsModel.js';

function pct(value, digits = 0) {
  return `${(value * 100).toFixed(digits)}%`;
}

export default function SubgroupAuditLab({ threshold }) {
  const aggregate = useMemo(
    () => metricsFromCounts(confusionMatrix(CLASSIFICATION_ROWS, threshold)),
    [threshold],
  );
  const groups = useMemo(() => metricsByGroup(CLASSIFICATION_ROWS, threshold), [threshold]);
  const recallGap = maxMetricGap(groups, 'recall');
  const precisionGap = maxMetricGap(groups, 'precision');

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700"><Users size={15} /> Subgroup audit</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">Aggregate metrics can average away the population that is failing.</h3>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
        The same threshold is applied to every row. Compare the overall score with each subgroup before concluding that one headline recall or F1 value describes deployment behavior.
      </p>

      <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr><th className="px-3 py-2">Slice</th><th className="px-3 py-2">Rows</th><th className="px-3 py-2">Precision</th><th className="px-3 py-2">Recall / TPR</th><th className="px-3 py-2">Specificity</th><th className="px-3 py-2">F1</th></tr>
          </thead>
          <tbody>
            <tr className="bg-slate-50 font-bold text-slate-900">
              <td className="px-3 py-3">Aggregate</td><td className="px-3 py-3">{CLASSIFICATION_ROWS.length}</td><td className="px-3 py-3">{pct(aggregate.precision)}</td><td className="px-3 py-3">{pct(aggregate.recall)}</td><td className="px-3 py-3">{pct(aggregate.specificity)}</td><td className="px-3 py-3">{pct(aggregate.f1)}</td>
            </tr>
            {groups.map((group) => (
              <tr key={group.group} className={group.metrics.recall < aggregate.recall ? 'bg-rose-50 text-rose-950' : 'bg-white text-slate-700'}>
                <td className="px-3 py-3 font-black">{group.group}</td><td className="px-3 py-3">{group.size}</td><td className="px-3 py-3">{pct(group.metrics.precision)}</td><td className="px-3 py-3 font-black">{pct(group.metrics.recall)}</td><td className="px-3 py-3">{pct(group.metrics.specificity)}</td><td className="px-3 py-3">{pct(group.metrics.f1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className={`rounded-lg border p-4 ${recallGap >= 0.2 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
          <p className={`flex items-center gap-2 text-xs font-black uppercase tracking-wide ${recallGap >= 0.2 ? 'text-rose-800' : 'text-emerald-800'}`}><AlertTriangle size={15} /> Worst-slice gap</p>
          <p className={`mt-2 text-sm leading-6 ${recallGap >= 0.2 ? 'text-rose-950' : 'text-emerald-950'}`}>
            Recall differs by <strong>{pct(recallGap, 1)}</strong> across groups; precision differs by <strong>{pct(precisionGap, 1)}</strong>. A strong aggregate can coexist with materially different error rates.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-800">Audit rule</p>
          <p className="mt-2 text-sm leading-6 text-cyan-950">
            Slice by groups that matter operationally, inspect denominators and uncertainty, and avoid turning every observed gap into a fairness claim without context. The first job is to discover where the model behaves differently.
          </p>
        </div>
      </div>
    </section>
  );
}
