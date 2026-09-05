import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, GitBranch, RotateCcw } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import {
  ADJUSTMENT_PRESETS,
  CAUSAL_EDGES,
  CAUSAL_NODES,
  FRONT_DOOR_SCENARIOS,
  M_BIAS_EDGES,
  M_BIAS_NODES,
} from './causalGraphConstants.js';
import { analyzeFrontDoor, analyzeMBias, analyzePreset } from './causalGraphModel.js';

const NODE_POSITIONS = {
  C: { x: 80, y: 70 },
  T: { x: 210, y: 120 },
  M: { x: 330, y: 55 },
  S: { x: 330, y: 190 },
  U: { x: 450, y: 190 },
  Y: { x: 500, y: 85 },
};

const M_BIAS_POSITIONS = {
  T: { x: 55, y: 120 },
  A: { x: 155, y: 55 },
  K: { x: 260, y: 120 },
  B: { x: 365, y: 55 },
  Y: { x: 465, y: 120 },
};

const FRONT_DOOR_POSITIONS = {
  U: { x: 75, y: 55 },
  T: { x: 150, y: 145 },
  M: { x: 300, y: 145 },
  V: { x: 375, y: 55 },
  Y: { x: 450, y: 145 },
};

function edgePath(edge, positions) {
  const [from, to] = edge;
  const start = positions[from];
  const end = positions[to];
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

function MiniDag({ nodes, edges, positions, highlighted = new Set(), label }) {
  return (
    <svg viewBox="0 0 520 210" className="mt-4 h-auto w-full rounded-xl bg-slate-50" role="img" aria-label={label}>
      <defs>
        <marker id="mini-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
        </marker>
      </defs>
      {edges.map((edge) => (
        <path key={edge.join('-')} d={edgePath(edge, positions)} stroke="#64748b" strokeWidth="2.5" fill="none" markerEnd="url(#mini-arrow)" />
      ))}
      {Object.entries(nodes).map(([id, node]) => {
        const position = positions[id];
        if (!position) return null;
        const active = highlighted.has(id);
        return (
          <g key={id}>
            <circle cx={position.x} cy={position.y} r="23" fill={active ? '#7c3aed' : '#ffffff'} stroke={active ? '#6d28d9' : '#94a3b8'} strokeWidth="3" />
            <text x={position.x} y={position.y + 5} textAnchor="middle" fontWeight="900" fill={active ? '#ffffff' : '#0f172a'}>{id}</text>
            <text x={position.x} y={position.y + 38} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">{node.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function buildFrontDoorGraph(scenario) {
  const nodes = {
    U: { name: 'Hidden T/Y cause' },
    T: { name: 'Treatment' },
    M: { name: 'Mediator' },
    Y: { name: 'Outcome' },
  };
  const edges = [['U', 'T'], ['U', 'Y'], ['T', 'M'], ['M', 'Y']];
  if (scenario.directBypass) edges.push(['T', 'Y']);
  if (scenario.treatmentMediatorConfounding) edges.push(['U', 'M']);
  if (scenario.mediatorOutcomeConfounding) {
    nodes.V = { name: 'Hidden M/Y cause' };
    edges.push(['V', 'M'], ['V', 'Y']);
  }
  return { nodes, edges };
}

export default function CausalGraphsDagsAnimation() {
  const [presetId, setPresetId] = useState('none');
  const [conditionMBiasCollider, setConditionMBiasCollider] = useState(false);
  const [frontDoorScenarioId, setFrontDoorScenarioId] = useState('valid');
  const analysis = useMemo(() => analyzePreset(presetId), [presetId]);
  const mBias = useMemo(() => analyzeMBias(conditionMBiasCollider), [conditionMBiasCollider]);
  const frontDoor = useMemo(() => analyzeFrontDoor(frontDoorScenarioId), [frontDoorScenarioId]);
  const frontDoorGraph = useMemo(() => buildFrontDoorGraph(frontDoor.scenario), [frontDoor]);
  const adjusted = new Set(analysis.adjustment);

  const reset = () => {
    setPresetId('none');
    setConditionMBiasCollider(false);
    setFrontDoorScenarioId('valid');
  };

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
              Audit backdoors, mediators and colliders for the total effect, then stress-test the same reasoning on M-bias and front-door identification. A variable is not safe to control for just because it predicts treatment or outcome.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
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
            {CAUSAL_EDGES.map((edge) => <path key={edge.join('-')} d={edgePath(edge, NODE_POSITIONS)} stroke="#64748b" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />)}
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

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-violet-700">M-bias lab</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">A predictive covariate can be a collider</h2>
            </div>
            <button
              type="button"
              className={`rounded-xl border px-3 py-2 text-sm font-black ${conditionMBiasCollider ? 'border-rose-500 bg-rose-600 text-white' : 'border-slate-300 bg-white text-slate-800'}`}
              onClick={() => setConditionMBiasCollider((value) => !value)}
            >
              {conditionMBiasCollider ? 'Stop conditioning on K' : 'Condition on K'}
            </button>
          </div>
          <MiniDag
            nodes={M_BIAS_NODES}
            edges={M_BIAS_EDGES}
            positions={M_BIAS_POSITIONS}
            highlighted={conditionMBiasCollider ? new Set(['K']) : new Set()}
            label="M-bias DAG with collider K"
          />
          <div className={`mt-4 rounded-xl border p-4 ${mBias.active ? 'border-rose-200 bg-rose-50 text-rose-950' : 'border-emerald-200 bg-emerald-50 text-emerald-950'}`}>
            <strong>{mBias.active ? 'Path opened: M-bias risk' : 'Path blocked at collider K'}</strong>
            <p className="mt-1 text-sm leading-6">{mBias.verdict}</p>
            <p className="mt-2 font-mono text-xs">T ← A → K ← B → Y</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">Front-door lab</p>
          <h2 className="mt-1 text-lg font-black text-slate-950">Identification without measuring the T/Y confounder</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {Object.entries(FRONT_DOOR_SCENARIOS).map(([id, scenario]) => (
              <button
                key={id}
                type="button"
                className={`rounded-xl border p-3 text-left text-sm font-black ${frontDoorScenarioId === id ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                onClick={() => setFrontDoorScenarioId(id)}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <MiniDag
            nodes={frontDoorGraph.nodes}
            edges={frontDoorGraph.edges}
            positions={FRONT_DOOR_POSITIONS}
            label="Front-door identification DAG"
          />
          <div className="mt-4 grid gap-2">
            {frontDoor.criteria.map((criterion) => (
              <div key={criterion.id} className={`rounded-xl border p-3 ${criterion.pass ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
                <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                  {criterion.pass ? <CheckCircle2 size={16} className="text-emerald-700" /> : <AlertTriangle size={16} className="text-rose-700" />}
                  {criterion.label}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-600">{criterion.detail}</p>
              </div>
            ))}
          </div>
          <div className={`mt-4 rounded-xl border p-4 ${frontDoor.identified ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
            <strong>{frontDoor.identified ? 'Front-door identified' : 'Front-door criterion fails'}</strong>
            <p className="mt-1 text-sm leading-6">{frontDoor.verdict}</p>
          </div>
        </div>
      </section>

      <AssessmentPanel lessonId="causal-graphs-dags" title="Causal DAG check" />
    </div>
  );
}
