import React, { useMemo, useState } from 'react';
import { AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { SHAPING_DEFAULTS, SHAPING_TRAJECTORIES, STATE_POTENTIALS } from './rewardShapingConfig';
import { buildRewardShapingLab } from './rewardShapingModel';

function Stat({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function RewardShapingAnimation() {
  const [gamma, setGamma] = useState(SHAPING_DEFAULTS.gamma);
  const [weight, setWeight] = useState(SHAPING_DEFAULTS.weight);
  const [naiveProgressBonus, setNaiveProgressBonus] = useState(SHAPING_DEFAULTS.naiveProgressBonus);
  const lab = useMemo(() => buildRewardShapingLab({ trajectories: SHAPING_TRAJECTORIES, potentials: STATE_POTENTIALS, gamma, weight, naiveProgressBonus }), [gamma, weight, naiveProgressBonus]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Reward design</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Reward Shaping: guide learning without changing the task</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Potential-based shaping adds <strong>F(s,s′) = γΦ(s′) − Φ(s)</strong>. Discounted shaping terms telescope to a boundary term, so with zero terminal potential they shift all goal-reaching trajectory returns by the same constant and preserve their ordering.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-slate-700">Discount γ: {gamma.toFixed(2)}<input type="range" min="0.5" max="1" step="0.05" value={gamma} onChange={(event) => setGamma(Number(event.target.value))} /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Potential weight: {weight.toFixed(1)}<input type="range" min="0" max="3" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} /></label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Naive positive bonus: {naiveProgressBonus.toFixed(1)}<input type="range" min="0" max="8" step="0.5" value={naiveProgressBonus} onChange={(event) => setNaiveProgressBonus(Number(event.target.value))} /></label>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Task-optimal" value={lab.taskBest} detail="original sparse reward" />
        <Stat label="Potential-shaped optimal" value={lab.potentialBest} detail={lab.potentialPreservesBest ? 'same policy ranking' : 'ranking changed'} />
        <Stat label="Naive-bonus optimal" value={lab.naiveBest} detail={lab.naiveChangesBest ? 'reward hacking detected' : 'same ranking for these settings'} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Sparkles size={16} /> Trajectory returns</h3>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500"><th className="p-2">Trajectory</th><th className="p-2">States</th><th className="p-2">Task return</th><th className="p-2">Potential shaped</th><th className="p-2">Observed offset</th><th className="p-2">Boundary offset</th><th className="p-2">Naive shaped</th></tr></thead><tbody>{lab.rows.map((row) => <tr key={row.id} className="border-b border-slate-100"><td className="p-2 font-bold">{row.label}</td><td className="p-2 font-mono text-xs">{row.states.join(' → ')}</td><td className="p-2 font-mono">{row.taskReturn.toFixed(2)}</td><td className="p-2 font-mono">{row.shapedReturn.toFixed(2)}</td><td className="p-2 font-mono">{row.actualOffset.toFixed(2)}</td><td className="p-2 font-mono">{row.expectedOffset.toFixed(2)}</td><td className="p-2 font-mono">{row.naiveReturn.toFixed(2)}</td></tr>)}</tbody></table></div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><h3 className="flex items-center gap-2 font-black"><ShieldCheck size={16} /> Potential shaping</h3><p className="mt-2">For goal-reaching paths, the discounted shaping sum equals <strong>−Φ(s₀)</strong> when terminal Φ=0. The fast and slow goal paths therefore receive the same additive offset and keep the same ranking.</p></div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950"><h3 className="flex items-center gap-2 font-black"><AlertTriangle size={16} /> Reward hacking</h3><p className="mt-2">The naive rule pays only positive “progress” and never charges the reverse move. The agent can oscillate 0 → 1 → 0 → 1 and repeatedly harvest bonus without finishing the task.</p></div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">A step penalty or arbitrary dense bonus is part of the task reward and can change the optimal policy. Potential-based shaping is special because its discounted sum telescopes under the matching γ and terminal assumptions.</section>
      <AssessmentPanel lessonId="reward-shaping" title="Reward shaping check" />
    </div>
  );
}
