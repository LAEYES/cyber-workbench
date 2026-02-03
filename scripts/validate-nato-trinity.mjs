import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import SwaggerParser from '@apidevtools/swagger-parser';
import YAML from 'yaml';

const root = process.cwd();
const openapiPath = path.join(root, 'specs', 'nato-trinity', 'architecture', 'openapi', 'openapi.yaml');
const schemasDir = path.join(root, 'specs', 'nato-trinity', 'architecture', 'schemas');

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function main() {
  console.log('[nato-trinity] validate');

  // 1) OpenAPI parse + validate
  const openapiText = fs.readFileSync(openapiPath, 'utf8');
  const openapiDoc = YAML.parse(openapiText);
  await SwaggerParser.validate(openapiDoc);
  console.log('OK openapi:', openapiPath, 'sha256=', sha256(Buffer.from(openapiText)));

  // 2) Schemas JSON parse
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));
  for (const f of files) {
    const p = path.join(schemasDir, f);
    const txt = fs.readFileSync(p, 'utf8');
    JSON.parse(txt);
    console.log('OK schema:', f, 'sha256=', sha256(Buffer.from(txt)));
  }

  console.log('DONE');
}

main().catch(err => {
  console.error('VALIDATION_FAILED', err?.message || err);
  process.exit(1);
});
