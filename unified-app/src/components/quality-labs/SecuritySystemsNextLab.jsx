import React, { useMemo, useState } from 'react';

import { ControlBench, Note, Plate, Readouts, Steps } from '../../animations/_shared/notebook.jsx';
import { SECURITY_SYSTEMS_NEXT_DEFAULTS } from './p1SystemsNextConstants.js';
import { simulateSecurityTrace } from './p1SystemsNextModel.js';

const PRESET_LABELS = Object.freeze({
  weak: 'Weak boundaries',
  authorizationOnly: 'Authorization only',
  defenseInDepth: 'Defense in depth',
});

export default function SecuritySystemsNextLab() {
  const [presetId, setPresetId] = useState('weak');
  const result = useMemo(() => simulateSecurityTrace({
    attack: SECURITY_SYSTEMS_NEXT_DEFAULTS.attack,
    controls: SECURITY_SYSTEMS_NEXT_DEFAULTS.presets[presetId],
  }), [presetId]);

  return (
    <>
      <Plate
        label="Executable red-team trace"
        title="A security control is only as strong as the boundary where it actually stops the attack"
        note="Replay the same poisoned-retrieval attack across ingestion, retrieval, authorization, and output validation."
      >
        <ControlBench label="Defense preset">
          {Object.keys(SECURITY_SYSTEMS_NEXT_DEFAULTS.presets).map((id) => (
            <button key={id} type="button" className={`nb-reset ${presetId === id ? 'is-active' : ''}`} onClick={() => setPresetId(id)}>
              {PRESET_LABELS[id]}
            </button>
          ))}
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'Blocked stages', value: result.blockedStages, detail: 'explicit trust/capability boundaries' },
          { label: 'Tool action', value: result.toolExecuted ? 'EXECUTED' : 'BLOCKED', detail: 'authorization outcome' },
          { label: 'Secret output', value: result.secretReleased ? 'RELEASED' : 'BLOCKED', detail: 'response boundary' },
          { label: 'Compromise', value: result.compromised ? 'YES' : 'NO', detail: PRESET_LABELS[presetId] },
        ]} />
        <Steps items={result.trace.map((step) => ({
          title: `${step.stage} · ${step.decision}`,
          body: step.detail,
          pass: step.blocked || (!result.compromised && step.stage === 'Output validation'),
        }))} />
        <Note tone={result.compromised ? 'danger' : 'good'} title={result.compromised ? 'Attack still crosses a boundary' : 'Attack contained'}>
          {result.compromised
            ? 'A model refusal or one permission check is not enough when another path can still execute a tool or release sensitive output.'
            : 'The trace contains the attack before it can create an external side effect or sensitive response.'}
        </Note>
      </Plate>

      <Plate label="Security architecture" title="Defense in depth reduces dependence on any single model behavior">
        <Note tone="accent" title="Treat retrieval as data, tools as capabilities, outputs as untrusted until validated">
          The model can still be manipulated. Production safety comes from provenance, source trust, least privilege, validation, and auditability around the model—not from assuming the model will always follow the right instruction.
        </Note>
      </Plate>
    </>
  );
}
