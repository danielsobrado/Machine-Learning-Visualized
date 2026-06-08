import { allAnimations } from '../../data/animations.js';
import { getLessonCatalogNumber } from '../../data/lessonCatalogNumbers.js';

const STOP_WORDS = new Set([
  'and',
  'for',
  'the',
  'as',
  'of',
  'to',
  'in',
  'vs',
  'with',
  'from',
  'into',
  'overview',
  'track',
  'comprehensive',
]);

function unique(values) {
  return [...new Set(values)];
}

function toWords(value) {
  return unique(
    String(value)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word)),
  );
}

function toFunctionSuffix(lessonId) {
  const words = String(lessonId)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

  const suffix = words
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join('');

  return suffix || 'Lesson';
}

function countTermHits(text, terms) {
  const lower = text.toLowerCase();
  return terms.filter((term) => lower.includes(term)).length;
}

function termsForLesson(lesson) {
  const words = unique([...toWords(lesson.id), ...toWords(lesson.name)]);
  return words.length > 0 ? words.slice(0, 3) : ['lesson'];
}

function routeForLesson(lesson) {
  return `/animation/${lesson.id}`;
}

function makeKeywordExercise({ lesson, stepLabel, suffix, keyword, domain }) {
  const functionName = `has${suffix}Keyword`;

  return {
    id: `${lesson.id}-keyword-check`,
    group: lesson.name,
    stepLabel,
    title: 'Recognize the lesson keyword',
    concept: `${lesson.name} can be indexed by a stable keyword before deeper ${domain.kind} logic runs.`,
    objective: 'Return true when text contains the lesson keyword, case-insensitively.',
    difficulty: 'warmup',
    starterCode: `function ${functionName}(text) {
  const keyword = ${JSON.stringify(keyword)};

  // TODO: return whether text contains keyword, ignoring case.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson reference matches', ${functionName}(${JSON.stringify(`${lesson.name} ${routeForLesson(lesson)}`)}), true);
check('lesson route matches', ${functionName}(${JSON.stringify(routeForLesson(lesson))}), true);
check('unrelated text misses', ${functionName}('zzzz yyyy xxxx'), false);

return results;`,
    hints: [
      'Convert the incoming text to lowercase before checking.',
      'Use text.toLowerCase().includes(keyword).',
      'return text.toLowerCase().includes(keyword);',
    ],
    solution: `function ${functionName}(text) {
  const keyword = ${JSON.stringify(keyword)};
  return text.toLowerCase().includes(keyword);
}`,
    explanation: `Stable keywords help route learners and examples to the right ${lesson.name} code path.`,
  };
}

function makeTermCountExercise({ lesson, stepLabel, suffix, terms, domain }) {
  const functionName = `count${suffix}FocusTerms`;
  const titleHits = countTermHits(lesson.name, terms);
  const combinedText = `${lesson.name} ${lesson.description}`;
  const combinedHits = countTermHits(combinedText, terms);

  return {
    id: `${lesson.id}-focus-term-count`,
    group: lesson.name,
    stepLabel,
    title: 'Count focus terms',
    concept: `${domain.kind} systems often reduce text into small signals before ranking or checking.`,
    objective: 'Count how many lesson focus terms appear in the text.',
    difficulty: 'core',
    starterCode: `function ${functionName}(text) {
  const terms = ${JSON.stringify(terms)};
  const lower = text.toLowerCase();
  let count = 0;

  for (let i = 0; i < terms.length; i++) {
    // TODO: increment count when lower contains terms[i].
  }

  return count;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('title terms', ${functionName}(${JSON.stringify(lesson.name)}), ${titleHits});
check('description terms', ${functionName}(${JSON.stringify(combinedText)}), ${combinedHits});
check('no matching terms', ${functionName}('zzzz yyyy xxxx'), 0);

return results;`,
    hints: [
      'lower and terms are already prepared.',
      'Use lower.includes(terms[i]) inside the loop.',
      'if (lower.includes(terms[i])) count += 1;',
    ],
    solution: `function ${functionName}(text) {
  const terms = ${JSON.stringify(terms)};
  const lower = text.toLowerCase();
  let count = 0;

  for (let i = 0; i < terms.length; i++) {
    if (lower.includes(terms[i])) count += 1;
  }

  return count;
}`,
    explanation: `This mirrors the small feature checks behind search, routing, and lesson-specific ${domain.signalName} logic.`,
  };
}

function makeBestCandidateExercise({ lesson, stepLabel, suffix, domain }) {
  const functionName = `best${suffix}Candidate`;

  return {
    id: `${lesson.id}-best-candidate`,
    group: lesson.name,
    stepLabel,
    title: 'Select the best candidate',
    concept: `${domain.kind} workflows often rank candidates by a score before choosing the next action.`,
    objective: 'Return the id of the candidate with the highest score.',
    difficulty: 'core',
    starterCode: `function ${functionName}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    // TODO: update best when candidates[i] has a higher score.
  }

  return best.id;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('lesson candidate wins', ${functionName}([
  { id: 'baseline', score: 0.2 },
  { id: ${JSON.stringify(lesson.id)}, score: 0.9 },
  { id: 'distractor', score: 0.4 },
]), ${JSON.stringify(lesson.id)});

check('last candidate wins', ${functionName}([
  { id: 'first', score: 0.1 },
  { id: 'second', score: 0.3 },
  { id: 'third', score: 0.8 },
]), 'third');

return results;`,
    hints: [
      'Compare candidates[i].score with best.score.',
      'If the current score is larger, replace best.',
      'if (candidates[i].score > best.score) best = candidates[i];',
    ],
    solution: `function ${functionName}(candidates) {
  let best = candidates[0];

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].score > best.score) best = candidates[i];
  }

  return best.id;
}`,
    explanation: `Ranking by ${domain.signalName} is a reusable pattern across ${lesson.categoryName} lessons.`,
  };
}

function makeStageCheckExercise({ lesson, stepLabel, suffix, domain }) {
  const functionName = `has${suffix}PipelineStages`;
  const requiredStages = domain.stages;
  const missingStages = requiredStages.slice(0, -1);
  const shuffledStages = [...requiredStages].reverse();

  return {
    id: `${lesson.id}-pipeline-stage-check`,
    group: lesson.name,
    stepLabel,
    title: 'Check required stages',
    concept: `${lesson.name} is easier to debug when the expected ${domain.kind} stages are explicit.`,
    objective: 'Return false when any required stage is missing.',
    difficulty: 'challenge',
    starterCode: `function ${functionName}(stages) {
  const requiredStages = ${JSON.stringify(requiredStages)};

  for (let i = 0; i < requiredStages.length; i++) {
    // TODO: return false if stages does not include requiredStages[i].
  }

  return true;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('all stages present', ${functionName}(${JSON.stringify(requiredStages)}), true);
check('order does not matter', ${functionName}(${JSON.stringify(shuffledStages)}), true);
check('missing one stage', ${functionName}(${JSON.stringify(missingStages)}), false);

return results;`,
    hints: [
      'Use stages.includes(requiredStages[i]).',
      'Return false as soon as one required stage is absent.',
      'if (!stages.includes(requiredStages[i])) return false;',
    ],
    solution: `function ${functionName}(stages) {
  const requiredStages = ${JSON.stringify(requiredStages)};

  for (let i = 0; i < requiredStages.length; i++) {
    if (!stages.includes(requiredStages[i])) return false;
  }

  return true;
}`,
    explanation: `${domain.stageExplanation} This check makes that dependency visible in code.`,
  };
}

export function createLessonLabGroup(lesson, domain) {
  const groupNumber = getLessonCatalogNumber(lesson.id, lesson.categoryId);
  const terms = termsForLesson(lesson);
  const suffix = toFunctionSuffix(lesson.id);

  return {
    lessonId: lesson.id,
    lessonName: lesson.name,
    categoryId: lesson.categoryId,
    categoryName: lesson.categoryName,
    groupNumber,
    exercises: [
      makeKeywordExercise({
        lesson,
        stepLabel: `${groupNumber}.1`,
        suffix,
        keyword: terms[0],
        domain,
      }),
      makeTermCountExercise({
        lesson,
        stepLabel: `${groupNumber}.2`,
        suffix,
        terms,
        domain,
      }),
      makeBestCandidateExercise({
        lesson,
        stepLabel: `${groupNumber}.3`,
        suffix,
        domain,
      }),
      makeStageCheckExercise({
        lesson,
        stepLabel: `${groupNumber}.4`,
        suffix,
        domain,
      }),
    ],
  };
}

export function createCategoryLessonLabs(categoryId, domain) {
  return allAnimations
    .filter((lesson) => lesson.categoryId === categoryId)
    .map((lesson) => createLessonLabGroup(lesson, domain));
}

export function replaceLessonLabGroup(groups, lessonId, makeExercises) {
  return groups.map((group) => {
    if (group.lessonId !== lessonId) return group;

    return {
      ...group,
      exercises: makeExercises(group).map((exercise, index) => ({
        ...exercise,
        group: group.lessonName,
        stepLabel: group.exercises[index]?.stepLabel || `${group.groupNumber}.${index + 1}`,
      })),
    };
  });
}
