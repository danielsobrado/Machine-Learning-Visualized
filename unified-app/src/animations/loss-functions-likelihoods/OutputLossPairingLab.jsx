import React, { useMemo, useState } from 'react';
import { AlertTriangle, Binary, RotateCcw, ShieldCheck } from 'lucide-react';
import {
  OUTPUT_CLASS_LABELS,
  OUTPUT_LOGIT_RANGE,
  OUTPUT_PAIRING_DEFAULTS,
  OUTPUT_PAIRING_TASKS,
} from './outputPairingConstants.js';
import { buildOutputPairingState } from './outputPairingModel.js';

function format(value) {
  const absolute = Math.abs(value);
  if (absolute >= 1000 || (absolute > 0 && absolute < 0.001)) return value.toExponential(2);
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function LogitControl({ index, value, disabled, onChange }) {
  return (
    <label className={`block rounded-lg border p-3 ${disabled ? 'border-slate-100 bg-slate-50 opacity-50' : 'border-slate-200 bg-white'}`} htmlFor={`pairing-logit-${index}`}>
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
        <span>Logit {OUTPUT_CLASS_LABELS[index]}</span>
        <strong className="font-mono text-slate-950">{format(value)}</strong>
      </span>
      <input
        id={`pairing-logit-${index}`}
        type="range"
        min={OUTPUT_LOGIT_RANGE.min}
        max={OUTPUT_LOGIT_RANGE.max}
        step={OUTPUT_LOGIT_RANGE.step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(index, Number(event.target.value))}
        className="mt-3 w-full accent-violet-700 disabled:cursor-not-allowed"
      />
    </label>
  );
}

export default function OutputLossPairingLab() {
  const [taskId, setTaskId] = useState(OUTPUT_PAIRING_DEFAULTS.task);
  const [logits, setLogits] = useState([...OUTPUT_PAIRING_DEFAULTS.logits]);
  const state = useMemo(() => buildOutputPairingState(taskId, logits), [taskId, logits]);

  const updateLogit = (index, value) => {
    setLogits((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  };

  const reset = () => {
    setTaskId(OUTPUT_PAIRING_DEFAULTS.task);
    setLogits([...OUTPUT_PAIRING_DEFAULTS.logits]);
  };

  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50/40 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><Binary size={16} /> Output contract lab</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Match target semantics, output logits, and loss</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            The number of outputs does not determine the loss. First decide whether targets are binary, exactly-one-of-K, or independent multilabel decisions. Then choose the output/loss contract that represents that structure.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3" role="group" aria-label="Target structure">
        {OUTPUT_PAIRING_TASKS.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => setTaskId(task.id)}
            aria-pressed={taskId === task.id}
            className={`min-h-11 rounded-lg border p-3 text-left ${taskId === task.id ? 'border-violet-500 bg-violet-100' : 'border-slate-200 bg-white'}`}
          >
            <strong className="block text-sm text-slate-950">{task.label}</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-600">{task.targetDescription}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {logits.map((value, index) => (
          <LogitControl
            key={OUTPUT_CLASS_LABELS[index]}
            index={index}
            value={value}
            disabled={taskId === 'binary' && index > 0}
            onChange={updateLogit}
          />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Target</p>
          <div className="mt-2 font-mono text-2xl font-black text-slate-950">[{state.task.target.join(', ')}]</div>
          <dl className="mt-4 grid gap-3 text-sm">
            <div><dt className="font-bold text-slate-500">Output head</dt><dd className="mt-1 text-slate-900">{state.task.head}</dd></div>
            <div><dt className="font-bold text-slate-500">Training loss</dt><dd className="mt-1 text-slate-900">{state.task.loss}</dd></div>
            <div><dt className="font-bold text-slate-500">Stable NLL</dt><dd className="mt-1 font-mono text-lg font-black text-slate-950">{format(state.loss)}</dd></div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Probabilities for interpretation</p>
          <div className="mt-4 space-y-3">
            {state.probabilities.map((probability, index) => (
              <div key={`${state.task.id}-${index}`} className="grid grid-cols-[32px_1fr_70px] items-center gap-3">
                <strong>{OUTPUT_CLASS_LABELS[index]}</strong>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                  <div className="h-full rounded-full bg-violet-600" style={{ width: `${Math.max(1, probability * 100)}%` }} />
                </div>
                <span className="text-right font-mono text-sm font-bold text-slate-800">{format(probability)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-950 px-3 py-2 text-sm text-white">
            Probability sum: <strong className="font-mono">{format(state.probabilitySum)}</strong>
            <span className="ml-2 text-slate-300">{taskId === 'multilabel' ? '(not constrained to 1)' : taskId === 'exclusive-multiclass' ? '(must be 1)' : '(single probability)'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <p className="flex items-center gap-2 font-black"><ShieldCheck size={17} /> Correct contract</p>
          <p className="mt-2">{state.contract}</p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
          <p className="flex items-center gap-2 font-black"><AlertTriangle size={17} /> Common wrong pairing</p>
          <p className="mt-2">{state.wrongPairing}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Numerical stability:</strong> the displayed training loss is computed from raw logits. Categorical loss uses log-sum-exp and binary losses use the stable softplus identity, so extreme logits do not require manually clipping probabilities before the logarithm.
      </div>
    </section>
  );
}
