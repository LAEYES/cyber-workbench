import fs from "node:fs";
import path from "node:path";
import { readJson, storeRoot } from "./nato_mvp_store.js";
import type { Risk } from "./nato_mvp_risk.js";
import type { Decision } from "./nato_mvp_decision.js";
import type { Case } from "./nato_mvp_case.js";
import { natoMvpExport } from "./nato_mvp_export.js";

function safeBasename(p: string) {
  return path.basename(p).replace(/[^A-Za-z0-9._-]/g, "_");
}

type AuditEvent = {
  eventId: string;
  orgId: string;
  actor: string;
  actorType: "human" | "service";
  action: string;
  objectRef: string;
  timestamp: string;
  outcome: "success" | "failure";
  requestId?: string;
  details?: Record<string, unknown>;
};

function readAuditEventsJsonl(filePath: string): AuditEvent[] {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.map((l) => JSON.parse(l) as AuditEvent);
}

export async function natoMvpExportFromRequestId(opts: {
  requestId: string;
  orgId: string;
  actor: string;
  storeOutDir: string;
  outDir: string;
  sign?: boolean;
  signingKey?: string;
  keyId?: string;
}) {
  if (!opts.requestId?.trim()) throw new Error("--request is required");

  const root = storeRoot(opts.storeOutDir, opts.orgId);
  const auditPath = path.join(root, "auditEvents.jsonl");
  const risksPath = path.join(root, "risks.json");
  const decisionsPath = path.join(root, "decisions.json");

  const events = readAuditEventsJsonl(auditPath).filter((e) => e.requestId === opts.requestId);
  if (events.length === 0) throw new Error(`No audit events found for requestId: ${opts.requestId}`);

  const risks = readJson<Record<string, Risk>>(risksPath, {});
  const decisions = readJson<Record<string, Decision>>(decisionsPath, {});
  const casesPath = path.join(root, "cases.json");
  const cases = readJson<Record<string, Case>>(casesPath, {});

  const tmpDir = path.join(path.resolve(opts.outDir), "nato-mvp", ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const auditMetaPath = path.join(tmpDir, `audit_${safeBasename(opts.requestId)}.json`);
  fs.writeFileSync(auditMetaPath, JSON.stringify(events, null, 2) + "\n", "utf8");

  const objectRefs = new Set(events.map((e) => e.objectRef).filter(Boolean));

  const extraMeta: string[] = [auditMetaPath];

  for (const ref of objectRefs) {
    // Parse minimal refs like "risk:R-TEST" or "decision:D-..."
    if (ref.startsWith("risk:")) {
      const rid = ref.slice("risk:".length);
      const r = risks[rid];
      if (r) {
        const p = path.join(tmpDir, `risk_${safeBasename(rid)}.json`);
        fs.writeFileSync(p, JSON.stringify(r, null, 2) + "\n", "utf8");
        extraMeta.push(p);
      }
    }

    if (ref.startsWith("decision:")) {
      const did = ref.slice("decision:".length);
      const d = decisions[did];
      if (d) {
        const p = path.join(tmpDir, `decision_${safeBasename(did)}.json`);
        fs.writeFileSync(p, JSON.stringify(d, null, 2) + "\n", "utf8");
        extraMeta.push(p);
      }
    }

    if (ref.startsWith("case:")) {
      const cid = ref.slice("case:".length);
      const c = cases[cid];
      if (c) {
        const p = path.join(tmpDir, `case_${safeBasename(cid)}.json`);
        fs.writeFileSync(p, JSON.stringify(c, null, 2) + "\n", "utf8");
        extraMeta.push(p);
      }
    }
  }

  const scopeRef = `requestId:${opts.requestId}`;

  await natoMvpExport({
    scopeRef,
    inputs: extraMeta,
    outDir: opts.outDir,
    orgId: opts.orgId,
    classification: "internal",
    retentionClass: "standard",
    evidenceType: "report",
    sign: opts.sign,
    signingKey: opts.signingKey,
    keyId: opts.keyId
  });

  console.log("OK included audit metadata:", auditMetaPath);
  console.log("OK included object metadata:", extraMeta.length - 1);
}
