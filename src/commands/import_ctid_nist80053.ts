import path from "node:path";
import { writeYamlFile } from "../catalog/write.js";

const DEFAULT_URL =
  "https://raw.githubusercontent.com/center-for-threat-informed-defense/mappings-explorer/main/mappings/nist_800_53/attack-16.1/nist_800_53-rev5/enterprise/nist_800_53-rev5_attack-16.1-enterprise.json";

function norm(s: any) {
  return String(s ?? "").trim();
}

export async function importCtidAttackToNist80053(params: { url?: string; outFile: string }) {
  const url = params.url ?? DEFAULT_URL;
  const outFile = path.resolve(params.outFile);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  const j = await res.json();

  const objs = Array.isArray(j?.mapping_objects) ? j.mapping_objects : [];

  const merged = new Map<string, Set<string>>(); // attack technique -> 800-53 control

  for (const o of objs) {
    const attackId = norm(o?.attack_object_id);
    const capId = norm(o?.capability_id);

    if (!attackId || !/^T\d{4}(\.\d{3})?$/.test(attackId)) continue;
    if (!capId || !/^[A-Z]{2}-\d{1,3}(?:\(\d+\))?$/.test(capId)) continue;

    if (!merged.has(attackId)) merged.set(attackId, new Set());
    merged.get(attackId)!.add(capId.toUpperCase());
  }

  const items = [...merged.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "en"))
    .map(([techId, ctrls]) => ({
      from: { framework: "mitre-attack", id: techId },
      to: [...ctrls].sort((a, b) => a.localeCompare(b, "en")).map((id) => ({ framework: "nist-800-53-r5", id })),
      confidence: "high",
      rationale: "Imported from MITRE Engenuity CTID Mappings Explorer (ATT&CK → NIST 800-53 rev5)."
    }));

  const payload = {
    id: "mitre-attack_to_nist-800-53-r5",
    fromFramework: "mitre-attack",
    toFramework: "nist-800-53-r5",
    items
  };

  await writeYamlFile(outFile, payload);
  console.log(`Imported CTID ATT&CK→800-53 mappings: ${items.length} -> ${outFile}`);
}
