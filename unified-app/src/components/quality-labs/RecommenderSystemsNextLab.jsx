import React, { useMemo, useState } from 'react';

import { BarTrack, ControlBench, Note, NoteRow, Plate, Readouts, Slider } from '../../animations/_shared/notebook.jsx';
import { RECOMMENDER_SYSTEMS_NEXT_DEFAULTS } from './p1SystemsNextConstants.js';
import {
  buildImplicitFeedbackObjective,
  compareSampledNegativeEvaluation,
} from './p1SystemsNextModel.js';

const pct = (value) => `${(value * 100).toFixed(1)}%`;

export default function RecommenderSystemsNextLab() {
  const [sampledNegativeCount, setSampledNegativeCount] = useState(RECOMMENDER_SYSTEMS_NEXT_DEFAULTS.sampledNegativeCount);
  const [alpha, setAlpha] = useState(RECOMMENDER_SYSTEMS_NEXT_DEFAULTS.implicitAlpha);
  const evaluation = useMemo(() => compareSampledNegativeEvaluation({
    ...RECOMMENDER_SYSTEMS_NEXT_DEFAULTS,
    sampledNegativeCount,
  }), [sampledNegativeCount]);
  const implicit = useMemo(() => buildImplicitFeedbackObjective({
    observations: RECOMMENDER_SYSTEMS_NEXT_DEFAULTS.observations,
    alpha,
  }), [alpha]);
  const maxLoss = Math.max(...implicit.rows.map(({ weightedLoss }) => weightedLoss));

  return (
    <>
      <Plate
        label="Implicit feedback"
        title="Missing interaction is uncertainty, not a confirmed negative"
        note="Confidence-weighted implicit matrix factorization separates preference from confidence. Repeated positive behavior can be trusted more without pretending every unseen item was disliked."
      >
        <ControlBench label="Confidence weighting">
          <Slider label="Observed-interaction α" value={alpha} min={0} max={10} step={0.5} onChange={setAlpha} format={(value) => value.toFixed(1)} />
        </ControlBench>
        <Readouts columns={2} items={[
          { label: 'Total weighted loss', value: implicit.totalLoss.toFixed(3), detail: 'Σ confidence × squared error' },
          { label: 'Observed-event loss share', value: pct(implicit.observedShare), detail: 'how strongly the positive event drives fitting' },
        ]} />
        {implicit.rows.map((row) => (
          <BarTrack
            key={row.id}
            label={`${row.id} · confidence ${row.confidence.toFixed(1)}`}
            value={row.weightedLoss.toFixed(3)}
            width={(row.weightedLoss / Math.max(maxLoss, Number.EPSILON)) * 100}
            tone={row.interactionCount > 0 ? 'accent' : 'warn'}
          />
        ))}
      </Plate>

      <Plate
        label="Offline evaluation"
        title="Easy sampled negatives can make a weak ranker look excellent"
        note="The positive item is ranked against the full catalog and again against a deterministic sample of the easiest unseen items."
      >
        <ControlBench label="Negative sampling">
          <Slider
            label="Sampled negatives"
            value={sampledNegativeCount}
            min={1}
            max={RECOMMENDER_SYSTEMS_NEXT_DEFAULTS.negatives.length}
            step={1}
            onChange={setSampledNegativeCount}
          />
        </ControlBench>
        <Readouts columns={4} items={[
          { label: 'Full-catalog rank', value: evaluation.fullRank, detail: 'all candidate items' },
          { label: 'Sampled rank', value: evaluation.sampledRank, detail: 'easy sampled negatives only' },
          { label: 'MRR inflation', value: evaluation.mrrInflation.toFixed(3), detail: 'sampled MRR − full MRR' },
          { label: 'Hard negatives omitted', value: evaluation.omittedHardNegatives, detail: 'scored above the positive item' },
        ]} />
        <NoteRow>
          <Note tone="danger" title="Sampling changes the question">If hard negatives are unlikely to enter the evaluation set, the metric can improve even though the deployed ranking has not.</Note>
          <Note tone="accent" title="Use exposure-aware evaluation">Document how negatives are sampled, compare against larger candidate sets, and use counterfactual/off-policy methods when logged exposure drives which items could be observed.</Note>
        </NoteRow>
      </Plate>
    </>
  );
}
