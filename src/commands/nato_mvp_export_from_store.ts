import fs from "node:fs";
import path from "node:path";
import type { Risk } from "./nato_mvp_risk.js";
import type { Decision } from "./nato_mvp_decision.js";
import { readJson, storeRoot } from "./nato_mvp_store.js";
import { natoMvpExport } from "./nato_mvp_export.js";

function safeBasename(p: string) {
  return path.basename(p).replace(/[^A-Za-z0-9._-]/g, "_");
}

export async function natoMvpExportFromStore(opts: {
  scopeRef: string; // e.g., risk:R-TEST
  orgId: string;
  storeOutDir: string;
  outDir: string;
  actor: string;
  inputs: string[];
  sign?: boolean;
  signingKey?: string;
  keyId?: string;
}) {
  if (!opts.scopeRef.startsWith("risk:")) {
    throw new Error("Only risk:<id> scope is supported in MVP export-from-store");
  }
  const riskId = opts.scopeRef.slice("risk:".length);

  const root = storeRoot(opts.storeOutDir, opts.orgId);
  const risksPath = path.join(root, "risks.json");
  const decisionsPath = path.join(root, "decisions.json");

  const risks = readJson<Record<string, Risk>>(risksPath, {});
  const decisions = readJson<Record<string, Decision>>(decisionsPath, {});

  const risk = risks[riskId];
  if (!risk) throw new Error(`Risk not found in store: ${riskId}`);

  const relatedDecisions = Object.values(decisions).filter((d) => d.riskId === riskId);

  // Create temp metadata files inside outDir/.tmp so they can be included as evidence blobs.
  const tmpDir = path.join(path.resolve(opts.outDir), "nato-mvp", ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  const riskMetaPath = path.join(tmpDir, `risk_${safeBasename(riskId)}.json`);
  const decisionsMetaPath = path.join(tmpDir, `decisions_${safeBasename(riskId)}.json`);

  fs.writeFileSync(riskMetaPath, JSON.stringify(risk, null, 2) + "\n", "utf8");
  fs.writeFileSync(decisionsMetaPath, JSON.stringify(relatedDecisions, null, 2) + "\n", "utf8");

  const allInputs = [riskMetaPath, decisionsMetaPath, ...(opts.inputs || [])];

  await natoMvpExport({
    scopeRef: opts.scopeRef,
    inputs: allInputs,
    outDir: opts.outDir,
    orgId: opts.orgId,
    classification: "internal",
    retentionClass: "standard",
    evidenceType: "report",
    sign: opts.sign,
    signingKey: opts.signingKey,
    keyId: opts.keyId
  });

  console.log("OK included store metadata:", riskMetaPath, decisionsMetaPath);
}
