import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Formula,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import { CONTROL_LIMITS, DEFAULT_SCENARIO, SCENARIO_PRESETS } from './conditionalConfig.js';
import { buildConditionalLab } from './conditionalModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const count = (value) => value.toFixed(value % 1 === 0 ? 0 : 1);

export default function ConditionalProbabilityAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildConditionalLab(scenario), [scenario]);
  const m = lab.metrics;
  const c = lab.counts;
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Joint-table workbench"
        title="Conditional Probability"
        note="Conditioning changes the reference population. One 2×2 joint table is enough to derive marginals, both conditional directions, independence, the law of total probability, and Bayes' rule."
      >
        <NoteRow>
          <Note label="Direction" title="P(A|B) is not P(B|A)"><p>The denominator changes. Reversing the bar changes which population you condition on.</p></Note>
          <Note label="Independence" title="Conditioning should change nothing"><p>If A and B are independent, P(A|B) = P(A|¬B) = P(A).</p></Note>
          <Note label="Base rate" title="Rare conditions stay rare"><p>A strong P(A|B) can coexist with a modest P(B|A) when B is uncommon.</p></Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Construct the joint population"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <Slider label="P(B)" value={scenario.conditionRate} {...CONTROL_LIMITS.conditionRate} format={pct} help="How common the conditioning event B is." onChange={(value) => update('conditionRate', value)} />
        <Slider label="P(A | B)" value={scenario.eventGivenCondition} {...CONTROL_LIMITS.eventGivenCondition} format={pct} help="Event-A rate inside the B subgroup." onChange={(value) => update('eventGivenCondition', value)} />
        <Slider label="P(A | ¬B)" value={scenario.eventGivenNotCondition} {...CONTROL_LIMITS.eventGivenNotCondition} format={pct} help="Event-A rate outside the B subgroup." onChange={(value) => update('eventGivenNotCondition', value)} />
        <Slider label="Reference population" value={scenario.population} {...CONTROL_LIMITS.population} format={(value) => value.toLocaleString()} help="Used only to turn probabilities into natural-frequency counts." onChange={(value) => update('population', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2">
        {SCENARIO_PRESETS.map((preset) => <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>)}
      </div>

      <Plate label="1 · Joint table" title="Everything comes from four cells">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-4" /><th className="py-2 pr-4">B</th><th className="py-2 pr-4">¬B</th><th className="py-2">Total</th></tr></thead>
            <tbody>
              <tr className="border-b border-slate-200"><th className="py-3 pr-4 text-left">A</th><td className="py-3 pr-4 font-mono">{count(c.both)}</td><td className="py-3 pr-4 font-mono">{count(c.eventOnly)}</td><td className="py-3 font-mono">{count(c.eventTotal)}</td></tr>
              <tr className="border-b border-slate-200"><th className="py-3 pr-4 text-left">¬A</th><td className="py-3 pr-4 font-mono">{count(c.conditionOnly)}</td><td className="py-3 pr-4 font-mono">{count(c.neither)}</td><td className="py-3 font-mono">{count(scenario.population - c.eventTotal)}</td></tr>
              <tr><th className="py-3 pr-4 text-left">Total</th><td className="py-3 pr-4 font-mono">{count(c.conditionTotal)}</td><td className="py-3 pr-4 font-mono">{count(scenario.population - c.conditionTotal)}</td><td className="py-3 font-mono">{scenario.population.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">Counts are expected frequencies implied by the exact probabilities, which keeps every identity internally consistent.</p>
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Read both directions" title="Changing the denominator changes the question">
          <Readouts columns={4} items={[
            { label: 'P(A)', value: pct(m.eventRate), detail: 'Marginal event rate' },
            { label: 'P(B)', value: pct(m.conditionRate), detail: 'Condition prevalence' },
            { label: 'P(A | B)', value: pct(m.eventGivenCondition), detail: 'Within B' },
            { label: 'P(B | A)', value: pct(m.conditionGivenEvent), detail: 'Within A' },
          ]} />
          <Formula lines={[
            'P(A | B) = P(A ∩ B) / P(B)',
            'P(B | A) = P(A ∩ B) / P(A)',
            `direction gap = ${pct(Math.abs(lab.directionAsymmetry))}`,
          ]} />
        </Plate>

        <Plate label="3 · Independence diagnostic" title="Does conditioning change the event rate?">
          <div className="nb-bar-stack">
            <BarTrack label="P(A | B)" value={pct(m.eventGivenCondition)} width={m.eventGivenCondition * 100} tone="accent" />
            <BarTrack label="P(A | ¬B)" value={pct(m.eventGivenNotCondition)} width={m.eventGivenNotCondition * 100} tone="good" />
            <BarTrack label="Marginal P(A)" value={pct(m.eventRate)} width={m.eventRate * 100} tone="neutral" />
          </div>
          <Readouts columns={2} items={[
            { label: 'Conditional gap', value: pct(Math.abs(m.conditionalGap)), detail: m.independent ? 'Exactly independent' : 'Conditioning changes the rate' },
            { label: 'Joint − product', value: m.independenceGap.toFixed(4), detail: '0 under independence' },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Total probability and Bayes" title="The same table supports both identities">
        <Readouts columns={3} items={[
          { label: 'P(A) direct', value: pct(m.eventRate), detail: 'Sum the A row' },
          { label: 'P(A) via total probability', value: pct(m.totalProbabilityReconstruction), detail: 'Mix subgroup rates by subgroup prevalence' },
          { label: 'P(B|A) via Bayes', value: pct(m.bayesReconstruction), detail: `Direct table: ${pct(m.conditionGivenEvent)}` },
        ]} />
        <Formula lines={[
          'P(A) = P(A|B)P(B) + P(A|¬B)P(¬B)',
          'P(B|A) = P(A|B)P(B) / P(A)',
        ]} />
        <Steps items={[
          { title: 'Check direction before calculating', pass: Math.abs(lab.directionAsymmetry) < 1e-12, body: Math.abs(lab.directionAsymmetry) < 1e-12 ? 'The two directions happen to match in this setting.' : `Here P(A|B) and P(B|A) differ by ${pct(Math.abs(lab.directionAsymmetry))}.` },
          { title: 'Test independence with conditional rates', pass: m.independent, body: m.independent ? 'Conditioning on B does not change A.' : `Association is visible because the subgroup rates differ by ${pct(Math.abs(m.conditionalGap))}.` },
          { title: 'Respect the base rate', pass: scenario.conditionRate >= 0.2, body: scenario.conditionRate < 0.2 ? `B is only ${pct(scenario.conditionRate)} of the population, so even strong P(A|B) may not make B common among A cases.` : 'B is not especially rare in this setting.' },
        ]} />
      </Plate>

      <Note tone="accent" label="Takeaway" title="Conditioning is a denominator operation">
        <p>Write down the joint table before memorizing formulas. Once the four cells are clear, conditional direction, independence, total probability, and Bayes updates become accounting identities instead of magic.</p>
      </Note>

      <AssessmentPanel lessonId="conditional-probability" title="Conditional probability check" />
    </div>
  );
}
