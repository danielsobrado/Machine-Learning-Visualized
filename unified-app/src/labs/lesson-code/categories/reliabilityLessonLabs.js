import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

export const RELIABILITY_LESSON_LABS = createMappedCategoryLessonLabs('model-reliability', {
  kind: 'reliability check',
  signalName: 'monitoring or risk score',
  stages: ['observe', 'alert', 'triage'],
  stageExplanation: 'Reliability systems observe behavior, alert on meaningful shifts, and triage failures.',
});
