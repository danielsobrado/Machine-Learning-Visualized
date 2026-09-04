import React, { useMemo, useState } from 'react';
import { CheckCircle2, FlaskConical, Workflow } from 'lucide-react';
import ConditioningLab from './ConditioningLab.jsx';

const BASES = [
  { id: 'standard', name: 'Standard basis', b1: [1, 0], b2: [0, 1], coords: [3, 2] },
  { id: 'tilted', name: 'Tilted basis', b1: [1, 1], b2: [-1, 1], coords: [2.5, -0.5] },
  { id: 'scaled', name: 'Scaled basis', b1: [2, 0], b2: [0.5, 1], coords: [1, 1.5] },
];

function toScreen([x, y]) {
  return [210 + x * 36, 210 - y * 36];
}

export default function ChangeOfBasisAnimation() {
  const [basisId, setBasisId] = useState('tilted');
  const [showAnswer, setShowAnswer] = useState(false);
  const basis = BASES.find((item) => item.id === basisId) || BASES[0];
  const vector = useMemo(() => [
    basis.coords[0] * basis.b1[0] + basis.coords[1] * basis.b2[0],
    basis.coords[0] * basis.b1[1] + basis.coords[1] * basis.b2[1],
  ], [basis]);
  const [vx, vy] = toScreen(vector);
  const [b1x, b1y] = toScreen([basis.b1[0] * 2.5, basis.b1[1] * 2.5]);
  const [b2x, b2y] = toScreen([basis.b2[0] * 2.5, basis.b2[1] * 2.5]);

  return (
    <div className="min-h-full bg-slate-100 p-4 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><h1 className="text-2xl font-bold">Change of Basis</h1><p className="text-sm text-slate-600">The vector stays fixed while its coordinate recipe changes.</p></div>
              <div className="flex flex-wrap gap-2">
                {BASES.map((item) => <button key={item.id} type="button" onClick={() => setBasisId(item.id)} aria-pressed={basisId === item.id} className={`rounded-md px-3 py-2 text-sm font-semibold ${basisId === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{item.name}</button>)}
              </div>
            </div>
            <svg viewBox="0 0 420 420" className="h-[420px] w-full rounded-md bg-slate-50" role="img" aria-label="Vector represented with two basis vectors">
              <defs><marker id="basisArrow" markerHeight="8" markerWidth="8" orient="auto" refX="8" refY="4"><path d="M0,0 L8,4 L0,8 Z" fill="currentColor" /></marker></defs>
              {Array.from({ length: 9 }, (_, i) => 66 + i * 36).map((n) => <g key={n}><line x1={n} y1="30" x2={n} y2="390" stroke="#e2e8f0" /><line x1="30" y1={n} x2="390" y2={n} stroke="#e2e8f0" /></g>)}
              <line x1="30" y1="210" x2="390" y2="210" stroke="#94a3b8" /><line x1="210" y1="390" x2="210" y2="30" stroke="#94a3b8" />
              <line x1="210" y1="210" x2={b1x} y2={b1y} stroke="#4f46e5" strokeWidth="4" /><line x1="210" y1="210" x2={b2x} y2={b2y} stroke="#0891b2" strokeWidth="4" /><line x1="210" y1="210" x2={vx} y2={vy} stroke="#e11d48" strokeWidth="5" />
              <circle cx={vx} cy={vy} r="6" fill="#e11d48" /><text x={vx + 8} y={vy - 8} fill="#be123c" fontSize="16">x</text>
            </svg>
          </section>
          <aside className="grid gap-4">
            <div className="rounded-lg border border-indigo-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-indigo-700"><Workflow size={20} /><h2 className="text-lg font-bold">Coordinate map</h2></div>
              <p className="text-sm text-slate-700">Basis matrix B has the basis vectors as columns.</p>
              <p className="mt-3 rounded-md bg-slate-950 p-3 font-mono text-sm text-indigo-100">x = B [x]B</p>
              <p className="mt-3 text-sm text-slate-700">Coordinates [{basis.coords.join(', ')}] describe the fixed standard vector [{vector.map((v) => v.toFixed(1)).join(', ')}].</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2"><FlaskConical size={20} className="text-rose-600" /><h2 className="text-lg font-bold">Practice lab</h2></div>
              <p className="text-sm text-slate-700">Does changing coordinates by switching basis move the geometric vector?</p>
              <button type="button" onClick={() => setShowAnswer(true)} className="mt-4 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Reveal</button>
              {showAnswer && <p className="mt-3 flex gap-2 text-sm text-emerald-700"><CheckCircle2 size={16} />No. Coordinates are descriptions; the vector is the object.</p>}
            </div>
          </aside>
        </div>
        <ConditioningLab />
      </div>
    </div>
  );
}
