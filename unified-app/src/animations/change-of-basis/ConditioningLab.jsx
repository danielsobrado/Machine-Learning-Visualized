import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { conditionNumber2, determinant, perturbationAmplification } from './changeOfBasisModel.js';

const STABLE = { b1: [1, 0], b2: [0, 1] };
const FRAGILE = { b1: [1, 0], b2: [1, 0.01] };
const VECTOR = [2, 0.01];
const PERTURBATION = [0, 0.001];

function Card({ title, basis }) {
  const condition = conditionNumber2(basis);
  const experiment = perturbationAmplification({ ...basis, vector: VECTOR, perturbation: PERTURBATION });
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div><span className="block text-xs text-slate-500">det(B)</span><strong className="font-mono">{determinant(basis.b1, basis.b2).toFixed(4)}</strong></div>
        <div><span className="block text-xs text-slate-500">κ₂(B)</span><strong className="font-mono">{condition.toFixed(1)}</strong></div>
        <div><span className="block text-xs text-slate-500">||δx||₂</span><strong className="font-mono">{experiment.inputDeltaNorm.toFixed(4)}</strong></div>
        <div><span className="block text-xs text-slate-500">coordinate amplification</span><strong className="font-mono">{experiment.amplification.toFixed(1)}×</strong></div>
      </div>
      <p className="mt-3 font-mono text-xs text-slate-600">coords: [{experiment.original.map((v) => v.toFixed(2)).join(', ')}] → [{experiment.perturbed.map((v) => v.toFixed(2)).join(', ')}]</p>
    </div>
  );
}

export default function ConditioningLab() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={20} />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-amber-700">Conditioning failure lab</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Invertible does not mean numerically safe</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">The fragile basis vectors are almost parallel. A vertical perturbation of only 0.001 changes the coordinate recipe by roughly 140× that input perturbation.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card title="Orthogonal basis" basis={STABLE} />
        <Card title="Nearly collinear basis" basis={FRAGILE} />
      </div>
      <p className="mt-4 rounded-xl border border-amber-200 bg-white p-4 text-sm leading-6 text-slate-700"><strong>Why determinant is not enough:</strong> det(B) tells you singular vs invertible, but its magnitude changes when you merely rescale the basis. The condition number measures sensitivity to perturbations.</p>
    </section>
  );
}
