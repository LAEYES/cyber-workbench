import path from "node:path";
import { loadYamlFile } from "../catalog/io.js";
import { writeYamlFile } from "../catalog/write.js";
import { MappingSchema } from "../catalog/schemas.js";

function invertCsfTo80053(map: any): Map<string, Set<string>> {
  const inv = new Map<string, Set<string>>();
  for (const item of map.items ?? []) {
    const csfId = item.from?.id;
    if (!csfId) continue;
    for (const to of item.to ?? []) {
      if (to.framework !== "nist-800-53-r5") continue;
      const ctrl = to.id;
      if (!inv.has(ctrl)) inv.set(ctrl, new Set());
      inv.get(ctrl)!.add(csfId);
    }
  }
  return inv;
}

function mergeMapItems(items: any[]): Map<string, Set<string>> {
  const merged = new Map<string, Set<string>>();
  for (const it of items) {
    const fromId = it.from?.id;
    if (!fromId) continue;
    if (!merged.has(fromId)) merged.set(fromId, new Set());
    const set = merged.get(fromId)!;
    for (const t of it.to ?? []) {
      if (t?.id) set.add(String(t.id));
    }
  }
  return merged;
}

export async function mapAttackToCsfVia80053(params: {
  techniqueToMitigationFile: string;
  mitigationTo80053File: string;
  csfTo80053File: string;
  outAttackTo80053File: string;
  outAttackToCsfFile: string;
}) {
  const tech2mit = await loadYamlFile(path.resolve(params.techniqueToMitigationFile), MappingSchema);
  const mit2ctrl = await loadYamlFile(path.resolve(params.mitigationTo80053File), MappingSchema);
  const csf2ctrl = await loadYamlFile(path.resolve(params.csfTo80053File), MappingSchema);

  const techToMits = mergeMapItems(tech2mit.items ?? []); // Txxxx -> Mxxxx*
  const mitToCtrls = mergeMapItems(mit2ctrl.items ?? []); // Mxxxx -> AC-2*
  const ctrlToCsf = invertCsfTo80053(csf2ctrl); // AC-2 -> GV.*

  // Technique -> 800-53
  const attackTo80053Items: any[] = [];
  const attackToCsfItems: any[] = [];

  for (const [techId, mids] of techToMits.entries()) {
    const ctrlSet = new Set<string>();
    for (const mid of mids) {
      const ctrls = mitToCtrls.get(mid);
      if (!ctrls) continue;
      for (const c of ctrls) ctrlSet.add(c);
    }

    if (ctrlSet.size) {
      attackTo80053Items.push({
        from: { framework: "mitre-attack", id: techId },
        to: [...ctrlSet]
          .sort((a, b) => a.localeCompare(b, "en"))
          .map((id) => ({ framework: "nist-800-53-r5", id })),
        confidence: "medium",
        rationale: "Derived from official ATT&CK mitigations and their references to NIST SP 800-53 controls."
      });
    }

    // Technique -> CSF via 800-53 -> CSF inversion
    const csfSet = new Set<string>();
    for (const ctrl of ctrlSet) {
      const csfIds = ctrlToCsf.get(ctrl);
      if (!csfIds) continue;
      for (const cid of csfIds) csfSet.add(cid);
    }

    if (csfSet.size) {
      attackToCsfItems.push({
        from: { framework: "mitre-attack", id: techId },
        to: [...csfSet]
          .sort((a, b) => a.localeCompare(b, "en"))
          .map((id) => ({ framework: "nist-csf-2.0", id })),
        confidence: "medium",
        rationale:
          "Derived chain: Technique → Mitigations (ATT&CK STIX) → 800-53 (refs) → CSF outcomes (NIST informative references). Validate manually."
      });
    }
  }

  await writeYamlFile(path.resolve(params.outAttackTo80053File), {
    id: "mitre-attack_to_nist-800-53-r5",
    fromFramework: "mitre-attack",
    toFramework: "nist-800-53-r5",
    items: attackTo80053Items
  });

  await writeYamlFile(path.resolve(params.outAttackToCsfFile), {
    id: "mitre-attack_to_nist-csf-2.0_via_800-53",
    fromFramework: "mitre-attack",
    toFramework: "nist-csf-2.0",
    items: attackToCsfItems
  });

  console.log(`Generated ATT&CK→800-53 items: ${attackTo80053Items.length} -> ${params.outAttackTo80053File}`);
  console.log(`Generated ATT&CK→CSF(via800-53) items: ${attackToCsfItems.length} -> ${params.outAttackToCsfFile}`);
}
