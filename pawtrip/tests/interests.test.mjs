import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeInterests } from '../src/constants/options.ts';

test('keeps existing selections when consolidating detailed interests', () => {
  assert.deepEqual(normalizeInterests(['hiking', 'parks', 'brunch', 'bakeries', 'cafes', 'wine', 'markets', 'events', 'museums']),
    ['outdoors', 'food', 'coffee', 'drinks', 'shopping', 'fun', 'sights']);
});
test('accepts broad selections, removes duplicates and ignores unknown values', () => {
  assert.deepEqual(normalizeInterests(['outdoors', 'hiking', 'sights', 'unknown', 'coffee', 'coffee']), ['outdoors', 'sights', 'coffee']);
});
