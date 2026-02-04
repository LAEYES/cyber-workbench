import path from "node:path";
import { writeYamlFile } from "../catalog/write.js";
import { loadSourcesFile, resolveSource } from "../catalog/sources.js";
import { importNist80053 } from "./import_80053.js";
import { importMitreAttack } from "./import_attack.js";
import { importCtidAttackToNist80053 } from "./import_ctid_nist80053.js";
import { importNistCsfFromXlsx } from "./import_nist_xlsx.js";

export async function catalogRefresh(params: { rootDir: string; sourcesFile?: string; allowDynamic?: boolean }) {
  const root = path.resolve(params.rootDir);
  const sourcesPath = path.resolve(params.sourcesFile ?? path.join(root, "sources.yml"));
  const sources = await loadSourcesFile(sourcesPath);
  const allowDynamic = params.allowDynamic === true;

  const csf = resolveSource(sources, "nist.csf_xlsx", { allowDynamic });
  const nist80053 = resolveSource(sources, "nist.sp800_53_r5_oscal_json", { allowDynamic });
  const ctid = resolveSource(sources, "ctid.attack_to_80053_r5", { allowDynamic });
  const mitreEnterprise = resolveSource(sources, "mitre.attack_stix.enterprise_url", { allowDynamic });
  const mitreIcs = resolveSource(sources, "mitre.attack_stix.ics_url", { allowDynamic });

  // 1) CSF outcomes + CSF->80053 mapping (NIST informative refs)
  await importNistCsfFromXlsx({
    url: csf.url,
    expectedSha256: csf.sha256,
    outOutcomesFile: path.join(root, "controls", "nist-csf-2.0.outcomes.yml"),
    outCsfTo80053MappingFile: path.join(root, "mappings", "nist-csf-2.0_to_nist-800-53-r5.yml")
  });

  // 2) NIST 800-53 catalog
  await importNist80053({
    url: nist80053.url,
    expectedSha256: nist80053.sha256,
    outFile: path.join(root, "controls", "nist-800-53-r5.controls.yml")
  });

  // 3) ATT&CK techniques + mitigations + relationships
  await importMitreAttack({
    outTechniquesFile: path.join(root, "controls", "mitre-attack.techniques.yml"),
    outMitigationsFile: path.join(root, "controls", "mitre-attack.mitigations.yml"),
    outTechniqueToMitigationFile: path.join(root, "mappings", "mitre-attack.techniques_to_mitigations.yml"),
    sources: [
      { id: "enterprise", url: mitreEnterprise.url, expectedSha256: mitreEnterprise.sha256 },
      { id: "ics", url: mitreIcs.url, expectedSha256: mitreIcs.sha256 }
    ]
  });

  // 4) CTID ATT&CK->800-53
  await importCtidAttackToNist80053({
    url: ctid.url,
    expectedSha256: ctid.sha256,
    outFile: path.join(root, "mappings", "mitre-attack_to_nist-800-53-r5.yml")
  });

  // Minimal marker
  await writeYamlFile(path.join(root, "exports", "refresh.marker.yml"), { refreshedAt: new Date().toISOString() });
  console.log("OK: catalog refresh complete");
}
