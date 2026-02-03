import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function uuid() {
  // Node 22 has crypto.randomUUID
  return crypto.randomUUID();
}

export function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

export function storeRoot(outDir: string, orgId: string) {
  const root = path.resolve(outDir, "nato-mvp-store", orgId);
  ensureDir(root);
  return root;
}

export function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJson(filePath: string, obj: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

export function appendJsonl(filePath: string, obj: unknown) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, JSON.stringify(obj) + "\n", "utf8");
}

export function emitAuditEvent(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  actorType: "human" | "service";
  action: string;
  objectRef: string;
  outcome: "success" | "failure";
  details?: Record<string, unknown>;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const auditPath = path.join(root, "auditEvents.jsonl");
  const event = {
    eventId: `ae_${uuid()}`,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: opts.actorType,
    action: opts.action,
    objectRef: opts.objectRef,
    timestamp: nowIso(),
    outcome: opts.outcome,
    requestId: `req_${uuid()}`,
    details: opts.details || {}
  };
  appendJsonl(auditPath, event);
  return event;
}
