import assert from 'node:assert/strict';
import test from 'node:test';

import { getLessonAssessment } from './lessonAssessments.js';

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function correctAnswer(question) {
  return question.choices[question.answerIndex];
}

test('probability distributions covers the core families and mechanics in order', () => {
  const { quiz } = getLessonAssessment('probability-distributions');
  const milestones = [
    [/main purpose of a probability distribution/, 0, 20],
    [/probability mass function/, 0, 20],
    [/probability density function/, 0, 20],
    [/cumulative distribution function/, 0, 20],
    [/bernoulli distribution/, 0, 20],
    [/poisson distribution/, 0, 20],
    [/integrate the density/, 20, 50],
    [/central limit theorem/, 20, 50],
    [/cross entropy appear in classification/, 20, 50],
    [/overdispersed/, 50, 75],
    [/distribution shift investigation/, 50, 75],
    [/monte carlo simulation/, 50, 75],
    [/continuous pdf is false/, 75, 90],
    [/zero correlation always proves/, 75, 90],
    [/raw observations become normal/, 75, 90],
    [/define a probability distribution in a technical interview/, 90, 100],
    [/distribution shift in production/, 90, 100],
  ];

  for (const [pattern, start, end] of milestones) {
    const index = quiz.findIndex((question) => pattern.test(normalize(`${question.prompt} ${correctAnswer(question)} ${question.explanation}`)));
    assert.notEqual(index, -1, `missing probability milestone ${pattern}`);
    assert.ok(index >= start && index < end, `${pattern} appears at question ${index + 1}, expected ${start + 1}-${end}`);
  }
});

test('probability distributions keeps unsafe claims inside the Tricky band', () => {
  const { quiz } = getLessonAssessment('probability-distributions');
  const unsafePatterns = [
    /assume data are normal merely because/i,
    /density value of 2 at x means/i,
    /zero correlation always proves/i,
    /strong association proves/i,
    /every nonnegative integer count/i,
    /raw observations become normal/i,
    /fraudulent with 99 9 percent certainty/i,
    /fitted family.*ground truth/i,
    /same mean must have the same risk profile/i,
    /high likelihood model proves/i,
    /lower predictive entropy always means/i,
    /large sample automatically represents/i,
  ];

  for (const [index, question] of quiz.entries()) {
    const text = normalize(`${question.prompt} ${question.choices.join(' ')}`);
    if (!unsafePatterns.some((pattern) => pattern.test(text))) continue;
    assert.ok(index >= 75 && index < 90, `${question.id} places a misconception outside the Tricky band`);
  }
});

test('probability distributions includes visual diagnostic scenarios', () => {
  const { scenarioQuestions } = getLessonAssessment('probability-distributions');
  const visual = scenarioQuestions.filter((question) => question.kind === 'visual-state');

  assert.ok(visual.length >= 2);
  assert.ok(visual.some((question) => question.id === 'prob-visual-normal-spread'));
  assert.ok(visual.some((question) => question.id === 'prob-visual-poisson-dispersion'));
});
