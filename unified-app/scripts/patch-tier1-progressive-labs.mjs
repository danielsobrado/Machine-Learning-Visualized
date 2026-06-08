/**
 * Expands Tier 1 two-step labs to 4-step progressive single-function skeletons.
 * Run: node unified-app/scripts/patch-tier1-progressive-labs.mjs
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
    ["  'rope': { source: 'transformer', groups: ['Rotate 2D block', 'Apply to head dimension'] },",
      "  'rope': { source: 'transformer', groups: ['RoPE pair rotation'] },"],
    ["  'transformer-architecture-families': { source: 'transformer', groups: ['FFN expansion ratio', 'Parameter estimate'] },",
      "  'transformer-architecture-families': { source: 'transformer', groups: ['Block parameter estimate'] },"],
    ["  'coconut-latent-reasoning': { source: 'transformer', groups: ['Latent residual add', 'Gate blend'] },",
      "  'coconut-latent-reasoning': { source: 'transformer', groups: ['Latent thought step'] },"],
    ["  'grouped-query-attention': { source: 'transformer', groups: ['KV head index', 'Repeat/broadcast rule'] },",
      "  'grouped-query-attention': { source: 'transformer', groups: ['KV head expansion'] },"],
    ["  'flash-attention': { source: 'transformer', groups: ['Row max update', 'Running sum'] },",
      "  'flash-attention': { source: 'transformer', groups: ['Online softmax block'] },"],
    ["  'fine-tuning': { source: 'transformer', groups: ['Alpha scaling', 'Effective delta add'] },",
      "  'fine-tuning': { source: 'transformer', groups: ['LoRA forward step'] },"],
    ["  'eagle-3-1-speculative-decoding': { source: 'lm', groups: ['Self-trust threshold', 'Token salvage'] },",
      "  'eagle-3-1-speculative-decoding': { source: 'lm', groups: ['EAGLE verify step'] },"],
    ["  'tokenizer-bpe': { source: 'diffusion', groups: ['pair count', 'merge rule'] },",
      "  'tokenizer-bpe': { source: 'diffusion', groups: ['BPE train step'] },"],
    ["  'knn-naive-bayes-svm': { source: 'core', groups: ['kNN vote', 'SVM hinge'] },",
      "  'knn-naive-bayes-svm': { source: 'core', groups: ['kNN predict'] },"],
    ["  'grpo-reasoning': { source: 'rl', groups: ['Group mean', 'Relative reward'] },",
      "  'grpo-reasoning': { source: 'rl', groups: ['Relative advantage'] },"],
  ];
  for (const [from, to] of replacements) {
    if (!src.includes(from)) throw new Error(`Mapping not found: ${from}`);
    src = src.replace(from, to);
  }
  fs.writeFileSync(filePath, src);
  console.log('Patched lessonCodeLabMappings.js');
}

const ROPE = `  {
    id: 'rope-pair-first',
    stepLabel: '4.1',
    group: 'RoPE pair rotation',
    title: 'First rotated coordinate',
    concept: 'RoPE rotates query/key vectors in 2D pairs. The first output coordinate is x0 * cos - x1 * sin.',
    objective: 'Inside applyRoPE, compute the first rotated coordinate for each 2D pair.',
    difficulty: 'warmup',
    starterCode: \`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    // TODO: first rotated coord = x0 * c - x1 * s
    const r0 = 0;
    rotated.push(r0, x1);
  }
  return rotated;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('first coord only', applyRoPE([1, 0], [0], [1]), [0, 0]);
return results;\`,
    hints: ['r0 = x0 * c - x1 * s;'],
    solution: \`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    const r0 = x0 * c - x1 * s;
    rotated.push(r0, x1);
  }
  return rotated;
}\`,
    explanation: 'Each frequency channel gets its own rotation angle through cos/sin tables.',
  },
  {
    id: 'rope-pair-second',
    stepLabel: '4.2',
    group: 'RoPE pair rotation',
    title: 'Second rotated coordinate',
    concept: 'The paired second coordinate completes the 2D rotation: x0 * sin + x1 * cos.',
    objective: 'Push both rotated coordinates for each pair.',
    difficulty: 'warmup',
    starterCode: \`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    const r0 = x0 * c - x1 * s;
    // TODO: second rotated coord = x0 * s + x1 * c
    const r1 = 0;
    rotated.push(r0, r1);
  }
  return rotated;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('full pair rotate', applyRoPE([1, 0], [0], [1]), [0, 1]);
return results;\`,
    hints: ['r1 = x0 * s + x1 * c;'],
    solution: \`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    const r0 = x0 * c - x1 * s;
    const r1 = x0 * s + x1 * c;
    rotated.push(r0, r1);
  }
  return rotated;
}\`,
    explanation: 'Completing both coordinates applies a proper 2D rotation to each head subspace.',
  },
  {
    id: 'rope-head-freq',
    stepLabel: '4.3',
    group: 'RoPE pair rotation',
    title: 'Frequency channel indexing',
    concept: 'Longer head vectors contain multiple 2D pairs. Pair i uses cos[i/2] and sin[i/2].',
    objective: 'Rotate a 4D vector using separate frequencies per pair.',
    difficulty: 'core',
    starterCode: \`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    // TODO: push both rotated coordinates
    rotated.push(0, 0);
  }
  return rotated;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('two pairs', applyRoPE([1, 0, 0, 1], [0, 1], [1, 0]), [0, 1, 0, 1]);
return results;\`,
    hints: ['rotated.push(x0 * c - x1 * s, x0 * s + x1 * c);'],
    solution: \`function applyRoPE(x, cos, sin) {
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    rotated.push(x0 * c - x1 * s, x0 * s + x1 * c);
  }
  return rotated;
}\`,
    explanation: 'Different frequencies encode position at multiple scales across head dimensions.',
  },
  {
    id: 'rope-apply-head',
    stepLabel: '4.4',
    group: 'RoPE pair rotation',
    title: 'Apply RoPE to head',
    concept: 'RoPE encodes absolute positions as relative rotations between query and key vectors at inference time.',
    objective: 'Return an empty array when the input vector is empty.',
    difficulty: 'core',
    starterCode: \`function applyRoPE(x, cos, sin) {
  // TODO: return [] when x.length === 0
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    rotated.push(x0 * c - x1 * s, x0 * s + x1 * c);
  }
  return rotated;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('empty input', applyRoPE([], [], []), []);
check('apply rope 4D', applyRoPE([1, 0, 0, 1], [0, 1], [1, 0]), [0, 1, 0, 1]);
return results;\`,
    hints: ['if (x.length === 0) return [];'],
    solution: \`function applyRoPE(x, cos, sin) {
  if (x.length === 0) return [];
  const rotated = [];
  for (let i = 0; i < x.length; i += 2) {
    const x0 = x[i];
    const x1 = x[i + 1];
    const c = cos[i / 2];
    const s = sin[i / 2];
    rotated.push(x0 * c - x1 * s, x0 * s + x1 * c);
  }
  return rotated;
}\`,
    explanation: 'RoPE applies position-dependent rotations without adding explicit positional embeddings.',
  },
  `;

const TRANSFORMER_BLOCK = `  {
    id: 'transformer-ffn-dim',
    stepLabel: '5.1',
    group: 'Block parameter estimate',
    title: 'FFN intermediate dimension',
    concept: 'Transformer blocks scale FFN width differently. SwiGLU uses about 2/3 of the standard MLP expansion to keep parameter counts comparable.',
    objective: 'Inside estimateTransformerBlock, compute dFFN from dModel and expansionRatio.',
    difficulty: 'warmup',
    starterCode: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  // TODO: compute dFFN (SwiGLU: round(dModel * expansionRatio * 2/3), else dModel * expansionRatio)
  const dFFN = 0;
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('standard ffn block', estimateTransformerBlock(4096, 4, false), 201326592);
return results;\`,
    hints: ['dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;'],
    solution: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}\`,
    explanation: 'FFN width dominates parameter count alongside attention projections.',
  },
  {
    id: 'transformer-block-attn',
    stepLabel: '5.2',
    group: 'Block parameter estimate',
    title: 'Attention parameter count',
    concept: 'A standard self-attention block has four d_model x d_model projections: Q, K, V, and output.',
    objective: 'Compute attnParams = 4 * dModel * dModel.',
    difficulty: 'warmup',
    starterCode: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  // TODO: attention params = 4 * dModel * dModel
  const attnParams = 0;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('attn only for tiny block', estimateTransformerBlock(128, 4, false) - 2 * 128 * 512, 65536);
return results;\`,
    hints: ['attnParams = 4 * dModel * dModel;'],
    solution: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}\`,
    explanation: 'Attention projections are symmetric in parameter count across Q/K/V/Out.',
  },
  {
    id: 'transformer-block-ffn',
    stepLabel: '5.3',
    group: 'Block parameter estimate',
    title: 'FFN parameter count',
    concept: 'A two-layer MLP FFN has an up-projection and a down-projection, giving 2 * dModel * dFFN weights.',
    objective: 'Compute ffnParams = 2 * dModel * dFFN.',
    difficulty: 'core',
    starterCode: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  const attnParams = 4 * dModel * dModel;
  // TODO: ffnParams = 2 * dModel * dFFN
  const ffnParams = 0;
  return attnParams + ffnParams;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('llama block', estimateTransformerBlock(4096, 4, true), 157286400);
return results;\`,
    hints: ['ffnParams = 2 * dModel * dFFN;'],
    solution: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}\`,
    explanation: 'FFN matrices often contribute more than half of a transformer block’s weights.',
  },
  {
    id: 'transformer-block-params',
    stepLabel: '5.4',
    group: 'Block parameter estimate',
    title: 'Total block parameters',
    concept: 'Architecture families differ mainly in FFN expansion rules and activation choices, but parameter budgeting starts from attn + FFN totals.',
    objective: 'Return attnParams + ffnParams.',
    difficulty: 'core',
    starterCode: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  // TODO: return total parameter count
  return 0;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('standard block', estimateTransformerBlock(4096, 4, false), 201326592);
check('swiglu block', estimateTransformerBlock(4096, 4, true), 157286400);
return results;\`,
    hints: ['return attnParams + ffnParams;'],
    solution: \`function estimateTransformerBlock(dModel, expansionRatio, isSwiGLU) {
  const dFFN = isSwiGLU ? Math.round(dModel * expansionRatio * 2 / 3) : dModel * expansionRatio;
  const attnParams = 4 * dModel * dModel;
  const ffnParams = 2 * dModel * dFFN;
  return attnParams + ffnParams;
}\`,
    explanation: 'Comparing families at equal d_model requires consistent FFN expansion accounting.',
  },
  `;

const COCONUT = `  {
    id: 'coconut-latent-residual',
    stepLabel: '6.1',
    group: 'Latent thought step',
    title: 'Latent residual addition',
    concept: 'Coconut updates hidden states with continuous thought vectors before gating blends them in.',
    objective: 'Inside coconutLatentStep, add hidden[i] and thought[i] when gate is 1.',
    difficulty: 'warmup',
    starterCode: \`function coconutLatentStep(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: when gate is 1, push hidden[i] + thought[i]
    result.push(hidden[i]);
  }
  return result;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('full gate residual', coconutLatentStep([1, 2], [10, 20], 1), [11, 22]);
return results;\`,
    hints: ['if gate is 1, use hidden[i] + thought[i].'],
    solution: \`function coconutLatentStep(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push(hidden[i] + thought[i]);
  }
  return result;
}\`,
    explanation: 'Latent residuals inject reasoning updates without discarding prior context.',
  },
  {
    id: 'coconut-latent-gate-weight',
    stepLabel: '6.2',
    group: 'Latent thought step',
    title: 'Gate the thought contribution',
    concept: 'A scalar gate controls how much of the thought vector is injected into each step.',
    objective: 'Blend hidden[i] with gate * thought[i].',
    difficulty: 'warmup',
    starterCode: \`function coconutLatentStep(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: hidden[i] + gate * thought[i]
    result.push(hidden[i]);
  }
  return result;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('partial gate', coconutLatentStep([2, 4], [10, 20], 0.5), [7, 14]);
return results;\`,
    hints: ['result.push(hidden[i] + gate * thought[i]);'],
    solution: \`function coconutLatentStep(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push(hidden[i] + gate * thought[i]);
  }
  return result;
}\`,
    explanation: 'Partial gates let the model inject only a fraction of the proposed latent thought.',
  },
  {
    id: 'coconut-latent-gate',
    stepLabel: '6.3',
    group: 'Latent thought step',
    title: 'Gated latent blend',
    concept: 'The full Coconut update interpolates between the previous hidden state and the thought vector.',
    objective: 'Use (1 - gate) * hidden[i] + gate * thought[i].',
    difficulty: 'core',
    starterCode: \`function coconutLatentStep(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    // TODO: convex blend between hidden and thought
    result.push(0);
  }
  return result;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('gate 0.5', coconutLatentStep([2, 4], [10, 20], 0.5), [6, 12]);
return results;\`,
    hints: ['(1 - gate) * hidden[i] + gate * thought[i]'],
    solution: \`function coconutLatentStep(hidden, thought, gate) {
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push((1 - gate) * hidden[i] + gate * thought[i]);
  }
  return result;
}\`,
    explanation: 'Convex blending generalizes residual addition and pure thought replacement.',
  },
  {
    id: 'coconut-latent-pass',
    stepLabel: '6.4',
    group: 'Latent thought step',
    title: 'Pass-through when gate is zero',
    concept: 'When the gate is 0, Coconut should leave the hidden state unchanged.',
    objective: 'Return hidden unchanged when gate === 0.',
    difficulty: 'core',
    starterCode: \`function coconutLatentStep(hidden, thought, gate) {
  // TODO: if gate is 0, return hidden unchanged
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push((1 - gate) * hidden[i] + gate * thought[i]);
  }
  return result;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('gate zero pass', coconutLatentStep([1, 2, 3], [9, 9, 9], 0), [1, 2, 3]);
return results;\`,
    hints: ['if (gate === 0) return hidden;'],
    solution: \`function coconutLatentStep(hidden, thought, gate) {
  if (gate === 0) return hidden;
  const result = [];
  for (let i = 0; i < hidden.length; i++) {
    result.push((1 - gate) * hidden[i] + gate * thought[i]);
  }
  return result;
}\`,
    explanation: 'A zero gate skips latent reasoning when the model already has enough context.',
  },
  `;

const GQA = `  {
    id: 'gqa-group-size',
    stepLabel: '7.1',
    group: 'KV head expansion',
    title: 'GQA group size',
    concept: 'Grouped-Query Attention shares KV heads across multiple query heads. The group size is numQueryHeads / numKVHeads.',
    objective: 'Inside expandKV, compute groupSize.',
    difficulty: 'warmup',
    starterCode: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  // TODO: groupSize = numQueryHeads / numKVHeads
  const groupSize = 1;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const kv = [[1, 2], [3, 4]];
check('8 query to 2 kv', expandKV(kv, 8, 2), [kv[0], kv[0], kv[0], kv[0], kv[1], kv[1], kv[1], kv[1]]);
return results;\`,
    hints: ['const groupSize = numQueryHeads / numKVHeads;'],
    solution: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    explanation: 'Group size determines how many query heads reuse each KV head.',
  },
  {
    id: 'gqa-group-index',
    stepLabel: '7.2',
    group: 'KV head expansion',
    title: 'GQA KV head indexing',
    concept: 'Query head q maps to KV head floor(q / groupSize).',
    objective: 'Compute kvIdx for each query head.',
    difficulty: 'warmup',
    starterCode: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    // TODO: kvIdx = Math.floor(q / groupSize)
    const kvIdx = 0;
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const kv = [[1], [2]];
check('index mapping', expandKV(kv, 4, 2), [[1], [1], [2], [2]]);
return results;\`,
    hints: ['const kvIdx = Math.floor(q / groupSize);'],
    solution: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    explanation: 'Indexing maps many query heads onto fewer KV cache slots.',
  },
  {
    id: 'gqa-expand-kv',
    stepLabel: '7.3',
    group: 'KV head expansion',
    title: 'GQA KV expansion',
    concept: 'After indexing, each query head receives a copy of its assigned KV head vector.',
    objective: 'Push kvHeads[kvIdx] into expanded for every query head.',
    difficulty: 'core',
    starterCode: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    // TODO: push kvHeads[kvIdx]
  }
  return expanded;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
const kv = [[1, 2], [3, 4]];
check('GQA repeat 4 query heads', expandKV(kv, 4, 2), [[1, 2], [1, 2], [3, 4], [3, 4]]);
return results;\`,
    hints: ['expanded.push(kvHeads[kvIdx]);'],
    solution: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    explanation: 'Broadcasting KV heads aligns tensor shapes for standard attention kernels.',
  },
  {
    id: 'gqa-mqa-edge',
    stepLabel: '7.4',
    group: 'KV head expansion',
    title: 'Multi-query attention edge case',
    concept: 'When numKVHeads is 1, every query head shares the single KV head (MQA).',
    objective: 'Return an empty array when numQueryHeads is 0.',
    difficulty: 'core',
    starterCode: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  // TODO: return [] when numQueryHeads === 0
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('empty query heads', expandKV([[1]], 0, 1), []);
check('MQA single kv', expandKV([[9]], 3, 1), [[9], [9], [9]]);
return results;\`,
    hints: ['if (numQueryHeads === 0) return [];'],
    solution: \`function expandKV(kvHeads, numQueryHeads, numKVHeads) {
  if (numQueryHeads === 0) return [];
  const groupSize = numQueryHeads / numKVHeads;
  const expanded = [];
  for (let q = 0; q < numQueryHeads; q++) {
    const kvIdx = Math.floor(q / groupSize);
    expanded.push(kvHeads[kvIdx]);
  }
  return expanded;
}\`,
    explanation: 'MQA is the extreme GQA setting with one shared KV head for all queries.',
  },
  `;

const FLASH = `  {
    id: 'flash-max-update',
    stepLabel: '9.1',
    group: 'Online softmax block',
    title: 'Running row maximum',
    concept: 'FlashAttention tracks a running row max while streaming attention blocks.',
    objective: 'Inside flashAttentionStep, set newMax = Math.max(state.max, blockMax).',
    difficulty: 'warmup',
    starterCode: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  // TODO: newMax = Math.max(oldMax, blockMax)
  const newMax = oldMax;
  const scaleOld = Math.exp(oldMax - newMax);
  const scaleBlock = Math.exp(blockMax - newMax);
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  const newOutput = oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);
  return { max: newMax, sum: newSum, output: newOutput };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = flashAttentionStep({ max: 5, sum: 2, output: [1] }, 8, 1, [2]);
check('new max', out.max, 8);
return results;\`,
    hints: ['const newMax = Math.max(oldMax, blockMax);'],
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
    explanation: 'Tracking the running max stabilizes online softmax accumulation.',
  },
  {
    id: 'flash-sum-update',
    stepLabel: '9.2',
    group: 'Online softmax block',
    title: 'Rescaled denominator sum',
    concept: 'When the row max increases, prior block contributions must be down-weighted exponentially.',
    objective: 'Compute newSum = oldSum * exp(oldMax - newMax) + blockSum * exp(blockMax - newMax).',
    difficulty: 'warmup',
    starterCode: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  const scaleOld = Math.exp(oldMax - newMax);
  const scaleBlock = Math.exp(blockMax - newMax);
  // TODO: rescale and add blockSum into newSum
  const newSum = oldSum;
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
const out = flashAttentionStep({ max: 5, sum: 1, output: [0] }, 6, 1, [0]);
check('rescaled sum', out.sum, 1.367879);
return results;\`,
    hints: ['const newSum = oldSum * scaleOld + blockSum * scaleBlock;'],
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
    explanation: 'Rescaling keeps the softmax denominator consistent across blocks.',
  },
  {
    id: 'flash-output-update',
    stepLabel: '9.3',
    group: 'Online softmax block',
    title: 'Rescaled output accumulator',
    concept: 'FlashAttention also rescales the weighted value accumulator with the same exponential factors.',
    objective: 'Update each output dimension with scaled old and block contributions.',
    difficulty: 'core',
    starterCode: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  const scaleOld = Math.exp(oldMax - newMax);
  const scaleBlock = Math.exp(blockMax - newMax);
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  // TODO: newOutput[i] = oldOutput[i] * scaleOld + blockOutput[i] * scaleBlock
  const newOutput = oldOutput.map((v) => v);
  return { max: newMax, sum: newSum, output: newOutput };
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = flashAttentionStep({ max: 5, sum: 2, output: [1] }, 5, 3, [2]);
check('same max output merge', out.output[0], 7);
return results;\`,
    hints: ['return oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);'],
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
    explanation: 'Output rescaling is what makes block-wise attention mathematically equivalent to full attention.',
  },
  {
    id: 'flash-block-step',
    stepLabel: '9.4',
    group: 'Online softmax block',
    title: 'Complete FlashAttention block merge',
    concept: 'One FlashAttention step merges a new block into running max, sum, and output state.',
    objective: 'Return the merged state object with max, sum, and output.',
    difficulty: 'core',
    starterCode: \`function flashAttentionStep(state, blockMax, blockSum, blockOutput) {
  const oldMax = state.max;
  const oldSum = state.sum;
  const oldOutput = state.output;
  const newMax = Math.max(oldMax, blockMax);
  const scaleOld = Math.exp(oldMax - newMax);
  const scaleBlock = Math.exp(blockMax - newMax);
  const newSum = oldSum * scaleOld + blockSum * scaleBlock;
  const newOutput = oldOutput.map((v, i) => v * scaleOld + blockOutput[i] * scaleBlock);
  // TODO: return { max: newMax, sum: newSum, output: newOutput }
  return state;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = flashAttentionStep({ max: 1, sum: 1, output: [1] }, 2, 2, [3]);
check('merged max', out.max, 2);
check('merged sum', out.sum, 2.367879);
check('merged output', out.output[0], 3.367879);
return results;\`,
    hints: ['return { max: newMax, sum: newSum, output: newOutput };'],
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
    explanation: 'Chaining these steps block-by-block is the core of IO-efficient attention.',
  },
  `;

const LORA = `  {
    id: 'lora-scaling-factor',
    stepLabel: '16.1',
    group: 'LoRA forward step',
    title: 'LoRA scaling factor',
    concept: 'LoRA scales low-rank updates by alpha / rank so learning rate stays stable across ranks.',
    objective: 'Inside loraForward, compute scale = alpha / rank.',
    difficulty: 'warmup',
    starterCode: \`function loraForward(yBase, loraDelta, alpha, rank) {
  // TODO: scale = alpha / rank
  const scale = 0;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const out = loraForward([1], [1], 32, 8);
check('scaled delta applied', out[0], 5);
return results;\`,
    hints: ['const scale = alpha / rank;'],
    solution: \`function loraForward(yBase, loraDelta, alpha, rank) {
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}\`,
    explanation: 'Alpha scaling decouples rank choice from update magnitude.',
  },
  {
    id: 'lora-delta-term',
    stepLabel: '16.2',
    group: 'LoRA forward step',
    title: 'Scaled low-rank delta',
    concept: 'Each output coordinate adds the scaled low-rank correction to the frozen base output.',
    objective: 'Compute scale * loraDelta[i] for one coordinate.',
    difficulty: 'warmup',
    starterCode: \`function loraForward(yBase, loraDelta, alpha, rank) {
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    // TODO: add yBase[i] + scale * loraDelta[i]
    output.push(yBase[i]);
  }
  return output;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('apply lora delta', loraForward([2.0, 3.0], [0.5, -0.2], 32, 8), [6.0, 2.2]);
return results;\`,
    hints: ['output.push(yBase[i] + scale * loraDelta[i]);'],
    solution: \`function loraForward(yBase, loraDelta, alpha, rank) {
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}\`,
    explanation: 'LoRA trains only the low-rank adapters while base weights stay frozen.',
  },
  {
    id: 'lora-forward-add',
    stepLabel: '16.3',
    group: 'LoRA forward step',
    title: 'LoRA output update',
    concept: 'The full forward pass adds the adapter delta vector to the base model output.',
    objective: 'Return the output array after applying the adapter to every coordinate.',
    difficulty: 'core',
    starterCode: \`function loraForward(yBase, loraDelta, alpha, rank) {
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  // TODO: return output
  return yBase;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('vector output', loraForward([1, 0], [1, 2], 8, 4), [3, 4]);
return results;\`,
    hints: ['return output;'],
    solution: \`function loraForward(yBase, loraDelta, alpha, rank) {
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}\`,
    explanation: 'Adapter outputs are added on top of the frozen backbone at inference time.',
  },
  {
    id: 'lora-zero-rank',
    stepLabel: '16.4',
    group: 'LoRA forward step',
    title: 'Zero-rank passthrough',
    concept: 'If rank is 0, no low-rank adapter is active and the base output should pass through unchanged.',
    objective: 'Return yBase unchanged when rank === 0.',
    difficulty: 'core',
    starterCode: \`function loraForward(yBase, loraDelta, alpha, rank) {
  // TODO: if rank === 0, return yBase unchanged
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('zero rank passthrough', loraForward([1, 2], [9, 9], 16, 0), [1, 2]);
return results;\`,
    hints: ['if (rank === 0) return yBase;'],
    solution: \`function loraForward(yBase, loraDelta, alpha, rank) {
  if (rank === 0) return yBase;
  const scale = alpha / rank;
  const output = [];
  for (let i = 0; i < yBase.length; i++) {
    output.push(yBase[i] + scale * loraDelta[i]);
  }
  return output;
}\`,
    explanation: 'Guarding zero rank avoids divide-by-zero in production serving paths.',
  },
  `;

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'rope-rotate-2d',",
  "  {\n    id: 'transformer-ffn-dim',",
  ROPE,
);

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'transformer-ffn-dim',",
  "  {\n    id: 'coconut-latent-residual',",
  TRANSFORMER_BLOCK,
);

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'coconut-latent-residual',",
  "  {\n    id: 'gqa-group-index',",
  COCONUT,
);

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'gqa-group-index',",
  "  {\n    id: 'kv-cache-append-step',",
  GQA,
);

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'flash-max-update',",
  "  // --- spec-sparse-attention ---",
  FLASH,
);

replaceBetween(
  'src/labs/transformers/transformerCodeLabs.js',
  "  {\n    id: 'lora-scaling-factor',",
  "  // --- native-sparse-attention ---",
  LORA,
);

const EAGLE = `  // --- WAVE 3: EAGLE 3.1 SPECULATIVE DECODING ---
  {
    id: 'eagle-self-trust-check',
    stepLabel: '17.1',
    group: 'EAGLE verify step',
    title: 'EAGLE self-trust check',
    concept: 'EAGLE extends draft trees while the draft model trusts its own confidence scores.',
    objective: 'Inside eagleVerifyStep, return true when confidence >= threshold.',
    difficulty: 'warmup',
    starterCode: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    // TODO: if confidences[i] >= threshold, push draftTokens[i]; else break
  }
  return accepted;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('trusted prefix', eagleVerifyStep(['a', 'b'], [0.9, 0.85], 0.8), ['a', 'b']);
return results;\`,
    hints: ['if (confidences[i] >= threshold) accepted.push(draftTokens[i]); else break;'],
    solution: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      accepted.push(draftTokens[i]);
    } else {
      break;
    }
  }
  return accepted;
}\`,
    explanation: 'High-confidence draft tokens can be accepted without target-model verification.',
  },
  {
    id: 'eagle-prefix-break',
    stepLabel: '17.2',
    group: 'EAGLE verify step',
    title: 'Stop at first rejection',
    concept: 'Verification halts at the first low-confidence token, keeping only the trusted prefix.',
    objective: 'Break the loop when confidence falls below threshold.',
    difficulty: 'warmup',
    starterCode: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      accepted.push(draftTokens[i]);
    } else {
      // TODO: stop processing further draft tokens
    }
  }
  return accepted;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('prefix stops early', eagleVerifyStep(['a', 'b', 'c'], [0.9, 0.7, 0.95], 0.8), ['a']);
return results;\`,
    hints: ['else { break; }'],
    solution: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      accepted.push(draftTokens[i]);
    } else {
      break;
    }
  }
  return accepted;
}\`,
    explanation: 'Prefix salvage prevents rejected tail tokens from invalidating accepted drafts.',
  },
  {
    id: 'eagle-token-salvage',
    stepLabel: '17.3',
    group: 'EAGLE verify step',
    title: 'Salvage accepted draft tokens',
    concept: 'Accepted tokens form the next sequence prefix for continued speculative decoding.',
    objective: 'Push draftTokens[i] when confidence passes the threshold.',
    difficulty: 'core',
    starterCode: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      // TODO: push draftTokens[i]
    } else {
      break;
    }
  }
  return accepted;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('salvage mixed', eagleVerifyStep(['a', 'b', 'c'], [0.9, 0.85, 0.7], 0.8), ['a', 'b']);
return results;\`,
    hints: ['accepted.push(draftTokens[i]);'],
    solution: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      accepted.push(draftTokens[i]);
    } else {
      break;
    }
  }
  return accepted;
}\`,
    explanation: 'Salvaging keeps useful draft work instead of discarding entire batches.',
  },
  {
    id: 'eagle-empty-draft',
    stepLabel: '17.4',
    group: 'EAGLE verify step',
    title: 'Empty draft edge case',
    concept: 'Speculative steps must handle empty draft batches without errors.',
    objective: 'Return [] when draftTokens is empty.',
    difficulty: 'core',
    starterCode: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  // TODO: return [] when draftTokens.length === 0
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      accepted.push(draftTokens[i]);
    } else {
      break;
    }
  }
  return accepted;
}\`,
    testCode: \`const results = [];
function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('empty draft', eagleVerifyStep([], [], 0.8), []);
return results;\`,
    hints: ['if (draftTokens.length === 0) return [];'],
    solution: \`function eagleVerifyStep(draftTokens, confidences, threshold) {
  if (draftTokens.length === 0) return [];
  const accepted = [];
  for (let i = 0; i < draftTokens.length; i++) {
    if (confidences[i] >= threshold) {
      accepted.push(draftTokens[i]);
    } else {
      break;
    }
  }
  return accepted;
}\`,
    explanation: 'Empty drafts occur at sequence boundaries and should be no-ops.',
  },
];
`;

const GRPO = `  // --- grpo-reasoning ---
  {
    id: 'grpo-reasoning-sum',
    stepLabel: '67.1',
    group: 'Relative advantage',
    title: 'Group score sum',
    concept: 'GRPO compares rewards within a sampled group. The sum is the first step toward the group baseline.',
    objective: 'Compute the sum of all scores inside getRelativeAdvantages.',
    difficulty: 'warmup',
    starterCode: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  // TODO: compute sum of scores
  const sum = 0;
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const adv = getRelativeAdvantages([2, 4, 6]);
check('below mean negative', adv[0] < 0, true);
check('above mean positive', adv[2] > 0, true);
return results;\`,
    hints: ['const sum = scores.reduce((acc, s) => acc + s, 0);'],
    solution: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}\`,
    explanation: 'Group sums anchor the relative baseline used by GRPO.',
  },
  {
    id: 'grpo-reasoning-mean',
    stepLabel: '67.2',
    group: 'Relative advantage',
    title: 'Group baseline mean',
    concept: 'The group mean is the average reward for the sampled answers at the current policy.',
    objective: 'Compute mean = sum / n.',
    difficulty: 'warmup',
    starterCode: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  // TODO: compute mean
  const mean = 0;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}\`,
    testCode: \`const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('mean centered middle', getRelativeAdvantages([2, 4, 6])[1], 0);
return results;\`,
    hints: ['const mean = sum / n;'],
    solution: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}\`,
    explanation: 'Subtracting the mean centers advantages around zero.',
  },
  {
    id: 'grpo-reasoning-center',
    stepLabel: '67.3',
    group: 'Relative advantage',
    title: 'Centered scores',
    concept: 'Centered rewards show which samples beat the group average before normalization.',
    objective: 'Push scores[i] - mean before dividing by std.',
    difficulty: 'warmup',
    starterCode: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: push scores[i] - mean
    advantages.push(0);
  }
  return advantages;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('centered scores', getRelativeAdvantages([2, 4, 6]), [-2, 0, 2]);
return results;\`,
    hints: ['advantages.push(scores[i] - mean);'],
    solution: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push(scores[i] - mean);
  }
  return advantages;
}\`,
    explanation: 'Centered scores are the unscaled GRPO advantages.',
  },
  {
    id: 'grpo-reasoning-advantage',
    stepLabel: '67.4',
    group: 'Relative advantage',
    title: 'GRPO relative advantage',
    concept: 'Final GRPO advantages divide centered scores by the group standard deviation.',
    objective: 'Return (scores[i] - mean) / std for each score.',
    difficulty: 'core',
    starterCode: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: push (scores[i] - mean) / std
    advantages.push(scores[i] - mean);
  }
  return advantages;
}\`,
    testCode: \`const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('standardized advantages', getRelativeAdvantages([2, 4, 6]), [-1.22474, 0, 1.22474]);
check('zero variance', getRelativeAdvantages([3, 3, 3]), [0, 0, 0]);
return results;\`,
    hints: ['advantages.push((scores[i] - mean) / std);'],
    solution: \`function getRelativeAdvantages(scores) {
  const n = scores.length;
  if (n === 0) return [];
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}\`,
    explanation: 'Standardized group advantages replace critic networks in GRPO training.',
  },

`;

const BPE = `  // --- tokenizer-bpe ---
  {
    id: 'bpe-count-pair-freqs',
    stepLabel: '79.1',
    group: 'BPE train step',
    title: 'BPE pair frequencies',
    concept: 'Byte-Pair Encoding starts by counting adjacent symbol pairs across the corpus.',
    objective: 'Inside bpeTrainStep, count adjacent pair frequencies into freqs.',
    difficulty: 'warmup',
    starterCode: \`function bpeTrainStep(tokensList) {
  const freqs = {};
  // TODO: count adjacent pairs across every word in tokensList as "a,b" keys
  let bestPair = null;
  let bestCount = 0;
  for (const pair in freqs) {
    if (freqs[pair] > bestCount) {
      bestCount = freqs[pair];
      bestPair = pair.split(',');
    }
  }
  const mergedCorpus = tokensList.map((word) => word);
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const out = bpeTrainStep([['l', 'o', 'w'], ['l', 'o', 'w', 'e', 'r']]);
check('best pair', out.mergedPair, ['l', 'o']);
return results;\`,
    hints: ['for each adjacent pair, freqs[pair] = (freqs[pair] || 0) + 1;'],
    solution: \`function bpeTrainStep(tokensList) {
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
  const mergedCorpus = tokensList.map((word) => word);
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    explanation: 'The most frequent pair becomes the next BPE merge candidate.',
  },
  {
    id: 'bpe-best-pair',
    stepLabel: '79.2',
    group: 'BPE train step',
    title: 'Select best merge pair',
    concept: 'Each BPE iteration merges the highest-frequency adjacent pair in the corpus.',
    objective: 'Track bestPair with the maximum count in freqs.',
    difficulty: 'warmup',
    starterCode: \`function bpeTrainStep(tokensList) {
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
  // TODO: choose the pair key with the highest frequency
  const mergedCorpus = tokensList.map((word) => word);
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const out = bpeTrainStep([['l', 'o', 'w'], ['l', 'o', 'w', 'e', 'r']]);
check('best pair', out.mergedPair, ['l', 'o']);
return results;\`,
    hints: ['loop over freqs and keep the max count pair.'],
    solution: \`function bpeTrainStep(tokensList) {
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
  const mergedCorpus = tokensList.map((word) => word);
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    explanation: 'Greedy highest-frequency merges grow the subword vocabulary iteratively.',
  },
  {
    id: 'bpe-merge-tokens-list',
    stepLabel: '79.3',
    group: 'BPE train step',
    title: 'Merge pair in one word',
    concept: 'A merge replaces every non-overlapping adjacent occurrence of the target pair with a combined symbol.',
    objective: 'Merge bestPair inside each word before returning the updated corpus.',
    difficulty: 'core',
    starterCode: \`function bpeTrainStep(tokensList) {
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
        // TODO: push combined symbol and skip both tokens
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
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const out = bpeTrainStep([['l', 'o', 'w']]);
check('merged corpus', out.corpus, [['lo', 'w']]);
return results;\`,
    hints: ['merged.push(bestPair[0] + bestPair[1]); i += 2;'],
    solution: \`function bpeTrainStep(tokensList) {
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
    explanation: 'Merging across the corpus shortens token sequences over training iterations.',
  },
  {
    id: 'bpe-empty-corpus',
    stepLabel: '79.4',
    group: 'BPE train step',
    title: 'Empty corpus edge case',
    concept: 'Training code must handle an empty corpus without attempting a merge.',
    objective: 'Return corpus unchanged and mergedPair null when tokensList is empty.',
    difficulty: 'core',
    starterCode: \`function bpeTrainStep(tokensList) {
  // TODO: if tokensList.length === 0, return { corpus: [], mergedPair: null }
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
  const mergedCorpus = tokensList.map((word) => word.slice());
  return { corpus: mergedCorpus, mergedPair: bestPair };
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('empty corpus', bpeTrainStep([]), { corpus: [], mergedPair: null });
return results;\`,
    hints: ['if (tokensList.length === 0) return { corpus: [], mergedPair: null };'],
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
    explanation: 'Edge-case guards keep tokenizer training loops safe on empty input.',
  },

`;

const KNN = `  // --- knn-naive-bayes-svm ---
  {
    id: 'knn-limit-neighbors',
    stepLabel: '44.1',
    group: 'kNN predict',
    title: 'Limit to k neighbors',
    concept: 'kNN only considers the k closest labeled neighbors when making a prediction.',
    objective: 'Inside knnPredict, set limit = Math.min(k, neighborLabels.length).',
    difficulty: 'warmup',
    starterCode: \`function knnPredict(neighborLabels, k) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('only nearest neighbor', knnPredict(['dog', 'cat', 'cat'], 1), 'dog');
return results;\`,
    hints: ['const limit = Math.min(k, neighborLabels.length);'],
    solution: \`function knnPredict(neighborLabels, k) {
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
}\`,
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
    starterCode: \`function knnPredict(neighborLabels, k) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('majority vote', knnPredict(['cat', 'cat', 'dog'], 3), 'cat');
return results;\`,
    hints: ['votes[label] = (votes[label] || 0) + 1;'],
    solution: \`function knnPredict(neighborLabels, k) {
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
}\`,
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
    starterCode: \`function knnPredict(neighborLabels, k) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('winner selected', knnPredict(['a', 'b', 'a', 'b', 'a'], 5), 'a');
return results;\`,
    hints: ['if (votes[label] > maxVotes) { maxVotes = votes[label]; winner = label; }'],
    solution: \`function knnPredict(neighborLabels, k) {
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
}\`,
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
    starterCode: \`function knnPredict(neighborLabels, k) {
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
}\`,
    testCode: \`const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('empty neighbors', knnPredict([], 3), null);
return results;\`,
    hints: ['if (neighborLabels.length === 0) return null;'],
    solution: \`function knnPredict(neighborLabels, k) {
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
}\`,
    explanation: 'Production kNN systems must handle cold-start neighborhoods gracefully.',
  },

`;

replaceBetween(
  'src/labs/language-models/languageModelCodeLabs.js',
  "  // --- WAVE 3: EAGLE 3.1 SPECULATIVE DECODING ---",
  "    explanation: 'Empty drafts occur at sequence boundaries and should be no-ops.',\n  },\n];\n",
  EAGLE,
);

replaceBetween(
  'src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js',
  "  // --- grpo-reasoning ---",
  "  // --- dapo-reasoning-rl ---",
  GRPO,
);

replaceBetween(
  'src/labs/diffusion/diffusionCodeLabs.js',
  "  // --- tokenizer-bpe ---",
  "  // --- clip-encoder ---",
  BPE,
);

replaceBetween(
  'src/labs/core-ml/coreMlCodeLabs.js',
  "  // --- knn-naive-bayes-svm ---",
  "  // --- tree-ensembles ---",
  KNN,
);

patchMappings();
console.log('Tier 1 progressive lab patches applied.');
