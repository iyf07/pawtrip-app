import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addDietaryNeed, personScales } from '../src/constants/options.ts';

test('adds a trimmed custom dietary need without changing other selections', () => {
  const saved = ['glutenfree'];
  assert.deepEqual(addDietaryNeed(saved, '  不吃香菜  '), ['glutenfree', '不吃香菜']);
  assert.deepEqual(saved, ['glutenfree']);
});
test('ignores empty and duplicate custom dietary needs', () => {
  assert.deepEqual(addDietaryNeed(['不吃香菜'], ' 不吃香菜 '), ['不吃香菜']);
  assert.deepEqual(addDietaryNeed(['Peanut allergy'], 'peanut allergy'), ['Peanut allergy']);
  assert.deepEqual(addDietaryNeed(['vegan'], '  '), ['vegan']);
});
test('unanswered scales default to neutral while existing answers are preserved', () => {
  assert.deepEqual(personScales({morning: 2, walking: 4, noise: 1}),
    {morning: 2, noise: 1, walking: 4, temperature: 3, pace: 3, spending: 3});
});
