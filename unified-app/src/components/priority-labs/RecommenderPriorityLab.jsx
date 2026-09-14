import React, { useMemo, useState } from 'react';
import { ControlBench, Formula, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook';
import { buildMatrixFactorizationLab, buildNdcgLab } from './recommenderPriorityModel.js';

const DEFAULT_MATRIX_SCENARIO = Object.freeze({
  userFactor1: 0.9,
  userFactor2: 0.2,
  itemFactor1: 0.8,
  itemFactor2: -0.1,
  userBias: 0.15,
  itemBias: 0.05,
  globalBias: 3.2,
});

const DEFAULT_RELEVANCES = Object.freeze([3, 0, 2, 3, 1]);

const decimal = (value, digits = 3) => Number(value).toFixed(digits);

function MatrixFactorizationLab() {
  const [scenario, setScenario] = useState(DEFAULT_MATRIX_SCENARIO);
  const lab = useMemo(() => buildMatrixFactorizationLab({
    userFactors: [scenario.userFactor1, scenario.userFactor2],
    itemFactors: [scenario.itemFactor1, scenario.itemFactor2],
    userBias: scenario.userBias,
    itemBias: scenario.itemBias,
    globalBias: scenario.globalBias,
  }), [scenario]);
  const update = (key, value) => setScenario((current) => ({ ...current, [key]: value }));

  return (
    <Plate
      label="Priority lab · matrix factorization"
      title="A recommendation score is a dot product in a learned latent space"
      note="Two users or items can be similar even when the latent factors have no human-readable names. The model learns factor values because their dot products reconstruct observed interactions."
    >
      <ControlBench label="Two-factor worked example">
        <Slider label="User factor 1" value={scenario.userFactor1} min={-1} max={1} step={0.05} onChange={(value) => update('userFactor1', value)} />
        <Slider label="User factor 2" value={scenario.userFactor2} min={-1} max={1} step={0.05} onChange={(value) => update('userFactor2', value)} />
        <Slider label="Item factor 1" value={scenario.itemFactor1} min={-1} max={1} step={0.05} onChange={(value) => update('itemFactor1', value)} />
        <Slider label="Item factor 2" value={scenario.itemFactor2} min={-1} max={1} step={0.05} onChange={(value) => update('itemFactor2', value)} />
      </ControlBench>
      <Readouts columns={4} items={[
        { label: 'Factor 1 contribution', value: decimal(lab.contributions[0].contribution), detail: `${decimal(lab.contributions[0].user, 2)} × ${decimal(lab.contributions[0].item, 2)}` },
        { label: 'Factor 2 contribution', value: decimal(lab.contributions[1].contribution), detail: `${decimal(lab.contributions[1].user, 2)} × ${decimal(lab.contributions[1].item, 2)}` },
        { label: 'Latent dot product', value: decimal(lab.latentScore), detail: 'Σ user_f × item_f' },
        { label: 'Predicted score', value: decimal(lab.prediction), detail: 'global + user + item bias + dot product' },
      ]} />
      <Formula lines={[
        'r̂_ui = μ + b_u + b_i + p_uᵀq_i',
        'p_uᵀq_i = Σ_f p_uf q_if',
      ]} />
      <Note tone="neutral" label="What training learns" title="The vectors are parameters, not hand-written features"><p>Optimization adjusts user and item vectors so known interactions have low prediction error. Regularization is important because sparse users and items can otherwise memorize noise.</p></Note>
    </Plate>
  );
}

function NdcgLab() {
  const [secondRelevance, setSecondRelevance] = useState(DEFAULT_RELEVANCES[1]);
  const [topK, setTopK] = useState(5);
  const relevances = useMemo(() => [
    DEFAULT_RELEVANCES[0],
    secondRelevance,
    ...DEFAULT_RELEVANCES.slice(2),
  ], [secondRelevance]);
  const lab = useMemo(() => buildNdcgLab({ relevances, topK }), [relevances, topK]);

  return (
    <Plate
      label="Priority lab · nDCG worked example"
      title="Moving a relevant item upward matters more than merely retrieving it"
      note="DCG gives larger relevance gains more credit and discounts them by rank. nDCG divides by the best possible ordering for the same relevance labels."
    >
      <ControlBench label="Ranking experiment">
        <Slider label="Relevance at rank 2" value={secondRelevance} min={0} max={3} step={1} onChange={setSecondRelevance} />
        <Slider label="Evaluate top K" value={topK} min={1} max={DEFAULT_RELEVANCES.length} step={1} onChange={setTopK} />
      </ControlBench>
      <Readouts columns={3} items={[
        { label: `DCG@${lab.topK}`, value: decimal(lab.dcg), detail: 'gain after rank discount' },
        { label: `IDCG@${lab.topK}`, value: decimal(lab.idcg), detail: 'best ordering for these labels' },
        { label: `nDCG@${lab.topK}`, value: decimal(lab.ndcg), detail: 'DCG / IDCG' },
      ]} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead><tr className="border-b border-slate-300 text-left"><th className="py-2">Rank</th><th>Relevance</th><th>Gain</th><th>Discount</th><th>DCG contribution</th></tr></thead>
          <tbody>{lab.ranked.map((row) => <tr key={row.rank} className="border-b border-slate-200"><td className="py-2 font-semibold">{row.rank}</td><td>{row.relevance}</td><td>{decimal(row.gain, 0)}</td><td>{decimal(row.discount)}</td><td>{decimal(row.contribution)}</td></tr>)}</tbody>
        </table>
      </div>
      <NoteRow>
        <Note tone="accent" label="Ideal order" title={lab.ideal.join(' → ')}><p>IDCG sorts the same relevance labels from strongest to weakest. That normalization makes scores comparable across queries with different relevance mixes.</p></Note>
        <Note tone="neutral" label="Metric boundary" title="nDCG needs meaningful relevance judgments"><p>If clicks are biased by position or exposure, treating raw clicks as relevance labels can make the metric faithfully optimize the wrong target.</p></Note>
      </NoteRow>
    </Plate>
  );
}

export default function RecommenderPriorityLab() {
  return (
    <>
      <MatrixFactorizationLab />
      <NdcgLab />
    </>
  );
}
