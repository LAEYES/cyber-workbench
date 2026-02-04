import fs from "node:fs";
import path from "node:path";
import { natoMvpGenerateSigningKey } from "./nato_mvp_keys.js";
import { natoMvpRiskCreate } from "./nato_mvp_risk.js";
import { natoMvpDecisionCreate } from "./nato_mvp_decision.js";
import { natoMvpCaseCreate } from "./nato_mvp_case.js";
import { natoMvpExportFromStore } from "./nato_mvp_export_from_store.js";
import { natoMvpVerifyManifest } from "./nato_mvp_verify_manifest.js";
import { natoMvpVerifyBundle } from "./nato_mvp_verify.js";
import { natoMvpExportAnchor } from "./nato_mvp_export_anchor.js";
import { natoMvpVerifyAnchor } from "./nato_mvp_verify_anchor.js";

export async function natoMvpDemo(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  sign?: boolean;
}) {
  const outDir = path.resolve(opts.outDir);
  const orgId = opts.orgId;
  const actor = opts.actor;

  // 0) Prepare evidence file
  const demoEvidenceDir = path.join(outDir, "nato-mvp", ".demo");
  fs.mkdirSync(demoEvidenceDir, { recursive: true });
  const evidencePath = path.join(demoEvidenceDir, "demo-evidence.txt");
  fs.writeFileSync(evidencePath, `demo evidence generatedAt=${new Date().toISOString()}\n`, "utf8");

  // 1) Keys (optional)
  const keysDir = path.join(outDir, "nato-mvp", "keys");
  const keyBase = `nato-mvp-ed25519-${Date.now()}`;
  let signingKey: string | undefined;
  let verifyKey: string | undefined;

  if (opts.sign) {
    await natoMvpGenerateSigningKey({ outDir: keysDir, name: keyBase });
    signingKey = path.join(keysDir, `${keyBase}.private.pem`);
    verifyKey = path.join(keysDir, `${keyBase}.public.pem`);
  }

  // 2) Create risk + decision + case
  const riskId = `R-DEMO-${Date.now()}`;
  await natoMvpRiskCreate({
    outDir,
    orgId,
    actor,
    riskId,
    title: "Demo risk",
    owner: "owner",
    likelihood: 3,
    impact: 4,
    dueDate: "2030-01-01",
    status: "open"
  });

  await natoMvpDecisionCreate({
    outDir,
    orgId,
    actor,
    riskId,
    decisionType: "treat",
    rationale: "Demo decision",
    approvedBy: "approver"
  });

  await natoMvpCaseCreate({
    outDir,
    orgId,
    actor,
    caseId: `C-DEMO-${Date.now()}`,
    severity: "high",
    status: "new",
    owner: "case-owner"
  });

  // 3) Export bundle from store (includes risk/decision metadata as evidence)
  const scopeRef = `risk:${riskId}`;
  await natoMvpExportFromStore({
    scopeRef,
    orgId,
    storeOutDir: outDir,
    outDir,
    actor,
    inputs: [evidencePath],
    sign: Boolean(opts.sign),
    signingKey,
    keyId: keyBase
  });

  // 4) Verify bundle
  const bundleDir = path.join(outDir, "nato-mvp", scopeRef.replace(/[^A-Za-z0-9._-]/g, "_"));
  await natoMvpVerifyManifest({ bundleDir, verifyKey });
  await natoMvpVerifyBundle({ manifest: path.join(bundleDir, "manifest.json") });

  // 5) Export + verify audit anchor
  const anchorPath = await natoMvpExportAnchor({ outDir, orgId, actor, sign: Boolean(opts.sign), signingKey, keyId: keyBase });
  await natoMvpVerifyAnchor({ outDir, orgId, anchorPath, verifyKey });

  console.log("DEMO_OK", { outDir, orgId, riskId, scopeRef, bundleDir, anchorPath });
}
