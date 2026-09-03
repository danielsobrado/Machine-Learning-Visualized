import React, { useMemo, useState } from 'react';
import { ArrowDownRight, Grid3X3, Maximize, MousePointer2, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import MaxPoolingBackwardLab from './MaxPoolingBackwardLab.jsx';
import { poolMatrix } from './maxPoolingModel.js';

const MATRICES = {
  edges: { label: 'Edge-like activations', values: [[1,2,1,0,1],[2,9,3,1,0],[1,4,8,2,1],[0,1,3,7,2],[1,0,2,3,6]] },
  sparse: { label: 'Sparse detections', values: [[0,0,6,1,0],[1,0,2,0,0],[0,8,1,0,3],[0,2,0,9,1],[4,0,1,0,0]] },
  texture: { label: 'Textured feature map', values: [[3,4,2,5,3],[4,5,3,6,2],[2,3,4,4,5],[5,2,6,3,4],[3,4,2,5,6]] },
};

function Matrix({ matrix, selected, poolSize }) {
  const inWindow = (row, col) => row >= selected.startRow && row < selected.startRow + poolSize && col >= selected.startCol && col < selected.startCol + poolSize;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-black text-slate-950">Input feature map</h2>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}>
        {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => {
          const active = inWindow(rowIndex, colIndex);
          const winner = selected.winner.row === rowIndex && selected.winner.col === colIndex;
          return <div key={`${rowIndex}-${colIndex}`} className={`flex aspect-square items-center justify-center rounded-lg border text-lg font-black ${winner ? 'border-orange-500 bg-orange-100 text-orange-950 ring-2 ring-orange-300' : active ? 'border-blue-300 bg-blue-50 text-blue-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{value}</div>;
        }))}
      </div>
    </div>
  );
}

function OutputGrid({ pooled, selectedCell, onSelect }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-black text-slate-950">Pooled output</h2>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${pooled.length}, minmax(0, 1fr))` }}>
        {pooled.flatMap((row, rowIndex) => row.map((cell, colIndex) => {
          const active = rowIndex === selectedCell.row && colIndex === selectedCell.col;
          return <button key={`${rowIndex}-${colIndex}`} type="button" onClick={() => onSelect({ row: rowIndex, col: colIndex })} aria-pressed={active} className={`flex aspect-square items-center justify-center rounded-lg border text-lg font-black transition ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-300'}`}>{cell.value}</button>;
        }))}
      </div>
      <p className="mt-3 text-sm text-slate-600">Click an output to inspect its source window and argmax.</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, note }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Icon size={16}/>{label}</div><div className="mt-2 text-2xl font-black text-slate-950">{value}</div><p className="mt-1 text-sm leading-5 text-slate-600">{note}</p></div>;
}

export default function MaxPoolingAnimation() {
  const [matrixId, setMatrixId] = useState('edges');
  const [poolSize, setPoolSize] = useState(2);
  const [stride, setStride] = useState(2);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const matrix = MATRICES[matrixId].values;
  const pooled = useMemo(() => poolMatrix(matrix, poolSize, stride), [matrix, poolSize, stride]);
  const clamped = { row: Math.min(selectedCell.row, pooled.length - 1), col: Math.min(selectedCell.col, pooled.length - 1) };
  const selected = pooled[clamped.row][clamped.col];
  const selectedWindow = { ...selected, startRow: clamped.row * stride, startCol: clamped.col * stride };
  const compression = ((1 - (pooled.length * pooled.length) / (matrix.length * matrix.length)) * 100).toFixed(0);

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">CNN downsampling</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">Max Pooling</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Max pooling keeps one activation per local window. The forward pass discards detail; the backward pass routes the upstream gradient only to the stored argmax.</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 font-black text-slate-800"><SlidersHorizontal size={18}/>Controls</div>
            <label htmlFor="pool-matrix" className="text-sm font-semibold text-slate-700">Feature map</label>
            <select id="pool-matrix" value={matrixId} onChange={(event) => { setMatrixId(event.target.value); setSelectedCell({ row: 0, col: 0 }); }} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">{Object.entries(MATRICES).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select>
            <label htmlFor="pool-size" className="mt-4 block text-sm font-semibold text-slate-700">Window {poolSize}×{poolSize}</label>
            <input id="pool-size" type="range" min="2" max="3" step="1" value={poolSize} onChange={(event) => { setPoolSize(Number(event.target.value)); setSelectedCell({ row: 0, col: 0 }); }} className="mt-2 w-full accent-blue-600" />
            <label htmlFor="pool-stride" className="mt-4 block text-sm font-semibold text-slate-700">Stride {stride}</label>
            <input id="pool-stride" type="range" min="1" max="3" step="1" value={stride} onChange={(event) => { setStride(Number(event.target.value)); setSelectedCell({ row: 0, col: 0 }); }} className="mt-2 w-full accent-blue-600" />
            <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-950"><strong>Output:</strong> {pooled.length}×{pooled.length}</div>
          </div>
          <div className="grid gap-4 xl:grid-cols-[1fr_0.7fr]"><Matrix matrix={matrix} selected={selectedWindow} poolSize={poolSize}/><OutputGrid pooled={pooled} selectedCell={clamped} onSelect={setSelectedCell}/></div>
        </section>

        <section className="grid gap-3 md:grid-cols-4">
          <Stat icon={MousePointer2} label="Window origin" value={`r${selectedWindow.startRow}, c${selectedWindow.startCol}`} note="Highlighted on the input map." />
          <Stat icon={Maximize} label="Argmax" value={selected.value} note={`Winner at (${selected.winner.row}, ${selected.winner.col}).`} />
          <Stat icon={Grid3X3} label="Compression" value={`${compression}%`} note="Fewer activations continue forward." />
          <Stat icon={ArrowDownRight} label="Discard gap" value={(selected.value - selected.average).toFixed(2)} note={`${selected.tieCount > 1 ? `${selected.tieCount} maxima tie. ` : ''}Difference from the window average.`} />
        </section>

        <MaxPoolingBackwardLab />

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Mistake to avoid:</strong> calling max pooling “smooth translation invariance.” It provides local tolerance in the forward representation, but the argmax makes its derivative routing piecewise and discontinuous.</section>
        <AssessmentPanel lessonId="max-pooling" title="Max pooling check" />
      </div>
    </div>
  );
}
