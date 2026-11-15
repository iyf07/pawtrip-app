import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as traits from '../src/constants/options.ts';

test('trait summary uses stored values and skips unanswered scales', () => {
  assert.deepEqual(traits.personTraitKeys?.({morning:2, noise:null, walking:5, temperature:0, pace:6, spending:3}),
    ['scale.morning.2','scale.walking.5','scale.spending.3']);
});
test('dog recall is a separate optional numeric scale, not inferred from the old binary flag', () => {
  assert.deepEqual(traits.dogScales?.({energy:4, recall:'comes'}),
    {energy:4,temp:null,with_dogs:null,with_people:null,alone:null,car:null,recall_level:null});
});
