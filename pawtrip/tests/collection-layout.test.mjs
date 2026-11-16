import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collectionDetail } from '../src/lib/collection-layout.ts';
test('collection roots always stay on their list', () => {
 for (const path of ['/', '/dogs', '/friends']) assert.equal(collectionDetail(path), null);
});
test('each explicit selection activates the matching secondary list', () => {
 assert.deepEqual(collectionDetail('/trips/a/plan'), { kind:'trips', id:'a', home:'/' });
 assert.deepEqual(collectionDetail('/dogs/b'), { kind:'dogs', id:'b', home:'/dogs' });
 assert.deepEqual(collectionDetail('/friends','c'), { kind:'friends', id:'c', home:'/friends' });
});
test('new item flows and unrelated query params never become a detail pane', () => {
 assert.equal(collectionDetail('/trips/new'), null);
 assert.equal(collectionDetail('/dogs/new'), null);
 assert.equal(collectionDetail('/profile','c'), null);
});
