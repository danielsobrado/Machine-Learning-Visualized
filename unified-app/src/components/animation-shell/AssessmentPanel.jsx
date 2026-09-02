import React from 'react';
import { useLessonSectionContext } from '../lesson/LessonSectionContext';
import AssessmentPanelContent from './AssessmentPanelContent';

export default function AssessmentPanel(props) {
  const lessonSection = useLessonSectionContext();

  if (lessonSection && lessonSection.activeSection !== 'questions') {
    return null;
  }

  return <AssessmentPanelContent {...props} />;
}
