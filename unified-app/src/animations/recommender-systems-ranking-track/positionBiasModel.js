function requireProbability(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`${name} must be in [0, 1]`);
  }
}

function requirePositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

function expectedItem({ id, rank, relevance, examination, impressions }) {
  const observedCtr = relevance * examination;
  const expectedClicks = impressions * observedCtr;
  const correctedPreference = examination > 0 ? observedCtr / examination : 0;
  return {
    id,
    rank,
    relevance,
    examination,
    impressions,
    observedCtr,
    expectedClicks,
    correctedPreference,
  };
}

export function positionBiasExperiment({
  impressions,
  topExamination,
  secondExamination,
  itemARelevance,
  itemBRelevance,
  itemAOnTop = false,
}) {
  requirePositiveInteger(impressions, 'impressions');
  [
    ['topExamination', topExamination],
    ['secondExamination', secondExamination],
    ['itemARelevance', itemARelevance],
    ['itemBRelevance', itemBRelevance],
  ].forEach(([name, value]) => requireProbability(value, name));

  const itemA = expectedItem({
    id: 'A',
    rank: itemAOnTop ? 1 : 2,
    relevance: itemARelevance,
    examination: itemAOnTop ? topExamination : secondExamination,
    impressions,
  });
  const itemB = expectedItem({
    id: 'B',
    rank: itemAOnTop ? 2 : 1,
    relevance: itemBRelevance,
    examination: itemAOnTop ? secondExamination : topExamination,
    impressions,
  });

  const trueWinner = itemA.relevance >= itemB.relevance ? itemA.id : itemB.id;
  const naiveWinner = itemA.observedCtr >= itemB.observedCtr ? itemA.id : itemB.id;
  const correctedWinner = itemA.correctedPreference >= itemB.correctedPreference ? itemA.id : itemB.id;

  return {
    itemA,
    itemB,
    trueWinner,
    naiveWinner,
    correctedWinner,
    naiveRankingWrong: naiveWinner !== trueWinner,
    correctedRankingWrong: correctedWinner !== trueWinner,
  };
}
