import React from 'react';

import { PRODUCTION_RELIABILITY_NEXT_LESSON_IDS } from './productionReliabilityNextConstants.js';
import ProductionDebuggingNextLab from './ProductionDebuggingNextLab.jsx';
import ProductionFairnessNextLab from './ProductionFairnessNextLab.jsx';
import ProductionMonitoringNextLab from './ProductionMonitoringNextLab.jsx';
import ProductionUncertaintyNextLab from './ProductionUncertaintyNextLab.jsx';

export function hasProductionReliabilityNextLab(lessonId) {
  return PRODUCTION_RELIABILITY_NEXT_LESSON_IDS.has(lessonId);
}

export default function ProductionReliabilityNextLab({ lessonId }) {
  if (!hasProductionReliabilityNextLab(lessonId)) return null;

  let Lab;
  if (lessonId === 'model-debugging') Lab = ProductionDebuggingNextLab;
  else if (lessonId === 'model-monitoring') Lab = ProductionMonitoringNextLab;
  else if (lessonId === 'uncertainty-estimation') Lab = ProductionUncertaintyNextLab;
  else if (lessonId === 'model-fairness') Lab = ProductionFairnessNextLab;
  else return null;

  return (
    <div className="nb-lesson mt-8" data-production-reliability-next-lab={lessonId}>
      <Lab />
    </div>
  );
}
