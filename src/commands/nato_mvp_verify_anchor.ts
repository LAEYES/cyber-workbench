import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { storeRoot } from "./nato_mvp_store.js";

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

export async function natoMvpVerifyAnchor(opts: {
  outDir: string;
  orgId: string;
  anchorPath: string;
  verifyKey?: string;
}) {
  const root = storeRoot(opts.outDir, opts.orgId);

  const anchorPath = path.resolve(opts.anchorPath);
  if (!fs.existsSync(anchorPath)) throw new Error(`Anchor file not found: ${anchorPath}`);

  const anchor = JSON.parse(fs.readFileSync(anchorPath, "utf8"));
  const signature = anchor.signature ?? null;

  // Build payload for hashing/signing: remove signature and anchorHash
  const payload: any = { ...anchor };
  delete payload.signature;
  const expectedAnchorHash = payload.anchorHash;
  delete payload.anchorHash;

  const canon = canonicalJson(payload);
  const computed = sha256Text(canon);

  if (typeof expectedAnchorHash !== "string" || !/^[0-9a-f]{64}$/i.test(expectedAnchorHash)) {
    throw new Error(`Invalid anchorHash in file: ${anchorPath}`);
  }
  if (computed.toLowerCase() !== expectedAnchorHash.toLowerCase()) {
    throw new Error(`ANCHOR_HASH_MISMATCH expected=${expectedAnchorHash} computed=${computed}`);
  }
  console.log("OK anchorHash");

  // Signature verification if present
  if (signature) {
    const alg = signature.alg;
    const val = signature.value;
    const keyId = signature.keyId;

    if (String(alg).toLowerCase() !== "ed25519") throw new Error(`UNSUPPORTED_ALG ${alg}`);

    if (!opts.verifyKey) {
      console.warn("WARN anchor is signed but no public key provided (--verify-key)");
    } else {
      const pubPem = fs.readFileSync(path.resolve(opts.verifyKey), "utf8");
      const sigBuf = Buffer.from(String(val), "base64");
      const ok = crypto.verify(null, Buffer.from(canon, "utf8"), pubPem, sigBuf);
      if (!ok) throw new Error(`SIGNATURE_INVALID keyId=${keyId}`);
      console.log(`OK signature keyId=${keyId}`);
    }
  } else {
    console.log("OK anchor not signed");
  }

  // Drift check vs current store
  const riskHead = String(anchor.riskHeadHash ?? "");
  const caseHead = String(anchor.caseHeadHash ?? "");
  const auditEventsHash = String(anchor.auditEventsHash ?? "");

  const curRisk = getLastHashOrGenesis(path.join(root, "riskEvents.jsonl"));
  const curCase = getLastHashOrGenesis(path.join(root, "caseEvents.jsonl"));
  const auditPath = path.join(root, "auditEvents.jsonl");
  const curAudit = fs.existsSync(auditPath) ? sha256File(auditPath) : "MISSING";

  const drift: string[] = [];
  if (curRisk.toLowerCase() !== riskHead.toLowerCase()) drift.push(`riskHead drift: anchor=${riskHead} current=${curRisk}`);
  if (curCase.toLowerCase() !== caseHead.toLowerCase()) drift.push(`caseHead drift: anchor=${caseHead} current=${curCase}`);
  if (curAudit.toLowerCase() !== auditEventsHash.toLowerCase()) drift.push(`auditEventsHash drift: anchor=${auditEventsHash} current=${curAudit}`);

  if (drift.length > 0) {
    throw new Error(drift.join("; "));
  }

  console.log("OK drift check");
}
