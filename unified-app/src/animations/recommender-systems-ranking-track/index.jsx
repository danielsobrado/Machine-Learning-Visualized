import React, { useMemo, useState } from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import { BarTrack, ControlBench, Note, NoteRow, Plate, Readouts, Slider, Steps } from '../_shared/notebook';
import PositionBiasLab from './PositionBiasLab.jsx';
import { CONTROL_LIMITS, DEFAULT_SCENARIO, MODEL_DEFINITIONS, SCENARIO_PRESETS } from './recommenderConfig.js';
import { buildRecommenderLab } from './recommenderModel.js';

const pct = (value) => `${(value * 100).toFixed(0)}%`;
const metric = (value) => Number.isFinite(value) ? value.toFixed(3) : '—';

export default function RecommenderSystemsRankingTrackAnimation() {
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const lab = useMemo(() => buildRecommenderLab(scenario), [scenario]);
  const popularity = lab.comparisons.find((model) => model.id === 'popularity');
  const feedbackBenefit = lab.feedback.final.reach - lab.noExploration.final.reach;
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <div className="nb-lesson">
      <Plate label="Ranking workbench" title="Recommender Systems & Ranking" note="A recommender is a ranked exposure system. Learn relevance, cold start, exploration, feedback loops, and the bias hidden inside logged clicks.">
        <NoteRow>
          <Note label="Baseline" title="Popularity is the opponent"><p>Personalization should beat a simple popularity ranking before it earns complexity.</p></Note>
          <Note label="Metric" title="Order matters"><p>nDCG@K rewards putting the strongest items near the top; precision and recall alone cannot see position.</p></Note>
          <Note label="Data" title="Exposure becomes labels"><p>What the system shows affects what users can click, so tomorrow's training data depends on today's ranking.</p></Note>
        </NoteRow>
      </Plate>

      <ControlBench label="Create a recommendation scenario" actions={<button type="button" className="nb-reset" onClick={() => setScenario(DEFAULT_SCENARIO)}>Reset</button>}>
        <Slider label="Interaction history" value={scenario.historyStrength} {...CONTROL_LIMITS.historyStrength} format={(value) => `${value}%`} help="Reliable collaborative history; zero approximates cold start." onChange={(value) => update('historyStrength', value)} />
        <Slider label="Exploration budget" value={scenario.exploration} {...CONTROL_LIMITS.exploration} format={(value) => `${value}%`} help="Novelty bonus that gives less-exposed items a chance." onChange={(value) => update('exploration', value)} />
        <Slider label="Top K" value={scenario.topK} {...CONTROL_LIMITS.topK} format={String} help="How many recommendations are exposed and evaluated." onChange={(value) => update('topK', value)} />
      </ControlBench>

      <div className="-mt-2 mb-2 flex flex-wrap gap-2" aria-label="Recommendation scenario presets">
        {SCENARIO_PRESETS.map((preset) => <button key={preset.id} type="button" className="ds-btn" onClick={() => setScenario((current) => ({ ...current, ...preset.values }))}>{preset.label}</button>)}
      </div>

      <Plate label="1 · Pick the ranker" title="Baseline, collaborative, or hybrid">
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Ranking model">
          {MODEL_DEFINITIONS.map((model) => <button key={model.id} type="button" aria-pressed={scenario.modelId === model.id} className={`ds-btn ${scenario.modelId === model.id ? 'primary' : ''}`} title={model.detail} onClick={() => update('modelId', model.id)}>{model.label}</button>)}
        </div>
        <Readouts columns={5} items={[
          { label: `nDCG@${scenario.topK}`, value: metric(lab.selected.metrics.ndcg), detail: 'Position-aware relevance' },
          { label: `Precision@${scenario.topK}`, value: pct(lab.selected.metrics.precision), detail: 'Relevant among shown' },
          { label: `Recall@${scenario.topK}`, value: pct(lab.selected.metrics.recall), detail: 'Relevant catalog recovered' },
          { label: 'Diversity', value: pct(lab.selected.metrics.diversity), detail: 'Distinct categories / K' },
          { label: 'Novelty', value: pct(lab.selected.metrics.novelty), detail: 'Average long-tail exposure' },
        ]} />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500"><th className="py-2 pr-4">Ranker</th><th className="py-2 pr-4">nDCG</th><th className="py-2 pr-4">Precision</th><th className="py-2 pr-4">Recall</th><th className="py-2 pr-4">Diversity</th><th className="py-2">Novelty</th></tr></thead>
            <tbody>{lab.comparisons.map((model) => <tr key={model.id} className={`border-b border-slate-200 ${model.id === scenario.modelId ? 'font-semibold' : ''}`}><td className="py-3 pr-4">{model.label}{model.id === scenario.modelId ? ' ← selected' : ''}<div className="mt-1 text-xs font-normal text-slate-500">{model.detail}</div></td><td className="py-3 pr-4 tabular-nums">{metric(model.metrics.ndcg)}</td><td className="py-3 pr-4 tabular-nums">{pct(model.metrics.precision)}</td><td className="py-3 pr-4 tabular-nums">{pct(model.metrics.recall)}</td><td className="py-3 pr-4 tabular-nums">{pct(model.metrics.diversity)}</td><td className="py-3 tabular-nums">{pct(model.metrics.novelty)}</td></tr>)}</tbody>
          </table>
        </div>
      </Plate>

      <div className="nb-split">
        <Plate label="2 · Inspect the ordering" title={`Top ${scenario.topK} for this user`}>
          <ol className="divide-y divide-slate-200">{lab.selected.ranking.slice(0, scenario.topK).map((item, index) => <li key={item.id} className="flex items-start gap-3 py-3"><span className="w-7 font-mono text-slate-400">#{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-2"><strong>{item.name}</strong><span className="font-mono text-xs text-slate-500">score {metric(item.score)}</span></div><div className="mt-1 text-xs text-slate-500">{item.category} · relevance {metric(item.relevance)} · popularity {pct(item.popularity)}</div></div></li>)}</ol>
        </Plate>
        <Plate label="3 · Shipping checklist" title="Did personalization earn its place?">
          <Steps items={[
            { title: 'Beat popularity', pass: lab.selected.metrics.ndcg > popularity.metrics.ndcg, body: lab.selected.metrics.ndcg > popularity.metrics.ndcg ? `Selected nDCG ${metric(lab.selected.metrics.ndcg)} beats popularity ${metric(popularity.metrics.ndcg)}.` : 'Popularity is as good or better; personalization has not earned its complexity.' },
            { title: 'Survive cold start', pass: scenario.historyStrength >= 20 || scenario.modelId === 'hybrid', body: scenario.historyStrength >= 20 ? 'Enough interaction history exists for collaborative signal.' : scenario.modelId === 'hybrid' ? 'Sparse history, but content affinity remains available.' : 'Sparse history with no strong content fallback.' },
            { title: 'Watch exposure', pass: scenario.exploration > 0 || lab.feedback.final.reach >= 0.5, body: scenario.exploration > 0 ? `Exploration changes catalog reach by ${(feedbackBenefit * 100).toFixed(0)} points here.` : 'No exploration budget: repeated exposure can harden the current ranking into future data.' },
          ]} />
        </Plate>
      </div>

      <Plate label="4 · Run the feedback loop" title="Ten rounds of exposure become tomorrow's popularity">
        <div className="nb-bar-stack">
          <BarTrack label="Catalog reached with exploration" value={`${lab.feedback.final.reached} / 12 items`} width={lab.feedback.final.reach * 100} tone="good" />
          <BarTrack label="Catalog reached with exploration = 0" value={`${lab.noExploration.final.reached} / 12 items`} width={lab.noExploration.final.reach * 100} tone="warn" />
          <BarTrack label="Top-item exposure share" value={pct(lab.feedback.final.topShare)} width={lab.feedback.final.topShare * 100} tone={lab.feedback.final.topShare <= 0.35 ? 'good' : 'warn'} />
          <BarTrack label="Exposure concentration (HHI)" value={metric(lab.feedback.final.hhi)} width={lab.feedback.final.hhi * 100} tone={lab.feedback.final.hhi <= 0.25 ? 'good' : 'warn'} />
        </div>
        <p className="nb-plate-note mt-4">HHI is the sum of squared exposure shares. Higher values mean traffic is concentrating on fewer items.</p>
      </Plate>

      <PositionBiasLab />

      <Note tone="accent" label="Takeaway" title="Recommendation quality is ranking plus exposure plus learning"><p>Evaluate ordered relevance, test cold start, measure exploration and concentration, and remember that logged clicks are shaped by position and exposure. They are not automatically unbiased relevance labels.</p></Note>
      <AssessmentPanel lessonId="recommender-systems-ranking-track" title="Recommender systems check" />
    </div>
  );
}
