# Assessment Remaining Plan

Status: **Roadmap closed — local validation is authoritative**  
Last reviewed: **2026-09-14**

This is the source of truth for assessment follow-up work after the quality, coverage, semantic-protection, visual-state, synthesis, and priority reasoning-gap passes.

The default rule remains:

> Add a question or scenario only when a real reasoning, diagnostic, numerical, comparison, or visual-state gap exists. Otherwise protect strong existing evidence with a regression contract.

## Validation authority

Assessment roadmap validation is **local-only**.

- GitHub Actions may run equivalent checks as optional automation, but CI status is not evidence that this roadmap is validated.
- A commit is aggregate-validated only when `npm run validate:assessment-local` prints `PASS <sha>` from a clean local checkout of that exact SHA.
- The validator refuses a dirty worktree so results cannot be confused with uncommitted changes.
- The validated SHA is intentionally not copied into this plan. Static SHA records become stale as soon as `main` moves; the validator output is the authority.
- Install dependencies and the Playwright browser before the first local run.

Canonical local validation:

```bash
cd unified-app
npm ci
npx playwright install --with-deps chromium
npm run validate:assessment-local
```

`validate:assessment-local` runs, in order:

1. unit and assessment contract tests;
2. semantic coverage audit;
3. near-duplicate report;
4. lesson quality audit;
5. production build;
6. browser-level assessment smoke.

A semantic, quality, build, test, or browser-smoke failure is blocking. Near-duplicate findings remain review candidates rather than automatic failures.

## Status values

| Status | Meaning |
|---|---|
| `TODO` | Confirmed work not yet implemented |
| `PARTIAL` | Useful implementation exists, but consolidation is intentionally incomplete |
| `IN PROGRESS` | Implementation exists and the remaining candidate set still needs review |
| `BLOCKED` | Cannot proceed until a dependency is resolved |
| `DONE` | Acceptance criteria are represented in code and protected by tests/contracts |
| `DEFERRED` | Intentionally postponed |

## Roadmap

| ID | Priority | Workstream | Status | Current outcome |
|---|---|---|---|---|
| A1 | P0 | Generic semantic competency model | `DONE` | Shared stable competency/evidence schema |
| A2 | P0 | Repository-wide semantic coverage inventory | `DONE` | Deterministic classification + blocking priority-gap audit included in local validation |
| A3 | P0 | Protect strong-but-unprotected lessons | `DONE` | Major strong families protected; remaining `STRUCTURE_ONLY` lessons are non-priority Qwen drills |
| A4 | P0 | Cross-topic synthesis contract | `DONE` | Six required synthesis families have explicit live evidence |
| A5 | P1 | Canonical visualizer-state reuse | `DONE` | Representative assessments derive state from real lesson models |
| A6 | P1 | Competency/coverage contract consolidation | `DONE` | Stable legacy depth contracts share common plumbing while focused domain tests remain |
| A7 | P1 | Browser-level assessment smoke validation | `DONE` | Playwright smoke is part of the canonical local aggregate suite; any workflow is optional automation |
| A8 | P2 | Semantic near-duplicate audit | `DONE` | Deterministic report-only token-overlap audit with allowlisting |
| A9 | P2 | Documentation synchronization | `DONE` | Design/completion docs point back to this living plan |
| A10 | P1 | Remaining priority reasoning gaps | `DONE` | Ten genuine gaps added; already-covered topics deliberately left unchanged; regression contract added |
| A11 | P0 | Canonical local aggregate validator | `DONE` | One clean-worktree command runs the complete assessment validation suite and prints the exact SHA |

## Implemented baseline — do not reopen without evidence

- Shared 100-question assessment quality contract.
- Curated priority assessment manifests and focused topic tests.
- Visual-state assessment questions and compact renderer.
- Central scenario-extension registry.
- P0/P1/P2 scenario hardening.
- Deterministic scenario answer-position rotation and scenario pagination.
- Generic semantic competency schema and evidence validation.
- Repository-wide semantic coverage audit.
- Cross-topic synthesis contract.
- Canonical visualizer-state reuse for representative lessons.
- Shared adapter for stable legacy depth contracts.
- Browser-level assessment smoke.
- Deterministic report-only near-duplicate audit.
- Priority reasoning-gap re-audit with duplicate-question avoidance and regression protection.
- Canonical local aggregate validation command.

## A1 — Generic semantic competency model

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentCompetencies.js`
- `unified-app/src/data/assessmentCompetencyRegistry.js`
- `unified-app/src/data/assessmentCompetencies.test.mjs`

Competencies use stable semantic IDs, lesson IDs, and explicit quiz/scenario evidence. Global validation checks identity, completeness, uniqueness, and live evidence resolution.

## A2 — Repository-wide semantic coverage inventory

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentSemanticCoverage.js`
- `unified-app/scripts/audit-assessment-semantic-coverage.mjs`
- `unified-app/src/data/assessmentSemanticCoverage.test.mjs`

The audit classifies assessment protection deterministically and treats a priority lesson without recognized semantic protection as a blocking error. Local aggregate validation runs this audit directly.

## A3 — Protect strong-but-unprotected lessons

**Status:** `DONE`

Strong families across classic NLP, numerical linear algebra, classical ML/statistics, neural networks, transformer/inference topics, generative AI/RL, RAG, production ML, time series, recommender systems, and frontier systems are protected through generic or focused semantic contracts.

The remaining `STRUCTURE_ONLY` lessons are non-priority Qwen Flash-Next drill chapters and are intentionally not promoted merely to empty the classification bucket.

## A4 — Cross-topic synthesis contract

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentSynthesis.js`
- `unified-app/src/data/assessmentSynthesis.test.mjs`

Required synthesis families cover classification decision policy, linear-algebra decomposition choice, training failure localization, attention memory-vs-compute, RAG failure localization, and production-ML failure localization.

## A5 — Canonical visualizer-state reuse

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/assessmentVisualizerStateAdapters.js`
- `unified-app/src/data/assessmentVisualizerStateAdapters.test.mjs`
- `unified-app/src/data/lessonAssessments.js`
- `unified-app/src/components/animation-shell/AssessmentVisualState.jsx`

Representative assessments derive deterministic JSON-serializable state from real lesson models rather than maintaining parallel assessment-only semantics.

## A6 — Competency/coverage contract consolidation

**Status:** `DONE`

Generic identity/evidence plumbing is shared. Focused family tests remain where they protect domain-specific calculations, misconception wording, answer-position behavior, registration, or scenario richness.

## A7 — Browser-level assessment smoke validation

**Status:** `DONE`

Implemented in:

- `unified-app/scripts/assessment-browser-smoke.mjs`
- `npm run test:assessment-browser`

The smoke covers representative assessment routes, visual-state rendering, answer selection and explanation rendering, 100-question pagination, and scenario pagination.

The smoke is part of `npm run validate:assessment-local`. A GitHub workflow may also run it, but workflow state is not used to declare roadmap validation.

## A8 — Semantic near-duplicate audit

**Status:** `DONE` for the initial non-blocking phase

Implemented in:

- `unified-app/src/data/assessmentNearDuplicates.js`
- `unified-app/src/data/assessmentNearDuplicates.test.mjs`
- `unified-app/scripts/audit-assessment-near-duplicates.mjs`
- `npm run audit:assessment-duplicates`

The report uses deterministic normalized-token similarity and an explicit allowlist. Findings remain review candidates until false-positive behavior justifies a stricter policy.

## A9 — Documentation synchronization

**Status:** `DONE`

Documentation separates design, implemented baseline, and active remaining work. This file owns current roadmap status and validation policy.

## A10 — Remaining priority reasoning gaps

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/p1NextPriorityGapScenarioQuestions.js`
- `unified-app/src/data/remainingPriorityGapAssessment.test.mjs`

The final reasoning-gap pass added only genuine missing competencies and deliberately avoided duplicate questions where current coverage was already strong. The regression contract keeps those scenarios live and substantive.

## A11 — Canonical local aggregate validator

**Status:** `DONE`

Implemented in:

- `unified-app/scripts/validate-assessment-local.mjs`
- `npm run validate:assessment-local`

Acceptance criteria:

- requires a clean Git worktree before validation;
- resolves and prints the exact `HEAD` SHA;
- stops on the first blocking failure;
- runs tests, semantic audit, duplicate audit, quality audit, build, and browser smoke;
- prints `PASS <sha>` only after every blocking step succeeds;
- does not inspect or depend on GitHub Actions state.

## Reopening rule

Do not reopen a closed roadmap item because a topic changed or because `main` advanced. Reopen only when there is concrete evidence that an acceptance criterion no longer holds or a new reasoning/diagnostic gap has been identified.
