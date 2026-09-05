import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
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

const points = (value) => Number.isFinite(value) ? `${value >= 0 ? '+' : ''}${value.toFixed(1)} pts` : '—';
const outcome = (value) => Number.isFinite(value) ? value.toFixed(1) : '—';
const pct = (value) => `${value.toFixed(0)}%`;

function intervalText(interval) {
  return `${points(interval[0])} to ${points(interval[1])}`;
}

function ForestPlot({ metrics }) {
  const groups = [
    {
      label: 'Responsive',
      estimate: metrics.estimatedHighCate,
      standard: metrics.highConfidenceInterval,
      adjusted: metrics.highAdjustedInterval,
    },
    {
      label: 'Other',
      estimate: metrics.estimatedLowCate,
      standard: metrics.lowConfidenceInterval,
      adjusted: metrics.lowAdjustedInterval,
    },
  ];
  const values = groups.flatMap((group) => [group.adjusted[0], group.adjusted[1], group.estimate, 0]);
  const min = Math.floor(Math.min(...values) - 2);
  const max = Math.ceil(Math.max(...values) + 2);
  const x = (value) => 120 + ((value - min) / Math.max(1, max - min)) * 430;

  return (
    <figure className="mt-5 overflow-x-auto" aria-label="Subgroup treatment effect confidence intervals">
      <svg viewBox="0 0 590 170" className="min-w-[560px] w-full rounded-xl bg-slate-50">
        <line x1={x(0)} x2={x(0)} y1="18" y2="138" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth="2" />
        {groups.map((group, index) => {
          const y = 55 + index * 62;
          return (
            <g key={group.label}>
              <text x="12" y={y + 5} fontSize="12" fontWeight="800" fill="#334155">{group.label}</text>
              <line x1={x(group.adjusted[0])} x2={x(group.adjusted[1])} y1={y} y2={y} stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <line x1={x(group.standard[0])} x2={x(group.standard[1])} y1={y} y2={y} stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
              <circle cx={x(group.estimate)} cy={y} r="6" fill="#0f172a" />
            </g>
          );
        })}
        <text x={x(min)} y="158" textAnchor="middle" fontSize="10" fill="#64748b">{min}</text>
        <text x={x(0)} y="158" textAnchor="middle" fontSize="10" fill="#64748b">0</text>
        <text x={x(max)} y="158" textAnchor="middle" fontSize="10" fill="#64748b">{max}</text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
        <span><b className="text-teal-700">Thin interval</b> — ordinary 95% CI</span>
        <span><b className="text-slate-600">Thick interval</b> — Bonferroni family-wise interval across {metrics.subgroupSearchCount} searched subgroups</span>
        <span><b className="text-slate-900">Dot</b> — estimated CATE</span>
      </figcaption>
    </figure>
  );
}

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
        note="A causal effect compares Y(1) with Y(0) for the same unit. Randomization identifies population effects, but subgroup targeting adds uncertainty and a multiple-testing problem when many segments are inspected."
      >
        <NoteRow>
          <Note label="Fundamental problem" title="One factual outcome">
            <p>After assignment we observe Y(1) for treated units or Y(0) for controls. The other potential outcome is the counterfactual.</p>
          </Note>
          <Note label="Uncertainty" title="CATE is an estimate too">
            <p>A large subgroup point estimate can still be too uncertain to justify targeting, especially for a small stratum.</p>
          </Note>
          <Note label="Multiplicity" title="Searching many groups widens evidence thresholds">
            <p>If you inspect enough segments, some will look extreme by chance. Family-wise intervals make that search cost visible.</p>
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
        <Slider label="Subgroups inspected" value={scenario.subgroupSearchCount} {...CONTROL_LIMITS.subgroupSearchCount} format={(value) => value.toLocaleString()} help="How many subgroup hypotheses the analyst searched. More searches require a stricter multiplicity-adjusted threshold." onChange={(value) => update('subgroupSearchCount', value)} />
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
          { label: '95% interval', value: intervalText(ci), detail: `SE ${lab.metrics.standardError.toFixed(2)}` },
          { label: 'Estimation error', value: points(lab.metrics.estimatedAte - lab.metrics.trueAte), detail: 'Finite-sample randomization noise' },
        ]} />
        <Formula lines={[
          'individual effect = Y(1) − Y(0)',
          'ATE = E[Y(1) − Y(0)]',
          'randomized estimator = mean(Y observed | T=1) − mean(Y observed | T=0)',
        ]} />
      </Plate>

      <Plate label="2 · Conditional effects" title="Point estimates are not enough for targeting">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm border-collapse">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-4">Segment</th><th className="py-2 pr-4">Oracle CATE</th><th className="py-2 pr-4">Estimate</th><th className="py-2 pr-4">95% CI</th><th className="py-2">Multiplicity-adjusted CI</th></tr></thead>
            <tbody>
              <tr className="border-b border-slate-200"><td className="py-3 pr-4 font-semibold">Responsive</td><td className="py-3 pr-4">{points(lab.metrics.trueHighCate)}</td><td className="py-3 pr-4">{points(lab.metrics.estimatedHighCate)}</td><td className="py-3 pr-4">{intervalText(lab.metrics.highConfidenceInterval)}</td><td className="py-3">{intervalText(lab.metrics.highAdjustedInterval)}</td></tr>
              <tr className="border-b border-slate-200"><td className="py-3 pr-4 font-semibold">Other</td><td className="py-3 pr-4">{points(lab.metrics.trueLowCate)}</td><td className="py-3 pr-4">{points(lab.metrics.estimatedLowCate)}</td><td className="py-3 pr-4">{intervalText(lab.metrics.lowConfidenceInterval)}</td><td className="py-3">{intervalText(lab.metrics.lowAdjustedInterval)}</td></tr>
            </tbody>
          </table>
        </div>
        <ForestPlot metrics={lab.metrics} />
        <div className="mt-5">
          <Readouts columns={3} items={[
            { label: 'Estimated CATE difference', value: points(lab.metrics.interactionEstimate), detail: `95% CI ${intervalText(lab.metrics.interactionInterval)}` },
            { label: 'Interaction evidence', value: lab.metrics.interactionSignificant ? 'Detected' : 'Uncertain', detail: 'Tests whether segment effects differ, not whether either subgroup is individually significant' },
            { label: 'Adjusted critical z', value: lab.metrics.adjustedCriticalValue.toFixed(2), detail: `${scenario.subgroupSearchCount} subgroup hypotheses searched` },
          ]} />
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="3 · Policy value" title="Targeting rules should acknowledge uncertainty">
          <Readouts columns={3} items={[
            { label: 'Treat everybody', value: outcome(lab.metrics.treatAllValue), detail: `${points(lab.metrics.treatAllValue - lab.metrics.treatNoneValue)} vs none` },
            { label: 'Point-estimate policy', value: outcome(lab.metrics.pointEstimatePolicyValue), detail: 'Treat a segment whenever estimated CATE > 0' },
            { label: 'Evidence-aware policy', value: outcome(lab.metrics.evidenceAwarePolicyValue), detail: 'Treat only when the multiplicity-adjusted lower bound is > 0' },
          ]} />
          <p className="nb-plate-note mt-4">Oracle group-optimal value is {outcome(lab.metrics.targetedValue)}. It is shown only because the simulation knows both potential outcomes; a real deployment does not get this oracle.</p>
        </Plate>

        <Plate label="4 · Decision audit" title="Separate heterogeneity, significance, and policy">
          <Steps items={[
            { title: 'Estimate the population effect', pass: ci[0] <= lab.metrics.trueAte && ci[1] >= lab.metrics.trueAte, body: ci[0] <= lab.metrics.trueAte && ci[1] >= lab.metrics.trueAte ? 'This realized 95% interval contains the synthetic population ATE.' : 'This realized interval misses the population ATE; 95% coverage is a repeated-sampling property.' },
            { title: 'Test heterogeneity directly', pass: lab.metrics.interactionSignificant, body: lab.metrics.interactionSignificant ? 'The difference between the two subgroup effects excludes zero at the ordinary 95% level.' : 'The subgroup point estimates differ, but the interaction interval still includes zero.' },
            { title: 'Pay for subgroup search', pass: lab.metrics.highSignificantAdjusted || lab.metrics.lowSignificantAdjusted, body: `Bonferroni uses z=${lab.metrics.adjustedCriticalValue.toFixed(2)} after searching ${scenario.subgroupSearchCount} subgroup hypotheses. Wider intervals reduce chance discoveries.` },
          ]} />
        </Plate>
      </div>

      <Plate label="5 · Observe the missing counterfactual" title="Every row exposes only one branch">
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

      <Note tone="bad" label="Subgroup hunting trap" title="A compelling CATE can be a winner selected from noise">
        <p>Ordinary subgroup intervals answer one prespecified comparison at a time. When an analyst searched {scenario.subgroupSearchCount} segments and reports only the most exciting one, the family-wise false-positive risk is larger. Prespecification, multiplicity control, honest validation, or hierarchical shrinkage are safer than treating every discovered slice as causal truth.</p>
      </Note>

      <Note tone="accent" label="Takeaway" title="CATE uncertainty belongs in the targeting decision">
        <p>ATE answers whether treatment helps on average. CATE can support targeting only after you quantify subgroup uncertainty, test heterogeneity directly, account for how many segments were searched, and distinguish an estimated policy from an oracle one.</p>
      </Note>

      <AssessmentPanel lessonId="treatment-effects" title="Treatment effects check" />
    </div>
  );
}
