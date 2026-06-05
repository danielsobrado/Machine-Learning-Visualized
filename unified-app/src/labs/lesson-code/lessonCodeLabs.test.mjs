import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { allAnimations } from '../../data/animations.js';
import { summarizeCodeLabProgress } from '../../data/codeLabProgress.js';
import {
  LESSON_CODE_LAB_BY_ID,
  LESSON_CODE_LAB_GROUPS,
  LESSON_CODE_LABS,
  getLessonCodeLabExercises,
} from './lessonCodeLabs.js';

const REQUIRED_FIELDS = [
  'id',
  'group',
  'stepLabel',
  'title',
  'concept',
  'objective',
  'difficulty',
  'starterCode',
  'testCode',
  'hints',
  'solution',
  'explanation',
];

test('every active lesson has one four-exercise code lab group', () => {
  assert.equal(LESSON_CODE_LAB_GROUPS.length, allAnimations.length);
  assert.equal(Object.keys(LESSON_CODE_LAB_BY_ID).length, allAnimations.length);

  allAnimations.forEach((animation, lessonIndex) => {
    const group = LESSON_CODE_LAB_BY_ID[animation.id];
    assert.ok(group, `${animation.id} should have a code lab group`);
    assert.equal(group.lessonId, animation.id);
    assert.equal(group.lessonName, animation.name);
    assert.equal(group.categoryId, animation.categoryId);
    assert.equal(group.exercises.length, 4);

    group.exercises.forEach((exercise, exerciseIndex) => {
      assert.equal(exercise.group, animation.name);
      assert.equal(exercise.stepLabel, `${77 + lessonIndex}.${exerciseIndex + 1}`);
    });
  });
});

test('lesson code lab exercises keep the Rustlings-style schema', () => {
  const ids = new Set();

  for (const exercise of LESSON_CODE_LABS) {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(exercise[field] !== undefined, `${exercise.id} is missing ${field}`);
    }

    assert.equal(typeof exercise.id, 'string');
    assert.equal(ids.has(exercise.id), false, `${exercise.id} should be unique`);
    ids.add(exercise.id);

    assert.match(exercise.stepLabel, /^\d+\.[1-4]$/);
    assert.match(exercise.starterCode, /TODO/);
    assert.ok(Array.isArray(exercise.hints));
    assert.ok(exercise.hints.length >= 3);
  }
});

test('priority optimizer and PPO lessons use mathematical code labs', () => {
  const optimizerLabIds = getLessonCodeLabExercises('optimizers').map((exercise) => exercise.id);
  const ppoLabIds = getLessonCodeLabExercises('ppo-clipped-policy-gradient').map((exercise) => exercise.id);

  assert.deepEqual(optimizerLabIds, [
    'optimizers-minibatch-mean-gradient',
    'optimizers-sgd-step',
    'optimizers-momentum-velocity',
    'optimizers-adam-bias-corrected-step',
  ]);
  assert.deepEqual(ppoLabIds, [
    'ppo-policy-ratio',
    'ppo-clip-ratio-bounds',
    'ppo-clipped-surrogate',
    'ppo-count-clipped-rows',
  ]);
});

test('lesson code lab solutions pass their embedded tests', () => {
  const failures = [];

  for (const exercise of LESSON_CODE_LABS) {
    try {
      const run = new Function(`${exercise.solution}\n${exercise.testCode}`);
      const results = run();
      const failed = Array.isArray(results)
        ? results.filter((result) => !result.passed)
        : [{ name: 'testCode return value', actual: results, expected: 'array', passed: false }];

      if (failed.length > 0) failures.push({ id: exercise.id, failed });
    } catch (error) {
      failures.push({ id: exercise.id, error: error.stack || String(error) });
    }
  }

  assert.deepEqual(failures, []);
});

test('lesson pages and the central labs route can resolve code lab groups', async () => {
  const matrixExercises = getLessonCodeLabExercises('matrix-multiplication');
  assert.equal(matrixExercises.length, 10);
  assert.match(matrixExercises[0].starterCode, /function matmul\(A, B\)/);
  assert.equal(getLessonCodeLabExercises('bag-of-words').length, 4);

  const appSource = await readFile(new URL('../../App.jsx', import.meta.url), 'utf8');
  const animationPageSource = await readFile(new URL('../../pages/AnimationPage.jsx', import.meta.url), 'utf8');

  assert.match(appSource, /path="\/labs"/);
  assert.match(animationPageSource, /LessonCodeLab/);
});

test('code lab progress summaries are scoped to the selected lesson exercises', () => {
  const matrixExercises = getLessonCodeLabExercises('matrix-multiplication');
  const bagExercises = getLessonCodeLabExercises('bag-of-words');
  const progress = {
    'matrix-multiplication': {
      [matrixExercises[0].id]: {
        passed: true,
        lastPassedAt: '2026-05-25T10:00:00.000Z',
        checkCount: 3,
      },
      [bagExercises[0].id]: {
        passed: true,
        lastPassedAt: '2026-05-25T10:01:00.000Z',
        checkCount: 3,
      },
    },
  };
  const summary = summarizeCodeLabProgress('matrix-multiplication', matrixExercises, progress);

  assert.equal(summary.passedCount, 1);
  assert.equal(summary.totalCount, matrixExercises.length);
  assert.deepEqual([...summary.passedIds], [matrixExercises[0].id]);
});
