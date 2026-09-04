import assert from 'node:assert/strict';
import test from 'node:test';
import {
  alignmentError,
  buildOmniLab,
  causalAttentionPairs,
  centeredTimestamps,
  framedTokenCount,
  fusionAttentionWork,
  imagePatchTokenCount,
  sampledVideoFrameCount,
} from './omniModel.js';
import { OMNI_PRESETS } from './omniConfig.js';

test('image patch count uses ceiling in both spatial dimensions', () => {
  assert.equal(imagePatchTokenCount(448, 448, 14), 1024);
  assert.equal(imagePatchTokenCount(450, 448, 14), 1056);
});

test('video frame and framed token counts scale from explicit rates', () => {
  assert.equal(sampledVideoFrameCount(8, 2), 16);
  assert.equal(framedTokenCount(2, 20, 8), 800);
});

test('causal attention pair count includes diagonal', () => {
  assert.equal(causalAttentionPairs(4), 10);
});

test('fusion work is exactly decomposed', () => {
  const work = fusionAttentionWork([10, 20], 4);
  assert.equal(work.totalTokens, 30);
  assert.equal(work.earlyFusionPairs, 465);
  assert.equal(work.lateFusionPairs, 55 + 210 + 120 + 10);
});

test('timestamp alignment finds nearest audio frame', () => {
  const video = [0.25, 0.75];
  const audio = [0.1, 0.3, 0.5, 0.7, 0.9];
  const result = alignmentError(video, audio);
  assert.ok(result.maxSeconds <= 0.05 + 1e-12);
});

test('centered timestamps are deterministic and bounded by duration', () => {
  const values = centeredTimestamps(1, 2);
  assert.deepEqual(values, [0.25, 0.75]);
});

test('omni lab exposes token geometry without quality proxies', () => {
  const preset = OMNI_PRESETS.find((item) => item.id === 'video-audio');
  const lab = buildOmniLab({ preset, fusionQueries: 32, speechFrameMs: 20, speechCodebooks: 8 });
  assert.equal(lab.videoFrames, 16);
  assert.equal(lab.speechTokens, 0);
  assert.ok(lab.totalInputTokens > lab.textTokens);
  assert.ok(Number.isFinite(lab.earlyToLateRatio));
});
