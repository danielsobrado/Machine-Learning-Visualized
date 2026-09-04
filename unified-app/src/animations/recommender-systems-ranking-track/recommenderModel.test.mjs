import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SCENARIO, ITEM_CATALOG } from './recommenderConfig.js';
import { buildRecommenderLab, compareModels, rankingMetrics, rankCatalog, simulateFeedbackLoop } from './recommenderModel.js';

test('ranking metrics stay in valid bounds', () => {
  const ranking = rankCatalog(DEFAULT_SCENARIO);
  const metrics = rankingMetrics(ranking, DEFAULT_SCENARIO.topK);
  Object.values(metrics).forEach((value) => assert.ok(value >= 0 && value <= 1));
});

test('hybrid ranking beats popularity on personalized relevance', () => {
  const models = compareModels({ ...DEFAULT_SCENARIO, historyStrength: 85, exploration: 0 });
  const popularity = models.find((model) => model.id === 'popularity');
  const hybrid = models.find((model) => model.id === 'hybrid');
  assert.ok(hybrid.metrics.ndcg > popularity.metrics.ndcg);
});

test('hybrid remains usable in cold start because content signal survives', () => {
  const models = compareModels({ ...DEFAULT_SCENARIO, historyStrength: 0, exploration: 0 });
  const collaborative = models.find((model) => model.id === 'collaborative');
  const hybrid = models.find((model) => model.id === 'hybrid');
  assert.ok(hybrid.metrics.ndcg >= collaborative.metrics.ndcg);
});

test('exploration never reduces catalog reach in the feedback simulation', () => {
  const trapped = simulateFeedbackLoop({ ...DEFAULT_SCENARIO, modelId: 'popularity', exploration: 0 }, 12);
  const explored = simulateFeedbackLoop({ ...DEFAULT_SCENARIO, modelId: 'popularity', exploration: 40 }, 12);
  assert.ok(explored.final.reached >= trapped.final.reached);
  assert.ok(explored.final.reached <= ITEM_CATALOG.length);
});

test('lab exposes the selected model and feedback diagnostics', () => {
  const lab = buildRecommenderLab(DEFAULT_SCENARIO);
  assert.equal(lab.selected.id, DEFAULT_SCENARIO.modelId);
  assert.equal(lab.feedback.snapshots.length, 10);
  assert.ok(Number.isFinite(lab.feedback.final.hhi));
});
