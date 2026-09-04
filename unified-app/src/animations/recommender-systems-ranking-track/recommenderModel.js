import {
  DEFAULT_SCENARIO,
  FEEDBACK_ROUNDS,
  ITEM_CATALOG,
  MODEL_DEFINITIONS,
  USER_VECTOR,
} from './recommenderConfig.js';

const EPSILON = 1e-12;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function dot(left, right) {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function norm(vector) {
  return Math.sqrt(dot(vector, vector));
}

export function cosineSimilarity(left, right) {
  return dot(left, right) / Math.max(EPSILON, norm(left) * norm(right));
}

export function trueRelevance(item) {
  const contentAffinity = cosineSimilarity(USER_VECTOR, item.embedding);
  return clamp(contentAffinity * 0.62 + item.quality * 0.28 + item.collaborative * 0.10);
}

function normalizedHistoryStrength(historyStrength) {
  return clamp(historyStrength / 100);
}

function normalizedExploration(exploration) {
  return clamp(exploration / 100, 0, 0.4);
}

export function scoreItem(item, scenario, popularityOverride = item.popularity) {
  const history = normalizedHistoryStrength(scenario.historyStrength);
  const content = cosineSimilarity(USER_VECTOR, item.embedding);
  const popularity = clamp(popularityOverride);
  const novelty = 1 - popularity;
  const explorationBonus = normalizedExploration(scenario.exploration) * novelty;

  if (scenario.modelId === 'popularity') {
    return popularity * 0.96 + item.quality * 0.04 + explorationBonus;
  }

  if (scenario.modelId === 'collaborative') {
    const collaborativeSignal = history * item.collaborative + (1 - history) * 0.5;
    return collaborativeSignal * 0.82 + popularity * 0.18 + explorationBonus;
  }

  const collaborativeSignal = history * item.collaborative + (1 - history) * 0.5;
  const historyWeight = 0.52 * history;
  const contentWeight = 0.70 - historyWeight;
  return collaborativeSignal * historyWeight
    + content * contentWeight
    + popularity * 0.18
    + explorationBonus;
}

export function rankCatalog(scenario = DEFAULT_SCENARIO, popularityOverrides = null) {
  return ITEM_CATALOG
    .map((item) => ({
      ...item,
      relevance: trueRelevance(item),
      score: scoreItem(item, scenario, popularityOverrides?.[item.id] ?? item.popularity),
    }))
    .sort((left, right) => right.score - left.score || right.relevance - left.relevance);
}

function dcg(values) {
  return values.reduce((sum, value, index) => sum + ((2 ** value) - 1) / Math.log2(index + 2), 0);
}

export function rankingMetrics(ranking, topK) {
  const k = Math.min(topK, ranking.length);
  const top = ranking.slice(0, k);
  const relevantThreshold = 0.78;
  const relevantCatalog = ranking.filter((item) => item.relevance >= relevantThreshold);
  const relevantTop = top.filter((item) => item.relevance >= relevantThreshold);
  const ideal = [...ranking].sort((a, b) => b.relevance - a.relevance).slice(0, k);
  const idealDcg = dcg(ideal.map((item) => item.relevance));
  const categoryCount = new Set(top.map((item) => item.category)).size;
  const novelty = top.reduce((sum, item) => sum + (1 - item.popularity), 0) / Math.max(1, k);

  return {
    precision: relevantTop.length / Math.max(1, k),
    recall: relevantTop.length / Math.max(1, relevantCatalog.length),
    ndcg: dcg(top.map((item) => item.relevance)) / Math.max(EPSILON, idealDcg),
    diversity: categoryCount / Math.max(1, k),
    novelty,
  };
}

export function compareModels(scenario = DEFAULT_SCENARIO) {
  return MODEL_DEFINITIONS.map((model) => {
    const modelScenario = { ...scenario, modelId: model.id };
    const ranking = rankCatalog(modelScenario);
    return {
      ...model,
      ranking,
      metrics: rankingMetrics(ranking, scenario.topK),
    };
  });
}

export function simulateFeedbackLoop(scenario = DEFAULT_SCENARIO, rounds = FEEDBACK_ROUNDS) {
  const popularity = Object.fromEntries(ITEM_CATALOG.map((item) => [item.id, item.popularity]));
  const exposure = Object.fromEntries(ITEM_CATALOG.map((item) => [item.id, 0]));
  const snapshots = [];

  for (let round = 0; round < rounds; round += 1) {
    const ranking = rankCatalog(scenario, popularity).slice(0, scenario.topK);
    ranking.forEach((item, index) => {
      const positionWeight = 1 / Math.log2(index + 2);
      exposure[item.id] += positionWeight;
      const relevanceSignal = item.relevance * positionWeight;
      popularity[item.id] = clamp(popularity[item.id] * 0.94 + relevanceSignal * 0.06);
    });

    const totalExposure = Object.values(exposure).reduce((sum, value) => sum + value, 0);
    const shares = Object.values(exposure).map((value) => value / Math.max(EPSILON, totalExposure));
    const hhi = shares.reduce((sum, value) => sum + value ** 2, 0);
    const reached = Object.values(exposure).filter((value) => value > 0).length;
    const topShare = Math.max(...shares, 0);

    snapshots.push({
      round: round + 1,
      hhi,
      reached,
      reach: reached / ITEM_CATALOG.length,
      topShare,
    });
  }

  return {
    exposure,
    snapshots,
    final: snapshots.at(-1),
  };
}

export function buildRecommenderLab(scenario = DEFAULT_SCENARIO) {
  const comparisons = compareModels(scenario);
  const selected = comparisons.find((model) => model.id === scenario.modelId) ?? comparisons[0];
  const feedback = simulateFeedbackLoop(scenario);
  const noExploration = simulateFeedbackLoop({ ...scenario, exploration: 0 });

  return {
    scenario,
    comparisons,
    selected,
    feedback,
    noExploration,
  };
}
