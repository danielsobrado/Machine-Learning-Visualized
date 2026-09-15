import React from 'react';
import CausalIdentificationAdvancedLab from './CausalIdentificationAdvancedLab.jsx';
import CausalExperimentAdvancedLab from './CausalExperimentAdvancedLab.jsx';

const IDENTIFICATION_IDS = new Set([
  'causal-graphs-dags',
  'treatment-effects',
  'propensity-scores',
]);

const EXPERIMENT_IDS = new Set([
  'confounding-simpsons-paradox',
  'cuped-variance-reduction',
  'sequential-testing-peeking',
]);

export default function CausalAdvancedPriorityLab({ lessonId }) {
  if (IDENTIFICATION_IDS.has(lessonId)) {
    return <CausalIdentificationAdvancedLab lessonId={lessonId} />;
  }
  if (EXPERIMENT_IDS.has(lessonId)) {
    return <CausalExperimentAdvancedLab lessonId={lessonId} />;
  }
  return null;
}
