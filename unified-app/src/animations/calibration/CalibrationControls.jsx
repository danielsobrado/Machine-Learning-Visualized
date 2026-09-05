import React from 'react';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import {
  RECALIBRATION_METHODS,
  SHIFT_SCENARIOS,
} from './calibrationConstants.js';

export default function CalibrationControls({ scenarioId, method, onScenarioChange, onMethodChange }) {
  const scenario = SHIFT_SCENARIOS[scenarioId];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
        <SlidersHorizontal size={16} /> Shift and recalibration controls
      </div>

      <div>
        <span className="text-sm font-bold text-slate-700">1. What happened in production?</span>
        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(SHIFT_SCENARIOS).map(([id, config]) => (
            <button
              key={id}
              type="button"
              onClick={() => onScenarioChange(id)}
              className={`rounded-lg border p-3 text-left transition ${
                scenarioId === id
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300'
              }`}
            >
              <span className="block text-sm font-black">{config.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{config.short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-700">2. Which mapping should you test?</span>
          <button
            type="button"
            onClick={() => onMethodChange(scenario.recommendedMethod)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white"
          >
            <Sparkles size={14} /> Use scenario recommendation
          </button>
        </div>
        <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(RECALIBRATION_METHODS).map(([id, config]) => (
            <button
              key={id}
              type="button"
              onClick={() => onMethodChange(id)}
              className={`rounded-lg border p-3 text-left transition ${
                method === id
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'
              }`}
            >
              <span className="block text-sm font-black">{config.label}</span>
              <span className="mt-1 block text-xs font-semibold leading-5 opacity-80">{config.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[0.65fr_1.35fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Scenario diagnosis</p>
          <strong className="mt-1 block text-sm text-slate-950">{scenario.diagnosis}</strong>
        </div>
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-800">Why this response?</p>
          <p className="mt-1 text-sm leading-6 text-cyan-950">{scenario.reason}</p>
        </div>
      </div>
    </section>
  );
}
