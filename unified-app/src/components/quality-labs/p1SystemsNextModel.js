const GIB = 1024 ** 3;
const EPSILON = Number.EPSILON;

function rankItem(items, targetId) {
  const ranked = [...items].sort((left, right) => right.score - left.score);
  return ranked.findIndex(({ id }) => id === targetId) + 1;
}

export function compareSampledNegativeEvaluation({ positiveItem, negatives, sampledNegativeCount }) {
  const fullItems = [positiveItem, ...negatives];
  const fullRank = rankItem(fullItems, positiveItem.id);
  const easyNegatives = [...negatives]
    .sort((left, right) => left.score - right.score)
    .slice(0, sampledNegativeCount);
  const sampledItems = [positiveItem, ...easyNegatives];
  const sampledRank = rankItem(sampledItems, positiveItem.id);
  const sampledIds = new Set(easyNegatives.map(({ id }) => id));
  const omittedHardNegatives = negatives.filter(
    ({ id, score }) => score > positiveItem.score && !sampledIds.has(id),
  ).length;

  return {
    fullRank,
    sampledRank,
    fullMrr: 1 / fullRank,
    sampledMrr: 1 / sampledRank,
    mrrInflation: (1 / sampledRank) - (1 / fullRank),
    omittedHardNegatives,
    sampledNegativeCount: easyNegatives.length,
  };
}

export function buildImplicitFeedbackObjective({ observations, alpha }) {
  const rows = observations.map((row) => {
    const confidence = 1 + (alpha * row.interactionCount);
    const squaredError = (row.preference - row.prediction) ** 2;
    return {
      ...row,
      confidence,
      squaredError,
      weightedLoss: confidence * squaredError,
    };
  });
  const totalLoss = rows.reduce((sum, row) => sum + row.weightedLoss, 0);
  const observedLoss = rows
    .filter(({ interactionCount }) => interactionCount > 0)
    .reduce((sum, row) => sum + row.weightedLoss, 0);

  return {
    rows,
    totalLoss,
    observedLoss,
    observedShare: observedLoss / Math.max(totalLoss, EPSILON),
  };
}

export function simulateSecurityTrace({ attack, controls }) {
  let contentActive = attack.poisonedContent;
  let toolExecuted = false;
  let secretReleased = false;
  const trace = [];

  if (contentActive && controls.provenanceCheck) {
    contentActive = false;
    trace.push({ stage: 'Ingestion', decision: 'quarantined', blocked: true, detail: 'Provenance policy rejects the poisoned source before indexing.' });
  } else {
    trace.push({ stage: 'Ingestion', decision: contentActive ? 'indexed' : 'clean', blocked: false, detail: contentActive ? 'Poisoned content enters the corpus.' : 'No poisoned content detected.' });
  }

  if (contentActive && controls.sourceTrustFilter) {
    contentActive = false;
    trace.push({ stage: 'Retrieval', decision: 'filtered', blocked: true, detail: 'Source-trust policy removes the malicious document from retrieved context.' });
  } else {
    trace.push({ stage: 'Retrieval', decision: contentActive ? 'retrieved attack' : 'safe context', blocked: false, detail: contentActive ? 'The malicious instruction reaches the model.' : 'No malicious instruction reaches the model.' });
  }

  if (contentActive && attack.requestsTool) {
    if (controls.leastPrivilege) {
      trace.push({ stage: 'Authorization', decision: 'tool denied', blocked: true, detail: 'The model can request the action, but the capability policy denies it.' });
    } else {
      toolExecuted = true;
      trace.push({ stage: 'Authorization', decision: 'tool executed', blocked: false, detail: 'An over-privileged tool executes the attacker-requested action.' });
    }
  } else {
    trace.push({ stage: 'Authorization', decision: 'no dangerous action', blocked: false, detail: 'No attacker-controlled tool action is attempted.' });
  }

  if (contentActive && attack.requestsSecret) {
    if (controls.outputValidation) {
      trace.push({ stage: 'Output validation', decision: 'secret blocked', blocked: true, detail: 'Sensitive-output validation blocks the exfiltration attempt.' });
    } else {
      secretReleased = true;
      trace.push({ stage: 'Output validation', decision: 'secret released', blocked: false, detail: 'The attack reaches the response with no final validation boundary.' });
    }
  } else {
    trace.push({ stage: 'Output validation', decision: 'safe output', blocked: false, detail: 'No attacker-controlled secret output is produced.' });
  }

  return {
    trace,
    toolExecuted,
    secretReleased,
    compromised: toolExecuted || secretReleased,
    blockedStages: trace.filter(({ blocked }) => blocked).length,
  };
}

export function joinSlowlyChangingDimension({ dimensionVersions, eventTime, latestAsOf }) {
  const pointInTime = dimensionVersions.find(
    ({ effectiveStart, effectiveEnd }) => eventTime >= effectiveStart && eventTime < effectiveEnd,
  );
  const latest = [...dimensionVersions]
    .filter(({ effectiveStart }) => effectiveStart <= latestAsOf)
    .sort((left, right) => right.effectiveStart - left.effectiveStart)[0];

  if (!pointInTime || !latest) {
    throw new RangeError('Dimension versions must cover the requested event and latest timestamps.');
  }

  return {
    pointInTime,
    latest,
    leaked: pointInTime.segment !== latest.segment,
  };
}

export function buildLateArrivalFeature({ events, predictionTime, featureWindowHours }) {
  const windowStart = predictionTime - featureWindowHours;
  const inEventWindow = events.filter(
    ({ eventTime }) => eventTime > windowStart && eventTime <= predictionTime,
  );
  const availableAtPrediction = inEventWindow.filter(({ arrivalTime }) => arrivalTime <= predictionTime);
  const lateEvents = inEventWindow.filter(({ arrivalTime }) => arrivalTime > predictionTime);

  return {
    eventTimeOnlyCount: inEventWindow.length,
    pointInTimeCount: availableAtPrediction.length,
    lateEventCount: lateEvents.length,
    lateEventIds: lateEvents.map(({ id }) => id),
    leakageDelta: inEventWindow.length - availableAtPrediction.length,
  };
}

function bytesToGiB(bytes) {
  return bytes / GIB;
}

export function buildServingMemoryBudget({
  paramsBillions,
  weightBits,
  layers,
  kvHeads,
  headDim,
  cacheBytes,
  sequenceLengths,
  pageTokens,
  activationGiB,
  runtimeReserveGiB,
}) {
  if (pageTokens <= 0) throw new RangeError('pageTokens must be positive.');
  const parameterGiB = bytesToGiB(paramsBillions * 1e9 * weightBits / 8);
  const bytesPerToken = 2 * layers * kvHeads * headDim * cacheBytes;
  const usedTokens = sequenceLengths.reduce((sum, length) => sum + length, 0);
  const allocatedTokens = sequenceLengths.reduce(
    (sum, length) => sum + (Math.ceil(length / pageTokens) * pageTokens),
    0,
  );
  const usedKvGiB = bytesToGiB(usedTokens * bytesPerToken);
  const allocatedKvGiB = bytesToGiB(allocatedTokens * bytesPerToken);
  const fragmentationGiB = allocatedKvGiB - usedKvGiB;
  const simplifiedTotalGiB = parameterGiB + usedKvGiB;
  const servingTotalGiB = parameterGiB + allocatedKvGiB + activationGiB + runtimeReserveGiB;

  return {
    parameterGiB,
    usedKvGiB,
    allocatedKvGiB,
    fragmentationGiB,
    fragmentationRate: (allocatedTokens - usedTokens) / Math.max(allocatedTokens, 1),
    simplifiedTotalGiB,
    servingTotalGiB,
    overheadGiB: servingTotalGiB - simplifiedTotalGiB,
    overheadShare: (servingTotalGiB - simplifiedTotalGiB) / Math.max(servingTotalGiB, EPSILON),
    usedTokens,
    allocatedTokens,
  };
}
