import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import LogisticRegressionWorkbench from './LogisticRegressionWorkbench.jsx';

export default function LogisticRegressionAnimation() {
  return (
    <div className="space-y-6">
      <LogisticRegressionWorkbench />
      <AssessmentPanel lessonId="logistic-regression" />
    </div>
  );
}
