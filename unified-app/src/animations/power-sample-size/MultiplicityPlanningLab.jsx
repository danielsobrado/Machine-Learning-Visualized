import React, { useMemo, useState } from 'react';
import { BarTrack, Formula, Note, Plate, Readouts, Slider } from '../_shared/notebook';
import { MULTIPLICITY_DEFAULTS, MULTIPLICITY_LIMITS } from './multiplicityConstants.js';
import { buildMultiplicityLab } from './multiplicityModel.js';

const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

export default function MultiplicityPlanningLab() {
  const [hypotheses, setHypotheses] = useState(MULTIPLICITY_DEFAULTS.hypotheses);
  const [familyAlpha, setFamilyAlpha] = useState(MULTIPLICITY_DEFAULTS.familyAlpha);
  const [relativeLift, setRelativeLift] = useState(MULTIPLICITY_DEFAULTS.relativeLift);
  const lab = useMemo(
    () => buildMultiplicityLab({ hypotheses, familyAlpha, relativeLift }),
    [hypotheses, familyAlpha, relativeLift],
  );

  return (
    <Plate
      label="4 · Multiplicity budget"
      title="More primary claims spend more false-positive budget"
      note="If several hypotheses can each trigger a win, planning every test at 5% alpha no longer gives a 5% family-level false-positive risk. Bonferroni is conservative, simple, and makes the sample-size cost visible."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Slider label="Primary hypotheses" value={hypotheses} {...MULTIPLICITY_LIMITS.hypotheses} onChange={setHypotheses} />
        <Slider label="Family alpha" value={familyAlpha} {...MULTIPLICITY_LIMITS.familyAlpha} format={(value) => `${value}%`} onChange={setFamilyAlpha} />
        <Slider label="Relative MDE" value={relativeLift} {...MULTIPLICITY_LIMITS.relativeLift} format={(value) => `${value}%`} onChange={setRelativeLift} />
      </div>

      <Readouts columns={4} items={[
        { label: 'Per-test alpha', value: `${lab.perTestAlpha.toFixed(3)}%`, detail: `${familyAlpha}% / ${hypotheses}` },
        { label: 'Single-test N', value: lab.singleTestRequired.toLocaleString(), detail: 'same MDE, no multiplicity correction' },
        { label: 'Corrected N', value: lab.correctedRequired.toLocaleString(), detail: `+${lab.extraSample.toLocaleString()} observations` },
        { label: 'Sample inflation', value: `${lab.sampleInflation.toFixed(2)}×`, detail: 'cost of stricter evidence threshold' },
      ]} />

      <div className="nb-bar-stack mt-4">
        <BarTrack
          label="Family false-positive risk if every test still uses the full alpha"
          value={pct(lab.uncorrectedFamilyError)}
          width={lab.uncorrectedFamilyError * 100}
          tone={lab.uncorrectedFamilyError > familyAlpha / 100 ? 'warn' : 'good'}
        />
        <BarTrack
          label="Corrected N / single-test N"
          value={`${(lab.sampleInflation * 100).toFixed(0)}%`}
          width={Math.min(100, lab.sampleInflation * 70)}
          tone={hypotheses === 1 ? 'good' : 'accent'}
        />
      </div>

      <Formula lines={[
        'Bonferroni per-test alpha = family alpha / number of primary hypotheses',
        'under independent tests: family false-positive risk = 1 − (1 − alpha)^m',
        'smaller alpha → larger critical value → more sample for the same MDE and power',
      ]} />

      <Note tone="accent" label="Design rule" title="Multiplicity belongs in planning, not in post-hoc storytelling">
        <p>Declare which outcomes or variants can independently support a launch. If all of them count as primary claims, budget error across them before collecting data. Exploratory metrics can remain exploratory instead of forcing every dashboard number into the primary family.</p>
      </Note>
    </Plate>
  );
}
