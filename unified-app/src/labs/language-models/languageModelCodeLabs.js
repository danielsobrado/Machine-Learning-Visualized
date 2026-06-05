export const LANGUAGE_MODEL_CODE_LABS = [
  {
    id: 'lm-vocab-size',
    stepLabel: '48.1',
    group: 'Mini vocabulary and logits',
    title: 'Vocabulary size',
    concept: 'A language model predicts one score per vocabulary token.',
    objective: 'Return the number of tokens in the vocabulary.',
    difficulty: 'warmup',
    starterCode: `function vocabSize(vocab) {
  // TODO: return the number of tokens.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('three-token vocab', vocabSize(['cat', 'dog', 'fish']), 3);
check('one-token vocab', vocabSize(['<eos>']), 1);
check('five-token vocab', vocabSize(['a', 'b', 'c', 'd', 'e']), 5);

return results;`,
    hints: [
      'The vocabulary is an array.',
      'Array length gives the number of tokens.',
      'return vocab.length;',
    ],
    solution: `function vocabSize(vocab) {
  return vocab.length;
}`,
    explanation: 'A model with vocabulary size V produces V logits at each prediction position.',
  },

  {
    id: 'lm-argmax-logit',
    stepLabel: '48.2',
    group: 'Mini vocabulary and logits',
    title: 'Argmax logit',
    concept: 'Greedy decoding chooses the token with the largest logit.',
    objective: 'Return the index of the largest logit.',
    difficulty: 'core',
    starterCode: `function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    // TODO: update bestIndex and bestValue when logits[i] is larger.
  }

  return bestIndex;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('largest at index 0', argmax([5, 1, 2]), 0);
check('largest at index 1', argmax([1, 5, 2]), 1);
check('largest at index 2', argmax([-3, -2, -1]), 2);

return results;`,
    hints: [
      'Compare logits[i] with bestValue.',
      'If logits[i] is larger, update both bestValue and bestIndex.',
      `if (logits[i] > bestValue) {
  bestValue = logits[i];
  bestIndex = i;
}`,
    ],
    solution: `function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}`,
    explanation: 'Argmax decoding is deterministic: it always picks the highest-scoring token.',
  },

  {
    id: 'lm-decode-argmax-token',
    stepLabel: '48.3',
    group: 'Mini vocabulary and logits',
    title: 'Decode predicted token',
    concept: 'A predicted token ID becomes text by indexing into the vocabulary.',
    objective: 'Return vocab[argmax(logits)].',
    difficulty: 'core',
    starterCode: `function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function greedyToken(vocab, logits) {
  // TODO: return the vocabulary token with the largest logit.
  return '';
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const vocab = ['cat', 'dog', 'fish'];

check('predict cat', greedyToken(vocab, [5, 1, 2]), 'cat');
check('predict dog', greedyToken(vocab, [1, 5, 2]), 'dog');
check('predict fish', greedyToken(vocab, [-3, -2, -1]), 'fish');

return results;`,
    hints: [
      'First get the best token index.',
      'Then use that index to read from vocab.',
      'return vocab[argmax(logits)];',
    ],
    solution: `function argmax(logits) {
  let bestIndex = 0;
  let bestValue = logits[0];

  for (let i = 1; i < logits.length; i++) {
    if (logits[i] > bestValue) {
      bestValue = logits[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function greedyToken(vocab, logits) {
  return vocab[argmax(logits)];
}`,
    explanation: 'The model predicts token IDs. The tokenizer vocabulary maps those IDs back to text pieces.',
  },

  {
    id: 'lm-logits-to-probabilities',
    stepLabel: '48.4',
    group: 'Mini vocabulary and logits',
    title: 'Logits to probabilities',
    concept: 'Softmax converts arbitrary logits into probabilities that sum to 1.',
    objective: 'Return stable softmax probabilities.',
    difficulty: 'challenge',
    starterCode: `function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  const probabilities = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: push normalized probability for logits[i].
    probabilities.push(0);
  }

  return probabilities;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('equal logits', softmax([0, 0]), [0.5, 0.5]);
check('log ratio', softmax([0, Math.log(3)]), [0.25, 0.75]);
check('large equal logits', softmax([1000, 1000]), [0.5, 0.5]);

return results;`,
    hints: [
      'Use the same shifted exponentials as the denominator.',
      'Probability = exp(logit - maxLogit) / denominator.',
      'probabilities.push(Math.exp(logits[i] - maxLogit) / denominator);',
    ],
    solution: `function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  const probabilities = [];

  for (let i = 0; i < logits.length; i++) {
    probabilities.push(Math.exp(logits[i] - maxLogit) / denominator);
  }

  return probabilities;
}`,
    explanation: 'Logits are raw scores. Softmax turns them into a probability distribution over tokens.',
  },

  {
    id: 'sequence-target-probability',
    stepLabel: '49.1',
    group: 'Cross-entropy over sequence positions',
    title: 'Target token probability',
    concept: 'At one position, the loss uses the probability assigned to the true next token.',
    objective: 'Return probabilities[targetTokenId].',
    difficulty: 'warmup',
    starterCode: `function targetProbability(probabilities, targetTokenId) {
  // TODO: return probability of the target token.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('target 0', targetProbability([0.7, 0.2, 0.1], 0), 0.7);
check('target 1', targetProbability([0.7, 0.2, 0.1], 1), 0.2);
check('target 2', targetProbability([0.7, 0.2, 0.1], 2), 0.1);

return results;`,
    hints: [
      'targetTokenId is an array index.',
      'Read that probability from the probabilities array.',
      'return probabilities[targetTokenId];',
    ],
    solution: `function targetProbability(probabilities, targetTokenId) {
  return probabilities[targetTokenId];
}`,
    explanation: 'Cross-entropy only cares how much probability the model assigned to the correct token.',
  },

  {
    id: 'sequence-nll-one-position',
    stepLabel: '49.2',
    group: 'Cross-entropy over sequence positions',
    title: 'Negative log-likelihood',
    concept: 'Token loss is -log(probability assigned to the true token).',
    objective: 'Return -Math.log(targetProbability).',
    difficulty: 'core',
    starterCode: `function tokenNLL(targetProbability) {
  // TODO: return negative log likelihood.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('p=0.5', tokenNLL(0.5), -Math.log(0.5));
check('p=0.8', tokenNLL(0.8), -Math.log(0.8));
check('p=0.25', tokenNLL(0.25), -Math.log(0.25));

return results;`,
    hints: [
      'Use Math.log.',
      'The loss is negative log probability.',
      'return -Math.log(targetProbability);',
    ],
    solution: `function tokenNLL(targetProbability) {
  return -Math.log(targetProbability);
}`,
    explanation: 'Confident correct predictions have low loss; low probability on the true token gives high loss.',
  },

  {
    id: 'sequence-average-token-loss',
    stepLabel: '49.3',
    group: 'Cross-entropy over sequence positions',
    title: 'Average token loss',
    concept: 'Language-model loss is usually averaged across predicted positions.',
    objective: 'Return average of token losses.',
    difficulty: 'core',
    starterCode: `function averageTokenLoss(tokenLosses) {
  let total = 0;

  for (let i = 0; i < tokenLosses.length; i++) {
    total += tokenLosses[i];
  }

  // TODO: return average loss.
  return total;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('average [1,2,3]', averageTokenLoss([1, 2, 3]), 2);
check('average two losses', averageTokenLoss([0.5, 1.5]), 1);
check('zero losses', averageTokenLoss([0, 0, 0]), 0);

return results;`,
    hints: [
      'Average means total divided by count.',
      'The count is tokenLosses.length.',
      'return total / tokenLosses.length;',
    ],
    solution: `function averageTokenLoss(tokenLosses) {
  let total = 0;

  for (let i = 0; i < tokenLosses.length; i++) {
    total += tokenLosses[i];
  }

  return total / tokenLosses.length;
}`,
    explanation: 'A sequence loss summarizes many next-token prediction losses into one training number.',
  },

  {
    id: 'sequence-perplexity',
    stepLabel: '49.4',
    group: 'Cross-entropy over sequence positions',
    title: 'Perplexity',
    concept: 'Perplexity is exp(average cross-entropy loss).',
    objective: 'Return Math.exp(averageLoss).',
    difficulty: 'core',
    starterCode: `function perplexity(averageLoss) {
  // TODO: return exp of averageLoss.
  return averageLoss;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('loss 0', perplexity(0), 1);
check('loss log 2', perplexity(Math.log(2)), 2);
check('loss log 10', perplexity(Math.log(10)), 10);

return results;`,
    hints: [
      'Use Math.exp.',
      'Perplexity = e raised to average loss.',
      'return Math.exp(averageLoss);',
    ],
    solution: `function perplexity(averageLoss) {
  return Math.exp(averageLoss);
}`,
    explanation: 'Perplexity loosely means how many choices the model is confused among on average.',
  },

  {
    id: 'lm-select-position-logits',
    stepLabel: '50.1',
    group: 'Tiny language-model loss',
    title: 'Select position logits',
    concept: 'A language model produces one logit vector per sequence position.',
    objective: 'Return logitsByPosition[position].',
    difficulty: 'warmup',
    starterCode: `function positionLogits(logitsByPosition, position) {
  // TODO: return logits for this sequence position.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

const logits = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

check('position 0', positionLogits(logits, 0), [1, 2, 3]);
check('position 1', positionLogits(logits, 1), [4, 5, 6]);
check('position 2', positionLogits(logits, 2), [7, 8, 9]);

return results;`,
    hints: [
      'Position is an array index.',
      'Each row is the logits for one position.',
      'return logitsByPosition[position];',
    ],
    solution: `function positionLogits(logitsByPosition, position) {
  return logitsByPosition[position];
}`,
    explanation: 'For a sequence of length T, the model returns T logit vectors, one for each position.',
  },

  {
    id: 'lm-one-position-loss',
    stepLabel: '50.2',
    group: 'Tiny language-model loss',
    title: 'One-position loss',
    concept: 'One LM loss position is cross-entropy between logits and the true next token ID.',
    objective: 'Convert logits to probabilities, then return -log target probability.',
    difficulty: 'challenge',
    starterCode: `function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  return logits.map((logit) => Math.exp(logit - maxLogit) / denominator);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);

  // TODO: return negative log probability of targetTokenId.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('target 0 equal logits', onePositionLoss([0, 0], 0), -Math.log(0.5));
check('target 1 log ratio', onePositionLoss([0, Math.log(3)], 1), -Math.log(0.75));
check('target 0 log ratio', onePositionLoss([0, Math.log(3)], 0), -Math.log(0.25));

return results;`,
    hints: [
      'The target probability is probabilities[targetTokenId].',
      'Loss is -Math.log(target probability).',
      'return -Math.log(probabilities[targetTokenId]);',
    ],
    solution: `function softmax(logits) {
  const maxLogit = Math.max(...logits);
  let denominator = 0;

  for (let i = 0; i < logits.length; i++) {
    denominator += Math.exp(logits[i] - maxLogit);
  }

  return logits.map((logit) => Math.exp(logit - maxLogit) / denominator);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}`,
    explanation: 'The model is trained to put high probability on the true next token.',
  },

  {
    id: 'lm-average-loss',
    stepLabel: '50.3',
    group: 'Tiny language-model loss',
    title: 'Average language-model loss',
    concept: 'The final LM loss averages next-token losses across positions.',
    objective: 'Accumulate onePositionLoss for each position and divide by count.',
    difficulty: 'challenge',
    starterCode: `function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const denom = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / denom);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}

function languageModelLoss(logitsByPosition, targetTokenIds) {
  let total = 0;

  for (let position = 0; position < targetTokenIds.length; position++) {
    // TODO: add loss for this position.
    total += 0;
  }

  return total / targetTokenIds.length;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two positions equal logits', languageModelLoss([[0, 0], [0, 0]], [0, 1]), -Math.log(0.5));
check('two positions log ratios', languageModelLoss([[0, Math.log(3)], [Math.log(3), 0]], [1, 0]), -Math.log(0.75));

return results;`,
    hints: [
      'Use onePositionLoss(logitsByPosition[position], targetTokenIds[position]).',
      'Add it to total.',
      'total += onePositionLoss(logitsByPosition[position], targetTokenIds[position]);',
    ],
    solution: `function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const denom = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / denom);
}

function onePositionLoss(logits, targetTokenId) {
  const probabilities = softmax(logits);
  return -Math.log(probabilities[targetTokenId]);
}

function languageModelLoss(logitsByPosition, targetTokenIds) {
  let total = 0;

  for (let position = 0; position < targetTokenIds.length; position++) {
    total += onePositionLoss(logitsByPosition[position], targetTokenIds[position]);
  }

  return total / targetTokenIds.length;
}`,
    explanation: 'Language modeling is many small classification losses, one for each predicted next token.',
  },

  {
    id: 'teacher-forcing-previous-token',
    stepLabel: '51.1',
    group: 'Teacher forcing',
    title: 'True previous token',
    concept: 'Teacher forcing feeds the true previous token during training.',
    objective: 'Return trueTokens[position - 1].',
    difficulty: 'warmup',
    starterCode: `function previousTrueToken(trueTokens, position) {
  // position is greater than 0.
  // TODO: return the true previous token.
  return null;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('previous at position 1', previousTrueToken(['A', 'B', 'C'], 1), 'A');
check('previous at position 2', previousTrueToken(['A', 'B', 'C'], 2), 'B');
check('previous at position 3', previousTrueToken(['A', 'B', 'C', 'D'], 3), 'C');

return results;`,
    hints: [
      'Previous position is position - 1.',
      'Index into trueTokens.',
      'return trueTokens[position - 1];',
    ],
    solution: `function previousTrueToken(trueTokens, position) {
  return trueTokens[position - 1];
}`,
    explanation: 'During training, teacher forcing gives the model the correct previous context instead of its own sampled mistakes.',
  },

  {
    id: 'teacher-forcing-inputs',
    stepLabel: '51.2',
    group: 'Teacher forcing',
    title: 'Teacher-forced inputs',
    concept: 'Training inputs are usually shifted right: start token followed by all true tokens except the last.',
    objective: 'Build [startToken, ...tokensWithoutLast].',
    difficulty: 'core',
    starterCode: `function teacherForcedInputs(tokens, startToken) {
  const inputs = [startToken];

  for (let i = 0; i < tokens.length - 1; i++) {
    // TODO: append the true token at position i.
    inputs.push(null);
  }

  return inputs;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('ABC', teacherForcedInputs(['A', 'B', 'C'], '<bos>'), ['<bos>', 'A', 'B']);
check('one token', teacherForcedInputs(['A'], '<bos>'), ['<bos>']);
check('four tokens', teacherForcedInputs(['A', 'B', 'C', 'D'], '<bos>'), ['<bos>', 'A', 'B', 'C']);

return results;`,
    hints: [
      'The loop already stops before the last token.',
      'Push tokens[i].',
      'inputs.push(tokens[i]);',
    ],
    solution: `function teacherForcedInputs(tokens, startToken) {
  const inputs = [startToken];

  for (let i = 0; i < tokens.length - 1; i++) {
    inputs.push(tokens[i]);
  }

  return inputs;
}`,
    explanation: 'Teacher forcing trains the model to predict token t using the true tokens before t.',
  },

  {
    id: 'teacher-forcing-targets',
    stepLabel: '51.3',
    group: 'Teacher forcing',
    title: 'Teacher-forced targets',
    concept: 'For next-token training, targets are the original token sequence.',
    objective: 'Return a copy of tokens.',
    difficulty: 'warmup',
    starterCode: `function teacherForcedTargets(tokens) {
  // TODO: return the target tokens.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('ABC', teacherForcedTargets(['A', 'B', 'C']), ['A', 'B', 'C']);
check('one token', teacherForcedTargets(['A']), ['A']);

return results;`,
    hints: [
      'Targets are the true sequence.',
      'Return a shallow copy so you do not mutate the input.',
      'return tokens.slice();',
    ],
    solution: `function teacherForcedTargets(tokens) {
  return tokens.slice();
}`,
    explanation: 'Inputs are shifted right; targets are the true next tokens to predict.',
  },

  {
    id: 'causal-labels-drop-first',
    stepLabel: '52.1',
    group: 'Causal label shifting',
    title: 'Drop first token for labels',
    concept: 'In causal LM training, each position predicts the next token.',
    objective: 'Return tokens from index 1 onward.',
    difficulty: 'warmup',
    starterCode: `function nextTokenLabels(tokens) {
  // TODO: return all tokens except the first.
  return tokens;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('ABC labels', nextTokenLabels(['A', 'B', 'C']), ['B', 'C']);
check('AB labels', nextTokenLabels(['A', 'B']), ['B']);
check('one token labels', nextTokenLabels(['A']), []);

return results;`,
    hints: [
      'The first token has no previous token predicting it in this simple setup.',
      'Use slice starting at index 1.',
      'return tokens.slice(1);',
    ],
    solution: `function nextTokenLabels(tokens) {
  return tokens.slice(1);
}`,
    explanation: 'For sequence A B C, the model can learn A -> B and B -> C.',
  },

  {
    id: 'causal-inputs-drop-last',
    stepLabel: '52.2',
    group: 'Causal label shifting',
    title: 'Drop last token for inputs',
    concept: 'The last token has no next-token target inside the sequence.',
    objective: 'Return all tokens except the last.',
    difficulty: 'warmup',
    starterCode: `function causalInputs(tokens) {
  // TODO: return all tokens except the last.
  return tokens;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('ABC inputs', causalInputs(['A', 'B', 'C']), ['A', 'B']);
check('AB inputs', causalInputs(['A', 'B']), ['A']);
check('one token inputs', causalInputs(['A']), []);

return results;`,
    hints: [
      'Use slice from the start to length - 1.',
      'The last token is a target, not an input for a next token within this sequence.',
      'return tokens.slice(0, tokens.length - 1);',
    ],
    solution: `function causalInputs(tokens) {
  return tokens.slice(0, tokens.length - 1);
}`,
    explanation: 'Causal inputs and next-token labels are offset by one position.',
  },

  {
    id: 'causal-input-label-pairs',
    stepLabel: '52.3',
    group: 'Causal label shifting',
    title: 'Input-label pairs',
    concept: 'Causal language modeling turns a sequence into pairs: current token -> next token.',
    objective: 'Push [tokens[i], tokens[i + 1]].',
    difficulty: 'core',
    starterCode: `function causalPairs(tokens) {
  const pairs = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    // TODO: push current token and next token as a pair.
    pairs.push([]);
  }

  return pairs;
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('ABC pairs', causalPairs(['A', 'B', 'C']), [['A', 'B'], ['B', 'C']]);
check('AB pairs', causalPairs(['A', 'B']), [['A', 'B']]);
check('one token pairs', causalPairs(['A']), []);

return results;`,
    hints: [
      'Each pair is current token and next token.',
      'Use tokens[i] and tokens[i + 1].',
      'pairs.push([tokens[i], tokens[i + 1]]);',
    ],
    solution: `function causalPairs(tokens) {
  const pairs = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    pairs.push([tokens[i], tokens[i + 1]]);
  }

  return pairs;
}`,
    explanation: 'Next-token prediction is supervised learning over shifted token pairs.',
  },

  {
    id: 'token-training-logit-gradient',
    stepLabel: '53.1',
    group: 'Mini token training step',
    title: 'Logit gradient',
    concept: 'For softmax + cross-entropy, gradient is probabilities minus one-hot target.',
    objective: 'Push probabilities[i] - target.',
    difficulty: 'core',
    starterCode: `function logitGradient(probabilities, targetId) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetId ? 1 : 0;

    // TODO: push probability minus target.
    gradient.push(0);
  }

  return gradient;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('target 0', logitGradient([0.7, 0.3], 0), [-0.3, 0.3]);
check('target 1', logitGradient([0.7, 0.3], 1), [0.7, -0.7]);
check('three classes', logitGradient([0.1, 0.8, 0.1], 1), [0.1, -0.2, 0.1]);

return results;`,
    hints: [
      'The formula is p - y.',
      'target is 1 for the true class and 0 otherwise.',
      'gradient.push(probabilities[i] - target);',
    ],
    solution: `function logitGradient(probabilities, targetId) {
  const gradient = [];

  for (let i = 0; i < probabilities.length; i++) {
    const target = i === targetId ? 1 : 0;
    gradient.push(probabilities[i] - target);
  }

  return gradient;
}`,
    explanation: 'The true token logit is pushed up, and competing token logits are pushed down.',
  },

  {
    id: 'token-training-update-logit',
    stepLabel: '53.2',
    group: 'Mini token training step',
    title: 'Update one logit',
    concept: 'A gradient step subtracts learningRate times gradient from a parameter.',
    objective: 'Return logit - learningRate * gradient.',
    difficulty: 'warmup',
    starterCode: `function updateLogit(logit, gradient, learningRate) {
  // TODO: return updated logit.
  return logit;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('negative gradient increases logit', updateLogit(1, -0.3, 0.1), 1.03);
check('positive gradient decreases logit', updateLogit(1, 0.7, 0.1), 0.93);
check('zero gradient no change', updateLogit(5, 0, 0.1), 5);

return results;`,
    hints: [
      'Gradient descent subtracts the gradient step.',
      'Use logit - learningRate * gradient.',
      'return logit - learningRate * gradient;',
    ],
    solution: `function updateLogit(logit, gradient, learningRate) {
  return logit - learningRate * gradient;
}`,
    explanation: 'When the true class gradient is negative, subtracting it increases that logit.',
  },

  {
    id: 'token-training-update-all-logits',
    stepLabel: '53.3',
    group: 'Mini token training step',
    title: 'Update all logits',
    concept: 'One token-prediction training step updates every vocabulary logit.',
    objective: 'Push logits[i] - learningRate * gradients[i].',
    difficulty: 'core',
    starterCode: `function updateAllLogits(logits, gradients, learningRate) {
  const updated = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: update this logit.
    updated.push(logits[i]);
  }

  return updated;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('binary update', updateAllLogits([1, 1], [-0.3, 0.3], 0.1), [1.03, 0.97]);
check('three-class update', updateAllLogits([0, 0, 0], [0.1, -0.2, 0.1], 0.5), [-0.05, 0.1, -0.05]);

return results;`,
    hints: [
      'Use the same SGD rule for every logit.',
      'Subtract learningRate * gradients[i].',
      'updated.push(logits[i] - learningRate * gradients[i]);',
    ],
    solution: `function updateAllLogits(logits, gradients, learningRate) {
  const updated = [];

  for (let i = 0; i < logits.length; i++) {
    updated.push(logits[i] - learningRate * gradients[i]);
  }

  return updated;
}`,
    explanation: 'A training step increases the true token score and lowers competing scores.',
  },

  {
    id: 'sampling-cumulative-pick',
    stepLabel: '54.1',
    group: 'Sampling from logits',
    title: 'Pick from cumulative probabilities',
    concept: 'Sampling chooses the first cumulative probability that exceeds a random number.',
    objective: 'Return the first index where cumulative probability exceeds r.',
    difficulty: 'core',
    starterCode: `function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];

    // TODO: return i when r is less than cumulative.
  }

  return probabilities.length - 1;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('r in first bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.1), 0);
check('r in second bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.25), 1);
check('r in third bucket', sampleFromProbabilities([0.2, 0.3, 0.5], 0.8), 2);

return results;`,
    hints: [
      'cumulative is the probability mass up to index i.',
      'If r < cumulative, choose i.',
      'if (r < cumulative) return i;',
    ],
    solution: `function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];

    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}`,
    explanation: 'Sampling turns a probability distribution into one selected token ID.',
  },

  {
    id: 'sampling-token-from-vocab',
    stepLabel: '54.2',
    group: 'Sampling from logits',
    title: 'Sample token from vocabulary',
    concept: 'After sampling a token ID, decode it through the vocabulary.',
    objective: 'Return vocab[sampledIndex].',
    difficulty: 'warmup',
    starterCode: `function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}

function sampleToken(vocab, probabilities, r) {
  const sampledIndex = sampleFromProbabilities(probabilities, r);

  // TODO: return the token at sampledIndex.
  return '';
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

const vocab = ['cat', 'dog', 'fish'];

check('sample cat', sampleToken(vocab, [0.2, 0.3, 0.5], 0.1), 'cat');
check('sample dog', sampleToken(vocab, [0.2, 0.3, 0.5], 0.25), 'dog');
check('sample fish', sampleToken(vocab, [0.2, 0.3, 0.5], 0.8), 'fish');

return results;`,
    hints: [
      'sampledIndex is already computed.',
      'Use it to index into vocab.',
      'return vocab[sampledIndex];',
    ],
    solution: `function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }

  return probabilities.length - 1;
}

function sampleToken(vocab, probabilities, r) {
  const sampledIndex = sampleFromProbabilities(probabilities, r);
  return vocab[sampledIndex];
}`,
    explanation: 'Sampling can produce different valid continuations from the same model distribution.',
  },

  {
    id: 'sampling-greedy-or-sample',
    stepLabel: '54.3',
    group: 'Sampling from logits',
    title: 'Greedy or sample',
    concept: 'Generation can choose the highest-probability token or sample from the distribution.',
    objective: 'Use greedy when mode is "greedy", otherwise sample.',
    difficulty: 'core',
    starterCode: `function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function chooseTokenId(probabilities, mode, r) {
  // TODO: if mode is "greedy", return argmax; otherwise sample.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('greedy chooses largest', chooseTokenId([0.2, 0.3, 0.5], 'greedy', 0.1), 2);
check('sample first bucket', chooseTokenId([0.2, 0.3, 0.5], 'sample', 0.1), 0);
check('sample second bucket', chooseTokenId([0.2, 0.3, 0.5], 'sample', 0.25), 1);

return results;`,
    hints: [
      'Greedy ignores r and picks argmax.',
      'Sampling uses sampleFromProbabilities.',
      'return mode === "greedy" ? argmax(probabilities) : sampleFromProbabilities(probabilities, r);',
    ],
    solution: `function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }

  return bestIndex;
}

function sampleFromProbabilities(probabilities, r) {
  let cumulative = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (r < cumulative) return i;
  }
  return probabilities.length - 1;
}

function chooseTokenId(probabilities, mode, r) {
  return mode === "greedy" ? argmax(probabilities) : sampleFromProbabilities(probabilities, r);
}`,
    explanation: 'Greedy decoding is stable but can be dull; sampling is more diverse but less predictable.',
  },

  {
    id: 'temperature-scale-logits',
    stepLabel: '55.1',
    group: 'Temperature and top-k / top-p',
    title: 'Temperature-scaled logits',
    concept: 'Temperature divides logits before softmax. Lower temperature sharpens; higher temperature flattens.',
    objective: 'Push logits[i] / temperature.',
    difficulty: 'core',
    starterCode: `function applyTemperature(logits, temperature) {
  const scaled = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: divide logit by temperature.
    scaled.push(logits[i]);
  }

  return scaled;
}`,
    testCode: `const results = [];

function approxArray(a, b, tolerance = 1e-9) {
  return a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) <= tolerance);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: approxArray(actual, expected),
  });
}

check('temperature 1', applyTemperature([2, 4], 1), [2, 4]);
check('temperature 2', applyTemperature([2, 4], 2), [1, 2]);
check('temperature 0.5', applyTemperature([2, 4], 0.5), [4, 8]);

return results;`,
    hints: [
      'Temperature rescales every logit.',
      'Divide by temperature.',
      'scaled.push(logits[i] / temperature);',
    ],
    solution: `function applyTemperature(logits, temperature) {
  const scaled = [];

  for (let i = 0; i < logits.length; i++) {
    scaled.push(logits[i] / temperature);
  }

  return scaled;
}`,
    explanation: 'Temperature changes how sharp the final softmax distribution becomes.',
  },

  {
    id: 'top-k-indices',
    stepLabel: '55.2',
    group: 'Temperature and top-k / top-p',
    title: 'Top-k indices',
    concept: 'Top-k sampling keeps only the k highest-scoring tokens.',
    objective: 'Return indices of the top k logits.',
    difficulty: 'challenge',
    starterCode: `function topKIndices(logits, k) {
  const indexed = logits.map((value, index) => ({ value, index }));

  indexed.sort((a, b) => b.value - a.value);

  // TODO: return the first k indices.
  return [];
}`,
    testCode: `const results = [];

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArray(actual, expected),
  });
}

check('top 1', topKIndices([1, 5, 3], 1), [1]);
check('top 2', topKIndices([1, 5, 3], 2), [1, 2]);
check('top 3', topKIndices([-1, -5, 0], 3), [2, 0, 1]);

return results;`,
    hints: [
      'indexed is already sorted from largest to smallest.',
      'Take the first k entries and return their index fields.',
      'return indexed.slice(0, k).map((item) => item.index);',
    ],
    solution: `function topKIndices(logits, k) {
  const indexed = logits.map((value, index) => ({ value, index }));

  indexed.sort((a, b) => b.value - a.value);

  return indexed.slice(0, k).map((item) => item.index);
}`,
    explanation: 'Top-k prevents low-ranked tokens from being sampled at all.',
  },

  {
    id: 'top-k-mask-logits',
    stepLabel: '55.3',
    group: 'Temperature and top-k / top-p',
    title: 'Mask non-top-k logits',
    concept: 'Tokens outside top-k are masked to -Infinity before softmax.',
    objective: 'Keep logits in allowed indices, otherwise -Infinity.',
    difficulty: 'challenge',
    starterCode: `function maskToTopK(logits, allowedIndices) {
  const masked = [];

  for (let i = 0; i < logits.length; i++) {
    // TODO: keep logits[i] only if i is in allowedIndices.
    masked.push(logits[i]);
  }

  return masked;
}`,
    testCode: `const results = [];

function sameArraySpecial(a, b) {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameArraySpecial(actual, expected),
  });
}

check('keep indices 1 and 2', maskToTopK([1, 5, 3], [1, 2]), [-Infinity, 5, 3]);
check('keep index 0', maskToTopK([1, 5, 3], [0]), [1, -Infinity, -Infinity]);

return results;`,
    hints: [
      'Use allowedIndices.includes(i).',
      'Keep the logit when allowed; otherwise use -Infinity.',
      'masked.push(allowedIndices.includes(i) ? logits[i] : -Infinity);',
    ],
    solution: `function maskToTopK(logits, allowedIndices) {
  const masked = [];

  for (let i = 0; i < logits.length; i++) {
    masked.push(allowedIndices.includes(i) ? logits[i] : -Infinity);
  }

  return masked;
}`,
    explanation: 'Masking before softmax makes excluded tokens receive zero probability.',
  },

  {
    id: 'top-p-cutoff',
    stepLabel: '55.4',
    group: 'Temperature and top-k / top-p',
    title: 'Top-p cutoff',
    concept: 'Top-p keeps the smallest set of high-probability tokens whose cumulative mass reaches p.',
    objective: 'Return how many sorted probabilities are needed to reach p.',
    difficulty: 'challenge',
    starterCode: `function topPCount(sortedProbabilities, p) {
  let cumulative = 0;

  for (let i = 0; i < sortedProbabilities.length; i++) {
    cumulative += sortedProbabilities[i];

    // TODO: return i + 1 once cumulative reaches p.
  }

  return sortedProbabilities.length;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('one token enough', topPCount([0.8, 0.1, 0.1], 0.7), 1);
check('two tokens needed', topPCount([0.5, 0.3, 0.2], 0.8), 2);
check('all tokens needed', topPCount([0.4, 0.3, 0.2, 0.1], 0.95), 4);

return results;`,
    hints: [
      'sortedProbabilities are already largest to smallest.',
      'When cumulative >= p, return the number of tokens included.',
      'if (cumulative >= p) return i + 1;',
    ],
    solution: `function topPCount(sortedProbabilities, p) {
  let cumulative = 0;

  for (let i = 0; i < sortedProbabilities.length; i++) {
    cumulative += sortedProbabilities[i];

    if (cumulative >= p) return i + 1;
  }

  return sortedProbabilities.length;
}`,
    explanation: 'Top-p adapts the candidate set size to the shape of the probability distribution.',
  },

  // --- WAVE 3: EAGLE 3.1 SPECULATIVE DECODING ---
  {
    id: 'eagle-self-trust-check',
    stepLabel: '17.1',
    group: 'Self-trust threshold',
    title: 'EAGLE speculative self-trust check',
    concept: 'EAGLE speculative decoding dynamically extends draft trees. If the draft models confidence is higher than a self-trust threshold, it accepts the draft step.',
    objective: 'Return true if confidence is greater than or equal to threshold, otherwise false.',
    difficulty: 'warmup',
    starterCode: `function checkSelfTrust(confidence, threshold) {
  // TODO: return true if confidence is at least threshold
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('trusted', checkSelfTrust(0.85, 0.8), true);
check('untrusted', checkSelfTrust(0.75, 0.8), false);
return results;`,
    hints: [
      'Use confidence >= threshold.',
    ],
    solution: `function checkSelfTrust(confidence, threshold) {
  return confidence >= threshold;
}`,
    explanation: 'Self-trust thresholds allow draft models to bypass verification for high-confidence tokens, speeding up speculative generation.',
  },
  {
    id: 'eagle-token-salvage',
    stepLabel: '17.2',
    group: 'Token salvage',
    title: 'Salvage rejected draft tokens',
    concept: 'When the target model rejects draft tokens, EAGLE salvages the prefix of accepted tokens to form the new sequence.',
    objective: 'Filter draft tokens: keep only tokens whose corresponding acceptMask value is true.',
    difficulty: 'core',
    starterCode: `function salvageTokens(draftTokens, acceptMask) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    // TODO: if acceptMask[i] is true, push draftTokens[i] to accepted
  }
  return accepted;
}`,
    testCode: `const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('salvage mixed', salvageTokens(['a', 'b', 'c'], [true, false, true]), ['a', 'c']);
return results;`,
    hints: [
      'Check if acceptMask[i] is true.',
      'If so, push draftTokens[i] to accepted.',
    ],
    solution: `function salvageTokens(draftTokens, acceptMask) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (acceptMask[i]) {
      accepted.push(draftTokens[i]);
    }
  }
  return accepted;
}`,
    explanation: 'Salvaging ensures accepted draft prefix tokens are kept even if a future token in the batch is rejected.',
  },
];
