import React, { useMemo, useState } from 'react';

import {
  ControlBench,
  Formula,
  Note,
  NoteRow,
  Plate,
  Readouts,
  Slider,
} from '../../animations/_shared/notebook.jsx';
import { GRADIENT_DESCENT_NEXT_DEFAULTS } from './foundationsNextConstants.js';
import { compareOptimizationTrajectories } from './foundationsNextModel.js';

const METHOD_LABELS = Object.freeze({
  gradient: 'Vanilla GD',
  momentum: 'Momentum',
  'diagonal-preconditioned': 'Preconditioned',
});

const formatNumber = (value, digits = 3) => value.toFixed(digits);
const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

function trajectoryPoints(trajectory) {
  const xScale = 54;
  const yScale = 28;
  const centerX = 55;
  const centerY = 110;
  return trajectory
    .map(({ x, y }) => `${centerX + (x * xScale)},${centerY - (y * yScale)}`)
    .join(' ');
}

function TrajectoryPlot({ results }) {
  const dashPatterns = Object.freeze(['', '8 5', '2 5']);
  return (
    <figure aria-label="Optimizer trajectories on the same ill-conditioned quadratic valley">
      <svg viewBox="0 0 390 220" role="img" className="w-full" style={{ maxHeight: 260 }}>
        <ellipse cx="55" cy="110" rx="300" ry="35" fill="none" stroke="currentColor" opacity="0.15" />
        <ellipse cx="55" cy="110" rx="215" ry="25" fill="none" stroke="currentColor" opacity="0.15" />
        <ellipse cx="55" cy="110" rx="125" ry="15" fill="none" stroke="currentColor" opacity="0.15" />
        <circle cx="55" cy="110" r="4" fill="currentColor" />
        {results.map((result, index) => (
          <polyline
            key={result.method}
            points={trajectoryPoints(result.trajectory)}
            fill="none"
            stroke="currentColor"
            strokeWidth={index === 0 ? 2 : 3}
            strokeDasharray={dashPatterns[index]}
            opacity={0.85}
          />
        ))}
      </svg>
      <figcaption className="nb-plate-note">
        Solid = vanilla GD, dashed = momentum, dotted = diagonal preconditioning. All start from the same point and optimize the same objective.
      </figcaption>
    </figure>
  );
}

export default function OptimizationFoundationsNextLab() {
  const [learningRate, setLearningRate] = useState(GRADIENT_DESCENT_NEXT_DEFAULTS.learningRate);
  const [momentum, setMomentum] = useState(GRADIENT_DESCENT_NEXT_DEFAULTS.momentum);
  const comparison = useMemo(() => compareOptimizationTrajectories({
    ...GRADIENT_DESCENT_NEXT_DEFAULTS,
    learningRate,
    momentum,
  }), [learningRate, momentum]);

  return (
    <>
      <Plate
        label="Optimizer geometry"
        title="Momentum and preconditioning solve different parts of the same valley problem"
        note="Keep the objective and starting point fixed. Change only the optimizer dynamics."
      >
        <ControlBench>
          <Slider
            label="Vanilla / momentum learning rate"
            value={learningRate}
            min={0.01}
            max={0.075}
            step={0.005}
            onChange={setLearningRate}
            format={(value) => value.toFixed(3)}
            help="The steep axis limits the largest stable vanilla-GD step."
          />
          <Slider
            label="Momentum coefficient β"
            value={momentum}
            min={0}
            max={0.95}
            step={0.05}
            onChange={setMomentum}
            format={(value) => value.toFixed(2)}
            help="Momentum carries velocity through the shallow direction but can overshoot."
          />
        </ControlBench>

        <Readouts items={comparison.results.map((result) => ({
          label: METHOD_LABELS[result.method],
          value: formatNumber(result.final.loss, result.final.loss < 0.01 ? 5 : 3),
          detail: `${formatPercent(result.lossReduction)} loss removed in ${GRADIENT_DESCENT_NEXT_DEFAULTS.steps} steps`,
        }))} />
        <TrajectoryPlot results={comparison.results} />
      </Plate>

      <Plate
        label="Mechanism"
        title="The condition number is a geometry problem before it is an optimizer problem"
      >
        <Formula lines={[
          'L(x, y) = ½(λₓx² + λᵧy²),   λᵧ / λₓ = 25',
          'momentum: vₜ = βvₜ₋₁ + ∇L,   θₜ₊₁ = θₜ − ηvₜ',
          'diagonal preconditioning: θₜ₊₁ = θₜ − η D⁻¹∇L',
        ]} />
        <NoteRow>
          <Note title="Momentum">
            Reuses the direction of previous gradients. It accelerates persistent motion but still sees the original anisotropic geometry.
          </Note>
          <Note title="Preconditioning">
            Rescales coordinates by curvature. On this quadratic, the diagonal inverse Hessian turns the stretched valley into an isotropic one.
          </Note>
        </NoteRow>
        <Note tone="warn" title="Diagnostic rule">
          If one learning rate is tiny enough for the steep direction but painfully slow for the shallow direction, inspect scaling and conditioning before reaching for a more complicated optimizer.
        </Note>
      </Plate>
    </>
  );
}
