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
import { CONTROL_LIMITS, DEFAULT_SCENARIO, SCENARIO_PRESETS } from './treatmentEffectsConfig.js';
import { buildTreatmentEffectsLab } from './treatmentEffectsModel.js';

const points = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts`;
const outcome = (value) => value.toFixed(1);
const pct = (value) => `${value.toFixed(0)}%`;

export default function TreatmentEffectsAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildTreatmentEffectsLab(scenario), [scenario]);
  const ci = lab.metrics.confidenceInterval;
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const rerandomize = () => update('assignmentSeed', scenario.assignmentSeed + 1);

  return (
    <div className="nb-lesson">
      <Plate
        label="Potential-outcomes workbench"
        title="Treatment Effects"
        note="A causal effect compares Y(1) with Y(0) for the same unit. Real experiments reveal only one of those outcomes, so population effects must be estimated from comparable groups rather than read directly from individuals."
      >
        <NoteRow>
          <Note label="Fundamental problem" title="One factual outcome">
            <p>After assignment we observe Y(1) for treated units or Y(0) for controls. The other potential outcome is the counterfactual.</p>
          </Note>
          <Note label="Estimand" title="ATE is a population question">
            <p>ATE averages individual causal effects. CATE asks whether that average changes across a pre-treatment segment.</p>
          </Note>
          <Note label="Decision" title="Heterogeneity can change rollout">
            <p>A positive ATE does not guarantee every segment benefits. A policy can outperform treat-all when a subgroup is harmed.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Generate a heterogeneous randomized experiment"
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" className="nb-reset" onClick={rerandomize}>Rerandomize</button>
            <button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>
          </div>
        )}
      >
        <Slider label="Population size" value={scenario.populationSize} {...CONTROL_LIMITS.populationSize} format={(value) => value.toLocaleString()} help="Larger randomized samples reduce estimator noise." onChange={(value) => update('populationSize', value)} />
        <Slider label="Responsive segment" value={scenario.responsiveShare} {...CONTROL_LIMITS.responsiveShare} format={pct} help="Share of the population belonging to the high-response stratum." onChange={(value) => update('responsiveShare', value)} />
        <Slider label="High-segment effect" value={scenario.highEffect} {...CONTROL_LIMITS.highEffect} format={points} help="Average causal effect configured for the responsive stratum." onChange={(value) => update('highEffect', value)} />
        <Slider label="Other-segment effect" value={scenario.lowEffect} {...CONTROL_LIMITS.lowEffect} format={points} help="Average causal effect configured for everyone else." onChange={(value) => update('lowEffect', value)} />
        <Slider label="Baseline segment gap" value={scenario.baselineGap} {...CONTROL_LIMITS.baselineGap} format={points} help="Pre-treatment outcome difference between the two strata. Randomization protects the ATE from this baseline gap." onChange={(value) => update('baselineGap', value)} />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Treatment effect presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <Plate label="1 · Population truth vs experiment estimate" title="The simulation knows both potential outcomes; the analyst does not">
        <Readouts columns={4} items={[
          { label: 'Oracle ATE', value: points(lab.metrics.trueAte), detail: 'Mean Y(1) − Y(0) in the full synthetic population' },
          { label: 'Estimated ATE', value: points(lab.metrics.estimatedAte), detail: `${lab.metrics.treatedCount} treated · ${lab.metrics.controlCount} control` },
          { label: '95% interval', value: `${points(ci[0])} to ${points(ci[1])}`, detail: `SE ${lab.metrics.standardError.toFixed(2)}` },
          { label: 'Estimation error', value: points(lab.metrics.estimatedAte - lab.metrics.trueAte), detail: 'Finite-sample randomization noise' },
        ]} />
        <Formula lines={[
          'individual effect = Y(1) − Y(0)',
          'ATE = E[Y(1) − Y(0)]',
          'randomized estimator = mean(Y observed | T=1) − mean(Y observed | T=0)',
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Conditional effects" title="The average can hide opposite responses">
          <Readouts columns={2} items={[
            { label: 'Responsive CATE', value: points(lab.metrics.trueHighCate), detail: `Experiment estimate ${points(lab.metrics.estimatedHighCate)}` },
            { label: 'Other CATE', value: points(lab.metrics.trueLowCate), detail: `Experiment estimate ${points(lab.metrics.estimatedLowCate)}` },
          ]} />
          <div className="nb-bar-stack mt-5">
            <BarTrack label="Responsive effect magnitude" value={points(lab.metrics.trueHighCate)} width={Math.min(100, Math.abs(lab.metrics.trueHighCate) * 4)} tone={lab.metrics.trueHighCate >= 0 ? 'good' : 'bad'} />
            <BarTrack label="Other effect magnitude" value={points(lab.metrics.trueLowCate)} width={Math.min(100, Math.abs(lab.metrics.trueLowCate) * 4)} tone={lab.metrics.trueLowCate >= 0 ? 'good' : 'bad'} />
            <BarTrack label="CATE spread" value={points(lab.metrics.heterogeneity)} width={Math.min(100, lab.metrics.heterogeneity * 3)} tone={lab.metrics.heterogeneity >= 10 ? 'warn' : 'accent'} />
          </div>
        </Plate>

        <Plate label="3 · Policy value" title="Estimate effects because decisions depend on them">
          <Readouts columns={3} items={[
            { label: 'Treat nobody', value: outcome(lab.metrics.treatNoneValue), detail: 'Mean Y(0)' },
            { label: 'Treat everybody', value: outcome(lab.metrics.treatAllValue), detail: `${points(lab.metrics.treatAllValue - lab.metrics.treatNoneValue)} vs none` },
            { label: 'Group-optimal policy', value: outcome(lab.metrics.targetedValue), detail: `${points(lab.metrics.targetingGainVsAll)} vs treat-all` },
          ]} />
          <Steps items={[
            { title: 'Randomize treatment', pass: true, body: 'Treatment assignment is independent of the potential outcomes in this workbench.' },
            { title: 'Estimate the population effect', pass: ci[0] <= lab.metrics.trueAte && ci[1] >= lab.metrics.trueAte, body: ci[0] <= lab.metrics.trueAte && ci[1] >= lab.metrics.trueAte ? 'This realized 95% interval contains the synthetic population ATE.' : 'This realized interval misses the population ATE; 95% coverage is a repeated-sampling property, not a guarantee for every experiment.' },
            { title: 'Inspect heterogeneity before targeting', pass: lab.metrics.heterogeneity < 5, body: lab.metrics.heterogeneity < 5 ? 'The strata respond similarly, so a segmented rollout adds little.' : 'The strata respond differently enough that one average rollout can hide a meaningful decision.' },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Observe the missing counterfactual" title="Every row exposes only one branch">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-3">Unit</th><th className="py-2 pr-3">Segment</th><th className="py-2 pr-3">Assigned</th><th className="py-2 pr-3">Observed Y</th><th className="py-2">Counterfactual</th></tr></thead>
            <tbody>{lab.sampleRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-200">
                <td className="py-2 pr-3 font-semibold">#{row.id}</td>
                <td className="py-2 pr-3">{row.responsive ? 'Responsive' : 'Other'}</td>
                <td className="py-2 pr-3">{row.treatment ? 'Treatment' : 'Control'}</td>
                <td className="py-2 pr-3 tabular-nums font-semibold">{outcome(row.observedOutcome)}</td>
                <td className="py-2 text-slate-500">hidden in real data ({row.treatment ? 'Y(0)' : 'Y(1)'})</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Plate>

      <Note tone="accent" label="Takeaway" title="Do not confuse the oracle with the estimator">
        <p>This teaching simulation can reveal both potential outcomes so you can verify the estimand. A real dataset cannot. Identification comes from design assumptions such as randomization; CATE estimation then adds another layer of statistical uncertainty.</p>
      </Note>

      <AssessmentPanel lessonId="treatment-effects" title="Treatment effects check" />
    </div>
  );
}
