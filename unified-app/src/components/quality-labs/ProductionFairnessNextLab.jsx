import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { FAIRNESS_NEXT_DEFAULTS } from './productionReliabilityNextConstants.js';
import {
  evaluateFairnessThresholdPair,
  sweepFairnessThresholdPairs,
} from './productionReliabilityNextModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

function GroupReadouts({ label, metrics }) {
  return (
    <Note title={label}>
      TPR {pct(metrics.tpr)} · FPR {pct(metrics.fpr)} · selected-calibration gap {metrics.calibrationGap >= 0 ? '+' : ''}{pct(metrics.calibrationGap)}.
    </Note>
  );
}

export default function ProductionFairnessNextLab() {
  const [thresholdA, setThresholdA] = useState(FAIRNESS_NEXT_DEFAULTS.thresholdA);
  const [thresholdB, setThresholdB] = useState(FAIRNESS_NEXT_DEFAULTS.thresholdB);
  const current = useMemo(() => evaluateFairnessThresholdPair({
    rowsByGroup: FAIRNESS_NEXT_DEFAULTS.rowsByGroup,
    thresholdA,
    thresholdB,
  }), [thresholdA, thresholdB]);
  const sweep = useMemo(() => sweepFairnessThresholdPairs(FAIRNESS_NEXT_DEFAULTS), []);

  return (
    <>
      <Plate
        label="Threshold trade-off"
        title="Equalized odds and calibration can prefer different subgroup thresholds"
        note="Sweep the two thresholds independently. Matching TPR/FPR is a different objective from keeping selected probabilities calibrated."
      >
        <ControlBench label="Subgroup thresholds">
          <Slider label="Group A threshold" value={thresholdA} min={0.4} max={0.7} step={0.1} onChange={setThresholdA} format={(value) => value.toFixed(1)} />
          <Slider label="Group B threshold" value={thresholdB} min={0.4} max={0.7} step={0.1} onChange={setThresholdB} format={(value) => value.toFixed(1)} />
        </ControlBench>
        <Readouts columns={3} items={[
          { label: 'Equalized-odds gap', value: pct(current.equalizedOddsGap), detail: 'max subgroup TPR/FPR difference' },
          { label: 'Calibration error', value: pct(current.calibrationError), detail: 'mean absolute selected calibration gap' },
          { label: 'Calibration disparity', value: pct(current.calibrationDisparity), detail: 'difference between subgroup calibration gaps' },
        ]} />
        <NoteRow>
          <GroupReadouts label="Group A" metrics={current.groupA} />
          <GroupReadouts label="Group B" metrics={current.groupB} />
        </NoteRow>
      </Plate>

      <Plate label="Objective frontier" title="There is no single threshold pair that means fairness">
        <NoteRow>
          <Note tone="good" title={`Best equalized odds: A ${sweep.bestEqualizedOdds.thresholdA.toFixed(1)} / B ${sweep.bestEqualizedOdds.thresholdB.toFixed(1)}`}>
            Equalized-odds gap {pct(sweep.bestEqualizedOdds.equalizedOddsGap)} with calibration error {pct(sweep.bestEqualizedOdds.calibrationError)}.
          </Note>
          <Note tone="accent" title={`Best calibration: A ${sweep.bestCalibration.thresholdA.toFixed(1)} / B ${sweep.bestCalibration.thresholdB.toFixed(1)}`}>
            Calibration error {pct(sweep.bestCalibration.calibrationError)} with equalized-odds gap {pct(sweep.bestCalibration.equalizedOddsGap)}.
          </Note>
        </NoteRow>
        <Note tone="warn" title="Policy comes before optimization">
          Choosing between these objectives depends on the decision context, harms, legal constraints, access effects, uncertainty, and whose errors matter. A metric cannot choose the policy for you.
        </Note>
      </Plate>
    </>
  );
}
