# Assessment Remaining Plan

Status: **Active living plan**  
Last reviewed: **2026-09-11**

This is the source of truth for assessment work that remains after the large quality, coverage, and semantic-protection passes.

The default rule remains:

> Add a question or scenario only when a real reasoning, diagnostic, numerical, comparison, or visual-state gap exists. Otherwise protect strong existing evidence with a regression contract.

The current implementation was intentionally completed before aggregate validation. Statuses below describe repository implementation; the final full test/audit/build/browser run is still to be performed together.

## Status values

| Status | Meaning |
|---|---|
| `TODO` | Confirmed work not yet implemented |
| `PARTIAL` | Useful implementation exists, but consolidation is intentionally incomplete |
| `IN PROGRESS` | Implementation exists and the remaining candidate set still needs review |
| `BLOCKED` | Cannot proceed until a dependency is resolved |
| `DONE` | Acceptance criteria are represented in code and protected by tests/contracts |
| `DEFERRED` | Intentionally postponed |

## Implemented baseline — do not reopen without evidence

- Shared 100-question assessment quality contract.
- Curated priority assessment manifests and focused topic tests.
- Visual-state assessment questions and compact renderer.
- Central scenario-extension registry.
- P0/P1/P2 scenario hardening.
- Deterministic scenario answer-position rotation.
- Scenario pagination.
- Generic semantic competency schema and evidence validation.
- Repository-wide semantic coverage audit.
- Cross-topic synthesis contract.
- Canonical visualizer-state reuse for representative lessons.
- Scheduled/manual browser-level assessment smoke coverage.
- Deterministic report-only near-duplicate audit.

## Roadmap

| ID | Priority | Workstream | Status | Current outcome |
|---|---|---|---|---|
| A1 | P0 | Generic semantic competency model | `DONE` | Shared stable competency/evidence schema |
| A2 | P0 | Repository-wide semantic coverage inventory | `DONE` | Deterministic classification + blocking priority-gap audit in CI |
| A3 | P0 | Protect strong-but-unprotected lessons | `IN PROGRESS` | Major strong families promoted; final audit candidates still need aggregate review |
| A4 | P0 | Cross-topic synthesis contract | `DONE` | Six required synthesis families have explicit live evidence |
| A5 | P1 | Canonical visualizer-state reuse | `DONE` | Three representative assessments derive state from real lesson models |
| A6 | P1 | Competency/coverage contract consolidation | `PARTIAL` | Stable-ID legacy families use one adapter; prose-ID families remain intentionally legacy-protected |
| A7 | P1 | Browser-level assessment smoke CI | `DONE` | Nightly/manual Playwright smoke without normal-commit browser cost |
| A8 | P2 | Semantic near-duplicate audit | `DONE` | Deterministic report-only token-overlap audit with allowlisting |
| A9 | P2 | Documentation synchronization | `DONE` | Design/completion docs point back to this living plan |

---

## A1 — Generic semantic competency model

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentCompetencies.js`
- `unified-app/src/data/assessmentCompetencyRegistry.js`
- `unified-app/src/data/assessmentCompetencies.test.mjs`

A competency has a stable semantic ID, lesson ID, and explicit quiz/scenario evidence. Global validation checks identity, completeness, and live evidence resolution.

---

## A2 — Repository-wide semantic coverage inventory

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentSemanticCoverage.js`
- `unified-app/scripts/audit-assessment-semantic-coverage.mjs`
- `unified-app/src/data/assessmentSemanticCoverage.test.mjs`
- `.github/workflows/unified-app-quality.yml`

The audit classifies assessments as:

```text
COMPETENCY_PROTECTED
TOPIC_TEST_PROTECTED
LEGACY_COVERAGE_PROTECTED
STRUCTURE_ONLY
INTENTIONALLY_NON_PRIORITY
LEGACY_OR_INCOMPLETE
```

The inventory derives priority and generic-competency status from canonical registries. Legacy semantic protection is discovered from the repository's existing contract shapes rather than copied into a new lesson list:

- `*_AUDITED_LESSON_IDS`
- `*_DEPTH_REQUIREMENTS`
- `*_COVERAGE`

A priority lesson without recognized semantic protection is a blocking audit error. Markdown and JSON output are supported.

---

## A3 — Protect strong-but-unprotected lessons

**Status:** `IN PROGRESS`

Large parts of the original candidate list are now protected through the generic registry without adding assessment noise. Existing quiz/scenario evidence was reused for:

- classic NLP;
- numerical linear algebra;
- foundation models;
- frontier architecture overview;
- classical ML/statistics depth;
- neural-network training depth;
- NLP/transformer depth;
- advanced inference;
- frontier systems;
- linear algebra;
- information theory;
- probability reasoning;
- Bloom filters;
- advanced neural architectures;
- generative AI/RL topics with stable IDs;
- latent diffusion pipeline;
- RAG;
- production ML depth;
- time-series forecasting;
- recommender systems.

### Remaining action

Run the aggregate semantic inventory and review only lessons still emitted as promotion candidates or `STRUCTURE_ONLY`.

Do not create questions merely to make every lesson generic. A focused topic test or legacy semantic contract remains valid protection when its semantic IDs are not ready for stable migration.

---

## A4 — Cross-topic synthesis contract

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentSynthesis.js`
- `unified-app/src/data/assessmentSynthesis.test.mjs`

Required stable synthesis IDs:

```text
synthesis.classification.decision-policy
synthesis.linear-algebra.decomposition-choice
synthesis.training.failure-localization
synthesis.attention.memory-vs-compute
synthesis.rag.failure-localization
synthesis.production-ml.failure-localization
```

Each family has explicit evidence spanning multiple lessons. Existing scenarios are reused and live evidence resolution fails when referenced evidence disappears.

---

## A5 — Canonical visualizer-state reuse

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentVisualizerStateAdapters.js`
- `unified-app/src/data/assessmentVisualizerStateAdapters.test.mjs`
- `unified-app/src/data/lessonAssessments.js`
- `unified-app/src/components/animation-shell/AssessmentVisualState.jsx`

Representative shared semantics:

1. Probability Distributions uses `distributionMoments` from the real distribution model.
2. Linear Regression uses `RESIDUAL_SCENARIOS` plus `diagnoseResidualPattern` from the real residual diagnostic lesson.
3. Classification Metrics uses `metricsFromCounts` from the real threshold/confusion model.

The live assessment assembly replaces representative authored visual payloads with canonical derived state. States are deterministic and JSON-serializable. Residual assessment rendering now plots the actual derived residual points. Existing compact fallback rendering remains available for lessons without adapters.

---

## A6 — Competency/coverage contract consolidation

**Status:** `PARTIAL`

Implemented shared plumbing:

- `defineScenarioCompetenciesFromRequirements(...)`
- nested and flat legacy requirement support;
- `competencyLessonIds(...)`;
- `legacyAssessmentCompetencySources.js`;
- global generic evidence validation for migrated families.

Most mature families with intentional stable depth IDs now use the shared adapter while retaining focused domain tests for their unique factual/calculation checks.

### Intentionally not auto-migrated

`coreRlAlgorithmsCoverage.js` and `modelReliabilityCoverage.js` currently contain human-readable competency prose rather than intentional stable semantic IDs. Generating IDs mechanically from that prose would make the registry brittle. They remain semantically protected by their focused legacy contracts until stable IDs are authored explicitly.

### Remaining action

- assign intentional stable IDs to prose-ID families when useful;
- remove only genuinely duplicated validation plumbing;
- retain family tests that check domain-specific calculations, misconceptions, ordering, or source integrity.

---

## A7 — Browser-level assessment smoke CI

**Status:** `DONE`

Implemented in:

- `unified-app/scripts/assessment-browser-smoke.mjs`
- `.github/workflows/assessment-browser-smoke.yml`
- `npm run test:assessment-browser`

Policy:

- nightly scheduled run;
- manual `workflow_dispatch`;
- not part of every normal push/PR quality run.

The smoke validates:

- representative assessment routes;
- visual-state rendering;
- answer selection and explanation rendering;
- 100-question quiz pagination;
- scenario pagination.

---

## A8 — Semantic near-duplicate audit

**Status:** `DONE` for the initial non-blocking phase

Implemented in:

- `unified-app/src/data/assessmentNearDuplicates.js`
- `unified-app/src/data/assessmentNearDuplicates.test.mjs`
- `unified-app/scripts/audit-assessment-near-duplicates.mjs`
- `npm run audit:assessment-duplicates`

The audit uses deterministic normalized-token Jaccard similarity within each lesson. Output includes lesson/question IDs, similarity, prompts, and an exact allowlist key. Findings are sorted deterministically.

CI runs the report with `continue-on-error: true`. This phase must remain non-blocking until the false-positive rate is reviewed.

---

## A9 — Documentation synchronization

**Status:** `DONE`

Documentation now uses three concepts consistently:

```text
DESIGN
IMPLEMENTED BASELINE
ACTIVE REMAINING WORK
```

- `ASSESSMENT_QUALITY_CONTRACT.md` is historical design plus implemented baseline.
- `ASSESSMENT_P0_COMPLETION.md` records the P0 baseline.
- `ASSESSMENT_P2_COMPLETION.md` records the P2 baseline.
- this file owns active remaining assessment work.

---

## Aggregate validation

Run together after the implementation batch:

```bash
cd unified-app
npm ci
npm test
npm run audit:assessment-semantic
npm run audit:assessment-duplicates
npm run audit:quality
npm run build
npx playwright install --with-deps chromium
npm run test:assessment-browser
```

Expected interpretation:

- semantic audit failures are blocking and should be fixed;
- near-duplicate findings are review candidates, not failures;
- browser smoke is intentionally outside the normal per-commit quality workflow;
- A3 should be closed only after remaining semantic-promotion candidates are reviewed;
- A6 should be closed only when remaining prose-ID legacy families receive intentional stable IDs or are explicitly retained as legacy contracts.
