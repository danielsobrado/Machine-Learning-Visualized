# Assessment Quality Contract

Status: **Implemented baseline; retained as design history**  
Scope: `unified-app` curated lesson assessments  
Active remaining work: [`ASSESSMENT_REMAINING_PLAN.md`](./ASSESSMENT_REMAINING_PLAN.md)  
P0 implementation record: [`ASSESSMENT_P0_COMPLETION.md`](./ASSESSMENT_P0_COMPLETION.md)

## DESIGN

The original P0 goal was to make assessment quality measurable through one shared contract rather than relying on topic-specific conventions.

A priority assessment is expected to provide:

- 100 curated questions;
- ordered `Foundation -> Mechanism -> Application -> Tricky -> Interview` progression;
- balanced answer positions;
- three distinct choices;
- substantive prompts and explanations;
- stable question IDs;
- no visible-page answer leakage;
- misconception/diagnostic depth after foundations;
- production or interview reasoning late in the assessment.

The design also required focused topic tests to remain available when they enforce semantic details that a generic structural contract cannot know.

## IMPLEMENTED BASELINE

The design is implemented through:

- `unified-app/src/data/assessmentQuality.js`
- `unified-app/src/data/assessmentQualityManifest.js`
- `unified-app/src/data/assessmentQuality.test.mjs`
- `unified-app/src/data/assessmentP0Coverage.test.mjs`
- `unified-app/src/data/lessonAssessments.js`
- `.github/workflows/unified-app-quality.yml`

The shared implementation validates curated source, question count, difficulty-band order, choice shape, ID integrity, answer distribution, prompt/explanation quality, duplicate prompts, and answer leakage. Priority coverage is centralized in the assessment quality manifest.

The original P0 acceptance criteria are therefore implemented. They are no longer active TODO items.

## FOLLOW-ON IMPLEMENTED WORK

Later passes built on this baseline without changing the original structural quality contract:

- generic semantic competency/evidence contracts;
- repository-wide semantic coverage inventory;
- shared migration of stable legacy depth contracts into the global competency registry;
- cross-topic synthesis contracts;
- canonical visualizer-state reuse for representative assessments;
- scenario pagination and deterministic answer rotation;
- scheduled/manual browser smoke coverage;
- report-only semantic near-duplicate auditing.

Those features are tracked in the living remaining-work plan rather than retroactively expanding the historical P0 design contract.

## ACTIVE REMAINING WORK

Do not use this document as a TODO list.

The only active assessment roadmap is:

[`docs/ASSESSMENT_REMAINING_PLAN.md`](./ASSESSMENT_REMAINING_PLAN.md)

At the current baseline, the remaining work is:

- review any final A3 semantic-promotion candidates emitted by the repository audit;
- perform the requested aggregate test/audit/build/browser validation.
