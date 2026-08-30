# Assessment P2 Cleanup

Status: **Implemented in `main`**

This phase polishes the assessment system after the P0 quality floor and P1 coverage expansion. The goal is to keep assessment depth high without allowing the scenario layer, registry wiring, or learner UI to become difficult to maintain.

## P2 scope

| Area | Status | Implementation |
|---|---|---|
| Remaining low-priority topic gaps | Done | `p2ScenarioQuestions.js` |
| Central scenario-extension registry | Done | `assessmentScenarioExtensions.js` |
| Extension integrity and deduplication | Done | `assessmentScenarioExtensions.test.mjs` |
| Explicit P2 coverage guard | Done | `assessmentP2Coverage.test.mjs` |
| Scenario answer-position bias | Done | Deterministic choice rotation in `lessonAssessments.js` |
| Scenario-deck size in UI | Done | Four-scenario pagination in `AssessmentPanel.jsx` |
| Visual-state rendering | Preserved | `AssessmentVisualState.jsx` plus source-level integration tests |
| Continuous test/build verification | Done | `.github/workflows/unified-app-quality.yml` |

## P2 topic coverage

P2 intentionally adds diagnostic, comparative, or paper-reading depth rather than more foundation trivia.

### Linear algebra

`determinant-volume`

- determinant magnitude versus orientation sign;
- determinant zero as dimension collapse and singularity.

### Statistics and experimentation

`sequential-testing-peeking`

- Pocock-style versus O'Brien-Fleming-style sequential boundaries.

`spearman-correlation`

- tied-rank handling;
- strong non-monotonic dependence with near-zero Spearman correlation.

### Neural networks

`relu`

- dead-ReLU diagnosis.

`leaky-relu`

- negative-side gradient flow versus standard ReLU.

`conv-relu`

- convolution feature response versus ReLU gating.

`max-pooling`

- local invariance versus spatial-information loss.

### Frontier attention and reasoning

`native-sparse-attention`

- theoretical FLOP reduction versus realized kernel/hardware speedup.

`dapo-reasoning-rl`

- non-additive interpretation of component ablations.

`coconut-latent-reasoning`

- what representation probes can and cannot establish.

`frontier-moe-systems`

- all-to-all expert communication as a systems bottleneck.

## Central scenario-extension registry

Before this cleanup, every scenario source had to be imported separately by both `lessonAssessments.js` and `assessmentScenarioExtensions.test.mjs`.

That duplicated wiring already caused a real gap: `p1AdditionalScenarioQuestions.js` was live in production but absent from the extension-integrity test.

`assessmentScenarioExtensions.js` is now the single source of truth for extension sources:

```text
P0 core
P0 experimentation
P1 core
P1 statistics
P1 math
P1 neural
P1 NLP / Transformers
P1 generative / RL
P1 production
P1 remaining
P1 additional
P2 cleanup
```

Each source has a stable source ID and priority. Both the public assessment registry and integrity tests consume the same source list.

## Scenario integrity contract

The scenario extension tests now enforce:

- unique source IDs;
- valid `P0`, `P1`, or `P2` priority metadata;
- unique scenario IDs within a lesson;
- unique normalized extension prompts within a lesson;
- no exact normalized prompt duplication against existing base scenarios;
- no scenario ID collision with the 100-question quiz bank;
- all extension scenarios are actually merged into the public assessment;
- three distinct choices and valid answer index;
- meaningful explanations;
- non-empty visual-state metadata when `kind: 'visual-state'`;
- live correct-answer positions are not dominated by one option.

This keeps scenario modules additive without turning them into an unvalidated second assessment system.

## Learner-facing cleanup

Scenario questions are valuable because they emphasize diagnosis and transfer, but showing every scenario above a 100-question assessment does not scale.

`AssessmentPanel.jsx` now displays at most four scenarios per scenario page.

The page resets when the lesson changes and shows the current scenario range. Answer state remains stored by stable scenario ID, so moving between pages does not lose progress.

The core quiz remains unchanged at ten questions per page.

## Answer-position cleanup

Scenario source files intentionally keep the correct answer first because that makes authored data easy to review.

The public registry applies a stable hash-based rotation using:

```text
lessonId + scenarioId
```

The correct choice is preserved while its displayed position changes deterministically.

This avoids runtime randomness and prevents learners from exploiting a source-authoring convention.

## CI quality gate

`.github/workflows/unified-app-quality.yml` now runs for relevant pushes to `main` and pull requests.

The gate executes:

```bash
cd unified-app
npm ci
npm test
npm run audit:quality
npm run build
```

Concurrency cancels superseded runs on the same ref so rapid assessment edits do not waste runners.

The Playwright route smoke suite remains outside this lean gate because it requires browser installation and is materially more expensive than the assessment/unit/build checks.

## P2 definition of done

P2 is complete when:

- [x] the low-priority topic gaps from the assessment matrix have targeted scenarios;
- [x] scenarios add diagnosis/comparison depth rather than duplicate foundation trivia;
- [x] one registry owns all scenario-extension sources;
- [x] production and tests consume the same extension registry;
- [x] exact extension duplicate prompts are rejected;
- [x] exact duplicate prompts against base scenarios are rejected;
- [x] scenario/quiz ID collisions are rejected;
- [x] scenario answer positions are deterministically diversified;
- [x] scenario pages prevent the assessment header from growing without bound;
- [x] P2 topic coverage has an explicit regression test;
- [x] GitHub Actions runs unit tests, the curriculum audit, and the production build for relevant changes.

A green CI run remains the authoritative runtime verification for the current head commit.
