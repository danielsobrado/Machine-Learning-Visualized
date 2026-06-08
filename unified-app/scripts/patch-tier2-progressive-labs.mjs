/**
 * Expands Tier 2 RL two-step labs to 4-step progressive single-function skeletons.
 * Run: node unified-app/scripts/patch-tier2-progressive-labs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function replaceBetween(filePath, startMarker, endMarker, newContent) {
  const fullPath = path.join(ROOT, filePath);
  const src = fs.readFileSync(fullPath, 'utf8');
  const startIdx = src.indexOf(startMarker);
  const endIdx = src.indexOf(endMarker, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${filePath}: ${startMarker}`);
  }
  fs.writeFileSync(fullPath, src.slice(0, startIdx) + newContent + src.slice(endIdx));
  console.log(`Patched ${filePath}`);
}

function patchMappings() {
  const filePath = path.join(ROOT, 'src/labs/lesson-code/lessonCodeLabMappings.js');
  let src = fs.readFileSync(filePath, 'utf8');
  const replacements = [
    ["  'rl-foundations': { source: 'rl', groups: ['One-step return', 'Discount chain'] },",
      "  'rl-foundations': { source: 'rl', groups: ['Discounted return'] },"],
    ["  'mdp-formalism': { source: 'rl', groups: ['Transition sum', 'Gamma discount'] },",
      "  'mdp-formalism': { source: 'rl', groups: ['Bellman expectation'] },"],
    ["  'value-iteration': { source: 'rl', groups: ['Max over actions', 'Backup once'] },",
      "  'value-iteration': { source: 'rl', groups: ['Value iteration step'] },"],
    ["  'policy-iteration': { source: 'rl', groups: ['Eval backup', 'Greedy improve'] },",
      "  'policy-iteration': { source: 'rl', groups: ['Policy iteration step'] },"],
    ["  'rl-exploration': { source: 'rl', groups: ['Epsilon mix', 'UCB formula'] },",
      "  'rl-exploration': { source: 'rl', groups: ['Exploration step'] },"],
    ["  'policy-gradients': { source: 'rl', groups: ['Baseline subtract', 'Return multiply'] },",
      "  'policy-gradients': { source: 'rl', groups: ['Policy gradient step'] },"],
    ["  'actor-critic': { source: 'rl', groups: ['TD error', 'Actor log grad'] },",
      "  'actor-critic': { source: 'rl', groups: ['Actor-critic step'] },"],
    ["  'reward-shaping': { source: 'rl', groups: ['Potential phi', 'Total step reward'] },",
      "  'reward-shaping': { source: 'rl', groups: ['Shaped reward step'] },"],
  ];
  for (const [from, to] of replacements) {
    if (!src.includes(from)) throw new Error(`Mapping not found: ${from}`);
    src = src.replace(from, to);
  }
  fs.writeFileSync(filePath, src);
  console.log('Patched lessonCodeLabMappings.js');
}

const RL_FOUNDATIONS = `  // --- rl-foundations ---
  {
    id: 'rl-return-first',
    stepLabel: '58.1',
    group: 'Discounted return',
    title: 'First reward term',
    concept: 'Discounted episode return starts with the immediate reward at t=0 weighted by gamma^0 = 1.',
    objective: 'Inside discountedReturn, add rewards[0] to g on the first loop iteration.',
    difficulty: 'warmup',
    starterCode: \`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    // TODO: add discount * rewards[t] to g
    discount *= gamma;
  }
  return g;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('single reward', discountedReturn([5], 0.9), 5);
return results;\`,
    hints: ['g += discount * rewards[t];'],
    solution: \`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}\`,
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
    starterCode: \`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    // TODO: discount *= gamma
  }
  return g;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('two-step decay', discountedReturn([1, 1], 0.5), 1.5);
return results;\`,
    hints: ['discount *= gamma;'],
    solution: \`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}\`,
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
    starterCode: \`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    // TODO: add discount * rewards[t] to g, then update discount
    discount *= gamma;
  }
  return g;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('decaying rewards', discountedReturn([1, 2, 4], 0.5), 3.0);
return results;\`,
    hints: ['g += discount * rewards[t]; discount *= gamma;'],
    solution: \`function discountedReturn(rewards, gamma) {
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}\`,
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
    starterCode: \`function discountedReturn(rewards, gamma) {
  // TODO: return 0 when rewards.length === 0
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty trajectory', discountedReturn([], 0.9), 0);
return results;\`,
    hints: ['if (rewards.length === 0) return 0;'],
    solution: \`function discountedReturn(rewards, gamma) {
  if (rewards.length === 0) return 0;
  let g = 0;
  let discount = 1;
  for (let t = 0; t < rewards.length; t++) {
    g += discount * rewards[t];
    discount *= gamma;
  }
  return g;
}\`,
    explanation: 'Edge guards keep rollout collectors safe on zero-length episodes.',
  },

`;

const MDP = `  // --- mdp-formalism ---
  {
    id: 'mdp-transition-term',
    stepLabel: '59.1',
    group: 'Bellman expectation',
    title: 'Transition expectation term',
    concept: 'Each successor state contributes transProb * (reward + gamma * V(s_next)) to the action value.',
    objective: 'Inside bellmanExpectation, accumulate one transition term into qAction.',
    difficulty: 'warmup',
    starterCode: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
    testCode: \`const results = [];
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
check('single action backup', bellmanExpectation(pi, P, R, V, 0.9, 2, 2, 0), 14);
return results;\`,
    hints: ['qAction += transProb * (reward + gamma * nextVal);'],
    solution: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
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
    starterCode: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['vState += actionProb * qAction;'],
    solution: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
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
    starterCode: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['return vState;'],
    solution: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
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
    starterCode: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
    testCode: \`const results = [];
function checkNaN(name, actual) {
  results.push({ name, actual, expected: 'NaN', passed: Number.isNaN(actual) });
}
const pi = [[1]];
const P = [[[0.5, 0.3]]];
const R = [[[1, 2]]];
const V = [0, 0];
checkNaN('invalid transitions', bellmanExpectation(pi, P, R, V, 0.9, 1, 2, 0));
return results;\`,
    hints: ['if (Math.abs(sum - 1) > 1e-5) return NaN;'],
    solution: \`function bellmanExpectation(pi, P, R, V, gamma, numActions, numStates, stateIdx) {
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
}\`,
    explanation: 'Invalid transition rows signal malformed MDP dynamics before value iteration runs.',
  },

`;

const VALUE_ITERATION = `  // --- value-iteration ---
  {
    id: 'vi-q-term',
    stepLabel: '60.1',
    group: 'Value iteration step',
    title: 'Q-value transition term',
    concept: 'Value iteration builds each action value from expected one-step returns.',
    objective: 'Inside valueIterationUpdate, add P * (R + gamma * V) for each successor.',
    difficulty: 'warmup',
    starterCode: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      // TODO: qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext])
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);'],
    solution: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}\`,
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
    starterCode: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    // TODO: update maxQ if qValue is larger
  }
  return maxQ;
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['if (qValue > maxQ) maxQ = qValue;'],
    solution: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}\`,
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
    starterCode: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['return maxQ;'],
    solution: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
  let maxQ = -Infinity;
  for (let a = 0; a < numActions; a++) {
    let qValue = 0;
    for (let sNext = 0; sNext < numStates; sNext++) {
      qValue += P[state][a][sNext] * (R[state][a][sNext] + gamma * V[sNext]);
    }
    if (qValue > maxQ) maxQ = qValue;
  }
  return maxQ;
}\`,
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
    starterCode: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('no actions', valueIterationUpdate([[]], [[[]]], [0], 0, 0.9, 0, 1), 0);
return results;\`,
    hints: ['if (numActions === 0) return 0;'],
    solution: \`function valueIterationUpdate(P, R, V, state, gamma, numActions, numStates) {
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
}\`,
    explanation: 'Guarding zero-action states prevents -Infinity from leaking into planners.',
  },

`;

const POLICY_ITERATION = `  // --- policy-iteration ---
  {
    id: 'pi-eval-term',
    stepLabel: '61.1',
    group: 'Policy iteration step',
    title: 'Policy evaluation term',
    concept: 'Policy evaluation updates a state value by expecting over successor states for the current policy action.',
    objective: 'Inside policyIterationStep, accumulate transProb * (reward + gamma * nextVal).',
    difficulty: 'warmup',
    starterCode: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['newValue += transProb * (reward + gamma * nextVal);'],
    solution: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
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
    starterCode: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['return newValue;'],
    solution: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
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
    starterCode: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const pi = [0];
const P = [[[0.8, 0.2], [0.1, 0.9]]];
const R = [[[10, 0], [0, 20]]];
const V = [5, 10];
check('greedy improvement', policyIterationStep(pi, P, R, V, 0, 0.9, 2, 2, true), 1);
return results;\`,
    hints: ['if (qValue > maxQ) { maxQ = qValue; bestAction = a; }'],
    solution: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
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
    starterCode: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const pi = [1];
const P = [[[1, 0], [1, 0]]];
const R = [[[5, 0], [5, 0]]];
const V = [0, 0];
check('tie keeps lower index', policyIterationStep(pi, P, R, V, 0, 1, 2, 2, true), 0);
return results;\`,
    hints: ['return bestAction;'],
    solution: \`function policyIterationStep(pi, P, R, V, state, gamma, numActions, numStates, improve) {
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
}\`,
    explanation: 'Deterministic tie-breaking keeps policy iteration reproducible.',
  },

`;

const EXPLORATION = `  // --- rl-exploration ---
  {
    id: 'exploration-epsilon-greedy',
    stepLabel: '63.1',
    group: 'Exploration step',
    title: 'Epsilon-greedy explore branch',
    concept: 'Epsilon-greedy explores random actions with probability epsilon.',
    objective: 'Inside explorationStep, return randomActionIdx when randomVal < epsilon.',
    difficulty: 'warmup',
    starterCode: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('explore random', explorationStep([1, 3, 2], [1, 1, 1], 0.2, 0.1, 2, 10), 2);
return results;\`,
    hints: ['if (randomVal < epsilon) return randomActionIdx;'],
    solution: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
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
    starterCode: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('unvisited arm wins', explorationStep([1, 5], [2, 0], 0, 0.5, 0, 20), 1);
return results;\`,
    hints: ['const score = n === 0 ? Infinity : mean + c * Math.sqrt(Math.log(totalSteps) / n);'],
    solution: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
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
    starterCode: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-4) {
  if (a === Infinity && b === Infinity) return true;
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('ucb arm picked', explorationStep([3.5, 3.4], [10, 10], 0, 0.5, 0, 100, 2.0), 0);
return results;\`,
    hints: ['score = mean + c * Math.sqrt(Math.log(totalSteps) / n);'],
    solution: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
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
    starterCode: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('exploit ucb winner', explorationStep([1.5, 3.0, 2.0], [5, 5, 5], 0, 0.5, 0, 50), 1);
return results;\`,
    hints: ['return bestIdx;'],
    solution: \`function explorationStep(qValues, visitCounts, epsilon, randomVal, randomActionIdx, totalSteps, c = 2.0) {
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
}\`,
    explanation: 'Combining epsilon-greedy and UCB covers two major exploration strategies in one step function.',
  },

`;

const POLICY_GRADIENTS = `  // --- policy-gradients ---
  {
    id: 'pg-baseline-subtract',
    stepLabel: '64.1',
    group: 'Policy gradient step',
    title: 'Advantage baseline',
    concept: 'Policy gradients subtract a baseline from returns to reduce variance.',
    objective: 'Inside policyGradientStep, compute advantage = returnVal - baseline.',
    difficulty: 'warmup',
    starterCode: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  // TODO: advantage = returnVal - baseline
  const advantage = 0;
  return logProbGrad * advantage;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive advantage weight', policyGradientStep(1, 10, 7.5), 2.5);
return results;\`,
    hints: ['const advantage = returnVal - baseline;'],
    solution: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}\`,
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
    starterCode: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  // TODO: return logProbGrad * advantage
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('negative advantage weight', policyGradientStep(0.5, 2, 6), -2);
return results;\`,
    hints: ['return logProbGrad * advantage;'],
    solution: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}\`,
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
    starterCode: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  const weight = logProbGrad * advantage;
  // TODO: return weight
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive scale step', policyGradientStep(0.5, 10, 6), 2);
return results;\`,
    hints: ['return weight;'],
    solution: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}\`,
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
    starterCode: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  // TODO: return 0 when logProbGrad === 0
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero grad', policyGradientStep(0, 10, 5), 0);
return results;\`,
    hints: ['if (logProbGrad === 0) return 0;'],
    solution: \`function policyGradientStep(logProbGrad, returnVal, baseline) {
  if (logProbGrad === 0) return 0;
  const advantage = returnVal - baseline;
  return logProbGrad * advantage;
}\`,
    explanation: 'Zero-gradient guards avoid wasted optimizer steps on saturated policies.',
  },

`;

const ACTOR_CRITIC = `  // --- actor-critic ---
  {
    id: 'ac-td-error-calc',
    stepLabel: '65.1',
    group: 'Actor-critic step',
    title: 'TD error delta',
    concept: 'Actor-critic methods use TD error as the advantage signal: delta = r + gamma * V(s_next) - V(s).',
    objective: 'Inside actorCriticStep, compute delta.',
    difficulty: 'warmup',
    starterCode: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  let bootstrap = isTerminal ? 0 : nextValue;
  // TODO: delta = reward + gamma * bootstrap - currentValue
  const delta = 0;
  const loss = -logProb * delta;
  return { delta, loss };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('td error', actorCriticStep(2, 8, 10, 0.9, -1, false).delta, 3);
return results;\`,
    hints: ['const delta = reward + gamma * bootstrap - currentValue;'],
    solution: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}\`,
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
    starterCode: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  // TODO: bootstrap = isTerminal ? 0 : nextValue
  let bootstrap = nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('terminal delta', actorCriticStep(1, 0.5, 9, 0.9, -1, true).delta, 0.5);
return results;\`,
    hints: ['const bootstrap = isTerminal ? 0 : nextValue;'],
    solution: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}\`,
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
    starterCode: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  // TODO: loss = -logProb * delta
  const loss = 0;
  return { delta, loss };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('actor loss', actorCriticStep(0, 0, 0, 0.9, -1.2, true).loss, 0);
return results;\`,
    hints: ['const loss = -logProb * delta;'],
    solution: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}\`,
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
    starterCode: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  // TODO: return { delta, loss }
  return { delta: 0, loss: 0 };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = actorCriticStep(2, 8, 10, 0.9, -1.2, false);
check('positive loss', out.loss, 3.6);
return results;\`,
    hints: ['return { delta, loss };'],
    solution: \`function actorCriticStep(reward, currentValue, nextValue, gamma, logProb, isTerminal) {
  const bootstrap = isTerminal ? 0 : nextValue;
  const delta = reward + gamma * bootstrap - currentValue;
  const loss = -logProb * delta;
  return { delta, loss };
}\`,
    explanation: 'Joint outputs let critic and actor optimizers update from the same transition.',
  },

`;

const REWARD_SHAPING = `  // --- reward-shaping ---
  {
    id: 'rs-shaped-reward-calc',
    stepLabel: '66.1',
    group: 'Shaped reward step',
    title: 'Potential-based shaping',
    concept: 'Potential-based shaping uses F = gamma * phi(s_next) - phi(s) without changing optimal policies.',
    objective: 'Inside totalShapedReward, compute shaping = gamma * phiNext - phiCurrent.',
    difficulty: 'warmup',
    starterCode: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  // TODO: shaping = gamma * phiNext - phiCurrent
  const shaping = 0;
  return rawReward + shaping;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('shaping only', totalShapedReward(0, 2, 5, 0.9), 2.5);
return results;\`,
    hints: ['const shaping = gamma * phiNext - phiCurrent;'],
    solution: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}\`,
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
    starterCode: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  // TODO: return rawReward + shaping
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('combined shaping', totalShapedReward(1, 2, 5, 0.9), 3.5);
return results;\`,
    hints: ['return rawReward + shaping;'],
    solution: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}\`,
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
    starterCode: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  const total = rawReward + shaping;
  // TODO: return total
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('negative shaping', totalShapedReward(1, 5, 2, 0.9), -1.7);
return results;\`,
    hints: ['return total;'],
    solution: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}\`,
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
    starterCode: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  // TODO: if phiCurrent === 0 && phiNext === 0, return rawReward
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('no shaping', totalShapedReward(4, 0, 0, 0.9), 4);
return results;\`,
    hints: ['if (phiCurrent === 0 && phiNext === 0) return rawReward;'],
    solution: \`function totalShapedReward(rawReward, phiCurrent, phiNext, gamma) {
  if (phiCurrent === 0 && phiNext === 0) return rawReward;
  const shaping = gamma * phiNext - phiCurrent;
  return rawReward + shaping;
}\`,
    explanation: 'Zero potentials recover unshaped RL when no heuristic is available.',
  },

`;

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- rl-foundations ---',
  '  // --- mdp-formalism ---',
  RL_FOUNDATIONS,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- mdp-formalism ---',
  '  // --- value-iteration ---',
  MDP,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- value-iteration ---',
  '  // --- policy-iteration ---',
  VALUE_ITERATION,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- policy-iteration ---',
  '  // --- q-learning ---',
  POLICY_ITERATION,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- rl-exploration ---',
  '  // --- policy-gradients ---',
  EXPLORATION,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- policy-gradients ---',
  '  // --- actor-critic ---',
  POLICY_GRADIENTS,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- actor-critic ---',
  '  // --- reward-shaping ---',
  ACTOR_CRITIC,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- reward-shaping ---',
  '  // --- grpo-reasoning ---',
  REWARD_SHAPING,
);

patchMappings();
console.log('Tier 2 progressive lab patches applied.');
