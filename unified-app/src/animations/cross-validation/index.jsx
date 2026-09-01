import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import CrossValidationWorkbench from './CrossValidationWorkbench.jsx';

export default function CrossValidationAnimation() {
  return (
    <div className="space-y-6">
      <CrossValidationWorkbench />
      <AssessmentPanel lessonId="cross-validation" title="Cross-Validation check" />
    </div>
  );
}
