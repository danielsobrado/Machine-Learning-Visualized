export const P1_PRODUCTION_SERVING_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'efficient-inference-compression-track': [
    {
      id: 'inference-total-memory-compression-worked',
      level: 'calculation',
      relatedComparison: 'weight-quantization-vs-total-serving-memory',
      scenario: 'A 13B-parameter model uses about 26 GB for FP16 weights. INT4 quantization reduces weight storage to about 6.5 GB, but the deployment still needs 8 GB for KV cache, activations, allocator overhead, and runtime buffers at the target concurrency.',
      prompt: 'What total-memory reduction should capacity planning expect from this change?',
      choices: [
        'About 4x total memory, because reducing weight bits from 16 to 4 always divides every serving-memory component by four',
        'From about 34 GB to about 14.5 GB, or roughly a 2.34x total-memory reduction, because the 8 GB non-weight memory remains',
        'From about 26 GB to about 6.5 GB total, because KV cache and runtime buffers disappear after weight quantization',
      ],
      answerIndex: 1,
      explanation: 'The FP16 deployment uses about 26 + 8 = 34 GB, while the INT4 deployment uses about 6.5 + 8 = 14.5 GB. The total reduction is therefore about 34 / 14.5 = 2.34x, not 4x, because quantization directly shrinks weights rather than every runtime-memory component.',
      misconceptionTested: 'A fourfold reduction in weight precision implies a fourfold reduction in total serving memory regardless of KV cache and runtime overhead.',
    },
  ],
  'efficient-llm-serving': [
    {
      id: 'serving-slo-batching-operating-point',
      level: 'decision',
      relatedComparison: 'throughput-vs-ttft-vs-intertoken-latency-slo',
      scenario: 'Three continuous-batching policies are benchmarked on the same workload. Policy A serves 900 tokens/s with P99 time-to-first-token 420 ms and P99 inter-token latency 48 ms. Policy B serves 1,250 tokens/s at 610 ms and 55 ms. Policy C serves 1,500 tokens/s at 940 ms and 72 ms. The product SLO requires TTFT <= 700 ms and inter-token latency <= 60 ms.',
      prompt: 'Which policy is the strongest valid operating point under the stated serving SLOs?',
      choices: [
        'Policy A, because the lowest latency should always win even when another policy also satisfies every SLO with higher throughput',
        'Policy C, because maximum throughput is the correct objective even when both user-facing latency SLOs are violated',
        'Policy B, because it satisfies both latency limits while delivering more throughput than the other SLO-compliant option',
      ],
      answerIndex: 2,
      explanation: 'Policy C violates both latency limits. Policies A and B both satisfy the SLOs, but B raises throughput from 900 to 1,250 tokens/s while staying below 700 ms TTFT and 60 ms inter-token latency. Serving configuration is constrained optimization, not single-metric maximization.',
      misconceptionTested: 'Batching should be selected by minimizing latency or maximizing throughput independently instead of choosing the best point that satisfies all product SLOs.',
    },
  ],
  'model-debugging': [
    {
      id: 'debugging-online-offline-divergence',
      level: 'diagnosis',
      relatedComparison: 'offline-model-quality-vs-online-feature-pipeline-correctness',
      scenario: 'After a mobile release, prediction errors spike only on Android 14. Replaying the same affected examples through the offline model reproduces the expected historical scores, but production telemetry shows the device_memory feature is null on 38% of Android 14 requests versus 0.4% elsewhere. Model weights and thresholds are unchanged.',
      prompt: 'What should the team investigate first before retraining or changing model capacity?',
      choices: [
        'Increase model size because a production-only regression proves the current model lacks capacity',
        'Change the decision threshold globally because one device family has missing input values',
        'Trace the Android 14 serving feature transformation/schema path because offline replay is healthy while one online feature becomes unexpectedly null',
      ],
      answerIndex: 2,
      explanation: 'The evidence localizes the incident to serving: the same examples score correctly offline, the model artifact is unchanged, and a single production slice has a large feature-null regression. The shortest causal path is to inspect feature extraction, schema mapping, defaults, and release-specific transformations before modifying the model.',
      misconceptionTested: 'A post-deployment quality regression should trigger retraining first even when offline replay isolates the problem to an online feature pipeline.',
    },
  ],
  'model-monitoring': [
    {
      id: 'monitoring-delayed-label-incident-triage',
      level: 'diagnosis',
      relatedComparison: 'data-quality-signal-vs-score-drift-vs-delayed-outcome-quality',
      scenario: 'Fraud labels arrive 30 days late. Today the transaction_amount feature null rate jumps from 0.2% to 17%, score distribution shifts sharply toward low risk, approval rate rises from 71% to 84%, and serving latency remains normal. No labeled post-change outcomes are available yet.',
      prompt: 'What conclusion and action are justified right now?',
      choices: [
        'Treat this as an immediate upstream data-quality incident, investigate the feature pipeline, and avoid claiming final model-quality impact until delayed labels arrive',
        'Declare that model recall improved because more transactions are approved even though no post-change labels exist',
        'Ignore the event because serving latency is healthy and only labeled accuracy metrics can justify investigation',
      ],
      answerIndex: 0,
      explanation: 'A 17% null-rate jump is direct evidence of a broken or changed input contract, and the simultaneous score/decision shift makes it operationally material. The team can act on that data-quality incident immediately while keeping final precision/recall claims separate until ground-truth labels become available.',
      misconceptionTested: 'When labels are delayed, teams must either infer final model quality from proxies or wait passively instead of acting on independently valid data and serving signals.',
    },
  ],
});

export function getP1ProductionServingAppliedScenariosForLesson(lessonId) {
  return P1_PRODUCTION_SERVING_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
