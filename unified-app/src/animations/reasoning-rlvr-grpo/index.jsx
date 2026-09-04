import React, { useMemo, useState } from 'react';
import { CheckCircle2, Search, ShieldAlert, Sigma, XCircle } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { RLVR_DEFAULTS, RLVR_PRESETS } from './rlvrConfig';
import { buildRlvrLab } from './rlvrModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function ReasoningRlvrGrpo() {
  const [presetId, setPresetId] = useState(RLVR_DEFAULTS.presetId);
  const [independentSuccessProbability, setIndependentSuccessProbability] = useState(RLVR_DEFAULTS.independentSuccessProbability);
  const [samplesK, setSamplesK] = useState(RLVR_DEFAULTS.samplesK);
  const [groupSize, setGroupSize] = useState(RLVR_DEFAULTS.groupSize);
  const preset = RLVR_PRESETS.find((item) => item.id === presetId);
  const lab = useMemo(
    () => buildRlvrLab({ candidates: preset.candidates, independentSuccessProbability, samplesK, groupSize }),
    [preset, independentSuccessProbability, samplesK, groupSize],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">RL from verifiable rewards</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">RLVR: the verifier defines the training signal</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          A verifiable task can turn answer checking into a sparse reward. Group-relative optimization can then reinforce better samples without a critic—but only relative to what the verifier actually labels as success.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-4">
          {RLVR_PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPresetId(item.id)}
              className={`rounded-lg border p-3 text-left ${presetId === item.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
            >
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="Reward std" value={lab.rewardStd.toFixed(3)} detail={lab.usefulSignal ? 'group contrast exists' : 'zero GRPO signal'} />
        <Metric label="Signal alignment" value={lab.signalAlignment == null ? 'N/A' : `${(lab.signalAlignment * 100).toFixed(0)}%`} detail="directions agreeing with truth" />
        <Metric label="False positives" value={lab.falsePositiveCount} detail="wrong answers rewarded" />
        <Metric label="False negatives" value={lab.falseNegativeCount} detail="correct answers rejected" />
        <Metric label={`pass@${samplesK}`} value={`${(lab.passAtK * 100).toFixed(1)}%`} detail="under independent samples" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <Search size={16} /> Candidate-level verifier signal
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {lab.rows.map((row) => (
            <div key={row.id} className={`rounded-lg border p-4 ${row.verifierPass ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between gap-3">
                <strong>Candidate {row.id}</strong>
                {row.correct ? <CheckCircle2 className="text-emerald-700" size={18} /> : <XCircle className="text-rose-700" size={18} />}
              </div>
              <p className="mt-2 text-sm text-slate-700">Truth: <strong>{row.correct ? 'correct' : 'wrong'}</strong></p>
              <p className="text-sm text-slate-700">Verifier: <strong>{row.verifierPass ? 'pass' : 'fail'}</strong></p>
              <p className={`mt-2 font-mono text-sm font-bold ${row.advantage > 0 ? 'text-emerald-700' : row.advantage < 0 ? 'text-rose-700' : 'text-slate-500'}`}>advantage {row.advantage.toFixed(3)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Sigma size={16} /> Sampling math</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Single-sample success p: {(independentSuccessProbability * 100).toFixed(0)}%
            <input type="range" min="0.01" max="0.99" step="0.01" value={independentSuccessProbability} onChange={(event) => setIndependentSuccessProbability(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Samples k: {samplesK}
            <input type="range" min="1" max="32" step="1" value={samplesK} onChange={(event) => setSamplesK(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            GRPO group size G: {groupSize}
            <input type="range" min="2" max="32" step="1" value={groupSize} onChange={(event) => setGroupSize(Number(event.target.value))} />
          </label>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <strong>At least one success:</strong> 1 − (1 − p)^k = <strong>{(lab.passAtK * 100).toFixed(1)}%</strong>. This identity assumes independent samples with constant success probability.
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
            <strong>Useful binary-reward group:</strong> 1 − p^G − (1 − p)^G = <strong>{(lab.usefulGroupProbability * 100).toFixed(1)}%</strong>. All-pass and all-fail groups have no relative reward contrast.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <strong className="text-xs uppercase tracking-wide text-emerald-700">Exact reward</strong><br />
          For math/code tasks with a trustworthy checker, binary outcome rewards can be simple and objective.
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-rose-700"><ShieldAlert size={15} /> Verifier exploit</strong>
          A false positive is not harmless label noise: group-relative optimization can give an actually wrong completion positive training pressure.
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong className="text-xs uppercase tracking-wide text-amber-700">No invented learning curve</strong><br />
          This lab reports reward contrast and signal alignment directly. It does not fabricate future model accuracy from hand-written heuristics.
        </div>
      </section>

      <AssessmentPanel lessonId="reasoning-rlvr-grpo" title="RLVR / GRPO reasoning check" />
    </div>
  );
}
