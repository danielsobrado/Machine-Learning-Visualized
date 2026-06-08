export const ALGORITHMS_CODE_LABS = [
  // --- bloom-filter ---
  {
    id: 'bloom-hash-sum',
    stepLabel: '70.1',
    group: 'Bloom filter step',
    title: 'Seeded hash accumulation',
    concept: 'Bloom filters build multiple bit indices by hashing the item with different seeds.',
    objective: 'Compute the hash sum for one seed.',
    difficulty: 'warmup',
    starterCode: `function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    // TODO: accumulate char code contribution
    hash += 0;
  }
  return hash % size;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('apple seed31', bloomHash('apple', 31, 100), 30);
check('banana seed17', bloomHash('banana', 17, 100), 53);
return results;`,
    hints: ['hash += item.charCodeAt(i) * seed;'],
    solution: `function bloomHash(item, seed, size) {
  let hash = 0;
  for (let i = 0; i < item.length; i++) {
    hash += item.charCodeAt(i) * seed;
  }
  return hash % size;
}`,
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
    starterCode: `function bloomHash(item, seed, size) {
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
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
const bits = Array(10).fill(0);
check('insert sets bits', bloomFilterOp(bits, 'abc', [5, 9], 'insert'), [1, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
return results;`,
    hints: ['bitArray[idx] = 1;'],
    solution: `function bloomHash(item, seed, size) {
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
}`,
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
    starterCode: `function bloomHash(item, seed, size) {
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
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const bits = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
check('query hit', bloomFilterOp(bits, 'abc', [5, 9], 'query'), true);
check('query miss', bloomFilterOp(bits, 'xyz', [5, 9], 'query'), false);
return results;`,
    hints: ['if (bitArray[idx] === 0) return false;'],
    solution: `function bloomHash(item, seed, size) {
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
}`,
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
    starterCode: `function bloomHash(item, seed, size) {
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
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('empty query false', bloomFilterOp([0, 0], '', [3], 'query'), false);
check('empty insert unchanged', bloomFilterOp([0, 0], '', [3], 'insert'), [0, 0]);
return results;`,
    hints: ["if (item.length === 0) return mode === 'insert' ? bitArray : false;"],
    solution: `function bloomHash(item, seed, size) {
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
}`,
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
    starterCode: `function bloomHash(item, seed, size) {
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
}`,
    testCode: `const results = [];
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  const passed = typeof expected === 'object' ? same(actual, expected) : Object.is(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const bits = Array(10).fill(0);
bloomFilterOp(bits, 'abc', [5, 9], 'insert');
check('query after insert', bloomFilterOp(bits, 'abc', [5, 9], 'query'), true);
check('unknown mode', bloomFilterOp(bits, 'abc', [5, 9], 'noop'), null);
return results;`,
    hints: ['if (mode !== \'insert\' && mode !== \'query\') return null;'],
    solution: `function bloomHash(item, seed, size) {
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
}`,
    explanation: 'Dispatch keeps insert and query consistent around one hashing implementation.',
  },

  // --- pagerank ---
  {
    id: 'pagerank-share',
    stepLabel: '71.1',
    group: 'PageRank iteration',
    title: 'Out-link share',
    concept: 'Each page distributes rank equally across outgoing links.',
    objective: 'Compute share = rank / outDegree for non-dangling pages.',
    difficulty: 'warmup',
    starterCode: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) continue;
    // TODO: share and distribute
  }
  return next;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = pagerankStep([0.6, 0.4], [[1], [0,1]], 0.85);
check('share effect', out[1] > out[0], true);
return results;`,
    hints: ['const share = ranks[j] / out.length;'],
    solution: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) continue;
    const share = ranks[j] / out.length;
    for (let i = 0; i < out.length; i++) next[out[i]] += share;
  }
  return next;
}`,
    explanation: 'Rank mass conservation is the base PageRank mechanism.',
  },
  {
    id: 'pagerank-dangling',
    stepLabel: '71.2',
    group: 'PageRank iteration',
    title: 'Dangling node redistribution',
    concept: 'Pages with no links spread mass uniformly to all pages.',
    objective: 'Handle out.length===0 by adding ranks[j]/n to all nodes.',
    difficulty: 'warmup',
    starterCode: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      // TODO: distribute dangling mass equally
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  return next;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = pagerankStep([1, 0], [[], [0]], 0.85);
check('dangling gives half', out[0], 0.5);
check('dangling gives half2', out[1], 0.5);
return results;`,
    hints: ['for (let i = 0; i < n; i++) next[i] += ranks[j] / n;'],
    solution: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  return next;
}`,
    explanation: 'Dangling handling prevents rank sink collapse.',
  },
  {
    id: 'pagerank-teleport',
    stepLabel: '71.3',
    group: 'PageRank iteration',
    title: 'Apply damping and teleport',
    concept: 'Damping blends random jump with link-following probability.',
    objective: 'Transform next[i] to d*next[i] + (1-d)/n.',
    difficulty: 'core',
    starterCode: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  // TODO: apply damping
  return next;
}`,
    testCode: `const results = [];
function same(a, b, tol = 1e-5) { return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: same(actual, expected) });
}
check('pagerank example', pagerankStep([0.5, 0.5], [[1], [0,1]], 0.85), [0.2875, 0.7125]);
return results;`,
    hints: ['for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;'],
    solution: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  return next;
}`,
    explanation: 'Teleportation guarantees ergodicity and convergence.',
  },
  {
    id: 'pagerank-normalize',
    stepLabel: '71.4',
    group: 'PageRank iteration',
    title: 'Normalize numeric drift',
    concept: 'Finite precision can make rank sum deviate from 1.',
    objective: 'Normalize next by total sum.',
    difficulty: 'core',
    starterCode: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  // TODO: normalize next
  return next;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-9) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = pagerankStep([0.5, 0.5], [[1], [0,1]], 0.85);
check('sum one', out[0] + out[1], 1);
return results;`,
    hints: ['const total = next.reduce((s, v) => s + v, 0); if (total > 0) divide each'],
    solution: `function pagerankStep(ranks, adjList, d) {
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  const total = next.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < n; i++) next[i] /= total;
  return next;
}`,
    explanation: 'Normalization maintains probabilistic interpretation each iteration.',
  },
  {
    id: 'pagerank-iteration-step',
    stepLabel: '71.5',
    group: 'PageRank iteration',
    title: 'Complete PageRank iteration',
    concept: 'Final step combines distribution, damping, and normalization robustly.',
    objective: 'Return null when d is outside [0,1].',
    difficulty: 'core',
    starterCode: `function pagerankStep(ranks, adjList, d) {
  // TODO: validate damping range
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  const total = next.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < n; i++) next[i] /= total;
  return next;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
check('invalid d', pagerankStep([0.5, 0.5], [[1], [0,1]], 1.2), null);
return results;`,
    hints: ['if (d < 0 || d > 1) return null;'],
    solution: `function pagerankStep(ranks, adjList, d) {
  if (d < 0 || d > 1) return null;
  const n = ranks.length;
  const next = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const out = adjList[j];
    if (out.length === 0) {
      for (let i = 0; i < n; i++) next[i] += ranks[j] / n;
    } else {
      const share = ranks[j] / out.length;
      for (let i = 0; i < out.length; i++) next[out[i]] += share;
    }
  }
  const teleport = (1 - d) / n;
  for (let i = 0; i < n; i++) next[i] = d * next[i] + teleport;
  const total = next.reduce((s, v) => s + v, 0);
  if (total > 0) for (let i = 0; i < n; i++) next[i] /= total;
  return next;
}`,
    explanation: 'Validation plus complete update gives a production-safe iteration primitive.',
  },
];
