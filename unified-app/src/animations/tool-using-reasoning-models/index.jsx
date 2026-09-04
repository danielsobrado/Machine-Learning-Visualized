import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Lock, Wrench } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { TOOL_DEFAULTS, TOOL_POLICIES, TOOL_SCENARIOS } from './toolConfig';
import { compareToolPolicies, runScenario } from './toolModel';

function Metric({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function ToolUsingReasoningModelsAnimation() {
  const [scenarioId, setScenarioId] = useState(TOOL_DEFAULTS.scenarioId);
  const [policyId, setPolicyId] = useState(TOOL_DEFAULTS.policyId);
  const [approvalsGranted, setApprovalsGranted] = useState(true);
  const scenario = TOOL_SCENARIOS.find((item) => item.id === scenarioId);
  const policy = TOOL_POLICIES.find((item) => item.id === policyId);
  const result = useMemo(() => runScenario(scenario, policy, { approvalsGranted }), [scenario, policy, approvalsGranted]);
  const comparison = useMemo(() => compareToolPolicies(scenario, TOOL_POLICIES, { approvalsGranted }), [scenario, approvalsGranted]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">Tool-using reasoning</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Reason → act → observe, with provenance and permission boundaries</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">The old lesson invented accuracy, grounding, risk, latency, and cost from sliders. This workbench executes a deterministic tool trace instead: tools either run, block, request approval, yield required facts, or cause an unsafe side effect.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {TOOL_SCENARIOS.map((item) => <button key={item.id} type="button" onClick={() => setScenarioId(item.id)} className={`rounded-lg border p-3 text-left ${scenarioId === item.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span></button>)}
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-4">
          {TOOL_POLICIES.map((item) => <button key={item.id} type="button" onClick={() => setPolicyId(item.id)} className={`rounded-lg border p-3 text-left ${policyId === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span></button>)}
        </div>
        {scenario.requiresMutation ? <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={approvalsGranted} onChange={(event) => setApprovalsGranted(event.target.checked)} /> Human grants requested mutation approval</label> : null}
      </section>

      <div className="grid gap-3 md:grid-cols-6">
        <Metric label="Goal" value={result.goalAchieved ? 'met' : 'not met'} detail="facts + required side effect" />
        <Metric label="Grounding" value={`${Math.round(result.groundingRecall * 100)}%`} detail="required facts observed" />
        <Metric label="Tool calls" value={result.executedToolCalls} detail={`${result.blockedToolCalls} blocked`} />
        <Metric label="Approvals" value={result.approvalRequests} detail="mutation gates reached" />
        <Metric label="Unsafe" value={result.unsafeExecutions} detail="executed unsafe actions" />
        <Metric label="Trace cost" value={`${result.latencyMs} ms`} detail={`${result.tokenCost} tool-result tokens`} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Wrench size={16} /> Executed trace</h3>
        <div className="mt-4 space-y-2">
          {result.rows.map((row) => (
            <div key={row.id} className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[140px_160px_1fr_auto] md:items-center">
              <strong className="font-mono text-sm">{row.id}</strong>
              <span className={`text-xs font-black uppercase ${row.status === 'blocked' || row.status === 'approval-denied' ? 'text-rose-700' : row.status === 'approval' ? 'text-amber-700' : 'text-emerald-700'}`}>{row.status}</span>
              <span className="text-sm text-slate-600">{row.reason ?? (row.type === 'answer' ? `grounded ${Math.round(row.groundingRecall * 100)}%` : '')}</span>
              {row.unsafe && row.executed ? <AlertTriangle size={18} className="text-rose-600" /> : row.executed ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Lock size={18} className="text-slate-500" />}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Database size={16} /> Facts required vs observed</h3>
          <div className="mt-4 space-y-2">{scenario.requiredFacts.map((fact) => <div key={fact} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm"><span className="font-mono">{fact}</span><span className={result.facts.includes(fact) ? 'text-emerald-700' : 'text-rose-700'}>{result.facts.includes(fact) ? 'observed' : 'missing'}</span></div>)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Policy comparison</h3>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead className="text-left text-xs uppercase text-slate-500"><tr><th>Policy</th><th>Goal</th><th>Grounding</th><th>Unsafe</th><th>Calls</th></tr></thead><tbody className="divide-y divide-slate-100">{comparison.map(({ policy: item, result: itemResult }) => <tr key={item.id}><td className="py-3 font-bold">{item.label}</td><td>{itemResult.goalAchieved ? 'yes' : 'no'}</td><td>{Math.round(itemResult.groundingRecall * 100)}%</td><td>{itemResult.unsafeExecutions}</td><td>{itemResult.executedToolCalls}</td></tr>)}</tbody></table></div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><strong>Grounding is observable.</strong> Count which required facts came from tool observations instead of inventing a “grounding score.”</div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Tool output is data, not authority.</strong> An instruction inside an untrusted search result must not gain write permission merely because the model read it.</div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong>Approval is part of the trace.</strong> A write can be useful, policy-compliant, and still require a human transition before execution.</div>
      </section>

      <AssessmentPanel lessonId="tool-using-reasoning-models" title="Tool-using reasoning check" />
    </div>
  );
}
