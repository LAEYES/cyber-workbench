import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

type EvidenceType =
  | "logExport"
  | "configSnapshot"
  | "ticket"
  | "report"
  | "sbom"
  | "vex"
  | "attestation"
  | "signature"
  | "screenshot";

type Classification = "public" | "internal" | "sensitive";

type RetentionClass = "short" | "standard" | "long" | "legal";

function sha256File(p: string) {
  const h = crypto.createHash("sha256");
  const buf = fs.readFileSync(p);
  h.update(buf);
  return h.digest("hex");
}

function nowIso() {
  return new Date().toISOString();
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function safeBasename(p: string) {
  // prevent path traversal: only keep filename
  return path.basename(p).replace(/[^A-Za-z0-9._-]/g, "_");
}

export type NatoMvpExportInput =
  | string
  | {
      path: string;
      evidenceId: string;
      evidenceType?: EvidenceType;
      sourceSystem?: string;
      collectedAt?: string;
      collectorId?: string;
      classification?: Classification;
      retentionClass?: RetentionClass;
    };

export async function natoMvpExport(opts: {
  scopeRef: string;
  inputs: NatoMvpExportInput[];
  outDir: string;
  orgId?: string;
  classification: Classification;
  retentionClass: RetentionClass;
  evidenceType: EvidenceType;
  sign?: boolean;
  signingKey?: string; // path to private key PEM
  keyId?: string;
}) {
  if (!opts.scopeRef?.trim()) throw new Error("scopeRef is required");
  if (!opts.inputs?.length) throw new Error("at least one --in file is required");

  const outRoot = path.resolve(opts.outDir);
  const bundleDir = path.join(outRoot, "nato-mvp", safeBasename(opts.scopeRef));
  const evidenceDir = path.join(bundleDir, "evidence");
  ensureDir(evidenceDir);

  const evidenceItems = opts.inputs.map((input, idx) => {
    const inFile: string = typeof input === "string" ? input : input.path;
    const abs = path.resolve(inFile);
    if (!fs.existsSync(abs)) throw new Error(`input not found: ${inFile}`);

    const evidenceId = typeof input === "string" ? `ev_${idx + 1}` : input.evidenceId;
    const filename = safeBasename(abs);
    const storageRef = `evidence/${safeBasename(evidenceId)}_${filename}`;

    const hash = sha256File(abs);

    // Copy blob into bundle
    fs.copyFileSync(abs, path.join(bundleDir, storageRef));

    const evidenceType = typeof input === "string" ? opts.evidenceType : input.evidenceType || opts.evidenceType;
    const sourceSystem = typeof input === "string" ? "mvp-local" : input.sourceSystem || "mvp-local";
    const collectedAt = typeof input === "string" ? nowIso() : input.collectedAt || nowIso();
    const collectorId = typeof input === "string" ? "mvp-local" : input.collectorId || "mvp-local";
    const classification = typeof input === "string" ? opts.classification : input.classification || opts.classification;
    const retentionClass =
      typeof input === "string" ? opts.retentionClass : input.retentionClass || opts.retentionClass;

    return {
      // EntityBase-compatible envelope (aligns with specs/nato-trinity Evidence)
      id: `evidence_${crypto.randomUUID()}`,
      type: "evidence" as const,
      version: 1,
      createdAt: nowIso(),
      createdBy: "cyberwb nato:mvp-export",

      evidenceId,
      evidenceType,
      sourceSystem,
      collectedAt,
      collectorId,

      hash,
      hashAlg: "sha256" as const,
      storageRef,
      classification,
      retentionClass,
      metadata: {}
    };
  });

  const packageId = `pkg_${safeBasename(opts.scopeRef)}_${Date.now()}`;

  const manifestBase = {
    manifestVersion: "1.0",
    packageId,
    generatedAt: nowIso(),
    generatedBy: "cyberwb nato:mvp-export",
    hashAlg: "sha256",
    items: evidenceItems.map((e) => ({
      evidenceId: e.evidenceId,
      hash: e.hash,
      storageRef: e.storageRef,
      evidenceType: e.evidenceType,
      sourceSystem: e.sourceSystem,
      collectedAt: e.collectedAt
    }))
  };

  // Optionally sign the manifest payload (local MVP signing; production uses KMS/HSM per ADR-0009)
  let signature: { keyId: string; alg: string; value: string } | undefined;
  if (opts.sign) {
    if (!opts.signingKey) throw new Error("--signing-key is required when --sign is set");
    const privPem = fs.readFileSync(path.resolve(opts.signingKey), "utf8");
    const privKey = crypto.createPrivateKey(privPem);

    // Sign the canonical JSON (without signature field)
    const payload = JSON.stringify(manifestBase);
    const sig = crypto.sign(null, Buffer.from(payload, "utf8"), privKey);
    signature = {
      keyId: opts.keyId || "mvp-local-1",
      alg: "ed25519",
      value: sig.toString("base64")
    };
  }

  const manifest = signature ? { ...manifestBase, signature } : manifestBase;

  const manifestJson = JSON.stringify(manifest, null, 2) + "\n";
  fs.writeFileSync(path.join(bundleDir, "manifest.json"), manifestJson, "utf8");

  const manifestHash = crypto.createHash("sha256").update(manifestJson).digest("hex");

  const evidencePackage = {
    packageId,
    scopeRef: opts.scopeRef,
    evidenceRefs: evidenceItems.map((e) => e.evidenceId),
    manifestHash,
    exportedAt: nowIso(),
    exportedBy: "mvp-local",
    bundleRef: bundleDir,
    orgId: opts.orgId ?? "ORG"
  };

  fs.writeFileSync(
    path.join(bundleDir, "evidence-package.json"),
    JSON.stringify(evidencePackage, null, 2) + "\n",
    "utf8"
  );

  // Human-readable verification instructions
  fs.writeFileSync(
    path.join(bundleDir, "README.txt"),
    [
      "NATO Trinity MVP EvidencePackage bundle",
      "",
      `scopeRef: ${opts.scopeRef}`,
      `packageId: ${packageId}`,
      "",
      "Verify:",
      "1) Validate manifest schema:",
      "   npm run nato:bundle-check -- manifest.json",
      "2) Verify each evidence file hash matches manifest.json",
      ""
    ].join("\n"),
    "utf8"
  );

  console.log("OK bundle:", bundleDir);
  console.log("OK manifest:", path.join(bundleDir, "manifest.json"));
  console.log("OK evidencePackage:", path.join(bundleDir, "evidence-package.json"));
}
