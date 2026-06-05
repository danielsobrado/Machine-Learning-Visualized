export const FRONTIER_LLM_CODE_LABS = [
  // --- FRONTIER LLM ARCHITECTURE OVERVIEW ---
  {
    id: 'frontier-weight-bytes',
    stepLabel: '19.1',
    group: 'Weight bytes',
    title: 'Model parameters memory size',
    concept: 'Frontier LLM serving memory is dominated by parameters. At 16-bit precision (FP16/BF16), each parameter occupies 2 bytes; at 8-bit precision (INT8), it occupies 1 byte.',
    objective: 'Calculate the total gigabytes (GB) needed to store parameters in memory.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: return memory in GB: (params * 10^9 * bytesPerParam) / 10^9
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
check('Llama 8B INT8', getWeightBytesGB(8, 1), 8);
return results;`,
    hints: [
      'The billions scale cancels out with the GB scale (both 10^9).',
      'Simply multiply numParamsBillions by bytesPerParam.',
      'return numParamsBillions * bytesPerParam;',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  return numParamsBillions * bytesPerParam;
}`,
    explanation: 'Parameter size represents the static memory baseline required to load a model before processing any inputs.',
  },
  {
    id: 'frontier-kv-bytes',
    stepLabel: '19.2',
    group: 'KV bytes',
    title: 'KV Cache size calculation',
    concept: 'The Key-Value (KV) cache grows linearly with sequence length, batch size, and number of layers: size = 2 * layers * kvHeads * headDim * seqLen * bytesPerParam.',
    objective: 'Compute total KV cache bytes for the given inputs.',
    difficulty: 'core',
    starterCode: `function getKVCacheBytes(layers, kvHeads, headDim, seqLen, bytesPerParam) {
  // TODO: return total bytes of KV cache
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Llama 8B layer cache size', getKVCacheBytes(32, 8, 128, 2048, 2), 268435456);
return results;`,
    hints: [
      'Multiply all parameters together along with the factor of 2 (for both Keys and Values).',
      'return 2 * layers * kvHeads * headDim * seqLen * bytesPerParam;',
    ],
    solution: `function getKVCacheBytes(layers, kvHeads, headDim, seqLen, bytesPerParam) {
  return 2 * layers * kvHeads * headDim * seqLen * bytesPerParam;
}`,
    explanation: 'KV cache size is the main bottleneck for long-context generation, often exceeding parameter sizes at large batch sizes.',
  },

  // --- FRONTIER MOE SYSTEMS ---
  {
    id: 'moe-active-params',
    stepLabel: '20.1',
    group: 'Active fraction',
    title: 'Active parameters fraction',
    concept: 'At Frontier scale, Mixture of Experts (MoE) models only activate a subset of experts per token to minimize computational costs (FLOPs).',
    objective: 'Calculate the active parameters count: nonAttnBase + (activeExperts / totalExperts) * totalExpertParams.',
    difficulty: 'warmup',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  // TODO: calculate and return active parameters
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Multiply totalExpertParams by activeExperts / totalExperts.',
      'Add nonAttnBase to the result.',
      'return nonAttnBase + (activeExperts / totalExperts) * totalExpertParams;',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  return nonAttnBase + (activeExperts / totalExperts) * totalExpertParams;
}`,
    explanation: 'By activating only 2 out of 8 experts per token, MoE models keep latency low while offering massive model capacities.',
  },

  // --- MULTI-HEAD LATENT ATTENTION ---
  {
    id: 'mla-compression-ratio',
    stepLabel: '21.1',
    group: 'Cache size ratio',
    title: 'MLA cache compression ratio',
    concept: 'Multi-head Latent Attention (MLA) compresses the KV cache by projecting key-value vectors into a low-dimensional latent space.',
    objective: 'Calculate the cache savings ratio: compressedLatentDim / (standardKVHeads * headDim).',
    difficulty: 'warmup',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  // TODO: return the ratio of compressed latent size to standard KV size
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125); // 128 / 16384
return results;`,
    hints: [
      'Calculate standard KV size: kvHeads * headDim.',
      'Divide latentDim by this standard size.',
      'return latentDim / (kvHeads * headDim);',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  return latentDim / (kvHeads * headDim);
}`,
    explanation: 'MLA reduces the memory footprint of KV caches by more than 90%, allowing much larger batch sizes and context lengths.',
  },

  // --- REASONING RLVR GRPO ---
  {
    id: 'grpo-relative-advantage',
    stepLabel: '22.1',
    group: 'Relative advantage',
    title: 'GRPO relative advantage calculation',
    concept: 'Group Relative Policy Optimization (GRPO) calculates advantages relative to a group baseline rather than using a separate critic network.',
    objective: 'For each score in a group, calculate: (score - mean) / std.',
    difficulty: 'core',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: compute advantage score and push it to advantages array
    advantages.push(0);
  }
  return advantages;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('advantages test', getRelativeAdvantages([2, 4, 6]), [-1.22474, 0, 1.22474]);
return results;`,
    hints: [
      'The mean is already mean.',
      'The standard deviation is std.',
      'The formula is: (scores[i] - mean) / std.',
    ],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'By normalizing rewards across a group of candidate outputs, GRPO reduces policy gradient variance without requiring a value critic.',
  },

  // --- TEST-TIME COMPUTE THINKING BUDGETS ---
  {
    id: 'budget-thinking-check',
    stepLabel: '23.1',
    group: 'Budget split',
    title: 'Thinking budget boundary check',
    concept: 'Test-time compute thinking models generate reasoning steps between <thought> and </thought> tags before emitting the final answer.',
    objective: 'Return true if tokens contains "</thought>", signaling thinking is complete, otherwise false.',
    difficulty: 'warmup',
    starterCode: `function isThinkingComplete(tokens) {
  // TODO: return whether tokens array includes '</thought>' tag
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('thought ongoing', isThinkingComplete(['<thought>', 'Let', 'me', 'think']), false);
check('thought ended', isThinkingComplete(['<thought>', 'Okay', '</thought>', 'Answer:']), true);
return results;`,
    hints: [
      'Use the array .includes() method.',
      "return tokens.includes('</thought>');",
    ],
    solution: `function isThinkingComplete(tokens) {
  return tokens.includes('</thought>');
}`,
    explanation: 'Checking thinking tags allows LLM inference servers to allocate dynamic token budgets and switch routing modes.',
  },

  // --- LONG CONTEXT FRONTIER MODELS ---
  {
    id: 'long-context-scale-kv',
    stepLabel: '24.1',
    group: 'Linear seq scaling',
    title: 'Linear sequence memory scaling',
    concept: 'Long context models scale their KV cache memory footprint linearly with context length.',
    objective: 'Scale a baseline memory value (in MB) at baselineLen to newLen.',
    difficulty: 'warmup',
    starterCode: `function scaleMemory(baselineMB, baselineLen, newLen) {
  // TODO: return scaled memory in MB
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale from 4k to 32k', scaleMemory(256, 4096, 32768), 2048);
return results;`,
    hints: [
      'The memory scales by the factor: newLen / baselineLen.',
      'return baselineMB * (newLen / baselineLen);',
    ],
    solution: `function scaleMemory(baselineMB, baselineLen, newLen) {
  return baselineMB * (newLen / baselineLen);
}`,
    explanation: 'Linear scaling shows how cache requirements grow directly with the input sequence length.',
  },

  // --- OMNI MULTIMODAL ARCHITECTURES ---
  {
    id: 'omni-fuse-embeddings',
    stepLabel: '25.1',
    group: 'Weighted fuse',
    title: 'Weighted multimodal embedding fusion',
    concept: 'Omni models fuse text and vision/audio tokens by applying gating layers to blend representations.',
    objective: 'Fuse text and vision embeddings coordinate by coordinate: output[i] = gate * vision[i] + (1 - gate) * text[i].',
    difficulty: 'core',
    starterCode: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    // TODO: compute weighted blend of vision and text coordinates
    fused.push(0);
  }
  return fused;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('fuse half-half', fuseModalEmbeddings([1.0, 2.0], [3.0, 4.0], 0.5), [2.0, 3.0]);
return results;`,
    hints: [
      'Use the formula: gate * visionEmb[i] + (1 - gate) * textEmb[i].',
      'Push it to the fused array.',
    ],
    solution: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    fused.push(gate * visionEmb[i] + (1 - gate) * textEmb[i]);
  }
  return fused;
}`,
    explanation: 'Gated fusion layers allow the network to dynamically scale the balance of textual and visual inputs at each sequence index.',
  },

  // --- DIFFUSION LANGUAGE MODELS ---
  {
    id: 'diffusion-lm-mask-ratio',
    stepLabel: '26.1',
    group: 'Mask ratio',
    title: 'Diffusion language model mask ratio',
    concept: 'Diffusion language models iteratively denoise corrupted sequences. At time step t out of T, a linear scheduler masks a fraction t/T of tokens.',
    objective: 'Compute the number of tokens to mask: Math.round(tokens.length * (t / T)).',
    difficulty: 'warmup',
    starterCode: `function getMaskCount(seqLen, t, T) {
  // TODO: return how many tokens to mask at step t
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mid diffusion step', getMaskCount(100, 50, 100), 50);
check('start diffusion step', getMaskCount(100, 90, 100), 90);
return results;`,
    hints: [
      'Divide t by T.',
      'Multiply by seqLen, and round the result using Math.round.',
      'return Math.round(seqLen * (t / T));',
    ],
    solution: `function getMaskCount(seqLen, t, T) {
  return Math.round(seqLen * (t / T));
}`,
    explanation: 'The noise schedule defines how many tokens are masked/corrupted at each stage of the diffusion generation process.',
  },

  // --- EFFICIENT LLM SERVING ---
  {
    id: 'serving-batch-utilization',
    stepLabel: '27.1',
    group: 'Continuous batching',
    title: 'Serving batch slot utilization',
    concept: 'In continuous batching LLM serving, tokens are processed in shared batch slots. Monitoring slot utilization helps scale serving resources.',
    objective: 'Calculate the utilization ratio: activeSlots / maxBatchSlots.',
    difficulty: 'warmup',
    starterCode: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  // TODO: return utilization fraction
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('half utilized', getBatchUtilization(16, 32), 0.5);
return results;`,
    hints: [
      'Divide activeSlots by maxBatchSlots.',
      'return activeSlots / maxBatchSlots;',
    ],
    solution: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  return activeSlots / maxBatchSlots;
}`,
    explanation: 'Continuous batching increases hardware utilization by dynamically packing incoming requests into active GPU scheduling slots.',
  },

  // --- TOOL-USING REASONING MODELS ---
  {
    id: 'tool-call-tag-check',
    stepLabel: '29.1',
    group: 'Tool name match',
    title: 'Detect tool call syntax',
    concept: 'Tool-using models output special markup tags like "<call:tool_name>" when invoking external APIs.',
    objective: 'Return true if modelText contains the substring "<call:", otherwise false.',
    difficulty: 'warmup',
    starterCode: `function containsToolCall(modelText) {
  // TODO: return whether modelText contains tool call markup prefix
  return false;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('tool call present', containsToolCall('Let me search. <call:google_search>query</call>'), true);
check('no tool call', containsToolCall('No search is needed.'), false);
return results;`,
    hints: [
      'Use the .includes() method on strings.',
      "return modelText.includes('<call:');",
    ],
    solution: `function containsToolCall(modelText) {
  return modelText.includes('<call:');
}`,
    explanation: 'Parsing tool call markers allows the execution environment to intercept generation, execute the code, and insert results.',
  },

  // --- AGENTIC CODING SYSTEMS ---
  {
    id: 'agentic-apply-patch',
    stepLabel: '30.1',
    group: 'Hunk apply',
    title: 'Agentic text replacement',
    concept: 'Agentic coding engines edit code bases by applying diff patches, finding target lines, and replacing them with revised code blocks.',
    objective: 'Replace the first occurrence of targetString with replacementString in the content string.',
    difficulty: 'warmup',
    starterCode: `function applyPatch(content, targetString, replacementString) {
  // TODO: replace targetString with replacementString in content
  return '';
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('replace line', applyPatch('let x = 1;\\nreturn x;', 'let x = 1;', 'let x = 2;'), 'let x = 2;\\nreturn x;');
return results;`,
    hints: [
      'Use the .replace() method on strings.',
      'return content.replace(targetString, replacementString);',
    ],
    solution: `function applyPatch(content, targetString, replacementString) {
  return content.replace(targetString, replacementString);
}`,
    explanation: 'Applying localized replacements enables developer agents to make targeted code changes without rewriting entire files.',
  }
];
