import React, { useMemo, useState } from 'react';
import { Microscope } from 'lucide-react';
import { ADAM_MECHANICS_DEFAULTS } from './optimizerConstants.js';
import { adamFirstStepAnatomy } from './optimizerModel.js';

const GRADIENT_RATIOS = [1, 10, 100, 1000];

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 0.001 || magnitude >= 1000)) return value.toExponential(3);
  return value.toFixed(4);
}

export default function AdamMechanicsLab() {
  const [gradientRatio, setGradientRatio] = useState(1000);
  const gradient = useMemo(() => [
    ADAM_MECHANICS_DEFAULTS.gradient[0],
    ADAM_MECHANICS_DEFAULTS.gradient[0] * gradientRatio,
  ], [gradientRatio]);
  const analysis = useMemo(() => adamFirstStepAnatomy({
    ...ADAM_MECHANICS_DEFAULTS,
    gradient,
  }), [gradient]);

  return (
    <section className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-blue-700">
            <Microscope size={16} />
            Adam first-step microscope
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-950">A 1000× larger gradient does not imply a 1000× larger Adam step</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            On the first step, bias-corrected Adam has m̂=g and v̂=g². Dividing by √v̂ nearly normalizes gradient magnitude, so different coordinates get very different effective learning rates.
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-white p-3 text-xs leading-5 text-slate-600">
          β₁={ADAM_MECHANICS_DEFAULTS.beta1} · β₂={ADAM_MECHANICS_DEFAULTS.beta2} · α={ADAM_MECHANICS_DEFAULTS.learningRate}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {GRADIENT_RATIOS.map((ratio) => (
          <button
            key={ratio}
            type="button"
            onClick={() => setGradientRatio(ratio)}
            className={`rounded-lg border px-3 py-2 text-sm font-black ${gradientRatio === ratio ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            gradient ratio {ratio}×
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Coordinate</th>
              <th className="px-3 py-2">Raw gradient</th>
              <th className="px-3 py-2">m̂</th>
              <th className="px-3 py-2">v̂</th>
              <th className="px-3 py-2">Adam update</th>
              <th className="px-3 py-2">Effective α</th>
            </tr>
          </thead>
          <tbody>
            {gradient.map((value, index) => (
              <tr key={index} className="border-t border-slate-200">
                <td className="px-3 py-3 font-black text-slate-900">θ{index + 1}</td>
                <td className="px-3 py-3 font-mono">{format(value)}</td>
                <td className="px-3 py-3 font-mono">{format(analysis.corrected.correctedFirst[index])}</td>
                <td className="px-3 py-3 font-mono">{format(analysis.corrected.correctedSecond[index])}</td>
                <td className="px-3 py-3 font-mono font-black text-blue-700">{format(analysis.corrected.update[index])}</td>
                <td className="px-3 py-3 font-mono">{format(analysis.effectiveLearningRates[index])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Raw gradient ratio</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{gradientRatio}×</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Coordinate 2 has this much more raw gradient magnitude.</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-blue-700">Corrected step ratio</div>
          <div className="mt-1 text-2xl font-black text-slate-950">
            {(Math.abs(analysis.corrected.update[1] / analysis.corrected.update[0])).toFixed(3)}×
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">With ε tiny, first-step magnitudes are nearly equal despite the gradient-scale mismatch.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs font-black uppercase tracking-wide text-amber-700">No bias correction</div>
          <div className="mt-1 text-2xl font-black text-slate-950">{analysis.uncorrectedToCorrectedNormRatio.toFixed(2)}×</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Ratio of uncorrected to corrected first-step norm for these β values.</p>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <strong>Important:</strong> Adam is adapting to gradient history, not directly measuring Hessian curvature. The normalization can help badly scaled coordinates, but it does not make learning-rate tuning, schedules, validation, or conditioning diagnostics optional.
      </p>
    </section>
  );
}
