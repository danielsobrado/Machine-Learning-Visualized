# Assessment Quality Contract

Status: **P0 design contract**  
Scope: `unified-app` curated lesson assessments  
Reference implementation: `linearRegressionAssessment.js` and `linearRegressionAssessment.test.mjs`

## Goal

Every priority lesson should test understanding with the same minimum quality bar.

A quiz is not considered complete just because it has questions. A compliant assessment must progress from basic understanding to mechanism, application, misconception diagnosis, and production or interview reasoning.

The contract should make this quality measurable in one shared test suite instead of reimplementing the same structural checks in every topic-specific test file.

## Why this is P0

The repository already contains many dedicated assessment modules, but assessment validation is uneven.

Strong assessments such as Linear Regression, Cross-Validation, and Agentic Coding Systems already share a de facto structure:

- 100 curated questions.
- Five ordered difficulty bands.
- Three answer choices per question.
- Unique prompts and answer choices.
- Balanced correct-answer positions.
- Application and diagnostic questions after foundations are established.
- Explicit misconception traps late in the assessment.
- Interview or production reasoning at the end.
- Explanations for every answer.
- Protection against answer leakage inside a visible 10-question page.

The common contract should turn that pattern into a repository-wide invariant.

## Sources of truth

The implementation should remain grounded in these existing files:

- `unified-app/src/data/linearRegressionAssessment.js`
- `unified-app/src/data/linearRegressionAssessment.test.mjs`
- `unified-app/src/data/crossValidationAssessment.test.mjs`
- `unified-app/src/data/agenticCodingSystemsAssessment.test.mjs`
- `unified-app/src/data/lessonAssessments.js`
- `unified-app/src/data/lessonQualityManifest.js`

Linear Regression is the primary reference because its tests cover structure, progression, milestones, misconception safety, duplicate prevention, page-level answer leakage, and answer-position balance.

## Contract applicability

### Phase 1: priority assessments

The contract MUST apply to every lesson in `PRIORITY_ASSESSMENT_LESSON_IDS`.

A lesson in the priority list MUST NOT silently fall back to generic/generated questions.

### Phase 2: all dedicated assessments

After all priority lessons pass, the same structural contract SHOULD be applied to every dedicated `*Assessment.js` module.

### Non-curated lessons

Fallback or generated assessments MAY continue to exist during migration, but they MUST NOT be reported as contract-compliant curated assessments.

## Assessment levels

The canonical level order is:

```text
Foundation
   ↓
Mechanism
   ↓
Application
   ↓
Tricky
   ↓
Interview
```

Questions MUST never move backward in level.

For a full curated 100-question assessment, the canonical bands are:

| Level | Questions | Count | Purpose |
|---|---:|---:|---|
| Foundation | 1-20 | 20 | Vocabulary, purpose, core intuition, essential definitions |
| Mechanism | 21-50 | 30 | Computation, internal mechanics, step tracing, parameter effects |
| Application | 51-75 | 25 | Scenario selection, debugging, practical decisions, interpretation |
| Tricky | 76-90 | 15 | Misconceptions, edge cases, unsafe shortcuts, misleading conclusions |
| Interview | 91-100 | 10 | Synthesis, trade-offs, production reasoning, concise technical explanation |

These ranges are a contract for full priority assessments, not merely a recommendation.

## Structural contract

Every priority assessment MUST satisfy all of the following.

### Question count and identity

- Exactly 100 questions.
- Every question has a stable unique `id`.
- IDs use a lesson-specific prefix and a three-digit sequence.
- IDs follow question order from `001` to `100`.
- No question ID starts with `generated-`.

The shared validator SHOULD accept the lesson-specific prefix as metadata rather than hardcoding topic prefixes in the generic test.

### Question schema

Every question MUST contain:

```text
id
level
prompt
choices
answerIndex
explanation
```

Every question MUST satisfy:

- `prompt` is non-empty and substantive.
- `choices.length === 3`.
- all three choices are semantically distinct after normalization.
- `answerIndex` is an integer in `[0, 2]`.
- `explanation` is non-empty and explains why the selected answer is correct.
- `level` belongs to the five canonical levels.

`questionHash` MAY remain topic-specific and is not required by the common contract unless all curated modules adopt it.

## Progression contract

A compliant assessment MUST teach before it traps.

### Foundation

Foundation questions SHOULD establish:

- the purpose of the concept;
- the minimum vocabulary required by later questions;
- the central input/output relationship;
- the simplest correct mental model.

Foundation questions MUST NOT rely on advanced failure modes that have not been introduced.

### Mechanism

Mechanism questions SHOULD require learners to reason through what the system does.

Examples include:

- calculate a value;
- trace one algorithmic step;
- predict the effect of changing a parameter;
- identify which intermediate representation changes;
- reason about dimensions, data flow, or state transitions.

At least one meaningful mechanism milestone MUST exist before question 50.

### Application

Application questions MUST require the learner to use the concept in context rather than repeat a definition.

Application coverage MUST include at least two of these categories when relevant to the lesson:

- choose an approach from a realistic scenario;
- diagnose observed behavior;
- select an evaluation strategy;
- interpret model output;
- identify a data or pipeline problem;
- choose between competing methods;
- reason about performance, quality, memory, cost, or latency;
- connect the concept to another lesson.

Topic-specific tests SHOULD define exact application milestones.

### Tricky

Questions 76-90 are reserved for misconceptions, edge cases, and unsafe shortcuts.

A false or unsafe statement MUST only be the keyed answer when the prompt explicitly asks the learner to identify a trap, false claim, mistake, unsafe action, misleading interpretation, or similar condition.

A misconception MUST NOT be introduced as if it were a valid rule in Foundation or Mechanism questions.

The contract MUST validate that known topic misconceptions appear only after sufficient setup.

### Interview

Questions 91-100 MUST test synthesis rather than trivia.

The final band SHOULD include:

- explain the concept concisely;
- compare it with a nearby alternative;
- identify important assumptions;
- discuss a failure mode;
- reason about production use;
- connect metrics or diagnostics to action;
- explain a trade-off.

At least one question MUST represent production or operational reasoning when the topic has a production interpretation.

## Diagnostic coverage

Every priority assessment MUST contain diagnostic reasoning where the lesson supports observable failure behavior.

Examples:

- patterned residuals in regression;
- leakage in validation;
- exploding or vanishing gradients;
- retrieval failure versus generation failure in RAG;
- calibration drift;
- cache/memory pressure in LLM serving;
- class imbalance changing metric choice.

Topic-specific assessment metadata SHOULD define one or more diagnostic milestones so the shared quality suite can assert that they exist in the expected band.

A lesson with no meaningful diagnostic dimension MAY explicitly opt out with a documented reason.

## Misconception contract

Every priority assessment MUST define a short list of known misconceptions.

Each misconception entry SHOULD include:

```js
{
  id: 'causation-from-correlation',
  pattern: /proven to cause/i,
  allowedFromLevel: 'Tricky',
}
```

The shared validator MUST ensure:

- misconception text is not keyed as truth in earlier bands;
- explicit trap wording is present when a false claim is the correct choice;
- known misconceptions are not accidentally taught as valid shortcuts;
- at least one topic-specific misconception is assessed in the Tricky band.

Topic-specific tests MAY keep richer semantic checks when regex-based coverage is insufficient.

## Scope contract

Questions MUST stay inside the visible learning scope of the lesson.

The assessment SHOULD test prerequisites only when they are necessary to reason about the lesson itself.

Topic-specific metadata MAY define forbidden unrelated terms or concepts when a lesson has a history of generated filler or scope leakage.

The shared contract MUST fail any priority assessment containing `generated-` question IDs.

## Uniqueness contract

Within one 100-question assessment:

- normalized prompts MUST be unique;
- normalized exact correct answers SHOULD be unique unless the lesson has a documented unavoidable exception;
- choices within one question MUST be unique;
- repeated template questions with only numbers or nouns swapped SHOULD be treated as a quality failure during manual review even if exact-string checks pass.

Automated validation handles exact duplication. Semantic duplication remains a review concern until a reliable deterministic validator exists.

## Answer-position balance

Correct-answer positions MUST not form a learnable pattern.

### Global balance

Across 100 questions, counts for answer indexes `0`, `1`, and `2` MUST differ by no more than one.

### Visible-page balance

The UI displays questions in pages of 10.

For every 10-question page, correct-answer index counts MUST differ by no more than one.

Assessment generators MAY use a stable deterministic rotation as current curated assessments do. Randomness at runtime is not required and is undesirable for reproducible tests.

## Visible-page answer leakage

For each visible 10-question page:

- an exact correct answer MUST NOT be repeated as another question's correct answer;
- another prompt MUST NOT contain an exact substantial correct answer from the same page;
- question choices SHOULD NOT trivially reveal another question's answer.

The common test suite MUST implement the deterministic checks already present in strong assessment tests.

## Explanation quality

Every explanation MUST do more than restate the correct choice.

A useful explanation SHOULD answer at least one of:

- Why is this correct?
- Why is the tempting alternative wrong?
- What mechanism produces this result?
- What assumption matters?
- What practical consequence follows?

The common automated contract can enforce minimum presence/length. Topic-specific review remains responsible for factual and pedagogical quality.

## Labs

Labs remain lesson-specific and are not required to have the same count across all topics.

However:

- every declared lab ID MUST be stable;
- a priority assessment SHOULD have at least one lab when the lesson exposes an interactive mechanism that can be meaningfully practiced;
- topic-specific tests SHOULD validate expected lab IDs;
- labs MUST NOT be generated solely to satisfy a numeric quota.

## Topic-specific semantic coverage

A generic validator cannot determine whether an assessment actually teaches the right subject.

Each priority assessment MUST therefore have semantic coverage metadata or a focused topic test defining ordered milestones.

Example:

```js
const milestones = [
  { id: 'purpose', band: 'Foundation', patterns: [/main purpose/i] },
  { id: 'mechanism', band: 'Mechanism', patterns: [/gradient descent/i] },
  { id: 'diagnostic', band: 'Application', patterns: [/residual/i] },
  { id: 'misconception', band: 'Tricky', patterns: [/proven to cause/i] },
  { id: 'production', band: 'Interview', patterns: [/production/i] },
];
```

The exact representation MAY differ, but the resulting checks MUST verify that the topic progresses through its own important concepts in the correct order.

## Proposed implementation

### 1. Shared constants

Create:

`unified-app/src/data/assessmentQuality.js`

It SHOULD own generic constants and pure validation helpers such as:

```text
ASSESSMENT_LEVELS
ASSESSMENT_LEVEL_ORDER
FULL_ASSESSMENT_QUESTION_COUNT
ASSESSMENT_BANDS
ASSESSMENT_PAGE_SIZE
CHOICE_COUNT
```

No topic-specific vocabulary belongs in this module.

### 2. Shared assessment metadata

Create:

`unified-app/src/data/assessmentQualityManifest.js`

Each priority lesson SHOULD define only metadata needed by the common contract, for example:

```js
{
  lessonId: 'linear-regression',
  questionPrefix: 'lr',
  source: 'curated',
  diagnosticsRequired: true,
  productionReasoningRequired: true,
}
```

Keep semantic topic milestones in the lesson-specific test initially. Move them into the manifest only when doing so clearly reduces duplication.

### 3. Common test suite

Create:

`unified-app/src/data/assessmentQuality.test.mjs`

The test MUST iterate over `PRIORITY_ASSESSMENT_LESSON_IDS` and validate the shared contract for every priority lesson.

It SHOULD contain generic tests for:

1. priority assessment is curated;
2. exactly 100 questions exist;
3. IDs are stable, unique, ordered, and not generated;
4. schema is valid;
5. level bands are exact and monotonic;
6. prompts are unique;
7. choices are unique per question;
8. answer positions are globally balanced;
9. answer positions are balanced per page;
10. visible-page exact answer leakage is absent;
11. explanations are present;
12. Tricky questions occur only after setup;
13. Interview questions occupy the final band.

### 4. Keep topic-specific tests

Do NOT delete focused assessment tests.

After shared checks move to `assessmentQuality.test.mjs`, topic-specific tests SHOULD focus on:

- factual milestones;
- topic misconceptions;
- topic diagnostics;
- lesson-specific labs;
- scope leaks;
- important numerical examples;
- production/interview expectations specific to that concept.

This keeps the common test small and SOLID while preserving strong semantic validation.

### 5. Expose assessment source explicitly

`lessonAssessments.js` SHOULD make the distinction between curated and fallback/generated assessment sources explicit.

A minimal model is:

```text
curated
fallback
empty
```

Priority lessons MUST resolve to `curated`.

The exact API is an implementation decision, but tests MUST be able to prove that a priority lesson is not silently receiving generated fallback content.

## Migration plan

### Step 1 — Extract shared structural checks

Start with Linear Regression, Cross-Validation, and Agentic Coding Systems.

Move only checks that are genuinely identical into the common validator.

Do not weaken their topic-specific tests during extraction.

### Step 2 — Validate all priority lessons

Run the shared test over every `PRIORITY_ASSESSMENT_LESSON_IDS` entry.

Record failures by category:

```text
STRUCTURE
PROGRESSION
DUPLICATION
ANSWER_BALANCE
ANSWER_LEAKAGE
MISCONCEPTION_ORDER
SOURCE
```

Fix assessments rather than adding exceptions unless a lesson has a real pedagogical reason to differ.

### Step 3 — Remove duplicate generic assertions

Once the common suite passes reliably, remove duplicated structural assertions from individual tests.

Keep semantic assertions local.

### Step 4 — Extend to all dedicated assessments

Apply the contract to non-priority dedicated assessment modules.

A dedicated module that cannot yet satisfy the contract remains non-compliant until upgraded; it MUST NOT receive an exception merely because a file exists.

## Failure policy

The contract SHOULD be strict for priority lessons.

A priority lesson fails CI when:

- it resolves to fallback/generated questions;
- it has fewer or more than 100 questions;
- its level bands are wrong;
- IDs are duplicated or unstable;
- correct answer positions are predictably imbalanced;
- exact page-level answer leakage exists;
- prompts or choices duplicate exactly;
- explanations are missing;
- a known unsafe misconception is keyed as valid outside an explicit trap;
- topic-specific milestone tests fail.

Do not hide failures behind automatic regeneration.

## Acceptance criteria

This P0 is complete when all of the following are true:

- [ ] `assessmentQuality.js` exists with shared constants and pure validation helpers.
- [ ] `assessmentQualityManifest.js` identifies every priority lesson and its curated source expectations.
- [ ] `assessmentQuality.test.mjs` iterates every priority assessment.
- [ ] Every priority assessment contains exactly 100 curated questions.
- [ ] Every priority assessment uses the exact `20 / 30 / 25 / 15 / 10` level progression.
- [ ] Every priority assessment has stable ordered unique IDs.
- [ ] No priority assessment contains `generated-` question IDs.
- [ ] Every question has exactly three distinct choices and a valid answer index.
- [ ] Every question has a meaningful explanation.
- [ ] Correct answer positions are balanced globally.
- [ ] Correct answer positions are balanced within every 10-question page.
- [ ] Exact answer leakage within a visible page is rejected.
- [ ] Duplicate normalized prompts are rejected.
- [ ] Topic-specific misconception tests remain in place.
- [ ] Topic-specific application/diagnostic milestones remain in place.
- [ ] The Tricky band is reserved for explicit misconceptions and edge cases after setup.
- [ ] The Interview band tests synthesis, trade-offs, or production reasoning rather than simple recall.
- [ ] `npm test` passes from `unified-app/`.
- [ ] `npm run audit:quality` passes from `unified-app/`.

## Definition of done for a new priority assessment

A new assessment may be added to `PRIORITY_ASSESSMENT_LESSON_IDS` only when:

```text
100 curated questions
        │
        ├── 20 Foundation
        ├── 30 Mechanism
        ├── 25 Application
        ├── 15 Tricky
        └── 10 Interview
        │
        ▼
shared structural contract passes
        │
        ▼
topic semantic milestones pass
        │
        ▼
misconception + diagnostic coverage passes
        │
        ▼
production/interview synthesis passes
```

Adding a lesson to the priority list before this state is reached should fail tests.

## Non-goals

This P0 does not require:

- changing the quiz UI;
- adding new visual question types;
- rewriting every existing assessment immediately;
- replacing topic-specific semantic tests with generic regex checks;
- introducing runtime randomness;
- requiring the same number of labs for every lesson;
- scoring lesson quality and assessment quality as the same metric.

Those can be separate improvements after the common quality floor is enforced.

## Design principles

Keep the implementation simple:

- one small module for constants and generic validation;
- one small manifest for assessment metadata;
- one common structural test suite;
- topic-specific tests for semantic correctness;
- no hidden fallback for priority lessons;
- no special-case exceptions without a documented pedagogical reason.

The result should make assessment quality predictable: when a lesson is marked priority, learners can expect the same progression and rigor regardless of topic.