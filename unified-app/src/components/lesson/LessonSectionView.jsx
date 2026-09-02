import React, { Suspense, useMemo } from 'react';
import { allAnimations } from '../../data/animations';
import { createLearningModel } from '../../data/animationLearning';
import LessonDepthView from './LessonDepthView';
import LessonGlossaryView from './LessonGlossaryView';

const AssessmentPanel = React.lazy(() => import('../animation-shell/AssessmentPanel'));
const LessonCodeLab = React.lazy(() => import('../../labs/lesson-code/LessonCodeLab'));

function LoadingSection({ label }) {
  return <div className="ds-panel ua-loading">Loading {label}</div>;
}

export default function LessonSectionView({ animation, sectionId }) {
  const learningModel = useMemo(
    () => createLearningModel(animation, allAnimations),
    [animation],
  );

  if (sectionId === 'questions') {
    return (
      <div className="ua-routed-lesson-section ua-routed-lesson-questions">
        <Suspense fallback={<LoadingSection label="lesson check" />}>
          <AssessmentPanel lessonId={animation.id} eyebrow="Assessment" title="Lesson check" />
        </Suspense>
      </div>
    );
  }

  if (sectionId === 'glossary') {
    return (
      <div className="ua-routed-lesson-section">
        <LessonGlossaryView terms={learningModel.glossary} />
      </div>
    );
  }

  if (sectionId === 'code') {
    return (
      <div className="ua-routed-lesson-section ua-routed-lesson-code">
        <Suspense fallback={<LoadingSection label="code lab" />}>
          <LessonCodeLab lessonId={animation.id} />
        </Suspense>
      </div>
    );
  }

  if (sectionId === 'deep-dive') {
    return (
      <div className="ua-routed-lesson-section">
        <LessonDepthView depth={learningModel.depth} />
      </div>
    );
  }

  return null;
}
