import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, qsaRead, gatedUpdate, hashNgram, expertBudget, trainingSteps, taskCost } from './qwenNext.js';
import { getAnimationById } from './animations.js';
import { getLessonAssessment } from './lessonAssessments.js';
import { getLessonCodeLabGroup } from '../labs/lesson-code/lessonCodeLabs.js';

test('six Qwen chapters are discoverable with substantive assessments and working coding exercises', () => {
  assert.equal(chapters.length, 6);
  for (const chapter of chapters) {
    assert.ok(getAnimationById(chapter.id));
    assert.ok(chapter.sections.length >= 3);
    assert.ok(chapter.exercises.length >= 3);
    const assessment = getLessonAssessment(chapter.id);
    assert.ok(assessment.quiz.length >= 6, chapter.id);
    for (const q of assessment.quiz) assert.ok(q.choices[q.answerIndex] && q.explanation.length > 30);
    const group = getLessonCodeLabGroup(chapter.id);
    assert.ok(group.exercises.length >= 2);
    for (const lab of group.exercises) {
      const results = new Function(`${lab.solution}\n${lab.testCode}`)();
      assert.ok(results.length >= 3);
      assert.ok(results.every(r => r.passed), lab.id);
      assert.ok(new Function(`${lab.starterCode}\n${lab.testCode}`)().some(r => !r.passed), `${lab.id} starter must need work`);
    }
  }
});
test('micro-block reads cap at visible context and handle a partial block', () => {
  assert.equal(qsaRead(17, 4, 2), 8);
  assert.equal(qsaRead(17, 4, 9), 17);
  assert.equal(qsaRead(0, 4, 2), 0);
});
test('zero write preserves residual; reads are elementwise, write is scalar', () => {
  assert.deepEqual(gatedUpdate([2, 4], [0.5, 0.25], 0), [2, 4]);
  assert.deepEqual(gatedUpdate([2, 4], [0.5, 0.25], 0.5), [2.5, 4.5]);
});
test('toy hash is deterministic, order-sensitive and permits collisions', () => {
  assert.equal(hashNgram([1, 2], 8), 1);
  assert.equal(hashNgram([2, 1], 8), 7);
  assert.equal(hashNgram([1, 10], 8), hashNgram([1, 2], 8));
});
test('expert storage remains fixed while active fraction changes', () => {
  assert.deepEqual(expertBudget(512, 10), { stored: 512, active: 10, fraction: 10 / 512 });
});
test('optimizer steps round up; retries can outweigh per-attempt savings', () => {
  assert.equal(trainingSteps(1000, 300), 4);
  assert.equal(taskCost(2, 0.25), 8);
  assert.equal(taskCost(5, 1), 5);
});
