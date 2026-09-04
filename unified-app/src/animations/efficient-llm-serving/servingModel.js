function positiveInteger(value, name, allowZero = false) {
  if (!Number.isInteger(value) || (allowZero ? value < 0 : value <= 0)) throw new RangeError(`${name} must be ${allowZero ? 'non-negative' : 'positive'} integer`);
}

export function kvBytesPerToken({ layers, kvHeads, headDim, bytesPerElement }) {
  [layers, kvHeads, headDim, bytesPerElement].forEach((value, index) => positiveInteger(value, ['layers', 'kvHeads', 'headDim', 'bytesPerElement'][index]));
  return 2 * layers * kvHeads * headDim * bytesPerElement;
}

export function pagedAllocation(tokens, blockSize) {
  positiveInteger(tokens, 'tokens', true);
  positiveInteger(blockSize, 'blockSize');
  const blocks = tokens === 0 ? 0 : Math.ceil(tokens / blockSize);
  const allocatedTokens = blocks * blockSize;
  return { blocks, allocatedTokens, wastedTokens: allocatedTokens - tokens };
}

export function contiguousReservation(tokens, maxSequenceTokens) {
  positiveInteger(tokens, 'tokens', true);
  positiveInteger(maxSequenceTokens, 'maxSequenceTokens');
  if (tokens > maxSequenceTokens) throw new RangeError('tokens exceed maxSequenceTokens');
  return { allocatedTokens: maxSequenceTokens, wastedTokens: maxSequenceTokens - tokens };
}

export function prefixCacheTokenSavings(requests) {
  if (!Array.isArray(requests) || requests.length === 0) throw new TypeError('requests must be non-empty');
  const shared = Math.min(...requests.map((request) => request.sharedPrefixTokens || 0));
  const withoutCache = requests.reduce((sum, request) => sum + request.promptTokens, 0);
  const uniqueSuffixes = requests.reduce((sum, request) => sum + Math.max(0, request.promptTokens - shared), 0);
  const withCache = shared + uniqueSuffixes;
  return { sharedPrefixTokens: shared, withoutCache, withCache, savedTokens: withoutCache - withCache };
}

function cloneRequests(requests) {
  return requests.map((request) => ({ ...request, remaining: request.outputTokens, completion: null }));
}

export function simulateStaticBatching(requests, maxBatchSize) {
  positiveInteger(maxBatchSize, 'maxBatchSize');
  const pending = cloneRequests(requests).sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  let time = 0;
  let allocatedSlots = 0;
  let usefulSlots = 0;
  while (pending.some((request) => request.completion === null)) {
    const available = pending.filter((request) => request.completion === null && request.arrival <= time && request.remaining > 0);
    if (available.length === 0) {
      time = Math.min(...pending.filter((request) => request.completion === null).map((request) => request.arrival));
      continue;
    }
    const batch = available.slice(0, maxBatchSize);
    const batchSteps = Math.max(...batch.map((request) => request.remaining));
    for (let step = 0; step < batchSteps; step += 1) {
      allocatedSlots += batch.length;
      for (const request of batch) {
        if (request.remaining > 0) {
          request.remaining -= 1;
          usefulSlots += 1;
          if (request.remaining === 0) request.completion = time + step + 1;
        }
      }
    }
    time += batchSteps;
  }
  return {
    completionTimes: Object.fromEntries(pending.map((request) => [request.id, request.completion])),
    makespan: Math.max(...pending.map((request) => request.completion)),
    allocatedSlots,
    usefulSlots,
    wastedSlots: allocatedSlots - usefulSlots,
  };
}

export function simulateContinuousBatching(requests, maxBatchSize) {
  positiveInteger(maxBatchSize, 'maxBatchSize');
  const pending = cloneRequests(requests).sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const active = [];
  let time = 0;
  let usefulSlots = 0;
  while (pending.some((request) => request.completion === null)) {
    for (const request of pending) {
      if (active.length >= maxBatchSize) break;
      if (request.completion === null && request.remaining > 0 && request.arrival <= time && !active.includes(request)) active.push(request);
    }
    if (active.length === 0) {
      time = Math.min(...pending.filter((request) => request.completion === null).map((request) => request.arrival));
      continue;
    }
    time += 1;
    for (let index = active.length - 1; index >= 0; index -= 1) {
      const request = active[index];
      request.remaining -= 1;
      usefulSlots += 1;
      if (request.remaining === 0) {
        request.completion = time;
        active.splice(index, 1);
      }
    }
  }
  return {
    completionTimes: Object.fromEntries(pending.map((request) => [request.id, request.completion])),
    makespan: Math.max(...pending.map((request) => request.completion)),
    allocatedSlots: usefulSlots,
    usefulSlots,
    wastedSlots: 0,
  };
}

export function expectedAcceptedDraftPrefix(draftLength, acceptanceProbability) {
  positiveInteger(draftLength, 'draftLength');
  if (!Number.isFinite(acceptanceProbability) || acceptanceProbability < 0 || acceptanceProbability > 1) throw new RangeError('acceptanceProbability must be in [0,1]');
  if (acceptanceProbability === 1) return draftLength;
  if (acceptanceProbability === 0) return 0;
  return (acceptanceProbability * (1 - acceptanceProbability ** draftLength)) / (1 - acceptanceProbability);
}

export function buildServingLab({ model, blockSize, maxSequenceTokens, maxBatchSize, speculativeDraftLength, speculativeAcceptance, requests }) {
  const bytesPerToken = kvBytesPerToken(model);
  const paged = requests.map((request) => ({ ...request, ...pagedAllocation(request.promptTokens + request.outputTokens, blockSize) }));
  const contiguous = requests.map((request) => ({ ...request, ...contiguousReservation(request.promptTokens + request.outputTokens, maxSequenceTokens) }));
  const pagedWasteTokens = paged.reduce((sum, request) => sum + request.wastedTokens, 0);
  const contiguousWasteTokens = contiguous.reduce((sum, request) => sum + request.wastedTokens, 0);
  const staticBatch = simulateStaticBatching(requests, maxBatchSize);
  const continuousBatch = simulateContinuousBatching(requests, maxBatchSize);
  const prefix = prefixCacheTokenSavings(requests);
  return {
    bytesPerToken,
    kibPerToken: bytesPerToken / 1024,
    pagedWasteTokens,
    contiguousWasteTokens,
    pagedWasteBytes: pagedWasteTokens * bytesPerToken,
    contiguousWasteBytes: contiguousWasteTokens * bytesPerToken,
    prefix,
    staticBatch,
    continuousBatch,
    expectedAcceptedDraftTokens: expectedAcceptedDraftPrefix(speculativeDraftLength, speculativeAcceptance),
  };
}
