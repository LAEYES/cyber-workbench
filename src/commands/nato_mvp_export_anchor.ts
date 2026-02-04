import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { emitAuditEvent, storeRoot } from "./nato_mvp_store.js";

function sha256Hex(buf: Buffer | Uint8Array) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function sha256Text(txt: string) {
  return sha256Hex(Buffer.from(txt, "utf8"));
}

function sha256File(filePath: string) {
  return sha256Hex(fs.readFileSync(filePath));
}

function canonicalize(value: any): any {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const out: any = {};
    for (const k of Object.keys(value).sort((a, b) => a.localeCompare(b, "en"))) {
      out[k] = canonicalize(value[k]);
    }
    return out;
  }
  return value;
}

function canonicalJson(value: any) {
  return JSON.stringify(canonicalize(value));
}

function getLastHashOrGenesis(filePath: string): string {
  if (!fs.existsSync(filePath)) return "GENESIS";
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i]?.trim();
    if (!l) continue;
    try {
      const obj = JSON.parse(l);
      const hash = obj?.hash;
      if (typeof hash === "string" && hash.length > 0) return hash;
      return "GENESIS";
    } catch {
      return "GENESIS";
    }
  }
  return "GENESIS";
}

export async function natoMvpExportAnchor(opts: {
  outDir: string;
  orgId: string;
  actor: string;
  keyId?: string;
  sign?: boolean;
  signingKey?: string; // private key PEM
}) {
  const root = storeRoot(opts.outDir, opts.orgId);

  const outPath = path.join(root, `audit-anchor_${new Date().toISOString().replace(/[:.]/g, "").replace(/Z$/, "Z")}.json`);

  // Emit audit first so auditEventsHash includes this export event
  emitAuditEvent({
    outDir: opts.outDir,
    orgId: opts.orgId,
    actor: opts.actor,
    actorType: "human",
    action: "store.exportAuditAnchor",
    objectRef: `anchor:${path.basename(outPath)}`,
    outcome: "success"
  });

  const riskHeadHash = getLastHashOrGenesis(path.join(root, "riskEvents.jsonl"));
  const caseHeadHash = getLastHashOrGenesis(path.join(root, "caseEvents.jsonl"));
  const auditPath = path.join(root, "auditEvents.jsonl");
  const auditEventsHash = fs.existsSync(auditPath) ? sha256File(auditPath) : "MISSING";

  const payload: any = {
    anchorVersion: "1.0",
    orgId: opts.orgId,
    generatedAt: new Date().toISOString(),
    generatedBy: "cyberwb nato-mvp",
    riskHeadHash,
    caseHeadHash,
    auditEventsHash
  };

  const canon = canonicalJson(payload);
  const anchorHash = sha256Text(canon);

  const anchor: any = { ...payload, anchorHash };

  if (opts.sign) {
    if (!opts.signingKey) throw new Error("--signing-key is required when --sign is set");
    const privPem = fs.readFileSync(path.resolve(opts.signingKey), "utf8");
    const sig = crypto.sign(null, Buffer.from(canon, "utf8"), privPem);
    anchor.signature = {
      keyId: opts.keyId || "mvp-local-1",
      alg: "ed25519",
      value: sig.toString("base64")
    };
  }

  fs.writeFileSync(outPath, JSON.stringify(anchor, null, 2) + "\n", "utf8");
  console.log("OK anchor exported", outPath);
  return outPath;
}
