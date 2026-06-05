export const REINFORCEMENT_LEARNING_CODE_LABS = [
  // --- rl-foundations ---
  {
    id: 'rl-one-step-return',
    stepLabel: '58.1',
    group: 'One-step return',
    title: 'One-Step Expected Return',
    concept: 'In reinforcement learning, the state-action value can be estimated using the immediate reward and the discounted future value of the next state.',
    objective: 'Compute the one-step temporal difference return: r + gamma * nextValue.',
    difficulty: 'warmup',
    starterCode: `function oneStepReturn(reward, nextValue, gamma) {
  // TODO: compute and return r + gamma * nextValue
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('normal return', oneStepReturn(2.0, 10.0, 0.9), 11.0);
check('zero discount', oneStepReturn(5.0, 10.0, 0.0), 5.0);
return results;`,
    hints: [
      'Multiply nextValue by gamma, then add reward.',
      'return reward + gamma * nextValue;',
    ],
    solution: `function oneStepReturn(reward, nextValue, gamma) {
  return reward + gamma * nextValue;
}`,
    explanation: 'The one-step return is the fundamental building block of TD learning and Bellman backups.',
  },
  {
    id: 'rl-discount-chain-calc',
    stepLabel: '58.2',
    group: 'Discount chain',
    title: 'Discounted Episode Return',
    concept: 'The total discounted return of an episode trajectory is the sum of rewards weighted by exponentially decaying discount factor: G = sum(gamma^t * r_t).',
    objective: 'Calculate the total discounted return for a list of rewards.',
    difficulty: 'core',
    starterCode: `function discountedReturn(rewards, gamma) {
  let g = 0;
  // TODO: compute the sum of gamma^t * rewards[t] for t from 0 to rewards.length - 1
  return g;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('decaying rewards', discountedReturn([1, 2, 4], 0.5), 3.0);
return results;`,
    hints: [
      'Use a loop. Keep track of the current discount factor power, starting at 1 (gamma^0).',
      'For each step, add rewards[t] * discount to g, then set discount *= gamma.',
    ],
    solution: `function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}`,
    explanation: 'Discounting weights immediate rewards higher than future ones, representing urgency or uncertainty in long-term outcomes.',
  },

  // --- mdp-formalism ---
  {
    id: 'mdp-transition-sum',
    stepLabel: '59.1',
    group: 'Transition sum',
    title: 'Transition Probability Verification',
    concept: 'An MDP transition model maps state-action pairs to a probability distribution over next states. The sum of these probabilities must be exactly 1.',
    objective: 'Verify that transition probabilities sum to 1 within a small numeric tolerance.',
    difficulty: 'warmup',
    starterCode: `function verifyTransitionDistribution(probs) {
  let sum = 0;
  for (let i = 0; i < probs.length; i++) {
    // TODO: accumulate probabilities
    sum += 0;
  }
  return Math.abs(sum - 1.0) < 1e-5;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('valid distribution', verifyTransitionDistribution([0.1, 0.6, 0.3]), true);
check('invalid distribution', verifyTransitionDistribution([0.1, 0.6, 0.2]), false);
return results;`,
    hints: [
      'Accumulate probs[i] into sum.',
      'sum += probs[i];',
    ],
    solution: `function verifyTransitionDistribution(probs) {
  let sum = 0;
  for (let i = 0; i < probs.length; i++) {
    sum += probs[i];
  }
  return Math.abs(sum - 1.0) < 1e-5;
}`,
    explanation: 'Transition dynamics must form a valid probability distribution to conserve system state dynamics.',
  },
  {
    id: 'mdp-bellman-expectation-calc',
    stepLabel: '59.2',
    group: 'Gamma discount',
    title: 'Bellman Expectation Backup',
    concept: 'The Bellman Expectation Equation expresses the value of a state under policy pi: V(s) = sum_a pi(a|s) sum_s\' P(s\'|s,a) [R(s,a,s\') + gamma * V(s\')].',
    objective: 'Implement the nested expectation backup sum.',
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
      
      // TODO: accumulate the expected return component into qAction
      qAction += 0;
    }
    
    vState += actionProb * qAction;
  }
  
  return vState;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [[0.5, 0.5]];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('expectation backup', bellmanExpectation(pi, P, R, V, 0.9, 2, 2, 0), 19.975);
return results;`,
    hints: [
      'The component is transProb * (reward + gamma * nextVal).',
      'qAction += transProb * (reward + gamma * nextVal);',
    ],
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
    explanation: 'The Bellman expectation equation defines a linear mapping whose unique fixed point is the true state-value function under policy pi.',
  },

  // --- value-iteration ---
  {
    id: 'vi-q-value-calc',
    stepLabel: '60.1',
    group: 'Max over actions',
    title: 'Value Iteration Action Value',
    concept: 'Value iteration updates states by maximizing action-values (Q-values) directly: Q(s,a) = sum_s\' P(s\'|s,a) [R(s,a,s\') + gamma * V(s\')].',
    objective: 'Compute the Q-value for a specific action state transition.',
    difficulty: 'warmup',
    starterCode: `function computeQValue(P, R, V, state, action, gamma, numStates) {
  let qValue = 0;
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    // TODO: accumulate transition return in qValue
    qValue += 0;
  }
  return qValue;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2]]];
const R = [[[10, 0]]];
const V = [5, 10];
check('compute action Q', computeQValue(P, R, V, 0, 0, 0.9, 2), 13.4);
return results;`,
    hints: [
      'Add transProb * (reward + gamma * nextVal) to qValue.',
    ],
    solution: `function computeQValue(P, R, V, state, action, gamma, numStates) {
  let qValue = 0;
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    qValue += transProb * (reward + gamma * nextVal);
  }
  return qValue;
}`,
    explanation: 'Action values represent expected discounted utilities, forming the basis for policy choices.',
  },
  {
    id: 'vi-backup-once',
    stepLabel: '60.2',
    group: 'Backup once',
    title: 'Value Iteration Update',
    concept: 'One step of value iteration updates V(s) by taking the maximum Q-value over all actions: V(s) = max_a Q(s,a).',
    objective: 'Compute the updated value V(s) by choosing the optimal action.',
    difficulty: 'core',
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
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('value iteration update', valueIterationUpdate(P, R, V, 0, 0.9, 2, 2), 26.55);
return results;`,
    hints: [
      'If qValue > maxQ, update maxQ = qValue.',
    ],
    solution: `function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) {
      maxQ = qValue;
    }
  }
  
  return maxQ;
}`,
    explanation: 'Value iteration converges to the optimal state-value function, bypassing explicit policy representations.',
  },

  // --- policy-iteration ---
  {
    id: 'pi-eval-step-calc',
    stepLabel: '61.1',
    group: 'Eval backup',
    title: 'Policy Evaluation Step',
    concept: 'Policy evaluation solves Bellman equations for a fixed policy: V_k+1(s) = sum_s\' P(s\'|s, pi(s)) [R(s, pi(s), s\') + gamma * V_k(s\')].',
    objective: 'Compute one policy evaluation step update for state s.',
    difficulty: 'warmup',
    starterCode: `function policyEvalStep(pi, P, R, V, state, gamma, numStates) {
  const action = pi[state];
  let newValue = 0;
  
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    // TODO: accumulate expected utility in newValue
    newValue += 0;
  }
  
  return newValue;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const pi = [1];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('eval backup action 1', policyEvalStep(pi, P, R, V, 0, 0.9, 2), 26.55);
return results;`,
    hints: [
      'Multiply transProb by (reward + gamma * nextVal) and add to newValue.',
    ],
    solution: `function policyEvalStep(pi, P, R, V, state, gamma, numStates) {
  const action = pi[state];
  let newValue = 0;
  
  for (let sNext = 0; sNext < numStates; sNext++) {
    const transProb = P[state][action][sNext];
    const reward = R[state][action][sNext];
    const nextVal = V[sNext];
    newValue += transProb * (reward + gamma * nextVal);
  }
  
  return newValue;
}`,
    explanation: 'Evaluating policies determines their exact utility values, guiding directional improvements.',
  },
  {
    id: 'pi-greedy-improve',
    stepLabel: '61.2',
    group: 'Greedy improve',
    title: 'Policy Improvement Step',
    concept: 'Policy improvement creates a better policy by acting greedily with respect to current state-values: pi\'(s) = argmax_a Q(s,a).',
    objective: 'Select the optimal action index that maximizes Q-values.',
    difficulty: 'core',
    starterCode: `function policyImprovement(P, R, V, state, gamma, numActions, numStates) {
  let bestAction = 0;
  let maxQ = -Infinity;
  
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    // TODO: if qValue > maxQ, update maxQ and bestAction
  }
  
  return bestAction;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('greedy improvement', policyImprovement(P, R, V, 0, 0.9, 2, 2), 1);
return results;`,
    hints: [
      'If qValue is strictly greater than maxQ, update maxQ = qValue and set bestAction = a.',
    ],
    solution: `function policyImprovement(P, R, V, state, gamma, numActions, numStates) {
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
    explanation: 'Policy improvement guarantees monotonic policy utility increases, concluding when the policy becomes optimal.',
  },

  // --- q-learning ---
  {
    id: 'q-learning-select-action',
    stepLabel: '62.1',
    group: 'Epsilon-greedy selection',
    title: 'Epsilon-Greedy Action Selection',
    concept: 'Epsilon-greedy selection balances exploration and exploitation. With probability epsilon, a random action is chosen. Otherwise, the action with the maximum Q-value is selected.',
    objective: 'Implement epsilon-greedy action selection, returning the random action index if randVal < epsilon, otherwise finding the argmax index in qValues.',
    difficulty: 'warmup',
    starterCode: `/**
 * Selects an action using the epsilon-greedy policy.
 * @param {number[]} qValues - The Q-values for all possible actions in the current state.
 * @param {number} epsilon - The probability of exploring (choosing a random action).
 * @param {number} randVal - A pre-sampled random value in [0, 1) to determine exploration.
 * @param {number} randAction - A pre-sampled random action index.
 * @returns {number} The selected action index.
 */
function selectAction(qValues, epsilon, randVal, randAction) {
  if (qValues.length === 0) return 0;
  // TODO: Implement epsilon-greedy logic
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('explore random choice', selectAction([1.5, 3.0, 2.0], 0.2, 0.1, 0), 0);
check('exploit best choice 1', selectAction([1.5, 3.0, 2.0], 0.2, 0.5, 1), 1);
check('exploit best choice 2', selectAction([-5, -2, -10], 0.1, 0.3, 2), 1);
check('empty q-values fallback', selectAction([], 0.2, 0.5, 1), 0);
check('explore bound check', selectAction([1.5, 3.0, 2.0], 0.5, 0.499, 2), 2);
return results;`,
    hints: [
      'Check if randVal < epsilon. If so, return randAction.',
      'Otherwise, find the index of the maximum value in qValues.',
      'Initialize maxIdx = 0, loop through, and update when qValues[i] > qValues[maxIdx].',
    ],
    solution: `/**
 * Selects an action using the epsilon-greedy policy.
 * @param {number[]} qValues - The Q-values for all possible actions in the current state.
 * @param {number} epsilon - The probability of exploring (choosing a random action).
 * @param {number} randVal - A pre-sampled random value in [0, 1) to determine exploration.
 * @param {number} randAction - A pre-sampled random action index.
 * @returns {number} The selected action index.
 */
function selectAction(qValues, epsilon, randVal, randAction) {
  if (qValues.length === 0) return 0;
  if (randVal < epsilon) {
    return randAction;
  }
  let maxIdx = 0;
  for (let i = 1; i < qValues.length; i++) {
    if (qValues[i] > qValues[maxIdx]) {
      maxIdx = i;
    }
  }
  return maxIdx;
}`,
    explanation: 'Exploration enables discovery of new paths, while exploitation leverages the best known actions based on current estimated values.',
  },
  {
    id: 'q-learning-td-target',
    stepLabel: '62.2',
    group: 'Terminal-aware TD target',
    title: 'Terminal-Aware TD Target',
    concept: 'Q-learning estimates target value for state-action updates. If the next state is non-terminal, target = reward + gamma * max(Q(s\', a\')). If next state is terminal, the agent cannot take further actions, so target = reward.',
    objective: 'Compute the TD target, handling empty nextStateQValues (terminal states) by setting the future value contribution to zero.',
    difficulty: 'core',
    starterCode: `/**
 * Computes the temporal difference (TD) target for a transition.
 * @param {number} reward - Immediate reward received.
 * @param {number[]} nextStateQValues - The Q-values of the next state (empty if terminal).
 * @param {number} gamma - Discount factor.
 * @returns {number} The temporal difference target.
 */
function getTdTarget(reward, nextStateQValues, gamma) {
  // TODO: Compute TD target, returning reward alone if nextStateQValues is empty.
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('happy path non-terminal', getTdTarget(2.0, [5.0, 10.0, 3.0], 0.9), 11.0);
check('terminal state (empty Q)', getTdTarget(1.5, [], 0.9), 1.5);
check('zero discount test', getTdTarget(3.0, [10, 20], 0.0), 3.0);
check('negative reward non-terminal', getTdTarget(-1.0, [-2.0, -5.0], 0.5), -2.0);
check('all negative terminal', getTdTarget(-5.0, [], 0.9), -5.0);
return results;`,
    hints: [
      'If nextStateQValues.length === 0, return reward directly.',
      'Otherwise, find the maximum next Q-value: Math.max(...nextStateQValues).',
      'Multiply the maximum next Q-value by gamma and add the reward.',
    ],
    solution: `/**
 * Computes the temporal difference (TD) target for a transition.
 * @param {number} reward - Immediate reward received.
 * @param {number[]} nextStateQValues - The Q-values of the next state (empty if terminal).
 * @param {number} gamma - Discount factor.
 * @returns {number} The temporal difference target.
 */
function getTdTarget(reward, nextStateQValues, gamma) {
  if (!nextStateQValues || nextStateQValues.length === 0) {
    return reward;
  }
  let maxNextQ = nextStateQValues[0];
  for (let i = 1; i < nextStateQValues.length; i++) {
    if (nextStateQValues[i] > maxNextQ) {
      maxNextQ = nextStateQValues[i];
    }
  }
  return reward + gamma * maxNextQ;
}`,
    explanation: 'A terminal state has no future actions, preventing it from inheriting discounted successor values.',
  },
  {
    id: 'q-learning-update-step',
    stepLabel: '62.3',
    group: 'Tabular Q-update',
    title: 'Q-Value Temporal Difference Update',
    concept: 'Temporal difference updates blend the new target estimate with the old estimate using a learning rate: Q_new = (1 - alpha) * Q_old + alpha * Target.',
    objective: 'Compute the updated Q-value.',
    difficulty: 'core',
    starterCode: `/**
 * Performs a temporal difference blending update on a Q-value.
 * @param {number} currentQ - The current Q-value estimate.
 * @param {number} tdTarget - The target Q-value estimate.
 * @param {number} alpha - The learning rate.
 * @returns {number} The updated Q-value estimate.
 */
function updateQValue(currentQ, tdTarget, alpha) {
  // TODO: Compute updated Q-value using alpha blending
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard blend update', updateQValue(4.0, 10.0, 0.1), 4.6);
check('zero learning rate (no change)', updateQValue(5.0, 12.0, 0.0), 5.0);
check('unit learning rate (full overwrite)', updateQValue(3.0, 8.5, 1.0), 8.5);
check('negative values blend', updateQValue(-2.0, -10.0, 0.25), -4.0);
check('exact match check', updateQValue(7.5, 7.5, 0.5), 7.5);
return results;`,
    hints: [
      'Use formula: currentQ + alpha * (tdTarget - currentQ).',
      'Or equivalent: (1 - alpha) * currentQ + alpha * tdTarget.',
    ],
    solution: `/**
 * Performs a temporal difference blending update on a Q-value.
 * @param {number} currentQ - The current Q-value estimate.
 * @param {number} tdTarget - The target Q-value estimate.
 * @param {number} alpha - The learning rate.
 * @returns {number} The updated Q-value estimate.
 */
function updateQValue(currentQ, tdTarget, alpha) {
  return currentQ + alpha * (tdTarget - currentQ);
}`,
    explanation: 'The learning rate alpha acts as a low-pass filter, preventing sudden updates from single stochastic transitions.',
  },
  {
    id: 'q-learning-full-step',
    stepLabel: '62.4',
    group: 'Complete agent step',
    title: 'Complete Tabular Q-Learning Step',
    concept: 'A full Q-learning step transitions the agent and updates its Q-table state in-place given experience parameters.',
    objective: 'Implement the update of the Q-table in-place, returning the updated cell value.',
    difficulty: 'challenge',
    starterCode: `/**
 * Performs a complete step of tabular Q-learning, updating the qTable in-place.
 * @param {number[][]} qTable - The 2D table representing Q(state, action).
 * @param {number} state - The current state index.
 * @param {number} action - The action index taken.
 * @param {number} reward - Immediate reward received.
 * @param {number} nextState - The successor state index.
 * @param {boolean} isTerminal - Whether the nextState is terminal.
 * @param {number} alpha - Learning rate.
 * @param {number} gamma - Discount factor.
 * @returns {number} The newly updated Q-value Q(state, action).
 */
function qLearningStep(qTable, state, action, reward, nextState, isTerminal, alpha, gamma) {
  // TODO: Update qTable[state][action] and return the new value.
  // Note: Handle terminal states where no future actions exist.
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const qTable = [
  [1.0, 2.0],
  [3.0, 4.0]
];
const val1 = qLearningStep(qTable, 0, 1, 1.5, 1, false, 0.5, 0.9);
check('q-learning step non-terminal', val1, 3.55);
check('qTable update verification', qTable[0][1], 3.55);
const val2 = qLearningStep(qTable, 1, 0, 2.5, 0, true, 0.2, 0.9);
check('q-learning step terminal', val2, 2.9);
check('qTable terminal update verification', qTable[1][0], 2.9);
return results;`,
    hints: [
      'Look up currentQ = qTable[state][action].',
      'Determine nextStateQValues. If isTerminal is true, use an empty array []. Otherwise, use qTable[nextState].',
      'Compute the TD target using getTdTarget helper logic (reward + gamma * maxNextQ if not terminal).',
      'Compute the updated value and assign it to qTable[state][action]. Return that value.',
    ],
    solution: `/**
 * Performs a complete step of tabular Q-learning, updating the qTable in-place.
 * @param {number[][]} qTable - The 2D table representing Q(state, action).
 * @param {number} state - The current state index.
 * @param {number} action - The action index taken.
 * @param {number} reward - Immediate reward received.
 * @param {number} nextState - The successor state index.
 * @param {boolean} isTerminal - Whether the nextState is terminal.
 * @param {number} alpha - Learning rate.
 * @param {number} gamma - Discount factor.
 * @returns {number} The newly updated Q-value Q(state, action).
 */
function qLearningStep(qTable, state, action, reward, nextState, isTerminal, alpha, gamma) {
  const currentQ = qTable[state][action];
  let maxNextQ = 0;
  if (!isTerminal) {
    const nextQValues = qTable[nextState];
    maxNextQ = nextQValues[0];
    for (let i = 1; i < nextQValues.length; i++) {
      if (nextQValues[i] > maxNextQ) {
        maxNextQ = nextQValues[i];
      }
    }
  }
  const tdTarget = isTerminal ? reward : reward + gamma * maxNextQ;
  const updatedQ = currentQ + alpha * (tdTarget - currentQ);
  qTable[state][action] = updatedQ;
  return updatedQ;
}`,
    explanation: 'Integrating state transition observations, terminal conditions, and action-value tables represents the core step of reinforcement learning.',
  },

  // --- rl-exploration ---
  {
    id: 'exploration-epsilon-greedy',
    stepLabel: '63.1',
    group: 'Epsilon mix',
    title: 'Epsilon-Greedy Exploration',
    concept: 'Epsilon-greedy explores by choosing random actions with probability epsilon, and exploiting best actions otherwise.',
    objective: 'Select action index according to epsilon-greedy selection probabilities.',
    difficulty: 'warmup',
    starterCode: `function selectAction(qValues, epsilon, randomVal, randomActionIdx) {
  // randomVal is a float in [0, 1)
  // randomActionIdx is a random action index in [0, qValues.length - 1]
  // TODO: return randomActionIdx if randomVal < epsilon.
  // Otherwise, return index of action with highest value in qValues.
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('explore random choice', selectAction([1.5, 3.0, 2.0], 0.2, 0.1, 0), 0);
check('exploit best choice', selectAction([1.5, 3.0, 2.0], 0.2, 0.5, 0), 1);
return results;`,
    hints: [
      'Check if randomVal < epsilon.',
      'If true, return randomActionIdx.',
      'Else find index associated with maximum value in qValues.',
    ],
    solution: `function selectAction(qValues, epsilon, randomVal, randomActionIdx) {
  if (randomVal < epsilon) {
    return randomActionIdx;
  }
  let bestIdx = 0;
  let maxVal = qValues[0];
  for (let i = 1; i < qValues.length; i++) {
    if (qValues[i] > maxVal) {
      maxVal = qValues[i];
      bestIdx = i;
    }
  }
  return bestIdx;
}`,
    explanation: 'Epsilon-greedy acts as a simple mechanism balancing exploratory sample gathering against utility exploitation.',
  },
  {
    id: 'exploration-ucb-score',
    stepLabel: '63.2',
    group: 'UCB formula',
    title: 'UCB1 Score Calculation',
    concept: 'The Upper Confidence Bound (UCB1) formula selects actions by adding an uncertainty bonus: Score = mean + c * sqrt(ln(t) / n).',
    objective: 'Calculate the UCB1 score for an action.',
    difficulty: 'core',
    starterCode: `function getUcbScore(mean, n, t, c = 2.0) {
  if (n === 0) return Infinity;
  // TODO: compute and return mean + c * sqrt(ln(t) / n)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-4) {
  if (a === Infinity && b === Infinity) return true;
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('unvisited action', getUcbScore(5, 0, 100), Infinity);
check('visited action score', getUcbScore(3.5, 10, 100, 2.0), 4.857228);
return results;`,
    hints: [
      'If n is 0, return Infinity.',
      'The math is: mean + c * Math.sqrt(Math.log(t) / n).',
    ],
    solution: `function getUcbScore(mean, n, t, c = 2.0) {
  if (n === 0) return Infinity;
  return mean + c * Math.sqrt(Math.log(t) / n);
}`,
    explanation: 'UCB implements optimism in the face of uncertainty, choosing actions that are either high performing or highly uncertain.',
  },

  // --- policy-gradients ---
  {
    id: 'pg-baseline-subtract',
    stepLabel: '64.1',
    group: 'Baseline subtract',
    title: 'Policy Gradient Baseline Subtraction',
    concept: 'Subtracting a state baseline V(s) from returns reduces gradient variance without altering expectation values.',
    objective: 'Compute the policy gradient surrogate scalar multiplier: returnVal - baseline.',
    difficulty: 'warmup',
    starterCode: `function computeAdvantage(returnVal, baseline) {
  // TODO: return returnVal - baseline
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive advantage', computeAdvantage(10.0, 7.5), 2.5);
check('negative advantage', computeAdvantage(5.0, 7.5), -2.5);
return results;`,
    hints: [
      'Subtract baseline from returnVal.',
      'return returnVal - baseline;',
    ],
    solution: `function computeAdvantage(returnVal, baseline) {
  return returnVal - baseline;
}`,
    explanation: 'Advantage measures whether actions performed better or worse than the baseline average expected output.',
  },
  {
    id: 'pg-surrogate-loss',
    stepLabel: '64.2',
    group: 'Return multiply',
    title: 'Policy Gradient Surrogate Gradient Weight',
    concept: 'Surrogate gradient targets multiply log probability gradients by the advantage value: Grad_Weight = log_prob_gradient * advantage.',
    objective: 'Compute the surrogate gradient weight.',
    difficulty: 'core',
    starterCode: `function getPolicyGradientWeight(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  // TODO: return logProbGrad multiplied by advantage
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive scale step', getPolicyGradientWeight(0.5, 10.0, 6.0), 2.0);
check('negative scale step', getPolicyGradientWeight(0.5, 2.0, 6.0), -2.0);
return results;`,
    hints: [
      'Multiply logProbGrad by advantage.',
    ],
    solution: `function getPolicyGradientWeight(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}`,
    explanation: 'Surrogate weights scale parameter updates, promoting actions with positive advantage and suppressing those with negative advantage.',
  },

  // --- actor-critic ---
  {
    id: 'ac-td-error-calc',
    stepLabel: '65.1',
    group: 'TD error',
    title: 'Actor-Critic TD Error',
    concept: 'The actor-critic advantage is estimated using temporal difference error: delta = reward + gamma * nextValue - currentValue.',
    objective: 'Compute the TD error delta.',
    difficulty: 'warmup',
    starterCode: `function getActorCriticTdError(reward, currentValue, nextValue, gamma) {
  // TODO: compute and return TD error delta
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive error', getActorCriticTdError(2.0, 8.0, 10.0, 0.9), 3.0);
return results;`,
    hints: [
      'Use formula: reward + gamma * nextValue - currentValue.',
    ],
    solution: `function getActorCriticTdError(reward, currentValue, nextValue, gamma) {
  return reward + gamma * nextValue - currentValue;
}`,
    explanation: 'TD error acts as the critic score, assessing if events turned out better than expected.',
  },
  {
    id: 'ac-actor-loss-calc',
    stepLabel: '65.2',
    group: 'Actor log grad',
    title: 'Actor Objective Loss',
    concept: 'Actor networks optimize parameters to maximize expectations by minimizing surrogate loss: Loss = -log_prob * advantage.',
    objective: 'Compute the step loss value.',
    difficulty: 'core',
    starterCode: `function getActorLoss(logProb, advantage) {
  // TODO: return -logProb * advantage
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive advantage loss', getActorLoss(-1.2, 2.0), 2.4);
check('negative advantage loss', getActorLoss(-1.2, -2.0), -2.4);
return results;`,
    hints: [
      'Multiply logProb by advantage, and negate the result.',
    ],
    solution: `function getActorLoss(logProb, advantage) {
  return -logProb * advantage;
}`,
    explanation: 'Minimizing actor loss increases selection likelihood for actions yielding positive TD error advantages.',
  },

  // --- reward-shaping ---
  {
    id: 'rs-shaped-reward-calc',
    stepLabel: '66.1',
    group: 'Potential phi',
    title: 'Potential-Based Shaped Reward',
    concept: 'Shaped rewards add potential offsets to guide exploration: F(s, a, s\') = gamma * phi(s\') - phi(s).',
    objective: 'Compute potential-based shaping term F.',
    difficulty: 'warmup',
    starterCode: `function getPotentialBasedShaping(phiCurrent, phiNext, gamma) {
  // TODO: compute and return gamma * phiNext - phiCurrent
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('potential gain', getPotentialBasedShaping(2.0, 5.0, 0.9), 2.5);
return results;`,
    hints: [
      'Multiply phiNext by gamma and subtract phiCurrent.',
    ],
    solution: `function getPotentialBasedShaping(phiCurrent, phiNext, gamma) {
  return gamma * phiNext - phiCurrent;
}`,
    explanation: 'Potential-based shaping guarantees that optimal policies are not altered, avoiding sub-optimal reward loops.',
  },
  {
    id: 'rs-total-step-calc',
    stepLabel: '66.2',
    group: 'Total step reward',
    title: 'Total Shaped Step Reward',
    concept: 'The total reward sent to the agent is the raw environment reward plus the shaping potential term: R_shaped = R_raw + F.',
    objective: 'Combine raw reward and potential shaping into one total return.',
    difficulty: 'core',
    starterCode: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  // TODO: compute potential shaping and add it to rawReward
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('combined shaping', totalShapedReward(1.0, 2.0, 5.0, 0.9), 3.5);
return results;`,
    hints: [
      'Calculate potential shaping term: gamma * phiNext - phiCurrent.',
      'Add the potential shaping term to rawReward.',
    ],
    solution: `function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}`,
    explanation: 'Shaping rewards speed up learning significantly by providing denser feedback in sparse reward tasks.',
  },

  // --- grpo-reasoning ---
  {
    id: 'grpo-group-mean',
    stepLabel: '67.1',
    group: 'Group mean',
    title: 'GRPO Group Mean',
    concept: 'GRPO computes advantages by comparing student rewards against group performance averages instead of needing critic networks.',
    objective: 'Calculate the average reward score for a group of samples.',
    difficulty: 'warmup',
    starterCode: `function getGroupMean(rewards) {
  if (rewards.length === 0) return 0;
  let sum = 0;
  // TODO: compute sum of rewards and return the mean (average)
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('group mean average', getGroupMean([2.0, 4.0, 6.0]), 4.0);
return results;`,
    hints: [
      'Loop through rewards, sum them up, and divide by rewards.length.',
    ],
    solution: `function getGroupMean(rewards) {
  if (rewards.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < rewards.length; i++) {
    sum += rewards[i];
  }
  return sum / rewards.length;
}`,
    explanation: 'The group mean provides a dynamic baseline representing average sample quality under the current policy.',
  },
  {
    id: 'grpo-relative-rewards',
    stepLabel: '67.2',
    group: 'Relative reward',
    title: 'GRPO Relative Advantage',
    concept: 'GRPO computes advantages by standardizing rewards within a generated group: A_i = (R_i - mean) / std.',
    objective: 'Calculate group standardized advantages, handling zero-variance cases by setting advantages to zero.',
    difficulty: 'core',
    starterCode: `function getGrpoAdvantages(rewards) {
  const n = rewards.length;
  if (n === 0) return [];
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += rewards[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(rewards[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / n);
  
  // TODO: compute (r - mean) / std for each reward.
  // If std is extremely small (< 1e-6), return an array of 0s.
  return [];
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('standard advantages', getGrpoAdvantages([2.0, 4.0, 6.0]), [-1.224744, 0.0, 1.224744]);
check('zero variance advantages', getGrpoAdvantages([4.0, 4.0]), [0.0, 0.0]);
return results;`,
    hints: [
      'If std < 1e-6, return an array of 0s of length n.',
      'Otherwise, map each reward r to (r - mean) / std.',
    ],
    solution: `function getGrpoAdvantages(rewards) {
  const n = rewards.length;
  if (n === 0) return [];
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += rewards[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(rewards[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / n);
  
  if (std < 1e-6) {
    return Array(n).fill(0);
  }
  return rewards.map(r => (r - mean) / std);
}`,
    explanation: 'Standardizing group rewards creates a relative ranking, directing updates strictly toward the top-performing answers.',
  },

  // --- dapo-reasoning-rl ---
  {
    id: 'dapo-reward-clip-calc',
    stepLabel: '68.1',
    group: 'Reward clip',
    title: 'DAPO Reward Clipping',
    concept: 'DAPO prevents policy collapse at scale by clipping reward outliers so gradient scales remain bounded.',
    objective: 'Clip input reward values to stay inside range [low, high].',
    difficulty: 'warmup',
    starterCode: `function dapoClipReward(r, low, high) {
  // TODO: return r clipped between low and high
  return r;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('under upper limit', dapoClipReward(1.5, -2.0, 2.0), 1.5);
check('clipped upper limit', dapoClipReward(3.5, -2.0, 2.0), 2.0);
check('clipped lower limit', dapoClipReward(-3.0, -2.0, 2.0), -2.0);
return results;`,
    hints: [
      'Use Math.max and Math.min.',
      'return Math.max(low, Math.min(high, r));',
    ],
    solution: `function dapoClipReward(r, low, high) {
  return Math.max(low, Math.min(high, r));
}`,
    explanation: 'Restricting outlier feedback prevents individual extreme rollouts from overriding learning gradients.',
  },
  {
    id: 'dapo-decoupled-advantage-calc',
    stepLabel: '68.2',
    group: 'Decoupled baseline',
    title: 'DAPO Decoupled Advantage',
    concept: 'DAPO decouples policy updates from the reference policy using KL penalties: A_dapo = reward - beta * log(pi(a|s) / ref_pi(a|s)).',
    objective: 'Compute decoupled advantage.',
    difficulty: 'core',
    starterCode: `function dapoDecoupledAdvantage(reward, probPolicy, probRef, beta) {
  // TODO: compute and return reward - beta * log(probPolicy / probRef)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('decoupled advantage', dapoDecoupledAdvantage(2.0, 0.8, 0.4, 0.5), 1.653426);
return results;`,
    hints: [
      'Compute ratio: probPolicy / probRef.',
      'Subtract beta * Math.log(ratio) from reward.',
    ],
    solution: `function dapoDecoupledAdvantage(reward, probPolicy, probRef, beta) {
  return reward - beta * Math.log(probPolicy / probRef);
}`,
    explanation: 'Decoupling penalizes shifts away from reference distributions, maintaining training stability at scale.',
  },

  // --- markov-chains ---
  {
    id: 'mc-transition-multiply',
    stepLabel: '69.1',
    group: 'One-step multiply',
    title: 'Markov Transition Step',
    concept: 'A Markov chain steps forward by multiplying the current probability state vector by the transition matrix: p_next = p_current * P.',
    objective: 'Compute the 1-step successor state probability distribution.',
    difficulty: 'warmup',
    starterCode: `function transitionStep(stateDist, transitionMatrix) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      // TODO: multiply stateDist[i] by transitionMatrix[i][j] and accumulate in sum
      sum += 0;
    }
    nextDist[j] = sum;
  }
  
  return nextDist;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const dist = [0.6, 0.4];
const P = [
  [0.7, 0.3],
  [0.4, 0.6]
];
check('transition multiply', transitionStep(dist, P), [0.58, 0.42]);
return results;`,
    hints: [
      'Multiply stateDist[i] by transitionMatrix[i][j].',
      'sum += stateDist[i] * transitionMatrix[i][j];',
    ],
    solution: `function transitionStep(stateDist, transitionMatrix) {
  const n = stateDist.length;
  const nextDist = Array(n).fill(0);
  
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += stateDist[i] * transitionMatrix[i][j];
    }
    nextDist[j] = sum;
  }
  
  return nextDist;
}`,
    explanation: 'Succcessor states are linear combinations of predecessor states weighted by transition probabilities.',
  },
  {
    id: 'mc-stationary-check-step',
    stepLabel: '69.2',
    group: 'Stationary',
    title: 'Stationary Distribution Verification',
    concept: 'A distribution pi is stationary if it remains unchanged after transitions: pi * P === pi.',
    objective: 'Verify if a state distribution is stationary under transition matrix P.',
    difficulty: 'core',
    starterCode: `function checkStationary(pi, P, tol = 1e-5) {
  const n = pi.length;
  // TODO: Multiply pi by P to get the next distribution.
  // Then check if the absolute difference between each element of the next distribution and pi is <= tol.
  // Return true if stationary, else false.
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const P = [
  [0.7, 0.3],
  [0.4, 0.6]
];
check('stationary distribution', checkStationary([4/7, 3/7], P), true);
check('non-stationary distribution', checkStationary([0.6, 0.4], P), false);
return results;`,
    hints: [
      'Compute next distribution nextPi using vector-matrix multiplication nextPi[j] = sum_i pi[i] * P[i][j].',
      'Loop through j and check if Math.abs(nextPi[j] - pi[j]) > tol. If so, return false.',
      'If all elements match, return true.',
    ],
    solution: `function checkStationary(pi, P, tol = 1e-5) {
  const n = pi.length;
  const nextPi = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += pi[i] * P[i][j];
    }
    nextPi[j] = sum;
  }
  
  for (let i = 0; i < n; i++) {
    if (Math.abs(nextPi[i] - pi[i]) > tol) {
      return false;
    }
  }
  return true;
}`,
    explanation: 'A stationary distribution represents the long-term steady-state probability distribution of Markov chains.',
  }
];
