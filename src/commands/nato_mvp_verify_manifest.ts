import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function sha256Text(t: string) {
  return crypto.createHash("sha256").update(t, "utf8").digest("hex");
}

export async function natoMvpVerifyManifest(opts: {
  bundleDir: string;
  verifyKey?: string; // path to public key PEM
}) {
  const bundleDir = path.resolve(opts.bundleDir);
  const manifestPath = path.join(bundleDir, "manifest.json");
  const pkgPath = path.join(bundleDir, "evidence-package.json");

  if (!fs.existsSync(manifestPath)) throw new Error(`manifest.json not found in ${bundleDir}`);
  if (!fs.existsSync(pkgPath)) throw new Error(`evidence-package.json not found in ${bundleDir}`);

  const manifestJson = fs.readFileSync(manifestPath, "utf8");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as { manifestHash?: string; packageId?: string };

  const actualHash = sha256Text(manifestJson);
  if (!pkg.manifestHash) throw new Error("evidence-package.json missing manifestHash");

  if (actualHash !== pkg.manifestHash) {
    throw new Error(`MANIFEST_HASH_MISMATCH expected=${pkg.manifestHash} actual=${actualHash}`);
  }
  console.log("OK manifestHash matches evidence-package.json");

  // Optional signature verification
  const manifestObj = JSON.parse(manifestJson) as any;
  if (manifestObj.signature) {
    if (!opts.verifyKey) {
      console.log("WARN manifest is signed but no --verify-key provided; signature not verified");
      return;
    }
    const pubPem = fs.readFileSync(path.resolve(opts.verifyKey), "utf8");
    const pubKey = crypto.createPublicKey(pubPem);

    const sigB64 = manifestObj.signature.value;
    const alg = manifestObj.signature.alg;
    if (alg !== "ed25519") throw new Error(`Unsupported signature alg: ${alg}`);

    // Verify canonical payload (without signature)
    const { signature: _signature, ...payloadObj } = manifestObj;
    const payload = JSON.stringify(payloadObj);
    const ok = crypto.verify(null, Buffer.from(payload, "utf8"), pubKey, Buffer.from(sigB64, "base64"));
    if (!ok) throw new Error("SIGNATURE_INVALID");

    console.log("OK signature verified", `keyId=${manifestObj.signature.keyId}`);
  } else {
    console.log("OK manifest is not signed");
  }

  console.log("MANIFEST_VERIFY_OK", pkg.packageId || "(no packageId)");
}
