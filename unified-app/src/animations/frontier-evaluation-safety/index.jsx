import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Lock, ShieldCheck, Target } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { EVAL_CASES, EVAL_DEFAULTS, EVAL_POLICIES } from './evalConfig';
import { comparePolicies, evaluatePolicy } from './evalModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function pct(value) {
  return `${(value * 100).toFixed(0)}%`;
}

export default function FrontierEvaluationSafetyAnimation() {
  const [policyId, setPolicyId] = useState(EVAL_DEFAULTS.policyId);
  const policy = EVAL_POLICIES.find((item) => item.id === policyId);
  const result = useMemo(() => evaluatePolicy(EVAL_CASES, policy), [policy]);
  const comparison = useMemo(() => comparePolicies(EVAL_CASES, EVAL_POLICIES), []);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-rose-700">Frontier evaluation</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Evaluation is evidence, not a readiness percentage</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Capability accuracy, benign-task reliability, attack success, approval behavior, and tool-policy violations answer different questions.
          This lab keeps them separate and evaluates explicit cases instead of averaging them into one synthetic deployment score.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {EVAL_POLICIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPolicyId(item.id)}
              className={`rounded-lg border p-3 text-left ${policyId === item.id ? 'border-rose-500 bg-rose-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="Exact decisions" value={`${result.correctCount}/${result.total}`} detail="allow / approve / block" />
        <Metric label="Attack success" value={pct(result.attackSuccessRate)} detail="harmful cases executed" />
        <Metric label="Benign block" value={pct(result.benignBlockRate)} detail="safe cases over-blocked" />
        <Metric label="Approval recall" value={pct(result.approvalRecall)} detail="mutations correctly gated" />
        <Metric label="Unsafe executions" value={result.unsafeExecutionCount} detail="must be inspected directly" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Target size={16} /> Case-level evaluation
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="py-2">Case</th><th>Suite</th><th>Expected</th><th>Observed</th><th>Reason</th><th>Result</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.rows.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 font-bold text-slate-900">{row.label}</td>
                  <td>{row.suite}</td>
                  <td className="font-mono">{row.expected}</td>
                  <td className="font-mono">{row.decision}</td>
                  <td className="text-slate-600">{row.reason}</td>
                  <td>{row.correct ? <CheckCircle2 size={17} className="text-emerald-600" /> : <AlertTriangle size={17} className="text-amber-600" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><ShieldCheck size={16} /> Suite evidence</h3>
          <div className="mt-4 space-y-3">
            {result.suites.map((suite) => (
              <div key={suite.suite} className="rounded-lg border border-slate-200 p-3">
                <div className="flex justify-between gap-3 text-sm"><strong>{suite.suite}</strong><span className="font-mono">{suite.correct}/{suite.total}</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded bg-slate-100"><div className="h-full bg-rose-500" style={{ width: `${suite.rate * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Lock size={16} /> Policy comparison</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="text-left text-xs uppercase text-slate-500"><tr><th>Policy</th><th>Exact</th><th>Attack success</th><th>Benign block</th><th>Unsafe</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.map(({ policy: item, result: itemResult }) => (
                  <tr key={item.id}><td className="py-3 font-bold">{item.label}</td><td>{pct(itemResult.exactDecisionRate)}</td><td>{pct(itemResult.attackSuccessRate)}</td><td>{pct(itemResult.benignBlockRate)}</td><td>{itemResult.unsafeExecutionCount}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950"><strong>Do not average away failures.</strong> A high capability score does not compensate for one catastrophic mutating-tool policy violation.</div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Safety has false positives too.</strong> Blocking every tool call can drive attack success to zero while destroying benign-task usefulness.</div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong>Approval is a state.</strong> A correct eval should distinguish allow, require approval, and block rather than treating all non-execution as equivalent.</div>
      </section>

      <AssessmentPanel lessonId="frontier-evaluation-safety" title="Frontier evaluation & safety check" />
    </div>
  );
}
