import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import RocPrWorkbench from './RocPrWorkbench.jsx';

export default function RocPrCurvesAnimation() {
  return (
    <div className="space-y-6">
      <RocPrWorkbench />
      <AssessmentPanel lessonId="roc-pr-curves" title="ROC / Precision-Recall Curves check" />
    </div>
  );
}
