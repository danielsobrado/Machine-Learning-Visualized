import assert from 'node:assert/strict';
import {
  bestOfNSelectedAccuracy,
  buildTestTimeComputeLab,
  majorityVoteAccuracy,
  passAtK,
} from './ttcModel.js';

const close = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};

close(passAtK(0.2, 1), 0.2);
close(passAtK(0.2, 2), 0.36);
close(passAtK(0, 32), 0);
close(passAtK(1, 32), 1);

for (const n of [1, 2, 4, 8, 16, 32]) {
  close(majorityVoteAccuracy(0.5, n), 0.5);
}
assert.ok(majorityVoteAccuracy(0.7, 5) > 0.7);
assert.ok(majorityVoteAccuracy(0.3, 5) < 0.3);

const perfect = bestOfNSelectedAccuracy({
  singleSuccessProbability: 0.25,
  sampleCount: 8,
  truePositiveRate: 1,
  falsePositiveRate: 0,
});
close(perfect, passAtK(0.25, 8));

const uninformative = bestOfNSelectedAccuracy({
  singleSuccessProbability: 0.35,
  sampleCount: 16,
  truePositiveRate: 0.5,
  falsePositiveRate: 0.5,
});
close(uninformative, 0.35);

const adversarial = bestOfNSelectedAccuracy({
  singleSuccessProbability: 0.5,
  sampleCount: 16,
  truePositiveRate: 0.2,
  falsePositiveRate: 0.8,
});
assert.ok(adversarial < 0.5);

const lab = buildTestTimeComputeLab({
  baseSuccessProbability: 0.2,
  sampleCount: 8,
  verifierTruePositiveRate: 0.9,
  verifierFalsePositiveRate: 0.1,
  tokensPerSample: 512,
});
assert.equal(lab.expectedTokenCost, 4096);
assert.ok(lab.oracleCoverage >= lab.selectedAccuracy);
assert.ok(lab.marginalCoverageGain > 0);
assert.ok(lab.verifierLift > 0);

console.log('ttcModel: all tests passed');
