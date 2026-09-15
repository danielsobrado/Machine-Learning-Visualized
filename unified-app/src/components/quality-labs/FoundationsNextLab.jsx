import React from 'react';

import { FOUNDATIONS_NEXT_LESSON_IDS } from './foundationsNextConstants.js';
import OptimizationFoundationsNextLab from './OptimizationFoundationsNextLab.jsx';
import StatisticalFoundationsNextLab from './StatisticalFoundationsNextLab.jsx';

export function hasFoundationsNextLab(lessonId) {
  return FOUNDATIONS_NEXT_LESSON_IDS.has(lessonId);
}

export default function FoundationsNextLab({ lessonId }) {
  if (!hasFoundationsNextLab(lessonId)) return null;

  const Lab = lessonId === 'gradient-descent'
    ? OptimizationFoundationsNextLab
    : StatisticalFoundationsNextLab;

  return (
    <div className="nb-lesson mt-8" data-foundations-next-lab={lessonId}>
      <Lab lessonId={lessonId} />
    </div>
  );
}
