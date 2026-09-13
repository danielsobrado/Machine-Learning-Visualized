import React, { useMemo, useState } from 'react';
import { BarTrack, Formula, Note, Plate, Readouts, Slider, Steps } from '../_shared/notebook';
import { COUNT_FAMILY_DEFAULTS, COUNT_FAMILY_LIMITS, COUNT_FAMILY_PRESETS } from './countFamilyConstants.js';
import { buildCountFamilyLab } from './countFamilyModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

function CountPmfPlot({ families }) {
  const width = 620;
  const height = 230;
  const pad = 36;
  const points = families[0].points;
  const maxProbability = Math.max(...families.flatMap((family) => family.points.map((point) => point.probability)), 1e-9);
  const groupWidth = (width - pad * 2) / points.length;
  const barWidth = Math.max(2, groupWidth / 4.2);
  const tones = ['#0891b2', '#7c3aed', '#e11d48'];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Poisson, Negative Binomial, and zero-inflated Poisson probability masses">
      <line x1={pad} x2={width - pad} y1={height - pad} y2={height - pad} stroke="#94a3b8" />
      {points.map((point, pointIndex) => {
        const center = pad + groupWidth * (pointIndex + 0.5);
        return (
          <g key={point.k}>
            {families.map((family, familyIndex) => {
              const probability = family.points[pointIndex].probability;
              const barHeight = (probability / maxProbability) * (height - pad * 2);
              const x = center + (familyIndex - 1) * barWidth - barWidth / 2;
              return <rect key={family.id} x={x} y={height - pad - barHeight} width={barWidth} height={barHeight} rx="1" fill={tones[familyIndex]} />;
            })}
            {(point.k % 2 === 0 || point.k === points.length - 1) && <text x={center} y={height - 12} textAnchor="middle" fontSize="10" fill="#64748b">{point.k}</text>}
          </g>
        );
      })}
      <text x={pad} y="18" fontSize="11" fontWeight="800" fill="#0891b2">Poisson</text>
      <text x={pad + 92} y="18" fontSize="11" fontWeight="800" fill="#7c3aed">Negative Binomial</text>
      <text x={pad + 236} y="18" fontSize="11" fontWeight="800" fill="#e11d48">Zero-inflated Poisson</text>
      <text x={width - pad} y={height - 12} textAnchor="end" fontSize="10" fill="#64748b">count k</text>
    </svg>
  );
}

export default function CountFamilyLab() {
  const [scenario, setScenario] = useState(COUNT_FAMILY_DEFAULTS);
  const lab = useMemo(() => buildCountFamilyLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const applyPreset = (values) => setScenario((current) => ({ ...current, ...values }));
  const [poisson, negativeBinomial, zeroInflatedPoisson] = lab.families;

  return (
    <Plate label="4 · Count-family diagnosis" title="Same mean, very different count assumptions">
      <p className="text-sm leading-6 text-slate-700">
        Keep the expected count fixed, then change latent heterogeneity or structural zeros. This isolates why Poisson, Negative Binomial, and zero-inflated models behave differently instead of treating them as interchangeable curve shapes.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {COUNT_FAMILY_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="ds-btn" onClick={() => applyPreset(preset.values)}>{preset.label}</button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Slider label="Target mean count" value={scenario.mean} {...COUNT_FAMILY_LIMITS.mean} onChange={(value) => update('mean', value)} />
        <Slider label="NB shape r" value={scenario.shape} {...COUNT_FAMILY_LIMITS.shape} help="Small r means stronger overdispersion; large r approaches Poisson." onChange={(value) => update('shape', value)} />
        <Slider label="Structural-zero fraction π" value={scenario.zeroInflation} {...COUNT_FAMILY_LIMITS.zeroInflation} format={pct} help="Extra zeros come from a separate always-zero state." onChange={(value) => update('zeroInflation', value)} />
      </div>

      <div className="mt-5">
        <CountPmfPlot families={lab.families} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {lab.families.map((family) => (
          <div key={family.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <strong className="block text-sm text-slate-950">{family.label}</strong>
            <Readouts columns={3} items={[
              { label: 'Mean', value: family.mean.toFixed(2), detail: 'held fixed' },
              { label: 'Variance', value: family.variance.toFixed(2), detail: `variance / mean ${(family.variance / family.mean).toFixed(2)}` },
              { label: 'P(X=0)', value: pct(family.zeroProbability), detail: family.poissonMean ? `active Poisson λ=${family.poissonMean.toFixed(2)}` : 'model-implied zero mass' },
            ]} />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <BarTrack label="Poisson variance / mean" value={lab.diagnostics.poissonDispersionRatio.toFixed(2)} width={Math.min(100, lab.diagnostics.poissonDispersionRatio * 28)} tone="accent" />
          <BarTrack label="Negative Binomial variance / mean" value={lab.diagnostics.negativeBinomialDispersionRatio.toFixed(2)} width={Math.min(100, lab.diagnostics.negativeBinomialDispersionRatio * 28)} tone="warn" />
          <BarTrack label="Zero-inflated variance / mean" value={lab.diagnostics.zeroInflatedDispersionRatio.toFixed(2)} width={Math.min(100, lab.diagnostics.zeroInflatedDispersionRatio * 28)} tone="warn" />
        </div>
        <Steps items={[
          { title: 'Poisson means equidispersion', pass: true, body: `Poisson forces Var(X)=E[X]=${poisson.mean.toFixed(2)}. If observed variance is much larger, that assumption is already suspicious.` },
          { title: 'Negative Binomial models heterogeneous rates', pass: negativeBinomial.variance > poisson.variance, body: `With r=${scenario.shape}, variance rises to ${negativeBinomial.variance.toFixed(2)} without inventing a separate structural-zero process.` },
          { title: 'Zero inflation is a mixture assumption', pass: scenario.zeroInflation > 0, body: scenario.zeroInflation > 0 ? `${pct(scenario.zeroInflation)} of cases are structurally zero; the remaining cases follow a Poisson process.` : 'Set π above zero to introduce a separate structural-zero state.' },
        ]} />
      </div>

      <Formula lines={[
        'Poisson: E[X] = Var(X) = μ',
        'Negative Binomial: Var(X) = μ + μ²/r',
        'Zero-inflated Poisson: X = 0 with probability π, otherwise X ~ Poisson(λ)',
      ]} />

      <Note tone="accent" label="Model-selection warning" title="Extra zeros alone do not prove zero inflation">
        <p>Negative Binomial heterogeneity can also create more zeros and a heavier tail than Poisson. Diagnose the full count distribution and the data-generating story; use a structural-zero model only when a separate always-zero process is plausible.</p>
      </Note>
    </Plate>
  );
}
