import { cardSet } from './learningCardUtils.js';

export const QWEN_LEARNING_CARD_OVERRIDES = Object.freeze({
  'qwen-hybrid-qsa': cardSet(
    'Hybrid QSA combines a compact running memory with selective access to detailed blocks of earlier context.',
    'Think of reading a long case file with two aids: a notebook for the broad story and an index that jumps back to a few exact passages when precision matters.',
    'A sparse read budget is approximately min(visible tokens, block size × selected blocks); saving reads is not the same as guaranteeing the same latency speedup.',
    'Increase selected blocks and compare token positions read, long-range evidence recall, and the extra work needed by the indexer.',
    'Mistake to avoid: fewer KV reads do not prove the full system is equally faster; indexing, projections, cache layout, and other layers still cost time.',
    'Try it: choose a tiny block budget for a fact buried far back in context and predict whether memory traffic, retrieval accuracy, or both improve.',
  ),
  'qwen-gated-residual': cardSet(
    'A gated residual stream controls what a branch reads from the current representation and how strongly its update is written back.',
    'Imagine a shared notebook: read gates decide which details a worker sees; a write gate decides how loudly the worker edits the shared page.',
    'A useful toy is x_next = x + w × F(r ⊙ x), separating element-wise read gating from branch-level write strength.',
    'Set the write gate to zero, then change only one read coordinate and trace which output coordinates can still move.',
    'Mistake to avoid: making a branch update small does not mean the branch computation was skipped or its FLOPs disappeared.',
    'Try it: with identity F, compute one gated update by hand before moving the read and write sliders.',
  ),
  'qwen-ngram-embedding': cardSet(
    'N-gram embeddings add learned lookup capacity for short local token patterns such as bigrams or trigrams.',
    'Think of a phrasebook indexed by token fragments: the address is deterministic, but the vector stored at that address is learned.',
    'A toy hash repeatedly maps token IDs into one table row; collisions mean different n-grams can share the same learned row.',
    'Keep one token fixed, vary the next token, and watch when two different n-grams collide under a small hash table.',
    'Mistake to avoid: a hash row is not a human-readable fact slot, and moving the table to host memory trades accelerator capacity for transfer bandwidth and latency.',
    'Try it: double the number of table buckets and predict whether a specific collision must disappear or only becomes less likely overall.',
  ),
  'qwen-multimodal-moe': cardSet(
    'A multimodal sparse MoE separates stored model capacity from the smaller subset of experts activated for each token or representation.',
    'Think of a huge workshop that owns many specialist stations while each job visits only a few of them; the building size and the work per job are different quantities.',
    'Routing selects top-k experts and combines their outputs, while total memory must still account for stored experts, shared components, caches, activations, and modality encoders.',
    'Increase the selected-expert budget in the toy model and compare active work with the unchanged number of stored expert slots.',
    'Mistake to avoid: a low active-parameter count does not mean the full model fits in memory as if only those active weights existed.',
    'Try it: keep the expert count fixed but skew most tokens toward one expert and predict what happens to device utilization and communication balance.',
  ),
  'qwen-training-recipe': cardSet(
    'A training recipe coordinates optimizer choice, token batch size, learning-rate schedules, and empirical scaling experiments.',
    'Treat training like budgeting work per update: bigger token batches mean fewer optimizer steps for the same token budget, not fewer processed tokens.',
    'Optimizer steps are approximately ceil(total training tokens / tokens per optimizer step), while learning-rate and batch-size schedules remain separate controls.',
    'Double tokens per optimizer step for a fixed dataset and compare update count, work per update, and what still must be measured before claiming faster training.',
    'Mistake to avoid: fewer optimizer steps are not automatically fewer FLOPs or better convergence, and removing batch-size warmup says nothing by itself about learning-rate warmup.',
    'Try it: compute step counts for two batch sizes, then list the measurements needed for a fair optimizer comparison beyond the raw count.',
  ),
  'qwen-reasoning-control': cardSet(
    'Reasoning control allocates more or less inference effort depending on how difficult the task is and how expensive failure or retry would be.',
    'A fast first attempt can be wasteful if it fails repeatedly; a slower careful attempt can finish the whole task sooner.',
    'In a simplified independent-retry model, expected time to success is attempt time divided by success probability, t/p.',
    'Compare a low-effort policy with cheap attempts and many retries against a higher-effort policy with slower but more reliable attempts.',
    'Mistake to avoid: lower per-response latency is not the same as lower latency per successful task, and reasoning effort is separate from whether thinking is enabled at all.',
    'Try it: find the success probability where a 2-second low-effort attempt ties a 5-second reliable attempt in expected completion time.',
  ),
});
