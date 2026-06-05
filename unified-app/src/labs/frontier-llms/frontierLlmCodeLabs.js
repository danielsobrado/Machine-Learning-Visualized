export const FRONTIER_LLM_CODE_LABS = [
  // --- FRONTIER LLM ARCHITECTURE OVERVIEW ---
  {
    id: 'frontier-weight-raw-params',
    stepLabel: '19.1',
    group: 'Weight bytes',
    title: 'Raw Parameter Count',
    concept: 'Frontier LLM serving memory is dominated by parameters. First, we expand the billions shorthand to the absolute number of parameters.',
    objective: 'Expand the billions count by multiplying by 10^9.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: calculate absolute parameter count
  const absoluteParams = 0;
  
  const rawBytes = absoluteParams * bytesPerParam;
  return rawBytes / 1e9;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Multiply numParamsBillions by 1e9.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  
  const rawBytes = absoluteParams * bytesPerParam;
  return rawBytes / 1e9;
}`,
    explanation: 'A 70B model technically means 70,000,000,000 floating point numbers in memory.',
  },
  {
    id: 'frontier-weight-raw-bytes',
    stepLabel: '19.2',
    group: 'Weight bytes',
    title: 'Raw Byte Size',
    concept: 'Next, we compute the total memory footprint in raw bytes by multiplying the parameter count by the bytes per parameter.',
    objective: 'Multiply absoluteParams by bytesPerParam.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  
  // TODO: calculate total raw bytes
  const rawBytes = 0;
  
  return rawBytes / 1e9;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Multiply absoluteParams by bytesPerParam.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  
  const rawBytes = absoluteParams * bytesPerParam;
  
  return rawBytes / 1e9;
}`,
    explanation: 'At 16-bit precision, each parameter occupies 2 bytes. At 8-bit precision, each takes 1 byte.',
  },
  {
    id: 'frontier-weight-gb',
    stepLabel: '19.3',
    group: 'Weight bytes',
    title: 'Gigabyte Conversion',
    concept: 'Server memory is measured in Gigabytes (GB). We must divide the raw byte count by 10^9 to convert it to GB.',
    objective: 'Convert rawBytes into GBs.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  const rawBytes = absoluteParams * bytesPerParam;
  
  // TODO: convert rawBytes to Gigabytes
  const gigabytes = 0;
  
  return gigabytes;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Divide rawBytes by 1e9.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  const rawBytes = absoluteParams * bytesPerParam;
  
  const gigabytes = rawBytes / 1e9;
  
  return gigabytes;
}`,
    explanation: 'Converting to GB puts the memory requirement in the same units used by GPU specs (e.g. 80GB for an A100).',
  },
  {
    id: 'frontier-weight-cancel',
    stepLabel: '19.4',
    group: 'Weight bytes',
    title: 'Cancellation Insight',
    concept: 'Notice that multiplying by 10^9 (billion scale) and dividing by 10^9 (GB scale) perfectly cancels out! We can simplify the entire calculation.',
    objective: 'Replace the 3-step calculation with the simplified direct multiplication.',
    difficulty: 'core',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: use the cancellation insight to simplify
  const gigabytes = 0;
  
  return gigabytes;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Just multiply numParamsBillions by bytesPerParam.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const gigabytes = numParamsBillions * bytesPerParam;
  
  return gigabytes;
}`,
    explanation: 'Because 1 billion parameters is exactly 1 GB per 1 byte-per-param, we can skip the intermediate 1e9 conversions entirely.',
  },
  {
    id: 'frontier-weight-full',
    stepLabel: '19.5',
    group: 'Weight bytes',
    title: 'Optimized Finalization',
    concept: 'Return the simplified expression directly.',
    objective: 'Return the directly calculated GB footprint.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: return the optimized product directly
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
check('Llama 8B INT8', getWeightBytesGB(8, 1), 8);
return results;`,
    hints: [
      'Return numParamsBillions * bytesPerParam.',
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
    id: 'moe-active-ratio',
    stepLabel: '20.1',
    group: 'Active fraction',
    title: 'Active Ratio',
    concept: 'At Frontier scale, Mixture of Experts (MoE) models only activate a subset of experts per token to minimize computational costs (FLOPs). First, we find the routing ratio.',
    objective: 'Calculate the active fraction of experts: activeExperts / totalExperts.',
    difficulty: 'warmup',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  // TODO: compute the active ratio
  const activeRatio = 0;
  
  const activeExpertParams = activeRatio * totalExpertParams;
  return nonAttnBase + activeExpertParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Divide activeExperts by totalExperts.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  
  const activeExpertParams = activeRatio * totalExpertParams;
  return nonAttnBase + activeExpertParams;
}`,
    explanation: 'In an 8x7B model that activates 2 experts per token, the active ratio is 2/8 (or 25%).',
  },
  {
    id: 'moe-active-expert-params',
    stepLabel: '20.2',
    group: 'Active fraction',
    title: 'Active Expert Footprint',
    concept: 'We apply the routing ratio to the total expert parameters to find how many expert parameters are actually used during a single forward pass.',
    objective: 'Multiply totalExpertParams by the activeRatio.',
    difficulty: 'core',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  
  // TODO: compute active expert parameters
  const activeExpertParams = 0;
  
  return nonAttnBase + activeExpertParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Multiply totalExpertParams by activeRatio.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  
  const activeExpertParams = activeRatio * totalExpertParams;
  
  return nonAttnBase + activeExpertParams;
}`,
    explanation: 'This drastically reduces the FLOPs required. You get the capacity of a massive model with the latency of a much smaller one.',
  },
  {
    id: 'moe-active-base',
    stepLabel: '20.3',
    group: 'Active fraction',
    title: 'Static Baseline',
    concept: 'MoE layers only replace the Feed-Forward Network (FFN). The self-attention layers and embeddings (nonAttnBase) still run for every token.',
    objective: 'Identify the static baseline parameters that must always be added.',
    difficulty: 'warmup',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  
  // TODO: set the baseline
  const baseline = 0;
  
  return baseline + activeExpertParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'The baseline is nonAttnBase.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  
  const baseline = nonAttnBase;
  
  return baseline + activeExpertParams;
}`,
    explanation: 'The attention mechanism isn\'t conditionally routed, so its parameter footprint is constant.',
  },
  {
    id: 'moe-active-total',
    stepLabel: '20.4',
    group: 'Active fraction',
    title: 'Total Active Parameters',
    concept: 'The final active parameter count per token is the sum of the dense attention layers and the sparse routed experts.',
    objective: 'Add the baseline to the active expert parameters.',
    difficulty: 'core',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  const baseline = nonAttnBase;
  
  // TODO: return the total active parameters sum
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Return baseline + activeExpertParams.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  const baseline = nonAttnBase;
  
  return baseline + activeExpertParams;
}`,
    explanation: 'By activating only 2 out of 8 experts per token, MoE models keep latency low while offering massive model capacities.',
  },

  // --- MULTI-HEAD LATENT ATTENTION ---
  {
    id: 'mla-compression-bottleneck',
    stepLabel: '21.1',
    group: 'Cache size ratio',
    title: 'Latent Bottleneck',
    concept: 'Multi-head Latent Attention (MLA) compresses the KV cache. First, we identify the dimension of the compressed latent space.',
    objective: 'Extract the compressed latent dimension size.',
    difficulty: 'warmup',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  // TODO: identify the compressed size
  const compressedSize = 0;
  
  const standardSize = kvHeads * headDim;
  return compressedSize / standardSize;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Assign compressedSize to latentDim.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  
  const standardSize = kvHeads * headDim;
  return compressedSize / standardSize;
}`,
    explanation: 'Instead of caching full keys and values for every head, MLA only caches this tiny latent representation.',
  },
  {
    id: 'mla-compression-dense',
    stepLabel: '21.2',
    group: 'Cache size ratio',
    title: 'Dense KV Size',
    concept: 'To understand the savings, we need to know what the memory footprint would have been using standard Multi-Head Attention.',
    objective: 'Calculate the uncompressed KV size: kvHeads * headDim.',
    difficulty: 'core',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  
  // TODO: compute standard size
  const standardSize = 0;
  
  return compressedSize / standardSize;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Multiply kvHeads by headDim.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  
  const standardSize = kvHeads * headDim;
  
  return compressedSize / standardSize;
}`,
    explanation: 'A model with 128 heads of dimension 128 normally requires 16,384 floats per token just for the cache!',
  },
  {
    id: 'mla-compression-math',
    stepLabel: '21.3',
    group: 'Cache size ratio',
    title: 'Compression Math',
    concept: 'The ratio is exactly the new compressed size divided by the old standard size.',
    objective: 'Compute the ratio of compressedSize to standardSize.',
    difficulty: 'core',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  
  // TODO: calculate the ratio
  const ratio = 0;
  
  return ratio;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Divide compressedSize by standardSize.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  
  const ratio = compressedSize / standardSize;
  
  return ratio;
}`,
    explanation: 'For DeepSeek-V2, this ratio reaches an incredible 1/128th of the original size (0.0078).',
  },
  {
    id: 'mla-compression-full',
    stepLabel: '21.4',
    group: 'Cache size ratio',
    title: 'Full MLA Ratio',
    concept: 'Return the computed MLA compression ratio.',
    objective: 'Return the final ratio value.',
    difficulty: 'warmup',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  const ratio = compressedSize / standardSize;
  
  // TODO: return the ratio
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Return the ratio.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  const ratio = compressedSize / standardSize;
  
  return ratio;
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
    id: 'tool-use-parse',
    stepLabel: '29.1',
    group: 'Tool call parser',
    title: 'XML Tool Call Parsing',
    concept: 'Tool-using models emit <call:toolName>arguments</call> tags. The agent runtime parses those tags before dispatching.',
    objective: 'Inside runAgentToolStep, parse the first tool call from assistantText using a regex.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  // TODO: match /<call:(\\w+)>(.*?)<\\/call>/ and set toolCall = { name, args } or null.

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { search: (q) => 'found ' + q };
const out = runAgentToolStep('Try <call:search>ml</call>', [], reg);
check('parsed tool call', out.nextMessage, { role: 'tool', name: 'search', content: 'found ml' });
check('no tool means stop', runAgentToolStep('done', [], reg).shouldStop, true);
return results;`,
    hints: [
      'Use text.match(/<call:(\\w+)>(.*?)<\\/call>/).',
      'If matched, toolCall = { name: match[1], args: match[2] }.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) {
    toolCall = { name: match[1], args: match[2] };
  }

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'Parsing tool tags is the boundary between free-form LLM text and structured runtime actions.',
  },
  {
    id: 'tool-use-dispatch',
    stepLabel: '29.2',
    group: 'Action dispatcher',
    title: 'Tool Call Dispatcher',
    concept: 'After parsing, the dispatcher looks up the handler, catches failures, and returns a string result.',
    objective: 'Inside runAgentToolStep, dispatch toolCall to registry with missing-tool and error handling.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    let content = '';
    // TODO: dispatch toolCall through registry with try/catch and missing-tool fallback strings.

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const reg = { upper: (s) => s.toUpperCase(), fail: () => { throw new Error('timeout'); } };
check('dispatch success', runAgentToolStep('<call:upper>hi</call>', [], reg).nextMessage.content, 'HI');
check('missing tool', runAgentToolStep('<call:missing>x</call>', [], reg).nextMessage.content, 'Error: Tool "missing" not found');
check('caught error', runAgentToolStep('<call:fail></call>', [], reg).nextMessage.content, 'Error: timeout');
return results;`,
    hints: [
      'Look up registry[toolCall.name].',
      'Return an error string if the tool is missing or throws.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'Safe dispatch prevents one bad tool call from crashing the whole agent loop.',
  },
  {
    id: 'tool-use-history',
    stepLabel: '29.3',
    group: 'History integration',
    title: 'Tool History Integration',
    concept: 'Successful tool execution appends a tool-role message so the model can read the result on the next turn.',
    objective: 'Inside runAgentToolStep, append the tool result to history without mutating the input array.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    let nextHistory = history;
    // TODO: append { role: 'tool', name: toolCall.name, content } to a copied history array.

    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const hist = [{ role: 'user', content: 'weather?' }];
const out = runAgentToolStep('<call:get_weather>Paris</call>', hist, { get_weather: (x) => 'sunny in ' + x });
check('history append', out.history, [{ role: 'user', content: 'weather?' }, { role: 'tool', name: 'get_weather', content: 'sunny in Paris' }]);
check('input history untouched', hist.length, 1);
return results;`,
    hints: [
      'Copy history with [...history].',
      'Push the tool message object onto the copy.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'Tool-role messages distinguish execution feedback from assistant prose in the dialog state.',
  },
  {
    id: 'tool-use-agent-loop',
    stepLabel: '29.4',
    group: 'Agent execution loop',
    title: 'Agent Reason-Action Loop',
    concept: 'When no tool call is present the agent stops; when a tool executes the loop continues with shouldStop = false.',
    objective: 'Inside runAgentToolStep, return shouldStop false for tool calls and true for plain assistant text.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: true,
      history: nextHistory,
    };
  }

  // TODO: return assistant nextMessage and the correct shouldStop flag when no tool call is found.
  return { nextMessage: {}, shouldStop: false, history };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { get_weather: (loc) => 'sunny in ' + loc };
check('tool path continues', runAgentToolStep('<call:get_weather>Paris</call>', [], reg), {
  nextMessage: { role: 'tool', name: 'get_weather', content: 'sunny in Paris' },
  shouldStop: false,
  history: [{ role: 'tool', name: 'get_weather', content: 'sunny in Paris' }],
});
check('plain text stops', runAgentToolStep('All done.', [], reg), {
  nextMessage: { role: 'assistant', content: 'All done.' },
  shouldStop: true,
  history: [],
});
return results;`,
    hints: [
      'Tool execution should set shouldStop to false so the loop continues.',
      'Plain assistant text should set shouldStop to true.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'The stop flag is what lets an outer loop alternate between model generation and tool execution.',
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
