import path from "node:path";
import { emitAuditEvent, readJson, storeRoot, writeJson } from "./nato_mvp_store.js";
import type { Case } from "./nato_mvp_case.js";
import type { Risk } from "./nato_mvp_risk.js";
import type { Evidence } from "./nato_mvp_evidence.js";

export async function natoMvpCaseLinkEvidence(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  caseId: string;
  evidenceId: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const casesPath = path.join(root, "cases.json");
  const evidencePath = path.join(root, "evidence.json");

  const cases = readJson<Record<string, Case>>(casesPath, {});
  const evidences = readJson<Record<string, Evidence>>(evidencePath, {});

  const c = cases[opts.caseId];
  if (!c) throw new Error(`Case not found: ${opts.caseId}`);
  if (!evidences[opts.evidenceId]) throw new Error(`Evidence not found: ${opts.evidenceId}`);

  const set = new Set(c.evidenceRefs || []);
  set.add(opts.evidenceId);
  c.evidenceRefs = Array.from(set);
  c.version += 1;

  cases[opts.caseId] = c;
  writeJson(casesPath, cases);

  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "case.linkEvidence",
    objectRef: `case:${opts.caseId}`,
    outcome: "success",
    details: { evidenceId: opts.evidenceId }
  });

  console.log("OK case linked evidence", opts.caseId, "<-", opts.evidenceId);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}

export async function natoMvpRiskLinkEvidence(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  riskId: string;
  evidenceId: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const risksPath = path.join(root, "risks.json");
  const evidencePath = path.join(root, "evidence.json");

  const risks = readJson<Record<string, Risk>>(risksPath, {});
  const evidences = readJson<Record<string, Evidence>>(evidencePath, {});

  const r = risks[opts.riskId];
  if (!r) throw new Error(`Risk not found: ${opts.riskId}`);
  if (!evidences[opts.evidenceId]) throw new Error(`Evidence not found: ${opts.evidenceId}`);

  const set = new Set(r.evidenceRefs || []);
  set.add(opts.evidenceId);
  r.evidenceRefs = Array.from(set);
  r.version += 1;

  risks[opts.riskId] = r;
  writeJson(risksPath, risks);

  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "risk.linkEvidence",
    objectRef: `risk:${opts.riskId}`,
    outcome: "success",
    details: { evidenceId: opts.evidenceId }
  });

  console.log("OK risk linked evidence", opts.riskId, "<-", opts.evidenceId);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}
