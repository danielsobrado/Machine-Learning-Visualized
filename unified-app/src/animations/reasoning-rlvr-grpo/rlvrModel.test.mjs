import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRlvrLab, passAtK, standardizedBinaryRewards, usefulBinaryGroupProbability } from './rlvrModel.js';
import { RLVR_PRESETS } from './rlvrConfig.js';

test('binary group advantages are centered when rewards vary', () => { const result = standardizedBinaryRewards([1, 0, 1, 0]); assert.ok(Math.abs(result.advantages.reduce((sum, value) => sum + value, 0)) < 1e-12); });
test('all-identical verifier rewards give zero relative signal', () => assert.deepEqual(standardizedBinaryRewards([1, 1, 1, 1]).advantages, [0, 0, 0, 0]));
test('pass@k follows the independent-sampling identity', () => { assert.ok(Math.abs(passAtK(0.25, 4) - (1 - 0.75 ** 4)) < 1e-12); assert.equal(passAtK(0, 8), 0); assert.equal(passAtK(1, 8), 1); });
test('useful binary group probability excludes all-pass and all-fail groups', () => { const p = 0.25; const g = 4; assert.ok(Math.abs(usefulBinaryGroupProbability(p, g) - (1 - p ** g - (1 - p) ** g)) < 1e-12); assert.equal(usefulBinaryGroupProbability(0, g), 0); assert.equal(usefulBinaryGroupProbability(1, g), 0); });
test('perfect verifier aligns all nonzero training directions with correctness', () => { const preset = RLVR_PRESETS.find((item) => item.id === 'perfect'); const lab = buildRlvrLab({ candidates: preset.candidates, independentSuccessProbability: 0.25, samplesK: 8, groupSize: 8 }); assert.equal(lab.signalAlignment, 1); assert.equal(lab.falsePositiveCount, 0); assert.equal(lab.falseNegativeCount, 0); });
test('false positive verifier can reinforce an actually wrong answer', () => { const preset = RLVR_PRESETS.find((item) => item.id === 'false-positive'); const lab = buildRlvrLab({ candidates: preset.candidates, independentSuccessProbability: 0.25, samplesK: 8, groupSize: 8 }); assert.equal(lab.falsePositiveCount, 1); assert.ok(lab.signalAlignment < 1); assert.ok(lab.rows.some((row) => !row.correct && row.advantage > 0)); });
test('all-pass group exposes zero gradient signal', () => { const preset = RLVR_PRESETS.find((item) => item.id === 'all-pass'); const lab = buildRlvrLab({ candidates: preset.candidates, independentSuccessProbability: 0.25, samplesK: 8, groupSize: 8 }); assert.equal(lab.usefulSignal, false); assert.equal(lab.signalAlignment, null); });
