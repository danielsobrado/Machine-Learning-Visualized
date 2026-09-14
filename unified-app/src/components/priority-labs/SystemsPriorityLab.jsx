import React, { useMemo, useState } from 'react';
import { ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import {
  P1_PRODUCTION_DEFAULTS,
  P1_SECURITY_CASES,
} from './p1PriorityConstants.js';
import { buildInferenceMemoryLab, buildTargetEncodingLab } from './productionPriorityModel.js';

const decimal = (value, digits = 2) => Number(value).toFixed(digits);
const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;

function SecurityLab() {
  const [caseId, setCaseId] = useState(P1_SECURITY_CASES[0].id);
  const active = P1_SECURITY_CASES.find((item) => item.id === caseId) || P1_SECURITY_CASES[0];
  return (
    <Plate label="Priority lab · adversarial ML/LLM cases" title="Treat external content as hostile input, not policy" note="Prompt injection and retrieval poisoning fail at different layers, but both exploit misplaced trust in data entering the system.">
      <ControlBench label="Attack case">
        {P1_SECURITY_CASES.map((item) => <button key={item.id} type="button" className={`nb-reset ${caseId === item.id ? 'is-active' : ''}`} onClick={() => setCaseId(item.id)}>{item.title}</button>)}
      </ControlBench>
      <Note tone="danger" label="Attack" title={active.title}><p>{active.attack}</p></Note>
      <NoteRow>
        <Note tone="danger" label="Weak design" title="Trust boundary missing"><p>{active.weakDefense}</p></Note>
        <Note tone="good" label="Defense in depth" title="Constrain trust and capability"><p>{active.strongDefense}</p></Note>
      </NoteRow>
      <Note tone="neutral" label="Test" title="Red-team the whole retrieval/tool path"><p>A model refusal alone is not a security boundary. Test ingestion, retrieval ranking, tool authorization, output validation, and audit logging together.</p></Note>
    </Plate>
  );
}

function DataEngineeringLab() {
  const [scenario, setScenario] = useState(P1_PRODUCTION_DEFAULTS['data-engineering-for-ml-track']);
  const lab = useMemo(() => buildTargetEncodingLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  return (
    <Plate label="Priority lab · point-in-time features" title="Target encoding can leak twice: through the label and through time" note="A feature pipeline is correct only if every training row sees the same information that would have existed at its prediction timestamp.">
      <ControlBench label="Encoding and feature availability">
        <Slider label="Positive labels in category" value={scenario.categoryPositives} min={1} max={scenario.categoryRows} step={1} onChange={(value) => update('categoryPositives', value)} />
        <Slider label="Rows in category" value={scenario.categoryRows} min={Math.max(2, scenario.categoryPositives)} max={20} step={1} onChange={(value) => update('categoryRows', value)} />
        <Slider label="Feature arrival after prediction" value={scenario.featureTimestampOffsetHours} min={-12} max={12} step={1} format={(value) => `${value >= 0 ? '+' : ''}${value}h`} onChange={(value) => update('featureTimestampOffsetHours', value)} />
      </ControlBench>
      <Readouts columns={3} items={[
        { label: 'Naive target encoding', value: decimal(lab.globalEncoding, 3), detail: 'includes this row target' },
        { label: 'Leave-one-out encoding', value: decimal(lab.leaveOneOutEncoding, 3), detail: 'removes direct self-label leakage' },
        { label: 'Leakage delta', value: `${lab.leakageDelta >= 0 ? '+' : ''}${decimal(lab.leakageDelta, 3)}`, detail: 'for the current positive row' },
      ]} />
      <Note tone={lab.pointInTimeLeak ? 'danger' : 'good'} label="Point-in-time audit" title={lab.pointInTimeLeak ? 'Offline feature uses future information' : 'Feature is available in time'}><p>{lab.pointInTimeMessage}</p></Note>
      <Note tone="accent" label="Feature store" title="Materialize by event time, not latest value"><p>Historical training joins must ask “what value was known then?” rather than reading the newest feature snapshot.</p></Note>
    </Plate>
  );
}

function InferenceMemoryLab() {
  const [scenario, setScenario] = useState(P1_PRODUCTION_DEFAULTS['efficient-inference-compression-track']);
  const lab = useMemo(() => buildInferenceMemoryLab(scenario), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));
  return (
    <Plate label="Priority lab · serving memory" title="Quantized weights can stop being the dominant memory cost at long context" note="Estimate static parameter memory separately from the KV cache. Context length, batch size, and KV-head count can move serving memory more than another small weight compression step.">
      <ControlBench label="Model and decode shape">
        <Slider label="Parameters" value={scenario.paramsBillions} min={1} max={70} step={1} format={(value) => `${value}B`} onChange={(value) => update('paramsBillions', value)} />
        <Slider label="Weight precision" value={scenario.weightBits} min={2} max={16} step={2} format={(value) => `${value}-bit`} onChange={(value) => update('weightBits', value)} />
        <Slider label="Context length" value={scenario.sequenceLength} min={1024} max={32768} step={1024} onChange={(value) => update('sequenceLength', value)} />
        <Slider label="Batch size" value={scenario.batchSize} min={1} max={16} step={1} onChange={(value) => update('batchSize', value)} />
        <Slider label="KV heads" value={scenario.kvHeads} min={1} max={32} step={1} onChange={(value) => update('kvHeads', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Weights', value: `${decimal(lab.parameterGiB)} GiB`, detail: 'parameters × precision' },
        { label: 'KV cache', value: `${decimal(lab.kvGiB)} GiB`, detail: 'K+V across layers/tokens/batch' },
        { label: 'Approx. total', value: `${decimal(lab.totalGiB)} GiB`, detail: 'excluding activations/runtime overhead' },
        { label: 'Cache share', value: pct(lab.cacheShare), detail: 'of this simplified total' },
      ]} />
      <Note tone="accent" label="Serving consequence" title="GQA/MQA reduce KV memory directly"><p>Reducing KV heads changes cache growth without shrinking the full parameter matrix. That is why attention architecture matters to throughput and batch capacity.</p></Note>
    </Plate>
  );
}

export default function SystemsPriorityLab({ lessonId }) {
  if (lessonId === 'ml-security-robustness-track') return <SecurityLab />;
  if (lessonId === 'data-engineering-for-ml-track') return <DataEngineeringLab />;
  if (lessonId === 'efficient-inference-compression-track') return <InferenceMemoryLab />;
  return null;
}
