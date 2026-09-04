function assertProbability(value) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError('probability must be in [0, 1]');
}

export function validateMdp(mdp) {
  if (!mdp || !Array.isArray(mdp.states) || !mdp.actions) throw new TypeError('invalid MDP');
  const terminals = new Set(mdp.terminalStates ?? []);
  for (const state of mdp.states) {
    const actions = mdp.actions[state];
    if (!actions || typeof actions !== 'object') throw new TypeError(`missing actions for ${state}`);
    if (terminals.has(state)) {
      if (Object.keys(actions).length !== 0) throw new RangeError(`terminal state ${state} must not expose actions`);
      continue;
    }
    if (Object.keys(actions).length === 0) throw new RangeError(`non-terminal state ${state} needs actions`);
    for (const transitions of Object.values(actions)) {
      const total = transitions.reduce((sum, transition) => {
        assertProbability(transition.probability);
        if (!Number.isFinite(transition.reward)) throw new TypeError('reward must be finite');
        if (!mdp.states.includes(transition.to)) throw new RangeError(`unknown state ${transition.to}`);
        return sum + transition.probability;
      }, 0);
      if (Math.abs(total - 1) > 1e-9) throw new RangeError(`transition probabilities from ${state} must sum to one`);
    }
  }
  return true;
}

export function zeroValues(mdp) {
  return Object.fromEntries(mdp.states.map((state) => [state, 0]));
}

export function actionValue(mdp, state, actionId, values, discount) {
  if (!Number.isFinite(discount) || discount < 0 || discount > 1) throw new RangeError('discount must be in [0, 1]');
  const transitions = mdp.actions[state]?.[actionId];
  if (!transitions) throw new RangeError(`unknown action ${actionId} for ${state}`);
  const terminals = new Set(mdp.terminalStates ?? []);
  return transitions.reduce((sum, transition) => {
    const continuation = terminals.has(transition.to) ? 0 : values[transition.to];
    return sum + transition.probability * (transition.reward + discount * continuation);
  }, 0);
}

export function policyBellmanResidual(mdp, policy, values, discount) {
  const terminals = new Set(mdp.terminalStates ?? []);
  let residual = 0;
  for (const state of mdp.states) {
    const target = terminals.has(state) ? 0 : actionValue(mdp, state, policy[state], values, discount);
    residual = Math.max(residual, Math.abs(target - values[state]));
  }
  return residual;
}

export function evaluatePolicy(mdp, policy, discount, { tolerance = 1e-8, maxIterations = 500 } = {}) {
  validateMdp(mdp);
  if (!Number.isFinite(tolerance) || tolerance <= 0) throw new RangeError('tolerance must be positive');
  if (!Number.isInteger(maxIterations) || maxIterations <= 0) throw new RangeError('maxIterations must be positive');
  const terminals = new Set(mdp.terminalStates ?? []);
  let values = zeroValues(mdp);
  let iterations = 0;
  let delta = Number.POSITIVE_INFINITY;

  while (iterations < maxIterations && delta > tolerance) {
    const next = { ...values };
    delta = 0;
    for (const state of mdp.states) {
      if (terminals.has(state)) {
        next[state] = 0;
        continue;
      }
      const value = actionValue(mdp, state, policy[state], values, discount);
      delta = Math.max(delta, Math.abs(value - values[state]));
      next[state] = value;
    }
    values = next;
    iterations += 1;
  }

  return {
    values,
    iterations,
    converged: delta <= tolerance,
    delta,
    residual: policyBellmanResidual(mdp, policy, values, discount),
  };
}

export function greedyAction(mdp, state, values, discount) {
  const candidates = Object.keys(mdp.actions[state]).map((actionId) => ({
    actionId,
    value: actionValue(mdp, state, actionId, values, discount),
  }));
  if (candidates.length === 0) return null;
  return candidates.reduce((best, candidate) => candidate.value > best.value ? candidate : best, candidates[0]);
}

export function improvePolicy(mdp, policy, values, discount) {
  const terminals = new Set(mdp.terminalStates ?? []);
  const nextPolicy = { ...policy };
  const changes = [];
  for (const state of mdp.states) {
    if (terminals.has(state)) continue;
    const best = greedyAction(mdp, state, values, discount);
    nextPolicy[state] = best.actionId;
    if (policy[state] !== best.actionId) changes.push({ state, from: policy[state], to: best.actionId, actionValue: best.value });
  }
  return { policy: nextPolicy, changes, stable: changes.length === 0 };
}

export function runPolicyIteration(mdp, initialPolicy, discount, options = {}) {
  const maxPolicyIterations = options.maxPolicyIterations ?? 20;
  let policy = { ...initialPolicy };
  const history = [];

  for (let round = 0; round < maxPolicyIterations; round += 1) {
    const evaluation = evaluatePolicy(mdp, policy, discount, options);
    const improvement = improvePolicy(mdp, policy, evaluation.values, discount);
    history.push({ round, policy: { ...policy }, evaluation, improvement });
    if (improvement.stable) return { policy, values: evaluation.values, history, stable: true, rounds: round + 1 };
    policy = improvement.policy;
  }

  const evaluation = evaluatePolicy(mdp, policy, discount, options);
  return { policy, values: evaluation.values, history, stable: false, rounds: maxPolicyIterations };
}

export function evaluatePolicyForSweeps(mdp, policy, discount, sweeps) {
  if (!Number.isInteger(sweeps) || sweeps < 0) throw new RangeError('sweeps must be non-negative');
  const terminals = new Set(mdp.terminalStates ?? []);
  let values = zeroValues(mdp);
  for (let iteration = 0; iteration < sweeps; iteration += 1) {
    const next = { ...values };
    for (const state of mdp.states) {
      next[state] = terminals.has(state) ? 0 : actionValue(mdp, state, policy[state], values, discount);
    }
    values = next;
  }
  return values;
}
