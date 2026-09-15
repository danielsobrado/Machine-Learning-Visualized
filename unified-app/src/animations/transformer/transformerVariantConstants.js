export const TRANSFORMER_FAMILIES = Object.freeze([
  Object.freeze({
    id: 'encoder-only',
    label: 'Encoder-only',
    examples: Object.freeze(['BERT', 'RoBERTa']),
    selfAttention: 'Usually bidirectional over visible input tokens',
    crossAttention: 'Absent in the standard encoder-only pattern',
    commonObjective: 'Masked-token or other representation-learning objectives',
    naturalOutput: 'Contextual token / sequence representations',
    typicalUses: Object.freeze(['classification', 'extraction', 'reranking', 'embedding-style tasks']),
  }),
  Object.freeze({
    id: 'decoder-only',
    label: 'Decoder-only',
    examples: Object.freeze(['GPT-2', 'LLaMA', 'Mistral']),
    selfAttention: 'Causal over the token prefix',
    crossAttention: 'Absent in the standard text-only decoder-only pattern',
    commonObjective: 'Autoregressive next-token prediction',
    naturalOutput: 'Next-token logits used for continuation / generation',
    typicalUses: Object.freeze(['generation', 'chat', 'code completion', 'in-context learning']),
  }),
  Object.freeze({
    id: 'encoder-decoder',
    label: 'Encoder–decoder',
    examples: Object.freeze(['T5', 'BART']),
    selfAttention: 'Encoder full attention + decoder causal target attention',
    crossAttention: 'Decoder queries attend to encoder source states',
    commonObjective: 'Conditional sequence-to-sequence objectives',
    naturalOutput: 'Target-token logits conditioned on a separate source sequence',
    typicalUses: Object.freeze(['translation', 'summarization', 'text-to-text transformation']),
  }),
]);

export const TRANSFORMER_SYSTEM_PATTERNS = Object.freeze([
  Object.freeze({
    title: 'Sparse Mixture of Experts',
    detail: 'MoE layers can store many expert parameters while routing each token through only a subset. Active compute can grow much more slowly than total parameter count, but routing and communication still have cost.',
  }),
  Object.freeze({
    title: 'Long-context attention',
    detail: 'Long context is a system-level design problem involving position handling, attention kernels or sparsity, KV-cache memory, training data, and validation. No single positional method guarantees long-context quality.',
  }),
  Object.freeze({
    title: 'Multimodal Transformers',
    detail: 'Vision, audio, and text systems may use modality encoders, projectors, joint token spaces, cross-attention, or unified transformer blocks. “Transformer-based” does not imply one universal multimodal wiring pattern.',
  }),
]);
