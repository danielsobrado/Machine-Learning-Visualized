import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import TrainValidationTestWorkbench from './TrainValidationTestWorkbench.jsx';

export default function TrainValidationTestSplitAnimation() {
  return (
    <div className="space-y-6">
      <TrainValidationTestWorkbench />
      <AssessmentPanel lessonId="train-validation-test-split" />
    </div>
  );
}
