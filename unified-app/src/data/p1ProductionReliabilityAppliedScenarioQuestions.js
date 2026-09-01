export const P1_PRODUCTION_RELIABILITY_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'efficient-inference-compression-track': [
    {
      id: 'inference-concurrency-capacity-worked',
      level: 'calculation',
      relatedComparison: 'weight-compression-vs-kv-capacity-vs-concurrency',
      scenario: 'A 48 GB GPU serves a long-context model. FP16 weights consume 28 GB, INT8 weights consume 14 GB, non-KV runtime buffers reserve another 6 GB, and each active request needs about 2 GB of KV cache at the target context length. Capacity planning must use the full serving-memory budget rather than weight size alone.',
      prompt: 'What maximum concurrent-request capacity follows before and after weight quantization, ignoring fragmentation?',
      choices: [
        'FP16 supports 10 requests and INT8 supports 17 because the 6 GB runtime reserve can be reused by every request',
        'FP16 and INT8 both support 7 requests because KV cache, not weights, is the only memory that limits concurrency',
        'FP16 supports 7 requests and INT8 supports 14 because floor((48 - 28 - 6) / 2) = 7 and floor((48 - 14 - 6) / 2) = 14',
      ],
      answerIndex: 2,
      explanation: 'The usable KV budget is 14 GB with FP16 weights and 28 GB with INT8 weights after reserving the same 6 GB of runtime memory. Dividing those budgets by 2 GB per active request gives 7 versus 14 requests. Compression therefore changes concurrency indirectly by freeing capacity for per-request state.',
      misconceptionTested: 'Weight quantization should be evaluated only as a static model-size reduction and cannot materially change request concurrency when KV cache is also present.',
    },
  ],
  'efficient-llm-serving': [
    {
      id: 'serving-littles-law-concurrency-worked',
      level: 'calculation',
      relatedComparison: 'arrival-rate-vs-time-in-system-vs-required-concurrency',
      scenario: 'A serving cluster receives an average of 18 requests per second during the busy hour. End-to-end time in system, including queueing, prefill, and decode, averages 1.4 seconds. The current scheduler remains stable only up to about 20 simultaneous active requests before queue delay rises sharply.',
      prompt: 'Using Little\'s Law, what concurrency does this workload imply and what operational conclusion follows?',
      choices: [
        'About 25 concurrent requests, so a stable limit near 20 is below the workload demand and queueing pressure should be expected',
        'About 13 concurrent requests, so the current limit has roughly 7 requests of spare capacity',
        'About 1.3 concurrent requests because request rate should be divided by latency instead of multiplied by it',
      ],
      answerIndex: 0,
      explanation: 'Little\'s Law gives average concurrency L = lambda x W = 18 x 1.4 = 25.2 requests. If the scheduler becomes unstable around 20 active requests, the observed workload demands more concurrency than the system can sustain, so queueing and TTFT growth are expected unless capacity or service time improves.',
      misconceptionTested: 'Serving capacity can be sized from throughput or latency independently without checking the concurrency implied by their product.',
    },
  ],
  'model-debugging': [
    {
      id: 'debugging-shadow-transform-parity',
      level: 'diagnosis',
      relatedComparison: 'model-regression-vs-feature-transform-regression-vs-shadow-parity',
      scenario: 'A new serving release changes scores on one customer slice. The same raw request is sent through the old and new pipelines in shadow mode. Both use the identical model artifact, but the old pipeline produces normalized_income = 0.42 while the new pipeline produces 1.87 for the same raw income. Offline replay matches the old pipeline.',
      prompt: 'What does this shadow comparison isolate as the highest-priority fault domain?',
      choices: [
        'The model weights, because any score change should be treated as a model regression even when both deployments load the same artifact',
        'The serving feature transformation or schema path, because identical raw input and identical weights produce different derived features only in the new pipeline',
        'The evaluation metric, because offline replay agreeing with the old pipeline means the online feature values cannot be wrong',
      ],
      answerIndex: 1,
      explanation: 'The controlled shadow test holds raw input and model weights constant while changing the serving pipeline. The derived feature diverges only in the new path, and offline replay agrees with the old path, so the shortest causal explanation is a transformation, schema, default, or versioning regression before model execution.',
      misconceptionTested: 'When online predictions change, debugging should start by retraining or replacing the model even if a controlled shadow test localizes the difference to preprocessing.',
    },
  ],
  'model-monitoring': [
    {
      id: 'monitoring-error-budget-burn-worked',
      level: 'calculation',
      relatedComparison: 'steady-state-error-budget-vs-short-window-burn-rate',
      scenario: 'A prediction service allows at most 0.5% invalid prediction responses over its reliability objective. During the last two hours, 3.0% of requests returned invalid predictions while request volume remained representative and no planned maintenance was active. The team uses burn rate to decide whether short-window incidents deserve paging.',
      prompt: 'What approximate burn rate is the service experiencing relative to the allowed invalid-response budget?',
      choices: [
        'About 6x, because 3.0% / 0.5% = 6, which is evidence of a materially accelerated budget burn rather than a normal fluctuation',
        'About 0.17x, because the allowed error rate should be divided by the observed error rate',
        'Exactly 3x, because a percentage should be compared only with the whole 100% request population',
      ],
      answerIndex: 0,
      explanation: 'Burn rate compares the observed bad-event rate with the rate permitted by the objective. Here 3.0 / 0.5 = 6, so the service is consuming reliability budget about six times faster than the steady-state allowance. That justifies incident triage even before downstream model-quality labels arrive.',
      misconceptionTested: 'Monitoring should alert only on raw metric thresholds and does not need to relate the observed failure rate to the reliability budget the service is allowed to consume.',
    },
  ],
});

export function getP1ProductionReliabilityAppliedScenariosForLesson(lessonId) {
  return P1_PRODUCTION_RELIABILITY_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
