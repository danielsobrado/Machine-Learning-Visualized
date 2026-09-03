import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Layers3, Zap } from 'lucide-react';
import { INITIALIZATION_DEFAULTS, INITIALIZATION_METHODS } from './initializationConstants.js';
import { analyzeInitialization, compareInitializers } from './initializationModel.js';
import InitializationControls from './InitializationControls.jsx';
import InitializerComparison from './InitializerComparison.jsx';
import PropagationScale from './PropagationScale.jsx';
import SymmetryBreakLab from './SymmetryBreakLab.jsx';

function formatScale(value) {
  if (value === 0) return '0×';
  if (value < 0.01 || value >= 1000) return `${value.toExponential(2)}×`;
  return `${value.toFixed(3).replace(/\.?0+$/, '')}×`;
}

function StatusCard({ label, value, status }) {
  const tone = status === 'stable'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : status === 'vanishing'
      ? 'border-sky-200 bg-sky-50 text-sky-900'
      : 'border-rose-200 bg-rose-50 text-rose-900';

  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <div className="text-xs font-black uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-black">{formatScale(value)}</div>
      <div className="mt-1 text-xs font-semibold capitalize">{status}</div>
    </div>
  );
}

export default function InitializationWorkbench() {
  const [method, setMethod] = useState(INITIALIZATION_DEFAULTS.method);
  const [activation, setActivation] = useState(INITIALIZATION_DEFAULTS.activation);
  const [inputWidth, setInputWidth] = useState(INITIALIZATION_DEFAULTS.inputWidth);
  const [hiddenWidth, setHiddenWidth] = useState(INITIALIZATION_DEFAULTS.hiddenWidth);
  const [layers, setLayers] = useState(INITIALIZATION_DEFAULTS.layers);

  const analysis = useMemo(
    () => analyzeInitialization({ method, activation, inputWidth, hiddenWidth, layers }),
    [activation, hiddenWidth, inputWidth, layers, method],
  );
  const comparison = useMemo(
    () => compareInitializers({ activation, inputWidth, hiddenWidth, layers }),
    [activation, hiddenWidth, inputWidth, layers],
  );

  const applyArchitecture = (preset) => {
    setInputWidth(preset.inputWidth);
    setHiddenWidth(preset.hiddenWidth);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
          <Activity size={16} />
          Weight initialization
        </div>
        <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Keep signal alive without lying about the architecture</h1>
        <p className="mt-2 max-w-4xl text-slate-700">
          Initialization is a starting-scale policy. This lab tracks a shape-valid network layer by layer, compares forward and backward second moments, and separates variance scaling from symmetry breaking.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <InitializationControls
          method={method}
          activation={activation}
          inputWidth={inputWidth}
          hiddenWidth={hiddenWidth}
          layers={layers}
          onMethodChange={setMethod}
          onActivationChange={setActivation}
          onArchitectureChange={applyArchitecture}
          onInputWidthChange={setInputWidth}
          onHiddenWidthChange={setHiddenWidth}
          onLayersChange={setLayers}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
            <Layers3 size={16} />
            Actual width schedule
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {analysis.widths.map((width, index) => (
              <React.Fragment key={`${index}-${width}`}>
                {index > 0 && <span className="text-slate-400">→</span>}
                <span className={`rounded-lg border px-3 py-2 font-mono text-sm ${index === 0 ? 'border-violet-200 bg-violet-50 text-violet-900' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
                  {width}
                </span>
              </React.Fragment>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A rectangular input transition happens once. Hidden layers then use the hidden width, so a 256→32 bottleneck is not incorrectly repeated as 256→32 at every depth.
          </p>

          <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-200">
              <Zap size={14} />
              Selected initializer
            </div>
            <div className="mt-1 text-xl font-black">{INITIALIZATION_METHODS[method].label}</div>
            <div className="mt-1 font-mono text-sm text-slate-300">{INITIALIZATION_METHODS[method].formula}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">First layer σ</div>
                <div className="mt-1 font-mono text-xl font-black">{analysis.layers[0].weightStd.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">Saturated tanh layers</div>
                <div className="mt-1 font-mono text-xl font-black">{analysis.saturatedLayerCount}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {analysis.hiddenGradientFailure && (
        <section className="rounded-2xl border border-rose-300 bg-rose-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-rose-700" size={20} />
            <div>
              <h3 className="font-black text-rose-950">The forward path is hiding a backward problem</h3>
              <p className="mt-1 text-sm leading-6 text-rose-900">
                Activations finish in the stable range while gradients are {analysis.backwardHealth}. Fan-in scaling and fan-out scaling optimize different directions on rectangular layers.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <StatusCard label="Final activation 2nd moment" value={analysis.finalForward} status={analysis.forwardHealth} />
        <StatusCard label="Final gradient 2nd moment" value={analysis.finalBackward} status={analysis.backwardHealth} />
        <div className={`rounded-xl border p-3 ${analysis.forwardHealth === 'stable' && analysis.backwardHealth === 'stable' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
            {analysis.forwardHealth === 'stable' && analysis.backwardHealth === 'stable' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
            Combined check
          </div>
          <div className="mt-2 text-lg font-black">
            {analysis.forwardHealth === 'stable' && analysis.backwardHealth === 'stable' ? 'Both paths healthy' : 'Tradeoff exposed'}
          </div>
          <p className="mt-1 text-xs leading-5">A useful initializer is architecture- and activation-dependent, not a universal preset.</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PropagationScale direction="forward" series={analysis.forwardSeries} health={analysis.forwardHealth} />
        <PropagationScale direction="backward" series={analysis.backwardSeries} health={analysis.backwardHealth} />
      </section>

      <InitializerComparison results={comparison} selectedMethod={method} />
      <SymmetryBreakLab />

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
        <h3 className="font-black text-slate-900">What this approximation does and does not claim</h3>
        <p className="mt-2">
          The propagation tracks use mean-field second moments. They are diagnostic approximations, not guarantees for a finite trained network. ReLU has closed-form factors under centered Gaussian assumptions; tanh moments are numerically integrated from the current pre-activation scale so saturation appears when the scale actually becomes large.
        </p>
        <p className="mt-2">
          Variance scaling solves a different problem from symmetry breaking. Even perfectly scaled identical hidden neurons can remain clones unless their weights start differently.
        </p>
      </section>
    </div>
  );
}
