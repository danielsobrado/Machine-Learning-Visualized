# Assessment P0 Completion

Status: **Implemented in `main`**

This document records the implementation corresponding to the P0 items identified in the assessment gap review.

## P0 status

| P0 | Status | Implementation |
|---|---|---|
| Common assessment-quality contract | Done | `assessmentQuality.js`, `assessmentQualityManifest.js`, `assessmentQuality.test.mjs`, `assessmentP0Coverage.test.mjs` |
| Probability Distributions curated assessment | Done | `probabilityDistributionsAssessment.js` plus focused semantic test |
| Visual-state assessment questions | Done | Structured `kind: 'visual-state'` scenarios rendered by `AssessmentVisualState.jsx` |
| Cross-topic comparison questions | Done | Comparison scenarios for attention families, decompositions, metrics, RAG, and optimization |
| Promote Debugging / Monitoring / Interpretability | Done | Added to shared priority assessment validation |
| Strengthen leakage / forecasting / RAG / security / data-engineering coverage | Done | P0 scenario bank plus coverage manifest/test |
| A/B testing peeking / alpha spending | Done | `p0ExperimentationScenarioQuestions.js` plus P0 coverage enforcement |

## Shared contract

The common contract enforces the repository-wide structural baseline for every priority assessment:

- curated source only;
- exactly 100 questions;
- stable ordered lesson-prefixed IDs;
- exact `20 / 30 / 25 / 15 / 10` progression;
- `Foundation -> Mechanism -> Application -> Tricky -> Interview` ordering;
- substantive prompts and explanations;
- exactly three distinct choices;
- valid answer indexes;
- unique normalized prompts;
- globally balanced correct-answer positions;
- balanced correct-answer positions on every visible 10-question page;
- no repeated exact correct answers on a visible page;
- no exact substantial answer leakage into neighboring prompts or choices.

Generic structural logic lives in `unified-app/src/data/assessmentQuality.js`. Topic-specific semantic tests remain responsible for factual milestones, misconception wording, diagnostics, and lesson-specific labs.

## Assessment source metadata

`lessonAssessments.js` exposes an explicit assessment source:

```text
curated
fallback
empty
```

A priority lesson must resolve to `curated` or the shared contract fails.

The original registry implementation remains in `lessonAssessmentsBase.js`. The public `lessonAssessments.js` module applies curated overrides, source metadata, deterministic scenario choice rotation, and scenario extensions through the centralized `assessmentScenarioExtensions.js` registry.

## Probability Distributions

`probability-distributions` has a dedicated 100-question bank with the canonical bands:

```text
1-20   Foundation
21-50  Mechanism
51-75  Application
76-90  Tricky
91-100 Interview
```

Coverage includes discrete and continuous distributions, PMF/PDF/CDF, expectation and variance, Bernoulli/binomial/categorical, normal/Poisson/exponential, transformations, joint/marginal/conditional probability, IID, LLN/CLT, entropy, likelihood links, model selection, distribution shift, tails, diagnostics, misconceptions, and production reasoning.

`probabilityDistributionsAssessment.test.mjs` verifies ordered semantic milestones, late misconception placement, and visual diagnostic scenarios.

## Visual-state questions

Assessment scenarios may carry:

```js
{
  kind: 'visual-state',
  visualState: {
    // deterministic lesson-state values
  },
}
```

`AssessmentPanel.jsx` sends this metadata to `AssessmentVisualState.jsx`, which renders a compact visual state before the scenario text. Text remains present as an accessible explanation of the state rather than being the only representation.

Current visual-state coverage includes examples such as:

- probability distributions;
- linear-regression residual diagnostics;
- classification threshold trade-offs;
- time-series horizon error;
- RAG context dilution;
- data-engineering train/serve skew;
- k-means geometry;
- optimization diagnostics;
- neural-network activation states;
- systems-performance comparisons.

`assessmentVisualState.test.mjs` verifies the renderer remains wired into the assessment panel.

## Cross-topic comparisons

The comparison scenarios explicitly test distinctions that should not be learned as isolated vocabulary:

- MHA/GQA/FlashAttention/sparse-attention behavior;
- QR versus SVD decomposition choice;
- precision/recall threshold trade-offs;
- MAE versus RMSE and quantile loss;
- Recall@k/MRR/nDCG and retrieval versus generation failure;
- gradient-descent conditioning versus optimizer behavior;
- robustness versus security;
- drift-type distinctions in monitoring.

`relatedComparison` is the stable metadata field used for comparison coverage.

## Production-priority lessons

These lessons are part of the same priority validation set as the existing core assessments:

- `model-debugging`
- `model-monitoring`
- `model-interpretability`
- `probability-distributions`

They must satisfy the full 100-question contract and resolve to curated source.

## P0 scenario coverage

The coverage manifest and tests require the identified gaps explicitly rather than relying on manual memory.

Required scenarios cover:

- point-in-time leakage;
- target-encoding leakage;
- temporal validation;
- MAE/RMSE trade-offs;
- MAPE near-zero failure;
- pinball loss / quantile forecasts;
- horizon-specific forecast evaluation;
- Recall@k;
- MRR;
- nDCG;
- retrieval versus generation attribution;
- RAG missing-evidence versus unused-evidence failures;
- context dilution;
- indirect prompt injection;
- retrieval poisoning;
- robustness versus security;
- point-in-time feature joins;
- split-aware target-derived feature materialization;
- semantic train/serve skew;
- repeated A/B test peeking and sequential error control.

## Scenario extension integrity

P0, P1, and P2 scenario additions now share `assessmentScenarioExtensions.js` as their single source registry.

The integrity test rejects:

- duplicate source IDs;
- duplicate scenario IDs;
- duplicate normalized extension prompts;
- exact prompt duplication against existing base scenarios;
- scenario IDs colliding with core quiz IDs;
- orphaned extension questions not merged into the public registry;
- malformed visual states;
- strongly dominant correct-answer positions.

This prevents scenario additions from bypassing the same quality discipline as the core question banks.

## Verification

The repository now has a GitHub Actions quality gate at:

`.github/workflows/unified-app-quality.yml`

For relevant pushes to `main` and pull requests it runs:

```bash
cd unified-app
npm ci
npm test
npm run audit:quality
npm run build
```

A green workflow run is the authoritative runtime verification for the current head commit. Assessment failures should be fixed rather than bypassed with exceptions.
