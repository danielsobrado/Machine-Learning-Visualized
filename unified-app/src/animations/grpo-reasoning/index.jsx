import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, Gauge, Sigma } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { GRPO_DEFAULTS, GRPO_PRESETS } from './grpoConfig';
import { buildGrpoLab } from './grpoModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function GrpoReasoningAnimation() {
  const [presetId, setPresetId] = useState(GRPO_DEFAULTS.presetId);
  const [clipEpsilon, setClipEpsilon] = useState(GRPO_DEFAULTS.clipEpsilon);
  const [klBeta, setKlBeta] = useState(GRPO_DEFAULTS.klBeta);
  const preset = GRPO_PRESETS.find((item) => item.id === presetId);
  const lab = useMemo(
    () => buildGrpoLab({ ...preset, clipEpsilon, klBeta }),
    [preset, clipEpsilon, klBeta],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Reasoning RL</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">GRPO: relative rewards, real ratios, real clipping</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          GRPO samples sibling responses for one prompt, standardizes their rewards inside the group, then applies a PPO-style
          clipped importance-ratio objective without learning a separate critic. The clip acts on the policy ratio, not on the advantage.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {GRPO_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPresetId(item.id)}
              className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Clip ε: {clipEpsilon.toFixed(2)}
            <input type="range" min="0.05" max="0.4" step="0.01" value={clipEpsilon} onChange={(event) => setClipEpsilon(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            KL β: {klBeta.toFixed(2)}
            <input type="range" min="0" max="0.2" step="0.01" value={klBeta} onChange={(event) => setKlBeta(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="Group mean" value={lab.rewardMean.toFixed(3)} detail="mean reward" />
        <Metric label="Group std" value={lab.rewardStd.toFixed(3)} detail={lab.usefulSignal ? 'relative contrast exists' : 'zero relative signal'} />
        <Metric label="Clip fraction" value={`${(lab.clipFraction * 100).toFixed(0)}%`} detail="samples whose surrogate is clipped" />
        <Metric label="Mean KL" value={lab.meanKl.toFixed(4)} detail="new policy vs behavior proxy" />
        <Metric label="Objective" value={lab.meanPenalizedObjective.toFixed(3)} detail="clipped surrogate minus β·KL" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <BarChart3 size={16} /> Group update table
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="py-2">#</th><th>Reward</th><th>Advantage</th><th>π old</th><th>π new</th><th>Ratio</th><th>Clipped ratio</th><th>Objective</th><th>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lab.rows.map((row) => (
                <tr key={row.index}>
                  <td className="py-3 font-bold">A{row.index + 1}</td>
                  <td>{row.reward.toFixed(2)}</td>
                  <td className={row.advantage > 0 ? 'text-emerald-700' : row.advantage < 0 ? 'text-rose-700' : 'text-slate-500'}>{row.advantage.toFixed(3)}</td>
                  <td>{row.oldProbability.toFixed(3)}</td>
                  <td>{row.newProbability.toFixed(3)}</td>
                  <td className="font-mono">{row.ratio.toFixed(3)}</td>
                  <td className="font-mono">{row.clippedRatio.toFixed(3)}</td>
                  <td className="font-mono">{row.penalizedObjective.toFixed(3)}</td>
                  <td><span className={`rounded px-2 py-1 text-xs font-bold ${row.clippedActive ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{row.clippedActive ? 'clipped' : 'live'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-700"><Sigma size={15} /> Group baseline</strong>
          Standardization is computed across sibling rewards. Positive affine rescaling of all rewards leaves these standardized advantages unchanged.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700"><AlertTriangle size={15} /> Zero-gradient group</strong>
          All-correct and all-wrong presets have zero reward variance, so every group-relative advantage is zero. More samples do not create contrast by themselves.
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-700"><Gauge size={15} /> Correct clipping variable</strong>
          PPO/GRPO clipping constrains the importance ratio πθ(token)/πold(token). The normalized advantage supplies direction and scale; ε does not clip the advantage itself.
        </div>
      </section>

      <AssessmentPanel lessonId="grpo-reasoning" title="GRPO reasoning check" />
    </div>
  );
}
