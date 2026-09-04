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
  HARDWARE_PROFILES,
  KV_FORMATS,
  MODEL,
  SCENARIO_PRESETS,
  WEIGHT_FORMATS,
} from './inferenceConfig.js';
import { buildInferenceLab } from './inferenceModel.js';

function number(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

function formatContext(value) {
  return value >= 1024 ? `${(value / 1024).toFixed(value % 1024 === 0 ? 0 : 1)}k` : String(value);
}

export default function EfficientInferenceCompressionTrackAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildInferenceLab(scenario), [scenario]);
  const estimate = lab.selected;
  const memoryPercent = Math.min(100, (estimate.totalGiB / estimate.hardware.vramGiB) * 100);

  const updateScenario = (key, value) => {
    setScenario((current) => ({ ...current, [key]: value }));
  };

  const applyPreset = (values) => {
    setScenario((current) => ({ ...current, ...values }));
  };

  return (
    <div className="nb-lesson">
      <Plate
        label="Serving workbench"
        title="Efficient Inference & Compression"
        note="Turn inference optimization into a resource-accounting problem: calculate weight memory, KV-cache growth, VRAM fit, bandwidth or compute bottlenecks, aggregate throughput, per-request decode speed, and time to first token."
      >
        <NoteRow>
          <Note label="Memory" title="Weights are only the start">
            <p>Resident memory includes model weights, KV cache for every active sequence, and serving workspace.</p>
          </Note>
          <Note label="Latency" title="TTFT and decode are different">
            <p>Long prompts stress prefill and time to first token. Decode speed is often limited by repeatedly reading model weights.</p>
          </Note>
          <Note label="Throughput" title="Batching changes the objective">
            <p>Higher batch can raise aggregate tokens per second while leaving each individual request slower or unchanged.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Configure the serving problem"
        actions={(
          <button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>
            Reset
          </button>
        )}
      >
        <Slider
          label="Context length"
          value={scenario.context}
          {...CONTROL_LIMITS.context}
          format={formatContext}
          help="Prompt tokens retained in the KV cache for every active request."
          onChange={(value) => updateScenario('context', value)}
        />
        <Slider
          label="Concurrent batch"
          value={scenario.batch}
          {...CONTROL_LIMITS.batch}
          format={(value) => String(value)}
          help="Sequences decoded together. Batch improves reuse of weights but multiplies KV memory."
          onChange={(value) => updateScenario('batch', value)}
        />
        <Slider
          label="Speculative acceptance"
          value={scenario.speculativeAcceptance}
          {...CONTROL_LIMITS.speculativeAcceptance}
          format={(value) => `${value}%`}
          help="Illustrative acceptance rate for a speculative-decoding speedup multiplier."
          onChange={(value) => updateScenario('speculativeAcceptance', value)}
        />
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="Inference scenario presets">
        {SCENARIO_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>
            {preset.label}
          </button>
        ))}
      </div>

      <Plate label="1 · Choose the serving stack" title={`${MODEL.name} · weights and KV precision`}>
        <div className="grid lg:grid-cols-3 gap-5">
          <div>
            <span className="nb-label">Hardware profile</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {HARDWARE_PROFILES.map((hardware) => (
                <button
                  key={hardware.id}
                  type="button"
                  className={`ds-btn ${scenario.hardwareId === hardware.id ? 'primary' : ''}`}
                  aria-pressed={scenario.hardwareId === hardware.id}
                  onClick={() => updateScenario('hardwareId', hardware.id)}
                >
                  {hardware.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="nb-label">Weight format</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {WEIGHT_FORMATS.map((format) => (
                <button
                  key={format.bits}
                  type="button"
                  className={`ds-btn ${scenario.weightBits === format.bits ? 'primary' : ''}`}
                  aria-pressed={scenario.weightBits === format.bits}
                  onClick={() => updateScenario('weightBits', format.bits)}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="nb-label">KV-cache format</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {KV_FORMATS.map((bits) => (
                <button
                  key={bits}
                  type="button"
                  className={`ds-btn ${scenario.kvBits === bits ? 'primary' : ''}`}
                  aria-pressed={scenario.kvBits === bits}
                  onClick={() => updateScenario('kvBits', bits)}
                >
                  {bits}-bit KV
                </button>
              ))}
            </div>
          </div>
        </div>
      </Plate>

      <Plate label="2 · Account for memory" title={estimate.fits ? 'Configuration fits in VRAM' : 'Configuration does not fit in VRAM'}>
        <Readouts
          columns={5}
          items={[
            { label: 'Weights', value: `${number(estimate.weightsGiB, 2)} GiB`, detail: `${scenario.weightBits}-bit` },
            { label: 'KV cache', value: `${number(estimate.kvGiB, 2)} GiB`, detail: `${scenario.batch} × ${formatContext(scenario.context)}` },
            { label: 'Workspace', value: `${number(estimate.workspaceGiB, 2)} GiB`, detail: 'Teaching allowance' },
            { label: 'Resident total', value: `${number(estimate.totalGiB, 2)} GiB`, detail: `${number(memoryPercent, 0)}% of VRAM` },
            { label: 'VRAM margin', value: `${estimate.fitMarginGiB >= 0 ? '+' : ''}${number(estimate.fitMarginGiB, 2)} GiB`, detail: estimate.fits ? 'Fits' : 'OOM' },
          ]}
        />
        <div className="nb-bar-stack mt-5">
          <BarTrack
            label="Resident memory / available VRAM"
            value={`${number(estimate.totalGiB, 2)} / ${estimate.hardware.vramGiB} GiB`}
            width={memoryPercent}
            tone={estimate.fits ? memoryPercent < 85 ? 'good' : 'warn' : 'bad'}
          />
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="3 · Read serving behavior" title="Latency and throughput are separate objectives">
          <Readouts
            columns={2}
            items={[
              { label: 'Aggregate throughput', value: `${number(estimate.aggregateTokensPerSecond, 0)} tok/s`, detail: `Batch ${scenario.batch}` },
              { label: 'Per-request decode', value: `${number(estimate.perRequestTokensPerSecond, 0)} tok/s`, detail: `${number(estimate.decodeMsPerToken, 1)} ms/token` },
              { label: 'Time to first token', value: `${number(estimate.ttftMs, 0)} ms`, detail: `${formatContext(scenario.context)} prompt` },
              { label: 'Current bottleneck', value: estimate.fits ? estimate.bottleneck : 'VRAM', detail: estimate.fits ? `${number(estimate.speculativeMultiplier, 2)}× speculative factor` : 'No serving capacity' },
            ]}
          />
        </Plate>

        <Plate label="4 · Shipping checklist" title="Is the serving configuration sensible?">
          <Steps
            items={[
              {
                title: 'Fit memory before optimizing speed',
                pass: estimate.fits,
                body: estimate.fits
                  ? `Resident memory is ${number(estimate.totalGiB, 2)} GiB on ${estimate.hardware.vramGiB} GiB of VRAM.`
                  : `Resident memory exceeds VRAM by ${number(Math.abs(estimate.fitMarginGiB), 2)} GiB. Throughput estimates are meaningless until it fits.`,
              },
              {
                title: 'Know which latency you are optimizing',
                pass: estimate.fits && estimate.ttftMs < 3000,
                body: estimate.fits
                  ? `TTFT is ${number(estimate.ttftMs, 0)} ms while decode is ${number(estimate.decodeMsPerToken, 1)} ms/token in this teaching model.`
                  : 'The configuration cannot serve, so latency targets cannot be evaluated.',
              },
              {
                title: 'Re-evaluate compressed variants',
                pass: scenario.weightBits >= 8,
                body: scenario.weightBits >= 8
                  ? 'Compression is moderate. Still run task, safety, and regression evals before deployment.'
                  : 'INT4 changes numeric behavior and kernel assumptions. Memory savings do not prove application quality is preserved.',
              },
            ]}
          />
        </Plate>
      </div>

      <Plate label="5 · Compare compression formats" title="Same workload, different weight memory">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Weights</th>
                <th className="py-2 pr-4">Resident memory</th>
                <th className="py-2 pr-4">VRAM fit</th>
                <th className="py-2 pr-4">Aggregate tok/s</th>
                <th className="py-2 pr-4">Per-request tok/s</th>
                <th className="py-2">Bottleneck</th>
              </tr>
            </thead>
            <tbody>
              {lab.formats.map((format) => (
                <tr key={format.bits} className={`border-b border-slate-200 ${format.bits === scenario.weightBits ? 'font-semibold' : ''}`}>
                  <td className="py-3 pr-4">{format.label}{format.bits === scenario.weightBits ? ' ← selected' : ''}</td>
                  <td className="py-3 pr-4 tabular-nums">{number(format.estimate.totalGiB, 2)} GiB</td>
                  <td className="py-3 pr-4">{format.estimate.fits ? 'fits' : 'OOM'}</td>
                  <td className="py-3 pr-4 tabular-nums">{number(format.estimate.aggregateTokensPerSecond, 0)}</td>
                  <td className="py-3 pr-4 tabular-nums">{number(format.estimate.perRequestTokensPerSecond, 0)}</td>
                  <td className="py-3">{format.estimate.fits ? format.estimate.bottleneck : 'VRAM'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Plate>

      <Plate label="6 · Find the Pareto edge" title="Configurations not dominated on memory and throughput">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-3">
          {lab.pareto.map((candidate) => (
            <div key={candidate.id} className="border-t border-slate-200 pt-3 text-sm">
              <strong>{candidate.label}</strong>
              <p className="text-slate-600 mt-1">
                {number(candidate.estimate.totalGiB, 2)} GiB · {number(candidate.estimate.aggregateTokensPerSecond, 0)} aggregate tok/s · {number(candidate.estimate.perRequestTokensPerSecond, 0)} tok/s per request
              </p>
            </div>
          ))}
        </div>
      </Plate>

      <Note tone="warn" label="Model boundary" title="This is a roofline-style teaching model, not a hardware benchmark">
        <p>
          The calculator uses explicit architecture and hardware assumptions to expose relationships between precision, KV cache, batch, bandwidth, compute, and prompt length. Real kernels, schedulers, quantization schemes, model architectures, and hardware can move every latency and throughput number. Use the relationships to reason; benchmark the actual stack before making capacity promises.
        </p>
      </Note>

      <Note tone="accent" label="Takeaway" title="Optimization starts with accounting">
        <p>
          Compute weight memory, KV growth, and VRAM fit first. Then separate TTFT from decode latency, distinguish aggregate throughput from per-request speed, identify the bottleneck, and compare compressed variants with real quality and safety evals. The fastest configuration that fails memory or quality is not an optimization.
        </p>
      </Note>

      <AssessmentPanel lessonId="efficient-inference-compression-track" title="Efficient inference check" />
    </div>
  );
}
