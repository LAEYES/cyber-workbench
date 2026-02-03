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

export async function mapAttackToCsfFrom80053(params: {
  attackTo80053File: string;
  csfTo80053File: string;
  outFile: string;
}) {
  const attack2ctrl = await loadYamlFile(path.resolve(params.attackTo80053File), MappingSchema);
  const csf2ctrl = await loadYamlFile(path.resolve(params.csfTo80053File), MappingSchema);

  const ctrlToCsf = invertCsfTo80053(csf2ctrl);

  const items: any[] = [];

  for (const it of attack2ctrl.items ?? []) {
    const techId = it.from?.id;
    if (!techId) continue;

    const csfSet = new Set<string>();
    for (const to of it.to ?? []) {
      if (to.framework !== "nist-800-53-r5") continue;
      const csfIds = ctrlToCsf.get(to.id);
      if (!csfIds) continue;
      for (const cid of csfIds) csfSet.add(cid);
    }

    if (!csfSet.size) continue;

    items.push({
      from: { framework: "mitre-attack", id: techId },
      to: [...csfSet].sort((a, b) => a.localeCompare(b, "en")).map((id) => ({ framework: "nist-csf-2.0", id })),
      confidence: "medium",
      rationale:
        "Derived from CTID ATT&CK→800-53 mappings (high) chained with NIST CSF→800-53 informative references (high). Validate manually."
    });
  }

  await writeYamlFile(path.resolve(params.outFile), {
    id: "mitre-attack_to_nist-csf-2.0_via_800-53",
    fromFramework: "mitre-attack",
    toFramework: "nist-csf-2.0",
    items
  });

  console.log(`Generated ATT&CK→CSF(via800-53) items: ${items.length} -> ${params.outFile}`);
}
