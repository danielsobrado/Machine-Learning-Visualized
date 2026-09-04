import React, { useMemo, useState } from 'react';
import { Dices, RefreshCw, TrendingDown } from 'lucide-react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { BANDIT_SCENARIOS, EXPLORATION_DEFAULTS } from './explorationConfig';
import { epsilonGreedyProbabilities, simulateBandit } from './explorationModel';

function Stat({ label, value, detail }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><strong className="mt-1 block text-2xl font-black text-slate-950">{value}</strong><span className="text-sm text-slate-600">{detail}</span></div>;
}

export default function RlExplorationAnimation() {
  const [scenarioId, setScenarioId] = useState(EXPLORATION_DEFAULTS.scenarioId);
  const [epsilonStart, setEpsilonStart] = useState(EXPLORATION_DEFAULTS.epsilonStart);
  const [epsilonEnd, setEpsilonEnd] = useState(EXPLORATION_DEFAULTS.epsilonEnd);
  const [stepSizeMode, setStepSizeMode] = useState(EXPLORATION_DEFAULTS.stepSizeMode);
  const [seed, setSeed] = useState(EXPLORATION_DEFAULTS.seed);
  const scenario = BANDIT_SCENARIOS.find((item) => item.id === scenarioId);
  const result = useMemo(() => simulateBandit({ ...EXPLORATION_DEFAULTS, scenario, epsilonStart, epsilonEnd, stepSizeMode, seed }), [scenario, epsilonStart, epsilonEnd, stepSizeMode, seed]);
  const greedy = useMemo(() => simulateBandit({ ...EXPLORATION_DEFAULTS, scenario, epsilonStart: 0, epsilonEnd: 0, stepSizeMode, seed }), [scenario, stepSizeMode, seed]);
  const initialActionProbabilities = epsilonGreedyProbabilities(Array.from({ length: scenario.meansBefore.length }, () => 0), epsilonStart);
  const finalMeans = scenario.meansAfter ?? scenario.meansBefore;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Bandit learning lab</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Exploration vs Exploitation: measure regret, not just random-action counts</h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">A useful exploration strategy must discover good actions without spending forever on bad ones. This seeded bandit tracks reward estimates, action counts, optimal-action rate, and cumulative regret.</p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {BANDIT_SCENARIOS.map((item) => <button key={item.id} type="button" onClick={() => setScenarioId(item.id)} className={`rounded-lg border p-3 text-left ${scenarioId === item.id ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}><strong className="block text-sm text-slate-950">{item.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span></button>)}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-bold text-slate-700">Start ε: {epsilonStart.toFixed(2)}<input type="range" min="0" max="1" step="0.02" value={epsilonStart} onChange={(event) => setEpsilonStart(Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">End ε: {epsilonEnd.toFixed(2)}<input type="range" min="0" max="0.4" step="0.01" value={epsilonEnd} onChange={(event) => setEpsilonEnd(Number(event.target.value))} /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">Estimator<select value={stepSizeMode} onChange={(event) => setStepSizeMode(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2"><option value="sample-average">sample average</option><option value="constant">constant α = {EXPLORATION_DEFAULTS.constantAlpha}</option></select></label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Cumulative regret" value={result.cumulativeRegret.toFixed(1)} detail={`greedy baseline ${greedy.cumulativeRegret.toFixed(1)}`} />
        <Stat label="Optimal-action rate" value={`${(result.optimalActionRate * 100).toFixed(1)}%`} detail={`best final arm = ${result.finalBestArm + 1}`} />
        <Stat label="Learned best arm" value={`Arm ${result.learnedBestArm + 1}`} detail={result.learnedBestArm === result.finalBestArm ? 'matches current optimum' : 'estimate is stale/wrong'} />
        <Stat label="Random branch" value={`${(result.randomBranchRate * 100).toFixed(1)}%`} detail={`ε begins at ${(epsilonStart * 100).toFixed(0)}%`} />
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-600">Arms after {EXPLORATION_DEFAULTS.steps} pulls</h3>
          <div className="mt-4 space-y-3">
            {result.estimates.map((estimate, index) => (
              <div key={index} className={`rounded-lg border p-4 ${index === result.finalBestArm ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex justify-between gap-3"><strong>Arm {index + 1}</strong><span className="font-mono text-sm">Q̂={estimate.toFixed(3)} · pulls={result.counts[index]}</span></div>
                <p className="mt-1 text-xs text-slate-600">true mean now {finalMeans[index].toFixed(2)}{scenario.meansAfter ? ` · before ${scenario.meansBefore[index].toFixed(2)}` : ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <strong className="block text-xs uppercase tracking-wide text-amber-700">ε is not the non-greedy probability</strong>
            Once one action is uniquely greedy, with {scenario.meansBefore.length} actions, ε={epsilonStart.toFixed(2)} gives random-branch probability {epsilonStart.toFixed(2)}, but non-greedy probability only <strong>{result.nonGreedyProbabilityWhenUnique.toFixed(3)}</strong>. Random exploration can re-select the greedy action.
            <p className="mt-2 font-mono text-xs">initial action probabilities: {initialActionProbabilities.map((value) => value.toFixed(3)).join(' · ')}</p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-5 text-sm leading-6 text-violet-950">
            <TrendingDown className="mr-2 inline" size={16} /> {scenario.meansAfter ? 'When rewards change, sample averages remember the distant past forever. A constant step size forgets old evidence and can adapt.' : 'On a stationary problem, sample averages become increasingly stable while ε decays toward exploitation.'}
          </div>
          <button type="button" onClick={() => setSeed((value) => value + 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"><Dices size={16} /> New seeded run</button>
          <button type="button" onClick={() => { setScenarioId(EXPLORATION_DEFAULTS.scenarioId); setEpsilonStart(EXPLORATION_DEFAULTS.epsilonStart); setEpsilonEnd(EXPLORATION_DEFAULTS.epsilonEnd); setStepSizeMode(EXPLORATION_DEFAULTS.stepSizeMode); setSeed(EXPLORATION_DEFAULTS.seed); }} className="ml-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800"><RefreshCw size={16} /> Reset</button>
        </div>
      </section>

      <AssessmentPanel lessonId="rl-exploration" title="Exploration vs Exploitation check" />
    </div>
  );
}
