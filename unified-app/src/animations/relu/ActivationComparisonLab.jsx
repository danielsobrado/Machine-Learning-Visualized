import React, { useMemo, useState } from 'react';
import { Activity, ArrowRight, RotateCcw } from 'lucide-react';
import ActivationDerivativeChart from './ActivationDerivativeChart.jsx';
import {
  ACTIVATION_CHART_STROKES,
  ACTIVATION_INPUT_RANGE,
  DEFAULT_ACTIVATION_INPUT,
  DEFAULT_UPSTREAM_GRADIENT,
  UPSTREAM_GRADIENT_RANGE,
} from './activationComparisonConstants.js';
import { compareActivations } from './activationComparisonModel.js';

function format(value) {
  const absolute = Math.abs(value);
  if (absolute >= 1000 || (absolute > 0 && absolute < 0.001)) return value.toExponential(2);
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function RangeControl({ id, label, range, value, onChange }) {
  return (
    <label htmlFor={id} className="block rounded-xl border border-slate-200 bg-white p-4">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
        <span>{label}</span>
        <strong className="font-mono text-slate-950">{format(value)}</strong>
      </span>
      <input
        id={id}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-cyan-700"
      />
    </label>
  );
}

export default function ActivationComparisonLab() {
  const [input, setInput] = useState(DEFAULT_ACTIVATION_INPUT);
  const [upstreamGradient, setUpstreamGradient] = useState(DEFAULT_UPSTREAM_GRADIENT);
  const rows = useMemo(
    () => compareActivations(input, upstreamGradient),
    [input, upstreamGradient],
  );

  const reset = () => {
    setInput(DEFAULT_ACTIVATION_INPUT);
    setUpstreamGradient(DEFAULT_UPSTREAM_GRADIENT);
  };

  return (
    <section className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-800">
              <Activity size={16} /> Activation gradient lab
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Compare the derivative, not only the curve</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              During backpropagation the incoming gradient is multiplied by the activation&apos;s local derivative. Move the same pre-activation through ReLU, Leaky ReLU, sigmoid, tanh, and GELU to see which paths block, attenuate, or preserve that signal.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700">
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <RangeControl id="activation-input" label="Pre-activation x" range={ACTIVATION_INPUT_RANGE} value={input} onChange={setInput} />
          <RangeControl id="activation-upstream-gradient" label="Incoming gradient dL/da" range={UPSTREAM_GRADIENT_RANGE} value={upstreamGradient} onChange={setUpstreamGradient} />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap gap-x-5 gap-y-2 pb-3 text-xs font-bold text-slate-700" aria-label="Activation chart legend">
            {rows.map((row) => (
              <span key={row.id} className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACTIVATION_CHART_STROKES[row.id] }} aria-hidden="true" />
                {row.label}
              </span>
            ))}
          </div>
          <ActivationDerivativeChart input={input} />
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-[820px] w-full border-collapse text-left text-sm">
            <caption className="sr-only">Activation outputs, local derivatives, and gradients passed backward at the selected input.</caption>
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Activation</th>
                <th scope="col" className="px-4 py-3">Output a</th>
                <th scope="col" className="px-4 py-3">Local derivative da/dx</th>
                <th scope="col" className="px-4 py-3">Passed gradient dL/dx</th>
                <th scope="col" className="px-4 py-3">Practical role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 align-top">
                  <th scope="row" className="px-4 py-3 font-black text-slate-950">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACTIVATION_CHART_STROKES[row.id] }} aria-hidden="true" />
                      {row.label}
                    </span>
                  </th>
                  <td className="px-4 py-3 font-mono text-slate-800">{format(row.output)}</td>
                  <td className="px-4 py-3 font-mono text-slate-800">{format(row.derivative)}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-950">{format(row.passedGradient)}</td>
                  <td className="max-w-md px-4 py-3 leading-5 text-slate-600">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
            <div className="font-black">Saturation is a local gradient problem</div>
            <p className="mt-1">At large |x|, sigmoid and tanh flatten, so their derivatives approach zero. A smaller learning rate cannot restore a derivative that the activation already suppressed.</p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
            <div className="font-black">Leaky ReLU is not simply “better ReLU”</div>
            <p className="mt-1">Its negative slope keeps a gradient path alive, but that changes the function and introduces a slope choice. Whether it helps still depends on the model and optimization behavior.</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <div className="font-black">Layer role matters</div>
            <p className="mt-1">Sigmoid remains appropriate when a binary output must represent a probability. ReLU, Leaky ReLU, and GELU are usually compared as hidden activations, not probability links.</p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <ArrowRight size={18} className="mt-1 shrink-0" aria-hidden="true" />
          <p><strong className="text-slate-950">GELU note:</strong> this visual uses the standard tanh approximation to GELU. It is intentionally labeled as an approximation rather than pretending the plotted formula is the exact Gaussian CDF form.</p>
        </div>
      </div>
    </section>
  );
}
