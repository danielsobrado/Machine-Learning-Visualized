import React, { useMemo, useState } from 'react';
import { BarTrack, ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import { P1_FOUNDATION_DEFAULTS } from './p1PriorityConstants.js';
import { buildConditioningTrajectory, buildSaddleDiagnosis } from './optimizationPriorityModel.js';

const decimal = (value, digits = 3) => Number(value).toFixed(digits);

export default function OptimizationPriorityLab() {
  const [scenario, setScenario] = useState(P1_FOUNDATION_DEFAULTS['gradient-descent']);
  const trajectory = useMemo(() => buildConditioningTrajectory({
    conditionNumber: scenario.conditionNumber,
    learningRate: scenario.learningRate,
  }), [scenario.conditionNumber, scenario.learningRate]);
  const saddle = useMemo(() => buildSaddleDiagnosis({
    x: scenario.saddleX,
    y: scenario.saddleY,
  }), [scenario.saddleX, scenario.saddleY]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  const maxCoordinate = Math.max(
    1,
    ...trajectory.trajectory.flatMap((point) => [Math.abs(point.x), Math.abs(point.y)]),
  );

  return (
    <>
      <Plate
        label="Priority lab · conditioning"
        title="One learning rate must survive every curvature direction"
        note="This 2D quadratic has curvature 1 along x and κ along y. As κ grows, the safe learning-rate window shrinks and the steep direction can zig-zag or explode while the shallow direction still moves slowly."
      >
        <ControlBench label="Valley geometry">
          <Slider label="Condition number κ" value={scenario.conditionNumber} min={1} max={50} step={1} onChange={(value) => update('conditionNumber', value)} />
          <Slider label="Learning rate α" value={scenario.learningRate} min={0.005} max={0.2} step={0.005} onChange={(value) => update('learningRate', value)} />
        </ControlBench>

        <Readouts columns={4} items={[
          { label: 'κ', value: decimal(scenario.conditionNumber, 0), detail: 'steep / shallow curvature' },
          { label: 'α', value: decimal(scenario.learningRate), detail: 'shared step size' },
          { label: 'Stable α ceiling', value: decimal(trajectory.maxStableLearningRate), detail: '2 / κ for this quadratic' },
          { label: '12-step loss ratio', value: decimal(trajectory.improvementRatio), detail: 'final / initial loss' },
        ]} />

        <div className="nb-bar-stack mt-5">
          {trajectory.trajectory.map((point) => (
            <div key={point.step} className="grid gap-2 md:grid-cols-2">
              <BarTrack
                label={`step ${point.step} · |x| shallow`}
                value={decimal(Math.abs(point.x), 2)}
                width={(Math.abs(point.x) / maxCoordinate) * 100}
                tone="accent"
              />
              <BarTrack
                label={`step ${point.step} · |y| steep`}
                value={decimal(Math.abs(point.y), 2)}
                width={(Math.abs(point.y) / maxCoordinate) * 100}
                tone={trajectory.stable ? 'good' : 'warn'}
              />
            </div>
          ))}
        </div>

        <Note tone={trajectory.stable ? 'good' : 'danger'} label="Conditioning diagnosis" title={trajectory.stable ? 'The step is stable in both directions' : 'The steep direction is outside the stability range'}>
          <p>Feature scaling and preconditioning help because they reduce curvature imbalance. The goal is not merely a prettier loss surface; it lets one optimizer step size make useful progress in more directions.</p>
        </Note>
      </Plate>

      <Plate
        label="Priority lab · saddle point"
        title="A tiny gradient does not prove you found a minimum"
        note="For f(x,y)=x²−y², the origin is stationary but has positive curvature in x and negative curvature in y. It is a saddle, not a solution basin."
      >
        <ControlBench label="Probe near the saddle">
          <Slider label="x" value={scenario.saddleX} min={-1} max={1} step={0.05} onChange={(value) => update('saddleX', value)} />
          <Slider label="y" value={scenario.saddleY} min={-1} max={1} step={0.05} onChange={(value) => update('saddleY', value)} />
        </ControlBench>

        <Readouts columns={4} items={[
          { label: 'f(x,y)', value: decimal(saddle.loss), detail: 'x² − y²' },
          { label: '||gradient||', value: decimal(saddle.gradientNorm), detail: saddle.nearStationary ? 'small here' : 'not small' },
          { label: 'Curvature x', value: `+${decimal(saddle.curvatureX, 0)}`, detail: 'bowl direction' },
          { label: 'Curvature y', value: decimal(saddle.curvatureY, 0), detail: 'downhill direction' },
        ]} />

        <NoteRow>
          <Note tone="danger" label="False stopping rule" title="Gradient ≈ 0 ⇒ minimum"><p>A stationary point can be a minimum, maximum, or saddle. First-order magnitude alone cannot distinguish them.</p></Note>
          <Note tone="accent" label="Diagnostic" title="Inspect curvature or escape behavior"><p>Negative curvature exposes a descent direction even when the local gradient is tiny. Noise and momentum can also help leave flat saddle regions.</p></Note>
        </NoteRow>
      </Plate>
    </>
  );
}
