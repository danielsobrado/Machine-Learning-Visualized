import React, { useMemo, useState } from 'react';
import { Braces, CheckCircle2, RotateCcw, Shuffle, Users } from 'lucide-react';
import {
  EVALUATION_MODE_DEFAULTS,
  EVALUATION_MODE_SCENARIOS,
} from './evaluationModeConstants.js';
import { buildEvaluationModeState } from './evaluationModeModel.js';

function StateCard({ icon: Icon, title, active, activeText, inactiveText }) {
  return (
    <div className={`rounded-xl border p-4 ${active ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <div className="flex items-center gap-2 font-black text-slate-950"><Icon size={17} /> {title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{active ? activeText : inactiveText}</p>
    </div>
  );
}

export default function EvaluationModeContractLab() {
  const [trainingMode, setTrainingMode] = useState(EVALUATION_MODE_DEFAULTS.trainingMode);
  const [recordGradients, setRecordGradients] = useState(EVALUATION_MODE_DEFAULTS.recordGradients);
  const state = useMemo(
    () => buildEvaluationModeState({ trainingMode, recordGradients }),
    [recordGradients, trainingMode],
  );

  const applyScenario = (scenario) => {
    setTrainingMode(scenario.trainingMode);
    setRecordGradients(scenario.recordGradients);
  };

  const reset = () => {
    setTrainingMode(EVALUATION_MODE_DEFAULTS.trainingMode);
    setRecordGradients(EVALUATION_MODE_DEFAULTS.recordGradients);
  };

  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Two independent switches</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Evaluation mode is not the same as disabling gradients</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            In PyTorch-style workflows, module mode controls layers such as Dropout and BatchNorm. Gradient recording controls whether autograd builds a backward graph. Those settings solve different problems and neither one automatically changes the other.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {EVALUATION_MODE_SCENARIOS.map((scenario) => (
          <button key={scenario.id} type="button" onClick={() => applyScenario(scenario)} className="rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-300">
            <strong className="block text-sm text-slate-950">{scenario.label}</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-600">{scenario.description}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          aria-pressed={trainingMode}
          onClick={() => setTrainingMode((value) => !value)}
          className={`min-h-11 rounded-xl border p-4 text-left ${trainingMode ? 'border-amber-400 bg-amber-100' : 'border-emerald-400 bg-emerald-100'}`}
        >
          <strong className="block text-sm text-slate-950">Module mode: {trainingMode ? 'training' : 'evaluation'}</strong>
          <span className="mt-1 block text-xs text-slate-600">Controls Dropout and BatchNorm behavior.</span>
        </button>
        <button
          type="button"
          aria-pressed={recordGradients}
          onClick={() => setRecordGradients((value) => !value)}
          className={`min-h-11 rounded-xl border p-4 text-left ${recordGradients ? 'border-amber-400 bg-amber-100' : 'border-emerald-400 bg-emerald-100'}`}
        >
          <strong className="block text-sm text-slate-950">Gradient recording: {recordGradients ? 'on' : 'off'}</strong>
          <span className="mt-1 block text-xs text-slate-600">Controls whether an autograd graph is recorded.</span>
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <StateCard
          icon={Shuffle}
          title="Dropout"
          active={state.dropoutStochastic}
          activeText="Stochastic masks are active because the module is in training mode."
          inactiveText="Ordinary dropout sampling is disabled because the module is in evaluation mode."
        />
        <StateCard
          icon={Users}
          title="BatchNorm"
          active={state.batchNormUsesBatchStats}
          activeText="Current-batch statistics are used and running state is updated."
          inactiveText="Stored running statistics are used; request neighbors do not define the normalization."
        />
        <StateCard
          icon={Braces}
          title="Autograd"
          active={state.autogradRecordsGraph}
          activeText="Operations are recorded for a possible backward pass even though module behavior may be in evaluation mode."
          inactiveText="No backward graph is recorded, but that alone says nothing about Dropout or BatchNorm mode."
        />
      </div>

      <div className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${state.ordinaryInferenceReady ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : 'border-amber-300 bg-amber-50 text-amber-950'}`}>
        <div className="flex items-center gap-2 font-black"><CheckCircle2 size={17} /> Ordinary inference contract</div>
        <p className="mt-1">
          {state.ordinaryInferenceReady
            ? 'Evaluation behavior is active and no gradient graph is being recorded.'
            : 'This combination can be intentional, but it is not the ordinary deterministic inference configuration. Check whether the workflow deliberately needs training-mode layers or gradients.'}
        </p>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-600">
        Intentional exceptions exist: Monte Carlo Dropout may deliberately sample Dropout at inference, while saliency and other gradient-based analyses may deliberately record gradients in evaluation mode. The important rule is to configure both axes intentionally.
      </p>
    </section>
  );
}
