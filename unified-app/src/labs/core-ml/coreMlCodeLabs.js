export const CORE_ML_CODE_LABS = [
  // --- train-validation-test-split ---
  {
    id: 'split-shuffle',
    stepLabel: '39.1',
    group: 'Shuffle',
    title: 'Fisher-Yates Shuffle',
    concept: 'To ensure a representative split, datasets should be randomly shuffled before partitioning.',
    objective: 'Implement the Fisher-Yates shuffle algorithm on an array of indices.',
    difficulty: 'warmup',
    starterCode: `function shuffleIndices(arr, seed) {
  // A simple deterministic pseudo-random generator based on seed
  let r = seed || 42;
  function random() {
    let x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    // TODO: swap elements at i and j
    const temp = shuffled[i];
    shuffled[i] = shuffled[i];
  }
  return shuffled;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const arr = [0, 1, 2, 3, 4];
check('shuffled with seed 42', shuffleIndices(arr, 42), [4, 2, 0, 1, 3]);
return results;`,
    hints: [
      'Swap shuffled[i] and shuffled[j].',
      'Use temp to hold shuffled[i], set shuffled[i] = shuffled[j], then shuffled[j] = temp.',
    ],
    solution: `function shuffleIndices(arr, seed) {
  let r = seed || 42;
  function random() {
    let x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}`,
    explanation: 'Shuffling prevents training and test sets from having ordered bias (e.g., all class 0 at the start).',
  },
  {
    id: 'split-slices',
    stepLabel: '39.2',
    group: 'Train slice',
    title: 'Dataset Splitting Slices',
    concept: 'Partition the dataset into Train, Validation, and Test sets based on proportional fractions.',
    objective: 'Compute slice boundaries and return the split datasets.',
    difficulty: 'core',
    starterCode: `function splitDataset(dataset, trainFrac, valFrac) {
  const n = dataset.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  
  // TODO: Slice dataset into train, val, and test arrays
  const train = [];
  const val = [];
  const test = [];
  
  return { train, val, test };
}`,
    testCode: `const results = [];
function sameObj(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameObj(actual, expected) });
}
const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
check('split 60/20/20', splitDataset(data, 0.6, 0.2), {
  train: [10, 20, 30, 40, 50, 60],
  val: [70, 80],
  test: [90, 100]
});
return results;`,
    hints: [
      'Use dataset.slice(start, end).',
      'train goes from 0 to trainEnd.',
      'val goes from trainEnd to valEnd.',
      'test goes from valEnd to the end.',
    ],
    solution: `function splitDataset(dataset, trainFrac, valFrac) {
  const n = dataset.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  
  const train = dataset.slice(0, trainEnd);
  const val = dataset.slice(trainEnd, valEnd);
  const test = dataset.slice(valEnd);
  
  return { train, val, test };
}`,
    explanation: 'Train set fits parameters; Val guides hyperparameter tuning; Test provides unbiased final evaluation.',
  },
  {
    id: 'split-leakage-check',
    stepLabel: '39.3',
    group: 'No leakage check',
    title: 'Data Leakage Verification',
    concept: 'To ensure validity, there must be absolute zero overlap (leakage) between splits.',
    objective: 'Implement a function to verify that train, validation, and test sets are completely disjoint.',
    difficulty: 'challenge',
    starterCode: `function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  
  // TODO: Check if any element in valSet or testSet exists in trainSet, or if they overlap.
  // Return true if there is NO leakage (mutually disjoint), else false.
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('disjoint sets', checkNoLeakage([1, 2, 3], [4, 5], [6]), true);
check('overlap train/val', checkNoLeakage([1, 2, 3], [3, 4], [5]), false);
check('overlap val/test', checkNoLeakage([1, 2], [3, 4], [4, 5]), false);
return results;`,
    hints: [
      'Check if any element of trainIdx is in valSet or testSet.',
      'Check if any element of valIdx is in testSet.',
      'If any overlap is found, return false. Otherwise return true.',
    ],
    solution: `function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  
  for (const x of trainIdx) {
    if (valSet.has(x) || testSet.has(x)) return false;
  }
  for (const x of valIdx) {
    if (testSet.has(x)) return false;
  }
  return true;
}`,
    explanation: 'Overlapping samples between splits lead to overly optimistic performance evaluation (leakage).',
  },

  // --- cross-validation ---
  {
    id: 'kfold-split-bounds',
    stepLabel: '40.1',
    group: 'K-fold split',
    title: 'Validation fold bounds',
    concept: 'K-fold split needs start/end bounds for the selected validation fold.',
    objective: 'Compute valStart and valEnd for foldIdx.',
    difficulty: 'warmup',
    starterCode: `function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  // TODO: compute valStart by summing previous fold sizes
  let valStart = 0;
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  return { trainIndices: [], valIndices: [valStart, valEnd] };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('fold1 start', kFoldSplit(10, 3, 1).valIndices[0], 4);
check('fold1 end', kFoldSplit(10, 3, 1).valIndices[1], 7);
return results;`,
    hints: ['for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);'],
    solution: `function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  return { trainIndices: [], valIndices: [valStart, valEnd] };
}`,
    explanation: 'Fold boundaries define which indices move into validation.',
  },
  {
    id: 'kfold-split-val-mask',
    stepLabel: '40.2',
    group: 'K-fold split',
    title: 'Validation index mask',
    concept: 'Indices in [valStart, valEnd) belong to validation.',
    objective: 'Fill valIndices array from computed bounds.',
    difficulty: 'warmup',
    starterCode: `function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const valIndices = [];
  // TODO: push validation indices
  return { trainIndices: [], valIndices };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('val fold', kFoldSplit(5, 5, 2).valIndices, [2]);
return results;`,
    hints: ['for (let i = valStart; i < valEnd; i++) valIndices.push(i);'],
    solution: `function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const valIndices = [];
  for (let i = valStart; i < valEnd; i++) valIndices.push(i);
  return { trainIndices: [], valIndices };
}`,
    explanation: 'Validation mask isolates exactly one fold per run.',
  },
  {
    id: 'kfold-split-train-mask',
    stepLabel: '40.3',
    group: 'K-fold split',
    title: 'Training index mask',
    concept: 'Training indices are all positions not in validation fold.',
    objective: 'Fill trainIndices with non-validation indices.',
    difficulty: 'core',
    starterCode: `function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else {
      // TODO: push to trainIndices
    }
  }
  return { trainIndices, valIndices };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('train fold', kFoldSplit(5, 5, 2).trainIndices, [0, 1, 3, 4]);
return results;`,
    hints: ['trainIndices.push(i);'],
    solution: `function kFoldSplit(n, k, foldIdx) {
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else trainIndices.push(i);
  }
  return { trainIndices, valIndices };
}`,
    explanation: 'Train/validation disjointness is key for honest model evaluation.',
  },
  {
    id: 'kfold-split-full',
    stepLabel: '40.4',
    group: 'K-fold split',
    title: 'Complete k-fold split',
    concept: 'A reusable kFoldSplit utility returns both train and validation index sets.',
    objective: 'Handle n=0 by returning empty arrays.',
    difficulty: 'core',
    starterCode: `function kFoldSplit(n, k, foldIdx) {
  // TODO: return empty arrays when n is 0
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else trainIndices.push(i);
  }
  return { trainIndices, valIndices };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('n zero', kFoldSplit(0, 3, 0), { trainIndices: [], valIndices: [] });
check('normal', kFoldSplit(5, 5, 2), { trainIndices: [0, 1, 3, 4], valIndices: [2] });
return results;`,
    hints: ['if (n === 0) return { trainIndices: [], valIndices: [] };'],
    solution: `function kFoldSplit(n, k, foldIdx) {
  if (n === 0) return { trainIndices: [], valIndices: [] };
  const base = Math.floor(n / k);
  const rem = n % k;
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) valStart += base + (i < rem ? 1 : 0);
  const valSize = base + (foldIdx < rem ? 1 : 0);
  const valEnd = valStart + valSize;
  const trainIndices = [];
  const valIndices = [];
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) valIndices.push(i);
    else trainIndices.push(i);
  }
  return { trainIndices, valIndices };
}`,
    explanation: 'This utility can be reused by any cross-validation training loop.',
  },
  // --- data-leakage-deep-dive ---
  {
    id: 'leak-safe-mean',
    stepLabel: '41.1',
    group: 'Leak-safe scaling',
    title: 'Train-only mean',
    concept: 'Leak-safe scaling fits summary stats only on training split.',
    objective: 'Compute mean from trainX only.',
    difficulty: 'warmup',
    starterCode: `function scaleSplitsCorrectly(trainX, valX) {
  // TODO: compute train mean
  const mean = 0;
  return { scaledTrain: [], scaledVal: [], mean, std: 1 };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mean', scaleSplitsCorrectly([10, 20, 30], [40]).mean, 20);
return results;`,
    hints: ['const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;'],
    solution: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  return { scaledTrain: [], scaledVal: [], mean, std: 1 };
}`,
    explanation: 'Validation statistics must not leak into fit-time preprocessing.',
  },
  {
    id: 'leak-safe-std',
    stepLabel: '41.2',
    group: 'Leak-safe scaling',
    title: 'Train-only standard deviation',
    concept: 'Scaling variance is also fit from training data only.',
    objective: 'Compute std = sqrt(mean squared deviation), fallback to 1 when zero.',
    difficulty: 'warmup',
    starterCode: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) {
    // TODO: accumulate squared deviations
    varSum += 0;
  }
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  return { scaledTrain: [], scaledVal: [], mean, std };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('std', scaleSplitsCorrectly([10, 20, 30], [40]).std, 8.1649658);
return results;`,
    hints: ['varSum += Math.pow(trainX[i] - mean, 2);'],
    solution: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) {
    varSum += Math.pow(trainX[i] - mean, 2);
  }
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  return { scaledTrain: [], scaledVal: [], mean, std };
}`,
    explanation: 'Stable denominator prevents divide-by-zero in degenerate features.',
  },
  {
    id: 'leak-safe-scale-train',
    stepLabel: '41.3',
    group: 'Leak-safe scaling',
    title: 'Scale training split',
    concept: 'Train features are standardized with train-fit mean/std.',
    objective: 'Compute scaledTrain values.',
    difficulty: 'core',
    starterCode: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  // TODO: scale trainX
  const scaledTrain = [];
  return { scaledTrain, scaledVal: [], mean, std };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxEqual(actual, expected) });
}
check('scaled train', scaleSplitsCorrectly([10, 20, 30], [40]).scaledTrain, [-1.224745, 0, 1.224745]);
return results;`,
    hints: ['const scaledTrain = trainX.map(x => (x - mean) / std);'],
    solution: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  const scaledTrain = trainX.map(x => (x - mean) / std);
  return { scaledTrain, scaledVal: [], mean, std };
}`,
    explanation: 'Training data establishes the transformation basis for all splits.',
  },
  {
    id: 'leak-safe-scale-val',
    stepLabel: '41.4',
    group: 'Leak-safe scaling',
    title: 'Scale validation split',
    concept: 'Validation must use train-fit parameters, not its own statistics.',
    objective: 'Return scaledTrain and scaledVal with shared train mean/std.',
    difficulty: 'core',
    starterCode: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  const scaledTrain = trainX.map(x => (x - mean) / std);
  // TODO: scale valX using same mean/std
  const scaledVal = [];
  return { scaledTrain, scaledVal, mean, std };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = scaleSplitsCorrectly([10, 20, 30], [40]);
check('scaled val', out.scaledVal[0], 2.44949);
return results;`,
    hints: ['const scaledVal = valX.map(x => (x - mean) / std);'],
    solution: `function scaleSplitsCorrectly(trainX, valX) {
  const mean = trainX.reduce((s, x) => s + x, 0) / trainX.length;
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) varSum += Math.pow(trainX[i] - mean, 2);
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  const scaledTrain = trainX.map(x => (x - mean) / std);
  const scaledVal = valX.map(x => (x - mean) / std);
  return { scaledTrain, scaledVal, mean, std };
}`,
    explanation: 'Using shared parameters avoids accidental validation leakage.',
  },
  // --- feature-scaling-preprocessing ---
  {
    id: 'scaling-mean-std',
    stepLabel: '42.1',
    group: 'Mean',
    title: 'Mean and Standard Deviation Calculation',
    concept: 'Scaling techniques require computing column-wise statistics, specifically sample mean and standard deviation.',
    objective: 'Compute mean and standard deviation of a 1D numeric array.',
    difficulty: 'warmup',
    starterCode: `function getMeanAndStd(arr) {
  // TODO: compute mean and standard deviation
  let mean = 0;
  let std = 1;
  
  return { mean, std };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const res = getMeanAndStd([2, 4, 4, 4, 5, 5, 7, 9]);
check('mean', res.mean, 5);
check('std', res.std, 2);
return results;`,
    hints: [
      'mean is sum of values divided by count.',
      'std is Math.sqrt(sum((x - mean)^2) / count).',
    ],
    solution: `function getMeanAndStd(arr) {
  const n = arr.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += arr[i];
  }
  const mean = sum / n;
  
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += Math.pow(arr[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / n);
  
  return { mean, std };
}`,
    explanation: 'Mean and standard deviation quantify the central tendency and spread of feature scales.',
  },
  {
    id: 'scaling-standardize',
    stepLabel: '42.2',
    group: 'Transform',
    title: 'Standardization',
    concept: 'Standardization (Z-score normalization) scales features to have a mean of 0 and standard deviation of 1: z = (x - mean) / std.',
    objective: 'Standardize a numeric vector using given mean and std.',
    difficulty: 'core',
    starterCode: `function standardizeVector(arr, mean, std) {
  // TODO: apply Z-score normalization to each element
  // Handle case where std is 0 by returning unchanged values
  return arr;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('standardize simple', standardizeVector([10, 20, 30], 20, 10), [-1, 0, 1]);
return results;`,
    hints: [
      'If std is 0, return arr.',
      'Use arr.map(x => (x - mean) / std).',
    ],
    solution: `function standardizeVector(arr, mean, std) {
  if (std === 0) return arr;
  return arr.map(x => (x - mean) / std);
}`,
    explanation: 'Standardization is robust to outliers and crucial for distance-based estimators like SVM or kNN.',
  },
  {
    id: 'scaling-minmax',
    stepLabel: '42.3',
    group: 'Transform',
    title: 'Min-Max Scaling',
    concept: 'Min-Max scaling normalizes data to a fixed range, typically [0, 1]: x_scaled = (x - min) / (max - min).',
    objective: 'Apply Min-Max scaling to a numeric vector.',
    difficulty: 'core',
    starterCode: `function minMaxScale(arr) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  
  // TODO: Apply Min-Max scaling to each element. 
  // Handle case where min equals max by returning all zeros.
  return arr;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('min-max scale', minMaxScale([5, 10, 15, 20]), [0, 0.333333, 0.666667, 1]);
return results;`,
    hints: [
      'Denominator is max - min.',
      'If max === min, return an array of 0s of the same length.',
      'Otherwise, map x to (x - min) / (max - min).',
    ],
    solution: `function minMaxScale(arr) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  
  const range = max - min;
  if (range === 0) {
    return arr.map(() => 0);
  }
  return arr.map(x => (x - min) / range);
}`,
    explanation: 'Min-Max scaling preserves structural zeros and works well for algorithms that expect bounded inputs (like neural networks).',
  },

  // --- k-means ---
  {
    id: 'kmeans-distance',
    stepLabel: '43.1',
    group: 'Distance to centroid',
    title: 'Euclidean Distance',
    concept: 'K-Means groups points by assigning them to the closest centroid based on distance metrics.',
    objective: 'Compute the Euclidean distance between two coordinate arrays.',
    difficulty: 'warmup',
    starterCode: `function euclideanDistance(p1, p2) {
  // TODO: compute sqrt(sum((p1[i] - p2[i])^2))
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('distance 2D', euclideanDistance([0, 0], [3, 4]), 5);
return results;`,
    hints: [
      'Iterate through coordinates from 0 to p1.length - 1.',
      'Sum up the squared differences.',
      'Return Math.sqrt(sum).',
    ],
    solution: `function euclideanDistance(p1, p2) {
  let sum = 0;
  for (let i = 0; i < p1.length; i++) {
    sum += Math.pow(p1[i] - p2[i], 2);
  }
  return Math.sqrt(sum);
}`,
    explanation: 'Euclidean distance is the canonical similarity metric used to define cluster boundaries in spherical spaces.',
  },
  {
    id: 'kmeans-assign',
    stepLabel: '43.2',
    group: 'Assignment',
    title: 'Cluster Assignment',
    concept: 'Each data point is mapped to the cluster index representing its nearest centroid.',
    objective: 'Given a point and list of centroids, return the index of the closest centroid.',
    difficulty: 'core',
    starterCode: `function assignPointToCentroid(point, centroids) {
  function dist(p1, p2) {
    let s = 0;
    for (let i = 0; i < p1.length; i++) s += Math.pow(p1[i] - p2[i], 2);
    return Math.sqrt(s);
  }
  
  let minIdx = 0;
  let minDistance = Infinity;
  
  // TODO: Iterate over centroids, compute distance, and track the index of the minimum distance.
  
  return minIdx;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const centroids = [[1, 1], [5, 5], [10, 10]];
check('closer to centroid 0', assignPointToCentroid([1.5, 2], centroids), 0);
check('closer to centroid 1', assignPointToCentroid([4, 6], centroids), 1);
return results;`,
    hints: [
      'Loop i from 0 to centroids.length - 1.',
      'Calculate distance d using dist(point, centroids[i]).',
      'If d < minDistance, update minDistance and set minIdx = i.',
    ],
    solution: `function assignPointToCentroid(point, centroids) {
  function dist(p1, p2) {
    let s = 0;
    for (let i = 0; i < p1.length; i++) s += Math.pow(p1[i] - p2[i], 2);
    return Math.sqrt(s);
  }
  
  let minIdx = 0;
  let minDistance = Infinity;
  
  for (let i = 0; i < centroids.length; i++) {
    const d = dist(point, centroids[i]);
    if (d < minDistance) {
      minDistance = d;
      minIdx = i;
    }
  }
  
  return minIdx;
}`,
    explanation: 'Assigning points to the nearest centroid minimizes intra-cluster variance.',
  },
  {
    id: 'kmeans-update-centroids',
    stepLabel: '43.3',
    group: 'Mean update',
    title: 'Centroid Position Updates',
    concept: 'Centroids move to the center (mean) of all points currently assigned to their cluster.',
    objective: 'Recompute centroids by averaging coordinates of assigned points.',
    difficulty: 'core',
    starterCode: `function updateCentroids(points, labels, k, dim) {
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  
  // TODO: Sum coordinate values for each cluster label, and track point counts.
  // Then divide each coordinate sum by cluster count. If count is 0, leave centroid at [0,0...].
  
  return newCentroids;
}`,
    testCode: `const results = [];
function sameCentroids(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameCentroids(actual, expected) });
}
const pts = [[1, 2], [2, 3], [5, 6]];
const lbls = [0, 0, 1];
check('update 2 centroids in 2D', updateCentroids(pts, lbls, 2, 2), [[1.5, 2.5], [5, 6]]);
return results;`,
    hints: [
      'Iterate through all points. Let label = labels[i].',
      'For each coordinate d from 0 to dim-1, add points[i][d] to newCentroids[label][d].',
      'Increment counts[label].',
      'After looping, for each cluster j, divide its coordinates by counts[j] (if counts[j] > 0).',
    ],
    solution: `function updateCentroids(points, labels, k, dim) {
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  
  for (let i = 0; i < points.length; i++) {
    const label = labels[i];
    counts[label]++;
    for (let d = 0; d < dim; d++) {
      newCentroids[label][d] += points[i][d];
    }
  }
  
  for (let j = 0; j < k; j++) {
    if (counts[j] > 0) {
      for (let d = 0; d < dim; d++) {
        newCentroids[j][d] /= counts[j];
      }
    }
  }
  
  return newCentroids;
}`,
    explanation: 'Updating centroids to the mean of cluster members iteratively reduces the total within-cluster sum of squares (inertia).',
  },

  // --- knn-naive-bayes-svm ---
  {
    id: 'knn-limit-neighbors',
    stepLabel: '44.1',
    group: 'kNN predict',
    title: 'Limit to k neighbors',
    concept: 'kNN only considers the k closest labeled neighbors when making a prediction.',
    objective: 'Inside knnPredict, set limit = Math.min(k, neighborLabels.length).',
    difficulty: 'warmup',
    starterCode: `function knnPredict(neighborLabels, k) {
  // TODO: limit = Math.min(k, neighborLabels.length)
  const limit = neighborLabels.length;
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('only nearest neighbor', knnPredict(['dog', 'cat', 'cat'], 1), 'dog');
return results;`,
    hints: ['const limit = Math.min(k, neighborLabels.length);'],
    solution: `function knnPredict(neighborLabels, k) {
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    explanation: 'Neighbors are pre-sorted by distance before voting begins.',
  },
  {
    id: 'knn-predict-vote',
    stepLabel: '44.2',
    group: 'kNN predict',
    title: 'Count neighbor votes',
    concept: 'Each of the k nearest neighbors casts one vote for its label.',
    objective: 'Increment votes[label] for each neighbor within limit.',
    difficulty: 'warmup',
    starterCode: `function knnPredict(neighborLabels, k) {
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    // TODO: increment votes[label]
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('majority vote', knnPredict(['cat', 'cat', 'dog'], 3), 'cat');
return results;`,
    hints: ['votes[label] = (votes[label] || 0) + 1;'],
    solution: `function knnPredict(neighborLabels, k) {
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    explanation: 'Majority vote aggregates local neighborhood labels into one prediction.',
  },
  {
    id: 'knn-predict-winner',
    stepLabel: '44.3',
    group: 'kNN predict',
    title: 'Select majority label',
    concept: 'The predicted class is the label with the highest vote count among the k neighbors.',
    objective: 'Track winner and maxVotes while iterating over votes.',
    difficulty: 'core',
    starterCode: `function knnPredict(neighborLabels, k) {
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    // TODO: update winner when votes[label] > maxVotes
  }
  return winner;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('winner selected', knnPredict(['a', 'b', 'a', 'b', 'a'], 5), 'a');
return results;`,
    hints: ['if (votes[label] > maxVotes) { maxVotes = votes[label]; winner = label; }'],
    solution: `function knnPredict(neighborLabels, k) {
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    explanation: 'Ties can be broken by vote order depending on implementation policy.',
  },
  {
    id: 'knn-empty-neighbors',
    stepLabel: '44.4',
    group: 'kNN predict',
    title: 'No neighbors edge case',
    concept: 'If there are no labeled neighbors, kNN cannot produce a class label.',
    objective: 'Return null when neighborLabels is empty.',
    difficulty: 'core',
    starterCode: `function knnPredict(neighborLabels, k) {
  // TODO: return null when neighborLabels.length === 0
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty neighbors', knnPredict([], 3), null);
return results;`,
    hints: ['if (neighborLabels.length === 0) return null;'],
    solution: `function knnPredict(neighborLabels, k) {
  if (neighborLabels.length === 0) return null;
  const limit = Math.min(k, neighborLabels.length);
  const votes = {};
  for (let i = 0; i < limit; i++) {
    const label = neighborLabels[i];
    votes[label] = (votes[label] || 0) + 1;
  }
  let winner = null;
  let maxVotes = -1;
  for (const label in votes) {
    if (votes[label] > maxVotes) {
      maxVotes = votes[label];
      winner = label;
    }
  }
  return winner;
}`,
    explanation: 'Production kNN systems must handle cold-start neighborhoods gracefully.',
  },

  // --- tree-ensembles ---
  {
    id: 'ensemble-gini',
    stepLabel: '45.1',
    group: 'Ensemble predict',
    title: 'Node gini impurity',
    concept: 'Tree splits use gini impurity to quantify class mixing.',
    objective: 'Compute gini from class counts.',
    difficulty: 'warmup',
    starterCode: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return { gini: 0, avg: [] };
  // TODO: compute gini
  const gini = 0;
  return { gini, avg: [] };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('gini 50-50', ensembleStep([[0.5, 0.5]], [5, 5]).gini, 0.5);
return results;`,
    hints: ['gini = 1 - sum((count/total)^2)'],
    solution: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return { gini: 0, avg: [] };
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = counts[i] / total;
    sq += p * p;
  }
  const gini = 1 - sq;
  return { gini, avg: [] };
}`,
    explanation: 'Impurity gives local tree quality while bagging aggregates globally.',
  },
  {
    id: 'ensemble-avg-sum',
    stepLabel: '45.2',
    group: 'Ensemble predict',
    title: 'Aggregate tree probabilities',
    concept: 'Bagging averages predicted class probabilities across trees.',
    objective: 'Sum probabilities across trees into avg buffer.',
    difficulty: 'warmup',
    starterCode: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  // TODO: sum tree probabilities into avg
  return { gini, avg };
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-5) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('sum probs', ensembleStep([[0.8, 0.2], [0.6, 0.4]], [1, 1]).avg, [1.4, 0.6]);
return results;`,
    hints: ['avg[c] += treeProbs[t][c];'],
    solution: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  return { gini, avg };
}`,
    explanation: 'Summation prepares the ensemble vote before normalization.',
  },
  {
    id: 'ensemble-avg-normalize',
    stepLabel: '45.3',
    group: 'Ensemble predict',
    title: 'Normalize ensemble probabilities',
    concept: 'Final bagging prediction divides summed probabilities by number of trees.',
    objective: 'Normalize avg by numTrees.',
    difficulty: 'core',
    starterCode: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  // TODO: divide avg entries by numTrees when numTrees > 0
  return { gini, avg };
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-5) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('avg probs', ensembleStep([[0.8, 0.2], [0.6, 0.4], [0.7, 0.3]], [1, 1]).avg, [0.7, 0.3]);
return results;`,
    hints: ['for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;'],
    solution: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  if (numTrees > 0) {
    for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;
  }
  return { gini, avg };
}`,
    explanation: 'Normalization turns vote totals into probability-like scores.',
  },
  {
    id: 'ensemble-step-full',
    stepLabel: '45.4',
    group: 'Ensemble predict',
    title: 'Full ensemble step',
    concept: 'One helper can report both split impurity and ensemble probability output.',
    objective: 'Return empty avg for empty trees while still computing gini.',
    difficulty: 'core',
    starterCode: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  // TODO: handle empty treeProbs quickly
  const numTrees = treeProbs.length;
  const numClasses = numTrees === 0 ? 0 : treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  if (numTrees > 0) for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;
  return { gini, avg };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty trees', ensembleStep([], [5, 5]), { gini: 0.5, avg: [] });
return results;`,
    hints: ['if (treeProbs.length === 0) return { gini, avg: [] };'],
    solution: `function ensembleStep(treeProbs, counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  let sq = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = total === 0 ? 0 : counts[i] / total;
    sq += p * p;
  }
  const gini = total === 0 ? 0 : 1 - sq;
  if (treeProbs.length === 0) return { gini, avg: [] };
  const numTrees = treeProbs.length;
  const numClasses = treeProbs[0].length;
  const avg = Array(numClasses).fill(0);
  for (let t = 0; t < numTrees; t++) {
    for (let c = 0; c < numClasses; c++) avg[c] += treeProbs[t][c];
  }
  for (let c = 0; c < numClasses; c++) avg[c] /= numTrees;
  return { gini, avg };
}`,
    explanation: 'Unified helpers simplify teaching both trees and ensembles together.',
  },
  // --- time-series-forecasting-track ---
  {
    id: 'forecast-smooth-roll',
    stepLabel: '46.1',
    group: 'Forecast smooth',
    title: 'Rolling mean value',
    concept: 'Short windows provide local trend smoothing.',
    objective: 'Compute last rolling mean over window w.',
    difficulty: 'warmup',
    starterCode: `function forecastSmooth(series, w, alpha) {
  // TODO: compute rolling mean of last window
  let roll = 0;
  return roll;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('rolling mean', forecastSmooth([10, 20, 30, 40], 2, 0.5), 35);
return results;`,
    hints: ['window is series.slice(series.length - w)'],
    solution: `function forecastSmooth(series, w, alpha) {
  let sum = 0;
  for (let i = series.length - w; i < series.length; i++) sum += series[i];
  const roll = sum / w;
  return roll;
}`,
    explanation: 'Rolling mean captures local level without long-term memory.',
  },
  {
    id: 'forecast-smooth-exp',
    stepLabel: '46.2',
    group: 'Forecast smooth',
    title: 'Exponential smoothing value',
    concept: 'Exponential smoothing recursively blends latest sample with previous smooth.',
    objective: 'Compute final exp smoothed value.',
    difficulty: 'warmup',
    starterCode: `function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let smooth = series[0];
  // TODO: update smooth for i >= 1
  return smooth;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('exp smooth', forecastSmooth([10, 20, 30], 2, 0.5), 22.5);
return results;`,
    hints: ['smooth = alpha * series[i] + (1 - alpha) * smooth;'],
    solution: `function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) {
    smooth = alpha * series[i] + (1 - alpha) * smooth;
  }
  return smooth;
}`,
    explanation: 'Exponential smoothing keeps memory with exponentially decaying weights.',
  },
  {
    id: 'forecast-smooth-blend',
    stepLabel: '46.3',
    group: 'Forecast smooth',
    title: 'Blend rolling and exponential',
    concept: 'Hybrid smoothers can blend local window and exponential estimate.',
    objective: 'Return 0.5 * (roll + smooth).',
    difficulty: 'core',
    starterCode: `function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let sum = 0;
  for (let i = series.length - w; i < series.length; i++) sum += series[i];
  const roll = sum / w;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  // TODO: blend roll and smooth
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('blended', forecastSmooth([10, 20, 30], 2, 0.5), 23.75);
return results;`,
    hints: ['return 0.5 * (roll + smooth);'],
    solution: `function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  let sum = 0;
  for (let i = series.length - w; i < series.length; i++) sum += series[i];
  const roll = sum / w;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  return 0.5 * (roll + smooth);
}`,
    explanation: 'Blending balances reactivity and stability in one-step forecasting.',
  },
  {
    id: 'forecast-smooth-full',
    stepLabel: '46.4',
    group: 'Forecast smooth',
    title: 'Complete smooth forecast',
    concept: 'Final helper should guard invalid window sizes.',
    objective: 'Clamp w into [1, series.length] before computing rolling part.',
    difficulty: 'core',
    starterCode: `function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  // TODO: clamp w to valid range
  const window = w;
  let sum = 0;
  for (let i = series.length - window; i < series.length; i++) sum += series[i];
  const roll = sum / window;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  return 0.5 * (roll + smooth);
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('window clamp high', forecastSmooth([10, 20, 30], 10, 0.5), 21.25);
return results;`,
    hints: ['const window = Math.max(1, Math.min(w, series.length));'],
    solution: `function forecastSmooth(series, w, alpha) {
  if (series.length === 0) return 0;
  const window = Math.max(1, Math.min(w, series.length));
  let sum = 0;
  for (let i = series.length - window; i < series.length; i++) sum += series[i];
  const roll = sum / window;
  let smooth = series[0];
  for (let i = 1; i < series.length; i++) smooth = alpha * series[i] + (1 - alpha) * smooth;
  return 0.5 * (roll + smooth);
}`,
    explanation: 'Window guards avoid invalid indexing in dynamic forecasting pipelines.',
  },
  // --- data-engineering-for-ml-track ---
  {
    id: 'pipeline-clean-impute',
    stepLabel: '47.1',
    group: 'Pipeline clean',
    title: 'Median imputation pass',
    concept: 'Pipeline first imputes missing values using median.',
    objective: 'Replace null/undefined in arr with median of present values.',
    difficulty: 'warmup',
    starterCode: `function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  // TODO: compute median and impute arr
  const imputed = arr.slice();
  return { imputed, deduped: rows };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('impute', pipelineClean([5, null, 1, 9, 3], [], 'id').imputed, [5, 4, 1, 9, 3]);
return results;`,
    hints: ['median for even length is average of middle two'],
    solution: `function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  return { imputed, deduped: rows };
}`,
    explanation: 'Median imputation is robust against outlier distortion.',
  },
  {
    id: 'pipeline-clean-last-index',
    stepLabel: '47.2',
    group: 'Pipeline clean',
    title: 'Track latest row index per key',
    concept: 'Dedup keeps freshest row for each key.',
    objective: 'Build map of latest index for each key.',
    difficulty: 'warmup',
    starterCode: `function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  // TODO: fill latest[row[key]] = i
  return { imputed, deduped: Object.keys(latest).length };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const rows = [{ id: 1 }, { id: 2 }, { id: 1 }];
check('latest key count', pipelineClean([1], rows, 'id').deduped, 2);
return results;`,
    hints: ['for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;'],
    solution: `function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  return { imputed, deduped: Object.keys(latest).length };
}`,
    explanation: 'Latest index map enables stable one-pass dedup decisions.',
  },
  {
    id: 'pipeline-clean-dedupe',
    stepLabel: '47.3',
    group: 'Pipeline clean',
    title: 'Keep only latest rows',
    concept: 'Rows whose index matches latest index for key survive dedup.',
    objective: 'Return deduped row list in original order.',
    difficulty: 'core',
    starterCode: `function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  // TODO: build deduped rows
  const deduped = [];
  return { imputed, deduped };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const rows = [{ id: 1, v: 'a' }, { id: 2, v: 'b' }, { id: 1, v: 'c' }];
check('dedupe rows', pipelineClean([1], rows, 'id').deduped, [{ id: 2, v: 'b' }, { id: 1, v: 'c' }]);
return results;`,
    hints: ['if (latest[rows[i][key]] === i) deduped.push(rows[i]);'],
    solution: `function pipelineClean(arr, rows, key) {
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  const deduped = [];
  for (let i = 0; i < rows.length; i++) {
    if (latest[rows[i][key]] === i) deduped.push(rows[i]);
  }
  return { imputed, deduped };
}`,
    explanation: 'This preserves the freshest row while keeping stable output ordering.',
  },
  {
    id: 'pipeline-clean-full',
    stepLabel: '47.4',
    group: 'Pipeline clean',
    title: 'Complete pipeline clean step',
    concept: 'Final helper performs imputation and key-based dedup in one call.',
    objective: 'Handle empty arr by leaving imputed array empty.',
    difficulty: 'core',
    starterCode: `function pipelineClean(arr, rows, key) {
  // TODO: short-circuit empty arr
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  const deduped = [];
  for (let i = 0; i < rows.length; i++) if (latest[rows[i][key]] === i) deduped.push(rows[i]);
  return { imputed, deduped };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const rows = [{ id: 1, v: 'a' }, { id: 1, v: 'b' }];
check('empty arr', pipelineClean([], rows, 'id').imputed, []);
check('dedup still works', pipelineClean([1], rows, 'id').deduped, [{ id: 1, v: 'b' }]);
return results;`,
    hints: ['if (arr.length === 0) { /* still dedupe rows */ }'],
    solution: `function pipelineClean(arr, rows, key) {
  const latest = {};
  for (let i = 0; i < rows.length; i++) latest[rows[i][key]] = i;
  const deduped = [];
  for (let i = 0; i < rows.length; i++) if (latest[rows[i][key]] === i) deduped.push(rows[i]);
  if (arr.length === 0) return { imputed: [], deduped };
  const clean = arr.filter(x => x !== null && x !== undefined).sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  const imputed = arr.map(x => (x === null || x === undefined ? median : x));
  return { imputed, deduped };
}`,
    explanation: 'The final pipeline helper composes robust preprocessing primitives.',
  },
];
