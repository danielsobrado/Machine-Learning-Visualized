export const EVALUATION_CODE_LABS = [
  {
    id: 'eval-true-positive',
    stepLabel: '62.1',
    group: 'Confusion matrix',
    title: 'True positive',
    concept: 'A true positive happens when the model predicts positive and the true label is positive.',
    objective: 'Return true only when prediction and label are both 1.',
    difficulty: 'warmup',
    starterCode: `function isTruePositive(prediction, label) {
  // TODO: return true only when prediction is 1 and label is 1.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted positive, actually positive', isTruePositive(1, 1), true);
check('predicted positive, actually negative', isTruePositive(1, 0), false);
check('predicted negative, actually positive', isTruePositive(0, 1), false);
check('predicted negative, actually negative', isTruePositive(0, 0), false);

return results;`,
    hints: [
      'True positive means both values are positive.',
      'Use prediction === 1 and label === 1.',
      'return prediction === 1 && label === 1;',
    ],
    solution: `function isTruePositive(prediction, label) {
  return prediction === 1 && label === 1;
}`,
    explanation: 'True positives are the successful detections of the positive class.',
  },

  {
    id: 'eval-false-positive',
    stepLabel: '62.2',
    group: 'Confusion matrix',
    title: 'False positive',
    concept: 'A false positive happens when the model predicts positive but the true label is negative.',
    objective: 'Return true only when prediction is 1 and label is 0.',
    difficulty: 'warmup',
    starterCode: `function isFalsePositive(prediction, label) {
  // TODO: return true only when prediction is 1 and label is 0.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted positive, actually negative', isFalsePositive(1, 0), true);
check('predicted positive, actually positive', isFalsePositive(1, 1), false);
check('predicted negative, actually positive', isFalsePositive(0, 1), false);
check('predicted negative, actually negative', isFalsePositive(0, 0), false);

return results;`,
    hints: [
      'False positive means the alarm fired but the event was not real.',
      'Use prediction === 1 and label === 0.',
      'return prediction === 1 && label === 0;',
    ],
    solution: `function isFalsePositive(prediction, label) {
  return prediction === 1 && label === 0;
}`,
    explanation: 'False positives matter when incorrect alarms are costly.',
  },

  {
    id: 'eval-false-negative',
    stepLabel: '62.3',
    group: 'Confusion matrix',
    title: 'False negative',
    concept: 'A false negative happens when the model predicts negative but the true label is positive.',
    objective: 'Return true only when prediction is 0 and label is 1.',
    difficulty: 'warmup',
    starterCode: `function isFalseNegative(prediction, label) {
  // TODO: return true only when prediction is 0 and label is 1.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('predicted negative, actually positive', isFalseNegative(0, 1), true);
check('predicted positive, actually positive', isFalseNegative(1, 1), false);
check('predicted positive, actually negative', isFalseNegative(1, 0), false);
check('predicted negative, actually negative', isFalseNegative(0, 0), false);

return results;`,
    hints: [
      'False negative means the model missed a real positive.',
      'Use prediction === 0 and label === 1.',
      'return prediction === 0 && label === 1;',
    ],
    solution: `function isFalseNegative(prediction, label) {
  return prediction === 0 && label === 1;
}`,
    explanation: 'False negatives matter when missing a positive case is dangerous or expensive.',
  },

  {
    id: 'eval-confusion-counts',
    stepLabel: '62.4',
    group: 'Confusion matrix',
    title: 'Count confusion matrix',
    concept: 'A confusion matrix counts TP, FP, TN, and FN over a dataset.',
    objective: 'Increment the correct count for each prediction-label pair.',
    difficulty: 'core',
    starterCode: `function confusionCounts(predictions, labels) {
  const counts = { tp: 0, fp: 0, tn: 0, fn: 0 };

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    const label = labels[i];

    // TODO: increment exactly one of tp, fp, tn, fn.
  }

  return counts;
}`,
    testCode: `const results = [];

function sameObject(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function check(name, actual, expected) {
  results.push({
    name,
    actual: JSON.stringify(actual),
    expected: JSON.stringify(expected),
    passed: sameObject(actual, expected),
  });
}

check('mixed predictions', confusionCounts([1, 1, 0, 0], [1, 0, 1, 0]), { tp: 1, fp: 1, tn: 1, fn: 1 });
check('perfect predictions', confusionCounts([1, 0, 1, 0], [1, 0, 1, 0]), { tp: 2, fp: 0, tn: 2, fn: 0 });
check('all missed positives', confusionCounts([0, 0, 0], [1, 1, 0]), { tp: 0, fp: 0, tn: 1, fn: 2 });

return results;`,
    hints: [
      'There are four mutually exclusive cases.',
      'Check prediction and label together.',
      `if (prediction === 1 && label === 1) counts.tp += 1;
else if (prediction === 1 && label === 0) counts.fp += 1;
else if (prediction === 0 && label === 0) counts.tn += 1;
else counts.fn += 1;`,
    ],
    solution: `function confusionCounts(predictions, labels) {
  const counts = { tp: 0, fp: 0, tn: 0, fn: 0 };

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    const label = labels[i];

    if (prediction === 1 && label === 1) counts.tp += 1;
    else if (prediction === 1 && label === 0) counts.fp += 1;
    else if (prediction === 0 && label === 0) counts.tn += 1;
    else counts.fn += 1;
  }

  return counts;
}`,
    explanation: 'The confusion matrix is the foundation for precision, recall, specificity, F1, ROC, and PR curves.',
  },

  {
    id: 'eval-accuracy',
    stepLabel: '63.1',
    group: 'Precision / recall / F1',
    title: 'Accuracy',
    concept: 'Accuracy is the fraction of examples the model classified correctly.',
    objective: 'Return (tp + tn) / total.',
    difficulty: 'warmup',
    starterCode: `function accuracy(counts) {
  const total = counts.tp + counts.fp + counts.tn + counts.fn;

  // TODO: return accuracy.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('balanced example', accuracy({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect', accuracy({ tp: 2, fp: 0, tn: 2, fn: 0 }), 1);
check('all wrong', accuracy({ tp: 0, fp: 2, tn: 0, fn: 2 }), 0);

return results;`,
    hints: [
      'Correct predictions are true positives plus true negatives.',
      'Divide by total examples.',
      'return (counts.tp + counts.tn) / total;',
    ],
    solution: `function accuracy(counts) {
  const total = counts.tp + counts.fp + counts.tn + counts.fn;
  return (counts.tp + counts.tn) / total;
}`,
    explanation: 'Accuracy is easy to understand, but it can be misleading on imbalanced datasets.',
  },

  {
    id: 'eval-precision',
    stepLabel: '63.2',
    group: 'Precision / recall / F1',
    title: 'Precision',
    concept: 'Precision asks: among predicted positives, how many were truly positive?',
    objective: 'Return tp / (tp + fp).',
    difficulty: 'core',
    starterCode: `function precision(counts) {
  const predictedPositive = counts.tp + counts.fp;

  if (predictedPositive === 0) return 0;

  // TODO: return precision.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one true, one false positive', precision({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect precision', precision({ tp: 3, fp: 0, tn: 1, fn: 2 }), 1);
check('no predicted positives', precision({ tp: 0, fp: 0, tn: 5, fn: 2 }), 0);

return results;`,
    hints: [
      'Precision focuses on predictions labeled positive.',
      'The denominator is tp + fp.',
      'return counts.tp / predictedPositive;',
    ],
    solution: `function precision(counts) {
  const predictedPositive = counts.tp + counts.fp;

  if (predictedPositive === 0) return 0;

  return counts.tp / predictedPositive;
}`,
    explanation: 'High precision means positive predictions are trustworthy.',
  },

  {
    id: 'eval-recall',
    stepLabel: '63.3',
    group: 'Precision / recall / F1',
    title: 'Recall',
    concept: 'Recall asks: among actual positives, how many did the model find?',
    objective: 'Return tp / (tp + fn).',
    difficulty: 'core',
    starterCode: `function recall(counts) {
  const actualPositive = counts.tp + counts.fn;

  if (actualPositive === 0) return 0;

  // TODO: return recall.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one found, one missed', recall({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect recall', recall({ tp: 3, fp: 2, tn: 1, fn: 0 }), 1);
check('no actual positives', recall({ tp: 0, fp: 2, tn: 5, fn: 0 }), 0);

return results;`,
    hints: [
      'Recall focuses on actual positive cases.',
      'The denominator is tp + fn.',
      'return counts.tp / actualPositive;',
    ],
    solution: `function recall(counts) {
  const actualPositive = counts.tp + counts.fn;

  if (actualPositive === 0) return 0;

  return counts.tp / actualPositive;
}`,
    explanation: 'High recall means the model misses fewer positive cases.',
  },

  {
    id: 'eval-f1',
    stepLabel: '63.4',
    group: 'Precision / recall / F1',
    title: 'F1 score',
    concept: 'F1 is the harmonic mean of precision and recall.',
    objective: 'Return 2pr / (p + r).',
    difficulty: 'challenge',
    starterCode: `function f1Score(precisionValue, recallValue) {
  if (precisionValue + recallValue === 0) return 0;

  // TODO: return F1 score.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('precision 0.5 recall 0.5', f1Score(0.5, 0.5), 0.5);
check('precision 1 recall 0.5', f1Score(1, 0.5), 2 / 3);
check('precision 0 recall 0', f1Score(0, 0), 0);

return results;`,
    hints: [
      'F1 combines precision and recall.',
      'Use 2 * precision * recall / (precision + recall).',
      'return (2 * precisionValue * recallValue) / (precisionValue + recallValue);',
    ],
    solution: `function f1Score(precisionValue, recallValue) {
  if (precisionValue + recallValue === 0) return 0;

  return (2 * precisionValue * recallValue) / (precisionValue + recallValue);
}`,
    explanation: 'F1 is useful when you need a single score that balances false positives and false negatives.',
  },

  {
    id: 'threshold-predict',
    stepLabel: '64.1',
    group: 'ROC / PR threshold sweeps',
    title: 'Predict by threshold',
    concept: 'A probabilistic classifier becomes a hard classifier by choosing a threshold.',
    objective: 'Return 1 when score is at least threshold, otherwise 0.',
    difficulty: 'warmup',
    starterCode: `function predictByThreshold(score, threshold) {
  // TODO: return 1 if score >= threshold, else 0.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('above threshold', predictByThreshold(0.8, 0.5), 1);
check('below threshold', predictByThreshold(0.3, 0.5), 0);
check('equal threshold counts positive', predictByThreshold(0.5, 0.5), 1);

return results;`,
    hints: [
      'Thresholding turns scores into labels.',
      'Use score >= threshold.',
      'return score >= threshold ? 1 : 0;',
    ],
    solution: `function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}`,
    explanation: 'Changing the threshold changes the tradeoff between false positives and false negatives.',
  },

  {
    id: 'threshold-predict-all',
    stepLabel: '64.2',
    group: 'ROC / PR threshold sweeps',
    title: 'Threshold all scores',
    concept: 'A threshold sweep applies many thresholds to the same scores.',
    objective: 'Push thresholded prediction for each score.',
    difficulty: 'core',
    starterCode: `function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}

function predictionsAtThreshold(scores, threshold) {
  const predictions = [];

  for (let i = 0; i < scores.length; i++) {
    // TODO: push prediction for scores[i].
    predictions.push(0);
  }

  return predictions;
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

check('threshold 0.5', predictionsAtThreshold([0.8, 0.3, 0.5], 0.5), [1, 0, 1]);
check('threshold 0.7', predictionsAtThreshold([0.8, 0.3, 0.5], 0.7), [1, 0, 0]);
check('threshold 0.2', predictionsAtThreshold([0.8, 0.3, 0.5], 0.2), [1, 1, 1]);

return results;`,
    hints: [
      'Use predictByThreshold on each score.',
      'Push the result into predictions.',
      'predictions.push(predictByThreshold(scores[i], threshold));',
    ],
    solution: `function predictByThreshold(score, threshold) {
  return score >= threshold ? 1 : 0;
}

function predictionsAtThreshold(scores, threshold) {
  const predictions = [];

  for (let i = 0; i < scores.length; i++) {
    predictions.push(predictByThreshold(scores[i], threshold));
  }

  return predictions;
}`,
    explanation: 'Threshold sweeps let you see how metrics change as the decision boundary moves.',
  },

  {
    id: 'roc-false-positive-rate',
    stepLabel: '64.3',
    group: 'ROC / PR threshold sweeps',
    title: 'False positive rate',
    concept: 'FPR asks: among actual negatives, how many did the model incorrectly mark positive?',
    objective: 'Return fp / (fp + tn).',
    difficulty: 'core',
    starterCode: `function falsePositiveRate(counts) {
  const actualNegatives = counts.fp + counts.tn;

  if (actualNegatives === 0) return 0;

  // TODO: return FPR.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one false positive, one true negative', falsePositiveRate({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('no false positives', falsePositiveRate({ tp: 1, fp: 0, tn: 4, fn: 1 }), 0);
check('all negatives false positive', falsePositiveRate({ tp: 1, fp: 4, tn: 0, fn: 1 }), 1);

return results;`,
    hints: [
      'FPR is based on actual negatives.',
      'The denominator is fp + tn.',
      'return counts.fp / actualNegatives;',
    ],
    solution: `function falsePositiveRate(counts) {
  const actualNegatives = counts.fp + counts.tn;

  if (actualNegatives === 0) return 0;

  return counts.fp / actualNegatives;
}`,
    explanation: 'ROC curves plot true positive rate against false positive rate.',
  },

  {
    id: 'roc-true-positive-rate',
    stepLabel: '64.4',
    group: 'ROC / PR threshold sweeps',
    title: 'True positive rate',
    concept: 'TPR is another name for recall.',
    objective: 'Return tp / (tp + fn).',
    difficulty: 'core',
    starterCode: `function truePositiveRate(counts) {
  const actualPositives = counts.tp + counts.fn;

  if (actualPositives === 0) return 0;

  // TODO: return TPR.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one found, one missed', truePositiveRate({ tp: 1, fp: 1, tn: 1, fn: 1 }), 0.5);
check('perfect recall', truePositiveRate({ tp: 4, fp: 1, tn: 1, fn: 0 }), 1);
check('miss all positives', truePositiveRate({ tp: 0, fp: 1, tn: 1, fn: 4 }), 0);

return results;`,
    hints: [
      'TPR is recall.',
      'The denominator is tp + fn.',
      'return counts.tp / actualPositives;',
    ],
    solution: `function truePositiveRate(counts) {
  const actualPositives = counts.tp + counts.fn;

  if (actualPositives === 0) return 0;

  return counts.tp / actualPositives;
}`,
    explanation: 'TPR measures how many actual positives the model catches.',
  },

  {
    id: 'calibration-bin-index',
    stepLabel: '65.1',
    group: 'Calibration bins',
    title: 'Calibration bin index',
    concept: 'Calibration groups predictions by score range.',
    objective: 'Return the bin index for a score using equal-width bins.',
    difficulty: 'core',
    starterCode: `function binIndex(score, numBins) {
  // Scores are between 0 and 1.
  // TODO: return Math.floor(score * numBins), capped at numBins - 1.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('score 0.05 bin 0 of 10', binIndex(0.05, 10), 0);
check('score 0.35 bin 3 of 10', binIndex(0.35, 10), 3);
check('score 0.99 bin 9 of 10', binIndex(0.99, 10), 9);
check('score 1.0 capped bin 9 of 10', binIndex(1.0, 10), 9);

return results;`,
    hints: [
      'Start with Math.floor(score * numBins).',
      'A score of 1.0 would produce numBins, so cap it.',
      'return Math.min(numBins - 1, Math.floor(score * numBins));',
    ],
    solution: `function binIndex(score, numBins) {
  return Math.min(numBins - 1, Math.floor(score * numBins));
}`,
    explanation: 'Calibration bins let you compare predicted confidence with actual frequency.',
  },

  {
    id: 'calibration-bin-confidence',
    stepLabel: '65.2',
    group: 'Calibration bins',
    title: 'Average bin confidence',
    concept: 'A bin average confidence is the mean predicted probability in that bin.',
    objective: 'Return average of the scores.',
    difficulty: 'warmup',
    starterCode: `function averageConfidence(scores) {
  if (scores.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  // TODO: return average confidence.
  return total;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('average two scores', averageConfidence([0.2, 0.4]), 0.3);
check('one score', averageConfidence([0.7]), 0.7);
check('empty bin', averageConfidence([]), 0);

return results;`,
    hints: [
      'Average means total divided by count.',
      'The count is scores.length.',
      'return total / scores.length;',
    ],
    solution: `function averageConfidence(scores) {
  if (scores.length === 0) return 0;

  let total = 0;

  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }

  return total / scores.length;
}`,
    explanation: 'If a bin average confidence is 0.8, a calibrated model should be correct about 80% of the time in that bin.',
  },

  {
    id: 'calibration-bin-accuracy',
    stepLabel: '65.3',
    group: 'Calibration bins',
    title: 'Bin accuracy',
    concept: 'A bin empirical accuracy is the fraction of examples in that bin that were correct.',
    objective: 'Return number correct divided by bin size.',
    difficulty: 'core',
    starterCode: `function binAccuracy(correctFlags) {
  if (correctFlags.length === 0) return 0;

  let correct = 0;

  for (let i = 0; i < correctFlags.length; i++) {
    // TODO: increment correct when correctFlags[i] is true.
  }

  return correct / correctFlags.length;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two of three correct', binAccuracy([true, true, false]), 2 / 3);
check('all correct', binAccuracy([true, true]), 1);
check('none correct', binAccuracy([false, false]), 0);
check('empty bin', binAccuracy([]), 0);

return results;`,
    hints: [
      'correctFlags[i] is a boolean.',
      'If it is true, add 1.',
      'if (correctFlags[i]) correct += 1;',
    ],
    solution: `function binAccuracy(correctFlags) {
  if (correctFlags.length === 0) return 0;

  let correct = 0;

  for (let i = 0; i < correctFlags.length; i++) {
    if (correctFlags[i]) correct += 1;
  }

  return correct / correctFlags.length;
}`,
    explanation: 'Calibration compares confidence to empirical accuracy.',
  },

  {
    id: 'calibration-gap',
    stepLabel: '65.4',
    group: 'Calibration bins',
    title: 'Calibration gap',
    concept: 'A calibration gap is the absolute difference between confidence and accuracy.',
    objective: 'Return |confidence - accuracy|.',
    difficulty: 'warmup',
    starterCode: `function calibrationGap(confidence, accuracy) {
  // TODO: return absolute difference.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('overconfident gap', calibrationGap(0.8, 0.6), 0.2);
check('underconfident gap', calibrationGap(0.4, 0.7), 0.3);
check('perfect gap', calibrationGap(0.5, 0.5), 0);

return results;`,
    hints: [
      'Use Math.abs.',
      'Subtract accuracy from confidence, then take absolute value.',
      'return Math.abs(confidence - accuracy);',
    ],
    solution: `function calibrationGap(confidence, accuracy) {
  return Math.abs(confidence - accuracy);
}`,
    explanation: 'A calibrated model has small gaps between predicted confidence and observed correctness.',
  },

  {
    id: 'ece-bin-weight',
    stepLabel: '66.1',
    group: 'Expected calibration error',
    title: 'Bin weight',
    concept: 'ECE weights each bin by how many examples it contains.',
    objective: 'Return binCount / totalCount.',
    difficulty: 'warmup',
    starterCode: `function binWeight(binCount, totalCount) {
  // TODO: return bin fraction.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('half the examples', binWeight(50, 100), 0.5);
check('one tenth', binWeight(10, 100), 0.1);
check('empty bin', binWeight(0, 100), 0);

return results;`,
    hints: [
      'Weight is the bin size divided by total size.',
      'Use binCount / totalCount.',
      'return binCount / totalCount;',
    ],
    solution: `function binWeight(binCount, totalCount) {
  return binCount / totalCount;
}`,
    explanation: 'Large bins should matter more than tiny bins in the final ECE.',
  },

  {
    id: 'ece-bin-contribution',
    stepLabel: '66.2',
    group: 'Expected calibration error',
    title: 'One bin contribution',
    concept: 'A bin contributes weight times calibration gap to ECE.',
    objective: 'Return weight * abs(confidence - accuracy).',
    difficulty: 'core',
    starterCode: `function eceBinContribution(binCount, totalCount, confidence, accuracy) {
  const weight = binCount / totalCount;

  // TODO: return weighted calibration gap.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('simple contribution', eceBinContribution(50, 100, 0.8, 0.6), 0.1);
check('perfect bin', eceBinContribution(50, 100, 0.8, 0.8), 0);
check('small bin', eceBinContribution(10, 100, 0.4, 0.7), 0.03);

return results;`,
    hints: [
      'Calibration gap is Math.abs(confidence - accuracy).',
      'Multiply by weight.',
      'return weight * Math.abs(confidence - accuracy);',
    ],
    solution: `function eceBinContribution(binCount, totalCount, confidence, accuracy) {
  const weight = binCount / totalCount;
  return weight * Math.abs(confidence - accuracy);
}`,
    explanation: 'ECE summarizes calibration error across bins with size weighting.',
  },

  {
    id: 'ece-full',
    stepLabel: '66.3',
    group: 'Expected calibration error',
    title: 'Expected calibration error',
    concept: 'ECE is the sum of weighted calibration gaps across bins.',
    objective: 'Accumulate each bin weighted gap.',
    difficulty: 'challenge',
    starterCode: `function expectedCalibrationError(bins, totalCount) {
  let ece = 0;

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];

    // bin has count, confidence, accuracy.
    // TODO: add this bin's contribution.
    ece += 0;
  }

  return ece;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('two bins', expectedCalibrationError([{ count: 50, confidence: 0.8, accuracy: 0.6 }, { count: 50, confidence: 0.4, accuracy: 0.5 }], 100), 0.15);
check('perfect calibration', expectedCalibrationError([{ count: 30, confidence: 0.7, accuracy: 0.7 }, { count: 70, confidence: 0.2, accuracy: 0.2 }], 100), 0);

return results;`,
    hints: [
      'For each bin, contribution is count / totalCount times absolute confidence-accuracy gap.',
      'Use Math.abs(bin.confidence - bin.accuracy).',
      'ece += (bin.count / totalCount) * Math.abs(bin.confidence - bin.accuracy);',
    ],
    solution: `function expectedCalibrationError(bins, totalCount) {
  let ece = 0;

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];

    ece += (bin.count / totalCount) * Math.abs(bin.confidence - bin.accuracy);
  }

  return ece;
}`,
    explanation: 'ECE is a compact calibration summary, but it depends on binning choices.',
  },

  {
    id: 'cost-false-positive',
    stepLabel: '67.1',
    group: 'Cost-sensitive thresholding',
    title: 'False positive cost',
    concept: 'False positives and false negatives can have different costs.',
    objective: 'Return fp * falsePositiveCost.',
    difficulty: 'warmup',
    starterCode: `function falsePositiveCost(fp, falsePositiveCostPerCase) {
  // TODO: return total false-positive cost.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two false positives cost 5', falsePositiveCost(2, 5), 10);
check('zero false positives', falsePositiveCost(0, 5), 0);
check('three false positives cost 10', falsePositiveCost(3, 10), 30);

return results;`,
    hints: [
      'Total cost is count times cost per case.',
      'Use fp * falsePositiveCostPerCase.',
      'return fp * falsePositiveCostPerCase;',
    ],
    solution: `function falsePositiveCost(fp, falsePositiveCostPerCase) {
  return fp * falsePositiveCostPerCase;
}`,
    explanation: 'When false alarms are expensive, precision may matter more.',
  },

  {
    id: 'cost-false-negative',
    stepLabel: '67.2',
    group: 'Cost-sensitive thresholding',
    title: 'False negative cost',
    concept: 'False negatives may be much more expensive than false positives in safety-critical tasks.',
    objective: 'Return fn * falseNegativeCost.',
    difficulty: 'warmup',
    starterCode: `function falseNegativeCost(fn, falseNegativeCostPerCase) {
  // TODO: return total false-negative cost.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('two false negatives cost 50', falseNegativeCost(2, 50), 100);
check('zero false negatives', falseNegativeCost(0, 50), 0);
check('three false negatives cost 10', falseNegativeCost(3, 10), 30);

return results;`,
    hints: [
      'Total cost is count times cost per case.',
      'Use fn * falseNegativeCostPerCase.',
      'return fn * falseNegativeCostPerCase;',
    ],
    solution: `function falseNegativeCost(fn, falseNegativeCostPerCase) {
  return fn * falseNegativeCostPerCase;
}`,
    explanation: 'When misses are expensive, recall may matter more.',
  },

  {
    id: 'cost-total-decision-cost',
    stepLabel: '67.3',
    group: 'Cost-sensitive thresholding',
    title: 'Total decision cost',
    concept: 'A threshold can be chosen by minimizing total false-positive and false-negative cost.',
    objective: 'Return fp cost plus fn cost.',
    difficulty: 'core',
    starterCode: `function totalDecisionCost(counts, costs) {
  const fpCost = counts.fp * costs.falsePositive;
  const fnCost = counts.fn * costs.falseNegative;

  // TODO: return total cost.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('balanced costs', totalDecisionCost({ fp: 2, fn: 3 }, { falsePositive: 5, falseNegative: 5 }), 25);
check('false negatives expensive', totalDecisionCost({ fp: 2, fn: 3 }, { falsePositive: 1, falseNegative: 10 }), 32);
check('no mistakes', totalDecisionCost({ fp: 0, fn: 0 }, { falsePositive: 5, falseNegative: 10 }), 0);

return results;`,
    hints: [
      'fpCost and fnCost are already computed.',
      'Total cost is their sum.',
      'return fpCost + fnCost;',
    ],
    solution: `function totalDecisionCost(counts, costs) {
  const fpCost = counts.fp * costs.falsePositive;
  const fnCost = counts.fn * costs.falseNegative;

  return fpCost + fnCost;
}`,
    explanation: 'The best threshold depends on the business or safety cost of each error type.',
  },

  {
    id: 'cost-choose-threshold',
    stepLabel: '67.4',
    group: 'Cost-sensitive thresholding',
    title: 'Choose lower-cost threshold',
    concept: 'A cost-sensitive classifier chooses the threshold with lower expected cost.',
    objective: 'Return thresholdA if costA <= costB, otherwise thresholdB.',
    difficulty: 'core',
    starterCode: `function chooseLowerCostThreshold(thresholdA, costA, thresholdB, costB) {
  // TODO: return the threshold with lower cost.
  return thresholdA;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('A lower cost', chooseLowerCostThreshold(0.3, 10, 0.7, 20), 0.3);
check('B lower cost', chooseLowerCostThreshold(0.3, 30, 0.7, 20), 0.7);
check('tie chooses A', chooseLowerCostThreshold(0.3, 20, 0.7, 20), 0.3);

return results;`,
    hints: [
      'Compare costA and costB.',
      'If costA is lower or tied, return thresholdA.',
      'return costA <= costB ? thresholdA : thresholdB;',
    ],
    solution: `function chooseLowerCostThreshold(thresholdA, costA, thresholdB, costB) {
  return costA <= costB ? thresholdA : thresholdB;
}`,
    explanation: 'Threshold selection is a decision problem, not just a metrics problem.',
  },

  {
    id: 'drift-mean-shift',
    stepLabel: '68.1',
    group: 'Drift checks',
    title: 'Mean shift',
    concept: 'A simple drift check compares feature means between reference and current data.',
    objective: 'Return currentMean - referenceMean.',
    difficulty: 'warmup',
    starterCode: `function meanShift(referenceMean, currentMean) {
  // TODO: return current minus reference.
  return 0;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('positive shift', meanShift(10, 13), 3);
check('negative shift', meanShift(10, 7), -3);
check('no shift', meanShift(10, 10), 0);

return results;`,
    hints: [
      'Shift is current value compared with reference.',
      'Use currentMean - referenceMean.',
      'return currentMean - referenceMean;',
    ],
    solution: `function meanShift(referenceMean, currentMean) {
  return currentMean - referenceMean;
}`,
    explanation: 'Mean shift is a simple first warning that a feature distribution has changed.',
  },

  {
    id: 'drift-standardized-mean-shift',
    stepLabel: '68.2',
    group: 'Drift checks',
    title: 'Standardized mean shift',
    concept: 'Standardized shift divides mean change by reference standard deviation.',
    objective: 'Return (currentMean - referenceMean) / referenceStd.',
    difficulty: 'core',
    starterCode: `function standardizedMeanShift(referenceMean, currentMean, referenceStd) {
  // TODO: return standardized shift.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('one std shift', standardizedMeanShift(10, 12, 2), 1);
check('negative shift', standardizedMeanShift(10, 7, 3), -1);
check('zero shift', standardizedMeanShift(10, 10, 5), 0);

return results;`,
    hints: [
      'First compute currentMean - referenceMean.',
      'Then divide by referenceStd.',
      'return (currentMean - referenceMean) / referenceStd;',
    ],
    solution: `function standardizedMeanShift(referenceMean, currentMean, referenceStd) {
  return (currentMean - referenceMean) / referenceStd;
}`,
    explanation: 'A shift of 2 units may be small or large depending on normal feature variation.',
  },

  {
    id: 'drift-threshold-check',
    stepLabel: '68.3',
    group: 'Drift checks',
    title: 'Drift threshold check',
    concept: 'A drift alert can fire when absolute standardized shift exceeds a threshold.',
    objective: 'Return true when |shift| > threshold.',
    difficulty: 'core',
    starterCode: `function driftAlert(standardizedShift, threshold) {
  // TODO: return whether absolute shift exceeds threshold.
  return false;
}`,
    testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('large positive shift', driftAlert(2.5, 2), true);
check('large negative shift', driftAlert(-2.5, 2), true);
check('small shift', driftAlert(1.5, 2), false);
check('equal threshold is not greater', driftAlert(2, 2), false);

return results;`,
    hints: [
      'Use Math.abs.',
      'Compare absolute shift with threshold.',
      'return Math.abs(standardizedShift) > threshold;',
    ],
    solution: `function driftAlert(standardizedShift, threshold) {
  return Math.abs(standardizedShift) > threshold;
}`,
    explanation: 'Drift checks are not proof of model failure, but they can trigger investigation.',
  },

  {
    id: 'drift-psi-term',
    stepLabel: '68.4',
    group: 'Drift checks',
    title: 'PSI term',
    concept: 'Population Stability Index compares reference and current proportions in a bin.',
    objective: 'Return (current - reference) * log(current / reference).',
    difficulty: 'challenge',
    starterCode: `function psiTerm(referenceProportion, currentProportion) {
  // TODO: return one PSI bin contribution.
  return 0;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('same proportions', psiTerm(0.2, 0.2), 0);
check('changed proportions', psiTerm(0.2, 0.4), (0.4 - 0.2) * Math.log(0.4 / 0.2));
check('another change', psiTerm(0.5, 0.25), (0.25 - 0.5) * Math.log(0.25 / 0.5));

return results;`,
    hints: [
      'PSI compares current and reference proportions.',
      'Use Math.log(currentProportion / referenceProportion).',
      'return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);',
    ],
    solution: `function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}`,
    explanation: 'PSI is a common monitoring heuristic for distribution shift across binned features.',
  },

  {
    id: 'drift-total-psi',
    stepLabel: '68.5',
    group: 'Drift checks',
    title: 'Total PSI',
    concept: 'Total PSI sums bin-level PSI contributions.',
    objective: 'Accumulate psiTerm for every bin.',
    difficulty: 'challenge',
    starterCode: `function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}

function populationStabilityIndex(referenceBins, currentBins) {
  let total = 0;

  for (let i = 0; i < referenceBins.length; i++) {
    // TODO: add PSI contribution for this bin.
    total += 0;
  }

  return total;
}`,
    testCode: `const results = [];

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs(a - b) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}

check('no drift', populationStabilityIndex([0.5, 0.5], [0.5, 0.5]), 0);
check('two-bin drift', populationStabilityIndex([0.5, 0.5], [0.25, 0.75]), psiTerm(0.5, 0.25) + psiTerm(0.5, 0.75));

return results;`,
    hints: [
      'Use psiTerm(referenceBins[i], currentBins[i]).',
      'Add each bin contribution to total.',
      'total += psiTerm(referenceBins[i], currentBins[i]);',
    ],
    solution: `function psiTerm(referenceProportion, currentProportion) {
  return (currentProportion - referenceProportion) * Math.log(currentProportion / referenceProportion);
}

function populationStabilityIndex(referenceBins, currentBins) {
  let total = 0;

  for (let i = 0; i < referenceBins.length; i++) {
    total += psiTerm(referenceBins[i], currentBins[i]);
  }

  return total;
}`,
    explanation: 'PSI summarizes how much a binned distribution changed between reference and current data.',
  },

  // --- WAVE 2: ADDED RANKING EXERCISES ---
  {
    id: 'ranking-loss-diff',
    stepLabel: '12.1',
    group: 'Ranking training step',
    title: 'Positive-negative score gap',
    concept: 'Pairwise ranking compares a positive item score against a negative item score.',
    objective: 'Compute scoreDiff = dot(user, itemPos) - dot(user, itemNeg).',
    difficulty: 'warmup',
    starterCode: `function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  // TODO: compute scoreDiff
  const scoreDiff = 0;
  return scoreDiff;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('score diff', rankingLoss([1, 0], [2, 0], [1, 0], 1), 1);
return results;`,
    hints: ['const scoreDiff = scorePos - scoreNeg;'],
    solution: `function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  return scoreDiff;
}`,
    explanation: 'Ranking starts from relative score ordering, not absolute calibration.',
  },
  {
    id: 'ranking-loss-margin-gap',
    stepLabel: '12.2',
    group: 'Ranking training step',
    title: 'Margin violation term',
    concept: 'Hinge ranking loss penalizes when score gap is below margin.',
    objective: 'Compute violation = margin - scoreDiff.',
    difficulty: 'warmup',
    starterCode: `function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  // TODO: compute violation = margin - scoreDiff
  const violation = 0;
  return violation;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('violation term', rankingLoss([1, 0], [2, 0], [1, 0], 1), 0);
return results;`,
    hints: ['const violation = margin - scoreDiff;'],
    solution: `function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  const violation = margin - scoreDiff;
  return violation;
}`,
    explanation: 'Margin encodes how much better positives should score than negatives.',
  },
  {
    id: 'ranking-loss-hinge',
    stepLabel: '12.3',
    group: 'Ranking training step',
    title: 'Hinge clipping',
    concept: 'Only positive violations contribute to loss; satisfied pairs contribute zero.',
    objective: 'Return Math.max(0, violation).',
    difficulty: 'core',
    starterCode: `function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  const violation = margin - scoreDiff;
  // TODO: apply hinge clipping
  return violation;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero when satisfied', rankingLoss([1, 0], [2, 0], [1, 0], 1), 0);
check('positive when violated', rankingLoss([1, 0], [1, 0], [1, 0], 1), 1);
return results;`,
    hints: ['return Math.max(0, violation);'],
    solution: `function rankingLoss(user, itemPos, itemNeg, margin) {
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  const violation = margin - scoreDiff;
  return Math.max(0, violation);
}`,
    explanation: 'Hinge clipping prevents over-optimizing already-correct pairs.',
  },
  {
    id: 'ranking-loss-training-step',
    stepLabel: '12.4',
    group: 'Ranking training step',
    title: 'Full ranking loss step',
    concept: 'One pairwise training step computes a scalar hinge loss from embeddings.',
    objective: 'Guard empty vectors and return pairwise hinge loss.',
    difficulty: 'core',
    starterCode: `function rankingLoss(user, itemPos, itemNeg, margin) {
  // TODO: return 0 when user is empty
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  return Math.max(0, margin - scoreDiff);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty user', rankingLoss([], [], [], 1), 0);
check('non-empty pair', rankingLoss([1, 0], [1, 0], [1, 0], 1), 1);
return results;`,
    hints: ['if (user.length === 0) return 0;'],
    solution: `function rankingLoss(user, itemPos, itemNeg, margin) {
  if (user.length === 0) return 0;
  let scorePos = 0;
  let scoreNeg = 0;
  for (let i = 0; i < user.length; i++) {
    scorePos += user[i] * itemPos[i];
    scoreNeg += user[i] * itemNeg[i];
  }
  const scoreDiff = scorePos - scoreNeg;
  return Math.max(0, margin - scoreDiff);
}`,
    explanation: 'The final utility is directly usable in mini-batch pairwise ranking.',
  },
  {
    id: 'eval-pass-at-k-edge',
    stepLabel: '28.1',
    group: 'Pass@k',
    title: 'Guaranteed Pass Condition',
    concept: 'Pass@k measures LLM code generation quality: probability that at least one of k generated samples passes tests. If the number of failing samples (n - c) is less than k, you are guaranteed to pick at least one passing sample.',
    objective: 'If n - c < k, return 1.0.',
    difficulty: 'warmup',
    starterCode: `function passAtK(n, c, k) {
  // TODO: check the guaranteed pass condition
  
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('guaranteed pass', passAtK(10, 9, 2), 1.0);
return results;`,
    hints: [
      'if (n - c < k) return 1.0;',
    ],
    solution: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    explanation: 'By checking this early, we avoid calculating probabilities for impossible failing combinations.',
  },
  {
    id: 'eval-pass-at-k-base',
    stepLabel: '28.2',
    group: 'Pass@k',
    title: 'Failure Probability Initialization',
    concept: 'To find the probability of at least one pass, we first calculate the probability that ALL k samples fail. We initialize the product to 1.0.',
    objective: 'Initialize a variable prod to 1.0.',
    difficulty: 'warmup',
    starterCode: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  
  // TODO: initialize the failure probability product
  let prod = 0;
  
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('pass@1 equal', passAtK(10, 2, 1), 0.2); // 1 - 0.8
return results;`,
    hints: [
      'let prod = 1.0;',
    ],
    solution: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    explanation: 'A product accumulator must start at 1.0 to multiply consecutive probabilities.',
  },
  {
    id: 'eval-pass-at-k-loop',
    stepLabel: '28.3',
    group: 'Pass@k',
    title: 'Sampling Iteration',
    concept: 'We iterate k times, representing drawing k samples without replacement from the n total samples.',
    objective: 'Create a loop from i = 0 to i < k.',
    difficulty: 'warmup',
    starterCode: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  
  // TODO: loop from 0 up to k-1
  let i = 0;
  if (i < k) {
    prod *= (n - c - i) / (n - i);
  }
  
  return 1.0 - prod;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('pass@2 with c=2', passAtK(10, 2, 2), 0.377778);
return results;`,
    hints: [
      'for (let i = 0; i < k; i++) {',
      '  prod *= (n - c - i) / (n - i);',
      '}',
    ],
    solution: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    explanation: 'This models sampling k times in a row.',
  },
  {
    id: 'eval-pass-at-k-accumulate',
    stepLabel: '28.4',
    group: 'Pass@k',
    title: 'Failure Chain Accumulation',
    concept: 'At step i, there are (n - i) remaining samples to pick from, and (n - c - i) of them are failing samples. We multiply the current failure probability by this ratio.',
    objective: 'Multiply prod by (n - c - i) / (n - i).',
    difficulty: 'core',
    starterCode: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    // TODO: multiply prod by the failure ratio
    prod *= 1.0;
  }
  return 1.0 - prod;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('pass@2 with c=2', passAtK(10, 2, 2), 0.377778);
return results;`,
    hints: [
      'prod *= (n - c - i) / (n - i);',
    ],
    solution: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    explanation: 'The product chain computes the total probability that every single sampled output is a failure.',
  },
  {
    id: 'eval-pass-at-k',
    stepLabel: '28.5',
    group: 'Pass@k',
    title: 'Pass@k Final Metric',
    concept: 'Since we computed the probability that ALL k samples fail, the probability that AT LEAST ONE sample passes is its complement: 1.0 - prod.',
    objective: 'Return 1.0 - prod.',
    difficulty: 'core',
    starterCode: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  // TODO: return the probability of at least one pass
  return prod;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('pass@2 with c=2', passAtK(10, 2, 2), 0.377778);
return results;`,
    hints: [
      'return 1.0 - prod;',
    ],
    solution: `function passAtK(n, c, k) {
  if (n - c < k) return 1.0;
  let prod = 1.0;
  for (let i = 0; i < k; i++) {
    prod *= (n - c - i) / (n - i);
  }
  return 1.0 - prod;
}`,
    explanation: 'Pass@k estimates how likely a user is to get a working code snippet if they sample k solutions from the model.',
  },

  // --- WAVE 5: MODEL RELIABILITY ---
  {
    id: 'shapley-sum-accumulate',
    stepLabel: '48.1',
    group: 'Shapley attribution check',
    title: 'Attribution sum accumulation',
    concept: 'Shapley efficiency compares total attribution mass against prediction delta.',
    objective: 'Accumulate all attribution values into sum.',
    difficulty: 'warmup',
    starterCode: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    // TODO: add attributions[i] into sum
    sum += 0;
  }
  return sum;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sum attributions', verifyShapleySum([0.2, -0.1, 0.4], 0, 0), 0.5);
return results;`,
    hints: ['sum += attributions[i];'],
    solution: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  return sum;
}`,
    explanation: 'Summation is the bridge between local attributions and global delta.',
  },
  {
    id: 'shapley-sum-delta',
    stepLabel: '48.2',
    group: 'Shapley attribution check',
    title: 'Prediction-baseline delta',
    concept: 'The target quantity is prediction minus baseline expected value.',
    objective: 'Compute delta = prediction - baseline.',
    difficulty: 'warmup',
    starterCode: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  // TODO: compute prediction delta
  const delta = 0;
  return delta;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('delta value', verifyShapleySum([0.2], 0.9, 0.4), 0.5);
return results;`,
    hints: ['const delta = prediction - baseline;'],
    solution: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return delta;
}`,
    explanation: 'Delta is the amount Shapley values must exactly explain.',
  },
  {
    id: 'shapley-sum-tolerance',
    stepLabel: '48.3',
    group: 'Shapley attribution check',
    title: 'Tolerance comparison',
    concept: 'Floating-point noise requires near-equality rather than exact equality.',
    objective: 'Return Math.abs(sum - delta) < 1e-5.',
    difficulty: 'core',
    starterCode: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  // TODO: compare sum and delta with tolerance
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('matches within tol', verifyShapleySum([0.2, 0.3], 1.0, 0.5), true);
check('mismatch', verifyShapleySum([0.2, 0.2], 1.0, 0.5), false);
return results;`,
    hints: ['return Math.abs(sum - delta) < 1e-5;'],
    solution: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}`,
    explanation: 'Tolerance checks preserve numeric stability in attribution audits.',
  },
  {
    id: 'shapley-sum-check',
    stepLabel: '48.4',
    group: 'Shapley attribution check',
    title: 'Full Shapley sum verification',
    concept: 'Efficiency passes when attribution sum equals prediction shift from baseline.',
    objective: 'Return false for empty attributions unless delta is zero.',
    difficulty: 'core',
    starterCode: `function verifyShapleySum(attributions, prediction, baseline) {
  // TODO: handle empty attributions case
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty exact zero', verifyShapleySum([], 1.0, 1.0), true);
check('empty non-zero', verifyShapleySum([], 1.0, 0.8), false);
return results;`,
    hints: ['if (attributions.length === 0) return Math.abs(prediction - baseline) < 1e-5;'],
    solution: `function verifyShapleySum(attributions, prediction, baseline) {
  if (attributions.length === 0) return Math.abs(prediction - baseline) < 1e-5;
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}`,
    explanation: 'Edge-case handling keeps audits deterministic for sparse explanations.',
  },
  {
    id: 'fairness-rate-a',
    stepLabel: '49.1',
    group: 'Fairness audit',
    title: 'Group A selection rate',
    concept: 'Demographic parity compares subgroup positive prediction rates.',
    objective: 'Compute positive rate for groupA.',
    difficulty: 'warmup',
    starterCode: `function demographicParityGap(predictions, groups, groupA, groupB) {
  let countA = 0;
  let posA = 0;
  for (let i = 0; i < predictions.length; i++) {
    // TODO: update countA and posA for groupA
  }
  return countA === 0 ? 0 : posA / countA;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const preds = [1, 0, 1, 1];
const grps = ['A', 'A', 'B', 'B'];
check('rate A', demographicParityGap(preds, grps, 'A', 'B'), 0.5);
return results;`,
    hints: ['if (groups[i] === groupA) { countA++; if (predictions[i] === 1) posA++; }'],
    solution: `function demographicParityGap(predictions, groups, groupA, groupB) {
  let countA = 0;
  let posA = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (groups[i] === groupA) {
      countA++;
      if (predictions[i] === 1) posA++;
    }
  }
  return countA === 0 ? 0 : posA / countA;
}`,
    explanation: 'Each subgroup rate is computed independently before parity comparison.',
  },
  {
    id: 'fairness-rate-b',
    stepLabel: '49.2',
    group: 'Fairness audit',
    title: 'Group B selection rate',
    concept: 'Parity requires both groups to be measured with the same metric.',
    objective: 'Compute positive rate for groupB.',
    difficulty: 'warmup',
    starterCode: `function demographicParityGap(predictions, groups, groupA, groupB) {
  let countB = 0;
  let posB = 0;
  for (let i = 0; i < predictions.length; i++) {
    // TODO: update countB and posB for groupB
  }
  return countB === 0 ? 0 : posB / countB;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const preds = [1, 0, 1, 1];
const grps = ['A', 'A', 'B', 'B'];
check('rate B', demographicParityGap(preds, grps, 'A', 'B'), 1);
return results;`,
    hints: ['if (groups[i] === groupB) { countB++; if (predictions[i] === 1) posB++; }'],
    solution: `function demographicParityGap(predictions, groups, groupA, groupB) {
  let countB = 0;
  let posB = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (groups[i] === groupB) {
      countB++;
      if (predictions[i] === 1) posB++;
    }
  }
  return countB === 0 ? 0 : posB / countB;
}`,
    explanation: 'Symmetry in measurement avoids biased fairness diagnostics.',
  },
  {
    id: 'fairness-gap-abs',
    stepLabel: '49.3',
    group: 'Fairness audit',
    title: 'Absolute parity gap',
    concept: 'Demographic parity gap is the absolute difference between subgroup rates.',
    objective: 'Return Math.abs(rateA - rateB).',
    difficulty: 'core',
    starterCode: `function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  // TODO: absolute difference
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const preds = [1, 0, 1, 1];
const grps = ['A', 'A', 'B', 'B'];
check('gap', demographicParityGap(preds, grps, 'A', 'B'), 0.5);
return results;`,
    hints: ['return Math.abs(rateA - rateB);'],
    solution: `function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  return Math.abs(rateA - rateB);
}`,
    explanation: 'Absolute gap captures disparity magnitude independent of direction.',
  },
  {
    id: 'fairness-audit-gap',
    stepLabel: '49.4',
    group: 'Fairness audit',
    title: 'Full fairness audit function',
    concept: 'A complete parity audit handles missing groups and reports stable gaps.',
    objective: 'Return 0 when both groups are absent, otherwise parity gap.',
    difficulty: 'core',
    starterCode: `function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  // TODO: handle empty predictions edge case
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  return Math.abs(rateA - rateB);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty list', demographicParityGap([], [], 'A', 'B'), 0);
check('non-empty', demographicParityGap([1, 0], ['A', 'B'], 'A', 'B'), 1);
return results;`,
    hints: ['if (predictions.length === 0) return 0;'],
    solution: `function demographicParityGap(predictions, groups, groupA, groupB) {
  function rate(target) {
    let count = 0;
    let pos = 0;
    for (let i = 0; i < predictions.length; i++) {
      if (groups[i] === target) {
        count++;
        if (predictions[i] === 1) pos++;
      }
    }
    return count === 0 ? 0 : pos / count;
  }
  if (predictions.length === 0) return 0;
  const rateA = rate(groupA);
  const rateB = rate(groupB);
  return Math.abs(rateA - rateB);
}`,
    explanation: 'Robust auditing pipelines must handle sparse or empty slices safely.',
  },
  {
    id: 'uncertainty-entropy-binary',
    stepLabel: '50.1',
    group: 'Uncertainty report',
    title: 'Binary entropy core',
    concept: 'Binary entropy measures uncertainty from class probability p.',
    objective: 'Compute binary entropy H(p).',
    difficulty: 'warmup',
    starterCode: `function uncertaintyReport(p, mcSamples) {
  // TODO: compute entropy, handling p = 0 or 1
  const entropy = 0;
  return { entropy, variance: 0 };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('entropy 0.5', uncertaintyReport(0.5, [1]).entropy, 1);
return results;`,
    hints: ['entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));'],
    solution: `function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  return { entropy, variance: 0 };
}`,
    explanation: 'Entropy peaks at balanced predictions and drops at certainty extremes.',
  },
  {
    id: 'uncertainty-mean-samples',
    stepLabel: '50.2',
    group: 'Uncertainty report',
    title: 'MC sample mean',
    concept: 'Variance requires the sample mean as its center.',
    objective: 'Compute mean of mcSamples.',
    difficulty: 'warmup',
    starterCode: `function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  let mean = 0;
  // TODO: compute mean from mcSamples
  return { entropy, variance: mean };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('sample mean', uncertaintyReport(0.5, [0.7, 0.8, 0.9]).variance, 0.8);
return results;`,
    hints: ['mean = mcSamples.reduce((s, x) => s + x, 0) / mcSamples.length;'],
    solution: `function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const mean = mcSamples.reduce((s, x) => s + x, 0) / mcSamples.length;
  return { entropy, variance: mean };
}`,
    explanation: 'Mean centers fluctuation measurements across stochastic forward passes.',
  },
  {
    id: 'uncertainty-mc-variance',
    stepLabel: '50.3',
    group: 'Uncertainty report',
    title: 'MC variance estimate',
    concept: 'Epistemic uncertainty can be approximated by sample variance over dropout passes.',
    objective: 'Compute sample variance var/(n-1).',
    difficulty: 'core',
    starterCode: `function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    // TODO: accumulate squared deviation
    varSum += 0;
  }
  return { entropy, variance: varSum / (n - 1) };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('variance sample', uncertaintyReport(0.5, [0.8, 0.7, 0.9]).variance, 0.01);
return results;`,
    hints: ['varSum += Math.pow(mcSamples[i] - mean, 2);'],
    solution: `function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(mcSamples[i] - mean, 2);
  }
  return { entropy, variance: varSum / (n - 1) };
}`,
    explanation: 'Higher variance indicates more disagreement across stochastic predictions.',
  },
  {
    id: 'uncertainty-report-full',
    stepLabel: '50.4',
    group: 'Uncertainty report',
    title: 'Complete uncertainty report',
    concept: 'A full uncertainty report combines aleatoric entropy and epistemic variance.',
    objective: 'Handle empty mcSamples and return both metrics.',
    difficulty: 'core',
    starterCode: `function uncertaintyReport(p, mcSamples) {
  // TODO: if mcSamples is empty return variance 0
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) varSum += Math.pow(mcSamples[i] - mean, 2);
  return { entropy, variance: varSum / (n - 1) };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty samples variance', uncertaintyReport(0.4, []).variance, 0);
check('entropy finite', Number.isFinite(uncertaintyReport(0.4, []).entropy), true);
return results;`,
    hints: ['if (mcSamples.length === 0) return { entropy, variance: 0 };'],
    solution: `function uncertaintyReport(p, mcSamples) {
  const entropy = p === 0 || p === 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
  if (mcSamples.length === 0) return { entropy, variance: 0 };
  const n = mcSamples.length;
  if (n <= 1) return { entropy, variance: 0 };
  const mean = mcSamples.reduce((s, x) => s + x, 0) / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) varSum += Math.pow(mcSamples[i] - mean, 2);
  return { entropy, variance: varSum / (n - 1) };
}`,
    explanation: 'Both uncertainty channels are useful for risk-aware model decisions.',
  },
  {
    id: 'adv-perturb-sign',
    stepLabel: '51.1',
    group: 'Adversarial perturbation',
    title: 'Gradient sign direction',
    concept: 'FGSM uses the sign of gradient to choose perturbation direction.',
    objective: 'Compute sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0).',
    difficulty: 'warmup',
    starterCode: `function adversarialPerturb(x, grad, epsilon) {
  // TODO: compute sign from grad
  const sign = 0;
  return sign;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive sign', adversarialPerturb(0.5, 2, 0.1), 1);
check('negative sign', adversarialPerturb(0.5, -3, 0.1), -1);
return results;`,
    hints: ['const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);'],
    solution: `function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  return sign;
}`,
    explanation: 'Sign-only direction makes perturbation robust to gradient magnitude scale.',
  },
  {
    id: 'adv-perturb-step',
    stepLabel: '51.2',
    group: 'Adversarial perturbation',
    title: 'FGSM step value',
    concept: 'The perturbation adds epsilon times sign of gradient to input.',
    objective: 'Compute xAdv = x + epsilon * sign.',
    difficulty: 'warmup',
    starterCode: `function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  // TODO: compute perturbed value
  return x;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('fgsm step', adversarialPerturb(0.5, -3, 0.1), 0.4);
return results;`,
    hints: ['return x + epsilon * sign;'],
    solution: `function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  return x + epsilon * sign;
}`,
    explanation: 'A single FGSM step is a first-order attack approximation.',
  },
  {
    id: 'adv-perturb-clip',
    stepLabel: '51.3',
    group: 'Adversarial perturbation',
    title: 'L-infinity clipping',
    concept: 'Adversarial perturbation is clipped to stay within epsilon-ball around original input.',
    objective: 'Clip xAdv to [x - epsilon, x + epsilon].',
    difficulty: 'core',
    starterCode: `function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  // TODO: clip xAdv
  return xAdv;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('clipped exact', adversarialPerturb(0.5, 10, 0.05), 0.55);
return results;`,
    hints: ['return Math.max(minVal, Math.min(maxVal, xAdv));'],
    solution: `function adversarialPerturb(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}`,
    explanation: 'Projection keeps the perturbation bounded and comparable across samples.',
  },
  {
    id: 'adv-perturb-full',
    stepLabel: '51.4',
    group: 'Adversarial perturbation',
    title: 'Complete perturbation function',
    concept: 'Production attacks should tolerate epsilon=0 as a no-op.',
    objective: 'Return x when epsilon is 0, otherwise FGSM clipped perturbation.',
    difficulty: 'core',
    starterCode: `function adversarialPerturb(x, grad, epsilon) {
  // TODO: handle zero epsilon as no-op
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('epsilon zero', adversarialPerturb(0.5, 10, 0), 0.5);
check('epsilon nonzero', adversarialPerturb(0.5, -10, 0.1), 0.4);
return results;`,
    hints: ['if (epsilon === 0) return x;'],
    solution: `function adversarialPerturb(x, grad, epsilon) {
  if (epsilon === 0) return x;
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  const xAdv = x + epsilon * sign;
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}`,
    explanation: 'No-op handling makes the API predictable in ablation settings.',
  },
];
