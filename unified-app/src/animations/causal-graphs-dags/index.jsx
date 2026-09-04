import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, GitBranch, RotateCcw } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { ADJUSTMENT_PRESETS, CAUSAL_EDGES, CAUSAL_NODES } from './causalGraphConstants.js';
import { analyzePreset } from './causalGraphModel.js';

const NODE_POSITIONS = {
  C: { x: 80, y: 70 },
  T: { x: 210, y: 120 },
  M: { x: 330, y: 55 },
  S: { x: 330, y: 190 },
  U: { x: 450, y: 190 },
  Y: { x: 500, y: 85 },
};

function edgePath([from, to]) {
  const start = NODE_POSITIONS[from];
  const end = NODE_POSITIONS[to];
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

function PathCard({ path }) {
  const tone = path.active
    ? path.type === 'causal'
      ? 'border-emerald-200 bg-emerald-50'
      : 'border-rose-200 bg-rose-50'
    : 'border-slate-200 bg-slate-50';
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong className="text-sm text-slate-950">{path.label}</strong>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-700">
          {path.active ? 'OPEN' : 'BLOCKED'}
        </span>
      </div>
      <div className="mt-2 font-mono text-xs text-slate-600">{path.nodes.join(' — ')}</div>
      <p className="mt-2 text-sm leading-6 text-slate-700">{path.explanation}</p>
    </div>
  );
}

export default function CausalGraphsDagsAnimation() {
  const [presetId, setPresetId] = useState('none');
  const analysis = useMemo(() => analyzePreset(presetId), [presetId]);
  const adjusted = new Set(analysis.adjustment);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-violet-700">
              <GitBranch size={16} />
              Causal structure
            </div>
            <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Causal Graphs / DAGs: adjustment is structural, not a bias slider</h1>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Choose an adjustment set for the total effect of T on Y. The graph decides which paths open or close; there is no invented percentage score for “how much confounding” a variable removes.
            </p>
          </div>
          <button type="button" onClick={() => setPresetId('none')} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Adjustment set</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ADJUSTMENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setPresetId(preset.id)}
              aria-pressed={presetId === preset.id}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-black transition ${presetId === preset.id ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Teaching DAG</h2>
          <svg viewBox="0 0 580 250" className="mt-4 h-auto w-full rounded-xl bg-slate-50" role="img" aria-label="Causal DAG with confounder, mediator, collider and outcome">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
              </marker>
            </defs>
            {CAUSAL_EDGES.map((edge) => <path key={edge.join('-')} d={edgePath(edge)} stroke="#64748b" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />)}
            {Object.entries(CAUSAL_NODES).map(([id, node]) => {
              const position = NODE_POSITIONS[id];
              const isAdjusted = adjusted.has(id);
              return (
                <g key={id}>
                  <circle cx={position.x} cy={position.y} r="25" fill={isAdjusted ? '#7c3aed' : '#ffffff'} stroke={isAdjusted ? '#6d28d9' : '#94a3b8'} strokeWidth="3" />
                  <text x={position.x} y={position.y + 5} textAnchor="middle" fontWeight="900" fill={isAdjusted ? '#ffffff' : '#0f172a'}>{id}</text>
                  <text x={position.x} y={position.y + 42} textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">{node.name}</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-3 text-xs leading-5 text-slate-500">Purple nodes are conditioned on. Target estimand: total effect of T on Y.</p>
        </div>

        <div className={`rounded-2xl border p-5 shadow-sm ${analysis.validForTotalEffect ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <div className="flex items-start gap-3">
            {analysis.validForTotalEffect ? <CheckCircle2 className="mt-0.5 text-emerald-700" /> : <AlertTriangle className="mt-0.5 text-amber-700" />}
            <div>
              <h2 className="font-black text-slate-950">{analysis.validForTotalEffect ? 'Adjustment set is structurally valid' : 'Adjustment set is not valid for the total effect'}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{analysis.verdict}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-3"><div className="text-xs font-black uppercase text-slate-500">Open backdoors</div><div className="mt-1 text-2xl font-black">{analysis.openBackdoors.length}</div></div>
            <div className="rounded-xl bg-white p-3"><div className="text-xs font-black uppercase text-slate-500">Opened colliders</div><div className="mt-1 text-2xl font-black">{analysis.openedColliders.length}</div></div>
            <div className="rounded-xl bg-white p-3"><div className="text-xs font-black uppercase text-slate-500">Blocked causal paths</div><div className="mt-1 text-2xl font-black">{analysis.blockedCausalPaths.length}</div></div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-600">Path audit</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {analysis.paths.map((path) => <PathCard key={path.id} path={path} />)}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><strong>Confounder:</strong> adjusting C closes T ← C → Y.</div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Mediator:</strong> adjusting M changes the estimand by blocking T → M → Y, so it is wrong for the total effect.</div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950"><strong>Collider:</strong> conditioning on S opens T → S ← U → Y and can create a non-causal association.</div>
      </section>

      <AssessmentPanel lessonId="causal-graphs-dags" title="Causal DAG check" />
    </div>
  );
}
