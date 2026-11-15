import assert from 'node:assert/strict';
import { test } from 'node:test';
import { personTraitKeys, dogScales } from '../src/constants/options.ts';

test('bio shows only extreme answers, excluding middle values and unanswered dimensions', () => {
  assert.deepEqual(personTraitKeys({morning:2, noise:1, walking:5, temperature:0, pace:6, spending:3}),
    ['scale.noise.1','scale.walking.5']);
  assert.deepEqual(personTraitKeys({morning:null, noise:3, walking:4}), []);
});
test('dog defaults to neutral without inferring recall from its old binary flag', () => {
  assert.deepEqual(dogScales({energy:4, recall:'comes'}),
    {energy:4,temp:3,with_dogs:3,with_people:3,alone:3,car:3,recall_level:3});
});
