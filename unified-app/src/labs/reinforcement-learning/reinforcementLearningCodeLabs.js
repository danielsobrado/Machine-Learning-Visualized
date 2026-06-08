export const REINFORCEMENT_LEARNING_CODE_LABS = [
  // --- rl-foundations ---
  {
    id: 'rl-return-first',
    stepLabel: '58.1',
    group: 'Discounted return',
    title: 'First reward term',
    concept: 'Discounted episode return starts with the immediate reward at t=0 weighted by gamma^0 = 1.',
    objective: 'Inside discountedReturn, add rewards[0] to g on the first loop iteration.',
    difficulty: 'warmup',
    starterCode: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    // TODO: add discount * rewards[t] to g
    discount *= gamma;
  }
  return g;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('single reward', discountedReturn([5], 0.9), 5);
return results;`,
    hints: ['g += discount * rewards[t];'],
    solution: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,
    explanation: 'The first term is always the undiscounted immediate reward.',
  },
  {
    id: 'rl-return-discount',
    stepLabel: '58.2',
    group: 'Discounted return',
    title: 'Update discount factor',
    concept: 'Each future timestep is weighted by an additional power of gamma.',
    objective: 'Multiply discount by gamma after each timestep.',
    difficulty: 'warmup',
    starterCode: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    // TODO: discount *= gamma
  }
  return g;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('two-step decay', discountedReturn([1, 1], 0.5), 1.5);
return results;`,
    hints: ['discount *= gamma;'],
    solution: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,
    explanation: 'Discount decay encodes preference for nearer rewards.',
  },
  {
    id: 'rl-discount-chain-calc',
    stepLabel: '58.3',
    group: 'Discounted return',
    title: 'Discounted episode return',
    concept: 'The full return is G = sum_t gamma^t * r_t across the trajectory.',
    objective: 'Accumulate every discounted reward in the loop.',
    difficulty: 'core',
    starterCode: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    // TODO: add discount * rewards[t] to g, then update discount
    discount *= gamma;
  }
  return g;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('decaying rewards', discountedReturn([1, 2, 4], 0.5), 3.0);
return results;`,
    hints: ['g += discount * rewards[t]; discount *= gamma;'],
    solution: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,
    explanation: 'Discounted return is the objective RL algorithms maximize in episodic tasks.',
  },
  {
    id: 'rl-return-empty',
    stepLabel: '58.4',
    group: 'Discounted return',
    title: 'Empty trajectory edge case',
    concept: 'An episode with no rewards should return zero total return.',
    objective: 'Return 0 when rewards is empty.',
    difficulty: 'core',
    starterCode: `function discountedReturn(rewards, gamma) {
  // TODO: return 0 when rewards.length === 0
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty trajectory', discountedReturn([], 0.9), 0);
return results;`,
    hints: ['if (rewards.length === 0) return 0;'],
    solution: `function discountedReturn(rewards, gamma) {
  if (rewards.length === 0) return 0;
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,
    explanation: 'Edge guards keep rollout collectors safe on zero-length episodes.',
  },

  // --- mdp-formalism ---
  {
    id: 'mdp-transition-term',
    stepLabel: '59.1',
    group: 'Bellman expectation',
    title: 'Transition expectation term',
    concept: 'Each successor state contributes transProb * (reward + gamma * V(s_next)) to the action value.',
    objective: 'Inside bellmanExpectation, accumulate one transition term into qAction.',
    difficulty: 'warmup',
    starterCode: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      // TODO: qAction += transProb * (reward + gamma * nextVal)
    }
    vState += actionProb * qAction;
  }
  return vState;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [[1, 0]];
const P = [[[1, 0], [0, 1]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('single action backup', bellmanExpectation(pi, P, R, V, 0.9, 2, 2, 0), 14.5);
return results;`,
    hints: ['qAction += transProb * (reward + gamma * nextVal);'],
    solution: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    vState += actionProb * qAction;
  }
  return vState;
}`,
    explanation: 'Transition expectations combine reward and bootstrapped future value.',
  },
  {
    id: 'mdp-action-expectation',
    stepLabel: '59.2',
    group: 'Bellman expectation',
    title: 'Action expectation sum',
    concept: 'The action value qAction sums over every possible successor state.',
    objective: 'Complete the inner loop over sNext before weighting by actionProb.',
    difficulty: 'warmup',
    starterCode: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    // TODO: add actionProb * qAction to vState
  }
  return vState;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [[0.5, 0.5]];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('mixed policy backup', bellmanExpectation(pi, P, R, V, 0.9, 2, 2, 0), 19.975);
return results;`,
    hints: ['vState += actionProb * qAction;'],
    solution: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    vState += actionProb * qAction;
  }
  return vState;
}`,
    explanation: 'Policy probability weights each action contribution into the state value.',
  },
  {
    id: 'mdp-bellman-expectation-calc',
    stepLabel: '59.3',
    group: 'Bellman expectation',
    title: 'Bellman expectation backup',
    concept: 'The Bellman expectation equation averages action values according to the current policy.',
    objective: 'Return vState after looping over all actions.',
    difficulty: 'core',
    starterCode: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    vState += actionProb * qAction;
  }
  // TODO: return vState
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [[1, 0]];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('deterministic policy', bellmanExpectation(pi, P, R, V, 0.9, 2, 2, 0), 13.4);
return results;`,
    hints: ['return vState;'],
    solution: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    vState += actionProb * qAction;
  }
  return vState;
}`,
    explanation: 'Repeated Bellman expectation backups converge to the true value function for a fixed policy.',
  },
  {
    id: 'mdp-verify-transition',
    stepLabel: '59.4',
    group: 'Bellman expectation',
    title: 'Valid transition distribution',
    concept: 'MDP transition probabilities for each action must sum to one before backups are meaningful.',
    objective: 'Return false from bellmanExpectation when transition probabilities do not sum to 1.',
    difficulty: 'core',
    starterCode: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  for (let a = 0; a < numActions; a++) {
    let sum = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      sum += P[stateIdx][a][sNext];
    }
    // TODO: if Math.abs(sum - 1) > 1e-5, return NaN
  }
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    vState += actionProb * qAction;
  }
  return vState;
}`,
    testCode: `const results = [];
function checkNaN(name, actual) {
  results.push({ name, actual, expected: 'NaN', passed: Number.isNaN(actual) });
}
const pi = [[1]];
const P = [[[0.5, 0.3]]];
const R = [[[1, 2]]];
const V = [0, 0];
checkNaN('invalid transitions', bellmanExpectation(pi, P, R, V, 0.9, 1, 2, 0));
return results;`,
    hints: ['if (Math.abs(sum - 1) > 1e-5) return NaN;'],
    solution: `function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
  for (let a = 0; a < numActions; a++) {
    let sum = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      sum += P[stateIdx][a][sNext];
    }
    if (Math.abs(sum - 1) > 1e-5) return NaN;
  }
  let vState = 0;
  for (let a = 0; a < numActions; a++) {
    const actionProb = pi[stateIdx][a];
    let qAction = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[stateIdx][a][sNext];
      const reward = R[stateIdx][a][sNext];
      const nextVal = V[sNext];
      qAction += transProb * (reward + gamma * nextVal);
    }
    vState += actionProb * qAction;
  }
  return vState;
}`,
    explanation: 'Invalid transition rows signal malformed MDP dynamics before value iteration runs.',
  },

  // --- value-iteration ---
  {
    id: 'vi-q-term',
    stepLabel: '60.1',
    group: 'Value iteration step',
    title: 'Q-value transition term',
    concept: 'Value iteration builds each action value from expected one-step returns.',
    objective: 'Inside valueIterationUpdate, add P * (R + gamma * V) for each successor.',
    difficulty: 'warmup',
    starterCode: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      // TODO: qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext])
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2]]];
const R = [[[10, 0]]];
const V = [5, 10];
check('one action backup', valueIterationUpdate(P, R, V, 0, 0.9, 1, 2), 13.4);
return results;`,
    hints: ['qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);'],
    solution: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}`,
    explanation: 'Each transition contributes probability-weighted reward and future value.',
  },
  {
    id: 'vi-q-value-calc',
    stepLabel: '60.2',
    group: 'Value iteration step',
    title: 'Action Q-value',
    concept: 'For a fixed action, Q(s,a) sums transition contributions across successor states.',
    objective: 'Complete the inner loop for one action before comparing actions.',
    difficulty: 'warmup',
    starterCode: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    // TODO: update maxQ if qValue is larger
  }
  return maxQ;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('max over actions', valueIterationUpdate(P, R, V, 0, 0.9, 2, 2), 26.55);
return results;`,
    hints: ['if (qValue > maxQ) maxQ = qValue;'],
    solution: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}`,
    explanation: 'Value iteration is Bellman optimality with a max over actions.',
  },
  {
    id: 'vi-backup-once',
    stepLabel: '60.3',
    group: 'Value iteration step',
    title: 'Value iteration update',
    concept: 'One sweep updates V(s) to the best achievable action value under the current value estimate.',
    objective: 'Return maxQ after scanning every action.',
    difficulty: 'core',
    starterCode: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  // TODO: return maxQ
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('value iteration update', valueIterationUpdate(P, R, V, 0, 0.9, 2, 2), 26.55);
return results;`,
    hints: ['return maxQ;'],
    solution: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}`,
    explanation: 'Repeated backups propagate optimal values through the state space.',
  },
  {
    id: 'vi-no-actions',
    stepLabel: '60.4',
    group: 'Value iteration step',
    title: 'No actions edge case',
    concept: 'Terminal or malformed states with zero actions should not produce finite maxima.',
    objective: 'Return 0 when numActions is 0.',
    difficulty: 'core',
    starterCode: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  // TODO: return 0 when numActions === 0
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('no actions', valueIterationUpdate([[]], [[[]]], [0], 0, 0.9, 0, 1), 0);
return results;`,
    hints: ['if (numActions === 0) return 0;'],
    solution: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  if (numActions === 0) return 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}`,
    explanation: 'Guarding zero-action states prevents -Infinity from leaking into planners.',
  },

  // --- policy-iteration ---
  {
    id: 'pi-eval-term',
    stepLabel: '61.1',
    group: 'Policy iteration step',
    title: 'Policy evaluation term',
    concept: 'Policy evaluation updates a state value by expecting over successor states for the current policy action.',
    objective: 'Inside policyIterationStep, accumulate transProb * (reward + gamma * nextVal).',
    difficulty: 'warmup',
    starterCode: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[state][action][sNext];
      const reward = R[state][action][sNext];
      const nextVal = V[sNext];
      // TODO: newValue += transProb * (reward + gamma * nextVal)
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  return bestAction;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [1];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('eval backup', policyIterationStep(pi, P, R, V, 0, 0.9, 2, 2, false), 26.55);
return results;`,
    hints: ['newValue += transProb * (reward + gamma * nextVal);'],
    solution: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[state][action][sNext];
      const reward = R[state][action][sNext];
      const nextVal = V[sNext];
      newValue += transProb * (reward + gamma * nextVal);
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  return bestAction;
}`,
    explanation: 'Evaluation tells you how good the current policy is in each state.',
  },
  {
    id: 'pi-eval-step-calc',
    stepLabel: '61.2',
    group: 'Policy iteration step',
    title: 'Policy evaluation return',
    concept: 'One evaluation sweep replaces V(s) with the expected return of following pi in that state.',
    objective: 'Return newValue when improve is false.',
    difficulty: 'warmup',
    starterCode: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[state][action][sNext];
      const reward = R[state][action][sNext];
      const nextVal = V[sNext];
      newValue += transProb * (reward + gamma * nextVal);
    }
    // TODO: return newValue
    return 0;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  return bestAction;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [0];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('eval action 0', policyIterationStep(pi, P, R, V, 0, 0.9, 2, 2, false), 13.4);
return results;`,
    hints: ['return newValue;'],
    solution: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      const transProb = P[state][action][sNext];
      const reward = R[state][action][sNext];
      const nextVal = V[sNext];
      newValue += transProb * (reward + gamma * nextVal);
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  return bestAction;
}`,
    explanation: 'Policy evaluation is the inner loop of policy iteration.',
  },
  {
    id: 'pi-greedy-improve',
    stepLabel: '61.3',
    group: 'Policy iteration step',
    title: 'Greedy policy improvement',
    concept: 'Policy improvement makes the policy greedy with respect to the current value function.',
    objective: 'When improve is true, return the action with highest Q-value.',
    difficulty: 'core',
    starterCode: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      newValue += P[state][action][sNext] * (R[state][action][sNext] + gamma * V[sNext]);
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    // TODO: update bestAction when qValue is larger than maxQ
  }
  return bestAction;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const pi = [0];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('greedy improvement', policyIterationStep(pi, P, R, V, 0, 0.9, 2, 2, true), 1);
return results;`,
    hints: ['if (qValue > maxQ) { maxQ = qValue; bestAction = a; }'],
    solution: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      newValue += P[state][action][sNext] * (R[state][action][sNext] + gamma * V[sNext]);
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  return bestAction;
}`,
    explanation: 'Greedy improvement monotonically improves policy performance.',
  },
  {
    id: 'pi-tie-break',
    stepLabel: '61.4',
    group: 'Policy iteration step',
    title: 'Keep first best action on ties',
    concept: 'When multiple actions tie for top Q-value, deterministic planners keep the earliest index.',
    objective: 'Only update bestAction when qValue is strictly greater than maxQ.',
    difficulty: 'core',
    starterCode: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      newValue += P[state][action][sNext] * (R[state][action][sNext] + gamma * V[sNext]);
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  // TODO: return bestAction
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const pi = [1];
const P = [[[1, 0], [1, 0]]];
const R = [[[5, 0], [5, 0]]];
const V = [0, 0];
check('tie keeps lower index', policyIterationStep(pi, P, R, V, 0, 1, 2, 2, true), 0);
return results;`,
    hints: ['return bestAction;'],
    solution: `function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
  if (!improve) {
    const action = pi[state];
    let newValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      newValue += P[state][action][sNext] * (R[state][action][sNext] + gamma * V[sNext]);
    }
    return newValue;
  }
  let bestAction = 0;
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
      bestAction = a;
    }
  }
  return bestAction;
}`,
    explanation: 'Deterministic tie-breaking keeps policy iteration reproducible.',
  },

  // --- q-learning ---
  {
    id: 'q-learning-select-action',
    stepLabel: '62.1',
    group: 'Epsilon-greedy selection',
    title: 'Epsilon-Greedy Action Selection',
    concept: 'Q-learning balances exploration and exploitation inside every agent step. With probability epsilon, pick a random action; otherwise pick the argmax Q-value for the current state.',
    objective: 'Inside qLearningStep, implement epsilon-greedy action selection from qTable[state].',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  // TODO: epsilon-greedy — explore with randAction when randVal < epsilon, else argmax qValues.

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ;
  return { action, updatedQ: qTable[state][action] };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const table = [[1.5, 3.0, 2.0], [0.0, 0.0]];
check('explore random choice', qLearningStep(table, 0, 0, 0, false, 0.1, 0.9, 0.2, 0.1, 0).action, 0);
check('exploit best choice', qLearningStep(table, 0, 0, 0, false, 0.1, 0.9, 0.2, 0.5, 1).action, 1);
check('exploit with negatives', qLearningStep([[ -5, -2, -10 ]], 0, 0, 0, true, 0.1, 0.9, 0.1, 0.3, 2).action, 1);
check('explore boundary', qLearningStep([[1, 2]], 0, 0, 0, true, 0.1, 0.9, 0.5, 0.499, 1).action, 1);
return results;`,
    hints: [
      'If randVal < epsilon, return randAction as the selected action.',
      'Otherwise scan qValues for the index of the maximum value.',
      'Initialize maxIdx = 0 and update when qValues[i] > qValues[maxIdx].',
    ],
    solution: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ;
  return { action, updatedQ: qTable[state][action] };
}`,
    explanation: 'Epsilon-greedy selection is the first decision inside every Q-learning step before the TD update runs.',
  },
  {
    id: 'q-learning-td-target',
    stepLabel: '62.2',
    group: 'Terminal-aware TD target',
    title: 'Terminal-Aware TD Target',
    concept: 'The TD target is reward plus discounted best next-state value. Terminal transitions have no future actions, so the target collapses to reward alone.',
    objective: 'Inside qLearningStep, compute tdTarget = reward + gamma * maxNextQ only when the transition is not terminal.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    // TODO: set tdTarget = reward + gamma * maxNextQ for non-terminal transitions.
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const nonTerminal = [[0, 0], [5, 10, 3]];
const out1 = qLearningStep(nonTerminal, 0, 2.0, 1, false, 1.0, 0.9, 0, 0, 0);
check('non-terminal td target with alpha=1', out1.updatedQ, 11.0);
const terminal = [[0, 0], [4, 4]];
const out2 = qLearningStep(terminal, 0, 1.5, 1, true, 1.0, 0.9, 0, 0, 0);
check('terminal td target is reward only', out2.updatedQ, 1.5);
const zeroGamma = [[0], [10, 20]];
const out3 = qLearningStep(zeroGamma, 0, 3.0, 1, false, 1.0, 0.0, 0, 0, 0);
check('zero discount ignores future', out3.updatedQ, 3.0);
return results;`,
    hints: [
      'Inside the !isTerminal branch, tdTarget should include the discounted best next Q-value.',
      'Use tdTarget = reward + gamma * maxNextQ.',
      'Terminal transitions keep tdTarget = reward.',
    ],
    solution: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,
    explanation: 'Terminal states must not inherit discounted successor values; the TD target becomes the immediate reward.',
  },
  {
    id: 'q-learning-update-step',
    stepLabel: '62.3',
    group: 'Tabular Q-update',
    title: 'Q-Value Temporal Difference Update',
    concept: 'Q-learning blends the old estimate toward the TD target: Q_new = Q_old + alpha * (target - Q_old).',
    objective: 'Inside qLearningStep, write the alpha-blending update back into qTable[state][action].',
    difficulty: 'core',
    starterCode: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  // TODO: update qTable[state][action] with alpha blending toward tdTarget.
  return { action, updatedQ: qTable[state][action] };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const table = [[4.0, 2.0], [3.0, 8.5]];
const out = qLearningStep(table, 0, 10.0, 1, true, 0.1, 0.9, 0, 0, 0);
check('alpha blend toward terminal target', out.updatedQ, 4.6);
check('table cell updated in place', table[0][0], 4.6);
const table2 = [[10.0, 1.0], [3.0, 1.0]];
const full = qLearningStep(table2, 1, 2.5, 0, true, 0.2, 0.9, 0, 0, 0);
check('second state update', full.updatedQ, 2.9);
return results;`,
    hints: [
      'Use currentQ + alpha * (tdTarget - currentQ).',
      'Assign the result to qTable[state][action].',
      'Return the updated value in updatedQ.',
    ],
    solution: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,
    explanation: 'The learning rate alpha low-pass filters stochastic TD targets so single transitions do not destabilize the table.',
  },
  {
    id: 'q-learning-full-step',
    stepLabel: '62.4',
    group: 'Complete agent step',
    title: 'Complete Tabular Q-Learning Step',
    concept: 'A full agent step selects an action, bootstraps from the best next-state value when non-terminal, and writes the TD update back into the Q-table.',
    objective: 'Verify the complete qLearningStep handles both non-terminal bootstrapping and terminal transitions in one pass.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    // TODO: finish the non-terminal TD target inside this full agent step.
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const qTable = [[1.0, 2.0], [3.0, 4.0]];
const val1 = qLearningStep(qTable, 0, 1.5, 1, false, 0.5, 0.9, 0, 0, 1);
check('non-terminal full step', val1.updatedQ, 3.55);
check('non-terminal table write', qTable[0][1], 3.55);
const val2 = qLearningStep(qTable, 1, 2.5, 0, true, 0.2, 0.9, 1, 0.5, 0);
check('terminal full step', val2.updatedQ, 2.9);
check('terminal table write', qTable[1][0], 2.9);
return results;`,
    hints: [
      'Non-terminal tdTarget needs reward + gamma * maxNextQ.',
      'Terminal transitions keep tdTarget = reward.',
      'The alpha blend and table write should already be in place from prior steps.',
    ],
    solution: `/**
 * Runs one tabular Q-learning transition: select an action, compute TD target, update Q in-place.
 * @param {number[][]} qTable - Q(state, action) table updated in-place.
 * @param {number} state - Current state index.
 * @param {number} reward - Immediate reward after the transition.
 * @param {number} nextState - Successor state index (ignored when terminal).
 * @param {boolean} isTerminal - Whether nextState ends the episode.
 * @param {number} alpha - Learning rate for the TD update.
 * @param {number} gamma - Discount factor for future returns.
 * @param {number} epsilon - Exploration probability.
 * @param {number} randVal - Uniform random value in [0, 1) for explore/exploit.
 * @param {number} randAction - Random action index used when exploring.
 * @returns {{ action: number, updatedQ: number }} Selected action and updated Q(state, action).
 */
function qLearningStep(qTable, state, reward, nextState, isTerminal, alpha, gamma, epsilon, randVal, randAction) {
  const qValues = qTable[state];
  if (qValues.length === 0) {
    return { action: 0, updatedQ: 0 };
  }

  let action = 0;
  if (randVal < epsilon) {
    action = randAction;
  } else {
    let maxIdx = 0;
    for (let i = 1; i < qValues.length; i++) {
      if (qValues[i] > qValues[maxIdx]) maxIdx = i;
    }
    action = maxIdx;
  }

  const currentQ = qValues[action];
  let tdTarget = reward;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    let maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) maxNextQ = nextQValues[i];
    }
    tdTarget = reward + gamma * maxNextQ;
  }

  qTable[state][action] = currentQ + alpha * (tdTarget - currentQ);
  return { action, updatedQ: qTable[state][action] };
}`,
    explanation: 'Integrating exploration, bootstrapping, terminal handling, and in-place table updates is the core tabular Q-learning agent step.',
  },

  // --- rl-exploration ---
  {
    id: 'exploration-epsilon-greedy',
    stepLabel: '63.1',
    group: 'Exploration step',
    title: 'Epsilon-greedy explore branch',
    concept: 'Epsilon-greedy explores random actions with probability epsilon.',
    objective: 'Inside explorationStep, return randomActionIdx when randomVal < epsilon.',
    difficulty: 'warmup',
    starterCode: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  // TODO: if randomVal < epsilon, return randomActionIdx
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('explore random', explorationStep([1, 3, 2], [1, 1, 1], 0.2, 0.1, 2, 10), 2);
return results;`,
    hints: ['if (randomVal < epsilon) return randomActionIdx;'],
    solution: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    explanation: 'Random exploration collects data for poorly understood actions.',
  },
  {
    id: 'exploration-ucb-unvisited',
    stepLabel: '63.2',
    group: 'Exploration step',
    title: 'UCB infinite bonus',
    concept: 'UCB assigns infinite priority to actions that have never been tried.',
    objective: 'Use score = Infinity when visit count n is 0.',
    difficulty: 'warmup',
    starterCode: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    // TODO: score = Infinity when n === 0, else UCB formula
    let score = mean;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('unvisited arm wins', explorationStep([1, 5], [2, 0], 0, 0.5, 0, 20), 1);
return results;`,
    hints: ['const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);'],
    solution: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    explanation: 'Infinite optimism forces every arm to be tried at least once.',
  },
  {
    id: 'exploration-ucb-score',
    stepLabel: '63.3',
    group: 'Exploration step',
    title: 'UCB1 score',
    concept: 'UCB1 adds an uncertainty bonus mean + c * sqrt(ln(t) / n) to balance exploration and exploitation.',
    objective: 'Compute the UCB score for visited arms.',
    difficulty: 'core',
    starterCode: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean;
    // TODO: add UCB bonus c * sqrt(log(totalSteps) / n) when n > 0
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) {
  if (a === Infinity && b === Infinity) return true;
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('ucb arm picked', explorationStep([3.5, 3.4], [10, 10], 0, 0.5, 0, 100, 2.0), 0);
return results;`,
    hints: ['score = mean + c * Math.sqrt(Math.log(totalSteps) / n);'],
    solution: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    explanation: 'UCB favors high-reward arms and under-sampled arms simultaneously.',
  },
  {
    id: 'exploration-pick-best',
    stepLabel: '63.4',
    group: 'Exploration step',
    title: 'Select highest exploration score',
    concept: 'After epsilon exploration, the agent exploits the action with the highest UCB score.',
    objective: 'Return bestIdx with the maximum score.',
    difficulty: 'core',
    starterCode: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  // TODO: return bestIdx
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('exploit ucb winner', explorationStep([1.5, 3.0, 2.0], [5, 5, 5], 0, 0.5, 0, 50), 1);
return results;`,
    hints: ['return bestIdx;'],
    solution: `function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
  if (randomVal < epsilon) return randomActionIdx;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    const n = visitCounts[i];
    const mean = qValues[i];
    const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    explanation: 'Combining epsilon-greedy and UCB covers two major exploration strategies in one step function.',
  },

  // --- policy-gradients ---
  {
    id: 'pg-baseline-subtract',
    stepLabel: '64.1',
    group: 'Policy gradient step',
    title: 'Advantage baseline',
    concept: 'Policy gradients subtract a baseline from returns to reduce variance.',
    objective: 'Inside policyGradientStep, compute advantage = returnVal - baseline.',
    difficulty: 'warmup',
    starterCode: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  // TODO: advantage = returnVal - baseline
  const advantage = 0;
  return logProbGrad * advantage;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive advantage weight', policyGradientStep(1, 10, 7.5), 2.5);
return results;`,
    hints: ['const advantage = returnVal - baseline;'],
    solution: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,
    explanation: 'Advantages center learning signal around typical performance.',
  },
  {
    id: 'pg-surrogate-multiply',
    stepLabel: '64.2',
    group: 'Policy gradient step',
    title: 'Surrogate gradient weight',
    concept: 'The REINFORCE surrogate multiplies the log-probability gradient by the advantage.',
    objective: 'Return logProbGrad * advantage.',
    difficulty: 'warmup',
    starterCode: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  // TODO: return logProbGrad * advantage
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('negative advantage weight', policyGradientStep(0.5, 2, 6), -2);
return results;`,
    hints: ['return logProbGrad * advantage;'],
    solution: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,
    explanation: 'Positive advantages increase action probability; negative ones decrease it.',
  },
  {
    id: 'pg-surrogate-loss',
    stepLabel: '64.3',
    group: 'Policy gradient step',
    title: 'Policy gradient step',
    concept: 'One policy-gradient step scales the log-prob gradient by the advantage estimate.',
    objective: 'Combine baseline subtraction and multiplication in one return.',
    difficulty: 'core',
    starterCode: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  const weight = logProbGrad * advantage;
  // TODO: return weight
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive scale step', policyGradientStep(0.5, 10, 6), 2);
return results;`,
    hints: ['return weight;'],
    solution: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,
    explanation: 'This scalar weight plugs directly into automatic differentiation graphs.',
  },
  {
    id: 'pg-zero-gradient',
    stepLabel: '64.4',
    group: 'Policy gradient step',
    title: 'Zero gradient edge case',
    concept: 'If the log-probability gradient is zero, the policy update should not move.',
    objective: 'Return 0 when logProbGrad is 0.',
    difficulty: 'core',
    starterCode: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  // TODO: return 0 when logProbGrad === 0
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero grad', policyGradientStep(0, 10, 5), 0);
return results;`,
    hints: ['if (logProbGrad === 0) return 0;'],
    solution: `function policyGradientStep(logProbGrad, returnVal, baseline) {
  if (logProbGrad === 0) return 0;
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,
    explanation: 'Zero-gradient guards avoid wasted optimizer steps on saturated policies.',
  },

  // --- actor-critic ---
  {
    id: 'ac-td-error-calc',
    stepLabel: '65.1',
    group: 'Actor-critic step',
    title: 'TD error delta',
    concept: 'Actor-critic methods use TD error as the advantage signal: delta = r + gamma * V(s_next) - V(s).',
    objective: 'Inside actorCriticStep, compute delta.',
    difficulty: 'warmup',
    starterCode: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  let bootstrap = isTerminal ? 0 : nextValue;
  // TODO: delta = reward + gamma * bootstrap - currentValue
  const delta = 0;
  const loss = -logProb * delta;
  return { delta, loss };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('td error', actorCriticStep(2, 8, 10, 0.9, -1, false).delta, 3);
return results;`,
    hints: ['const delta = reward + gamma * bootstrap - currentValue;'],
    solution: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}`,
    explanation: 'TD error measures whether the transition beat the critic expectation.',
  },
  {
    id: 'ac-terminal-bootstrap',
    stepLabel: '65.2',
    group: 'Actor-critic step',
    title: 'Terminal bootstrap zero',
    concept: 'At terminal states there is no future value to bootstrap from.',
    objective: 'Set bootstrap to 0 when isTerminal is true.',
    difficulty: 'warmup',
    starterCode: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  // TODO: bootstrap = isTerminal ? 0 : nextValue
  let bootstrap = nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('terminal delta', actorCriticStep(1, 0.5, 9, 0.9, -1, true).delta, 0.5);
return results;`,
    hints: ['const bootstrap = isTerminal ? 0 : nextValue;'],
    solution: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}`,
    explanation: 'Zero terminal bootstrap prevents fictitious future value from leaking in.',
  },
  {
    id: 'ac-actor-loss-calc',
    stepLabel: '65.3',
    group: 'Actor-critic step',
    title: 'Actor surrogate loss',
    concept: 'The actor minimizes loss = -log pi(a|s) * delta to follow positive TD errors.',
    objective: 'Compute loss = -logProb * delta.',
    difficulty: 'core',
    starterCode: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  // TODO: loss = -logProb * delta
  const loss = 0;
  return { delta, loss };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('actor loss', actorCriticStep(0, 0, 0, 0.9, -1.2, true).loss, 0);
return results;`,
    hints: ['const loss = -logProb * delta;'],
    solution: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}`,
    explanation: 'Actor loss couples policy logits to critic feedback.',
  },
  {
    id: 'ac-step-return',
    stepLabel: '65.4',
    group: 'Actor-critic step',
    title: 'Return critic and actor outputs',
    concept: 'One actor-critic step returns both TD error and actor loss for dual optimization.',
    objective: 'Return { delta, loss }.',
    difficulty: 'core',
    starterCode: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  // TODO: return { delta, loss }
  return { delta: 0, loss: 0 };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = actorCriticStep(2, 8, 10, 0.9, -1.2, false);
check('positive loss', out.loss, 3.6);
return results;`,
    hints: ['return { delta, loss };'],
    solution: `function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}`,
    explanation: 'Joint outputs let critic and actor optimizers update from the same transition.',
  },

  // --- reward-shaping ---
  {
    id: 'rs-shaped-reward-calc',
    stepLabel: '66.1',
    group: 'Shaped reward step',
    title: 'Potential-based shaping',
    concept: 'Potential-based shaping uses F = gamma * phi(s_next) - phi(s) without changing optimal policies.',
    objective: 'Inside totalShapedReward, compute shaping = gamma * phiNext - phiCurrent.',
    difficulty: 'warmup',
    starterCode: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  // TODO: shaping = gamma * phiNext - phiCurrent
  const shaping = 0;
  return rawReward + shaping;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('shaping only', totalShapedReward(0, 2, 5, 0.9), 2.5);
return results;`,
    hints: ['const shaping = gamma * phiNext - phiCurrent;'],
    solution: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,
    explanation: 'Shaping adds dense guidance while preserving optimal policy invariants.',
  },
  {
    id: 'rs-add-raw',
    stepLabel: '66.2',
    group: 'Shaped reward step',
    title: 'Add raw environment reward',
    concept: 'The learner still receives the true environment reward in addition to shaping.',
    objective: 'Return rawReward + shaping.',
    difficulty: 'warmup',
    starterCode: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  // TODO: return rawReward + shaping
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('combined shaping', totalShapedReward(1, 2, 5, 0.9), 3.5);
return results;`,
    hints: ['return rawReward + shaping;'],
    solution: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,
    explanation: 'Total reward is what the agent optimizes during training.',
  },
  {
    id: 'rs-total-step-calc',
    stepLabel: '66.3',
    group: 'Shaped reward step',
    title: 'Total shaped step reward',
    concept: 'Reward shaping accelerates learning in sparse environments by adding informative intermediate signal.',
    objective: 'Compute shaping and add it to rawReward in one function.',
    difficulty: 'core',
    starterCode: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  const total = rawReward + shaping;
  // TODO: return total
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('negative shaping', totalShapedReward(1, 5, 2, 0.9), -2.2);
return results;`,
    hints: ['return total;'],
    solution: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,
    explanation: 'Shaped rewards make long horizons easier to credit assign.',
  },
  {
    id: 'rs-zero-potential',
    stepLabel: '66.4',
    group: 'Shaped reward step',
    title: 'Zero potential passthrough',
    concept: 'When current and next potentials are both zero, shaping vanishes and only raw reward remains.',
    objective: 'Return rawReward when phiCurrent and phiNext are both 0.',
    difficulty: 'core',
    starterCode: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  // TODO: if phiCurrent === 0 && phiNext === 0, return rawReward
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('no shaping', totalShapedReward(4, 0, 0, 0.9), 4);
return results;`,
    hints: ['if (phiCurrent === 0 && phiNext === 0) return rawReward;'],
    solution: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  if (phiCurrent === 0 && phiNext === 0) return rawReward;
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,
    explanation: 'Zero potentials recover unshaped RL when no heuristic is available.',
  },

  // --- grpo-reasoning ---
  {
    id: 'grpo-reasoning-sum',
    stepLabel: '67.1',
    group: 'Relative advantage',
    title: 'Group score sum',
    concept: 'GRPO compares rewards within a sampled group. The sum is the first step toward the group baseline.',
    objective: 'Compute the sum of all scores inside getRelativeAdvantages.',
    difficulty: 'warmup',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  // TODO: compute sum of scores
  const sum = 0;
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const adv = getRelativeAdvantages([2, 4, 6]);
check('below mean negative', adv[0] < 0, true);
check('above mean positive', adv[2] > 0, true);
return results;`,
    hints: ['const sum = scores.reduce((acc, s) => acc + s, 0);'],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'Group sums anchor the relative baseline used by GRPO.',
  },
  {
    id: 'grpo-reasoning-mean',
    stepLabel: '67.2',
    group: 'Relative advantage',
    title: 'Group baseline mean',
    concept: 'The group mean is the average reward for the sampled answers at the current policy.',
    objective: 'Compute mean = sum / n.',
    difficulty: 'warmup',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  // TODO: compute mean
  const mean = 0;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('mean centered middle', getRelativeAdvantages([2, 4, 6])[1], 0);
return results;`,
    hints: ['const mean = sum / n;'],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'Subtracting the mean centers advantages around zero.',
  },
  {
    id: 'grpo-reasoning-center',
    stepLabel: '67.3',
    group: 'Relative advantage',
    title: 'Centered scores',
    concept: 'Centered rewards show which samples beat the group average before normalization.',
    objective: 'Push scores[i] - mean before dividing by std.',
    difficulty: 'warmup',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: push scores[i] - mean
    advantages.push(0);
  }
  return advantages;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('centered scores', getRelativeAdvantages([2, 4, 6]), [-2, 0, 2]);
return results;`,
    hints: ['advantages.push(scores[i] - mean);'],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push(scores[i] - mean);
  }
  return advantages;
}`,
    explanation: 'Centered scores are the unscaled GRPO advantages.',
  },
  {
    id: 'grpo-reasoning-advantage',
    stepLabel: '67.4',
    group: 'Relative advantage',
    title: 'GRPO relative advantage',
    concept: 'Final GRPO advantages divide centered scores by the group standard deviation.',
    objective: 'Return (scores[i] - mean) / std for each score.',
    difficulty: 'core',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: push (scores[i] - mean) / std
    advantages.push(scores[i] - mean);
  }
  return advantages;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('standardized advantages', getRelativeAdvantages([2, 4, 6]), [-1.22474, 0, 1.22474]);
check('zero variance', getRelativeAdvantages([3, 3, 3]), [0, 0, 0]);
return results;`,
    hints: ['advantages.push((scores[i] - mean) / std);'],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  if (n === 0) return [];
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'Standardized group advantages replace critic networks in GRPO training.',
  },

  // --- dapo-reasoning-rl ---
  {
    id: 'dapo-clip-reward',
    stepLabel: '68.1',
    group: 'DAPO advantage',
    title: 'Reward clipping',
    concept: 'DAPO clips reward to bounded interval for stability.',
    objective: 'Compute clipped reward in [low, high].',
    difficulty: 'warmup',
    starterCode: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  // TODO: clip reward
  const clipped = reward;
  return clipped;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('clip high', dapoAdvantage(3, 0.8, 0.4, 0.5, -2, 2), 2);
return results;`,
    hints: ['const clipped = Math.max(low, Math.min(high, reward));'],
    solution: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  return clipped;
}`,
    explanation: 'Clipping prevents outlier rewards from dominating policy updates.',
  },
  {
    id: 'dapo-kl-penalty',
    stepLabel: '68.2',
    group: 'DAPO advantage',
    title: 'KL penalty term',
    concept: 'DAPO subtracts beta * log(policy/ref) as regularization.',
    objective: 'Compute penalty term.',
    difficulty: 'warmup',
    starterCode: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  // TODO: penalty = beta * Math.log(probPol / probRef)
  const penalty = 0;
  return penalty;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('penalty', dapoAdvantage(2, 0.8, 0.4, 0.5, -2, 2), 0.346574);
return results;`,
    hints: ['const penalty = beta * Math.log(probPol / probRef);'],
    solution: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  const penalty = beta * Math.log(probPol / probRef);
  return penalty;
}`,
    explanation: 'Penalty discourages excessive drift from reference behavior.',
  },
  {
    id: 'dapo-adv-core',
    stepLabel: '68.3',
    group: 'DAPO advantage',
    title: 'Decoupled advantage',
    concept: 'DAPO advantage is clipped reward minus KL penalty.',
    objective: 'Return clipped - penalty.',
    difficulty: 'core',
    starterCode: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  const penalty = beta * Math.log(probPol / probRef);
  // TODO: compute final advantage
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('dapo advantage', dapoAdvantage(2, 0.8, 0.4, 0.5, -2, 2), 1.653426);
return results;`,
    hints: ['return clipped - penalty;'],
    solution: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  const penalty = beta * Math.log(probPol / probRef);
  return clipped - penalty;
}`,
    explanation: 'This combines bounded rewards with conservative policy regularization.',
  },
  {
    id: 'dapo-adv-safe',
    stepLabel: '68.4',
    group: 'DAPO advantage',
    title: 'Numerically safe DAPO advantage',
    concept: 'Probability guards avoid invalid logs.',
    objective: 'Return clipped reward if probPol<=0 or probRef<=0.',
    difficulty: 'core',
    starterCode: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  // TODO: guard invalid probabilities
  const penalty = beta * Math.log(probPol / probRef);
  return clipped - penalty;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('invalid probs', dapoAdvantage(1, 0, 0.4, 0.5, -2, 2), 1);
return results;`,
    hints: ['if (probPol <= 0 || probRef <= 0) return clipped;'],
    solution: `function dapoAdvantage(reward, probPol, probRef, beta, low, high) {
  const clipped = Math.max(low, Math.min(high, reward));
  if (probPol <= 0 || probRef <= 0) return clipped;
  const penalty = beta * Math.log(probPol / probRef);
  return clipped - penalty;
}`,
    explanation: 'Safe guards keep optimization loops from crashing on bad inputs.',
  },
  // --- markov-chains ---
  {
    id: 'markov-next-dist',
    stepLabel: '69.1',
    group: 'Markov chain step',
    title: 'One-step distribution multiply',
    concept: 'Next state distribution is row-vector times transition matrix.',
    objective: 'Compute nextDist = stateDist * P.',
    difficulty: 'warmup',
    starterCode: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      // TODO: accumulate stateDist[i] * P[i][j]
      sum += 0;
    }
    nextDist[j] = sum;
  }
  return { nextDist, isStationary: false };
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('next dist', markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).nextDist, [0.58,0.42]);
return results;`,
    hints: ['sum += stateDist[i] * P[i][j];'],
    solution: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += stateDist[i] * P[i][j];
    }
    nextDist[j] = sum;
  }
  return { nextDist, isStationary: false };
}`,
    explanation: 'This is the core linear step in Markov dynamics.',
  },
  {
    id: 'markov-pi-next',
    stepLabel: '69.2',
    group: 'Markov chain step',
    title: 'Stationary candidate transition',
    concept: 'Stationary check compares piP against pi.',
    objective: 'Compute piNext = pi * P.',
    difficulty: 'warmup',
    starterCode: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  // TODO: fill piNext via pi * P
  return { nextDist, isStationary: piNext[0] };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('piNext[0]', markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).isStationary, 4/7);
return results;`,
    hints: ['same matrix multiply loop using pi instead of stateDist'],
    solution: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  return { nextDist, isStationary: piNext[0] };
}`,
    explanation: 'Stationary candidates remain unchanged by transition dynamics.',
  },
  {
    id: 'markov-stationary-check',
    stepLabel: '69.3',
    group: 'Markov chain step',
    title: 'Tolerance-based stationary check',
    concept: 'Numerical stationary checks use absolute tolerance.',
    objective: 'Set isStationary true only if all |piNext[i]-pi[i]| <= tol.',
    difficulty: 'core',
    starterCode: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  // TODO: implement tolerance check
  const isStationary = false;
  return { nextDist, isStationary };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('stationary true', markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).isStationary, true);
check('stationary false', markovAnalyze([0.6,0.4], P, [0.6,0.4], 1e-5).isStationary, false);
return results;`,
    hints: ['use loop and break on first mismatch > tol'],
    solution: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) {
    if (Math.abs(piNext[i] - pi[i]) > tol) {
      isStationary = false;
      break;
    }
  }
  return { nextDist, isStationary };
}`,
    explanation: 'Tolerance makes stationary checks robust to floating-point noise.',
  },
  {
    id: 'markov-normalize-next',
    stepLabel: '69.4',
    group: 'Markov chain step',
    title: 'Normalize next distribution',
    concept: 'Small numeric drift can slightly break sum-to-one property.',
    objective: 'Normalize nextDist by its sum when sum > 0.',
    difficulty: 'core',
    starterCode: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  // TODO: normalize nextDist
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
const out = markovAnalyze([0.6,0.4], P, [4/7,3/7], 1e-5).nextDist;
check('sum one', out[0] + out[1], 1);
return results;`,
    hints: ['const total = nextDist.reduce((s, v) => s + v, 0); if (total > 0) divide each by total'],
    solution: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const total = nextDist.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < nextDist.length; i++) nextDist[i] /= total;
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}`,
    explanation: 'Normalization preserves probabilistic interpretation after computation.',
  },
  {
    id: 'markov-step-full',
    stepLabel: '69.5',
    group: 'Markov chain step',
    title: 'Complete Markov analysis step',
    concept: 'Final helper reports both transition output and stationarity status.',
    objective: 'Return false stationarity when pi length mismatches matrix size.',
    difficulty: 'core',
    starterCode: `function markovAnalyze(stateDist, P, pi, tol) {
  // TODO: guard mismatched pi size
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const total = nextDist.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < nextDist.length; i++) nextDist[i] /= total;
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [[0.7,0.3],[0.4,0.6]];
check('pi mismatch', markovAnalyze([0.6,0.4], P, [1], 1e-5).isStationary, false);
return results;`,
    hints: ['if (pi.length !== P.length) return { nextDist, isStationary: false };'],
    solution: `function markovAnalyze(stateDist, P, pi, tol) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += stateDist[i] * P[i][j];
    nextDist[j] = sum;
  }
  const total = nextDist.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < nextDist.length; i++) nextDist[i] /= total;
  if (pi.length !== P.length) return { nextDist, isStationary: false };
  const piNext = Array(pi.length).fill(0);
  for (let j = 0; j < pi.length; j++) {
    let sum = 0;
    for (let i = 0; i < pi.length; i++) sum += pi[i] * P[i][j];
    piNext[j] = sum;
  }
  let isStationary = true;
  for (let i = 0; i < pi.length; i++) if (Math.abs(piNext[i] - pi[i]) > tol) isStationary = false;
  return { nextDist, isStationary };
}`,
    explanation: 'A complete step function supports both simulation and diagnostics.',
  },
];
