import React from 'react';

import { BarTrack, Note, Plate, Readouts, Steps } from '../../animations/_shared/notebook.jsx';
import {
  SELECTION_REPLAY_DEFAULTS,
  TEMPORAL_CV_DEFAULTS,
} from './classicalMlNextConstants.js';
import {
  analyzeSelectionReplay,
  compareTemporalCv,
} from './classicalMlNextModel.js';

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;
const formatNumber = (value, digits = 2) => value.toFixed(digits);

function TrainValidationTestAdvancedLab() {
  const replay = analyzeSelectionReplay(SELECTION_REPLAY_DEFAULTS);

  return (
    <>
      <Plate
        label="Selection replay"
        title="Validation reuse creates a winner's curse"
        note="Each extra tuning attempt gets another chance to exploit validation noise. The minimum observed validation error becomes increasingly optimistic."
      >
        <Readouts items={[
          { label: 'Selected attempt', value: replay.selected.id },
          { label: 'Selected validation error', value: formatPercent(replay.naiveValidationEstimate) },
          { label: 'Untouched test error', value: formatPercent(replay.untouchedTestEstimate) },
          { label: 'Optimism gap', value: `+${formatPercent(replay.optimismGap)}` },
        ]} />
        <Steps items={SELECTION_REPLAY_DEFAULTS.attempts.map((attempt) => ({
          title: `${attempt.id}: validation ${formatPercent(attempt.validationError)}`,
          body: `Its untouched test error is ${formatPercent(attempt.testError)}. The validation winner is not necessarily the best generalizing candidate.`,
          pass: attempt.id !== replay.selected.id,
        }))} />
      </Plate>

      <Plate
        label="Nested evaluation"
        title="Move model selection inside the evaluation loop"
        note="Outer folds estimate the complete selection procedure rather than reusing the same validation surface for tuning and reporting."
      >
        <Readouts items={[
          { label: 'Naive selected estimate', value: formatPercent(replay.naiveValidationEstimate) },
          { label: 'Nested outer estimate', value: formatPercent(replay.nestedEstimate) },
          { label: 'Nested − naive gap', value: `+${formatPercent(replay.nestedVsNaiveGap)}` },
        ]} />
        <Note tone="warn" title="What nested CV fixes">
          Nested evaluation does not make the chosen model better. It makes the reported performance estimate less contaminated by the search that produced that model.
        </Note>
      </Plate>
    </>
  );
}

function HorizonRows({ label, rows }) {
  const maxMae = Math.max(...rows.map(({ mae }) => mae), 1);
  return (
    <Plate label={label} title="Error by forecast horizon">
      {rows.map((row) => (
        <BarTrack
          key={row.horizon}
          label={`Horizon ${row.horizon}`}
          value={`MAE ${formatNumber(row.mae)}`}
          width={(row.mae / maxMae) * 100}
        />
      ))}
    </Plate>
  );
}

function CrossValidationAdvancedLab() {
  const comparison = compareTemporalCv(TEMPORAL_CV_DEFAULTS);
  const firstExpanding = comparison.expanding.folds[0];
  const lastBlocked = comparison.blocked.folds[comparison.blocked.folds.length - 1];

  return (
    <>
      <Plate
        label="Temporal CV"
        title="Expanding and blocked windows answer different questions"
        note="The same forecasting rule can look different when old regimes remain in training versus when evaluation intentionally limits history."
      >
        <Readouts items={[
          { label: 'Expanding overall MAE', value: formatNumber(comparison.expanding.overallMae) },
          { label: 'Blocked overall MAE', value: formatNumber(comparison.blocked.overallMae) },
          { label: 'Blocked window', value: `${TEMPORAL_CV_DEFAULTS.blockedWindowSize} observations` },
          { label: 'Forecast horizon', value: `${TEMPORAL_CV_DEFAULTS.horizon} steps` },
        ]} />
        <Note tone="neutral" title="Fold anatomy">
          First expanding fold uses observations {firstExpanding.trainStart + 1}–{firstExpanding.trainEnd}. The final blocked fold uses only observations {lastBlocked.trainStart + 1}–{lastBlocked.trainEnd}, deliberately dropping stale history.
        </Note>
      </Plate>

      <div className="grid gap-6 lg:grid-cols-2">
        <HorizonRows label="Expanding window" rows={comparison.expanding.byHorizon} />
        <HorizonRows label="Blocked window" rows={comparison.blocked.byHorizon} />
      </div>

      <Note tone="warn" title="No universally best window">
        The blocked window wins this regime-shift example because recent history is more relevant. In a stable process, discarding older data can increase variance instead. Window design is part of the model-validation hypothesis.
      </Note>
    </>
  );
}

export default function ValidationReplayNextLab({ lessonId }) {
  if (lessonId === 'train-validation-test-split') return <TrainValidationTestAdvancedLab />;
  if (lessonId === 'cross-validation') return <CrossValidationAdvancedLab />;
  return null;
}
