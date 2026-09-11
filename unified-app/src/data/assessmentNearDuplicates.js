const DEFAULT_THRESHOLD = 0.72;
const DEFAULT_MIN_TOKENS = 5;

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'in', 'is', 'it',
  'of', 'on', 'or', 'that', 'the', 'this', 'to', 'what', 'when', 'which', 'why', 'with', 'you',
]);

function normalizeTokens(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function tokenSet(value) {
  return new Set(normalizeTokens(value));
}

function jaccard(left, right) {
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  const union = left.size + right.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function pairKey(lessonId, leftId, rightId) {
  const [first, second] = [leftId, rightId].sort();
  return `${lessonId}:${first}|${second}`;
}

function assessmentQuestions(assessment) {
  return [
    ...(assessment.quiz || []).map((question) => ({ ...question, kind: 'quiz' })),
    ...(assessment.scenarioQuestions || []).map((question) => ({ ...question, kind: 'scenario' })),
  ].filter(({ id, prompt }) => id && prompt);
}

export function findAssessmentNearDuplicates(
  assessments,
  {
    threshold = DEFAULT_THRESHOLD,
    minTokens = DEFAULT_MIN_TOKENS,
    allowlist = [],
  } = {},
) {
  const allowed = new Set(allowlist);
  const findings = [];

  for (const [lessonId, assessment] of Object.entries(assessments).sort(([left], [right]) => left.localeCompare(right))) {
    const questions = assessmentQuestions(assessment).map((question) => ({
      ...question,
      tokens: tokenSet(question.prompt),
    }));

    for (let leftIndex = 0; leftIndex < questions.length; leftIndex += 1) {
      const left = questions[leftIndex];
      if (left.tokens.size < minTokens) continue;

      for (let rightIndex = leftIndex + 1; rightIndex < questions.length; rightIndex += 1) {
        const right = questions[rightIndex];
        if (right.tokens.size < minTokens) continue;

        const key = pairKey(lessonId, left.id, right.id);
        if (allowed.has(key)) continue;

        const score = jaccard(left.tokens, right.tokens);
        if (score < threshold) continue;

        findings.push(Object.freeze({
          lessonId,
          leftId: left.id,
          leftKind: left.kind,
          rightId: right.id,
          rightKind: right.kind,
          similarity: Number(score.toFixed(4)),
          leftPrompt: left.prompt,
          rightPrompt: right.prompt,
          allowlistKey: key,
        }));
      }
    }
  }

  return Object.freeze(findings.sort((left, right) => (
    right.similarity - left.similarity
    || left.lessonId.localeCompare(right.lessonId)
    || left.leftId.localeCompare(right.leftId)
    || left.rightId.localeCompare(right.rightId)
  )));
}

export function assessmentNearDuplicateDefaults() {
  return Object.freeze({ threshold: DEFAULT_THRESHOLD, minTokens: DEFAULT_MIN_TOKENS });
}
