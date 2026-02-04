import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const sourcesPath = fileURLToPath(new URL('../dist/catalog/sources.js', import.meta.url));
assert.ok(fs.existsSync(sourcesPath), 'dist/catalog/sources.js missing; run npm run build first');
const sourcesMod = await import(new URL('../dist/catalog/sources.js', import.meta.url));
const { resolveSource } = sourcesMod;

test('resolveSource blocks dynamic sources unless allowDynamic', () => {
  const doc = {
    nist: {
      csf_xlsx: {
        url: 'https://example.local/dynamic',
        allowDynamic: true,
      },
    },
  };

  assert.throws(() => resolveSource(doc, 'nist.csf_xlsx', { allowDynamic: false }), /dynamic/);
  const s = resolveSource(doc, 'nist.csf_xlsx', { allowDynamic: true, requireSha: false });
  assert.equal(s.allowDynamic, true);
});
