import test from 'node:test';
import assert from 'node:assert/strict';

import { getLessonAssessment } from './lessonAssessments.js';

const LEVEL_ORDER = {
  Foundation: 0,
  Mechanism: 1,
  Application: 2,
  Tricky: 3,
  Interview: 4,
};

function normalized(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function correctAnswer(question) {
  return question.choices[question.answerIndex];
}

test('linear regression has a complete curated 100-question assessment', () => {
  const { quiz, labs } = getLessonAssessment('linear-regression');
  const ids = new Set(quiz.map((question) => question.id));
  const globalCounts = [0, 0, 0];

  assert.deepEqual(labs.map((lab) => lab.id), ['move-line']);

  assert.equal(quiz.length, 100);
  assert.equal(ids.size, 100);
  assert.ok(quiz.every((question) => !question.id.startsWith('generated-')));

  for (const [index, question] of quiz.entries()) {
    assert.match(question.id, /^lr-\d{3}-[a-z0-9-]+$/);
    assert.ok(question.id.startsWith(`lr-${String(index + 1).padStart(3, '0')}-`), `${question.id} should match question order`);
    assert.ok(question.prompt && /\S/.test(question.prompt), `${question.id} should have a prompt`);
    assert.equal(question.choices.length, 3, `${question.id} should have three choices`);
    assert.ok(Number.isInteger(question.answerIndex), `${question.id} should have an integer answer index`);
    assert.ok(question.answerIndex >= 0 && question.answerIndex < question.choices.length, `${question.id} has invalid answer index`);
    assert.ok(question.explanation && /\S/.test(question.explanation), `${question.id} should explain the answer`);
    assert.equal(new Set(question.choices.map(normalized)).size, 3, `${question.id} should not repeat choices`);
    globalCounts[question.answerIndex] += 1;
  }

  assert.ok(
    Math.max(...globalCounts) - Math.min(...globalCounts) <= 1,
    `answer positions should be globally balanced, got ${globalCounts.join(', ')}`,
  );
});

test('linear regression assessment progresses from recall to interview readiness', () => {
  const { quiz } = getLessonAssessment('linear-regression');

  const expectedBands = [
    ['Foundation', 0, 20],
    ['Mechanism', 20, 50],
    ['Application', 50, 75],
    ['Tricky', 75, 90],
    ['Interview', 90, 100],
  ];

  for (const [level, start, end] of expectedBands) {
    const band = quiz.slice(start, end);
    assert.ok(band.every((question) => question.level === level), `${level} band should occupy questions ${start + 1}-${end}`);
  }

  for (let index = 1; index < quiz.length; index += 1) {
    assert.ok(
      LEVEL_ORDER[quiz[index].level] >= LEVEL_ORDER[quiz[index - 1].level],
      `question ${index + 1} should not regress from ${quiz[index - 1].level} to ${quiz[index].level}`,
    );
  }

  const milestones = [
    ['prediction form', ['y_hat = m x + b']],
    ['residuals and MSE', ['mean squared error average']],
    ['parameter updates', ['gradient descent']],
    ['matrix form', ['design matrix X']],
    ['diagnostics', ['curved pattern in residuals']],
    ['production evaluation', ['test set separate']],
    ['leakage and causality traps', ['feature is proven to cause']],
    ['interview readiness', ['formula, fitting objective, diagnostics, evaluation, and caveats']],
  ];

  let previous = -1;
  for (const [name, terms] of milestones) {
    const milestoneIndex = quiz.findIndex((question) => (
      terms.every((term) => normalized(`${question.prompt} ${question.choices.join(' ')} ${question.explanation}`).includes(normalized(term)))
    ));
    assert.notEqual(milestoneIndex, -1, `missing milestone: ${name}`);
    assert.ok(milestoneIndex > previous, `${name} appears out of order`);
    previous = milestoneIndex;
  }
});

test('linear regression assessment avoids duplicate prompts and correct answers', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const prompts = quiz.map((question) => normalized(question.prompt));
  const correctAnswers = quiz.map((question) => normalized(correctAnswer(question)));

  assert.equal(new Set(prompts).size, prompts.length);
  assert.equal(new Set(correctAnswers).size, correctAnswers.length);
});

test('linear regression assessment avoids prior generated-question defects', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const joined = normalized(quiz.flatMap((question) => [
    question.id,
    question.prompt,
    question.explanation,
    ...question.choices,
  ]).join(' '));

  assert.ok(!joined.includes('generated-'), 'assessment should not include generated question ids');
  assert.ok(!joined.includes('when use the animation'), 'assessment should not contain malformed generated prompt text');
  assert.ok(!joined.includes('answer letter appeared'), 'assessment should not include generic strategy-review distractors');
  assert.ok(!joined.includes('core linear algebra operation'), 'assessment should not inherit unrelated generic filler');
  assert.ok(!joined.includes('fitting linear models versus the shortcut'), 'assessment should not key safe fallback caveats as misconception traps');
});

test('linear regression assessment keys false claims only for explicit trap prompts', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const falseClaimPatterns = [
    /proven to cause/,
    /will generalize/,
    /delete every inconvenient point/,
    /bigger raw coefficients/,
    /causal effect/,
    /high-scoring line is production-ready/,
  ];

  for (const [index, question] of quiz.entries()) {
    const prompt = normalized(question.prompt);
    const answer = normalized(correctAnswer(question));
    const explicitTrapPrompt = /unsafe|not conclude|risky|trap|misunderstands|hard to interpret/.test(prompt);
    const falseClaimKeyed = falseClaimPatterns.some((pattern) => pattern.test(answer));

    assert.ok(
      !falseClaimKeyed || explicitTrapPrompt,
      `question ${index + 1} keys a false claim outside an explicit trap prompt`,
    );
  }
});

test('linear regression assessment marks misconceptions as traps after setup', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const trapIds = [
    'lr-076-causation-trap',
    'lr-077-r2-trap',
    'lr-078-low-r2-trap',
    'lr-079-extrapolation-trap',
    'lr-080-outlier-trap',
    'lr-081-scale-trap',
    'lr-082-pvalue-trap',
    'lr-083-assumption-trap',
    'lr-084-leakage-trap',
    'lr-085-collinearity-trap',
    'lr-086-average-error-trap',
    'lr-087-train-error-trap',
    'lr-088-linear-form-trap',
    'lr-089-intercept-trap',
    'lr-090-tricky-success',
  ];
  const misconceptionPatterns = [
    /feature is proven to cause/i,
    /model will generalize/i,
    /low r-squared proves/i,
    /outside the training range/i,
    /delete every inconvenient point/i,
    /bigger raw coefficients/i,
    /tiny p-value/i,
    /patterned residuals/i,
    /very low test error suspicious/i,
    /Overinterpreting individual coefficient signs as stable facts/i,
    /average error hide/i,
    /only by training error/i,
    /Using x squared as a feature means the model is no longer linear in coefficients/i,
    /intercept be hard to interpret/i,
  ];
  const trapPrompt = /unsafe|not conclude|not automatically|not guarantee|assumption mistake|risky|trap|suspicious|misunderstands|hard to interpret|hide|only by/i;

  assert.deepEqual(quiz.slice(75, 90).map((question) => question.id), trapIds);

  for (const [index, question] of quiz.entries()) {
    const text = `${question.prompt} ${question.choices.join(' ')} ${question.explanation}`;
    const containsMisconception = misconceptionPatterns.some((pattern) => pattern.test(text));
    if (!containsMisconception) continue;

    assert.ok(index >= 75, `${question.id} introduces misconception too early`);
    assert.match(question.prompt, trapPrompt, `${question.id} should mark misconception as a trap`);
  }
});

test('linear regression assessment does not leak exact answers within a visible page', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const pageSize = 10;

  for (let pageStart = 0; pageStart < quiz.length; pageStart += pageSize) {
    const page = quiz.slice(pageStart, pageStart + pageSize);
    const answers = page.map((question) => normalized(correctAnswer(question)));

    assert.equal(new Set(answers).size, answers.length, `page starting at question ${pageStart + 1} should not repeat exact correct answers`);

    for (const [questionIndex, question] of page.entries()) {
      const prompt = normalized(question.prompt);

      for (const [answerIndex, answer] of answers.entries()) {
        if (questionIndex === answerIndex || answer.length < 8) continue;

        assert.ok(
          !prompt.includes(answer),
          `question ${pageStart + questionIndex + 1} prompt should not reveal answer from question ${pageStart + answerIndex + 1}`,
        );
      }
    }
  }
});

test('linear regression assessment distributes correct answer positions per page', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const pageSize = 10;

  for (let pageStart = 0; pageStart < quiz.length; pageStart += pageSize) {
    const page = quiz.slice(pageStart, pageStart + pageSize);
    const counts = [0, 0, 0];
    for (const question of page) counts[question.answerIndex] += 1;
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `imbalanced page at ${pageStart + 1}: ${counts.join(',')}`);
  }
});

test('linear regression assessment covers heteroscedasticity and influence diagnostics', () => {
  const { quiz } = getLessonAssessment('linear-regression');
  const byId = new Map(quiz.map((question) => [question.id, question]));
  const questionText = (id) => normalized([
    byId.get(id)?.prompt,
    ...(byId.get(id)?.choices || []),
    byId.get(id)?.explanation,
  ].join(' '));

  const leverage = questionText('lr-043-leverage-point');
  assert.match(leverage, /high leverage/);
  assert.match(leverage, /influence/);
  assert.match(leverage, /residual/);

  const heteroscedasticity = questionText('lr-045-heteroscedasticity');
  assert.match(heteroscedasticity, /heteroscedasticity/);
  assert.match(heteroscedasticity, /standard errors/);
  assert.match(heteroscedasticity, /significance tests/);

  const influence = questionText('lr-065-outlier-response');
  assert.match(influence, /studentized residual/);
  assert.match(influence, /hat values/);
  assert.match(influence, /cook's distance/);

  const robustInference = questionText('lr-083-assumption-trap');
  assert.match(robustInference, /heteroscedasticity-robust standard errors/);
  assert.match(robustInference, /weighted least-squares/);
  assert.match(robustInference, /transformation/);
});
