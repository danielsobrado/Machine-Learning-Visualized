import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import CalibrationWorkbench from './CalibrationWorkbench.jsx';

export default function CalibrationAnimation() {
  return (
    <div className="space-y-6">
      <CalibrationWorkbench />
      <AssessmentPanel lessonId="calibration" title="Calibration check" />
    </div>
  );
}
