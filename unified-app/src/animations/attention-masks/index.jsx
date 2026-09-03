import React, { useMemo, useState } from 'react';
import { EyeOff, RotateCcw, SlidersHorizontal } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import MaskOrderLab from './MaskOrderLab.jsx';
import {
  ATTENTION_MASK_MODES,
  DECODER_TOKENS,
  SELF_TOKENS,
} from './attentionMaskConstants.js';
import { buildMaskMatrix } from './attentionMaskModel.js';

function cellTone(cell, selected) {
  if (!selected) return cell.allowed ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-100 bg-slate-100 text-slate-400';
  return cell.allowed ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : 'border-rose-200 bg-rose-50 text-rose-950';
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

export default function AttentionMasksAnimation() {
  const [mode, setMode] = useState('causal');
  const [selectedQuery, setSelectedQuery] = useState(2);
  const [maskPadding, setMaskPadding] = useState(true);
  const matrix = useMemo(() => buildMaskMatrix({ mode, maskPadding }), [mode, maskPadding]);
  const selectedRow = matrix.rows[selectedQuery];
  const allowedForQuery = selectedRow.cells.filter((cell) => cell.allowed).length;
  const blockedForQuery = selectedRow.cells.length - allowedForQuery;

  const reset = () => {
    setMode('causal');
    setSelectedQuery(2);
    setMaskPadding(true);
  };

  const handleMode = (nextMode) => {
    setMode(nextMode);
    const queryCount = nextMode === 'cross' ? DECODER_TOKENS.length : SELF_TOKENS.length;
    setSelectedQuery((current) => Math.min(current, queryCount - 1));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-purple-700">Transformer visibility rules</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Attention Masks</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Every query row owns its own softmax distribution. Masks remove forbidden logits before that row is normalized.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><SlidersHorizontal size={16} /> Mask controls</div>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">Mask type</span>
            <div className="grid gap-2 sm:grid-cols-4">
              {Object.entries(ATTENTION_MASK_MODES).map(([id, config]) => (
                <button key={id} type="button" aria-pressed={mode === id} onClick={() => handleMode(id)} className={`rounded-lg border px-3 py-2 text-sm font-black transition ${mode === id ? 'border-purple-500 bg-purple-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{config.label}</button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700" htmlFor="attention-mask-query">
            Query row: {selectedRow.queryToken}
            <input id="attention-mask-query" min="0" max={matrix.queryTokens.length - 1} step="1" type="range" value={selectedQuery} onChange={(event) => setSelectedQuery(Number(event.target.value))} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            Also mask padding
            <input type="checkbox" checked={maskPadding} onChange={(event) => setMaskPadding(event.target.checked)} />
          </label>
        </div>
        <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700"><strong>{ATTENTION_MASK_MODES[mode].label}:</strong> {ATTENTION_MASK_MODES[mode].detail}</p>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Query token" value={selectedRow.queryToken} detail={`row ${selectedQuery + 1}`} />
        <Stat label="Visible keys" value={allowedForQuery} detail="scores included in this row's softmax" />
        <Stat label="Blocked keys" value={blockedForQuery} detail="probability exactly zero" />
        <Stat label="Row sum" value={selectedRow.probabilitySum.toFixed(3)} detail={selectedRow.probabilitySum === 0 ? 'padding query ignored' : 'normalized independently'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600"><EyeOff size={16} /> Query-key probability matrix</h3>
          <div className="mt-4 overflow-x-auto">
            <div className="grid min-w-[560px] gap-2" style={{ gridTemplateColumns: `92px repeat(${matrix.keyTokens.length}, minmax(78px, 1fr))` }}>
              <div />
              {matrix.keyTokens.map((token, index) => <div key={`${token}-${index}`} className="rounded-lg bg-slate-100 px-2 py-2 text-center text-xs font-black text-slate-600">key {index + 1}<br />{token}</div>)}
              {matrix.rows.map((row) => (
                <React.Fragment key={row.row}>
                  <div className={`rounded-lg px-2 py-3 text-xs font-black ${row.row === selectedQuery ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>query {row.row + 1}<br />{row.queryToken}</div>
                  {row.cells.map((cell) => (
                    <div key={`${cell.row}-${cell.col}`} className={`rounded-lg border p-3 text-center ${cellTone(cell, row.row === selectedQuery)}`}>
                      <strong className="block text-sm">{cell.allowed ? 'keep' : 'mask'}</strong>
                      <span className="mt-1 block text-xs">{cell.allowed ? cell.probability.toFixed(3) : '0.000'}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Selected row</h3>
          <p className="mt-3 font-mono text-sm text-slate-950">softmax(scores + mask)</p>
          <div className="mt-4 space-y-3">
            {selectedRow.cells.map((cell) => (
              <article key={cell.col} className={`rounded-lg border p-3 ${cell.allowed ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <div className="flex items-center justify-between gap-3"><strong>{cell.keyToken}</strong><span className="rounded bg-white px-2 py-1 text-xs font-black">{cell.allowed ? `weight ${cell.probability.toFixed(3)}` : 'masked'}</span></div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{cell.reason}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <MaskOrderLab />

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
        <strong className="text-slate-950">Different mask, different contract:</strong> causal masks prevent answer leakage, padding masks remove fake keys, and cross-attention masks apply to encoder memory. Input corruption for masked-language modeling is a separate mechanism.
      </section>

      <AssessmentPanel lessonId="attention-masks" title="Attention Masks check" />
    </div>
  );
}
