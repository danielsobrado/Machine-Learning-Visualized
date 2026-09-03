import React from 'react';
import { AlertTriangle, Layers3, Split } from 'lucide-react';
import {
  AFFINE_STACK,
  affineStackExperiment,
  xorExpressivityTable,
} from './neuralNetworkExpressivityModel';

const SAMPLE_INPUT = [1, 1];

function NumberVector({ values }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value, index) => (
        <span key={index} className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-sm text-slate-900">
          {Number(value.toFixed(3))}
        </span>
      ))}
    </div>
  );
}

export default function ExpressivityLab() {
  const affine = affineStackExperiment(SAMPLE_INPUT, AFFINE_STACK);
  const xorRows = xorExpressivityTable();

  return (
    <section className="mx-auto mt-6 max-w-7xl rounded-xl border border-amber-300 bg-amber-50 p-5 text-slate-900 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-amber-800">Expressivity failure lab</div>
          <h2 className="mt-1 text-2xl font-bold">Depth without nonlinearity is fake depth</h2>
          <p className="mt-2 max-w-4xl text-sm text-slate-700">
            Stacking affine layers does not create a more expressive decision boundary. The matrices multiply together and
            the biases combine, so the entire stack is exactly one affine transform. A hidden activation is what prevents
            that collapse.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <Layers3 size={18} />
            Two affine layers collapse exactly
          </div>
          <p className="mt-2 text-sm text-slate-600">
            For x = [{SAMPLE_INPUT.join(', ')}], the explicit two-layer stack and its collapsed single layer produce the
            same output.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">hidden vector</div>
              <div className="mt-2"><NumberVector values={affine.hidden} /></div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">stacked output</div>
              <div className="mt-2"><NumberVector values={affine.stackedOutput} /></div>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">collapsed output</div>
              <div className="mt-2"><NumberVector values={affine.collapsedOutput} /></div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
            W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂)
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <Split size={18} />
            One tiny ReLU layer solves XOR
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Use h₁ = ReLU(x₁ − x₂), h₂ = ReLU(x₂ − x₁), then output h₁ + h₂. The activation creates the bend a single
            affine boundary cannot make.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="pb-2">x₁</th>
                  <th className="pb-2">x₂</th>
                  <th className="pb-2">h₁</th>
                  <th className="pb-2">h₂</th>
                  <th className="pb-2">output</th>
                  <th className="pb-2">target</th>
                </tr>
              </thead>
              <tbody>
                {xorRows.map((row) => (
                  <tr key={row.input.join('-')} className="border-t border-slate-100">
                    <td className="py-2 font-mono">{row.input[0]}</td>
                    <td className="py-2 font-mono">{row.input[1]}</td>
                    <td className="py-2 font-mono">{row.hidden[0]}</td>
                    <td className="py-2 font-mono">{row.hidden[1]}</td>
                    <td className="py-2 font-mono font-bold text-emerald-700">{row.output}</td>
                    <td className="py-2 font-mono">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-white p-4 text-sm text-slate-700">
        <strong className="text-slate-950">Correction:</strong> XOR does not merely “need hidden layers.” It needs a
        nonlinear transformation somewhere in the stack. Ten hidden affine layers are still one affine layer in disguise.
      </div>
    </section>
  );
}
