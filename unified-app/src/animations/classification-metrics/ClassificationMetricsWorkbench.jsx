import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  DEFAULT_FALSE_NEGATIVE_COST,
  DEFAULT_FALSE_POSITIVE_COST,
  DEFAULT_THRESHOLD,
} from './classificationMetricsConstants.js';
import CalibrationBridgeLab from './CalibrationBridgeLab.jsx';
import MetricPolicyLab from './MetricPolicyLab.jsx';
import SubgroupAuditLab from './SubgroupAuditLab.jsx';

export default function ClassificationMetricsWorkbench() {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [falsePositiveCost, setFalsePositiveCost] = useState(DEFAULT_FALSE_POSITIVE_COST);
  const [falseNegativeCost, setFalseNegativeCost] = useState(DEFAULT_FALSE_NEGATIVE_COST);

  const reset = () => {
    setThreshold(DEFAULT_THRESHOLD);
    setFalsePositiveCost(DEFAULT_FALSE_POSITIVE_COST);
    setFalseNegativeCost(DEFAULT_FALSE_NEGATIVE_COST);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Decision evaluation</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Classification Metrics</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              A metric is a lens, not a verdict. Thresholds, prevalence, asymmetric error costs, subgroup behavior,
              and probability quality can all change what “good” means without changing the model family.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <MetricPolicyLab
        threshold={threshold}
        onThresholdChange={setThreshold}
        falsePositiveCost={falsePositiveCost}
        onFalsePositiveCostChange={setFalsePositiveCost}
        falseNegativeCost={falseNegativeCost}
        onFalseNegativeCostChange={setFalseNegativeCost}
      />
      <SubgroupAuditLab threshold={threshold} />
      <CalibrationBridgeLab />
    </div>
  );
}
