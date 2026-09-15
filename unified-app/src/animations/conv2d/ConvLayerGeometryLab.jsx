import React, { useMemo, useState } from 'react';
import { Boxes, Calculator, Maximize2 } from 'lucide-react';
import { CONV_LAYER_DEFAULTS, CONV_LAYER_LIMITS } from './convLayerConstants.js';
import { conv2dLayerSummary, stackedReceptiveField } from './conv2dModel.js';

function ShapeCard({ label, shape, helper }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-xl font-black text-slate-950">[{shape.join(', ')}]</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

function Control({ label, value, limits, onChange }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <strong className="font-mono text-slate-950">{value}</strong>
      </span>
      <input
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-cyan-700"
      />
    </label>
  );
}

export default function ConvLayerGeometryLab() {
  const [inputChannels, setInputChannels] = useState(CONV_LAYER_DEFAULTS.inputChannels);
  const [outputChannels, setOutputChannels] = useState(CONV_LAYER_DEFAULTS.outputChannels);
  const [kernelSize, setKernelSize] = useState(CONV_LAYER_DEFAULTS.kernelSize);
  const [stride, setStride] = useState(CONV_LAYER_DEFAULTS.stride);
  const [padding, setPadding] = useState(CONV_LAYER_DEFAULTS.padding);
  const [dilation, setDilation] = useState(CONV_LAYER_DEFAULTS.dilation);
  const [useBias, setUseBias] = useState(CONV_LAYER_DEFAULTS.useBias);

  const summary = useMemo(() => conv2dLayerSummary({
    ...CONV_LAYER_DEFAULTS,
    inputChannels,
    outputChannels,
    kernelSize,
    stride,
    padding,
    dilation,
    useBias,
  }), [dilation, inputChannels, kernelSize, outputChannels, padding, stride, useBias]);
  const repeatedStack = useMemo(() => stackedReceptiveField([
    { kernelSize, stride, dilation },
    { kernelSize, stride, dilation },
  ]), [dilation, kernelSize, stride]);

  return (
    <section className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5 shadow-sm">
      <header className="flex items-start gap-3">
        <div className="rounded-lg bg-cyan-100 p-2 text-cyan-800"><Boxes size={20} /></div>
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Full Conv2D layer geometry</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">A filter spans every input channel, then slides spatially</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The local 2D dot product above is one channel slice of a real layer. Each output filter owns one kernel slice per input channel, sums those channel contributions, adds one optional bias, and reuses the same weights at every spatial location.
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <Control label="Input channels Cᵢₙ" value={inputChannels} limits={CONV_LAYER_LIMITS.inputChannels} onChange={setInputChannels} />
          <Control label="Output filters Cₒᵤₜ" value={outputChannels} limits={CONV_LAYER_LIMITS.outputChannels} onChange={setOutputChannels} />
          <Control label="Kernel size K" value={kernelSize} limits={CONV_LAYER_LIMITS.kernelSize} onChange={setKernelSize} />
          <Control label="Stride S" value={stride} limits={CONV_LAYER_LIMITS.stride} onChange={setStride} />
          <Control label="Padding P" value={padding} limits={CONV_LAYER_LIMITS.padding} onChange={setPadding} />
          <Control label="Dilation D" value={dilation} limits={CONV_LAYER_LIMITS.dilation} onChange={setDilation} />
          <button
            type="button"
            aria-pressed={useBias}
            onClick={() => setUseBias((current) => !current)}
            className={`w-full rounded-xl border px-3 py-2 text-sm font-black ${useBias ? 'border-cyan-500 bg-cyan-50 text-cyan-950' : 'border-slate-300 bg-white text-slate-700'}`}
          >
            Bias {useBias ? 'enabled' : 'disabled'}
          </button>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <ShapeCard label="Input · NCHW" shape={summary.inputShape} helper="Batch and input-channel dimensions enter the layer." />
            <ShapeCard label="Weights" shape={summary.weightShape} helper="[Cout, Cin, K, K] — every filter spans all input channels." />
            <ShapeCard label="Output · NCHW" shape={summary.outputShape} helper="Batch is preserved; filter count becomes output channels." />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Maximize2 size={15} />Effective footprint</div>
              <div className="mt-1 text-2xl font-black text-slate-950">{summary.effectiveKernel} × {summary.effectiveKernel}</div>
              <p className="mt-1 font-mono text-xs text-slate-600">D·(K−1)+1 = {dilation}·({kernelSize}−1)+1</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700"><Calculator size={15} />Trainable parameters</div>
              <div className="mt-1 text-2xl font-black text-slate-950">{summary.parameters.total.toLocaleString()}</div>
              <p className="mt-1 text-xs text-slate-600">{summary.parameters.weights.toLocaleString()} weights + {summary.parameters.biases.toLocaleString()} biases.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-xs font-black uppercase tracking-wide text-amber-700">Spatial sharing</div>
              <div className="mt-1 text-lg font-black text-slate-950">One weight tensor, many windows</div>
              <p className="mt-1 text-xs leading-5 text-slate-600">Changing image height or width changes how often filters are applied, not how many filter parameters exist.</p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="text-xs font-black uppercase tracking-wide text-blue-700">If this same layer is stacked twice</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {repeatedStack.trace.map((layer) => (
                <div key={layer.layer} className="rounded-lg bg-white p-3">
                  <div className="text-xs font-bold text-slate-500">After layer {layer.layer}</div>
                  <div className="mt-1 font-mono text-lg font-black text-slate-950">RF {layer.receptiveField} · jump {layer.jump}</div>
                  <div className="mt-1 text-xs text-slate-600">effective kernel {layer.effectiveKernel}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-blue-950">
              Receptive field grows using the previous layer's input jump: <span className="font-mono">r′ = r + (Keff−1)·jump</span>. Kernel sizes therefore do not simply multiply. With K=3, S=2, D=1, the sequence is RF 1 → 3 → 7 while jump becomes 1 → 2 → 4.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
            <strong className="text-slate-950">Spatial formula:</strong>{' '}
            <span className="font-mono">floor((input + 2P − D(K−1) − 1) / S) + 1</span>. Dilation enlarges the sampled footprint without adding kernel weights. Stride changes where that footprint is placed. Output channels come from the number of learned filters, not from the spatial formula.
          </div>
        </main>
      </div>
    </section>
  );
}
