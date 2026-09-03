import React, { useMemo, useState } from 'react';
import { Activity, Eye, Filter, Grid3X3, SlidersHorizontal, Zap } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import PolarityLab from './PolarityLab';

const BASE_IMAGE = [
  [0, 0, 1, 1, 1],
  [0, 1, 2, 2, 1],
  [1, 2, 4, 2, 0],
  [1, 2, 2, 1, 0],
  [1, 1, 0, 0, 0],
];

const KERNELS = {
  edge: {
    label: 'Vertical edge',
    values: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
  },
  blob: {
    label: 'Bright center',
    values: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
  },
  smooth: {
    label: 'Smoothing',
    values: [
      [1, 1, 1],
      [1, 2, 1],
      [1, 1, 1],
    ],
    scale: 0.1,
  },
};

const convolveValid = (image, kernel, bias) => {
  const output = [];
  const scale = kernel.scale || 1;
  for (let row = 0; row <= image.length - 3; row += 1) {
    const outputRow = [];
    for (let col = 0; col <= image[0].length - 3; col += 1) {
      let sum = bias;
      for (let kr = 0; kr < 3; kr += 1) {
        for (let kc = 0; kc < 3; kc += 1) {
          sum += image[row + kr][col + kc] * kernel.values[kr][kc] * scale;
        }
      }
      outputRow.push(Number(sum.toFixed(2)));
    }
    output.push(outputRow);
  }
  return output;
};

const relu = (matrix) => matrix.map((row) => row.map((value) => Math.max(0, value)));
const flatten = (matrix) => matrix.flat();

function Matrix({ matrix, title, selectedWindow, tone = 'blue' }) {
  const maxAbs = Math.max(...flatten(matrix).map((value) => Math.abs(value)), 1);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">{title}</h3>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(34px, 1fr))` }}>
        {matrix.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const inWindow = selectedWindow
              && rowIndex >= selectedWindow.row
              && rowIndex < selectedWindow.row + 3
              && colIndex >= selectedWindow.col
              && colIndex < selectedWindow.col + 3;
            const strength = Math.min(0.95, Math.abs(value) / maxAbs);
            const background = value >= 0
              ? `rgba(37, 99, 235, ${0.12 + strength * 0.5})`
              : `rgba(220, 38, 38, ${0.12 + strength * 0.5})`;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex aspect-square items-center justify-center rounded-md border text-sm font-bold ${
                  inWindow ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-200'
                } ${tone === 'orange' && value === 0 ? 'text-slate-400' : 'text-slate-950'}`}
                style={{ background }}
              >
                {Number.isInteger(value) ? value : value.toFixed(1)}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={16} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

export default function ConvReluAnimation() {
  const [kernelId, setKernelId] = useState('edge');
  const [bias, setBias] = useState(-1);
  const [gain, setGain] = useState(1);
  const [selectedCell, setSelectedCell] = useState({ row: 1, col: 1 });

  const kernel = KERNELS[kernelId];
  const scaledImage = useMemo(
    () => BASE_IMAGE.map((row) => row.map((value) => Number((value * gain).toFixed(2)))),
    [gain],
  );
  const preActivation = useMemo(() => convolveValid(scaledImage, kernel, bias), [bias, kernel, scaledImage]);
  const activation = useMemo(() => relu(preActivation), [preActivation]);
  const activeCount = flatten(activation).filter((value) => value > 0).length;
  const totalCells = flatten(activation).length;
  const selectedZ = preActivation[selectedCell.row][selectedCell.col];
  const selectedA = activation[selectedCell.row][selectedCell.col];
  const sparsity = Math.round(((totalCells - activeCount) / totalCells) * 100);
  const maxActivation = Math.max(...flatten(activation));

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
            <Filter size={17} />
            CNN feature pipeline
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">Conv + ReLU</h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            A convolution filter creates a signed feature map. ReLU then keeps positive responses and zeros negative
            responses. The sign can encode feature polarity, so zeroing it is not always equivalent to removing noise.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <SlidersHorizontal size={18} />
              Filter controls
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <div className="mb-2 text-sm font-semibold text-slate-700">Kernel</div>
                <select
                  value={kernelId}
                  onChange={(event) => setKernelId(event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  {Object.entries(KERNELS).map(([id, item]) => (
                    <option key={id} value={id}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>Bias before ReLU</span>
                  <span>{bias.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="4"
                  step="0.5"
                  value={bias}
                  onChange={(event) => setBias(Number(event.target.value))}
                  className="w-full accent-emerald-700"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>Input contrast</span>
                  <span>{gain.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={gain}
                  onChange={(event) => setGain(Number(event.target.value))}
                  className="w-full accent-emerald-700"
                />
              </label>
            </div>

            <div className="mt-5 rounded-lg bg-slate-50 p-3">
              <div className="text-sm font-bold text-slate-950">Kernel weights</div>
              <div className="mt-3 grid grid-cols-3 gap-1">
                {kernel.values.flat().map((value, index) => (
                  <div key={index} className="flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-bold">
                    {kernel.scale ? (value * kernel.scale).toFixed(1) : value}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Metric icon={Grid3X3} label="Output size" value="3 x 3" helper="Valid 3x3 convolution over a 5x5 input." />
              <Metric icon={Zap} label="Active cells" value={`${activeCount}/${totalCells}`} helper="Positive responses survive ReLU." />
              <Metric icon={Activity} label="Sparsity" value={`${sparsity}%`} helper="Zeroed cells after activation." />
              <Metric icon={Eye} label="Max activation" value={maxActivation.toFixed(1)} helper="Strongest positive response." />
            </div>

            <section className="grid gap-4 xl:grid-cols-3">
              <Matrix matrix={scaledImage} title="Input patch grid" selectedWindow={selectedCell} />
              <Matrix matrix={preActivation} title="Z = conv(input, kernel) + bias" tone="red" />
              <Matrix matrix={activation} title="A = ReLU(Z)" tone="orange" />
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Trace one output cell</h2>
              <p className="text-sm text-slate-600">
                Choose an output location. The highlighted 3x3 input window is multiplied by the kernel, then bias is
                added before ReLU clips negative values to zero.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {preActivation.map((row, rowIndex) =>
                  row.map((value, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                      className={`rounded-lg border p-3 text-left ${
                        selectedCell.row === rowIndex && selectedCell.col === colIndex
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-slate-50 hover:border-emerald-300'
                      }`}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        output [{rowIndex + 1},{colIndex + 1}]
                      </div>
                      <div className="mt-1 text-xl font-bold text-slate-950">
                        z {value.toFixed(1)} to a {activation[rowIndex][colIndex].toFixed(1)}
                      </div>
                    </button>
                  )),
                )}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Predict before running</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Lower the bias and predict which positive feature responses will disappear after ReLU.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Selected cell</h3>
                <p className="mt-2 text-sm text-slate-700">
                  This cell has pre-activation z = {selectedZ.toFixed(1)} and post-ReLU activation a = {selectedA.toFixed(1)}.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Failure mode</h3>
                <p className="mt-2 text-sm text-slate-700">
                  If bias or initialization pushes most z values below zero, the filter can stop passing gradient signal
                  for many examples. A signed feature can also disappear when its contrast polarity reverses.
                </p>
              </div>
            </section>
          </main>
        </section>

        <PolarityLab />
        <AssessmentPanel lessonId="conv-relu" />
      </div>
    </div>
  );
}
