import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const fetchPath = fileURLToPath(new URL('../dist/catalog/fetch.js', import.meta.url));
assert.ok(fs.existsSync(fetchPath), 'dist/catalog/fetch.js missing; run npm run build first');
const fetchMod = await import(new URL('../dist/catalog/fetch.js', import.meta.url));
const { fetchBufferVerified } = fetchMod;

function sha256Hex(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

test('fetchBufferVerified enforces sha256', async () => {
  const payload = Buffer.from('hello-world');
  const expected = sha256Hex(payload);

  const url = `data:application/octet-stream;base64,${payload.toString('base64')}`;

  const okBuf = await fetchBufferVerified(url, expected);
  assert.equal(okBuf.toString('utf8'), 'hello-world');

  await assert.rejects(() => fetchBufferVerified(url, '0'.repeat(64)), /SHA256_MISMATCH/);
});
