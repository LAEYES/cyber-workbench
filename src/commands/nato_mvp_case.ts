import path from "node:path";
import { emitAuditEvent, nowIso, readJson, storeRoot, uuid, writeJson } from "./nato_mvp_store.js";

export type CaseSeverity = "low" | "medium" | "high" | "critical";
export type CaseStatus =
  | "new"
  | "triage"
  | "investigate"
  | "contain"
  | "eradicate"
  | "recover"
  | "closed";

export type Case = {
  id: string;
  type: "case";
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;

  orgId: string;
  caseId: string;
  severity: CaseSeverity;
  status: CaseStatus;
  owner: string;

  triagedAt?: string;
  containedAt?: string;
  closedAt?: string;

  timelineRefs?: string[];
  evidenceRefs?: string[];
  riskRefs?: string[];
};

export async function natoMvpCaseCreate(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  caseId?: string;
  severity: CaseSeverity;
  status?: CaseStatus;
  owner: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const dbPath = path.join(root, "cases.json");
  const db = readJson<Record<string, Case>>(dbPath, {});

  const caseId = opts.caseId || `C-${Date.now()}`;
  if (db[caseId]) throw new Error(`Case already exists: ${caseId}`);

  const c: Case = {
    id: `case_${uuid()}`,
    type: "case",
    version: 1,
    createdAt: nowIso(),
    createdBy: opts.actor,

    orgId: opts.orgId,
    caseId,
    severity: opts.severity,
    status: opts.status || "new",
    owner: opts.owner
  };

  db[caseId] = c;
  writeJson(dbPath, db);

  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "case.create",
    objectRef: `case:${caseId}`,
    outcome: "success",
    details: { severity: c.severity, status: c.status, owner: c.owner }
  });

  console.log("OK case created", caseId);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}

export async function natoMvpCaseGet(opts: { outDir: string; orgId: string; caseId: string }) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const dbPath = path.join(root, "cases.json");
  const db = readJson<Record<string, Case>>(dbPath, {});
  const c = db[opts.caseId];
  if (!c) throw new Error(`Case not found: ${opts.caseId}`);
  console.log(JSON.stringify(c, null, 2));
}
