import React from 'react';
import AssessmentPanel from '../../components/animation-shell/AssessmentPanel';
import LayerNormalizationWorkbench from './LayerNormalizationWorkbench.jsx';

export default function LayerNormalizationAnimation() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <LayerNormalizationWorkbench />
        <AssessmentPanel lessonId="layer-normalization" />
      </div>
    </div>
  );
}
