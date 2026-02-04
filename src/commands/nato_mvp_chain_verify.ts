import fs from "node:fs";
import crypto from "node:crypto";
import { chainOfCustodyPath, type ChainOfCustodyEvent } from "./nato_mvp_evidence.js";

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function isHex64(s: unknown): s is string {
  return typeof s === "string" && /^[0-9a-f]{64}$/i.test(s);
}

export async function natoMvpChainVerify(opts: { outDir: string; orgId: string; evidenceId: string }) {
  const cocPath = chainOfCustodyPath(opts.outDir, opts.orgId, opts.evidenceId);
  if (!fs.existsSync(cocPath)) throw new Error(`Chain-of-custody file not found: ${cocPath}`);

  const lines = fs.readFileSync(cocPath, "utf8").split(/\r?\n/).filter(Boolean);
  if (!lines.length) throw new Error(`Chain-of-custody file is empty: ${cocPath}`);

  let expectedPrev = "0".repeat(64);

  for (let i = 0; i < lines.length; i++) {
    const parsed = JSON.parse(lines[i]) as ChainOfCustodyEvent;

    if (parsed.hashAlg !== "sha256") throw new Error(`Invalid hashAlg at index=${i}: ${parsed.hashAlg}`);
    if (!isHex64(parsed.prevHash)) throw new Error(`Invalid prevHash at index=${i}`);
    if (!isHex64(parsed.eventHash)) throw new Error(`Invalid eventHash at index=${i}`);

    if (parsed.prevHash !== expectedPrev) {
      throw new Error(`Hash chain broken at index=${i}: prevHash=${parsed.prevHash} expected=${expectedPrev}`);
    }

    // Recompute eventHash over payload without eventHash (must match natoMvpChainAppend)
    // We also keep the same property order by taking the parsed object and deleting eventHash.
    const clone: any = { ...parsed };
    delete clone.eventHash;
    const recomputed = sha256Hex(JSON.stringify(clone));

    if (recomputed !== parsed.eventHash) {
      throw new Error(`Event hash mismatch at index=${i}: eventHash=${parsed.eventHash} recomputed=${recomputed}`);
    }

    expectedPrev = parsed.eventHash;
  }

  console.log("OK chain verified", opts.evidenceId, `events=${lines.length}`, `head=${expectedPrev}`);
}
