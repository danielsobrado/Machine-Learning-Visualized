import assert from 'node:assert/strict';
import {
  binaryEntropy,
  buildCoconutLab,
  curriculumLayout,
  mixVectors,
  nearestToken,
  projectionError,
} from './coconutModel.js';
import { COCONUT_BRANCHES, COCONUT_VOCABULARY } from './coconutConfig.js';

const close = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

close(binaryEntropy(0), 0);
close(binaryEntropy(1), 0);
close(binaryEntropy(0.5), 1);

const mixed = mixVectors([1, 0], [0, 1], 0.5);
close(mixed[0], mixed[1]);

const token = nearestToken([1, 0, 0], COCONUT_VOCABULARY);
assert.equal(token.token, 'choose-A');
close(projectionError([1, 0, 0], [1, 0, 0]), 0);

const layout = curriculumLayout({ reasoningSteps: 4, latentSteps: 2, answerTokens: 3 });
assert.equal(layout.latentCount, 2);
assert.equal(layout.visibleReasoningCount, 2);
assert.equal(layout.supervisedCount, 5);
assert.equal(layout.totalReasoningComputeSteps, 4);
assert.ok(layout.positions.slice(0, 2).every((position) => !position.supervised));

const lab = buildCoconutLab({
  branchA: COCONUT_BRANCHES[0],
  branchB: COCONUT_BRANCHES[1],
  vocabulary: COCONUT_VOCABULARY,
  branchWeight: 0.5,
  latentSteps: 2,
  reasoningSteps: 4,
  answerTokens: 2,
});
assert.equal(lab.delayedCommitment, true);
assert.ok(lab.routeASimilarity > 0);
assert.ok(lab.routeBSimilarity > 0);
assert.ok(lab.projectionError > 0);
assert.notDeepEqual(lab.latentFeedbackInput, lab.decodedFeedbackInput);

const committed = buildCoconutLab({
  branchA: COCONUT_BRANCHES[0],
  branchB: COCONUT_BRANCHES[1],
  vocabulary: COCONUT_VOCABULARY,
  branchWeight: 0.95,
  latentSteps: 1,
  reasoningSteps: 4,
  answerTokens: 1,
});
assert.equal(committed.delayedCommitment, false);
assert.equal(committed.decoded.token, 'choose-A');

console.log('coconutModel: all tests passed');
