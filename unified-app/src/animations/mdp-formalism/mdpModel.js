function validateGamma(gamma) { if (!Number.isFinite(gamma) || gamma < 0 || gamma > 1) throw new RangeError('gamma must be in [0, 1]'); }

export function validateMdp(model) {
  if (!model || !Array.isArray(model.states) || !model.actions) throw new TypeError('invalid MDP model');
  const states = new Set(model.states); const terminals = new Set(model.terminalStates ?? []);
  for (const terminal of terminals) { if (!states.has(terminal)) throw new RangeError(`unknown terminal state: ${terminal}`); }
  for (const [state, actions] of Object.entries(model.actions)) {
    if (!states.has(state)) throw new RangeError(`unknown action state: ${state}`);
    if (terminals.has(state)) throw new RangeError(`terminal state ${state} must not expose actions`);
    for (const [actionId, transitions] of Object.entries(actions)) {
      if (!Array.isArray(transitions) || transitions.length === 0) throw new RangeError(`${state}/${actionId} needs transitions`);
      const total = transitions.reduce((sum, transition) => sum + transition.probability, 0);
      if (transitions.some((transition) => !states.has(transition.to) || !Number.isFinite(transition.reward) || !Number.isFinite(transition.probability) || transition.probability < 0)) throw new RangeError(`invalid transition in ${state}/${actionId}`);
      if (Math.abs(total - 1) > 1e-9) throw new RangeError(`${state}/${actionId} probabilities must sum to one`);
    }
  }
  return true;
}

export function expectedImmediateReward(transitions) { return transitions.reduce((sum, transition) => sum + transition.probability * transition.reward, 0); }
export function expectedNextValue(transitions, values) { return transitions.reduce((sum, transition) => sum + transition.probability * values[transition.to], 0); }
export function actionValue(transitions, values, gamma) { validateGamma(gamma); return transitions.reduce((sum, transition) => sum + transition.probability * (transition.reward + gamma * values[transition.to]), 0); }
export function actionBreakdown(model, state, actionId, values, gamma) {
  validateMdp(model); validateGamma(gamma); const transitions = model.actions[state]?.[actionId]; if (!transitions) throw new RangeError(`unknown action ${state}/${actionId}`);
  return { transitions: transitions.map((transition) => ({ ...transition, immediateContribution: transition.probability * transition.reward, continuationContribution: transition.probability * gamma * values[transition.to], totalContribution: transition.probability * (transition.reward + gamma * values[transition.to]) })), expectedImmediateReward: expectedImmediateReward(transitions), expectedNextValue: expectedNextValue(transitions, values), actionValue: actionValue(transitions, values, gamma) };
}
export function compareActions(model, state, values, gamma) { validateMdp(model); validateGamma(gamma); if ((model.terminalStates ?? []).includes(state)) return []; return Object.keys(model.actions[state] ?? {}).map((actionId) => ({ actionId, ...actionBreakdown(model, state, actionId, values, gamma) })).sort((a, b) => b.actionValue - a.actionValue); }
function mulberry32(seed) { let state = seed >>> 0; return () => { state += 0x6D2B79F5; let value = state; value = Math.imul(value ^ value >>> 15, value | 1); value ^= value + Math.imul(value ^ value >>> 7, value | 61); return ((value ^ value >>> 14) >>> 0) / 4294967296; }; }
export function sampleTransition(transitions, seed) { const draw = mulberry32(seed)(); let cumulative = 0; for (let index = 0; index < transitions.length; index += 1) { cumulative += transitions[index].probability; if (draw <= cumulative || index === transitions.length - 1) return transitions[index]; } return transitions[transitions.length - 1]; }
export function buildMdpLab({ model, state, actionId, values, gamma, seed }) { validateMdp(model); const terminal = (model.terminalStates ?? []).includes(state); const comparisons = compareActions(model, state, values, gamma); if (terminal) return { terminal: true, comparisons, selected: null, sampledTransition: null }; const selected = actionBreakdown(model, state, actionId, values, gamma); return { terminal: false, comparisons, selected, sampledTransition: sampleTransition(selected.transitions, seed), bestActionId: comparisons[0].actionId }; }
