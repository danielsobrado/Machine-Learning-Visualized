function competency(id, lessonId, quizIds, scenarioIds) {
  return Object.freeze({
    id,
    lessonId,
    quizIds: Object.freeze([...quizIds]),
    scenarioIds: Object.freeze([...scenarioIds]),
  });
}

export const GENERATION_SAMPLING_P1_AUDITED_LESSON_IDS = Object.freeze([
  'transformer-token-generation',
  'sampling-strategies',
]);

export const GENERATION_SAMPLING_P1_REQUIREMENTS = Object.freeze([
  competency(
    'generation-autoregressive-state-loop',
    'transformer-token-generation',
    ['ttg-002-loop', 'ttg-010-append', 'ttg-045-prompt-plus-output'],
    ['generation-context-state-update'],
  ),
  competency(
    'generation-next-token-position',
    'transformer-token-generation',
    ['ttg-023-last-position', 'ttg-024-vocab-size'],
    ['generation-last-position-logits'],
  ),
  competency(
    'generation-stopping-semantics',
    'transformer-token-generation',
    ['ttg-038-eos', 'ttg-039-stop-sequence', 'ttg-040-max-tokens'],
    ['generation-stop-condition-precedence', 'generation-batched-finished-sequences'],
  ),
  competency(
    'generation-cache-invariance-position-state',
    'transformer-token-generation',
    ['ttg-033-cache-invariance', 'ttg-034-cache-growth', 'ttg-036-no-prob-change'],
    ['generation-cache-position-invariance'],
  ),
  competency(
    'sampling-greedy-vs-stochastic',
    'sampling-strategies',
    ['samp-002-greedy', 'samp-007-deterministic', 'samp-038-beam-vs-sampling'],
    ['sampling-overconstrained-repetition'],
  ),
  competency(
    'sampling-temperature-sharpness',
    'sampling-strategies',
    ['samp-022-temperature-math', 'samp-023-low-temp', 'samp-024-high-temp'],
    ['sampling-temperature-ranking-vs-sharpness'],
  ),
  competency(
    'sampling-top-k-vs-top-p',
    'sampling-strategies',
    ['samp-025-topk-mechanism', 'samp-026-topp-mechanism', 'samp-044-topk-vs-topp'],
    ['sampling-top-p-variable-candidate-count'],
  ),
  competency(
    'sampling-filter-composition-order',
    'sampling-strategies',
    ['samp-034-filter-composition', 'samp-035-order-detail'],
    ['sampling-combined-filter-order'],
  ),
  competency(
    'sampling-reproducibility-boundary',
    'sampling-strategies',
    ['samp-032-sampling-randomness', 'samp-033-sampling-variation'],
    ['sampling-seed-reproducibility-boundary'],
  ),
  competency(
    'sampling-degeneration-task-fit',
    'sampling-strategies',
    ['samp-016-generic', 'samp-017-too-random', 'samp-040-breadth-quality'],
    ['sampling-overrandomized-degeneration'],
  ),
]);
