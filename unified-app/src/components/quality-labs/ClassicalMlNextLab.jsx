import React from 'react';

import { CLASSICAL_ML_NEXT_LESSON_IDS } from './classicalMlNextConstants.js';
import ForecastScoringNextLab from './ForecastScoringNextLab.jsx';
import RegressionPolicyNextLab from './RegressionPolicyNextLab.jsx';
import ValidationReplayNextLab from './ValidationReplayNextLab.jsx';

export function hasClassicalMlNextLab(lessonId) {
  return CLASSICAL_ML_NEXT_LESSON_IDS.has(lessonId);
}

export default function ClassicalMlNextLab({ lessonId }) {
  if (!hasClassicalMlNextLab(lessonId)) return null;

  let Lab;
  if (lessonId === 'linear-regression' || lessonId === 'logistic-regression') {
    Lab = RegressionPolicyNextLab;
  } else if (lessonId === 'train-validation-test-split' || lessonId === 'cross-validation') {
    Lab = ValidationReplayNextLab;
  } else if (lessonId === 'time-series-forecasting-track') {
    Lab = ForecastScoringNextLab;
  } else {
    return null;
  }

  return (
    <div className="nb-lesson mt-8" data-classical-ml-next-lab={lessonId}>
      <Lab lessonId={lessonId} />
    </div>
  );
}
