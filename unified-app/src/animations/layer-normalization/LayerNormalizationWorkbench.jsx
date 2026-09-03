import React, { useMemo, useState } from 'react';
import { Activity, Braces, GitBranch, Scale, SlidersHorizontal } from 'lucide-react';
import FeatureVector from './FeatureVector.jsx';
import NormalizationComparison from './NormalizationComparison.jsx';
import {
  AFFINE_PROFILES,
  TOKEN_CASES,
} from './layerNormalizationConstants.js';
import { transformerNormStep } from './layerNormalizationModel.js';

function Metric({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-950">{value}</div>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function ParameterStrip({ gamma, beta }) {
  return (
    <div className="overflow-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[620px] text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2 text-left">Parameter</th>
            {gamma.map((_, index) => <th key={index} className="px-3 py-2 text-right">h{index + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-200">
            <td className="px-3 py-2 font-bold text-slate-800">γ scale</td>
            {gamma.map((value, index) => <td key={index} className="px-3 py-2 text-right font-mono">{value.toFixed(2)}</td>)}
          </tr>
          <tr className="border-t border-slate-200">
            <td className="px-3 py-2 font-bold text-slate-800">β shift</td>
            {beta.map((value, index) => <td key={index} className="px-3 py-2 text-right font-mono">{value.toFixed(2)}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function LayerNormalizationWorkbench() {
  const [tokenId, setTokenId] = useState('spiky');
  const [affineId, setAffineId] = useState('identity');
  const [contextId, setContextId] = useState('ordinary');
  const [mode, setMode] = useState('pre');
  const [branchStrength, setBranchStrength] = useState(1);

  const token = TOKEN_CASES[tokenId];
  const affine = AFFINE_PROFILES[affineId];
  const step = useMemo(() => transformerNormStep(token.values, {
    mode,
    gamma: affine.gamma,
    beta: affine.beta,
    branchStrength,
  }), [affine.beta, affine.gamma, branchStrength, mode, token.values]);
  const normalizationInput = mode === 'pre' ? token.values : step.residualInput;
  const normalizedVariance = step.normalization.normalizedStats.variance;

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-violet-700">
          <Scale size={17} />
          Normalize the right axis
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">Layer Normalization Workbench</h1>
        <p className="mt-2 max-w-4xl text-slate-700">
          LayerNorm computes statistics across one token's hidden features. Trace the exact vector through standardization,
          featurewise γ/β, and a transformer residual block—then change another batch row to prove which normalization is coupled to it.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-950">
            <SlidersHorizontal size={18} /> Experiment controls
          </div>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Token case
              <select value={tokenId} onChange={(event) => setTokenId(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
                {Object.entries(TOKEN_CASES).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Residual placement
              <select value={mode} onChange={(event) => setMode(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
                <option value="pre">Pre-norm: x + F(LN(x))</option>
                <option value="post">Post-norm: LN(x + F(x))</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Affine parameters
              <select value={affineId} onChange={(event) => setAffineId(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
                {Object.entries(AFFINE_PROFILES).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              <span className="flex items-center justify-between"><span>Teaching sublayer strength</span><span>{branchStrength.toFixed(2)}</span></span>
              <input type="range" min="0" max="2" step="0.05" value={branchStrength} onChange={(event) => setBranchStrength(Number(event.target.value))} className="mt-2 w-full accent-violet-700" />
            </label>
          </div>
          <div className="mt-5 rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs text-violet-950">
            <strong>F(·)</strong> is a small deterministic teaching transform, not an attention implementation. Its job is to make the dependency path visible.
          </div>
        </aside>

        <main className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Input μ" value={step.normalization.inputStats.mean.toFixed(3)} helper="Mean across the vector entering LayerNorm." />
            <Metric label="Input variance" value={step.normalization.inputStats.variance.toFixed(3)} helper="Population variance across normalized features." />
            <Metric label="Pre-affine variance" value={normalizedVariance.toFixed(6)} helper="σ²/(σ²+ε); near 1 only when variance dominates ε." />
            <Metric label="Post-affine μ" value={step.normalization.outputStats.mean.toFixed(3)} helper="γ/β can restore nonzero mean and nonunit scale." />
          </div>

          <section className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-200">
              <GitBranch size={16} /> Causal transformer path
            </div>
            <div className="mt-3 font-mono text-sm md:text-base">
              {mode === 'pre' ? 'x  →  LN(x; γ,β)  →  F(·)  →  + x' : 'x  →  F(x)  →  + x  →  LN(·; γ,β)'}
            </div>
            <p className="mt-2 text-xs text-slate-300">
              In pre-norm mode, changing γ/β changes what F receives and therefore changes the branch output. The residual path remains direct.
            </p>
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <FeatureVector title="LayerNorm input" values={normalizationInput} helper={mode === 'pre' ? 'Raw token x' : 'Residual update x + F(x)'} accentClass="bg-slate-500" />
            <FeatureVector title="After γ/β" values={step.normalization.output} helper="Learned affine output; not required to stay standardized." accentClass="bg-violet-600" />
            <FeatureVector title="Block output" values={step.output} helper={mode === 'pre' ? 'x + F(LN(x))' : 'LN(x + F(x))'} accentClass="bg-emerald-600" />
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-950"><Braces size={18} className="text-violet-700" /> Featurewise affine parameters</div>
            <p className="mt-1 text-sm text-slate-600">Real transformer LayerNorm normally learns one γ and one β per hidden feature—not one global scalar.</p>
            <div className="mt-3"><ParameterStrip gamma={affine.gamma} beta={affine.beta} /></div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-950"><Activity size={18} className="text-violet-700" /> Exact transformation</div>
            <div className="mt-3 overflow-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-3 py-2 text-left">Feature</th><th className="px-3 py-2 text-right">Raw</th><th className="px-3 py-2 text-right">Centered</th><th className="px-3 py-2 text-right">Standardized</th><th className="px-3 py-2 text-right">γ</th><th className="px-3 py-2 text-right">β</th><th className="px-3 py-2 text-right">Affine output</th></tr>
                </thead>
                <tbody>
                  {normalizationInput.map((value, index) => (
                    <tr key={index} className="border-t border-slate-200">
                      <td className="px-3 py-2 font-bold">h{index + 1}</td>
                      <td className="px-3 py-2 text-right font-mono">{value.toFixed(3)}</td>
                      <td className="px-3 py-2 text-right font-mono">{step.normalization.centered[index].toFixed(3)}</td>
                      <td className="px-3 py-2 text-right font-mono">{step.normalization.normalized[index].toFixed(3)}</td>
                      <td className="px-3 py-2 text-right font-mono">{affine.gamma[index].toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-mono">{affine.beta[index].toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-mono">{step.normalization.output[index].toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </section>

      <NormalizationComparison token={token.values} contextId={contextId} onContextChange={setContextId} />

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-950">Axis test</h3><p className="mt-2 text-sm text-slate-600">For [batch, sequence, d_model], standard transformer LayerNorm usually normalizes each token across d_model.</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-950">ε test</h3><p className="mt-2 text-sm text-slate-600">Choose the near-constant token. ε keeps division finite; the standardized vector becomes zero rather than NaN.</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-950">Affine trap</h3><p className="mt-2 text-sm text-slate-600">Switch to featurewise learned affine. Zero mean and near-unit variance describe the standardized vector, not necessarily the final LayerNorm output.</p></div>
      </section>
    </div>
  );
}
