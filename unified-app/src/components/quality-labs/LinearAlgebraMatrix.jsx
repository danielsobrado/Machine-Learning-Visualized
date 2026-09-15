import React from 'react';

const format = (value) => {
  if (Number.isInteger(value)) return String(value);
  if (Math.abs(value) < 1e-10) return '0';
  return Number(value).toFixed(3);
};

export default function LinearAlgebraMatrix({ label, matrix }) {
  return (
    <div className="min-w-0">
      {label && <span className="nb-label">{label}</span>}
      <div className="mt-2 inline-grid gap-x-4 gap-y-2 border-x-2 border-slate-400 px-3 py-2 font-mono text-sm" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(2.5rem, auto))` }}>
        {matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
          <span key={`${rowIndex}-${columnIndex}`} className="text-right tabular-nums">{format(value)}</span>
        )))}
      </div>
    </div>
  );
}
