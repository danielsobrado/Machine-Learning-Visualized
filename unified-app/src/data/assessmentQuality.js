export const ASSESSMENT_LEVELS = Object.freeze([
  'Foundation',
  'Mechanism',
  'Application',
  'Tricky',
  'Interview',
]);

export const ASSESSMENT_LEVEL_ORDER = Object.freeze(Object.fromEntries(
  ASSESSMENT_LEVELS.map((level, index) => [level, index]),
));

export const ASSESSMENT_BANDS = Object.freeze([
  Object.freeze({ level: 'Foundation', start: 0, end: 20 }),
  Object.freeze({ level: 'Mechanism', start: 20, end: 50 }),
  Object.freeze({ level: 'Application', start: 50, end: 75 }),
  Object.freeze({ level: 'Tricky', start: 75, end: 90 }),
  Object.freeze({ level: 'Interview', start: 90, end: 100 }),
]);

export const FULL_ASSESSMENT_QUESTION_COUNT = 100;
export const ASSESSMENT_PAGE_SIZE = 10;
export const ASSESSMENT_CHOICE_COUNT = 3;
export const MIN_ASSESSMENT_PROMPT_LENGTH = 20;
export const MIN_ASSESSMENT_EXPLANATION_LENGTH = 30;
export const MIN_ANSWER_LEAK_CHECK_LENGTH = 8;
export const GENERATED_QUESTION_ID_PREFIX = 'generated-';
export const ORDERED_QUESTION_ID_PATTERN = /^(.+?)-(\d{3})(?:-|$)/;

export function normalizeAssessmentText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getCorrectAnswer(question) {
  return question.choices[question.answerIndex];
}

export function getAnswerPositionCounts(questions) {
  const counts = Array(ASSESSMENT_CHOICE_COUNT).fill(0);
  for (const question of questions) counts[question.answerIndex] += 1;
  return counts;
}

export function isBalancedAnswerDistribution(counts) {
  return Math.max(...counts) - Math.min(...counts) <= 1;
}

export function getAssessmentSource(quiz = []) {
  if (quiz.length === 0) return 'empty';
  return quiz.some((question) => String(question.id || '').startsWith(GENERATED_QUESTION_ID_PREFIX))
    ? 'fallback'
    : 'curated';
}
