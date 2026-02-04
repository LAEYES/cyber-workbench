import fs from "node:fs";
import path from "node:path";
import type { Risk } from "./nato_mvp_risk.js";
import type { Decision } from "./nato_mvp_decision.js";
import type { Case } from "./nato_mvp_case.js";
import type { Evidence } from "./nato_mvp_evidence.js";
import { readJson, storeRoot } from "./nato_mvp_store.js";
import { natoMvpExport } from "./nato_mvp_export.js";
import { natoMvpChainAppend } from "./nato_mvp_evidence.js";

function safeBasename(p: string) {
  return path.basename(p).replace(/[^A-Za-z0-9._-]/g, "_");
}

function resolveEvidenceInputFiles(
  storeRootAbs: string,
  evidences: Record<string, Evidence>,
  evidenceRefs: string[]
): string[] {
  const inputs: string[] = [];
  for (const ref of evidenceRefs || []) {
    const e = evidences[ref];
    if (!e) throw new Error(`Evidence ref not found in store: ${ref}`);
    const abs = path.join(storeRootAbs, e.storageRef);
    if (!fs.existsSync(abs)) throw new Error(`Evidence blob not found on disk: ${abs}`);

    inputs.push(abs);
  }
  return inputs;
}

export async function natoMvpExportFromStore(opts: {
  scopeRef: string; // risk:<id> | case:<id>
  orgId: string;
  storeOutDir: string;
  outDir: string;
  actor: string;
  inputs: string[];
  sign?: boolean;
  signingKey?: string;
  keyId?: string;
}) {
  const root = storeRoot(opts.storeOutDir, opts.orgId);

  const risksPath = path.join(root, "risks.json");
  const decisionsPath = path.join(root, "decisions.json");
  const casesPath = path.join(root, "cases.json");
  const evidencePath = path.join(root, "evidence.json");

  const risks = readJson<Record<string, Risk>>(risksPath, {});
  const decisions = readJson<Record<string, Decision>>(decisionsPath, {});
  const cases = readJson<Record<string, Case>>(casesPath, {});
  const evidences = readJson<Record<string, Evidence>>(evidencePath, {});

  // Create temp metadata files inside outDir/.tmp so they can be included as evidence blobs.
  const tmpDir = path.join(path.resolve(opts.outDir), "nato-mvp", ".tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  let scopeEvidenceRefs: string[] = [];
  const metaFiles: string[] = [];

  if (opts.scopeRef.startsWith("risk:")) {
    const riskId = opts.scopeRef.slice("risk:".length);
    const risk = risks[riskId];
    if (!risk) throw new Error(`Risk not found in store: ${riskId}`);

    const relatedDecisions = Object.values(decisions).filter((d) => d.riskId === riskId);

    const riskMetaPath = path.join(tmpDir, `risk_${safeBasename(riskId)}.json`);
    const decisionsMetaPath = path.join(tmpDir, `decisions_${safeBasename(riskId)}.json`);
    fs.writeFileSync(riskMetaPath, JSON.stringify(risk, null, 2) + "\n", "utf8");
    fs.writeFileSync(decisionsMetaPath, JSON.stringify(relatedDecisions, null, 2) + "\n", "utf8");

    metaFiles.push(riskMetaPath, decisionsMetaPath);

    // Include evidenceRefs from risk + related decisions
    scopeEvidenceRefs = Array.from(
      new Set([...(risk.evidenceRefs || []), ...relatedDecisions.flatMap((d) => d.evidenceRefs || [])])
    );

    console.log("OK included store metadata:", riskMetaPath, decisionsMetaPath);
  } else if (opts.scopeRef.startsWith("case:")) {
    const caseId = opts.scopeRef.slice("case:".length);
    const c = cases[caseId];
    if (!c) throw new Error(`Case not found in store: ${caseId}`);

    const caseMetaPath = path.join(tmpDir, `case_${safeBasename(caseId)}.json`);
    fs.writeFileSync(caseMetaPath, JSON.stringify(c, null, 2) + "\n", "utf8");
    metaFiles.push(caseMetaPath);

    const relatedRisks = (c.riskRefs || []).map((rid) => risks[rid]).filter(Boolean);
    if (relatedRisks.length) {
      const risksMetaPath = path.join(tmpDir, `risks_for_case_${safeBasename(caseId)}.json`);
      fs.writeFileSync(risksMetaPath, JSON.stringify(relatedRisks, null, 2) + "\n", "utf8");
      metaFiles.push(risksMetaPath);
    }

    // Include evidenceRefs from case (plus linked risks/decisions if present)
    const riskIds = c.riskRefs || [];
    const relatedDecisions = Object.values(decisions).filter((d) => riskIds.includes(d.riskId));

    scopeEvidenceRefs = Array.from(
      new Set([
        ...(c.evidenceRefs || []),
        ...riskIds.flatMap((rid) => risks[rid]?.evidenceRefs || []),
        ...relatedDecisions.flatMap((d) => d.evidenceRefs || [])
      ])
    );

    console.log("OK included store metadata:", metaFiles.join(", "));
  } else {
    throw new Error("Only risk:<id> or case:<id> scope is supported in MVP export-from-store");
  }

  const storeEvidenceFiles = resolveEvidenceInputFiles(root, evidences, scopeEvidenceRefs);

  // Append a hash-chained chain-of-custody event for each exported evidence blob
  for (const evidenceId of scopeEvidenceRefs) {
    await natoMvpChainAppend({
      outDir: opts.storeOutDir,
      orgId: opts.orgId,
      actor: opts.actor,
      evidenceId,
      action: "accessed",
      details: { reason: "export", scopeRef: opts.scopeRef }
    });
  }

  const allInputs = [...metaFiles, ...storeEvidenceFiles, ...(opts.inputs || [])];

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

  console.log("OK included store evidenceRefs:", scopeEvidenceRefs.join(", ") || "(none)");
}
