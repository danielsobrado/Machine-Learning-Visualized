/**
 * Refactors 7 core lessons to matmul-style progressive single-function skeletons.
 * Run: node unified-app/scripts/patch-core-progressive-labs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function replaceSection(filePath, startMarker, endMarker, newContent) {
  const fullPath = path.join(ROOT, filePath);
  const src = fs.readFileSync(fullPath, 'utf8');
  const startIdx = src.indexOf(startMarker);
  const endIdx = src.indexOf(endMarker, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${filePath}: ${startMarker}`);
  }
  const updated = src.slice(0, startIdx) + newContent + src.slice(endIdx);
  fs.writeFileSync(fullPath, updated);
  console.log(`Patched ${filePath}`);
}

const Q_LEARNING = `  // --- q-learning ---
  {
    id: 'q-learning-select-action',
    stepLabel: '62.1',
    group: 'Epsilon-greedy selection',
    title: 'Epsilon-Greedy Action Selection',
    concept: 'Q-learning balances exploration and exploitation inside every agent step. With probability epsilon, pick a random action; otherwise pick the argmax Q-value for the current state.',
    objective: 'Inside qLearningStep, implement epsilon-greedy action selection from qTable[state].',
    difficulty: 'warmup',
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const table = [[1.5, 3.0, 2.0], [0.0, 0.0]];
check('explore random choice', qLearningStep(table, 0, 0, 0, false, 0.1, 0.9, 0.2, 0.1, 0).action, 0);
check('exploit best choice', qLearningStep(table, 0, 0, 0, false, 0.1, 0.9, 0.2, 0.5, 1).action, 1);
check('exploit with negatives', qLearningStep([[ -5, -2, -10 ]], 0, 0, 0, true, 0.1, 0.9, 0.1, 0.3, 2).action, 1);
check('explore boundary', qLearningStep([[1, 2]], 0, 0, 0, true, 0.1, 0.9, 0.5, 0.499, 1).action, 1);
return results;\`,
    hints: [
      'If randVal < epsilon, return randAction as the selected action.',
      'Otherwise scan qValues for the index of the maximum value.',
      'Initialize maxIdx = 0 and update when qValues[i] > qValues[maxIdx].',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: [
      'Inside the !isTerminal branch, tdTarget should include the discounted best next Q-value.',
      'Use tdTarget = reward + gamma * maxNextQ.',
      'Terminal transitions keep tdTarget = reward.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: [
      'Use currentQ + alpha * (tdTarget - currentQ).',
      'Assign the result to qTable[state][action].',
      'Return the updated value in updatedQ.',
    ],
    solution: \`/**
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
}\`,
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
    starterCode: \`/**
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const qTable = [[1.0, 2.0], [3.0, 4.0]];
const val1 = qLearningStep(qTable, 0, 1, 1.5, 1, false, 0.5, 0.9, 0, 0, 1);
check('non-terminal full step', val1.updatedQ, 3.55);
check('non-terminal table write', qTable[0][1], 3.55);
const val2 = qLearningStep(qTable, 1, 0, 2.5, 0, true, 0.2, 0.9, 1, 0.5, 0);
check('terminal full step', val2.updatedQ, 2.9);
check('terminal table write', qTable[1][0], 2.9);
return results;\`,
    hints: [
      'Non-terminal tdTarget needs reward + gamma * maxNextQ.',
      'Terminal transitions keep tdTarget = reward.',
      'The alpha blend and table write should already be in place from prior steps.',
    ],
    solution: \`/**
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
}\`,
    explanation: 'Integrating exploration, bootstrapping, terminal handling, and in-place table updates is the core tabular Q-learning agent step.',
  },

`;

// Due to file size, remaining sections are imported from companion module
const { WORD2VEC, KV_CACHE, LSTM, BERT, TOOL, DIFFUSION } = await import('./core-progressive-labs-sections.mjs');

replaceSection(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  '  // --- q-learning ---',
  '  // --- rl-exploration ---',
  Q_LEARNING,
);

replaceSection(
  'src/labs/nlp/nlpCodeLabs.js',
  '  // --- WORD2VEC ---',
  '  // --- GLOVE ---',
  WORD2VEC,
);

replaceSection(
  'src/labs/transformers/transformerCodeLabs.js',
  "    id: 'kv-cache-append-step',",
  "    id: 'flash-max-update',",
  KV_CACHE,
);

replaceSection(
  'src/labs/neural-networks/neuralNetworkCodeLabs.js',
  "    id: 'lstm-gates-f-i',",
  "    id: 'conv2d-output-size',",
  LSTM,
);

replaceSection(
  'src/labs/transformers/transformerCodeLabs.js',
  "    id: 'bert-mlm-masking',",
  "    id: 'moe-topk-indices',",
  BERT,
);

replaceSection(
  'src/labs/frontier-llms/frontierLlmCodeLabs.js',
  '  // --- TOOL-USING REASONING MODELS ---',
  '  // --- AGENTIC CODING SYSTEMS ---',
  TOOL,
);

replaceSection(
  'src/labs/diffusion/diffusionCodeLabs.js',
  '  // --- diffusion-sampling ---',
  '  // --- classifier-free-guidance ---',
  DIFFUSION,
);

console.log('All 7 core lessons patched.');
