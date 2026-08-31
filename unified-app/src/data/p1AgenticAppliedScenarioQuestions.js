export const P1_AGENTIC_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'tool-using-reasoning-models': [
    {
      id: 'tool-idempotency-timeout-design',
      level: 'design',
      relatedComparison: 'blind-retry-vs-idempotent-status-reconciliation-after-uncertain-side-effect',
      scenario: 'An agent sends a $240 supplier payment with idempotency key PAY-7842. The payment API times out after accepting the HTTP request, so the agent cannot tell whether the charge executed. Retrying the same business action with a new key could create a duplicate payment, and doing nothing could leave the invoice unpaid.',
      prompt: 'What should the agent do before attempting any further payment action?',
      choices: [
        'Query payment status using the original idempotency key or transaction reference, then retry only through the API idempotency contract if the outcome is confirmed absent',
        'Immediately submit the payment again with a fresh idempotency key because a timeout proves the first request did not execute',
        'Assume success and mark the invoice paid locally because avoiding a duplicate charge is more important than reconciling remote state',
      ],
      answerIndex: 0,
      explanation: 'A timeout creates an unknown-outcome state, not a known failure. The agent should reconcile the original transaction through an idempotency key or status endpoint before any new side effect. Blind retries with new identifiers can duplicate actions; blind success assumptions can corrupt local state.',
      misconceptionTested: 'A tool timeout can safely be treated as either definite failure or definite success when the remote system may already have performed an irreversible side effect.',
    },
  ],
  'agentic-coding-systems': [
    {
      id: 'agent-git-bisect-worked',
      level: 'calculation',
      relatedComparison: 'linear-commit-inspection-vs-binary-search-regression-localization',
      scenario: 'A coding agent knows commit C0 is good and C8 is bad, with eight candidate commits C1 through C8 that could have introduced a deterministic regression. Building and running the reproducer at any selected commit is expensive, but reliable. The agent can use binary-search-style git bisect reasoning.',
      prompt: 'In the worst case, how many midpoint test rounds are needed to isolate the first bad commit among eight candidates?',
      choices: [
        '3 rounds, because binary search reduces 8 candidates to 4, then 2, then 1',
        '4 rounds, because binary search always needs half as many tests as there are candidates',
        '8 rounds, because regression localization cannot eliminate untested commits from consideration',
      ],
      answerIndex: 0,
      explanation: 'Each reliable midpoint test halves the candidate interval. Starting with 8 possible bad commits, three binary decisions are sufficient in the worst case: 8 to 4, 4 to 2, and 2 to 1. This is why disciplined bisect-style localization can beat sequential inspection on deterministic regressions.',
      misconceptionTested: 'A coding agent must inspect or test every recent commit individually even when a deterministic good/bad predicate supports binary-search regression localization.',
    },
  ],
  'frontier-evaluation-safety': [
    {
      id: 'frontier-release-evidence-decision',
      level: 'decision',
      relatedComparison: 'headline-benchmark-capability-vs-fresh-generalization-vs-rare-safety-event-rate',
      scenario: 'A frontier model scores 96% on a public benchmark, but that benchmark is present in known pretraining corpora. On 500 newly authored equivalent tasks it scores 71%. In a separate 10,000-trial tool-use safety evaluation, 7 trials perform a prohibited irreversible action. The release policy requires fresh-task accuracy of at least 80% and zero prohibited actions in this safety suite.',
      prompt: 'What release conclusion follows from the stated evidence and policy?',
      choices: [
        'Do not approve release: the uncontaminated capability evaluation misses the 80% threshold and the safety suite records prohibited actions, regardless of the 96% public-benchmark score',
        'Approve release because 96% is the highest available accuracy number and therefore supersedes lower fresh-task and safety measurements',
        'Approve release because 7 failures in 10,000 trials are rare, and contamination only matters when the public benchmark score is below the release threshold',
      ],
      answerIndex: 0,
      explanation: 'The public score is weak evidence of generalization when training exposure is plausible. The fresh evaluation is below the explicit 80% capability threshold, and the safety evaluation violates the zero-prohibited-action requirement. Both independent release gates fail, so the headline benchmark cannot justify approval.',
      misconceptionTested: 'A strong aggregate benchmark can override contamination concerns, fresh generalization evidence, or explicit rare-event safety gates in a frontier-model release decision.',
    },
  ],
});

export function getP1AgenticAppliedScenariosForLesson(lessonId) {
  return P1_AGENTIC_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
