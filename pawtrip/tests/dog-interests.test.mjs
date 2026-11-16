import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DOG_INTERESTS, normalizeDogInterests } from '../src/constants/dog-interests.ts';
test('dog interests are independent, ordered, deduplicated and never inferred from recall', () => {
 assert.equal(DOG_INTERESTS.length,13);
 assert.equal(new Set(DOG_INTERESTS.map(i=>i.icon)).size,13);
 assert.deepEqual(normalizeDogInterests(['off_leash','swimming','unknown','swimming','paddling']),['swimming','paddling','off_leash']);
 assert.deepEqual(normalizeDogInterests(null),[]);
});
