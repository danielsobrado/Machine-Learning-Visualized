const PLACEHOLDER_ID_PATTERNS = Object.freeze([
  /keyword-check/i,
  /focus-term-count/i,
  /best-candidate/i,
  /pipeline-stage-check/i,
]);

const PLACEHOLDER_TITLE_PATTERNS = Object.freeze([
  /recognize the lesson keyword/i,
  /count focus terms/i,
  /select the best candidate/i,
  /check required stages/i,
]);

export function validateLessonCodeLabGroup(group) {
  const errors = [];
  const lessonId = group?.lessonId || 'unknown-lesson';
  const exercises = group?.exercises || [];

  if (!group?.lessonId) errors.push('code lab group is missing lessonId');
  if (!Array.isArray(exercises) || exercises.length === 0) {
    errors.push(`${lessonId}: code lab group has no exercises`);
    return errors;
  }

  const ids = new Set();
  for (const exercise of exercises) {
    const exerciseId = exercise?.id || 'unknown-exercise';

    if (!exercise?.id) errors.push(`${lessonId}: exercise is missing id`);
    if (ids.has(exerciseId)) errors.push(`${lessonId}: duplicate exercise id ${exerciseId}`);
    ids.add(exerciseId);

    if (PLACEHOLDER_ID_PATTERNS.some((pattern) => pattern.test(exerciseId))) {
      errors.push(`${lessonId}: placeholder exercise leaked into production: ${exerciseId}`);
    }
    if (PLACEHOLDER_TITLE_PATTERNS.some((pattern) => pattern.test(exercise?.title || ''))) {
      errors.push(`${lessonId}: placeholder exercise title leaked into production: ${exercise?.title}`);
    }

    if (!exercise?.concept || exercise.concept.trim().length < 20) {
      errors.push(`${lessonId}/${exerciseId}: concept is too thin`);
    }
    if (!exercise?.objective || exercise.objective.trim().length < 12) {
      errors.push(`${lessonId}/${exerciseId}: objective is too thin`);
    }
    if (!exercise?.starterCode?.includes('TODO')) {
      errors.push(`${lessonId}/${exerciseId}: starter code must contain a TODO`);
    }
    if (!exercise?.testCode || exercise.testCode.trim().length < 80) {
      errors.push(`${lessonId}/${exerciseId}: executable tests are missing or too thin`);
    }
    if (!exercise?.solution || exercise.solution.trim().length < 20) {
      errors.push(`${lessonId}/${exerciseId}: solution is missing or too thin`);
    }
    if (exercise?.starterCode === exercise?.solution) {
      errors.push(`${lessonId}/${exerciseId}: starter code must differ from the solution`);
    }
    if (!Array.isArray(exercise?.hints) || exercise.hints.length < 1) {
      errors.push(`${lessonId}/${exerciseId}: at least one useful hint is required`);
    }
    if (!exercise?.explanation || exercise.explanation.trim().length < 30) {
      errors.push(`${lessonId}/${exerciseId}: explanation is too thin`);
    }
  }

  return errors;
}

export function validateLessonCodeLabCoverage({ lessonIds, groups }) {
  const errors = [];
  const active = new Set(lessonIds);
  const groupsByLesson = new Map();

  for (const group of groups) {
    if (groupsByLesson.has(group.lessonId)) {
      errors.push(`${group.lessonId}: duplicate code lab group`);
      continue;
    }
    groupsByLesson.set(group.lessonId, group);
    if (!active.has(group.lessonId)) {
      errors.push(`${group.lessonId}: code lab references inactive lesson`);
    }
    errors.push(...validateLessonCodeLabGroup(group));
  }

  for (const lessonId of active) {
    if (!groupsByLesson.has(lessonId)) {
      errors.push(`${lessonId}: active lesson is missing a production code lab`);
    }
  }

  return errors;
}
