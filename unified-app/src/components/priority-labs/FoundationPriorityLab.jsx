import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import { P1_FOUNDATION_DEFAULTS } from './p1PriorityConstants.js';
import {
  buildDistributionAssumptionLab,
  buildLabelSmoothingLab,
  buildMapLab,
} from './foundationPriorityModel.js';

const decimal = (value, digits = 3) => Number(value).toFixed(digits);
const pct = (value) => `${(value * 100).toFixed(0)}%`;

function DistributionAssumptionLab() {
  const [scenario, setScenario] = useState(P1_FOUNDATION_DEFAULTS['probability-distributions']);
  const lab = useMemo(() => buildDistributionAssumptionLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Priority lab · assumptions become losses"
      title="A noise assumption changes which mistakes the model fears"
      note="Use the same residual under Gaussian and Laplace noise. The likelihood assumption becomes a squared-error or absolute-error penalty downstream."
    >
      <ControlBench label="Residual experiment">
        <Slider label="Residual" value={scenario.residual} min={0} max={6} step={0.25} onChange={(value) => update('residual', value)} />
        <Slider label="Scale" value={scenario.scale} min={0.5} max={3} step={0.25} onChange={(value) => update('scale', value)} />
      </ControlBench>
      <Readouts columns={3} items={[
        { label: 'Gaussian penalty', value: decimal(lab.gaussianPenalty), detail: 'quadratic in standardized residual' },
        { label: 'Laplace penalty', value: decimal(lab.laplacePenalty), detail: 'linear in |standardized residual|' },
        { label: 'Lower penalty here', value: lab.preferredByPenalty, detail: 'for this one residual only' },
      ]} />
      <Note tone="accent" label="Model consequence" title="Distribution choice is not decoration"><p>{lab.interpretation}</p></Note>
    </Plate>
  );
}

function LabelSmoothingLab() {
  const [scenario, setScenario] = useState(P1_FOUNDATION_DEFAULTS['loss-functions-likelihoods']);
  const lab = useMemo(() => buildLabelSmoothingLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Priority lab · categorical NLL"
      title="Label smoothing changes the target distribution, not softmax itself"
      note="The model still emits a probability distribution. Smoothing replaces the one-hot target with a small amount of mass on every class, so extreme confidence is penalized differently."
    >
      <ControlBench label="Prediction and target">
        <Slider label="Predicted probability for true class" value={scenario.confidence} min={0.25} max={0.99} step={0.01} format={pct} onChange={(value) => update('confidence', value)} />
        <Slider label="Label smoothing" value={scenario.smoothing} min={0} max={0.3} step={0.01} format={pct} onChange={(value) => update('smoothing', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'True-class target', value: decimal(lab.trueClassTarget), detail: 'after smoothing' },
        { label: 'Other-class target', value: decimal(lab.otherClassTarget), detail: 'mass assigned per other class' },
        { label: 'Hard CE', value: decimal(lab.hardLoss), detail: 'one-hot categorical NLL' },
        { label: 'Smoothed CE', value: decimal(lab.smoothedLoss), detail: 'same prediction, softer target' },
      ]} />
      <Formula lines={[
        'categorical NLL = −Σ y_k log p_k',
        'smoothed target = (1−ε)·one_hot + ε/K',
      ]} />
      <Note tone="neutral" label="Boundary" title="Smoothing is not a calibration guarantee"><p>It can reduce incentives for extreme logits, but calibration still has to be measured on held-out data.</p></Note>
    </Plate>
  );
}

function MapLab() {
  const [scenario, setScenario] = useState(P1_FOUNDATION_DEFAULTS['maximum-likelihood-estimation']);
  const lab = useMemo(() => buildMapLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Priority lab · MLE → MAP"
      title="MAP adds prior evidence to the likelihood"
      note="For a Bernoulli parameter, MLE uses only observed successes. A Beta prior pulls the mode toward the prior when data are scarce."
    >
      <ControlBench label="Bernoulli evidence">
        <Slider label="Successes" value={scenario.successes} min={0} max={scenario.trials} step={1} onChange={(value) => update('successes', value)} />
        <Slider label="Trials" value={scenario.trials} min={Math.max(1, scenario.successes)} max={40} step={1} onChange={(value) => update('trials', value)} />
        <Slider label="Prior α" value={scenario.alpha} min={1.1} max={10} step={0.1} onChange={(value) => update('alpha', value)} />
        <Slider label="Prior β" value={scenario.beta} min={1.1} max={10} step={0.1} onChange={(value) => update('beta', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'MLE', value: decimal(lab.mle), detail: 'successes / trials' },
        { label: 'Prior mode', value: decimal(lab.priorMode), detail: 'before seeing these trials' },
        { label: 'MAP', value: decimal(lab.map), detail: 'posterior mode' },
        { label: 'Shift from MLE', value: `${lab.shrinkage >= 0 ? '+' : ''}${decimal(lab.shrinkage)}`, detail: `prior pulls ${lab.direction}` },
      ]} />
      <Formula lines={[
        'MLE p̂ = successes / trials',
        'MAP mode = (successes + α − 1) / (trials + α + β − 2)',
      ]} />
      <Note tone="accent" label="Interpretation" title="More data weakens the prior's leverage"><p>Repeat the same prior with more trials and the MAP estimate moves closer to MLE. The likelihood dominates as evidence accumulates.</p></Note>
    </Plate>
  );
}

export default function FoundationPriorityLab({ lessonId }) {
  if (lessonId === 'probability-distributions') return <DistributionAssumptionLab />;
  if (lessonId === 'loss-functions-likelihoods') return <LabelSmoothingLab />;
  if (lessonId === 'maximum-likelihood-estimation') return <MapLab />;
  return null;
}
