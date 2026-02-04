import path from "node:path";
import { emitAuditEvent, nowIso, readJson, storeRoot, uuid, writeJson } from "./nato_mvp_store.js";
import type { Risk } from "./nato_mvp_risk.js";

export type DecisionType = "treat" | "avoid" | "transfer" | "accept";

export type Decision = {
  id: string;
  type: "decision";
  version: number;
  createdAt: string;
  createdBy: string;

  orgId: string;
  decisionId: string;
  riskId: string;
  decisionType: DecisionType;
  rationale: string;
  approvedBy: string;
  approvedAt: string;
  expiryDate?: string; // required if accept
  evidenceRefs?: string[];
};

export async function natoMvpDecisionCreate(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  riskId: string;
  decisionType: DecisionType;
  rationale: string;
  approvedBy: string;
  expiryDate?: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);

  const risksPath = path.join(root, "risks.json");
  const risks = readJson<Record<string, Risk>>(risksPath, {});
  const risk = risks[opts.riskId];
  if (!risk) throw new Error(`Risk not found: ${opts.riskId}`);

  // SoD: owner cannot self-approve acceptance
  if (opts.decisionType === "accept" && opts.approvedBy === risk.owner) {
    throw new Error("SoD violation: risk owner cannot approve their own acceptance");
  }

  if (opts.decisionType === "accept" && !opts.expiryDate) {
    throw new Error("expiryDate is required when decisionType=accept");
  }

  const decisionsPath = path.join(root, "decisions.json");
  const db = readJson<Record<string, Decision>>(decisionsPath, {});

  const decisionId = `D-${Date.now()}`;
  const d: Decision = {
    id: `decision_${uuid()}`,
    type: "decision",
    version: 1,
    createdAt: nowIso(),
    createdBy: opts.actor,

    orgId: opts.orgId,
    decisionId,
    riskId: opts.riskId,
    decisionType: opts.decisionType,
    rationale: opts.rationale,
    approvedBy: opts.approvedBy,
    approvedAt: nowIso(),
    expiryDate: opts.expiryDate
  };

  db[decisionId] = d;
  writeJson(decisionsPath, db);

  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "risk.decision.create",
    objectRef: `decision:${decisionId}`,
    outcome: "success",
    details: { riskId: opts.riskId, decisionType: opts.decisionType }
  });

  console.log("OK decision created", decisionId, `risk=${opts.riskId}`, `type=${opts.decisionType}`);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}
