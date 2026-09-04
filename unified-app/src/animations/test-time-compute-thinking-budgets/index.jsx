import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, ExternalLink, Gauge, Sigma } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  TTC_DEFAULTS,
  TTC_PRESETS,
  TTC_SAMPLE_COUNTS,
  TTC_SOURCES,
} from './ttcConfig';
import { buildTestTimeComputeLab } from './ttcModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function PercentSlider({ label, value, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}: {(value * 100).toFixed(0)}%
      <input
        data-math-control
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function TestTimeComputeThinkingBudgets() {
  const [presetId, setPresetId] = useState(TTC_DEFAULTS.presetId);
  const [sampleCount, setSampleCount] = useState(TTC_DEFAULTS.sampleCount);
  const [baseSuccessProbability, setBaseSuccessProbability] = useState(TTC_DEFAULTS.baseSuccessProbability);
  const [truePositiveRate, setTruePositiveRate] = useState(TTC_DEFAULTS.verifierTruePositiveRate);
  const [falsePositiveRate, setFalsePositiveRate] = useState(TTC_DEFAULTS.verifierFalsePositiveRate);

  const lab = useMemo(() => buildTestTimeComputeLab({
    baseSuccessProbability,
    sampleCount,
    verifierTruePositiveRate: truePositiveRate,
    verifierFalsePositiveRate: falsePositiveRate,
    tokensPerSample: TTC_DEFAULTS.tokensPerSample,
  }), [baseSuccessProbability, sampleCount, truePositiveRate, falsePositiveRate]);

  const curve = useMemo(() => TTC_SAMPLE_COUNTS.map((count) => ({
    count,
    ...buildTestTimeComputeLab({
      baseSuccessProbability,
      sampleCount: count,
      verifierTruePositiveRate: truePositiveRate,
      verifierFalsePositiveRate: falsePositiveRate,
      tokensPerSample: TTC_DEFAULTS.tokensPerSample,
    }),
  })), [baseSuccessProbability, truePositiveRate, falsePositiveRate]);

  const applyPreset = (preset) => {
    setPresetId(preset.id);
    setSampleCount(preset.sampleCount);
    setBaseSuccessProbability(preset.baseSuccessProbability);
    setTruePositiveRate(preset.verifierTruePositiveRate);
    setFalsePositiveRate(preset.verifierFalsePositiveRate);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Inference-time scaling</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Test-time compute: separate coverage from selection</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Extra inference compute can generate more independent attempts, spend more tokens on one attempt, or search with a verifier.
          This lab keeps the assumptions explicit: each sample succeeds with probability p, and a binary verifier has a true-positive and false-positive rate.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {TTC_PRESETS.map((preset) => (
            <button
              key={preset.id}
              data-math-control
              type="button"
              onClick={() => applyPreset(preset)}
              className={`rounded-lg border p-3 text-left ${presetId === preset.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{preset.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{preset.detail}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <PercentSlider label="Single-sample success p" value={baseSuccessProbability} onChange={setBaseSuccessProbability} />
          <PercentSlider label="Verifier TPR" value={truePositiveRate} onChange={setTruePositiveRate} />
          <PercentSlider label="Verifier FPR" value={falsePositiveRate} onChange={setFalsePositiveRate} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Independent samples N</p>
          <div className="flex flex-wrap gap-2">
            {TTC_SAMPLE_COUNTS.map((count) => (
              <button
                key={count}
                data-math-control
                type="button"
                onClick={() => setSampleCount(count)}
                className={`rounded border px-3 py-2 text-sm font-bold ${sampleCount === count ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="Single attempt" value={`${(lab.baseSuccessProbability * 100).toFixed(1)}%`} detail="P(one sample is correct)" />
        <Metric label="Oracle coverage" value={`${(lab.oracleCoverage * 100).toFixed(1)}%`} detail="pass@N: at least one correct" />
        <Metric label="Verifier selection" value={`${(lab.selectedAccuracy * 100).toFixed(1)}%`} detail="correctness after binary selection" />
        <Metric label="Majority toy" value={`${(lab.voteAccuracy * 100).toFixed(1)}%`} detail="binary correctness majority vote" />
        <Metric label="Token cost" value={lab.expectedTokenCost.toLocaleString()} detail={`${TTC_DEFAULTS.tokensPerSample} tokens × ${sampleCount}`} />
      </div>

      {!lab.verifierUseful && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700">
            <AlertTriangle size={15} /> Verifier warning
          </strong>
          TPR ≤ FPR, so the verifier does not rank correctness positively. More candidates can increase oracle coverage while selection stays flat or becomes worse than random choice.
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Calculator size={16} /> Exact quantities
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <div className="rounded border border-slate-200 bg-slate-50 p-3 font-mono">pass@N = 1 − (1 − p)^N</div>
            <div className="rounded border border-slate-200 bg-slate-50 p-3 font-mono">q = p·TPR + (1−p)·FPR</div>
            <p>
              The selection calculation is exact for this stated policy: choose uniformly among verifier-positive candidates; if none are positive, choose uniformly from all candidates.
            </p>
            <p>
              Marginal oracle gain from the last sample: <strong>{(lab.marginalCoverageGain * 100).toFixed(2)} percentage points</strong>.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Sigma size={16} /> Scaling table
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="py-2">N</th><th>pass@N</th><th>selected correct</th><th>expected verifier +</th><th>tokens</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {curve.map((row) => (
                  <tr key={row.count} className={row.count === sampleCount ? 'bg-indigo-50' : ''}>
                    <td className="py-2 font-bold">{row.count}</td>
                    <td>{(row.oracleCoverage * 100).toFixed(1)}%</td>
                    <td>{(row.selectedAccuracy * 100).toFixed(1)}%</td>
                    <td>{row.expectedVerifierPositives.toFixed(2)}</td>
                    <td>{row.expectedTokenCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-700"><Gauge size={15} /> Coverage is not selection</strong>
          pass@N only asks whether a correct sample exists. A real system still needs a reliable way to identify it.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="text-xs uppercase tracking-wide text-emerald-700">Perfect verifier limit</strong>
          With TPR=1 and FPR=0, selected correctness exactly equals pass@N.
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <strong className="text-xs uppercase tracking-wide text-rose-700">No free scaling law</strong>
          Real gains depend on prompt difficulty, sample dependence, verifier quality, and how compute is allocated. The dashboard does not invent an accuracy curve.
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Sources</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {TTC_SOURCES.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="rounded border border-slate-200 p-3 text-sm hover:border-indigo-400">
              <strong className="flex items-center gap-2 text-slate-950">{source.label}<ExternalLink size={14} /></strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{source.note}</span>
            </a>
          ))}
        </div>
      </section>

      <AssessmentPanel lessonId="test-time-compute-thinking-budgets" title="Test-time compute check" />
    </div>
  );
}
