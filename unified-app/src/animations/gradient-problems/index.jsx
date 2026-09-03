import React, { useMemo, useState } from 'react';
import { Route, TrendingDown, TrendingUp } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import GradientChainWorkbench from './GradientChainWorkbench.jsx';
import GradientClippingLab from './GradientClippingLab.jsx';
import {
  GRADIENT_PRESETS,
  GRADIENT_PROBLEM_DEFAULTS,
} from './gradientProblemsConstants.js';
import { buildGradientTrace } from './gradientProblemsModel.js';

function configFromPreset(presetId, current = GRADIENT_PROBLEM_DEFAULTS) {
  const preset = GRADIENT_PRESETS[presetId];
  if (!preset) return current;
  return {
    ...current,
    ...preset,
    presetId,
    useResidual: false,
  };
}

export default function GradientProblemsAnimation() {
  const [config, setConfig] = useState(() => configFromPreset(GRADIENT_PROBLEM_DEFAULTS.presetId));
  const [clipNorm, setClipNorm] = useState(GRADIENT_PROBLEM_DEFAULTS.clipNorm);
  const trace = useMemo(() => buildGradientTrace(config), [config]);

  const handlePreset = (presetId) => setConfig((current) => configFromPreset(presetId, current));

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-rose-700">
            <Route size={17} /> Backpropagation stability
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Gradient Problems</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            Vanishing and exploding gradients are consequences of the actual local derivatives encountered along a
            backward path. Build the forward states, inspect each derivative, then separate architectural fixes from
            optimizer guardrails.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"><TrendingDown size={16} className="mr-1 inline" /><strong>Vanishing:</strong> repeated contraction, saturation, or blocked paths erase upstream signal.</div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-950"><TrendingUp size={16} className="mr-1 inline" /><strong>Exploding:</strong> repeated expansion makes activations or gradients grow across depth.</div>
            <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-950"><Route size={16} className="mr-1 inline" /><strong>Different tools:</strong> residual paths change the chain; clipping only limits parameter gradients after it.</div>
          </div>
        </header>

        <GradientChainWorkbench config={config} onConfigChange={setConfig} onPreset={handlePreset} />
        <GradientClippingLab trace={trace} clipNorm={clipNorm} onClipNormChange={setClipNorm} />

        <AssessmentPanel lessonId="gradient-problems" title="Gradient problems check" />
      </div>
    </div>
  );
}
