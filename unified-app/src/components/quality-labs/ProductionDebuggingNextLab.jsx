import React, { useMemo, useState } from 'react';

import { ControlBench, Note, NoteRow, Plate, Readouts } from '../../animations/_shared/notebook.jsx';
import { DEBUGGING_NEXT_DEFAULTS } from './productionReliabilityNextConstants.js';
import { compareDebuggingHypotheses } from './productionReliabilityNextModel.js';

const pct = (value) => `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)} pp`;

export default function ProductionDebuggingNextLab() {
  const comparison = useMemo(() => compareDebuggingHypotheses(DEBUGGING_NEXT_DEFAULTS), []);
  const [selectedId, setSelectedId] = useState(comparison.evaluated[0].id);
  const selected = comparison.evaluated.find(({ id }) => id === selectedId) || comparison.evaluated[0];

  return (
    <>
      <Plate
        label="Competing hypotheses"
        title="Two fixes can improve the failing slice for completely different reasons"
        note="Replay the same low-light slice and the same global guardrails after each intervention. A plausible story is not evidence until its signature matches the outcome."
      >
        <ControlBench label="Intervention replay">
          {comparison.evaluated.map((hypothesis) => (
            <button
              key={hypothesis.id}
              type="button"
              className={`nb-reset ${selectedId === hypothesis.id ? 'is-active' : ''}`}
              onClick={() => setSelectedId(hypothesis.id)}
            >
              {hypothesis.title}
            </button>
          ))}
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'Low-light recall gain', value: pct(selected.targetGain), detail: 'targeted failing slice' },
          { label: 'Global precision change', value: pct(-selected.guardrailDrop), detail: 'release guardrail' },
          { label: 'Daytime recall change', value: pct(-selected.collateralDrop), detail: 'collateral slice' },
          { label: 'Replay verdict', value: selected.passes ? 'PASS' : 'FAIL', detail: selected.intervention },
        ]} />
        <Note tone={selected.passes ? 'good' : 'danger'} title={selected.title}>
          {selected.passes
            ? 'The intervention moves the intended slice while preserving the global and collateral guardrails.'
            : 'The intervention helps the target slice, but the signature shows broad collateral damage. That weakens the claimed root cause.'}
        </Note>
      </Plate>

      <Plate label="Diagnosis" title="Prefer the hypothesis whose predicted signature survives replay">
        <NoteRow>
          {comparison.evaluated.map((hypothesis) => (
            <Note key={hypothesis.id} tone={hypothesis.passes ? 'good' : 'warn'} title={hypothesis.title}>
              {hypothesis.intervention} Target gain {pct(hypothesis.targetGain)}; precision change {pct(-hypothesis.guardrailDrop)}.
            </Note>
          ))}
        </NoteRow>
        <Note tone="accent" title={`Best supported hypothesis: ${comparison.best.title}`}>
          Debugging is model comparison. Preserve the failing slice, predict what each hypothesis should change, then reject explanations whose side effects do not match the replay.
        </Note>
      </Plate>
    </>
  );
}
