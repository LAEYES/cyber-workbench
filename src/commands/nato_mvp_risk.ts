import path from "node:path";
import { emitAuditEvent, nowIso, readJson, storeRoot, uuid, writeJson } from "./nato_mvp_store.js";

export type RiskStatus = "new" | "open" | "accepted" | "mitigated" | "closed";

export type Risk = {
  id: string;
  type: "risk";
  version: number;
  createdAt: string;
  createdBy: string;

  orgId: string;
  riskId: string;
  title: string;
  description?: string;
  owner: string;
  likelihood: number;
  impact: number;
  score: number;
  status: RiskStatus;
  dueDate: string; // YYYY-MM-DD

  controlRefs?: string[];
  evidenceRefs?: string[];
  caseRefs?: string[];
};

export async function natoMvpRiskCreate(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  riskId?: string;
  title: string;
  owner: string;
  likelihood: number;
  impact: number;
  dueDate: string;
  status?: RiskStatus;
  description?: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const dbPath = path.join(root, "risks.json");
  const db = readJson<Record<string, Risk>>(dbPath, {});

  const riskId = opts.riskId || `R-${Date.now()}`;
  if (db[riskId]) throw new Error(`Risk already exists: ${riskId}`);

  const likelihood = Number(opts.likelihood);
  const impact = Number(opts.impact);
  if (![1, 2, 3, 4, 5].includes(likelihood)) throw new Error("likelihood must be 1..5");
  if (![1, 2, 3, 4, 5].includes(impact)) throw new Error("impact must be 1..5");

  const r: Risk = {
    id: `risk_${uuid()}`,
    type: "risk",
    version: 1,
    createdAt: nowIso(),
    createdBy: opts.actor,

    orgId: opts.orgId,
    riskId,
    title: opts.title,
    description: opts.description,
    owner: opts.owner,
    likelihood,
    impact,
    score: likelihood * impact,
    status: opts.status || "open",
    dueDate: opts.dueDate
  };

  db[riskId] = r;
  writeJson(dbPath, db);

  const ae = emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "risk.create",
    objectRef: `risk:${riskId}`,
    outcome: "success",
    details: { title: r.title, owner: r.owner, score: r.score }
  });

  console.log("OK risk created", riskId, `score=${r.score}`);
  console.log("OK auditEvent", ae.eventId, `requestId=${ae.requestId}`);
}

export async function natoMvpRiskGet(opts: { outDir: string; orgId: string; riskId: string }) {
  const root = storeRoot(opts.outDir, opts.orgId);
  const dbPath = path.join(root, "risks.json");
  const db = readJson<Record<string, Risk>>(dbPath, {});
  const r = db[opts.riskId];
  if (!r) throw new Error(`Risk not found: ${opts.riskId}`);
  console.log(JSON.stringify(r, null, 2));
}
