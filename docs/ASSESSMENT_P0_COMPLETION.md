# Assessment P0 Completion

Status: **Implemented in `main`**

This document records the implementation corresponding to the P0 items identified in the assessment gap review.

## P0 status

| P0 | Status | Implementation |
|---|---|---|
| Common assessment-quality contract | Done | `assessmentQuality.js`, `assessmentQualityManifest.js`, `assessmentQuality.test.mjs`, `assessmentP0Coverage.test.mjs` |
| Probability Distributions curated assessment | Done | `probabilityDistributionsAssessment.js` plus focused semantic test |
| Visual-state assessment questions | Done | Structured `kind: 'visual-state'` scenarios with deterministic `visualState` metadata |
| Cross-topic comparison questions | Done | Comparison scenarios for attention families, decompositions, metrics, RAG, and optimization |
| Promote Debugging / Monitoring / Interpretability | Done | Added to shared priority assessment validation |
| Strengthen leakage / forecasting / RAG / security / data-engineering coverage | Done | P0 scenario bank plus coverage manifest/test |

## Shared contract

The common contract now enforces the repository-wide structural baseline for every priority assessment:

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

`lessonAssessments.js` now exposes an explicit assessment source:

```text
curated
fallback
empty
```

A priority lesson must resolve to `curated` or the shared contract fails.

The original registry implementation is preserved unchanged in `lessonAssessmentsBase.js`. The public `lessonAssessments.js` module is a compatibility layer that applies curated overrides, P0 scenario additions, source metadata, and the expanded priority list without duplicating the legacy registry body.

## Probability Distributions

`probability-distributions` now has a dedicated 100-question bank with the canonical bands:

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

P0 scenarios may carry:

```js
{
  kind: 'visual-state',
  visualState: {
    // deterministic lesson-state values
  },
}
```

The scenario text also describes the state so it is usable by the current assessment panel. The metadata gives future UI work a stable structured representation rather than requiring question text parsing.

Current P0 visual-state coverage includes:

- probability distributions;
- linear-regression residual diagnostics;
- classification threshold trade-offs;
- time-series horizon error;
- RAG context dilution;
- data-engineering train/serve skew.

## Cross-topic comparisons

The P0 comparison scenarios explicitly test distinctions that should not be learned as isolated vocabulary:

- MHA/GQA/FlashAttention/sparse-attention behavior;
- QR versus SVD decomposition choice;
- precision/recall threshold trade-offs;
- MAE versus RMSE and quantile loss;
- Recall@k/MRR/nDCG and retrieval versus generation failure;
- gradient-descent conditioning versus optimizer behavior;
- robustness versus security;
- drift-type distinctions in monitoring.

`relatedComparison` is the stable metadata field used by the coverage test.

## Production-priority lessons

These lessons are now part of the same priority validation set as the existing core assessments:

- `model-debugging`
- `model-monitoring`
- `model-interpretability`
- `probability-distributions`

They must satisfy the full 100-question contract and resolve to curated source.

## P0 scenario coverage

The coverage manifest and test now require the identified gaps explicitly rather than relying on manual memory.

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
- semantic train/serve skew.

## Verification

The repository has no CI status attached to the implementation commit, and the available environment cannot execute the repository checkout.

Required local verification remains:

```bash
cd unified-app
npm test
npm run audit:quality
npm run build
```

Any failure from those commands should be treated as a release blocker for this P0 rather than bypassed with test exceptions.
