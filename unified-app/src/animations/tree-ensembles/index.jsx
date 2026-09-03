import React, { useMemo, useState } from 'react';
import { GitBranch, RotateCcw, SlidersHorizontal, Trees } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import ForestDiversityFailureLab from './ForestDiversityFailureLab';
import {
  POINTS,
  accuracy,
  boostedScore,
  forestPrediction,
  predictTree,
  toScreen,
} from './treeEnsemblesModel';

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-900">{value}</strong>
      <span className="text-sm text-slate-600">{detail}</span>
    </div>
  );
}

function SplitMap({ depth, selectedIndex, onSelect }) {
  return (
    <svg viewBox="0 0 360 360" className="h-auto w-full rounded-lg border border-slate-200 bg-slate-50">
      <rect x="32" y="32" width="154" height="296" fill="#dbeafe" opacity="0.45" />
      <rect x="186" y="32" width="142" height="296" fill="#fee2e2" opacity="0.45" />
      {depth >= 2 && (
        <>
          <line x1="32" y1="126" x2="186" y2="126" stroke="#2563eb" strokeWidth="3" strokeDasharray="6 5" />
          <line x1="186" y1="204" x2="328" y2="204" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 5" />
        </>
      )}
      {depth >= 3 && <line x1="263" y1="204" x2="263" y2="328" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 5" />}
      <line x1="186" y1="32" x2="186" y2="328" stroke="#0f172a" strokeWidth="3" />
      <line x1="32" y1="328" x2="328" y2="328" stroke="#94a3b8" />
      <line x1="32" y1="32" x2="32" y2="328" stroke="#94a3b8" />
      {POINTS.map((point, index) => {
        const [x, y] = toScreen(point);
        const selected = selectedIndex === index;
        return (
          <g key={`${point.x}-${point.y}`} onClick={() => onSelect(index)} className="cursor-pointer">
            <circle
              cx={x}
              cy={y}
              r={selected ? 9 : 6}
              fill={point.label ? '#dc2626' : '#2563eb'}
              stroke={selected ? '#0f172a' : 'white'}
              strokeWidth={selected ? 4 : 2}
            />
          </g>
        );
      })}
      <text x="180" y="350" textAnchor="middle" className="fill-slate-600 text-xs font-bold">feature x</text>
      <text x="14" y="184" textAnchor="middle" transform="rotate(-90 14 184)" className="fill-slate-600 text-xs font-bold">feature y</text>
    </svg>
  );
}

export default function TreeEnsemblesAnimation() {
  const [depth, setDepth] = useState(2);
  const [treeCount, setTreeCount] = useState(5);
  const [rounds, setRounds] = useState(3);
  const [learningRate, setLearningRate] = useState(0.7);
  const [selectedIndex, setSelectedIndex] = useState(8);
  const selectedPoint = POINTS[selectedIndex];
  const forest = useMemo(() => forestPrediction(selectedPoint, treeCount), [selectedPoint, treeCount]);
  const boosted = useMemo(() => boostedScore(selectedPoint, rounds, learningRate), [selectedPoint, rounds, learningRate]);
  const treeLabel = predictTree(selectedPoint, depth);

  const reset = () => {
    setDepth(2);
    setTreeCount(5);
    setRounds(3);
    setLearningRate(0.7);
    setSelectedIndex(8);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Trees, bagging, and boosting</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Tree Ensembles</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Decision trees split feature space into simple regions. Random forests average many varied trees to
              reduce variance. Gradient boosting adds small trees one after another so each round corrects remaining
              errors.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Tree depth" value={depth} detail={`${Math.round(accuracy(depth) * 100)}% training accuracy`} />
        <Stat label="Forest vote" value={`${forest.positiveVotes}/${treeCount}`} detail={`class ${forest.label}`} />
        <Stat label="Boosted probability" value={`${Math.round(boosted.probability * 100)}%`} detail={`${rounds} correction rounds`} />
        <Stat label="Selected actual" value={selectedPoint.label ? '+' : '-'} detail="click a point to inspect" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} />
          Controls
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Tree depth: {depth}
            <input min="1" max="3" step="1" type="range" value={depth} onChange={(event) => setDepth(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Forest trees: {treeCount}
            <input min="3" max="7" step="1" type="range" value={treeCount} onChange={(event) => setTreeCount(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Boosting rounds: {rounds}
            <input min="1" max="5" step="1" type="range" value={rounds} onChange={(event) => setRounds(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Learning rate: {learningRate.toFixed(2)}
            <input min="0.25" max="1" step="0.05" type="range" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <GitBranch size={16} />
            Single tree split map
          </div>
          <SplitMap depth={depth} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        </section>

        <aside className="grid gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Selected point decision</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                Single tree predicts <strong className="text-slate-950">class {treeLabel}</strong> from the current split depth.
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-950">
                Random forest has <strong>{Math.round(forest.positiveVoteShare * 100)}%</strong> positive vote share from varied tree votes.
                Vote share shows model agreement here; it is not automatically a calibrated class probability.
              </div>
              <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-950">
                Boosting score is <strong>{boosted.score.toFixed(2)}</strong> after scaled residual corrections.
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
              <Trees size={16} />
              Forest votes
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {forest.votes.map((vote, index) => (
                <div key={index} className={`rounded-lg border p-3 text-sm font-bold ${vote ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-blue-200 bg-blue-50 text-blue-900'}`}>
                  tree {index + 1}: class {vote}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Boosting correction path</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {boosted.steps.map((step, index) => (
            <div key={step.rule} className={`rounded-lg border p-4 ${step.matched ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">round {index + 1}</p>
              <strong className="mt-1 block text-sm text-slate-950">{step.rule}</strong>
              <p className="mt-2 text-sm text-slate-700">delta {step.delta.toFixed(2)}</p>
              <div className="mt-3 h-2 rounded bg-white">
                <div className="h-2 rounded bg-emerald-500" style={{ width: `${Math.min(100, Math.abs(step.score) * 60)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <ForestDiversityFailureLab />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-blue-700">Decision tree</h3>
          <p className="mt-3 text-sm leading-6 text-blue-950">
            A tree is readable because every prediction follows a path of threshold tests, but deeper paths can memorize
            training quirks.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Random forest</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Bagging reduces variance when the trees make sufficiently different errors. Feature randomness exists to help
            decorrelate trees; simply adding more near-identical trees gives diminishing benefit.
          </p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-rose-700">Gradient boosting</h3>
          <p className="mt-3 text-sm leading-6 text-rose-950">
            Boosting builds a strong model by adding weak trees that target the remaining errors, so learning rate and
            round count control overfitting risk.
          </p>
        </div>
      </section>

      <AssessmentPanel lessonId="tree-ensembles" title="Tree Ensembles check" />
    </div>
  );
}
