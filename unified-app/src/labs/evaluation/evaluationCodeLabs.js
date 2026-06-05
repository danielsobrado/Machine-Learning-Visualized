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
    id: 'rank-dot-score',
    stepLabel: '12.1',
    group: 'Dot score',
    title: 'User-item dot product score',
    concept: 'Collaborative filtering and ranking models score user-item pairs by calculating the dot product of user and item embedding vectors.',
    objective: 'Compute the dot product score of user and item vectors.',
    difficulty: 'warmup',
    starterCode: `function dotUserItem(user, item) {
  let score = 0;
  for (let i = 0; i < user.length; i++) {
    // TODO: multiply user[i] by item[i] and add to score
    score += 0;
  }
  return score;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('score aligned', dotUserItem([0.5, 0.5], [2.0, 3.0]), 2.5);
check('score zero', dotUserItem([0.0, 1.0], [5.0, 0.0]), 0);
return results;`,
    hints: [
      'Multiply user[i] by item[i].',
      'Add it to the score variable.',
      'score += user[i] * item[i];',
    ],
    solution: `function dotUserItem(user, item) {
  let score = 0;
  for (let i = 0; i < user.length; i++) {
    score += user[i] * item[i];
  }
  return score;
}`,
    explanation: 'User-item dot product measures how much the user preferences align with item features.',
  },
  {
    id: 'rank-pairwise-hinge',
    stepLabel: '12.2',
    group: 'Pairwise hinge',
    title: 'Pairwise hinge loss',
    concept: 'Pairwise ranking loss pushes positive items to have higher scores than negative items. Hinge loss is max(0, margin - (scorePos - scoreNeg)).',
    objective: 'Compute the pairwise hinge loss with a given margin.',
    difficulty: 'core',
    starterCode: `function pairwiseHingeLoss(scorePos, scoreNeg, margin = 1.0) {
  const diff = scorePos - scoreNeg;
  // TODO: return max(0, margin - diff)
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('loss positive', pairwiseHingeLoss(0.5, 0.2, 1.0), 0.7); // 1.0 - 0.3 = 0.7
check('loss zero', pairwiseHingeLoss(1.5, 0.2, 1.0), 0); // 1.0 - 1.3 = -0.3 <= 0
return results;`,
    hints: [
      'Use Math.max(0, margin - diff).',
    ],
    solution: `function pairwiseHingeLoss(scorePos, scoreNeg, margin = 1.0) {
  const diff = scorePos - scoreNeg;
  return Math.max(0, margin - diff);
}`,
    explanation: 'Hinge loss penalizes the model when the positive item score is not higher than the negative item score by at least the margin.',
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
    id: 'interpretability-marginal',
    stepLabel: '48.1',
    group: 'Marginal contrib',
    title: 'Marginal Contribution',
    concept: 'Shapley values explain predictions by computing the marginal contribution of each feature across subset combinations.',
    objective: 'Compute the difference in model prediction with versus without feature i: f(S union {i}) - f(S).',
    difficulty: 'warmup',
    starterCode: `function marginalContribution(predWith, predWithout) {
  // TODO: return the difference between prediction with and without feature
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('positive contribution', marginalContribution(0.85, 0.60), 0.25);
check('negative contribution', marginalContribution(0.40, 0.55), -0.15);
return results;`,
    hints: [
      'Subtract predWithout from predWith.',
      'return predWith - predWithout;',
    ],
    solution: `function marginalContribution(predWith, predWithout) {
  return predWith - predWithout;
}`,
    explanation: 'A feature\'s marginal contribution measures its direct value-add to a specific coalition of features.',
  },
  {
    id: 'interpretability-shapley-sum',
    stepLabel: '48.2',
    group: 'Sum to delta',
    title: 'Shapley Attribution Sum',
    concept: 'The sum of Shapley values for all features exactly equals the difference between the model\'s prediction and the base expected value.',
    objective: 'Verify that the sum of feature attributions matches the prediction delta: sum(phi_i) === f(x) - E[f(x)].',
    difficulty: 'core',
    starterCode: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    // TODO: accumulate attributions
    sum += 0;
  }
  const delta = prediction - baseline;
  // Check if they are approximately equal within a small tolerance
  return Math.abs(sum - delta) < 1e-5;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('sum matches delta', verifyShapleySum([0.15, 0.05, -0.10], 0.85, 0.75), true);
check('sum mismatch', verifyShapleySum([0.15, 0.05, -0.10], 0.95, 0.75), false);
return results;`,
    hints: [
      'Accumulate attributions[i] into sum.',
      'sum += attributions[i];',
    ],
    solution: `function verifyShapleySum(attributions, prediction, baseline) {
  let sum = 0;
  for (let i = 0; i < attributions.length; i++) {
    sum += attributions[i];
  }
  const delta = prediction - baseline;
  return Math.abs(sum - delta) < 1e-5;
}`,
    explanation: 'Efficiency (or efficiency axiom) ensures that the total payout (prediction offset) is fully distributed among players (features).',
  },
  {
    id: 'fairness-group-rate',
    stepLabel: '49.1',
    group: 'Group rate',
    title: 'Subgroup Positive Rate',
    concept: 'Fairness audits require measuring metric rates within protected subgroups.',
    objective: 'Compute the positive prediction rate (selection rate) for a target subgroup: count(y_pred=1) / count(group=targetGroup).',
    difficulty: 'warmup',
    starterCode: `function subgroupSelectionRate(predictions, groups, targetGroup) {
  let groupCount = 0;
  let positiveCount = 0;
  
  for (let i = 0; i < predictions.length; i++) {
    // TODO: if groups[i] is targetGroup, increment groupCount.
    // Additionally, if prediction is 1, increment positiveCount.
  }
  
  if (groupCount === 0) return 0;
  return positiveCount / groupCount;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const preds = [1, 0, 1, 1, 0];
const grps  = ['A', 'A', 'B', 'B', 'B'];
check('selection rate group A', subgroupSelectionRate(preds, grps, 'A'), 0.5);
check('selection rate group B', subgroupSelectionRate(preds, grps, 'B'), 2 / 3);
return results;`,
    hints: [
      'Check if groups[i] === targetGroup.',
      'If true, increment groupCount, and check if predictions[i] === 1 to increment positiveCount.',
    ],
    solution: `function subgroupSelectionRate(predictions, groups, targetGroup) {
  let groupCount = 0;
  let positiveCount = 0;
  
  for (let i = 0; i < predictions.length; i++) {
    if (groups[i] === targetGroup) {
      groupCount++;
      if (predictions[i] === 1) {
        positiveCount++;
      }
    }
  }
  
  if (groupCount === 0) return 0;
  return positiveCount / groupCount;
}`,
    explanation: 'Measuring selection rate within groups is the first step to checking demographic parity.',
  },
  {
    id: 'fairness-parity-gap',
    stepLabel: '49.2',
    group: 'Parity gap',
    title: 'Demographic Parity Gap',
    concept: 'Demographic parity states that the likelihood of receiving a positive outcome should be equal across all subgroups.',
    objective: 'Calculate the demographic parity gap: |rate_A - rate_B|.',
    difficulty: 'core',
    starterCode: `function demographicParityGap(predictions, groups, groupA, groupB) {
  function getRate(target) {
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
  
  const rateA = getRate(groupA);
  const rateB = getRate(groupB);
  
  // TODO: return absolute difference between rateA and rateB
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const preds = [1, 0, 1, 1, 0];
const grps  = ['A', 'A', 'B', 'B', 'B'];
check('parity gap', demographicParityGap(preds, grps, 'A', 'B'), 2/3 - 0.5);
return results;`,
    hints: [
      'Use Math.abs to compute absolute differences.',
      'return Math.abs(rateA - rateB);',
    ],
    solution: `function demographicParityGap(predictions, groups, groupA, groupB) {
  function getRate(target) {
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
  
  const rateA = getRate(groupA);
  const rateB = getRate(groupB);
  
  return Math.abs(rateA - rateB);
}`,
    explanation: 'A demographic parity gap close to 0 indicates outcome independence from protected attributes.',
  },
  {
    id: 'uncertainty-entropy',
    stepLabel: '50.1',
    group: 'Predictive entropy',
    title: 'Shannon Entropy Uncertainty',
    concept: 'Uncertainty can be quantified using Shannon entropy on class probabilities: H(p) = -sum(p_i * log2(p_i)).',
    objective: 'Compute the entropy for a binary probability vector [p, 1-p].',
    difficulty: 'warmup',
    starterCode: `function binaryEntropy(p) {
  if (p === 0 || p === 1) return 0;
  const q = 1 - p;
  // TODO: compute and return - (p * log2(p) + q * log2(q))
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('maximum entropy', binaryEntropy(0.5), 1.0);
check('low entropy', binaryEntropy(0.1), 0.468996);
return results;`,
    hints: [
      'Use Math.log2 to compute log base 2.',
      'return -(p * Math.log2(p) + q * Math.log2(q));',
    ],
    solution: `function binaryEntropy(p) {
  if (p === 0 || p === 1) return 0;
  const q = 1 - p;
  return -(p * Math.log2(p) + q * Math.log2(q));
}`,
    explanation: 'Entropy is highest (1.0 for binary) when model outputs are completely uncertain (0.5 prediction probability).',
  },
  {
    id: 'uncertainty-mc-variance',
    stepLabel: '50.2',
    group: 'Variance across samples',
    title: 'Monte Carlo Dropout Variance',
    concept: 'MC Dropout estimates uncertainty by running multiple forward passes with active dropout and measuring variance.',
    objective: 'Compute sample variance of prediction outputs: sum((x_i - mean)^2) / (N - 1).',
    difficulty: 'core',
    starterCode: `function mcVariance(preds) {
  const n = preds.length;
  if (n <= 1) return 0;
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += preds[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    // TODO: accumulate squared deviation from mean
    varSum += 0;
  }
  
  return varSum / (n - 1);
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('variance sample list', mcVariance([0.8, 0.7, 0.9]), 0.01);
return results;`,
    hints: [
      'For each prediction x_i, compute (x_i - mean)^2.',
      'varSum += Math.pow(preds[i] - mean, 2);',
    ],
    solution: `function mcVariance(preds) {
  const n = preds.length;
  if (n <= 1) return 0;
  
  let sum = 0;
  for (let i = 0; i < n; i++) sum += preds[i];
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(preds[i] - mean, 2);
  }
  
  return varSum / (n - 1);
}`,
    explanation: 'High variance across dropout passes indicates high model epistemic uncertainty about a sample.',
  },
  {
    id: 'security-fgsm-step',
    stepLabel: '51.1',
    group: 'Gradient sign step',
    title: 'FGSM Perturbation Step',
    concept: 'The Fast Gradient Sign Method (FGSM) generates adversarial examples by shifting input coordinates in the direction of the sign of the loss gradient.',
    objective: 'Compute the adversarial image coordinate: x_adv = x + epsilon * sign(grad).',
    difficulty: 'warmup',
    starterCode: `function fgsmStep(x, grad, epsilon) {
  // TODO: compute adversarial value based on sign of gradient.
  // sign(grad) is 1 if grad > 0, -1 if grad < 0, 0 if grad === 0.
  let sign = 0;
  
  return x + epsilon * sign;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive gradient shift', fgsmStep(0.5, 0.2, 0.05), 0.55);
check('negative gradient shift', fgsmStep(0.5, -4.5, 0.05), 0.45);
check('zero gradient shift', fgsmStep(0.5, 0.0, 0.05), 0.50);
return results;`,
    hints: [
      'Use Math.sign(grad) to get the sign of the gradient.',
      'If Math.sign is unavailable or you want to write it out: grad > 0 ? 1 : (grad < 0 ? -1 : 0).',
    ],
    solution: `function fgsmStep(x, grad, epsilon) {
  const sign = grad > 0 ? 1 : (grad < 0 ? -1 : 0);
  return x + epsilon * sign;
}`,
    explanation: 'Perturbing inputs along the loss sign direction maximizes the loss function, inducing misclassification with minimal visual change.',
  },
  {
    id: 'security-clip-perturb',
    stepLabel: '51.2',
    group: 'Perturbation clip',
    title: 'Adversarial Perturbation Clipping',
    concept: 'To keep adversarial examples imperceptible, the total perturbation is clipped to lie within an L-infinity boundary: [x - epsilon, x + epsilon].',
    objective: 'Clip the adversarial value x_adv to stay within epsilon range of the original value x.',
    difficulty: 'core',
    starterCode: `function clipPerturbation(x, xAdv, epsilon) {
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  
  // TODO: clip xAdv to lie between minVal and maxVal
  return xAdv;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('under upper bound', clipPerturbation(0.5, 0.53, 0.05), 0.53);
check('exceeds upper bound', clipPerturbation(0.5, 0.60, 0.05), 0.55);
check('exceeds lower bound', clipPerturbation(0.5, 0.40, 0.05), 0.45);
return results;`,
    hints: [
      'Use Math.max and Math.min.',
      'return Math.max(minVal, Math.min(maxVal, xAdv));',
    ],
    solution: `function clipPerturbation(x, xAdv, epsilon) {
  const minVal = x - epsilon;
  const maxVal = x + epsilon;
  return Math.max(minVal, Math.min(maxVal, xAdv));
}`,
    explanation: 'Clipping projects inputs back into the allowed L-infinity constraint perturbation region.',
  },
];
