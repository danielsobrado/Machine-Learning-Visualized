import React, { useMemo } from 'react';
import { AlertTriangle, Gauge } from 'lucide-react';
import { computeBayes, maxFalsePositiveForPosterior } from './bayesRuleModel.js';

function pct(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export default function BayesBoundaryLab({ prior, sensitivity, threshold }) {
  const analysis = useMemo(() => {
    const boundary = maxFalsePositiveForPosterior({ prior, sensitivity, threshold });
    const below = Math.max(0, boundary * 0.8);
    const above = Math.min(1, boundary * 1.2);
    return {
      boundary,
      below: computeBayes({ prior, sensitivity, falsePositive: below }),
      exact: computeBayes({ prior, sensitivity, falsePositive: boundary }),
      above: computeBayes({ prior, sensitivity, falsePositive: above }),
    };
  }, [prior, sensitivity, threshold]);

  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Gauge size={18} className="mt-0.5 shrink-0 text-violet-700" />
        <div>
          <div className="text-sm font-black uppercase tracking-wide text-violet-700">Action-boundary lab</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Find the largest false-positive rate you can tolerate</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Posterior decreases monotonically as the false-positive rate rises. The useful boundary is therefore the highest rate that still satisfies your posterior requirement—not the first passing point in an ascending sweep.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Below boundary</div>
          <div className="mt-1 text-2xl font-black">{pct(analysis.below.falsePositive)}</div>
          <div className="mt-1 font-mono text-sm">posterior {pct(analysis.below.posterior)}</div>
        </div>
        <div className="rounded-xl border border-violet-300 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700">Maximum acceptable FPR</div>
          <div className="mt-1 text-2xl font-black">{pct(analysis.boundary, 2)}</div>
          <div className="mt-1 font-mono text-sm">posterior {pct(analysis.exact.posterior)}</div>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-rose-700">Above boundary</div>
          <div className="mt-1 text-2xl font-black">{pct(analysis.above.falsePositive)}</div>
          <div className="mt-1 font-mono text-sm">posterior {pct(analysis.above.posterior)}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <AlertTriangle size={16} className="mr-1 inline" />
        A model can keep the same sensitivity and likelihood ratio while deployment prevalence changes. The posterior can still move sharply because Bayes combines evidence with the prior.
      </div>
    </section>
  );
}
