import React, { useMemo, useState } from 'react';

import { Note, NoteRow, Plate, Readouts } from '../../animations/_shared/notebook.jsx';
import { buildConvReluBackward, buildMultiChannelConv, buildPoolingComparison } from './neuralCnnNextModel.js';

function Matrix({ label, matrix }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(42px, 1fr))` }}>
        {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-center font-mono text-sm font-black">
            {Number(value).toFixed(2).replace(/\.00$/, '')}
          </div>
        )))}
      </div>
    </div>
  );
}

function Conv2dNextLab() {
  const [filterIndex, setFilterIndex] = useState(0);
  const filters = useMemo(() => buildMultiChannelConv(), []);
  const active = filters[filterIndex];

  return (
    <>
      <Plate
        label="Multi-channel Conv2D"
        title="One output filter sums one spatial response from every input channel"
        note="The output channel is not a copy of an input channel. It is the sum of learned channel-specific kernels plus one filter bias."
      >
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setFilterIndex(index)}
              className={`rounded-lg border px-3 py-2 text-sm font-black ${filterIndex === index ? 'border-cyan-500 bg-cyan-50 text-cyan-950' : 'border-slate-200 bg-white text-slate-700'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <Readouts columns={3} items={[
          { label: 'Channel 1 @ [0,0]', value: active.channelContributions[0][0][0], detail: 'input₁ ⋆ kernel₁' },
          { label: 'Channel 2 @ [0,0]', value: active.channelContributions[1][0][0], detail: 'input₂ ⋆ kernel₂' },
          { label: 'Output @ [0,0]', value: active.output[0][0], detail: `sum + bias ${active.bias}` },
        ]} />
        <div className="grid gap-4 md:grid-cols-3">
          <Matrix label="Channel 1 contribution" matrix={active.channelContributions[0]} />
          <Matrix label="Channel 2 contribution" matrix={active.channelContributions[1]} />
          <Matrix label={`${active.label} output`} matrix={active.output} />
        </div>
      </Plate>
      <Plate label="Filter bank" title="Multiple filters create multiple output channels">
        <Note tone="accent" title="Shape rule">With Cᵢₙ input channels and Cₒᵤₜ filters, each filter owns Cᵢₙ kernel slices. The layer emits Cₒᵤₜ feature maps.</Note>
      </Plate>
    </>
  );
}

function ConvReluNextLab() {
  const result = useMemo(() => buildConvReluBackward(), []);
  return (
    <>
      <Plate label="Backward pass" title="ReLU decides which convolution outputs receive gradient">
        <div className="grid gap-4 md:grid-cols-3">
          <Matrix label="Conv pre-activation z" matrix={result.convolution} />
          <Matrix label="ReLU gate 1[z>0]" matrix={result.gate} />
          <Matrix label="dL/dz" matrix={result.dPreActivation} />
        </div>
        <Readouts columns={3} items={[
          { label: 'Active output cells', value: result.gate.flat().reduce((sum, value) => sum + value, 0), detail: 'pass upstream gradient' },
          { label: 'Clipped output cells', value: result.gate.flat().filter((value) => value === 0).length, detail: 'receive zero dL/dz' },
          { label: 'Bias gradient', value: result.dBias, detail: 'sum of active dL/dz' },
        ]} />
        <div className="grid gap-4 md:grid-cols-2">
          <Matrix label="dL/dKernel" matrix={result.dKernel} />
          <Matrix label="dL/dInput" matrix={result.dInput} />
        </div>
      </Plate>
      <Plate label="Gradient routing" title="Clipping a feature is also clipping its local learning signal">
        <Note tone="warn" title="Local gate">A negative convolution pre-activation contributes zero to the ReLU backward pass. Active cells contribute to kernel, input, and bias gradients through their receptive-field patches.</Note>
      </Plate>
    </>
  );
}

function PoolingNextLab() {
  const result = useMemo(() => buildPoolingComparison(), []);
  const operators = [
    ['Max pool', result.max],
    ['Average pool', result.average],
    ['Strided convolution', result.stridedConv],
  ];

  return (
    <>
      <Plate label="Downsampling operators" title="Same 2×2 patch, three different summaries and three different backward paths">
        <Readouts columns={3} items={operators.map(([label, operator]) => ({
          label,
          value: operator.value.toFixed(2),
          detail: 'forward output',
        }))} />
        <div className="grid gap-4 md:grid-cols-3">
          {operators.map(([label, operator]) => <Matrix key={label} label={`${label} · dL/dInput`} matrix={operator.inputGradient} />)}
        </div>
      </Plate>
      <Plate label="Inductive bias" title="Pooling is not just a cheaper convolution">
        <NoteRow>
          <Note title="Max pool">Selects the strongest local response and routes gradient only to the winning location.</Note>
          <Note title="Average pool">Smooths the patch and distributes gradient uniformly.</Note>
          <Note title="Strided convolution">Learns the downsampling weights, preserving trainable channel mixing at extra parameter cost.</Note>
        </NoteRow>
      </Plate>
    </>
  );
}

export default function CnnOperatorNextLab({ lessonId }) {
  if (lessonId === 'conv2d') return <Conv2dNextLab />;
  if (lessonId === 'conv-relu') return <ConvReluNextLab />;
  if (lessonId === 'max-pooling') return <PoolingNextLab />;
  return null;
}
