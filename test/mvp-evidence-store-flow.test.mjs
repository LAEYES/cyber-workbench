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

test("MVP evidence store ingest -> link -> export-from-store includes blobs", () => {
  const repo = process.cwd();
  const tmp = path.join(repo, "tmp-ci-demo", "evidence-store-flow");
  rmrf(tmp);
  fs.mkdirSync(tmp, { recursive: true });

  // dummy evidence file
  const evPath = path.join(tmp, "evidence.txt");
  fs.writeFileSync(evPath, "hello evidence\n", "utf8");

  const org = "ORG_E2E";

  // create a risk
  run(
    [
      "nato:mvp-risk-create",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--risk-id",
      "R-E2E",
      "--title",
      "E2E",
      "--owner",
      "alice",
      "--likelihood",
      "3",
      "--impact",
      "3",
      "--due",
      "2099-01-01"
    ],
    repo
  );

  // ingest evidence into store
  const ingestOut = run(
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
      "EV-E2E",
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
  assert.match(ingestOut, /OK evidence ingested/);

  // link evidence to risk
  const linkOut = run(
    [
      "nato:mvp-risk-link-evidence",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--risk-id",
      "R-E2E",
      "--evidence-id",
      "EV-E2E"
    ],
    repo
  );
  assert.match(linkOut, /OK risk linked evidence/);

  // export from store using risk scope
  const exportOut = run(
    [
      "nato:mvp-export-from-store",
      "--out",
      tmp,
      "--store",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--scope",
      "risk:R-E2E"
    ],
    repo
  );
  assert.match(exportOut, /OK bundle:/);

  const m = exportOut.match(/OK bundle:\s*(.+)/);
  assert.ok(m?.[1]);
  const bundleDir = m[1].trim();

  assert.ok(fs.existsSync(path.join(bundleDir, "manifest.json")));
  assert.ok(fs.existsSync(path.join(bundleDir, "evidence-package.json")));

  const evidenceDir = path.join(bundleDir, "evidence");
  const files = fs.readdirSync(evidenceDir);
  assert.ok(files.length >= 1);

  // At least one evidence blob should exist, name typically embeds evidenceId
  assert.ok(files.some((f) => f.includes("EV-E2E") || f.endsWith("evidence.txt")));
});
