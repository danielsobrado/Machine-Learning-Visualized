/**
 * Expands selected three-exercise lessons into 4-7 progressive steps.
 * Run: node unified-app/scripts/patch-tier4-three-step-expand.mjs
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
    ["  'bloom-filter': { source: 'algo', groups: ['Hash positions', 'Query all bits'] },",
      "  'bloom-filter': { source: 'algo', groups: ['Bloom filter step'] },"],
    ["  'train-validation-test-split': { source: 'core', groups: ['Shuffle', 'Train slice', 'No leakage check'] },",
      "  'train-validation-test-split': { source: 'core', groups: ['Dataset split pipeline'] },"],
    ["  'feature-scaling-preprocessing': { source: 'core', groups: ['Mean', 'Transform'] },",
      "  'feature-scaling-preprocessing': { source: 'core', groups: ['Feature scaling pipeline'] },"],
    ["  'k-means': { source: 'core', groups: ['Distance to centroid', 'Assignment', 'Mean update'] },",
      "  'k-means': { source: 'core', groups: ['K-means iteration'] },"],
    ["  'cosine-similarity': { source: 'linear', groups: ['Cosine similarity'] },",
      "  'cosine-similarity': { source: 'linear', groups: ['Cosine similarity'] },"],
    ["  'determinant-volume': { source: 'linear', groups: ['Determinant and invertibility'] },",
      "  'determinant-volume': { source: 'linear', groups: ['Determinant and invertibility'] },"],
    ["  'change-of-basis': { source: 'linear', groups: ['Change of basis'] },",
      "  'change-of-basis': { source: 'linear', groups: ['Change of basis'] },"],
    ["  'eigenvalue': { source: 'linear', groups: ['Eigenvalues'] },",
      "  'eigenvalue': { source: 'linear', groups: ['Eigenvalues'] },"],
    ["  'low-rank-approximation': { source: 'linear', groups: ['Low-rank approximation'] },",
      "  'low-rank-approximation': { source: 'linear', groups: ['Low-rank approximation'] },"],
    ["  'glove': {\n    source: 'nlp',\n    groups: ['Co-occurrence weight', 'Dot-plus-bias prediction', 'Full scalar loss'],\n  },",
      "  'glove': { source: 'nlp', groups: ['GloVe pair loss'] },"],
    ["  'fasttext': {\n    source: 'nlp',\n    groups: ['Character n-gram enumerate', 'Hash bucket', 'Subword vector sum'],\n  },",
      "  'fasttext': { source: 'nlp', groups: ['FastText word vector'] },"],
    ["  'multimodal-llm': { source: 'nn', groups: ['Linear project'] },",
      "  'multimodal-llm': { source: 'nn', groups: ['Multimodal projection'] },"],
    ["  'joint-attention': { source: 'diffusion', groups: ['Concat Q'] },",
      "  'joint-attention': { source: 'diffusion', groups: ['Joint attention sequence'] },"],
  ];
  for (const [from, to] of replacements) {
    if (!src.includes(from)) throw new Error(`Mapping not found: ${from}`);
    src = src.replace(from, to);
  }
  fs.writeFileSync(filePath, src);
  console.log('Patched lessonCodeLabMappings.js');
}

const BLOOM_FILTER = `  // --- bloom-filter ---
  {
    id: 'bloom-hash-sum',
    stepLabel: '70.1',
    group: 'Bloom filter step',
    title: 'Seeded hash accumulation',
    concept: 'Bloom filters build multiple bit indices by hashing the item with different seeds.',
    objective: 'Compute the hash sum for one seed.',
    difficulty: 'warmup',
    starterCode: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    // TODO: accumulate char code contribution
    hash += 0;
  }
  return hash % size;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('apple seed31', bloomHash('apple', 31, 100), 30);
check('banana seed17', bloomHash('banana', 17, 100), 53);
return results;\`,
    hints: ['hash += item.charCodeAt(i) * seed;'],
    solution: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    hash += item.charCodeAt(i) * seed;
  }
  return hash % size;
}\`,
    explanation: 'Different seeds produce different bit positions for the same token.',
  },
  {
    id: 'bloom-op-insert-loop',
    stepLabel: '70.2',
    group: 'Bloom filter step',
    title: 'Insert mode bit set',
    concept: 'Insert mode sets every hashed bit index to 1.',
    objective: 'Implement insert behavior in bloomFilterOp.',
    difficulty: 'core',
    starterCode: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'insert') {
      // TODO: set bit for insert mode
    }
  }
  return bitArray;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const bits = Array(10).fill(0);
check('insert sets bits', bloomFilterOp(bits, 'abc', [5, 9], 'insert'), [1, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
return results;\`,
    hints: ['bitArray[idx] = 1;'],
    solution: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'insert') {
      bitArray[idx] = 1;
    }
  }
  return bitArray;
}\`,
    explanation: 'Insertion overlays a compact bit-signature for approximate membership.',
  },
  {
    id: 'bloom-op-query-loop',
    stepLabel: '70.3',
    group: 'Bloom filter step',
    title: 'Query mode check',
    concept: 'Query mode returns false when any required bit is missing.',
    objective: 'Implement query behavior in bloomFilterOp.',
    difficulty: 'core',
    starterCode: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'query') {
      // TODO: fail fast when a bit is zero
    }
  }
  return true;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const bits = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
check('query hit', bloomFilterOp(bits, 'abc', [5, 9], 'query'), true);
check('query miss', bloomFilterOp(bits, 'xyz', [5, 9], 'query'), false);
return results;\`,
    hints: ['if (bitArray[idx] === 0) return false;'],
    solution: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'query') {
      if (bitArray[idx] === 0) return false;
    }
  }
  return true;
}\`,
    explanation: 'Bloom queries are one-sided: false means definitely not present.',
  },
  {
    id: 'bloom-op-empty-guard',
    stepLabel: '70.4',
    group: 'Bloom filter step',
    title: 'Empty-item guard',
    concept: 'A robust op should handle empty strings before hashing loops.',
    objective: 'Return false for empty query and unchanged array for empty insert.',
    difficulty: 'core',
    starterCode: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  // TODO: add empty-item guard
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'insert') bitArray[idx] = 1;
    if (mode === 'query' && bitArray[idx] === 0) return false;
  }
  return mode === 'insert' ? bitArray : true;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('empty query false', bloomFilterOp([0, 0], '', [3], 'query'), false);
check('empty insert unchanged', bloomFilterOp([0, 0], '', [3], 'insert'), [0, 0]);
return results;\`,
    hints: ["if (item.length === 0) return mode === 'insert' ? bitArray : false;"],
    solution: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  if (item.length === 0) return mode === 'insert' ? bitArray : false;
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'insert') bitArray[idx] = 1;
    if (mode === 'query' && bitArray[idx] === 0) return false;
  }
  return mode === 'insert' ? bitArray : true;
}\`,
    explanation: 'Guard clauses keep edge cases explicit and predictable.',
  },
  {
    id: 'bloom-op-dispatch',
    stepLabel: '70.5',
    group: 'Bloom filter step',
    title: 'Unified operation dispatch',
    concept: 'One utility can dispatch insert or query mode from the same hashing core.',
    objective: 'Return null for unknown modes and dispatch insert/query behavior.',
    difficulty: 'challenge',
    starterCode: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  if (item.length === 0) return mode === 'insert' ? bitArray : false;
  if (mode !== 'insert' && mode !== 'query') {
    // TODO: reject unsupported mode
  }
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'insert') bitArray[idx] = 1;
    else if (bitArray[idx] === 0) return false;
  }
  return mode === 'insert' ? bitArray : true;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const bits = Array(10).fill(0);
bloomFilterOp(bits, 'abc', [5, 9], 'insert');
check('query after insert', bloomFilterOp(bits, 'abc', [5, 9], 'query'), true);
check('unknown mode', bloomFilterOp(bits, 'abc', [5, 9], 'noop'), null);
return results;\`,
    hints: ['if (mode !== \\'insert\\' && mode !== \\'query\\') return null;'],
    solution: \`function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) hash += item.charCodeAt(i) * seed;
  return hash % size;
}
function bloomFilterOp(bitArray, item, seeds, mode) {
  if (item.length === 0) return mode === 'insert' ? bitArray : false;
  if (mode !== 'insert' && mode !== 'query') return null;
  const size = bitArray.length;
  for (let s = 0; s < seeds.length; s++) {
    const idx = bloomHash(item, seeds[s], size);
    if (mode === 'insert') bitArray[idx] = 1;
    else if (bitArray[idx] === 0) return false;
  }
  return mode === 'insert' ? bitArray : true;
}\`,
    explanation: 'Dispatch keeps insert and query consistent around one hashing implementation.',
  },

`;

const SPLIT_PIPELINE = `  // --- train-validation-test-split ---
  {
    id: 'split-pipeline-indices',
    stepLabel: '39.1',
    group: 'Dataset split pipeline',
    title: 'Build index list',
    concept: 'Split pipelines typically shuffle indices before slicing subsets.',
    objective: 'Build [0..n-1] index list from dataset length.',
    difficulty: 'warmup',
    starterCode: \`function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) {
    // TODO: push i
  }
  return indices;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('indices', splitPipeline(['a', 'b', 'c'], 0.6, 0.2, 42), [0, 1, 2]);
return results;\`,
    hints: ['indices.push(i);'],
    solution: \`function splitPipeline(dataset, trainFrac, valFrac, seed) {
  const indices = [];
  for (let i = 0; i < dataset.length; i++) {
    indices.push(i);
  }
  return indices;
}\`,
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
    starterCode: \`function shuffleIndices(arr, seed) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('seeded shuffle', splitPipeline([10, 20, 30, 40, 50], 0.6, 0.2, 42), [4, 2, 0, 1, 3]);
return results;\`,
    hints: ['return shuffleIndices(indices, seed);'],
    solution: \`function shuffleIndices(arr, seed) {
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
}\`,
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
    starterCode: \`function splitDataset(indices, trainFrac, valFrac) {
  const n = indices.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  // TODO: return trainIdx, valIdx, testIdx slices
  return { trainIdx: [], valIdx: [], testIdx: [] };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = splitDataset([4, 2, 0, 1, 3], 0.6, 0.2);
check('train idx', out.trainIdx, [4, 2, 0]);
check('val idx', out.valIdx, [1]);
check('test idx', out.testIdx, [3]);
return results;\`,
    hints: ['return { trainIdx: indices.slice(0, trainEnd), valIdx: indices.slice(trainEnd, valEnd), testIdx: indices.slice(valEnd) };'],
    solution: \`function splitDataset(indices, trainFrac, valFrac) {
  const n = indices.length;
  const trainEnd = Math.floor(n * trainFrac);
  const valEnd = Math.floor(n * (trainFrac + valFrac));
  return {
    trainIdx: indices.slice(0, trainEnd),
    valIdx: indices.slice(trainEnd, valEnd),
    testIdx: indices.slice(valEnd),
  };
}\`,
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
    starterCode: \`function checkNoLeakage(trainIdx, valIdx, testIdx) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('disjoint', checkNoLeakage([0, 1], [2], [3]), true);
check('overlap', checkNoLeakage([0, 1], [1], [3]), false);
return results;\`,
    hints: ['if (valSet.has(x) || testSet.has(x)) return false;'],
    solution: \`function checkNoLeakage(trainIdx, valIdx, testIdx) {
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
}\`,
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
    starterCode: \`function shuffleIndices(arr, seed) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['const noLeakage = checkNoLeakage(split.trainIdx, split.valIdx, split.testIdx);'],
    solution: \`function shuffleIndices(arr, seed) {
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
}\`,
    explanation: 'This mirrors a production-ready split utility flow for reproducible experiments.',
  },

`;

const FEATURE_SCALING = `  // --- feature-scaling-preprocessing ---
  {
    id: 'scale-mean-std',
    stepLabel: '42.1',
    group: 'Feature scaling pipeline',
    title: 'Standardization stats',
    concept: 'Standardization needs mean and standard deviation from the feature array.',
    objective: 'Compute mean and std.',
    difficulty: 'warmup',
    starterCode: \`function scaleFeatures(arr, method) {
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = scaleFeatures([10, 20, 30], 'standardize');
check('mean', out.mean, 20);
check('std', out.std, 8.1649658);
return results;\`,
    hints: ['varSum += Math.pow(arr[i] - mean, 2);'],
    solution: \`function scaleFeatures(arr, method) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  const mean = sum / arr.length;
  let varSum = 0;
  for (let i = 0; i < arr.length; i++) {
    varSum += Math.pow(arr[i] - mean, 2);
  }
  const std = Math.sqrt(varSum / arr.length);
  return { mean, std };
}\`,
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
    starterCode: \`function scaleFeatures(arr, method) {
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
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('standardized', scaleFeatures([10, 20, 30], 'standardize'), [-1.224745, 0, 1.224745]);
return results;\`,
    hints: ['return arr.map((x) => (x - mean) / std);'],
    solution: \`function scaleFeatures(arr, method) {
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
}\`,
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
    starterCode: \`function scaleFeatures(arr, method) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    // TODO: update min and max
  }
  return { min, max };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = scaleFeatures([5, 10, 2, 7], 'minmax');
check('min', out.min, 2);
check('max', out.max, 10);
return results;\`,
    hints: ['if (arr[i] < min) min = arr[i]; if (arr[i] > max) max = arr[i];'],
    solution: \`function scaleFeatures(arr, method) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }
  return { min, max };
}\`,
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
    starterCode: \`function scaleFeatures(arr, method) {
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
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('minmax', scaleFeatures([5, 10, 15, 20], 'minmax'), [0, 0.333333, 0.666667, 1]);
return results;\`,
    hints: ['if (range === 0) return arr.map(() => 0); return arr.map((x) => (x - min) / range);'],
    solution: \`function scaleFeatures(arr, method) {
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
}\`,
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
    starterCode: \`function scaleFeatures(arr, method) {
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
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('unknown unchanged', scaleFeatures([1, 2, 3], 'noop'), [1, 2, 3]);
check('minmax branch', scaleFeatures([1, 2, 3], 'minmax'), [0, 0.5, 1]);
return results;\`,
    hints: ['return [...arr];'],
    solution: \`function scaleFeatures(arr, method) {
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
}\`,
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
    starterCode: \`function scaleFeatures(arr, method) {
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
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-6) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty', scaleFeatures([], 'standardize'), []);
check('standardize', scaleFeatures([10, 20, 30], 'standardize'), [-1.224745, 0, 1.224745]);
check('minmax', scaleFeatures([5, 10, 15], 'minmax'), [0, 0.5, 1]);
return results;\`,
    hints: ['if (arr.length === 0) return [];'],
    solution: \`function scaleFeatures(arr, method) {
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
}\`,
    explanation: 'Complete preprocessing functions need predictable edge-case behavior.',
  },

`;

const KMEANS = `  // --- k-means ---
  {
    id: 'kmeans-nearest-centroid',
    stepLabel: '43.1',
    group: 'K-means iteration',
    title: 'Nearest centroid index',
    concept: 'Each point is assigned to the nearest centroid.',
    objective: 'Return nearest centroid index for one point.',
    difficulty: 'warmup',
    starterCode: \`function nearestCentroid(point, centroids) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('nearest 0', nearestCentroid([1, 2], [[0, 0], [10, 10]]), 0);
check('nearest 1', nearestCentroid([9, 9], [[0, 0], [10, 10]]), 1);
return results;\`,
    hints: ['if (d2 < bestDist) { bestDist = d2; best = c; }'],
    solution: \`function nearestCentroid(point, centroids) {
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
}\`,
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
    starterCode: \`function nearestCentroid(point, centroids) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = kmeansStep([[0, 0], [10, 10], [9, 8]], [[0, 0], [10, 10]]);
check('labels', out.labels, [0, 1, 1]);
return results;\`,
    hints: ['labels.push(nearestCentroid(points[i], centroids));'],
    solution: \`function nearestCentroid(point, centroids) {
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
}\`,
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
    starterCode: \`function kmeansStep(points, centroids) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('counts', out.counts, [2, 1]);
check('sums', out.sums, [[2, 2], [10, 10]]);
return results;\`,
    hints: ['counts[c]++;', 'sums[c][j] += points[i][j];'],
    solution: \`function kmeansStep(points, centroids) {
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
}\`,
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
    starterCode: \`function kmeansStep(points, centroids) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('new centroids', out.newCentroids, [[1, 1], [10, 10]]);
return results;\`,
    hints: ['newCentroids[c][j] = counts[c] === 0 ? centroids[c][j] : sums[c][j] / counts[c];'],
    solution: \`function kmeansStep(points, centroids) {
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
}\`,
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
    starterCode: \`function kmeansStep(points, centroids) {
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
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = kmeansStep([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]);
check('inertia', out.inertia, 4);
return results;\`,
    hints: ['let d2 = 0; for (...) d2 += (points[i][j] - newCentroids[c][j]) ** 2; inertia += d2;'],
    solution: \`function kmeansStep(points, centroids) {
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
}\`,
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
    starterCode: \`function kmeansStep(points, centroids) {
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
}\`,
    testCode: \`const results = [];
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
return results;\`,
    hints: ['return { labels: [], newCentroids: centroids.map((c) => [...c]), inertia: 0 };'],
    solution: \`function kmeansStep(points, centroids) {
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
}\`,
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
    starterCode: \`function kmeansStep(points, centroids) {
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
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('summary', kmeansSummary([[0, 0], [2, 2], [10, 10]], [[0, 0], [10, 10]]), [2, 4]);
return results;\`,
    hints: ['return [out.newCentroids.length, out.inertia];'],
    solution: \`function kmeansStep(points, centroids) {
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
}\`,
    explanation: 'This validates stable output structure after one K-means iteration.',
  },

`;

const COSINE = `  {
    id: 'cosine-dot',
    stepLabel: '5.1',
    group: 'Cosine similarity',
    title: 'Dot product',
    concept: 'Cosine similarity starts with the vector dot product.',
    objective: 'Implement dot(u, v).',
    difficulty: 'warmup',
    starterCode: \`function cosineSimilarity(u, v) {
  let dot = 0;
  for (let i = 0; i < u.length; i++) {
    // TODO: add pairwise product
    dot += 0;
  }
  return dot;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('dot', cosineSimilarity([1, 2], [3, 4]), 11);
return results;\`,
    hints: ['dot += u[i] * v[i];'],
    solution: \`function cosineSimilarity(u, v) {
  let dot = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
  }
  return dot;
}\`,
    explanation: 'Dot product captures directional alignment weighted by magnitude.',
  },
  {
    id: 'cosine-norms',
    stepLabel: '5.2',
    group: 'Cosine similarity',
    title: 'Compute norms',
    concept: 'Cosine denominator uses both vector lengths.',
    objective: 'Compute ||u|| and ||v||.',
    difficulty: 'warmup',
    starterCode: \`function cosineSimilarity(u, v) {
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    // TODO: accumulate squared terms
  }
  return [Math.sqrt(uu), Math.sqrt(vv)];
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = cosineSimilarity([3, 4], [0, 5]);
check('u norm', out[0], 5);
check('v norm', out[1], 5);
return results;\`,
    hints: ['uu += u[i] * u[i]; vv += v[i] * v[i];'],
    solution: \`function cosineSimilarity(u, v) {
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  return [Math.sqrt(uu), Math.sqrt(vv)];
}\`,
    explanation: 'Normalization removes raw length effects from similarity.',
  },
  {
    id: 'cosine-divide',
    stepLabel: '5.3',
    group: 'Cosine similarity',
    title: 'Dot over norm product',
    concept: 'Cosine similarity is dot divided by product of norms.',
    objective: 'Return dot / (nu * nv).',
    difficulty: 'core',
    starterCode: \`function cosineSimilarity(u, v) {
  let dot = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  const nu = Math.sqrt(uu);
  const nv = Math.sqrt(vv);
  // TODO: return cosine ratio
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('perpendicular', cosineSimilarity([1, 0], [0, 1]), 0);
check('same direction', cosineSimilarity([1, 0], [5, 0]), 1);
return results;\`,
    hints: ['return dot / (nu * nv);'],
    solution: \`function cosineSimilarity(u, v) {
  let dot = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  const nu = Math.sqrt(uu);
  const nv = Math.sqrt(vv);
  return dot / (nu * nv);
}\`,
    explanation: 'The quotient yields pure angular similarity.',
  },
  {
    id: 'cosine-zero-guard',
    stepLabel: '5.4',
    group: 'Cosine similarity',
    title: 'Zero-vector guard',
    concept: 'Cosine is undefined when either vector has zero norm.',
    objective: 'Return 0 when denominator is zero.',
    difficulty: 'core',
    starterCode: \`function cosineSimilarity(u, v) {
  let dot = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  const den = Math.sqrt(uu) * Math.sqrt(vv);
  // TODO: guard den === 0
  return dot / den;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero guard', cosineSimilarity([0, 0], [1, 2]), 0);
check('normal', cosineSimilarity([1, 0], [0, 1]), 0);
return results;\`,
    hints: ['if (den === 0) return 0;'],
    solution: \`function cosineSimilarity(u, v) {
  let dot = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  const den = Math.sqrt(uu) * Math.sqrt(vv);
  if (den === 0) return 0;
  return dot / den;
}\`,
    explanation: 'Defensive guards keep numeric utilities stable on degenerate inputs.',
  },
  {
    id: 'cosine-similarity-full',
    stepLabel: '5.5',
    group: 'Cosine similarity',
    title: 'Full cosineSimilarity(u,v)',
    concept: 'The complete utility combines dot, norms, division, and zero checks.',
    objective: 'Implement cosineSimilarity(u, v) end to end.',
    difficulty: 'challenge',
    starterCode: \`function cosineSimilarity(u, v) {
  let dot = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  const den = Math.sqrt(uu) * Math.sqrt(vv);
  // TODO: return 0 when den is zero else dot / den
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('same direction', cosineSimilarity([1, 0], [5, 0]), 1);
check('perpendicular', cosineSimilarity([1, 0], [0, 1]), 0);
check('opposite', cosineSimilarity([1, 0], [-2, 0]), -1);
check('zero vector', cosineSimilarity([0, 0], [1, 1]), 0);
return results;\`,
    hints: ['if (den === 0) return 0;', 'return dot / den;'],
    solution: \`function cosineSimilarity(u, v) {
  let dot = 0;
  let uu = 0;
  let vv = 0;
  for (let i = 0; i < u.length; i++) {
    dot += u[i] * v[i];
    uu += u[i] * u[i];
    vv += v[i] * v[i];
  }
  const den = Math.sqrt(uu) * Math.sqrt(vv);
  if (den === 0) return 0;
  return dot / den;
}\`,
    explanation: 'Cosine similarity maps directional agreement to [-1, 1].',
  },

`;

const DETERMINANT = `  {
    id: 'det2-basic',
    stepLabel: '20.1',
    group: 'Determinant and invertibility',
    title: 'det2 formula',
    concept: 'For [[a,b],[c,d]], det2 = ad - bc.',
    objective: 'Implement det2(M).',
    difficulty: 'warmup',
    starterCode: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  // TODO: return ad - bc
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('identity', det2([[1, 0], [0, 1]]), 1);
check('shear', det2([[1, 2], [3, 4]]), -2);
return results;\`,
    hints: ['return a * d - b * c;'],
    solution: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}\`,
    explanation: '2x2 determinants encode signed area scaling.',
  },
  {
    id: 'det2-area-scale',
    stepLabel: '20.2',
    group: 'Determinant and invertibility',
    title: 'Area scaling',
    concept: 'Absolute determinant gives area scaling factor.',
    objective: 'Implement areaScale(M) = Math.abs(det2(M)).',
    difficulty: 'warmup',
    starterCode: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}
function areaScale(M) {
  // TODO: absolute determinant
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive scale', areaScale([[2, 0], [0, 3]]), 6);
check('negative det still area', areaScale([[1, 2], [3, 4]]), 2);
return results;\`,
    hints: ['return Math.abs(det2(M));'],
    solution: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}
function areaScale(M) {
  return Math.abs(det2(M));
}\`,
    explanation: 'Sign encodes orientation flips; magnitude encodes area stretch.',
  },
  {
    id: 'det2-invertible',
    stepLabel: '20.3',
    group: 'Determinant and invertibility',
    title: 'Invertibility check',
    concept: 'A 2x2 matrix is invertible iff determinant is non-zero.',
    objective: 'Implement isInvertible2(M).',
    difficulty: 'core',
    starterCode: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}
function isInvertible2(M) {
  // TODO: return det2(M) !== 0
  return false;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('invertible', isInvertible2([[1, 2], [3, 4]]), true);
check('singular', isInvertible2([[1, 2], [2, 4]]), false);
return results;\`,
    hints: ['return det2(M) !== 0;'],
    solution: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}
function isInvertible2(M) {
  return det2(M) !== 0;
}\`,
    explanation: 'Zero determinant means transformation collapses dimension.',
  },
  {
    id: 'det2-inverse',
    stepLabel: '20.4',
    group: 'Determinant and invertibility',
    title: 'Inverse formula',
    concept: 'Inverse2 uses adjugate scaled by 1/det.',
    objective: 'Implement inverse2(M).',
    difficulty: 'core',
    starterCode: \`function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = a * d - b * c;
  // TODO: return [[d/det, -b/det], [-c/det, a/det]]
  return [[0, 0], [0, 0]];
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const inv = inverse2([[1, 2], [3, 4]]);
check('inv00', inv[0][0], -2);
check('inv01', inv[0][1], 1);
check('inv10', inv[1][0], 1.5);
check('inv11', inv[1][1], -0.5);
return results;\`,
    hints: ['return [[d / det, -b / det], [-c / det, a / det]];'],
    solution: \`function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = a * d - b * c;
  return [[d / det, -b / det], [-c / det, a / det]];
}\`,
    explanation: 'Inverse reverts the linear transform when det != 0.',
  },
  {
    id: 'det2-verify-entry',
    stepLabel: '20.5',
    group: 'Determinant and invertibility',
    title: 'Verify inverse entry',
    concept: 'M * inv(M) should equal identity.',
    objective: 'Implement verifyInverseEntry(M, row, col).',
    difficulty: 'challenge',
    starterCode: \`function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = a * d - b * c;
  return [[d / det, -b / det], [-c / det, a / det]];
}
function verifyInverseEntry(M, row, col) {
  const inv = inverse2(M);
  let total = 0;
  for (let k = 0; k < 2; k++) {
    // TODO: multiply M[row][k] by inv[k][col]
    total += 0;
  }
  return total;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const M = [[1, 2], [3, 4]];
check('I00', verifyInverseEntry(M, 0, 0), 1);
check('I01', verifyInverseEntry(M, 0, 1), 0);
check('I10', verifyInverseEntry(M, 1, 0), 0);
check('I11', verifyInverseEntry(M, 1, 1), 1);
return results;\`,
    hints: ['total += M[row][k] * inv[k][col];'],
    solution: \`function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = a * d - b * c;
  return [[d / det, -b / det], [-c / det, a / det]];
}
function verifyInverseEntry(M, row, col) {
  const inv = inverse2(M);
  let total = 0;
  for (let k = 0; k < 2; k++) {
    total += M[row][k] * inv[k][col];
  }
  return total;
}\`,
    explanation: 'Entrywise checks validate inverse correctness directly.',
  },
  {
    id: 'det2-full-pipeline',
    stepLabel: '20.6',
    group: 'Determinant and invertibility',
    title: 'Full determinant pipeline',
    concept: 'A complete utility reports determinant, area scaling, invertibility, and optional inverse.',
    objective: 'Return {det, areaScale, invertible, inverse}.',
    difficulty: 'challenge',
    starterCode: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}
function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = a * d - b * c;
  return [[d / det, -b / det], [-c / det, a / det]];
}
function determinantReport(M) {
  const det = det2(M);
  const areaScale = Math.abs(det);
  const invertible = det !== 0;
  // TODO: inverse should be null when singular
  const inverse = [];
  return { det, areaScale, invertible, inverse };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const good = determinantReport([[1, 2], [3, 4]]);
check('det', good.det, -2);
check('area', good.areaScale, 2);
check('invertible', good.invertible, true);
check('inverse', good.inverse, [[-2, 1], [1.5, -0.5]]);
const bad = determinantReport([[1, 2], [2, 4]]);
check('singular inverse null', bad.inverse, null);
return results;\`,
    hints: ['const inverse = invertible ? inverse2(M) : null;'],
    solution: \`function det2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  return a * d - b * c;
}
function inverse2(M) {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const det = a * d - b * c;
  return [[d / det, -b / det], [-c / det, a / det]];
}
function determinantReport(M) {
  const det = det2(M);
  const areaScale = Math.abs(det);
  const invertible = det !== 0;
  const inverse = invertible ? inverse2(M) : null;
  return { det, areaScale, invertible, inverse };
}\`,
    explanation: 'This packages determinant reasoning into one practical diagnostic.',
  },

`;

const CHANGE_BASIS = `  {
    id: 'basis-coordinate-one',
    stepLabel: '21.1',
    group: 'Change of basis',
    title: 'Single basis coordinate',
    concept: 'Coordinate along an orthonormal basis vector is a dot product.',
    objective: 'Implement coordinateInBasis(v, basisVector).',
    difficulty: 'warmup',
    starterCode: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    // TODO: accumulate dot contribution
    total += 0;
  }
  return total;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('x axis', coordinateInBasis([3, 4], [1, 0]), 3);
return results;\`,
    hints: ['total += v[i] * basisVector[i];'],
    solution: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) {
    total += v[i] * basisVector[i];
  }
  return total;
}\`,
    explanation: 'Coordinates are projections onto basis directions.',
  },
  {
    id: 'basis-coordinates-all',
    stepLabel: '21.2',
    group: 'Change of basis',
    title: 'All basis coordinates',
    concept: 'Coordinates in a new basis are one projection per basis vector.',
    objective: 'Implement coordinatesInBasis(v, basisVectors).',
    difficulty: 'warmup',
    starterCode: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  const coords = [];
  for (let j = 0; j < basisVectors.length; j++) {
    // TODO: push coordinate in this basis direction
    coords.push(0);
  }
  return coords;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('standard basis', coordinatesInBasis([3, 4], [[1, 0], [0, 1]]), [3, 4]);
return results;\`,
    hints: ['coords.push(coordinateInBasis(v, basisVectors[j]));'],
    solution: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  const coords = [];
  for (let j = 0; j < basisVectors.length; j++) {
    coords.push(coordinateInBasis(v, basisVectors[j]));
  }
  return coords;
}\`,
    explanation: 'Basis change collects all directional components.',
  },
  {
    id: 'basis-reconstruct',
    stepLabel: '21.3',
    group: 'Change of basis',
    title: 'Reconstruct vector',
    concept: 'Original vector is reconstructed from coordinate-weighted basis vectors.',
    objective: 'Implement reconstructFromBasis(coords, basisVectors).',
    difficulty: 'core',
    starterCode: \`function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) {
      // TODO: add coordinate contribution
      out[i] += 0;
    }
  }
  return out;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('reconstruct', reconstructFromBasis([3, 4], [[1, 0], [0, 1]]), [3, 4]);
return results;\`,
    hints: ['out[i] += coords[j] * basisVectors[j][i];'],
    solution: \`function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) {
      out[i] += coords[j] * basisVectors[j][i];
    }
  }
  return out;
}\`,
    explanation: 'Coordinates become concrete vector entries via linear combination.',
  },
  {
    id: 'basis-roundtrip',
    stepLabel: '21.4',
    group: 'Change of basis',
    title: 'Round-trip basis conversion',
    concept: 'Round-trip means convert to basis coordinates then reconstruct back.',
    objective: 'Implement roundTripBasis(v, basisVectors).',
    difficulty: 'core',
    starterCode: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  const coords = [];
  for (let j = 0; j < basisVectors.length; j++) coords.push(coordinateInBasis(v, basisVectors[j]));
  return coords;
}
function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) out[i] += coords[j] * basisVectors[j][i];
  }
  return out;
}
function roundTripBasis(v, basisVectors) {
  // TODO: use coordinatesInBasis + reconstructFromBasis
  return [];
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const basis = [[1, 0], [0, 1]];
check('round trip identity basis', roundTripBasis([3, 4], basis), [3, 4]);
return results;\`,
    hints: ['const coords = coordinatesInBasis(v, basisVectors); return reconstructFromBasis(coords, basisVectors);'],
    solution: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  const coords = [];
  for (let j = 0; j < basisVectors.length; j++) coords.push(coordinateInBasis(v, basisVectors[j]));
  return coords;
}
function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) out[i] += coords[j] * basisVectors[j][i];
  }
  return out;
}
function roundTripBasis(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  return reconstructFromBasis(coords, basisVectors);
}\`,
    explanation: 'Round-tripping verifies that basis conversion is consistent.',
  },
  {
    id: 'basis-swapped-example',
    stepLabel: '21.5',
    group: 'Change of basis',
    title: 'Swapped basis sanity check',
    concept: 'Different basis order changes coordinate order but not represented vector.',
    objective: 'Return swapped-basis coordinates then reconstruction.',
    difficulty: 'core',
    starterCode: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  return basisVectors.map((b) => coordinateInBasis(v, b));
}
function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) out[i] += coords[j] * basisVectors[j][i];
  }
  return out;
}
function basisSummary(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  // TODO: also reconstruct vector and return both
  return { coords, reconstructed: [] };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const basis = [[0, 1], [1, 0]];
const out = basisSummary([3, 4], basis);
check('coords swapped', out.coords, [4, 3]);
check('reconstruct original', out.reconstructed, [3, 4]);
return results;\`,
    hints: ['const reconstructed = reconstructFromBasis(coords, basisVectors);'],
    solution: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  return basisVectors.map((b) => coordinateInBasis(v, b));
}
function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) out[i] += coords[j] * basisVectors[j][i];
  }
  return out;
}
function basisSummary(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  const reconstructed = reconstructFromBasis(coords, basisVectors);
  return { coords, reconstructed };
}\`,
    explanation: 'Coordinates depend on basis order, but reconstructed vector stays invariant.',
  },
  {
    id: 'basis-full',
    stepLabel: '21.6',
    group: 'Change of basis',
    title: 'Complete basis utility',
    concept: 'Complete basis conversion utility supports round-trip and coordinate inspection.',
    objective: 'Return coords and roundTrip from roundTripBasis.',
    difficulty: 'challenge',
    starterCode: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  return basisVectors.map((b) => coordinateInBasis(v, b));
}
function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) out[i] += coords[j] * basisVectors[j][i];
  }
  return out;
}
function roundTripBasis(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  return reconstructFromBasis(coords, basisVectors);
}
function changeBasisSummary(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  // TODO: include roundTrip result
  return { coords, roundTrip: [] };
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= tol); }
function check(name, actual, expected) {
  const passed = Array.isArray(expected) ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const basis = [[1, 0], [0, 1]];
const out = changeBasisSummary([5, -2], basis);
check('coords', out.coords, [5, -2]);
check('roundTrip', out.roundTrip, [5, -2]);
return results;\`,
    hints: ['return { coords, roundTrip: roundTripBasis(v, basisVectors) };'],
    solution: \`function coordinateInBasis(v, basisVector) {
  let total = 0;
  for (let i = 0; i < v.length; i++) total += v[i] * basisVector[i];
  return total;
}
function coordinatesInBasis(v, basisVectors) {
  return basisVectors.map((b) => coordinateInBasis(v, b));
}
function reconstructFromBasis(coords, basisVectors) {
  const dim = basisVectors[0].length;
  const out = Array(dim).fill(0);
  for (let j = 0; j < basisVectors.length; j++) {
    for (let i = 0; i < dim; i++) out[i] += coords[j] * basisVectors[j][i];
  }
  return out;
}
function roundTripBasis(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  return reconstructFromBasis(coords, basisVectors);
}
function changeBasisSummary(v, basisVectors) {
  const coords = coordinatesInBasis(v, basisVectors);
  return { coords, roundTrip: roundTripBasis(v, basisVectors) };
}\`,
    explanation: 'The full summary exposes both transformed and reconstructed representations.',
  },

`;

const EIGEN = `  {
    id: 'eigen-matvec-entry',
    stepLabel: '22.1',
    group: 'Eigenvalues',
    title: 'matvec row dot',
    concept: 'Matrix-vector multiplication builds each output entry from a row dot product.',
    objective: 'Implement rowDot(row, x).',
    difficulty: 'warmup',
    starterCode: \`function rowDot(row, x) {
  let total = 0;
  for (let i = 0; i < row.length; i++) {
    // TODO: accumulate row[i] * x[i]
    total += 0;
  }
  return total;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('row dot', rowDot([3, 4], [1, 2]), 11);
return results;\`,
    hints: ['total += row[i] * x[i];'],
    solution: \`function rowDot(row, x) {
  let total = 0;
  for (let i = 0; i < row.length; i++) {
    total += row[i] * x[i];
  }
  return total;
}\`,
    explanation: 'matvec repeatedly applies this row-wise dot primitive.',
  },
  {
    id: 'eigen-matvec',
    stepLabel: '22.2',
    group: 'Eigenvalues',
    title: 'matvec full',
    concept: 'matvec(A, x) maps each row of A to one output component.',
    objective: 'Implement matvec(A, x).',
    difficulty: 'warmup',
    starterCode: \`function rowDot(row, x) {
  let total = 0;
  for (let i = 0; i < row.length; i++) total += row[i] * x[i];
  return total;
}
function matvec(A, x) {
  const out = [];
  for (let r = 0; r < A.length; r++) {
    // TODO: push rowDot(A[r], x)
    out.push(0);
  }
  return out;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('matvec', matvec([[2, 0], [0, 3]], [4, 5]), [8, 15]);
return results;\`,
    hints: ['out.push(rowDot(A[r], x));'],
    solution: \`function rowDot(row, x) {
  let total = 0;
  for (let i = 0; i < row.length; i++) total += row[i] * x[i];
  return total;
}
function matvec(A, x) {
  const out = [];
  for (let r = 0; r < A.length; r++) {
    out.push(rowDot(A[r], x));
  }
  return out;
}\`,
    explanation: 'matvec is the core linear transform in eigen methods.',
  },
  {
    id: 'eigen-power-step',
    stepLabel: '22.3',
    group: 'Eigenvalues',
    title: 'Power normalization step',
    concept: 'Power iteration applies matvec then normalizes.',
    objective: 'Implement powerStep(A, v).',
    difficulty: 'core',
    starterCode: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function powerStep(A, v) {
  const Av = matvec(A, v);
  let norm2 = 0;
  for (let i = 0; i < Av.length; i++) norm2 += Av[i] * Av[i];
  const norm = Math.sqrt(norm2);
  // TODO: return normalized Av
  return Av;
}\`,
    testCode: \`const results = [];
function same(a, b, tol = 1e-9) { return a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('normalize', powerStep([[2, 0], [0, 2]], [3, 4]), [0.6, 0.8]);
return results;\`,
    hints: ['return Av.map((x) => x / norm);'],
    solution: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function powerStep(A, v) {
  const Av = matvec(A, v);
  let norm2 = 0;
  for (let i = 0; i < Av.length; i++) norm2 += Av[i] * Av[i];
  const norm = Math.sqrt(norm2);
  return Av.map((x) => x / norm);
}\`,
    explanation: 'Normalization stabilizes iterative eigenvector estimation.',
  },
  {
    id: 'eigen-rayleigh',
    stepLabel: '22.4',
    group: 'Eigenvalues',
    title: 'Rayleigh quotient',
    concept: 'Rayleigh quotient approximates eigenvalue along direction v.',
    objective: 'Implement rayleigh(v, Av).',
    difficulty: 'core',
    starterCode: \`function rayleigh(v, Av) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < v.length; i++) {
    num += v[i] * Av[i];
    den += v[i] * v[i];
  }
  // TODO: return quotient
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('rayleigh', rayleigh([1, 0], [3, 0]), 3);
return results;\`,
    hints: ['return num / den;'],
    solution: \`function rayleigh(v, Av) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < v.length; i++) {
    num += v[i] * Av[i];
    den += v[i] * v[i];
  }
  return num / den;
}\`,
    explanation: 'Rayleigh gives scalar scaling estimate for a direction.',
  },
  {
    id: 'eigen-rayleigh-after-power',
    stepLabel: '22.5',
    group: 'Eigenvalues',
    title: 'Rayleigh after power step',
    concept: 'A better direction from power step gives better Rayleigh estimate.',
    objective: 'Compute rayleigh(v1, A*v1) where v1 = powerStep(A, v).',
    difficulty: 'core',
    starterCode: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function powerStep(A, v) {
  const Av = matvec(A, v);
  const norm = Math.sqrt(Av.reduce((s, x) => s + x * x, 0));
  return Av.map((x) => x / norm);
}
function rayleigh(v, Av) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < v.length; i++) {
    num += v[i] * Av[i];
    den += v[i] * v[i];
  }
  return num / den;
}
function rayleighAfterPower(A, v) {
  const v1 = powerStep(A, v);
  // TODO: compute Av1 and return rayleigh(v1, Av1)
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('diag close to dominant', rayleighAfterPower([[5, 0], [0, 2]], [1, 1]), 4.5862068966);
return results;\`,
    hints: ['const Av1 = matvec(A, v1); return rayleigh(v1, Av1);'],
    solution: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function powerStep(A, v) {
  const Av = matvec(A, v);
  const norm = Math.sqrt(Av.reduce((s, x) => s + x * x, 0));
  return Av.map((x) => x / norm);
}
function rayleigh(v, Av) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < v.length; i++) {
    num += v[i] * Av[i];
    den += v[i] * v[i];
  }
  return num / den;
}
function rayleighAfterPower(A, v) {
  const v1 = powerStep(A, v);
  const Av1 = matvec(A, v1);
  return rayleigh(v1, Av1);
}\`,
    explanation: 'Rayleigh quality improves as vector aligns with eigenvector.',
  },
  {
    id: 'eigen-estimate',
    stepLabel: '22.6',
    group: 'Eigenvalues',
    title: 'Eigenvalue estimate helper',
    concept: 'eigenEstimate combines power iteration and Rayleigh quotient.',
    objective: 'Implement eigenEstimate(A, v).',
    difficulty: 'challenge',
    starterCode: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function powerStep(A, v) {
  const Av = matvec(A, v);
  const norm = Math.sqrt(Av.reduce((s, x) => s + x * x, 0));
  return Av.map((x) => x / norm);
}
function rayleigh(v, Av) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < v.length; i++) {
    num += v[i] * Av[i];
    den += v[i] * v[i];
  }
  return num / den;
}
function eigenEstimate(A, v) {
  // TODO: power step then rayleigh estimate
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-6) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('estimate dominant', eigenEstimate([[5, 0], [0, 2]], [1, 1]), 4.5862068966);
return results;\`,
    hints: ['const v1 = powerStep(A, v); return rayleigh(v1, matvec(A, v1));'],
    solution: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function powerStep(A, v) {
  const Av = matvec(A, v);
  const norm = Math.sqrt(Av.reduce((s, x) => s + x * x, 0));
  return Av.map((x) => x / norm);
}
function rayleigh(v, Av) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < v.length; i++) {
    num += v[i] * Av[i];
    den += v[i] * v[i];
  }
  return num / den;
}
function eigenEstimate(A, v) {
  const v1 = powerStep(A, v);
  return rayleigh(v1, matvec(A, v1));
}\`,
    explanation: 'This composition is a practical one-step eigenvalue estimator.',
  },
  {
    id: 'eigen-estimate-guarded',
    stepLabel: '22.7',
    group: 'Eigenvalues',
    title: 'Guarded eigen estimate',
    concept: 'Guard zero vector before normalization to avoid NaN.',
    objective: 'Return 0 for all-zero seed vector.',
    difficulty: 'challenge',
    starterCode: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function eigenEstimate(A, v) {
  let norm2 = 0;
  for (let i = 0; i < v.length; i++) norm2 += v[i] * v[i];
  // TODO: guard norm2 === 0
  const Av = matvec(A, v);
  const num = v.reduce((s, x, i) => s + x * Av[i], 0);
  return num / norm2;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('zero seed', eigenEstimate([[2, 0], [0, 3]], [0, 0]), 0);
check('normal seed', eigenEstimate([[2, 0], [0, 3]], [1, 0]), 2);
return results;\`,
    hints: ['if (norm2 === 0) return 0;'],
    solution: \`function matvec(A, x) {
  return A.map((row) => row.reduce((s, v, i) => s + v * x[i], 0));
}
function eigenEstimate(A, v) {
  let norm2 = 0;
  for (let i = 0; i < v.length; i++) norm2 += v[i] * v[i];
  if (norm2 === 0) return 0;
  const Av = matvec(A, v);
  const num = v.reduce((s, x, i) => s + x * Av[i], 0);
  return num / norm2;
}\`,
    explanation: 'Input guards prevent undefined quotient behavior.',
  },

`;

const LOW_RANK = `  {
    id: 'low-rank-entry',
    stepLabel: '23.1',
    group: 'Low-rank approximation',
    title: 'Rank-1 entry',
    concept: 'Rank-1 approximation entry is sigma*u_i*v_j.',
    objective: 'Implement rankOneEntry.',
    difficulty: 'warmup',
    starterCode: \`function rankOneEntry(sigma, u, v, row, col) {
  // TODO: sigma * u[row] * v[col]
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('entry', rankOneEntry(2, [1, 0], [3, 4], 0, 1), 8);
return results;\`,
    hints: ['return sigma * u[row] * v[col];'],
    solution: \`function rankOneEntry(sigma, u, v, row, col) {
  return sigma * u[row] * v[col];
}\`,
    explanation: 'Every rank-1 matrix cell follows one separable formula.',
  },
  {
    id: 'low-rank-build',
    stepLabel: '23.2',
    group: 'Low-rank approximation',
    title: 'Build rank-1 matrix',
    concept: 'A rank-1 matrix is built by filling each cell with sigma*u_i*v_j.',
    objective: 'Implement rankOneMatrix.',
    difficulty: 'warmup',
    starterCode: \`function rankOneMatrix(sigma, u, v) {
  const A = [];
  for (let i = 0; i < u.length; i++) {
    const row = [];
    for (let j = 0; j < v.length; j++) {
      // TODO: push rank-1 entry
      row.push(0);
    }
    A.push(row);
  }
  return A;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('rank one', rankOneMatrix(2, [1, 0], [3, 4]), [[6, 8], [0, 0]]);
return results;\`,
    hints: ['row.push(sigma * u[i] * v[j]);'],
    solution: \`function rankOneMatrix(sigma, u, v) {
  const A = [];
  for (let i = 0; i < u.length; i++) {
    const row = [];
    for (let j = 0; j < v.length; j++) {
      row.push(sigma * u[i] * v[j]);
    }
    A.push(row);
  }
  return A;
}\`,
    explanation: 'Rank-1 structure is cheap to store and compute.',
  },
  {
    id: 'low-rank-frobenius',
    stepLabel: '23.3',
    group: 'Low-rank approximation',
    title: 'Frobenius error',
    concept: 'Frobenius error sums squared differences across all entries.',
    objective: 'Implement frobeniusErrorSquared.',
    difficulty: 'core',
    starterCode: \`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      // TODO: add squared diff
      total += 0;
    }
  }
  return total;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero', frobeniusErrorSquared([[1, 2], [3, 4]], [[1, 2], [3, 4]]), 0);
check('all zero approx', frobeniusErrorSquared([[1, 2], [3, 4]], [[0, 0], [0, 0]]), 30);
return results;\`,
    hints: ['total += diff * diff;'],
    solution: \`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}\`,
    explanation: 'This is the standard reconstruction error metric for low-rank approximations.',
  },
  {
    id: 'low-rank-k-error',
    stepLabel: '23.4',
    group: 'Low-rank approximation',
    title: 'rankKApproxError',
    concept: 'Rank-k approximation error compares original and approximated matrices.',
    objective: 'Implement rankKApproxError(A, Ahat).',
    difficulty: 'core',
    starterCode: \`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}
function rankKApproxError(A, Ahat) {
  // TODO: delegate to frobeniusErrorSquared
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('rankK error', rankKApproxError([[1, 2], [3, 4]], [[1, 2], [3, 5]]), 1);
return results;\`,
    hints: ['return frobeniusErrorSquared(A, Ahat);'],
    solution: \`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}
function rankKApproxError(A, Ahat) {
  return frobeniusErrorSquared(A, Ahat);
}\`,
    explanation: 'Wrapping the metric clarifies intent at call sites.',
  },
  {
    id: 'low-rank-step-wrapper',
    stepLabel: '23.5',
    group: 'Low-rank approximation',
    title: 'lowRankStep wrapper',
    concept: 'A low-rank step can package approximation and its error together.',
    objective: 'Implement lowRankStep(A, Ahat).',
    difficulty: 'core',
    starterCode: \`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}
function rankKApproxError(A, Ahat) {
  return frobeniusErrorSquared(A, Ahat);
}
function lowRankStep(A, Ahat) {
  // TODO: return object with approximation and error
  return { approximation: [], error: 0 };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const A = [[1, 2], [3, 4]];
const Ahat = [[1, 2], [3, 5]];
const out = lowRankStep(A, Ahat);
check('approx returned', out.approximation, Ahat);
check('error returned', out.error, 1);
return results;\`,
    hints: ['return { approximation: Ahat, error: rankKApproxError(A, Ahat) };'],
    solution: \`function frobeniusErrorSquared(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}
function rankKApproxError(A, Ahat) {
  return frobeniusErrorSquared(A, Ahat);
}
function lowRankStep(A, Ahat) {
  return { approximation: Ahat, error: rankKApproxError(A, Ahat) };
}\`,
    explanation: 'The wrapper mirrors practical training/evaluation logging shape.',
  },
  {
    id: 'low-rank-step-full',
    stepLabel: '23.6',
    group: 'Low-rank approximation',
    title: 'Complete low-rank step',
    concept: 'Complete wrapper guards dimension mismatch before error computation.',
    objective: 'Return null when shapes mismatch, else lowRankStep report.',
    difficulty: 'challenge',
    starterCode: \`function rankKApproxError(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}
function lowRankStep(A, Ahat) {
  // TODO: guard shape mismatch
  return { approximation: Ahat, error: rankKApproxError(A, Ahat) };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('shape mismatch', lowRankStep([[1, 2]], [[1], [2]]), null);
check('shape match', lowRankStep([[1, 2], [3, 4]], [[1, 2], [3, 5]]), { approximation: [[1, 2], [3, 5]], error: 1 });
return results;\`,
    hints: ['if (A.length !== Ahat.length || A[0].length !== Ahat[0].length) return null;'],
    solution: \`function rankKApproxError(A, Ahat) {
  let total = 0;
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      const diff = A[i][j] - Ahat[i][j];
      total += diff * diff;
    }
  }
  return total;
}
function lowRankStep(A, Ahat) {
  if (A.length !== Ahat.length || A[0].length !== Ahat[0].length) return null;
  return { approximation: Ahat, error: rankKApproxError(A, Ahat) };
}\`,
    explanation: 'Shape guards make low-rank diagnostics safer and easier to debug.',
  },

`;

const GLOVE = `  // --- GLOVE ---
  {
    id: 'glove-loss-weight',
    stepLabel: '2.1',
    group: 'GloVe pair loss',
    title: 'Pair weight term',
    concept: 'GloVe scales pair contribution with f(xij).',
    objective: 'Compute weight term for one pair.',
    difficulty: 'warmup',
    starterCode: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  // TODO: implement piecewise weight
  const weight = 0;
  return weight;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('x above max', glovePairLoss([], [], 0, 0, 120, 100, 0.75), 1);
check('x below max', glovePairLoss([], [], 0, 0, 50, 100, 0.75), 0.5946035575);
return results;\`,
    hints: ['const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);'],
    solution: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight;
}\`,
    explanation: 'The weighting function balances common and rare pair influence.',
  },
  {
    id: 'glove-loss-pred',
    stepLabel: '2.2',
    group: 'GloVe pair loss',
    title: 'Dot-plus-bias prediction',
    concept: 'Predicted log count is dot(wi, wj) + biasI + biasJ.',
    objective: 'Compute pred term.',
    difficulty: 'warmup',
    starterCode: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) {
    // TODO: accumulate dot
    dot += 0;
  }
  const pred = 0;
  return pred;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('pred', glovePairLoss([1, 2], [3, 4], 0.5, 0.2, 10), 11.7);
return results;\`,
    hints: ['dot += wi[i] * wj[i];', 'const pred = dot + biasI + biasJ;'],
    solution: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) {
    dot += wi[i] * wj[i];
  }
  const pred = dot + biasI + biasJ;
  return pred;
}\`,
    explanation: 'Bias terms model unigram tendency outside pair interaction.',
  },
  {
    id: 'glove-loss-diff',
    stepLabel: '2.3',
    group: 'GloVe pair loss',
    title: 'Residual vs log count',
    concept: 'Pair residual compares predicted log count to observed log(xij).',
    objective: 'Compute diff = pred - Math.log(xij).',
    difficulty: 'core',
    starterCode: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  // TODO: residual against log count
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('diff', glovePairLoss([0.5, -0.2], [0.8, 0.4], 0.1, 0.2, 10), -2.202585093);
return results;\`,
    hints: ['return pred - Math.log(xij);'],
    solution: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  return pred - Math.log(xij);
}\`,
    explanation: 'GloVe regresses on logarithmic co-occurrence scale.',
  },
  {
    id: 'glove-loss-square',
    stepLabel: '2.4',
    group: 'GloVe pair loss',
    title: 'Squared residual',
    concept: 'GloVe uses squared residual for one pair.',
    objective: 'Compute diff * diff.',
    difficulty: 'core',
    starterCode: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  // TODO: return squared residual
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('squared', glovePairLoss([0.5, -0.2], [0.8, 0.4], 0.1, 0.2, 10), 4.851379106);
return results;\`,
    hints: ['return diff * diff;'],
    solution: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  return diff * diff;
}\`,
    explanation: 'Squared penalty emphasizes larger pair mismatches.',
  },
  {
    id: 'glove-loss-weighted',
    stepLabel: '2.5',
    group: 'GloVe pair loss',
    title: 'Weighted pair loss',
    concept: 'Final pair contribution is weight times squared residual.',
    objective: 'Multiply squared residual by weight.',
    difficulty: 'core',
    starterCode: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  // TODO: return weighted loss
  return 0;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('weighted xij=10', glovePairLoss([0.5, -0.2], [0.8, 0.4], 0.1, 0.2, 10, 100, 0.75), 0.8626775708);
return results;\`,
    hints: ['return weight * sq;'],
    solution: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight * sq;
}\`,
    explanation: 'Weighting keeps frequent pairs from dominating optimization.',
  },
  {
    id: 'glove-pair-loss-full',
    stepLabel: '2.6',
    group: 'GloVe pair loss',
    title: 'Complete glovePairLoss',
    concept: 'A robust pair loss handles non-positive xij safely.',
    objective: 'Return 0 when xij <= 0, else weighted squared residual.',
    difficulty: 'challenge',
    starterCode: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  // TODO: guard non-positive xij
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight * sq;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tolerance = 1e-6) { return Math.abs(a - b) <= tolerance; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const wi = [0.5, -0.2];
const wj = [0.8, 0.4];
check('xij=10', glovePairLoss(wi, wj, 0.1, 0.2, 10, 100, 0.75), 0.8626775708);
check('xij=120', glovePairLoss(wi, wj, 0.1, 0.2, 120, 100, 0.75), 14.6967400999);
check('xij<=0 guard', glovePairLoss(wi, wj, 0.1, 0.2, 0, 100, 0.75), 0);
return results;\`,
    hints: ['if (xij <= 0) return 0;'],
    solution: \`function glovePairLoss(wi, wj, biasI, biasJ, xij, xMax = 100, alpha = 0.75) {
  if (xij <= 0) return 0;
  let dot = 0;
  for (let i = 0; i < wi.length; i++) dot += wi[i] * wj[i];
  const pred = dot + biasI + biasJ;
  const diff = pred - Math.log(xij);
  const sq = diff * diff;
  const weight = xij >= xMax ? 1 : Math.pow(xij / xMax, alpha);
  return weight * sq;
}\`,
    explanation: 'The final helper is directly usable in per-pair training loops.',
  },

`;

const FASTTEXT = `  // --- FASTTEXT ---
  {
    id: 'fasttext-embed-ngrams',
    stepLabel: '3.1',
    group: 'FastText word vector',
    title: 'Enumerate character n-grams',
    concept: 'FastText decomposes words into bounded character n-grams.',
    objective: 'Build ngram list inside fastTextEmbed.',
    difficulty: 'warmup',
    starterCode: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    // TODO: push n-gram slice
    ngrams.push('');
  }
  return ngrams;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('apple ngrams', fastTextEmbed('apple', [], 4, 2, 3), ['<ap', 'app', 'ppl', 'ple', 'le>']);
return results;\`,
    hints: ['ngrams.push(decorated.slice(i, i + n));'],
    solution: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  return ngrams;
}\`,
    explanation: 'Subword decomposition supports morphology-aware embeddings.',
  },
  {
    id: 'fasttext-embed-hash',
    stepLabel: '3.2',
    group: 'FastText word vector',
    title: 'Hash to bucket',
    concept: 'Each n-gram maps to a finite hash bucket.',
    objective: 'Implement fasttextHash inside fastTextEmbed.',
    difficulty: 'warmup',
    starterCode: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) {
      // TODO: hash update
      hash = 0;
    }
    return (hash >>> 0) % m;
  }
  return [fasttextHash('app', numBuckets), fasttextHash('ple', numBuckets)];
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = fastTextEmbed('apple', [], 4, 2, 3);
check('app bucket', out[0], 2);
check('ple bucket', out[1], 2);
return results;\`,
    hints: ['hash = (hash * 33) + ngram.charCodeAt(i);'],
    solution: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) {
      hash = (hash * 33) + ngram.charCodeAt(i);
    }
    return (hash >>> 0) % m;
  }
  return [fasttextHash('app', numBuckets), fasttextHash('ple', numBuckets)];
}\`,
    explanation: 'Hashing avoids storing explicit embeddings for all possible n-grams.',
  },
  {
    id: 'fasttext-embed-sum',
    stepLabel: '3.3',
    group: 'FastText word vector',
    title: 'Sum hashed vectors',
    concept: 'Word embedding is built by summing bucket vectors of its n-grams.',
    objective: 'Accumulate bucket vectors into sum.',
    difficulty: 'core',
    starterCode: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) ngrams.push(decorated.slice(i, i + n));
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      // TODO: add vec coordinate
      sum[d] += 0;
    }
  }
  return sum;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const buckets = [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]];
// app % 4 = 2 and ple % 4 = 2, so [0.5,0.6] + [0.5,0.6] = [1.0,1.2]
check('sum vectors', fastTextEmbed('apple', buckets, 4, 2, 3), [2.7, 3.4]);
return results;\`,
    hints: ['sum[d] += vec[d];'],
    solution: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) ngrams.push(decorated.slice(i, i + n));
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      sum[d] += vec[d];
    }
  }
  return sum;
}\`,
    explanation: 'Summed subword vectors encode shared morphology across words.',
  },
  {
    id: 'fasttext-sum-vectors',
    stepLabel: '3.4',
    group: 'FastText word vector',
    title: 'Two n-gram sum check',
    concept: 'Directly summing known n-grams validates hash/bucket behavior.',
    objective: 'Return sum for provided n-grams.',
    difficulty: 'core',
    starterCode: \`function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      // TODO: add bucket vector
      sum[d] += 0;
    }
  }
  return sum;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const buckets = [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]];
// app % 4 = 2 and ple % 4 = 2 => [0.5,0.6] + [0.5,0.6] = [1.0,1.2]
check('sum 2 ngrams', sumSubwordVectors(['app', 'ple'], buckets, 4, 2), [1.0, 1.2]);
return results;\`,
    hints: ['sum[d] += vec[d];'],
    solution: \`function sumSubwordVectors(ngrams, buckets, numBuckets, vectorDim) {
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) {
      sum[d] += vec[d];
    }
  }
  return sum;
}\`,
    explanation: 'This unit test isolates hash path correctness from n-gram extraction.',
  },
  {
    id: 'fasttext-embed-dispatch',
    stepLabel: '3.5',
    group: 'FastText word vector',
    title: 'Embed dispatch by n',
    concept: 'Embedding utility should respect chosen n-gram size n.',
    objective: 'Use function argument n for extraction loop.',
    difficulty: 'core',
    starterCode: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  // TODO: use n (not fixed size) in loop bounds/slices
  for (let i = 0; i <= decorated.length - 3; i++) {
    ngrams.push(decorated.slice(i, i + 3));
  }
  return ngrams;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('n=2', fastTextEmbed('cat', [], 4, 2, 2), ['<c', 'ca', 'at', 't>']);
return results;\`,
    hints: ['for (let i = 0; i <= decorated.length - n; i++) ngrams.push(decorated.slice(i, i + n));'],
    solution: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  return ngrams;
}\`,
    explanation: 'n controls granularity of morphological decomposition.',
  },
  {
    id: 'fasttext-embed-full',
    stepLabel: '3.6',
    group: 'FastText word vector',
    title: 'Complete fastTextEmbed',
    concept: 'Final embedding utility extracts n-grams, hashes each, and sums vectors.',
    objective: 'Implement fastTextEmbed(word, buckets, numBuckets, vectorDim, n) with empty-word guard.',
    difficulty: 'challenge',
    starterCode: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  // TODO: return zeros for empty word
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) sum[d] += vec[d];
  }
  return sum;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const buckets = [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6], [0.7, 0.8]];
check('empty word', fastTextEmbed('', buckets, 4, 2, 3), [0, 0]);
check('apple full', fastTextEmbed('apple', buckets, 4, 2, 3), [2.7, 3.4]);
return results;\`,
    hints: ["if (word.length === 0) return Array(vectorDim).fill(0);"],
    solution: \`function fastTextEmbed(word, buckets, numBuckets, vectorDim, n) {
  if (word.length === 0) return Array(vectorDim).fill(0);
  const decorated = '<' + word + '>';
  const ngrams = [];
  for (let i = 0; i <= decorated.length - n; i++) {
    ngrams.push(decorated.slice(i, i + n));
  }
  function fasttextHash(ngram, m) {
    let hash = 5381;
    for (let i = 0; i < ngram.length; i++) hash = (hash * 33) + ngram.charCodeAt(i);
    return (hash >>> 0) % m;
  }
  const sum = Array(vectorDim).fill(0);
  for (let i = 0; i < ngrams.length; i++) {
    const vec = buckets[fasttextHash(ngrams[i], numBuckets)];
    for (let d = 0; d < vectorDim; d++) sum[d] += vec[d];
  }
  return sum;
}\`,
    explanation: 'This is the complete FastText-style subword embedding step.',
  },

`;

const MULTIMODAL = `  {
    id: 'multimodal-project-dot',
    stepLabel: '37.1',
    group: 'Multimodal projection',
    title: 'Single output dimension',
    concept: 'Projection computes dot product between patch features and projection column.',
    objective: 'Fill projectPatch first output dimension.',
    difficulty: 'warmup',
    starterCode: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  const j = 0;
  let sum = 0;
  for (let d = 0; d < patch.length; d++) {
    // TODO: multiply and accumulate
    sum += 0;
  }
  projected[j] = sum;
  return projected;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('first dim', projectPatch([1, 2], [[0.5, 0, 1], [0, 0.5, 2]], 3), [0.5, 0, 0]);
return results;\`,
    hints: ['sum += patch[d] * projector[d][j];'],
    solution: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  const j = 0;
  let sum = 0;
  for (let d = 0; d < patch.length; d++) {
    sum += patch[d] * projector[d][j];
  }
  projected[j] = sum;
  return projected;
}\`,
    explanation: 'One projected dimension is one learned linear combination of patch features.',
  },
  {
    id: 'multimodal-project-loop',
    stepLabel: '37.2',
    group: 'Multimodal projection',
    title: 'All output dimensions',
    concept: 'Full projection loops over every output column.',
    objective: 'Implement complete projectPatch loop over j.',
    difficulty: 'warmup',
    starterCode: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  // TODO: loop over all output dims
  let j = 0;
  let sum = 0;
  for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
  projected[j] = sum;
  return projected;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('all dims', projectPatch([1, 2], [[0.5, 0, 1], [0, 0.5, 2]], 3), [0.5, 1, 5]);
return results;\`,
    hints: ['for (let j = 0; j < outDim; j++) { ... }'],
    solution: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}\`,
    explanation: 'Matrix-vector multiplication projects visual patch into language hidden space.',
  },
  {
    id: 'multimodal-project-bias',
    stepLabel: '37.3',
    group: 'Multimodal projection',
    title: 'Projection with bias',
    concept: 'Many projection layers include additive bias after linear transform.',
    objective: 'Implement projectWithBias.',
    difficulty: 'core',
    starterCode: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectWithBias(patch, projector, bias) {
  const base = projectPatch(patch, projector, bias.length);
  // TODO: add bias per output dimension
  return base;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('with bias', projectWithBias([1, 2], [[0.5, 0], [0, 0.5]], [0.1, -0.2]), [0.6, 0.8]);
return results;\`,
    hints: ['return base.map((x, i) => x + bias[i]);'],
    solution: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectWithBias(patch, projector, bias) {
  const base = projectPatch(patch, projector, bias.length);
  return base.map((x, i) => x + bias[i]);
}\`,
    explanation: 'Bias shifts each projected feature independently.',
  },
  {
    id: 'multimodal-project-batch-shape',
    stepLabel: '37.4',
    group: 'Multimodal projection',
    title: 'Batch projection shape',
    concept: 'Batch projection applies the same projection to all patches.',
    objective: 'Project each patch and return batch output.',
    difficulty: 'core',
    starterCode: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectBatch(patches, projector, outDim) {
  const out = [];
  for (let i = 0; i < patches.length; i++) {
    // TODO: push projected patch
  }
  return out;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('batch', projectBatch([[1, 2], [2, 1]], [[1, 0], [0, 1]], 2), [[1, 2], [2, 1]]);
return results;\`,
    hints: ['out.push(projectPatch(patches[i], projector, outDim));'],
    solution: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectBatch(patches, projector, outDim) {
  const out = [];
  for (let i = 0; i < patches.length; i++) {
    out.push(projectPatch(patches[i], projector, outDim));
  }
  return out;
}\`,
    explanation: 'Batch projection is needed for multi-patch image token streams.',
  },
  {
    id: 'multimodal-project-batch-bias',
    stepLabel: '37.5',
    group: 'Multimodal projection',
    title: 'Batch projection with bias',
    concept: 'Combined helpers apply linear projection and bias to each patch.',
    objective: 'Use projectWithBias inside projectBatch.',
    difficulty: 'core',
    starterCode: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectWithBias(patch, projector, bias) {
  const base = projectPatch(patch, projector, bias.length);
  return base.map((x, i) => x + bias[i]);
}
function projectBatch(patches, projector, bias) {
  const out = [];
  for (let i = 0; i < patches.length; i++) {
    // TODO: push bias-projected patch
    out.push([]);
  }
  return out;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('batch+bias', projectBatch([[1, 2], [2, 1]], [[1, 0], [0, 1]], [0.1, -0.1]), [[1.1, 1.9], [2.1, 0.9]]);
return results;\`,
    hints: ['out.push(projectWithBias(patches[i], projector, bias));'],
    solution: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectWithBias(patch, projector, bias) {
  const base = projectPatch(patch, projector, bias.length);
  return base.map((x, i) => x + bias[i]);
}
function projectBatch(patches, projector, bias) {
  const out = [];
  for (let i = 0; i < patches.length; i++) {
    out.push(projectWithBias(patches[i], projector, bias));
  }
  return out;
}\`,
    explanation: 'Bias-aware batch projection mirrors real multimodal adapter layers.',
  },
  {
    id: 'multimodal-projection-full',
    stepLabel: '37.6',
    group: 'Multimodal projection',
    title: 'Complete multimodal projection',
    concept: 'Complete projection utilities should gracefully handle empty batches.',
    objective: 'Return [] on empty patches in projectBatch.',
    difficulty: 'challenge',
    starterCode: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectWithBias(patch, projector, bias) {
  const base = projectPatch(patch, projector, bias.length);
  return base.map((x, i) => x + bias[i]);
}
function projectBatch(patches, projector, bias) {
  // TODO: empty batch guard
  const out = [];
  for (let i = 0; i < patches.length; i++) out.push(projectWithBias(patches[i], projector, bias));
  return out;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('empty batch', projectBatch([], [[1]], [0]), []);
check('normal batch', projectBatch([[1], [2]], [[2]], [1]), [[3], [5]]);
return results;\`,
    hints: ['if (patches.length === 0) return [];'],
    solution: \`function projectPatch(patch, projector, outDim) {
  const projected = Array(outDim).fill(0);
  for (let j = 0; j < outDim; j++) {
    let sum = 0;
    for (let d = 0; d < patch.length; d++) sum += patch[d] * projector[d][j];
    projected[j] = sum;
  }
  return projected;
}
function projectWithBias(patch, projector, bias) {
  const base = projectPatch(patch, projector, bias.length);
  return base.map((x, i) => x + bias[i]);
}
function projectBatch(patches, projector, bias) {
  if (patches.length === 0) return [];
  const out = [];
  for (let i = 0; i < patches.length; i++) out.push(projectWithBias(patches[i], projector, bias));
  return out;
}\`,
    explanation: 'These helpers form a practical multimodal adapter mini-pipeline.',
  },
`;

const JOINT_ATTN = `  // --- joint-attention ---
  {
    id: 'joint-attn-concat',
    stepLabel: '82.1',
    group: 'Joint attention sequence',
    title: 'Concatenate embeddings',
    concept: 'Joint attention starts by concatenating text and image embeddings.',
    objective: 'Implement concatEmbeddings(textEmbeds, imageEmbeds).',
    difficulty: 'warmup',
    starterCode: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  // TODO: return concatenated sequence
  return [];
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('concat', concatEmbeddings([[1], [2]], [[3]]), [[1], [2], [3]]);
return results;\`,
    hints: ['return textEmbeds.concat(imageEmbeds);'],
    solution: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}\`,
    explanation: 'Both modalities become one sequence for shared self-attention.',
  },
  {
    id: 'joint-attn-seq-length',
    stepLabel: '82.2',
    group: 'Joint attention sequence',
    title: 'Joint sequence length',
    concept: 'Sequence length is text token count plus image token count.',
    objective: 'Implement jointSeqLength.',
    difficulty: 'warmup',
    starterCode: \`function jointSeqLength(textEmbeds, imageEmbeds) {
  // TODO: return combined token length
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('len', jointSeqLength([[1], [2]], [[3], [4], [5]]), 5);
return results;\`,
    hints: ['return textEmbeds.length + imageEmbeds.length;'],
    solution: \`function jointSeqLength(textEmbeds, imageEmbeds) {
  return textEmbeds.length + imageEmbeds.length;
}\`,
    explanation: 'Joint sequence length defines Q/K/V attention matrix sizes.',
  },
  {
    id: 'joint-attn-modality-mask',
    stepLabel: '82.3',
    group: 'Joint attention sequence',
    title: 'Build modality mask',
    concept: 'A modality mask distinguishes text tokens from image tokens.',
    objective: 'Implement buildModalityMask(textLen, imageLen).',
    difficulty: 'core',
    starterCode: \`function buildModalityMask(textLen, imageLen) {
  const mask = [];
  for (let i = 0; i < textLen; i++) {
    // TODO: push text marker
  }
  for (let i = 0; i < imageLen; i++) {
    // TODO: push image marker
  }
  return mask;
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('mask', buildModalityMask(2, 3), ['text', 'text', 'image', 'image', 'image']);
return results;\`,
    hints: ["mask.push('text');", "mask.push('image');"],
    solution: \`function buildModalityMask(textLen, imageLen) {
  const mask = [];
  for (let i = 0; i < textLen; i++) mask.push('text');
  for (let i = 0; i < imageLen; i++) mask.push('image');
  return mask;
}\`,
    explanation: 'Modality masks are useful for debugging and optional routing logic.',
  },
  {
    id: 'joint-attn-concat-length',
    stepLabel: '82.4',
    group: 'Joint attention sequence',
    title: 'Concat with length check',
    concept: 'Helpers can return both concatenated sequence and its length.',
    objective: 'Return {joint, seqLen} using concatEmbeddings and jointSeqLength.',
    difficulty: 'core',
    starterCode: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}
function jointSeqLength(textEmbeds, imageEmbeds) {
  return textEmbeds.length + imageEmbeds.length;
}
function jointSummary(textEmbeds, imageEmbeds) {
  const joint = concatEmbeddings(textEmbeds, imageEmbeds);
  // TODO: compute seqLen with helper
  return { joint, seqLen: 0 };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const out = jointSummary([[1], [2]], [[3]]);
check('joint', out.joint, [[1], [2], [3]]);
check('seqLen', out.seqLen, 3);
return results;\`,
    hints: ['const seqLen = jointSeqLength(textEmbeds, imageEmbeds);'],
    solution: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}
function jointSeqLength(textEmbeds, imageEmbeds) {
  return textEmbeds.length + imageEmbeds.length;
}
function jointSummary(textEmbeds, imageEmbeds) {
  const joint = concatEmbeddings(textEmbeds, imageEmbeds);
  const seqLen = jointSeqLength(textEmbeds, imageEmbeds);
  return { joint, seqLen };
}\`,
    explanation: 'Small summaries help validate sequence assembly in tests.',
  },
  {
    id: 'joint-attn-with-mask',
    stepLabel: '82.5',
    group: 'Joint attention sequence',
    title: 'Joint summary with mask',
    concept: 'Combined utility can expose both sequence and modality mask.',
    objective: 'Return {joint, mask}.',
    difficulty: 'core',
    starterCode: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}
function buildModalityMask(textLen, imageLen) {
  const mask = [];
  for (let i = 0; i < textLen; i++) mask.push('text');
  for (let i = 0; i < imageLen; i++) mask.push('image');
  return mask;
}
function jointWithMask(textEmbeds, imageEmbeds) {
  const joint = concatEmbeddings(textEmbeds, imageEmbeds);
  // TODO: compute modality mask
  return { joint, mask: [] };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = same(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const out = jointWithMask([[1], [2]], [[3]]);
check('mask', out.mask, ['text', 'text', 'image']);
return results;\`,
    hints: ['const mask = buildModalityMask(textEmbeds.length, imageEmbeds.length);'],
    solution: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}
function buildModalityMask(textLen, imageLen) {
  const mask = [];
  for (let i = 0; i < textLen; i++) mask.push('text');
  for (let i = 0; i < imageLen; i++) mask.push('image');
  return mask;
}
function jointWithMask(textEmbeds, imageEmbeds) {
  const joint = concatEmbeddings(textEmbeds, imageEmbeds);
  const mask = buildModalityMask(textEmbeds.length, imageEmbeds.length);
  return { joint, mask };
}\`,
    explanation: 'Mask output helps inspect modality layout before attention.',
  },
  {
    id: 'joint-attn-sequence-full',
    stepLabel: '82.6',
    group: 'Joint attention sequence',
    title: 'Complete joint attention sequence',
    concept: 'Final helper reports concatenated sequence, length, and modality mask.',
    objective: 'Implement buildJointAttentionSequence with empty-input guard.',
    difficulty: 'challenge',
    starterCode: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}
function jointSeqLength(textEmbeds, imageEmbeds) {
  return textEmbeds.length + imageEmbeds.length;
}
function buildModalityMask(textLen, imageLen) {
  const mask = [];
  for (let i = 0; i < textLen; i++) mask.push('text');
  for (let i = 0; i < imageLen; i++) mask.push('image');
  return mask;
}
function buildJointAttentionSequence(textEmbeds, imageEmbeds) {
  // TODO: guard both empty
  const joint = concatEmbeddings(textEmbeds, imageEmbeds);
  const seqLen = jointSeqLength(textEmbeds, imageEmbeds);
  const modalityMask = buildModalityMask(textEmbeds.length, imageEmbeds.length);
  return { joint, seqLen, modalityMask };
}\`,
    testCode: \`const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('both empty', buildJointAttentionSequence([], []), { joint: [], seqLen: 0, modalityMask: [] });
const out = buildJointAttentionSequence([[1], [2]], [[3]]);
check('seqLen', out.seqLen, 3);
check('mask', out.modalityMask, ['text', 'text', 'image']);
return results;\`,
    hints: ['if (textEmbeds.length === 0 && imageEmbeds.length === 0) return { joint: [], seqLen: 0, modalityMask: [] };'],
    solution: \`function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}
function jointSeqLength(textEmbeds, imageEmbeds) {
  return textEmbeds.length + imageEmbeds.length;
}
function buildModalityMask(textLen, imageLen) {
  const mask = [];
  for (let i = 0; i < textLen; i++) mask.push('text');
  for (let i = 0; i < imageLen; i++) mask.push('image');
  return mask;
}
function buildJointAttentionSequence(textEmbeds, imageEmbeds) {
  if (textEmbeds.length === 0 && imageEmbeds.length === 0) {
    return { joint: [], seqLen: 0, modalityMask: [] };
  }
  const joint = concatEmbeddings(textEmbeds, imageEmbeds);
  const seqLen = jointSeqLength(textEmbeds, imageEmbeds);
  const modalityMask = buildModalityMask(textEmbeds.length, imageEmbeds.length);
  return { joint, seqLen, modalityMask };
}\`,
    explanation: 'This complete utility mirrors sequence prep in joint-modality transformers.',
  },

`;

replaceBetween(
  'src/labs/algorithms/algorithmsCodeLabs.js',
  '  // --- bloom-filter ---',
  '  // --- pagerank ---',
  BLOOM_FILTER,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- train-validation-test-split ---',
  '  // --- cross-validation ---',
  SPLIT_PIPELINE,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- feature-scaling-preprocessing ---',
  '  // --- k-means ---',
  FEATURE_SCALING,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  '  // --- k-means ---',
  '  // --- knn-naive-bayes-svm ---',
  KMEANS,
);

replaceBetween(
  'src/labs/algebra/linearAlgebraCodeLabs.js',
  "  {\n    id: 'cosine-numerator',",
  "  {\n    id: 'transpose-one-entry',",
  COSINE,
);

replaceBetween(
  'src/labs/algebra/linearAlgebraCodeLabs.js',
  "  {\n    id: 'determinant-2x2',",
  "  {\n    id: 'change-basis-one-coordinate',",
  DETERMINANT,
);

replaceBetween(
  'src/labs/algebra/linearAlgebraCodeLabs.js',
  "  {\n    id: 'change-basis-one-coordinate',",
  "  {\n    id: 'eigen-rayleigh-numerator',",
  CHANGE_BASIS,
);

replaceBetween(
  'src/labs/algebra/linearAlgebraCodeLabs.js',
  "  {\n    id: 'eigen-rayleigh-numerator',",
  "  {\n    id: 'low-rank-scaled-outer-entry',",
  EIGEN,
);

replaceBetween(
  'src/labs/algebra/linearAlgebraCodeLabs.js',
  "  {\n    id: 'low-rank-scaled-outer-entry',",
  "  {\n    id: 'absolute-error',",
  LOW_RANK,
);

replaceBetween(
  'src/labs/nlp/nlpCodeLabs.js',
  '  // --- GLOVE ---',
  '  // --- FASTTEXT ---',
  GLOVE,
);

replaceBetween(
  'src/labs/nlp/nlpCodeLabs.js',
  '  // --- FASTTEXT ---',
  '];',
  FASTTEXT,
);

replaceBetween(
  'src/labs/neural-networks/neuralNetworkCodeLabs.js',
  "  {\n    id: 'multimodal-llm-dot',",
  '];',
  MULTIMODAL,
);

replaceBetween(
  'src/labs/diffusion/diffusionCodeLabs.js',
  '  // --- joint-attention ---',
  '  // --- dit ---',
  JOINT_ATTN,
);

patchMappings();
console.log('Tier 4 three-step expansion patch script created.');
