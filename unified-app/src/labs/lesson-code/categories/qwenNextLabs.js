import { chapters } from '../../../data/qwenNext.js';

// Executable JavaScript exercises use the existing sandboxed lesson-code runner.
const specs = [
  [
    ['Count selected token reads', 'Return the smaller of context and blockSize times budget. Inputs are nonnegative integers; blockSize is positive.', 'selectedReads(context, blockSize, budget)', 'return Math.min(context, blockSize * budget);', [['full blocks', [32, 4, 2], 8], ['cap at context', [17, 4, 8], 17], ['empty context', [0, 4, 2], 0]]],
    ['Apply causality to a selected block', 'Return the allowed position indices in [start, end), restricted to positions no later than query. Inputs are nonnegative integers with start <= end.', 'causalBlock(start, end, query)', 'return Array.from({ length: Math.max(0, Math.min(end, query + 1) - start) }, (_, i) => start + i);', [['boundary', [12, 16, 13], [12, 13]], ['future block', [8, 12, 3], []], ['whole block', [0, 4, 9], [0, 1, 2, 3]]]],
  ],
  [
    ['Trace a residual update', 'Use identity F. Return x + write * (read element-wise times x). Vectors have matching lengths; write is a scalar.', 'residual(x, read, write)', 'return x.map((v, i) => v + write * read[i] * v);', [['worked example', [[2, 4], [0.5, 0.25], 0.5], [2.5, 4.5]], ['zero write', [[2, 4], [1, 1], 0], [2, 4]], ['different coordinates', [[3, 2], [1, 0.5], 0.2], [3.6, 2.2]]]],
    ['Combine two read branches', 'Return rA element-wise times a plus rB element-wise times b. All vectors have matching lengths. This isolates reading, not the complete Qwen architecture.', 'combineReads(a, b, rA, rB)', 'return a.map((v, i) => rA[i] * v + rB[i] * b[i]);', [['mixed', [[2, 4], [6, 8], [0.5, 0], [0, 0.5]], [1, 4]], ['closed', [[2], [6], [0], [0]], [0]], ['sum', [[2], [6], [1], [1]], [8]]]],
  ],
  [
    ['Hash a token n-gram', 'Starting with h=0, update h=(31*h+id) modulo buckets for each ID. IDs are nonnegative integers and buckets is positive. This is a toy hash.', 'ngramHash(ids, buckets)', 'return ids.reduce((h, id) => (31 * h + id) % buckets, 0);', [['bigram', [[1, 2], 8], 1], ['collision', [[1, 10], 8], 1], ['order', [[2, 1], 8], 7], ['empty', [[], 8], 0]]],
    ['Build causal bigrams', 'Return every consecutive pair of token IDs. Omit the first position because it has no complete bigram; do not add padding.', 'bigrams(ids)', 'return ids.slice(1).map((id, i) => [ids[i], id]);', [['three tokens', [[4, 7, 2]], [[4, 7], [7, 2]]], ['one token', [[4]], []], ['empty', [[]], []]]],
  ],
  [
    ['Estimate raw weight storage', 'Given a list of component sizes in billions of parameters and bytes per value, return decimal GB. Ignore all metadata and runtime memory explicitly.', 'weightGB(components, bytesPerValue)', 'return components.reduce((sum, value) => sum + value, 0) * bytesPerValue;', [['separate components', [[125, 51, 4], 2], 360], ['table only', [[51], 1], 51], ['empty', [[], 2], 0]]],
    ['Choose top routed experts', 'Return the indices of the k largest scores. Break ties by lower index. k is a nonnegative integer and may exceed the number of scores.', 'routeExperts(scores, k)', 'return scores.map((score, id) => ({ score, id })).sort((a, b) => b.score - a.score || a.id - b.id).slice(0, k).map(e => e.id);', [['rank', [[0.2, 0.8, 0.5], 2], [1, 2]], ['ties', [[1, 1, 0], 1], [0]], ['zero', [[1, 2], 0], []], ['cap', [[2], 4], [0]]]],
  ],
  [
    ['Count optimizer updates', 'Return the ceiling of tokens / batch. Tokens are nonnegative and batch is positive; retain the partial final batch.', 'updates(tokens, batch)', 'return Math.ceil(tokens / batch);', [['exact', [1024, 256], 4], ['partial', [10000, 3000], 4], ['zero', [0, 64], 0]]],
    ['Account for a batch schedule', 'Each phase has tokens and batch fields. Sum the update counts for all phases, rounding up each phase independently. Tokens are nonnegative and batch is positive.', 'scheduleSteps(phases)', 'return phases.reduce((sum, p) => sum + Math.ceil(p.tokens / p.batch), 0);', [['warmup toy', [[{ tokens: 512, batch: 64 }, { tokens: 512, batch: 256 }]], 10], ['constant', [[{ tokens: 1024, batch: 256 }]], 4], ['empty', [[]], 0]]],
  ],
  [
    ['Price independent retries', 'Return seconds / p for independent attempts, or Infinity if p=0. seconds is nonnegative and p is between zero and one. This is not a Qwen performance forecast.', 'expectedTime(seconds, p)', 'return p === 0 ? Infinity : seconds / p;', [['retry', [2, 0.25], 8], ['certain', [5, 1], 5], ['impossible', [2, 0], Infinity]]],
    ['Choose a measured effort policy', 'Return the name with the smallest seconds / p, excluding p=0. Return null if none can succeed. Each policy has name, seconds and p; keep the first on a tie.', 'choosePolicy(policies)', 'const possible = policies.filter(p => p.p > 0);\n  possible.sort((a, b) => a.seconds / a.p - b.seconds / b.p);\n  return possible[0]?.name ?? null;', [['retry reversal', [[{ name: 'low', seconds: 2, p: 0.25 }, { name: 'xhigh', seconds: 5, p: 1 }]], 'xhigh'], ['easy task', [[{ name: 'low', seconds: 2, p: 1 }, { name: 'medium', seconds: 3, p: 1 }]], 'low'], ['impossible', [[{ name: 'low', seconds: 2, p: 0 }]], null]]],
  ],
];

function literal(value) {
  return value === Infinity ? 'Infinity' : JSON.stringify(value);
}
export const QWEN_NEXT_LABS = chapters.map((chapter, chapterIndex) => ({
  lessonId: chapter.id, title: chapter.title, categoryId: 'frontier-llms',
  exercises: specs[chapterIndex].map(([title, objective, signature, body, cases], index) => {
    const name = signature.split('(')[0];
    return {
      id: `${chapter.id}-code-${index + 1}`, lessonId: chapter.id, group: chapter.title,
      stepLabel: `Practice ${index + 1}`, title, objective, concept: chapter.formula,
      difficulty: index ? 'core' : 'warmup', language: 'javascript',
      starterCode: `function ${signature} {\n  // TODO: ${objective}\n  return null;\n}`,
      solution: `function ${signature} {\n  ${body}\n}`,
      hints: [chapter.worked, 'Work one of the test cases by hand before writing the return expression.'],
      explanation: `${objective} ${chapter.trap}`,
      testCode: `const results = [];\nfunction check(name, actual, expected) {\n  const passed = Object.is(actual, expected) || (Array.isArray(actual) && Array.isArray(expected) && JSON.stringify(actual) === JSON.stringify(expected));\n  results.push({ name, actual, expected, passed });\n}\n${cases.map(([label, args, expected]) => `check(${JSON.stringify(label)}, ${name}(${args.map(literal).join(', ')}), ${literal(expected)});`).join('\n')}\nreturn results;`,
    };
  }),
}));
