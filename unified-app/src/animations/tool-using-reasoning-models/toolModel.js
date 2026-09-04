export function decideToolStep(step, policy) {
  if (step.type !== 'tool') return { status: 'not-applicable', reason: 'not a tool step' };
  if (!policy.allowedTools.includes(step.tool)) return { status: 'blocked', reason: 'tool not granted by policy' };
  if (step.mutation && !step.trusted && policy.blockUntrustedWrites) return { status: 'blocked', reason: 'mutation originated from untrusted tool output' };
  if (step.mutation && policy.requireApprovalForWrites) return { status: 'approval', reason: 'mutation requires human approval' };
  return { status: 'executed', reason: 'tool call permitted' };
}

export function runScenario(scenario, policy, { approvalsGranted = true } = {}) {
  if (!scenario || !policy) throw new TypeError('scenario and policy are required');
  const facts = new Set();
  let latencyMs = 0;
  let tokenCost = 0;
  let executedToolCalls = 0;
  let blockedToolCalls = 0;
  let approvalRequests = 0;
  let unsafeExecutions = 0;
  let mutationCompleted = false;
  let wastedToolCalls = 0;

  const rows = scenario.steps.map((step) => {
    if (step.type === 'answer') {
      const groundedFacts = scenario.requiredFacts.filter((fact) => facts.has(fact));
      return { ...step, status: 'answered', groundedFacts, groundingRecall: scenario.requiredFacts.length ? groundedFacts.length / scenario.requiredFacts.length : 1 };
    }

    const decision = decideToolStep(step, policy);
    let status = decision.status;
    if (status === 'approval') {
      approvalRequests += 1;
      status = approvalsGranted ? 'executed-after-approval' : 'approval-denied';
    }

    const executed = status === 'executed' || status === 'executed-after-approval';
    if (executed) {
      executedToolCalls += 1;
      latencyMs += step.costMs ?? 0;
      tokenCost += step.tokenCost ?? 0;
      (step.yields ?? []).forEach((fact) => facts.add(fact));
      if (step.mutation) mutationCompleted = true;
      if (step.unsafe) unsafeExecutions += 1;
      if ((step.yields ?? []).length === 0 && !step.mutation) wastedToolCalls += 1;
    } else if (status === 'blocked' || status === 'approval-denied') {
      blockedToolCalls += 1;
    }

    return { ...step, ...decision, status, executed };
  });

  const groundedFactCount = scenario.requiredFacts.filter((fact) => facts.has(fact)).length;
  const groundingRecall = scenario.requiredFacts.length ? groundedFactCount / scenario.requiredFacts.length : 1;
  const goalAchieved = groundingRecall === 1 && (!scenario.requiresMutation || mutationCompleted) && unsafeExecutions === 0;

  return { rows, facts: [...facts], groundingRecall, goalAchieved, mutationCompleted, executedToolCalls, blockedToolCalls, approvalRequests, unsafeExecutions, latencyMs, tokenCost, wastedToolCalls };
}

export function compareToolPolicies(scenario, policies, options) {
  return policies.map((policy) => ({ policy, result: runScenario(scenario, policy, options) }));
}
