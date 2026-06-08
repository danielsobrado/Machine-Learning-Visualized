export const CORE_ML_CODE_LABS = [
  // --- train-validation-test-split ---
  {
    id: 'split-pipeline-indices',
    stepLabel: '39.1',
    group: 'Dataset split pipeline',
    title: 'Build index list',
    concept: 'Split pipelines typically shuffle indices before slicing subsets.',
    objective: 'Build [0..n-1] index list from dataset length.',
    difficulty: 'warmup',
    starterCode: `function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) {
    // TODO: push i
  }
  return indices;
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('indices', splitPipeline(['a', 'b', 'c'], 0.6, 0.2, 42), [0, 1, 2]);
return results;`,
    hints: ['indices.push(i);'],
    solution: `function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) {
    indices.push(i);
  }
  return indices;
}`,
    explanation: 'Index pipelines avoid copying and mutating raw records during split logic.',
  },
  {
    id: 'split-pipeline-shuffle',
    stepLabel: '39.2',
    group: 'Dataset split pipeline',
    title: 'Deterministic shuffle',
    concept: 'Deterministic shuffling lets tests and experiments be reproducible.',
    objective: 'Use shuffleIndices(indices, seed).',
    difficulty: 'warmup',
    starterCode: `function shuffleIndices(arr, seed) {
  let r = seed || 42;
  function random() {
    const x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = t;
  }
  return shuffled;
}
function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) indices.push(i);
  // TODO: shuffle indices with seed
  return indices;
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('seeded shuffle', splitPipeline([10, 20, 30, 40, 50], 0.6, 0.2, 42), [4, 2, 0, 1, 3]);
return results;`,
    hints: ['return shuffleIndices(indices, seed);'],
    solution: `function shuffleIndices(arr, seed) {
  let r = seed || 42;
  function random() {
    const x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = t;
  }
  return shuffled;
}
function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) indices.push(i);
  return shuffleIndices(indices, seed);
}`,
    explanation: 'Seed control makes split behavior auditable and repeatable.',
  },
  {
    id: 'split-pipeline-slices',
    stepLabel: '39.3',
    group: 'Dataset split pipeline',
    title: 'Index slices',
    concept: 'After shuffling, split indices into train/val/test boundaries.',
    objective: 'Implement splitDataset index slicing.',
    difficulty: 'core',
    starterCode: `function splitDataset(indices, trainFrac, valFrac) {
  const n = indices.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  // TODO: return trainIdx, valIdx, testIdx slices
  return { trainIdx: [], valIdx: [], testIdx: [] };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = splitDataset([4, 2, 0, 1, 3], 0.6, 0.2);
check('train idx', out.trainIdx, [4, 2, 0]);
check('val idx', out.valIdx, [1]);
check('test idx', out.testIdx, [3]);
return results;`,
    hints: ['return { trainIdx: indices.slice(0, trainEnd), valIdx: indices.slice(trainEnd, valEnd), testIdx: indices.slice(valEnd) };'],
    solution: `function splitDataset(indices, trainFrac, valFrac) {
  const n = indices.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  return {
    trainIdx: indices.slice(0, trainEnd),
    valIdx: indices.slice(trainEnd, valEnd),
    testIdx: indices.slice(valEnd),
  };
}`,
    explanation: 'Boundary slicing creates non-overlapping split partitions.',
  },
  {
    id: 'split-pipeline-leak-check',
    stepLabel: '39.4',
    group: 'Dataset split pipeline',
    title: 'Leakage checker',
    concept: 'Leak-free splits require disjoint train/val/test index sets.',
    objective: 'Complete checkNoLeakage helper.',
    difficulty: 'core',
    starterCode: `function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  for (const x of trainIdx) {
    // TODO: reject overlap with val/test
  }
  for (const x of valIdx) {
    if (testSet.has(x)) return false;
  }
  return true;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('disjoint', checkNoLeakage([0, 1], [2], [3]), true);
check('overlap', checkNoLeakage([0, 1], [1], [3]), false);
return results;`,
    hints: ['if (valSet.has(x) || testSet.has(x)) return false;'],
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
    explanation: 'Leakage checks prevent inflated validation metrics.',
  },
  {
    id: 'split-pipeline-full',
    stepLabel: '39.5',
    group: 'Dataset split pipeline',
    title: 'Full split pipeline',
    concept: 'A complete split pipeline creates shuffled partitions and verifies disjointness.',
    objective: 'Build splitPipeline(dataset, trainFrac, valFrac, seed) end to end.',
    difficulty: 'challenge',
    starterCode: `function shuffleIndices(arr, seed) {
  let r = seed || 42;
  function random() {
    const x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = t;
  }
  return shuffled;
}
function splitDataset(indices, trainFrac, valFrac) {
  const n = indices.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  return {
    trainIdx: indices.slice(0, trainEnd),
    valIdx: indices.slice(trainEnd, valEnd),
    testIdx: indices.slice(valEnd),
  };
}
function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  for (const x of trainIdx) if (valSet.has(x) || testSet.has(x)) return false;
  for (const x of valIdx) if (testSet.has(x)) return false;
  return true;
}
function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) indices.push(i);
  const shuffled = shuffleIndices(indices, seed);
  const split = splitDataset(shuffled, trainFrac, valFrac);
  // TODO: add leakage check and map indices back to examples
  return { train: [], val: [], test: [], noLeakage: false };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const out = splitPipeline(['a', 'b', 'c', 'd', 'e'], 0.6, 0.2, 42);
check('train values', out.train, ['e', 'c', 'a']);
check('val values', out.val, ['b']);
check('test values', out.test, ['d']);
check('no leakage', out.noLeakage, true);
return results;`,
    hints: ['const noLeakage = checkNoLeakage(split.trainIdx, split.valIdx, split.testIdx);'],
    solution: `function shuffleIndices(arr, seed) {
  let r = seed || 42;
  function random() {
    const x = Math.sin(r++) * 10000;
    return x - Math.floor(x);
  }
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const t = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = t;
  }
  return shuffled;
}
function splitDataset(indices, trainFrac, valFrac) {
  const n = indices.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  return {
    trainIdx: indices.slice(0, trainEnd),
    valIdx: indices.slice(trainEnd, valEnd),
    testIdx: indices.slice(valEnd),
  };
}
function checkNoLeakage(trainIdx, valIdx, testIdx) {
  const trainSet = new Set(trainIdx);
  const valSet = new Set(valIdx);
  const testSet = new Set(testIdx);
  for (const x of trainIdx) if (valSet.has(x) || testSet.has(x)) return false;
  for (const x of valIdx) if (testSet.has(x)) return false;
  return true;
}
function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) indices.push(i);
  const shuffled = shuffleIndices(indices, seed);
  const split = splitDataset(shuffled, trainFrac, valFrac);
  const noLeakage = checkNoLeakage(split.trainIdx, split.valIdx, split.testIdx);
  return {
    train: split.trainIdx.map((i) => dataset[i]),
    val: split.valIdx.map((i) => dataset[i]),
    test: split.testIdx.map((i) => dataset[i]),
    noLeakage,
  };
}`,
    explanation: 'This mirrors a production-ready split utility flow for reproducible experiments.',
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
    id: 'scale-mean-std',
    stepLabel: '42.1',
    group: 'Feature scaling pipeline',
    title: 'Standardization stats',
    concept: 'Standardization needs mean and standard deviation from the feature array.',
    objective: 'Compute mean and std.',
    difficulty: 'warmup',
    starterCode: `function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) {
    // TODO: accumulate squared difference
    varSum += 0;
  }
  const std = Math.sqrt(varSum / arr.length);
  return { mean, std };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = scaleFeatures([10, 20, 30], 'standardize');
check('mean', out.mean, 20);
check('std', out.std, 8.1649658);
return results;`,
    hints: ['varSum += Math.pow(arr[i] - mean, 2);'],
    solution: `function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) {
    varSum += Math.pow(arr[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / arr.length);
  return { mean, std };
}`,
    explanation: 'Statistical moments define the normalization transform.',
  },
  {
    id: 'scale-standardize',
    stepLabel: '42.2',
    group: 'Feature scaling pipeline',
    title: 'Standardize values',
    concept: 'Standardization centers values and scales by spread.',
    objective: 'Return arr mapped to (x - mean) / std.',
    difficulty: 'warmup',
    starterCode: `function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) varSum += Math.pow(arr[i] - mean, 2);
  let std = Math.sqrt(varSum / arr.length);
  if (std === 0) std = 1;
  if (method === 'standardize') {
    // TODO: return standardized values
    return arr;
  }
  return [];
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('standardized', scaleFeatures([10, 20, 30], 'standardize'), [-1.224745, 0, 1.224745]);
return results;`,
    hints: ['return arr.map((x) => (x - mean) / std);'],
    solution: `function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) varSum += Math.pow(arr[i] - mean, 2);
  let std = Math.sqrt(varSum / arr.length);
  if (std === 0) std = 1;
  if (method === 'standardize') {
    return arr.map((x) => (x - mean) / std);
  }
  return [];
}`,
    explanation: 'Z-scores make each feature dimension comparable.',
  },
  {
    id: 'scale-minmax-bounds',
    stepLabel: '42.3',
    group: 'Feature scaling pipeline',
    title: 'Min-max bounds',
    concept: 'Min-max scaling needs feature minimum and maximum.',
    objective: 'Compute min and max by scanning arr.',
    difficulty: 'warmup',
    starterCode: `function scaleFeatures(arr, method) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    // TODO: update min and max
  }
  return { min, max };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = scaleFeatures([5, 10, 2, 7], 'minmax');
check('min', out.min, 2);
check('max', out.max, 10);
return results;`,
    hints: ['if (arr[i] < min) min = arr[i]; if (arr[i] > max) max = arr[i];'],
    solution: `function scaleFeatures(arr, method) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  return { min, max };
}`,
    explanation: 'Bounded transforms rely on range endpoints.',
  },
  {
    id: 'scale-minmax-transform',
    stepLabel: '42.4',
    group: 'Feature scaling pipeline',
    title: 'Min-max transform',
    concept: 'Min-max maps values into [0, 1] by range normalization.',
    objective: 'Implement min-max scaling branch.',
    difficulty: 'core',
    starterCode: `function scaleFeatures(arr, method) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  if (method === 'minmax') {
    const range = max - min;
    // TODO: range=0 => all zeros, else normalized values
    return arr;
  }
  return [];
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('minmax', scaleFeatures([5, 10, 15, 20], 'minmax'), [0, 0.333333, 0.666667, 1]);
return results;`,
    hints: ['if (range === 0) return arr.map(() => 0); return arr.map((x) => (x - min) / range);'],
    solution: `function scaleFeatures(arr, method) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  if (method === 'minmax') {
    const range = max - min;
    if (range === 0) return arr.map(() => 0);
    return arr.map((x) => (x - min) / range);
  }
  return [];
}`,
    explanation: 'Range scaling is common for bounded-input models.',
  },
  {
    id: 'scale-method-dispatch',
    stepLabel: '42.5',
    group: 'Feature scaling pipeline',
    title: 'Method dispatch',
    concept: 'A single utility can dispatch scaling based on method string.',
    objective: 'Handle standardize and minmax branches.',
    difficulty: 'core',
    starterCode: `function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) varSum += Math.pow(arr[i] - mean, 2);
  let std = Math.sqrt(varSum / arr.length);
  if (std === 0) std = 1;
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  const range = max - min;
  if (method === 'standardize') return arr.map((x) => (x - mean) / std);
  if (method === 'minmax') return range === 0 ? arr.map(() => 0) : arr.map((x) => (x - min) / range);
  // TODO: unknown method fallback
  return arr;
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('unknown unchanged', scaleFeatures([1, 2, 3], 'noop'), [1, 2, 3]);
check('minmax branch', scaleFeatures([1, 2, 3], 'minmax'), [0, 0.5, 1]);
return results;`,
    hints: ['return [...arr];'],
    solution: `function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) varSum += Math.pow(arr[i] - mean, 2);
  let std = Math.sqrt(varSum / arr.length);
  if (std === 0) std = 1;
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  const range = max - min;
  if (method === 'standardize') return arr.map((x) => (x - mean) / std);
  if (method === 'minmax') return range === 0 ? arr.map(() => 0) : arr.map((x) => (x - min) / range);
  return [...arr];
}`,
    explanation: 'Dispatch centralizes scaling behavior behind one API.',
  },
  {
    id: 'scale-features-full',
    stepLabel: '42.6',
    group: 'Feature scaling pipeline',
    title: 'Complete scaling pipeline',
    concept: 'A robust scaler handles empty arrays and both scaling methods.',
    objective: 'Return [] for empty input and apply chosen scaling strategy.',
    difficulty: 'challenge',
    starterCode: `function scaleFeatures(arr, method) {
  // TODO: guard empty input
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) varSum += Math.pow(arr[i] - mean, 2);
  let std = Math.sqrt(varSum / arr.length);
  if (std === 0) std = 1;
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  const range = max - min;
  if (method === 'standardize') return arr.map((x) => (x - mean) / std);
  if (method === 'minmax') return range === 0 ? arr.map(() => 0) : arr.map((x) => (x - min) / range);
  return [...arr];
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty', scaleFeatures([], 'standardize'), []);
check('standardize', scaleFeatures([10, 20, 30], 'standardize'), [-1.224745, 0, 1.224745]);
check('minmax', scaleFeatures([5, 10, 15], 'minmax'), [0, 0.5, 1]);
return results;`,
    hints: ['if (arr.length === 0) return [];'],
    solution: `function scaleFeatures(arr, method) {
  if (arr.length === 0) return [];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) varSum += Math.pow(arr[i] - mean, 2);
  let std = Math.sqrt(varSum / arr.length);
  if (std === 0) std = 1;
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  const range = max - min;
  if (method === 'standardize') return arr.map((x) => (x - mean) / std);
  if (method === 'minmax') return range === 0 ? arr.map(() => 0) : arr.map((x) => (x - min) / range);
  return [...arr];
}`,
    explanation: 'Complete preprocessing functions need predictable edge-case behavior.',
  },

  // --- k-means ---
  {
    id: 'kmeans-nearest-centroid',
    stepLabel: '43.1',
    group: 'K-means iteration',
    title: 'Nearest centroid index',
    concept: 'Each point is assigned to the nearest centroid.',
    objective: 'Return nearest centroid index for one point.',
    difficulty: 'warmup',
    starterCode: `function nearestCentroid(point, centroids) {
  let best = 0;
  let bestDist = Infinity;
  for (let c = 0; c < centroids.length; c++) {
    let d2 = 0;
    for (let j = 0; j < point.length; j++) {
      const diff = point[j] - centroids[c][j];
      d2 += diff * diff;
    }
    // TODO: update best/bestDist
  }
  return best;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('nearest 0', nearestCentroid([1, 2], [[0, 0], [10, 10]]), 0);
check('nearest 1', nearestCentroid([9, 9], [[0, 0], [10, 10]]), 1);
return results;`,
    hints: ['if (d2 < bestDist) { bestDist = d2; best = c; }'],
    solution: `function nearestCentroid(point, centroids) {
  let best = 0;
  let bestDist = Infinity;
  for (let c = 0; c < centroids.length; c++) {
    let d2 = 0;
    for (let j = 0; j < point.length; j++) {
      const diff = point[j] - centroids[c][j];
      d2 += diff * diff;
    }
    if (d2 < bestDist) {
      bestDist = d2;
      best = c;
    }
  }
  return best;
}`,
    explanation: 'Label assignment is the first half of each K-means iteration.',
  },
  {
    id: 'kmeans-labels-loop',
    stepLabel: '43.2',
    group: 'K-means iteration',
    title: 'Assign all labels',
    concept: 'K-means assigns every point to a closest centroid index.',
    objective: 'Fill labels array by calling nearestCentroid.',
    difficulty: 'warmup',
    starterCode: `function nearestCentroid(point, centroids) {
  let best = 0;
  let bestDist = Infinity;
  for (let c = 0; c < centroids.length; c++) {
    let d2 = 0;
    for (let j = 0; j < point.length; j++) {
      const diff = point[j] - centroids[c][j];
      d2 += diff * diff;
    }
    if (d2 < bestDist) { bestDist = d2; best = c; }
  }
  return best;
}
function kmeansStep(points, centroids) {
  const labels = [];
  for (let i = 0; i < points.length; i++) {
    // TODO: push nearest centroid for points[i]
  }
  return { labels, newCentroids: [], inertia: 0 };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = kmeansStep([[0, 0], [10, 10], [9, 8]], [[0, 0], [10, 10]]);
check('labels', out.labels, [0, 1, 1]);
return results;`,
    hints: ['labels.push(nearestCentroid(points[i], centroids));'],
    solution: `function nearestCentroid(point, centroids) {
  let best = 0;
  let bestDist = Infinity;
  for (let c = 0; c < centroids.length; c++) {
    let d2 = 0;
    for (let j = 0; j < point.length; j++) {
      const diff = point[j] - centroids[c][j];
      d2 += diff * diff;
    }
    if (d2 < bestDist) { bestDist = d2; best = c; }
  }
  return best;
}
function kmeansStep(points, centroids) {
  const labels = [];
  for (let i = 0; i < points.length; i++) {
    labels.push(nearestCentroid(points[i], centroids));
  }
  return { labels, newCentroids: [], inertia: 0 };
}`,
    explanation: 'Label vectors capture cluster membership for update phase.',
  },
  {
    id: 'kmeans-centroid-sums',
    stepLabel: '43.3',
    group: 'K-means iteration',
    title: 'Accumulate centroid sums',
    concept: 'Centroid updates average points assigned to each cluster.',
    objective: 'Accumulate sums and counts by label.',
    difficulty: 'core',
    starterCode: `function kmeansStep(points, centroids) {
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = [];
  for (let i = 0; i < points.length; i++) {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (points[i][j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    labels.push(best);
  }
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    // TODO: update counts and coordinate sums
  }
  return { sums, counts };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('counts', out.counts, [2, 1]);
check('sums', out.sums, [[2, 2], [10, 10]]);
return results;`,
    hints: ['counts[c]++;', 'sums[c][j] += points[i][j];'],
    solution: `function kmeansStep(points, centroids) {
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = [];
  for (let i = 0; i < points.length; i++) {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (points[i][j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    labels.push(best);
  }
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  return { sums, counts };
}`,
    explanation: 'Cluster means are computed from per-cluster coordinate sums.',
  },
  {
    id: 'kmeans-new-centroids',
    stepLabel: '43.4',
    group: 'K-means iteration',
    title: 'Compute centroid means',
    concept: 'Each centroid becomes the arithmetic mean of assigned points.',
    objective: 'Build newCentroids from sums/counts with empty-cluster fallback.',
    difficulty: 'core',
    starterCode: `function kmeansStep(points, centroids) {
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    // TODO: divide sums by count, else keep previous centroid
  }
  return { labels, newCentroids, inertia: 0 };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('new centroids', out.newCentroids, [[1, 1], [10, 10]]);
return results;`,
    hints: ['newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];'],
    solution: `function kmeansStep(points, centroids) {
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  return { labels, newCentroids, inertia: 0 };
}`,
    explanation: 'Empty clusters are usually stabilized by preserving previous centroid positions.',
  },
  {
    id: 'kmeans-inertia',
    stepLabel: '43.5',
    group: 'K-means iteration',
    title: 'Compute inertia',
    concept: 'Inertia is the total within-cluster squared distance.',
    objective: 'Accumulate squared distance to assigned updated centroids.',
    difficulty: 'core',
    starterCode: `function kmeansStep(points, centroids) {
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    // TODO: add squared distance to newCentroids[c]
  }
  return { labels, newCentroids, inertia };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('inertia', out.inertia, 4);
return results;`,
    hints: ['let d2 = 0; for (...) d2 += (points[i][j] - newCentroids[c][j]) ** 2; inertia += d2;'],
    solution: `function kmeansStep(points, centroids) {
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    let d2 = 0;
    for (let j = 0; j < dim; j++) d2 += (points[i][j] - newCentroids[c][j]) ** 2;
    inertia += d2;
  }
  return { labels, newCentroids, inertia };
}`,
    explanation: 'Inertia is the optimization target minimized by K-means.',
  },
  {
    id: 'kmeans-step-full',
    stepLabel: '43.6',
    group: 'K-means iteration',
    title: 'Full K-means step',
    concept: 'A full step returns labels, centroid updates, and inertia.',
    objective: 'Guard empty points and return {labels,newCentroids,inertia}.',
    difficulty: 'challenge',
    starterCode: `function kmeansStep(points, centroids) {
  if (points.length === 0) {
    // TODO: return empty labels, unchanged centroids, zero inertia
  }
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    let d2 = 0;
    for (let j = 0; j < dim; j++) d2 += (points[i][j] - newCentroids[c][j]) ** 2;
    inertia += d2;
  }
  return { labels, newCentroids, inertia };
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  const passed = typeof expected === 'number' ? approxEqual(actual, expected) : same(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('empty labels', kmeansStep([], [[1, 1]]).labels, []);
check('empty centroids unchanged', kmeansStep([], [[1, 1]]).newCentroids, [[1, 1]]);
check('empty inertia', kmeansStep([], [[1, 1]]).inertia, 0);
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('labels full', out.labels, [0, 0, 1]);
check('centroids full', out.newCentroids, [[1, 1], [10, 10]]);
check('inertia full', out.inertia, 4);
return results;`,
    hints: ['return { labels: [], newCentroids: centroids.map((c) => [...c]), inertia: 0 };'],
    solution: `function kmeansStep(points, centroids) {
  if (points.length === 0) {
    return { labels: [], newCentroids: centroids.map((c) => [...c]), inertia: 0 };
  }
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    let d2 = 0;
    for (let j = 0; j < dim; j++) d2 += (points[i][j] - newCentroids[c][j]) ** 2;
    inertia += d2;
  }
  return { labels, newCentroids, inertia };
}`,
    explanation: 'This single step is the reusable core for iterative K-means fitting.',
  },
  {
    id: 'kmeans-step-compact',
    stepLabel: '43.7',
    group: 'K-means iteration',
    title: 'Compact step validation',
    concept: 'Final checks ensure outputs stay shape-consistent across updates.',
    objective: 'Return centroid count and inertia from kmeansStep output.',
    difficulty: 'challenge',
    starterCode: `function kmeansStep(points, centroids) {
  if (points.length === 0) return { labels: [], newCentroids: centroids.map((c) => [...c]), inertia: 0 };
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    let d2 = 0;
    for (let j = 0; j < dim; j++) d2 += (points[i][j] - newCentroids[c][j]) ** 2;
    inertia += d2;
  }
  return { labels, newCentroids, inertia };
}
function kmeansSummary(points, centroids) {
  const out = kmeansStep(points, centroids);
  // TODO: return [number of centroids, inertia]
  return [0, 0];
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('summary', kmeansSummary([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]), [2, 4]);
return results;`,
    hints: ['return [out.newCentroids.length, out.inertia];'],
    solution: `function kmeansStep(points, centroids) {
  if (points.length === 0) return { labels: [], newCentroids: centroids.map((c) => [...c]), inertia: 0 };
  const k = centroids.length;
  const dim = centroids[0].length;
  const labels = points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    for (let c = 0; c < k; c++) {
      let d2 = 0;
      for (let j = 0; j < dim; j++) d2 += (p[j] - centroids[c][j]) ** 2;
      if (d2 < bestDist) { bestDist = d2; best = c; }
    }
    return best;
  });
  const sums = Array(k).fill(null).map(() => Array(dim).fill(0));
  const counts = Array(k).fill(0);
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    counts[c]++;
    for (let j = 0; j < dim; j++) sums[c][j] += points[i][j];
  }
  const newCentroids = Array(k).fill(null).map(() => Array(dim).fill(0));
  for (let c = 0; c < k; c++) {
    for (let j = 0; j < dim; j++) {
      newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];
    }
  }
  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const c = labels[i];
    let d2 = 0;
    for (let j = 0; j < dim; j++) d2 += (points[i][j] - newCentroids[c][j]) ** 2;
    inertia += d2;
  }
  return { labels, newCentroids, inertia };
}
function kmeansSummary(points, centroids) {
  const out = kmeansStep(points, centroids);
  return [out.newCentroids.length, out.inertia];
}`,
    explanation: 'This validates stable output structure after one K-means iteration.',
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
