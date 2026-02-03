import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const manifestArg = process.argv[2];
if (!manifestArg) {
  console.error('USAGE: node scripts/validate-nato-manifest.mjs <manifest.json>');
  process.exit(2);
}

// When running via `npm run`, npm may reset CWD to the package root.
// INIT_CWD points to the directory where the user launched the command.
const userCwd = process.env.INIT_CWD || process.cwd();
const manifestPath = path.isAbsolute(manifestArg)
  ? manifestArg
  : path.join(userCwd, manifestArg);

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

const ajv = new Ajv2020({ allErrors: true, strict: false });
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
