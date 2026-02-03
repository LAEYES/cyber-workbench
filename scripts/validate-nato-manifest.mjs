import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error('USAGE: node scripts/validate-nato-manifest.mjs <manifest.json>');
  process.exit(2);
}

const repoRoot = process.cwd();
const schemaPath = path.join(
  repoRoot,
  'specs',
  'nato-trinity',
  'architecture',
  'schemas',
  'manifest.schema.json'
);

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schema);
const ok = validate(manifest);

if (!ok) {
  console.error('MANIFEST_INVALID');
  for (const e of validate.errors || []) {
    console.error(`- ${e.instancePath || '(root)'}: ${e.message}`);
  }
  process.exit(1);
}

console.log('MANIFEST_OK', manifestPath);
