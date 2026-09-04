export const LONG_CONTEXT_LENGTHS = [8192, 32768, 131072, 1000000];

export const LONG_CONTEXT_ARCHITECTURES = [
  {
    id: 'mha-32',
    label: '32-head MHA',
    detail: 'Every query head keeps its own K/V cache.',
    layers: 32,
    queryHeads: 32,
    kvHeads: 32,
    headDim: 128,
    bytesPerElement: 2,
  },
  {
    id: 'gqa-8',
    label: '32Q / 8KV GQA',
    detail: 'Four query heads share each K/V head.',
    layers: 32,
    queryHeads: 32,
    kvHeads: 8,
    headDim: 128,
    bytesPerElement: 2,
  },
  {
    id: 'gqa-4',
    label: '32Q / 4KV GQA',
    detail: 'Eight query heads share each K/V head.',
    layers: 32,
    queryHeads: 32,
    kvHeads: 4,
    headDim: 128,
    bytesPerElement: 2,
  },
];

export const LONG_CONTEXT_DEFAULTS = {
  architectureId: 'gqa-8',
  contextTokens: 131072,
  corpusTokens: 1000000,
  chunkTokens: 1024,
  topK: 12,
  promptTokens: 1024,
  outputReserveTokens: 2048,
};

export const LONG_CONTEXT_SOURCES = [
  {
    label: 'Lost in the Middle',
    href: 'https://arxiv.org/abs/2307.03172',
    note: 'Advertised context length does not imply uniform ability to use evidence at every position.',
  },
  {
    label: 'PagedAttention / vLLM',
    href: 'https://arxiv.org/abs/2309.06180',
    note: 'KV-cache memory is a central serving bottleneck and efficient paging reduces fragmentation and duplication.',
  },
];
