export const REQUIRED_LEARNING_CARD_TYPES = Object.freeze([
  'def',
  'int',
  'eqn',
  'ex',
  'why',
  'do',
]);

export const GENERIC_LEARNING_CARD_PHRASES = Object.freeze([
  'repeatable computational concept',
  'read the stage as a flow',
  'headline equation compresses the central operation',
  'example lens: change one value',
  'systems only become reliable when you can explain',
  'do one pass slowly: predict the update',
]);

const ACTION_WORDS = Object.freeze([
  'predict',
  'explain',
  'identify',
  'choose',
  'compute',
  'trace',
  'find',
  'compare',
  'name',
  'decide',
  'calculate',
  'match',
  'diagnose',
]);

function words(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean);
}

function normalized(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function validateLearningCardOverride(lessonId, override) {
  const errors = [];

  for (const type of REQUIRED_LEARNING_CARD_TYPES) {
    const body = override?.[type]?.body;
    if (typeof body !== 'string' || body.trim().length === 0) {
      errors.push(`${lessonId}: missing ${type} learning card body`);
      continue;
    }
    if (body.trim().length < 60 || words(body).length < 10) {
      errors.push(`${lessonId}: ${type} learning card is too thin`);
    }
  }

  const bodies = REQUIRED_LEARNING_CARD_TYPES
    .map((type) => override?.[type]?.body)
    .filter(Boolean);
  const normalizedBodies = bodies.map(normalized);
  if (new Set(normalizedBodies).size !== normalizedBodies.length) {
    errors.push(`${lessonId}: learning card bodies must be distinct`);
  }

  const allText = normalizedBodies.join(' ');
  for (const phrase of GENERIC_LEARNING_CARD_PHRASES) {
    if (allText.includes(normalized(phrase))) {
      errors.push(`${lessonId}: generic fallback phrase leaked into curated content: ${phrase}`);
    }
  }

  const why = override?.why?.body || '';
  if (!/^mistake to avoid:/i.test(why.trim())) {
    errors.push(`${lessonId}: why card must frame a concrete "Mistake to avoid"`);
  }

  const doBody = normalized(override?.do?.body);
  if (!ACTION_WORDS.some((word) => doBody.includes(word))) {
    errors.push(`${lessonId}: final practice card must ask for an active learner action`);
  }

  return errors;
}

export function validateLearningCardCoverage({ lessonIds, overrides }) {
  const errors = [];
  const seen = new Set();

  for (const lessonId of lessonIds) {
    if (seen.has(lessonId)) {
      errors.push(`${lessonId}: duplicate active lesson id`);
      continue;
    }
    seen.add(lessonId);

    const override = overrides[lessonId];
    if (!override) {
      errors.push(`${lessonId}: missing explicit learning card override`);
      continue;
    }
    errors.push(...validateLearningCardOverride(lessonId, override));
  }

  for (const lessonId of Object.keys(overrides)) {
    if (!seen.has(lessonId)) errors.push(`${lessonId}: learning card override references inactive lesson`);
  }

  return errors;
}
