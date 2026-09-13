import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  GitBranch,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  attentionMatrix,
  attentionRow,
  buildTokenProjections,
} from './selfAttentionModel.js';

function fmtVector(vector) {
  return `[${vector.map((value) => value.toFixed(2)).join(', ')}]`;
}

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-xl font-black text-slate-950">{value}</strong>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{detail}</span>
    </div>
  );
}

function VectorCard({ label, value, detail, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-200 bg-slate-50 text-slate-900',
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-950',
    violet: 'border-violet-200 bg-violet-50 text-violet-950',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className="text-xs font-black uppercase tracking-wide opacity-70">{label}</p>
      <div className="mt-2 break-words font-mono text-sm font-black">{fmtVector(value)}</div>
      <p className="mt-2 text-xs leading-5 opacity-80">{detail}</p>
    </div>
  );
}

function MatrixCell({ value, active, blocked }) {
  const opacity = blocked ? 1 : Math.max(0.18, value);
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-lg text-xs font-black ${active ? 'ring-2 ring-slate-950 ring-offset-1' : ''} ${
        blocked ? 'bg-slate-200 text-slate-400' : 'bg-cyan-600 text-white'
      }`}
      style={{ opacity }}
    >
      {blocked ? '×' : Math.round(value * 100)}
    </div>
  );
}

export default function SelfAttentionAnimation() {
  const projections = useMemo(() => buildTokenProjections(), []);
  const [queryIndex, setQueryIndex] = useState(4);
  const [temperature, setTemperature] = useState(1);
  const [causalMask, setCausalMask] = useState(false);
  const [queryFeatureOffset, setQueryFeatureOffset] = useState(0);

  const selected = projections[queryIndex];
  const row = useMemo(() => attentionRow({
    projections,
    queryIndex,
    causal: causalMask,
    temperature,
    queryFeatureOffset,
  }), [causalMask, projections, queryFeatureOffset, queryIndex, temperature]);

  const matrix = useMemo(() => attentionMatrix({
    projections,
    causal: causalMask,
    temperature,
    selectedQueryIndex: queryIndex,
    queryFeatureOffset,
  }), [causalMask, projections, queryFeatureOffset, queryIndex, temperature]);

  const reset = () => {
    setQueryIndex(4);
    setTemperature(1);
    setCausalMask(false);
    setQueryFeatureOffset(0);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-300">Transformer foundation · real Q/K/V math</p>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">Self-Attention: trace one token from embedding to context</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">
              Every vector on this page is computed. Token embeddings are projected into Q, K, and V, scaled dot products become softmax weights, masks are applied before softmax, and the final context vector is a weighted sum of values.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-bold text-white">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} /> Experiment controls
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="text-sm font-bold text-slate-700">Query token</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {projections.map((token, index) => (
                <button
                  key={token.token}
                  type="button"
                  onClick={() => setQueryIndex(index)}
                  className={`rounded-lg border px-3 py-2 text-sm font-black ${queryIndex === index ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                >
                  {token.token}
                </button>
              ))}
            </div>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Query feature intervention: {queryFeatureOffset >= 0 ? '+' : ''}{queryFeatureOffset.toFixed(2)}
            <input min="-0.8" max="0.8" step="0.05" type="range" value={queryFeatureOffset} onChange={(event) => setQueryFeatureOffset(Number(event.target.value))} />
            <span className="text-xs font-semibold leading-5 text-slate-500">Perturb q₁ for the selected token and watch only its attention row change.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Softmax temperature: {temperature.toFixed(2)}
            <input min="0.35" max="2.5" step="0.05" type="range" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
            <span className="text-xs font-semibold leading-5 text-slate-500">1.0 is the normal lesson path; lower values sharpen the same scores.</span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={causalMask} onChange={(event) => setCausalMask(event.target.checked)} className="mt-1" />
            <span>
              Causal attention
              <small className="mt-1 block font-semibold leading-5 text-slate-500">Future keys receive zero probability because masking happens before softmax.</small>
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <GitBranch size={16} /> Projection pipeline for “{selected.token}”
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <VectorCard label="Embedding x" value={selected.embedding} detail="The token representation before attention projections." />
          <VectorCard label="Query q = xWq" value={row.query} detail={queryFeatureOffset === 0 ? 'What this token is looking for.' : 'Includes the live q₁ intervention.'} tone="cyan" />
          <VectorCard label="Key k = xWk" value={selected.k} detail="What this token offers for matching." tone="violet" />
          <VectorCard label="Value v = xWv" value={selected.v} detail="The information routed if this token receives weight." tone="emerald" />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label="dₖ" value={row.query.length} detail={`Scale = √dₖ = ${row.scale.toFixed(3)}`} />
        <Stat label="Strongest key" value={projections[row.winnerIndex].token} detail={`${(row.weights[row.winnerIndex] * 100).toFixed(1)}% of this row's probability.`} />
        <Stat label="Visible keys" value={row.blocked.filter((value) => !value).length} detail={causalMask ? 'Future tokens are excluded.' : 'Bidirectional: every token is visible.'} />
        <Stat label="Context output" value={fmtVector(row.output)} detail="Σ attentionᵢ · Vᵢ" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <Calculator size={16} /> One complete attention row
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Key token</th>
                  <th className="px-3 py-2 text-right">q · k</th>
                  <th className="px-3 py-2 text-right">/ √dₖ</th>
                  <th className="px-3 py-2 text-right">softmax</th>
                  <th className="px-3 py-2 text-left">Value routed</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((token, index) => (
                  <tr key={token.token} className="border-t border-slate-200">
                    <td className="px-3 py-3 font-black text-slate-900">{token.token}</td>
                    <td className="px-3 py-3 text-right font-mono">{row.blocked[index] ? 'masked' : row.dotProducts[index].toFixed(3)}</td>
                    <td className="px-3 py-3 text-right font-mono">{row.blocked[index] ? '−∞' : row.scaledScores[index].toFixed(3)}</td>
                    <td className="px-3 py-3 text-right font-mono font-black text-cyan-700">{(row.weights[index] * 100).toFixed(1)}%</td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-600">{fmtVector(token.v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-sm leading-7 text-cyan-100">
            Q = XWq · K = XWk · V = XWv<br />
            scores = QKᵀ / √dₖ<br />
            weights = softmax(mask(scores))<br />
            context = weights · V
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-950">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Hands-on challenge</p>
            <p className="mt-2 text-sm leading-6">Pick <strong>crossed</strong>, turn on causal attention, then predict which columns must become exactly zero before looking at the matrix.</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700"><AlertTriangle size={14} /> Interpretation trap</p>
            <p className="mt-2 text-sm leading-6">A large attention weight says which value vector is routed strongly. It does not prove that token is a human-readable explanation for the model's final prediction.</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-700"><ShieldCheck size={14} /> Boundary to remember</p>
            <p className="mt-2 text-sm leading-6">Bidirectional self-attention can read both sides of a token. Causal self-attention uses the same mechanism with a mask that removes future positions.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <BarChart3 size={16} /> Full attention matrix · rows are queries, columns are keys
        </div>
        <div className="grid grid-cols-[96px_repeat(5,minmax(48px,1fr))] gap-2">
          <div />
          {projections.map((token) => <div key={token.token} className="truncate text-center text-xs font-black uppercase text-slate-500">{token.token}</div>)}
          {matrix.map((matrixRow, rowIndex) => (
            <React.Fragment key={projections[rowIndex].token}>
              <div className="flex items-center text-sm font-black text-slate-700">{projections[rowIndex].token}</div>
              {matrixRow.weights.map((value, colIndex) => (
                <MatrixCell
                  key={`${rowIndex}-${colIndex}`}
                  value={value}
                  active={rowIndex === queryIndex && colIndex === row.winnerIndex}
                  blocked={matrixRow.blocked[colIndex]}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      <AssessmentPanel lessonId="self-attention" title="Self-attention check" />
    </div>
  );
}
