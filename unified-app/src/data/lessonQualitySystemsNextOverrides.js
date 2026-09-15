export const P1_SYSTEMS_NEXT_QUALITY_OVERRIDES = Object.freeze({
  'recommender-systems-ranking-track': Object.freeze({
    reason: 'Ranking lesson now separates implicit preference from confidence weighting and contrasts full-catalog ranking with easy sampled-negative evaluation, making sampled-metric inflation and omitted hard negatives explicit.',
    nextAction: 'Add inverse-propensity or doubly-robust off-policy evaluation with logged exposure probabilities and uncertainty intervals.',
  }),
  'ml-security-robustness-track': Object.freeze({
    reason: 'Security lesson now executes the same poisoned-retrieval attack through ingestion, retrieval, authorization, and output validation, showing how a control can block one capability while another exfiltration path remains open.',
    nextAction: 'Add capability-scoped tool policies, attack-graph coverage, and trace replay across multi-step agent actions.',
  }),
  'data-engineering-for-ml-track': Object.freeze({
    reason: 'Data-engineering lesson now demonstrates slowly-changing-dimension as-of joins and late-arriving-event reconstruction, separating event time from what was actually known at prediction time.',
    nextAction: 'Add streaming watermark, correction/retraction, and backfill semantics across online/offline feature materialization.',
  }),
  'efficient-inference-compression-track': Object.freeze({
    reason: 'Inference lesson now extends weight and ideal-KV accounting with paged-KV tail fragmentation, activation/workspace memory, and runtime reserve so theoretical fit can be compared with deployable serving capacity.',
    nextAction: 'Add tensor-parallel sharding, continuous-batching admission, and scheduler-aware peak-memory/throughput trade-offs.',
  }),
});
