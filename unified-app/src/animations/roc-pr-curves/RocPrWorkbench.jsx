import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  DEFAULT_PREVALENCE,
  DEFAULT_REVIEW_CAPACITY,
  DEFAULT_THRESHOLD,
} from './rocPrCurvesConstants.js';
import DeploymentStressLab from './DeploymentStressLab.jsx';
import MinoritySliceAudit from './MinoritySliceAudit.jsx';

export default function RocPrWorkbench() {
  const [prevalence, setPrevalence] = useState(DEFAULT_PREVALENCE);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [reviewCapacity, setReviewCapacity] = useState(DEFAULT_REVIEW_CAPACITY);

  const reset = () => {
    setPrevalence(DEFAULT_PREVALENCE);
    setThreshold(DEFAULT_THRESHOLD);
    setReviewCapacity(DEFAULT_REVIEW_CAPACITY);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Ranking under deployment pressure</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">ROC / Precision-Recall Curves</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              Curves summarize ranking across thresholds, but deployment happens at one operating point, under one prevalence, with finite capacity, and across real subgroups.
              Stress all four before calling a classifier good.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} /> Reset lab
          </button>
        </div>
      </section>

      <DeploymentStressLab
        prevalence={prevalence}
        onPrevalenceChange={setPrevalence}
        threshold={threshold}
        onThresholdChange={setThreshold}
        reviewCapacity={reviewCapacity}
        onReviewCapacityChange={setReviewCapacity}
      />

      <MinoritySliceAudit />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">ROC answers</p>
          <p className="mt-2 text-sm leading-6 text-blue-950">How well do scores rank positives above negatives across thresholds? It is largely prevalence-insensitive.</p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">PR answers</p>
          <p className="mt-2 text-sm leading-6 text-rose-950">When we act on positive predictions, how pure are they and how many real positives do we recover? Its baseline moves with prevalence.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-600">Neither answers</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">Which threshold the business should deploy. That requires costs, capacity, calibration where probabilities matter, and slice-level constraints.</p>
        </div>
      </section>
    </div>
  );
}
