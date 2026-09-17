import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Q_LEARNING_ACTIONS,
  Q_LEARNING_ENVIRONMENT,
  Q_LEARNING_TRAINING_DEFAULTS,
  Q_LEARNING_TRAINING_LIMITS,
} from './qLearningTrainingConfig.js';
import {
  actionValues,
  compareTdControl,
  greedyActionIndex,
} from './qLearningTrainingModel.js';

function samePosition(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

function rollingAverage(episodes, index, windowSize = 10) {
  const start = Math.max(0, index - windowSize + 1);
  const window = episodes.slice(start, index + 1);
  return window.reduce((sum, episode) => sum + episode.return, 0) / window.length;
}

function Metric({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{detail}</span>
    </div>
  );
}

function Control({ label, value, limits, onChange, format = (number) => number.toFixed(2) }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      <span>{label}: {format(value)}</span>
      <input
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function PolicyGrid({ title, result }) {
  const environment = Q_LEARNING_ENVIRONMENT;
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black">{title}</h3>
        <span className="text-xs font-bold text-slate-400">final greedy policy</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: environment.rows * environment.columns }, (_, flatIndex) => {
          const row = Math.floor(flatIndex / environment.columns);
          const column = flatIndex % environment.columns;
          const position = [row, column];
          const cliff = environment.cliff.some((cell) => samePosition(cell, position));
          const goal = samePosition(environment.goal, position);
          const start = samePosition(environment.start, position);
          const values = actionValues(result.table, position);
          const hasLearnedValue = values.some((value) => Math.abs(value) > 1e-12);
          const action = Q_LEARNING_ACTIONS[greedyActionIndex(values)];
          return (
            <div
              key={`${row}-${column}`}
              className={`flex aspect-square min-h-12 items-center justify-center rounded-lg border text-lg font-black ${
                cliff
                  ? 'border-rose-800 bg-rose-950 text-rose-300'
                  : goal
                    ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                    : 'border-slate-700 bg-slate-900 text-cyan-300'
              }`}
              title={cliff ? 'Cliff: -100 and reset to start' : goal ? 'Goal' : `Q = ${values.map((value) => value.toFixed(2)).join(', ')}`}
            >
              {cliff ? '×' : goal ? 'G' : hasLearnedValue ? action.label : start ? 'S' : '·'}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-400">S = start · G = goal · × = cliff (-100, then reset)</p>
    </div>
  );
}

function ReplayCard({ transition }) {
  if (!transition) return null;
  const action = Q_LEARNING_ACTIONS[transition.actionIndex];
  const nextBehavior = transition.nextBehaviorActionIndex === null ? null : Q_LEARNING_ACTIONS[transition.nextBehaviorActionIndex];
  const bootstrapAction = transition.bootstrapActionIndex === null ? null : Q_LEARNING_ACTIONS[transition.bootstrapActionIndex];
  const offPolicyDifference = transition.algorithm === 'q-learning'
    && nextBehavior
    && bootstrapAction
    && transition.nextBehaviorActionIndex !== transition.bootstrapActionIndex;
  const targetRule = transition.algorithm === 'q-learning'
    ? 'r + γ maxₐ Q(s′, a)'
    : 'r + γ Q(s′, a′)';

  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-cyan-950 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">TD update replay</p>
          <h3 className="mt-1 text-xl font-black">Episode {transition.episode}, step {transition.step}</h3>
        </div>
        {offPolicyDifference && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">behavior ≠ bootstrap action</span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="State → action" value={`[${transition.state.join(',')}] ${action.label}`} detail={`reward ${transition.reward}`} />
        <Metric label="Next state" value={`[${transition.nextState.join(',')}]`} detail={transition.hitCliff ? 'cliff hit → reset' : transition.terminal ? 'terminal goal' : `next behavior ${nextBehavior?.label ?? '—'}`} />
        <Metric label="Bootstrap" value={bootstrapAction ? `${bootstrapAction.label} · ${transition.bootstrapValue.toFixed(2)}` : '0.00'} detail={transition.algorithm === 'q-learning' ? 'greedy next action' : 'actual next behavior action'} />
        <Metric label="TD error" value={transition.tdError.toFixed(2)} detail={`target ${transition.target.toFixed(2)} − old Q ${transition.currentValue.toFixed(2)}`} />
      </div>

      <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-sm leading-7 text-cyan-100">
        target = {targetRule}<br />
        target = {transition.reward.toFixed(2)} + γ × {transition.bootstrapValue.toFixed(2)} = {transition.target.toFixed(2)}<br />
        Q ← {transition.currentValue.toFixed(2)} + α × ({transition.target.toFixed(2)} − {transition.currentValue.toFixed(2)}) = {transition.updatedValue.toFixed(2)}
      </div>
    </div>
  );
}

export default function TrainingPanel() {
  const [alpha, setAlpha] = useState(Q_LEARNING_TRAINING_DEFAULTS.alpha);
  const [gamma, setGamma] = useState(Q_LEARNING_TRAINING_DEFAULTS.gamma);
  const [epsilon, setEpsilon] = useState(Q_LEARNING_TRAINING_DEFAULTS.epsilon);
  const [episodes, setEpisodes] = useState(Q_LEARNING_TRAINING_DEFAULTS.episodes);
  const [seed, setSeed] = useState(Q_LEARNING_TRAINING_DEFAULTS.seed);
  const [replayAlgorithm, setReplayAlgorithm] = useState(Q_LEARNING_TRAINING_DEFAULTS.replayAlgorithm);
  const [replayIndex, setReplayIndex] = useState(0);

  const config = useMemo(() => ({
    ...Q_LEARNING_TRAINING_DEFAULTS,
    alpha,
    gamma,
    epsilon,
    episodes,
    seed,
  }), [alpha, episodes, epsilon, gamma, seed]);
  const comparison = useMemo(() => compareTdControl(config), [config]);
  const replayResult = replayAlgorithm === 'q-learning' ? comparison.qLearning : comparison.sarsa;
  const safeReplayIndex = Math.min(replayIndex, Math.max(0, replayResult.transitions.length - 1));
  const replayTransition = replayResult.transitions[safeReplayIndex];
  const chartData = comparison.qLearning.episodes.map((episode, index) => ({
    episode: episode.episode,
    qLearning: rollingAverage(comparison.qLearning.episodes, index),
    sarsa: rollingAverage(comparison.sarsa.episodes, index),
  }));

  const updateControl = (setter) => (value) => {
    setter(value);
    setReplayIndex(0);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">On-policy vs off-policy TD control</p>
        <h2 className="mt-1 text-3xl font-black text-slate-950">Q-learning and SARSA can see the same cliff and learn different behavior.</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
          Both agents use ε-greedy behavior. Q-learning bootstraps from the greedy next action even when the behavior policy explores; SARSA bootstraps from the next action the behavior policy actually selected. Change ε and inspect the learned policies and every TD target.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Control label="Exploration ε" value={epsilon} limits={Q_LEARNING_TRAINING_LIMITS.epsilon} onChange={updateControl(setEpsilon)} />
          <Control label="Learning rate α" value={alpha} limits={Q_LEARNING_TRAINING_LIMITS.alpha} onChange={updateControl(setAlpha)} />
          <Control label="Discount γ" value={gamma} limits={Q_LEARNING_TRAINING_LIMITS.gamma} onChange={updateControl(setGamma)} />
          <Control label="Episodes" value={episodes} limits={Q_LEARNING_TRAINING_LIMITS.episodes} onChange={updateControl(setEpisodes)} format={(value) => String(value)} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => { setSeed((value) => value + 1); setReplayIndex(0); }} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">New seeded run</button>
          <button
            type="button"
            onClick={() => {
              setAlpha(Q_LEARNING_TRAINING_DEFAULTS.alpha);
              setGamma(Q_LEARNING_TRAINING_DEFAULTS.gamma);
              setEpsilon(Q_LEARNING_TRAINING_DEFAULTS.epsilon);
              setEpisodes(Q_LEARNING_TRAINING_DEFAULTS.episodes);
              setSeed(Q_LEARNING_TRAINING_DEFAULTS.seed);
              setReplayIndex(0);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"
          >
            Reset
          </button>
          <span className="text-xs font-bold text-slate-500">seed {seed} · deterministic replay</span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <PolicyGrid title="Q-learning · off-policy target" result={comparison.qLearning} />
        <PolicyGrid title="SARSA · on-policy target" result={comparison.sarsa} />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Q-learning return" value={comparison.qLearning.summary.recentAverageReturn.toFixed(1)} detail="mean return over last 20 episodes" />
        <Metric label="SARSA return" value={comparison.sarsa.summary.recentAverageReturn.toFixed(1)} detail="mean return over last 20 episodes" />
        <Metric label="Q-learning cliff falls" value={comparison.qLearning.summary.cliffFalls} detail={`${(comparison.qLearning.summary.successRate * 100).toFixed(0)}% episodes reached goal`} />
        <Metric label="SARSA cliff falls" value={comparison.sarsa.summary.cliffFalls} detail={`${(comparison.sarsa.summary.successRate * 100).toFixed(0)}% episodes reached goal`} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Learning curve</p>
          <h3 className="text-lg font-black text-slate-950">10-episode rolling return</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="episode" />
              <YAxis />
              <Tooltip formatter={(value) => Number(value).toFixed(1)} />
              <Legend />
              <Line type="monotone" dataKey="qLearning" name="Q-learning" stroke="#0891b2" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sarsa" name="SARSA" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Step-by-step debugger</p>
            <h3 className="text-lg font-black text-slate-950">Inspect the exact bootstrap target</h3>
          </div>
          <div className="flex gap-2">
            {[
              ['q-learning', 'Q-learning'],
              ['sarsa', 'SARSA'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => { setReplayAlgorithm(id); setReplayIndex(0); }}
                className={`rounded-lg px-3 py-2 text-sm font-black ${replayAlgorithm === id ? 'bg-slate-950 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
          Replay transition {safeReplayIndex + 1} / {replayResult.transitions.length}
          <input
            type="range"
            min="0"
            max={Math.max(0, replayResult.transitions.length - 1)}
            step="1"
            value={safeReplayIndex}
            onChange={(event) => setReplayIndex(Number(event.target.value))}
          />
        </label>
      </section>

      <ReplayCard transition={replayTransition} />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          <strong className="block text-xs uppercase tracking-wide text-cyan-700">Q-learning</strong>
          Learns toward the greedy target <strong>max Q(s′, ·)</strong>. The target policy can be greedier than the ε-greedy behavior collecting the data.
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
          <strong className="block text-xs uppercase tracking-wide text-violet-700">SARSA</strong>
          Learns toward <strong>Q(s′, a′)</strong> for the action actually selected by the ε-greedy behavior policy, so exploration risk enters the update directly.
        </div>
      </section>
    </div>
  );
}
