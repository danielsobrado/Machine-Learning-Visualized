import React, { useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle2, Eye, RotateCcw, XCircle } from 'lucide-react';
import {
  ACTIVATION_PROFILES,
  ARCHITECTURE_PRESETS,
  INITIALIZATION_METHODS,
} from './initializationConstants.js';
import { analyzeInitialization } from './initializationModel.js';

const HEALTH_OPTIONS = Object.freeze(['vanishing', 'stable', 'exploding']);

function PredictionButtons({ label, value, onChange, revealed, actual }) {
  return (
    <div>
      <div className="text-sm font-black text-slate-800">{label}</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {HEALTH_OPTIONS.map((option) => {
          const selected = value === option;
          const correct = revealed && option === actual;
          const wrong = revealed && selected && option !== actual;
          return (
            <button
              key={option}
              type="button"
              onClick={() => !revealed && onChange(option)}
              className={`rounded-xl border px-3 py-2 text-sm font-black capitalize transition ${
                correct
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : wrong
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : selected
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function InitializationPredictionLab() {
  const [architectureId, setArchitectureId] = useState('bottleneck');
  const [activation, setActivation] = useState('relu');
  const [method, setMethod] = useState('heFanIn');
  const [layers, setLayers] = useState(6);
  const [forwardPrediction, setForwardPrediction] = useState('stable');
  const [backwardPrediction, setBackwardPrediction] = useState('vanishing');
  const [revealed, setRevealed] = useState(false);

  const architecture = ARCHITECTURE_PRESETS[architectureId];
  const result = useMemo(() => analyzeInitialization({
    method,
    activation,
    inputWidth: architecture.inputWidth,
    hiddenWidth: architecture.hiddenWidth,
    layers,
  }), [activation, architecture.hiddenWidth, architecture.inputWidth, layers, method]);

  const bothCorrect = forwardPrediction === result.forwardHealth && backwardPrediction === result.backwardHealth;
  const resetPrediction = () => {
    setForwardPrediction('stable');
    setBackwardPrediction('stable');
    setRevealed(false);
  };

  return (
    <section className="space-y-5 rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700"><BrainCircuit size={16} /> Prediction lab</div>
          <h2 className="mt-1 text-xl font-black text-slate-950">Predict the signal before revealing it.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Initialization is easier to remember when you first commit to a prediction. Change the activation, shape and fan rule, then decide what happens to forward activations and backward gradients through depth.</p>
        </div>
        <button type="button" onClick={resetPrediction} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700"><RotateCcw size={15} /> Reset prediction</button>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-bold text-slate-700">Architecture<select value={architectureId} onChange={(event) => { setArchitectureId(event.target.value); setRevealed(false); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2">{Object.entries(ARCHITECTURE_PRESETS).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold text-slate-700">Activation<select value={activation} onChange={(event) => { setActivation(event.target.value); setRevealed(false); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2">{Object.entries(ACTIVATION_PROFILES).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold text-slate-700">Initializer<select value={method} onChange={(event) => { setMethod(event.target.value); setRevealed(false); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2">{Object.entries(INITIALIZATION_METHODS).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-bold text-slate-700">Depth: {layers}<input type="range" min="2" max="10" step="1" value={layers} onChange={(event) => { setLayers(Number(event.target.value)); setRevealed(false); }} /></label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <PredictionButtons label="Forward activations will be…" value={forwardPrediction} onChange={setForwardPrediction} revealed={revealed} actual={result.forwardHealth} />
        <PredictionButtons label="Backward gradients will be…" value={backwardPrediction} onChange={setBackwardPrediction} revealed={revealed} actual={result.backwardHealth} />
      </div>

      {!revealed ? (
        <button type="button" onClick={() => setRevealed(true)} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-violet-700"><Eye size={16} /> Reveal propagation</button>
      ) : (
        <div className={`rounded-xl border p-4 ${bothCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
          <div className="flex items-center gap-2 font-black text-slate-950">{bothCorrect ? <CheckCircle2 className="text-emerald-700" size={18} /> : <XCircle className="text-amber-700" size={18} />}{bothCorrect ? 'Prediction matched both paths' : 'Compare the path you missed'}</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-3 text-sm"><strong>Forward:</strong> {result.forwardHealth} · final second moment {result.finalForward.toPrecision(4)}</div>
            <div className="rounded-lg bg-white p-3 text-sm"><strong>Backward:</strong> {result.backwardHealth} · final second moment {result.finalBackward.toPrecision(4)}</div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{architecture.description} The same initializer can protect one direction while damaging the other on a rectangular transition. That is why activation and fan geometry matter together.</p>
        </div>
      )}
    </section>
  );
}
