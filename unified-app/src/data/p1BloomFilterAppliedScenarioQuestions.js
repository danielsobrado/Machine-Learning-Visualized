export const P1_BLOOM_FILTER_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'bloom-filter': [
    {
      id: 'bloom-fpr-worked',
      level: 'calculation',
      relatedComparison: 'bit-budget-load-hash-count-vs-false-positive-rate',
      scenario: 'A Bloom filter has m = 10,000 bits, expects n = 1,000 inserted keys, and uses k = 7 hash positions per key. Use the standard approximation p ~= (1 - exp(-kn/m))^k. Here kn/m = 0.7 and exp(-0.7) is about 0.497.',
      prompt: 'What approximate false-positive rate should capacity planning expect at this load?',
      choices: [
        'About 0.82%, because (1 - 0.497)^7 is about 0.0082',
        'About 7%, because the false-positive rate is approximately k divided by n',
        'About 50.3%, because 1 - exp(-0.7) is already the final query false-positive probability',
      ],
      answerIndex: 0,
      explanation: 'A query is a false positive only when all seven checked positions are already set. The probability that one queried bit is set is about 1 - 0.497 = 0.503, so p is approximately 0.503^7 = 0.0082, or 0.82%. Using the single-bit fill probability directly would overstate the query error rate.',
      misconceptionTested: 'The probability that one Bloom-filter bit is set can be used directly as the false-positive probability for a query that checks multiple hash positions.',
    },
    {
      id: 'bloom-optimal-k-worked',
      level: 'calculation',
      relatedComparison: 'too-few-hashes-vs-too-many-hashes-vs-optimal-hash-count',
      scenario: 'A service allocates m = 12,000 bits for n = 1,000 expected keys. For a standard Bloom filter, the approximate hash count minimizing false positives is k ~= (m/n) ln 2. The implementation must choose an integer number of hashes.',
      prompt: 'Which hash count is closest to the theoretical optimum and why?',
      choices: [
        'k = 2, because fewer hashes always reduce saturation and therefore always reduce false positives',
        'k = 12, because the optimal number of hashes must equal the number of bits per expected key',
        'k = 8, because 12 x ln 2 is about 8.32 and the integer operating point should be near that minimum',
      ],
      answerIndex: 2,
      explanation: 'With 12 bits per expected key, the standard optimum is about 12 x 0.693 = 8.32 hashes, so 8 is a sensible integer choice. Too few hashes provide weak discrimination, while too many set excessive bits per insert and accelerate saturation.',
      misconceptionTested: 'Increasing the number of Bloom-filter hash functions monotonically improves accuracy, so the safest choice is always to use as many hashes as possible.',
    },
    {
      id: 'bloom-capacity-sizing-worked',
      level: 'calculation',
      relatedComparison: 'memory-budget-vs-capacity-vs-target-false-positive-rate',
      scenario: 'A negative-lookup cache must hold evidence for n = 1,000,000 expected keys while targeting a 1% false-positive rate. At the optimal hash count, the standard sizing approximation is m ~= -n ln(p) / (ln 2)^2 bits.',
      prompt: 'What bit-array size is approximately required before implementation overhead?',
      choices: [
        'About 1,000,000 bits, or 0.12 MiB, because one bit per expected key is enough for a 1% error target',
        'About 9.6 million bits, or roughly 1.14 MiB, because -1,000,000 ln(0.01) / (ln 2)^2 is about 9.59 million',
        'About 100 million bits, or 11.9 MiB, because a 1% false-positive rate requires exactly 100 bits per key',
      ],
      answerIndex: 1,
      explanation: 'Substituting p = 0.01 gives roughly 9.59 bits per expected key, so one million keys need about 9.59 million bits. Dividing by eight gives about 1.20 MB, or about 1.14 MiB, before metadata and implementation overhead. This connects the error budget directly to memory capacity.',
      misconceptionTested: 'Bloom-filter memory can be sized from item count alone without including the target false-positive probability in the capacity calculation.',
    },
    {
      id: 'bloom-counting-delete-decision',
      level: 'design',
      relatedComparison: 'plain-bit-deletion-vs-shared-evidence-vs-counting-bloom-filter',
      scenario: 'Two inserted keys A and B share bit position 17, while their other hash positions differ. A plain Bloom filter stores only a 1 at position 17. The system now needs to delete A while preserving the no-false-negative guarantee for B and expects frequent deletes in production.',
      prompt: 'Which design preserves correct membership evidence under deletion?',
      choices: [
        'Clear every bit touched by A in the plain filter, because bits belong to the most recently inserted key that used them',
        'Leave the plain filter unchanged forever and treat deleted keys as permanently present, because deletion semantics cannot be supported by any Bloom-filter variant',
        'Use a counting Bloom filter or equivalent reference-counted variant so shared positions are decremented and cleared only when their count reaches zero',
      ],
      answerIndex: 2,
      explanation: 'Clearing bit 17 in a plain filter would erase evidence still needed by B and can create a false negative. Counting Bloom filters replace single bits with small counters, increment on insertion, and decrement on deletion; a position becomes absent only when the counter reaches zero. That preserves shared evidence when deletes are required.',
      misconceptionTested: 'A plain Bloom filter can safely delete an item by clearing all of its hashed bits even though those bits may also represent other inserted keys.',
    },
  ],
});

export function getP1BloomFilterAppliedScenariosForLesson(lessonId) {
  return P1_BLOOM_FILTER_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
