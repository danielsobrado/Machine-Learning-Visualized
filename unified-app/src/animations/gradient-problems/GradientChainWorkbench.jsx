import React, { useMemo } from 'react';
import { Activity, GitBranch, SlidersHorizontal, Zap } from 'lucide-react';
import {
  ACTIVATIONS,
  GRADIENT_PRESETS,
  GRADIENT_THRESHOLDS,
  VALUE_BOUNDS,
} from './gradientProblemsConstants.js';
import {
  buildGradientTrace,
  diagnoseGradient,
  logMagnitude,
} from './gradientProblemsModel.js';

function formatNumber(value) {
  if (value === 0) return '0';
  const magnitude = Math.abs(value);
  if (magnitude >= 1000 || magnitude < 0.001) return value.toExponential(2);
  return value.toFixed(4);
}

function RangeControl({ label, value, min, max, step, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="font-mono text-xs text-slate-500">{Number(value).toFixed(step >= 1 ? 0 : 2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-rose-700"
      />
    </label>
  );
}

function Metric({ label, value, helper, tone = 'slate' }) {
  const classes = {
    slate: 'border-slate-200 bg-white',
    amber: 'border-amber-200 bg-amber-50',
    rose: 'border-rose-200 bg-rose-50',
    emerald: 'border-emerald-200 bg-emerald-50',
  }[tone];
  return (
    <div className={`rounded-xl border p-4 ${classes}`}>
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function stateTone(state) {
  if (state === 'blocked') return 'bg-rose-100 text-rose-800';
  if (state === 'saturated') return 'bg-amber-100 text-amber-800';
  if (state === 'leaking') return 'bg-violet-100 text-violet-800';
  return 'bg-emerald-100 text-emerald-800';
}

function gradientTone(value) {
  const diagnosis = diagnoseGradient(value);
  if (diagnosis === 'vanishing') return 'bg-amber-500';
  if (diagnosis === 'exploding') return 'bg-rose-500';
  return 'bg-emerald-500';
}

function GradientBars({ layers }) {
  const backwardLayers = [...layers].reverse();
  const logs = backwardLayers.map((layer) => logMagnitude(layer.inputGradient));
  const maxLog = Math.max(0, ...logs);
  const range = Math.max(1, maxLog - GRADIENT_THRESHOLDS.logFloor);

  return (
    <div className="space-y-2">
      {backwardLayers.map((layer) => {
        const logValue = logMagnitude(layer.inputGradient);
        const width = 8 + (92 * ((logValue - GRADIENT_THRESHOLDS.logFloor) / range));
        return (
          <div key={layer.layer} className="grid grid-cols-[64px_1fr_92px] items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">L{layer.layer}</span>
            <div className="h-5 overflow-hidden rounded bg-slate-100">
              <div
                className={`h-full rounded ${gradientTone(layer.inputGradient)}`}
                style={{ width: `${Math.max(4, Math.min(100, width))}%` }}
              />
            </div>
            <span className="text-right font-mono text-slate-700">{formatNumber(layer.inputGradient)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function GradientChainWorkbench({ config, onConfigChange, onPreset }) {
  const trace = useMemo(() => buildGradientTrace(config), [config]);
  const plainTrace = useMemo(() => buildGradientTrace({ ...config, useResidual: false }), [config]);
  const residualTrace = useMemo(() => buildGradientTrace({ ...config, useResidual: true }), [config]);
  const diagnosis = diagnoseGradient(trace.inputGradient);
  const diagnosisTone = diagnosis === 'vanishing' ? 'amber' : diagnosis === 'exploding' ? 'rose' : 'emerald';
  const saturatedCount = trace.layers.filter((layer) => layer.activationState === 'saturated').length;
  const blockedCount = trace.layers.filter((layer) => layer.activationState === 'blocked').length;
  const maximumDerivative = Math.max(...trace.layers.map((layer) => Math.abs(layer.localDerivative)));

  const set = (key, value) => onConfigChange({ ...config, [key]: value });

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Exact scalar backprop workbench</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Make the failure happen inside the activation</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Every layer computes z=w·x+b, the chosen activation, its exact local slope, and then the backward derivative.
            The slope is an output of the experiment now—not a slider pretending to be one.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Diagnosis thresholds: vanish &lt; {GRADIENT_THRESHOLDS.vanishing.toExponential(0)}, explode &gt; {GRADIENT_THRESHOLDS.exploding.toExponential(0)}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[310px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 font-black text-slate-950"><SlidersHorizontal size={17} /> Experiment controls</div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Starting preset
            <select
              value={config.presetId}
              onChange={(event) => onPreset(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              {Object.entries(GRADIENT_PRESETS).map(([id, preset]) => <option key={id} value={id}>{preset.label}</option>)}
            </select>
          </label>
          <p className="mt-2 text-xs leading-5 text-slate-500">{GRADIENT_PRESETS[config.presetId]?.description}</p>

          <div className="mt-5 space-y-4">
            <RangeControl label="Depth" value={config.depth} min={VALUE_BOUNDS.minDepth} max={VALUE_BOUNDS.maxDepth} step={1} onChange={(value) => set('depth', value)} />
            <RangeControl label="Input x₀" value={config.input} min={-VALUE_BOUNDS.maxAbsoluteInput} max={VALUE_BOUNDS.maxAbsoluteInput} step={0.25} onChange={(value) => set('input', value)} />
            <RangeControl label="Weight value w · each layer" value={config.weight} min={-VALUE_BOUNDS.maxAbsoluteWeight} max={VALUE_BOUNDS.maxAbsoluteWeight} step={0.05} onChange={(value) => set('weight', value)} />
            <RangeControl label="Bias b" value={config.bias} min={-VALUE_BOUNDS.maxAbsoluteBias} max={VALUE_BOUNDS.maxAbsoluteBias} step={0.1} onChange={(value) => set('bias', value)} />
          </div>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Activation
            <select
              value={config.activationId}
              onChange={(event) => set('activationId', event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              {Object.entries(ACTIVATIONS).map(([id, activation]) => <option key={id} value={id}>{activation.label}</option>)}
            </select>
          </label>

          <button
            type="button"
            aria-pressed={config.useResidual}
            onClick={() => set('useResidual', !config.useResidual)}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-black ${config.useResidual ? 'border-cyan-300 bg-cyan-50 text-cyan-900' : 'border-slate-300 bg-white text-slate-700'}`}
          >
            <GitBranch size={16} /> {config.useResidual ? 'Residual block enabled' : 'Plain block'}
          </button>
          {config.useResidual && (
            <div className="mt-4">
              <RangeControl label="Residual branch scale α" value={config.residualScale} min={VALUE_BOUNDS.minResidualScale} max={VALUE_BOUNDS.maxResidualScale} step={0.05} onChange={(value) => set('residualScale', value)} />
            </div>
          )}
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="dL/dx₀" value={formatNumber(trace.inputGradient)} helper="Backward signal reaching the original input." tone={diagnosisTone} />
            <Metric label="Diagnosis" value={diagnosis} helper="A teaching classification based on input-gradient magnitude." tone={diagnosisTone} />
            <Metric label="Param grad norm" value={formatNumber(trace.parameterGradientNorm)} helper="L2 norm across all toy weight and bias gradients." />
            <Metric label="Max |block derivative|" value={formatNumber(maximumDerivative)} helper="Largest local backward multiplier in this run." />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 font-black text-slate-950"><Activity size={17} /> Backward signal across depth</h3>
                  <p className="mt-1 text-xs text-slate-500">Bar length uses log₁₀ magnitude so exponential change stays visible.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">output → input</span>
              </div>
              <GradientBars layers={trace.layers} />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-amber-800">Activation evidence</div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div><strong className="block text-2xl text-slate-950">{saturatedCount}</strong><span className="text-xs text-slate-600">saturated layers</span></div>
                  <div><strong className="block text-2xl text-slate-950">{blockedCount}</strong><span className="text-xs text-slate-600">blocked layers</span></div>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-xs leading-5 text-cyan-950">
                <strong className="block text-sm">Current block derivative</strong>
                {config.useResidual
                  ? 'Residual: dx_out/dx_in = 1 + α·w·f′(z). The identity term helps the path, but the total multiplier can still be too large or even cancel.'
                  : 'Plain: dx_out/dx_in = w·f′(z). Small activation slopes or small weights compound directly through depth.'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
            <div className="flex items-center gap-2 font-black text-violet-950"><Zap size={17} /> Same branch, plain vs residual</div>
            <p className="mt-1 text-xs leading-5 text-violet-900">This is a comparison, not a promise that residuals always stabilize training.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-3"><span className="text-xs font-bold uppercase text-slate-500">Plain dL/dx₀</span><strong className="mt-1 block font-mono text-xl text-slate-950">{formatNumber(plainTrace.inputGradient)}</strong></div>
              <div className="rounded-lg bg-white p-3"><span className="text-xs font-bold uppercase text-slate-500">Residual dL/dx₀</span><strong className="mt-1 block font-mono text-xl text-slate-950">{formatNumber(residualTrace.inputGradient)}</strong></div>
            </div>
          </div>

          <div className="max-h-[520px] overflow-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[920px] border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 text-left uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Layer</th>
                  <th className="px-3 py-2">x in</th>
                  <th className="px-3 py-2">z</th>
                  <th className="px-3 py-2">f′(z)</th>
                  <th className="px-3 py-2">Block derivative</th>
                  <th className="px-3 py-2">dL/dout</th>
                  <th className="px-3 py-2">dL/din</th>
                  <th className="px-3 py-2">State</th>
                </tr>
              </thead>
              <tbody>
                {[...trace.layers].reverse().map((layer) => (
                  <tr key={layer.layer} className="border-t border-slate-200 bg-white">
                    <td className="px-3 py-2 font-black text-slate-950">{layer.layer}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(layer.input)}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(layer.preActivation)}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(layer.activationSlope)}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(layer.localDerivative)}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(layer.upstreamGradient)}</td>
                    <td className="px-3 py-2 font-mono">{formatNumber(layer.inputGradient)}</td>
                    <td className="px-3 py-2"><span className={`rounded-full px-2 py-1 font-bold ${stateTone(layer.activationState)}`}>{layer.activationState}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </section>
  );
}
