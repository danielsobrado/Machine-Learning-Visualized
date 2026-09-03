import React from 'react';
import { RotateCcw, ScanLine } from 'lucide-react';
import { conventionExperiment } from './conv2dModel.js';

const PATCH = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const ASYMMETRIC_KERNEL = [
  [1, 2, 0],
  [0, 0, 0],
  [0, -1, -2],
];

function Matrix({ title, matrix, tone = 'slate' }) {
  const toneClass = tone === 'cyan' ? 'border-cyan-200 bg-cyan-50' : tone === 'violet' ? 'border-violet-200 bg-violet-50' : 'border-slate-200 bg-white';
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">{title}</h3>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(42px, 1fr))` }}>
        {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="flex aspect-square items-center justify-center rounded-md border border-slate-200 bg-white font-mono font-black text-slate-900">
            {value}
          </div>
        )))}
      </div>
    </div>
  );
}

export default function ConvConventionLab() {
  const experiment = conventionExperiment({ input: PATCH, kernel: ASYMMETRIC_KERNEL });
  const correlation = experiment.correlation[0][0];
  const convolution = experiment.convolution[0][0];

  return (
    <section className="space-y-5 rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5 shadow-sm">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-700">
          <ScanLine size={16} />
          Convention lab
        </div>
        <h2 className="mt-1 text-xl font-black text-slate-950">Most deep-learning “convolutions” are cross-correlations</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Mathematical convolution flips the kernel by 180° before taking the dot product. Common neural-network Conv2D operators skip that flip and learn the kernel in the orientation they need. The distinction usually does not reduce model capacity, but it matters when you explain or reproduce a hand-designed filter.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Matrix title="Input patch" matrix={PATCH} />
        <Matrix title="Kernel used by DL cross-correlation" matrix={ASYMMETRIC_KERNEL} tone="cyan" />
        <Matrix title="180° flipped kernel for mathematical convolution" matrix={experiment.flippedKernel} tone="violet" />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-cyan-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-cyan-700">Framework-style output</div>
          <div className="mt-1 text-3xl font-black text-slate-950">{correlation}</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Dot product with the kernel exactly as stored.</p>
        </div>
        <div className="rounded-xl border border-violet-200 bg-white p-4">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700">Mathematical convolution</div>
          <div className="mt-1 text-3xl font-black text-slate-950">{convolution}</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Dot product after the 180° kernel flip.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700"><RotateCcw size={14} /> Difference</div>
          <div className="mt-1 text-3xl font-black text-slate-950">{Math.abs(correlation - convolution)}</div>
          <p className="mt-1 text-xs leading-5 text-slate-600">An asymmetric kernel exposes the convention immediately.</p>
        </div>
      </div>

      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <strong>Practical rule:</strong> when discussing CNN libraries, say “Conv2D layer” but know the numerical primitive is commonly cross-correlation. When porting classical image-processing kernels, verify whether the source definition assumes a kernel flip.
      </p>
    </section>
  );
}
