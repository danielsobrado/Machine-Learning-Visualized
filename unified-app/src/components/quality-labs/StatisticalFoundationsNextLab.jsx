import React, { useMemo, useState } from 'react';

import {
  BarTrack,
  ControlBench,
  Formula,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
} from '../../animations/_shared/notebook.jsx';
import {
  IMBALANCE_LOSS_NEXT_DEFAULTS,
  MLE_NEXT_DEFAULTS,
  PROBABILITY_NEXT_DEFAULTS,
} from './foundationsNextConstants.js';
import {
  analyzeBernoulliPosterior,
  analyzeGaussianMixture,
  compareImbalanceLosses,
  sweepPriorStrength,
} from './foundationsNextModel.js';

const formatNumber = (value, digits = 3) => value.toFixed(digits);
const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

function ProbabilityMixtureLab() {
  const [separation, setSeparation] = useState(PROBABILITY_NEXT_DEFAULTS.separation);
  const [leftWeight, setLeftWeight] = useState(PROBABILITY_NEXT_DEFAULTS.leftWeight);
  const result = useMemo(() => analyzeGaussianMixture({
    ...PROBABILITY_NEXT_DEFAULTS,
    separation,
    leftWeight,
  }), [separation, leftWeight]);
  const maxDensity = Math.max(...result.probes.flatMap((probe) => [
    probe.mixtureDensity,
    probe.matchedGaussianDensity,
  ]));

  return (
    <>
      <Plate
        label="Model misspecification"
        title="Matching mean and variance does not mean matching the distribution"
        note="The single Gaussian below has the same first two moments as the mixture. Move the modes together and watch when that approximation becomes less misleading."
      >
        <ControlBench>
          <Slider
            label="Component separation"
            value={separation}
            min={0.5}
            max={6}
            step={0.25}
            onChange={setSeparation}
            format={(value) => value.toFixed(2)}
          />
          <Slider
            label="Left-component weight"
            value={leftWeight}
            min={0.1}
            max={0.9}
            step={0.05}
            onChange={setLeftWeight}
            format={formatPercent}
          />
        </ControlBench>
        <Readouts items={[
          { label: 'Mixture mean', value: formatNumber(result.mixtureMean) },
          { label: 'Mixture variance', value: formatNumber(result.mixtureVariance) },
          { label: 'Matched Gaussian σ', value: formatNumber(result.matchedStandardDeviation) },
        ]} />
        {result.probes.map((probe) => (
          <React.Fragment key={probe.label}>
            <BarTrack
              label={`Mixture density — ${probe.label}`}
              value={formatNumber(probe.mixtureDensity)}
              width={(probe.mixtureDensity / maxDensity) * 100}
            />
            <BarTrack
              label={`Single Gaussian — ${probe.label}`}
              value={formatNumber(probe.matchedGaussianDensity)}
              width={(probe.matchedGaussianDensity / maxDensity) * 100}
              tone="warn"
            />
          </React.Fragment>
        ))}
        <Note tone={result.mixtureModeVsCenter > 0 ? 'warn' : 'neutral'} title="What the moments hide">
          The mixture's average mode-minus-center density is <strong>{formatNumber(result.mixtureModeVsCenter)}</strong>; the moment-matched Gaussian's is <strong>{formatNumber(result.gaussianModeVsCenter)}</strong>. A positive mixture gap with a negative Gaussian gap is the classic “two modes collapsed into one hump” failure.
        </Note>
      </Plate>
    </>
  );
}

function ImbalanceLossLab() {
  const [minorityWeight, setMinorityWeight] = useState(IMBALANCE_LOSS_NEXT_DEFAULTS.minorityWeight);
  const [gamma, setGamma] = useState(IMBALANCE_LOSS_NEXT_DEFAULTS.gamma);
  const result = useMemo(() => compareImbalanceLosses({
    ...IMBALANCE_LOSS_NEXT_DEFAULTS,
    minorityWeight,
    gamma,
  }), [minorityWeight, gamma]);

  return (
    <>
      <Plate
        label="Imbalanced classification"
        title="Class weighting and focal loss change the objective in different ways"
        note="Class weighting scales a class. Focal loss scales each example according to how easy the current prediction already is."
      >
        <ControlBench>
          <Slider
            label="Minority class weight"
            value={minorityWeight}
            min={1}
            max={8}
            step={0.5}
            onChange={setMinorityWeight}
            format={(value) => `${value.toFixed(1)}×`}
          />
          <Slider
            label="Focal γ"
            value={gamma}
            min={0}
            max={4}
            step={0.25}
            onChange={setGamma}
            format={(value) => value.toFixed(2)}
          />
        </ControlBench>
        <Readouts items={[
          { label: 'Plain NLL total', value: formatNumber(result.nll.total) },
          { label: 'Weighted NLL total', value: formatNumber(result.weightedNll.total) },
          { label: 'Focal total', value: formatNumber(result.focal.total) },
        ]} />
        <BarTrack label="Minority share — plain NLL" value={formatPercent(result.nll.minorityShare)} width={result.nll.minorityShare * 100} />
        <BarTrack label="Minority share — weighted NLL" value={formatPercent(result.weightedNll.minorityShare)} width={result.weightedNll.minorityShare * 100} tone="warn" />
        <BarTrack label="Minority share — focal loss" value={formatPercent(result.focal.minorityShare)} width={result.focal.minorityShare * 100} />
        <Formula lines={[
          'weighted CE = wᵧ · (−log pᵧ)',
          'focal loss = (1 − pᵧ)^γ · (−log pᵧ)',
        ]} />
        <NoteRow>
          <Note title="Class weighting">
            Every example from the chosen class is amplified, whether it is easy or hard.
          </Note>
          <Note title="Focal loss">
            Easy high-confidence examples are suppressed. Hard examples retain more of their gradient contribution regardless of why they are hard.
          </Note>
        </NoteRow>
      </Plate>
    </>
  );
}

function MlePosteriorLab() {
  const [concentration, setConcentration] = useState(MLE_NEXT_DEFAULTS.concentration);
  const result = useMemo(() => analyzeBernoulliPosterior({
    ...MLE_NEXT_DEFAULTS,
    concentration,
  }), [concentration]);
  const sweep = useMemo(() => sweepPriorStrength(MLE_NEXT_DEFAULTS), []);

  return (
    <>
      <Plate
        label="Point summaries"
        title="MLE, MAP, and posterior mean answer different questions"
        note="The data stay fixed at 7 successes in 10 trials. Only the strength of a Beta prior centered at 0.5 changes."
      >
        <ControlBench>
          <Slider
            label="Prior concentration α + β"
            value={concentration}
            min={4}
            max={40}
            step={1}
            onChange={setConcentration}
            format={(value) => value.toFixed(0)}
          />
        </ControlBench>
        <Readouts items={[
          { label: 'MLE', value: formatNumber(result.mle) },
          { label: 'MAP', value: formatNumber(result.map) },
          { label: 'Posterior mean', value: formatNumber(result.posteriorMean) },
          { label: 'Prior mean', value: formatNumber(MLE_NEXT_DEFAULTS.priorMean) },
        ]} />
        <BarTrack label="MLE" value={formatNumber(result.mle)} width={result.mle * 100} />
        <BarTrack label="MAP" value={formatNumber(result.map)} width={result.map * 100} tone="warn" />
        <BarTrack label="Posterior mean" value={formatNumber(result.posteriorMean)} width={result.posteriorMean * 100} />
        <Formula lines={[
          'MLE = k / n',
          'MAP = (α + k − 1) / (α + β + n − 2)',
          'posterior mean = (α + k) / (α + β + n)',
        ]} />
      </Plate>

      <Plate
        label="Prior sensitivity"
        title="More prior strength means more shrinkage, not more data"
      >
        <Readouts items={sweep.map((row) => ({
          label: `concentration ${row.concentration}`,
          value: `MAP ${formatNumber(row.map)}`,
          detail: `posterior mean ${formatNumber(row.posteriorMean)}`,
        }))} />
        <Note tone="warn" title="Do not conflate the summaries">
          MAP is the posterior mode. The posterior mean averages over posterior uncertainty. They coincide only in special symmetric or large-sample cases, and neither is the same object as the likelihood-only MLE.
        </Note>
      </Plate>
    </>
  );
}

export default function StatisticalFoundationsNextLab({ lessonId }) {
  if (lessonId === 'probability-distributions') return <ProbabilityMixtureLab />;
  if (lessonId === 'loss-functions-likelihoods') return <ImbalanceLossLab />;
  if (lessonId === 'maximum-likelihood-estimation') return <MlePosteriorLab />;
  return null;
}
