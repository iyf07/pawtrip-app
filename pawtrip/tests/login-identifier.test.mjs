import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseLoginIdentifier } from '../src/lib/login-identifier.ts';

test('normalizes email and optional @ prefix on a public ID', () => {
  assert.deepEqual(parseLoginIdentifier(' User@Example.com '), {kind:'email',value:'user@example.com'});
  assert.deepEqual(parseLoginIdentifier(' @Nick_Dog '), {kind:'handle',value:'nick_dog'});
});
test('rejects malformed, empty and oversized identifiers', () => {
  for (const value of ['', 'ab', 'bad id', 'person@', 'x'.repeat(21)]) assert.equal(parseLoginIdentifier(value), null);
});
