import path from "node:path";
import type { Case } from "./nato_mvp_case.js";
import type { Risk } from "./nato_mvp_risk.js";
import { emitAuditEvent, nowIso, readJson, storeRoot, writeJson } from "./nato_mvp_store.js";

export async function natoMvpCaseLinkRisk(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  caseId: string;
  riskId: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const casesPath = path.join(root, "cases.json");
  const risksPath = path.join(root, "risks.json");

  const cases = readJson<Record<string, Case>>(casesPath, {});
  const risks = readJson<Record<string, Risk>>(risksPath, {});

  const c = cases[opts.caseId];
  if (!c) throw new Error(`Case not found: ${opts.caseId}`);
  if (!risks[opts.riskId]) throw new Error(`Risk not found: ${opts.riskId}`);

  const refs = new Set<string>(c.riskRefs || []);
  refs.add(opts.riskId);

  const updated: Case = {
    ...c,
    riskRefs: Array.from(refs),
    version: (c.version || 1) + 1,
    updatedAt: nowIso()
  };

  cases[opts.caseId] = updated;
  writeJson(casesPath, cases);

  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "case.linkRisk",
    objectRef: `case:${opts.caseId}`,
    outcome: "success",
    details: { riskId: opts.riskId, riskRefs: updated.riskRefs }
  });

  console.log("OK case linked risk", `case=${opts.caseId}`, `risk=${opts.riskId}`);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}
