import { DTYPE_BYTES } from './flashAttentionConstants.js';

export function buildFlashAttentionStats({ sequenceLength, tileSize, headDim, dtype }) {
  validatePositiveInteger(sequenceLength, 'sequenceLength');
  validatePositiveInteger(tileSize, 'tileSize');
  validatePositiveInteger(headDim, 'headDim');
  const bytesPerElement = DTYPE_BYTES[dtype];
  if (!bytesPerElement) throw new RangeError(`Unsupported dtype: ${dtype}`);

  const blocks = Math.ceil(sequenceLength / tileSize);
  const tileCount = blocks ** 2;
  const fullScoreElements = sequenceLength ** 2;
  const fullScoreBytes = fullScoreElements * bytesPerElement;

  const queryTileElements = tileSize * headDim;
  const keyTileElements = tileSize * headDim;
  const valueTileElements = tileSize * headDim;
  const scoreTileElements = tileSize ** 2;
  const rowMaxElements = tileSize;
  const rowDenominatorElements = tileSize;
  const outputAccumulatorElements = tileSize * headDim;

  const workingSetElements = (
    queryTileElements
    + keyTileElements
    + valueTileElements
    + scoreTileElements
    + rowMaxElements
    + rowDenominatorElements
    + outputAccumulatorElements
  );
  const workingSetBytes = workingSetElements * bytesPerElement;
  const scoreTileBytes = scoreTileElements * bytesPerElement;
  const scoreStorageRatio = scoreTileBytes / fullScoreBytes;
  const denseAttentionMatmulFlops = 2 * sequenceLength * sequenceLength * headDim;

  return {
    blocks,
    tileCount,
    bytesPerElement,
    fullScoreElements,
    fullScoreBytes,
    scoreTileElements,
    scoreTileBytes,
    queryTileElements,
    keyTileElements,
    valueTileElements,
    outputAccumulatorElements,
    workingSetElements,
    workingSetBytes,
    scoreStorageRatio,
    denseAttentionMatmulFlops,
  };
}

function validatePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}
