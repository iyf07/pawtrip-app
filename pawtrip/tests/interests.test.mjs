import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeInterests } from '../src/constants/options.ts';

test('keeps different interests separate rather than collapsing categories', () => {
  assert.deepEqual(normalizeInterests(['hiking', 'wildlife', 'lakes', 'cafes', 'dessert', 'breweries', 'wine']),
    ['hiking', 'wildlife', 'lakes', 'cafes', 'dessert', 'breweries', 'wineries']);
});
test('keeps earlier broad preferences without inventing specific selections', () => {
  assert.deepEqual(normalizeInterests(['outdoors', 'sights', 'coffee', 'drinks', 'food', 'shopping', 'fun']),
    ['outdoors', 'sights', 'coffee', 'drinks', 'food', 'shopping', 'fun']);
});
test('maps retired detail codes, deduplicates and ignores unknown values', () => {
  assert.deepEqual(normalizeInterests(['parks', 'hiking', 'hiking', 'brunch', 'bakeries', 'markets', 'events', 'unknown']),
    ['outdoors', 'hiking', 'food', 'dessert', 'shopping', 'fun']);
});
