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
    id: 'cv-fold-bounds',
    stepLabel: '40.1',
    group: 'Fold size',
    title: 'Cross-Validation Fold Sizes',
    concept: 'In k-fold cross-validation, the dataset is split into k parts. Each part contains roughly N / k elements.',
    objective: 'Determine the start and end index of fold i (0-indexed) for N samples.',
    difficulty: 'warmup',
    starterCode: `function getFoldRange(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  // TODO: compute start and end indices of the fold.
  // Account for remainders by distributing them to the first few folds.
  let start = 0;
  let end = 0;
  
  return { start, end };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('fold 0 of 10 samples, k=3', getFoldRange(10, 3, 0), { start: 0, end: 4 });
check('fold 1 of 10 samples, k=3', getFoldRange(10, 3, 1), { start: 4, end: 7 });
check('fold 2 of 10 samples, k=3', getFoldRange(10, 3, 2), { start: 7, end: 10 });
return results;`,
    hints: [
      'To distribute remainder, folds before remainder get size = baseFoldSize + 1, others get size = baseFoldSize.',
      'Start index is sum of sizes of previous folds.',
      'End index is start + current fold size.',
    ],
    solution: `function getFoldRange(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  let start = 0;
  for (let i = 0; i < foldIdx; i++) {
    start += baseFoldSize + (i < remainder ? 1 : 0);
  }
  const size = baseFoldSize + (foldIdx < remainder ? 1 : 0);
  const end = start + size;
  
  return { start, end };
}`,
    explanation: 'Cross-validation splits the data uniformly, adjusting for remainder items so every sample is evaluated once.',
  },
  {
    id: 'cv-fold-indices',
    stepLabel: '40.2',
    group: 'Train/val masks',
    title: 'K-Fold Partitioning',
    concept: 'During fold i, the validation fold is fold i, and the training folds are all other folds combined.',
    objective: 'Split indices 0 to N-1 into trainIndices and valIndices for the current fold.',
    difficulty: 'core',
    starterCode: `function kFoldSplit(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) {
    valStart += baseFoldSize + (i < remainder ? 1 : 0);
  }
  const valSize = baseFoldSize + (foldIdx < remainder ? 1 : 0);
  const valEnd = valStart + valSize;
  
  const trainIndices = [];
  const valIndices = [];
  
  // TODO: fill trainIndices and valIndices from 0 to n-1
  
  return { trainIndices, valIndices };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('k-fold split n=5 k=5 fold=2', kFoldSplit(5, 5, 2), {
  trainIndices: [0, 1, 3, 4],
  valIndices: [2]
});
return results;`,
    hints: [
      'Loop i from 0 to n-1.',
      'If i is between valStart (inclusive) and valEnd (exclusive), push to valIndices.',
      'Otherwise, push to trainIndices.',
    ],
    solution: `function kFoldSplit(n, k, foldIdx) {
  const baseFoldSize = Math.floor(n / k);
  const remainder = n % k;
  
  let valStart = 0;
  for (let i = 0; i < foldIdx; i++) {
    valStart += baseFoldSize + (i < remainder ? 1 : 0);
  }
  const valSize = baseFoldSize + (foldIdx < remainder ? 1 : 0);
  const valEnd = valStart + valSize;
  
  const trainIndices = [];
  const valIndices = [];
  
  for (let i = 0; i < n; i++) {
    if (i >= valStart && i < valEnd) {
      valIndices.push(i);
    } else {
      trainIndices.push(i);
    }
  }
  
  return { trainIndices, valIndices };
}`,
    explanation: 'Cross-validation repeats training across different folds to yield a more stable estimate of performance.',
  },

  // --- data-leakage-deep-dive ---
  {
    id: 'leakage-detect-target',
    stepLabel: '41.1',
    group: 'Label in features',
    title: 'Target Leakage Detection',
    concept: 'Target leakage occurs when the target label (or features directly derived from it) is present in the training features.',
    objective: 'Identify if any feature column is exactly equal (or perfectly correlated) to the target label.',
    difficulty: 'warmup',
    starterCode: `function detectTargetLeakage(features, target) {
  // features is an array of columns: features[colIdx] is an array of length N.
  // target is an array of length N.
  // TODO: return index of leaked column if all its elements match the target.
  // If no leakage is detected, return -1.
  return -1;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const target = [1, 0, 1, 1, 0];
const feats = [
  [0.2, 0.4, 0.6, 0.1, 0.9],
  [1, 0, 1, 1, 0],
  [3, 5, 2, 1, 4]
];
check('leakage in col 1', detectTargetLeakage(feats, target), 1);
check('no leakage', detectTargetLeakage([[1, 2], [3, 4]], [0, 1]), -1);
return results;`,
    hints: [
      'Iterate through columns from 0 to features.length - 1.',
      'Check if every element features[colIdx][rowIdx] equals target[rowIdx].',
      'Return colIdx if all rows match.',
    ],
    solution: `function detectTargetLeakage(features, target) {
  for (let colIdx = 0; colIdx < features.length; colIdx++) {
    let isLeak = true;
    for (let rowIdx = 0; rowIdx < target.length; rowIdx++) {
      if (features[colIdx][rowIdx] !== target[rowIdx]) {
        isLeak = false;
        break;
      }
    }
    if (isLeak) return colIdx;
  }
  return -1;
}`,
    explanation: 'Including target-like columns in features makes the model look perfect in training, but useless in production.',
  },
  {
    id: 'leakage-scale-correct',
    stepLabel: '41.2',
    group: 'Preprocessing leak',
    title: 'Leakage-Free Preprocessing',
    concept: 'Fitting transformers (like scaling, mean imputation) on the full dataset before splitting leaks test statistics into training.',
    objective: 'Implement a preprocessing function that fits scale parameters strictly on train data and applies them to both sets.',
    difficulty: 'challenge',
    starterCode: `function scaleSplitsCorrectly(trainX, valX) {
  // TODO: Compute mean and standard deviation of trainX ONLY.
  // Then standardize trainX and valX: z = (x - mean) / std. (If std is 0, use std = 1).
  let mean = 0;
  let std = 1;
  const scaledTrain = [];
  const scaledVal = [];
  
  return { scaledTrain, scaledVal, mean, std };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const train = [10, 20, 30];
const val = [40];
const res = scaleSplitsCorrectly(train, val);
check('train mean', res.mean, 20);
check('train std', res.std, 8.1649658);
check('scaled val', res.scaledVal[0], 2.44949);
return results;`,
    hints: [
      'Calculate trainX mean: sum / length.',
      'Calculate trainX variance: sum of squared differences from mean divided by length.',
      'std is Math.sqrt(variance). Avoid dividing by 0 by using 1 if std is 0.',
      'Map trainX and valX arrays to (x - mean) / std.',
    ],
    solution: `function scaleSplitsCorrectly(trainX, valX) {
  let sum = 0;
  for (let i = 0; i < trainX.length; i++) {
    sum += trainX[i];
  }
  const mean = sum / trainX.length;
  
  let varSum = 0;
  for (let i = 0; i < trainX.length; i++) {
    varSum += Math.pow(trainX[i] - mean, 2);
  }
  let std = Math.sqrt(varSum / trainX.length);
  if (std === 0) std = 1;
  
  const scaledTrain = trainX.map(x => (x - mean) / std);
  const scaledVal = valX.map(x => (x - mean) / std);
  
  return { scaledTrain, scaledVal, mean, std };
}`,
    explanation: 'Fitting preprocessing params solely on training data avoids leaks, ensuring validation reflects performance on unseen data.',
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
    id: 'knn-predict-vote',
    stepLabel: '44.1',
    group: 'kNN vote',
    title: 'kNN Classification Voting',
    concept: 'In k-Nearest Neighbors, predictions are resolved by finding the nearest samples and taking a majority vote.',
    objective: 'Vote on labels of closest k items, breaking ties by preferring the first label alphabetically/numerically.',
    difficulty: 'core',
    starterCode: `function knnVote(neighborLabels, k) {
  // neighborLabels contains labels ordered from closest to furthest neighbor
  const votes = {};
  
  // TODO: Count votes for the first k neighbors.
  // Find and return the label with the highest vote count.
  return null;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('majority vote', knnVote(['cat', 'cat', 'dog'], 3), 'cat');
check('k limit vote', knnVote(['dog', 'cat', 'cat'], 1), 'dog');
return results;`,
    hints: [
      'Loop through the first k items of neighborLabels (or fewer if array size is smaller).',
      'Increment counts in a votes dictionary.',
      'Track the max count and winner label.',
    ],
    solution: `function knnVote(neighborLabels, k) {
  const votes = {};
  const limit = Math.min(k, neighborLabels.length);
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
    explanation: 'The vote resolves label assignments based on localized density representations in metric space.',
  },
  {
    id: 'svm-hinge-loss',
    stepLabel: '44.2',
    group: 'SVM hinge',
    title: 'Hinge Loss Calculation',
    concept: 'Support Vector Machines use hinge loss to maximize margins: Loss = max(0, 1 - y * f(x)).',
    objective: 'Compute scalar hinge loss for one data point.',
    difficulty: 'core',
    starterCode: `function hingeLoss(score, label) {
  // label y is either +1 or -1
  // score is model output f(x)
  // TODO: compute and return max(0, 1 - label * score)
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('correct prediction outside margin', hingeLoss(1.5, 1), 0);
check('correct prediction inside margin', hingeLoss(0.5, 1), 0.5);
check('incorrect prediction', hingeLoss(-0.5, 1), 1.5);
return results;`,
    hints: [
      'Calculate margin term: 1 - label * score.',
      'Return Math.max(0, margin term).',
    ],
    solution: `function hingeLoss(score, label) {
  return Math.max(0, 1 - label * score);
}`,
    explanation: 'Hinge loss ignores correctly classified examples that lie beyond the margin boundary, focusing gradients strictly on active support vectors.',
  },

  // --- tree-ensembles ---
  {
    id: 'tree-gini-impurity',
    stepLabel: '45.1',
    group: 'Gini',
    title: 'Gini Impurity Calculation',
    concept: 'Decision trees evaluate split quality using node impurity metrics like Gini: Impurity = 1 - sum(p_i^2).',
    objective: 'Calculate the Gini impurity given categorical count tallies.',
    difficulty: 'warmup',
    starterCode: `function giniImpurity(counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return 0;
  
  let sumSquaredProb = 0;
  // TODO: Calculate the sum of squared probabilities for each class,
  // then return 1 - sumSquaredProb
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('perfect purity', giniImpurity([5, 0]), 0);
check('equal distribution', giniImpurity([5, 5]), 0.5);
check('skewed distribution', giniImpurity([9, 1]), 0.18);
return results;`,
    hints: [
      'Iterate through counts. Probability of class i is counts[i] / total.',
      'Accumulate the square of this probability in sumSquaredProb.',
      'Return 1 - sumSquaredProb.',
    ],
    solution: `function giniImpurity(counts) {
  let total = 0;
  for (let i = 0; i < counts.length; i++) total += counts[i];
  if (total === 0) return 0;
  
  let sumSquaredProb = 0;
  for (let i = 0; i < counts.length; i++) {
    const p = counts[i] / total;
    sumSquaredProb += p * p;
  }
  return 1 - sumSquaredProb;
}`,
    explanation: 'Gini impurity measures the likelihood of misclassification if a label was chosen randomly according to node distributions.',
  },
  {
    id: 'bagging-average-vote',
    stepLabel: '45.2',
    group: 'Bagging average',
    title: 'Bagging Ensemble Voting',
    concept: 'Random Forests use bagging (bootstrap aggregating) to reduce variance by averaging independent trees.',
    objective: 'Perform soft-voting averaging across tree class probabilities.',
    difficulty: 'core',
    starterCode: `function baggingPredict(treeProbabilities) {
  // treeProbabilities is a 2D array: [treeIdx][classIdx]
  const numTrees = treeProbabilities.length;
  const numClasses = treeProbabilities[0].length;
  const averageProbs = Array(numClasses).fill(0);
  
  // TODO: Average predictions across all trees for each class
  
  return averageProbs;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const treeProbs = [
  [0.8, 0.2],
  [0.6, 0.4],
  [0.7, 0.3]
];
check('average 3 trees', baggingPredict(treeProbs), [0.7, 0.3]);
return results;`,
    hints: [
      'Iterate through each tree i from 0 to numTrees-1.',
      'Iterate through each class c from 0 to numClasses-1.',
      'Accumulate treeProbabilities[i][c] into averageProbs[c].',
      'Divide each averageProbs[c] entry by numTrees.',
    ],
    solution: `function baggingPredict(treeProbabilities) {
  const numTrees = treeProbabilities.length;
  const numClasses = treeProbabilities[0].length;
  const averageProbs = Array(numClasses).fill(0);
  
  for (let i = 0; i < numTrees; i++) {
    for (let c = 0; c < numClasses; c++) {
      averageProbs[c] += treeProbabilities[i][c];
    }
  }
  
  for (let c = 0; c < numClasses; c++) {
    averageProbs[c] /= numTrees;
  }
  
  return averageProbs;
}`,
    explanation: 'Averaging predictions reduces variance without increasing bias, stabilizing performance against random data quirks.',
  },

  // --- time-series-forecasting-track ---
  {
    id: 'ts-rolling-mean',
    stepLabel: '46.1',
    group: 'Window slice',
    title: 'Rolling Mean Windowing',
    concept: 'Rolling statistics smooth time series trends by averaging sliding index bounds.',
    objective: 'Compute rolling average values over window length w.',
    difficulty: 'warmup',
    starterCode: `function rollingMean(series, w) {
  const result = [];
  
  // TODO: Compute rolling mean.
  // Values before w-1 measurements have insufficient context; push null for those indices.
  // Otherwise, push average of range [i - w + 1, i].
  
  return result;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => {
    if (v === null && b[i] === null) return true;
    return Math.abs(v - b[i]) <= tol;
  });
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('rolling window 3', rollingMean([10, 20, 30, 40], 3), [null, null, 20, 30]);
return results;`,
    hints: [
      'Loop i from 0 to series.length-1.',
      'If i < w - 1, push null.',
      'Else, sum series[j] for j from i - w + 1 to i, divide by w, and push result.',
    ],
    solution: `function rollingMean(series, w) {
  const result = [];
  for (let i = 0; i < series.length; i++) {
    if (i < w - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = i - w + 1; j <= i; j++) {
        sum += series[j];
      }
      result.push(sum / w);
    }
  }
  return result;
}`,
    explanation: 'Rolling averages damp out short-term fluctuations to reveal underlying macro directions.',
  },
  {
    id: 'ts-exponential-smoothing',
    stepLabel: '46.2',
    group: 'One-step forecast',
    title: 'Exponential Smoothing',
    concept: 'Exponential smoothing weights recent values with parameter alpha, fading historical values recursively: y_t = alpha * x_t + (1 - alpha) * y_prev.',
    objective: 'Generate smoothed sequence values from a timeseries.',
    difficulty: 'challenge',
    starterCode: `function expSmoothing(series, alpha) {
  const smoothed = [];
  if (series.length === 0) return smoothed;
  
  // First value initializes directly
  smoothed[0] = series[0];
  
  // TODO: compute smoothed values for i from 1 to series.length - 1
  
  return smoothed;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('smoothing alpha 0.5', expSmoothing([10, 20, 30], 0.5), [10, 15, 22.5]);
return results;`,
    hints: [
      'Loop i from 1 to series.length-1.',
      'Compute: smoothed[i] = alpha * series[i] + (1 - alpha) * smoothed[i-1].',
    ],
    solution: `function expSmoothing(series, alpha) {
  const smoothed = [];
  if (series.length === 0) return smoothed;
  smoothed[0] = series[0];
  for (let i = 1; i < series.length; i++) {
    smoothed[i] = alpha * series[i] + (1 - alpha) * smoothed[i - 1];
  }
  return smoothed;
}`,
    explanation: 'Exponential smoothing forecasts future steps by assigning decaying weight to increasingly older observations.',
  },

  // --- data-engineering-for-ml-track ---
  {
    id: 'de-impute-median',
    stepLabel: '47.1',
    group: 'Median impute',
    title: 'Median Imputation',
    concept: 'Missing values must be filled (imputed) prior to model input. The median is robust to outlier values.',
    objective: 'Find the median of non-missing values and replace nulls with it.',
    difficulty: 'core',
    starterCode: `function imputeMedian(arr) {
  // TODO: Extract non-null values and sort them to calculate the median.
  // Fill null/undefined values in the array copy with this median.
  const clean = [];
  let median = 0;
  
  return arr;
}`,
    testCode: `const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('impute odd count list', imputeMedian([5, null, 1, 9, 3]), [5, 4, 1, 9, 3]);
return results;`,
    hints: [
      'Filter out null and undefined values from arr into clean.',
      'Sort clean numerically: clean.sort((a, b) => a - b).',
      'Compute median. If clean.length is odd, it is clean[Math.floor(len/2)]. If even, it is average of middle two elements.',
      'Map original array replacing null/undefined values with median.',
    ],
    solution: `function imputeMedian(arr) {
  const clean = arr.filter(x => x !== null && x !== undefined);
  if (clean.length === 0) return arr.map(() => 0);
  
  clean.sort((a, b) => a - b);
  const mid = Math.floor(clean.length / 2);
  const median = clean.length % 2 !== 0 ? clean[mid] : (clean[mid - 1] + clean[mid]) / 2;
  
  return arr.map(x => (x === null || x === undefined ? median : x));
}`,
    explanation: 'Imputation keeps feature vectors complete without discarding valuable row observations.',
  },
  {
    id: 'de-dedupe-key',
    stepLabel: '47.2',
    group: 'Dedup key',
    title: 'Key-Based Deduplication',
    concept: 'Data pipelines often encounter duplicate log events. We must keep only the freshest row per key.',
    objective: 'Keep only the last occurrence of each unique key, maintaining original array order.',
    difficulty: 'challenge',
    starterCode: `function dedupeByKey(rows, key) {
  const seen = {};
  
  // TODO: Identify latest index for each key, 
  // then filter rows keeping only the latest records.
  return [];
}`,
    testCode: `const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const data = [
  { id: 1, val: 'a' },
  { id: 2, val: 'b' },
  { id: 1, val: 'c' }
];
check('dedup by id', dedupeByKey(data, 'id'), [
  { id: 2, val: 'b' },
  { id: 1, val: 'c' }
]);
return results;`,
    hints: [
      'Iterate backwards through rows from rows.length - 1 down to 0.',
      'If key value is not in seen, set seen[val] = true and push row to a temporary results list.',
      'Reverse the temporary results list to restore final relative ordering.',
    ],
    solution: `function dedupeByKey(rows, key) {
  const seen = {};
  const result = [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const val = rows[i][key];
    if (!seen[val]) {
      seen[val] = true;
      result.push(rows[i]);
    }
  }
  return result.reverse();
}`,
    explanation: 'Deduplication prevents duplicate events from artificially inflating counts or skewing metrics.',
  }
];
