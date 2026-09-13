import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCountFamilyLab,
  negativeBinomialPmf,
  poissonPmf,
  zeroInflatedPoissonPmf,
} from './countFamilyModel.js';

test('Poisson variance equals its mean', () => {
  const lab = buildCountFamilyLab({ mean: 4, shape: 2, zeroInflation: 0.3 });
  const poisson = lab.families.find((family) => family.id === 'poisson');
  assert.equal(poisson.mean, 4);
  assert.equal(poisson.variance, 4);
});

test('Negative Binomial adds overdispersion while preserving the mean', () => {
  const lab = buildCountFamilyLab({ mean: 4, shape: 2, zeroInflation: 0 });
  const negativeBinomial = lab.families.find((family) => family.id === 'negative-binomial');
  assert.equal(negativeBinomial.mean, 4);
  assert.equal(negativeBinomial.variance, 12);
  assert.ok(negativeBinomial.zeroProbability > Math.exp(-4));
});

test('larger Negative Binomial shape approaches Poisson', () => {
  const loose = buildCountFamilyLab({ mean: 4, shape: 2, zeroInflation: 0 });
  const tight = buildCountFamilyLab({ mean: 4, shape: 20, zeroInflation: 0 });
  assert.ok(loose.diagnostics.negativeBinomialDispersionRatio > tight.diagnostics.negativeBinomialDispersionRatio);
});

test('zero-inflated Poisson preserves target mean while increasing zero mass', () => {
  const lab = buildCountFamilyLab({ mean: 4, shape: 2, zeroInflation: 0.4 });
  const poisson = lab.families.find((family) => family.id === 'poisson');
  const zip = lab.families.find((family) => family.id === 'zero-inflated-poisson');
  assert.equal(zip.mean, 4);
  assert.ok(zip.zeroProbability > poisson.zeroProbability);
  assert.ok(zip.variance > zip.mean);
});

test('PMFs are valid at zero', () => {
  assert.ok(poissonPmf(0, 3) > 0);
  assert.ok(negativeBinomialPmf(0, 3, 2) > 0);
  assert.ok(zeroInflatedPoissonPmf(0, 3, 0.5) > 0.5);
});
