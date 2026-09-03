import React, { useMemo, useState } from 'react';
import { Activity, Gauge, LineChart, SlidersHorizontal, Zap } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import LeakyReluDepthLab from './LeakyReluDepthLab.jsx';
import { leakyRelu, leakyReluDerivative } from './leakyReluModel.js';

const EXAMPLES = [
  { id: 'negative', label: 'Negative pre-activation', z: -3.2 },
  { id: 'near-zero', label: 'Near the kink', z: -0.4 },
  { id: 'positive', label: 'Active neuron', z: 2.1 },
];

function format(value) {
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && magnitude < 0.001) return value.toExponential(2);
  return value.toFixed(3).replace(/\.?0+$/, '');
}

function ActivationGraph({ alpha, z }) {
  const points = useMemo(() => Array.from({ length: 81 }, (_, index) => {
    const x = -4 + index * 0.1;
    return { x, y: leakyRelu(x, alpha) };
  }), [alpha]);
  const xToPct = (x) => 50 + x * 11;
  const yToPct = (y) => 70 - y * 14;
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xToPct(point.x)} ${yToPct(point.y)}`).join(' ');
  const reluPath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xToPct(point.x)} ${yToPct(Math.max(0, point.x))}`).join(' ');
  const active = { x: xToPct(z), y: yToPct(leakyRelu(z, alpha)) };

  return (
    <svg viewBox="0 0 100 100" className="h-72 w-full rounded-xl border border-slate-200 bg-white" role="img" aria-label="Leaky ReLU activation curve compared with ReLU">
      <line x1="6" y1="70" x2="94" y2="70" stroke="#cbd5e1" strokeWidth="0.8" />
      <line x1="50" y1="8" x2="50" y2="92" stroke="#cbd5e1" strokeWidth="0.8" />
      <path d={reluPath} fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="3 3" />
      <path d={path} fill="none" stroke="#2563eb" strokeWidth="2.4" />
      <circle cx={active.x} cy={active.y} r="3" fill="#f97316" stroke="white" strokeWidth="1.5" />
      <text x="8" y="14" className="fill-slate-500 text-[4px]">dashed = ReLU</text>
    </svg>
  );
}

function Stat({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Icon size={16} />{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
      <p className="mt-1 text-sm leading-5 text-slate-600">{note}</p>
    </div>
  );
}

export default function LeakyReluAnimation() {
  const [exampleId, setExampleId] = useState('negative');
  const [alpha, setAlpha] = useState(0.05);
  const [biasShift, setBiasShift] = useState(0);
  const [upstream, setUpstream] = useState(1.4);
  const base = EXAMPLES.find((item) => item.id === exampleId) ?? EXAMPLES[0];
  const z = base.z + biasShift;
  const output = leakyRelu(z, alpha);
  const slope = leakyReluDerivative(z, alpha);
  const backwardGradient = upstream * slope;
  const reluGradient = z > 0 ? upstream : 0;

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Activation functions</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">Leaky ReLU</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">Leaky ReLU replaces ReLU's exact negative-side zero slope with α. First inspect one local activation, then test what happens when that small slope is multiplied repeatedly through depth.</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 font-black text-slate-800"><SlidersHorizontal size={18} />Local controls</div>
            <label htmlFor="leaky-example" className="text-sm font-semibold text-slate-700">Scenario</label>
            <select id="leaky-example" value={exampleId} onChange={(event) => setExampleId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">{EXAMPLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
            <label htmlFor="leaky-alpha" className="mt-4 block text-sm font-semibold text-slate-700">Negative slope α: {alpha.toFixed(2)}</label>
            <input id="leaky-alpha" type="range" min="0" max="0.5" step="0.01" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
            <label htmlFor="leaky-bias" className="mt-4 block text-sm font-semibold text-slate-700">Bias shift: {biasShift.toFixed(1)}</label>
            <input id="leaky-bias" type="range" min="-2" max="2" step="0.1" value={biasShift} onChange={(event) => setBiasShift(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
            <label htmlFor="leaky-upstream" className="mt-4 block text-sm font-semibold text-slate-700">Upstream gradient: {upstream.toFixed(1)}</label>
            <input id="leaky-upstream" type="range" min="0.2" max="3" step="0.1" value={upstream} onChange={(event) => setUpstream(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <ActivationGraph alpha={alpha} z={z} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat icon={Gauge} label="Pre-activation" value={format(z)} note="The sign selects the local branch." />
              <Stat icon={Activity} label="Forward output" value={format(output)} note={`ReLU would output ${format(Math.max(0, z))}.`} />
              <Stat icon={LineChart} label="Local slope" value={format(slope)} note="This is one chain-rule multiplier, not the whole deep-network gradient." />
              <Stat icon={Zap} label="Backward gradient" value={format(backwardGradient)} note={`ReLU would pass ${format(reluGradient)} here.`} />
            </div>
          </div>
        </section>

        <LeakyReluDepthLab />

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <strong>Mistake to avoid:</strong> saying Leaky ReLU “solves vanishing gradients.” It removes ReLU's exact zero derivative on the negative branch, but repeated small derivatives can still attenuate the signal exponentially.
        </section>

        <AssessmentPanel lessonId="leaky-relu" title="Leaky ReLU check" />
      </div>
    </div>
  );
}
