import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function sha256File(p: string) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(p));
  return h.digest("hex");
}

function assertInside(baseDir: string, targetPath: string) {
  const base = path.resolve(baseDir) + path.sep;
  const target = path.resolve(targetPath);
  if (!target.startsWith(base)) {
    throw new Error(`Path traversal blocked: ${targetPath}`);
  }
}

export async function natoMvpVerifyBundle(opts: { manifest: string }) {
  const manifestArg = opts.manifest;
  if (!manifestArg?.trim()) throw new Error("--manifest is required");

  const manifestPath = path.resolve(manifestArg);
  if (!fs.existsSync(manifestPath)) throw new Error(`manifest not found: ${manifestArg}`);

  const bundleDir = path.dirname(manifestPath);

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    packageId?: string;
    items?: Array<{ evidenceId: string; hash: string; storageRef: string }>;
  };

  if (!Array.isArray(manifest.items) || manifest.items.length === 0) {
    throw new Error("manifest.items missing or empty");
  }

  let ok = true;
  const results: Array<{ evidenceId: string; storageRef: string; expected: string; actual?: string; ok: boolean; reason?: string }> = [];

  for (const item of manifest.items) {
    const rel = item.storageRef;
    const filePath = path.join(bundleDir, rel);
    try {
      assertInside(bundleDir, filePath);
      if (!fs.existsSync(filePath)) {
        ok = false;
        results.push({ evidenceId: item.evidenceId, storageRef: rel, expected: item.hash, ok: false, reason: "missing" });
        continue;
      }
      const actual = sha256File(filePath);
      const match = actual === item.hash;
      if (!match) ok = false;
      results.push({ evidenceId: item.evidenceId, storageRef: rel, expected: item.hash, actual, ok: match });
    } catch (e: any) {
      ok = false;
      results.push({ evidenceId: item.evidenceId, storageRef: rel, expected: item.hash, ok: false, reason: e?.message || String(e) });
    }
  }

  for (const r of results) {
    if (r.ok) {
      console.log(`OK  ${r.evidenceId}  ${r.storageRef}`);
    } else {
      console.log(`FAIL ${r.evidenceId}  ${r.storageRef}  reason=${r.reason || "hash_mismatch"}`);
      if (r.actual) console.log(`  expected=${r.expected}\n  actual  =${r.actual}`);
    }
  }

  if (!ok) {
    throw new Error("BUNDLE_VERIFY_FAILED");
  }

  console.log("BUNDLE_VERIFY_OK", manifest.packageId || "(no packageId)");
}
