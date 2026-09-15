import React from 'react';
import { P1_LAB_LESSON_IDS } from './p1PriorityConstants.js';
import FoundationPriorityLab from './FoundationPriorityLab.jsx';
import OptimizationPriorityLab from './OptimizationPriorityLab.jsx';
import CausalPriorityLab from './CausalPriorityLab.jsx';
import CausalAdvancedPriorityLab from './CausalAdvancedPriorityLab.jsx';
import RecommenderPriorityLab from './RecommenderPriorityLab.jsx';
import ReliabilityPriorityLab from './ReliabilityPriorityLab.jsx';
import SystemsPriorityLab from './SystemsPriorityLab.jsx';
import P1SystemsNextLab from '../quality-labs/P1SystemsNextLab.jsx';
import ProductionReliabilityNextLab from '../quality-labs/ProductionReliabilityNextLab.jsx';

const FOUNDATION_IDS = new Set([
  'probability-distributions',
  'loss-functions-likelihoods',
  'maximum-likelihood-estimation',
]);

const OPTIMIZATION_IDS = new Set([
  'gradient-descent',
]);

const CAUSAL_IDS = new Set([
  'causal-graphs-dags',
  'treatment-effects',
  'propensity-scores',
  'confounding-simpsons-paradox',
  'cuped-variance-reduction',
  'sequential-testing-peeking',
]);

const RECOMMENDER_IDS = new Set([
  'recommender-systems-ranking-track',
]);

const RELIABILITY_IDS = new Set([
  'model-debugging',
  'model-monitoring',
  'uncertainty-estimation',
  'model-fairness',
]);

const SYSTEM_IDS = new Set([
  'ml-security-robustness-track',
  'data-engineering-for-ml-track',
  'efficient-inference-compression-track',
]);

export function hasP1PriorityLab(lessonId) {
  return P1_LAB_LESSON_IDS.has(lessonId);
}

export default function P1PriorityLab({ lessonId }) {
  if (!hasP1PriorityLab(lessonId)) return null;

  if (CAUSAL_IDS.has(lessonId)) {
    return (
      <div className="nb-lesson mt-8" data-p1-priority-lab={lessonId}>
        <CausalPriorityLab lessonId={lessonId} />
        <CausalAdvancedPriorityLab lessonId={lessonId} />
      </div>
    );
  }

  if (RELIABILITY_IDS.has(lessonId)) {
    return (
      <div className="nb-lesson mt-8" data-p1-priority-lab={lessonId}>
        <ReliabilityPriorityLab lessonId={lessonId} />
        <ProductionReliabilityNextLab lessonId={lessonId} />
      </div>
    );
  }

  if (RECOMMENDER_IDS.has(lessonId)) {
    return (
      <div className="nb-lesson mt-8" data-p1-priority-lab={lessonId}>
        <RecommenderPriorityLab lessonId={lessonId} />
        <P1SystemsNextLab lessonId={lessonId} />
      </div>
    );
  }

  if (SYSTEM_IDS.has(lessonId)) {
    return (
      <div className="nb-lesson mt-8" data-p1-priority-lab={lessonId}>
        <SystemsPriorityLab lessonId={lessonId} />
        <P1SystemsNextLab lessonId={lessonId} />
      </div>
    );
  }

  let Lab;
  if (FOUNDATION_IDS.has(lessonId)) Lab = FoundationPriorityLab;
  else if (OPTIMIZATION_IDS.has(lessonId)) Lab = OptimizationPriorityLab;
  else return null;

  return (
    <div className="nb-lesson mt-8" data-p1-priority-lab={lessonId}>
      <Lab lessonId={lessonId} />
    </div>
  );
}
