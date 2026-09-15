import React, { useMemo, useState } from 'react';

import { BarTrack, ControlBench, Note, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { UNCERTAINTY_NEXT_DEFAULTS } from './productionReliabilityNextConstants.js';
import { evaluateTemperature, fitTemperatureScaling } from './productionReliabilityNextModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function ProductionUncertaintyNextLab() {
  const fitted = useMemo(() => fitTemperatureScaling(UNCERTAINTY_NEXT_DEFAULTS), []);
  const [temperature, setTemperature] = useState(fitted.best.temperature);
  const current = useMemo(() => evaluateTemperature(UNCERTAINTY_NEXT_DEFAULTS.rows, temperature), [temperature]);
  const maxNll = Math.max(...fitted.evaluations.map(({ nll }) => nll));

  return (
    <>
      <Plate
        label="Held-out recalibration"
        title="Fit temperature on calibration data, not on the test set"
        note="Temperature scaling rescales logits with one positive parameter. It preserves class ranking while changing confidence sharpness."
      >
        <Readouts columns={4} items={[
          { label: 'Baseline T', value: '1.00', detail: 'uncalibrated logits' },
          { label: 'Fitted T', value: fitted.best.temperature.toFixed(2), detail: 'minimum held-out NLL' },
          { label: 'NLL before', value: fitted.baseline.nll.toFixed(3), detail: 'calibration split' },
          { label: 'NLL after', value: fitted.best.nll.toFixed(3), detail: 'same held-out split' },
        ]} />
        {fitted.evaluations.map((evaluation) => (
          <BarTrack
            key={evaluation.temperature}
            label={`T=${evaluation.temperature}`}
            value={evaluation.nll.toFixed(3)}
            width={(evaluation.nll / maxNll) * 100}
            tone={evaluation.temperature === fitted.best.temperature ? 'accent' : 'warn'}
          />
        ))}
      </Plate>

      <Plate label="Calibration probe" title="Sharper is not always more trustworthy">
        <ControlBench label="Manual temperature">
          <Slider label="Temperature" value={temperature} min={0.5} max={4} step={0.25} onChange={setTemperature} format={(value) => value.toFixed(2)} />
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'Accuracy', value: pct(current.accuracy), detail: 'unchanged for positive T' },
          { label: 'Mean confidence', value: pct(current.meanConfidence), detail: 'moves with temperature' },
          { label: 'Confidence − accuracy', value: `${current.calibrationGap >= 0 ? '+' : ''}${pct(current.calibrationGap)}`, detail: 'simple calibration direction' },
          { label: 'NLL', value: current.nll.toFixed(3), detail: 'proper scoring rule' },
        ]} />
        <Note tone="accent" title="Why a held-out calibration split matters">
          Choosing temperature on the same data used for final evaluation makes the reported calibration optimistic. Fit calibration parameters on separate held-out data, then evaluate once on untouched test data.
        </Note>
      </Plate>
    </>
  );
}
