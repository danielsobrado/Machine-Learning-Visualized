import React from 'react';

import { P1_SYSTEMS_NEXT_LESSON_IDS } from './p1SystemsNextConstants.js';
import DataEngineeringSystemsNextLab from './DataEngineeringSystemsNextLab.jsx';
import InferenceSystemsNextLab from './InferenceSystemsNextLab.jsx';
import RecommenderSystemsNextLab from './RecommenderSystemsNextLab.jsx';
import SecuritySystemsNextLab from './SecuritySystemsNextLab.jsx';

export function hasP1SystemsNextLab(lessonId) {
  return P1_SYSTEMS_NEXT_LESSON_IDS.has(lessonId);
}

export default function P1SystemsNextLab({ lessonId }) {
  if (!hasP1SystemsNextLab(lessonId)) return null;

  let Lab;
  if (lessonId === 'recommender-systems-ranking-track') Lab = RecommenderSystemsNextLab;
  else if (lessonId === 'ml-security-robustness-track') Lab = SecuritySystemsNextLab;
  else if (lessonId === 'data-engineering-for-ml-track') Lab = DataEngineeringSystemsNextLab;
  else if (lessonId === 'efficient-inference-compression-track') Lab = InferenceSystemsNextLab;
  else return null;

  return (
    <div className="nb-lesson mt-8" data-p1-systems-next-lab={lessonId}>
      <Lab />
    </div>
  );
}
