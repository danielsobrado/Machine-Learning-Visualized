import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../_shared/notebook';
import { NON_COLLAPSIBILITY_DEFAULTS, NON_COLLAPSIBILITY_LIMITS } from './nonCollapsibilityConstants.js';
import { buildNonCollapsibilityLab } from './nonCollapsibilityModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const or = (value) => value.toFixed(2);

export default function NonCollapsibilityLab() {
  const [scenario, setScenario] = useState(NON_COLLAPSIBILITY_DEFAULTS);
  const lab = useMemo(() => buildNonCollapsibilityLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate label="5 · Odds-ratio trap" title="A changed adjusted OR does not automatically prove confounding">
      <ControlBench label="Randomized treatment · identical risk mix in both arms" actions={<button type="button" className="nb-reset" onClick={() => setScenario(NON_COLLAPSIBILITY_DEFAULTS)}>Reset</button>}>
        <Slider label="Low-risk baseline" value={scenario.lowBaseline} {...NON_COLLAPSIBILITY_LIMITS.lowBaseline} format={pct} onChange={(value) => update('lowBaseline', value)} />
        <Slider label="High-risk baseline" value={scenario.highBaseline} {...NON_COLLAPSIBILITY_LIMITS.highBaseline} format={pct} onChange={(value) => update('highBaseline', value)} />
        <Slider label="Common conditional odds ratio" value={scenario.commonOddsRatio} {...NON_COLLAPSIBILITY_LIMITS.commonOddsRatio} format={or} onChange={(value) => update('commonOddsRatio', value)} />
        <Slider label="High-risk population share" value={scenario.highRiskShare} {...NON_COLLAPSIBILITY_LIMITS.highRiskShare} format={pct} onChange={(value) => update('highRiskShare', value)} />
      </ControlBench>

      <Readouts columns={4} items={[
        { label: 'Crude / marginal OR', value: or(lab.metrics.marginalOddsRatio), detail: 'Collapse both risk strata first' },
        { label: 'Conditional OR', value: or(lab.metrics.conditionalOddsRatio), detail: 'Same OR inside both strata' },
        { label: 'High-risk share · treated', value: pct(lab.metrics.treatedHighRiskShare), detail: 'Randomized composition' },
        { label: 'High-risk share · control', value: pct(lab.metrics.controlHighRiskShare), detail: 'Exactly the same composition' },
      ]} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse text-sm">
          <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Risk stratum</th><th className="py-2 pr-3">Control risk</th><th className="py-2 pr-3">Treated risk</th><th className="py-2">Within-stratum OR</th></tr></thead>
          <tbody>
            <tr className="border-b border-slate-200"><td className="py-2 pr-3 font-semibold">Low risk</td><td className="py-2 pr-3 tabular-nums">{pct(lab.strata.low.controlRisk)}</td><td className="py-2 pr-3 tabular-nums">{pct(lab.strata.low.treatedRisk)}</td><td className="py-2 tabular-nums font-semibold">{or(lab.strata.low.oddsRatio)}</td></tr>
            <tr className="border-b border-slate-200"><td className="py-2 pr-3 font-semibold">High risk</td><td className="py-2 pr-3 tabular-nums">{pct(lab.strata.high.controlRisk)}</td><td className="py-2 pr-3 tabular-nums">{pct(lab.strata.high.treatedRisk)}</td><td className="py-2 tabular-nums font-semibold">{or(lab.strata.high.oddsRatio)}</td></tr>
          </tbody>
        </table>
      </div>

      <Formula lines={[
        'Treatment is randomized: P(risk | treated) = P(risk | control)',
        'Within each stratum: OR = common conditional OR',
        `Yet marginal OR = ${or(lab.metrics.marginalOddsRatio)} while conditional OR = ${or(lab.metrics.conditionalOddsRatio)}`,
      ]} />

      <Note tone="accent" label="Non-collapsibility" title="The odds ratio can move even with zero confounding">
        <p>When baseline outcome risk differs across strata, collapsing the strata changes the odds scale. That mathematical property is not confounding. Adjustment-set logic must come from the causal structure, not from whether an odds ratio changed after adjustment.</p>
      </Note>
    </Plate>
  );
}
