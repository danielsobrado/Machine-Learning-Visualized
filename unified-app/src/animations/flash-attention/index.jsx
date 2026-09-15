import React, { useMemo, useState } from 'react';
import { Cpu, Database, Grid3X3, HardDrive, Layers3, Zap } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  DTYPE_BYTES,
  SEQUENCE_OPTIONS,
  TILE_OPTIONS,
} from './flashAttentionConstants.js';
import { buildFlashAttentionStats } from './flashAttentionModel.js';

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Math.round(value));

function formatBytes(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function formatFlops(flops) {
  if (flops >= 1e12) return `${(flops / 1e12).toFixed(2)} TFLOPs`;
  if (flops >= 1e9) return `${(flops / 1e9).toFixed(2)} GFLOPs`;
  return `${(flops / 1e6).toFixed(1)} MFLOPs`;
}

function ButtonGroup({ label, options, value, onChange, format = (item) => item }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-700">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              value === option
                ? 'border-amber-700 bg-amber-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-amber-400'
            }`}
          >
            {format(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon size={16} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
    </div>
  );
}

export default function FlashAttentionAnimation() {
  const [seqLength, setSeqLength] = useState(4096);
  const [tileSize, setTileSize] = useState(128);
  const [headDim, setHeadDim] = useState(128);
  const [dtype, setDtype] = useState('fp16');
  const [activeTile, setActiveTile] = useState(5);

  const stats = useMemo(() => buildFlashAttentionStats({
    sequenceLength: seqLength,
    tileSize,
    headDim,
    dtype,
  }), [dtype, headDim, seqLength, tileSize]);

  const currentTile = activeTile % stats.tileCount;
  const activeRow = Math.floor(currentTile / stats.blocks);
  const activeCol = currentTile % stats.blocks;
  const visibleBlocks = Array.from({ length: Math.min(stats.blocks, 8) }, (_, index) => index);
  const scaleLabel = stats.blocks > 8 ? `showing 8 of ${stats.blocks} blocks` : `${stats.blocks} blocks`;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-700">
                <Zap size={17} />
                Hardware-aware attention
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">FlashAttention</h1>
              <p className="mt-2 max-w-3xl text-slate-700">
                FlashAttention evaluates dense scaled dot-product attention with a tiled I/O schedule. It avoids
                materializing the full score/probability matrix in high-bandwidth memory by maintaining online softmax
                statistics and an output accumulator for each active query row.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <div className="font-bold">Same dense attention objective</div>
              <div>No sparse or low-rank approximation; floating-point operation order can still differ.</div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-950">
              <Grid3X3 size={18} />
              Workbench
            </div>
            <div className="mt-5 space-y-5">
              <ButtonGroup
                label="Sequence length"
                options={SEQUENCE_OPTIONS}
                value={seqLength}
                onChange={(next) => {
                  setSeqLength(next);
                  setActiveTile(0);
                }}
                format={(item) => formatNumber(item)}
              />
              <ButtonGroup
                label="Tile size"
                options={TILE_OPTIONS}
                value={tileSize}
                onChange={(next) => {
                  setTileSize(next);
                  setActiveTile(0);
                }}
              />
              <label className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                  <span>Head dimension</span>
                  <span>{headDim}</span>
                </div>
                <input
                  type="range"
                  min="64"
                  max="256"
                  step="64"
                  value={headDim}
                  onChange={(event) => setHeadDim(Number(event.target.value))}
                  className="w-full accent-amber-600"
                />
              </label>
              <ButtonGroup
                label="Element type"
                options={Object.keys(DTYPE_BYTES)}
                value={dtype}
                onChange={setDtype}
                format={(item) => item.toUpperCase()}
              />
            </div>
          </aside>

          <main className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric
                icon={HardDrive}
                label="Full score matrix / head"
                value={formatBytes(stats.fullScoreBytes)}
                detail="N² score elements if QKᵀ is materialized for one attention head."
              />
              <Metric
                icon={Cpu}
                label="Conceptual tile working set"
                value={formatBytes(stats.workingSetBytes)}
                detail="Q/K/V tiles + score tile + row max/sum + vector output accumulator."
              />
              <Metric
                icon={Database}
                label="Score tile / full scores"
                value={`${(stats.scoreStorageRatio * 100).toFixed(4)}%`}
                detail="The resident score tile stays bounded by tile size instead of sequence length."
              />
              <Metric
                icon={Layers3}
                label="Dense attention matmuls"
                value={formatFlops(stats.denseAttentionMatmulFlops)}
                detail="QKᵀ plus attention·V for one head; tiling changes scheduling, not dense asymptotic arithmetic."
              />
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Tiled attention schedule</h2>
                  <p className="text-sm text-slate-600">
                    Move across key/value tiles for each query block, updating the row max, normalization denominator,
                    and vector output accumulator without writing every attention score to HBM.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTile((tile) => (tile + 1) % stats.tileCount)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Step tile
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${visibleBlocks.length}, minmax(38px, 1fr))` }}>
                  {visibleBlocks.flatMap((row) =>
                    visibleBlocks.map((col) => {
                      const active = row === activeRow && col === activeCol;
                      const processed = row * stats.blocks + col < currentTile;
                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-md border text-xs font-bold ${
                            active
                              ? 'border-amber-700 bg-amber-500 text-white'
                              : processed
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : 'border-slate-200 bg-slate-50 text-slate-500'
                          }`}
                        >
                          {row},{col}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-600">
                Active tile: query block {activeRow + 1}, key/value block {activeCol + 1}; {scaleLabel}.
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Online softmax state</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Each active query row keeps a running max and normalization denominator plus a head-dimension output
                  vector. When a new tile raises the max, previous accumulated contributions are rescaled consistently.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">What does not change</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Dense FlashAttention still evaluates every required query-key interaction. It does not turn quadratic
                  dense attention into linear-time attention; the main win is reduced memory traffic and materialization.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-bold text-slate-950">Hardware boundary</h3>
                <p className="mt-2 text-sm text-slate-700">
                  The working-set number here is a transparent teaching model, not a claimed kernel benchmark. Real tile
                  shapes, register use, SRAM limits, fusion, causal skipping, and throughput depend on hardware and implementation.
                </p>
              </div>
            </section>
          </main>
        </section>

        <AssessmentPanel lessonId="flash-attention" />
      </div>
    </div>
  );
}
