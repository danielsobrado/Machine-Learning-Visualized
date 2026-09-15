import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Database, Layers3, Network, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  HEAD_DIM_OPTIONS,
  QUERY_OPTIONS,
} from './groupedQueryAttentionConstants.js';
import {
  buildGroupedQueryStats,
  validKvHeadOptions,
} from './groupedQueryAttentionModel.js';

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Math.round(value));

function formatBytes(bytes) {
  const mebibytes = bytes / (1024 ** 2);
  return `${mebibytes.toFixed(mebibytes >= 10 ? 1 : 2)} MiB`;
}

function ControlButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={16} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{helper}</p>
    </div>
  );
}

export default function GroupedQueryAttentionAnimation() {
  const [queryHeads, setQueryHeads] = useState(16);
  const [kvHeads, setKvHeads] = useState(4);
  const [sequenceLength, setSequenceLength] = useState(4096);
  const [headDim, setHeadDim] = useState(128);

  const validKvOptions = useMemo(() => validKvHeadOptions(queryHeads), [queryHeads]);
  const safeKvHeads = validKvOptions.includes(kvHeads)
    ? kvHeads
    : validKvOptions[validKvOptions.length - 1];
  const stats = useMemo(() => buildGroupedQueryStats({
    queryHeads,
    kvHeads: safeKvHeads,
    sequenceLength,
    headDim,
  }), [headDim, queryHeads, safeKvHeads, sequenceLength]);

  useEffect(() => {
    if (safeKvHeads !== kvHeads) setKvHeads(safeKvHeads);
  }, [kvHeads, safeKvHeads]);

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                <Network size={17} />
                Transformer inference
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">
                Grouped-query attention
              </h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                Compare MHA, MQA, and GQA by changing how many key/value heads serve the query heads. Fewer KV heads
                reduce cache storage and the unique K/V payload read during decoding while keeping the number of query
                heads unchanged.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <div className="font-semibold text-slate-950">{stats.label}</div>
              <div>
                {queryHeads} query heads share {stats.kvHeads} KV heads
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <SlidersHorizontal size={18} />
              Controls
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Query heads</div>
                <div className="grid grid-cols-3 gap-2">
                  {QUERY_OPTIONS.map((heads) => (
                    <ControlButton
                      key={heads}
                      active={queryHeads === heads}
                      onClick={() => {
                        setQueryHeads(heads);
                        if (kvHeads > heads || heads % kvHeads !== 0) setKvHeads(heads);
                      }}
                    >
                      {heads}
                    </ControlButton>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">KV heads</div>
                <div className="grid grid-cols-3 gap-2">
                  {validKvOptions.map((heads) => (
                    <ControlButton key={heads} active={stats.kvHeads === heads} onClick={() => setKvHeads(heads)}>
                      {heads}
                    </ControlButton>
                  ))}
                </div>
              </div>

              <label className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Context tokens</span>
                  <span>{formatNumber(sequenceLength)}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="8192"
                  step="512"
                  value={sequenceLength}
                  onChange={(event) => setSequenceLength(Number(event.target.value))}
                  className="w-full accent-slate-900"
                />
              </label>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Head dimension</div>
                <div className="grid grid-cols-2 gap-2">
                  {HEAD_DIM_OPTIONS.map((dim) => (
                    <ControlButton key={dim} active={headDim === dim} onClick={() => setHeadDim(dim)}>
                      {dim}
                    </ControlButton>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Database}
                label="KV cache / layer"
                value={formatBytes(stats.kvCacheBytes)}
                helper="Per sequence, assuming 2-byte KV elements such as fp16/bf16."
              />
              <MetricCard
                icon={Activity}
                label="MHA payload ratio"
                value={`${(stats.memoryRatio * 100).toFixed(0)}%`}
                helper={`${stats.savedPercent.toFixed(0)}% fewer unique cached K/V elements than full MHA.`}
              />
              <MetricCard
                icon={Layers3}
                label="Sharing ratio"
                value={`${stats.groupSize}:1`}
                helper="Distinct query heads served by each shared K/V head."
              />
              <MetricCard
                icon={Network}
                label="KV elements / layer"
                value={formatNumber(stats.kvElements)}
                helper={`MHA would store ${formatNumber(stats.mhaElements)} for the same context.`}
              />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Query-to-KV grouping</h2>
                  <p className="text-sm text-slate-600">
                    Each row shows one KV head and the query heads that reuse its keys and values during decoding.
                  </p>
                </div>
                <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  Full MHA cache: {formatBytes(stats.mhaCacheBytes)} / layer
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {stats.groups.map((group) => (
                  <div key={group.id} className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[90px_1fr]">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <span className={`h-3 w-3 rounded-full ${group.color}`} />
                      {group.kvLabel}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.queryHeads.map((head) => (
                        <span
                          key={head}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700"
                        >
                          Q{head}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Predict before running</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Halving the KV-head count halves the unique cached K/V elements for fixed context and head dimension.
                  Query-head count stays unchanged.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">What sharing changes</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Query heads in a group reuse the same K/V projections, reducing representational capacity relative to
                  independent MHA K/V heads. Their queries remain distinct, so their attention weights can still differ.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Practical rule</h3>
                <p className="mt-2 text-sm text-slate-700">
                  MQA is the one-KV-head endpoint, MHA uses one KV head per query head, and GQA occupies the measured
                  cache/bandwidth middle ground between them. Quality must be validated rather than inferred from a fake score.
                </p>
              </div>
            </section>
          </main>
        </section>

        <AssessmentPanel lessonId="grouped-query-attention" />
      </div>
    </div>
  );
}
