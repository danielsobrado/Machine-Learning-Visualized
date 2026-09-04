import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import {
  CONTROL_LIMITS,
  DEFAULT_SCENARIO,
  DEFENSE_PROFILES,
  LAYERS,
} from './securityConfig.js';
import { buildSecurityLab } from './securityModel.js';

const pct = (value) => `${(value * 100).toFixed(0)}%`;

export default function MlSecurityRobustnessTrackAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildSecurityLab(scenario), [scenario]);

  const updateScenario = (key, value) => {
    setScenario((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="nb-lesson">
      <Plate
        label="Defensive evaluation lab"
        title="ML Security & Robustness"
        note="Treat security as a system test, not a confidence slider. Run a fixed synthetic attack suite through different defense architectures, count what escapes, and measure the utility cost on benign requests."
      >
        <NoteRow>
          <Note label="Threat model" title="Different paths, different controls">
            <p>Instruction override, poisoned retrieval, unsafe tool requests, and sensitive-data extraction fail through different surfaces.</p>
          </Note>
          <Note label="Metric" title="Attack success rate">
            <p>ASR is escaped attack cases divided by attempted attack cases in this synthetic suite. Lower is better.</p>
          </Note>
          <Note label="Tradeoff" title="Security can block good work">
            <p>A policy that blocks everything has low ASR and terrible utility. Benign pass rate must be measured beside security.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Stress the system"
        actions={(
          <button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>
            Reset
          </button>
        )}
      >
        <Slider
          label="Attack pressure"
          value={scenario.attackPressure}
          {...CONTROL_LIMITS.attackPressure}
          format={(value) => `${value}%`}
          help="Scales the strength of the fixed adversarial test cases."
          onChange={(value) => updateScenario('attackPressure', value)}
        />
        <Slider
          label="Policy strictness"
          value={scenario.strictness}
          {...CONTROL_LIMITS.strictness}
          format={(value) => `${value}%`}
          help="Stronger enforcement reduces escapes but can increase false positives on benign work."
          onChange={(value) => updateScenario('strictness', value)}
        />
        <Slider
          label="Sensitive-data exposure"
          value={scenario.sensitiveData}
          {...CONTROL_LIMITS.sensitiveData}
          format={(value) => `${value}%`}
          help="Changes the consequence of privacy-oriented attacks, not whether an attack attempt exists."
          onChange={(value) => updateScenario('sensitiveData', value)}
        />
      </ControlBench>

      <Plate label="1 · Choose the architecture" title="A single gate is not defense in depth">
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Security defense profile">
          {DEFENSE_PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className={`ds-btn ${scenario.profileId === profile.id ? 'primary' : ''}`}
              aria-pressed={scenario.profileId === profile.id}
              onClick={() => updateScenario('profileId', profile.id)}
            >
              {profile.label}
            </button>
          ))}
        </div>

        <Readouts
          columns={5}
          items={[
            { label: 'Attack success rate', value: pct(lab.selected.metrics.attackSuccessRate), detail: `${lab.selected.metrics.attackSuccesses} / 12 escaped` },
            { label: 'Blocked attacks', value: pct(lab.selected.metrics.blockedAttackRate), detail: 'Synthetic suite' },
            { label: 'Benign pass rate', value: pct(lab.selected.metrics.benignPassRate), detail: `${lab.selected.metrics.benignBlocked} / 8 benign blocked` },
            { label: 'False-positive rate', value: pct(lab.selected.metrics.falsePositiveRate), detail: 'Utility cost' },
            { label: 'Sensitive exposure', value: pct(lab.selected.metrics.sensitiveExposureRate), detail: 'Weighted privacy escapes' },
          ]}
        />

        <div className="overflow-x-auto mt-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Defense</th>
                <th className="py-2 pr-4">Layers</th>
                <th className="py-2 pr-4">ASR</th>
                <th className="py-2 pr-4">Benign pass</th>
                <th className="py-2">Sensitive exposure</th>
              </tr>
            </thead>
            <tbody>
              {lab.comparisons.map((evaluation) => (
                <tr key={evaluation.profile.id} className={`border-b border-slate-200 ${evaluation.profile.id === scenario.profileId ? 'font-semibold' : ''}`}>
                  <td className="py-3 pr-4">{evaluation.profile.label}{evaluation.profile.id === scenario.profileId ? ' ← selected' : ''}</td>
                  <td className="py-3 pr-4 tabular-nums">{evaluation.profile.layers.length}</td>
                  <td className="py-3 pr-4 tabular-nums">{pct(evaluation.metrics.attackSuccessRate)}</td>
                  <td className="py-3 pr-4 tabular-nums">{pct(evaluation.metrics.benignPassRate)}</td>
                  <td className="py-3 tabular-nums">{pct(evaluation.metrics.sensitiveExposureRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Break down the attack suite" title="Which surface is still escaping?">
          <div className="nb-bar-stack">
            {lab.families.map((family) => (
              <BarTrack
                key={family.family}
                label={family.family}
                value={`${family.successes} / ${family.attempts} escaped`}
                width={family.successRate * 100}
                tone={family.successRate === 0 ? 'good' : family.successRate <= 0.34 ? 'warn' : 'bad'}
              />
            ))}
          </div>
          <p className="nb-plate-note mt-4">
            The cases are intentionally high-level and synthetic. This lab teaches defensive evaluation architecture; it is not a real product security benchmark.
          </p>
        </Plate>

        <Plate label="3 · Release checklist" title="Would this control stack ship?">
          <Steps
            items={[
              {
                title: 'Measure attack success, not guardrail presence',
                pass: lab.selected.metrics.attackSuccessRate <= 0.1,
                body: lab.selected.metrics.attackSuccessRate <= 0.1
                  ? `ASR is ${pct(lab.selected.metrics.attackSuccessRate)} on the current suite.`
                  : `ASR is ${pct(lab.selected.metrics.attackSuccessRate)}. Too many adversarial cases still escape.`,
              },
              {
                title: 'Keep benign utility visible',
                pass: lab.selected.metrics.benignPassRate >= 0.85,
                body: lab.selected.metrics.benignPassRate >= 0.85
                  ? `Benign pass rate remains ${pct(lab.selected.metrics.benignPassRate)}.`
                  : `Benign pass rate fell to ${pct(lab.selected.metrics.benignPassRate)}. Security is damaging normal workflows.`,
              },
              {
                title: 'Match controls to attack surfaces',
                pass: scenario.profileId === 'defense-in-depth',
                body: scenario.profileId === 'defense-in-depth'
                  ? 'Input, retrieval, tool, and output controls are all represented.'
                  : 'One control cannot substitute for isolation, least privilege, and output privacy checks on other surfaces.',
              },
            ]}
          />
        </Plate>
      </div>

      <Plate label="4 · Remove one layer" title="Defense-in-depth ablation">
        <div className="nb-bar-stack">
          {lab.ablations.map((ablation) => (
            <BarTrack
              key={ablation.layer.id}
              label={`Remove ${ablation.layer.label}`}
              value={`${pct(ablation.attackSuccessRate)} ASR · +${pct(ablation.delta)}`}
              width={ablation.attackSuccessRate * 100}
              tone={ablation.delta > 0 ? 'bad' : 'good'}
            />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mt-5 text-sm">
          {LAYERS.map((layer) => (
            <div key={layer.id} className="border-t border-slate-200 pt-3">
              <strong>{layer.label}</strong>
              <p className="text-slate-600 mt-1">{layer.detail}</p>
            </div>
          ))}
        </div>
      </Plate>

      <Note tone="warn" label="Failure mode" title="A low ASR can still be a bad product">
        <p>
          Raise policy strictness toward 100%. The defensive suite becomes harder to bypass, but the benign pass rate eventually falls. Security evaluation is multi-objective: attack resistance, privacy exposure, and normal-task utility all belong in the release gate.
        </p>
      </Note>

      <Note tone="accent" label="Takeaway" title="Secure the whole execution path">
        <p>
          Threat-model input, retrieval, tools, and output separately. Run adversarial test suites, report attack success rate beside benign pass rate, ablate defense layers to find single points of failure, and treat sensitive-data exposure as its own release metric.
        </p>
      </Note>

      <AssessmentPanel lessonId="ml-security-robustness-track" title="ML security check" />
    </div>
  );
}
