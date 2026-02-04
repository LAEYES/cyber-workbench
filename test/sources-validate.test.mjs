import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

test('sources:validate passes', () => {
  const out = execFileSync(process.execPath, ['scripts/validate-sources.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.match(out, /DONE/);
});
