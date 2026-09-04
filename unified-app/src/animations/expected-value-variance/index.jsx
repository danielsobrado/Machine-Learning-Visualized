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
import { CONTROL_LIMITS, DEFAULT_SCENARIO, DISTRIBUTION_PRESETS } from './momentsConfig.js';
import { buildMomentsLab, exactMoments } from './momentsModel.js';

const number = (value) => value.toFixed(2);
const pct = (value) => `${(value * 100).toFixed(1)}%`;

function RunningMeanPlot({ points, target }) {
  const width = 500;
  const height = 180;
  const pad = 28;
  const values = points.map((point) => point.mean).concat(target);
  const minY = Math.min(...values);
  const maxY = Math.max(...values);
  const maxN = points[points.length - 1]?.n ?? 1;
  const x = (n) => pad + (n / maxN) * (width - pad * 2);
  const y = (value) => height - pad - ((value - minY) / Math.max(1e-9, maxY - minY)) * (height - pad * 2);
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(point.n).toFixed(1)} ${y(point.mean).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Running sample mean">
      <line x1={pad} x2={width - pad} y1={y(target)} y2={y(target)} stroke="#059669" strokeDasharray="6 5" />
      <path d={path} fill="none" stroke="#0891b2" strokeWidth="3" />
      <text x={width - pad} y={Math.max(12, y(target) - 6)} textAnchor="end" fontSize="11" fill="#047857">E[X]</text>
    </svg>
  );
}

export default function ExpectedValueVarianceAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const preset = DISTRIBUTION_PRESETS.find((item) => item.id === scenario.presetId);
  const lab = useMemo(() => buildMomentsLab({ ...scenario, preset }), [scenario, preset]);
  const stable = exactMoments(
    DISTRIBUTION_PRESETS.find((item) => item.id === 'stable-five').outcomes,
    DISTRIBUTION_PRESETS.find((item) => item.id === 'stable-five').probabilities,
  );
  const risky = exactMoments(
    DISTRIBUTION_PRESETS.find((item) => item.id === 'risky-five').outcomes,
    DISTRIBUTION_PRESETS.find((item) => item.id === 'risky-five').probabilities,
  );
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <div className="nb-lesson">
      <Plate
        label="Moment workbench"
        title="Expected Value & Variance"
        note="Expectation is the probability-weighted long-run center. Variance measures squared spread around that center. Neither tells the full story alone."
      >
        <NoteRow>
          <Note label="Expectation" title="A weighted center"><p>E[X] need not be an outcome you can ever observe. A fair die has expectation 3.5.</p></Note>
          <Note label="Variance" title="Spread around the mean"><p>Var(X) = E[X²] − E[X]². Squaring makes large deviations count strongly.</p></Note>
          <Note label="Averaging" title="Noise can cancel"><p>For independent copies, averaging preserves the mean while dividing variance by the number of copies.</p></Note>
        </NoteRow>
      </Plate>

      <ControlBench
        label="Transform and sample a discrete random variable"
        actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}
      >
        <label className="nb-slider">
          <span className="nb-slider-head"><span>Distribution</span><b>{preset.label}</b></span>
          <select value={scenario.presetId} onChange={(event) => update('presetId', event.target.value)} className="rounded border border-slate-300 bg-white p-2">
            {DISTRIBUTION_PRESETS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <small>Presets expose cases where the same mean hides very different risk.</small>
        </label>
        <Slider label="Scale a" value={scenario.scale} {...CONTROL_LIMITS.scale} onChange={(value) => update('scale', value)} />
        <Slider label="Shift b" value={scenario.shift} {...CONTROL_LIMITS.shift} onChange={(value) => update('shift', value)} />
        <Slider label="Independent copies averaged" value={scenario.independentCopies} {...CONTROL_LIMITS.independentCopies} onChange={(value) => update('independentCopies', value)} />
        <Slider label="Downside threshold" value={scenario.lossThreshold} {...CONTROL_LIMITS.lossThreshold} onChange={(value) => update('lossThreshold', value)} />
        <Slider label="Simulation draws" value={scenario.sampleSize} {...CONTROL_LIMITS.sampleSize} onChange={(value) => update('sampleSize', value)} />
      </ControlBench>
      <div className="flex flex-wrap gap-2 -mt-2 mb-2">
        {DISTRIBUTION_PRESETS.map((item) => <button key={item.id} type="button" className="ds-btn" onClick={() => update('presetId', item.id)}>{item.label}</button>)}
        <button type="button" className="ds-btn" onClick={() => update('seed', scenario.seed + 1)}>Resample</button>
      </div>

      <Plate label="1 · Exact moments" title={`Y = ${scenario.scale}X + ${scenario.shift}`}>
        <Readouts columns={4} items={[
          { label: 'E[Y]', value: number(lab.moments.mean), detail: `Identity: ${number(lab.affineIdentity.expected)}` },
          { label: 'E[Y²]', value: number(lab.moments.secondMoment), detail: 'Second raw moment' },
          { label: 'Var(Y)', value: number(lab.moments.variance), detail: `Identity: ${number(lab.affineIdentity.variance)}` },
          { label: 'P(Y ≤ threshold)', value: pct(lab.downsideProbability), detail: `Threshold ${scenario.lossThreshold}` },
        ]} />
        <Formula lines={[
          'E[aX + b] = aE[X] + b',
          'Var(aX + b) = a² Var(X)',
          'Var(X) = E[X²] − E[X]²',
        ]} />
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Probability mass" title="Every outcome contributes value × probability">
          <div className="nb-bar-stack">
            {lab.transformedOutcomes.map((value, index) => (
              <BarTrack
                key={`${value}-${index}`}
                label={`Y = ${number(value)}`}
                value={pct(preset.probabilities[index])}
                width={preset.probabilities[index] * 100}
                tone={value <= scenario.lossThreshold ? 'warn' : 'accent'}
              />
            ))}
          </div>
          <Note tone={lab.meanIsPossibleOutcome ? 'neutral' : 'accent'} label="Expected value" title={lab.meanIsPossibleOutcome ? 'The mean is an outcome here' : 'The mean is not an outcome'}>
            <p>{lab.meanIsPossibleOutcome ? 'One support value equals the expectation.' : `No single draw can equal E[Y] = ${number(lab.moments.mean)} in this setting.`}</p>
          </Note>
        </Plate>

        <Plate label="3 · Repeated sampling" title="The running average learns the expectation">
          <RunningMeanPlot points={lab.simulation.runningMean} target={lab.moments.mean} />
          <Readouts columns={2} items={[
            { label: 'Sample mean', value: number(lab.simulation.mean), detail: `Exact ${number(lab.moments.mean)}` },
            { label: 'Sample variance', value: number(lab.simulation.variance), detail: `Exact ${number(lab.moments.variance)}` },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Why variance matters" title="Two strategies can have exactly the same expected value">
        <Readouts columns={4} items={[
          { label: 'Stable mean', value: number(stable.mean), detail: `Variance ${number(stable.variance)}` },
          { label: 'Risky mean', value: number(risky.mean), detail: `Variance ${number(risky.variance)}` },
          { label: `Average of ${scenario.independentCopies}`, value: number(lab.average.mean), detail: 'Expectation unchanged' },
          { label: 'Variance of average', value: number(lab.average.variance), detail: `Original ${number(lab.moments.variance)}` },
        ]} />
        <Steps items={[
          { title: 'Do not rank decisions by mean alone', pass: stable.variance === risky.variance, body: stable.variance === risky.variance ? 'These examples have the same spread.' : 'Stable-five and risky-five both average to 5, but their variance differs by orders of magnitude.' },
          { title: 'Keep units straight', pass: true, body: 'Standard deviation has the same units as X; variance has squared units.' },
          { title: 'Use independence when claiming 1/n variance', pass: true, body: 'The displayed averaging rule assumes independent copies. Correlation adds covariance terms and weakens the reduction.' },
        ]} />
      </Plate>

      <Note tone="accent" label="Takeaway" title="Expectation answers center; variance answers stability">
        <p>Machine-learning objectives often optimize averages, but deployment decisions also care about dispersion, downside probability, and whether repeated measurements are actually independent.</p>
      </Note>

      <AssessmentPanel lessonId="expected-value-variance" title="Expectation and variance check" />
    </div>
  );
}
