import path from "node:path";
import { loadYamlFile } from "../catalog/io.js";
import { writeYamlFile } from "../catalog/write.js";
import { importNist80053 } from "./import_80053.js";
import { importMitreAttack } from "./import_attack.js";
import { importCtidAttackToNist80053 } from "./import_ctid_nist80053.js";
import { importNistCsfFromXlsx } from "./import_nist_xlsx.js";

export async function catalogRefresh(params: { rootDir: string; sourcesFile?: string }) {
  const root = path.resolve(params.rootDir);
  const sourcesPath = path.resolve(params.sourcesFile ?? path.join(root, "sources.yml"));
  const sources = (await loadYamlFile(sourcesPath, (await import("../catalog/schemas.js")).z.any())) as any;

  // 1) CSF outcomes + CSF->80053 mapping (NIST informative refs)
  await importNistCsfFromXlsx({
    url: sources?.nist?.csf_xlsx?.url,
    outOutcomesFile: path.join(root, "controls", "nist-csf-2.0.outcomes.yml"),
    outCsfTo80053MappingFile: path.join(root, "mappings", "nist-csf-2.0_to_nist-800-53-r5.yml")
  });

  // 2) NIST 800-53 catalog
  await importNist80053({
    url: sources?.nist?.sp800_53_r5_oscal_json?.url,
    outFile: path.join(root, "controls", "nist-800-53-r5.controls.yml")
  });

  // 3) ATT&CK techniques + mitigations + relationships
  await importMitreAttack({
    outTechniquesFile: path.join(root, "controls", "mitre-attack.techniques.yml"),
    outMitigationsFile: path.join(root, "controls", "mitre-attack.mitigations.yml"),
    outTechniqueToMitigationFile: path.join(root, "mappings", "mitre-attack.techniques_to_mitigations.yml"),
    include: ["enterprise", "ics"]
  });

  // 4) CTID ATT&CK->800-53
  await importCtidAttackToNist80053({
    url: sources?.ctid?.attack_to_80053_r5?.url,
    outFile: path.join(root, "mappings", "mitre-attack_to_nist-800-53-r5.yml")
  });

  // Minimal marker
  await writeYamlFile(path.join(root, "exports", "refresh.marker.yml"), { refreshedAt: new Date().toISOString() });
  console.log("OK: catalog refresh complete");
}
