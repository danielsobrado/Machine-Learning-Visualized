export const DATA_FLOW_EXAMPLE = Object.freeze({
  sourceTokens: Object.freeze(['The', 'cat', 'sat']),
  trainingTargetInput: Object.freeze(['<BOS>', 'Le', 'chat', "s'est"]),
  trainingTargetLabels: Object.freeze(['Le', 'chat', "s'est", 'assis']),
  inferencePrefix: Object.freeze(['<BOS>', 'Le', 'chat']),
  inferenceNextToken: "s'est",
  batchSize: 1,
  dModel: 512,
  numHeads: 8,
  vocabSize: 32000,
});

export const DATA_FLOW_MODES = Object.freeze({
  training: Object.freeze({
    label: 'Teacher-forced training',
    summary: 'Encode the source once. Feed a shifted target sequence to the decoder and score all target positions in parallel under causal masking.',
  }),
  decode: Object.freeze({
    label: 'Incremental inference',
    summary: 'Encode the source once. After target-prefix prefill, process the newest target token as one query row, reuse cached target K/V, select one next token, append it, and repeat.',
  }),
});
