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

test("MVP case-link-risk adds riskRefs and enables case export without manual edits", () => {
  const repo = process.cwd();
  const tmp = path.join(repo, "tmp-ci-demo", "case-link-risk");
  rmrf(tmp);
  fs.mkdirSync(tmp, { recursive: true });

  const org = "ORG_LINK";

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
      "R-LINK",
      "--title",
      "Link",
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
      "C-LINK",
      "--severity",
      "medium",
      "--owner",
      "alice"
    ],
    repo
  );

  run(
    [
      "nato:mvp-case-link-risk",
      "--out",
      tmp,
      "--org",
      org,
      "--actor",
      "ci",
      "--case-id",
      "C-LINK",
      "--risk-id",
      "R-LINK"
    ],
    repo
  );

  const casesPath = path.join(tmp, "nato-mvp-store", org, "cases.json");
  const casesDb = JSON.parse(fs.readFileSync(casesPath, "utf8"));
  assert.deepEqual(casesDb["C-LINK"].riskRefs, ["R-LINK"]);

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
      "case:C-LINK",
      "--classification",
      "internal",
      "--retention",
      "standard",
      "--evidence-type",
      "report"
    ],
    repo
  );
  assert.match(exportOut, /OK bundle:/);
});
