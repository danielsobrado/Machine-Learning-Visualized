import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { BarTrack, Plate, Readouts, Slider } from '../_shared/notebook';
import { POSITION_BIAS_DEFAULTS, POSITION_BIAS_LIMITS } from './positionBiasConstants.js';
import { positionBiasExperiment } from './positionBiasModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function PositionBiasLab() {
  const [secondExamination, setSecondExamination] = useState(POSITION_BIAS_DEFAULTS.secondExamination);
  const [itemAOnTop, setItemAOnTop] = useState(false);
  const result = useMemo(() => positionBiasExperiment({
    ...POSITION_BIAS_DEFAULTS,
    secondExamination,
    itemAOnTop,
  }), [itemAOnTop, secondExamination]);

  const rows = [result.itemA, result.itemB];

  return (
    <Plate label="5 · Logged feedback" title="Clicks are exposure × preference, not pure relevance">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-700">
            Item A is genuinely more attractive to this user: 32% click propensity when examined versus 24% for B. But the logging policy places one item higher, so position changes how often each item is actually examined.
          </p>
          <Slider
            label="Probability the #2 result is examined"
            value={secondExamination}
            {...POSITION_BIAS_LIMITS.secondExamination}
            format={(value) => pct(value)}
            help="Lower values create stronger position bias. The top position remains examined with probability 100% in this simplified model."
            onChange={setSecondExamination}
          />
          <button type="button" className="ds-btn" onClick={() => setItemAOnTop((current) => !current)}>
            Swap positions · A is currently #{itemAOnTop ? 1 : 2}
          </button>

          <Readouts columns={3} items={[
            { label: 'True preference winner', value: `Item ${result.trueWinner}`, detail: 'What we want the ranker to learn' },
            { label: 'Naive CTR winner', value: `Item ${result.naiveWinner}`, detail: result.naiveRankingWrong ? 'Wrong because exposure differs' : 'Agrees in this setting' },
            { label: 'Propensity-corrected winner', value: `Item ${result.correctedWinner}`, detail: 'Divides click rate by examination propensity' },
          ]} />
        </div>

        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[660px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="p-3">Item</th><th className="p-3">Rank</th><th className="p-3">True preference</th><th className="p-3">Exam probability</th><th className="p-3">Expected clicks</th><th className="p-3">Observed CTR</th><th className="p-3">Corrected</th></tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const rank = row.examination === POSITION_BIAS_DEFAULTS.topExamination ? 1 : 2;
                  return (
                    <tr key={row.id} className="border-t border-slate-200">
                      <td className="p-3 font-black">{row.id}</td>
                      <td className="p-3">#{rank}</td>
                      <td className="p-3 font-mono">{pct(row.relevance)}</td>
                      <td className="p-3 font-mono">{pct(row.examination)}</td>
                      <td className="p-3 font-mono">{Math.round(row.expectedClicks).toLocaleString()}</td>
                      <td className="p-3 font-mono">{pct(row.observedCtr)}</td>
                      <td className="p-3 font-mono">{pct(row.correctedPreference)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="nb-bar-stack">
            {rows.map((row) => (
              <BarTrack
                key={row.id}
                label={`Item ${row.id} observed CTR`}
                value={pct(row.observedCtr)}
                width={(row.observedCtr / Math.max(result.itemA.observedCtr, result.itemB.observedCtr, 0.01)) * 100}
                tone={row.id === result.trueWinner ? 'good' : 'warn'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-5 rounded-xl border p-4 ${result.naiveRankingWrong ? 'border-rose-300 bg-rose-50 text-rose-950' : 'border-emerald-300 bg-emerald-50 text-emerald-950'}`}>
        <div className="flex items-center gap-2 font-black">
          {result.naiveRankingWrong ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          {result.naiveRankingWrong ? 'Naive click labels would teach the wrong ordering' : 'Naive click ordering agrees here'}
        </div>
        <p className="mt-2 text-sm leading-6">
          <Eye size={15} className="mr-1 inline" />
          In this simplified examination model, observed CTR = examination probability × user preference. Propensity correction recovers the underlying preference only because the examination propensities are assumed known. Real systems estimate them through randomized exposure, interventions, or carefully validated click models.
        </p>
      </div>
    </Plate>
  );
}
