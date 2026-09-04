import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Formula,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
  Steps,
} from '../_shared/notebook';
import {
  BERNOULLI_DATASETS,
  CONTROL_LIMITS,
  DEFAULT_SCENARIO,
  GAUSSIAN_DATASETS,
} from './mleConfig.js';
import { buildBernoulliLab, buildGaussianLab } from './mleModel.js';

const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function relativePath(curve) {
  return curve.map((point, index) => {
    const x = 42 + point.p * 360;
    const y = 198 - point.relative * 155;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function bernoulliX(value) {
  return 42 + value * 360;
}

function surfaceX(value, surface) {
  const ratio = (value - surface.muMin) / (surface.muMax - surface.muMin);
  return 54 + Math.max(0, Math.min(1, ratio)) * 320;
}

function surfaceY(value, surface) {
  const ratio = (value - surface.sigmaMin) / (surface.sigmaMax - surface.sigmaMin);
  return 226 - Math.max(0, Math.min(1, ratio)) * 184;
}

function ObservationStrip({ successes, failures }) {
  const total = successes + failures;
  const maxShown = 40;
  const scale = Math.min(1, maxShown / total);
  const shownSuccesses = Math.round(successes * scale);
  const shownFailures = Math.min(maxShown - shownSuccesses, Math.round(failures * scale));
  const observations = [
    ...Array.from({ length: shownSuccesses }, (_, index) => ({ id: `s${index}`, y: 1 })),
    ...Array.from({ length: shownFailures }, (_, index) => ({ id: `f${index}`, y: 0 })),
  ];
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {observations.map((item) => <span key={item.id} className={`h-5 rounded-sm ${item.y ? 'bg-emerald-500' : 'bg-slate-300'}`} title={`y=${item.y}`} />)}
    </div>
  );
}

export default function MaximumLikelihoodEstimationAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const bernoulliDataset = BERNOULLI_DATASETS[scenario.bernoulliDatasetId];
  const gaussianDataset = GAUSSIAN_DATASETS[scenario.gaussianDatasetId];
  const bernoulliLab = useMemo(() => buildBernoulliLab(bernoulliDataset, scenario.candidateP), [bernoulliDataset, scenario.candidateP]);
  const gaussianLab = useMemo(() => buildGaussianLab(gaussianDataset, scenario.candidateMu, scenario.candidateSigma), [gaussianDataset, scenario.candidateMu, scenario.candidateSigma]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const selectBernoulli = (id) => setScenario((current) => ({ ...current, bernoulliDatasetId: id, candidateP: BERNOULLI_DATASETS[id].candidateP }));
  const selectGaussian = (id) => setScenario((current) => ({ ...current, gaussianDatasetId: id, candidateMu: GAUSSIAN_DATASETS[id].candidateMu, candidateSigma: GAUSSIAN_DATASETS[id].candidateSigma }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Likelihood laboratory"
        title="Maximum Likelihood Estimation"
        note="MLE treats the observed data as fixed and asks which parameter values make those observations most plausible under the chosen model family. Log-likelihood turns products into sums; maximizing it is equivalent to minimizing negative log-likelihood."
      >
        <NoteRow>
          <Note label="Function" title="Likelihood is over parameters">
            <p>For fixed observed data, L(θ) compares candidate θ values. It is not a probability distribution over θ unless a Bayesian model supplies a prior and normalization.</p>
          </Note>
          <Note label="Optimization" title="The score vanishes at an interior optimum">
            <p>The derivative of log-likelihood points uphill. At a smooth interior MLE, the score is zero and curvature describes local information.</p>
          </Note>
          <Note label="Assumption" title="MLE inherits the model's weaknesses">
            <p>A Gaussian MLE is not automatically robust. An outlier can move both the fitted mean and variance because the likelihood trusts the Gaussian family.</p>
          </Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Choose a likelihood and candidate" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <div className="grid gap-2">
          <span className="nb-label">Model family</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`ds-btn ${scenario.mode === 'bernoulli' ? 'is-active' : ''}`} onClick={() => update('mode', 'bernoulli')}>Bernoulli p</button>
            <button type="button" className={`ds-btn ${scenario.mode === 'gaussian' ? 'is-active' : ''}`} onClick={() => update('mode', 'gaussian')}>Gaussian μ + σ</button>
          </div>
        </div>
        {scenario.mode === 'bernoulli' ? (
          <Slider label="Candidate p" value={scenario.candidateP} {...CONTROL_LIMITS.candidateP} format={(value) => value.toFixed(2)} help="Move p and watch relative likelihood and the score." onChange={(value) => update('candidateP', value)} />
        ) : (
          <>
            <Slider label="Candidate μ" value={scenario.candidateMu} {...CONTROL_LIMITS.candidateMu} format={(value) => value.toFixed(2)} help="Gaussian location parameter." onChange={(value) => update('candidateMu', value)} />
            <Slider label="Candidate σ" value={scenario.candidateSigma} {...CONTROL_LIMITS.candidateSigma} format={(value) => value.toFixed(2)} help="Gaussian scale parameter; estimated jointly with μ." onChange={(value) => update('candidateSigma', value)} />
          </>
        )}
      </ControlBench>

      <div className="flex flex-wrap gap-2 -mt-2 mb-2" aria-label="MLE datasets">
        {Object.entries(scenario.mode === 'bernoulli' ? BERNOULLI_DATASETS : GAUSSIAN_DATASETS).map(([id, dataset]) => {
          const active = scenario.mode === 'bernoulli' ? scenario.bernoulliDatasetId === id : scenario.gaussianDatasetId === id;
          return <button key={id} type="button" className={`ds-btn ${active ? 'is-active' : ''}`} onClick={() => (scenario.mode === 'bernoulli' ? selectBernoulli(id) : selectGaussian(id))}>{dataset.label}</button>;
        })}
      </div>

      {scenario.mode === 'bernoulli' ? (
        <>
          <Plate label="1 · Bernoulli likelihood" title="The MLE is the observed success fraction">
            <ObservationStrip successes={bernoulliDataset.successes} failures={bernoulliDataset.failures} />
            <Readouts columns={4} items={[
              { label: 'MLE p', value: bernoulliLab.metrics.mle.toFixed(3), detail: `${bernoulliDataset.successes} / ${bernoulliLab.metrics.sampleSize}` },
              { label: 'Candidate relative L', value: pct(bernoulliLab.metrics.relativeLikelihood), detail: 'L(candidate) / L(MLE)' },
              { label: 'Score at candidate', value: bernoulliLab.metrics.score.toFixed(2), detail: 'positive → increase p · negative → decrease p' },
              { label: 'Approx. SE at MLE', value: bernoulliLab.metrics.asymptoticSe.toFixed(3), detail: `information ${bernoulliLab.metrics.informationAtMle.toFixed(1)}` },
            ]} />
            <svg viewBox="0 0 440 230" role="img" aria-label="Bernoulli relative likelihood curve" className="h-auto w-full max-w-3xl mx-auto mt-5">
              <rect x="42" y="30" width="360" height="168" fill="none" stroke="currentColor" opacity="0.16" />
              <path d={relativePath(bernoulliLab.curve)} fill="none" stroke="#0f172a" strokeWidth="4" />
              <line x1={bernoulliX(scenario.candidateP)} x2={bernoulliX(scenario.candidateP)} y1="25" y2="203" stroke="#0284c7" strokeWidth="4" />
              <line x1={bernoulliX(bernoulliLab.metrics.mle)} x2={bernoulliX(bernoulliLab.metrics.mle)} y1="25" y2="203" stroke="#10b981" strokeWidth="4" strokeDasharray="6 6" />
              <text x="222" y="222" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">p · black relative likelihood · blue candidate · dashed green MLE</text>
            </svg>
            <Formula lines={[
              'log L(p) = successes·log(p) + failures·log(1−p)',
              'score = d log L / dp = successes/p − failures/(1−p)',
              'score = 0  ⇒  p_MLE = successes / n',
            ]} />
          </Plate>

          <Plate label="2 · Information grows with data" title="Same fitted proportion does not mean same certainty">
            <Steps items={[
              { title: 'Compare 6/4 with 60/40', pass: scenario.bernoulliDatasetId === 'replicated', body: scenario.bernoulliDatasetId === 'replicated' ? 'The MLE remains 0.60, but the likelihood is much sharper and the standard error is smaller.' : 'Select the 60/40 dataset: it has the same 60% success proportion as 6/4 but ten times the observations.' },
              { title: 'Move the candidate away from the MLE', pass: bernoulliLab.metrics.relativeLikelihood < 0.5, body: bernoulliLab.metrics.relativeLikelihood < 0.5 ? 'This candidate is substantially less supported than the MLE under the Bernoulli model.' : 'The candidate still sits in a relatively plausible part of the likelihood.' },
            ]} />
          </Plate>
        </>
      ) : (
        <>
          <Plate label="1 · Joint Gaussian likelihood" title="Estimate μ and σ together rather than pretending σ is known">
            <Readouts columns={4} items={[
              { label: 'MLE μ', value: gaussianLab.metrics.mleMu.toFixed(3), detail: 'sample mean' },
              { label: 'MLE σ', value: gaussianLab.metrics.mleSigma.toFixed(3), detail: '√(Σ residual² / n)' },
              { label: 'Candidate relative L', value: pct(gaussianLab.metrics.relativeLikelihood), detail: 'joint support for candidate μ, σ' },
              { label: 'Negative log-L', value: gaussianLab.metrics.negativeLogLikelihood.toFixed(2), detail: 'training objective to minimize' },
            ]} />
            <div className="overflow-x-auto mt-4">
              <div className="flex flex-wrap gap-2 text-sm text-slate-700">{gaussianDataset.values.map((value, index) => <span key={`${value}-${index}`} className="font-mono">x{index + 1}={value.toFixed(1)}</span>)}</div>
            </div>
            <svg viewBox="0 0 430 275" role="img" aria-label="Gaussian likelihood surface over mean and standard deviation" className="h-auto w-full max-w-3xl mx-auto mt-5">
              <rect x="54" y="42" width="320" height="184" fill="none" stroke="currentColor" opacity="0.2" />
              {gaussianLab.surface.cells.map((cell) => {
                const cellWidth = 320 / gaussianLab.surface.muPoints;
                const cellHeight = 184 / gaussianLab.surface.sigmaPoints;
                const opacity = 0.05 + 0.85 * Math.pow(cell.relative, 0.2);
                return <rect key={`${cell.muIndex}-${cell.sigmaIndex}`} x={54 + cell.muIndex * cellWidth} y={42 + (gaussianLab.surface.sigmaPoints - 1 - cell.sigmaIndex) * cellHeight} width={cellWidth + 0.4} height={cellHeight + 0.4} fill="#0891b2" opacity={opacity} />;
              })}
              <circle cx={surfaceX(scenario.candidateMu, gaussianLab.surface)} cy={surfaceY(scenario.candidateSigma, gaussianLab.surface)} r="7" fill="#0f172a" />
              <circle cx={surfaceX(gaussianLab.metrics.mleMu, gaussianLab.surface)} cy={surfaceY(gaussianLab.metrics.mleSigma, gaussianLab.surface)} r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="214" y="256" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">μ → · σ ↑ · brighter = higher relative likelihood</text>
            </svg>
            <Formula lines={[
              'μ_MLE = mean(x)',
              'σ²_MLE = Σ(xᵢ − μ_MLE)² / n',
              'unbiased sample variance uses /(n−1), which solves a different estimation objective',
            ]} />
          </Plate>

          <div className="nb-split">
            <Plate label="2 · Score equations" title="At the joint optimum both gradients vanish">
              <Readouts columns={2} items={[
                { label: 'Score for μ', value: gaussianLab.metrics.scoreMu.toFixed(2), detail: '∂ log L / ∂μ' },
                { label: 'Score for σ', value: gaussianLab.metrics.scoreSigma.toFixed(2), detail: '∂ log L / ∂σ' },
                { label: 'MLE variance', value: gaussianLab.metrics.mleVariance.toFixed(3), detail: 'denominator n' },
                { label: 'Unbiased variance', value: gaussianLab.metrics.unbiasedVariance.toFixed(3), detail: 'denominator n−1' },
              ]} />
              <BarTrack label="Candidate relative likelihood" value={pct(gaussianLab.metrics.relativeLikelihood)} width={gaussianLab.metrics.relativeLikelihood * 100} tone={gaussianLab.metrics.relativeLikelihood > 0.7 ? 'good' : 'warn'} />
            </Plate>

            <Plate label="3 · Model misspecification" title="The MLE can be exact for the wrong model">
              <Steps items={[
                { title: 'Fit both location and scale', pass: Math.abs(gaussianLab.metrics.scoreMu) < 0.5 && Math.abs(gaussianLab.metrics.scoreSigma) < 0.5, body: Math.abs(gaussianLab.metrics.scoreMu) < 0.5 && Math.abs(gaussianLab.metrics.scoreSigma) < 0.5 ? 'The candidate is very close to a stationary point of the Gaussian log-likelihood.' : 'The score still points toward a better Gaussian fit.' },
                { title: 'Try the outlier dataset', pass: scenario.gaussianDatasetId === 'outlier', body: scenario.gaussianDatasetId === 'outlier' ? 'The extreme observation pulls μ upward and inflates σ. MLE faithfully optimizes the Gaussian likelihood; robustness was never promised.' : 'Select the outlier dataset to see how a Gaussian likelihood reacts when one measurement is extreme.' },
              ]} />
            </Plate>
          </div>
        </>
      )}

      <Note tone="accent" label="Takeaway" title="Optimization quality and model quality are different questions">
        <p>MLE can find the exact best parameter under the chosen likelihood and still produce a poor real-world model if the family is misspecified. First ask whether the likelihood is appropriate; then ask how well it was optimized.</p>
      </Note>

      <AssessmentPanel lessonId="maximum-likelihood-estimation" title="Maximum likelihood check" />
    </div>
  );
}
