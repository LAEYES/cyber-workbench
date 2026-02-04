import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function run(args, cwd) {
  return execFileSync(process.execPath, ["dist/cli.js", ...args], { cwd, encoding: "utf8" });
}

test("nato:mvp-chain-verify detects tampering", () => {
  const repo = process.cwd();
  const tmp = path.join(repo, "tmp-ci-demo", "chain-verify");
  rmrf(tmp);
  fs.mkdirSync(tmp, { recursive: true });

  const org = "ORG_CHAIN";

  // ingest a small evidence
  const evPath = path.join(tmp, "evidence.txt");
  fs.writeFileSync(evPath, "hello\n", "utf8");

  run(
    [
      "nato:mvp-evidence-ingest",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--in",
      evPath,
      "--evidence-id",
      "EV-CHAIN",
      "--evidence-type",
      "report",
      "--source",
      "mvp-local",
      "--classification",
      "internal",
      "--retention",
      "short"
    ],
    repo
  );

  // verify OK
  const okOut = run(["nato:mvp-chain-verify", "--out", tmp, "--org", org, "--evidence-id", "EV-CHAIN"], repo);
  assert.match(okOut, /OK chain verified/);

  // tamper the last line
  const cocPath = path.join(tmp, "nato-mvp-store", org, "chain-of-custody", "EV-CHAIN.jsonl");
  const lines = fs.readFileSync(cocPath, "utf8").split(/\r?\n/).filter(Boolean);
  assert.ok(lines.length >= 1);

  const last = JSON.parse(lines[lines.length - 1]);
  last.details = { ...(last.details || {}), tampered: true };
  lines[lines.length - 1] = JSON.stringify(last);
  fs.writeFileSync(cocPath, lines.join("\n") + "\n", "utf8");

  assert.throws(() => {
    run(["nato:mvp-chain-verify", "--out", tmp, "--org", org, "--evidence-id", "EV-CHAIN"], repo);
  }, /Event hash mismatch|Hash chain broken|Invalid/);
});
