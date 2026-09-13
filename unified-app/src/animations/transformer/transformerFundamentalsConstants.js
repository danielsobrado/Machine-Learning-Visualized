export const TRANSFORMER_GUIDE_DEFAULTS = Object.freeze({
  sequenceLength: 8,
  dModel: 64,
  numHeads: 4,
  dFF: 256,
  mode: 'decoder',
});

export const TRANSFORMER_GUIDE_STEPS = Object.freeze([
  Object.freeze({ id: 'embed', label: '1. Embed', summary: 'Turn token IDs into d_model-dimensional vectors.' }),
  Object.freeze({ id: 'project', label: '2. Q / K / V', summary: 'Project each token into query, key, and value spaces.' }),
  Object.freeze({ id: 'attention', label: '3. Attention', summary: 'Build T×T scores per head, apply the mask, then mix values.' }),
  Object.freeze({ id: 'residual', label: '4. Residual + Norm', summary: 'Return to d_model and preserve a direct residual path.' }),
  Object.freeze({ id: 'ffn', label: '5. Feed-forward', summary: 'Expand each token independently to d_ff, then project back.' }),
  Object.freeze({ id: 'repeat', label: '6. Stack blocks', summary: 'Repeat the same shape-preserving block many times.' }),
]);
