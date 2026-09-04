function positiveNumber(value, name, allowZero = false) {
  if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0)) {
    throw new RangeError(`${name} must be ${allowZero ? 'non-negative' : 'positive'}`);
  }
}

export function ceilDiv(numerator, denominator) {
  positiveNumber(numerator, 'numerator', true);
  positiveNumber(denominator, 'denominator');
  return Math.ceil(numerator / denominator);
}

export function imagePatchTokenCount(width, height, patchSize) {
  if (width === 0 || height === 0) return 0;
  positiveNumber(width, 'width');
  positiveNumber(height, 'height');
  positiveNumber(patchSize, 'patchSize');
  return ceilDiv(width, patchSize) * ceilDiv(height, patchSize);
}

export function sampledVideoFrameCount(durationSeconds, fps) {
  positiveNumber(durationSeconds, 'durationSeconds', true);
  positiveNumber(fps, 'fps', durationSeconds === 0);
  if (durationSeconds === 0 || fps === 0) return 0;
  return Math.ceil(durationSeconds * fps);
}

export function framedTokenCount(durationSeconds, frameMs, codebooks = 1) {
  positiveNumber(durationSeconds, 'durationSeconds', true);
  positiveNumber(frameMs, 'frameMs');
  positiveNumber(codebooks, 'codebooks');
  if (durationSeconds === 0) return 0;
  return Math.ceil((durationSeconds * 1000) / frameMs) * codebooks;
}

export function causalAttentionPairs(tokenCount) {
  positiveNumber(tokenCount, 'tokenCount', true);
  return (tokenCount * (tokenCount + 1)) / 2;
}

export function fusionAttentionWork(streamTokenCounts, fusionQueries) {
  if (!Array.isArray(streamTokenCounts) || streamTokenCounts.some((value) => !Number.isInteger(value) || value < 0)) {
    throw new TypeError('streamTokenCounts must contain non-negative integers');
  }
  if (!Number.isInteger(fusionQueries) || fusionQueries <= 0) throw new RangeError('fusionQueries must be positive');
  const totalTokens = streamTokenCounts.reduce((sum, value) => sum + value, 0);
  const earlyFusionPairs = causalAttentionPairs(totalTokens);
  const separatePairs = streamTokenCounts.reduce((sum, value) => sum + causalAttentionPairs(value), 0);
  const crossAttentionPairs = fusionQueries * totalTokens;
  const fusionSelfPairs = causalAttentionPairs(fusionQueries);
  return {
    totalTokens,
    earlyFusionPairs,
    lateFusionPairs: separatePairs + crossAttentionPairs + fusionSelfPairs,
    separatePairs,
    crossAttentionPairs,
    fusionSelfPairs,
  };
}

export function centeredTimestamps(durationSeconds, rateHz) {
  positiveNumber(durationSeconds, 'durationSeconds', true);
  positiveNumber(rateHz, 'rateHz', durationSeconds === 0);
  if (durationSeconds === 0 || rateHz === 0) return [];
  const count = Math.ceil(durationSeconds * rateHz);
  return Array.from({ length: count }, (_, index) => Math.min(durationSeconds, (index + 0.5) / rateHz));
}

export function alignmentError(videoTimestamps, audioTimestamps) {
  if (!Array.isArray(videoTimestamps) || !Array.isArray(audioTimestamps)) throw new TypeError('timestamps must be arrays');
  if (videoTimestamps.length === 0 || audioTimestamps.length === 0) return { meanSeconds: 0, maxSeconds: 0, matches: [] };
  const matches = videoTimestamps.map((videoTime) => {
    let best = audioTimestamps[0];
    let bestDelta = Math.abs(videoTime - best);
    for (let index = 1; index < audioTimestamps.length; index += 1) {
      const delta = Math.abs(videoTime - audioTimestamps[index]);
      if (delta < bestDelta) {
        best = audioTimestamps[index];
        bestDelta = delta;
      }
    }
    return { videoTime, audioTime: best, deltaSeconds: bestDelta };
  });
  return {
    meanSeconds: matches.reduce((sum, item) => sum + item.deltaSeconds, 0) / matches.length,
    maxSeconds: Math.max(...matches.map((item) => item.deltaSeconds)),
    matches,
  };
}

export function buildOmniLab({ preset, fusionQueries, speechFrameMs, speechCodebooks }) {
  if (!preset) throw new TypeError('preset is required');
  const imageTokens = imagePatchTokenCount(preset.imageWidth, preset.imageHeight, preset.imagePatchSize);
  const videoFrames = sampledVideoFrameCount(preset.videoSeconds, preset.videoFps);
  const videoTokens = videoFrames * imageTokens;
  const audioTokens = framedTokenCount(preset.audioSeconds, preset.audioFrameMs, preset.audioCodebooks);
  const speechTokens = framedTokenCount(preset.speechSeconds, speechFrameMs, speechCodebooks);
  const streams = [preset.textTokens, imageTokens, videoTokens, audioTokens].filter((value) => value > 0);
  const fusion = fusionAttentionWork(streams, fusionQueries);
  const videoTimes = centeredTimestamps(preset.videoSeconds, preset.videoFps);
  const audioRate = preset.audioSeconds > 0 ? 1000 / preset.audioFrameMs : 0;
  const audioTimes = centeredTimestamps(preset.audioSeconds, audioRate);
  const alignment = alignmentError(videoTimes, audioTimes);

  return {
    textTokens: preset.textTokens,
    imageTokens,
    videoFrames,
    videoTokens,
    audioTokens,
    speechTokens,
    totalInputTokens: fusion.totalTokens,
    fusion,
    alignment,
    earlyToLateRatio: fusion.lateFusionPairs === 0 ? 0 : fusion.earlyFusionPairs / fusion.lateFusionPairs,
  };
}
