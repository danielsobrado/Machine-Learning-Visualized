import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import ClassificationMetricsWorkbench from './ClassificationMetricsWorkbench.jsx';

export default function ClassificationMetricsAnimation() {
  return (
    <div className="space-y-6">
      <ClassificationMetricsWorkbench />
      <AssessmentPanel lessonId="classification-metrics" title="Classification Metrics check" />
    </div>
  );
}
