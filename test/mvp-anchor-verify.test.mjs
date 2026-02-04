import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

function canonicalize(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort((a, b) => a.localeCompare(b, 'en'))) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function sha256Hex(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function sha256Text(txt) {
  return sha256Hex(Buffer.from(txt, 'utf8'));
}

function appendChainedEvent(filePath, eventWithoutHash) {
  const prev = 'GENESIS';
  eventWithoutHash.prevHash = prev;
  const canon = canonicalJson(eventWithoutHash);
  const hash = sha256Text(prev + '\n' + canon);
  const full = { ...eventWithoutHash, hash };
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, JSON.stringify(full) + '\n', 'utf8');
  return hash;
}

function runCli(args, cwd) {
  return execFileSync(process.execPath, ['dist/cli.js', ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

test('nato:mvp-verify-anchor verifies hash, signature, and drift', async () => {
  const repo = path.resolve('.');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cyberwb-anchor-'));
  const org = 'ORG_TEST';
  const root = path.join(tmp, 'deliverables', 'nato-mvp-store', org);
  fs.mkdirSync(root, { recursive: true });

  // create chained event logs
  const riskEvents = path.join(root, 'riskEvents.jsonl');
  const caseEvents = path.join(root, 'caseEvents.jsonl');
  const riskHead = appendChainedEvent(riskEvents, {
    eventId: 're_1',
    orgId: org,
    entityType: 'risk',
    entityId: 'R-1',
    action: 'risk.create',
    actor: 'tester',
    timestamp: new Date().toISOString(),
    snapshot: { riskId: 'R-1' }
  });
  const caseHead = appendChainedEvent(caseEvents, {
    eventId: 'ce_1',
    orgId: org,
    entityType: 'case',
    entityId: 'C-1',
    action: 'case.create',
    actor: 'tester',
    timestamp: new Date().toISOString(),
    snapshot: { caseId: 'C-1' }
  });

  // audit events file (hash is file sha256)
  const auditPath = path.join(root, 'auditEvents.jsonl');
  fs.appendFileSync(auditPath, JSON.stringify({ eventId: 'ae_1', orgId: org }) + '\n', 'utf8');
  const auditEventsHash = sha256Hex(fs.readFileSync(auditPath));

  // keypair + signature
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const pubPem = publicKey.export({ type: 'spki', format: 'pem' });
  const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const pubPath = path.join(tmp, 'pub.pem');
  const privPath = path.join(tmp, 'priv.pem');
  fs.writeFileSync(pubPath, pubPem);
  fs.writeFileSync(privPath, privPem);

  const payload = {
    anchorVersion: '1.0',
    orgId: org,
    generatedAt: new Date().toISOString(),
    generatedBy: 'test',
    riskHeadHash: riskHead,
    caseHeadHash: caseHead,
    auditEventsHash
  };

  const canon = canonicalJson(payload);
  const anchorHash = sha256Text(canon);
  const sig = crypto.sign(null, Buffer.from(canon, 'utf8'), privPem);

  const anchor = {
    ...payload,
    anchorHash,
    signature: { keyId: 'k1', alg: 'ed25519', value: sig.toString('base64') }
  };

  const anchorPath = path.join(tmp, 'audit-anchor.json');
  fs.writeFileSync(anchorPath, JSON.stringify(anchor, null, 2));

  // OK
  const out = runCli(['nato:mvp-verify-anchor', '--anchor', anchorPath, '--verify-key', pubPath, '--out', path.join(tmp, 'deliverables'), '--org', org], repo);
  assert.match(out, /OK anchorHash/);
  assert.match(out, /OK signature/);
  assert.match(out, /OK drift check/);

  // Drift after store modification
  appendChainedEvent(riskEvents, {
    eventId: 're_2',
    orgId: org,
    entityType: 'risk',
    entityId: 'R-1',
    action: 'risk.update',
    actor: 'tester',
    timestamp: new Date().toISOString(),
    snapshot: { riskId: 'R-1', status: 'open' }
  });

  assert.throws(() => runCli(['nato:mvp-verify-anchor', '--anchor', anchorPath, '--verify-key', pubPath, '--out', path.join(tmp, 'deliverables'), '--org', org], repo));
});
