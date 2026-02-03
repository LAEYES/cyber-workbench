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

function toOpenApiName(schemaFileBase) {
  // risk -> Risk, evidencePackage -> EvidencePackage
  return schemaFileBase.length ? schemaFileBase[0].toUpperCase() + schemaFileBase.slice(1) : schemaFileBase;
}

function fromOpenApiName(name) {
  return name.length ? name[0].toLowerCase() + name.slice(1) : name;
}

async function main() {
  console.log('[nato-trinity] validate');

  // 1) OpenAPI parse + validate
  const openapiText = fs.readFileSync(openapiPath, 'utf8');
  const openapiDoc = YAML.parse(openapiText);
  await SwaggerParser.validate(openapiDoc);
  console.log('OK openapi:', openapiPath, 'sha256=', sha256(Buffer.from(openapiText)));

  const openapiSchemas = Object.keys(openapiDoc?.components?.schemas || {});

  // 2) Schemas JSON parse
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));
  const schemaBases = [];
  for (const f of files) {
    const p = path.join(schemasDir, f);
    const txt = fs.readFileSync(p, 'utf8');
    JSON.parse(txt);
    const base = f.replace(/\.schema\.json$/i, '');
    schemaBases.push(base);
    console.log('OK schema:', f, 'sha256=', sha256(Buffer.from(txt)));
  }

  // 3) Alignment lint (non-fatal): OpenAPI schema coverage
  const allowNoSchemaFile = new Set([
    'Problem',
    'EntityBase',
    'CreateRiskRequest',
    'CreateDecisionRequest',
    'CreateExceptionRequest',
    'IngestEvidenceRequest',
    'CreateLegalHoldRequest',
  ]);

  for (const s of openapiSchemas) {
    if (allowNoSchemaFile.has(s)) continue;
    const expected = fromOpenApiName(s);
    const has = schemaBases.some(b => b.toLowerCase() === expected.toLowerCase());
    if (!has) {
      console.warn('WARN openapi schema has no matching JSON schema file:', s, '(expected file base:', expected + ')');
    }
  }

  for (const b of schemaBases) {
    const expected = toOpenApiName(b);
    const has = openapiSchemas.some(s => s.toLowerCase() === expected.toLowerCase());
    if (!has) {
      console.warn('WARN JSON schema file not represented in openapi components.schemas:', b, '(expected openapi name:', expected + ')');
    }
  }

  console.log('DONE');
}

main().catch(err => {
  console.error('VALIDATION_FAILED', err?.message || err);
  process.exit(1);
});
