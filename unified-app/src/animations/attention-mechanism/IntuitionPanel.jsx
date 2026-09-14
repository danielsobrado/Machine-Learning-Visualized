import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calculator, Pause, Play, RotateCcw } from 'lucide-react';

import { ATTENTION_ANIMATION_STEP_MS, ATTENTION_INTUITION_SCENARIOS, ATTENTION_PIPELINE_STAGES } from './attentionIntuitionScenarios.js';
import { scaledDotProductAttention } from './attentionModel.js';

function formatVector(vector) {
  return `[${vector.map((value) => value.toFixed(2)).join(', ')}]`;
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return reducedMotion;
}

export default function IntuitionPanel() {
  const [scenarioId, setScenarioId] = useState('library');
  const [stage, setStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const scenario = ATTENTION_INTUITION_SCENARIOS[scenarioId];

  const result = useMemo(() => scaledDotProductAttention({
    query: scenario.query,
    keys: scenario.items.map((item) => item.key),
    values: scenario.items.map((item) => item.value),
  }), [scenario]);

  useEffect(() => {
    if (!isRunning) return undefined;
    if (stage >= ATTENTION_PIPELINE_STAGES.length - 1) {
      setIsRunning(false);
      return undefined;
    }

    const timeout = window.setTimeout(() => setStage((current) => current + 1), ATTENTION_ANIMATION_STEP_MS);
    return () => window.clearTimeout(timeout);
  }, [isRunning, stage]);

  const selectScenario = (nextScenarioId) => {
    setScenarioId(nextScenarioId);
    setStage(0);
    setIsRunning(false);
  };

  const runAttention = () => {
    if (prefersReducedMotion) {
      setStage(ATTENTION_PIPELINE_STAGES.length - 1);
      setIsRunning(false);
      return;
    }
    if (stage >= ATTENTION_PIPELINE_STAGES.length - 1) setStage(0);
    setIsRunning(true);
  };

  const reset = () => {
    setStage(0);
    setIsRunning(false);
  };

  const weightTotal = result.weights.reduce((sum, weight) => sum + weight, 0);

  return (
    <div className="space-y-6 p-6 md:p-8">
      <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
        <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-700"><Calculator size={16} /> Attention intuition</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Attention is learned routing, followed by a weighted read.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Start with the idea, but keep the real computation visible: compare a query with keys, normalize the scores with softmax, then use those weights to combine values. The vectors below are deliberately small toy vectors so every number can be inspected.
        </p>
      </section>

      <section className="flex flex-wrap gap-2" aria-label="Attention intuition scenarios">
        {Object.entries(ATTENTION_INTUITION_SCENARIOS).map(([id, item]) => (
          <button
            key={id}
            type="button"
            onClick={() => selectScenario(id)}
            aria-pressed={scenarioId === id}
            className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${scenarioId === id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'}`}
          >
            {item.title}
          </button>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">Toy scenario</div>
            <h3 className="mt-1 text-xl font-black text-slate-950">{scenario.title}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{scenario.description}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={reset} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <RotateCcw size={16} /> Reset
            </button>
            <button
              type="button"
              onClick={isRunning ? () => setIsRunning(false) : runAttention}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? 'Pause' : stage === ATTENTION_PIPELINE_STAGES.length - 1 ? 'Run again' : 'Run attention'}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-4" aria-label="Attention computation stages">
          {ATTENTION_PIPELINE_STAGES.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => { setStage(index); setIsRunning(false); }}
              aria-current={stage === index ? 'step' : undefined}
              className={`rounded-xl border p-3 text-left transition-colors ${stage >= index ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}
            >
              <div className="text-xs font-black uppercase tracking-wide text-slate-500">Step {index + 1}</div>
              <div className="mt-1 text-sm font-bold text-slate-900">{label}</div>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-slate-950 p-4 text-white">
          <div className="text-xs font-black uppercase tracking-wide text-slate-400">Query · {scenario.queryLabel}</div>
          <div className="mt-1 font-mono text-xl font-black">Q = {formatVector(scenario.query)}</div>
          <div className="mt-1 text-xs text-slate-400">Scale divisor √dₖ = {result.divisor.toFixed(3)}</div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Key</th><th className="px-3 py-2">Value</th><th className="px-3 py-2">Q·K / √dₖ</th><th className="px-3 py-2">Softmax weight</th></tr>
            </thead>
            <tbody>
              {scenario.items.map((item, index) => (
                <tr key={item.label} className="border-t border-slate-200">
                  <td className="px-3 py-3 font-black text-slate-900">{item.label}</td>
                  <td className="px-3 py-3 font-mono">{formatVector(item.key)}</td>
                  <td className="px-3 py-3 font-mono">{formatVector(item.value)}</td>
                  <td className="px-3 py-3 font-mono">{stage >= 1 ? result.scores[index].toFixed(3) : '—'}</td>
                  <td className="px-3 py-3">
                    {stage >= 2 ? (
                      <div className="grid grid-cols-[1fr_64px] items-center gap-3">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${result.weights[index] * 100}%` }} /></div>
                        <span className="text-right font-mono font-black text-amber-700">{(result.weights[index] * 100).toFixed(1)}%</span>
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stage >= 2 && (
          <div className="mt-3 text-right text-xs font-bold text-slate-600" aria-live="polite">
            Softmax weights sum to {(weightTotal * 100).toFixed(1)}%
          </div>
        )}

        {stage >= 3 && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
            <ArrowRight className="mt-0.5 shrink-0 text-emerald-700" size={18} />
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Weighted value output</div>
              <div className="mt-1 font-mono text-2xl font-black text-emerald-950">{formatVector(result.output)}</div>
              <p className="mt-2 text-sm leading-6 text-emerald-900">{scenario.takeaway}</p>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 text-sm leading-6 text-blue-950">
        <strong>Keep the distinction:</strong> the softmax numbers are routing coefficients for one query. They are not arbitrary relevance percentages, and they are not by themselves a complete explanation of the model's final prediction.
      </section>
    </div>
  );
}
