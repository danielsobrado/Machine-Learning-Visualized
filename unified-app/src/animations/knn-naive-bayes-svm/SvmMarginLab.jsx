import React from 'react';
import { MoveHorizontal } from 'lucide-react';
import { SVM_FIT } from './knnNaiveBayesSvmConstants.js';

export default function SvmMarginLab({ c, fit, onCChange }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><MoveHorizontal size={15} /> Fitted SVM trade-off</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">C changes the fitted margin, not just an annotation.</h3>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            The shared boundary is refitted from the training points with a linear soft-margin hinge objective. Small C tolerates more points inside the margin to keep weights small; larger C penalizes those violations more strongly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SVM_FIT.cOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onCChange(option)}
              className={`rounded-lg border px-3 py-2 text-sm font-black ${c === option ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
            >
              C={option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Margin width</p>
          <strong className="mt-1 block text-2xl text-slate-950">{fit.marginWidth.toFixed(2)}</strong>
          <span className="text-sm text-slate-600">2 / ||w|| in feature-space units</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Inside margin</p>
          <strong className="mt-1 block text-2xl text-slate-950">{fit.marginViolations}</strong>
          <span className="text-sm text-slate-600">functional margin below 1</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Training errors</p>
          <strong className="mt-1 block text-2xl text-slate-950">{fit.trainingErrors}</strong>
          <span className="text-sm text-slate-600">wrong side of fitted boundary</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Fitted weights</p>
          <strong className="mt-1 block font-mono text-base text-slate-950">[{fit.weight.map((value) => value.toFixed(2)).join(', ')}]</strong>
          <span className="text-sm text-slate-600">bias {fit.bias.toFixed(2)}</span>
        </div>
      </div>

      <p className="mt-4 rounded-lg bg-violet-50 p-4 text-sm leading-6 text-violet-950">
        C is a regularization trade-off, not a universal “higher is better” dial. The correct setting must be selected on validation data, and nonlinear geometry may require a different feature representation or kernel rather than extreme C.
      </p>
    </section>
  );
}
