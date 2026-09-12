import React, { useMemo, useState } from 'react';
import { GitBranch, RotateCcw, SlidersHorizontal, Trees } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import ForestDiversityFailureLab from './ForestDiversityFailureLab';
import {
  BOOSTING_CONFIG,
  FOREST_CONFIG,
  TREE_CONFIG,
} from './treeEnsemblesConstants';
import {
  POINTS,
  buildRandomForest,
  fitDecisionTree,
  fitLogisticBoosting,
  forestDiversityDiagnostics,
  forestPrediction,
  outOfBagReport,
  predictBoosting,
  predictTree,
  toScreen,
  treeAccuracy,
  treeSplitSegments,
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

function formatPercent(value) {
  return value == null ? '—' : `${(value * 100).toFixed(1)}%`;
}

function splitLine(segment) {
  if (segment.feature === 'x') {
    const x = 32 + segment.threshold * 296;
    return {
      x1: x,
      x2: x,
      y1: 328 - segment.bounds.maxY * 296,
      y2: 328 - segment.bounds.minY * 296,
    };
  }
  const y = 328 - segment.threshold * 296;
  return {
    x1: 32 + segment.bounds.minX * 296,
    x2: 32 + segment.bounds.maxX * 296,
    y1: y,
    y2: y,
  };
}

function SplitMap({ tree, selectedIndex, onSelect }) {
  const segments = treeSplitSegments(tree);
  return (
    <svg viewBox="0 0 360 360" className="h-auto w-full rounded-lg border border-slate-200 bg-slate-50" role="img" aria-label="Data-fitted decision tree split map">
      <line x1="32" y1="328" x2="328" y2="328" stroke="#94a3b8" />
      <line x1="32" y1="32" x2="32" y2="328" stroke="#94a3b8" />
      {segments.map((segment, index) => {
        const line = splitLine(segment);
        return (
          <line
            key={`${segment.feature}-${segment.threshold}-${index}`}
            {...line}
            stroke={segment.depth === 0 ? '#0f172a' : '#64748b'}
            strokeWidth={segment.depth === 0 ? 3 : 2}
            strokeDasharray={segment.depth === 0 ? undefined : '6 5'}
          />
        );
      })}
      {POINTS.map((point, index) => {
        const [x, y] = toScreen(point);
        const selected = selectedIndex === index;
        return (
          <g key={point.id} onClick={() => onSelect(index)} className="cursor-pointer">
            <circle
              cx={x}
              cy={y}
              r={selected ? 9 : 6}
              fill={point.label ? '#dc2626' : '#2563eb'}
              stroke={selected ? '#0f172a' : 'white'}
              strokeWidth={selected ? 4 : 2}
            />
            <text x={x + 9} y={y + 4} className="fill-slate-500 text-[9px] font-bold">{point.id}</text>
          </g>
        );
      })}
      <text x="180" y="350" textAnchor="middle" className="fill-slate-600 text-xs font-bold">feature x</text>
      <text x="14" y="184" textAnchor="middle" transform="rotate(-90 14 184)" className="fill-slate-600 text-xs font-bold">feature y</text>
    </svg>
  );
}

export default function TreeEnsemblesAnimation() {
  const [depth, setDepth] = useState(TREE_CONFIG.defaultDepth);
  const [treeCount, setTreeCount] = useState(FOREST_CONFIG.defaultTrees);
  const [rounds, setRounds] = useState(BOOSTING_CONFIG.defaultRounds);
  const [learningRate, setLearningRate] = useState(BOOSTING_CONFIG.defaultLearningRate);
  const [selectedIndex, setSelectedIndex] = useState(8);
  const selectedPoint = POINTS[selectedIndex];

  const singleTree = useMemo(() => fitDecisionTree(POINTS, depth), [depth]);
  const forest = useMemo(() => buildRandomForest(treeCount, depth), [treeCount, depth]);
  const forestResult = useMemo(() => forestPrediction(selectedPoint, forest), [selectedPoint, forest]);
  const oob = useMemo(() => outOfBagReport(forest), [forest]);
  const diversity = useMemo(() => forestDiversityDiagnostics(forest), [forest]);
  const boostingModel = useMemo(() => fitLogisticBoosting(rounds, learningRate), [rounds, learningRate]);
  const boosted = useMemo(() => predictBoosting(selectedPoint, boostingModel), [selectedPoint, boostingModel]);
  const treeLabel = predictTree(selectedPoint, singleTree);
  const finalBoostLoss = boostingModel.steps.at(-1).trainLogLoss;

  const reset = () => {
    setDepth(TREE_CONFIG.defaultDepth);
    setTreeCount(FOREST_CONFIG.defaultTrees);
    setRounds(BOOSTING_CONFIG.defaultRounds);
    setLearningRate(BOOSTING_CONFIG.defaultLearningRate);
    setSelectedIndex(8);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Trees, bagging, and boosting</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Tree Ensembles</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              Every split, bootstrap sample, out-of-bag score, and boosting correction below is fitted from the displayed data. A forest reduces variance by averaging genuinely different trees; boosting lowers a loss sequentially by fitting the remaining error signal.
            </p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Stat label="Tree fit" value={formatPercent(treeAccuracy(singleTree))} detail={`training accuracy at depth ${depth}`} />
        <Stat label="Forest vote" value={`${forestResult.positiveVotes}/${treeCount}`} detail={`class ${forestResult.label}; agreement, not calibrated probability`} />
        <Stat label="OOB accuracy" value={formatPercent(oob.accuracy)} detail={`${formatPercent(oob.coverage)} of rows have an omitted-tree prediction`} />
        <Stat label="Tree disagreement" value={formatPercent(diversity.pairwiseDisagreement)} detail={`${diversity.uniqueBootstrapSamples}/${treeCount} unique bootstrap samples`} />
        <Stat label="Boosting loss" value={finalBoostLoss.toFixed(3)} detail={`${rounds} fitted residual-gradient stumps`} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
          <SlidersHorizontal size={16} /> Controls
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Tree depth: {depth}
            <input min={TREE_CONFIG.minDepth} max={TREE_CONFIG.maxDepth} step="1" type="range" value={depth} onChange={(event) => setDepth(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Forest trees: {treeCount}
            <input min={FOREST_CONFIG.minTrees} max={FOREST_CONFIG.maxTrees} step="1" type="range" value={treeCount} onChange={(event) => setTreeCount(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Boosting rounds: {rounds}
            <input min={BOOSTING_CONFIG.minRounds} max={BOOSTING_CONFIG.maxRounds} step="1" type="range" value={rounds} onChange={(event) => setRounds(Number(event.target.value))} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Learning rate: {learningRate.toFixed(2)}
            <input min={BOOSTING_CONFIG.minLearningRate} max={BOOSTING_CONFIG.maxLearningRate} step={BOOSTING_CONFIG.learningRateStep} type="range" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} />
          </label>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-600">
            <GitBranch size={16} /> Data-fitted single tree
          </div>
          <SplitMap tree={singleTree} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            Solid line = root split selected by Gini gain. Dashed lines = deeper fitted splits. Increasing depth changes the learner itself; no split coordinates are hand-authored.
          </p>
        </section>

        <aside className="grid gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Selected point {selectedPoint.id}</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                Fitted depth-{depth} tree predicts <strong className="text-slate-950">class {treeLabel}</strong>; actual class is <strong>{selectedPoint.label}</strong>.
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-950">
                The bootstrap forest gives <strong>{formatPercent(forestResult.positiveVoteShare)}</strong> positive vote share. That is tree agreement, not automatically a calibrated probability.
              </div>
              <div className="rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-950">
                Logistic boosting produces score <strong>{boosted.score.toFixed(2)}</strong> and probability-shaped output <strong>{formatPercent(boosted.probability)}</strong>. Calibration still needs separate checking.
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-800"><Trees size={16} /> Real OOB evidence</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-950">
              Each row is scored only by trees whose bootstrap sample omitted that row. Current OOB coverage is <strong>{formatPercent(oob.coverage)}</strong> and OOB accuracy is <strong>{formatPercent(oob.accuracy)}</strong>. This is internal validation evidence, not permission to skip a deployment-aligned final evaluation.
            </p>
          </section>
        </aside>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Sequential boosting path</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Each round computes residual gradients <code>y − p</code>, fits the best one-split regression tree to those residuals, shrinks its contribution by the learning rate, and then measures the new logistic training loss.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {boosted.steps.map((step) => (
            <div key={step.round} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">round {step.round}</p>
              <strong className="mt-1 block text-sm text-slate-950">{step.feature} &lt; {step.threshold.toFixed(3)}</strong>
              <p className="mt-2 text-xs leading-5 text-slate-700">selected-point delta {step.delta >= 0 ? '+' : ''}{step.delta.toFixed(3)}</p>
              <p className="text-xs leading-5 text-slate-700">train log loss {step.trainLogLoss.toFixed(3)}</p>
            </div>
          ))}
        </div>
      </section>

      <ForestDiversityFailureLab />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-blue-700">Decision tree</h3>
          <p className="mt-3 text-sm leading-6 text-blue-950">A fitted tree is readable because each prediction follows learned threshold tests. More depth lowers training bias but can make the learner unstable.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Random forest</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">Bootstrap rows and random feature subsets create actual tree diversity. OOB predictions provide internal evidence using only trees that did not train on the scored row.</p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-rose-700">Gradient boosting</h3>
          <p className="mt-3 text-sm leading-6 text-rose-950">Boosting is sequential loss reduction, not a fixed list of corrections. Learning rate and round count jointly control how aggressively the additive model fits.</p>
        </div>
      </section>

      <AssessmentPanel lessonId="tree-ensembles" title="Tree Ensembles check" />
    </div>
  );
}
