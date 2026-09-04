import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, GitPullRequest, RotateCcw, Terminal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { AGENT_DEFAULTS, PATCH_CANDIDATES } from './agentConfig';
import { comparePatches, evaluatePatch } from './agentModel';

function Metric({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function AgenticCodingSystemsAnimation() {
  const [candidateId, setCandidateId] = useState(AGENT_DEFAULTS.candidateId);
  const [maxUnrelatedFiles, setMaxUnrelatedFiles] = useState(AGENT_DEFAULTS.maxUnrelatedFiles);
  const candidate = PATCH_CANDIDATES.find((item) => item.id === candidateId);
  const result = useMemo(() => evaluatePatch(candidate, { maxUnrelatedFiles }), [candidate, maxUnrelatedFiles]);
  const comparison = useMemo(() => comparePatches(PATCH_CANDIDATES, { maxUnrelatedFiles }), [maxUnrelatedFiles]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Agentic coding</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Inspect → patch → test → review → gate</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Patch confidence and repository recall are not measurements. This lesson evaluates concrete artifacts: changed files, fail-to-pass tests, pass-to-pass regressions, proposed shell commands, scope, and the final ship gate.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">{PATCH_CANDIDATES.map((item) => <button key={item.id} type="button" onClick={() => setCandidateId(item.id)} className={`rounded-lg border p-3 text-left ${candidateId === item.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span></button>)}</div>
        <label className="mt-5 grid max-w-xl gap-2 text-sm font-bold text-slate-700">Allowed unrelated files: {maxUnrelatedFiles}<input type="range" min="0" max="5" step="1" value={maxUnrelatedFiles} onChange={(event) => setMaxUnrelatedFiles(Number(event.target.value))} /></label>
      </section>

      <div className="grid gap-3 md:grid-cols-6">
        <Metric label="Ship gate" value={result.ship ? 'PASS' : 'FAIL'} detail={result.ship ? 'all required gates satisfied' : `${result.gateFailures.length} blocker(s)`} />
        <Metric label="FAIL→PASS" value={`${Math.round(result.failToPassRate * 100)}%`} detail="target regressions fixed" />
        <Metric label="PASS→PASS" value={`${Math.round(result.passToPassRate * 100)}%`} detail="existing behavior preserved" />
        <Metric label="Scope drift" value={result.unrelatedFileCount} detail="files outside issue scope" />
        <Metric label="Blocked cmds" value={result.forbiddenCommandCount} detail="must not execute" />
        <Metric label="Rollback" value={result.rollbackRequired ? 'yes' : 'no'} detail="checkpoint recovery required" />
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><GitPullRequest size={16} /> Diff scope</h3>
          <div className="mt-4 space-y-2">{candidate.changedFiles.map((path) => { const unrelated = result.unrelatedFiles.includes(path); return <div key={path} className={`rounded-lg border p-3 font-mono text-sm ${unrelated ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50'}`}>{path}{unrelated ? '  ← unrelated' : ''}</div>; })}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Terminal size={16} /> Command policy</h3>
          <div className="mt-4 space-y-2">{result.commandRows.map((row) => <div key={row.command} className="grid gap-1 rounded-lg border border-slate-200 p-3"><code className="text-sm">{row.command}</code><span className={`text-xs font-black uppercase ${row.class === 'blocked' ? 'text-rose-700' : row.class === 'approval' ? 'text-amber-700' : 'text-emerald-700'}`}>{row.class} · {row.reason}</span></div>)}</div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Regression matrix</h3>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-2">Test</th><th>Class</th><th>Required</th><th>After</th></tr></thead><tbody className="divide-y divide-slate-100">{candidate.tests.map((item) => <tr key={item.name}><td className="py-3 font-bold">{item.name}</td><td>{item.kind}</td><td>{item.required ? 'yes' : 'no'}</td><td className={item.after === 'pass' ? 'text-emerald-700' : item.after === 'fail' ? 'text-rose-700' : 'text-slate-500'}>{item.after}</td></tr>)}</tbody></table></div>
      </section>

      {!result.ship ? <section className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950"><strong className="flex items-center gap-2"><AlertTriangle size={17} /> Gate failures</strong><ul className="mt-2 list-disc pl-6">{result.gateFailures.map((failure) => <li key={failure}>{failure}</li>)}</ul></section> : <section className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950"><strong className="flex items-center gap-2"><CheckCircle2 size={17} /> Candidate is ready for review/merge under these explicit gates.</strong></section>}

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Candidate comparison</h3>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="text-left text-xs uppercase text-slate-500"><tr><th>Patch</th><th>Ship</th><th>F→P</th><th>P→P</th><th>Scope drift</th><th>Blocked commands</th></tr></thead><tbody className="divide-y divide-slate-100">{comparison.map((item) => <tr key={item.candidate.id}><td className="py-3 font-bold">{item.candidate.label}</td><td>{item.ship ? 'yes' : 'no'}</td><td>{Math.round(item.failToPassRate * 100)}%</td><td>{Math.round(item.passToPassRate * 100)}%</td><td>{item.unrelatedFileCount}</td><td>{item.forbiddenCommandCount}</td></tr>)}</tbody></table></div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong>A passing target test is insufficient.</strong> PASS→PASS tests catch patches that solve the issue by breaking established behavior elsewhere.</div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Scope is observable.</strong> Count unrelated changed files rather than displaying an invented “scope drift risk.”</div>
        <div className="rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-800"><strong className="flex items-center gap-2"><RotateCcw size={16} /> Rollback is a first-class transition.</strong> A failing regression or forbidden command should restore the checkpoint instead of pushing forward.</div>
      </section>

      <AssessmentPanel lessonId="agentic-coding-systems" title="Agentic coding systems check" />
    </div>
  );
}
