import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { P0_ASSESSMENT_COVERAGE } from './assessmentQualityManifest.js';
import { getLessonAssessment } from './lessonAssessments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_SRC_DIR = path.resolve(__dirname, '..');
const PANEL_PATH = path.join(APP_SRC_DIR, 'components', 'animation-shell', 'AssessmentPanel.jsx');
const RENDERER_PATH = path.join(APP_SRC_DIR, 'components', 'animation-shell', 'AssessmentVisualState.jsx');

function requiredVisualQuestionCount() {
  return Object.values(P0_ASSESSMENT_COVERAGE).reduce(
    (count, requirement) => count + (requirement.minVisualStateQuestions || 0),
    0,
  );
}

test('visual-state assessment metadata is wired to a real renderer', () => {
  const panelSource = fs.readFileSync(PANEL_PATH, 'utf8');
  const rendererSource = fs.readFileSync(RENDERER_PATH, 'utf8');

  assert.match(panelSource, /import AssessmentVisualState from ['"]\.\/AssessmentVisualState['"]/);
  assert.match(panelSource, /question\.kind === ['"]visual-state['"]/);
  assert.match(panelSource, /<AssessmentVisualState state=\{question\.visualState\}/);
  assert.match(rendererSource, /function NormalPreview/);
  assert.match(rendererSource, /function ResidualPreview/);
  assert.match(rendererSource, /function MetricPreview/);
  assert.match(rendererSource, /function RatioPreview/);
  assert.match(rendererSource, /function ComparisonPreview/);
});

test('required P0 visual-state questions remain renderable', () => {
  let visualCount = 0;

  for (const [lessonId, requirement] of Object.entries(P0_ASSESSMENT_COVERAGE)) {
    if (!requirement.minVisualStateQuestions) continue;

    const visualQuestions = (getLessonAssessment(lessonId).scenarioQuestions || [])
      .filter((question) => question.kind === 'visual-state');

    assert.ok(
      visualQuestions.length >= requirement.minVisualStateQuestions,
      `${lessonId}: missing required visual-state questions`,
    );

    for (const question of visualQuestions) {
      assert.ok(question.visualState && Object.keys(question.visualState).length > 0, `${question.id}: visual state is empty`);
    }

    visualCount += visualQuestions.length;
  }

  assert.ok(visualCount >= requiredVisualQuestionCount());
});
