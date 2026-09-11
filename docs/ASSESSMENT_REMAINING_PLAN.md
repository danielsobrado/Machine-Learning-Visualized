# Assessment Remaining Plan

Status: **Active living plan**  
Baseline reviewed: `main` at `87e226dcef6690adddbfb453faf7ac0402ab76e3`  
Last reviewed: **2026-09-11**

This document tracks what is still missing after the large assessment-quality and coverage passes.

The repository no longer needs broad question-count expansion. The default rule for every item below is:

> Add a question or scenario only when a real reasoning, diagnostic, numerical, comparison, or visual-state gap exists. Otherwise protect existing strong evidence with a regression contract.

## Status values

| Status | Meaning |
|---|---|
| `TODO` | Confirmed remaining work; not yet implemented |
| `PARTIAL` | Useful implementation exists, but the target architecture or coverage is incomplete |
| `IN PROGRESS` | Actively being implemented |
| `BLOCKED` | Cannot proceed until a dependency is resolved |
| `DONE` | Acceptance criteria are implemented and protected by tests |
| `DEFERRED` | Intentionally postponed; not required for the current quality target |

## Current baseline — do not reopen without evidence

These areas are already implemented and should not be treated as missing work:

| Area | Status | Evidence |
|---|---|---|
| Shared 100-question assessment quality contract | `DONE` | `assessmentQuality.js`, `assessmentQualityManifest.js`, `assessmentQuality.test.mjs` |
| Curated Probability Distributions assessment | `DONE` | `probabilityDistributionsAssessment.js` and focused tests |
| Visual-state assessment support | `DONE` | `kind: 'visual-state'`, `AssessmentVisualState`, visual-state scenarios and integration tests |
| Cross-topic comparison scenarios | `DONE` | Existing decomposition, attention, metrics, RAG, optimization and monitoring comparison scenarios |
| Central scenario-extension registry | `DONE` | `assessmentScenarioExtensions.js` and integrity tests |
| P0/P1/P2 scenario hardening | `DONE` | Priority scenario banks and coverage tests |
| Scenario answer-position diversification | `DONE` | Deterministic rotation in the public assessment registry |
| Scenario pagination | `DONE` | Four-scenario pages in the assessment UI |
| Lean CI quality gate | `DONE` | Unit tests, curriculum audit and production build in `.github/workflows/unified-app-quality.yml` |
| Core mechanics semantic protection | `DONE` for audited lessons | `coreModelMechanicsCoverage.js` and tests |
| Production ML semantic protection | `DONE` for audited lessons | `productionMlSystemsCoverage.js` and tests |

## Remaining roadmap

| ID | Priority | Workstream | Status | Main outcome |
|---|---|---|---|---|
| A1 | P0 | Generic semantic competency model | `PARTIAL` | Competencies become first-class stable metadata rather than domain-specific mappings to numeric question IDs |
| A2 | P0 | Repository-wide semantic coverage inventory | `TODO` | Every priority and dedicated assessment has an explicit semantic-protection status |
| A3 | P0 | Protect strong-but-unprotected lessons | `TODO` | High-quality lessons receive regression contracts without unnecessary question additions |
| A4 | P0 | Cross-topic synthesis contract | `PARTIAL` | Important curriculum families have explicit synthesis requirements, not only isolated comparison scenarios |
| A5 | P1 | Canonical visualizer-state reuse | `PARTIAL` | Assessment visual states reuse the same state semantics as the real lesson visualizers where practical |
| A6 | P1 | Competency/coverage contract consolidation | `PARTIAL` | Repeated domain-specific plumbing is replaced by shared validation while semantic requirements stay explicit |
| A7 | P1 | Browser-level assessment smoke CI | `TODO` | Playwright route/UI smoke coverage runs on a cost-appropriate schedule or manual gate |
| A8 | P2 | Semantic near-duplicate audit | `TODO` | Repetitive questions are reported even when exact-string duplicate checks do not catch them |
| A9 | P2 | Documentation synchronization | `TODO` | Design/completion docs reflect the current implemented state and link back to this plan |

---

## A1 — Generic semantic competency model

**Priority:** P0  
**Status:** `PARTIAL`

### Current state

The repository now has useful semantic contracts such as:

- `coreModelMechanicsCoverage.js`
- `productionMlSystemsCoverage.js`
- other topic/family `*Coverage.js` registries

These prove that specific competencies retain quiz evidence. This is a major improvement over question-count-only validation.

The remaining weakness is that the semantic contract is still repeated across domain-specific files and frequently couples a competency directly to a list of concrete quiz IDs.

### Target

Create one generic competency representation and validator.

A minimal model should support:

```js
{
  id: 'monitoring.concept-drift.diagnosis',
  lessonId: 'model-monitoring',
  evidence: [
    { type: 'quiz', id: 'mon-053-concept-case' },
    { type: 'scenario', id: 'monitoring-drift-types' },
  ],
}
```

Question/scenario objects may optionally expose semantic metadata directly when that reduces indirection, for example:

```js
{
  id: 'mon-053-concept-case',
  competencyIds: ['monitoring.concept-drift.diagnosis'],
}
```

Do not require every question to have a competency ID. Only evidence that protects an important learning outcome needs semantic tagging.

### Acceptance criteria

- [ ] One shared competency schema exists.
- [ ] One shared validator checks competency IDs, lesson IDs and evidence references.
- [ ] Competency IDs are globally unique and stable.
- [ ] Evidence may point to quiz questions and scenarios.
- [ ] Missing or renamed evidence fails CI.
- [ ] A question may be replaced without changing the competency ID.
- [ ] At least the existing core-mechanics and production-ML contracts use the generic mechanism.
- [ ] No semantic protection is weakened during migration.

---

## A2 — Repository-wide semantic coverage inventory

**Priority:** P0  
**Status:** `TODO`

### Problem

The shared quality contract proves structural quality for priority assessments, but it does not by itself prove that every strong assessment has explicit semantic regression protection.

The repository now contains many dedicated `*Assessment.js` modules. Some have rich topic-specific tests or coverage contracts; others may only be protected structurally.

### Target

Add an audit that classifies every dedicated assessment as one of:

```text
SEMANTICALLY_PROTECTED
TOPIC_TEST_PROTECTED
STRUCTURE_ONLY
INTENTIONALLY_NON_PRIORITY
LEGACY_OR_INCOMPLETE
```

The audit should produce a deterministic report from source data rather than requiring manual counting.

### First audit candidates

Start with dedicated lessons that are not obviously represented in the current priority manifest, especially:

- classic NLP: `bag-of-words`, `word2vec`, `glove`, `fasttext`;
- foundation-model architecture overview lessons;
- additional attention/serving/architecture lessons with dedicated assessments but no explicit curriculum-family contract;
- any dedicated assessment imported by `lessonAssessmentsBase.js` but absent from `PRIORITY_ASSESSMENT_LESSON_IDS`.

The audit decides whether they need promotion. Do not promote a lesson merely because a file exists.

### Acceptance criteria

- [ ] All dedicated assessment modules are discoverable by the audit.
- [ ] Every dedicated assessment gets one explicit protection classification.
- [ ] Priority lessons cannot be `STRUCTURE_ONLY`.
- [ ] The audit exits non-zero when a priority lesson loses semantic protection.
- [ ] The audit can emit a concise Markdown or JSON summary for future reviews.
- [ ] CI runs the semantic coverage audit.

---

## A3 — Protect strong-but-unprotected lessons

**Priority:** P0  
**Status:** `TODO`

### Rule

Use the A2 inventory as the source of truth.

For each lesson reported as high-quality but semantically under-protected:

1. inspect the existing 100-question assessment;
2. identify the small set of competencies that must not regress;
3. reuse existing questions/scenarios as evidence whenever they are already strong;
4. add new scenarios only for genuine reasoning gaps;
5. register the competencies in the generic A1 framework.

### Priority order

Use this order unless the inventory finds a more serious gap:

1. classic NLP fundamentals;
2. foundational transformer / foundation-model architecture lessons;
3. remaining numerical linear-algebra lessons not already protected semantically;
4. remaining neural-network training mechanics;
5. remaining production/serving architecture topics.

### Acceptance criteria

- [ ] No high-value priority assessment remains `STRUCTURE_ONLY`.
- [ ] Existing strong questions are protected rather than duplicated.
- [ ] New scenarios are added only when a documented reasoning gap exists.
- [ ] Every added semantic requirement has at least one stable evidence item.
- [ ] Each migrated lesson passes the shared 100-question quality contract unchanged.

---

## A4 — Cross-topic synthesis contract

**Priority:** P0  
**Status:** `PARTIAL`

### Current state

Cross-topic comparison scenarios already exist for several important areas. That work is complete at the scenario level.

What is still missing is a centralized curriculum-level contract proving that the important **families of related concepts** retain synthesis coverage over time.

### Target synthesis families

At minimum, protect these families:

| Family | Required synthesis |
|---|---|
| Classification decisions | precision/recall, ROC/PR, calibration, thresholds and asymmetric cost |
| Numerical linear algebra | QR, SVD, pseudoinverse, least squares, rank and PCA choice |
| Training dynamics | initialization, activation, normalization, optimizer, learning rate and gradient pathologies |
| Attention architectures | MHA/GQA/MQA-style trade-offs, FlashAttention, sparse attention, KV memory and compute |
| RAG pipeline | chunking, embedding/indexing, retrieval, reranking, grounding and generation failure localization |
| Production ML | leakage, train/serve skew, drift, monitoring, slice failure and debugging action |

### Suggested metadata

Use stable synthesis IDs such as:

```text
synthesis.classification.decision-policy
synthesis.linear-algebra.decomposition-choice
synthesis.training.failure-localization
synthesis.attention.memory-vs-compute
synthesis.rag.failure-localization
synthesis.production-ml.failure-localization
```

A synthesis requirement may be satisfied by an existing scenario. Do not require a new question when adequate evidence already exists.

### Acceptance criteria

- [ ] A centralized synthesis manifest exists.
- [ ] Every required synthesis ID has explicit evidence.
- [ ] Evidence may span more than one lesson.
- [ ] Existing comparison scenarios are reused where sufficient.
- [ ] CI fails if a required synthesis family loses all evidence.
- [ ] No family is considered protected solely because its individual lessons each have 100 questions.

---

## A5 — Canonical visualizer-state reuse

**Priority:** P1  
**Status:** `PARTIAL`

### Current state

Visual-state assessment questions are already implemented and are not missing.

The next improvement is to reduce semantic duplication between:

- the state used by an interactive lesson/animation; and
- the state rendered by an assessment visual-state question.

### Target

Where a lesson exposes deterministic visualizer parameters, define a small adapter or canonical state schema that both the lesson visualizer and assessment can understand.

Examples:

```text
linear regression -> data points, fitted coefficients, residual state
classification -> threshold, scores, confusion counts
optimization -> position, gradient, learning rate, trajectory
PCA -> points, selected components, projected coordinates
attention -> token matrix, mask/head state, selected query/key relationships
```

Do not force a universal rendering engine. Keep lesson-specific renderers where they are clearer.

### Acceptance criteria

- [ ] A canonical state-adapter interface is documented.
- [ ] At least three representative visual lessons reuse real lesson-state semantics in assessment mode.
- [ ] Assessment visual states remain deterministic and serializable.
- [ ] Tests verify state adapters rather than only JSX wiring.
- [ ] Existing compact visual-state rendering continues to work for lessons without reusable visualizer state.

---

## A6 — Competency/coverage contract consolidation

**Priority:** P1  
**Status:** `PARTIAL`

### Problem

The repository has accumulated many useful domain-specific `*Coverage.js` and `*Coverage.test.mjs` files. The semantic checks are valuable, but the repeated registry/test plumbing will become expensive to maintain.

### Target

After A1 is stable:

- keep domain-specific semantic data where that improves readability;
- move generic uniqueness, source, evidence-reference and completeness validation into shared helpers;
- remove duplicate `competency()` helper implementations;
- avoid one custom test harness per curriculum family when the behavior is identical;
- preserve focused topic tests for factual ordering and misconceptions.

### Acceptance criteria

- [ ] Shared generic competency validation owns repeated mechanics.
- [ ] Domain files contain semantic declarations, not repeated validator code.
- [ ] Existing coverage tests either migrate cleanly or remain only when they add unique checks.
- [ ] No reduction in protected competency count occurs during consolidation.
- [ ] Test failure messages still identify lesson, competency and missing evidence clearly.

---

## A7 — Browser-level assessment smoke CI

**Priority:** P1  
**Status:** `TODO`

### Current state

The lean GitHub Actions gate intentionally runs:

```bash
npm test
npm run audit:quality
npm run build
```

The Playwright route smoke suite is intentionally outside that gate because browser installation is more expensive.

### Target

Run browser-level smoke coverage using a cost-appropriate policy, for example:

- scheduled nightly workflow;
- manual `workflow_dispatch`;
- optional PR label or path-triggered workflow for assessment/UI changes.

The smoke suite should verify representative routes and assessment interactions rather than duplicate unit tests.

### Acceptance criteria

- [ ] Browser smoke has a documented workflow trigger policy.
- [ ] Representative assessment routes load successfully.
- [ ] Quiz pagination works.
- [ ] Scenario pagination works.
- [ ] A visual-state scenario renders.
- [ ] Answer selection/explanation behavior works.
- [ ] Normal commits do not pay unnecessary browser setup cost unless configured to do so.

---

## A8 — Semantic near-duplicate audit

**Priority:** P2  
**Status:** `TODO`

### Current state

Exact normalized duplicate prompts and several answer-leakage cases are already rejected.

The remaining gap is near-duplicate question noise: two questions can ask essentially the same thing with different nouns or numbers and still pass exact-string checks.

### Target

Add a deterministic audit report for likely near-duplicates.

Prefer an explainable, reproducible heuristic such as normalized token overlap / n-gram similarity over a network model or nondeterministic LLM call in CI.

Initially report suspected pairs without failing CI. Promote only high-confidence deterministic cases to failures after the false-positive rate is understood.

### Acceptance criteria

- [ ] The audit reports likely near-duplicate prompt pairs with lesson and question IDs.
- [ ] Output is deterministic.
- [ ] The first version is non-blocking.
- [ ] Known legitimate repeated terminology can be allowlisted narrowly.
- [ ] High-confidence duplication rules may later become blocking without changing authored assessment data.

---

## A9 — Documentation synchronization

**Priority:** P2  
**Status:** `TODO`

### Problem

The implementation has advanced faster than some design documents.

For example, `ASSESSMENT_QUALITY_CONTRACT.md` still describes itself as a P0 design contract and contains unchecked acceptance criteria even though the corresponding P0 completion document records the implementation as complete.

### Target

Keep design history, but clearly separate:

```text
DESIGN
IMPLEMENTED BASELINE
ACTIVE REMAINING WORK
```

This file should remain the source of truth for active remaining work.

### Acceptance criteria

- [ ] `ASSESSMENT_QUALITY_CONTRACT.md` links to the implemented completion record and this plan.
- [ ] Completed acceptance criteria are marked as implemented or explicitly retained as historical design text.
- [ ] `ASSESSMENT_P0_COMPLETION.md` and `ASSESSMENT_P2_COMPLETION.md` link to this plan for post-completion work.
- [ ] No completed feature is listed as an active gap in more than one document.

---

## Recommended execution order

```text
A1  Generic semantic competency model
 ↓
A2  Repository-wide semantic inventory
 ↓
A3  Protect strong-but-unprotected lessons
 ↓
A4  Cross-topic synthesis contract
 ↓
A5  Canonical visualizer-state reuse
 ↓
A6  Consolidate competency/coverage plumbing
 ↓
A7  Browser smoke CI
 ↓
A8  Near-duplicate audit
 ↓
A9  Documentation synchronization
```

A1-A4 are the highest-value work because they improve the **meaning and durability** of the assessment system rather than increasing question volume.

## Update protocol

When completing work from this plan:

1. change the workstream status in the roadmap table;
2. check acceptance criteria only when they are protected by tests or deterministic audit output;
3. add the implementing commit SHA under the workstream;
4. if new work is discovered, add a new stable ID rather than rewriting historical items;
5. when a workstream reaches `DONE`, keep it in this file until the entire plan is complete;
6. never mark an item `DONE` based only on a manual inspection when a regression test can reasonably protect it.

## Overall completion definition

This plan is complete when:

- [ ] every priority lesson has structural and semantic regression protection;
- [ ] every dedicated assessment has an explicit protection classification;
- [ ] high-value cross-topic synthesis families have stable evidence contracts;
- [ ] visual-state assessments reuse real lesson-state semantics where doing so is practical;
- [ ] competency validation is generic enough that adding a new protected lesson does not require a new test harness;
- [ ] browser-level assessment behavior has periodic smoke coverage;
- [ ] near-duplicate question noise is auditable;
- [ ] assessment documentation accurately separates completed baseline from active work.
