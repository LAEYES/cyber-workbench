import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

export async function natoMvpGenerateSigningKey(opts: { outDir: string; name?: string }) {
  const outDir = path.resolve(opts.outDir);
  ensureDir(outDir);

  const name = (opts.name || "nato-mvp-ed25519").replace(/[^A-Za-z0-9._-]/g, "_");

  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const pubPem = publicKey.export({ type: "spki", format: "pem" }).toString();
  const privPem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

  const pubPath = path.join(outDir, `${name}.public.pem`);
  const privPath = path.join(outDir, `${name}.private.pem`);

  fs.writeFileSync(pubPath, pubPem, "utf8");
  fs.writeFileSync(privPath, privPem, "utf8");

  console.log("OK public:", pubPath);
  console.log("OK private:", privPath);
}
