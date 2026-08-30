import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PRIORITY_ASSESSMENT_LESSON_IDS,
  getLessonAssessment,
} from './lessonAssessments.js';

const ASSESSMENT_LEVELS = Object.freeze([
  'Foundation',
  'Mechanism',
  'Application',
  'Tricky',
  'Interview',
]);

const ASSESSMENT_LEVEL_ORDER = Object.freeze(Object.fromEntries(
  ASSESSMENT_LEVELS.map((level, index) => [level, index]),
));

const ASSESSMENT_BANDS = Object.freeze([
  Object.freeze({ level: 'Foundation', start: 0, end: 20 }),
  Object.freeze({ level: 'Mechanism', start: 20, end: 50 }),
  Object.freeze({ level: 'Application', start: 50, end: 75 }),
  Object.freeze({ level: 'Tricky', start: 75, end: 90 }),
  Object.freeze({ level: 'Interview', start: 90, end: 100 }),
]);

const FULL_ASSESSMENT_QUESTION_COUNT = 100;
const ASSESSMENT_PAGE_SIZE = 10;
const CHOICE_COUNT = 3;
const MIN_PROMPT_LENGTH = 20;
const MIN_EXPLANATION_LENGTH = 30;
const MIN_LEAK_CHECK_LENGTH = 8;
const GENERATED_ID_PREFIX = 'generated-';
const ORDERED_ID_PATTERN = /^(.+?)-(\d{3})(?:-|$)/;

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function correctAnswer(question) {
  return question.choices[question.answerIndex];
}

function assertBalanced(counts, message) {
  assert.ok(
    Math.max(...counts) - Math.min(...counts) <= 1,
    `${message}: ${counts.join(', ')}`,
  );
}

function assertOrderedIds(lessonId, quiz) {
  const firstMatch = ORDERED_ID_PATTERN.exec(quiz[0]?.id || '');
  assert.ok(firstMatch, `${lessonId}: first question id must contain a lesson prefix and three-digit sequence`);

  const prefix = firstMatch[1];

  for (const [index, question] of quiz.entries()) {
    const match = ORDERED_ID_PATTERN.exec(question.id || '');
    assert.ok(match, `${lessonId}: ${question.id || `question ${index + 1}`} must contain a three-digit sequence`);
    assert.equal(match[1], prefix, `${lessonId}: ${question.id} must use the common lesson-specific prefix ${prefix}`);
    assert.equal(
      Number(match[2]),
      index + 1,
      `${lessonId}: ${question.id} must match question order ${index + 1}`,
    );
  }
}

function assertQuestionSchema(lessonId, quiz) {
  const ids = new Set();
  const prompts = new Set();
  const globalAnswerCounts = Array(CHOICE_COUNT).fill(0);

  for (const [index, question] of quiz.entries()) {
    const label = `${lessonId}: question ${index + 1}`;

    assert.ok(question.id && /\S/.test(question.id), `${label} must have an id`);
    assert.ok(!question.id.startsWith(GENERATED_ID_PREFIX), `${label} must be curated, not generated`);
    assert.ok(!ids.has(question.id), `${lessonId}: duplicate question id ${question.id}`);
    ids.add(question.id);

    assert.ok(ASSESSMENT_LEVELS.includes(question.level), `${question.id}: invalid level ${question.level}`);
    assert.ok(question.prompt && question.prompt.trim().length >= MIN_PROMPT_LENGTH, `${question.id}: prompt is too short`);
    assert.ok(question.explanation && question.explanation.trim().length >= MIN_EXPLANATION_LENGTH, `${question.id}: explanation is too short`);

    assert.ok(Array.isArray(question.choices), `${question.id}: choices must be an array`);
    assert.equal(question.choices.length, CHOICE_COUNT, `${question.id}: must have exactly ${CHOICE_COUNT} choices`);
    assert.equal(
      new Set(question.choices.map(normalize)).size,
      CHOICE_COUNT,
      `${question.id}: choices must be distinct after normalization`,
    );

    assert.ok(Number.isInteger(question.answerIndex), `${question.id}: answerIndex must be an integer`);
    assert.ok(
      question.answerIndex >= 0 && question.answerIndex < CHOICE_COUNT,
      `${question.id}: answerIndex must be between 0 and ${CHOICE_COUNT - 1}`,
    );
    globalAnswerCounts[question.answerIndex] += 1;

    const normalizedPrompt = normalize(question.prompt);
    assert.ok(!prompts.has(normalizedPrompt), `${lessonId}: duplicate normalized prompt at ${question.id}`);
    prompts.add(normalizedPrompt);
  }

  assert.equal(ids.size, FULL_ASSESSMENT_QUESTION_COUNT, `${lessonId}: question ids must be unique`);
  assert.equal(prompts.size, FULL_ASSESSMENT_QUESTION_COUNT, `${lessonId}: prompts must be unique`);
  assertBalanced(globalAnswerCounts, `${lessonId}: global answer positions must be balanced`);
}

function assertLevelProgression(lessonId, quiz) {
  for (const { level, start, end } of ASSESSMENT_BANDS) {
    const band = quiz.slice(start, end);
    assert.equal(band.length, end - start, `${lessonId}: ${level} band has wrong size`);
    assert.ok(
      band.every((question) => question.level === level),
      `${lessonId}: ${level} must occupy questions ${start + 1}-${end}`,
    );
  }

  for (let index = 1; index < quiz.length; index += 1) {
    assert.ok(
      ASSESSMENT_LEVEL_ORDER[quiz[index].level] >= ASSESSMENT_LEVEL_ORDER[quiz[index - 1].level],
      `${lessonId}: question ${index + 1} moves backward from ${quiz[index - 1].level} to ${quiz[index].level}`,
    );
  }
}

function assertPageQuality(lessonId, quiz) {
  for (let pageStart = 0; pageStart < quiz.length; pageStart += ASSESSMENT_PAGE_SIZE) {
    const page = quiz.slice(pageStart, pageStart + ASSESSMENT_PAGE_SIZE);
    const pageNumber = Math.floor(pageStart / ASSESSMENT_PAGE_SIZE) + 1;
    const counts = Array(CHOICE_COUNT).fill(0);
    const normalizedAnswers = page.map((question) => normalize(correctAnswer(question)));

    for (const question of page) counts[question.answerIndex] += 1;
    assertBalanced(counts, `${lessonId}: page ${pageNumber} answer positions must be balanced`);

    assert.equal(
      new Set(normalizedAnswers).size,
      normalizedAnswers.length,
      `${lessonId}: page ${pageNumber} must not repeat exact correct answers`,
    );

    for (const [answerOffset, answer] of normalizedAnswers.entries()) {
      if (answer.length < MIN_LEAK_CHECK_LENGTH) continue;

      for (const [questionOffset, question] of page.entries()) {
        if (answerOffset === questionOffset) continue;

        const prompt = normalize(question.prompt);
        assert.ok(
          !prompt.includes(answer),
          `${lessonId}: page ${pageNumber} question ${pageStart + questionOffset + 1} prompt reveals another correct answer`,
        );

        const choices = question.choices.map(normalize);
        assert.ok(
          !choices.includes(answer),
          `${lessonId}: page ${pageNumber} question ${pageStart + questionOffset + 1} choices reveal another correct answer`,
        );
      }
    }
  }
}

test('priority assessment registry has unique lesson ids', () => {
  assert.equal(
    new Set(PRIORITY_ASSESSMENT_LESSON_IDS).size,
    PRIORITY_ASSESSMENT_LESSON_IDS.length,
    'PRIORITY_ASSESSMENT_LESSON_IDS must not contain duplicates',
  );
});

test('priority assessments satisfy the shared quality contract', async (t) => {
  for (const lessonId of PRIORITY_ASSESSMENT_LESSON_IDS) {
    await t.test(lessonId, () => {
      const assessment = getLessonAssessment(lessonId);
      const { quiz } = assessment;

      assert.equal(assessment.source, 'curated', `${lessonId}: priority assessment must resolve to curated source`);
      assert.ok(Array.isArray(quiz), `${lessonId}: quiz must be an array`);
      assert.equal(
        quiz.length,
        FULL_ASSESSMENT_QUESTION_COUNT,
        `${lessonId}: priority assessments must contain exactly ${FULL_ASSESSMENT_QUESTION_COUNT} questions`,
      );

      assertOrderedIds(lessonId, quiz);
      assertQuestionSchema(lessonId, quiz);
      assertLevelProgression(lessonId, quiz);
      assertPageQuality(lessonId, quiz);
    });
  }
});
