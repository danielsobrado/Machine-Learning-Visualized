import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../_shared/notebook';
import { DEFAULT_DR_SCENARIO, DR_LIMITS } from './doublyRobustConstants.js';
import { buildDoublyRobustLab } from './doublyRobustModel.js';

const pct = (value) => `${(value * 100).toFixed(0)}%`;
const value = (number) => number.toFixed(2);
const bias = (number) => `${number >= 0 ? '+' : ''}${number.toFixed(2)}`;

export default function DoublyRobustLab() {
  const [scenario, setScenario] = useState(DEFAULT_DR_SCENARIO);
  const lab = useMemo(() => buildDoublyRobustLab(scenario), [scenario]);
  const metrics = lab.metrics;
  const update = (key, next) => setScenario((current) => ({ ...current, [key]: next }));

  return (
    <Plate
      label="5 · Doubly robust estimation"
      title="AIPW gets two chances to model the adjustment correctly"
      note="Break the propensity model and the outcome model independently. In this population-level teaching calculation, AIPW recovers the ATE when either nuisance model is correct; if both are wrong, that protection is gone."
    >
      <ControlBench
        label="Misspecify the nuisance models"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_DR_SCENARIO)}>Reset</button>}
      >
        <Slider label="High-risk share" value={scenario.highRiskShare} {...DR_LIMITS.highRiskShare} format={pct} onChange={(next) => update('highRiskShare', next)} />
        <Slider label="Propensity-model misspecification" value={scenario.propensityMisspecification} {...DR_LIMITS.propensityMisspecification} format={pct} help="0% uses the true treatment probabilities. 100% ignores risk and predicts 50% treatment for everyone." onChange={(next) => update('propensityMisspecification', next)} />
        <Slider label="Outcome-model misspecification" value={scenario.outcomeMisspecification} {...DR_LIMITS.outcomeMisspecification} format={pct} help="0% models both subgroup effects correctly. 100% incorrectly forces both groups to the low-risk treatment effect." onChange={(next) => update('outcomeMisspecification', next)} />
      </ControlBench>

      <Readouts columns={4} items={[
        { label: 'True ATE', value: value(metrics.trueAte), detail: 'Oracle population effect' },
        { label: 'Outcome regression', value: value(metrics.outcomeRegression), detail: `bias ${bias(metrics.outcomeBias)}` },
        { label: 'IPW', value: value(metrics.ipw), detail: `bias ${bias(metrics.ipwBias)}` },
        { label: 'AIPW', value: value(metrics.aipw), detail: `bias ${bias(metrics.aipwBias)}` },
      ]} />

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Risk group</th><th className="py-2 pr-3">True e(x)</th><th className="py-2 pr-3">Modeled e(x)</th><th className="py-2 pr-3">True effect</th><th className="py-2">Outcome-model effect</th></tr></thead>
          <tbody>
            {Object.entries(lab.strata).map(([id, stratum]) => (
              <tr key={id} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">{id === 'high' ? 'High risk' : 'Low risk'}</td>
                <td className="py-2 pr-3 tabular-nums">{stratum.propensity.toFixed(2)}</td>
                <td className="py-2 pr-3 tabular-nums">{stratum.eHat.toFixed(2)}</td>
                <td className="py-2 pr-3 tabular-nums">{value(stratum.trueEffect)}</td>
                <td className="py-2 tabular-nums">{value(stratum.outcomeRegressionEffect)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Formula lines={[
        'AIPW = outcome-model contrast + weighted residual correction',
        'm1(x) − m0(x) + T/e(x)·[Y − m1(x)] − (1−T)/(1−e(x))·[Y − m0(x)]',
        'consistent under the usual causal assumptions when the propensity model OR the outcome model is correct',
      ]} />

      <Note
        tone={metrics.doubleRobustCondition ? 'good' : 'danger'}
        label="Model audit"
        title={metrics.doubleRobustCondition ? 'At least one nuisance model is correct' : 'Both nuisance models are wrong'}
      >
        <p>
          Propensity model: {metrics.propensityCorrect ? 'correct' : 'misspecified'}. Outcome model: {metrics.outcomeCorrect ? 'correct' : 'misspecified'}. {metrics.doubleRobustCondition
            ? `AIPW stays on the oracle ATE here even though ${metrics.propensityCorrect && metrics.outcomeCorrect ? 'neither model is broken' : 'one model is broken'}.`
            : `AIPW bias is now ${bias(metrics.aipwBias)}. “Doubly robust” means one correct nuisance model is enough; it does not mean two wrong models cancel each other.`}
        </p>
      </Note>

      <Note tone="accent" label="Important" title="Prediction accuracy is not the propensity-model objective">
        <p>A propensity model is useful because it creates balance for causal adjustment, not because it predicts treatment with the highest possible classification accuracy. Always inspect balance and overlap after fitting it.</p>
      </Note>
    </Plate>
  );
}
