# Prompt: Generate the 83 Missing Code Labs

Use this document as a **copy-paste master prompt** for an LLM or human author. It defines the rules we agreed on during the Code Lab audit, the repo wiring, and an enumerated backlog of **83 lessons** that currently expose **no** page-level Code Lab.

**Current state (2026-06):** 99 lessons have real labs · 53 lessons are intentionally hidden · 0 lessons use keyword placeholders.

---

## Master prompt (copy from here)

```text
You are authoring Code Labs for the ml-animations unified app (Rustlings-style JavaScript exercises).

GOAL
Create real, lesson-specific exercises for the lesson(s) I give you. Each lesson must teach the actual algorithm or computation from that lesson — not metadata drills.

HARD RULES (non-negotiable)
1. NEVER generate placeholder drills from lessonLabFactory.js:
   - No "Recognize the lesson keyword" / hasXKeyword exercises
   - No term-counting, best-candidate routing, or stage-checklist filler
2. Show the FULL canonical function for the lesson with JSDoc on every learner-facing function.
   - @param {type} name - what it is and a short example when useful (e.g. tokens is string[] like ['cat', 'dog']).
   - @returns {type} - what the function returns.
   - Add a // name: type — purpose comment above each non-obvious local initialization (empty arrays, counters, copies).
   - Loops, structure, and variable names stay visible.
   - Only the smallest targeted blank per exercise: // TODO: ... or a single 0 / false / [] placeholder.
3. Difficulty must ramp gradually within a lesson:
   - warmup: one atomic operation inside the full function
   - core: combine 2–3 steps, still inside the same function skeleton
   - challenge: full correct implementation or a realistic edge-case branch
4. Exercises reuse the SAME function skeleton across steps (like matmul), changing only the TODO target.
5. Tests must assert real numeric / structural behavior — not string matching on lesson titles or routes.
6. Vanilla JavaScript only. No imports. Code runs via new Function(userCode + testCode) in a web worker.
7. Every starterCode must contain the literal substring TODO.
8. Every solution must pass its own testCode (verified by lessonCodeLabs.test.mjs).
9. Provide at least 1 hint per exercise; prefer 3 hints progressing concept → near-code → exact line.
10. Target 4–10 exercises per lesson, grouped into 2–4 reusable group names.

EXERCISE SCHEMA (every exercise object)
{
  id: string,              // kebab-case, unique within source library (e.g. 'dot-product-first-pair')
  stepLabel: string,       // 'N.M' in source file; remapped at lesson wire time
  group: string,           // reusable skill group name (e.g. 'Dot product', 'Q-learning update')
  title: string,           // short human title
  concept: string,         // 1–2 sentences of teaching
  objective: string,       // what the learner changes
  difficulty: 'warmup' | 'core' | 'challenge',
  starterCode: string,     // full function with one TODO
  testCode: string,        // builds results[] and returns it
  hints: string[],         // ≥1 entry
  solution: string,        // complete function(s), no TODO
  explanation: string,     // what passing teaches
}

TEST CODE TEMPLATE
const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: /* your comparator */ });
}

// ... calls ...

return results;

REFERENCE QUALITY BAR
- matrix-multiplication (linearAlgebraCodeLabs.js): full matmul(A,B) with JSDoc; 10 steps from first pair product → full multiply.
- optimizers (neuralNetworkLessonLabs.js inline): real SGD / momentum / Adam math on vectors.
- ppo-clipped-policy-gradient (reinforcementLearningLessonLabs.js inline): policy ratio → clip → surrogate.

WIRING CHECKLIST (after writing exercises)
1. Add exercises to the correct *CodeLabs.js source library (or inline via replaceLessonLabGroup for one-off lessons).
2. Add LESSON_GROUP_MAPPINGS entry in lessonCodeLabMappings.js:
   'lesson-id': { source: 'linear'|'nn'|'transformer'|'lm'|'rag'|'eval'|'exp'|NEW, groups: ['Group A', 'Group B'] }
3. Register new source key in SOURCES if you create a new library file.
4. Run: cd unified-app && npm test
5. Confirm getLessonCodeLabExercises('lesson-id').length > 0 and no exercise title is 'Recognize the lesson keyword'.

OUTPUT FORMAT
For each lesson, output:
A) exercise group names and count
B) full JS array of exercise objects ready to paste into the source file
C) the LESSON_GROUP_MAPPINGS entry
```

---

## Repository rules (from audit)

### What went wrong before

The page-level `LessonCodeLab` on `/animation/:id` used auto-generated drills from `lessonLabFactory.js` (`hasMatrixMultiplicationKeyword`, lowercase keyword matching, term counts). Those looked like Code Labs but did not teach the lesson math.

**Fix applied:** only lessons with real exercises in `LESSON_GROUP_MAPPINGS` (or `CUSTOM_LESSON_CODE_LABS`) show a Code Lab. Everything else returns `[]` and the section is hidden.

### Pedagogical pattern (matrix multiplication model)

| Step | What learner sees | What they change |
|------|-------------------|------------------|
| 1.1 | Full `matmul(A,B)` with all loops | One inner product term: `sum += 0` → `A[i][k]*B[k][j]` |
| 1.2 | Same skeleton | Second explicit pair before loop |
| … | Same skeleton | Next missing piece |
| Final | Same skeleton | Last TODO → complete correct function |

Apply this pattern to every lesson: **one canonical implementation**, **progressive TODOs**, **never a blank stub function**.

### Difficulty ladder

1. **warmup** — single line inside full structure (bias term, one array index, one probability factor).
2. **core** — small block (inner loop body, one gradient component, one Bellman backup).
3. **challenge** — full function correct, or handle shape / boundary / numerical stability.

### Anti-patterns (reject on sight)

- `function hasWord2vecKeyword(text) { ... includes('word2vec') ... }`
- Exercises that only check lesson name, URL, or glossary terms
- Empty `return 0` with no surrounding lesson logic
- Different unrelated functions per step with no shared skeleton
- Python, NumPy, or import statements

### UI / UX expectations

- Code Lab appears at `#code-lab` on lesson pages via `LessonCodeLab.jsx` → `CodeFixLab.jsx`.
- Big screen mode is available; editor should remain readable with full functions (avoid 3-line stubs).
- Progress scopes to `lessonId`; exercise ids become `lesson-id--source-exercise-id` after mapping.

---

## File map

| Role | Path |
|------|------|
| Page-level lab | `src/labs/lesson-code/LessonCodeLab.jsx` |
| Lab UI | `src/labs/code-fix/CodeFixLab.jsx` |
| Lesson → exercise mapping | `src/labs/lesson-code/lessonCodeLabMappings.js` |
| Placeholder factory (do not use for shipping) | `src/labs/lesson-code/lessonLabFactory.js` |
| Category wiring | `src/labs/lesson-code/categories/*.js` |
| Tests | `src/labs/lesson-code/lessonCodeLabs.test.mjs` |

### Existing exercise source libraries

| Source key | File |
|------------|------|
| `linear` | `src/labs/algebra/linearAlgebraCodeLabs.js` |
| `nn` | `src/labs/neural-networks/neuralNetworkCodeLabs.js` |
| `transformer` | `src/labs/transformers/transformerCodeLabs.js` |
| `lm` | `src/labs/language-models/languageModelCodeLabs.js` |
| `rag` | `src/labs/rag/ragCodeLabs.js` |
| `eval` | `src/labs/evaluation/evaluationCodeLabs.js` |
| `exp` | `src/labs/experimentation/experimentationCodeLabs.js` |

### Suggested new source libraries for this backlog

| Source key | Proposed file | Lessons |
|------------|---------------|---------|
| `nlp` | `src/labs/nlp/nlpCodeLabs.js` | word2vec, glove, fasttext |
| `core` | `src/labs/core-ml/coreMlCodeLabs.js` | k-means, splits, CV, kNN, trees, time series, feature scaling |
| `prob` | `src/labs/probability/probabilityCodeLabs.js` | distributions, Bayes, MLE, EV/variance, Spearman |
| `rl` | `src/labs/reinforcement-learning/reinforcementLearningCodeLabs.js` | MDP, Q-learning, policy gradients, etc. |
| `diffusion` | `src/labs/diffusion/diffusionCodeLabs.js` | SD3 track lessons |
| `algo` | `src/labs/algorithms/algorithmsCodeLabs.js` | bloom filter, pagerank |
| `frontier` | `src/labs/frontier-llms/frontierLlmCodeLabs.js` | frontier overview lessons |

Inline `replaceLessonLabGroup` (like optimizers / PPO) is fine for 4-exercise focused lessons when a shared library group is overkill.

---

## Enumerated backlog: 83 lessons

Process **one lesson at a time** unless batching a tight cluster (e.g. all three embedding methods). For each: read the lesson animation + concept map, then author exercises.

---

### Natural Language Processing (3)

#### 1. [x] `word2vec` — Word2Vec
- **Category:** Natural Language Processing
- **Source:** `nlp` (new)
- **Anchor function:** `skipGramLoss(centerIdx, contextIdx, scores)` or `negativeSamplingGradient(...)`
- **Groups:** Context–target pair · Hierarchical softmax stub · Negative sampling · Subsampling frequent words
- **Target:** 6–8 exercises

#### 2. [x] `glove` — GloVe
- **Category:** Natural Language Processing
- **Source:** `nlp`
- **Anchor function:** `gloveObjective(wi, wj, biasI, biasJ, xij, logX)` — weighted least squares on co-occurrence
- **Groups:** Co-occurrence weight · Log term · Dot-plus-bias prediction · Full scalar loss
- **Target:** 5–6 exercises

#### 3. [x] `fasttext` — FastText
- **Category:** Natural Language Processing
- **Source:** `nlp`
- **Anchor function:** `fasttextBucketHash(ngram)` / `sumSubwordVectors(word, buckets)`
- **Groups:** Character n-gram enumerate · Hash bucket · Subword vector sum · OOV fallback
- **Target:** 5–6 exercises

---

### Transformers & Attention (13)

#### 4. [x] `rope` — RoPE (Rotary Embeddings)
- **Source:** `transformer`
- **Anchor:** `applyRoPE(x, cos, sin)` on 2D rotation pairs
- **Groups:** Angle pair · Rotate 2D block · Apply to head dimension · Full sequence slice
- **Target:** 6 exercises

#### 5. [x] `transformer-architecture-families` — Transformer Architecture Families
- **Source:** `transformer`
- **Anchor:** `blockConfigParams(config)` — count params / FFN ratio / head layout per family
- **Groups:** FFN expansion ratio · Head count · GQA grouping · Parameter estimate
- **Target:** 4–5 exercises

#### 6. [x] `coconut-latent-reasoning` — Coconut: Chain of Continuous Thought
- **Source:** `transformer`
- **Anchor:** `latentThoughtStep(hidden, thoughtVector)` — residual latent update
- **Groups:** Latent residual add · Gate blend · Multi-step unroll · Stop condition
- **Target:** 5 exercises

#### 7. [x] `grouped-query-attention` — Grouped-Query Attention
- **Source:** `transformer`
- **Anchor:** `expandKV(K, V, numQueryHeads, numKVHeads)`
- **Groups:** KV head index · Repeat/broadcast rule · Shape check · Attention-ready K/V
- **Target:** 5–6 exercises

#### 8. [x] `kv-cache` — KV Cache
- **Source:** `transformer`
- **Anchor:** `appendKVCache(cache, newK, newV, position)`
- **Groups:** Slice write index · Cache length · Position offset · Concat semantics
- **Target:** 5 exercises

#### 9. [x] `flash-attention` — Flash Attention
- **Source:** `transformer`
- **Anchor:** `onlineSoftmaxBlock(scores, rowMax, rowSum)` — streaming max/sum
- **Groups:** Row max update · Exp rescale · Running sum · Normalized block output
- **Target:** 6 exercises

#### 10. [x] `spec-sparse-attention` — SpecSA / SpecAttn
- **Source:** `transformer`
- **Anchor:** `draftVerifyAccept(draftTokens, targetLogits)`
- **Groups:** Draft length · Accept/reject rule · KV block skip count · Effective tokens read
- **Target:** 5 exercises

#### 11. [x] `turboquant` — TurboQuant
- **Source:** `transformer`
- **Anchor:** `quantizeKV(vector, codebook)` / `dequantize(indices, codebook)`
- **Groups:** Nearest codebook entry · Index encode · Dequant reconstruction · Error norm
- **Target:** 5–6 exercises

#### 12. [x] `recommender-systems-ranking-track` — Recommender Systems & Ranking
- **Source:** `transformer` or `eval`
- **Anchor:** `pairwiseRankLoss(scorePos, scoreNeg)` / `dotUserItem(user, item)`
- **Groups:** Dot score · Pairwise hinge · Top-k mask · Batch negatives
- **Target:** 5 exercises

#### 13. [x] `efficient-inference-compression-track` — Efficient Inference & Compression
- **Source:** `transformer`
- **Anchor:** `quantizedMatmul(A, B, scaleA, scaleB)`
- **Groups:** Per-channel scale · INT8 dot · Dequant fuse · Shape guard
- **Target:** 5 exercises

#### 14. [x] `bert` — BERT
- **Source:** `transformer`
- **Anchor:** `bertMLMMask(tokens, maskIdx, vocabLogits)` — masked LM at index
- **Groups:** Mask token replace · MLM logit slice · Cross-entropy one position · [CLS] pool (optional)
- **Target:** 6 exercises

#### 15. [x] `moe` — Mixture of Experts
- **Source:** `transformer`
- **Anchor:** `moeTopKRouter(logits, k)` / `dispatchToExperts(tokens, expertIdx)`
- **Groups:** Softmax gate · Top-k pick · Load per expert · Weighted combine
- **Target:** 6 exercises

#### 16. [x] `fine-tuning` — Fine-Tuning Methods
- **Source:** `nn` + `transformer`
- **Anchor:** `loraUpdate(W, A, B, alpha, rank)` — low-rank delta
- **Groups:** Rank-1 product · Alpha scaling · Frozen base · Effective delta add
- **Target:** 5–6 exercises

---

### Papers (2)

#### 17. [x] `eagle-3-1-speculative-decoding` — EAGLE 3.1
- **Source:** `lm` (new speculative group)
- **Anchor:** `eagleDraftExtend(tree, draftHidden, acceptMask)`
- **Groups:** Draft tree depth · Self-trust threshold · Accept mask · Token salvage
- **Target:** 5 exercises

#### 18. [x] `native-sparse-attention` — Native Sparse Attention
- **Source:** `transformer`
- **Anchor:** `sparseBlockMask(seqLen, blockSize, topBlocks)`
- **Groups:** Block grid · Top-k blocks · Mask scatter · Effective attention region
- **Target:** 5–6 exercises

---

### Frontier LLMs (12)

#### 19. [x] `frontier-llm-architecture-overview` — Frontier LLM Architecture Overview
- **Source:** `frontier` (new)
- **Anchor:** `estimateInferenceMemory(params, context, bytesPerParam)`
- **Groups:** Weight bytes · KV bytes · Total GB · Context scaling
- **Target:** 4 exercises

#### 20. [x] `frontier-moe-systems` — Mixture of Experts at Frontier Scale
- **Source:** `frontier`
- **Anchor:** `moeActiveParams(totalParams, numExperts, topK)`
- **Groups:** Active fraction · Expert param share · FLOPs ratio · Memory vs dense
- **Target:** 4–5 exercises

#### 21. [x] `multi-head-latent-attention` — MLA / TransMLA
- **Source:** `frontier`
- **Anchor:** `compressKV(K, V, downProj, upProj)`
- **Groups:** Down-project · Latent dim · Up-project restore · Cache size ratio
- **Target:** 5–6 exercises

#### 22. [x] `reasoning-rlvr-grpo` — Reasoning Models: SFT → RLVR / GRPO
- **Source:** `frontier` + reuse `rl` groups where possible
- **Anchor:** `grpoGroupReward(rewards)` / `relativeAdvantage(score, groupMean)`
- **Groups:** Group baseline · Relative advantage · KL penalty stub · Policy weight
- **Target:** 5 exercises

#### 23. [x] `test-time-compute-thinking-budgets` — Test-Time Compute & Thinking Budgets
- **Source:** `frontier`
- **Anchor:** `budgetedDecode(maxTokens, thinkTokens, answerTokens)`
- **Groups:** Budget split · Early stop · Cost estimate · Answer extraction
- **Target:** 4 exercises

#### 24. [x] `long-context-frontier-models` — Long Context: 1M to 10M Tokens
- **Source:** `frontier`
- **Anchor:** `kvMemoryBytes(layers, heads, dim, seqLen, dtypeBytes)`
- **Groups:** Per-layer KV · Linear seq scaling · GQA savings · Million-token estimate
- **Target:** 4–5 exercises

#### 25. [x] `omni-multimodal-architectures` — Multimodal and Omni Models
- **Source:** `frontier`
- **Anchor:** `fuseModalEmbeddings(textEmb, imageEmb, gate)`
- **Groups:** Gate compute · Weighted fuse · Sequence concat · Modality mask
- **Target:** 5 exercises

#### 26. [x] `diffusion-language-models` — Diffusion Language Models
- **Source:** `frontier` + `diffusion`
- **Anchor:** `maskCorrupt(tokens, t, vocabSize)` / `denoiseStep(logits, t)`
- **Groups:** Noise schedule · Mask ratio · One denoise step · Token unmask rule
- **Target:** 5–6 exercises

#### 27. [x] `efficient-llm-serving` — Efficient LLM Serving
- **Source:** `frontier`
- **Anchor:** `batchUtilization(activeSlots, maxBatch)` / `latencyEstimate(tokens, tokPerSec)`
- **Groups:** Continuous batching · Padding waste · Throughput · Queue latency
- **Target:** 4 exercises

#### 28. [x] `frontier-evaluation-safety` — Frontier Evaluation and Safety
- **Source:** `eval`
- **Anchor:** `harmScore(logprobs, refusalTokenIds)` / `passAtK(correctRuns, k, n)`
- **Groups:** Pass@k · Refusal detect · Threshold · Aggregate bench score
- **Target:** 4–5 exercises

#### 29. [x] `tool-using-reasoning-models` — Tool-Using Reasoning Models
- **Source:** `frontier`
- **Anchor:** `parseToolCall(modelText)` / `injectToolResult(context, result)`
- **Groups:** JSON arg extract · Tool name match · Result append · Next-step prompt
- **Target:** 4–5 exercises

#### 30. [x] `agentic-coding-systems` — Agentic Coding Systems
- **Source:** `frontier`
- **Anchor:** `planStep(state, observation)` / `applyFilePatch(patch, content)`
- **Groups:** Unified diff parse · Hunk apply · Test gate · Rollback flag
- **Target:** 5 exercises

---

### Neural Networks (5)

#### 31. [x] `lstm` — LSTM
- **Source:** `nn`
- **Anchor:** `lstmCell(x, hPrev, cPrev, W)` — full cell with gates
- **Groups:** Forget gate · Input gate · Candidate cell · Output gate · Hidden update
- **Target:** 6–8 exercises

#### 32. [x] `conv2d` — Conv2D
- **Source:** `nn`
- **Anchor:** `conv2d(image, kernel, stride, pad)`
- **Groups:** Output size formula · One patch dot product · Stride step · Full channel sum
- **Target:** 6–8 exercises

#### 33. [x] `max-pooling` — Max Pooling
- **Source:** `nn`
- **Anchor:** `maxPool2d(patch)` / full map pooling
- **Groups:** Window max · Index track · Stride grid · Output shape
- **Target:** 4–5 exercises

#### 34. [x] `conv-relu` — Conv + ReLU
- **Source:** `nn`
- **Anchor:** `convReluForward(x, w, b)` — conv then `Math.max(0, z)`
- **Groups:** Conv dot · Add bias · ReLU clip · Combined forward
- **Target:** 5 exercises

#### 35. [x] `initialization` — Initialization
- **Source:** `nn`
- **Anchor:** `xavierLimit(fanIn, fanOut)` / `heStd(fanIn)`
- **Groups:** Fan-in/out · Xavier bound · He std · Sample weight scale check
- **Target:** 4–5 exercises

---

### Advanced Models (2)

#### 36. [x] `vae` — Variational Autoencoder
- **Source:** `nn` (new VAE group)
- **Anchor:** `vaeLoss(recon, x, mu, logvar)` — recon + KL
- **Groups:** Reconstruction MSE · KL closed form · Reparameterize z · Combined ELBO
- **Target:** 6 exercises

#### 37. [x] `multimodal-llm` — Multimodal LLM
- **Source:** `nn` + `lm`
- **Anchor:** `projectImageTokens(imageGrid, projector)` — align vision to LM dim
- **Groups:** Patch flatten · Linear project · Insert positions · Attention mask
- **Target:** 5–6 exercises

---

### Math Fundamentals (1)

#### 38. [x] `gradient-descent` — Gradient Descent
- **Category:** Math Fundamentals
- **Note:** mapping exists but points at wrong source (`linear` vs `nn`). Fix mapping to `{ source: 'nn', groups: ['Gradient descent least squares', 'Derivative basics'] }` and ensure `Derivative basics` group exists in `linearAlgebraCodeLabs.js` OR move all GD exercises to linear with correct group names.
- **Anchor:** `gradientDescentStep(w, grad, lr)` on full weight vector
- **Groups:** Prediction error · One-weight gradient · Full gradient vector · Parameter update
- **Target:** 6–8 exercises (many already in `neuralNetworkCodeLabs.js` — wire, don't duplicate)

---

### Core ML (9)

#### 39. [x] `train-validation-test-split` — Train / Validation / Test Split
- **Source:** `core` (new)
- **Anchor:** `splitDataset(indices, trainFrac, valFrac)`
- **Groups:** Shuffle · Train slice · Val slice · Test remainder · No leakage check
- **Target:** 5 exercises

#### 40. [x] `cross-validation` — Cross-Validation & Data Leakage
- **Source:** `core`
- **Anchor:** `kFoldIndices(n, k, fold)`
- **Groups:** Fold size · Train/val masks · Leakage guard (fit scaler on train only)
- **Target:** 5–6 exercises

#### 41. [x] `data-leakage-deep-dive` — Data Leakage Deep Dive
- **Source:** `core`
- **Anchor:** `targetCorruptsFeature(y, Xcol, threshold)` / pipeline order check
- **Groups:** Label in features · Future info · Group split · Preprocessing leak
- **Target:** 4–5 exercises

#### 42. [x] `feature-scaling-preprocessing` — Feature Scaling & Preprocessing
- **Source:** `core`
- **Anchor:** `standardize(X, mean, std)` / `minMaxScale(x, min, max)`
- **Groups:** Mean · Variance · Transform · Inverse (optional)
- **Target:** 5 exercises

#### 43. [x] `k-means` — K-Means Clustering
- **Source:** `core`
- **Anchor:** `kMeansAssign(x, centroids)` / `kMeansUpdate(points, labels, k)`
- **Groups:** Distance to centroid · Assignment · Mean update · One iteration
- **Target:** 6–7 exercises

#### 44. [x] `knn-naive-bayes-svm` — kNN, Naive Bayes, and SVM
- **Source:** `core`
- **Anchor:** three mini-functions: `knnPredict(...)`, `naiveBayesClass(...)`, `hingeLoss(...)`
- **Groups:** kNN vote · Gaussian NB likelihood · Log-posterior pick · SVM hinge
- **Target:** 6–8 exercises (2 per algorithm)

#### 45. [x] `tree-ensembles` — Tree Ensembles
- **Source:** `core`
- **Anchor:** `giniImpurity(counts)` / `majorityVote(treeVotes)`
- **Groups:** Gini · Split gain stub · Bagging average · Boosting weight
- **Target:** 5–6 exercises

#### 46. [x] `time-series-forecasting-track` — Time Series & Forecasting
- **Source:** `core`
- **Anchor:** `rollingMean(series, window)` / `expSmooth(series, alpha)`
- **Groups:** Window slice · Rolling stat · Lag feature · One-step forecast
- **Target:** 5 exercises

#### 47. [x] `data-engineering-for-ml-track` — Data Engineering for ML
- **Source:** `core`
- **Anchor:** `dedupeByKey(rows, key)` / `missingImputeMedian(col)`
- **Groups:** Null count · Median impute · Dedup key · Train-only stats
- **Target:** 4–5 exercises

---

### Model Reliability (4)

#### 48. [x] `model-interpretability` — Model Interpretability
- **Source:** `eval`
- **Anchor:** `shapleySingleFeature(fWith, fWithout)` / `integratedGradStep(...)`
- **Groups:** Marginal contrib · Sum to delta · Baseline path · Feature attribution vector
- **Target:** 5 exercises

#### 49. [x] `model-fairness` — Model Fairness
- **Source:** `eval`
- **Anchor:** `demographicParityGap(yPred, group)` / `equalizedOddsDiff(...)`
- **Groups:** Group rate · Parity gap · TPR gap · Threshold adjust stub
- **Target:** 4–5 exercises

#### 50. [x] `uncertainty-estimation` — Uncertainty Estimation
- **Source:** `eval`
- **Anchor:** `entropyFromProbs(p)` / `mcDropoutStd(preds)`
- **Groups:** Predictive entropy · Variance across samples · CI from std · Selective abstain
- **Target:** 5 exercises

#### 51. [x] `ml-security-robustness-track` — ML Security & Robustness
- **Source:** `eval`
- **Anchor:** `fgmStep(x, grad, epsilon)` / `robustAccuracy(clean, adv)`
- **Groups:** Gradient sign step · Perturbation clip · Robust acc · Detection threshold
- **Target:** 5 exercises

---

### Probability & Statistics (6)

#### 52. [x] `probability-distributions` — Probability Distributions
- **Source:** `prob` (new)
- **Anchor:** `gaussianPdf(x, mu, sigma)` / `bernoulliPmF(k, p)`
- **Groups:** PDF eval · Normalization check · Bernoulli mean · Sample log-lik
- **Target:** 5–6 exercises

#### 53. [x] `conditional-probability` — Conditional Probability
- **Source:** `prob`
- **Anchor:** `conditional(aAndB, bProb)` / `bayesNumerator(likelihood, prior)`
- **Groups:** P(A|B) formula · Chain rule · Independence check · Table row normalize
- **Target:** 5 exercises

#### 54. [x] `bayes-rule-ml` — Bayes Rule for ML
- **Source:** `prob`
- **Anchor:** `bayesPosterior(prior, likelihood, evidence)`
- **Groups:** Numerator · Evidence sum · Posterior normalize · Log-space (optional)
- **Target:** 5 exercises

#### 55. [x] `maximum-likelihood-estimation` — Maximum Likelihood Estimation
- **Source:** `prob`
- **Anchor:** `logLikBernoulli(data, p)` / `mleGaussianMean(data)`
- **Groups:** Per-sample log · Sum log-lik · Argmax p · Gaussian mean MLE
- **Target:** 5–6 exercises

#### 56. [x] `expected-value-variance` — Expected Value & Variance
- **Source:** `prob`
- **Anchor:** `expectedValue(outcomes, probs)` / `variance(outcomes, probs)`
- **Groups:** Weighted sum · Mean shortcut · Squared dev · Variance formula
- **Target:** 5 exercises

#### 57. [x] `spearman-correlation` — Spearman Correlation
- **Source:** `prob`
- **Anchor:** `rankData(values)` / `spearmanRho(x, y)`
- **Groups:** Rank with ties · Pearson on ranks · Rho in [-1,1] · Monotonic check
- **Target:** 5 exercises

---

### Reinforcement Learning (12)

#### 58. [x] `rl-foundations` — RL Foundations
- **Source:** `rl` (new)
- **Anchor:** `discountedReturn(rewards, gamma)` / `episodeReturn(traj)`
- **Groups:** One-step return · Discount chain · Finite horizon · Policy value stub
- **Target:** 5 exercises

#### 59. [x] `mdp-formalism` — MDP Formalism
- **Source:** `rl`
- **Anchor:** `bellmanExpectation(V, P, R, gamma, s)`
- **Groups:** Transition sum · Reward term · Gamma discount · Vector backup
- **Target:** 5–6 exercises

#### 60. [x] `value-iteration` — Value Iteration
- **Source:** `rl`
- **Anchor:** `valueIterationStep(V, P, R, gamma)`
- **Groups:** Max over actions · Backup once · Convergence delta · Greedy policy extract
- **Target:** 5–6 exercises

#### 61. [x] `policy-iteration` — Policy Iteration
- **Source:** `rl`
- **Anchor:** `policyEvalStep(V, pi, P, R, gamma)` / `policyImprove(pi, Q)`
- **Groups:** Eval backup · Q from V · Greedy improve · Swap policy
- **Target:** 5–6 exercises

#### 62. [x] `q-learning` — Q-Learning
- **Source:** `rl`
- **Anchor:** `qLearningUpdate(Q, s, a, r, sNext, alpha, gamma)`
- **Groups:** TD target · Max next Q · Learning rate blend · Tabular one-step
- **Target:** 5–6 exercises

#### 63. [x] `rl-exploration` — Exploration vs Exploitation
- **Source:** `rl`
- **Anchor:** `epsilonGreedyAction(Qs, epsilon)` / `ucbScore(mean, n, t, c)`
- **Groups:** Greedy pick · Random branch · Epsilon mix · UCB formula
- **Target:** 4–5 exercises

#### 64. [x] `policy-gradients` — Policy Gradients
- **Source:** `rl`
- **Anchor:** `reinforceGradient(logProb, reward, baseline)`
- **Groups:** Log-prob weight · Baseline subtract · Return multiply · Vector grad stub
- **Target:** 5 exercises

#### 65. [x] `actor-critic` — Actor-Critic
- **Source:** `rl`
- **Anchor:** `advantage(tdTarget, value)` / `actorLoss(logProb, advantage)`
- **Groups:** TD error · Advantage · Critic MSE · Actor log grad
- **Target:** 5–6 exercises

#### 66. [x] `reward-shaping` — Reward Shaping
- **Source:** `rl`
- **Anchor:** `shapedReward(r, s, sNext, gamma, phi)`
- **Groups:** Potential phi · Shaping term · Gamma cancel · Total step reward
- **Target:** 4–5 exercises

#### 67. [x] `grpo-reasoning` — GRPO: Learning to Reason from Groups of Answers
- **Source:** `rl` (high-quality grpo logic)
- **Anchor:** `grpoRelativeReward(scores)` / `groupNormalize(rewards)`
- **Groups:** Group mean · Relative reward · Clip extremes · Policy ratio tie-in
- **Target:** 5 exercises

#### 68. [x] `dapo-reasoning-rl` — DAPO: Fixing GRPO at Scale
- **Source:** `rl`
- **Anchor:** `dapoClipReward(r, low, high)` / `decoupledAdv(...)`
- **Groups:** Reward clip · Decoupled baseline · Length norm · Batch scale guard
- **Target:** 5 exercises

#### 69. [x] `markov-chains` — Markov Chains
- **Source:** `rl` or `prob`
- **Anchor:** `markovStep(dist, P)` / `stationaryCheck(pi, P)`
- **Groups:** One-step multiply · n-step power · Stationary · Absorbing check
- **Target:** 5–6 exercises

---

### Algorithms & Data Structures (2)

#### 70. [x] `bloom-filter` — Bloom Filter
- **Source:** `algo` (new)
- **Anchor:** `bloomInsert(bits, item, hashes)` / `bloomMaybeContains(bits, item, hashes)`
- **Groups:** Hash positions · Set bits · Query all bits · False positive note (structural only)
- **Target:** 5 exercises

#### 71. [x] `pagerank` — PageRank
- **Source:** `algo`
- **Anchor:** `pagerankStep(ranks, links, damping)`
- **Groups:** Out-link normalize · Dangling mass · Damping teleport · One iteration
- **Target:** 5–6 exercises

---

### Diffusion Models (SD3) (12)

#### 72. [x] `diffusion-basics` — Diffusion Basics
- **Source:** `diffusion` (new)
- **Anchor:** `forwardDiffuse(x0, noise, t, alphasBar)`
- **Groups:** Noise scale · Alpha bar · Sample x_t · Signal-to-noise
- **Target:** 5–6 exercises

#### 73. [x] `diffusion-sampling` — Diffusion Sampling
- **Source:** `diffusion`
- **Anchor:** `ddpmReverseStep(xt, epsHat, t, betas)`
- **Groups:** Posterior mean · Noise coeff · Step t→t-1 · Final denoise
- **Target:** 6 exercises

#### 74. [x] `classifier-free-guidance` — Classifier-Free Guidance
- **Source:** `diffusion`
- **Anchor:** `cfgCombine(epsCond, epsUncond, scale)`
- **Groups:** Uncond branch · Cond branch · Scale mix · Zero-scale identity
- **Target:** 4–5 exercises

#### 75. [x] `unet-vs-dit` — U-Net vs DiT
- **Source:** `diffusion`
- **Anchor:** `unetSkipShape(h, level)` / `ditPatchify(image, patch)`
- **Groups:** U-Net down/up · Skip concat · Patch tokens · Block count compare
- **Target:** 4–5 exercises

#### 76. [x] `sd3-overview` — SD3 Architecture Overview
- **Source:** `diffusion`
- **Anchor:** `sd3LatentShape(pixels, vaeScale)` — pipeline shape bookkeeping
- **Groups:** VAE downscale · Latent channels · Text seq len · Joint block count
- **Target:** 4 exercises

#### 77. [x] `flow-matching` — Flow Matching
- **Source:** `diffusion`
- **Anchor:** `flowPath(x0, x1, t)` / `flowVelocity(x0, x1)`
- **Groups:** Linear interp · Time derivative · Target velocity · One Euler step
- **Target:** 5–6 exercises

#### 78. [x] `diffusion-vae` — VAE for Diffusion
- **Source:** `diffusion` + `nn` VAE group
- **Anchor:** `vaeLatentScale(latent, scalingFactor)`
- **Groups:** Encode scale · Decode unscale · KL in latent · Recon for diffusion pipeline
- **Target:** 5 exercises

#### 79. [x] `tokenizer-bpe` — BPE & Unigram Tokenizers
- **Source:** `diffusion` or `lm`
- **Anchor:** `bpeMerge(tokens, pair)` / `bpeCountPairs(corpus)`
- **Groups:** Pair count · Merge rule · Token list update · Decode bytes
- **Target:** 5–6 exercises

#### 80. [x] `clip-encoder` — CLIP Text Encoder
- **Source:** `diffusion`
- **Anchor:** `clipTextPool(hiddenStates, eosIdx)`
- **Groups:** EOS index · Pool vector · L2 normalize · Contrastive logit stub
- **Target:** 4–5 exercises

#### 81. [x] `t5-encoder` — T5 Text Encoder
- **Source:** `diffusion`
- **Anchor:** `t5EncoderMask(padIds, seqLen)`
- **Groups:** Pad mask · Attention bias · Last hidden slice · Cross-attn ready
- **Target:** 4–5 exercises

#### 82. [x] `joint-attention` — Joint Attention
- **Source:** `diffusion`
- **Anchor:** `jointAttentionQKV(text, image, W)` — fused QKV for multimodal SD3
- **Groups:** Concat Q · Block-sparse mask · Single softmax · Split outputs
- **Target:** 5–6 exercises

#### 83. [x] `dit` — DiT (Diffusion Transformer)
- **Source:** `diffusion`
- **Anchor:** `ditBlock(x, tEmb, cond)` — adaLN + attention + MLP
- **Groups:** Time embed inject · adaLN scale/shift · Self-attn · MLP residual
- **Target:** 6–7 exercises

---

## Suggested batching order (for agents)

1. **Quick wins:** `gradient-descent` (wire existing nn groups), `q-learning`, `k-means`, `bloom-filter`, `pagerank`
2. **Neural nets cluster:** `lstm`, `conv2d`, `max-pooling`, `conv-relu`, `initialization`, `vae`
3. **Probability cluster:** all 6 `probability-stats` lessons
4. **RL cluster:** all 12 `reinforcement-learning` lessons
5. **Diffusion cluster:** all 12 `diffusion-models` lessons
6. **NLP + transformers:** word2vec → fine-tuning (16 lessons)
7. **Frontier + papers:** remaining 14 lessons

---

## Verification command

```bash
cd unified-app && npm test
```

Key assertions in `lessonCodeLabs.test.mjs`:

- No lesson exposes placeholder title `Recognize the lesson keyword`
- Every exercise has all required fields and `TODO` in `starterCode`
- Every `solution` passes embedded `testCode`
- `getLessonCodeLabExercises('word2vec')` returns `[]` until real exercises land, then `> 0`

---

## Single-lesson sub-prompt template

```text
Generate Code Lab exercises for lesson: {lessonId} ({lessonName}).

Read the lesson animation at unified-app/src/animations/{lessonId}/ and the concept map entry.

Follow all HARD RULES in unified-app/docs/generate-missing-code-labs-prompt.md.

Deliver:
1. Exercise groups (names + count)
2. Complete exercise objects for the source library
3. LESSON_GROUP_MAPPINGS entry
4. Confirmation that solutions pass tests
```

Replace `{lessonId}` with any id from the enumerated list above.
