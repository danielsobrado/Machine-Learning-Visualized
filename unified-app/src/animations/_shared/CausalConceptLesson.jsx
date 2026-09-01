import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  BarTrack,
  ControlBench,
  Formula,
  Note,
  Plate,
  Readouts,
  Slider,
  Steps,
} from './notebook';

const TONE_TO_BAR = {
  slate: 'accent',
  cyan: 'accent',
  emerald: 'good',
  amber: 'warn',
  rose: 'bad',
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Lesson bodies used to carry Tailwind colour words (`bg-emerald-500`) for bar fills.
// Map whatever survives onto the notebook's four-tone vocabulary.
function barTone(bar) {
  if (bar.tone && TONE_TO_BAR[bar.tone]) return TONE_TO_BAR[bar.tone];
  const color = String(bar.color || '');
  if (/emerald|green|teal/.test(color)) return 'good';
  if (/amber|yellow|orange/.test(color)) return 'warn';
  if (/rose|red/.test(color)) return 'bad';
  return 'accent';
}

export default function CausalConceptLesson({ config }) {
  const [values, setValues] = useState(
    () => Object.fromEntries(config.controls.map((control) => [control.id, control.defaultValue])),
  );

  const metrics = useMemo(() => {
    const raw = config.compute(values);
    return {
      ...raw,
      bars: raw.bars.map((bar) => ({ ...bar, width: clamp(bar.width, 4, 100) })),
    };
  }, [config, values]);

  const reset = () => setValues(
    Object.fromEntries(config.controls.map((control) => [control.id, control.defaultValue])),
  );

  return (
    <div className="nb-lesson">
      <Plate label={config.kicker} title={config.title} note={config.description} />

      <ControlBench
        label="Scenario controls"
        actions={<button type="button" className="nb-reset" onClick={reset}>Reset</button>}
      >
        {config.controls.map((control) => (
          <Slider
            key={control.id}
            label={control.label}
            value={values[control.id]}
            min={control.min}
            max={control.max}
            step={control.step}
            format={control.format}
            help={control.help}
            onChange={(next) => setValues((current) => ({ ...current, [control.id]: next }))}
          />
        ))}
      </ControlBench>

      <Plate label="Readout">
        <Readouts
          items={metrics.stats.map((stat) => ({
            label: stat.label,
            value: stat.value,
            detail: stat.detail,
          }))}
        />
      </Plate>

      <div className="nb-split">
        <Plate label="Effect">
          <div className="nb-bar-stack">
            {metrics.bars.map((bar) => (
              <BarTrack
                key={bar.label}
                label={bar.label}
                value={bar.value}
                width={bar.width}
                tone={barTone(bar)}
              />
            ))}
          </div>
          <Formula lines={metrics.formulaLines} />
          <p className="nb-plate-note">{metrics.readout}</p>
        </Plate>

        <Plate label="Decision logic">
          <Steps items={metrics.steps} />
        </Plate>
      </div>

      <Note tone="accent" label="Takeaway">
        <p>{metrics.takeaway}</p>
      </Note>

      <AssessmentPanel lessonId={config.lessonId} />
    </div>
  );
}
