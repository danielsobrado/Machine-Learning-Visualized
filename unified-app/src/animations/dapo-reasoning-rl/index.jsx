import React, { useMemo, useState } from 'react';
import { Filter, Scissors, Split, TimerReset } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { DAPO_DEFAULTS, DAPO_GROUPS } from './dapoConfig';
import { buildDapoLab } from './dapoModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function DapoReasoningRlAnimation() {
  const [lowerEpsilon, setLowerEpsilon] = useState(DAPO_DEFAULTS.lowerEpsilon);
  const [upperEpsilon, setUpperEpsilon] = useState(DAPO_DEFAULTS.upperEpsilon);
  const [maxLength, setMaxLength] = useState(DAPO_DEFAULTS.maxLength);
  const [cacheLength, setCacheLength] = useState(DAPO_DEFAULTS.cacheLength);
  const lab = useMemo(
    () => buildDapoLab({ groups: DAPO_GROUPS, lowerEpsilon, upperEpsilon, maxLength, cacheLength }),
    [lowerEpsilon, upperEpsilon, maxLength, cacheLength],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-fuchsia-700">Long-CoT reinforcement learning</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">DAPO: four mechanics, one objective</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          DAPO modifies GRPO with asymmetric clipping, dynamic sampling, token-level loss aggregation, and a soft overlong penalty.
          This lab computes those mechanics directly instead of collapsing them into a made-up training-health score.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            ε low: {lowerEpsilon.toFixed(2)}
            <input type="range" min="0.05" max="0.4" step="0.01" value={lowerEpsilon} onChange={(event) => setLowerEpsilon(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            ε high: {upperEpsilon.toFixed(2)}
            <input type="range" min="0.05" max="0.6" step="0.01" value={upperEpsilon} onChange={(event) => setUpperEpsilon(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Max length: {maxLength}
            <input type="range" min="60" max="160" step="5" value={maxLength} onChange={(event) => setMaxLength(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Soft cache: {cacheLength}
            <input type="range" min="10" max={Math.max(10, maxLength - 10)} step="5" value={Math.min(cacheLength, maxLength - 10)} onChange={(event) => setCacheLength(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Useful groups" value={`${lab.usefulGroups}/${lab.totalGroups}`} detail="mixed reward only" />
        <Metric label="Retained" value={`${(lab.retainedFraction * 100).toFixed(0)}%`} detail="dynamic sampling buffer" />
        <Metric label="Upper ceiling" value={(1 + upperEpsilon).toFixed(2)} detail="Clip-Higher positive-ratio cap" />
        <Metric label="Lower floor" value={(1 - lowerEpsilon).toFixed(2)} detail="negative-side ratio floor" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Filter size={16} /> Dynamic sampling + loss reduction
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr><th className="py-2">Group</th><th>Rewards</th><th>Tokens</th><th>Dynamic sampling</th><th>Sequence-level objective</th><th>Token-level objective</th><th>Clip fraction</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lab.rows.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 font-bold text-slate-950">{row.label}</td>
                  <td className="font-mono">[{row.rewards.join(', ')}]</td>
                  <td>{row.tokenCount}</td>
                  <td><span className={`rounded px-2 py-1 text-xs font-bold ${row.useful ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{row.useful ? 'keep' : 'filter'}</span></td>
                  <td className="font-mono">{row.sampleObjective.toFixed(3)}</td>
                  <td className="font-mono">{row.tokenObjective.toFixed(3)}</td>
                  <td>{(row.clipFraction * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Split size={16} /> Sequence mean vs token mean</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            GRPO first averages each response over its own tokens, then averages responses. DAPO instead divides by the total number of tokens in the batch.
            When response lengths differ, those are different objectives. The long-CoT row above makes the difference visible.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><TimerReset size={16} /> Soft overlong punishment</h3>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {lab.lengthExamples.map((item) => (
              <div key={item.length} className="rounded-lg bg-slate-50 p-3 text-center">
                <strong className="block text-lg">{item.length}</strong>
                <span className="text-xs text-slate-600">penalty {item.penalty.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 p-4 text-sm leading-6 text-fuchsia-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-fuchsia-700"><Scissors size={15} /> Clip-Higher</strong>
          Raising ε high gives positive-advantage, low-probability tokens more room to increase without also relaxing the lower clip boundary.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="text-xs uppercase tracking-wide text-amber-700">No contrast, no group signal</strong><br />
          Dynamic sampling removes all-correct and all-wrong prompt groups because standardized binary rewards are identical and their relative advantages are zero.
        </div>
      </section>

      <AssessmentPanel lessonId="dapo-reasoning-rl" title="DAPO reasoning RL check" />
    </div>
  );
}
