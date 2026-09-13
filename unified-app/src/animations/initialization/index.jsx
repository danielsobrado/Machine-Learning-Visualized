import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import InitializationPredictionLab from './InitializationPredictionLab.jsx';
import InitializationWorkbench from './InitializationWorkbench.jsx';

export default function InitializationAnimation() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <InitializationWorkbench />
      <InitializationPredictionLab />
      <AssessmentPanel lessonId="initialization" title="Initialization check" />
    </div>
  );
}
