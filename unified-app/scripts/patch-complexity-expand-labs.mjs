/**
 * Expands high-complexity labs beyond the 4-step floor toward the 4–10 target.
 * Run: node unified-app/scripts/patch-complexity-expand-labs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function insertBefore(filePath, marker, insertContent) {
  const fullPath = path.join(ROOT, filePath);
  const src = fs.readFileSync(fullPath, 'utf8');
  const idx = src.indexOf(marker);
  if (idx === -1) throw new Error(`Marker not found in ${filePath}: ${marker}`);
  fs.writeFileSync(fullPath, src.slice(0, idx) + insertContent + src.slice(idx));
  console.log(`Inserted into ${filePath}`);
}

function replaceBetween(filePath, startMarker, endMarker, newContent) {
  const fullPath = path.join(ROOT, filePath);
  const src = fs.readFileSync(fullPath, 'utf8');
  const startIdx = src.indexOf(startMarker);
  const endIdx = src.indexOf(endMarker, startIdx);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Markers not found in ${filePath}`);
  }
  fs.writeFileSync(fullPath, src.slice(0, startIdx) + newContent + src.slice(endIdx));
  console.log(`Replaced section in ${filePath}`);
}

const FLASH_EXTRA = `  {
    id: 'flash-scale-old',
    stepLabel: '9.5',
    group: 'Online softmax block',
    title: 'Rescale previous block',
    concept: 'When a larger block max arrives, earlier softmax mass must be down-weighted by exp(oldMax - newMax).',
    objective: 'Inside flashAttentionStep, compute scaleOld = Math.exp(oldMax - newMax).',
    difficulty: 'warmup',
    starterCode: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  // TODO: scaleOld = Math.exp(oldMax - newMax)
  const scaleOld = 1;
  const scaleBlock = Math.exp(blockMax - newMax);
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  const newOutput = oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);
  return { max: newMax, sum: newSum, output: newOutput };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = flashAttentionStep({ max: 1, sum: 2, output: [1] }, 3, 1, [0]);
check('downweighted sum', out.sum, 0.270671);
return results;\`,
    hints: ['const scaleOld = Math.exp(oldMax - newMax);'],
    solution: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  const scaleOld = Math.exp(oldMax - newMax);
  const scaleBlock = Math.exp(blockMax - newMax);
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  const newOutput = oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);
  return { max: newMax, sum: newSum, output: newOutput };
}\`,
    explanation: 'Old-block rescaling is what makes online softmax exact.',
  },
  {
    id: 'flash-scale-block',
    stepLabel: '9.6',
    group: 'Online softmax block',
    title: 'Scale incoming block',
    concept: 'The new block contribution is weighted by exp(blockMax - newMax) before accumulation.',
    objective: 'Compute scaleBlock = Math.exp(blockMax - newMax).',
    difficulty: 'warmup',
    starterCode: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  const scaleOld = Math.exp(oldMax - newMax);
  // TODO: scaleBlock = Math.exp(blockMax - newMax)
  const scaleBlock = 1;
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  const newOutput = oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);
  return { max: newMax, sum: newSum, output: newOutput };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = flashAttentionStep({ max: 2, sum: 1, output: [0] }, 4, 2, [1]);
check('block scaled sum', out.sum, 1.735759);
return results;\`,
    hints: ['const scaleBlock = Math.exp(blockMax - newMax);'],
    solution: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  const scaleOld = Math.exp(oldMax - newMax);
  const scaleBlock = Math.exp(blockMax - newMax);
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  const newOutput = oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);
  return { max: newMax, sum: newSum, output: newOutput };
}\`,
    explanation: 'Both old and new blocks must be expressed in the same max-reference frame.',
  },
  {
    id: 'flash-normalize',
    stepLabel: '9.7',
    group: 'Online softmax block',
    title: 'Normalize attention output',
    concept: 'After all blocks are merged, divide the accumulated numerator by the softmax denominator.',
    objective: 'Inside flashFinalize, return state.output[i] / state.sum for each dimension.',
    difficulty: 'core',
    starterCode: \`function flashFinalize(state) {
  const normalized = [];
  for (let i = 0; i < state.output.length; i++) {
    // TODO: push state.output[i] / state.sum
    normalized.push(0);
  }
  return normalized;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('normalized output', flashFinalize({ max: 1, sum: 2, output: [4, 6] })[0], 2);
return results;\`,
    hints: ['normalized.push(state.output[i] / state.sum);'],
    solution: \`function flashFinalize(state) {
  const normalized = [];
  for (let i = 0; i < state.output.length; i++) {
    normalized.push(state.output[i] / state.sum);
  }
  return normalized;
}\`,
    explanation: 'Normalization turns weighted value sums into true attention expectations.',
  },
  {
    id: 'flash-zero-sum',
    stepLabel: '9.8',
    group: 'Online softmax block',
    title: 'Zero denominator guard',
    concept: 'If no probability mass accumulated, return zeros instead of dividing by zero.',
    objective: 'Return an array of zeros when state.sum is 0.',
    difficulty: 'challenge',
    starterCode: \`function flashFinalize(state) {
  // TODO: if state.sum === 0, return zeros matching output length
  const normalized = [];
  for (let i = 0; i < state.output.length; i++) {
    normalized.push(state.output[i] / state.sum);
  }
  return normalized;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('zero sum guard', flashFinalize({ max: 0, sum: 0, output: [1, 2] }), [0, 0]);
return results;\`,
    hints: ['if (state.sum === 0) return state.output.map(() => 0);'],
    solution: \`function flashFinalize(state) {
  if (state.sum === 0) return state.output.map(() => 0);
  const normalized = [];
  for (let i = 0; i < state.output.length; i++) {
    normalized.push(state.output[i] / state.sum);
  }
  return normalized;
}\`,
    explanation: 'Numerical guards keep attention kernels stable on masked rows.',
  },
`;

const LORA_FULL = `  {
    id: 'lora-down-project',
    stepLabel: '16.1',
    group: 'LoRA forward step',
    title: 'Down-project to rank',
    concept: 'LoRA first projects the input into a low-rank space with matrix A.',
    objective: 'Inside loraForward, compute one rank coordinate h[r] = sum_i A[r][i] * x[i].',
    difficulty: 'warmup',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = [];
  for (let r = 0; r < A.length; r++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      // TODO: add A[r][i] * x[i] to sum
    }
    h.push(sum);
  }
  const delta = [];
  for (let o = 0; o < B.length; o++) {
    let sum = 0;
    for (let r = 0; r < h.length; r++) sum += B[o][r] * h[r];
    delta.push(sum);
  }
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = loraForward([2, 3], [[1, 0], [0, 1]], [[2, 0], [0, 1]], [0, 0], 4, 2);
check('rank 0 projection', out[0], 8);
return results;\`,
    hints: ['sum += A[r][i] * x[i];'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = [];
  for (let r = 0; r < A.length; r++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
      sum += A[r][i] * x[i];
    }
    h.push(sum);
  }
  const delta = [];
  for (let o = 0; o < B.length; o++) {
    let sum = 0;
    for (let r = 0; r < h.length; r++) sum += B[o][r] * h[r];
    delta.push(sum);
  }
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'The A matrix compresses activations into rank-limited coordinates.',
  },
  {
    id: 'lora-rank-vector',
    stepLabel: '16.2',
    group: 'LoRA forward step',
    title: 'Build rank vector h',
    concept: 'All rank coordinates together form the bottleneck activation h = A @ x.',
    objective: 'Push each computed sum into h for every row of A.',
    difficulty: 'warmup',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = [];
  for (let r = 0; r < A.length; r++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) sum += A[r][i] * x[i];
    // TODO: push sum into h
  }
  const delta = [];
  for (let o = 0; o < B.length; o++) {
    let sum = 0;
    for (let r = 0; r < h.length; r++) sum += B[o][r] * h[r];
    delta.push(sum);
  }
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = loraForward([1, 2], [[1, 1]], [[2]], [0], 2, 1);
check('rank vector applied', out[0], 6);
return results;\`,
    hints: ['h.push(sum);'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = [];
  for (let r = 0; r < A.length; r++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) sum += A[r][i] * x[i];
    h.push(sum);
  }
  const delta = [];
  for (let o = 0; o < B.length; o++) {
    let sum = 0;
    for (let r = 0; r < h.length; r++) sum += B[o][r] * h[r];
    delta.push(sum);
  }
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'Rank-space activations are the shared bottleneck for all adapter outputs.',
  },
  {
    id: 'lora-up-project',
    stepLabel: '16.3',
    group: 'LoRA forward step',
    title: 'Up-project to output delta',
    concept: 'Matrix B maps the rank vector back to the model output dimension: delta = B @ h.',
    objective: 'Accumulate B[o][r] * h[r] into each delta coordinate.',
    difficulty: 'core',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = [];
  for (let r = 0; r < A.length; r++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) sum += A[r][i] * x[i];
    h.push(sum);
  }
  const delta = [];
  for (let o = 0; o < B.length; o++) {
    let sum = 0;
    for (let r = 0; r < h.length; r++) {
      // TODO: sum += B[o][r] * h[r]
    }
    delta.push(sum);
  }
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = loraForward([1], [[2]], [[1]], [1], 3, 1);
check('up projection', out[0], 7);
return results;\`,
    hints: ['sum += B[o][r] * h[r];'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = [];
  for (let r = 0; r < A.length; r++) {
    let sum = 0;
    for (let i = 0; i < x.length; i++) sum += A[r][i] * x[i];
    h.push(sum);
  }
  const delta = [];
  for (let o = 0; o < B.length; o++) {
    let sum = 0;
    for (let r = 0; r < h.length; r++) sum += B[o][r] * h[r];
    delta.push(sum);
  }
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'B reconstructs a full-width update from the low-rank bottleneck.',
  },
  {
    id: 'lora-scaling-factor',
    stepLabel: '16.4',
    group: 'LoRA forward step',
    title: 'LoRA scaling factor',
    concept: 'Adapter updates are scaled by alpha / rank to keep magnitude stable across ranks.',
    objective: 'Compute scale = alpha / rank.',
    difficulty: 'warmup',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  // TODO: scale = alpha / rank
  const scale = 0;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = loraForward([1], [[1]], [[2]], [0], 8, 2);
check('scaled adapter', out[0], 8);
return results;\`,
    hints: ['const scale = alpha / rank;'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'Alpha scaling decouples rank from update magnitude.',
  },
  {
    id: 'lora-forward-add',
    stepLabel: '16.5',
    group: 'LoRA forward step',
    title: 'Fuse base and adapter outputs',
    concept: 'The served output is y = y_base + (alpha/rank) * B @ A @ x.',
    objective: 'Return yBase[i] + scale * delta[i] for every coordinate.',
    difficulty: 'core',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  const scale = alpha / rank;
  // TODO: return fused output array
  return yBase;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
const out = loraForward([1, 0], [[1, 0], [0, 1]], [[1, 2], [3, 4]], [1, 1], 4, 2);
check('fused output', out, [3, 3]);
return results;\`,
    hints: ['return yBase.map((v, i) => v + scale * delta[i]);'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'Serving adds adapter deltas on top of frozen backbone outputs.',
  },
  {
    id: 'lora-zero-rank',
    stepLabel: '16.6',
    group: 'LoRA forward step',
    title: 'Zero-rank passthrough',
    concept: 'Rank zero disables the adapter branch entirely.',
    objective: 'Return yBase unchanged when rank === 0.',
    difficulty: 'core',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  // TODO: if rank === 0, return yBase
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('zero rank', loraForward([1], [[1]], [[1]], [5, 6], 8, 0), [5, 6]);
return results;\`,
    hints: ['if (rank === 0) return yBase;'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  if (rank === 0) return yBase;
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'Disabling adapters should never break the base forward path.',
  },
  {
    id: 'lora-shape-guard',
    stepLabel: '16.7',
    group: 'LoRA forward step',
    title: 'Output dimension guard',
    concept: 'Adapter output must match the base output length before fusion.',
    objective: 'Return yBase unchanged when delta length differs from yBase length.',
    difficulty: 'challenge',
    starterCode: \`function loraForward(x, A, B, yBase, alpha, rank) {
  if (rank === 0) return yBase;
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  // TODO: if delta.length !== yBase.length, return yBase
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('shape mismatch', loraForward([1], [[1]], [[1, 2]], [3, 4], 2, 1), [3, 4]);
return results;\`,
    hints: ['if (delta.length !== yBase.length) return yBase;'],
    solution: \`function loraForward(x, A, B, yBase, alpha, rank) {
  if (rank === 0) return yBase;
  const h = A.map((row) => row.reduce((s, w, i) => s + w * x[i], 0));
  const delta = B.map((row) => row.reduce((s, w, r) => s + w * h[r], 0));
  if (delta.length !== yBase.length) return yBase;
  const scale = alpha / rank;
  return yBase.map((v, i) => v + scale * delta[i]);
}\`,
    explanation: 'Shape guards prevent silent adapter wiring bugs in fine-tuning pipelines.',
  },
`;

const BPE_EXTRA = `  {
    id: 'bpe-merge-all-words',
    stepLabel: '79.5',
    group: 'BPE train step',
    title: 'Merge across full corpus',
    concept: 'One BPE iteration applies the winning merge to every word in the training corpus.',
    objective: 'Push each merged word into mergedCorpus after processing all words.',
    difficulty: 'core',
    starterCode: \`function bpeTrainStep(tokensList) {
  if (tokensList.length === 0) return { corpus: [], mergedPair: null };
  const freqs = {};
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    for (let i = 0; i < word.length - 1; i++) {
      const pair = word[i] + ',' + word[i + 1];
      freqs[pair] = (freqs[pair] || 0) + 1;
    }
  }
  let bestPair = null;
  let bestCount = 0;
  for (const pair in freqs) {
    if (freqs[pair] > bestCount) {
      bestCount = freqs[pair];
      bestPair = pair.split(',');
    }
  }
  const mergedCorpus = [];
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    const merged = [];
    let i = 0;
    while (i < word.length) {
      if (bestPair && i < word.length - 1 && word[i] === bestPair[0] && word[i + 1] === bestPair[1]) {
        merged.push(bestPair[0] + bestPair[1]);
        i += 2;
      } else {
        merged.push(word[i]);
        i += 1;
      }
    }
    // TODO: mergedCorpus.push(merged)
  }
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const out = bpeTrainStep([['l', 'o', 'w'], ['l', 'o', 'w', 'e', 'r']]);
check('corpus merged', out.corpus, [['lo', 'w'], ['lo', 'w', 'e', 'r']]);
return results;\`,
    hints: ['mergedCorpus.push(merged);'],
    solution: \`function bpeTrainStep(tokensList) {
  if (tokensList.length === 0) return { corpus: [], mergedPair: null };
  const freqs = {};
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    for (let i = 0; i < word.length - 1; i++) {
      const pair = word[i] + ',' + word[i + 1];
      freqs[pair] = (freqs[pair] || 0) + 1;
    }
  }
  let bestPair = null;
  let bestCount = 0;
  for (const pair in freqs) {
    if (freqs[pair] > bestCount) {
      bestCount = freqs[pair];
      bestPair = pair.split(',');
    }
  }
  const mergedCorpus = [];
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    const merged = [];
    let i = 0;
    while (i < word.length) {
      if (bestPair && i < word.length - 1 && word[i] === bestPair[0] && word[i + 1] === bestPair[1]) {
        merged.push(bestPair[0] + bestPair[1]);
        i += 2;
      } else {
        merged.push(word[i]);
        i += 1;
      }
    }
    mergedCorpus.push(merged);
  }
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    explanation: 'Corpus-wide merges are what shrink average sequence length over training.',
  },
  {
    id: 'bpe-no-pairs',
    stepLabel: '79.6',
    group: 'BPE train step',
    title: 'Single-token words',
    concept: 'When every word is one token long, there are no adjacent pairs left to merge.',
    objective: 'Return mergedPair null when no pair frequencies exist.',
    difficulty: 'challenge',
    starterCode: \`function bpeTrainStep(tokensList) {
  if (tokensList.length === 0) return { corpus: [], mergedPair: null };
  const freqs = {};
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    for (let i = 0; i < word.length - 1; i++) {
      const pair = word[i] + ',' + word[i + 1];
      freqs[pair] = (freqs[pair] || 0) + 1;
    }
  }
  // TODO: if no pairs were found, return { corpus: tokensList.slice(), mergedPair: null }
  let bestPair = null;
  let bestCount = 0;
  for (const pair in freqs) {
    if (freqs[pair] > bestCount) {
      bestCount = freqs[pair];
      bestPair = pair.split(',');
    }
  }
  const mergedCorpus = tokensList.map((word) => word.slice());
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('no adjacent pairs', bpeTrainStep([['a'], ['b']]), { corpus: [['a'], ['b']], mergedPair: null });
return results;\`,
    hints: ['if (Object.keys(freqs).length === 0) return { corpus: tokensList.map((w) => w.slice()), mergedPair: null };'],
    solution: \`function bpeTrainStep(tokensList) {
  if (tokensList.length === 0) return { corpus: [], mergedPair: null };
  const freqs = {};
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    for (let i = 0; i < word.length - 1; i++) {
      const pair = word[i] + ',' + word[i + 1];
      freqs[pair] = (freqs[pair] || 0) + 1;
    }
  }
  if (Object.keys(freqs).length === 0) {
    return { corpus: tokensList.map((word) => word.slice()), mergedPair: null };
  }
  let bestPair = null;
  let bestCount = 0;
  for (const pair in freqs) {
    if (freqs[pair] > bestCount) {
      bestCount = freqs[pair];
      bestPair = pair.split(',');
    }
  }
  const mergedCorpus = [];
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    const merged = [];
    let i = 0;
    while (i < word.length) {
      if (bestPair && i < word.length - 1 && word[i] === bestPair[0] && word[i + 1] === bestPair[1]) {
        merged.push(bestPair[0] + bestPair[1]);
        i += 2;
      } else {
        merged.push(word[i]);
        i += 1;
      }
    }
    mergedCorpus.push(merged);
  }
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    explanation: 'Training loops stop naturally when merges are no longer possible.',
  },
`;

insertBefore(
  'src/labs/transformers/transformerCodeLabs.js',
  '    // --- spec-sparse-attention ---',
  FLASH_EXTRA,
);

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'lora-scaling-factor',",
  '  // --- native-sparse-attention ---',
  LORA_FULL,
);

insertBefore(
  'src/labs/diffusion/diffusionCodeLabs.js',
  '  // --- clip-encoder ---',
  BPE_EXTRA,
);

console.log('Complexity expansion patches applied.');
