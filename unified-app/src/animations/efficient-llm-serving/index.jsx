import React, { useMemo, useState } from 'react';
import { Boxes, Clock, Database, MemoryStick, Server, Zap } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { MODEL_PRESETS, SERVING_DEFAULTS, SERVING_REQUESTS } from './servingConfig';
import { buildServingLab } from './servingModel';

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(2)} MiB`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

export default function EfficientLlmServingAnimation() {
  const [modelId, setModelId] = useState(SERVING_DEFAULTS.modelId);
  const [blockSize, setBlockSize] = useState(SERVING_DEFAULTS.blockSize);
  const [maxSequenceTokens, setMaxSequenceTokens] = useState(SERVING_DEFAULTS.maxSequenceTokens);
  const [maxBatchSize, setMaxBatchSize] = useState(SERVING_DEFAULTS.maxBatchSize);
  const [draftLength, setDraftLength] = useState(SERVING_DEFAULTS.speculativeDraftLength);
  const [acceptance, setAcceptance] = useState(SERVING_DEFAULTS.speculativeAcceptance);
  const model = MODEL_PRESETS.find((item) => item.id === modelId);
  const lab = useMemo(
    () => buildServingLab({ model, blockSize, maxSequenceTokens, maxBatchSize, speculativeDraftLength: draftLength, speculativeAcceptance: acceptance, requests: SERVING_REQUESTS }),
    [model, blockSize, maxSequenceTokens, maxBatchSize, draftLength, acceptance],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-teal-700">Serving systems</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Efficient LLM serving: memory and scheduler accounting first</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Production throughput is workload- and hardware-dependent, so this lab does not invent GPU-utilization or P99 percentages.
          It computes the pieces we can derive exactly: KV bytes, allocation waste, prefix reuse, decode-slot waste, and expected speculative acceptance.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {MODEL_PRESETS.map((item) => (
            <button key={item.id} type="button" onClick={() => setModelId(item.id)} className={`rounded-lg border p-3 text-left ${modelId === item.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200'}`}>
              <strong className="block text-sm text-slate-950">{item.label}</strong>
              <span className="text-xs text-slate-600">{item.layers} layers · {item.kvHeads} KV heads · {item.headDim} dim</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          <label className="grid gap-2 text-sm font-bold text-slate-700">KV block: {blockSize}<input type="range" min="4" max="64" step="4" value={blockSize} onChange={(e) => setBlockSize(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Reserved max: {maxSequenceTokens}<input type="range" min="2048" max="16384" step="1024" value={maxSequenceTokens} onChange={(e) => setMaxSequenceTokens(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Batch slots: {maxBatchSize}<input type="range" min="1" max="6" step="1" value={maxBatchSize} onChange={(e) => setMaxBatchSize(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Draft length: {draftLength}<input type="range" min="1" max="16" step="1" value={draftLength} onChange={(e) => setDraftLength(Number(e.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Accept p: {acceptance.toFixed(2)}<input type="range" min="0" max="1" step="0.05" value={acceptance} onChange={(e) => setAcceptance(Number(e.target.value))} /></label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-5">
        <Metric label="KV / token" value={`${lab.kibPerToken.toFixed(0)} KiB`} detail="K + V across all layers" />
        <Metric label="Paged waste" value={formatBytes(lab.pagedWasteBytes)} detail={`${lab.pagedWasteTokens} padded tokens`} />
        <Metric label="Reserved waste" value={formatBytes(lab.contiguousWasteBytes)} detail={`${lab.contiguousWasteTokens} unused tokens`} />
        <Metric label="Prefix saved" value={lab.prefix.savedTokens.toLocaleString()} detail="prompt tokens not recomputed" />
        <Metric label="Expected accepted" value={lab.expectedAcceptedDraftTokens.toFixed(2)} detail={`${draftLength}-token speculative prefix`} />
      </div>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><MemoryStick size={16} /> KV allocation</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Per token: <span className="font-mono">2 × layers × KV heads × head_dim × bytes</span> = {lab.bytesPerToken.toLocaleString()} bytes.
            Paged allocation rounds each live request to {blockSize}-token blocks; naive contiguous reservation gives every request {maxSequenceTokens} tokens up front.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"><strong>Paged waste:</strong> {lab.pagedWasteTokens} tokens</div>
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950"><strong>Reserved waste:</strong> {lab.contiguousWasteTokens} tokens</div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Database size={16} /> Shared-prefix reuse</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            The six requests share {lab.prefix.sharedPrefixTokens} prompt tokens. Without reuse the scheduler prefills {lab.prefix.withoutCache.toLocaleString()} tokens;
            storing the common prefix once reduces that to {lab.prefix.withCache.toLocaleString()}.
          </p>
          <div className="mt-4 rounded-lg bg-teal-50 p-4 text-lg font-black text-teal-950">Saved prefill work: {lab.prefix.savedTokens.toLocaleString()} token positions</div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><Server size={16} /> Static vs continuous decode scheduling</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <strong className="text-amber-950">Static batches</strong>
            <p className="mt-2 text-sm text-amber-900">Makespan {lab.staticBatch.makespan} decode passes · {lab.staticBatch.wastedSlots} padded sequence-slots.</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <strong className="text-emerald-950">Continuous batching</strong>
            <p className="mt-2 text-sm text-emerald-900">Makespan {lab.continuousBatch.makespan} decode passes · {lab.continuousBatch.wastedSlots} padded sequence-slots in this idealized scheduler.</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="border-b border-slate-200 text-left text-xs uppercase text-slate-500"><tr><th className="py-2">Request</th><th>Arrival</th><th>Output</th><th>Static complete</th><th>Continuous complete</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {SERVING_REQUESTS.map((request) => <tr key={request.id}><td className="py-2 font-bold">{request.id}</td><td>{request.arrival}</td><td>{request.outputTokens}</td><td>{lab.staticBatch.completionTimes[request.id]}</td><td>{lab.continuousBatch.completionTimes[request.id]}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950"><strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-teal-700"><Boxes size={15} /> Paging</strong> Block allocation limits internal KV waste to at most blockSize−1 tokens per live request; it does not make attention itself free.</div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700"><Clock size={15} /> Scheduling</strong> Continuous batching removes finished sequences and admits waiting requests between decode iterations instead of waiting for the longest sequence in a static batch.</div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm leading-6 text-indigo-950"><strong className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-700"><Zap size={15} /> Speculation</strong> Expected accepted draft-prefix length assumes independent per-token acceptance. It is an acceptance statistic, not a claimed end-to-end speedup.</div>
      </section>

      <AssessmentPanel lessonId="efficient-llm-serving" title="Efficient LLM serving check" />
    </div>
  );
}
