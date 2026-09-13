import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Sigma } from 'lucide-react';
import { Plate, Readouts, Slider } from '../_shared/notebook';
import { MLE_FAILURE_DEMO, MLE_FAILURE_LIMITS } from './mleFailureConstants.js';
import { bernoulliLikelihoodStability, boundaryMleExperiment } from './mleFailureModel.js';

function scientific(value) {
  return value === 0 ? '0 (underflow)' : value.toExponential(3);
}

export default function MleFailureLab() {
  const [failures, setFailures] = useState(MLE_FAILURE_DEMO.boundary.failures);
  const [observationsScale, setObservationsScale] = useState(1);
  const boundary = useMemo(() => boundaryMleExperiment({
    successes: MLE_FAILURE_DEMO.boundary.successes,
    failures,
  }), [failures]);
  const stability = useMemo(() => bernoulliLikelihoodStability({
    successes: MLE_FAILURE_DEMO.underflow.successes * observationsScale,
    failures: MLE_FAILURE_DEMO.underflow.failures * observationsScale,
    candidateA: MLE_FAILURE_DEMO.underflow.candidateA,
    candidateB: MLE_FAILURE_DEMO.underflow.candidateB,
  }), [observationsScale]);

  return (
    <Plate label="Failure lab" title="Two MLE traps: boundary optima and vanishing likelihood products">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Boundary optimum</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">The score does not have to equal zero.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">With all successes, increasing p always improves the Bernoulli likelihood until p reaches its legal boundary at 1. The familiar “set derivative to zero” recipe only describes smooth interior optima.</p>
          </div>
          <Slider
            label={`Failures added to ${MLE_FAILURE_DEMO.boundary.successes} successes`}
            value={failures}
            {...MLE_FAILURE_LIMITS.failures}
            format={(value) => String(value)}
            help="Add one failure and watch the optimum move away from the boundary."
            onChange={setFailures}
          />
          <Readouts columns={3} items={[
            { label: 'MLE p', value: boundary.mle.toFixed(4), detail: `${boundary.successes} / ${boundary.sampleSize}` },
            { label: 'Optimum type', value: boundary.atBoundary ? 'Boundary' : 'Interior', detail: boundary.atBoundary ? 'No interior zero-score point is required' : 'The usual score=0 condition applies' },
            { label: 'Likelihood direction', value: boundary.direction === 'increase-p' ? 'Push p ↑' : boundary.direction === 'decrease-p' ? 'Push p ↓' : 'Stationary inside', detail: 'Constrained parameter space matters' },
          ]} />
          <div className={`rounded-xl border p-3 text-sm leading-6 ${boundary.atBoundary ? 'border-amber-300 bg-white text-amber-950' : 'border-emerald-300 bg-white text-emerald-950'}`}>
            <div className="flex items-center gap-2 font-black">{boundary.atBoundary ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}{boundary.atBoundary ? 'Boundary MLE' : 'Interior MLE'}</div>
            <p className="mt-1">{boundary.atBoundary ? 'Optimization stops because p cannot move farther, not because the interior derivative vanished.' : 'Once both outcomes appear, the Bernoulli optimum sits inside (0, 1).'}</p>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Sigma size={15} /> Numerical stability</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">Products can become zero while the log-likelihood is still informative.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">Multiplying thousands of probabilities creates numbers smaller than floating-point can represent. Summing log-probabilities preserves the ranking and turns multiplication into addition.</p>
          </div>
          <Slider
            label="Dataset size multiplier"
            value={observationsScale}
            {...MLE_FAILURE_LIMITS.observationsScale}
            format={(value) => `${value}×`}
            help="The success fraction stays 60%; only the number of likelihood factors grows."
            onChange={setObservationsScale}
          />
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[540px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Candidate</th><th className="p-3">p</th><th className="p-3">Direct product</th><th className="p-3">log L</th><th className="p-3">Rank</th></tr></thead>
              <tbody>{[
                ['A', stability.candidateA],
                ['B', stability.candidateB],
              ].map(([id, candidate]) => (
                <tr key={id} className="border-t border-slate-200"><td className="p-3 font-black">{id}</td><td className="p-3 font-mono">{candidate.p.toFixed(2)}</td><td className="p-3 font-mono">{scientific(candidate.direct)}</td><td className="p-3 font-mono">{candidate.logLikelihood.toFixed(2)}</td><td className="p-3 font-black">{stability.preferred === id ? 'better' : 'worse'}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className={`rounded-xl border p-3 text-sm leading-6 ${stability.bothDirectUnderflow ? 'border-rose-300 bg-white text-rose-950' : 'border-emerald-300 bg-white text-emerald-950'}`}>
            <strong>{stability.bothDirectUnderflow ? 'Direct products have both collapsed to zero.' : 'Direct products are still representable.'}</strong>
            <p className="mt-1">The log-likelihoods remain finite and differ by {stability.logLikelihoodGap.toFixed(2)}, so candidate {stability.preferred} is still clearly preferred.</p>
          </div>
        </section>
      </div>
    </Plate>
  );
}
