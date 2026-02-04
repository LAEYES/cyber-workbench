import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { appendJsonl, emitAuditEvent, nowIso, readJson, storeRoot, uuid, writeJson } from "./nato_mvp_store.js";

export type EvidenceType =
  | "logExport"
  | "configSnapshot"
  | "ticket"
  | "report"
  | "sbom"
  | "vex"
  | "attestation"
  | "signature"
  | "screenshot";

export type Classification = "public" | "internal" | "sensitive";
export type RetentionClass = "short" | "standard" | "long" | "legal";

export type Evidence = {
  id: string;
  type: "evidence";
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;

  evidenceId: string;
  evidenceType: EvidenceType;
  sourceSystem: string;
  collectedAt: string;
  collectorId: string;

  hash: string;
  hashAlg: "sha256";
  storageRef: string;

  retentionClass: RetentionClass;
  classification?: Classification;
  metadata?: Record<string, unknown>;
};

function sha256File(p: string) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(p));
  return h.digest("hex");
}

function safeBasename(p: string) {
  return path.basename(p).replace(/[^A-Za-z0-9._-]/g, "_");
}

export function evidenceDbPath(outDir: string, orgId: string) {
  const root = storeRoot(outDir, orgId);
  return path.join(root, "evidence.json");
}

export function evidenceBlobDir(outDir: string, orgId: string) {
  const root = storeRoot(outDir, orgId);
  const p = path.join(root, "evidence-blobs");
  fs.mkdirSync(p, { recursive: true });
  return p;
}

export function chainOfCustodyPath(outDir: string, orgId: string, evidenceId: string) {
  const root = storeRoot(outDir, orgId);
  const p = path.join(root, "chain-of-custody", `${safeBasename(evidenceId)}.jsonl`);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  return p;
}

export async function natoMvpEvidenceIngest(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  collectorId?: string;

  evidenceId?: string;
  evidenceType: EvidenceType;
  sourceSystem: string;
  collectedAt?: string;
  classification: Classification;
  retentionClass: RetentionClass;
  metadata?: Record<string, unknown>;

  inFile: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const dbPath = evidenceDbPath(opts.outDir, opts.orgId);
  const db = readJson<Record<string, Evidence>>(dbPath, {});

  const evidenceId = opts.evidenceId || `E-${Date.now()}`;
  if (db[evidenceId]) throw new Error(`Evidence already exists: ${evidenceId}`);

  const abs = path.resolve(opts.inFile);
  if (!fs.existsSync(abs)) throw new Error(`input not found: ${opts.inFile}`);

  const filename = safeBasename(abs);
  const storedName = `${safeBasename(evidenceId)}_${filename}`;
  const blobDir = evidenceBlobDir(opts.outDir, opts.orgId);
  const blobAbs = path.join(blobDir, storedName);

  // Copy into store
  fs.copyFileSync(abs, blobAbs);

  const hash = sha256File(blobAbs);
  const storageRef = path.relative(root, blobAbs).replace(/\\/g, "/");

  const e: Evidence = {
    id: `evidence_${uuid()}`,
    type: "evidence",
    version: 1,
    createdAt: nowIso(),
    createdBy: opts.actor,

    evidenceId,
    evidenceType: opts.evidenceType,
    sourceSystem: opts.sourceSystem,
    collectedAt: opts.collectedAt || nowIso(),
    collectorId: opts.collectorId || opts.actor,

    hash,
    hashAlg: "sha256",
    storageRef,

    retentionClass: opts.retentionClass,
    classification: opts.classification,
    metadata: opts.metadata || {}
  };

  db[evidenceId] = e;
  writeJson(dbPath, db);

  // Emit audit event
  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "evidence.ingest",
    objectRef: `evidence:${evidenceId}`,
    outcome: "success",
    details: { evidenceType: e.evidenceType, storageRef: e.storageRef, hash: e.hash }
  });

  // Create initial chain-of-custody event (hash-chained)
  await natoMvpChainAppend({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    evidenceId,
    action: "collected",
    timestamp: e.collectedAt,
    details: { sourceSystem: e.sourceSystem, storageRef: e.storageRef, hash: e.hash, hashAlg: e.hashAlg }
  });

  console.log("OK evidence ingested", evidenceId);
  console.log("OK stored", blobAbs);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}

export async function natoMvpEvidenceGet(opts: { outDir: string; orgId: string; evidenceId: string }) {
  const dbPath = evidenceDbPath(opts.outDir, opts.orgId);
  const db = readJson<Record<string, Evidence>>(dbPath, {});
  const e = db[opts.evidenceId];
  if (!e) throw new Error(`Evidence not found: ${opts.evidenceId}`);
  console.log(JSON.stringify(e, null, 2));
}

export type ChainOfCustodyAction = "collected" | "transferred" | "accessed" | "sealed" | "verified";

export type ChainOfCustodyEvent = {
  id: string;
  type: "chainOfCustodyEvent";
  version: number;
  createdAt: string;
  createdBy: string;

  eventId: string;
  evidenceId: string;
  action: ChainOfCustodyAction;
  actor: string;
  timestamp: string;

  prevHash: string;
  eventHash: string;
  hashAlg: "sha256";

  location?: string;
  details?: Record<string, unknown>;
};

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function getLastEventHash(jsonlPath: string): string {
  if (!fs.existsSync(jsonlPath)) return "0".repeat(64);
  const lines = fs.readFileSync(jsonlPath, "utf8").trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return "0".repeat(64);
  const last = JSON.parse(lines[lines.length - 1]) as { eventHash?: string };
  return last.eventHash && typeof last.eventHash === "string" ? last.eventHash : "0".repeat(64);
}

export async function natoMvpChainAppend(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  evidenceId: string;
  action: ChainOfCustodyAction;
  timestamp?: string;
  location?: string;
  details?: Record<string, unknown>;
}) {
  const cocPath = chainOfCustodyPath(opts.outDir, opts.orgId, opts.evidenceId);
  const prevHash = getLastEventHash(cocPath);

  const base = {
    id: `coc_${uuid()}`,
    type: "chainOfCustodyEvent" as const,
    version: 1,
    createdAt: nowIso(),
    createdBy: opts.actor,

    eventId: `coc_${uuid()}`,
    evidenceId: opts.evidenceId,
    action: opts.action,
    actor: opts.actor,
    timestamp: opts.timestamp || nowIso(),

    prevHash,
    hashAlg: "sha256" as const,

    location: opts.location,
    details: opts.details || {}
  };

  // Deterministic hash over the base payload (excluding eventHash)
  const payload = JSON.stringify(base);
  const eventHash = sha256Hex(payload);

  const ev: ChainOfCustodyEvent = { ...base, eventHash };
  appendJsonl(cocPath, ev);

  emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "evidence.chain.append",
    objectRef: `evidence:${opts.evidenceId}`,
    outcome: "success",
    details: { chainFile: path.relative(storeRoot(opts.outDir, opts.orgId), cocPath).replace(/\\/g, "/"), action: opts.action, eventHash, prevHash }
  });

  console.log("OK chain event appended", ev.eventId, `hash=${ev.eventHash}`);
}

export async function natoMvpChainList(opts: { outDir: string; orgId: string; evidenceId: string }) {
  const cocPath = chainOfCustodyPath(opts.outDir, opts.orgId, opts.evidenceId);
  if (!fs.existsSync(cocPath)) {
    console.log("[]");
    return;
  }
  const lines = fs.readFileSync(cocPath, "utf8").trim().split(/\r?\n/).filter(Boolean);
  const events = lines.map((l) => JSON.parse(l));
  console.log(JSON.stringify(events, null, 2));
}
