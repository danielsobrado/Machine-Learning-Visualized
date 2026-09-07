// Optional deliberate practice: four numerical skills per chapter, with fresh values.
// These are toy arithmetic exercises, never reported model measurements.
const round = n => Number(n.toFixed(3));
const numeric = (prompt, answer, wrongA, wrongB, explanation) => [prompt, [String(round(answer)), String(round(wrongA)), String(round(wrongB))], 0, explanation];
const generators = {
  'qwen-hybrid-qsa': [
    n => numeric(`Toy read budget: ${n * 32} visible tokens, blocks of 4, and ${n + 1} selected full blocks. How many token positions are read?`, (n + 1) * 4, n + 1, n * 32, `Multiply selected full blocks by four: ${(n + 1) * 4}. This counts detailed reads, not latency or cache storage.`),
    n => numeric(`A causal query is at position ${n * 4 + 1}. The selected block spans [${n * 4}, ${n * 4 + 4}). How many positions in that block are allowed?`, 2, 4, 1, 'The block start and the query itself are allowed. The two positions after the query must be masked.'),
    n => numeric(`A toy index ranks ${n * 8} blocks. Reading ${n * 2} equal full blocks covers what percentage of their tokens?`, 25, 50, 75, 'The ratio is 2n / 8n = one quarter, or 25%. Equal block lengths make the block and token fractions match.'),
    n => numeric(`A toy cache has ${n * 4 + 1} visible tokens. You request ${n + 2} blocks of four. After capping reads to available tokens, how many positions can be read?`, n * 4 + 1, (n + 2) * 4, n * 4, 'The requested budget exceeds the visible context. Include the partial final block and cap at the actual token count.'),
  ],
  'qwen-gated-residual': [
    n => numeric(`Identity-transform toy: x=${n * 4}, read=0.5, write=0.25. What is x_next?`, n * 4.5, n * 0.5, n * 6, 'Read halves x; write quarters that read, adding x/8 to the original x. Keep the residual addition.'),
    n => numeric(`Identity-transform toy: x=${n + 2}, read=1, write=0. What value remains after the residual update?`, n + 2, 0, (n + 2) * 2, 'Zero write cancels the update, not the residual. The input representation remains unchanged.'),
    n => numeric(`A toy branch update is [${n * 2}, ${n * 6}] before a scalar write gate of 0.5. What is the second written coordinate?`, n * 3, n * 6, n, 'A branch scalar applies the same multiplier to every update coordinate. Half of 6n is 3n.'),
    n => numeric(`Two toy reads are ${n * 4} × 0.25 and ${n * 2} × 0.5. What is their sum before any sublayer transformation?`, n * 2, n, n * 6, 'Each gated read equals n. Add the reads to get 2n; do not add the original ungated values.'),
  ],
  'qwen-ngram-embedding': [
    n => numeric(`Using h=(31h+id) mod 8 from h=0, which row does [${n}, 2] select?`, (31 * n + 2) % 8, (31 * n + 2) % 8 + 8, (31 * n + 2) % 8 + 16, 'Apply the modulo after each update. Row addresses must stay between zero and seven in this toy table.'),
    n => numeric(`A sequence has ${n + 2} token IDs. With no padding, how many complete causal bigrams can it supply?`, n + 1, n + 2, n, 'Every position except the first ends one complete bigram. Therefore a length L sequence has L−1 such pairs.'),
    n => numeric(`You fetch ${n + 1} distinct rows, each holding 128 values at two bytes each. Ignoring overhead, how many bytes move?`, (n + 1) * 256, (n + 1) * 128, (n + 1) * 512, 'Each row is 128 × 2 = 256 bytes. Multiply by distinct requested rows; transfer overhead is excluded.'),
    n => numeric(`A toy table has ${n * 1000} rows with 16 values at one byte each. How many decimal kB store the raw values?`, n * 16, n, n * 32, 'Raw bytes are rows times dimension times bytes per value. Divide by 1,000 for decimal kilobytes.'),
  ],
  'qwen-multimodal-moe': [
    n => numeric(`A toy router selects ${n} of ${n * 16} available routed experts. What percentage is selected?`, 6.25, 16, 62.5, 'The routed selection fraction is 1/16 = 6.25%. This does not count shared layers or total active parameters.'),
    n => numeric(`Toy storage: ${n * 2} billion main weights plus ${n} billion table values at two bytes each. How many decimal GB of raw values?`, n * 6, n * 2, n * 3, 'Add separately stored components before multiplying by precision: (2n+n) × 2 = 6n GB.'),
    n => numeric(`A toy batch has ${n * 8} tokens and routes each to two experts. How many token-to-expert assignments exist before adding any shared expert?`, n * 16, n * 8, n * 4, 'Each token creates two routed assignments. Multiply tokens by routed top-k, excluding the separate shared path.'),
    n => numeric(`Four devices receive ${n * 2}, ${n * 2}, ${n * 2} and ${n * 6} equally costly expert jobs. With equal rates, how many jobs determine the slowest device time?`, n * 6, n * 3, n * 12, 'The critical device has the largest workload, 6n. The average is 3n, but the batch must wait for the slowest device.'),
  ],
  'qwen-training-recipe': [
    n => numeric(`A toy run processes ${n * 1000} tokens at 250 tokens per optimizer update. How many updates are needed?`, n * 4, n, n * 2, 'Divide the token budget by tokens per update. Here the division is exact and produces 4n updates.'),
    n => numeric(`A toy run processes ${n * 256 + 1} tokens at batch 256, retaining a partial last batch. How many optimizer updates?`, n + 1, n, n + 2, 'The final one token needs another update. Round the division upward rather than dropping the remainder.'),
    n => numeric(`A toy optimizer update accumulates ${n + 1} microbatches of 64 tokens on one device. How many tokens contribute to that update?`, (n + 1) * 64, 64, (n + 1) * 128, 'Gradient accumulation combines all of the microbatches before one parameter update; multiply their count by 64.'),
    n => numeric(`A two-phase toy run uses ${n * 128} tokens at batch 32, then ${n * 128} at batch 128. How many total optimizer updates?`, n * 5, n * 2, n * 8, 'The first phase uses 4n updates and the second uses n. Sum the phase counts; do not divide all tokens by only the final batch.'),
  ],
  'qwen-reasoning-control': [
    n => numeric(`Independent-retry toy: each attempt costs ${n + 1} seconds and succeeds with probability 0.5. What is expected time to success in seconds?`, (n + 1) * 2, (n + 1) / 2, n + 1, 'Expected attempts are 1/p = two. Multiply attempt cost by two; this assumes unlimited independent retries.'),
    n => numeric(`A toy low-effort attempt costs ${n} seconds. A reliable alternative costs ${n * 4} seconds. At what success probability does low effort tie, using t/p?`, 0.25, 0.5, 0.75, 'Set n/p equal to 4n. The attempt cost cancels and p = 1/4. These are invented costs, not model benchmarks.'),
    n => numeric(`A measured toy evaluation records ${n * 60} seconds for ${n * 10} successfully completed tasks. What is seconds per successful task?`, 6, 10, 60, 'Divide total measured time by completed successes, keeping failed-attempt time in the numerator.'),
    n => numeric(`An independent-retry toy has success probability 0.25 and ${n + 1} tokens of cost per attempt. What is expected token cost to success?`, (n + 1) * 4, n + 1, (n + 1) / 4, 'One quarter success implies four attempts on average. Token cost follows the same constant-cost retry arithmetic.'),
  ],
};
export function makeQwenDrills(id) {
  return Array.from({ length: 94 }, (_, i) => {
    const [prompt, choices, , explanation] = generators[id][i % 4](Math.floor(i / 4) + 1);
    const answerIndex = i % 3;
    const correct = choices.shift();
    choices.splice(answerIndex, 0, correct);
    return { id: `${id}-${String(i + 7).padStart(3, '0')}-drill`, prompt, choices, answerIndex, explanation, level: 'Application', skill: 'transfer', countsForCompletion: false };
  });
}
