import test from 'node:test'
import assert from 'node:assert/strict'

import { allAnimations, VISUAL_SIGNATURES } from './animations.js'

test('every catalog lesson has a supported visual signature', () => {
  const supported = new Set(VISUAL_SIGNATURES)
  const invalid = allAnimations
    .filter((animation) => !supported.has(animation.visualSignature))
    .map(({ id, visualSignature }) => ({ id, visualSignature }))

  assert.deepEqual(invalid, [])
})

test('the catalog exercises every visual grammar', () => {
  const used = new Set(allAnimations.map(({ visualSignature }) => visualSignature))

  assert.deepEqual([...used].sort(), [...VISUAL_SIGNATURES].sort())
})

test('representative lessons keep their semantic visual signatures', () => {
  const signatureFor = new Map(
    allAnimations.map(({ id, visualSignature }) => [id, visualSignature]),
  )

  assert.equal(signatureFor.get('bayes-rule-ml'), 'bayes')
  assert.equal(signatureFor.get('roc-pr-curves'), 'roc-pr')
  assert.equal(signatureFor.get('calibration'), 'calibration')
  assert.equal(signatureFor.get('q-learning'), 'rl-loop')
  assert.equal(signatureFor.get('diffusion-basics'), 'diffusion')
})
