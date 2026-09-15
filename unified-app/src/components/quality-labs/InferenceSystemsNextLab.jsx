import React, { useMemo, useState } from 'react';

import { BarTrack, ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { INFERENCE_SYSTEMS_NEXT_DEFAULTS } from './p1SystemsNextConstants.js';
import { buildServingMemoryBudget } from './p1SystemsNextModel.js';

const gib = (value) => `${value.toFixed(2)} GiB`;
const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function InferenceSystemsNextLab() {
  const [pageTokens, setPageTokens] = useState(INFERENCE_SYSTEMS_NEXT_DEFAULTS.pageTokens);
  const [activationGiB, setActivationGiB] = useState(INFERENCE_SYSTEMS_NEXT_DEFAULTS.activationGiB);
  const [runtimeReserveGiB, setRuntimeReserveGiB] = useState(INFERENCE_SYSTEMS_NEXT_DEFAULTS.runtimeReserveGiB);
  const budget = useMemo(() => buildServingMemoryBudget({
    ...INFERENCE_SYSTEMS_NEXT_DEFAULTS,
    pageTokens,
    activationGiB,
    runtimeReserveGiB,
  }), [activationGiB, pageTokens, runtimeReserveGiB]);

  return (
    <>
      <Plate
        label="Serving memory"
        title="Weights + ideal KV cache is not the memory budget you actually deploy"
        note="Paged KV allocation, activations, kernels, allocator reserve, and runtime workspaces all consume capacity. Change page size and overhead assumptions to see the gap."
      >
        <ControlBench label="Runtime assumptions">
          <Slider label="KV page size" value={pageTokens} min={64} max={2048} step={64} onChange={setPageTokens} format={(value) => `${value} tokens`} />
          <Slider label="Activation/workspace memory" value={activationGiB} min={0} max={8} step={0.2} onChange={setActivationGiB} format={gib} />
          <Slider label="Runtime reserve" value={runtimeReserveGiB} min={0} max={8} step={0.2} onChange={setRuntimeReserveGiB} format={gib} />
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'Weights', value: gib(budget.parameterGiB), detail: 'quantized parameter memory' },
          { label: 'Used KV', value: gib(budget.usedKvGiB), detail: `${budget.usedTokens.toLocaleString()} live tokens` },
          { label: 'Paged KV', value: gib(budget.allocatedKvGiB), detail: `${budget.allocatedTokens.toLocaleString()} allocated tokens` },
          { label: 'KV fragmentation', value: pct(budget.fragmentationRate), detail: gib(budget.fragmentationGiB) },
        ]} />
        <BarTrack label="Simplified total: weights + used KV" value={gib(budget.simplifiedTotalGiB)} width={(budget.simplifiedTotalGiB / budget.servingTotalGiB) * 100} />
        <BarTrack label="Actual teaching budget" value={gib(budget.servingTotalGiB)} width={100} tone="warn" />
        <Readouts columns={2} items={[
          { label: 'Unmodeled by simple estimate', value: gib(budget.overheadGiB), detail: 'paging + activations + runtime reserve' },
          { label: 'Overhead share', value: pct(budget.overheadShare), detail: 'of total serving memory' },
        ]} />
      </Plate>

      <Plate label="Capacity planning" title="Fragmentation and runtime reserve turn theoretical fit into deployment risk">
        <NoteRow>
          <Note tone="warn" title="Page size trade-off">Larger pages reduce metadata/management pressure but can waste more tail capacity for uneven sequence lengths.</Note>
          <Note tone="accent" title="Continuous batching changes the shape">Real servers constantly admit and retire sequences. Capacity planning needs headroom for the allocator and changing sequence-length distribution, not only one static batch.</Note>
        </NoteRow>
      </Plate>
    </>
  );
}
