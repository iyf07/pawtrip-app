import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dogWeightLabel } from '../src/lib/dog-weight.ts';
test('dog list weight follows the saved display unit and handles absent weight', () => {
  assert.equal(dogWeightLabel({ weight_lb: 22.0462, weight_unit: 'kg' }), '10 kg');
  assert.equal(dogWeightLabel({ weight_lb: 22.0462, weight_unit: 'lb' }), '22 lb');
  assert.equal(dogWeightLabel({ weight_lb: null, weight_unit: 'kg' }), null);
});
