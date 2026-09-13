# Assessment Remaining Plan

Status: **Active living plan — current roadmap closed**  
Last reviewed: **2026-09-13**

This is the source of truth for assessment work that remains after the large quality, coverage, semantic-protection, and priority reasoning-gap passes.

The default rule remains:

> Add a question or scenario only when a real reasoning, diagnostic, numerical, comparison, or visual-state gap exists. Otherwise protect strong existing evidence with a regression contract.

The last full aggregate validation recorded by this plan was run on `1d1ec806`. The latest priority reasoning-gap closure is implemented through `8433c8b3` and repository wiring was reviewed, but GitHub Actions had not started an aggregate workflow for that direct-main HEAD at the time of this update. Do not treat that latest batch as CI-validated until the aggregate suite runs successfully.

The remaining `STRUCTURE_ONLY` lessons are the non-priority Qwen Flash-Next drill family and are not A3 promotion work.

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
- Shared adapter for stable legacy depth contracts.
- Scheduled/manual browser-level assessment smoke coverage.
- Deterministic report-only near-duplicate audit.
- Priority reasoning-gap re-audit with duplicate-question avoidance and regression protection for the remaining real gaps.

## Roadmap

| ID | Priority | Workstream | Status | Current outcome |
|---|---|---|---|---|
| A1 | P0 | Generic semantic competency model | `DONE` | Shared stable competency/evidence schema |
| A2 | P0 | Repository-wide semantic coverage inventory | `DONE` | Deterministic classification + blocking priority-gap audit in CI |
| A3 | P0 | Protect strong-but-unprotected lessons | `DONE` | Major strong families promoted; remaining `STRUCTURE_ONLY` lessons are non-priority Qwen drills |
| A4 | P0 | Cross-topic synthesis contract | `DONE` | Six required synthesis families have explicit live evidence |
| A5 | P1 | Canonical visualizer-state reuse | `DONE` | Three representative assessments derive state from real lesson models |
| A6 | P1 | Competency/coverage contract consolidation | `DONE` | Stable legacy depth contracts use one shared adapter while focused domain tests remain |
| A7 | P1 | Browser-level assessment smoke CI | `DONE` | Nightly/manual Playwright smoke without normal-commit browser cost |
| A8 | P2 | Semantic near-duplicate audit | `DONE` | Deterministic report-only token-overlap audit with allowlisting |
| A9 | P2 | Documentation synchronization | `DONE` | Design/completion docs point back to this living plan |
| A10 | P1 | Remaining priority reasoning gaps | `DONE` | Ten genuine gaps added; already-covered topics deliberately left unchanged; focused regression contract added |

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

**Status:** `DONE`

Large parts of the original candidate list are now protected through the generic registry without adding assessment noise. Existing quiz/scenario evidence was reused for:

- classic NLP;
- numerical linear algebra;
- foundation models and frontier architecture overview;
- classical ML/statistics;
- neural-network and advanced-neural-architecture depth;
- NLP/transformer and advanced-inference depth;
- linear algebra, information theory, and probability reasoning;
- Bloom filters;
- generative AI/RL and core RL algorithms;
- latent diffusion pipeline;
- RAG;
- production ML and model reliability;
- frontier systems;
- time-series forecasting;
- recommender systems.

### Aggregate review

`npm run audit:assessment-semantic` on `1d1ec806` reported **0 priority semantic gaps**. Classification counts were 150 `COMPETENCY_PROTECTED`, 1 `TOPIC_TEST_PROTECTED` (`frontier-moe-systems`), 1 `LEGACY_COVERAGE_PROTECTED` (`tokenizer-bpe`), and 6 `STRUCTURE_ONLY`.

The only remaining promotion candidates are the non-priority Qwen Flash-Next chapters:

- `qwen-gated-residual`
- `qwen-hybrid-qsa`
- `qwen-multimodal-moe`
- `qwen-ngram-embedding`
- `qwen-reasoning-control`
- `qwen-training-recipe`

Each has six authored completion questions plus 94 generated numeric drills (`countsForCompletion: false`). They are not priority lessons and are not the same class of strong unprotected families as classic NLP, linear algebra, or production ML. Do not promote them to generic competencies just to empty the `STRUCTURE_ONLY` list.

A focused topic test or legacy semantic contract remains valid protection when it adds a genuinely domain-specific invariant.

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

**Status:** `DONE`

Implemented shared plumbing:

- `defineScenarioCompetenciesFromRequirements(...)`;
- nested and flat legacy requirement support;
- `competencyLessonIds(...)`;
- `legacyAssessmentCompetencySources.js`;
- global generic evidence validation for migrated families.

All mature depth-contract families now expose intentional stable IDs to the shared competency registry, including core RL algorithms and model reliability. Human-readable competency descriptions remain in their domain files for teaching and focused tests.

Focused family tests were deliberately retained when they add domain-specific checks such as numerical calculations, misconception wording, answer-position behavior, source registration, or scenario richness. Consolidation removes repeated generic identity/evidence plumbing without flattening valuable semantic tests.

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
- preview URLs must include the Vite GitHub Pages base path (`/Machine-Learning-Visualized`).

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

Documentation uses three concepts consistently:

```text
DESIGN
IMPLEMENTED BASELINE
ACTIVE REMAINING WORK
```

- `ASSESSMENT_QUALITY_CONTRACT.md` is historical design plus implemented baseline.
- `ASSESSMENT_P0_COMPLETION.md` records the P0 baseline.
- `ASSESSMENT_P2_COMPLETION.md` records the P2 baseline.
- this file owns active remaining assessment work and records closed follow-up passes so gaps are not accidentally reopened.

---

## A10 — Remaining priority reasoning gaps

**Status:** `DONE`

Implemented in:

- `unified-app/src/data/p1NextPriorityGapScenarioQuestions.js`
- `unified-app/src/data/remainingPriorityGapAssessment.test.mjs`

### Review rule

The September 13 pass re-audited the requested deep-learning, transformer/RAG, and reinforcement-learning gap list against current `main` before writing new scenarios. Existing strong coverage was treated as evidence, not as a reason to create duplicate questions.

The following areas were **not** expanded because the required reasoning was already represented strongly enough:

- Neural Network Fundamentals: XOR/nonlinearity, tensor shapes, parameter counting, and forward-pass reasoning.
- Initialization: symmetry breaking plus Xavier/He activation-aware initialization.
- Dropout + BatchNorm: training/evaluation mode, tiny-batch behavior, scaling/expectation, and ordering.
- RAG Vector Indexing: ANN recall/latency, restrictive filtering, metric mismatch, and freshness/maintenance.

### Genuine gaps closed

Ten independent competencies were added to the existing `p1-next-priority-gaps` source:

1. **Optimization** — objective/geometry versus optimizer/update-rule failure localization.
2. **Transformer** — worked parameter accounting across Q/K/V/O and FFN projections.
3. **Fine-tuning** — evaluation contamination when benchmark items or close variants enter SFT data.
4. **RAG Vector Indexing** — embedding-model migration and incompatibility between old and new vector spaces even when dimensions match.
5. **Attention Mechanism** — worked scaled dot-product attention score calculation before softmax.
6. **Self-Attention** — causal versus bidirectional masking chosen from the learning objective.
7. **Layer Normalization** — explicit LayerNorm versus RMSNorm calculation and semantic difference.
8. **Policy Gradients** — state baseline as variance reduction without changing the expected policy-gradient objective.
9. **Actor-Critic** — critic bias propagating into actor updates through incorrect advantage signs/magnitudes.
10. **RL Exploration** — maintaining/adapting exploration in nonstationary environments after an initially good policy becomes stale.

### Regression protection

`remainingPriorityGapAssessment.test.mjs` protects the batch by requiring:

- every named scenario to remain live through `getLessonAssessment(...)`;
- reasoning-level depth rather than recall-only questions;
- substantive scenario, prompt, explanation, and misconception text;
- exactly three unique choices;
- a stable related-comparison contract;
- stable defining-answer semantics;
- one independent competency per lesson;
- coverage of all three answer positions.

The scenarios reuse the already registered `p1-next-priority-gaps` source. No parallel assessment registry or new assembly mechanism was introduced.

### Validation state

Repository-level review confirmed that the central assessment extension registry already consumes `P1_NEXT_PRIORITY_GAP_SCENARIOS_BY_LESSON`, and the final diff from the pre-pass base contains only the scenario-source change plus its focused regression test before this documentation update.

GitHub Actions had not started a workflow for direct-main HEAD `8433c8b3` when this plan was updated. The implementation is therefore marked `DONE` because the code and contract exist, but full aggregate validation remains pending execution of the commands below on the latest HEAD.

---

## Aggregate validation

Run together after an implementation batch:

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
- A3 is closed: remaining `STRUCTURE_ONLY` candidates were reviewed and left as non-priority Qwen drills;
- A10 is closed at the implementation/contract level; do not claim the latest direct-main batch is aggregate-CI validated until these checks run successfully against the latest HEAD.
