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
import { hasRealLessonCodeLab } from './lessonCodeLabMappings.js';

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

const PLACEHOLDER_TITLE = 'Recognize the lesson keyword';

test('mapped lessons expose real code labs and placeholders are removed', () => {
  const lessonsWithLabs = new Set(LESSON_CODE_LAB_GROUPS.map((group) => group.lessonId));

  for (const animation of allAnimations) {
    if (hasRealLessonCodeLab(animation.id)) {
      assert.ok(lessonsWithLabs.has(animation.id), `${animation.id} should keep a code lab group`);
      const exercises = getLessonCodeLabExercises(animation.id);
      assert.ok(exercises.length > 0, `${animation.id} should have exercises`);
      assert.notEqual(exercises[0].title, PLACEHOLDER_TITLE, `${animation.id} should not use keyword placeholders`);
    } else {
      assert.equal(
        getLessonCodeLabExercises(animation.id).length,
        0,
        `${animation.id} should not expose placeholder code labs`,
      );
    }
  }
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

    assert.match(exercise.stepLabel, /^\d+\.\d+$/);
    assert.match(exercise.starterCode, /TODO/);
    assert.ok(Array.isArray(exercise.hints));
    assert.ok(exercise.hints.length >= 1);
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
  assert.equal(getLessonCodeLabExercises('gradient-descent').length, 8);
  assert.match(getLessonCodeLabExercises('gradient-descent')[0].starterCode, /derivativeOfLine/);
  assert.match(getLessonCodeLabExercises('gradient-descent')[4].starterCode, /predictionError/);
  assert.equal(getLessonCodeLabExercises('word2vec').length, 0);

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
