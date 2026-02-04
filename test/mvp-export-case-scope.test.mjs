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

test("MVP export-from-store supports case:<id> (case + linked risk/decision + evidenceRefs)", () => {
  const repo = process.cwd();
  const tmp = path.join(repo, "tmp-ci-demo", "case-scope");
  rmrf(tmp);
  fs.mkdirSync(tmp, { recursive: true });

  const org = "ORG_CASE";

  // Create risk
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
      "R-CASE",
      "--title",
      "Case scope",
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

  // Create decision for risk
  run(
    [
      "nato:mvp-decision-create",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--risk-id",
      "R-CASE",
      "--type",
      "treat",
      "--rationale",
      "ok",
      "--approved-by",
      "bob"
    ],
    repo
  );

  // Create case
  run(
    [
      "nato:mvp-case-create",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--case-id",
      "C-CASE",
      "--severity",
      "medium",
      "--owner",
      "alice"
    ],
    repo
  );

  // Manually link risk to case by editing store JSON (MVP lacks a command for this link yet)
  const casesPath = path.join(tmp, "nato-mvp-store", org, "cases.json");
  const casesDb = JSON.parse(fs.readFileSync(casesPath, "utf8"));
  casesDb["C-CASE"].riskRefs = ["R-CASE"];
  casesDb["C-CASE"].version = (casesDb["C-CASE"].version || 1) + 1;
  fs.writeFileSync(casesPath, JSON.stringify(casesDb, null, 2) + "\n", "utf8");

  // Ingest evidence
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
      "EV-CASE",
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

  // Link evidence to risk and case
  run(
    [
      "nato:mvp-risk-link-evidence",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--risk-id",
      "R-CASE",
      "--evidence-id",
      "EV-CASE"
    ],
    repo
  );

  run(
    [
      "nato:mvp-case-link-evidence",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--case-id",
      "C-CASE",
      "--evidence-id",
      "EV-CASE"
    ],
    repo
  );

  // Export from store using case scope
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
      "case:C-CASE",
      "--classification",
      "internal",
      "--retention",
      "short",
      "--evidence-type",
      "report"
    ],
    repo
  );

  const m = exportOut.match(/OK bundle:\s*(.+)/);
  assert.ok(m?.[1]);
  const bundleDir = m[1].trim();

  assert.ok(fs.existsSync(path.join(bundleDir, "manifest.json")));
  assert.ok(fs.existsSync(path.join(bundleDir, "evidence-package.json")));

  // Must include evidence blob
  const evidenceDir = path.join(bundleDir, "evidence");
  const files = fs.readdirSync(evidenceDir);
  assert.ok(files.some((f) => f.includes("EV-CASE") || f.endsWith("evidence.txt")));

  // Must include metadata snapshots (case + risks + decisions) somewhere in the filenames
  assert.ok(files.some((f) => f.includes("case_C-CASE.json")));
  assert.ok(files.some((f) => f.includes("risks_for_case_C-CASE.json")));
  assert.ok(files.some((f) => f.includes("decisions_for_case_C-CASE.json")));
});
