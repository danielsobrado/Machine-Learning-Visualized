import React, { useMemo, useState } from 'react';
import { Calculator, Grid3X3, MoveRight, ScanLine, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import ConvConventionLab from './ConvConventionLab.jsx';
import { crossCorrelate2d, extractPatch, padInput } from './conv2dModel.js';

const INPUT = [
  [1, 2, 0, 1, 2],
  [0, 1, 3, 2, 1],
  [2, 3, 1, 0, 2],
  [1, 0, 2, 3, 1],
  [2, 1, 0, 1, 3],
];

const KERNELS = {
  vertical: { label: 'Vertical edge', values: [[1, 0, -1], [1, 0, -1], [1, 0, -1]] },
  horizontal: { label: 'Horizontal edge', values: [[1, 1, 1], [0, 0, 0], [-1, -1, -1]] },
  sharpen: { label: 'Sharpen', values: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
};

function Matrix({ matrix, title, activeWindow }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">{title}</h3>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(34px, 1fr))` }}>
        {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => {
          const active = activeWindow
            && rowIndex >= activeWindow.row
            && rowIndex < activeWindow.row + activeWindow.rows
            && colIndex >= activeWindow.col
            && colIndex < activeWindow.col + activeWindow.cols;
          return (
            <div key={`${rowIndex}-${colIndex}`} className={`flex aspect-square items-center justify-center rounded-md border font-mono font-black ${active ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-300' : 'border-slate-200 bg-slate-50'}`}>
              {value}
            </div>
          );
        }))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500"><Icon size={15} />{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{helper}</p>
    </div>
  );
}

export default function Conv2dAnimation() {
  const [kernelId, setKernelId] = useState('vertical');
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(0);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

  const kernel = KERNELS[kernelId].values;
  const padded = useMemo(() => padInput(INPUT, padding), [padding]);
  const output = useMemo(() => crossCorrelate2d(padded, kernel, stride), [kernel, padded, stride]);
  const activeCell = {
    row: Math.min(selectedCell.row, output.length - 1),
    col: Math.min(selectedCell.col, output[0].length - 1),
  };
  const windowStart = { row: activeCell.row * stride, col: activeCell.col * stride };
  const patch = extractPatch(padded, windowStart.row, windowStart.col, kernel.length, kernel[0].length);
  const products = patch.flatMap((row, rowIndex) => row.map((value, colIndex) => ({
    input: value,
    weight: kernel[rowIndex][colIndex],
    product: value * kernel[rowIndex][colIndex],
  })));
  const selectedValue = output[activeCell.row][activeCell.col];

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-700"><Grid3X3 size={17} />CNN local operator</div>
          <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Conv2D</h1>
          <p className="mt-2 max-w-4xl text-slate-700">
            A Conv2D layer reuses one kernel across local windows. In common deep-learning libraries, the numerical operation is cross-correlation: the stored kernel is not flipped before the dot product.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-black text-slate-950"><SlidersHorizontal size={18} />Controls</div>
            <label className="mt-4 block text-sm font-bold text-slate-700">
              Kernel
              <select value={kernelId} onChange={(event) => setKernelId(event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                {Object.entries(KERNELS).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-700" htmlFor="conv-stride">Stride {stride}</label>
            <input id="conv-stride" type="range" min="1" max="2" step="1" value={stride} onChange={(event) => { setStride(Number(event.target.value)); setSelectedCell({ row: 0, col: 0 }); }} className="mt-2 w-full accent-cyan-700" />
            <label className="mt-4 block text-sm font-bold text-slate-700" htmlFor="conv-padding">Zero padding {padding}</label>
            <input id="conv-padding" type="range" min="0" max="1" step="1" value={padding} onChange={(event) => { setPadding(Number(event.target.value)); setSelectedCell({ row: 0, col: 0 }); }} className="mt-2 w-full accent-cyan-700" />
            <Matrix matrix={kernel} title="Stored kernel" />
          </aside>

          <main className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric icon={Calculator} label="Output shape" value={`${output.length} × ${output[0].length}`} helper="Valid windows after padding and stride." />
              <Metric icon={MoveRight} label="Stride" value={stride} helper="Spatial jump between windows." />
              <Metric icon={ScanLine} label="Padding" value={padding} helper="Zeros added before correlation." />
              <Metric icon={Grid3X3} label="Selected output" value={selectedValue} helper={`cell [${activeCell.row}, ${activeCell.col}]`} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Matrix matrix={padded} title="Padded input" activeWindow={{ ...windowStart, rows: kernel.length, cols: kernel[0].length }} />
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Cross-correlation output</h3>
                <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${output[0].length}, minmax(60px, 1fr))` }}>
                  {output.flatMap((row, rowIndex) => row.map((value, colIndex) => (
                    <button key={`${rowIndex}-${colIndex}`} type="button" onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })} aria-pressed={activeCell.row === rowIndex && activeCell.col === colIndex} className={`rounded-lg border p-3 font-mono font-black ${activeCell.row === rowIndex && activeCell.col === colIndex ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-slate-50'}`}>{value}</button>
                  )))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-black text-slate-950">Selected dot product</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {products.map((item, index) => (
                  <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm">
                    {item.input} × {item.weight} = <strong>{item.product}</strong>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </section>

        <ConvConventionLab />
        <AssessmentPanel lessonId="conv2d" />
      </div>
    </div>
  );
}
