import assert from 'node:assert/strict';
import test from 'node:test';
import { HETEROSCEDASTIC_GROUPS } from './heteroscedasticConstants.js';
import {
  buildHeteroscedasticLab,
  gaussianGroupBreakdown,
  gaussianScaleMleFromResiduals,
} from './heteroscedasticModel.js';

test('noisy residual group has a larger Gaussian scale MLE', () => {
  const stable = gaussianScaleMleFromResiduals(HETEROSCEDASTIC_GROUPS.stable.residuals);
  const noisy = gaussianScaleMleFromResiduals(HETEROSCEDASTIC_GROUPS.noisy.residuals);
  assert.ok(noisy > stable * 4);
});

test('separate group scales improve NLL over the best shared scale', () => {
  const lab = buildHeteroscedasticLab({
    stableResiduals: HETEROSCEDASTIC_GROUPS.stable.residuals,
    noisyResiduals: HETEROSCEDASTIC_GROUPS.noisy.residuals,
    stableSigma: 0.35,
    noisySigma: 1.1,
  });

  assert.ok(lab.bestHeteroscedasticNll < lab.sharedNll);
});

test('dropping the log-sigma normalization creates an uncertainty inflation failure', () => {
  const residuals = HETEROSCEDASTIC_GROUPS.noisy.residuals;
  const moderate = gaussianGroupBreakdown(residuals, 1);
  const inflated = gaussianGroupBreakdown(residuals, 2.5);

  assert.ok(inflated.residualPenalty < moderate.residualPenalty);
  assert.ok(inflated.normalizationPenalty > moderate.normalizationPenalty);
});

test('group Gaussian NLL is minimized at RMS residual scale', () => {
  const residuals = HETEROSCEDASTIC_GROUPS.stable.residuals;
  const mle = gaussianScaleMleFromResiduals(residuals);
  const best = gaussianGroupBreakdown(residuals, mle).nll;
  const smaller = gaussianGroupBreakdown(residuals, mle * 0.7).nll;
  const larger = gaussianGroupBreakdown(residuals, mle * 1.4).nll;

  assert.ok(best < smaller && best < larger);
});
