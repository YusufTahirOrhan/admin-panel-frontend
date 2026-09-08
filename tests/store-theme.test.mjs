import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveStoreTheme } from '../src/lib/store-theme.ts';

const hero = (theme, enabled = true) => ({ type: 'hero', enabled, order: 0, content: { defaultTheme: theme } });
test('published theme applies to visitors without a preference', () => {
  assert.equal(resolveStoreTheme(undefined, [hero('dark')]), 'dark');
  assert.equal(resolveStoreTheme(undefined, [hero('light')]), 'light');
});
test('explicit visitor choices including system override the publication', () => {
  for (const preference of ['light', 'dark', 'system']) assert.equal(resolveStoreTheme(preference, [hero('dark')]), preference);
});
test('missing, disabled or invalid configuration falls back to system', () => {
  for (const blocks of [[], [hero('dark', false)], [hero('invalid')]]) assert.equal(resolveStoreTheme(undefined, blocks), 'system');
  assert.equal(resolveStoreTheme('invalid', [hero('light')]), 'light');
});
